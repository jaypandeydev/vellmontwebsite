import { createHash } from 'node:crypto';

// Honeypot + minimum-fill-time + optional Cloudflare Turnstile.
// Nothing here logs or stores applicant data.

export function hashIp(ip, salt) {
  return createHash('sha256').update(`${salt}|${ip || ''}`).digest('hex').slice(0, 32);
}

export function honeypotTripped(body) {
  const v = body.website; // hidden field; humans never fill it
  return typeof v === 'string' ? v.trim().length > 0 : Array.isArray(v) && v.some((x) => String(x).trim());
}

export function filledTooFast(body, minSeconds) {
  const ms = Number(Array.isArray(body.form_elapsed_ms) ? body.form_elapsed_ms[0] : body.form_elapsed_ms);
  if (!Number.isFinite(ms)) return true;
  return ms < minSeconds * 1000;
}

export async function verifyTurnstile(secret, token, ip, fetchImpl = fetch) {
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: 'missing-token' };
  try {
    const params = new URLSearchParams({ secret, response: String(token) });
    if (ip) params.set('remoteip', ip);
    const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });
    const json = await res.json();
    return { ok: Boolean(json.success), reason: json.success ? undefined : 'rejected' };
  } catch {
    return { ok: false, reason: 'verify-failed' };
  }
}
