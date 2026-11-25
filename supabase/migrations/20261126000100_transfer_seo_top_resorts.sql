-- SEO refresh for the most-booked resort transfer routes (owner request, 2026-11-26).
--
-- 1. Search titles and descriptions for 8 resort routes from Velana International Airport.
-- 2. Correct journey times: Centara, Hard Rock and SAii are 20 minutes by speedboat
--    (confirmed by the owner); they were stored as 40 / 60 / 60 minutes.
-- 3. Correct the Centara name: the resorts are Centara Mirage Lagoon and Centara Grand
--    Lagoon (Centara Grand Island is a different resort in Ari Atoll). Slugs and URLs
--    are NOT changed, so no links break.
--
-- Safe to run more than once (the migration tool runs it in a transaction). Rows are matched
-- by slug; a missing slug just updates nothing.


-- 1. Search titles and descriptions ---------------------------------------------------------
update nodes as n
set meta_title = v.meta_title,
    meta_description = v.meta_description,
    updated_at = now()
from (values
  ('velana-international-airport-to-club-med-kani-maldives',
   'Malé Airport to Club Med Kani Transfer: Speedboat Times & Prices',
   'How to get from Velana Airport to Club Med Kani by speedboat: journey time, prices, shared or private boats, meet & greet and tips for families. Book with Maldives Tour Guide.'),
  ('velana-international-airport-to-club-med-finolhu-villas-maldives',
   'Malé Airport to Club Med Finolhu Villas Transfer: Speedboat Guide',
   'Getting to Club Med Finolhu Villas from Velana Airport: speedboat journey time, prices, private boats and meet & greet. One boat can also serve Club Med Kani.'),
  ('velana-international-airport-to-centara-mirage-and-grand-island-resort-maldives',
   'Malé Airport to Centara Mirage & Grand Lagoon: 20-Min Speedboat',
   'Speedboat transfer from Velana Airport to Centara Mirage Lagoon and Centara Grand Lagoon in about 20 minutes: prices, meet & greet and private boats.'),
  ('velana-international-airport-to-hard-rock-hotel-maldives',
   'Malé Airport to Hard Rock Hotel Maldives: 20-Min Speedboat Transfer',
   'Hard Rock Hotel Maldives is about 20 minutes from Velana Airport by speedboat. Prices, night arrivals, private boats and meet & greet with Maldives Tour Guide.'),
  ('velana-international-airport-to-saii-lagoon-maldives-curio-collection-by-hilton',
   'Malé Airport to SAii Lagoon Maldives: 20-Min Speedboat Transfer',
   'SAii Lagoon Maldives (Curio Collection by Hilton) is about 20 minutes from Velana Airport by speedboat. Prices, late arrivals, private boats and meet & greet.'),
  ('velana-international-airport-to-so-maldives',
   'Malé Airport to SO/ Maldives Transfer: Speedboat Times & Prices',
   'How to get from Velana Airport to SO/ Maldives in the Emboodhoo Lagoon by speedboat: journey time, prices, shared or private boats and meet & greet.'),
  ('velana-international-airport-to-anantara-dhigu-maldives-resort',
   'Malé Airport to Anantara Dhigu Transfer: Speedboat Times & Prices',
   'Getting to Anantara Dhigu in South Malé Atoll from Velana Airport: speedboat journey time, prices, private boats and meet & greet. Groups for Anantara Veli can share a boat.'),
  ('velana-international-airport-to-one-only-reethi-rah',
   'Malé Airport to One&Only Reethi Rah Transfer: Speedboat Guide',
   'How to get from Velana Airport to One&Only Reethi Rah in North Malé Atoll by speedboat: journey time, prices, private boats and meet & greet.')
) as v(slug, meta_title, meta_description)
where n.slug = v.slug
  and n.node_type = 'transfer_route';

-- 2. Journey times: 20 minutes for Centara, Hard Rock and SAii ------------------------------
with r as (
  select n.id
  from nodes n
  where n.node_type = 'transfer_route'
    and n.slug in (
      'velana-international-airport-to-centara-mirage-and-grand-island-resort-maldives',
      'velana-international-airport-to-hard-rock-hotel-maldives',
      'velana-international-airport-to-saii-lagoon-maldives-curio-collection-by-hilton'
    )
)
update transfer_routes tr
set typical_duration_minutes = 20
from r
where tr.id = r.id;

with r as (
  select n.id
  from nodes n
  where n.node_type = 'transfer_route'
    and n.slug in (
      'velana-international-airport-to-centara-mirage-and-grand-island-resort-maldives',
      'velana-international-airport-to-hard-rock-hotel-maldives',
      'velana-international-airport-to-saii-lagoon-maldives-curio-collection-by-hilton'
    )
)
update transfer_services ts
set duration_minutes = 20
from r
where ts.route_id = r.id
  and ts.duration_minutes is distinct from 20;

-- 3. Centara name (titles only; slugs unchanged) --------------------------------------------
update nodes
set title = 'Velana International Airport to Centara Mirage Lagoon & Centara Grand Lagoon Maldives',
    updated_at = now()
where node_type = 'transfer_route'
  and slug = 'velana-international-airport-to-centara-mirage-and-grand-island-resort-maldives';

update nodes as loc
set title = 'Centara Mirage Lagoon & Centara Grand Lagoon Maldives',
    updated_at = now()
from transfer_routes tr
join nodes rn on rn.id = tr.id
where rn.node_type = 'transfer_route'
  and rn.slug = 'velana-international-airport-to-centara-mirage-and-grand-island-resort-maldives'
  and loc.id = tr.destination_location_id
  and loc.title ilike '%grand island%';

