-- Every guest-submitted photo on this site (both "Share Your Photos" on
-- island/atoll/attraction pages, and the new "Add a Place" submission)
-- was approved straight into media_assets with alt_text left null --
-- real, ongoing SEO loss on every image the public actually uploads,
-- since nothing ever asked the submitter what's in the photo. Now
-- required at submission time, and used automatically for both
-- media_assets.title and .alt_text on approval
-- (src/lib/admin/place-submissions-actions.ts /
-- location-media-submissions-actions.ts).
--
-- Both image tables already exist with zero (or vanishingly few, for
-- place_submission_images — shipped minutes earlier this same session)
-- real rows, but a default avoids any risk of this migration failing
-- against whatever's actually there; the RPCs below are what actually
-- enforce "every new submission must include a real caption" going
-- forward, not the column default.
alter table place_submission_images add column caption text not null default '';
alter table location_media_submission_images add column caption text not null default '';

-- create_place_submission_image(): add required p_caption. The
-- parameter list changed, so the old signature needs dropping first --
-- same "create or replace only overloads it" reasoning as every prior
-- migration that added a required param to an existing RPC.
drop function if exists create_place_submission_image(uuid, text, text, text);

create or replace function create_place_submission_image(
  p_submission_id  uuid,
  p_storage_path   text,
  p_caption        text,
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
  if p_caption is null or length(trim(p_caption)) = 0 then
    raise exception 'a caption describing the photo is required';
  end if;

  select count(*) into v_count from place_submission_images where submission_id = p_submission_id;
  if v_count >= 5 then
    raise exception 'A submission may contain at most 5 images.';
  end if;

  insert into place_submission_images (submission_id, storage_path, caption, file_name, content_type)
  values (p_submission_id, p_storage_path, trim(p_caption), p_file_name, p_content_type)
  returning place_submission_images.id into v_id;

  return v_id;
end;
$$;

revoke all on function create_place_submission_image(uuid, text, text, text, text) from public;
grant execute on function create_place_submission_image(uuid, text, text, text, text) to anon, authenticated;

-- create_location_media_submission_image(): same addition.
drop function if exists create_location_media_submission_image(uuid, text, text, text);

create or replace function create_location_media_submission_image(
  p_submission_id  uuid,
  p_storage_path   text,
  p_caption        text,
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
  select status into v_status from location_media_submissions where id = p_submission_id;
  if v_status is null then
    raise exception 'submission % does not exist', p_submission_id;
  end if;
  if v_status <> 'pending' then
    raise exception 'this submission has already been reviewed';
  end if;
  if p_caption is null or length(trim(p_caption)) = 0 then
    raise exception 'a caption describing the photo is required';
  end if;

  select count(*) into v_count from location_media_submission_images where submission_id = p_submission_id;
  if v_count >= 5 then
    raise exception 'A submission may contain at most 5 images.';
  end if;

  insert into location_media_submission_images (submission_id, storage_path, caption, file_name, content_type)
  values (p_submission_id, p_storage_path, trim(p_caption), p_file_name, p_content_type)
  returning location_media_submission_images.id into v_id;

  return v_id;
end;
$$;

revoke all on function create_location_media_submission_image(uuid, text, text, text, text) from public;
grant execute on function create_location_media_submission_image(uuid, text, text, text, text) to anon, authenticated;
