-- Destination comments + user-submitted photos for `locations` rows
-- (island, atoll, poi/attraction, dive_site, surf_break, fishing_spot —
-- every location_type gets this for free, since it's one table). Both
-- are guest-safe (no sign-in required) and admin-approval-gated before
-- anything is public, mirroring two patterns this codebase already has
-- rather than inventing new ones:
--   - location_comments copies the guest-safe, moderated shape `reviews`
--     already uses (pending/published/rejected, guest_name/guest_email
--     identity — see 20250113000100_transfers_platform_schema.sql §6),
--     just without a star rating.
--   - the media-submission review step (pending batch of files -> staff
--     approves -> files get copied into the real `media` bucket +
--     media_assets + node_media) mirrors listing_submissions' "nothing
--     written to a live table until a staff action does it"
--     (20261011000200_partner_listings_and_bookings.sql).
--
-- Both are rate-limited the same way create_booking_inquiry() already
-- throttles itself (count of recent rows from the same identity, inside
-- the function — not a separately-bypassable app-layer check): at most
-- 2 submissions per email per rolling 24 hours, counting every status
-- (not just pending), so a rejected submission can't be resent in a
-- loop to dodge the cap.

create table location_comments (
  id              uuid primary key default gen_random_uuid(),
  location_id     uuid not null references locations(id) on delete cascade,
  user_id         uuid references auth.users(id),
  guest_name      text,
  guest_email     text,
  body            text not null,
  status          text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  rejection_reason text,
  reviewed_by     uuid references auth.users(id),
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  check (user_id is not null or (guest_name is not null and guest_email is not null))
);
create index location_comments_location_idx on location_comments(location_id) where status = 'published';
create index location_comments_status_idx   on location_comments(status);

create table location_media_submissions (
  id                uuid primary key default gen_random_uuid(),
  location_id       uuid not null references locations(id) on delete cascade,
  submitter_name    text not null,
  submitter_email   text not null,
  status            text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason  text,
  reviewed_by       uuid references auth.users(id),
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now()
);
create index location_media_submissions_location_idx on location_media_submissions(location_id);
create index location_media_submissions_status_idx   on location_media_submissions(status);

-- Files live in the private 'location-submissions' Storage bucket
-- (storage_path convention: '<submission_id>/<filename>') until a staff
-- approval copies them into the public 'media' bucket — never written
-- here directly, same reasoning as partner_documents never using the
-- public `media` bucket.
create table location_media_submission_images (
  id             uuid primary key default gen_random_uuid(),
  submission_id  uuid not null references location_media_submissions(id) on delete cascade,
  storage_path   text not null,
  file_name      text,
  content_type   text,
  created_at     timestamptz not null default now()
);
create index location_media_submission_images_submission_idx on location_media_submission_images(submission_id);

insert into storage.buckets (id, name, public)
values ('location-submissions', 'location-submissions', false)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────────
alter table location_comments enable row level security;
create policy location_comments_public_read on location_comments for select using (status = 'published');
create policy location_comments_staff_read  on location_comments for select using (is_staff());
create policy location_comments_staff_all   on location_comments for all using (is_staff()) with check (is_staff());
-- No insert policy for anon/authenticated: submit_location_comment() is
-- the only way a row is created (it's SECURITY DEFINER, so it bypasses
-- RLS -- same shape as create_booking_inquiry()).

alter table location_media_submissions enable row level security;
create policy location_media_submissions_staff_all on location_media_submissions for all using (is_staff()) with check (is_staff());
-- Deliberately no public/own-read policy at all: unlike comments, a
-- pending or rejected submission's submitter name/email is never shown
-- back to anyone, and there's no authenticated "my submissions" page in
-- this round.

alter table location_media_submission_images enable row level security;
create policy location_media_submission_images_staff_all on location_media_submission_images for all using (is_staff()) with check (is_staff());

create policy location_submissions_bucket_staff_select
  on storage.objects for select to authenticated
  using (bucket_id = 'location-submissions' and is_staff());
create policy location_submissions_bucket_staff_delete
  on storage.objects for delete to authenticated
  using (bucket_id = 'location-submissions' and is_staff());
-- A guest upload goes straight through Storage's own API (not a
-- SECURITY DEFINER RPC -- Storage has no such mediation point), so an
-- anon/authenticated INSERT policy on the bucket itself is required.
-- Scoped to this one private bucket only, and intentionally write-only:
-- anon/authenticated have no select/update/delete policy on it at all,
-- so a guest can create an object here but never read, list, overwrite,
-- or remove it (or anyone else's) afterward -- only staff (above) can.
create policy location_submissions_bucket_insert
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'location-submissions');

-- ─────────────────────────────────────────────────────────────────
-- Guest-safe RPCs
-- ─────────────────────────────────────────────────────────────────

create or replace function submit_location_comment(
  p_location_id   uuid,
  p_body          text,
  p_guest_name    text,
  p_guest_email   text
) returns table (id uuid)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
  v_user_id uuid := auth.uid();
begin
  if not exists (select 1 from locations where locations.id = p_location_id) then
    raise exception 'location_id % does not reference an existing location', p_location_id;
  end if;
  if p_body is null or length(trim(p_body)) = 0 then
    raise exception 'a comment body is required';
  end if;
  if v_user_id is null then
    if p_guest_name is null or length(trim(p_guest_name)) = 0 then
      raise exception 'guest_name is required';
    end if;
    if p_guest_email is null or p_guest_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
      raise exception 'a valid guest_email is required';
    end if;
  end if;

  -- Rate limit: at most 2 submissions per email in a rolling 24 hours,
  -- counting every status (so a rejected one can't be resubmitted in a
  -- loop to dodge the cap) -- same inline-throttle shape as
  -- create_booking_inquiry().
  if p_guest_email is not null and (
    select count(*) from location_comments
    where guest_email = p_guest_email and created_at > now() - interval '24 hours'
  ) >= 2 then
    raise exception 'You have reached the limit of 2 submissions per day for this email address. Please try again tomorrow.';
  end if;

  insert into location_comments (location_id, user_id, guest_name, guest_email, body)
  values (
    p_location_id, v_user_id,
    case when v_user_id is null then trim(p_guest_name) end,
    case when v_user_id is null then trim(p_guest_email) end,
    trim(p_body)
  )
  returning location_comments.id into v_id;

  return query select v_id;
end;
$$;

revoke all on function submit_location_comment(uuid, text, text, text) from public;
grant execute on function submit_location_comment(uuid, text, text, text) to anon, authenticated;

-- Creates the submission row only -- the server action then uploads each
-- file via its own RLS-respecting client and registers it with
-- create_location_media_submission_image() below. Splitting it this way
-- (rather than one RPC taking an array of already-uploaded paths) lets
-- the per-image insert enforce the 5-image cap against what's actually
-- been uploaded so far, not a client-asserted count.
create or replace function create_location_media_submission(
  p_location_id       uuid,
  p_submitter_name    text,
  p_submitter_email   text
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  if not exists (select 1 from locations where id = p_location_id) then
    raise exception 'location_id % does not reference an existing location', p_location_id;
  end if;
  if p_submitter_name is null or length(trim(p_submitter_name)) = 0 then
    raise exception 'submitter_name is required';
  end if;
  if p_submitter_email is null or p_submitter_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid submitter_email is required';
  end if;

  if (
    select count(*) from location_media_submissions
    where submitter_email = p_submitter_email and created_at > now() - interval '24 hours'
  ) >= 2 then
    raise exception 'You have reached the limit of 2 submissions per day for this email address. Please try again tomorrow.';
  end if;

  insert into location_media_submissions (location_id, submitter_name, submitter_email)
  values (p_location_id, trim(p_submitter_name), trim(p_submitter_email))
  returning location_media_submissions.id into v_id;

  return v_id;
end;
$$;

revoke all on function create_location_media_submission(uuid, text, text) from public;
grant execute on function create_location_media_submission(uuid, text, text) to anon, authenticated;

-- Registers one already-uploaded file against a submission. SECURITY
-- DEFINER so it can insert into location_media_submission_images (no
-- anon/authenticated INSERT policy exists on that table) -- the actual
-- file bytes are uploaded separately by the server action using its own
-- RLS-respecting client against the 'location-submissions' bucket
-- (anon/authenticated have no table grant to fake this row without a
-- real object existing at storage_path; the admin approval step reads
-- the object back and fails loudly if it's missing).
create or replace function create_location_media_submission_image(
  p_submission_id  uuid,
  p_storage_path   text,
  p_file_name      text,
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
  select status into v_status from location_media_submissions where id = p_submission_id;
  if v_status is null then
    raise exception 'submission % does not exist', p_submission_id;
  end if;
  if v_status <> 'pending' then
    raise exception 'this submission has already been reviewed';
  end if;

  select count(*) into v_count from location_media_submission_images where submission_id = p_submission_id;
  if v_count >= 5 then
    raise exception 'A submission may contain at most 5 images.';
  end if;

  insert into location_media_submission_images (submission_id, storage_path, file_name, content_type)
  values (p_submission_id, p_storage_path, p_file_name, p_content_type)
  returning location_media_submission_images.id into v_id;

  return v_id;
end;
$$;

revoke all on function create_location_media_submission_image(uuid, text, text, text) from public;
grant execute on function create_location_media_submission_image(uuid, text, text, text) to anon, authenticated;
