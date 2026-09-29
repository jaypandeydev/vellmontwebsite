#!/usr/bin/env bash
# Nightly logical backup of the careers database (applications, status
# history AND CV bytes — CVs are stored as bytea in the same database).
#   backup.sh                  dump → backups/, prune, optional off-host copy
#   backup.sh --verify         restore newest LOCAL dump into a scratch DB, count rows
#   backup.sh --verify-remote  fetch newest REMOTE dump, restore it, count rows
# Off-host: set RCLONE_REMOTE (e.g. an rclone *crypt* remote) in backup.env.
# Status files: LATEST_OK / OFFHOST_OK (timestamps), OFFHOST_LAST_ERROR.
# Optional HEARTBEAT_URL (healthchecks-style ping) is hit only after a fully
# successful run, so a missing ping = a failed or skipped backup.
set -euo pipefail
cd "$(dirname "$0")"
BK=backups; mkdir -p "$BK"; chmod 700 "$BK"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
REMOTE_RETENTION_DAYS="${REMOTE_RETENTION_DAYS:-90}"
[ -f backup.env ] && . ./backup.env
log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }
PG() { docker compose exec -T postgres "$@"; }
have_remote() { [ -n "${RCLONE_REMOTE:-}" ] && command -v rclone >/dev/null; }

restore_and_count() { # $1 = dump file
  PG psql -U careers_owner -d postgres -qc 'DROP DATABASE IF EXISTS careers_verify;' >/dev/null
  PG psql -U careers_owner -d postgres -qc 'CREATE DATABASE careers_verify;' >/dev/null
  PG pg_restore -U careers_owner -d careers_verify --no-owner --no-privileges < "$1"
  PG psql -U careers_owner -d careers_verify -Atc "SELECT 'applications='||count(*) FROM careers_applications UNION ALL SELECT 'cv_blobs='||count(*) FROM careers_cv_blobs UNION ALL SELECT 'cv_bytes='||coalesce(sum(length(data)),0) FROM careers_cv_blobs UNION ALL SELECT 'events='||count(*) FROM careers_status_events;"
  PG psql -U careers_owner -d postgres -qc 'DROP DATABASE careers_verify;' >/dev/null
}

case "${1:-}" in
  --verify)
    NEWEST="$(ls -1t "$BK"/careers-*.dump 2>/dev/null | head -1)"
    [ -n "$NEWEST" ] || { log "no local dumps to verify"; exit 1; }
    log "verify local $NEWEST"; restore_and_count "$NEWEST"; log "verify OK"; exit 0 ;;
  --verify-remote)
    have_remote || { log "RCLONE_REMOTE not configured"; exit 1; }
    NAME="$(rclone lsf "$RCLONE_REMOTE" --include 'careers-*.dump' 2>/dev/null | sort | tail -1)"
    [ -n "$NAME" ] || { log "no remote dumps"; exit 1; }
    T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
    rclone copyto "$RCLONE_REMOTE/$NAME" "$T/$NAME"
    log "verify remote $NAME ($(stat -c %s "$T/$NAME") bytes)"; restore_and_count "$T/$NAME"; log "verify-remote OK"; exit 0 ;;
esac

OUT="$BK/careers-$(date -u +%Y%m%d-%H%M%S).dump"
TMP="$OUT.part"
if PG pg_dump -U careers_owner -d careers -Fc > "$TMP"; then
  mv "$TMP" "$OUT"; chmod 600 "$OUT"
  log "dump OK $(stat -c %s "$OUT") bytes -> $OUT"
  date -u +%FT%TZ > "$BK/LATEST_OK"
else
  rm -f "$TMP"; log "dump FAILED"; exit 1
fi
find "$BK" -name 'careers-*.dump' -mtime +"$RETENTION_DAYS" -delete
if have_remote; then
  # crypt remotes cannot be size/hash-checked with plain `check`; cryptcheck
  # re-encrypts the local file and compares hashes on the underlying remote.
  remote_ok() { rclone cryptcheck "$BK" "$RCLONE_REMOTE" --one-way --include "$(basename "$OUT")" >/dev/null 2>&1 \
             || rclone check "$BK" "$RCLONE_REMOTE" --one-way --include "$(basename "$OUT")" >/dev/null 2>&1; }
  if rclone copyto "$OUT" "$RCLONE_REMOTE/$(basename "$OUT")" && remote_ok; then
    rclone delete "$RCLONE_REMOTE" --include 'careers-*.dump' --min-age "${REMOTE_RETENTION_DAYS}d" >/dev/null 2>&1 || true
    date -u +%FT%TZ > "$BK/OFFHOST_OK"; rm -f "$BK/OFFHOST_LAST_ERROR"; log "offhost OK"
    [ -n "${HEARTBEAT_URL:-}" ] && curl -fsS -m 10 -o /dev/null "$HEARTBEAT_URL" || true
  else
    date -u +%FT%TZ > "$BK/OFFHOST_LAST_ERROR"; log "offhost FAILED"; exit 2
  fi
else
  log "offhost skipped (RCLONE_REMOTE not set)"
fi
