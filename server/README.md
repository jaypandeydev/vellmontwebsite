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

## Notifications: retryable, at-least-once delivery

The Postgres row is written and confirmed to the applicant **before** any
email is attempted. An email failure never loses or rolls back an
application. Delivery state is stored on the row (`notified_at`,
`notify_attempts`, `notify_error`, `notify_last_attempt_at`) and shown on the
application's detail page, so failures are observable without logging
applicant details (logs carry the application id and an error code only).

Delivery is **at-least-once**: every send is retried until it is recorded as
sent, so if SMTP accepted an email but the process died before success was
written, the retry sends it again and the hiring team may receive a duplicate.
The private dashboard and the stored application remain the source of truth;
email is a notification, not the record.

Retry: a sweeper runs 15 s after boot and then every `NOTIFY_SWEEP_MINUTES`
(default 10). It re-sends failed notifications until `NOTIFY_MAX_ATTEMPTS`
(default 5) and also picks up applications that were **never attempted** —
the process restarted between the commit and the send, or SMTP was
configured after applications had been collected — once they are older than
`NOTIFY_GRACE_SECONDS` (default 120) so it never races the request handler's
own send. Only rows under 7 days old are swept. Every send first claims the
row with one conditional `UPDATE` that stores a claim token, so the request
handler, the sweeper and a reviewer's **Send now / Send again** button never
start two sends for the same application at once: **Send again** may re-send
an already-notified application but never overrides an active claim (a
second click, or a click while the sweeper is sending, is reported as "already
being sent"). Results are recorded only by the claim's owner, so a sender
that finishes after its claim expired and was taken over cannot overwrite the
newer state. A claim older than `NOTIFY_CLAIM_SECONDS` (default 300) is
treated as abandoned (dead process) and taken over by the next sender.

Known limitation: the retry loop lives inside the single API process (no
external queue) and is bounded by the attempt cap and the 7-day window. If
SMTP is down for longer than that budget, the application stays in the
dashboard with "Not sent" and can be re-sent manually. Email-only delivery
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

## Deploying to the VPS (Docker Compose — what actually runs)

The API runs on the Vellmont VPS as two Docker containers managed by
Compose under **`/opt/vellmont-careers`**, owned by the `deploy` user (that
user has no root, so there is no systemd unit and no dedicated system
account — Docker's restart policy provides the supervision instead).
The site's GitHub Action only rsyncs `dist/`; the API is deployed
separately with the files in [`deploy/compose/`](deploy/compose/).

| Piece | Where |
|---|---|
| `vellmont-careers-api` | node:22-alpine image built from `app/` (= `server/` + `shared/` of one commit), listens on `127.0.0.1:4010` |
| `vellmont-careers-db` | `postgres:16-alpine`, named volume `vellmont_careers_pgdata`, not published on any port |
| Secrets | `.env` (DB passwords, `CAREERS_SHA`) and `api.env` (session secret, reviewer hash, SMTP…) — both `0600`, never in Git |
| Deployed commit | `DEPLOYED_SHA` file + image tag `vellmont-careers-api:<sha>` |
| Backups | `backups/` (local dumps), `backup.sh`, `backup.env` (off-host remote), cron at 01:20 UTC |
| Routing | `@careers` block in the live Caddy site block (see repo `Caddyfile`), reload via `caddy reload` (admin API, no root) |

### First-time install

```bash
# on your machine, from the repo root
git archive --format=tar <sha> server shared | gzip > careers.tar.gz
scp careers.tar.gz server/deploy/compose/{docker-compose.yml,Dockerfile,setup-secrets.sh,backup.sh,patch-caddy.py} hostinger:~/vellmont-careers/
scp -r server/deploy/compose/init hostinger:~/vellmont-careers/

# on the server
cd ~/vellmont-careers && mkdir app && tar -xzf careers.tar.gz -C app && cp Dockerfile app/ && rm careers.tar.gz
echo <sha> > DEPLOYED_SHA && chmod 700 . && ./setup-secrets.sh        # writes .env, api.env, REVIEWER_CREDENTIALS.txt (0600)
sudo mv ~/vellmont-careers /opt/vellmont-careers && cd /opt/vellmont-careers
docker compose up -d --build && curl -s http://127.0.0.1:4010/api/careers/health
python3 patch-caddy.py && caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile && caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
cp backup.env.example backup.env   # then set RCLONE_REMOTE (a crypt remote) — see Backups
( crontab -l; echo "20 1 * * * cd /opt/vellmont-careers && bash backup.sh >> /opt/vellmont-careers/backups/backup.log 2>&1 # vellmont-careers-backup";
  echo "40 2 * * 0 cd /opt/vellmont-careers && bash backup.sh --verify >> /opt/vellmont-careers/backups/backup.log 2>&1 # vellmont-careers-backup-verify" ) | crontab -
```

`setup-secrets.sh` generates the DB passwords, session secret, IP-hash salt
and a reviewer password, hashes the password with scrypt and writes
`REVIEWER_CREDENTIALS.txt` for a one-time, over-SSH handoff
(`ssh hostinger cat /opt/vellmont-careers/REVIEWER_CREDENTIALS.txt`, then
`shred -u` it). It never prints a secret and refuses to overwrite.

### Deploy a new API commit

```bash
./server/deploy/compose/release.sh <sha>     # from the repo root on your machine
```

This ships `server/` + `shared/` from exactly that commit, keeps the previous
tree as `app.prev`, rebuilds the image, restarts **only** the `api`
container, updates `DEPLOYED_SHA`, and prints the health JSON. Postgres and
its volume are untouched.

### Schema changes

The API applies its own schema at boot with idempotent statements
(`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE … ADD COLUMN IF NOT EXISTS` in
`src/db.js`). A deploy that changes the schema therefore needs nothing more
than the restart `release.sh` performs. Keep migrations additive; never drop
or rename columns in a release that older code might still run against.
Take a backup first (`backup.sh`) if a change touches existing rows.

### Restart, status, logs

```bash
cd /opt/vellmont-careers
docker compose ps                                 # both containers "healthy"
docker compose restart api                        # after editing api.env
docker compose logs --since 1h api                # JSON lines: ids, status codes, timings — never applicant data
curl -s http://127.0.0.1:4010/api/careers/health  # {"ok":true,"storage":"db","notifications":"off"|"email"}
docker compose exec -T postgres psql -U careers_owner -d careers -Atc "SELECT count(*) FROM careers_applications"
```

Enabling email later: fill `NOTIFY_EMAIL` and `SMTP_*` in `api.env`, then
`docker compose up -d api`; health should report `"notifications":"email"`.

### Backups

`backup.sh` (nightly via cron) takes a custom-format `pg_dump` of the
`careers` database — applications, status history **and CV bytes** (CVs are
`bytea` rows in the same database) — into `backups/`, keeps 30 days
locally, writes `LATEST_OK`, then copies the dump to the off-host rclone
remote named in `backup.env` (`RCLONE_REMOTE`, an rclone **crypt** remote so
dumps are encrypted client-side with keys only the operator holds), verifies
it with `rclone cryptcheck`, prunes remote copies older than 90 days and
writes `OFFHOST_OK`. A failed copy writes `OFFHOST_LAST_ERROR` and exits
non-zero (visible in `backups/backup.log`). Noticing failures: check that
`LATEST_OK` and `OFFHOST_OK` are from last night, or set `HEARTBEAT_URL` in
`backup.env` to a healthchecks-style ping that alerts when a night is missed. The crypt keys are handed off in
`BACKUP_ENCRYPTION_KEYS.txt` (0600, shred after storing) — without them the
remote copies cannot be read anywhere else.

```bash
./backup.sh                  # dump + off-host copy now
./backup.sh --verify         # restore newest LOCAL dump into a scratch DB, print row/blob counts   (weekly via cron)
./backup.sh --verify-remote  # fetch newest REMOTE dump, restore it into a scratch DB, print counts
```

**Restore for real** (after confirming with the team — this replaces data):

```bash
cd /opt/vellmont-careers && docker compose stop api
docker compose exec -T postgres psql -U careers_owner -d postgres -c "DROP DATABASE careers" -c "CREATE DATABASE careers OWNER careers_app"
docker compose exec -T postgres pg_restore -U careers_owner -d careers --no-owner --role=careers_app < backups/careers-<timestamp>.dump
docker compose start api
```

(`rclone copyto careers-crypt:careers-<timestamp>.dump backups/` first if the
local copy is gone.)

### Roll back

- **API only:** `cd /opt/vellmont-careers && rm -rf app && mv app.prev app && docker compose up -d --build api` (or run `release.sh <previous-sha>`), then fix `DEPLOYED_SHA`. Schema changes are additive, so older code keeps running against a newer schema.
- **Routing:** `cp ~/caddy-backups/Caddyfile.bak.<timestamp> /etc/caddy/Caddyfile && caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile`.
- **Data:** see *Restore for real* above.
- **Everything:** `docker compose down` stops the stack without deleting the volume; `docker compose down -v` would delete all applications and CVs — never run that without a verified backup.

Database options considered: a dedicated **Neon** project would also work
(set `DATABASE_SSL=1` and `?sslmode=require`), but the VPS-local container
keeps the credentials on the server and inside the existing backup scheme.
