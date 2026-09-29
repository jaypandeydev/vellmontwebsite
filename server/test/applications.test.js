import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, submit, validFields, PDF_BYTES, buildForm } from './helpers.js';

let t;
before(async () => { t = await startTestServer(); });
after(async () => { await t.close(); });

test('health reports storage + notification mode', async () => {
  const res = await fetch(`${t.base}/api/careers/health`);
  const json = await res.json();
  assert.equal(json.ok, true);
  assert.equal(json.storage, 'db');
  assert.equal(json.notifications, 'off');
});

test('stores a valid application and its CV, only then reports success', async () => {
  const { status, json } = await submit(t.base, validFields());
  assert.equal(status, 201);
  assert.equal(json.ok, true);
  assert.match(json.reference, /^VC-[0-9A-F]{8}$/);

  const row = (await t.pool.query('SELECT * FROM careers_applications WHERE id = $1', [json.id])).rows[0];
  assert.equal(row.full_name, 'Test Candidate');
  assert.equal(row.phone, '+919876543210');
  assert.equal(row.department, 'engineering');
  assert.equal(row.role, 'frontend-developer');
  assert.equal(row.status, 'new');
  assert.equal(row.cv_filename, 'My CV.pdf');
  assert.equal(row.cv_mime, 'application/pdf');
  assert.equal(row.cv_size, PDF_BYTES.length);
  assert.equal(row.portfolio_url, 'https://github.com/test-candidate');
  assert.deepEqual(row.source, {
    utm_source: 'linkedin', utm_medium: 'social', utm_campaign: 'frontend_hiring',
    landing_role: 'frontend-developer', landing_brand: 'vellmont', referrer: 'https://www.linkedin.com/feed/',
  });
  assert.equal(row.astro_specialisations, null);
  assert.ok(row.consent_at);

  const blob = (await t.pool.query('SELECT data FROM careers_cv_blobs WHERE application_id = $1', [json.id])).rows[0];
  assert.ok(blob.data.equals(PDF_BYTES), 'CV bytes round-trip');
});

test('rejects invalid fields with per-field errors and stores nothing', async () => {
  const before = (await t.pool.query('SELECT count(*)::int AS n FROM careers_applications')).rows[0].n;
  const { status, json } = await submit(t.base, validFields({
    email: 'nope', phone: '98765', role: 'ceo', brand: 'acme', consent: 'no', linkedin_url: 'https://facebook.com/x',
    idempotency_key: crypto.randomUUID(),
  }));
  assert.equal(status, 400);
  assert.equal(json.ok, false);
  for (const f of ['email', 'phone', 'role', 'brand', 'consent', 'linkedin_url']) assert.ok(json.errors[f], `error for ${f}`);
  const after_ = (await t.pool.query('SELECT count(*)::int AS n FROM careers_applications')).rows[0].n;
  assert.equal(after_, before);
});

test('"Other" role requires the desired role text', async () => {
  const bad = await submit(t.base, validFields({ department: 'general', role: 'other', email: 'o1@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(bad.status, 400);
  assert.ok(bad.json.errors.role_other);
  const good = await submit(t.base, validFields({ department: 'general', role: 'other', role_other: 'Technical Writer', email: 'o2@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(good.status, 201);
});

test('astrologer role requires the astrology fields; other astrology roles ignore them', async () => {
  const missing = await submit(t.base, validFields({ department: 'astrology', role: 'astrologer', brand: 'vedjyotix', email: 'a1@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(missing.status, 400);
  for (const f of ['astro_specialisations', 'astro_languages', 'astro_experience', 'astro_availability']) assert.ok(missing.json.errors[f], f);

  const ok = await submit(t.base, validFields({
    department: 'astrology', role: 'astrologer', brand: 'vedjyotix', email: 'a2@example.com', idempotency_key: crypto.randomUUID(),
    astro_specialisations: ['vedic', 'kp'], astro_languages: ['hindi', 'telugu'], astro_experience: '5-10', astro_availability: 'flexible',
  }));
  assert.equal(ok.status, 201);
  const row = (await t.pool.query('SELECT * FROM careers_applications WHERE id = $1', [ok.json.id])).rows[0];
  assert.deepEqual(row.astro_specialisations, ['vedic', 'kp']);
  assert.deepEqual(row.astro_languages, ['hindi', 'telugu']);

  const csm = await submit(t.base, validFields({
    department: 'astrology', role: 'customer-success-manager', email: 'a3@example.com', idempotency_key: crypto.randomUUID(),
    astro_specialisations: ['vedic'], astro_languages: ['hindi'], astro_experience: '5-10', astro_availability: 'flexible',
  }));
  assert.equal(csm.status, 201);
  const row2 = (await t.pool.query('SELECT astro_specialisations, astro_experience FROM careers_applications WHERE id = $1', [csm.json.id])).rows[0];
  assert.equal(row2.astro_specialisations, null);
  assert.equal(row2.astro_experience, null);
});

test('department must match the role', async () => {
  const r = await submit(t.base, validFields({ department: 'astrology', role: 'frontend-developer', email: 'd@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(r.status, 400);
  assert.ok(r.json.errors.department);
});

test('rejects oversized CV with 413', async () => {
  const big = Buffer.concat([PDF_BYTES, Buffer.alloc(5 * 1024 * 1024)]);
  const r = await submit(t.base, validFields({ email: 'big@example.com', idempotency_key: crypto.randomUUID() }), { cv: big });
  assert.equal(r.status, 413);
  assert.ok(r.json.errors.cv);
});

test('rejects wrong extension, mislabelled contents and missing CV', async () => {
  const exe = await submit(t.base, validFields({ email: 'x1@example.com', idempotency_key: crypto.randomUUID() }), { cv: PDF_BYTES, cvName: 'cv.exe', cvType: 'application/octet-stream' });
  assert.equal(exe.status, 400);
  assert.ok(exe.json.errors.cv);

  const fake = await submit(t.base, validFields({ email: 'x2@example.com', idempotency_key: crypto.randomUUID() }), { cv: Buffer.from('MZ' + 'A'.repeat(500)), cvName: 'cv.pdf' });
  assert.equal(fake.status, 400);
  assert.match(fake.json.errors.cv, /real PDF/);

  const none = await submit(t.base, validFields({ email: 'x3@example.com', idempotency_key: crypto.randomUUID() }), { cv: null });
  assert.equal(none.status, 400);
  assert.ok(none.json.errors.cv);
});

test('idempotent retry returns the same reference without a second row', async () => {
  const key = crypto.randomUUID();
  const a = await submit(t.base, validFields({ email: 'idem@example.com', idempotency_key: key }));
  const b = await submit(t.base, validFields({ email: 'idem@example.com', idempotency_key: key }));
  assert.equal(a.status, 201);
  assert.equal(b.status, 200);
  assert.equal(b.json.duplicate, true);
  assert.equal(a.json.reference, b.json.reference);
  const n = (await t.pool.query("SELECT count(*)::int AS n FROM careers_applications WHERE email = 'idem@example.com'")).rows[0].n;
  assert.equal(n, 1);
});

test('same email + role within the window is refused as a duplicate', async () => {
  const a = await submit(t.base, validFields({ email: 'dup@example.com', idempotency_key: crypto.randomUUID() }));
  const b = await submit(t.base, validFields({ email: 'DUP@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(a.status, 201);
  assert.equal(b.status, 409);
  assert.equal(b.json.code, 'duplicate');
  assert.equal(b.json.reference, a.json.reference);
  // A different role from the same person is fine.
  const c = await submit(t.base, validFields({ email: 'dup@example.com', role: 'backend-developer', idempotency_key: crypto.randomUUID() }));
  assert.equal(c.status, 201);
});

test('honeypot and too-fast submissions are silently dropped', async () => {
  const before = (await t.pool.query('SELECT count(*)::int AS n FROM careers_applications')).rows[0].n;
  const hp = await submit(t.base, validFields({ email: 'bot@example.com', website: 'http://spam', idempotency_key: crypto.randomUUID() }));
  assert.equal(hp.status, 202);
  assert.equal(hp.json.accepted, false);
  const fast = await submit(t.base, validFields({ email: 'bot2@example.com', form_elapsed_ms: '100', idempotency_key: crypto.randomUUID() }));
  assert.equal(fast.status, 202);
  const after_ = (await t.pool.query('SELECT count(*)::int AS n FROM careers_applications')).rows[0].n;
  assert.equal(after_, before);
});

test('unknown attribution keys and junk role/brand params are dropped', async () => {
  const r = await submit(t.base, validFields({ email: 'attr@example.com', idempotency_key: crypto.randomUUID(), utm_source: 'x'.repeat(500), landing_role: 'hacker', landing_brand: 'evil', evil: 'payload', referrer: 'not a url' }));
  assert.equal(r.status, 201);
  const row = (await t.pool.query('SELECT source FROM careers_applications WHERE id = $1', [r.json.id])).rows[0];
  assert.equal(row.source.utm_source.length, 200);
  assert.equal(row.source.landing_role, undefined);
  assert.equal(row.source.landing_brand, undefined);
  assert.equal(row.source.evil, undefined);
  assert.equal(row.source.referrer, undefined);
});

test('per-IP rate limit kicks in', async () => {
  const s = await startTestServer({ RATE_SUBMIT_PER_HOUR: '2', RATE_SUBMIT_PER_DAY: '100' }, { reset: false });
  try {
    const r1 = await submit(s.base, validFields({ email: 'r1@example.com', idempotency_key: crypto.randomUUID() }));
    const r2 = await submit(s.base, validFields({ email: 'r2@example.com', idempotency_key: crypto.randomUUID() }));
    const r3 = await submit(s.base, validFields({ email: 'r3@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(r1.status, 201);
    assert.equal(r2.status, 201);
    assert.equal(r3.status, 429);
  } finally {
    await s.close();
  }
});

test('fs storage writes the CV outside the DB and serves it back', async () => {
  const dir = `${process.env.TMPDIR || '/tmp'}/vc-cv-test-${Date.now()}`;
  const s = await startTestServer({ CV_STORAGE: 'fs', CV_STORAGE_DIR: dir }, { reset: false });
  try {
    const r = await submit(s.base, validFields({ email: 'fs@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 201);
    const row = (await s.pool.query('SELECT cv_storage, cv_path FROM careers_applications WHERE id = $1', [r.json.id])).rows[0];
    assert.equal(row.cv_storage, 'fs');
    assert.equal(row.cv_path, `${r.json.id}.pdf`);
    const fs = await import('node:fs/promises');
    const bytes = await fs.readFile(`${dir}/${row.cv_path}`);
    assert.ok(bytes.equals(PDF_BYTES));
    const st = await fs.stat(`${dir}/${row.cv_path}`);
    assert.equal(st.mode & 0o777, 0o600);
    await fs.rm(dir, { recursive: true, force: true });
  } finally {
    await s.close();
  }
});
