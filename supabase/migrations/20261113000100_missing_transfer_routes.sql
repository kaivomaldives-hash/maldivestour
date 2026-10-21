-- Adds the 4 real transfer routes a live-data audit (2026-10-21) found
-- genuinely missing from production, confirmed by directly querying the
-- live `nodes`/`transfer_routes` tables rather than just the migration
-- history: Centara Ras Fushi, Anantara Veli, and Biyadhoo Island each
-- already had a complete, correct `locations` row (real lat/lng, correct
-- Kaafu Atoll parent) that had simply been left `status = 'archived'`
-- instead of 'published' -- nothing ever pointed a route at it because an
-- archived location was never a valid destination. Adaaran Select
-- Hudhuran Fushi is different: it already has a real, published
-- accommodation listing, whose primary location (the island "Lhohifushi")
-- was published but had no transfer route built to it at all.
--
-- The site owner has real, resort-specific photos staged for all four
-- (uploaded directly once these routes exist) -- this migration only
-- creates the routes themselves; no distance/duration is fabricated for
-- any of them, left null like every other route with that detail
-- unknown.

-- 1. Un-archive the 3 complete-but-archived destination locations. Each
-- was confirmed unreferenced by anything else (no node_locations rows,
-- no accommodations) before un-archiving, so this can't surface stale
-- content anywhere but the new route itself.
update nodes
set status = 'published', published_at = coalesce(published_at, now())
where id in (
  '93df2bb9-37ec-4054-9b52-3f742ab972c0', -- Centara Ras Fushi Resort & Spa
  '982f2f8e-1d2e-4f2c-b664-0f32fb05b3e5', -- Anantara Veli Maldives Resort
  'a5437b2c-2f47-4c53-ad43-739448675ad0'  -- Biyadhoo Island Resort
)
and status = 'archived';

-- 2. Velana International Airport to Centara Ras Fushi Resort & Spa
with ins as (
  insert into nodes (node_type, slug, title, summary, meta_title, meta_description, status, published_at)
  values (
    'transfer_route',
    'velana-international-airport-to-centara-ras-fushi-resort-spa',
    'Velana International Airport to Centara Ras Fushi Resort & Spa',
    'Transfer route from Velana International Airport to Centara Ras Fushi Resort & Spa.',
    'Velana International Airport to Centara Ras Fushi Resort & Spa Transfers | Maldives Tour Guide',
    'Transfer route from Velana International Airport to Centara Ras Fushi Resort & Spa.',
    'published',
    now()
  )
  returning id
)
insert into transfer_routes (id, origin_location_id, destination_location_id)
select id, 'df760ff2-9b02-4d80-a6ad-d0c4bbbe5321', '93df2bb9-37ec-4054-9b52-3f742ab972c0' from ins;

-- 3. Velana International Airport to Anantara Veli Maldives Resort
with ins as (
  insert into nodes (node_type, slug, title, summary, meta_title, meta_description, status, published_at)
  values (
    'transfer_route',
    'velana-international-airport-to-anantara-veli-maldives-resort',
    'Velana International Airport to Anantara Veli Maldives Resort',
    'Transfer route from Velana International Airport to Anantara Veli Maldives Resort.',
    'Velana International Airport to Anantara Veli Maldives Resort Transfers | Maldives Tour Guide',
    'Transfer route from Velana International Airport to Anantara Veli Maldives Resort.',
    'published',
    now()
  )
  returning id
)
insert into transfer_routes (id, origin_location_id, destination_location_id)
select id, 'df760ff2-9b02-4d80-a6ad-d0c4bbbe5321', '982f2f8e-1d2e-4f2c-b664-0f32fb05b3e5' from ins;

-- 4. Velana International Airport to Biyadhoo Island Resort
with ins as (
  insert into nodes (node_type, slug, title, summary, meta_title, meta_description, status, published_at)
  values (
    'transfer_route',
    'velana-international-airport-to-biyadhoo-island-resort',
    'Velana International Airport to Biyadhoo Island Resort',
    'Transfer route from Velana International Airport to Biyadhoo Island Resort.',
    'Velana International Airport to Biyadhoo Island Resort Transfers | Maldives Tour Guide',
    'Transfer route from Velana International Airport to Biyadhoo Island Resort.',
    'published',
    now()
  )
  returning id
)
insert into transfer_routes (id, origin_location_id, destination_location_id)
select id, 'df760ff2-9b02-4d80-a6ad-d0c4bbbe5321', 'a5437b2c-2f47-4c53-ad43-739448675ad0' from ins;

-- 5. Velana International Airport to Adaaran Select Hudhuran Fushi
-- Destination is "Lhohifushi" (d2ab8531-...) -- the real, already-
-- published primary location of the Adaaran Select Hudhuran Fushi Island
-- Resort Maldives accommodation (90f08b52-..., via node_locations,
-- relation='primary') -- not the stale archived duplicate location
-- titled after the resort itself, which this migration deliberately
-- leaves archived since the accommodation's own primary location is the
-- current, correct record.
with ins as (
  insert into nodes (node_type, slug, title, summary, meta_title, meta_description, status, published_at)
  values (
    'transfer_route',
    'velana-international-airport-to-adaaran-select-hudhuran-fushi',
    'Velana International Airport to Adaaran Select Hudhuran Fushi',
    'Transfer route from Velana International Airport to Adaaran Select Hudhuran Fushi.',
    'Velana International Airport to Adaaran Select Hudhuran Fushi Transfers | Maldives Tour Guide',
    'Transfer route from Velana International Airport to Adaaran Select Hudhuran Fushi.',
    'published',
    now()
  )
  returning id
)
insert into transfer_routes (id, origin_location_id, destination_location_id)
select id, 'df760ff2-9b02-4d80-a6ad-d0c4bbbe5321', 'd2ab8531-3a37-40b1-90bf-ddffe5847bcd' from ins;
