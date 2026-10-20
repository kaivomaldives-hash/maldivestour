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
