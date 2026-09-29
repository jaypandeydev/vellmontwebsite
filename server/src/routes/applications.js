import { Router } from 'express';
import { createHash } from 'node:crypto';
import { cvUpload, CV_FIELD, checkCv, safeFilename } from '../upload.js';
import { validateApplication } from '../validate.js';
import { createLimiter } from '../rateLimit.js';
import { hashIp, honeypotTripped, filledTooFast, verifyTurnstile } from '../spam.js';
import { wrap } from '../asyncRoute.js';
import { attemptNotification, referenceFor } from '../notifications.js';
import { log, errSummary } from '../log.js';

export { referenceFor };

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
// Generic, retryable wording. Never reveals which check tripped.
const REJECTED_MESSAGE = 'We could not accept that submission. Please review your details and try again.';

function retryText(sec) {
  if (sec >= 3600) return `about ${Math.ceil(sec / 3600)} hour${sec >= 7200 ? 's' : ''}`;
  if (sec >= 60) return `about ${Math.ceil(sec / 60)} minute${sec >= 120 ? 's' : ''}`;
  return `${sec} seconds`;
}

export function applicationsRouter({ cfg, pool, cvStore, mailer }) {
  const router = Router();
  const per15 = createLimiter({ windowMs: 15 * 60 * 1000, max: cfg.rateLimit.attemptsPer15Min });
  const perDay = createLimiter({ windowMs: 24 * 60 * 60 * 1000, max: cfg.rateLimit.attemptsPerDay });

  router.get('/health', (req, res) => {
    res.json({
      ok: true,
      service: 'careers-api',
      storage: cvStore.kind,
      notifications: mailer.enabled ? 'email' : 'off',
      turnstile: Boolean(cfg.turnstileSecret),
    });
  });

  // 1. Attempt limiter — runs BEFORE the multipart body is read, counts every
  //    attempt (valid or not), and check+increment is a single synchronous
  //    step so concurrent requests cannot slip past it.
  const limitAttempts = (req, res, next) => {
    const ipKey = hashIp(req.ip, cfg.ipHashSalt);
    req.ipKey = ipKey;
    const a = per15.hit(ipKey);
    const b = a.allowed ? perDay.hit(ipKey) : { allowed: true, retryAfterSec: 0 };
    if (!a.allowed || !b.allowed) {
      const retry = Math.max(a.retryAfterSec, b.retryAfterSec);
      res.setHeader('Retry-After', String(retry));
      log.warn('application.rate_limited', { ip: ipKey, retryAfterSec: retry });
      return res.status(429).json({
        ok: false,
        code: 'rate_limited',
        retryAfterSec: retry,
        message: `Too many attempts from your network. Please wait ${retryText(retry)} and try again — your details will stay on this page.`,
      });
    }
    next();
  };

  // 2. Multipart parsing with translated multer errors.
  const parseUpload = (req, res, next) => {
    cvUpload.single(CV_FIELD)(req, res, (err) => {
      if (!err) return next();
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ ok: false, message: 'Your CV is larger than 5 MB. Please upload a smaller file.', errors: { cv: 'File is larger than 5 MB.' } });
      }
      if (err.code === 'CV_TYPE' || err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ ok: false, message: 'Please upload your CV as a PDF, DOC or DOCX file.', errors: { cv: 'Only PDF, DOC or DOCX files are accepted.' } });
      }
      if (err.code && String(err.code).startsWith('LIMIT_')) {
        return res.status(400).json({ ok: false, message: 'The form could not be read. Please check your entries and try again.' });
      }
      log.error('upload.parse_failed', { err: errSummary(err) });
      return res.status(400).json({ ok: false, message: 'The form could not be read. Please try again.' });
    });
  };

  // 3. The handler. Every await is inside wrap() so DB failures reach the
  //    error middleware instead of hanging the request.
  router.post('/applications', limitAttempts, parseUpload, wrap(async (req, res) => {
    const ipKey = req.ipKey;
    const body = req.body || {};

    // Bot heuristics: a clear, retryable rejection. Nothing is stored and no
    // reference is fabricated. A human who tripped the fill-time check simply
    // submits again (their next attempt carries a larger elapsed time).
    if (honeypotTripped(body) || filledTooFast(body, cfg.minFormSeconds)) {
      log.warn('application.rejected_heuristic', { ip: ipKey });
      return res.status(400).json({ ok: false, code: 'rejected', message: REJECTED_MESSAGE });
    }

    const ts = await verifyTurnstile(cfg.turnstileSecret, body['cf-turnstile-response'], req.ip);
    if (!ts.ok) {
      return res.status(400).json({ ok: false, code: 'rejected', message: 'Please complete the verification challenge and try again.', errors: { turnstile: 'Verification failed.' } });
    }

    const v = validateApplication(body);
    const cv = checkCv(req.file);
    if (!v.ok || !cv.ok) {
      const errors = { ...(v.ok ? {} : v.errors) };
      if (!cv.ok) errors.cv = cv.error;
      return res.status(400).json({ ok: false, message: 'Some details need attention. Please check the highlighted fields.', errors });
    }
    const d = v.data;

    const buffer = req.file.buffer;
    const cvFilename = safeFilename(req.file.originalname, cv.ext);
    const sha256 = createHash('sha256').update(buffer).digest('hex');

    // Everything below is one transaction. An advisory lock on (email, role)
    // serialises concurrent submissions from the same person so the
    // idempotency / duplicate checks and the insert cannot interleave.
    const client = await pool.connect();
    let row;
    let cvPath = null;
    let outcome;
    try {
      await client.query('BEGIN');
      await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', [`careers:${d.email}:${d.role}`]);

      const same = await client.query('SELECT id FROM careers_applications WHERE idempotency_key = $1', [d.idempotency_key]);
      if (same.rows[0]) {
        outcome = { status: 200, body: { ok: true, reference: referenceFor(same.rows[0].id), duplicate: true } };
      } else {
        const dup = await client.query(
          `SELECT id FROM careers_applications
            WHERE lower(email) = $1 AND role = $2 AND created_at > now() - ($3 || ' minutes')::interval
            ORDER BY created_at DESC LIMIT 1`,
          [d.email, d.role, String(cfg.duplicateWindowMinutes)]
        );
        if (dup.rows[0]) {
          const ref = referenceFor(dup.rows[0].id);
          outcome = {
            status: 409,
            body: { ok: false, code: 'duplicate', reference: ref, message: `We already have your application for this role (reference ${ref}). There is no need to send it again.` },
          };
        }
      }

      if (outcome) {
        await client.query('ROLLBACK');
      } else {
        const ins = await client.query(
          `INSERT INTO careers_applications (
             idempotency_key, full_name, email, phone, city, country, department, role, role_other, brand,
             experience_band, skills, notice_period, linkedin_url, portfolio_url, introduction,
             astro_specialisations, astro_languages, astro_experience, astro_availability,
             consent_at, source, cv_filename, cv_mime, cv_size, cv_sha256, cv_storage, submit_ip_hash
           ) VALUES (
             $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
             $11,$12,$13,$14,$15,$16,
             $17,$18,$19,$20,
             now(),$21,$22,$23,$24,$25,$26,$27
           ) RETURNING *`,
          [
            d.idempotency_key, d.full_name, d.email, d.phone, d.city, d.country, d.department, d.role, d.role_other, d.brand,
            d.experience_band, d.skills, d.notice_period, d.linkedin_url, d.portfolio_url, d.introduction,
            d.astro_specialisations, d.astro_languages, d.astro_experience, d.astro_availability,
            JSON.stringify(d.source), cvFilename, cv.mime, buffer.length, sha256, cvStore.kind, ipKey,
          ]
        );
        row = ins.rows[0];
        cvPath = await cvStore.put(client, row.id, cv.ext, buffer);
        if (cvPath) await client.query('UPDATE careers_applications SET cv_path = $2 WHERE id = $1', [row.id, cvPath]);
        await client.query('INSERT INTO careers_status_events (application_id, from_status, to_status, actor) VALUES ($1, NULL, $2, $3)', [row.id, 'new', 'system']);
        await client.query('COMMIT');
      }
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      if (cvPath) await cvStore.remove({ cv_path: cvPath }).catch(() => {});
      throw err; // error middleware maps DB outages to 503, everything else to 500
    } finally {
      client.release();
    }

    if (outcome) return res.status(outcome.status).json(outcome.body);

    const reference = referenceFor(row.id);
    log.info('application.stored', { applicationId: row.id, role: row.role, brand: row.brand, cvBytes: buffer.length });

    // Respond only after the DB confirmed the write. Notification is
    // best-effort, retried by the sweeper, and never affects the stored row.
    res.status(201).json({ ok: true, reference, id: row.id });

    attemptNotification({ pool, mailer, cfg, app: { ...row, reference }, cvBuffer: cfg.notifyAttachCv ? buffer : null })
      .catch((err) => log.error('notify.failed', { applicationId: row.id, err: errSummary(err) }));
  }));

  return router;
}
