// Small in-memory sliding-window limiter. Good enough for a single-process
// service behind Caddy. Keys are hashed IPs, never applicant identities.

export function createLimiter({ windowMs, max }) {
  const hits = new Map(); // key -> number[] timestamps

  function prune(now) {
    if (hits.size < 5000) return;
    for (const [k, arr] of hits) {
      const kept = arr.filter((t) => now - t < windowMs);
      if (kept.length) hits.set(k, kept);
      else hits.delete(k);
    }
  }

  return {
    /** Returns { allowed, retryAfterSec } and records the hit when allowed. */
    hit(key, now = Date.now()) {
      prune(now);
      const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
      if (arr.length >= max) {
        const retryAfterSec = Math.ceil((arr[0] + windowMs - now) / 1000);
        hits.set(key, arr);
        return { allowed: false, retryAfterSec: Math.max(1, retryAfterSec) };
      }
      arr.push(now);
      hits.set(key, arr);
      return { allowed: true, retryAfterSec: 0 };
    },
    /** Peek without recording. */
    check(key, now = Date.now()) {
      const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
      return arr.length < max;
    },
    reset() {
      hits.clear();
    },
  };
}
