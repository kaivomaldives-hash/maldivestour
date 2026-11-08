# Moving MTG to a Hostinger VPS with self-hosted Supabase

This guide moves maldivestour.guide off **Vercel + Supabase cloud** and onto
**one Hostinger VPS** that runs both the website and Supabase. The code
doesn't change; only where it runs does.

The live site stays on Vercel and Supabase cloud until step 10, after the new
server has been fully tested. If anything goes wrong after the switch, point
the domain back at Vercel (step 10, "Going back") and the old setup works as
before.

**What runs on the server**

| Part | What it is | Public address |
|---|---|---|
| Website | The Next.js app in a Docker container | `https://maldivestour.guide` |
| Preview | The same website, hidden from Google, for testing | `https://new.maldivestour.guide` |
| Supabase | Database, logins, file storage, dashboard (official self-hosted Docker setup) | `https://api.maldivestour.guide` |
| Caddy | Handles HTTPS certificates automatically | — |
| Backups | Database and files every night, copied off the server | — |

Only ports 22 (SSH), 80 and 443 are open. The database, the app's own port
and the Supabase gateway listen only on the server itself.

**Files in this folder**

| File | Purpose |
|---|---|
| `scripts/server-setup.sh` | One-time server setup: updates, firewall, swap, Docker, tools, `mtg` user |
| `scripts/install-supabase.sh` | Installs self-hosted Supabase with MTG's settings |
| `scripts/migrate-database.sh` | Copies the database from Supabase cloud |
| `scripts/copy-storage.sh` | Copies all photos and documents from Supabase cloud |
| `scripts/rewrite-storage-urls.sh` | Points older image links at the new server |
| `scripts/deploy-app.sh` | Pulls the latest code, runs new migrations, rebuilds the site |
| `scripts/check-site.sh` | Health check of everything |
| `scripts/backup.sh` / `restore-backup.sh` | Nightly backups and restoring one |
| `docker-compose.yml`, `Caddyfile`, `app/Dockerfile` | How the website and HTTPS run |
| `supabase/` | MTG's additions to Supabase: email templates and security settings |

---

## 1. Buy the VPS

1. In Hostinger, buy a **VPS** plan with at least **8 GB RAM** (KVM 2 or
   higher). Ordinary "web hosting" plans can't run this.
2. Operating system: **Ubuntu 24.04** (plain, no control panel).
3. Location: the one closest to most of your visitors.
4. Set a strong root password. If you have an SSH key, add it too.
5. Note the server's **IP address** from the Hostinger VPS dashboard.

## 2. Add two DNS records (the live site is not affected)

Wherever your domain's DNS is managed (Vercel → Domains, or your domain
registrar), add:

| Type | Name | Value |
|---|---|---|
| A | `api` | your VPS IP |
| A | `new` | your VPS IP |

**Don't change** the records for `@` or `www` yet; those keep the live site
on Vercel until step 10.

> If your DNS is managed inside Vercel, you'll need to move it to your
> registrar (or Hostinger) before cancelling Vercel. Add the same records
> there first; see step 11.

## 3. Set up the server

On your PC, open PowerShell in this project folder and copy the setup script
to the server (replace `SERVER_IP`):

```bash
scp deploy/scripts/server-setup.sh root@SERVER_IP:/root/
```

Then log in and run it:

```bash
ssh root@SERVER_IP
```

```bash
bash /root/server-setup.sh
```

It asks you to choose a password for the new `mtg` user. At the end it
prints a key starting with `ssh-ed25519`. Copy it.

From now on, log in as `mtg` instead of root: `ssh mtg@SERVER_IP`.

## 4. Get the code onto the server

1. On GitHub, open **kaivomaldives-hash/maldivestour → Settings → Deploy
   keys → Add deploy key**. Paste the key from step 3, name it `MTG VPS`, and
   leave **Allow write access** off.
2. On the server, as `mtg`:

```bash
git clone git@github.com:kaivomaldives-hash/maldivestour.git ~/maldivestour
```

```bash
cd ~/maldivestour && git checkout main
```

> The server deploys the `main` branch. These deploy files must be merged
> into `main` first. To deploy another branch, set `DEPLOY_BRANCH` in step 5.

## 5. Fill in the settings

```bash
cp deploy/.env.example deploy/.env && nano deploy/.env
```

Fill in `ACME_EMAIL`, and copy `RESEND_API_KEY`, `RESEND_FROM_EMAIL`,
`TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` from **Vercel → Project →
Settings → Environment Variables**. Leave the Supabase keys and
`DATABASE_URL` empty; step 6 fills them in. Save with Ctrl+O, Enter, Ctrl+X.

## 6. Install Supabase

```bash
bash deploy/scripts/install-supabase.sh
```

This uses Supabase's own official setup script, generates all passwords and
keys, sets up signup emails through your Resend account, and starts
Supabase. Check that every container shows `healthy` (it can take a minute):

```bash
cd ~/supabase-project && docker compose ps; cd ~/maldivestour
```

**Save both `.env` files somewhere safe**, such as a password manager:
`~/supabase-project/.env` and `~/maldivestour/deploy/.env`. They hold the
keys to your data and are not included in backups.

## 7. Copy your data from Supabase cloud

You need three things from the Supabase cloud dashboard:

- **Database connection string**: **Connect → Session pooler**. Fill in your
  database password.
- **Storage keys**: **Storage → S3 Configuration → Access keys → New access
  key**. Note the endpoint, region, key ID and secret.
- **Your project's cloud address**, like `https://abcdefghijklmnopqrst.supabase.co`
  (**Project Settings → Data API**).

Then run these three scripts in order. Put a space before each command so
the passwords don't stay in your shell history.

```bash
 CLOUD_DB_URL='postgresql://postgres.REF:PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres' bash deploy/scripts/migrate-database.sh
```

```bash
 CLOUD_S3_ENDPOINT='https://REF.storage.supabase.co/storage/v1/s3' CLOUD_S3_REGION='REGION' CLOUD_S3_KEY_ID='KEY_ID' CLOUD_S3_SECRET='SECRET' bash deploy/scripts/copy-storage.sh
```

```bash
OLD_URL='https://REF.supabase.co' bash deploy/scripts/rewrite-storage-urls.sh
```

The last one only reports. If it lists rows, run it again with `--apply` at
the end.

`migrate-database.sh` ends by comparing the row count of every table. They
should match, apart from anything added on the live site in the meantime.
If the restore stops on a table that only exists on Supabase cloud, the
script tells you how to skip it.

**Check the email wording:** in the Supabase cloud dashboard, open
**Authentication → Emails**. If you customised the "Confirm signup",
"Invite" or "Reset password" emails, copy your wording into the matching file
in `deploy/supabase/templates/`. Keep the link in `confirmation.html` exactly
as it is; it's what makes the signup confirmation work with this site.

## 8. Start the website

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d caddy
```

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build app
```

Caddy starts first because building the site reads data from
`https://api.maldivestour.guide`. The first build takes 5–10 minutes.

## 9. Test everything on the preview address

```bash
bash deploy/scripts/check-site.sh --preview
```

Every line should say OK. Then test by hand at `https://new.maldivestour.guide`:

- [ ] Home page, a few island, activity and stay pages; photos load
- [ ] Log in to `/admin` with your usual email and password
- [ ] Admin: bookings, partners, and a partner's **Download** document button
- [ ] Sign up as a test partner. The confirmation email arrives, and its link logs you in to `/partner`
- [ ] As that partner: upload a verification document and create a listing
- [ ] Send a booking request. The Resend email and the Telegram alert both arrive
- [ ] Supabase dashboard at `https://api.maldivestour.guide` (username `supabase`, password `DASHBOARD_PASSWORD` in `~/supabase-project/.env`)

**Set up backups and test them:**

1. Connect an off-server copy, for example Google Drive: run `rclone config`,
   choose **n** (new remote), name it **offsite**, pick **Google Drive**, and
   follow the prompts. On a server without a browser, choose "No" for auto
   config and follow the link it shows.
2. Run one backup now, then turn on the nightly backup:

```bash
bash deploy/scripts/backup.sh
```

```bash
bash deploy/scripts/backup.sh --install-cron
```

3. Test a restore while nothing depends on this server yet:

```bash
bash deploy/scripts/restore-backup.sh ~/backups/$(ls ~/backups | grep ^2 | tail -n1)
```

Afterwards, run `check-site.sh --preview` again.

## 10. Switch-over day

Pick a quiet time. It takes about 30 minutes.

1. **The day before:** lower the TTL of the `@` and `www` DNS records to 5
   minutes (300 seconds), so the switch spreads quickly.
2. **Final copy of the data.** This wipes the test data on the server and copies
   the latest from Supabase cloud:

```bash
 CLOUD_DB_URL='...' bash deploy/scripts/migrate-database.sh --fresh
```

```bash
 CLOUD_S3_ENDPOINT='...' CLOUD_S3_REGION='...' CLOUD_S3_KEY_ID='...' CLOUD_S3_SECRET='...' bash deploy/scripts/copy-storage.sh
```

```bash
OLD_URL='https://REF.supabase.co' bash deploy/scripts/rewrite-storage-urls.sh --apply
```

```bash
docker compose -f deploy/docker-compose.yml --env-file deploy/.env up -d --build app
```

3. **Switch the domain:** change the `@` A record to your VPS IP, and `www`
   to a CNAME for `maldivestour.guide` (or an A record to the VPS IP). Caddy
   gets the HTTPS certificate automatically within a minute or two of DNS
   reaching the server.
4. **Check it:** `bash deploy/scripts/check-site.sh`, and log in to `/admin`.
   Everyone who was logged in has to log in once more; that's expected.
5. **Turn on automatic deploys from GitHub.** On the server:

```bash
ssh-keygen -t ed25519 -N "" -C github-actions -f ~/.ssh/github_actions && cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys && cat ~/.ssh/github_actions
```

   On GitHub: **Settings → Secrets and variables → Actions**.
   - Secrets: `VPS_HOST` = your VPS IP, and `VPS_SSH_KEY` = the private key
     printed above (all of it, including the BEGIN/END lines).
   - Variables: `VPS_DEPLOY_ENABLED` = `true`.

   From now on, every push to `main` deploys to the VPS, and database
   migrations go there instead of to Supabase cloud.
6. **Anything made in the gap:** bookings or signups made on the old site
   between the final copy and the DNS switch are only in Supabase cloud.
   Check the cloud dashboard's newest bookings and re-enter any by hand.

**Going back** (only if something is badly wrong): point `@` and `www` back to
Vercel's records. Vercel and Supabase cloud are untouched, so the old site
works immediately. Anything entered on the VPS in the meantime would need
copying back by hand.

## 11. After a week of running smoothly

- **Vercel:** if your DNS is managed in Vercel, move it to your registrar or
  Hostinger first, copying every record (including email records such as MX
  and TXT). Then delete the Vercel project and downgrade to the free plan.
- **Supabase cloud:** download a last backup (**Database → Backups**), delete
  the S3 access key from step 7, then pause or delete the project and
  downgrade to the free plan.
- **Remove the old migration workflow** (`.github/workflows/supabase-deploy.yml`)
  once the cloud project is gone.

## Everyday maintenance

| Task | Command (as `mtg`, in `~/maldivestour`) |
|---|---|
| Health check | `bash deploy/scripts/check-site.sh` |
| Deploy by hand | `bash deploy/scripts/deploy-app.sh` |
| Website logs | `docker compose -f deploy/docker-compose.yml --env-file deploy/.env logs --tail 100 app` |
| Supabase logs | `cd ~/supabase-project && docker compose logs --tail 100 auth` (or `rest`, `storage`, `db`) |
| Backup now | `bash deploy/scripts/backup.sh` |
| Disk space | `df -h /` and `docker system df` |
| Update Supabase | Back up first, then `cd ~/supabase-project && sh update.sh && sh run.sh pull && sh run.sh recreate` |

Ubuntu installs security updates automatically. Check the backup log
(`~/backups/backup.log`) and run the health check now and then.
