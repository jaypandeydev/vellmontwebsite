import { Router } from 'express';
import express from 'express';
import { APPLICATION_STATUSES, isValidSlug, findRole, findBrand, labelFor, ALL_ROLES, BRANDS, DEPARTMENTS, EXPERIENCE_BANDS, NOTICE_PERIODS, COUNTRIES } from '../../../shared/careersCatalog.js';
import {
  getSession, checkCredentials, createSessionToken, sessionCookie, isSameOriginRequest, COOKIE_PATH,
} from '../auth.js';
import { createLimiter } from '../rateLimit.js';
import { hashIp } from '../spam.js';
import { loginPage, listPage, detailPage, errorPage } from '../views.js';
import { referenceFor, attemptNotification } from '../notifications.js';
import { wrap } from '../asyncRoute.js';
import { log } from '../log.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PAGE_SIZE = 25;

function noStore(res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}

export function reviewRouter({ cfg, pool, cvStore, mailer }) {
  const router = Router();
  const loginLimiter = createLimiter({ windowMs: 15 * 60 * 1000, max: cfg.rateLimit.loginPer15Min });
  const form = express.urlencoded({ extended: false, limit: '32kb' });

  router.use((req, res, next) => {
    noStore(res);
    req.session = getSession(req, cfg);
    next();
  });

  // Every POST must be same-origin (SameSite=Strict cookie + header check).
  router.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD' && !isSameOriginRequest(req)) {
      return res.status(403).send(errorPage({ status: 403, message: 'Cross-site request blocked.' }));
    }
    next();
  });

  const requireAuth = (req, res, next) => {
    if (req.session) return next();
    const next_ = encodeURIComponent(req.originalUrl || COOKIE_PATH);
    return res.redirect(302, `${COOKIE_PATH}/login?next=${next_}`);
  };

  const safeNext = (v) => (typeof v === 'string' && v.startsWith(`${COOKIE_PATH}`) && !v.startsWith('//') ? v : COOKIE_PATH);

  router.get('/login', (req, res) => {
    if (req.session) return res.redirect(302, COOKIE_PATH);
    res.type('html').send(loginPage({ next: safeNext(req.query.next) }));
  });

  router.post('/login', form, (req, res) => {
    const ipKey = hashIp(req.ip, cfg.ipHashSalt);
    const limit = loginLimiter.hit(ipKey);
    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSec));
      return res.status(429).type('html').send(loginPage({ error: 'Too many sign-in attempts. Please wait a few minutes.', next: safeNext(req.body.next) }));
    }
    if (!checkCredentials(cfg, req.body.username, req.body.password)) {
      log.warn('review.login_failed', { ip: ipKey });
      return res.status(401).type('html').send(loginPage({ error: 'Incorrect username or password.', next: safeNext(req.body.next) }));
    }
    const token = createSessionToken({ username: cfg.reviewUsername, ttlHours: cfg.sessionTtlHours, secret: cfg.sessionSecret });
    res.setHeader('Set-Cookie', sessionCookie(token, cfg));
    log.info('review.login', { user: cfg.reviewUsername });
    res.redirect(302, safeNext(req.body.next));
  });

  router.post('/logout', form, (req, res) => {
    res.setHeader('Set-Cookie', sessionCookie('', cfg, { clear: true }));
    res.redirect(302, `${COOKIE_PATH}/login`);
  });

  router.use(requireAuth);

  function parseFilters(q) {
    const f = {};
    if (typeof q.q === 'string' && q.q.trim()) f.q = q.q.trim().slice(0, 100);
    if (typeof q.status === 'string' && isValidSlug(APPLICATION_STATUSES, q.status)) f.status = q.status;
    if (typeof q.role === 'string' && findRole(q.role)) f.role = q.role;
    if (typeof q.brand === 'string' && findBrand(q.brand)) f.brand = q.brand;
    return f;
  }

  function whereFor(f) {
    const where = [];
    const params = [];
    if (f.q) { params.push(`%${f.q.toLowerCase()}%`); where.push(`(lower(full_name) LIKE $${params.length} OR lower(email) LIKE $${params.length})`); }
    if (f.status) { params.push(f.status); where.push(`status = $${params.length}`); }
    if (f.role) { params.push(f.role); where.push(`role = $${params.length}`); }
    if (f.brand) { params.push(f.brand); where.push(`brand = $${params.length}`); }
    return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
  }

  const LIST_COLS = 'id, created_at, full_name, email, city, country, department, role, role_other, brand, experience_band, notice_period, status, source';

  router.get('/', wrap(async (req, res) => {
    const filters = parseFilters(req.query);
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const { sql, params } = whereFor(filters);
    const [rows, total, counts] = await Promise.all([
      pool.query(`SELECT ${LIST_COLS} FROM careers_applications ${sql} ORDER BY created_at DESC LIMIT ${PAGE_SIZE} OFFSET ${(page - 1) * PAGE_SIZE}`, params),
      pool.query(`SELECT count(*)::int AS n FROM careers_applications ${sql}`, params),
      pool.query('SELECT status, count(*)::int AS n FROM careers_applications GROUP BY status'),
    ]);
    const countMap = Object.fromEntries(counts.rows.map((r) => [r.status, r.n]));
    res.type('html').send(listPage({ user: req.session.u, apps: rows.rows, filters, total: total.rows[0].n, page, pageSize: PAGE_SIZE, counts: countMap }));
  }));

  router.get('/export.csv', wrap(async (req, res) => {
    const filters = parseFilters(req.query);
    const { sql, params } = whereFor(filters);
    const rows = await pool.query(`SELECT * FROM careers_applications ${sql} ORDER BY created_at DESC LIMIT 5000`, params);
    const cell = (v) => {
      let s = v === null || v === undefined ? '' : Array.isArray(v) ? v.join('; ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // neutralise spreadsheet formula injection
      return `"${s.replace(/"/g, '""')}"`;
    };
    const header = ['reference', 'received_utc', 'status', 'full_name', 'email', 'phone', 'city', 'country', 'department', 'role', 'role_other', 'brand', 'experience', 'notice_period', 'skills', 'linkedin_url', 'portfolio_url', 'astro_specialisations', 'astro_languages', 'astro_experience', 'astro_availability', 'source', 'cv_filename'];
    const lines = [header.join(',')];
    for (const a of rows.rows) {
      lines.push([
        referenceFor(a.id), new Date(a.created_at).toISOString(), labelFor(APPLICATION_STATUSES, a.status), a.full_name, a.email, a.phone, a.city, labelFor(COUNTRIES, a.country),
        labelFor(DEPARTMENTS, a.department), labelFor(ALL_ROLES, a.role), a.role_other, labelFor(BRANDS, a.brand), labelFor(EXPERIENCE_BANDS, a.experience_band),
        labelFor(NOTICE_PERIODS, a.notice_period), a.skills, a.linkedin_url, a.portfolio_url, a.astro_specialisations, a.astro_languages, a.astro_experience,
        a.astro_availability, a.source, a.cv_filename,
      ].map(cell).join(','));
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="careers-applications-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send('\uFEFF' + lines.join('\r\n'));
  }));

  async function loadApp(id) {
    if (!UUID_RE.test(id)) return null;
    const r = await pool.query('SELECT * FROM careers_applications WHERE id = $1', [id]);
    if (!r.rows[0]) return null;
    return { ...r.rows[0], reference: referenceFor(r.rows[0].id) };
  }

  router.get('/applications/:id', wrap(async (req, res) => {
    const app = await loadApp(req.params.id);
    if (!app) return res.status(404).type('html').send(errorPage({ user: req.session.u, status: 404, message: 'Application not found.' }));
    const events = await pool.query('SELECT at, from_status, to_status, note, actor FROM careers_status_events WHERE application_id = $1 ORDER BY at DESC, id DESC', [app.id]);
    const flash = typeof req.query.saved === 'string' ? 'Saved.' : typeof req.query.notified === 'string' ? (req.query.notified === '1' ? 'Notification email sent.' : 'Notification email failed — see the timeline card.') : null;
    res.type('html').send(detailPage({ user: req.session.u, app, events: events.rows, flash, mailEnabled: mailer.enabled }));
  }));

  router.get('/applications/:id/cv', wrap(async (req, res) => {
    const app = await loadApp(req.params.id);
    if (!app) return res.status(404).type('html').send(errorPage({ user: req.session.u, status: 404, message: 'Application not found.' }));
    const data = await cvStore.get(app);
    if (!data) return res.status(404).type('html').send(errorPage({ user: req.session.u, status: 404, message: 'CV file is missing from storage.' }));
    log.info('review.cv_download', { applicationId: app.id, user: req.session.u });
    const asciiName = app.cv_filename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
    res.setHeader('Content-Type', app.cv_mime);
    res.setHeader('Content-Length', String(data.length));
    res.setHeader('Content-Disposition', `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(app.cv_filename)}`);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.send(data);
  }));

  router.post('/applications/:id/status', form, wrap(async (req, res) => {
    const app = await loadApp(req.params.id);
    if (!app) return res.status(404).type('html').send(errorPage({ user: req.session.u, status: 404, message: 'Application not found.' }));
    const to = String(req.body.status || '');
    if (!isValidSlug(APPLICATION_STATUSES, to)) return res.status(400).type('html').send(errorPage({ user: req.session.u, status: 400, message: 'Unknown status.' }));
    const note = String(req.body.note || '').trim().slice(0, 1000) || null;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE careers_applications SET status = $2, status_updated_at = now() WHERE id = $1', [app.id, to]);
      await client.query('INSERT INTO careers_status_events (application_id, from_status, to_status, note, actor) VALUES ($1,$2,$3,$4,$5)', [app.id, app.status, to, note, req.session.u]);
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      throw err;
    } finally {
      client.release();
    }
    log.info('review.status_changed', { applicationId: app.id, from: app.status, to, user: req.session.u });
    res.redirect(303, `${COOKIE_PATH}/applications/${app.id}?saved=1`);
  }));

  router.post('/applications/:id/notes', form, wrap(async (req, res) => {
    const app = await loadApp(req.params.id);
    if (!app) return res.status(404).type('html').send(errorPage({ user: req.session.u, status: 404, message: 'Application not found.' }));
    const notes = String(req.body.reviewer_notes || '').slice(0, 5000);
    await pool.query('UPDATE careers_applications SET reviewer_notes = $2 WHERE id = $1', [app.id, notes || null]);
    res.redirect(303, `${COOKIE_PATH}/applications/${app.id}?saved=1`);
  }));

  // Manual re-send of the hiring-team notification (e.g. after fixing SMTP).
  router.post('/applications/:id/notify', form, wrap(async (req, res) => {
    const app = await loadApp(req.params.id);
    if (!app) return res.status(404).type('html').send(errorPage({ user: req.session.u, status: 404, message: 'Application not found.' }));
    if (!mailer.enabled) return res.status(400).type('html').send(errorPage({ user: req.session.u, status: 400, message: 'Email notifications are not configured on this server.' }));
    const cv = cfg.notifyAttachCv ? await cvStore.get(app) : null;
    const r = await attemptNotification({ pool, mailer, cfg, app, cvBuffer: cv });
    log.info('review.notify_resend', { applicationId: app.id, user: req.session.u, sent: r.sent });
    res.redirect(303, `${COOKIE_PATH}/applications/${app.id}?notified=${r.sent ? '1' : '0'}`);
  }));

  return router;
}
