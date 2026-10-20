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
