// Central environment parsing. The service refuses to start when anything
// required is missing, so a half-configured deployment can never silently
// accept applications it cannot store.

export function loadConfig(env = process.env) {
  const cfg = {
    nodeEnv: env.NODE_ENV || 'development',
    port: Number(env.PORT || 4010),
    host: env.HOST || '127.0.0.1',
    databaseUrl: env.DATABASE_URL || '',
    databaseSsl: env.DATABASE_SSL === '1',
    sessionSecret: env.SESSION_SECRET || '',
    reviewUsername: env.REVIEW_USERNAME || '',
    reviewPasswordHash: env.REVIEW_PASSWORD_HASH || '',
    sessionTtlHours: Number(env.SESSION_TTL_HOURS || 12),
    cvStorage: env.CV_STORAGE || 'db', // 'db' (bytea in Postgres) or 'fs' (private directory)
    cvStorageDir: env.CV_STORAGE_DIR || '',
    publicBaseUrl: (env.PUBLIC_BASE_URL || 'https://vellmontservices.com').replace(/\/$/, ''),
    trustProxy: env.TRUST_PROXY === '1',
    cookieSecure: env.COOKIE_SECURE ? env.COOKIE_SECURE === '1' : (env.NODE_ENV === 'production'),
    ipHashSalt: env.IP_HASH_SALT || env.SESSION_SECRET || '',
    notifyEmail: env.NOTIFY_EMAIL || '',
    notifyAttachCv: env.NOTIFY_ATTACH_CV === '1',
    smtp: {
      host: env.SMTP_HOST || '',
      port: Number(env.SMTP_PORT || 587),
      user: env.SMTP_USER || '',
      pass: env.SMTP_PASS || '',
      from: env.SMTP_FROM || '',
      secure: env.SMTP_SECURE === '1',
    },
    turnstileSecret: env.TURNSTILE_SECRET_KEY || '',
    rateLimit: {
      // Every POST attempt counts (valid or not), measured before the upload
      // is parsed. Genuine applicants rarely need more than a few tries.
      attemptsPer15Min: Number(env.RATE_ATTEMPTS_PER_15MIN || 8),
      attemptsPerDay: Number(env.RATE_ATTEMPTS_PER_DAY || 30),
      loginPer15Min: Number(env.RATE_LOGIN_PER_15MIN || 10),
    },
    notifyRetry: {
      maxAttempts: Number(env.NOTIFY_MAX_ATTEMPTS || 5),
      sweepIntervalMinutes: Number(env.NOTIFY_SWEEP_MINUTES || 10),
    },
    dbConnectTimeoutMs: Number(env.DB_CONNECT_TIMEOUT_MS || 5000),
    dbQueryTimeoutMs: Number(env.DB_QUERY_TIMEOUT_MS || 15000),
    minFormSeconds: Number(env.MIN_FORM_SECONDS || 4),
    duplicateWindowMinutes: Number(env.DUPLICATE_WINDOW_MINUTES || 60),
  };

  const missing = [];
  if (!cfg.databaseUrl) missing.push('DATABASE_URL');
  if (!cfg.sessionSecret || cfg.sessionSecret.length < 32) missing.push('SESSION_SECRET (at least 32 random characters)');
  if (!cfg.reviewUsername) missing.push('REVIEW_USERNAME');
  if (!cfg.reviewPasswordHash) missing.push('REVIEW_PASSWORD_HASH (run: npm run hash-password)');
  if (!['db', 'fs'].includes(cfg.cvStorage)) missing.push("CV_STORAGE must be 'db' or 'fs'");
  if (cfg.cvStorage === 'fs' && !cfg.cvStorageDir) missing.push('CV_STORAGE_DIR (required when CV_STORAGE=fs)');

  cfg.mailConfigured = Boolean(cfg.smtp.host && cfg.smtp.from && cfg.notifyEmail);
  cfg.missing = missing;
  return cfg;
}
