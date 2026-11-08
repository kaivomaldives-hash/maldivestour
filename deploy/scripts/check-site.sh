#!/usr/bin/env bash
# Quick health check of the VPS setup. Run any time as the mtg user:
#   bash deploy/scripts/check-site.sh
# Before the main domain is switched over, check the preview address instead:
#   bash deploy/scripts/check-site.sh --preview
set -uo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
APP_ENV="$REPO_DIR/deploy/.env"
get() { grep -E "^$1=" "$APP_ENV" | head -n1 | cut -d= -f2- | tr -d "\"'"; }
SITE=$(get SITE_DOMAIN); API=$(get API_DOMAIN); ANON=$(get NEXT_PUBLIC_SUPABASE_ANON_KEY); SERVICE=$(get SUPABASE_SERVICE_ROLE_KEY)
[ "${1:-}" = "--preview" ] && SITE=$(get PREVIEW_DOMAIN)
fail=0
check() { # check NAME EXPECTED_CODE CURL_ARGS...
  local name=$1 want=$2; shift 2
  local code; code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$@" || echo 000)
  if [ "$code" = "$want" ]; then echo "  OK    $name ($code)"; else echo "  FAIL  $name (got $code, want $want)"; fail=1; fi
}

# Talk to this server directly, whatever public DNS currently says.
R=(--resolve "$SITE:443:127.0.0.1" --resolve "$API:443:127.0.0.1")

echo "Containers:"
docker ps --format '  {{.Names}}\t{{.Status}}' | sort
echo
echo "Website:"
check "home page"            200 "${R[@]}" "https://$SITE/"
check "partner terms page"   200 "${R[@]}" "https://$SITE/terms-and-conditions/partners/"
check "partner signup page"  200 "${R[@]}" "https://$SITE/partner/signup/"
check "sitemap"              200 "${R[@]}" "https://$SITE/sitemap.xml"
echo "Supabase:"
check "auth service"         200 "${R[@]}" -H "apikey: $ANON" "https://$API/auth/v1/health"
check "database API"         200 "${R[@]}" -H "apikey: $ANON" "https://$API/rest/v1/"
check "file storage"         200 "${R[@]}" -H "apikey: $SERVICE" -H "Authorization: Bearer $SERVICE" "https://$API/storage/v1/bucket/media"
check "dashboard (locked)"   401 "${R[@]}" "https://$API/"
echo "Security (should NOT be reachable from outside):"
for port in 3000 5432 6543 8000; do
  if timeout 3 bash -c "</dev/tcp/$(curl -s --max-time 5 https://api.ipify.org)/$port" 2>/dev/null; then
    echo "  FAIL  port $port is open to the internet"; fail=1
  else
    echo "  OK    port $port closed"
  fi
done
echo
[ "$fail" = 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
