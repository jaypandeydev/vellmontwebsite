import { log, errSummary } from './log.js';

// The database row is the source of truth; email is a best-effort mirror that
// is retried. All state lives in careers_applications (notified_at,
// notify_attempts, notify_error), so retries survive restarts.

export async function attemptNotification({ pool, mailer, cfg, app, cvBuffer = null }) {
  if (!mailer.enabled) return { sent: false, reason: 'mail-not-configured' };
  const result = await mailer.notifyNewApplication(app, cvBuffer);
  try {
    if (result.sent) {
      await pool.query(
        'UPDATE careers_applications SET notified_at = now(), notify_error = NULL, notify_attempts = notify_attempts + 1, notify_last_attempt_at = now() WHERE id = $1',
        [app.id]
      );
    } else {
      await pool.query(
        'UPDATE careers_applications SET notify_error = $2, notify_attempts = notify_attempts + 1, notify_last_attempt_at = now() WHERE id = $1',
        [app.id, String(result.reason || 'send-failed').slice(0, 80)]
      );
    }
  } catch (err) {
    // Bookkeeping failure must never affect the stored application.
    log.error('notify.bookkeeping_failed', { applicationId: app.id, err: errSummary(err) });
  }
  log.info('notify.attempt', { applicationId: app.id, sent: result.sent, reason: result.sent ? undefined : result.reason });
  return result;
}

// Periodically re-send notifications that failed. Only rows younger than 7
// days and under the attempt cap are retried; the CV is never attached on a
// retry unless NOTIFY_ATTACH_CV is on (then it is re-read from storage).
export function startNotificationSweeper({ pool, mailer, cfg, cvStore }) {
  if (!mailer.enabled) return null;
  const intervalMs = Math.max(1, cfg.notifyRetry.sweepIntervalMinutes) * 60 * 1000;
  let running = false;

  async function sweep() {
    if (running) return;
    running = true;
    try {
      const r = await pool.query(
        `SELECT * FROM careers_applications
          WHERE notified_at IS NULL AND notify_attempts > 0 AND notify_attempts < $1
            AND created_at > now() - interval '7 days'
            AND (notify_last_attempt_at IS NULL OR notify_last_attempt_at < now() - ($2 || ' minutes')::interval)
          ORDER BY created_at ASC LIMIT 20`,
        [cfg.notifyRetry.maxAttempts, String(cfg.notifyRetry.sweepIntervalMinutes)]
      );
      for (const row of r.rows) {
        const cv = cfg.notifyAttachCv ? await cvStore.get(row).catch(() => null) : null;
        await attemptNotification({ pool, mailer, cfg, app: { ...row, reference: referenceFor(row.id) }, cvBuffer: cv });
      }
      if (r.rows.length) log.info('notify.sweep', { retried: r.rows.length });
    } catch (err) {
      log.error('notify.sweep_failed', { err: errSummary(err) });
    } finally {
      running = false;
    }
  }

  const timer = setInterval(sweep, intervalMs);
  timer.unref();
  return { stop: () => clearInterval(timer), sweep };
}

export function referenceFor(id) {
  return `VC-${String(id).replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}
