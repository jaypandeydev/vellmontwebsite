import { Router } from 'express';
import { createHash } from 'node:crypto';
import { cvUpload, CV_FIELD, checkCv, safeFilename } from '../upload.js';
import { validateApplication } from '../validate.js';
import { createLimiter } from '../rateLimit.js';
import { hashIp, honeypotTripped, filledTooFast, verifyTurnstile } from '../spam.js';
import { log, errSummary } from '../log.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function referenceFor(id) {
  return `VC-${String(id).replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

export function applicationsRouter({ cfg, pool, cvStore, mailer }) {
  const router = Router();
  const hourly = createLimiter({ windowMs: 60 * 60 * 1000, max: cfg.rateLimit.submitPerHour });
  const daily = createLimiter({ windowMs: 24 * 60 * 60 * 1000, max: cfg.rateLimit.submitPerDay });

  router.get('/health', (req, res) => {
    res.json({
      ok: true,
      service: 'careers-api',
      storage: cvStore.kind,
      notifications: mailer.enabled ? 'email' : 'off',
      turnstile: Boolean(cfg.turnstileSecret),
    });
  });

  // Multer must run first (multipart), then its errors are translated.
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

  router.post('/applications', parseUpload, async (req, res) => {
    const ipKey = hashIp(req.ip, cfg.ipHashSalt);
    const body = req.body || {};

    // Silent-accept bots: identical success shape, nothing stored.
    if (honeypotTripped(body) || filledTooFast(body, cfg.minFormSeconds)) {
      log.warn('application.rejected_bot', { ip: ipKey });
      return res.status(202).json({ ok: true, reference: referenceFor('00000000'), accepted: false });
    }

    // Idempotent retry (same browser session re-sent the same form) — answered
    // before rate limiting so a stuck "Submit" never loses its reference.
    const idemKey = String(Array.isArray(body.idempotency_key) ? body.idempotency_key[0] : body.idempotency_key || '').toLowerCase();
    if (UUID_RE.test(idemKey)) {
      const existing = await pool.query('SELECT id FROM careers_applications WHERE idempotency_key = $1', [idemKey]);
      if (existing.rows[0]) {
        return res.status(200).json({ ok: true, reference: referenceFor(existing.rows[0].id), duplicate: true });
      }
    }

    if (!hourly.check(ipKey) || !daily.check(ipKey)) {
      return res.status(429).json({ ok: false, message: 'Too many submissions from your network. Please try again later.' });
    }

    const ts = await verifyTurnstile(cfg.turnstileSecret, body['cf-turnstile-response'], req.ip);
    if (!ts.ok) {
      return res.status(400).json({ ok: false, message: 'Please complete the verification challenge and try again.', errors: { turnstile: 'Verification failed.' } });
    }

    const v = validateApplication(body);
    const cv = checkCv(req.file);
    if (!v.ok || !cv.ok) {
      const errors = { ...(v.ok ? {} : v.errors) };
      if (!cv.ok) errors.cv = cv.error;
      return res.status(400).json({ ok: false, message: 'Some details need attention. Please check the highlighted fields.', errors });
    }
    const d = v.data;

    // Same person, same role, within the duplicate window → don't create twice.
    const dup = await pool.query(
      `SELECT id FROM careers_applications
        WHERE lower(email) = $1 AND role = $2 AND created_at > now() - ($3 || ' minutes')::interval
        ORDER BY created_at DESC LIMIT 1`,
      [d.email, d.role, String(cfg.duplicateWindowMinutes)]
    );
    if (dup.rows[0]) {
      return res.status(409).json({
        ok: false,
        code: 'duplicate',
        reference: referenceFor(dup.rows[0].id),
        message: `We already have your application for this role (reference ${referenceFor(dup.rows[0].id)}). No need to send it again.`,
      });
    }

    hourly.hit(ipKey);
    daily.hit(ipKey);

    const buffer = req.file.buffer;
    const cvFilename = safeFilename(req.file.originalname, cv.ext);
    const sha256 = createHash('sha256').update(buffer).digest('hex');

    const client = await pool.connect();
    let row;
    let cvPath = null;
    try {
      await client.query('BEGIN');
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
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      if (cvPath) await cvStore.remove({ cv_path: cvPath }).catch(() => {});
      client.release();
      if (err.code === '23505') {
        // Raced with an identical retry.
        const again = await pool.query('SELECT id FROM careers_applications WHERE idempotency_key = $1', [d.idempotency_key]);
        if (again.rows[0]) return res.status(200).json({ ok: true, reference: referenceFor(again.rows[0].id), duplicate: true });
      }
      log.error('application.store_failed', { err: errSummary(err) });
      return res.status(503).json({ ok: false, message: 'We could not save your application right now. Your details are still on this page — please try again in a moment.' });
    }
    client.release();

    const reference = referenceFor(row.id);
    log.info('application.stored', { applicationId: row.id, role: row.role, brand: row.brand, cvBytes: buffer.length });

    // Respond only after the DB confirmed the write. Notification is best-effort.
    res.status(201).json({ ok: true, reference, id: row.id });

    mailer.notifyNewApplication({ ...row, reference }, cfg.notifyAttachCv ? buffer : null).then(async (r) => {
      if (r.sent) {
        await pool.query('UPDATE careers_applications SET notified_at = now() WHERE id = $1', [row.id]);
      } else if (r.reason !== 'mail-not-configured') {
        await pool.query('UPDATE careers_applications SET notify_error = $2 WHERE id = $1', [row.id, String(r.reason).slice(0, 80)]);
      }
    }).catch((err) => log.error('application.notify_update_failed', { applicationId: row.id, err: errSummary(err) }));
  });

  return router;
}
