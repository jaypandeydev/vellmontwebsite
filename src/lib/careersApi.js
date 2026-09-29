// Thin client for the careers API. Same-origin in production (Caddy proxies
// /api/careers/* to the Node service); Vite proxies it in dev.
const BASE = (import.meta.env.VITE_CAREERS_API_URL || '/api/careers').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status, errors, code, reference } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors || {};
    this.code = code;
    this.reference = reference;
  }
}

const NETWORK_MESSAGE =
  "We couldn't reach our servers. Your details are still on this page — please check your connection and try again.";

/**
 * Submit a FormData payload. Resolves with { reference } only when the server
 * confirmed storage (HTTP 201) or reported an identical earlier submission.
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

  if (res.ok && json && json.ok && json.reference) {
    return { reference: json.reference, duplicate: Boolean(json.duplicate) };
  }

  if (!json) {
    // 404/502 HTML from the static host = API not deployed / not reachable.
    throw new ApiError(
      'Applications cannot be submitted right now. Your details are still on this page — please try again shortly.',
      { status: res.status }
    );
  }
  throw new ApiError(json.message || 'Something went wrong. Please try again.', {
    status: res.status,
    errors: json.errors,
    code: json.code,
    reference: json.reference,
  });
}
