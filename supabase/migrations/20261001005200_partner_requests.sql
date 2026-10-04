-- "Become a Partner" footer form: international travel agents, property
-- owners, activity providers, and transfer providers can submit a request
-- to work with MTG. Site owner's explicit scope for now: record the
-- request and email it to the admin inbox -- no vendor account, no
-- self-service listing management yet (that's a later, separate build).
-- The admin "Vendors" list below is read-only triage (status only), not
-- the full vendor/listing-management feature.

create table partner_requests (
  id              uuid primary key default gen_random_uuid(),
  partner_type    text not null check (partner_type in (
                     'international_travel_agent', 'property_owner', 'activity_provider', 'transfer_provider'
                   )),
  name            text not null,
  email           text not null,
  phone           text,
  company_name    text,
  message         text,
  status          text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index partner_requests_status_idx on partner_requests(status);

create trigger partner_requests_set_updated_at
  before update on partner_requests
  for each row execute function set_updated_at();

alter table partner_requests enable row level security;
create policy partner_requests_staff_read   on partner_requests for select using (is_staff());
create policy partner_requests_staff_update on partner_requests for update using (is_staff()) with check (is_staff());

-- Guest-safe submission, same honeypot-at-the-app-layer + server-side
-- validation convention as subscribe_to_updates() (supabase/migrations/
-- 20261001004700_customers_and_newsletter.sql).
create or replace function submit_partner_request(
  p_partner_type   text,
  p_name           text,
  p_email          text,
  p_phone          text,
  p_company_name   text,
  p_message        text
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

  insert into partner_requests (partner_type, name, email, phone, company_name, message)
  values (p_partner_type, trim(p_name), trim(p_email), nullif(trim(p_phone), ''), nullif(trim(p_company_name), ''), nullif(trim(p_message), ''));
end;
$$;

revoke all on function submit_partner_request(text, text, text, text, text, text) from public;
grant execute on function submit_partner_request(text, text, text, text, text, text) to anon, authenticated;
