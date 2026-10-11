-- Custom Holiday Builder: a step-by-step holiday planner (packages page
-- "Customize Your Holiday" button) that produces a server-validated price
-- estimate and submits a request for staff review — this is a quotation
-- tool, not a live-inventory booking system, so it is deliberately NOT
-- built on the `bookings`/`bookable_products` tables (those model a
-- single real product; a custom holiday is an open-ended itinerary a
-- customer assembles themselves).
--
-- Two tables:
--   holiday_pricing_config — every rate the calculator uses (resort/local
--     island/safari room tiers, meal plan surcharges, transfer rates),
--     admin-managed, never hardcoded in application code. Publicly
--     readable (active rows only) since the customer-facing live price
--     preview reads it directly — the same trust level as any other
--     public price shown on this site.
--   holiday_quote_requests — one row per submitted request. The full
--     itinerary (stay segments, rooms, meal plans, per-day activities,
--     transfer choice) and the server-computed price breakdown are
--     stored as JSONB snapshots of what was actually quoted, not
--     normalized across tables — a request is a point-in-time quotation,
--     not a set of rows other features need to join against (the
--     accommodation/activity ids referenced inside the JSON are real
--     node ids, kept for admin cross-reference, but nothing else in the
--     schema points at this table the way package_itinerary_items points
--     at packages).

create table holiday_pricing_config (
  id              uuid primary key default gen_random_uuid(),
  category        text not null check (category in (
                     'resort_room', 'local_island_room', 'safari_cabin',
                     'meal_plan_resort', 'meal_plan_local_island', 'transfer'
                   )),
  -- Which stay type this row applies to — null for rows that apply
  -- regardless of stay type (there are none today, kept for headroom).
  stay_type       text check (stay_type in ('resort', 'local_island', 'safari')),
  -- Machine key the application code matches against (e.g. 'water_villa',
  -- 'balcony_room', 'shared_cabin', 'half_board', 'shared_speedboat').
  key             text not null,
  label           text not null,
  price_usd       numeric(10,2) not null,
  unit            text not null check (unit in (
                     'per_room_per_night', 'per_person_per_night',
                     'per_person_per_way', 'per_boat_per_way'
                   )),
  -- Where this figure came from, and how confident it is — shown only to
  -- staff (src/app/admin/holiday-pricing), never to customers. A
  -- benchmark/estimate row must say so here, per the "never invent rates"
  -- requirement — this is the record of that disclosure, not just a
  -- comment in a migration file.
  source_note     text not null,
  source_url      text,
  valid_from      date,
  valid_to        date,
  is_active       boolean not null default true,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (category, stay_type, key)
);
create index holiday_pricing_config_category_idx on holiday_pricing_config(category, stay_type) where is_active;

create trigger holiday_pricing_config_set_updated_at
  before update on holiday_pricing_config
  for each row execute function set_updated_at();

-- Race-safe per-year reference counter, same shape as
-- booking_reference_counters (supabase/migrations/20250101001300_
-- functions_triggers.sql).
create table holiday_quote_reference_counters (
  year        int primary key,
  last_value  int not null default 0
);

create table holiday_quote_requests (
  id                  uuid primary key default gen_random_uuid(),
  reference           text not null unique,
  customer_name       text not null,
  customer_email      text not null,
  customer_whatsapp   text not null,
  additional_requests text,
  arrival_date        date not null,
  nights              int not null check (nights > 0),
  adults              int not null check (adults > 0),
  children             int not null default 0,
  rooms               int not null check (rooms > 0),
  -- Full itinerary exactly as quoted: stay segments (stay_type, room key,
  -- meal plan, night count, destination), per-day activities (node ids +
  -- titles + prices), and the transfer choice. Snapshotted as JSON so a
  -- later change to holiday_pricing_config or an activity's price never
  -- silently rewrites what this customer was actually quoted.
  itinerary           jsonb not null,
  -- { currency, accommodationTotal, mealPlanTotal, activitiesTotal,
  --   transferTotal, grandTotal } — the exact server-computed breakdown
  -- shown to the customer at submission time.
  price_breakdown     jsonb not null,
  currency            text not null default 'USD',
  estimated_total      numeric(10,2) not null,
  status               text not null default 'pending' check (status in (
                          'pending', 'contacted', 'confirmed', 'cancelled'
                        )),
  internal_notes       text,
  notification_status  text not null default 'pending' check (notification_status in ('pending', 'sent', 'failed')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index holiday_quote_requests_status_idx on holiday_quote_requests(status);
create index holiday_quote_requests_created_idx on holiday_quote_requests(created_at desc);

create trigger holiday_quote_requests_set_updated_at
  before update on holiday_quote_requests
  for each row execute function set_updated_at();

-- HQ-{year}-{6 digits}, unconditionally authoritative (overwrites any
-- client-supplied value), race-safe under concurrent inserts via a
-- row-locked per-year counter upsert — identical shape to
-- generate_booking_reference().
create or replace function generate_holiday_quote_reference() returns trigger as $$
declare
  next_val int;
  yr int := extract(year from now());
begin
  insert into holiday_quote_reference_counters (year, last_value)
  values (yr, 1)
  on conflict (year) do update set last_value = holiday_quote_reference_counters.last_value + 1
  returning last_value into next_val;

  new.reference := 'HQ-' || yr || '-' || lpad(next_val::text, 6, '0');
  return new;
end;
$$ language plpgsql set search_path = public, pg_temp;

create trigger set_holiday_quote_reference
  before insert on holiday_quote_requests
  for each row execute function generate_holiday_quote_reference();

alter table holiday_pricing_config enable row level security;
alter table holiday_quote_requests enable row level security;

-- Public read of active rates only — the live price preview on the
-- customer-facing planner reads this directly via the anon key, same
-- trust level as any other public price on the site (package/activity
-- prices are public reads too).
create policy holiday_pricing_config_public_read on holiday_pricing_config
  for select using (is_active);
create policy holiday_pricing_config_staff_all on holiday_pricing_config
  for all using (is_staff()) with check (is_staff());

create policy holiday_quote_requests_staff_read on holiday_quote_requests
  for select using (is_staff());
create policy holiday_quote_requests_staff_update on holiday_quote_requests
  for update using (is_staff()) with check (is_staff());
-- No public select/update policy: a guest can create a request (via the
-- RPC below, SECURITY DEFINER) and then has no further API access to it
-- or any other request — same guest-write-only shape as `bookings`.

-- Guest-safe submission RPC — same validation/reference-generation
-- convention as create_booking_inquiry() (supabase/migrations/
-- 20250101001300_functions_triggers.sql) and submit_partner_request()
-- (supabase/migrations/20261001005200_partner_requests.sql). The price
-- itself is never trusted from the caller in the surrounding application
-- code (src/lib/holiday-builder/actions.ts recomputes it server-side from
-- holiday_pricing_config immediately before calling this function) — this
-- RPC only persists whatever numbers it's given, it does not calculate
-- them, so its own contract doesn't need to re-validate the arithmetic.
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
  p_estimated_total      numeric
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

  -- Duplicate-submission guard, same 2-minute window as create_booking_inquiry.
  if exists (
    select 1 from holiday_quote_requests
    where customer_email = p_customer_email and created_at > now() - interval '2 minutes'
  ) then
    raise exception 'You already submitted this request a moment ago — we will be in touch shortly.';
  end if;

  -- reference is set by the set_holiday_quote_reference trigger, never by
  -- this function — same division of responsibility as bookings.
  insert into holiday_quote_requests (
    customer_name, customer_email, customer_whatsapp, additional_requests,
    arrival_date, nights, adults, children, rooms, itinerary, price_breakdown, currency, estimated_total
  ) values (
    trim(p_customer_name), trim(p_customer_email), trim(p_customer_whatsapp), nullif(trim(p_additional_requests), ''),
    p_arrival_date, p_nights, p_adults, coalesce(p_children, 0), p_rooms, p_itinerary, p_price_breakdown, coalesce(p_currency, 'USD'), p_estimated_total
  )
  returning holiday_quote_requests.id, holiday_quote_requests.reference into v_id, v_reference;

  return query select v_id, v_reference;
end;
$$;

revoke all on function submit_holiday_quote_request(
  text, text, text, text, date, int, int, int, int, jsonb, jsonb, text, numeric
) from public;
grant execute on function submit_holiday_quote_request(
  text, text, text, text, date, int, int, int, int, jsonb, jsonb, text, numeric
) to anon, authenticated;
