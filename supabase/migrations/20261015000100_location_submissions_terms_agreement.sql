-- Require explicit agreement to a content-responsibility statement before
-- a guest comment or photo submission is accepted: the submitter is
-- solely responsible for what they submit (they own it, or have the
-- right to share it) — MTG is not responsible for copyright claims
-- arising from user-submitted content. Enforced inside the same
-- SECURITY DEFINER RPCs that already validate every other field on these
-- two tables, not just by a client-side checkbox, so it can't be
-- bypassed by calling the RPC directly.

alter table location_comments add column agreed_to_terms boolean not null default false;
alter table location_media_submissions add column agreed_to_terms boolean not null default false;

-- No real rows exist yet for either table (this feature shipped in the
-- immediately preceding migration), so there's nothing to backfill —
-- the constraint below is safe to add unconditionally.
alter table location_comments
  add constraint location_comments_agreed_to_terms_check check (agreed_to_terms = true);
alter table location_media_submissions
  add constraint location_media_submissions_agreed_to_terms_check check (agreed_to_terms = true);

-- submit_location_comment(): add p_agreed_to_terms. The parameter list
-- changed, so the old 4-arg signature needs dropping — create or replace
-- only overloads it rather than replacing it outright.
drop function if exists submit_location_comment(uuid, text, text, text);

create or replace function submit_location_comment(
  p_location_id     uuid,
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
  if not exists (select 1 from locations where locations.id = p_location_id) then
    raise exception 'location_id % does not reference an existing location', p_location_id;
  end if;
  if p_body is null or length(trim(p_body)) = 0 then
    raise exception 'a comment body is required';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must confirm you are responsible for this content before submitting.';
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

  insert into location_comments (location_id, user_id, guest_name, guest_email, body, agreed_to_terms)
  values (
    p_location_id, v_user_id,
    case when v_user_id is null then trim(p_guest_name) end,
    case when v_user_id is null then trim(p_guest_email) end,
    trim(p_body),
    true
  )
  returning location_comments.id into v_id;

  return query select v_id;
end;
$$;

revoke all on function submit_location_comment(uuid, text, text, text, boolean) from public;
grant execute on function submit_location_comment(uuid, text, text, text, boolean) to anon, authenticated;

-- create_location_media_submission(): same addition.
drop function if exists create_location_media_submission(uuid, text, text);

create or replace function create_location_media_submission(
  p_location_id       uuid,
  p_submitter_name    text,
  p_submitter_email   text,
  p_agreed_to_terms   boolean
) returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_id uuid;
begin
  if not exists (select 1 from locations where locations.id = p_location_id) then
    raise exception 'location_id % does not reference an existing location', p_location_id;
  end if;
  if p_submitter_name is null or length(trim(p_submitter_name)) = 0 then
    raise exception 'submitter_name is required';
  end if;
  if p_submitter_email is null or p_submitter_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid submitter_email is required';
  end if;
  if p_agreed_to_terms is not true then
    raise exception 'You must confirm you are responsible for these photos before submitting.';
  end if;

  if (
    select count(*) from location_media_submissions
    where submitter_email = p_submitter_email and created_at > now() - interval '24 hours'
  ) >= 2 then
    raise exception 'You have reached the limit of 2 submissions per day for this email address. Please try again tomorrow.';
  end if;

  insert into location_media_submissions (location_id, submitter_name, submitter_email, agreed_to_terms)
  values (p_location_id, trim(p_submitter_name), trim(p_submitter_email), true)
  returning location_media_submissions.id into v_id;

  return v_id;
end;
$$;

revoke all on function create_location_media_submission(uuid, text, text, boolean) from public;
grant execute on function create_location_media_submission(uuid, text, text, boolean) to anon, authenticated;
