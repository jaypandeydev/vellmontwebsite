import { loadConfig } from '../src/config.js';
import { createPool, migrate } from '../src/db.js';
import { createApp } from '../src/app.js';
import { hashPassword } from '../src/auth.js';

export const TEST_PASSWORD = 'correct-horse-battery-staple';

export async function startTestServer(overrides = {}, { reset = true, migrate: doMigrate = true, mailer } = {}) {
  const databaseUrl = process.env.DATABASE_URL_TEST || process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('Set DATABASE_URL_TEST to a scratch Postgres database');
  const cfg = loadConfig({
    NODE_ENV: 'test',
    DATABASE_URL: databaseUrl,
    SESSION_SECRET: 'x'.repeat(48),
    REVIEW_USERNAME: 'reviewer',
    REVIEW_PASSWORD_HASH: hashPassword(TEST_PASSWORD, { N: 1024 }),
    MIN_FORM_SECONDS: '1',
    RATE_ATTEMPTS_PER_15MIN: '1000',
    RATE_ATTEMPTS_PER_DAY: '1000',
    DB_CONNECT_TIMEOUT_MS: '1500',
    COOKIE_SECURE: '0',
    ...overrides,
  });
  if (cfg.missing.length) throw new Error('test config missing: ' + cfg.missing.join(', '));
  const pool = createPool(cfg);
  if (doMigrate) {
    if (reset) await pool.query('DROP TABLE IF EXISTS careers_status_events, careers_cv_blobs, careers_applications CASCADE');
    await migrate(pool);
  }
  const { app, sweeper } = await createApp({ cfg, pool, mailer });
  const server = await new Promise((resolve) => {
    const s = app.listen(0, '127.0.0.1', () => resolve(s));
  });
  const base = `http://127.0.0.1:${server.address().port}`;
  return {
    cfg, pool, base, sweeper,
    async close() {
      if (sweeper) sweeper.stop();
      await new Promise((r) => server.close(r));
      await pool.end();
    },
  };
}

export const PDF_BYTES = Buffer.from(
  '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 200 200]>>endobj\nxref\n0 4\n0000000000 65535 f \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n0\n%%EOF\n'.padEnd(400, ' ')
);

export function validFields(extra = {}) {
  return {
    full_name: 'Test Candidate',
    email: 'candidate@example.com',
    phone: '+91 98765 43210',
    city: 'Hyderabad',
    country: 'IN',
    department: 'engineering',
    role: 'frontend-developer',
    brand: 'vellmont',
    experience_band: '1-3',
    skills: 'React, Tailwind',
    notice_period: '30',
    linkedin_url: 'https://www.linkedin.com/in/test-candidate',
    portfolio_url: 'github.com/test-candidate',
    introduction: 'Hello there.',
    consent: 'yes',
    idempotency_key: crypto.randomUUID(),
    form_elapsed_ms: '5000',
    utm_source: 'linkedin',
    utm_medium: 'social',
    utm_campaign: 'frontend_hiring',
    landing_role: 'frontend-developer',
    landing_brand: 'vellmont',
    referrer: 'https://www.linkedin.com/feed/?trk=abc',
    ...extra,
  };
}

export function buildForm(fields, { cv = PDF_BYTES, cvName = 'My CV.pdf', cvType = 'application/pdf' } = {}) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    if (Array.isArray(v)) v.forEach((x) => fd.append(k, x));
    else if (v !== undefined && v !== null) fd.append(k, String(v));
  }
  if (cv) fd.append('cv', new Blob([cv], { type: cvType }), cvName);
  return fd;
}

export async function submit(base, fields, opts = {}) {
  const res = await fetch(`${base}/api/careers/applications`, { method: 'POST', body: buildForm(fields, opts), headers: opts.headers || {} });
  const json = await res.json();
  return { status: res.status, json };
}

export async function login(base, username = 'reviewer', password = TEST_PASSWORD) {
  const res = await fetch(`${base}/careers/review/login`, {
    method: 'POST',
    redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded', origin: base },
    body: new URLSearchParams({ username, password }).toString(),
  });
  const cookie = (res.headers.get('set-cookie') || '').split(';')[0];
  return { status: res.status, cookie, location: res.headers.get('location') };
}
