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
alter table reviews add constraint reviews_agreed_to_terms_check check (agreed_to_terms = true);

alter table partner_accounts add column agreed_to_terms boolean not null default false;
alter table partner_accounts add constraint partner_accounts_agreed_to_terms_check check (agreed_to_terms = true);

alter table agent_accounts add column agreed_to_terms boolean not null default false;
alter table agent_accounts add constraint agent_accounts_agreed_to_terms_check check (agreed_to_terms = true);

alter table affiliate_accounts add column agreed_to_terms boolean not null default false;
alter table affiliate_accounts add constraint affiliate_accounts_agreed_to_terms_check check (agreed_to_terms = true);

alter table partner_requests add column agreed_to_terms boolean not null default false;
alter table partner_requests add constraint partner_requests_agreed_to_terms_check check (agreed_to_terms = true);

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
