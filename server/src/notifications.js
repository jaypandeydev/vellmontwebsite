import { log, errSummary } from './log.js';

// The database row is the source of truth; email is a best-effort mirror that
// is retried. All state lives in careers_applications (notified_at,
// notify_attempts, notify_error, notify_last_attempt_at), so retries survive
// restarts and SMTP being configured after applications were collected.
//
// Concurrency: every send first CLAIMS the row with a single conditional
// UPDATE. Only one sender (the request handler, the sweeper, or a reviewer's
// "Send now") can hold the claim at a time; a claim expires after
// NOTIFY_CLAIM_SECONDS so a process that died mid-send does not block retries.

export function referenceFor(id) {
  return `VC-${String(id).replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

async function claim(pool, cfg, id, { force = false } = {}) {
  const r = await pool.query(
    `UPDATE careers_applications
        SET notify_attempts = notify_attempts + 1, notify_last_attempt_at = now()
      WHERE id = $1
        AND ($3 OR (notified_at IS NULL
             AND (notify_last_attempt_at IS NULL OR notify_last_attempt_at < now() - ($2 || ' seconds')::interval)))
      RETURNING *`,
    [id, String(cfg.notifyRetry.claimSeconds), force]
  );
  return r.rows[0] || null;
}

/**
 * Try to send the hiring-team email for one application.
 * Returns { sent, reason, skipped? }. Never throws for mail problems; a
 * bookkeeping failure is logged and swallowed so it can't affect the row.
 */
export async function attemptNotification({ pool, mailer, cfg, app, cvBuffer = null, force = false }) {
  if (!mailer.enabled) return { sent: false, reason: 'mail-not-configured' };

  let row;
  try {
    row = await claim(pool, cfg, app.id, { force });
  } catch (err) {
    log.error('notify.claim_failed', { applicationId: app.id, err: errSummary(err) });
    return { sent: false, reason: 'claim-failed' };
  }
  if (!row) return { sent: false, skipped: true, reason: 'already-sent-or-in-progress' };

  let result;
  try {
    result = await mailer.notifyNewApplication({ ...row, reference: referenceFor(row.id) }, cvBuffer);
  } catch (err) {
    log.error('notify.send_threw', { applicationId: app.id, err: errSummary(err) });
    result = { sent: false, reason: err.code || err.name || 'send-failed' };
  }

  try {
    if (result.sent) {
      await pool.query('UPDATE careers_applications SET notified_at = now(), notify_error = NULL WHERE id = $1', [app.id]);
    } else {
      await pool.query('UPDATE careers_applications SET notify_error = $2 WHERE id = $1', [app.id, String(result.reason || 'send-failed').slice(0, 80)]);
    }
  } catch (err) {
    log.error('notify.bookkeeping_failed', { applicationId: app.id, err: errSummary(err) });
  }
  log.info('notify.attempt', { applicationId: app.id, attempt: row.notify_attempts, sent: result.sent, reason: result.sent ? undefined : result.reason });
  return result;
}

/**
 * Periodic recovery of unsent notifications:
 *  - rows that failed before (attempts > 0), retried once per sweep interval;
 *  - rows never attempted (attempts = 0) — e.g. the process restarted between
 *    the DB commit and the send, or SMTP was configured after applications
 *    were collected — picked up once they are older than the grace period so
 *    the sweeper does not race the request handler's own send.
 * Runs once shortly after boot, then every NOTIFY_SWEEP_MINUTES. Overlapping
 * sweeps in one process are prevented; across processes the per-row claim is
 * the guard.
 */
export function startNotificationSweeper({ pool, mailer, cfg, cvStore, initialDelayMs = 15000 }) {
  if (!mailer.enabled) return null;
  const intervalMs = Math.max(1, cfg.notifyRetry.sweepIntervalMinutes) * 60 * 1000;
  let running = false;

  async function sweep() {
    if (running) return { skipped: true };
    running = true;
    const stats = { candidates: 0, sent: 0, failed: 0, skipped: 0 };
    try {
      const r = await pool.query(
        `SELECT id FROM careers_applications
          WHERE notified_at IS NULL
            AND notify_attempts < $1
            AND created_at > now() - interval '7 days'
            AND (notify_attempts > 0 OR created_at < now() - ($3 || ' seconds')::interval)
            AND (notify_last_attempt_at IS NULL OR notify_last_attempt_at < now() - ($2 || ' minutes')::interval)
          ORDER BY created_at ASC LIMIT 50`,
        [cfg.notifyRetry.maxAttempts, String(cfg.notifyRetry.sweepIntervalMinutes), String(cfg.notifyRetry.graceSeconds)]
      );
      stats.candidates = r.rows.length;
      for (const { id } of r.rows) {
        const full = (await pool.query('SELECT * FROM careers_applications WHERE id = $1', [id])).rows[0];
        if (!full) continue;
        const cv = cfg.notifyAttachCv ? await cvStore.get(full).catch(() => null) : null;
        const res = await attemptNotification({ pool, mailer, cfg, app: full, cvBuffer: cv });
        if (res.skipped) stats.skipped += 1;
        else if (res.sent) stats.sent += 1;
        else stats.failed += 1;
      }
      if (stats.candidates) log.info('notify.sweep', stats);
    } catch (err) {
      log.error('notify.sweep_failed', { err: errSummary(err) });
    } finally {
      running = false;
    }
    return stats;
  }

  const first = setTimeout(sweep, initialDelayMs);
  first.unref();
  const timer = setInterval(sweep, intervalMs);
  timer.unref();
  return { stop: () => { clearTimeout(first); clearInterval(timer); }, sweep };
}
