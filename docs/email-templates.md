# Email templates

The wording of the customer and account emails is edited in **Admin → Email
Templates** (`/admin/email-templates`). Each email has a subject and a text
with simple formatting:

- a blank line between paragraphs
- `## ` at the start of a line for a heading
- `**bold**`
- `[link text](https://...)`
- `{{placeholder}}` values, listed under each email; the ones marked "on its
  own line" insert a ready-made section (booking details, buttons, icons)

Saving applies to the next email sent. **Reset to original** brings back the
built-in text (`src/lib/email-templates/definitions.ts`).

The saved texts are in the `email_templates` table
(`supabase/migrations/20261115002600_email_templates.sql`). Before that table
exists, every email uses the built-in text.

## Booking emails

Sent by the website itself, so edits apply straight away:

| Email | When |
|---|---|
| Booking request received | The customer submits a booking |
| Booking confirmed | You set a booking to Confirmed |
| Transfer confirmed (with boat details) | You set a transfer to Confirmed after entering the boat details |
| Thank you and review request | You set a booking to Completed (copied to the admin inbox) |

## Account (sign-up) emails

Sign-up confirmation, invitation, password reset, sign-in link and email
change are sent by **Supabase**, not the website. They use the text from the
admin page only once Supabase's **Send Email hook** points at the website:

1. Make a secret: in Supabase cloud, **Authentication → Hooks → Send Email
   hook → HTTPS → Generate secret** (it looks like `v1,whsec_...`). On the
   VPS, make one with `echo "v1,whsec_$(openssl rand -base64 32)"`.
2. Add it to the website's environment as `SEND_EMAIL_HOOK_SECRET` (Vercel →
   Settings → Environment Variables, or `deploy/.env` on the VPS) and
   redeploy.
3. Turn the hook on, with the URL `https://maldivestour.guide/api/auth/send-email/` (with the slash at the end):
   - **Supabase cloud:** Authentication → Hooks → Send Email hook, type
     HTTPS, that URL and the same secret. Save.
   - **VPS:** in `~/supabase-project/.env` set
     `SEND_EMAIL_HOOK_ENABLED=true`,
     `SEND_EMAIL_HOOK_URI=https://maldivestour.guide/api/auth/send-email/` (with the slash at the end) and
     `SEND_EMAIL_HOOK_SECRET=` the same secret, then restart Supabase
     (`docker compose up -d`).
4. Test: sign up with a new email address on a partner sign-up form and
   check the email arrives with your wording.

While the hook is on, Supabase sends no account emails of its own: if the
website is down or the secret doesn't match, sign-up emails fail. To go
back, turn the hook off (or `SEND_EMAIL_HOOK_ENABLED=false`).
