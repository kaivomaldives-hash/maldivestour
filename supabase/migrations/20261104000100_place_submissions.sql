-- Lets any visitor submit a new "place" tied to an island or atoll --
-- an attraction, restaurant, shop, hospital, school, or gym -- with a
-- name, description, phone number, an optional precise map pin, and up
-- to 5 photos, for staff to review. Approving a submission is the only
-- way it ever becomes a real, public `locations` row -- same
-- "nothing's live until staff acts" shape as location_media_submissions
-- (20261014000100_location_comments_and_media_submissions.sql), which
-- this migration mirrors closely for the submission/moderation
-- plumbing (guest-safe RPCs, private Storage bucket, staff-only RLS,
-- 2-per-24h throttle, agreed_to_terms enforced inside the RPC per
-- 20261016000100_standard_terms_agreement_required.sql's standard
-- shape).
--
-- Category model: an attraction submission becomes a `locations` row
-- with location_type='poi' -- the exact same architecture
-- src/lib/attractions/types.ts already documents (no new table for
-- attractions, it already exists), plus its existing attraction_type
-- subtype (religious/museum/monument/...) so it renders correctly in
-- that page's existing type groupings. Restaurant/shop/hospital/school/
-- gym submissions are a new location_type='place', since none of those
-- five existed as any kind of entity before now -- 'place' covers all
-- five, split by attributes.place_category; each gets its own
-- dedicated directory page (src/components/places/place-directory-page.tsx),
-- unlike attraction's single type-filtered page.
--
-- lat/lng reuse the `locations` table's own existing columns (every
-- location already has them) -- place_submissions carries them only
-- until approval copies them onto the new locations row from the
-- optional map-picker pin; no new location-level schema needed.
--
-- Unlike every location created so far (all seed-migration-only), an
-- approved submission is the first *runtime* insert into nodes+
-- locations this app has ever done -- the admin approval action
-- inserts nodes first (so its slug exists), then locations with
-- parent_id set, letting the existing locations_path_on_reparent
-- trigger (20250101001300_functions_triggers.sql §9) compute the
-- correct ltree path automatically; the existing locations_hierarchy_check
-- trigger validates the parent/child type pairing is one of the rules
-- inserted below.

alter table locations drop constraint locations_location_type_check;
alter table locations add constraint locations_location_type_check check (location_type in (
  'country', 'atoll', 'island', 'locality', 'airport', 'seaport', 'harbour', 'poi',
  'dive_site', 'surf_break', 'fishing_spot', 'place'
));

insert into location_type_hierarchy_rules (parent_type, child_type) values
  ('atoll', 'place'),
  ('island', 'place')
on conflict do nothing;

create table place_submissions (
  id                uuid primary key default gen_random_uuid(),
  location_id       uuid not null references locations(id) on delete cascade,
  place_category    text not null check (place_category in ('attraction', 'restaurant', 'shop', 'hospital', 'school', 'gym')),
  attraction_type   text check (attraction_type in ('religious', 'museum', 'monument', 'park', 'beach', 'market', 'landmark', 'infrastructure', 'natural', 'marine')),
  name              text not null,
  description       text,
  phone             text,
  lat               numeric(9,6),
  lng               numeric(9,6),
  submitter_name    text not null,
  submitter_email   text not null,
  agreed_to_terms   boolean not null default false,
  status            text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason  text,
  reviewed_by       uuid references auth.users(id),
  reviewed_at       timestamptz,
  created_node_id   uuid references nodes(id),
  created_at        timestamptz not null default now(),
  constraint place_submissions_agreed_to_terms_check check (agreed_to_terms = true),
  constraint place_submissions_attraction_type_shape check (
    (place_category = 'attraction' and attraction_type is not null) or
    (place_category <> 'attraction' and attraction_type is null)
  )
);
create index place_submissions_location_idx on place_submissions(location_id);
create index place_submissions_status_idx   on place_submissions(status);

-- Files live in the private 'place-submissions' Storage bucket
-- (storage_path convention: '<submission_id>/<filename>') until a staff
-- approval copies them into the public 'media' bucket -- identical
-- shape to location_media_submission_images.
create table place_submission_images (
  id             uuid primary key default gen_random_uuid(),
  submission_id  uuid not null references place_submissions(id) on delete cascade,
  storage_path   text not null,
  file_name      text,
  content_type   text,
  created_at     timestamptz not null default now()
);
create index place_submission_images_submission_idx on place_submission_images(submission_id);

insert into storage.buckets (id, name, public)
values ('place-submissions', 'place-submissions', false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- RLS -- no public/own read at all (same stance as
-- location_media_submissions: no "my submissions" page exists).
-- ─────────────────────────────────────────────────────────────────
alter table place_submissions enable row level security;
create policy place_submissions_staff_all on place_submissions for all using (is_staff()) with check (is_staff());

alter table place_submission_images enable row level security;
create policy place_submission_images_staff_all on place_submission_images for all using (is_staff()) with check (is_staff());

create policy place_submissions_bucket_staff_select
  on storage.objects for select to authenticated
  using (bucket_id = 'place-submissions' and is_staff());
create policy place_submissions_bucket_staff_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'place-submissions' and is_staff());
-- Write-only for anon/authenticated, same reasoning as
-- location_submissions_bucket_insert: a guest can create an object here
-- but never read, list, overwrite, or remove it afterward.
create policy place_submissions_bucket_insert
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'place-submissions');

-- ─────────────────────────────────────────────────────────────────
-- Guest-safe RPCs
-- ─────────────────────────────────────────────────────────────────
create or replace function create_place_submission(
  p_location_id       uuid,
  p_place_category    text,
  p_name              text,
  p_submitter_name    text,
  p_submitter_email   text,
  p_agreed_to_terms   boolean,
  p_description       text default null,
  p_phone             text default null,
  p_lat               numeric default null,
  p_lng               numeric default null,
  p_attraction_type   text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_location_type text;
begin
  select location_type into v_location_type from locations where id = p_location_id;
  if v_location_type is null then
    raise exception 'location_id % does not reference an existing location', p_location_id;
  end if;
  if v_location_type not in ('island', 'atoll') then
    raise exception 'a place must be submitted against an island or atoll';
  end if;

  if p_place_category not in ('attraction', 'restaurant', 'shop', 'hospital', 'school', 'gym') then
    raise exception 'invalid place_category: %', p_place_category;
  end if;
  if p_place_category = 'attraction' and (p_attraction_type is null or p_attraction_type not in ('religious', 'museum', 'monument', 'park', 'beach', 'market', 'landmark', 'infrastructure', 'natural', 'marine')) then
    raise exception 'a valid attraction_type is required when place_category is attraction';
  end if;

  if p_name is null or length(trim(p_name)) = 0 then
    raise exception 'name is required';
  end if;
  if p_submitter_name is null or length(trim(p_submitter_name)) = 0 then
    raise exception 'submitter_name is required';
  end if;
  if p_submitter_email is null or p_submitter_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid submitter_email is required';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must confirm you are responsible for this submission before submitting.';
  end if;
  if (p_lat is not null and (p_lat < -90 or p_lat > 90)) or (p_lng is not null and (p_lng < -180 or p_lng > 180)) then
    raise exception 'the map pin coordinates are out of range';
  end if;

  if (
    select count(*) from place_submissions
    where submitter_email = p_submitter_email and created_at > now() - interval '24 hours'
  ) >= 2 then
    raise exception 'You have reached the limit of 2 submissions per day for this email address. Please try again tomorrow.';
  end if;

  insert into place_submissions (
    location_id, place_category, attraction_type, name, description, phone, lat, lng,
    submitter_name, submitter_email, agreed_to_terms
  )
  values (
    p_location_id,
    p_place_category,
    case when p_place_category = 'attraction' then p_attraction_type end,
    trim(p_name),
    nullif(trim(p_description), ''),
    nullif(trim(p_phone), ''),
    p_lat,
    p_lng,
    trim(p_submitter_name),
    trim(p_submitter_email),
    true
  )
  returning place_submissions.id into v_id;

  return v_id;
end;
$$;

revoke all on function create_place_submission(uuid, text, text, text, text, boolean, text, text, numeric, numeric, text) from public;
grant execute on function create_place_submission(uuid, text, text, text, text, boolean, text, text, numeric, numeric, text) to anon, authenticated;

create or replace function create_place_submission_image(
  p_submission_id  uuid,
  p_storage_path   text,
  p_file_name      text default null,
  p_content_type   text default null
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_status text;
  v_count int;
begin
  select status into v_status from place_submissions where id = p_submission_id;
  if v_status is null then
    raise exception 'submission % does not exist', p_submission_id;
  end if;
  if v_status <> 'pending' then
    raise exception 'this submission has already been reviewed';
  end if;

  select count(*) into v_count from place_submission_images where submission_id = p_submission_id;
  if v_count >= 5 then
    raise exception 'A submission may contain at most 5 images.';
  end if;

  insert into place_submission_images (submission_id, storage_path, file_name, content_type)
  values (p_submission_id, p_storage_path, p_file_name, p_content_type)
  returning place_submission_images.id into v_id;

  return v_id;
end;
$$;

revoke all on function create_place_submission_image(uuid, text, text, text) from public;
grant execute on function create_place_submission_image(uuid, text, text, text) to anon, authenticated;
