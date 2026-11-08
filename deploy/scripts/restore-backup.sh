#!/usr/bin/env bash
# Restores a backup made by backup.sh onto this server's self-hosted
# Supabase. WIPES the current database and files first.
#
#   bash deploy/scripts/restore-backup.sh ~/backups/20261120-210000
#
# To restore from the off-server copy, download it first:
#   rclone copy offsite:mtg-backups/20261120-210000 ~/backups/20261120-210000
set -euo pipefail

SRC=${1:-}
SB_DIR="$HOME/supabase-project"
REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "Usage: restore-backup.sh <backup folder>" >&2; exit 1; }
SRC=$(cd "$SRC" && pwd)
( cd "$SRC" && sha256sum -c SHA256SUMS ) || { echo "Backup files are damaged (checksum mismatch)." >&2; exit 1; }

read -r -p "This REPLACES all data on this server with the backup in $SRC. Type YES to continue: " ok
[ "$ok" = "YES" ] || { echo "Cancelled."; exit 1; }

PGPASS=$(grep -E '^POSTGRES_PASSWORD=' "$SB_DIR/.env" | cut -d= -f2-)
TENANT=$(grep -E '^POOLER_TENANT_ID=' "$SB_DIR/.env" | cut -d= -f2-)
DB_URL="postgres://postgres.$TENANT:$PGPASS@127.0.0.1:5432/postgres?sslmode=disable"

echo "==> Wiping current database and files"
cd "$SB_DIR"
docker compose down
docker run --rm -v "$SB_DIR/volumes:/v" alpine:3 rm -rf /v/db/data /v/storage
echo "==> Putting back stored files"
docker run --rm -i -v "$SB_DIR/volumes:/v" alpine:3 tar -C /v -xzf - < "$SRC/storage.tar.gz"
docker compose up -d
echo "   waiting for the database..."
for _ in $(seq 1 60); do psql "$DB_URL" -tAc 'select 1' >/dev/null 2>&1 && break; sleep 5; done

echo "==> Restoring database"
WORK=$(mktemp -d)
for f in roles schema data; do gunzip -c "$SRC/$f.sql.gz" > "$WORK/$f.sql"; done
psql --single-transaction --variable ON_ERROR_STOP=1 \
  --file "$WORK/roles.sql" --file "$WORK/schema.sql" \
  --command 'SET session_replication_role = replica' \
  --file "$WORK/data.sql" --dbname "$DB_URL" > "$WORK/restore.log" 2>&1 || {
    echo "Restore FAILED. See $WORK/restore.log" >&2; tail -n 15 "$WORK/restore.log" >&2; exit 1; }
rm -rf "$WORK"
if [ -s "$SRC/migrations.txt" ]; then
  ( cd "$REPO_DIR" && xargs supabase migration repair --status applied --remote="$DB_URL" --yes < "$SRC/migrations.txt" ) >/dev/null
  echo "Migration history: $(grep -c . "$SRC/migrations.txt") entries restored"
fi
echo "Users: $(psql "$DB_URL" -tAc 'select count(*) from auth.users')"
echo "Files: $(psql "$DB_URL" -tAc 'select count(*) from storage.objects')"
echo "Restore complete. Restart the website: cd ~/maldivestour && docker compose -f deploy/docker-compose.yml --env-file deploy/.env restart app"
