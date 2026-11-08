#!/usr/bin/env bash
# Copies the database from Supabase cloud to the self-hosted Supabase on this
# server, following Supabase's official "Restore a Platform Project to
# Self-Hosted" guide. Run as the mtg user from the repo folder:
#
#   CLOUD_DB_URL='postgresql://postgres.<ref>:<password>@aws-...pooler.supabase.com:5432/postgres' \
#     bash deploy/scripts/migrate-database.sh
#
# CLOUD_DB_URL: Supabase cloud dashboard -> Connect -> "Session pooler"
# connection string, with your database password filled in.
#
# Options:
#   --skip-table schema.table   Leave out one table's data (repeatable), for
#                               the rare cloud-only table the restore rejects.
#   --fresh                     Wipe the self-hosted database first. Used for
#                               the final copy on switch-over day.
#
# Safe to re-run: the restore runs in ONE transaction, so a failure leaves
# the self-hosted database exactly as it was.
#
# Files (photos, documents) are NOT copied here — run copy-storage.sh after.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SB_DIR="$HOME/supabase-project"
SKIP_TABLES=(storage.objects storage.s3_multipart_uploads storage.s3_multipart_uploads_parts
  # Newer cloud-only Storage tables (vector/analytics buckets, lifecycle):
  # the site doesn't use them, and the self-hosted restore is refused
  # permission on them.
  storage.bucket_lifecycle_states storage.buckets_analytics storage.buckets_vectors
  storage.lifecycle_abandoned_artifacts storage.vector_indexes)
FRESH=0
while [ $# -gt 0 ]; do
  case "$1" in
    --skip-table) SKIP_TABLES+=("$2"); shift 2 ;;
    --fresh) FRESH=1; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

[ -n "${CLOUD_DB_URL:-}" ] || { echo "Set CLOUD_DB_URL (see the top of this script)." >&2; exit 1; }
PGPASS=$(grep -E '^POSTGRES_PASSWORD=' "$SB_DIR/.env" | cut -d= -f2-)
TENANT=$(grep -E '^POOLER_TENANT_ID=' "$SB_DIR/.env" | cut -d= -f2-)
LOCAL_DB_URL="postgres://postgres.$TENANT:$PGPASS@127.0.0.1:5432/postgres?sslmode=disable"

WORK="$HOME/mtg-migration/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$WORK"
chmod 700 "$HOME/mtg-migration" "$WORK"
cd "$WORK"
echo "Working folder: $WORK"

echo "==> 1/5 Exporting from Supabase cloud (roles, schema, data)"
# File records (storage.objects) are left out on purpose: copy-storage.sh
# re-creates each one as it uploads the file, so record and stored file
# always match (self-hosted Storage lays files out on disk differently).
EXCLUDE=$(IFS=,; echo "${SKIP_TABLES[*]}")
echo "   leaving out data for: $EXCLUDE"
supabase db dump --remote="$CLOUD_DB_URL" -f roles.sql --role-only
supabase db dump --remote="$CLOUD_DB_URL" -f schema.sql
supabase db dump --remote="$CLOUD_DB_URL" -f data.sql --use-copy --data-only --exclude "$EXCLUDE"
ls -lh roles.sql schema.sql data.sql

echo "==> 2/5 Preparing data file"
# Postgres-17-only setting; harmless to comment out on any version.
sed -i 's/^SET transaction_timeout/-- &/' data.sql

if [ "$FRESH" = "1" ]; then
  echo "==> Wiping the self-hosted database (--fresh)"
  read -r -p "This deletes ALL data in the self-hosted Supabase on this server. Type YES to continue: " ok
  [ "$ok" = "YES" ] || { echo "Cancelled."; exit 1; }
  ( cd "$SB_DIR" && docker compose down \
      && docker run --rm -v "$SB_DIR/volumes:/v" alpine:3 rm -rf /v/db/data /v/storage \
      && docker compose up -d )
  echo "   waiting for the database to start..."
  for _ in $(seq 1 60); do
    psql "$LOCAL_DB_URL" -tAc 'select 1' >/dev/null 2>&1 && break
    sleep 5
  done
fi

echo "==> 3/5 Checking the self-hosted database is empty"
existing=$(psql "$LOCAL_DB_URL" -tAc "select count(*) from information_schema.tables where table_schema='public'")
if [ "$existing" != "0" ]; then
  echo "The self-hosted database already has $existing tables in 'public'." >&2
  echo "Re-run with --fresh to wipe it and copy again." >&2
  exit 1
fi

echo "==> 4/5 Restoring into self-hosted Supabase (single transaction)"
psql \
  --single-transaction \
  --variable ON_ERROR_STOP=1 \
  --file roles.sql \
  --file schema.sql \
  --command 'SET session_replication_role = replica' \
  --file data.sql \
  --dbname "$LOCAL_DB_URL" > restore.log 2>&1 || {
    echo "Restore FAILED — nothing was changed. Last lines of $WORK/restore.log:" >&2
    tail -n 15 restore.log >&2
    echo >&2
    echo "If it names a table that only exists on Supabase cloud (e.g. auth.oauth_clients)," >&2
    echo "re-run with:  --skip-table <schema.table>" >&2
    exit 1
  }

echo "==> Copying the migration history"
# The dump leaves out Supabase's own migration history table. Mark every
# migration in the repo as applied here, so deploy-app.sh (supabase db push)
# only ever runs NEW migrations on this server. The repo's files are used
# rather than the cloud's history table: most migrations were applied to the
# cloud by other means, so that table lists only one of them, while the
# copied schema already contains them all.
versions=$(ls "$REPO_DIR"/supabase/migrations/*.sql | xargs -n1 basename | cut -d_ -f1 | sort)
count=$(echo "$versions" | grep -c . || true)
if [ "$count" -gt 0 ]; then
  ( cd "$REPO_DIR" && echo "$versions" | xargs supabase migration repair --status applied --remote="$LOCAL_DB_URL" --yes ) > repair.log 2>&1 \
    || { echo "Migration history repair failed — see $WORK/repair.log" >&2; tail -n 10 repair.log >&2; exit 1; }
  echo "   $count migrations marked as applied"
fi

echo "==> 5/5 Comparing row counts (cloud vs self-hosted)"
COUNT_SQL="select table_schema||'.'||table_name,
  (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', table_schema, table_name), false, true, '')))[1]::text
  from information_schema.tables
  where table_schema in ('public','auth') and table_type='BASE TABLE' order by 1"
psql "$CLOUD_DB_URL" -tA -F' ' -c "$COUNT_SQL" > counts.cloud.txt
psql "$LOCAL_DB_URL" -tA -F' ' -c "$COUNT_SQL" > counts.local.txt
if diff -u counts.cloud.txt counts.local.txt > counts.diff; then
  echo "   All $(wc -l < counts.local.txt) tables match."
else
  echo "   Differences (rows added on the live site since the export are expected):"
  cat counts.diff
fi
echo
echo "Users copied: $(psql "$LOCAL_DB_URL" -tAc 'select count(*) from auth.users')"
echo "Database copy done. Next: bash deploy/scripts/copy-storage.sh"
