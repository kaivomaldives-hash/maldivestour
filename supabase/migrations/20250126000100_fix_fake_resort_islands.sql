-- Entity cleanup: archive the fake resort-named 'island' location
-- nodes the Task 18 legacy transfer rebuild auto-created (see
-- scripts/fix-fake-resort-islands.mjs), repoint the transfer routes that
-- referenced them at the real island/atoll instead, and 301 the old
-- /maldives/islands/{slug}/ URL to the correct canonical destination.
-- GENERATED FILE, regenerate with:
--   node scripts/fix-fake-resort-islands.mjs --commit

-- SO/ Maldives (so-maldives) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'so-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/so-maldives/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Adaaran Select Hudhuranfushi (adaaran-select-hudhuranfushi) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'adaaran-select-hudhuranfushi';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/adaaran-select-hudhuranfushi/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Adaaran Club Rannalhi (adaaran-club-rannalhi) -> island:rannalhi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'adaaran-club-rannalhi';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'rannalhi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/adaaran-club-rannalhi/', 'path', '/maldives/islands/rannalhi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Adaaran Prestige Vadoo (adaaran-prestige-vadoo) -> island:vadoo [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'adaaran-prestige-vadoo';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'vadoo';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/adaaran-prestige-vadoo/', 'path', '/maldives/islands/vadoo/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Anantara Dhigu Maldives Resort (anantara-dhigu-maldives-resort) -> island:dhigufinolhu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'anantara-dhigu-maldives-resort';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'dhigufinolhu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/anantara-dhigu-maldives-resort/', 'path', '/maldives/islands/dhigufinolhu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Anantara Veli Maldives Resort (anantara-veli-maldives-resort) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'anantara-veli-maldives-resort';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/anantara-veli-maldives-resort/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Bandos Maldives Resort (bandos-maldives-resort) -> island:bandos [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'bandos-maldives-resort';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'bandos';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/bandos-maldives-resort/', 'path', '/maldives/islands/bandos/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Banyan Tree Vabbinfaru (banyan-tree-vabbinfaru) -> island:vabbinfaru [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'banyan-tree-vabbinfaru';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'vabbinfaru';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/banyan-tree-vabbinfaru/', 'path', '/maldives/islands/vabbinfaru/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Biyadhoo Island Resort (biyadhoo-island-resort) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'biyadhoo-island-resort';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/biyadhoo-island-resort/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- COMO Cocoa Island Maldives (como-cocoa-island-maldives) -> island:makunufushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'como-cocoa-island-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'makunufushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/como-cocoa-island-maldives/', 'path', '/maldives/islands/makunufushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Centara Ras Fushi Resort & Spa (centara-ras-fushi-resort-spa) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'centara-ras-fushi-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/centara-ras-fushi-resort-spa/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Cinnamon Dhonveli Maldives (cinnamon-dhonveli-maldives) -> island:kanuhuraa [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'cinnamon-dhonveli-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kanuhuraa';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/cinnamon-dhonveli-maldives/', 'path', '/maldives/islands/kanuhuraa/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Club Med Finolhu Villas Maldives (club-med-finolhu-villas-maldives) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'club-med-finolhu-villas-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/club-med-finolhu-villas-maldives/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Coco Bodu Hithi Maldives (coco-bodu-hithi-maldives) -> island:bodu-hithi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'coco-bodu-hithi-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'bodu-hithi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/coco-bodu-hithi-maldives/', 'path', '/maldives/islands/bodu-hithi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Embudu Village Maldives (embudu-village-maldives) -> island:embudu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'embudu-village-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'embudu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/embudu-village-maldives/', 'path', '/maldives/islands/embudu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Eriyadu Maldives (eriyadu-maldives) -> island:eriyadu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'eriyadu-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'eriyadu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/eriyadu-maldives/', 'path', '/maldives/islands/eriyadu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Capella Maldives at Fari Islands (capella-maldives-at-fari-islands) -> island:fari-islands [title]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'capella-maldives-at-fari-islands';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'fari-islands';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/capella-maldives-at-fari-islands/', 'path', '/maldives/islands/fari-islands/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via title.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Fihalhohi Maldives (fihalhohi-maldives) -> island:fihalhohi [title]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'fihalhohi-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'fihalhohi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/fihalhohi-maldives/', 'path', '/maldives/islands/fihalhohi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via title.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Fun Island Maldives (fun-island-maldives) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'fun-island-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/fun-island-maldives/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Grand Park Kodhipparu Maldives (grand-park-kodhipparu-maldives) -> island:kodhipparu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'grand-park-kodhipparu-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kodhipparu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/grand-park-kodhipparu-maldives/', 'path', '/maldives/islands/kodhipparu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Hard Rock Hotel Maldives (hard-rock-hotel-maldives) -> island:akasdhoo [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'hard-rock-hotel-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'akasdhoo';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/hard-rock-hotel-maldives/', 'path', '/maldives/islands/akasdhoo/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Holiday Inn Resort Kandooma Maldives (holiday-inn-resort-kandooma-maldives) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'holiday-inn-resort-kandooma-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/holiday-inn-resort-kandooma-maldives/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Huvafen Fushi Maldives (huvafen-fushi-maldives) -> island:nakatchafushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'huvafen-fushi-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'nakatchafushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/huvafen-fushi-maldives/', 'path', '/maldives/islands/nakatchafushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Jumeirah Olhahali Island Maldives (jumeirah-olhahali-island-maldives) -> island:olhahali [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'jumeirah-olhahali-island-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'olhahali';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/jumeirah-olhahali-island-maldives/', 'path', '/maldives/islands/olhahali/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Kagi Island Maldives Resort & Spa (kagi-island-maldives-resort-spa) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'kagi-island-maldives-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/kagi-island-maldives-resort-spa/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Kurumba Maldives (kurumba-maldives) -> island:vihamanaafushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'kurumba-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'vihamanaafushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/kurumba-maldives/', 'path', '/maldives/islands/vihamanaafushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- LUX* North Male Atoll (lux-north-male-atoll) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'lux-north-male-atoll';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/lux-north-male-atoll/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Makunudu Island (makunudu-island) -> island:makunudu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'makunudu-island';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'makunudu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/makunudu-island/', 'path', '/maldives/islands/makunudu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Malahini Kuda Bandos (malahini-kuda-bandos) -> island:kuda-bandos [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'malahini-kuda-bandos';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kuda-bandos';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/malahini-kuda-bandos/', 'path', '/maldives/islands/kuda-bandos/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- The Marina at CROSSROADS Maldives (the-marina-at-crossroads-maldives) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'the-marina-at-crossroads-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/the-marina-at-crossroads-maldives/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Meeru Island Resort & Spa (meeru-island-resort-spa) -> island:meerufenfushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'meeru-island-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'meerufenfushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/meeru-island-resort-spa/', 'path', '/maldives/islands/meerufenfushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- OBLU SELECT Lobigili (oblu-select-lobigili) -> island:lobigili [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'oblu-select-lobigili';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'lobigili';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/oblu-select-lobigili/', 'path', '/maldives/islands/lobigili/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- OBLU SELECT Sangeli (oblu-select-sangeli) -> island:sangeli [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'oblu-select-sangeli';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'sangeli';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/oblu-select-sangeli/', 'path', '/maldives/islands/sangeli/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- OBLU XPERIENCE Ailafushi (oblu-xperience-ailafushi) -> island:ailafushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'oblu-xperience-ailafushi';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'ailafushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/oblu-xperience-ailafushi/', 'path', '/maldives/islands/ailafushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- OBLU NATURE Helengeli by SENTIDO (oblu-nature-helengeli-by-sentido) -> island:helengeli [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'oblu-nature-helengeli-by-sentido';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'helengeli';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/oblu-nature-helengeli-by-sentido/', 'path', '/maldives/islands/helengeli/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- OZEN LIFE MAADHOO (ozen-life-maadhoo) -> island:maadhoo [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'ozen-life-maadhoo';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'maadhoo';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/ozen-life-maadhoo/', 'path', '/maldives/islands/maadhoo/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- One&Only Reethi Rah (one-only-reethi-rah) -> island:reethi-rah [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'one-only-reethi-rah';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'reethi-rah';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/one-only-reethi-rah/', 'path', '/maldives/islands/reethi-rah/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Oaga Art Resort Maldives (oaga-art-resort-maldives) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'oaga-art-resort-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/oaga-art-resort-maldives/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- OZEN RESERVE Bolifushi (ozen-reserve-bolifushi) -> island:bolifushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'ozen-reserve-bolifushi';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'bolifushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/ozen-reserve-bolifushi/', 'path', '/maldives/islands/bolifushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Patina Maldives, Fari Islands (patina-maldives-fari-islands) -> island:fari-islands [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'patina-maldives-fari-islands';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'fari-islands';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/patina-maldives-fari-islands/', 'path', '/maldives/islands/fari-islands/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- SAii Lagoon Maldives, Curio Collection by Hilton (saii-lagoon-maldives-curio-collection-by-hilton) -> island:embudu-finolhu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'saii-lagoon-maldives-curio-collection-by-hilton';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'embudu-finolhu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/saii-lagoon-maldives-curio-collection-by-hilton/', 'path', '/maldives/islands/embudu-finolhu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Sheraton Maldives Full Moon Resort & Spa (sheraton-maldives-full-moon-resort-spa) -> island:furanafushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'sheraton-maldives-full-moon-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'furanafushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/sheraton-maldives-full-moon-resort-spa/', 'path', '/maldives/islands/furanafushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Summer Island Maldives (summer-island-maldives) -> island:ziyaaraifushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'summer-island-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'ziyaaraifushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/summer-island-maldives/', 'path', '/maldives/islands/ziyaaraifushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Taj Coral Reef Resort & Spa (taj-coral-reef-resort-spa) -> island:hembadhu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'taj-coral-reef-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'hembadhu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/taj-coral-reef-resort-spa/', 'path', '/maldives/islands/hembadhu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Taj Exotica Resort & Spa (taj-exotica-resort-spa) -> island:emboodhu-finolhu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'taj-exotica-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'emboodhu-finolhu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/taj-exotica-resort-spa/', 'path', '/maldives/islands/emboodhu-finolhu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- The Ritz-Carlton Maldives, Fari Islands (the-ritz-carlton-maldives-fari-islands) -> island:fari-islands [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'the-ritz-carlton-maldives-fari-islands';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'fari-islands';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/the-ritz-carlton-maldives-fari-islands/', 'path', '/maldives/islands/fari-islands/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Villa Nautica Paradise Island (villa-nautica-paradise-island) -> island:lankanfinolhu [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'villa-nautica-paradise-island';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'lankanfinolhu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/villa-nautica-paradise-island/', 'path', '/maldives/islands/lankanfinolhu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Waldorf Astoria Maldives Ithaafushi (waldorf-astoria-maldives-ithaafushi) -> island:ithaafushi [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'waldorf-astoria-maldives-ithaafushi';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'ithaafushi';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/waldorf-astoria-maldives-ithaafushi/', 'path', '/maldives/islands/ithaafushi/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Club Med Kani Maldives (club-med-kani-maldives) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'club-med-kani-maldives';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/club-med-kani-maldives/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Dhawa Ihuru (dhawa-ihuru) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'dhawa-ihuru';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/dhawa-ihuru/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Hilton Maldives Amingiri Resort & Spa (hilton-maldives-amingiri-resort-spa) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'hilton-maldives-amingiri-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/hilton-maldives-amingiri-resort-spa/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- JW Marriott Maldives Resort & Spa (jw-marriott-maldives-resort-spa) -> island:vagaru [accommodation]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'jw-marriott-maldives-resort-spa';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'vagaru';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  -- The fake node's own hero photo is a real photo of this real
  -- island (it was the resort's own legacy image, taken on that
  -- island) — move it across rather than losing it, but only when
  -- the real island doesn't already have one of its own.
  if not exists (select 1 from node_media where node_id = v_target_id and role = 'hero') then
    update node_media set node_id = v_target_id
      where node_id = v_fake_id and role = 'hero'
        and not exists (select 1 from node_media nm3 where nm3.node_id = v_target_id and nm3.media_id = node_media.media_id and nm3.role = 'hero');
  end if;
  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/jw-marriott-maldives-resort-spa/', 'path', '/maldives/islands/vagaru/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via accommodation.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

-- Rosewood Ranfaru Resort (rosewood-ranfaru-resort) -> atoll:kaafu [atoll-fallback]
do $$
declare
  v_fake_id uuid;
  v_target_id uuid;
  v_route record;
  v_existing_route_id uuid;
  v_existing_route_slug text;
begin
  select id into v_fake_id from nodes where node_type = 'location' and slug = 'rosewood-ranfaru-resort';
  select id into v_target_id from nodes where node_type = 'location' and slug = 'kaafu';
  if v_fake_id is null or v_target_id is null then
    return;
  end if;

  for v_route in select n.id as id, n.slug as slug, tr.origin_location_id as origin_location_id from nodes n join transfer_routes tr on tr.id = n.id where tr.destination_location_id = v_fake_id loop
    select tr2.id, n2.slug into v_existing_route_id, v_existing_route_slug
      from transfer_routes tr2 join nodes n2 on n2.id = tr2.id
      where tr2.origin_location_id = v_route.origin_location_id and tr2.destination_location_id = v_target_id and tr2.id <> v_route.id;

    if v_existing_route_id is not null then
      -- Collapse any redirect already pointing at this soon-to-be-deleted
      -- route's page (e.g. a legacy .html URL) so it targets the
      -- surviving route directly — never a chain (this project's own
      -- prevent_redirect_chains() trigger enforces exactly this).
      update url_redirects set target_path = '/maldives/transfers/' || v_existing_route_slug || '/', updated_at = now()
        where target_path = '/maldives/transfers/' || v_route.slug || '/' and status_code = 301;
      insert into url_redirects (source_path, target_type, target_path, status_code, notes)
        values ('/maldives/transfers/' || v_route.slug || '/', 'path', '/maldives/transfers/' || v_existing_route_slug || '/', 301, 'Entity cleanup: this route duplicated an existing one once its fake destination was repointed to the real island/atoll.')
        on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();
      delete from nodes where id = v_route.id;
    else
      update transfer_routes set destination_location_id = v_target_id where id = v_route.id;
    end if;
  end loop;

  update nodes set status = 'archived' where id = v_fake_id;
end $$;
insert into url_redirects (source_path, target_type, target_path, status_code, notes) values ('/maldives/islands/rosewood-ranfaru-resort/', 'path', '/maldives/atolls/kaafu/', 301, 'Entity cleanup: this was a fake island node auto-created from a legacy transfer destination name (the real resort is a separate accommodation entity) — resolved via atoll-fallback.') on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path, status_code = excluded.status_code, notes = excluded.notes, updated_at = now();

