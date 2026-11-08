#!/usr/bin/env bash
# Daily backup of the self-hosted Supabase: the database (roles, schema,
# data — same format as the cloud export, so restore-backup.sh can rebuild
# from it) and all stored files.
#
#   bash deploy/scripts/backup.sh                 # run a backup now
#   bash deploy/scripts/backup.sh --install-cron  # run it every night at 02:00 Maldives time
#
# Keeps the last 14 backups on the server in ~/backups. If an rclone remote
# called "offsite" exists (e.g. Google Drive — see deploy/README.md), each
# backup is also copied there and kept for 30 days, so a dead server doesn't
# take the backups with it.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SB_DIR="$HOME/supabase-project"
BACKUP_ROOT="$HOME/backups"
KEEP_LOCAL=14
KEEP_OFFSITE_DAYS=30

if [ "${1:-}" = "--install-cron" ]; then
  line="0 21 * * * bash $REPO_DIR/deploy/scripts/backup.sh >> $HOME/backups/backup.log 2>&1"
  mkdir -p "$BACKUP_ROOT"
  ( crontab -l 2>/dev/null | grep -v 'deploy/scripts/backup.sh' ; echo "$line" ) | crontab -
  echo "Installed: nightly backup at 21:00 UTC (02:00 Maldives time). Log: ~/backups/backup.log"
  exit 0
fi

PGPASS=$(grep -E '^POSTGRES_PASSWORD=' "$SB_DIR/.env" | cut -d= -f2-)
TENANT=$(grep -E '^POOLER_TENANT_ID=' "$SB_DIR/.env" | cut -d= -f2-)
DB_URL="postgres://postgres.$TENANT:$PGPASS@127.0.0.1:5432/postgres"

STAMP=$(date -u +%Y%m%d-%H%M%S)
DEST="$BACKUP_ROOT/$STAMP"
mkdir -p "$DEST"
chmod 700 "$BACKUP_ROOT"
echo "[$(date -u)] Backup -> $DEST"

supabase db dump --remote="$DB_URL" -f "$DEST/roles.sql" --role-only
supabase db dump --remote="$DB_URL" -f "$DEST/schema.sql"
supabase db dump --remote="$DB_URL" -f "$DEST/data.sql" --use-copy --data-only
# The dumps leave out Supabase's migration history; keep the list so a
# restore can mark them as applied again.
psql "$DB_URL" -tAc "select version from supabase_migrations.schema_migrations order by version" > "$DEST/migrations.txt"
# Stored files, exactly as Supabase keeps them on disk (matches the
# storage.objects rows in data.sql).
# Read through a throwaway container: the files are owned by the storage
# container's user, and the mtg user (docker group) needs no sudo this way.
docker run --rm -v "$SB_DIR/volumes:/v:ro" alpine:3 tar -C /v -czf - storage > "$DEST/storage.tar.gz"
gzip -9 "$DEST"/*.sql
( cd "$DEST" && sha256sum ./* > SHA256SUMS )
du -sh "$DEST"

# Local retention
ls -1d "$BACKUP_ROOT"/2* 2>/dev/null | sort | head -n -"$KEEP_LOCAL" | xargs -r rm -rf

# Off-server copy
if rclone listremotes 2>/dev/null | grep -q '^offsite:$'; then
  rclone copy "$DEST" "offsite:mtg-backups/$STAMP" --stats-one-line
  rclone delete "offsite:mtg-backups" --min-age "${KEEP_OFFSITE_DAYS}d" --rmdirs || true
  echo "Copied off-server to offsite:mtg-backups/$STAMP"
else
  echo "WARNING: no 'offsite' rclone remote — this backup only exists on this server."
fi
echo "[$(date -u)] Backup finished"
