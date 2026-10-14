-- Travel Agent & Affiliate programme, Phase 1 foundation: self-service
-- account application + admin approval for both programme types only.
-- No discount/commission/booking-snapshot logic yet -- that is later,
-- separate migrations (Phase 2+), the same incremental approach the
-- partner portal used (20261011000100_partner_portal_foundation.sql /
-- 20261011000200_partner_listings_and_bookings.sql).
--
-- Shape is deliberately a copy of partner_accounts: a decoupled identity
-- table (never profiles.role -- an agent/affiliate is a business
-- relationship, not a position on the staff privilege ladder), an
-- is_X()/is_approved_X() SECURITY DEFINER RPC pair, a self-review-
-- prevention trigger, and _self_*/_staff_all RLS. Unlike partner_accounts
-- there is no 'profile'/'submitted' two-step: the task's own spec lists
-- exactly four states (Pending, Approved, Rejected, Suspended), and
-- neither programme requires uploaded verification documents before
-- admin review, so the signup RPC inserts directly into 'pending'.

create table agent_accounts (
  id                 uuid primary key references auth.users(id) on delete cascade,
  business_name      text not null,
  contact_email      text not null,
  contact_phone      text,
  whatsapp           text,
  country            text,
  -- Collected now (Phase 1) even though no payout exists yet (Phase 2+
  -- builds on "if a separate commission/earnings policy is approved") --
  -- the task asks for it to be collected at application time.
  paypal_email       text,
  status             text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  rejection_reason   text,
  reviewed_by        uuid references auth.users(id),
  reviewed_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index agent_accounts_status_idx on agent_accounts(status);

create trigger agent_accounts_set_updated_at
  before update on agent_accounts
  for each row execute function set_updated_at();

create table affiliate_accounts (
  id                 uuid primary key references auth.users(id) on delete cascade,
  business_name      text not null,
  contact_email      text not null,
  contact_phone      text,
  whatsapp           text,
  country            text,
  paypal_email       text,
  -- Server-generated at signup, never affiliate-chosen -- see
  -- generate_affiliate_referral_code() below. Non-guessable (random,
  -- not sequential), unique, and this is the ONE tracking token Phase 1
  -- creates; click tracking and the ?ref= attribution cookie are a
  -- later migration once this identity actually has something to
  -- attribute.
  referral_code      text not null unique,
  status             text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  rejection_reason   text,
  reviewed_by        uuid references auth.users(id),
  reviewed_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index affiliate_accounts_status_idx on affiliate_accounts(status);
create index affiliate_accounts_referral_code_idx on affiliate_accounts(referral_code);

create trigger affiliate_accounts_set_updated_at
  before update on affiliate_accounts
  for each row execute function set_updated_at();

-- ─────────────────────────────────────────────────────────────────
-- RLS helpers -- same SECURITY DEFINER shape as is_partner()/
-- is_approved_partner(), so a policy on these tables calling is_agent()/
-- is_affiliate() can't recurse into its own RLS evaluation. A booking's
-- 10%/5% discount gate (Phase 2+) will call is_approved_agent()/
-- is_approved_affiliate() specifically -- a merely-applied-but-not-yet-
-- approved account must never qualify.
-- ─────────────────────────────────────────────────────────────────
create or replace function is_agent() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from agent_accounts a where a.id = auth.uid());
$$;

create or replace function is_approved_agent() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from agent_accounts a where a.id = auth.uid() and a.status = 'approved');
$$;

create or replace function is_affiliate() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from affiliate_accounts a where a.id = auth.uid());
$$;

create or replace function is_approved_affiliate() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from affiliate_accounts a where a.id = auth.uid() and a.status = 'approved');
$$;

revoke all on function is_agent from public;
revoke all on function is_approved_agent from public;
revoke all on function is_affiliate from public;
revoke all on function is_approved_affiliate from public;
grant execute on function is_agent to anon, authenticated;
grant execute on function is_approved_agent to anon, authenticated;
grant execute on function is_affiliate to anon, authenticated;
grant execute on function is_approved_affiliate to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────
-- Self-review-prevention: an agent/affiliate may edit their own contact
-- details (including paypal_email) at any time, but never their own
-- status or review fields -- same "RLS's USING/WITH CHECK gates rows,
-- not columns" reasoning as prevent_partner_self_review()/
-- prevent_profile_role_self_escalation(). An affiliate additionally can
-- never touch their own referral_code.
-- ─────────────────────────────────────────────────────────────────
create or replace function prevent_agent_self_review() returns trigger as $$
begin
  if not is_staff() then
    if new.status is distinct from old.status
       or new.reviewed_by is distinct from old.reviewed_by
       or new.reviewed_at is distinct from old.reviewed_at
       or new.rejection_reason is distinct from old.rejection_reason then
      raise exception 'only staff may change an agent account''s review status';
    end if;
  end if;
  return new;
end;
$$ language plpgsql set search_path = public, pg_temp;

create trigger agent_accounts_prevent_self_review
  before update on agent_accounts
  for each row execute function prevent_agent_self_review();

create or replace function prevent_affiliate_self_review() returns trigger as $$
begin
  if not is_staff() then
    if new.status is distinct from old.status
       or new.reviewed_by is distinct from old.reviewed_by
       or new.reviewed_at is distinct from old.reviewed_at
       or new.rejection_reason is distinct from old.rejection_reason
       or new.referral_code is distinct from old.referral_code then
      raise exception 'only staff may change an affiliate account''s review status or referral code';
    end if;
  end if;
  return new;
end;
$$ language plpgsql set search_path = public, pg_temp;

create trigger affiliate_accounts_prevent_self_review
  before update on affiliate_accounts
  for each row execute function prevent_affiliate_self_review();

-- ─────────────────────────────────────────────────────────────────
-- RLS -- an agent/affiliate can read/write only their own row (columns
-- protected above); staff can do everything.
-- ─────────────────────────────────────────────────────────────────
alter table agent_accounts enable row level security;
create policy agent_accounts_self_select on agent_accounts for select using (id = auth.uid());
create policy agent_accounts_self_update on agent_accounts for update using (id = auth.uid()) with check (id = auth.uid());
create policy agent_accounts_staff_all   on agent_accounts for all using (is_staff()) with check (is_staff());

alter table affiliate_accounts enable row level security;
create policy affiliate_accounts_self_select on affiliate_accounts for select using (id = auth.uid());
create policy affiliate_accounts_self_update on affiliate_accounts for update using (id = auth.uid()) with check (id = auth.uid());
create policy affiliate_accounts_staff_all   on affiliate_accounts for all using (is_staff()) with check (is_staff());

-- ─────────────────────────────────────────────────────────────────
-- Signup RPCs -- the ONLY way an agent_accounts/affiliate_accounts row
-- can ever be created (no INSERT policy exists on either table for
-- anon/authenticated), same guest-safe-RPC shape as
-- create_partner_account()/create_booking_inquiry(). Called right after
-- supabase.auth.signUp() while the new session is live, so auth.uid()
-- resolves to the just-created user. A user may hold both an agent and
-- an affiliate account (decided explicitly -- the two are independent
-- applications), but never two of the same kind.
-- ─────────────────────────────────────────────────────────────────
create or replace function create_agent_account(
  p_business_name   text,
  p_contact_email   text,
  p_contact_phone   text default null,
  p_whatsapp        text default null,
  p_country         text default null,
  p_paypal_email    text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'must be signed in';
  end if;
  if exists (select 1 from agent_accounts where id = v_uid) then
    raise exception 'an agent account already exists for this user';
  end if;
  if p_business_name is null or length(trim(p_business_name)) = 0 then
    raise exception 'business_name is required';
  end if;
  if p_contact_email is null or p_contact_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid contact_email is required';
  end if;
  if p_paypal_email is not null and length(trim(p_paypal_email)) > 0 and p_paypal_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'paypal_email must be a valid email address';
  end if;

  insert into agent_accounts (id, business_name, contact_email, contact_phone, whatsapp, country, paypal_email)
  values (
    v_uid, trim(p_business_name), trim(p_contact_email),
    nullif(trim(p_contact_phone), ''), nullif(trim(p_whatsapp), ''),
    nullif(trim(p_country), ''), nullif(trim(p_paypal_email), '')
  );

  return v_uid;
end;
$$;

revoke all on function create_agent_account(text, text, text, text, text, text) from public;
grant execute on function create_agent_account(text, text, text, text, text, text) to authenticated;

-- Non-guessable referral code: 10 chars from a 32-symbol alphabet with
-- the visually-ambiguous 0/O/1/I removed (so a code read aloud or typed
-- by hand doesn't misfire), retried on the vanishingly rare collision
-- rather than relying on luck alone.
create or replace function generate_affiliate_referral_code() returns text as $$
declare
  v_alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_code     text;
  v_exists   boolean;
begin
  loop
    v_code := '';
    for i in 1..10 loop
      v_code := v_code || substr(v_alphabet, 1 + floor(random() * length(v_alphabet))::int, 1);
    end loop;
    select exists (select 1 from affiliate_accounts where referral_code = v_code) into v_exists;
    if not v_exists then
      return v_code;
    end if;
  end loop;
end;
$$ language plpgsql set search_path = public, pg_temp;

create or replace function create_affiliate_account(
  p_business_name   text,
  p_contact_email   text,
  p_contact_phone   text default null,
  p_whatsapp        text default null,
  p_country         text default null,
  p_paypal_email    text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'must be signed in';
  end if;
  if exists (select 1 from affiliate_accounts where id = v_uid) then
    raise exception 'an affiliate account already exists for this user';
  end if;
  if p_business_name is null or length(trim(p_business_name)) = 0 then
    raise exception 'business_name is required';
  end if;
  if p_contact_email is null or p_contact_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid contact_email is required';
  end if;
  if p_paypal_email is not null and length(trim(p_paypal_email)) > 0 and p_paypal_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'paypal_email must be a valid email address';
  end if;

  insert into affiliate_accounts (id, business_name, contact_email, contact_phone, whatsapp, country, paypal_email, referral_code)
  values (
    v_uid, trim(p_business_name), trim(p_contact_email),
    nullif(trim(p_contact_phone), ''), nullif(trim(p_whatsapp), ''),
    nullif(trim(p_country), ''), nullif(trim(p_paypal_email), ''),
    generate_affiliate_referral_code()
  );

  return v_uid;
end;
$$;

revoke all on function create_affiliate_account(text, text, text, text, text, text) from public;
grant execute on function create_affiliate_account(text, text, text, text, text, text) to authenticated;

-- ─────────────────────────────────────────────────────────────────
-- Admin audit log -- a separate table from the commission ledger that
-- Phase 2+ adds (explicit decision: financial ledger entries and
-- approval/rejection/suspension actions are recorded independently).
-- Insert-only via log_admin_action(): no INSERT/UPDATE/DELETE policy
-- exists for anon/authenticated at all, so actor_id can never be
-- forged by the client -- the function reads auth.uid() itself as the
-- sole source, the same trust boundary create_booking_inquiry() already
-- relies on for bookings.user_id.
-- ─────────────────────────────────────────────────────────────────
create table admin_audit_log (
  id            uuid primary key default gen_random_uuid(),
  actor_id      uuid references auth.users(id),
  action        text not null,
  target_type   text not null,
  target_id     uuid,
  details       jsonb,
  created_at    timestamptz not null default now()
);
create index admin_audit_log_target_idx on admin_audit_log(target_type, target_id);
create index admin_audit_log_created_at_idx on admin_audit_log(created_at desc);

alter table admin_audit_log enable row level security;
create policy admin_audit_log_staff_read on admin_audit_log for select using (is_staff());

create or replace function log_admin_action(
  p_action       text,
  p_target_type  text,
  p_target_id    uuid,
  p_details      jsonb default null
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not is_staff() then
    raise exception 'only staff may write an audit log entry';
  end if;
  insert into admin_audit_log (actor_id, action, target_type, target_id, details)
  values (auth.uid(), p_action, p_target_type, p_target_id, p_details);
end;
$$;

revoke all on function log_admin_action(text, text, uuid, jsonb) from public;
grant execute on function log_admin_action(text, text, uuid, jsonb) to authenticated;

-- ─────────────────────────────────────────────────────────────────
-- Programme settings -- reusing the existing generic platform_settings
-- table (20250101001000_booking.sql, admin-only RLS already set by
-- 20250101001400_rls_policies.sql) rather than a new settings table.
-- Nothing in the app reads these yet -- Phase 2+ (discount/commission
-- math) is what consumes them -- but the values themselves are the
-- defaults already agreed, seeded now so they exist once that code
-- lands rather than as a second migration.
-- ─────────────────────────────────────────────────────────────────
insert into platform_settings (key, value, description) values
  ('agent_discount_percent', '10', 'Fixed discount an approved Travel Agent receives off eligible rates.'),
  ('affiliate_discount_percent', '5', 'Discount a customer receives when booking through a valid affiliate referral or promo code.'),
  ('affiliate_commission_percent', '5', 'Commission an affiliate earns on an eligible referred booking.'),
  ('commission_base', 'pre_discount_original', 'Which rate an affiliate''s commission is calculated from: pre_discount_original (the eligible rate before any customer discount) or post_discount_final.'),
  ('attribution_model', 'last_click', 'How credit is assigned when more than one affiliate link was clicked before a booking: last_click or first_click.'),
  ('attribution_window_days', '30', 'How many days a referral click or promo-code entry stays eligible for attribution.'),
  ('minimum_payout_amount', '50', 'Minimum payable balance (USD) an agent or affiliate must reach before requesting a payout.'),
  ('stacking_allowed', 'false', 'Whether an agent discount and an affiliate discount/commission may both apply to the same booking. Always false for now.')
on conflict (key) do nothing;
