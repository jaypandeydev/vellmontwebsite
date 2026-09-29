import pg from 'pg';
import { log, errSummary } from './log.js';

const { Pool } = pg;

export function createPool(cfg) {
  const pool = new Pool({
    connectionString: cfg.databaseUrl,
    ssl: cfg.databaseSsl ? { rejectUnauthorized: true } : undefined,
    max: 5,
    connectionTimeoutMillis: cfg.dbConnectTimeoutMs,
    query_timeout: cfg.dbQueryTimeoutMs,
    statement_timeout: cfg.dbQueryTimeoutMs,
  });
  // An idle client that errors (server restart, network blip) would otherwise
  // throw on the pool and take the process down. Log and let pg discard it.
  pool.on('error', (err) => log.error('db.idle_client_error', { err: errSummary(err) }));
  return pool;
}

// Errors that mean "the database is unavailable right now" rather than a bug.
export function isDbUnavailable(err) {
  if (!err) return false;
  const code = String(err.code || '');
  if (['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'EAI_AGAIN', 'EPIPE'].includes(code)) return true;
  if (code.startsWith('08') || code === '57P01' || code === '57P02' || code === '57P03' || code === '53300' || code === '57014') return true;
  const msg = String(err.message || '').toLowerCase();
  return msg.includes('timeout exceeded when trying to connect') || msg.includes('query read timeout') || msg.includes('connection terminated');
}

// Idempotent schema setup. Runs on every boot; safe to re-run.
export async function migrate(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS careers_applications (
      id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      created_at          timestamptz NOT NULL DEFAULT now(),
      idempotency_key     text UNIQUE,
      full_name           text NOT NULL,
      email               text NOT NULL,
      phone               text NOT NULL,
      city                text NOT NULL,
      country             text NOT NULL,
      department          text NOT NULL,
      role                text NOT NULL,
      role_other          text,
      brand               text NOT NULL,
      experience_band     text NOT NULL,
      skills              text NOT NULL,
      notice_period       text NOT NULL,
      linkedin_url        text,
      portfolio_url       text,
      introduction        text,
      astro_specialisations text[],
      astro_languages     text[],
      astro_experience    text,
      astro_availability  text,
      consent_at          timestamptz NOT NULL,
      status              text NOT NULL DEFAULT 'new',
      status_updated_at   timestamptz,
      reviewer_notes      text,
      source              jsonb NOT NULL DEFAULT '{}'::jsonb,
      cv_filename         text NOT NULL,
      cv_mime             text NOT NULL,
      cv_size             integer NOT NULL,
      cv_sha256           text NOT NULL,
      cv_storage          text NOT NULL,
      cv_path             text,
      notified_at         timestamptz,
      notify_error        text,
      submit_ip_hash      text
    );
    CREATE INDEX IF NOT EXISTS careers_applications_created_idx ON careers_applications (created_at DESC);
    CREATE INDEX IF NOT EXISTS careers_applications_status_idx ON careers_applications (status);
    CREATE INDEX IF NOT EXISTS careers_applications_email_role_idx ON careers_applications (lower(email), role, created_at DESC);

    CREATE TABLE IF NOT EXISTS careers_cv_blobs (
      application_id uuid PRIMARY KEY REFERENCES careers_applications(id) ON DELETE CASCADE,
      data           bytea NOT NULL
    );

    CREATE TABLE IF NOT EXISTS careers_status_events (
      id             bigserial PRIMARY KEY,
      application_id uuid NOT NULL REFERENCES careers_applications(id) ON DELETE CASCADE,
      at             timestamptz NOT NULL DEFAULT now(),
      from_status    text,
      to_status      text NOT NULL,
      note           text,
      actor          text NOT NULL
    );
    CREATE INDEX IF NOT EXISTS careers_status_events_app_idx ON careers_status_events (application_id, at DESC);

    -- Notification bookkeeping (added after the first release; safe on existing rows).
    ALTER TABLE careers_applications ADD COLUMN IF NOT EXISTS notify_attempts integer NOT NULL DEFAULT 0;
    ALTER TABLE careers_applications ADD COLUMN IF NOT EXISTS notify_last_attempt_at timestamptz;
    ALTER TABLE careers_applications ADD COLUMN IF NOT EXISTS notify_claim_id text;
    CREATE INDEX IF NOT EXISTS careers_applications_notify_pending_idx ON careers_applications (created_at) WHERE notified_at IS NULL;
  `);
  log.info('db.migrated');
}
