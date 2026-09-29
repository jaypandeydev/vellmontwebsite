import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const COOKIE = 'vc_review';
export const COOKIE_PATH = '/careers/review';

// ── password hashing: scrypt$N$r$p$salt$hash (base64url) ──────────────────
export function hashPassword(password, { N = 16384, r = 8, p = 1 } = {}) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N, r, p });
  return ['scrypt', N, r, p, salt.toString('base64url'), hash.toString('base64url')].join('$');
}

export function verifyPassword(password, stored) {
  try {
    const [alg, N, r, p, saltB64, hashB64] = String(stored).split('$');
    if (alg !== 'scrypt') return false;
    const salt = Buffer.from(saltB64, 'base64url');
    const expected = Buffer.from(hashB64, 'base64url');
    const actual = scryptSync(String(password), salt, expected.length, { N: Number(N), r: Number(r), p: Number(p) });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function safeEqualStr(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

// ── signed, expiring session tokens (stateless) ───────────────────────────
function sign(payloadB64, secret) {
  return createHmac('sha256', secret).update(payloadB64).digest('base64url');
}

export function createSessionToken({ username, ttlHours, secret, now = Date.now() }) {
  const payload = { u: username, iat: now, exp: now + ttlHours * 3600 * 1000, n: randomBytes(8).toString('base64url') };
  const b64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${b64}.${sign(b64, secret)}`;
}

export function readSessionToken(token, secret, now = Date.now()) {
  if (!token || typeof token !== 'string') return null;
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;
  if (!safeEqualStr(sig, sign(b64, secret))) return null;
  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (!payload.u || !payload.exp || payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const v = part.slice(i + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export function sessionCookie(token, cfg, { clear = false } = {}) {
  const parts = [
    `${COOKIE}=${clear ? '' : encodeURIComponent(token)}`,
    `Path=${COOKIE_PATH}`,
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (cfg.cookieSecure) parts.push('Secure');
  parts.push(clear ? 'Max-Age=0' : `Max-Age=${cfg.sessionTtlHours * 3600}`);
  return parts.join('; ');
}

export function getSession(req, cfg) {
  const cookies = parseCookies(req.headers.cookie);
  return readSessionToken(cookies[COOKIE], cfg.sessionSecret);
}

export function checkCredentials(cfg, username, password) {
  // Always run the hash so timing does not reveal whether the username matched.
  const passOk = verifyPassword(password || '', cfg.reviewPasswordHash);
  const userOk = safeEqualStr(username || '', cfg.reviewUsername);
  return passOk && userOk;
}

// CSRF defence for state-changing dashboard requests: SameSite=Strict cookie
// plus an explicit same-origin check on Origin / Sec-Fetch-Site headers.
export function isSameOriginRequest(req) {
  const site = req.headers['sec-fetch-site'];
  if (site && !['same-origin', 'none'].includes(site)) return false;
  const origin = req.headers.origin;
  if (origin) {
    let host;
    try { host = new URL(origin).host; } catch { return false; }
    if (host !== req.headers.host) return false;
  }
  return true;
}
