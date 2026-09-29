// Thin client for the careers API. Same-origin in production (Caddy proxies
// /api/careers/* to the Node service); Vite proxies it in dev.
const BASE = (import.meta.env.VITE_CAREERS_API_URL || '/api/careers').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status, errors, code, reference, retryAfterSec } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || {};
    this.code = code;
    this.reference = reference;
    this.retryAfterSec = retryAfterSec;
  }
}

const NETWORK_MESSAGE =
  "We couldn't reach our servers. Your details are still on this page — please check your connection and try again.";
const UNAVAILABLE_MESSAGE =
  'Applications cannot be submitted right now. Your details are still on this page — please try again shortly.';
const REFERENCE_RE = /^VC-[0-9A-F]{8}$/;

/**
 * Submit a FormData payload. Resolves ONLY when the server confirmed a stored
 * application (HTTP 201 with its id) or a verified idempotent retry of one
 * (HTTP 200, duplicate: true). Every other response rejects with ApiError.
 */
export async function submitApplication(formData, { signal } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/applications`, { method: 'POST', body: formData, signal, credentials: 'omit' });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(NETWORK_MESSAGE, { status: 0 });
  }

  let json = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { json = await res.json(); } catch { json = null; }
  }

  const stored = res.status === 201 && json && json.ok === true && typeof json.id === 'string' && REFERENCE_RE.test(json.reference || '');
  const idempotent = res.status === 200 && json && json.ok === true && json.duplicate === true && REFERENCE_RE.test(json.reference || '');
  if (stored || idempotent) {
    return { reference: json.reference, duplicate: Boolean(idempotent) };
  }

  if (!json) {
    // HTML 404/502 from the static host = API not deployed / unreachable.
    throw new ApiError(UNAVAILABLE_MESSAGE, { status: res.status });
  }
  throw new ApiError(json.message || 'Something went wrong. Please try again.', {
    status: res.status,
    errors: json.errors,
    code: json.code,
    reference: json.reference,
    retryAfterSec: json.retryAfterSec,
  });
}
