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
