-- Tags the Male Atoll excursion/city-tour products (already sold as
-- "free pickup from Male Atoll resorts and islands") with every resort
-- and local island on the owner's pickup list, as secondary
-- node_locations rows, so each resort/island's own page can surface these
-- as nearby activities.
--
-- Deliberately scoped to the 11 general-excursion products only (owner's
-- explicit choice) — not every fishing-category activity, since several
-- (Himmafushi/Yuvi Blue charters, fly fishing, MFH charters) are tied to
-- one fixed base and don't actually offer this resort network's pickup.
--
-- Resorts resolve via their own accommodation node's PRIMARY location
-- (locations.id references nodes(id) directly; a resort is its own
-- node_type='accommodation' row, never a locations row) — a handful have
-- no distinct island node in this dataset and only ever resolved to the
-- Kaafu atoll (same gap documented in 20250126000100_fix_fake_resort_
-- islands.sql). Local islands given by name resolve by exact slug.
--
-- GENERATED FILE, regenerate with:
--   node scripts/add-excursion-pickup-locations.mjs

with target_activities as (
  select id from nodes where node_type = 'activity' and slug in (
    'full-day-excursion-male-atoll',
    'vaavu-atoll-excursion',
    'stingray-snorkeling',
    'nurse-shark-snorkeling',
    'sandbank-and-snorkeling-excursion',
    'dolphin-excursion',
    'male-city-walking-tour',
    'male-city-bike-tour',
    'male-city-car-tour',
    'male-city-half-day-walking-tour',
    'male-city-half-day-bike-tour'
  )
),
target_locations as (
  -- Adaaran Select Hudhuranfushi
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Adaaran Select Hudhuranfushi' || '%'
   limit 1)
  union all
  -- Adaaran Prestige Ocean Villas
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Adaaran Prestige Ocean Villas' || '%'
   limit 1)
  union all
  -- Asdu Sun Island Resort
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Asdu Sun Island' || '%'
   limit 1)
  union all
  -- Baros Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Baros Maldives' || '%'
   limit 1)
  union all
  -- Bandos Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Bandos Maldives' || '%'
   limit 1)
  union all
  -- Banyan Tree Vabbinfaru
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Banyan Tree Vabbinfaru' || '%'
   limit 1)
  union all
  -- Cinnamon Dhonveli Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Cinnamon Dhonveli' || '%'
   limit 1)
  union all
  -- Club Med Kani
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Club Med Kani' || '%'
   limit 1)
  union all
  -- Club Med Finolhu Villas
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Club Med Finolhu' || '%'
   limit 1)
  union all
  -- Coco Bodu Hithi
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Coco Bodu Hithi' || '%'
   limit 1)
  union all
  -- Coco Prive
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Coco Priv' || '%'
   limit 1)
  union all
  -- Dhawa Ihuru
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Dhawa Ihuru' || '%'
   limit 1)
  union all
  -- Eri Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Eriyadu' || '%'
   limit 1)
  union all
  -- Four Seasons Resort Maldives at Kuda Huraa
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Four Seasons' || '%'
   limit 1)
  union all
  -- Gili Lankanfushi
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Gili Lankanfushi' || '%'
   limit 1)
  union all
  -- Grand Park Kodhipparu Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Grand Park Kodhipparu' || '%'
   limit 1)
  union all
  -- Huvafen Fushi
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Huvafen Fushi' || '%'
   limit 1)
  union all
  -- Jumeirah Maldives Olhahali Island
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Jumeirah' || '%'
   limit 1)
  union all
  -- Kagi Maldives Resort & Spa
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Kagi' || '%'
   limit 1)
  union all
  -- Kuda Villingili Resort Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Kuda Villingili' || '%'
   limit 1)
  union all
  -- Kurumba Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Kurumba' || '%'
   limit 1)
  union all
  -- Makunudu Island
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Makunudu' || '%'
   limit 1)
  union all
  -- Malahini Kuda Bandos
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Malahini Kuda Bandos' || '%'
   limit 1)
  union all
  -- Meeru Maldives Resort Island
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Meeru' || '%'
   limit 1)
  union all
  -- Niva Kurumba Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Niva Kurumba' || '%'
   limit 1)
  union all
  -- Oblu Select at Sangeli
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Sangeli' || '%'
   limit 1)
  union all
  -- Oblu by Atmosphere at Helengeli
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Helengeli' || '%'
   limit 1)
  union all
  -- One&Only Reethi Rah
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Reethi Rah' || '%'
   limit 1)
  union all
  -- Patina Maldives, Fari Islands
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Patina Maldives' || '%'
   limit 1)
  union all
  -- Sheraton Maldives Full Moon Resort & Spa
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Sheraton Maldives Full Moon' || '%'
   limit 1)
  union all
  -- Summer Island Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Summer Island' || '%'
   limit 1)
  union all
  -- Thulhagiri Island Resort & Spa
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Thulhagiri' || '%'
   limit 1)
  union all
  -- The Ritz-Carlton Maldives, Fari Islands
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Ritz-Carlton' || '%'
   limit 1)
  union all
  -- Varu by Atmosphere
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Varu by Atmosphere' || '%'
   limit 1)
  union all
  -- Villa Nautica
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Villa Nautica' || '%'
   limit 1)
  union all
  -- Vivanta Maldives (formerly Taj Coral Reef)
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Taj Coral Reef' || '%'
   limit 1)
  union all
  -- Hilton Maldives Amingiri Resort & Spa
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Amingiri' || '%'
   limit 1)
  union all
  -- Centara Mirage Lagoon Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Centara Mirage' || '%'
   limit 1)
  union all
  -- Centara Grand Lagoon Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Centara Grand' || '%'
   limit 1)
  union all
  -- dusitD2 Feydhoo Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Feydhoo' || '%'
   limit 1)
  union all
  -- Adaaran Club Rannalhi
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Adaaran Club Rannalhi' || '%'
   limit 1)
  union all
  -- Adaaran Prestige Vadoo
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Adaaran Prestige Vadoo' || '%'
   limit 1)
  union all
  -- Anantara Dhigu Maldives Resort
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Anantara Dhigu' || '%'
   limit 1)
  union all
  -- Anantara Veli Maldives Resort
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Anantara Veli' || '%'
   limit 1)
  union all
  -- COMO Cocoa Island
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Cocoa Island' || '%'
   limit 1)
  union all
  -- Embudu Village
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Embudu Village' || '%'
   limit 1)
  union all
  -- Fihalhohi Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Fihalhohi' || '%'
   limit 1)
  union all
  -- Hard Rock Hotel Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Hard Rock Hotel' || '%'
   limit 1)
  union all
  -- Holiday Inn Resort Kandooma Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Kandooma' || '%'
   limit 1)
  union all
  -- Jumeirah Vittaveli
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Vittaveli' || '%'
   limit 1)
  union all
  -- Naladhu Private Island Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Naladhu' || '%'
   limit 1)
  union all
  -- OZEN Life Maadhoo
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Maadhoo' || '%'
   limit 1)
  union all
  -- Rihiveli The Dream
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Rihiveli' || '%'
   limit 1)
  union all
  -- SAii Lagoon Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'SAii Lagoon' || '%'
   limit 1)
  union all
  -- Taj Exotica Resort & Spa Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Taj Exotica' || '%'
   limit 1)
  union all
  -- Velassaru Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Velassaru' || '%'
   limit 1)
  union all
  -- Waldorf Astoria Maldives Ithaafushi
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Waldorf Astoria' || '%'
   limit 1)
  union all
  -- Sun Siyam Olhuveli
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'Olhuveli' || '%'
   limit 1)
  union all
  -- SO/ Maldives
  (select nl.location_id
   from nodes n
   join accommodations a on a.id = n.id
   join node_locations nl on nl.node_id = n.id and nl.relation = 'primary'
   where n.node_type = 'accommodation' and n.title ilike '%' || 'SO/ Maldives' || '%'
   limit 1)
  union all
  -- Huraa
  (select loc.id as location_id
   from nodes loc
   where loc.node_type = 'location' and loc.slug = 'huraa')
  union all
  -- Gulhi
  (select loc.id as location_id
   from nodes loc
   where loc.node_type = 'location' and loc.slug = 'gulhi')
  union all
  -- Maafushi
  (select loc.id as location_id
   from nodes loc
   where loc.node_type = 'location' and loc.slug = 'maafushi')
  union all
  -- Thulusdhoo
  (select loc.id as location_id
   from nodes loc
   where loc.node_type = 'location' and loc.slug = 'thulusdhoo')
  union all
  -- Dhiffushi
  (select loc.id as location_id
   from nodes loc
   where loc.node_type = 'location' and loc.slug = 'dhiffushi')
  union all
  -- Guraidhoo
  (select loc.id as location_id
   from nodes loc
   where loc.node_type = 'location' and loc.slug = 'guraidhoo')
)
insert into node_locations (node_id, location_id, relation)
select ta.id, tl.location_id, 'secondary'
from target_activities ta
cross join (select distinct location_id from target_locations where location_id is not null) tl
on conflict (node_id, location_id) do nothing;
