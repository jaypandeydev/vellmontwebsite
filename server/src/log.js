// Structured, privacy-safe logging. Never pass applicant fields or file
// contents into these helpers — only ids, counts, status codes and timings.
function emit(level, msg, fields) {
  const line = { t: new Date().toISOString(), level, msg, ...(fields || {}) };
  const out = JSON.stringify(line);
  if (level === 'error') process.stderr.write(out + '\n');
  else process.stdout.write(out + '\n');
}

export const log = {
  info: (msg, fields) => emit('info', msg, fields),
  warn: (msg, fields) => emit('warn', msg, fields),
  error: (msg, fields) => emit('error', msg, fields),
};

// Reduce an Error to something safe to log (no request bodies).
export function errSummary(err) {
  if (!err) return undefined;
  return { name: err.name, code: err.code, message: String(err.message || '').slice(0, 200) };
}
