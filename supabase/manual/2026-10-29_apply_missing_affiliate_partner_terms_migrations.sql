-- One-off: apply the 7 migrations that were never run on the live database.
--
-- Found 2026-10-29 while fixing the booking error ("We couldn't submit your
-- request right now"). The live database is missing these, which also breaks
-- holiday quote requests, partner signup and review submissions:
--   20261013000100_agent_affiliate_programme_foundation
--   20261016000100_standard_terms_agreement_required
--   20261017000100_holiday_quote_terms_agreement
--   20261019000100_partner_multi_kind
--   20261030000100_affiliate_promo_codes_and_commission
--   20261031000100_partner_commission_and_agent_discount
--   20261101000100_payout_requests
--
-- Checked before writing this file:
--   * none of the tables/columns these create exist on the live database yet;
--   * the create_booking_inquiry signature dropped in 20261030 matches the live one,
--     so no duplicate overload is left behind;
--   * the full migration chain applies cleanly, in this order, on a fresh Postgres 16
--     with a Supabase auth/storage stub.
--
-- Manual fix (2026-10-29): the agreed_to_terms checks on reviews, partner_accounts,
-- partner_requests and holiday_quote_requests apply only to rows created after this
-- script runs, because those tables already hold rows from before the terms checkbox.
--
-- How to run: Supabase dashboard -> SQL Editor -> paste this whole file -> Run.
-- It is one transaction: if any statement fails, nothing is changed.
-- The last line tells the API to reload its schema cache so the new
-- function signatures are picked up immediately.

begin;

-- ═════════════════════════════════════════════════════════════════
-- 20261013000100_agent_affiliate_programme_foundation.sql
-- ═════════════════════════════════════════════════════════════════

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


-- ═════════════════════════════════════════════════════════════════
-- 20261016000100_standard_terms_agreement_required.sql
-- ═════════════════════════════════════════════════════════════════

-- Standard "I agree to the Terms and Conditions" requirement, extended to
-- every other guest/self-service submission that creates a lasting
-- record or a business relationship: reviews, and partner/agent/affiliate
-- signup + the partner lead form. (Bookings already have this —
-- see 20261001005000_booking_terms_acceptance.sql's p_terms_accepted —
-- and the location comments/media feature got its own
-- content-responsibility version in 20261015000100. This migration is
-- the same enforcement shape applied to the remaining forms.)
--
-- Each RPC rejects the call outright when the flag isn't true (not just
-- a client-side checkbox), and a CHECK constraint on the owning table is
-- a second, independent layer -- same two-layer defense already used
-- throughout this codebase (e.g. prevent_profile_role_self_escalation()
-- alongside RLS).

alter table reviews add column agreed_to_terms boolean not null default false;
-- [manual fix] Existing reviews rows predate the terms checkbox and keep
-- agreed_to_terms = false (never backfilled to true: they didn't agree).
-- The rule applies to rows created from the moment this script runs.
do $fix$ begin
  execute format('alter table reviews add constraint reviews_agreed_to_terms_check check (agreed_to_terms = true or created_at < %L::timestamptz)', now());
end $fix$;

alter table partner_accounts add column agreed_to_terms boolean not null default false;
-- [manual fix] Existing partner_accounts rows predate the terms checkbox and keep
-- agreed_to_terms = false (never backfilled to true: they didn't agree).
-- The rule applies to rows created from the moment this script runs.
do $fix$ begin
  execute format('alter table partner_accounts add constraint partner_accounts_agreed_to_terms_check check (agreed_to_terms = true or created_at < %L::timestamptz)', now());
end $fix$;

alter table agent_accounts add column agreed_to_terms boolean not null default false;
alter table agent_accounts add constraint agent_accounts_agreed_to_terms_check check (agreed_to_terms = true);

alter table affiliate_accounts add column agreed_to_terms boolean not null default false;
alter table affiliate_accounts add constraint affiliate_accounts_agreed_to_terms_check check (agreed_to_terms = true);

alter table partner_requests add column agreed_to_terms boolean not null default false;
-- [manual fix] Existing partner_requests rows predate the terms checkbox and keep
-- agreed_to_terms = false (never backfilled to true: they didn't agree).
-- The rule applies to rows created from the moment this script runs.
do $fix$ begin
  execute format('alter table partner_requests add constraint partner_requests_agreed_to_terms_check check (agreed_to_terms = true or created_at < %L::timestamptz)', now());
end $fix$;

-- ─────────────────────────────────────────────────────────────────
-- submit_review(): add p_agreed_to_terms
-- ─────────────────────────────────────────────────────────────────
drop function if exists submit_review(uuid, smallint, text, text, text, text);

create or replace function submit_review(
  p_node_id         uuid,
  p_rating          smallint,
  p_title           text,
  p_body            text,
  p_guest_name      text,
  p_guest_email     text,
  p_agreed_to_terms boolean
) returns table (id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_user_id uuid := auth.uid();
begin
  if p_rating is null or p_rating not between 1 and 5 then
    raise exception 'rating must be between 1 and 5';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must agree to the Terms and Conditions before submitting.';
  end if;
  if v_user_id is null then
    if p_guest_name is null or length(trim(p_guest_name)) = 0 then
      raise exception 'guest_name is required for a guest review';
    end if;
    if p_guest_email is null or p_guest_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception 'a valid guest_email is required for a guest review';
    end if;
  end if;

  insert into reviews (node_id, user_id, rating, title, body, guest_name, guest_email, status, agreed_to_terms)
  values (p_node_id, v_user_id, p_rating, p_title, p_body,
          case when v_user_id is null then p_guest_name end,
          case when v_user_id is null then p_guest_email end,
          'pending', true)
  returning reviews.id into v_id;

  return query select v_id;
end;
$$;

revoke all on function submit_review(uuid, smallint, text, text, text, text, boolean) from public;
grant execute on function submit_review(uuid, smallint, text, text, text, text, boolean) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────
-- create_partner_account(): add p_agreed_to_terms
-- ─────────────────────────────────────────────────────────────────
drop function if exists create_partner_account(text, text, text, text, text);

create or replace function create_partner_account(
  p_partner_kind     text,
  p_property_type    text,
  p_business_name    text,
  p_contact_email    text,
  p_contact_phone    text default null,
  p_agreed_to_terms  boolean default false
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid       uuid := auth.uid();
  v_node_id   uuid;
  v_base_slug text;
  v_slug      text;
begin
  if v_uid is null then
    raise exception 'must be signed in';
  end if;
  if exists (select 1 from partner_accounts where id = v_uid) then
    raise exception 'a partner account already exists for this user';
  end if;
  if p_partner_kind not in ('property', 'activity', 'package', 'transfer') then
    raise exception 'invalid partner_kind: %', p_partner_kind;
  end if;
  if p_partner_kind = 'property' and (p_property_type is null or p_property_type not in ('resort', 'hotel', 'guesthouse', 'liveaboard')) then
    raise exception 'a valid property_type is required for a property partner';
  end if;
  if p_business_name is null or length(trim(p_business_name)) = 0 then
    raise exception 'business_name is required';
  end if;
  if p_contact_email is null or p_contact_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid contact_email is required';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must agree to the Terms and Conditions before creating a partner account.';
  end if;

  v_base_slug := regexp_replace(lower(trim(p_business_name)), '[^a-z0-9]+', '-', 'g');
  v_base_slug := regexp_replace(v_base_slug, '(^-+|-+$)', '', 'g');
  if v_base_slug = '' then v_base_slug := 'partner'; end if;
  v_slug := v_base_slug || '-' || substr(md5(v_uid::text), 1, 6);

  insert into nodes (node_type, slug, title, status, created_by)
  values ('provider', v_slug, trim(p_business_name), 'draft', v_uid)
  returning id into v_node_id;

  insert into providers (id, legal_name, contact_email, contact_phone)
  values (v_node_id, trim(p_business_name), trim(p_contact_email), nullif(trim(p_contact_phone), ''));

  insert into partner_accounts (id, provider_id, partner_kind, property_type, business_name, contact_email, contact_phone, agreed_to_terms)
  values (
    v_uid, v_node_id, p_partner_kind,
    case when p_partner_kind = 'property' then p_property_type end,
    trim(p_business_name), trim(p_contact_email), nullif(trim(p_contact_phone), ''), true
  );

  return v_uid;
end;
$$;

revoke all on function create_partner_account(text, text, text, text, text, boolean) from public;
grant execute on function create_partner_account(text, text, text, text, text, boolean) to authenticated;

-- ─────────────────────────────────────────────────────────────────
-- create_agent_account(): add p_agreed_to_terms
-- ─────────────────────────────────────────────────────────────────
drop function if exists create_agent_account(text, text, text, text, text, text);

create or replace function create_agent_account(
  p_business_name    text,
  p_contact_email    text,
  p_contact_phone    text default null,
  p_whatsapp         text default null,
  p_country          text default null,
  p_paypal_email     text default null,
  p_agreed_to_terms  boolean default false
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
  if p_agreed_to_terms is not true then
    raise exception 'You must agree to the Terms and Conditions before applying as a Travel Agent.';
  end if;

  insert into agent_accounts (id, business_name, contact_email, contact_phone, whatsapp, country, paypal_email, agreed_to_terms)
  values (
    v_uid, trim(p_business_name), trim(p_contact_email),
    nullif(trim(p_contact_phone), ''), nullif(trim(p_whatsapp), ''),
    nullif(trim(p_country), ''), nullif(trim(p_paypal_email), ''), true
  );

  return v_uid;
end;
$$;

revoke all on function create_agent_account(text, text, text, text, text, text, boolean) from public;
grant execute on function create_agent_account(text, text, text, text, text, text, boolean) to authenticated;

-- ─────────────────────────────────────────────────────────────────
-- create_affiliate_account(): add p_agreed_to_terms
-- ─────────────────────────────────────────────────────────────────
drop function if exists create_affiliate_account(text, text, text, text, text, text);

create or replace function create_affiliate_account(
  p_business_name    text,
  p_contact_email    text,
  p_contact_phone    text default null,
  p_whatsapp         text default null,
  p_country          text default null,
  p_paypal_email     text default null,
  p_agreed_to_terms  boolean default false
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
  if p_agreed_to_terms is not true then
    raise exception 'You must agree to the Terms and Conditions before applying as an Affiliate.';
  end if;

  insert into affiliate_accounts (id, business_name, contact_email, contact_phone, whatsapp, country, paypal_email, referral_code, agreed_to_terms)
  values (
    v_uid, trim(p_business_name), trim(p_contact_email),
    nullif(trim(p_contact_phone), ''), nullif(trim(p_whatsapp), ''),
    nullif(trim(p_country), ''), nullif(trim(p_paypal_email), ''),
    generate_affiliate_referral_code(), true
  );

  return v_uid;
end;
$$;

revoke all on function create_affiliate_account(text, text, text, text, text, text, boolean) from public;
grant execute on function create_affiliate_account(text, text, text, text, text, text, boolean) to authenticated;

-- ─────────────────────────────────────────────────────────────────
-- submit_partner_request(): add p_agreed_to_terms
-- ─────────────────────────────────────────────────────────────────
drop function if exists submit_partner_request(text, text, text, text, text, text);

create or replace function submit_partner_request(
  p_partner_type     text,
  p_name             text,
  p_email            text,
  p_phone            text,
  p_company_name     text,
  p_message          text,
  p_agreed_to_terms  boolean
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_partner_type not in ('international_travel_agent', 'property_owner', 'activity_provider', 'transfer_provider') then
    raise exception 'invalid partner_type: %', p_partner_type;
  end if;
  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'name is required';
  end if;
  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid email is required';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must agree to the Terms and Conditions before submitting.';
  end if;

  insert into partner_requests (partner_type, name, email, phone, company_name, message, agreed_to_terms)
  values (p_partner_type, trim(p_name), trim(p_email), nullif(trim(p_phone), ''), nullif(trim(p_company_name), ''), nullif(trim(p_message), ''), true);
end;
$$;

revoke all on function submit_partner_request(text, text, text, text, text, text, boolean) from public;
grant execute on function submit_partner_request(text, text, text, text, text, text, boolean) to anon, authenticated;


-- ═════════════════════════════════════════════════════════════════
-- 20261017000100_holiday_quote_terms_agreement.sql
-- ═════════════════════════════════════════════════════════════════

-- The Holiday Builder quote request (src/components/holiday-builder/
-- holiday-builder-wizard.tsx) was the one remaining booking-style
-- submission with no Terms and Conditions agreement at all -- every
-- other booking path already requires it (see
-- 20261001005000_booking_terms_acceptance.sql's p_terms_accepted). Same
-- enforcement shape: the RPC rejects the call outright when the flag
-- isn't true, and a CHECK constraint on the table is a second,
-- independent layer.

alter table holiday_quote_requests add column agreed_to_terms boolean not null default false;
-- [manual fix] Existing holiday_quote_requests rows predate the terms checkbox and keep
-- agreed_to_terms = false (never backfilled to true: they didn't agree).
-- The rule applies to rows created from the moment this script runs.
do $fix$ begin
  execute format('alter table holiday_quote_requests add constraint holiday_quote_requests_agreed_to_terms_check check (agreed_to_terms = true or created_at < %L::timestamptz)', now());
end $fix$;

drop function if exists submit_holiday_quote_request(text, text, text, text, date, int, int, int, int, jsonb, jsonb, text, numeric);

create or replace function submit_holiday_quote_request(
  p_customer_name        text,
  p_customer_email       text,
  p_customer_whatsapp    text,
  p_additional_requests  text,
  p_arrival_date         date,
  p_nights               int,
  p_adults               int,
  p_children             int,
  p_rooms                int,
  p_itinerary            jsonb,
  p_price_breakdown      jsonb,
  p_currency             text,
  p_estimated_total      numeric,
  p_agreed_to_terms      boolean
) returns table (id uuid, reference text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_reference text;
begin
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'customer_name is required';
  end if;
  if p_customer_email is null or p_customer_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid customer_email is required';
  end if;
  if p_customer_whatsapp is null or length(trim(p_customer_whatsapp)) = 0 then
    raise exception 'customer_whatsapp is required';
  end if;
  if p_nights is null or p_nights <= 0 then
    raise exception 'nights must be a positive number';
  end if;
  if p_adults is null or p_adults <= 0 then
    raise exception 'adults must be a positive number';
  end if;
  if p_rooms is null or p_rooms <= 0 then
    raise exception 'rooms must be a positive number';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must agree to the Terms and Conditions before submitting.';
  end if;

  if exists (
    select 1 from holiday_quote_requests
    where customer_email = p_customer_email and created_at > now() - interval '2 minutes'
  ) then
    raise exception 'You already submitted this request a moment ago — we will be in touch shortly.';
  end if;

  insert into holiday_quote_requests (
    customer_name, customer_email, customer_whatsapp, additional_requests,
    arrival_date, nights, adults, children, rooms, itinerary, price_breakdown, currency, estimated_total, agreed_to_terms
  ) values (
    trim(p_customer_name), trim(p_customer_email), trim(p_customer_whatsapp), nullif(trim(p_additional_requests), ''),
    p_arrival_date, p_nights, p_adults, coalesce(p_children, 0), p_rooms, p_itinerary, p_price_breakdown, coalesce(p_currency, 'USD'), p_estimated_total, true
  )
  returning holiday_quote_requests.id, holiday_quote_requests.reference into v_id, v_reference;

  return query select v_id, v_reference;
end;
$$;

revoke all on function submit_holiday_quote_request(text, text, text, text, date, int, int, int, int, jsonb, jsonb, text, numeric, boolean) from public;
grant execute on function submit_holiday_quote_request(text, text, text, text, date, int, int, int, int, jsonb, jsonb, text, numeric, boolean) to anon, authenticated;


-- ═════════════════════════════════════════════════════════════════
-- 20261019000100_partner_multi_kind.sql
-- ═════════════════════════════════════════════════════════════════

-- Partners can now hold more than one kind at once (e.g. a resort that
-- also runs its own transfer boats), so partner_accounts.partner_kind
-- (singular) becomes partner_kinds (array). The old singular column is
-- kept, populated as partner_kinds[1] ("primary" kind, for anything that
-- still wants a single label), but every gating/listing-creation check
-- going forward reads the array.
--
-- Also fixes a regression from 20261016000100_standard_terms_agreement_
-- required.sql: that migration made p_agreed_to_terms required (the RPC
-- raise-excepts if it isn't true), but the self-heal signup paths
-- (requirePartner()/requireAgent()/requireAffiliate() and /auth/confirm)
-- never passed it, so any signup that needed email confirmation started
-- failing to create its account row on the user's return visit. Fixed at
-- the application layer alongside this migration (see src/lib/partner/
-- auth.ts, src/lib/agent/auth.ts, src/lib/affiliate/auth.ts,
-- src/app/auth/confirm/route.ts, and the three *-signup-form.tsx
-- components) — nothing in this file addresses it, it's just the same
-- signup-path audit that turned up the partner_kind limitation.

alter table partner_accounts add column partner_kinds text[] not null default '{}';
update partner_accounts set partner_kinds = array[partner_kind] where partner_kinds = '{}';
alter table partner_accounts alter column partner_kinds drop default;

alter table partner_accounts add constraint partner_accounts_partner_kinds_check check (
  cardinality(partner_kinds) > 0
  and partner_kinds <@ array['property', 'activity', 'package', 'transfer']::text[]
);
alter table partner_accounts add constraint partner_accounts_partner_kinds_property_type_check check (
  not ('property' = any (partner_kinds)) or property_type is not null
);

-- ─────────────────────────────────────────────────────────────────
-- create_partner_account(): p_partner_kind text -> p_partner_kinds text[]
-- ─────────────────────────────────────────────────────────────────
drop function if exists create_partner_account(text, text, text, text, text, boolean);

create or replace function create_partner_account(
  p_partner_kinds    text[],
  p_property_type    text,
  p_business_name    text,
  p_contact_email    text,
  p_contact_phone    text default null,
  p_agreed_to_terms  boolean default false
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid       uuid := auth.uid();
  v_node_id   uuid;
  v_base_slug text;
  v_slug      text;
begin
  if v_uid is null then
    raise exception 'must be signed in';
  end if;
  if exists (select 1 from partner_accounts where id = v_uid) then
    raise exception 'a partner account already exists for this user';
  end if;
  if p_partner_kinds is null or cardinality(p_partner_kinds) = 0 then
    raise exception 'at least one partner_kind is required';
  end if;
  if not (p_partner_kinds <@ array['property', 'activity', 'package', 'transfer']::text[]) then
    raise exception 'invalid partner_kind in: %', p_partner_kinds;
  end if;
  if 'property' = any (p_partner_kinds) and (p_property_type is null or p_property_type not in ('resort', 'hotel', 'guesthouse', 'liveaboard')) then
    raise exception 'a valid property_type is required for a property partner';
  end if;
  if p_business_name is null or length(trim(p_business_name)) = 0 then
    raise exception 'business_name is required';
  end if;
  if p_contact_email is null or p_contact_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid contact_email is required';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must agree to the Terms and Conditions before creating a partner account.';
  end if;

  v_base_slug := regexp_replace(lower(trim(p_business_name)), '[^a-z0-9]+', '-', 'g');
  v_base_slug := regexp_replace(v_base_slug, '(^-+|-+$)', '', 'g');
  if v_base_slug = '' then v_base_slug := 'partner'; end if;
  v_slug := v_base_slug || '-' || substr(md5(v_uid::text), 1, 6);

  insert into nodes (node_type, slug, title, status, created_by)
  values ('provider', v_slug, trim(p_business_name), 'draft', v_uid)
  returning id into v_node_id;

  insert into providers (id, legal_name, contact_email, contact_phone)
  values (v_node_id, trim(p_business_name), trim(p_contact_email), nullif(trim(p_contact_phone), ''));

  insert into partner_accounts (id, provider_id, partner_kind, partner_kinds, property_type, business_name, contact_email, contact_phone, agreed_to_terms)
  values (
    v_uid, v_node_id, p_partner_kinds[1], p_partner_kinds,
    case when 'property' = any (p_partner_kinds) then p_property_type end,
    trim(p_business_name), trim(p_contact_email), nullif(trim(p_contact_phone), ''), true
  );

  return v_uid;
end;
$$;

revoke all on function create_partner_account(text[], text, text, text, text, boolean) from public;
grant execute on function create_partner_account(text[], text, text, text, text, boolean) to authenticated;


-- ═════════════════════════════════════════════════════════════════
-- 20261030000100_affiliate_promo_codes_and_commission.sql
-- ═════════════════════════════════════════════════════════════════

-- Affiliate programme, Phase 2: promo codes actually do something, and
-- commission is tracked end to end. Phase 1
-- (20261013000100_agent_affiliate_programme_foundation.sql) built the
-- account/signup/review half and seeded the policy values this phase
-- consumes (affiliate_discount_percent=5, affiliate_commission_percent=5,
-- commission_base=pre_discount_original) — this migration is the "later,
-- separate migration" that comment explicitly deferred.
--
-- Scope: affiliates only. Travel agent discounts and partner-listing
-- commission settlement are separate, later work (explicitly decided with
-- the site owner) — this never touches agent_accounts or providers.
--
-- Money model: the partner (hotel/activity/transfer owner) collects
-- payment from the guest directly — this platform never processes a
-- payment. So "commission" here is bookkeeping only: a snapshot of what
-- an affiliate has earned, which the site owner pays out manually
-- (affiliate_payouts, recorded by staff) — never an automated transfer.

-- ─────────────────────────────────────────────────────────────────
-- bookings: who gets credit, and the commission snapshot.
--
-- discount_percent/commission_percent are snapshotted at booking time
-- (not read live from platform_settings on every display) so a later
-- change to the platform-wide rate never rewrites what a past booking
-- actually promised a customer or owes an affiliate — the same reason
-- destination_label snapshots a customer's exact pick instead of only
-- storing a FK.
-- ─────────────────────────────────────────────────────────────────
alter table bookings add column affiliate_id uuid references affiliate_accounts(id) on delete set null;
alter table bookings add column promo_code text;
alter table bookings add column discount_percent numeric(5,2);
alter table bookings add column commission_percent numeric(5,2);
alter table bookings add column commission_amount numeric(10,2);
alter table bookings add column commission_status text not null default 'none'
  check (commission_status in ('none', 'pending', 'payable', 'void'));

create index bookings_affiliate_idx on bookings(affiliate_id);
create index bookings_commission_status_idx on bookings(commission_status);

-- ─────────────────────────────────────────────────────────────────
-- Commission is always derived, never hand-set: this trigger recomputes
-- commission_amount/commission_status from affiliate_id + the snapshotted
-- commission_percent + whichever price is known, on every insert AND
-- every update — so staff setting quoted_price or changing status later
-- (src/lib/admin/bookings-actions.ts's plain `.update()`, no app code
-- changes needed) automatically keeps the commission ledger correct
-- without a second write path.
--
-- commission_base='pre_discount_original' (the Phase 1 seeded setting)
-- means the commission is a percentage of the ORIGINAL list price, not a
-- price reduced by the customer's discount — and since this platform
-- never actually deducts the discount from estimated_price/quoted_price
-- (the partner honors the discount directly with the guest, off-platform
-- -- see this file's header), estimated_price/quoted_price already ARE
-- that original price, so no separate "undiscounted base" column is
-- needed.
-- ─────────────────────────────────────────────────────────────────
create or replace function recompute_booking_commission() returns trigger as $$
declare
  v_base numeric;
begin
  if new.affiliate_id is null then
    new.commission_amount := null;
    new.commission_status := 'none';
    return new;
  end if;

  if new.status = 'cancelled' then
    new.commission_status := 'void';
    new.commission_amount := null;
    return new;
  end if;

  v_base := coalesce(new.quoted_price, new.estimated_price);
  if v_base is null then
    new.commission_amount := null;
    new.commission_status := 'pending';
    return new;
  end if;

  new.commission_amount := round(v_base * coalesce(new.commission_percent, 0) / 100, 2);
  -- Only a *completed* booking is money actually owed to the affiliate —
  -- "finance tab for completed bookings" was the site owner's own framing.
  -- A priced-but-not-yet-completed booking still shows the commission
  -- amount (useful for staff to see what's coming) but doesn't count
  -- toward a payable balance yet.
  new.commission_status := case when new.status = 'completed' then 'payable' else 'pending' end;
  return new;
end;
$$ language plpgsql;

create trigger bookings_recompute_commission
  before insert or update on bookings
  for each row execute function recompute_booking_commission();

-- ─────────────────────────────────────────────────────────────────
-- Promo code validation — public, read-only, and deliberately narrow:
-- returns only what a booking form needs (whether it's valid and the
-- discount %), never the affiliate's identity/contact details, so a
-- visitor probing random codes can't enumerate your affiliate list.
-- Only an APPROVED affiliate's code ever validates — Phase 1's own
-- comment on is_approved_affiliate() already called this out as the
-- gate "a merely-applied-but-not-yet-approved account must never
-- qualify" for.
-- ─────────────────────────────────────────────────────────────────
create or replace function validate_affiliate_promo_code(p_code text)
returns table (valid boolean, discount_percent numeric)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    exists (select 1 from affiliate_accounts a where upper(a.referral_code) = upper(trim(p_code)) and a.status = 'approved'),
    (select value::numeric from platform_settings where key = 'affiliate_discount_percent');
$$;

revoke all on function validate_affiliate_promo_code(text) from public;
grant execute on function validate_affiliate_promo_code(text) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────
-- create_booking_inquiry gains one trailing parameter (p_promo_code) --
-- same "CREATE OR REPLACE can't change an arg list, drop the old
-- signature first" approach as every previous addition to this function
-- (20250130000100, 20261001006500). The affiliate lookup happens HERE,
-- server-side, from the code alone -- the RPC never trusts a client-
-- supplied affiliate id, discount, or commission number.
-- ─────────────────────────────────────────────────────────────────
drop function if exists create_booking_inquiry(
  text, uuid, uuid, text, text, text, text, text, boolean, uuid, uuid, date, time, date, time,
  text, int, int, int, text, text, numeric, text, text, text
);

create or replace function create_booking_inquiry(
  p_product_type              text,
  p_product_node_id           uuid,
  p_transfer_service_id       uuid,
  p_customer_name              text,
  p_customer_email             text,
  p_customer_phone             text,
  p_customer_whatsapp          text,
  p_nationality                 text,
  p_terms_accepted               boolean,
  p_origin_location_id            uuid,
  p_destination_location_id        uuid,
  p_travel_date                     date,
  p_travel_time                      time,
  p_return_date                       date,
  p_return_time                        time,
  p_trip_type                           text,
  p_adults                              int default 1,
  p_children                            int default 0,
  p_infants                             int default 0,
  p_flight_number                        text default null,
  p_special_requests                      text default null,
  p_estimated_price                        numeric default null,
  p_currency                                text default 'USD',
  p_source                                  text default null,
  p_destination_label                       text default null,
  p_promo_code                              text default null
) returns table (id uuid, booking_reference text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_reference text;
  v_affiliate_id uuid;
  v_discount_percent numeric;
  v_commission_percent numeric;
begin
  if p_product_type not in ('node', 'transfer_service') then
    raise exception 'invalid product_type: %', p_product_type;
  end if;
  if p_product_type = 'node' and p_product_node_id is null then
    raise exception 'product_node_id is required when product_type = node';
  end if;
  if p_product_type = 'transfer_service' and p_transfer_service_id is null then
    raise exception 'transfer_service_id is required when product_type = transfer_service';
  end if;
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'customer_name is required';
  end if;
  if p_customer_email is null or p_customer_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid customer_email is required';
  end if;
  if p_nationality is null or length(trim(p_nationality)) = 0 then
    raise exception 'nationality is required';
  end if;
  if p_terms_accepted is not true then
    raise exception 'you must accept the terms and conditions to book';
  end if;

  -- Duplicate-submission guard: the same email resubmitting the same
  -- product within 2 minutes is almost always a double-click or a client
  -- retry after a slow/dropped response, not a genuinely new inquiry.
  if exists (
    select 1 from bookings
    where customer_email = p_customer_email
      and product_node_id is not distinct from (case when p_product_type = 'node' then p_product_node_id end)
      and transfer_service_id is not distinct from (case when p_product_type = 'transfer_service' then p_transfer_service_id end)
      and created_at > now() - interval '2 minutes'
  ) then
    raise exception 'You already submitted this request a moment ago — we will be in touch shortly.';
  end if;

  -- Basic throttle against scripted abuse: cap total inquiries from one
  -- email address in a short rolling window. Deliberately loose (real
  -- customers legitimately submit a few different inquiries in a session)
  -- rather than a hard per-submission limit.
  if (
    select count(*) from bookings
    where customer_email = p_customer_email and created_at > now() - interval '10 minutes'
  ) >= 5 then
    raise exception 'Too many requests from this email address. Please try again in a few minutes or contact us on WhatsApp.';
  end if;

  -- A code that doesn't resolve to an approved affiliate is treated as no
  -- code at all (never an error) -- a customer mistyping a promo code
  -- must never block their booking.
  if p_promo_code is not null and length(trim(p_promo_code)) > 0 then
    select a.id into v_affiliate_id
    from affiliate_accounts a
    where upper(a.referral_code) = upper(trim(p_promo_code)) and a.status = 'approved';

    if v_affiliate_id is not null then
      select value::numeric into v_discount_percent from platform_settings where key = 'affiliate_discount_percent';
      select value::numeric into v_commission_percent from platform_settings where key = 'affiliate_commission_percent';
    end if;
  end if;

  insert into bookings (
    product_type, product_node_id, transfer_service_id, user_id,
    customer_name, customer_email, customer_phone, customer_whatsapp, nationality, terms_accepted_at,
    origin_location_id, destination_location_id, travel_date, travel_time,
    return_date, return_time, trip_type, adults, children, infants,
    flight_number, special_requests, estimated_price, currency, source,
    destination_label, affiliate_id, promo_code, discount_percent, commission_percent
  ) values (
    p_product_type,
    case when p_product_type = 'node' then p_product_node_id end,
    case when p_product_type = 'transfer_service' then p_transfer_service_id end,
    auth.uid(),                          -- null for anonymous/guest callers, never client-supplied
    p_customer_name, p_customer_email, p_customer_phone, p_customer_whatsapp, p_nationality, now(),
    p_origin_location_id, p_destination_location_id, p_travel_date, p_travel_time,
    p_return_date, p_return_time, p_trip_type, p_adults, p_children, p_infants,
    p_flight_number, p_special_requests, p_estimated_price, p_currency, p_source,
    p_destination_label,
    v_affiliate_id,
    case when v_affiliate_id is not null then upper(trim(p_promo_code)) end,
    v_discount_percent,
    v_commission_percent
  )
  returning bookings.id, bookings.booking_reference into v_id, v_reference;

  return query select v_id, v_reference;
end;
$$;

revoke all on function create_booking_inquiry(
  text, uuid, uuid, text, text, text, text, text, boolean, uuid, uuid, date, time, date, time,
  text, int, int, int, text, text, numeric, text, text, text, text
) from public;
grant execute on function create_booking_inquiry(
  text, uuid, uuid, text, text, text, text, text, boolean, uuid, uuid, date, time, date, time,
  text, int, int, int, text, text, numeric, text, text, text, text
) to anon, authenticated;

-- ─────────────────────────────────────────────────────────────────
-- An affiliate has no RLS access to `bookings` at all today (it's
-- staff-read plus a customer's-own-row policy, and an affiliate is
-- neither) -- and widening that with a row policy would hand them every
-- column, including a stranger's name/email/phone, just so they can see
-- their own commission. A narrow SECURITY DEFINER RPC returning only the
-- commission-relevant columns avoids that entirely, same reasoning as
-- validate_affiliate_promo_code() above never leaking affiliate identity.
-- ─────────────────────────────────────────────────────────────────
create or replace function get_my_affiliate_commission_bookings()
returns table (
  id uuid,
  booking_reference text,
  product_type text,
  product_node_id uuid,
  transfer_service_id uuid,
  commission_amount numeric,
  commission_status text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select b.id, b.booking_reference, b.product_type, b.product_node_id, b.transfer_service_id,
         b.commission_amount, b.commission_status, b.created_at
  from bookings b
  where b.affiliate_id = auth.uid() and b.commission_status <> 'none'
  order by b.created_at desc;
$$;

revoke all on function get_my_affiliate_commission_bookings from public;
grant execute on function get_my_affiliate_commission_bookings to authenticated;

-- ─────────────────────────────────────────────────────────────────
-- Manual payouts -- staff records "I paid this affiliate $X" against
-- their accrued commission. Never tied to one specific booking (an
-- affiliate is paid their running balance, not reconciled line by line),
-- same reasoning the site owner gave for "manual payments" on the
-- finance tab.
-- ─────────────────────────────────────────────────────────────────
create table affiliate_payouts (
  id            uuid primary key default gen_random_uuid(),
  affiliate_id  uuid not null references affiliate_accounts(id) on delete cascade,
  amount        numeric(10,2) not null check (amount > 0),
  currency      text not null default 'USD',
  method        text,
  note          text,
  paid_by       uuid references auth.users(id),
  paid_at       timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index affiliate_payouts_affiliate_idx on affiliate_payouts(affiliate_id);

alter table affiliate_payouts enable row level security;
create policy affiliate_payouts_self_select on affiliate_payouts for select using (affiliate_id = auth.uid());
create policy affiliate_payouts_staff_all   on affiliate_payouts for all using (is_staff()) with check (is_staff());

-- RLS narrows this per-row (self-select / staff-all above) — the grant
-- itself just makes the operations reachable at all for the authenticated
-- role, same pattern as every other staff-managed table (e.g. translations
-- in 20250210000100_i18n_translations_schema.sql).
grant select, insert, update, delete on affiliate_payouts to authenticated;
grant select, insert, update, delete on affiliate_payouts to service_role;


-- ═════════════════════════════════════════════════════════════════
-- 20261031000100_partner_commission_and_agent_discount.sql
-- ═════════════════════════════════════════════════════════════════

-- Partner commission settlement + travel agent discount — the two
-- pieces explicitly confirmed with the site owner as next, after
-- affiliate promo codes/commission (20261030000100):
--
-- 1. Each partner sets their OWN commission on each listing they submit
--    (never a flat platform-wide rate), with a 15% floor they can raise
--    but never lower. Money flows the OPPOSITE direction from the
--    affiliate case: the partner collects payment from the guest
--    directly, and owes MTG this commission afterward — so "payout" here
--    means the partner paying MTG, recorded manually by staff, never an
--    automated transfer.
-- 2. An approved travel agent gets a fixed discount (10%, already seeded
--    as agent_discount_percent in 20261013000100) automatically applied
--    to their own bookings — identity-based (their own login), never a
--    shareable code. platform_settings.stacking_allowed is already
--    'false': an agent's own discount and an affiliate's promo code can
--    never both apply to the same booking, so this never stacks with
--    Phase 2's affiliate logic.

-- ─────────────────────────────────────────────────────────────────
-- Where a listing's commission actually lives: accommodations/
-- activities/packages have no commission column of their own (see this
-- migration's fix to approveListingSubmission, below in the app layer,
-- for why bookable_products — not those three tables — is the right
-- home). Transfer routes differ: their commercial unit is
-- transfer_services, which already carries price/currency, so
-- commission belongs there directly.
-- ─────────────────────────────────────────────────────────────────
alter table bookable_products add column commission_percent numeric(5,2) not null default 15 check (commission_percent >= 15);
alter table transfer_services add column commission_percent numeric(5,2) not null default 15 check (commission_percent >= 15);

-- ─────────────────────────────────────────────────────────────────
-- bookings: partner commission owed (mirrors affiliate_id/
-- commission_percent/commission_amount/commission_status from
-- 20261030000100, same snapshot-at-booking-time reasoning — a partner
-- raising their commission on a listing later must never rewrite what a
-- past booking already owes), plus agent attribution and which of the
-- two discount sources (never both — stacking_allowed) applied.
-- ─────────────────────────────────────────────────────────────────
alter table bookings add column partner_id uuid references partner_accounts(id) on delete set null;
alter table bookings add column partner_commission_percent numeric(5,2);
alter table bookings add column partner_commission_amount numeric(10,2);
alter table bookings add column partner_commission_status text not null default 'none'
  check (partner_commission_status in ('none', 'pending', 'payable', 'void'));
alter table bookings add column agent_id uuid references agent_accounts(id) on delete set null;
alter table bookings add column discount_source text check (discount_source in ('affiliate', 'agent'));

create index bookings_partner_idx on bookings(partner_id);
create index bookings_partner_commission_status_idx on bookings(partner_commission_status);
create index bookings_agent_idx on bookings(agent_id);

-- ─────────────────────────────────────────────────────────────────
-- Extends the existing recompute_booking_commission() trigger (from
-- 20261030000100 — same trigger, not a second one) to also maintain
-- partner_commission_amount/status from partner_id + the snapshotted
-- partner_commission_percent, using the identical price/status logic as
-- the affiliate half right above it. Only a *completed* booking counts
-- as payable, same "finance tab for completed bookings" framing the site
-- owner gave for the affiliate side.
-- ─────────────────────────────────────────────────────────────────
create or replace function recompute_booking_commission() returns trigger as $$
declare
  v_base numeric;
begin
  -- Affiliate commission (unchanged from 20261030000100).
  if new.affiliate_id is null then
    new.commission_amount := null;
    new.commission_status := 'none';
  elsif new.status = 'cancelled' then
    new.commission_status := 'void';
    new.commission_amount := null;
  else
    v_base := coalesce(new.quoted_price, new.estimated_price);
    if v_base is null then
      new.commission_amount := null;
      new.commission_status := 'pending';
    else
      new.commission_amount := round(v_base * coalesce(new.commission_percent, 0) / 100, 2);
      new.commission_status := case when new.status = 'completed' then 'payable' else 'pending' end;
    end if;
  end if;

  -- Partner commission (new).
  if new.partner_id is null then
    new.partner_commission_amount := null;
    new.partner_commission_status := 'none';
  elsif new.status = 'cancelled' then
    new.partner_commission_status := 'void';
    new.partner_commission_amount := null;
  else
    v_base := coalesce(new.quoted_price, new.estimated_price);
    if v_base is null then
      new.partner_commission_amount := null;
      new.partner_commission_status := 'pending';
    else
      new.partner_commission_amount := round(v_base * coalesce(new.partner_commission_percent, 0) / 100, 2);
      new.partner_commission_status := case when new.status = 'completed' then 'payable' else 'pending' end;
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

-- ─────────────────────────────────────────────────────────────────
-- create_booking_inquiry gains partner-commission and agent-discount
-- resolution in its body — no new parameter, no signature change
-- (unlike every previous addition to this function): partner commission
-- is derived purely from the product already being submitted, and the
-- agent discount is derived from auth.uid() itself, both already
-- available to the existing 26-arg signature from 20261030000100.
-- ─────────────────────────────────────────────────────────────────
create or replace function create_booking_inquiry(
  p_product_type              text,
  p_product_node_id           uuid,
  p_transfer_service_id       uuid,
  p_customer_name              text,
  p_customer_email             text,
  p_customer_phone             text,
  p_customer_whatsapp          text,
  p_nationality                 text,
  p_terms_accepted               boolean,
  p_origin_location_id            uuid,
  p_destination_location_id        uuid,
  p_travel_date                     date,
  p_travel_time                      time,
  p_return_date                       date,
  p_return_time                        time,
  p_trip_type                           text,
  p_adults                              int default 1,
  p_children                            int default 0,
  p_infants                             int default 0,
  p_flight_number                        text default null,
  p_special_requests                      text default null,
  p_estimated_price                        numeric default null,
  p_currency                                text default 'USD',
  p_source                                  text default null,
  p_destination_label                       text default null,
  p_promo_code                              text default null
) returns table (id uuid, booking_reference text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_reference text;
  v_affiliate_id uuid;
  v_discount_percent numeric;
  v_commission_percent numeric;
  v_discount_source text;
  v_agent_id uuid;
  v_provider_id uuid;
  v_partner_id uuid;
  v_partner_commission_percent numeric;
begin
  if p_product_type not in ('node', 'transfer_service') then
    raise exception 'invalid product_type: %', p_product_type;
  end if;
  if p_product_type = 'node' and p_product_node_id is null then
    raise exception 'product_node_id is required when product_type = node';
  end if;
  if p_product_type = 'transfer_service' and p_transfer_service_id is null then
    raise exception 'transfer_service_id is required when product_type = transfer_service';
  end if;
  if p_customer_name is null or length(trim(p_customer_name)) = 0 then
    raise exception 'customer_name is required';
  end if;
  if p_customer_email is null or p_customer_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid customer_email is required';
  end if;
  if p_nationality is null or length(trim(p_nationality)) = 0 then
    raise exception 'nationality is required';
  end if;
  if p_terms_accepted is not true then
    raise exception 'you must accept the terms and conditions to book';
  end if;

  if exists (
    select 1 from bookings
    where customer_email = p_customer_email
      and product_node_id is not distinct from (case when p_product_type = 'node' then p_product_node_id end)
      and transfer_service_id is not distinct from (case when p_product_type = 'transfer_service' then p_transfer_service_id end)
      and created_at > now() - interval '2 minutes'
  ) then
    raise exception 'You already submitted this request a moment ago — we will be in touch shortly.';
  end if;

  if (
    select count(*) from bookings
    where customer_email = p_customer_email and created_at > now() - interval '10 minutes'
  ) >= 5 then
    raise exception 'Too many requests from this email address. Please try again in a few minutes or contact us on WhatsApp.';
  end if;

  -- Customer discount: an approved agent's own identity always wins over
  -- a typed-in promo code (stacking_allowed='false' — only one source
  -- ever applies). A signed-out guest or a non-agent falls through to
  -- the existing affiliate-code check unchanged from 20261030000100.
  if auth.uid() is not null and exists (select 1 from agent_accounts ag where ag.id = auth.uid() and ag.status = 'approved') then
    v_agent_id := auth.uid();
    select value::numeric into v_discount_percent from platform_settings where key = 'agent_discount_percent';
    v_discount_source := 'agent';
  elsif p_promo_code is not null and length(trim(p_promo_code)) > 0 then
    select a.id into v_affiliate_id
    from affiliate_accounts a
    where upper(a.referral_code) = upper(trim(p_promo_code)) and a.status = 'approved';

    if v_affiliate_id is not null then
      select value::numeric into v_discount_percent from platform_settings where key = 'affiliate_discount_percent';
      select value::numeric into v_commission_percent from platform_settings where key = 'affiliate_commission_percent';
      v_discount_source := 'affiliate';
    end if;
  end if;

  -- Partner commission: resolve the product's own provider, independent
  -- of the discount logic above entirely — a booking can owe partner
  -- commission whether or not any customer discount applied. A node
  -- might be an accommodation, activity, or package; only one of the
  -- three will ever match a given id, so the coalesce picks whichever
  -- single branch actually returned a row.
  if p_product_type = 'node' then
    select coalesce(
      (select acc.operated_by_provider_id from accommodations acc where acc.id = p_product_node_id),
      (select act.operated_by_provider_id from activities act where act.id = p_product_node_id),
      (select pkg.operated_by_provider_id from packages pkg where pkg.id = p_product_node_id)
    ) into v_provider_id;
    select bp.commission_percent into v_partner_commission_percent from bookable_products bp where bp.id = p_product_node_id;
  else
    select ts.provider_id, ts.commission_percent into v_provider_id, v_partner_commission_percent
    from transfer_services ts where ts.id = p_transfer_service_id;
  end if;

  if v_provider_id is not null then
    select pa.id into v_partner_id from partner_accounts pa where pa.provider_id = v_provider_id;
  end if;
  -- No partner_accounts row (e.g. admin-seeded reference content with no
  -- self-service partner behind it) means no commission applies at all —
  -- never fabricate a partner or a commission for content nobody owns.
  if v_partner_id is null then
    v_partner_commission_percent := null;
  end if;

  insert into bookings (
    product_type, product_node_id, transfer_service_id, user_id,
    customer_name, customer_email, customer_phone, customer_whatsapp, nationality, terms_accepted_at,
    origin_location_id, destination_location_id, travel_date, travel_time,
    return_date, return_time, trip_type, adults, children, infants,
    flight_number, special_requests, estimated_price, currency, source,
    destination_label, affiliate_id, promo_code, discount_percent, commission_percent,
    agent_id, discount_source, partner_id, partner_commission_percent
  ) values (
    p_product_type,
    case when p_product_type = 'node' then p_product_node_id end,
    case when p_product_type = 'transfer_service' then p_transfer_service_id end,
    auth.uid(),
    p_customer_name, p_customer_email, p_customer_phone, p_customer_whatsapp, p_nationality, now(),
    p_origin_location_id, p_destination_location_id, p_travel_date, p_travel_time,
    p_return_date, p_return_time, p_trip_type, p_adults, p_children, p_infants,
    p_flight_number, p_special_requests, p_estimated_price, p_currency, p_source,
    p_destination_label,
    v_affiliate_id,
    case when v_affiliate_id is not null then upper(trim(p_promo_code)) end,
    v_discount_percent,
    v_commission_percent,
    v_agent_id,
    v_discount_source,
    v_partner_id,
    v_partner_commission_percent
  )
  returning bookings.id, bookings.booking_reference into v_id, v_reference;

  return query select v_id, v_reference;
end;
$$;

-- ─────────────────────────────────────────────────────────────────
-- Manual partner payments — the mirror of affiliate_payouts, direction
-- reversed: staff records "this partner paid us $X", never an automated
-- transfer (this platform never processes payment — see this file's
-- header).
-- ─────────────────────────────────────────────────────────────────
create table partner_payments (
  id            uuid primary key default gen_random_uuid(),
  partner_id    uuid not null references partner_accounts(id) on delete cascade,
  amount        numeric(10,2) not null check (amount > 0),
  currency      text not null default 'USD',
  method        text,
  note          text,
  recorded_by   uuid references auth.users(id),
  paid_at       timestamptz not null default now(),
  created_at    timestamptz not null default now()
);
create index partner_payments_partner_idx on partner_payments(partner_id);

alter table partner_payments enable row level security;
create policy partner_payments_self_select on partner_payments for select using (partner_id = auth.uid());
create policy partner_payments_staff_all   on partner_payments for all using (is_staff()) with check (is_staff());

grant select, insert, update, delete on partner_payments to authenticated;
grant select, insert, update, delete on partner_payments to service_role;


-- ═════════════════════════════════════════════════════════════════
-- 20261101000100_payout_requests.sql
-- ═════════════════════════════════════════════════════════════════

-- Withdrawal/payment requests from affiliates and partners -- the site
-- owner had no in-app way to see these: affiliates/partners could only
-- message outside the platform, and staff had to already know to open a
-- specific affiliate's/partner's own page to record a payout/payment.
-- This adds a single request queue plus a new admin "Payments" tab that
-- lists every pending one in one place.
--
-- Money direction is opposite between the two (see
-- 20261030000100_affiliate_promo_codes_and_commission.sql and
-- 20261031000100_partner_commission_and_agent_discount.sql's own
-- comments): an affiliate is owed money by MTG, so they request a
-- *withdrawal*. A partner owes MTG money, so there is nothing for them to
-- withdraw -- what they submit here is a *notice* that they've sent their
-- owed commission, so staff knows to go check and record it. One table
-- covers both: which column is set (affiliate_id vs partner_id) says
-- which case it is, no separate "direction" column needed.
create table payout_requests (
  id                 uuid primary key default gen_random_uuid(),
  affiliate_id       uuid references affiliate_accounts(id) on delete cascade,
  partner_id         uuid references partner_accounts(id) on delete cascade,
  requested_amount   numeric(12,2) not null check (requested_amount > 0),
  currency           text not null default 'USD',
  note               text,
  status             text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
  requested_at       timestamptz not null default now(),
  resolved_at        timestamptz,
  resolved_by        uuid references auth.users(id),
  resolution_note    text,
  check (
    (affiliate_id is not null and partner_id is null) or
    (affiliate_id is null and partner_id is not null)
  )
);
create index payout_requests_affiliate_idx on payout_requests(affiliate_id) where affiliate_id is not null;
create index payout_requests_partner_idx on payout_requests(partner_id) where partner_id is not null;
create index payout_requests_status_idx on payout_requests(status);

alter table payout_requests enable row level security;

-- An affiliate/partner may see their own requests (including resolved/
-- dismissed ones, as a record), but never writes this table directly --
-- see the two signup-RPC-style functions below for why.
create policy payout_requests_affiliate_self_select on payout_requests for select using (affiliate_id = auth.uid());
create policy payout_requests_partner_self_select   on payout_requests for select using (partner_id = auth.uid());
create policy payout_requests_staff_all             on payout_requests for all using (is_staff()) with check (is_staff());

-- ─────────────────────────────────────────────────────────────────
-- request_affiliate_payout() -- same guest-safe-RPC shape as
-- create_affiliate_account(): no INSERT policy exists for
-- anon/authenticated, so affiliate_id can never be forged by the client,
-- and the minimum-payout-amount / one-pending-request-at-a-time rules are
-- enforced here rather than trusted to the UI.
-- ─────────────────────────────────────────────────────────────────
create or replace function request_affiliate_payout(
  p_amount numeric,
  p_note   text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_id  uuid;
  v_min numeric;
begin
  if v_uid is null or not exists (select 1 from affiliate_accounts where id = v_uid) then
    raise exception 'must be signed in as an affiliate';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'enter an amount greater than 0';
  end if;
  if exists (select 1 from payout_requests where affiliate_id = v_uid and status = 'pending') then
    raise exception 'you already have a pending withdrawal request';
  end if;

  select coalesce(value::numeric, 50) into v_min from platform_settings where key = 'minimum_payout_amount';
  if p_amount < v_min then
    raise exception 'minimum withdrawal amount is % %', v_min, 'USD';
  end if;

  insert into payout_requests (affiliate_id, requested_amount, note)
  values (v_uid, p_amount, nullif(trim(p_note), ''))
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function request_affiliate_payout(numeric, text) from public;
grant execute on function request_affiliate_payout(numeric, text) to authenticated;

-- No minimum-amount check here: a partner is reporting money they've
-- already sent (any amount owed), not asking MTG to release a balance.
create or replace function request_partner_payment_notice(
  p_amount numeric,
  p_note   text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid uuid := auth.uid();
  v_id  uuid;
begin
  if v_uid is null or not exists (select 1 from partner_accounts where id = v_uid) then
    raise exception 'must be signed in as a partner';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'enter an amount greater than 0';
  end if;
  if exists (select 1 from payout_requests where partner_id = v_uid and status = 'pending') then
    raise exception 'you already have a pending payment notice';
  end if;

  insert into payout_requests (partner_id, requested_amount, note)
  values (v_uid, p_amount, nullif(trim(p_note), ''))
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function request_partner_payment_notice(numeric, text) from public;
grant execute on function request_partner_payment_notice(numeric, text) to authenticated;


commit;

notify pgrst, 'reload schema';
