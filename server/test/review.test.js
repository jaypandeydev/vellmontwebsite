import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, submit, validFields, login, PDF_BYTES } from './helpers.js';

let t;
let appId;
let reference;
before(async () => {
  t = await startTestServer();
  const r = await submit(t.base, validFields({ email: 'review@example.com', idempotency_key: crypto.randomUUID() }));
  appId = r.json.id;
  reference = r.json.reference;
});
after(async () => { await t.close(); });

test('dashboard, detail and CV are not accessible without a session', async () => {
  for (const p of ['/careers/review', `/careers/review/applications/${appId}`, `/careers/review/applications/${appId}/cv`, '/careers/review/export.csv']) {
    const res = await fetch(`${t.base}${p}`, { redirect: 'manual' });
    assert.equal(res.status, 302, p);
    assert.match(res.headers.get('location'), /\/careers\/review\/login/);
    assert.equal(res.headers.get('cache-control'), 'private, no-store');
  }
});

test('wrong password is refused and rate-limited; forged cookie is ignored', async () => {
  const bad = await login(t.base, 'reviewer', 'wrong-password-here');
  assert.equal(bad.status, 401);
  assert.equal(bad.cookie, '');
  const forged = await fetch(`${t.base}/careers/review`, { redirect: 'manual', headers: { cookie: 'vc_review=eyJ1IjoicmV2aWV3ZXIifQ.abc' } });
  assert.equal(forged.status, 302);

  const s = await startTestServer({ RATE_LOGIN_PER_15MIN: '2' }, { reset: false });
  try {
    await login(s.base, 'reviewer', 'nope-nope-nope');
    await login(s.base, 'reviewer', 'nope-nope-nope');
    const third = await login(s.base, 'reviewer', 'nope-nope-nope');
    assert.equal(third.status, 429);
  } finally {
    await s.close();
  }
});

test('cross-site POST to login is blocked', async () => {
  const res = await fetch(`${t.base}/careers/review/login`, {
    method: 'POST', redirect: 'manual',
    headers: { 'content-type': 'application/x-www-form-urlencoded', origin: 'https://evil.example' },
    body: 'username=reviewer&password=x',
  });
  assert.equal(res.status, 403);
});

test('reviewer can sign in, list, open, download the CV, change status and export', async () => {
  const s = await login(t.base);
  assert.equal(s.status, 302);
  assert.match(s.cookie, /^vc_review=/);
  const h = { cookie: s.cookie };

  const list = await fetch(`${t.base}/careers/review`, { headers: h });
  assert.equal(list.status, 200);
  const listHtml = await list.text();
  assert.match(listHtml, /Test Candidate/);
  assert.match(listHtml, /linkedin · frontend_hiring/);
  assert.match(listHtml, /<meta name="robots" content="noindex,nofollow">/);

  const detail = await fetch(`${t.base}/careers/review/applications/${appId}`, { headers: h });
  assert.equal(detail.status, 200);
  const detailHtml = await detail.text();
  assert.match(detailHtml, new RegExp(reference));
  assert.match(detailHtml, /review@example\.com/);

  const cv = await fetch(`${t.base}/careers/review/applications/${appId}/cv`, { headers: h });
  assert.equal(cv.status, 200);
  assert.equal(cv.headers.get('content-type'), 'application/pdf');
  assert.match(cv.headers.get('content-disposition'), /attachment; filename="My CV.pdf"/);
  assert.equal(cv.headers.get('x-content-type-options'), 'nosniff');
  const bytes = Buffer.from(await cv.arrayBuffer());
  assert.ok(bytes.equals(PDF_BYTES), 'downloaded CV matches the uploaded bytes');

  const upd = await fetch(`${t.base}/careers/review/applications/${appId}/status`, {
    method: 'POST', redirect: 'manual',
    headers: { ...h, 'content-type': 'application/x-www-form-urlencoded', origin: t.base },
    body: new URLSearchParams({ status: 'shortlisted', note: 'Strong portfolio' }).toString(),
  });
  assert.equal(upd.status, 303);
  const row = (await t.pool.query('SELECT status FROM careers_applications WHERE id = $1', [appId])).rows[0];
  assert.equal(row.status, 'shortlisted');
  const events = (await t.pool.query('SELECT from_status, to_status, note, actor FROM careers_status_events WHERE application_id = $1 ORDER BY id', [appId])).rows;
  assert.deepEqual(events.map((e) => e.to_status), ['new', 'shortlisted']);
  assert.equal(events[1].note, 'Strong portfolio');
  assert.equal(events[1].actor, 'reviewer');

  const badStatus = await fetch(`${t.base}/careers/review/applications/${appId}/status`, {
    method: 'POST', redirect: 'manual',
    headers: { ...h, 'content-type': 'application/x-www-form-urlencoded', origin: t.base },
    body: 'status=deleted',
  });
  assert.equal(badStatus.status, 400);

  const csv = await fetch(`${t.base}/careers/review/export.csv?status=shortlisted`, { headers: h });
  assert.equal(csv.status, 200);
  const text = await csv.text();
  assert.match(text, /review@example\.com/);
  assert.match(text, /Shortlisted/);

  const filtered = await fetch(`${t.base}/careers/review?status=hired`, { headers: h });
  assert.match(await filtered.text(), /No applications match/);

  const out = await fetch(`${t.base}/careers/review/logout`, { method: 'POST', redirect: 'manual', headers: { ...h, origin: t.base } });
  assert.equal(out.status, 302);
  assert.match(out.headers.get('set-cookie'), /Max-Age=0/);
});

test('unknown ids 404 and never leak other data', async () => {
  const s = await login(t.base);
  const res = await fetch(`${t.base}/careers/review/applications/00000000-0000-4000-8000-000000000000/cv`, { headers: { cookie: s.cookie } });
  assert.equal(res.status, 404);
  const junk = await fetch(`${t.base}/careers/review/applications/../../etc/passwd`, { headers: { cookie: s.cookie } });
  assert.notEqual(junk.status, 200);
});
