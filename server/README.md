# Careers API (`server/`)

Backend for **vellmontservices.com/careers**: stores job applications + CVs and
serves a private review dashboard. It is a separate Node service from the
static Vite site, deliberately — the site is rsynced to `/var/www` and has no
runtime, so anything that must *persist* has to live here.

| Path | Who | What |
|---|---|---|
| `POST /api/careers/applications` | public (the careers form) | multipart submit; 201 only after Postgres commit |
| `GET /api/careers/health` | public | `{ ok, storage, notifications, turnstile }` — no data |
| `GET /careers/review` | reviewers (login) | pipeline list, filters, CSV export |
| `GET /careers/review/applications/:id` | reviewers | full application, status + notes, timeline |
| `GET /careers/review/applications/:id/cv` | reviewers | CV download (`attachment`, `no-store`) |

Statuses: New → Shortlisted → Interview → Hired / Rejected. Every change is
recorded in `careers_status_events` with the reviewer and an optional note.
Country is stored as an ISO code from the shared catalogue (`IN`, `AE`) and
rendered as "India" / "UAE" in the dashboard, CSV export and emails.

## What it protects against

- **Server-side validation** of every field against `shared/careersCatalog.js`
  (the same catalogue the React form uses). Astrologer-only fields are dropped
  for any other role. Department must match role.
- **CV policy**: PDF/DOC/DOCX, ≤ 5 MB, checked by extension, MIME *and* magic
  bytes; filenames sanitised; stored as `bytea` (default) or in a 0600 file
  outside the web root. Never on the public host, never in Git.
- **Spam**: honeypot field + minimum fill time (rejected with a generic,
  retryable 400 — nothing stored, no reference shown), optional Cloudflare
  Turnstile.
- **Rate limits**: every POST attempt (valid or invalid) counts, per client
  IP, and is checked *before* the multipart body is parsed — 8 per 15 min
  and 30 per day by default, 429 + `Retry-After`. Check and increment are a
  single step, so concurrent requests cannot slip through. Behind Caddy set
  `TRUST_PROXY=1` (one trusted hop: the client IP is the last
  `X-Forwarded-For` entry Caddy appends; spoofed entries are ignored).
- **Duplicates**: the insert runs in one transaction under a Postgres
  advisory lock on (email, role), so simultaneous submissions serialise: the
  same idempotency key returns the stored reference (200), a different key for
  the same email + role inside the 60-minute window gets 409 with the earlier
  reference, and exactly one row, CV and initial status event are written.
- **Failures**: all async routes forward errors to one handler. Database
  outages return 503 + `Retry-After` (connect/query timeouts are set), other
  errors 500; connections are always released and transactions rolled back;
  responses never include applicant data or database error text.
- **Review auth**: username + scrypt-hashed password, HMAC-signed expiring
  cookie (`HttpOnly; SameSite=Strict; Secure`), login rate limit, same-origin
  check on every POST, `noindex` + `no-store` on every review page.
- **Logs** carry ids, status codes and timings only — never form fields, never
  CV bytes. Submitter IPs are stored only as a salted hash.

## Configuration

All settings come from environment variables — see [`.env.example`](.env.example).
The process **refuses to start** and prints the missing keys if any of these
are absent:

```
DATABASE_URL            Postgres connection string
SESSION_SECRET          32+ random chars      (openssl rand -base64 48)
REVIEW_USERNAME         dashboard login
REVIEW_PASSWORD_HASH    from: npm run hash-password
CV_STORAGE_DIR          only when CV_STORAGE=fs
```

Optional: `NOTIFY_EMAIL` + `SMTP_*` (email the hiring team on every
application; `NOTIFY_ATTACH_CV=1` attaches the CV — off by default),
`TURNSTILE_SECRET_KEY` (+ `VITE_TURNSTILE_SITE_KEY` in the site build),
rate-limit and retry knobs.

## Notifications: the dashboard is the source of truth

The Postgres row is written and confirmed to the applicant **before** any
email is attempted. An email failure never loses or rolls back an
application. Delivery state is stored on the row (`notified_at`,
`notify_attempts`, `notify_error`, `notify_last_attempt_at`) and shown on the
application's detail page, so failures are observable without logging
applicant details (logs carry the application id and an error code only).

Retry: a sweeper re-sends failed notifications every `NOTIFY_SWEEP_MINUTES`
(default 10) until `NOTIFY_MAX_ATTEMPTS` (default 5), for applications under
7 days old, and each detail page has a **Send now / Send again** button.

Known limitation: the retry loop lives inside the single API process (no
external queue). If the process is down when an application arrives, no
application is stored either, so nothing is lost silently; if SMTP is down
for longer than the retry budget, the application stays in the dashboard
with "Not sent" and can be re-sent manually. Email-only delivery
(`NOTIFY_ATTACH_CV=1` with nobody checking the dashboard) is therefore *not*
a reliable channel on its own and is not recommended.

## Local development

```bash
# 1. Postgres (any 13+). Homebrew: brew services start postgresql@15
createdb vellmont_careers

# 2. API
cd server && npm install
cp .env.example .env         # fill DATABASE_URL, SESSION_SECRET, REVIEW_USERNAME, REVIEW_PASSWORD_HASH
npm run hash-password        # paste output into .env
npm run dev                  # http://127.0.0.1:4010

# 3. Site (from repo root) — Vite proxies /api/careers and /careers/review to :4010
npm run dev                  # http://localhost:5173/careers
```

Tests (need a scratch database; tables are dropped and recreated):

```bash
createdb vellmont_careers_test
DATABASE_URL_TEST=postgresql://localhost:5432/vellmont_careers_test npm test
```

## Deploying to the VPS (147.93.106.12, Caddy)

The site's GitHub Action only rsyncs `dist/`; the API is deployed separately.

```bash
# once
sudo useradd --system --home /opt/vellmont-careers --shell /usr/sbin/nologin careers
sudo mkdir -p /opt/vellmont-careers /var/lib/vellmont-careers/cv
sudo chown -R careers:careers /opt/vellmont-careers /var/lib/vellmont-careers
sudo install -m 600 -o careers -g careers /dev/null /etc/vellmont-careers.env   # then edit: values from .env.example
sudo cp server/deploy/vellmont-careers.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable vellmont-careers

# each release (from the repo root, on the server or via rsync)
rsync -az --delete shared/ /opt/vellmont-careers/shared/
rsync -az --delete --exclude node_modules --exclude .env server/ /opt/vellmont-careers/server/
cd /opt/vellmont-careers/server && sudo -u careers npm ci --omit=dev
sudo systemctl restart vellmont-careers && sudo systemctl status vellmont-careers
curl -s https://vellmontservices.com/api/careers/health
```

Caddy: add the `@careers` handle block from the repo `Caddyfile` fragment to
the `vellmontservices.com { }` site block on the server (it must come before
the SPA fallback), then `sudo caddy validate && sudo systemctl reload caddy`.

Database options: a new **Neon** project (the org already runs VedJyotix on
Neon; set `DATABASE_SSL=1` and `?sslmode=require`) or a local Postgres on the
VPS. Either survives site deploys because the site deploy never touches it.
