-- Tracks failed admin login attempts so a cluster of them can trigger an
-- email/Telegram alert (see src/lib/admin/login-security.ts) instead of
-- only being discoverable later by pulling raw Supabase Auth logs — the
-- gap that prompted this (three failed admin logins the owner had no way
-- to immediately recognize or confirm).

create table if not exists admin_login_failures (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  ip           text,
  attempted_at timestamptz not null default now()
);

create index if not exists admin_login_failures_email_attempted_at_idx
  on admin_login_failures (email, attempted_at desc);

-- Service-role only, same posture as booking_notifications: written and
-- read exclusively by trusted server code (src/lib/admin/login-security.ts,
-- via the service-role admin client), never by an RLS-bound anon/
-- authenticated caller. RLS is enabled with no policies defined, so it is
-- default-deny for everyone except the service role, which always
-- bypasses RLS regardless of policies.
alter table admin_login_failures enable row level security;
