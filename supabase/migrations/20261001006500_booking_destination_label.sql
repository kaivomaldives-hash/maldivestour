-- Lets a node inquiry (activity/fishing/diving/surfing booking) carry a
-- customer-picked destination, same as the transfer flow already does via
-- `destination_location_id` — reused as-is here, no new location FK. The
-- one genuinely new thing is `destination_label`: a denormalized, staff-
-- readable snapshot of exactly what the customer picked (e.g. "Soneva
-- Fushi, Baa Atoll"), since a customer may pick a specific resort, not
-- just an atoll/island, and `destination_location_id` alone can only ever
-- point at a `locations` row (resorts are accommodation nodes, not
-- locations rows — see src/lib/accommodations/types.ts). When a resort is
-- picked, destination_location_id is set to that resort's own primary
-- island/atoll (so existing atoll/island-based admin resolution still
-- works), and destination_label preserves the resort-specific detail that
-- would otherwise be lost.

alter table bookings add column destination_label text;

-- create_booking_inquiry's signature is changing (one new trailing
-- parameter) — same reason/approach as
-- 20250130000100_booking_source_and_throttle.sql's own p_source addition:
-- CREATE OR REPLACE cannot change an existing function's argument list, so
-- the old (24-arg, as of 20261001005000_booking_terms_acceptance.sql)
-- signature is dropped explicitly before creating the new (25-arg) one.
drop function if exists create_booking_inquiry(
  text, uuid, uuid, text, text, text, text, text, boolean, uuid, uuid, date, time, date, time,
  text, int, int, int, text, text, numeric, text, text
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
  p_destination_label                       text default null
) returns table (id uuid, booking_reference text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_reference text;
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

  insert into bookings (
    product_type, product_node_id, transfer_service_id, user_id,
    customer_name, customer_email, customer_phone, customer_whatsapp, nationality, terms_accepted_at,
    origin_location_id, destination_location_id, travel_date, travel_time,
    return_date, return_time, trip_type, adults, children, infants,
    flight_number, special_requests, estimated_price, currency, source,
    destination_label
  ) values (
    p_product_type,
    case when p_product_type = 'node' then p_product_node_id end,
    case when p_product_type = 'transfer_service' then p_transfer_service_id end,
    auth.uid(),                          -- null for anonymous/guest callers, never client-supplied
    p_customer_name, p_customer_email, p_customer_phone, p_customer_whatsapp, p_nationality, now(),
    p_origin_location_id, p_destination_location_id, p_travel_date, p_travel_time,
    p_return_date, p_return_time, p_trip_type, p_adults, p_children, p_infants,
    p_flight_number, p_special_requests, p_estimated_price, p_currency, p_source,
    p_destination_label
  )
  returning bookings.id, bookings.booking_reference into v_id, v_reference;

  return query select v_id, v_reference;
end;
$$;

revoke all on function create_booking_inquiry(
  text, uuid, uuid, text, text, text, text, text, boolean, uuid, uuid, date, time, date, time,
  text, int, int, int, text, text, numeric, text, text, text
) from public;
grant execute on function create_booking_inquiry(
  text, uuid, uuid, text, text, text, text, text, boolean, uuid, uuid, date, time, date, time,
  text, int, int, int, text, text, numeric, text, text, text
) to anon, authenticated;
