// Notification recovery: restarts between commit and send, SMTP configured
// after applications were collected, abandoned claims, and no double sends.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { startTestServer, submit, validFields } from './helpers.js';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const countingMailer = () => {
  const m = { enabled: true, calls: [], async notifyNewApplication(app) { m.calls.push(app.id); return { sent: true }; } };
  return m;
};
const pending = (pool) => pool.query('SELECT id, notified_at, notify_attempts, notify_error FROM careers_applications ORDER BY created_at');

test('restart after commit but before the send: the row is recovered after the grace period, exactly once', async () => {
  // Process A: the application commits, then the process dies before any send
  // (same DB state as "mailer never reached": attempts 0, no claim).
  const a = await startTestServer({}, { mailer: { enabled: false, async notifyNewApplication() { throw new Error('unreachable'); } } });
  const r = await submit(a.base, validFields({ email: 'restart@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(r.status, 201);
  let row = (await pending(a.pool)).rows[0];
  assert.equal(row.notify_attempts, 0);
  assert.equal(row.notified_at, null);
  await a.close();

  // Process B boots with SMTP working and a 2 s grace period.
  const mailer = countingMailer();
  const b = await startTestServer({ NOTIFY_GRACE_SECONDS: '2' }, { reset: false, mailer });
  try {
    const early = await b.sweeper.sweep();
    assert.equal(early.candidates, 0, 'inside the grace period nothing is touched');
    assert.equal(mailer.calls.length, 0);

    await sleep(2200);
    const late = await b.sweeper.sweep();
    assert.equal(late.sent, 1);
    assert.deepEqual(mailer.calls, [r.json.id]);
    row = (await pending(b.pool)).rows[0];
    assert.ok(row.notified_at);
    assert.equal(row.notify_attempts, 1);
    assert.equal(row.notify_error, null);

    const again = await b.sweeper.sweep();
    assert.equal(again.candidates, 0, 'sent rows are never re-swept');
    assert.equal(mailer.calls.length, 1);
  } finally {
    await b.close();
  }
});

test('process dies mid-send: the abandoned claim expires and the sweeper re-sends', async () => {
  const hanging = { enabled: true, notifyNewApplication: () => new Promise(() => {}) }; // never resolves
  const a = await startTestServer({}, { mailer: hanging });
  const r = await submit(a.base, validFields({ email: 'midsend@example.com', idempotency_key: crypto.randomUUID() }));
  assert.equal(r.status, 201);
  await sleep(100);
  let row = (await pending(a.pool)).rows[0];
  assert.equal(row.notify_attempts, 1, 'claimed by the in-flight send');
  assert.equal(row.notified_at, null);
  await a.close(); // the hanging send is abandoned with the process

  const mailer = countingMailer();
  const b = await startTestServer({ NOTIFY_CLAIM_SECONDS: '1', NOTIFY_SWEEP_MINUTES: '0' }, { reset: false, mailer });
  try {
    const tooSoon = await b.sweeper.sweep();
    assert.equal(tooSoon.sent, 0, 'claim still fresh → not re-sent');
    assert.equal(tooSoon.candidates, 0, 'an active claim is not even listed');
    assert.equal(mailer.calls.length, 0);
    await sleep(1200);
    const s = await b.sweeper.sweep();
    assert.equal(s.sent, 1);
    row = (await pending(b.pool)).rows[0];
    assert.ok(row.notified_at);
    assert.equal(row.notify_attempts, 2);
    assert.deepEqual(mailer.calls, [r.json.id]);
  } finally {
    await b.close();
  }
});

test('SMTP enabled after applications were collected: pending rows under 7 days are sent once; older rows are left alone', async () => {
  const off = await startTestServer({}, { mailer: { enabled: false } });
  assert.equal(off.sweeper, null, 'no sweeper while mail is off');
  const ids = [];
  for (const e of ['one', 'two', 'three']) {
    const r = await submit(off.base, validFields({ email: `${e}@example.com`, idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 201);
    ids.push(r.json.id);
  }
  const old = await submit(off.base, validFields({ email: 'old@example.com', idempotency_key: crypto.randomUUID() }));
  await off.pool.query("UPDATE careers_applications SET created_at = now() - interval '8 days' WHERE id = $1", [old.json.id]);
  for (const row of (await pending(off.pool)).rows) assert.equal(row.notify_attempts, 0);
  await off.close();

  // Operator adds SMTP settings and restarts the service.
  const mailer = countingMailer();
  const on = await startTestServer({ NOTIFY_GRACE_SECONDS: '0' }, { reset: false, mailer });
  try {
    const s = await on.sweeper.sweep();
    assert.equal(s.candidates, 3);
    assert.equal(s.sent, 3);
    assert.deepEqual([...mailer.calls].sort(), [...ids].sort());
    const rows = (await pending(on.pool)).rows;
    const oldRow = rows.find((x) => x.id === old.json.id);
    assert.equal(oldRow.notify_attempts, 0);
    assert.equal(oldRow.notified_at, null);
    for (const x of rows.filter((x) => x.id !== old.json.id)) {
      assert.ok(x.notified_at);
      assert.equal(x.notify_attempts, 1);
    }
    const s2 = await on.sweeper.sweep();
    assert.equal(s2.candidates, 0);
    assert.equal(mailer.calls.length, 3);

    // A new application under the running process is sent by the request
    // handler, and the next sweep does not send it again.
    const fresh = await submit(on.base, validFields({ email: 'fresh@example.com', idempotency_key: crypto.randomUUID() }));
    await sleep(100);
    const s3 = await on.sweeper.sweep();
    assert.equal(s3.sent, 0);
    assert.equal(mailer.calls.filter((id) => id === fresh.json.id).length, 1);
  } finally {
    await on.close();
  }
});

test('sweeper racing the request handler: the per-row claim allows exactly one send', async () => {
  const mailer = { enabled: true, calls: [], async notifyNewApplication(app) { mailer.calls.push(app.id); await sleep(250); return { sent: true }; } };
  const s = await startTestServer({ NOTIFY_GRACE_SECONDS: '0' }, { mailer });
  try {
    const r = await submit(s.base, validFields({ email: 'race@example.com', idempotency_key: crypto.randomUUID() }));
    assert.equal(r.status, 201);
    // The handler's send is in flight (250 ms). Sweep repeatedly meanwhile.
    const [first, second] = await Promise.all([s.sweeper.sweep(), s.sweeper.sweep()]);
    assert.equal(second.skipped, true, 'overlapping in-process sweeps are coalesced');
    assert.equal(first.sent, 0, 'row is claimed by the handler → sweeper refuses it');
    await sleep(120);
    assert.equal((await s.sweeper.sweep()).sent, 0);
    await sleep(400);
    const later = await s.sweeper.sweep();
    assert.equal(later.sent, 0);
    assert.deepEqual(mailer.calls, [r.json.id], 'exactly one email');
    const row = (await pending(s.pool)).rows[0];
    assert.equal(row.notify_attempts, 1);
    assert.ok(row.notified_at);
  } finally {
    await s.close();
  }
});

test('a reviewer "Send again" still works after success and counts as another attempt', async () => {
  const mailer = countingMailer();
  const s = await startTestServer({}, { mailer });
  try {
    const r = await submit(s.base, validFields({ email: 'again@example.com', idempotency_key: crypto.randomUUID() }));
    await sleep(100);
    const { attemptNotification } = await import('../src/notifications.js');
    const blocked = await attemptNotification({ pool: s.pool, mailer, cfg: s.cfg, app: { id: r.json.id } });
    assert.equal(blocked.skipped, true, 'non-forced send after success is a no-op');
    const forced = await attemptNotification({ pool: s.pool, mailer, cfg: s.cfg, app: { id: r.json.id }, force: true });
    assert.equal(forced.sent, true);
    assert.equal(mailer.calls.length, 2);
    const row = (await pending(s.pool)).rows[0];
    assert.equal(row.notify_attempts, 2);
  } finally {
    await s.close();
  }
});
