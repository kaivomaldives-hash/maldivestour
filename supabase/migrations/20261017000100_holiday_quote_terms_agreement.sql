-- The Holiday Builder quote request (src/components/holiday-builder/
-- holiday-builder-wizard.tsx) was the one remaining booking-style
-- submission with no Terms and Conditions agreement at all -- every
-- other booking path already requires it (see
-- 20261001005000_booking_terms_acceptance.sql's p_terms_accepted). Same
-- enforcement shape: the RPC rejects the call outright when the flag
-- isn't true, and a CHECK constraint on the table is a second,
-- independent layer.

alter table holiday_quote_requests add column agreed_to_terms boolean not null default false;
alter table holiday_quote_requests add constraint holiday_quote_requests_agreed_to_terms_check check (agreed_to_terms = true);

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
