#!/usr/bin/env bash
# Deploy a specific commit of the careers API to the running Compose stack.
#   ./release.sh <git-sha>       (run on your machine, from the repo root)
# Ships server/ + shared/ from that exact commit, rebuilds the image, restarts
# only the api container, and checks health. Postgres and its volume are
# untouched; schema changes are applied by the API itself at boot
# (CREATE TABLE/ADD COLUMN IF NOT EXISTS) — see server/src/db.js.
set -euo pipefail
SHA="${1:?usage: release.sh <git-sha>}"
HOST="${CAREERS_SSH_HOST:-hostinger}"          # ssh config alias for the VPS
DIR="${CAREERS_DIR:-/opt/vellmont-careers}"
git rev-parse --verify "$SHA^{commit}" >/dev/null
FULL="$(git rev-parse --short "$SHA")"
git archive --format=tar "$SHA" server shared | gzip | ssh "$HOST" "set -e; cd $DIR;
  rm -rf app.new && mkdir app.new && tar -xzf - -C app.new && cp app/Dockerfile app.new/Dockerfile;
  rm -rf app.prev; [ -d app ] && mv app app.prev; mv app.new app; echo $FULL > DEPLOYED_SHA;
  sed -i 's/^CAREERS_SHA=.*/CAREERS_SHA=$FULL/' .env;
  docker compose up -d --build api >/dev/null;
  for i in \$(seq 1 20); do sleep 3; curl -sf -m 3 http://127.0.0.1:4010/api/careers/health >/dev/null && break; done;
  curl -s -m 5 http://127.0.0.1:4010/api/careers/health; echo; docker compose ps --format '{{.Name}} {{.Status}}'"
echo "deployed $FULL (previous tree kept in $DIR/app.prev — see README 'Roll back')"
