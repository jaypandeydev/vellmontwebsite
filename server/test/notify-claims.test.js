// Claim ownership: manual re-sends, races, expiry and stale results.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, submit, validFields, login } from './helpers.js';
import { attemptNotification } from '../src/notifications.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const row = async (pool, id) => (await pool.query('SELECT notified_at, notify_attempts, notify_error, notify_claim_id FROM careers_applications WHERE id = $1', [id])).rows[0];

function slowMailer(ms) {
  const m = { enabled: true, calls: 0, async notifyNewApplication() { m.calls += 1; await sleep(ms); return { sent: true }; } };
  return m;
}

async function resend(base, cookie, id) {
  const res = await fetch(`${base}/careers/review/applications/${id}/notify`, {
    method: 'POST', redirect: 'manual',
    headers: { cookie, origin: base, 'content-type': 'application/x-www-form-urlencoded' }, body: '',
  });
  return { status: res.status, location: res.headers.get('location') || '' };
}

test('1. two simultaneous "Send again" clicks start exactly one send', async () => {
  const mailer = slowMailer(250);
  const s = await startTestServer({}, { mailer });
  try {
    const r = await submit(s.base, validFields({ email: 'twice@example.com', idempotency_key: crypto.randomUUID() }));
    await sleep(400); // initial send done → notified
    assert.equal(mailer.calls, 1);
    const sess = await login(s.base);
    const [a, b] = await Promise.all([resend(s.base, sess.cookie, r.json.id), resend(s.base, sess.cookie, r.json.id)]);
    const outcomes = [a.location, b.location].map((l) => l.split('notified=')[1]).sort();
    assert.deepEqual(outcomes, ['1', 'busy']);
    assert.equal(mailer.calls, 2, 'one new send, not two');
    const x = await row(s.pool, r.json.id);
    assert.equal(x.notify_attempts, 2);
    assert.equal(x.notify_claim_id, null, 'claim released after completion');
    const detail = await (await fetch(`${s.base}${[a, b].find((o) => o.location.includes('busy')).location}`, { headers: { cookie: sess.cookie } })).text();
    assert.match(detail, /already being sent/);
  } finally {
    await s.close();
  }
});

test('2. manual resend racing the sweeper starts exactly one send', async () => {
  // Row collected while mail was off → pending with zero attempts.
  const off = await startTestServer({}, { mailer: { enabled: false } });
  const r = await submit(off.base, validFields({ email: 'racing@example.com', idempotency_key: crypto.randomUUID() }));
  await off.close();

  const mailer = slowMailer(250);
  const s = await startTestServer({ NOTIFY_GRACE_SECONDS: '0' }, { reset: false, mailer });
  try {
    const sess = await login(s.base);
    const [sweep, manual] = await Promise.all([s.sweeper.sweep(), sleep(20).then(() => resend(s.base, sess.cookie, r.json.id))]);
    assert.equal(mailer.calls, 1);
    assert.equal(sweep.sent + (manual.location.includes('notified=1') ? 1 : 0), 1, 'exactly one of them sent');
    assert.ok(sweep.skipped === 1 || manual.location.includes('notified=busy'), 'the other was refused');
    const x = await row(s.pool, r.json.id);
    assert.ok(x.notified_at);
    assert.equal(x.notify_attempts, 1);
    assert.equal(x.notify_claim_id, null);
  } finally {
    await s.close();
  }
});

test('3. manual resend of an already-notified application (prior claim complete) allows one new send', async () => {
  const mailer = slowMailer(10);
  const s = await startTestServer({}, { mailer });
  try {
    const r = await submit(s.base, validFields({ email: 'done@example.com', idempotency_key: crypto.randomUUID() }));
    await sleep(150);
    const before = await row(s.pool, r.json.id);
    assert.ok(before.notified_at);
    assert.equal(before.notify_claim_id, null);
    // Non-forced senders (sweeper path) must still refuse a notified row…
    const auto = await attemptNotification({ pool: s.pool, mailer, cfg: s.cfg, app: { id: r.json.id } });
    assert.equal(auto.skipped, true);
    // …while the reviewer's forced resend goes through once.
    const sess = await login(s.base);
    const m = await resend(s.base, sess.cookie, r.json.id);
    assert.match(m.location, /notified=1/);
    assert.equal(mailer.calls, 2);
    const after = await row(s.pool, r.json.id);
    assert.equal(after.notify_attempts, 2);
    assert.ok(after.notified_at > before.notified_at);
    assert.equal(after.notify_claim_id, null);
  } finally {
    await s.close();
  }
});

test('4. an expired claim from a dead process is recovered by the next sender (sweeper or manual)', async () => {
  const mailer = slowMailer(10);
  const s = await startTestServer({ NOTIFY_CLAIM_SECONDS: '60', NOTIFY_SWEEP_MINUTES: '0', NOTIFY_GRACE_SECONDS: '0' }, { mailer: { enabled: false } });
  const r = await submit(s.base, validFields({ email: 'dead@example.com', idempotency_key: crypto.randomUUID() }));
  await s.close();
  const live = await startTestServer({ NOTIFY_CLAIM_SECONDS: '60', NOTIFY_SWEEP_MINUTES: '0', NOTIFY_GRACE_SECONDS: '0' }, { reset: false, mailer });
  try {
    // Simulate a process that claimed and died: token set, timestamp fresh.
    await live.pool.query("UPDATE careers_applications SET notify_claim_id = 'dead-process', notify_attempts = 1, notify_last_attempt_at = now() WHERE id = $1", [r.json.id]);
    const fresh = await live.sweeper.sweep();
    assert.equal(fresh.candidates, 0, 'unexpired claim is respected');
    const sess = await login(live.base);
    const m = await resend(live.base, sess.cookie, r.json.id);
    assert.match(m.location, /notified=busy/, 'force does not override an active claim');
    assert.equal(mailer.calls, 0);

    // Now the claim is older than NOTIFY_CLAIM_SECONDS → abandoned.
    await live.pool.query("UPDATE careers_applications SET notify_last_attempt_at = now() - interval '10 minutes' WHERE id = $1", [r.json.id]);
    const sw = await live.sweeper.sweep();
    assert.equal(sw.sent, 1);
    assert.equal(mailer.calls, 1);
    const x = await row(live.pool, r.json.id);
    assert.ok(x.notified_at);
    assert.equal(x.notify_attempts, 2);
    assert.equal(x.notify_claim_id, null);
  } finally {
    await live.close();
  }
});

test('5. a stale sender finishing after its claim was replaced cannot overwrite the newer state', async () => {
  // First call hangs until we release it; later calls succeed immediately.
  let release;
  let calls = 0;
  const mailer = {
    enabled: true,
    notifyNewApplication() {
      calls += 1;
      if (calls === 1) return new Promise((resolve) => { release = resolve; });
      return Promise.resolve({ sent: true });
    },
  };
  const s = await startTestServer({ NOTIFY_CLAIM_SECONDS: '1', NOTIFY_SWEEP_MINUTES: '0', NOTIFY_GRACE_SECONDS: '0' }, { mailer });
  try {
    const r = await submit(s.base, validFields({ email: 'stale@example.com', idempotency_key: crypto.randomUUID() }));
    await sleep(100);
    let x = await row(s.pool, r.json.id);
    assert.equal(x.notify_attempts, 1);
    assert.ok(x.notify_claim_id, 'handler holds the claim');
    const staleToken = x.notify_claim_id;

    await sleep(1200); // claim expires while the first send is still "in flight"
    const sw = await s.sweeper.sweep();
    assert.equal(sw.sent, 1, 'sweeper takes over and succeeds');
    x = await row(s.pool, r.json.id);
    const newerNotifiedAt = x.notified_at;
    assert.ok(newerNotifiedAt);
    assert.equal(x.notify_attempts, 2);
    assert.equal(x.notify_claim_id, null);
    assert.notEqual(staleToken, null);

    // The stale first send now finishes with a FAILURE: it must not touch the row.
    release({ sent: false, reason: 'STALE-FAIL' });
    await sleep(100);
    x = await row(s.pool, r.json.id);
    assert.equal(x.notify_error, null, 'stale failure dropped');
    assert.equal(String(x.notified_at), String(newerNotifiedAt));
    assert.equal(x.notify_attempts, 2);

    // Mirror case: newer sender FAILED, stale sender reports success → row stays "not sent".
    calls = 0;
    const failing = { enabled: true, async notifyNewApplication() { return { sent: false, reason: 'EAUTH' }; } };
    const r2 = await submit(s.base, validFields({ email: 'stale2@example.com', idempotency_key: crypto.randomUUID() }));
    await sleep(100); // first (hanging) call has the claim
    await sleep(1200);
    const takeover = await attemptNotification({ pool: s.pool, mailer: failing, cfg: s.cfg, app: { id: r2.json.id } });
    assert.equal(takeover.sent, false);
    release({ sent: true });
    await sleep(100);
    const y = await row(s.pool, r2.json.id);
    assert.equal(y.notified_at, null, 'stale success cannot mark it sent');
    assert.equal(y.notify_error, 'EAUTH');
    assert.equal(y.notify_attempts, 2);
  } finally {
    await s.close();
  }
});
