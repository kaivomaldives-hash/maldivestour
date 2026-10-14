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
