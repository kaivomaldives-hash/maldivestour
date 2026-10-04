-- Customer data list (admin) + footer newsletter subscribe.
-- A normalized `customers` table, deduplicated by lower(email), fed two ways:
-- (1) automatically from every booking (via an AFTER INSERT trigger on
--     bookings, so it covers all products without touching per-product
--     booking code), and (2) directly from a guest-safe subscribe_to_updates()
--     RPC for the footer "Subscribe" form, which never requires a booking.
-- Both paths funnel through the same upsert_customer() function so a repeat
-- booking or a subscribe-then-book sequence from the same email never
-- creates a second row -- it just updates the existing customer and bumps
-- counters/timestamps.

create table customers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null unique,
  name               text,
  phone              text,
  whatsapp           text,
  source             text not null default 'booking' check (source in ('booking', 'subscribe')),
  booking_count      int not null default 0,
  subscribed         boolean not null default false,
  first_seen_at      timestamptz not null default now(),
  last_seen_at       timestamptz not null default now(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index customers_last_seen_idx on customers(last_seen_at desc);

create trigger customers_set_updated_at
  before update on customers
  for each row execute function set_updated_at();

alter table customers enable row level security;
create policy customers_staff_read on customers for select using (is_staff());

-- Upserts by normalized (lower/trimmed) email -- the single dedup key.
-- Called from both the bookings trigger and the subscribe RPC, so every
-- entry point shares one definition of "the same customer".
create or replace function upsert_customer(
  p_email      text,
  p_name       text,
  p_phone      text default null,
  p_whatsapp   text default null,
  p_is_booking boolean default false,
  p_is_subscribe boolean default false
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if v_email is null or v_email = '' then
    return;
  end if;

  insert into customers (email, name, phone, whatsapp, source, booking_count, subscribed, first_seen_at, last_seen_at)
  values (
    v_email,
    nullif(trim(p_name), ''),
    nullif(trim(p_phone), ''),
    nullif(trim(p_whatsapp), ''),
    case when p_is_subscribe and not p_is_booking then 'subscribe' else 'booking' end,
    case when p_is_booking then 1 else 0 end,
    p_is_subscribe,
    now(),
    now()
  )
  on conflict (email) do update set
    name        = coalesce(excluded.name, customers.name),
    phone       = coalesce(excluded.phone, customers.phone),
    whatsapp    = coalesce(excluded.whatsapp, customers.whatsapp),
    booking_count = customers.booking_count + case when p_is_booking then 1 else 0 end,
    subscribed  = customers.subscribed or p_is_subscribe,
    last_seen_at = now();
end;
$$;

revoke all on function upsert_customer(text, text, text, text, boolean, boolean) from public;
-- Only called from other security definer functions below -- never granted
-- to anon/authenticated directly.

create or replace function trigger_upsert_customer_from_booking() returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform upsert_customer(new.customer_email, new.customer_name, new.customer_phone, new.customer_whatsapp, true, false);
  return new;
end;
$$;

create trigger bookings_upsert_customer
  after insert on bookings
  for each row execute function trigger_upsert_customer_from_booking();

-- Guest-safe RPC for the footer "Subscribe" form. Deliberately minimal
-- (name + email only, matching the user's ask) and reuses upsert_customer()
-- so a visitor who later books is simply updated, not duplicated.
create or replace function subscribe_to_updates(
  p_name  text,
  p_email text
) returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid email is required';
  end if;
  perform upsert_customer(p_email, p_name, null, null, false, true);
end;
$$;

revoke all on function subscribe_to_updates(text, text) from public;
grant execute on function subscribe_to_updates(text, text) to anon, authenticated;

-- Backfill: dedupe existing bookings into customers so the admin list isn't
-- empty on day one.
insert into customers (email, name, phone, whatsapp, source, booking_count, subscribed, first_seen_at, last_seen_at)
select
  lower(trim(b.customer_email)) as email,
  (array_agg(b.customer_name order by b.created_at desc))[1],
  (array_agg(b.customer_phone order by b.created_at desc) filter (where b.customer_phone is not null))[1],
  (array_agg(b.customer_whatsapp order by b.created_at desc) filter (where b.customer_whatsapp is not null))[1],
  'booking',
  count(*),
  false,
  min(b.created_at),
  max(b.created_at)
from bookings b
where b.customer_email is not null and trim(b.customer_email) <> ''
group by lower(trim(b.customer_email))
on conflict (email) do nothing;
