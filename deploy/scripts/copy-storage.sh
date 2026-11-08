#!/usr/bin/env bash
# Copies all stored files (photos, partner documents, submissions) from
# Supabase cloud to the self-hosted Supabase on this server, using rclone
# over the S3 protocol (Supabase's official method). Run as the mtg user
# AFTER migrate-database.sh (which creates the buckets):
#
#   CLOUD_S3_ENDPOINT='https://<ref>.storage.supabase.co/storage/v1/s3' \
#   CLOUD_S3_REGION='ap-southeast-1' \
#   CLOUD_S3_KEY_ID='...' CLOUD_S3_SECRET='...' \
#     bash deploy/scripts/copy-storage.sh
#
# Get these from Supabase cloud -> Storage -> S3 Configuration -> Access keys
# (create a new key; delete it once the move is done).
#
# Safe to re-run: rclone only copies files that are new or changed, so a
# second run on switch-over day just picks up the latest uploads.
set -euo pipefail

SB_DIR="$HOME/supabase-project"
for v in CLOUD_S3_ENDPOINT CLOUD_S3_REGION CLOUD_S3_KEY_ID CLOUD_S3_SECRET; do
  [ -n "${!v:-}" ] || { echo "Set $v (see the top of this script)." >&2; exit 1; }
done
sb() { grep -E "^$1=" "$SB_DIR/.env" | head -n1 | cut -d= -f2- | tr -d "\"'"; }

# rclone remotes defined through environment variables: nothing is written
# to disk, so the cloud keys don't linger on the server.
export RCLONE_CONFIG_CLOUD_TYPE=s3 RCLONE_CONFIG_CLOUD_PROVIDER=Other
export RCLONE_CONFIG_CLOUD_ENDPOINT="$CLOUD_S3_ENDPOINT" RCLONE_CONFIG_CLOUD_REGION="$CLOUD_S3_REGION"
export RCLONE_CONFIG_CLOUD_ACCESS_KEY_ID="$CLOUD_S3_KEY_ID" RCLONE_CONFIG_CLOUD_SECRET_ACCESS_KEY="$CLOUD_S3_SECRET"
export RCLONE_CONFIG_SELF_TYPE=s3 RCLONE_CONFIG_SELF_PROVIDER=Other
export RCLONE_CONFIG_SELF_ENDPOINT="http://127.0.0.1:8000/storage/v1/s3" RCLONE_CONFIG_SELF_REGION="$(sb REGION)"
export RCLONE_CONFIG_SELF_ACCESS_KEY_ID="$(sb S3_PROTOCOL_ACCESS_KEY_ID)" RCLONE_CONFIG_SELF_SECRET_ACCESS_KEY="$(sb S3_PROTOCOL_ACCESS_KEY_SECRET)"
export RCLONE_CONFIG_CLOUD_FORCE_PATH_STYLE=true RCLONE_CONFIG_SELF_FORCE_PATH_STYLE=true

echo "==> Buckets on Supabase cloud"
buckets=$(rclone lsf cloud: | tr -d '/')
[ -n "$buckets" ] || { echo "No buckets found on cloud — check the endpoint and keys." >&2; exit 1; }
echo "$buckets"
echo "==> Buckets on this server"
rclone lsf self: | tr -d '/'

for bucket in $buckets; do
  echo
  echo "==> Copying bucket: $bucket"
  rclone copy "cloud:$bucket" "self:$bucket" --transfers 4 --checkers 8 --timeout 30m --stats-one-line --stats 15s
done

echo
echo "==> Checking file counts and sizes (cloud vs this server)"
ok=1
for bucket in $buckets; do
  c=$(rclone size --json "cloud:$bucket"); s=$(rclone size --json "self:$bucket")
  cc=$(echo "$c" | jq .count); sc=$(echo "$s" | jq .count)
  cb=$(echo "$c" | jq .bytes); sbytes=$(echo "$s" | jq .bytes)
  status="OK"; if [ "$cc" != "$sc" ] || [ "$cb" != "$sbytes" ]; then status="DIFFERENT"; ok=0; fi
  printf '  %-22s cloud: %6s files %10s bytes | server: %6s files %10s bytes  %s\n' "$bucket" "$cc" "$cb" "$sc" "$sbytes" "$status"
done
[ "$ok" = "1" ] && echo "All buckets match." || echo "Some buckets differ — re-run this script; if it persists, check the rclone output above."
