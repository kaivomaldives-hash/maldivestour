#!/usr/bin/env bash
# Deploys the latest code to the VPS: pulls from GitHub, applies any new
# database migrations, rebuilds and restarts the website, then checks it.
# Run as the mtg user (the GitHub Action "Deploy to VPS" runs this for you):
#   bash deploy/scripts/deploy-app.sh
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SB_DIR="$HOME/supabase-project"
APP_ENV="$REPO_DIR/deploy/.env"
cd "$REPO_DIR"
get() { grep -E "^$1=" "$APP_ENV" | head -n1 | cut -d= -f2- | tr -d "\"'"; }
BRANCH=$(get DEPLOY_BRANCH); BRANCH=${BRANCH:-main}
SITE_DOMAIN=$(get SITE_DOMAIN)
# Until the main domain points here, check the preview address instead.
if [ "$(getent hosts "$SITE_DOMAIN" | awk '{print $1}' | head -n1)" != "$(curl -s --max-time 5 https://api.ipify.org)" ]; then
  SITE_DOMAIN=$(get PREVIEW_DOMAIN)
fi

echo "==> Pulling $BRANCH"
git fetch --quiet origin "$BRANCH"
git checkout --quiet "$BRANCH"
git merge --ff-only --quiet "origin/$BRANCH"
echo "   now at $(git log --oneline -1)"

echo "==> Database migrations"
supabase db push --remote="$(get DATABASE_URL)" --yes

echo "==> Email templates"
if ! diff -rq deploy/supabase/templates "$SB_DIR/volumes/templates" >/dev/null 2>&1 \
   || ! cmp -s deploy/supabase/docker-compose.mtg.yml "$SB_DIR/docker-compose.mtg.yml"; then
  cp deploy/supabase/templates/*.html "$SB_DIR/volumes/templates/"
  cp deploy/supabase/docker-compose.mtg.yml "$SB_DIR/docker-compose.mtg.yml"
  ( cd "$SB_DIR" && docker compose up -d )
  echo "   updated"
else
  echo "   unchanged"
fi

echo "==> Building and restarting the website"
# Caddy first: the build reads data through https://API_DOMAIN.
docker compose -f deploy/docker-compose.yml --env-file "$APP_ENV" up -d caddy
docker compose -f deploy/docker-compose.yml --env-file "$APP_ENV" up -d --build app
docker image prune -f >/dev/null

echo "==> Checking the site"
for _ in $(seq 1 30); do
  code=$(curl -s -o /dev/null -w '%{http_code}' "https://$SITE_DOMAIN/" || true)
  [ "$code" = "200" ] && { echo "   https://$SITE_DOMAIN/ is up (200)"; exit 0; }
  sleep 5
done
echo "Site did not answer 200 after deploy (last: $code). Logs:" >&2
docker compose -f deploy/docker-compose.yml --env-file "$APP_ENV" logs --tail 50 app >&2
exit 1
