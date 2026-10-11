-- Partner self-service portal, phase 1: signup -> auto-created login ->
-- profile completion (verification docs + bank details) -> admin review.
--
-- Deliberately decoupled from `profiles.role` (user/editor/admin) and its
-- self-escalation guard (20250101001300_functions_triggers.sql) rather than
-- adding a 'partner' value there: a partner is a business relationship,
-- not a position on the staff privilege ladder, and keeping it a separate
-- table means this feature never touches that sensitive enum/trigger.
--
-- `partner_requests` (20261001005200_partner_requests.sql) remains the
-- separate footer lead-capture form (international travel agents etc. who
-- don't want/need a login) — this is the new, distinct self-service
-- account path for property/activity/package/transfer operators who do.
--
-- Scope of this migration: the account + onboarding half only (sign up,
-- auto-login, complete profile, submit, admin approve/reject). Partner
-- self-service listing management (the moderation-queue "create/edit a
-- listing, needs admin approval to publish" workflow) and the partner
-- bookings dashboard are later, separate migrations on top of this
-- foundation — kept out of this one so it ships a complete, independently
-- useful slice rather than half-wired schema.

create table partner_accounts (
  id                 uuid primary key references auth.users(id) on delete cascade,
  provider_id        uuid references providers(id) on delete set null,
  partner_kind       text not null check (partner_kind in ('property', 'activity', 'package', 'transfer')),
  property_type      text check (property_type in ('resort', 'hotel', 'guesthouse', 'liveaboard')),
  business_name      text not null,
  contact_email      text not null,
  contact_phone      text,
  whatsapp           text,
  country            text,
  address            text,
  description        text,
  onboarding_status  text not null default 'profile' check (onboarding_status in ('profile', 'submitted', 'approved', 'rejected', 'suspended')),
  rejection_reason   text,
  submitted_at       timestamptz,
  reviewed_by        uuid references auth.users(id),
  reviewed_at        timestamptz,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  check (partner_kind <> 'property' or property_type is not null)
);
create index partner_accounts_status_idx   on partner_accounts(onboarding_status);
create index partner_accounts_provider_idx on partner_accounts(provider_id);

create trigger partner_accounts_set_updated_at
  before update on partner_accounts
  for each row execute function set_updated_at();

create table partner_bank_details (
  partner_id           uuid primary key references partner_accounts(id) on delete cascade,
  account_holder_name  text,
  bank_name            text,
  account_number       text,
  iban_or_swift        text,
  branch_address       text,
  currency             text default 'USD',
  updated_at           timestamptz not null default now()
);

create trigger partner_bank_details_set_updated_at
  before update on partner_bank_details
  for each row execute function set_updated_at();

-- Verification documents live in a private Storage bucket
-- (storage_path convention: '<partner_id>/<document_type>/<filename>'),
-- never the public `media` bucket — these are sensitive and are never
-- rendered through publicStorageUrl()/MediaImage, only ever fetched as a
-- short-lived signed URL for the uploading partner or staff.
create table partner_documents (
  id             uuid primary key default gen_random_uuid(),
  partner_id     uuid not null references partner_accounts(id) on delete cascade,
  document_type  text not null check (document_type in ('business_license', 'owner_id', 'bank_proof', 'property_proof')),
  storage_path   text not null,
  file_name      text,
  status         text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note     text,
  uploaded_at    timestamptz not null default now()
);
create index partner_documents_partner_idx on partner_documents(partner_id);

insert into storage.buckets (id, name, public)
values ('partner-documents', 'partner-documents', false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- RLS helpers — same SECURITY DEFINER shape as is_staff()/is_admin()
-- (20250101001300_functions_triggers.sql), so a policy on partner_accounts
-- itself calling is_partner() can't recurse into its own RLS evaluation.
-- ─────────────────────────────────────────────────────────────────
create or replace function is_partner() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from partner_accounts pa where pa.id = auth.uid());
$$;

create or replace function is_approved_partner() returns boolean
language sql stable security definer set search_path = public, pg_temp as $$
  select exists (select 1 from partner_accounts pa where pa.id = auth.uid() and pa.onboarding_status = 'approved');
$$;

revoke all on function is_partner from public;
revoke all on function is_approved_partner from public;
grant execute on function is_partner to anon, authenticated;
grant execute on function is_approved_partner to anon, authenticated;

-- A partner can freely edit their own profile fields, but never their own
-- review outcome (onboarding_status beyond the one "submit for review"
-- transition, reviewed_by/reviewed_at, or provider_id) — same reasoning as
-- prevent_profile_role_self_escalation(): RLS's USING/WITH CHECK gates
-- rows, not columns, so this is the independent column-level layer.
create or replace function prevent_partner_self_review() returns trigger as $$
begin
  if not is_staff() then
    if new.onboarding_status is distinct from old.onboarding_status
       and not (new.onboarding_status = 'submitted' and old.onboarding_status in ('profile', 'rejected')) then
      raise exception 'only staff may change partner review status';
    end if;
    if new.reviewed_by is distinct from old.reviewed_by
       or new.reviewed_at is distinct from old.reviewed_at
       or new.provider_id is distinct from old.provider_id then
      raise exception 'only staff may change partner review fields';
    end if;
  end if;
  return new;
end;
$$ language plpgsql set search_path = public, pg_temp;

create trigger partner_accounts_prevent_self_review
  before update on partner_accounts
  for each row execute function prevent_partner_self_review();

-- ─────────────────────────────────────────────────────────────────
-- RLS — partner can read/write only their own row; staff can do
-- everything, same `_staff_all` shape as every other admin-managed table
-- (20250101001400_rls_policies.sql).
-- ─────────────────────────────────────────────────────────────────
alter table partner_accounts enable row level security;
create policy partner_accounts_self_select on partner_accounts for select using (id = auth.uid());
create policy partner_accounts_self_update on partner_accounts for update using (id = auth.uid()) with check (id = auth.uid());
create policy partner_accounts_staff_all   on partner_accounts for all using (is_staff()) with check (is_staff());

alter table partner_bank_details enable row level security;
create policy partner_bank_details_self_all on partner_bank_details for all
  using (partner_id = auth.uid()) with check (partner_id = auth.uid());
create policy partner_bank_details_staff_all on partner_bank_details for all
  using (is_staff()) with check (is_staff());

alter table partner_documents enable row level security;
create policy partner_documents_self_select on partner_documents for select using (partner_id = auth.uid());
create policy partner_documents_self_insert on partner_documents for insert with check (partner_id = auth.uid());
-- Only while still pending — once staff has acted, the record (and the
-- uploaded file it points at) stays as the reviewed evidence.
create policy partner_documents_self_delete on partner_documents for delete using (partner_id = auth.uid() and status = 'pending');
create policy partner_documents_staff_all   on partner_documents for all using (is_staff()) with check (is_staff());

create policy partner_documents_bucket_self_insert
  on storage.objects for insert to authenticated
  with check (bucket_id = 'partner-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy partner_documents_bucket_self_select
  on storage.objects for select to authenticated
  using (bucket_id = 'partner-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy partner_documents_bucket_self_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'partner-documents' and (storage.foldername(name))[1] = auth.uid()::text);
create policy partner_documents_bucket_staff_select
  on storage.objects for select to authenticated
  using (bucket_id = 'partner-documents' and is_staff());

-- ─────────────────────────────────────────────────────────────────
-- Signup RPC — the ONLY way a partner_accounts row (and its backing
-- provider/node row) gets created. Called right after
-- supabase.auth.signUp() while the new session is live, so auth.uid()
-- resolves to the just-created user. SECURITY DEFINER so it can insert
-- into `nodes`/`providers` — tables a brand-new partner otherwise has no
-- RLS write access to at all — same guest-safe-RPC shape as
-- create_booking_inquiry().
-- ─────────────────────────────────────────────────────────────────
create or replace function create_partner_account(
  p_partner_kind    text,
  p_property_type   text,
  p_business_name   text,
  p_contact_email    text,
  p_contact_phone     text default null
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

  v_base_slug := regexp_replace(lower(trim(p_business_name)), '[^a-z0-9]+', '-', 'g');
  v_base_slug := regexp_replace(v_base_slug, '(^-+|-+$)', '', 'g');
  if v_base_slug = '' then v_base_slug := 'partner'; end if;
  -- Server-generated, never partner-chosen — appends a short id-derived
  -- suffix so two businesses with the same name never collide on
  -- nodes' unique(node_type, slug).
  v_slug := v_base_slug || '-' || substr(md5(v_uid::text), 1, 6);

  insert into nodes (node_type, slug, title, status, created_by)
  values ('provider', v_slug, trim(p_business_name), 'draft', v_uid)
  returning id into v_node_id;

  insert into providers (id, legal_name, contact_email, contact_phone)
  values (v_node_id, trim(p_business_name), trim(p_contact_email), nullif(trim(p_contact_phone), ''));

  insert into partner_accounts (id, provider_id, partner_kind, property_type, business_name, contact_email, contact_phone)
  values (
    v_uid, v_node_id, p_partner_kind,
    case when p_partner_kind = 'property' then p_property_type end,
    trim(p_business_name), trim(p_contact_email), nullif(trim(p_contact_phone), '')
  );

  return v_uid;
end;
$$;

revoke all on function create_partner_account(text, text, text, text, text) from public;
grant execute on function create_partner_account(text, text, text, text, text) to authenticated;

-- "Submit for Review" — the one onboarding_status transition a partner is
-- allowed to make themselves (enforced again, independently, by
-- prevent_partner_self_review() above).
create or replace function submit_partner_profile_for_review() returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_uid    uuid := auth.uid();
  v_status text;
begin
  select onboarding_status into v_status from partner_accounts where id = v_uid;
  if v_status is null then
    raise exception 'no partner account for this user';
  end if;
  if v_status not in ('profile', 'rejected') then
    raise exception 'profile is already %, cannot resubmit', v_status;
  end if;

  update partner_accounts
    set onboarding_status = 'submitted', submitted_at = now(), rejection_reason = null
    where id = v_uid;
end;
$$;

revoke all on function submit_partner_profile_for_review from public;
grant execute on function submit_partner_profile_for_review to authenticated;
