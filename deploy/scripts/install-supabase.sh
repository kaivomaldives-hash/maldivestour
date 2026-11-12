#!/usr/bin/env bash
# Installs self-hosted Supabase in ~/supabase-project using Supabase's own
# official setup script, then applies MTG's settings. Run as the mtg user
# from the repo folder, AFTER filling in deploy/.env:
#   bash deploy/scripts/install-supabase.sh
#
# What it sets in ~/supabase-project/.env:
#   - public URLs (https://API_DOMAIN) and the site URL + allowed redirects
#   - email through Resend SMTP (same account the site already uses)
#   - phone signup off (the site doesn't use it)
#   - the MTG compose override (localhost-only ports, email templates)
# and copies the generated ANON_KEY / SERVICE_ROLE_KEY into deploy/.env.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
APP_ENV="$REPO_DIR/deploy/.env"
SB_DIR="$HOME/supabase-project"

[ -f "$APP_ENV" ] || { echo "Missing $APP_ENV — copy deploy/.env.example to deploy/.env and fill it in first." >&2; exit 1; }
get() { grep -E "^$1=" "$APP_ENV" | head -n1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//'; }
SITE_DOMAIN=$(get SITE_DOMAIN); API_DOMAIN=$(get API_DOMAIN); PREVIEW_DOMAIN=$(get PREVIEW_DOMAIN)
RESEND_API_KEY=$(get RESEND_API_KEY); RESEND_FROM_EMAIL=$(get RESEND_FROM_EMAIL)
[ -n "$SITE_DOMAIN" ] && [ -n "$API_DOMAIN" ] || { echo "Set SITE_DOMAIN and API_DOMAIN in deploy/.env" >&2; exit 1; }
[ -n "$RESEND_API_KEY" ] || { echo "Set RESEND_API_KEY in deploy/.env (needed for signup emails)" >&2; exit 1; }
RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL:-"MTG Bookings <bookings@$SITE_DOMAIN>"}
# "Name <addr@x>" -> sender name + address
SENDER_ADDR=$(echo "$RESEND_FROM_EMAIL" | sed -nE 's/.*<([^>]+)>.*/\1/p'); SENDER_ADDR=${SENDER_ADDR:-$RESEND_FROM_EMAIL}
SENDER_NAME=$(echo "$RESEND_FROM_EMAIL" | sed -nE 's/^ *([^<]+[^< ]) *<.*/\1/p'); SENDER_NAME=${SENDER_NAME:-Maldives Tour Guide}

if [ ! -d "$SB_DIR" ]; then
  echo "==> Downloading official Supabase self-hosting setup"
  cd "$HOME"
  curl -fsSL https://raw.githubusercontent.com/supabase/supabase/master/docker/setup.sh -o /tmp/supabase-setup.sh
  # -y: no prompts, generates all secrets and keys; --skip-deps: Docker is
  # already installed by server-setup.sh.
  sh /tmp/supabase-setup.sh -y --skip-deps --project-dir supabase-project
fi
cd "$SB_DIR"
[ -f .env ] || { echo "Supabase .env was not created — check the setup output above." >&2; exit 1; }

set_env() { # set_env KEY VALUE  (in ~/supabase-project/.env)
  local key=$1 val=$2 esc
  esc=$(printf '%s' "$val" | sed -e 's/[\/&|]/\\&/g')
  if grep -qE "^$key=" .env; then sed -i -E "s|^$key=.*$|$key=$esc|" .env; else printf '%s=%s\n' "$key" "$val" >> .env; fi
}

echo "==> Applying MTG settings"
set_env SUPABASE_PUBLIC_URL "https://$API_DOMAIN"
set_env API_EXTERNAL_URL "https://$API_DOMAIN/auth/v1"
set_env SITE_URL "https://$SITE_DOMAIN"
redirects="https://$SITE_DOMAIN/**,https://www.$SITE_DOMAIN/**"
[ -n "$PREVIEW_DOMAIN" ] && redirects="$redirects,https://$PREVIEW_DOMAIN/**"
set_env ADDITIONAL_REDIRECT_URLS "$redirects"
set_env POOLER_TENANT_ID "mtg"
set_env ENABLE_PHONE_SIGNUP "false"
set_env ENABLE_PHONE_AUTOCONFIRM "false"
set_env ENABLE_EMAIL_AUTOCONFIRM "false"
set_env SMTP_HOST "smtp.resend.com"
set_env SMTP_PORT "465"
set_env SMTP_USER "resend"
set_env SMTP_PASS "$RESEND_API_KEY"
set_env SMTP_ADMIN_EMAIL "$SENDER_ADDR"
set_env SMTP_SENDER_NAME "\"$SENDER_NAME\""
set_env STUDIO_DEFAULT_ORGANIZATION "\"Maldives Tour Guide\""
set_env STUDIO_DEFAULT_PROJECT "MTG"
set_env OPENAI_API_KEY ""

cp "$REPO_DIR/deploy/supabase/docker-compose.mtg.yml" ./docker-compose.mtg.yml
mkdir -p volumes/templates
cp "$REPO_DIR"/deploy/supabase/templates/*.html volumes/templates/
mkdir -p volumes/templates-proxy
cp "$REPO_DIR/deploy/supabase/templates-proxy/Caddyfile" volumes/templates-proxy/Caddyfile
compose_files=$(grep -E '^COMPOSE_FILE=' .env | cut -d= -f2- | tr -d "\"'")
case ":$compose_files:" in
  *":docker-compose.mtg.yml:"*) ;;
  *) set_env COMPOSE_FILE "${compose_files:-docker-compose.yml}:docker-compose.mtg.yml" ;;
esac
chmod 600 .env

echo "==> Copying API keys into deploy/.env"
ANON_KEY=$(grep -E '^ANON_KEY=' .env | cut -d= -f2-)
SERVICE_ROLE_KEY=$(grep -E '^SERVICE_ROLE_KEY=' .env | cut -d= -f2-)
POSTGRES_PASSWORD=$(grep -E '^POSTGRES_PASSWORD=' .env | cut -d= -f2-)
set_app() {
  local key=$1 val=$2 esc
  esc=$(printf '%s' "$val" | sed -e 's/[\/&|]/\\&/g')
  if grep -qE "^$key=" "$APP_ENV"; then sed -i -E "s|^$key=.*$|$key=$esc|" "$APP_ENV"; else printf '%s=%s\n' "$key" "$val" >> "$APP_ENV"; fi
}
set_app NEXT_PUBLIC_SUPABASE_URL "https://$API_DOMAIN"
set_app NEXT_PUBLIC_SUPABASE_ANON_KEY "$ANON_KEY"
set_app SUPABASE_SERVICE_ROLE_KEY "$SERVICE_ROLE_KEY"
set_app DATABASE_URL "postgres://postgres.mtg:$POSTGRES_PASSWORD@127.0.0.1:5432/postgres?sslmode=disable"
chmod 600 "$APP_ENV"

echo "==> Starting Supabase"
docker compose pull
docker compose up -d
echo
echo "Supabase is starting. Check with:  cd ~/supabase-project && docker compose ps"
echo "Dashboard (once DNS + Caddy are up): https://$API_DOMAIN"
echo "  username: $(grep -E '^DASHBOARD_USERNAME=' .env | cut -d= -f2-)"
echo "  password: see DASHBOARD_PASSWORD in ~/supabase-project/.env"
