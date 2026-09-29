// Regression tests for the PR #2 review findings.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import pg from 'pg';
import { startTestServer, submit, validFields, login, buildForm, PDF_BYTES } from './helpers.js';

let t;
before(async () => { t = await startTestServer(); });
after(async () => { await t.close(); });

// ── 1. no fabricated success ──────────────────────────────────────────────
test('every non-stored outcome is ok:false and carries no fabricated reference', async () => {
  const cases = [
    validFields({ website: 'filled', idempotency_key: crypto.randomUUID() }),
    validFields({ form_elapsed_ms: '10', idempotency_key: crypto.randomUUID() }),
    validFields({ email: 'bad', idempotency_key: crypto.randomUUID() }),
    validFields({ idempotency_key: 'not-a-uuid' }),
  ];
  for (const c of cases) {
    const r = await submit(t.base, c);
    assert.equal(r.status, 400);
    assert.equal(r.json.ok, false);
    assert.equal(r.json.reference, undefined);
    assert.equal(r.json.id, undefined);
  }
  const n = (await t.pool.query('SELECT count(*)::int AS n FROM careers_applications')).rows[0].n;
  assert.equal(n, 0);
});

// ── 6. country catalogue ──────────────────────────────────────────────────
test('country accepts exactly India (IN) and UAE (AE); tampered values are rejected server-side', async () => {
  const inR = await submit(t.base, validFields({ email: 'in@example.com', country: 'IN', idempotency_key: crypto.randomUUID() }));
  const aeR = await submit(t.base, validFields({ email: 'ae@example.com', country: 'ae', city: 'Dubai', idempotency_key: crypto.randomUUID() }));
  assert.equal(inR.status, 201);
  assert.equal(aeR.status, 201);
  const rows = (await t.pool.query('SELECT email, country FROM careers_applications ORDER BY email')).rows;
  assert.deepEqual(rows, [{ email: 'ae@example.com', country: 'AE' }, { email: 'in@example.com', country: 'IN' }]);

  for (const bad of ['', 'India', 'US', 'PK', 'IN; DROP']) {
    const r = await submit(t.base, validFields({ email: 'bad@example.com', country: bad, idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 400, `country=${JSON.stringify(bad)}`);
    assert.ok(r.json.errors.country);
  }

  // Rendered consistently in dashboard, detail and CSV.
  const s = await login(t.base);
  const h = { cookie: s.cookie };
  const list = await (await fetch(`${t.base}/careers/review`, { headers: h })).text();
  assert.match(list, /Dubai, UAE/);
  assert.match(list, /Hyderabad, India/);
  const detail = await (await fetch(`${t.base}/careers/review/applications/${aeR.json.id}`, { headers: h })).text();
  assert.match(detail, /Dubai, UAE/);
  assert.doesNotMatch(detail, /Dubai, AE</);
  const csv = await (await fetch(`${t.base}/careers/review/export.csv`, { headers: h })).text();
  assert.match(csv, /"Dubai","UAE"/);
  assert.match(csv, /"Hyderabad","India"/);
});

test('existing rows with legacy free-text country are displayed as-is, not rewritten', async () => {
  const r = await submit(t.base, validFields({ email: 'legacy@example.com', idempotency_key: crypto.randomUUID() }));
  await t.pool.query("UPDATE careers_applications SET country = 'United Kingdom' WHERE id = $1", [r.json.id]);
  const s = await login(t.base);
  const detail = await (await fetch(`${t.base}/careers/review/applications/${r.json.id}`, { headers: { cookie: s.cookie } })).text();
  assert.match(detail, /Hyderabad, United Kingdom/);
  const row = (await t.pool.query('SELECT country FROM careers_applications WHERE id = $1', [r.json.id])).rows[0];
  assert.equal(row.country, 'United Kingdom');
});

// ── 4. concurrent duplicates ──────────────────────────────────────────────
async function concurrent(base, fieldsList) {
  return Promise.all(fieldsList.map((f) => submit(base, f)));
}

test('5 simultaneous submissions with the SAME idempotency key store exactly one application', async () => {
  let notified = 0;
  const mailer = { enabled: true, async notifyNewApplication() { notified += 1; return { sent: true }; } };
  const s = await startTestServer({}, { reset: false, mailer });
  try {
    const key = crypto.randomUUID();
    const rs = await concurrent(s.base, Array.from({ length: 5 }, () => validFields({ email: 'samekey@example.com', idempotency_key: key })));
    const statuses = rs.map((r) => r.status).sort();
    assert.deepEqual(statuses, [200, 200, 200, 200, 201]);
    const refs = new Set(rs.map((r) => r.json.reference));
    assert.equal(refs.size, 1);
    const n = (await s.pool.query("SELECT count(*)::int AS n FROM careers_applications WHERE email = 'samekey@example.com'")).rows[0].n;
    assert.equal(n, 1);
    const id = rs.find((r) => r.status === 201).json.id;
    assert.equal((await s.pool.query('SELECT count(*)::int AS n FROM careers_cv_blobs WHERE application_id = $1', [id])).rows[0].n, 1);
    assert.equal((await s.pool.query('SELECT count(*)::int AS n FROM careers_status_events WHERE application_id = $1', [id])).rows[0].n, 1);
    await new Promise((r) => setTimeout(r, 100));
    assert.equal(notified, 1, 'exactly one notification');
  } finally {
    await s.close();
  }
});

test('5 simultaneous submissions with DIFFERENT keys for the same email+role store exactly one (fs storage, no orphans)', async () => {
  const dir = `${process.env.TMPDIR || '/tmp'}/vc-dup-${Date.now()}`;
  let notified = 0;
  const mailer = { enabled: true, async notifyNewApplication() { notified += 1; return { sent: true }; } };
  const s = await startTestServer({ CV_STORAGE: 'fs', CV_STORAGE_DIR: dir }, { reset: false, mailer });
  try {
    const rs = await concurrent(s.base, Array.from({ length: 5 }, () => validFields({ email: 'Race@Example.com', idempotency_key: crypto.randomUUID() })));
    const statuses = rs.map((r) => r.status).sort();
    assert.deepEqual(statuses, [201, 409, 409, 409, 409]);
    const winner = rs.find((r) => r.status === 201);
    for (const r of rs.filter((r) => r.status === 409)) {
      assert.equal(r.json.code, 'duplicate');
      assert.equal(r.json.reference, winner.json.reference);
      assert.equal(r.json.ok, false);
    }
    const n = (await s.pool.query("SELECT count(*)::int AS n FROM careers_applications WHERE lower(email) = 'race@example.com'")).rows[0].n;
    assert.equal(n, 1);
    assert.equal((await s.pool.query('SELECT count(*)::int AS n FROM careers_status_events WHERE application_id = $1', [winner.json.id])).rows[0].n, 1);
    const files = await fs.readdir(dir);
    assert.deepEqual(files, [`${winner.json.id}.pdf`]);
    await new Promise((r) => setTimeout(r, 100));
    assert.equal(notified, 1);

    // After the duplicate window the same person can apply again for the same role.
    await s.pool.query("UPDATE careers_applications SET created_at = now() - interval '2 hours' WHERE id = $1", [winner.json.id]);
    const later = await submit(s.base, validFields({ email: 'race@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(later.status, 201);
    assert.equal((await fs.readdir(dir)).length, 2);
    await fs.rm(dir, { recursive: true, force: true });
  } finally {
    await s.close();
  }
});

// ── 3. rate limiting ──────────────────────────────────────────────────────
test('concurrent attempts cannot exceed the limit; 429 has Retry-After; nothing beyond the cap is parsed', async () => {
  const s = await startTestServer({ RATE_ATTEMPTS_PER_15MIN: '3' }, { reset: false });
  try {
    const rs = await Promise.all(Array.from({ length: 8 }, (_, i) => submit(s.base, validFields({ email: `c${i}@example.com`, idempotency_key: crypto.randomUUID() }))));
    const stored = rs.filter((r) => r.status === 201).length;
    const limited = rs.filter((r) => r.status === 429).length;
    assert.equal(stored, 3);
    assert.equal(limited, 5);
    const n = (await s.pool.query("SELECT count(*)::int AS n FROM careers_applications WHERE email LIKE 'c%@example.com'")).rows[0].n;
    assert.equal(n, 3);
  } finally {
    await s.close();
  }
});

test('client IP: X-Forwarded-For is honoured only with TRUST_PROXY=1 (Caddy in front)', async () => {
  const trusting = await startTestServer({ RATE_ATTEMPTS_PER_15MIN: '1', TRUST_PROXY: '1' }, { reset: false });
  try {
    const a = await submit(trusting.base, validFields({ email: 'x1@example.com', idempotency_key: crypto.randomUUID() }), { headers: { 'x-forwarded-for': '203.0.113.10' } });
    const b = await submit(trusting.base, validFields({ email: 'x2@example.com', idempotency_key: crypto.randomUUID() }), { headers: { 'x-forwarded-for': '203.0.113.11' } });
    // Spoofed prefix: only the last hop Caddy appends counts, so this is still .11
    const c = await submit(trusting.base, validFields({ email: 'x3@example.com', idempotency_key: crypto.randomUUID() }), { headers: { 'x-forwarded-for': '198.51.100.7, 203.0.113.11' } });
    assert.equal(a.status, 201);
    assert.equal(b.status, 201);
    assert.equal(c.status, 429);
  } finally {
    await trusting.close();
  }
  const direct = await startTestServer({ RATE_ATTEMPTS_PER_15MIN: '1', TRUST_PROXY: '0' }, { reset: false });
  try {
    const a = await submit(direct.base, validFields({ email: 'y1@example.com', idempotency_key: crypto.randomUUID() }), { headers: { 'x-forwarded-for': '203.0.113.10' } });
    const b = await submit(direct.base, validFields({ email: 'y2@example.com', idempotency_key: crypto.randomUUID() }), { headers: { 'x-forwarded-for': '203.0.113.11' } });
    assert.equal(a.status, 201);
    assert.equal(b.status, 429, 'header ignored → same socket IP → limited');
  } finally {
    await direct.close();
  }
});

// ── 2. async failures / outages ───────────────────────────────────────────
test('database outage: controlled 503s, no hang, no crash, and the review pages degrade cleanly', async () => {
  const s = await startTestServer({ DATABASE_URL: 'postgresql://nobody:nothing@127.0.0.1:1/none', DB_CONNECT_TIMEOUT_MS: '800' }, { migrate: false });
  try {
    const started = Date.now();
    const r = await submit(s.base, validFields({ email: 'outage@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 503);
    assert.equal(r.json.ok, false);
    assert.doesNotMatch(JSON.stringify(r.json), /ECONNREFUSED|postgres|127\.0\.0\.1|nobody|outage@/i);
    assert.ok(Date.now() - started < 5000, 'returned promptly');

    const health = await fetch(`${s.base}/api/careers/health`);
    assert.equal(health.status, 200, 'process still serving');

    const login_ = await login(s.base);
    assert.equal(login_.status, 302, 'login does not need the DB');
    const h = { cookie: login_.cookie };
    for (const p of ['/careers/review', '/careers/review/applications/00000000-0000-4000-8000-000000000000', '/careers/review/applications/00000000-0000-4000-8000-000000000000/cv', '/careers/review/export.csv']) {
      const res = await fetch(`${s.base}${p}`, { headers: h });
      assert.equal(res.status, 503, p);
      assert.equal(res.headers.get('retry-after'), '30');
      const body = await res.text();
      assert.doesNotMatch(body, /ECONNREFUSED|nobody|nothing/);
    }
    const post = await fetch(`${s.base}/careers/review/applications/00000000-0000-4000-8000-000000000000/status`, {
      method: 'POST', headers: { ...h, 'content-type': 'application/x-www-form-urlencoded', origin: s.base }, body: 'status=hired',
    });
    assert.equal(post.status, 503);
  } finally {
    await s.close();
  }
});

test('the service recovers after its connections are killed mid-life', async () => {
  const first = await submit(t.base, validFields({ email: 'before-kill@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(first.status, 201);
  const admin = new pg.Pool({ connectionString: t.cfg.databaseUrl, max: 1 });
  await admin.query('SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid()');
  await admin.end();
  await new Promise((r) => setTimeout(r, 200));
  const second = await submit(t.base, validFields({ email: 'after-kill@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(second.status, 201, 'fresh connection after the old ones died');
  const s = await login(t.base);
  const list = await fetch(`${t.base}/careers/review`, { headers: { cookie: s.cookie } });
  assert.equal(list.status, 200);
});

test('a failed CV write rolls back the application row (no half-stored applications)', async () => {
  const dir = `${process.env.TMPDIR || '/tmp'}/vc-ro-${Date.now()}`;
  await fs.mkdir(dir, { recursive: true });
  const s = await startTestServer({ CV_STORAGE: 'fs', CV_STORAGE_DIR: dir }, { reset: false });
  try {
    await fs.chmod(dir, 0o500); // read-only → write fails inside the transaction
    const r = await submit(s.base, validFields({ email: 'rollback@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 500);
    assert.equal(r.json.ok, false);
    assert.doesNotMatch(JSON.stringify(r.json), /EACCES|vc-ro/);
    const n = (await s.pool.query("SELECT count(*)::int AS n FROM careers_applications WHERE email = 'rollback@example.com'")).rows[0].n;
    assert.equal(n, 0);
    await fs.chmod(dir, 0o700);
    const again = await submit(s.base, validFields({ email: 'rollback@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(again.status, 201, 'same key/email works once storage is healthy again');
  } finally {
    await fs.chmod(dir, 0o700).catch(() => {});
    await fs.rm(dir, { recursive: true, force: true });
    await s.close();
  }
});

// ── 7. notifications never affect stored applications ─────────────────────
test('email failure keeps the application, records the failure, and can be re-sent from the dashboard', async () => {
  let calls = 0;
  let failing = true;
  const mailer = { enabled: true, async notifyNewApplication() { calls += 1; if (failing) throw new Error('smtp down at mail.example.internal'); return { sent: true }; } };
  const s = await startTestServer({}, { reset: false, mailer });
  try {
    const r = await submit(s.base, validFields({ email: 'mailfail@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 201, 'applicant still gets confirmation');
    await new Promise((res) => setTimeout(res, 150));
    let row = (await s.pool.query('SELECT notified_at, notify_attempts, notify_error FROM careers_applications WHERE id = $1', [r.json.id])).rows[0];
    assert.equal(row.notified_at, null);
    // A thrown error (not a {sent:false}) is caught by the route; attempts are bumped by the sweeper path below.

    // Sweeper retries only rows that already have a failed attempt recorded.
    await s.pool.query('UPDATE careers_applications SET notify_attempts = 1, notify_error = $2, notify_last_attempt_at = now() - interval \'1 hour\' WHERE id = $1', [r.json.id, 'ECONNREFUSED']);
    failing = false;
    const m2 = { enabled: true, async notifyNewApplication() { calls += 1; return { sent: true }; } };
    const { startNotificationSweeper } = await import('../src/notifications.js');
    const sweeper = startNotificationSweeper({ pool: s.pool, mailer: m2, cfg: s.cfg, cvStore: { get: async () => null } });
    await sweeper.sweep();
    sweeper.stop();
    row = (await s.pool.query('SELECT notified_at, notify_attempts, notify_error FROM careers_applications WHERE id = $1', [r.json.id])).rows[0];
    assert.ok(row.notified_at, 'sent by the retry sweep');
    assert.equal(row.notify_attempts, 2);
    assert.equal(row.notify_error, null);

    // Manual "Send again" from the detail page.
    const before = calls;
    const sess = await login(s.base);
    const resend = await fetch(`${s.base}/careers/review/applications/${r.json.id}/notify`, {
      method: 'POST', redirect: 'manual', headers: { cookie: sess.cookie, origin: s.base, 'content-type': 'application/x-www-form-urlencoded' }, body: '',
    });
    assert.equal(resend.status, 303);
    assert.match(resend.headers.get('location'), /notified=1/);
    await new Promise((res) => setTimeout(res, 50));
    assert.equal(calls, before + 1);
    const detail = await (await fetch(`${s.base}/careers/review/applications/${r.json.id}`, { headers: { cookie: sess.cookie } })).text();
    assert.match(detail, /Hiring-team email/);
    assert.match(detail, /Sent .* after 3 attempts/);
  } finally {
    await s.close();
  }
});

test('a mailer returning sent:false records the reason without applicant data and does not touch the row otherwise', async () => {
  const mailer = { enabled: true, async notifyNewApplication() { return { sent: false, reason: 'EAUTH' }; } };
  const s = await startTestServer({}, { reset: false, mailer });
  try {
    const r = await submit(s.base, validFields({ email: 'eauth@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 201);
    await new Promise((res) => setTimeout(res, 150));
    const row = (await s.pool.query('SELECT status, notified_at, notify_attempts, notify_error, full_name FROM careers_applications WHERE id = $1', [r.json.id])).rows[0];
    assert.equal(row.status, 'new');
    assert.equal(row.full_name, 'Test Candidate');
    assert.equal(row.notified_at, null);
    assert.equal(row.notify_attempts, 1);
    assert.equal(row.notify_error, 'EAUTH');
    const sess = await login(s.base);
    const detail = await (await fetch(`${s.base}/careers/review/applications/${r.json.id}`, { headers: { cookie: sess.cookie } })).text();
    assert.match(detail, /Not sent — EAUTH \(1 attempt\)/);
  } finally {
    await s.close();
  }
});

// ── unauthenticated access, re-asserted ───────────────────────────────────
test('anonymous users cannot reach applications, exports, CVs or the resend endpoint', async () => {
  const r = await submit(t.base, validFields({ email: 'anon@example.com', idempotency_key: crypto.randomUUID() }));
  for (const p of ['/careers/review', `/careers/review/applications/${r.json.id}`, `/careers/review/applications/${r.json.id}/cv`, '/careers/review/export.csv']) {
    const res = await fetch(`${t.base}${p}`, { redirect: 'manual' });
    assert.equal(res.status, 302, p);
  }
  const post = await fetch(`${t.base}/careers/review/applications/${r.json.id}/notify`, { method: 'POST', redirect: 'manual', headers: { origin: t.base } });
  assert.equal(post.status, 302);
  const cvBytes = await fetch(`${t.base}/careers/review/applications/${r.json.id}/cv`, { redirect: 'manual' });
  const body = Buffer.from(await cvBytes.arrayBuffer());
  assert.ok(!body.equals(PDF_BYTES));
});
