#!/usr/bin/env bash
# One-time setup of a fresh Hostinger VPS (Ubuntu 24.04), run as root:
#   bash server-setup.sh
#
# - Installs security updates (and keeps them automatic)
# - Adds a 4 GB swap file (building the site needs the headroom)
# - Firewall: only SSH, HTTP and HTTPS open; fail2ban against SSH brute force
# - Installs Docker, rclone (file copy + off-server backups), Supabase CLI
# - Creates the "mtg" user that runs everything, with your SSH key
# - Creates an SSH key for GitHub, so the server can pull the code
set -euo pipefail

if [ "$(id -u)" -ne 0 ]; then echo "Run this as root." >&2; exit 1; fi
DEPLOY_USER=mtg
export DEBIAN_FRONTEND=noninteractive

echo "==> System updates"
apt-get update -y
apt-get upgrade -y
apt-get install -y ca-certificates curl git jq unzip openssl ufw fail2ban unattended-upgrades postgresql-client
dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> Swap (4 GB)"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
  sysctl -w vm.swappiness=10
  echo 'vm.swappiness=10' > /etc/sysctl.d/99-mtg-swap.conf
fi

echo "==> Firewall"
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 443/udp
ufw --force enable
systemctl enable --now fail2ban

echo "==> Docker"
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker
# Keep container logs from filling the disk.
mkdir -p /etc/docker
if [ ! -f /etc/docker/daemon.json ]; then
  echo '{ "log-driver": "json-file", "log-opts": { "max-size": "20m", "max-file": "3" } }' > /etc/docker/daemon.json
  systemctl restart docker
fi

echo "==> rclone"
command -v rclone >/dev/null 2>&1 || curl -fsSL https://rclone.org/install.sh | bash

echo "==> Supabase CLI"
if ! command -v supabase >/dev/null 2>&1; then
  arch=$(dpkg --print-architecture)
  url=$(curl -fsSL https://api.github.com/repos/supabase/cli/releases/latest \
    | jq -r ".assets[] | select(.name | test(\"linux_${arch}.deb$\")) | .browser_download_url" | head -n1)
  curl -fsSL "$url" -o /tmp/supabase.deb
  apt-get install -y /tmp/supabase.deb
  rm -f /tmp/supabase.deb
fi

echo "==> User '$DEPLOY_USER'"
if ! id "$DEPLOY_USER" >/dev/null 2>&1; then
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
fi
usermod -aG docker,sudo "$DEPLOY_USER"
# Same SSH keys as root, so you can log in as mtg the same way.
if [ -f /root/.ssh/authorized_keys ]; then
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /home/$DEPLOY_USER/.ssh
  install -m 600 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /root/.ssh/authorized_keys /home/$DEPLOY_USER/.ssh/authorized_keys
fi
echo "Set a password for the '$DEPLOY_USER' user (used for sudo):"
passwd "$DEPLOY_USER" || true

echo "==> GitHub key for pulling the code"
KEY=/home/$DEPLOY_USER/.ssh/github_deploy
if [ ! -f "$KEY" ]; then
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" /home/$DEPLOY_USER/.ssh
  sudo -u "$DEPLOY_USER" ssh-keygen -t ed25519 -N "" -C "mtg-vps-deploy" -f "$KEY"
  sudo -u "$DEPLOY_USER" tee /home/$DEPLOY_USER/.ssh/config >/dev/null <<EOF
Host github.com
  IdentityFile $KEY
  IdentitiesOnly yes
EOF
  chmod 600 /home/$DEPLOY_USER/.ssh/config
  sudo -u "$DEPLOY_USER" ssh-keyscan github.com >> /home/$DEPLOY_USER/.ssh/known_hosts 2>/dev/null
fi

echo
echo "Done. Next steps (deploy/README.md, step 4):"
echo "Add this key to GitHub -> repo -> Settings -> Deploy keys (read-only):"
echo
cat "$KEY.pub"
