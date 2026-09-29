#!/usr/bin/env bash
# One-time secret generation for the careers stack. Writes:
#   .env                      compose interpolation (DB passwords)
#   api.env                   API environment (session secret, reviewer hash…)
#   REVIEWER_CREDENTIALS.txt  reviewer username + password for a one-time,
#                             over-SSH handoff — delete after reading.
# Prints NOTHING sensitive. Refuses to overwrite existing files.
set -euo pipefail
cd "$(dirname "$0")"
umask 077
for f in .env api.env REVIEWER_CREDENTIALS.txt; do
  [ -e "$f" ] && { echo "refusing to overwrite $f"; exit 1; }
done
rand() { openssl rand -base64 "$1" | tr -d '\n=/+' | cut -c1-"$2"; }
OWNER_PW="$(rand 48 40)"
APP_PW="$(rand 48 40)"
SESSION_SECRET="$(openssl rand -base64 64 | tr -d '\n')"
IP_SALT="$(openssl rand -base64 32 | tr -d '\n')"
REVIEW_USER="vellmont-hiring"
REVIEW_PW="$(rand 48 28)"
HASH="$(REVIEW_PW="$REVIEW_PW" node -e "import('./app/server/src/auth.js').then(m=>process.stdout.write(m.hashPassword(process.env.REVIEW_PW)))")"
case "$HASH" in scrypt\$*) ;; *) echo "hashing failed"; exit 1;; esac

cat > .env <<ENV
CAREERS_OWNER_PASSWORD=${OWNER_PW}
CAREERS_APP_PASSWORD=${APP_PW}
CAREERS_SHA=$(cat DEPLOYED_SHA 2>/dev/null || echo local)
ENV

cat > api.env <<ENV
NODE_ENV=production
HOST=0.0.0.0
PORT=4010
PUBLIC_BASE_URL=https://vellmontservices.com
TRUST_PROXY=1
CV_STORAGE=db
REVIEW_USERNAME=${REVIEW_USER}
REVIEW_PASSWORD_HASH=${HASH}
SESSION_SECRET=${SESSION_SECRET}
SESSION_TTL_HOURS=12
IP_HASH_SALT=${IP_SALT}
# Email notifications: intentionally OFF until a hiring mailbox + SMTP are provided.
NOTIFY_EMAIL=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=0
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
NOTIFY_ATTACH_CV=0
RATE_ATTEMPTS_PER_15MIN=8
RATE_ATTEMPTS_PER_DAY=30
RATE_LOGIN_PER_15MIN=10
MIN_FORM_SECONDS=4
DUPLICATE_WINDOW_MINUTES=60
ENV

cat > REVIEWER_CREDENTIALS.txt <<TXT
Vellmont careers review dashboard
URL:      https://vellmontservices.com/careers/review
Username: ${REVIEW_USER}
Password: ${REVIEW_PW}

Read this once over SSH, store it in your password manager, then delete it:
  shred -u /opt/vellmont-careers/REVIEWER_CREDENTIALS.txt
To rotate: run  npm run hash-password  in app/server, replace REVIEW_PASSWORD_HASH in api.env, docker compose up -d api
TXT
echo "secrets written: .env api.env REVIEWER_CREDENTIALS.txt (0600)"
