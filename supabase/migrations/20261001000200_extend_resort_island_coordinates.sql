-- Extends 20261001000100_backfill_resort_island_coordinates.sql with the
-- full set of legacy-sourced resort coordinates, not just the 55 the
-- earlier migration happened to reuse. Of the 84 legacy transfer pages
-- under release/public_html/transfer/, 63 actually carry a JSON-LD "geo"
-- block for their destination resort (the first "geo" block on every page
-- is always Velana International Airport's own fixed coordinate -- the
-- departure point -- and is skipped here; only the second, destination
-- block is used). The previous migration's source data only covered 55 of
-- these; this one re-derives the full 62 unique (name, lat, lng) triples
-- directly from the legacy HTML, so it also recovers 5 resorts whose
-- coordinates existed in the legacy site but were never captured by any
-- earlier migration: Baros Maldives, Four Seasons Resort Maldives at Kuda
-- Huraa, Gili Lankanfushi, Kuda Villingili Resort Maldives, and Sun Siyam
-- Olhuveli Maldives.
--
-- Same matching rule as before: exact match only after normalizing both
-- the accommodation's own title and the legacy resort name (lowercased,
-- marketing suffixes stripped, non-alphanumerics removed) -- no fuzzy/
-- substring matching, to avoid false positives. Only ever fills a null
-- lat/lng; never overwrites a value this or the previous migration (or an
-- admin) already set.
with legacy(name, lat, lng) as (values
  ('Adaaran Club Rannalhi', 3.9053, 73.4372),
  ('Adaaran Prestige Vadoo', 4.2619, 73.5081),
  ('Adaaran Select Hudhuranfushi', 4.3504, 73.6183),
  ('Anantara Dhigu Maldives Resort', 3.9448, 73.4564),
  ('Anantara Veli Maldives Resort', 3.9389, 73.4542),
  ('Bandos Maldives Resort', 4.2514, 73.5169),
  ('Banyan Tree Vabbinfaru', 4.2933, 73.5219),
  ('Baros Maldives', 4.2667, 73.5833),
  ('Biyadhoo Island Resort', 3.9742, 73.4961),
  ('COMO Cocoa Island Maldives', 3.9264, 73.4689),
  ('Capella Maldives at Fari Islands', 4.8167, 73.4167),
  ('Centara Mirage and Grand Island Resort Maldives', 3.5678, 72.9845),
  ('Centara Ras Fushi Resort & Spa', 4.2689, 73.5244),
  ('Cinnamon Dhonveli Maldives', 4.2806, 73.5161),
  ('Club Med Finolhu Villas Maldives', 4.0364, 73.4322),
  ('Club Med Kani Maldives', 4.2678, 73.5314),
  ('Coco Bodu Hithi Maldives', 4.4206, 73.5114),
  ('Dhawa Ihuru', 4.2964, 73.5278),
  ('DusitD2 Feydhoo Maldives', 4.1778, 73.5189),
  ('Embudu Village Maldives', 4.0917, 73.5061),
  ('Eriyadu Maldives', 4.6325, 73.4669),
  ('Fihalhohi Maldives', 3.9578, 73.4669),
  ('Four Seasons Resort Maldives at Kuda Huraa', 4.3112, 73.5758),
  ('Fun Island Maldives', 3.8567, 73.4789),
  ('Gili Lankanfushi Maldives', 4.2964, 73.6464),
  ('Grand Park Kodhipparu Maldives', 4.3156, 73.6322),
  ('Hard Rock Hotel Maldives', 4.0856, 73.4639),
  ('Hilton Maldives Amingiri Resort & Spa', 4.2500, 73.5333),
  ('Holiday Inn Resort Kandooma Maldives', 3.8461, 73.4594),
  ('Huvafen Fushi Maldives', 4.2981, 73.6383),
  ('JW Marriott Maldives Resort & Spa', 3.9872, 72.8039),
  ('Joy Island Maldives', 3.9247, 72.7436),
  ('Jumeirah Olhahali Island Maldives', 4.7512, 73.4017),
  ('Kagi Island Maldives Resort & Spa', 4.5883, 73.4206),
  ('Kuda Villingili Resort Maldives', 4.2803, 73.4586),
  ('Kurumba Maldives', 4.2136, 73.5261),
  ('LUX* North Male Atoll', 4.4667, 73.4167),
  ('Makunudu Island', 4.3519, 73.5083),
  ('Malahini Kuda Bandos', 4.2500, 73.4833),
  ('Meeru Island Resort & Spa', 4.2667, 73.5833),
  ('Niva Velassaru Maldives', 4.1198, 73.4366),
  ('OBLU NATURE Helengeli by SENTIDO', 4.5833, 73.4167),
  ('OBLU SELECT Lobigili', 4.1833, 73.5333),
  ('OBLU SELECT Sangeli', 4.6000, 73.4333),
  ('OBLU XPERIENCE Ailafushi', 4.2000, 73.5333),
  ('OZEN LIFE MAADHOO', 3.9667, 73.4500),
  ('OZEN RESERVE Bolifushi', 4.0333, 73.4833),
  ('Oaga Art Resort Maldives', 4.4500, 73.4500),
  ('One&Only Reethi Rah', 4.517705, 73.368691),
  ('Patina Maldives, Fari Islands', 4.6297, 73.5699),
  ('Rosewood Ranfaru Resort', 3.9000, 73.4667),
  ('SAii Lagoon Maldives, Curio Collection by Hilton', 4.0839, 73.4621),
  ('SO/ Maldives', 4.0825, 73.4618),
  ('Sheraton Maldives Full Moon Resort & Spa', 4.2496, 73.5454),
  ('Summer Island Maldives', 4.2667, 73.5833),
  ('Sun Siyam Olhuveli Maldives', 3.9333, 73.4833),
  ('Taj Coral Reef Resort & Spa', 4.2667, 73.5833),
  ('Taj Exotica Resort & Spa', 4.0883, 73.5256),
  ('The Marina at CROSSROADS Maldives', 4.2167, 73.5333),
  ('The Ritz-Carlton Maldives, Fari Islands', 4.6297, 73.5699),
  ('Villa Nautica Paradise Island', 4.2667, 73.5833),
  ('Waldorf Astoria Maldives Ithaafushi', 4.0333, 73.4667)
),
norm as (
  select id,
    regexp_replace(
      regexp_replace(
        lower(title),
        '(island resort & spa|island resort and spa|island resort spa|island resort|resort & spa|resort and spa|resort spa|maldives resort|resort maldives|island maldives|maldives|resort|hotel|spa|island|guest house|guesthouse|villas|by sentido|by hilton|curio collection|at fari islands|fari islands|&)',
        '', 'g'
      ),
      '[^a-z0-9]', '', 'g'
    ) as norm_title
  from nodes
  where node_type = 'accommodation'
),
norm_legacy as (
  select
    regexp_replace(
      regexp_replace(
        lower(name),
        '(island resort & spa|island resort and spa|island resort spa|island resort|resort & spa|resort and spa|resort spa|maldives resort|resort maldives|island maldives|maldives|resort|hotel|spa|island|guest house|guesthouse|villas|by sentido|by hilton|curio collection|at fari islands|fari islands|&)',
        '', 'g'
      ),
      '[^a-z0-9]', '', 'g'
    ) as norm_name,
    lat, lng
  from legacy
),
acc_island as (
  select distinct nl.location_id as island_id, nn.norm_title as acc_norm
  from accommodations a
  join norm nn on nn.id = a.id
  join node_locations nl on nl.node_id = a.id and nl.relation = 'primary'
  join locations il on il.id = nl.location_id
  where il.lat is null
)
update locations l
set lat = nlg.lat, lng = nlg.lng
from acc_island ai
join norm_legacy nlg on nlg.norm_name = ai.acc_norm and length(ai.acc_norm) > 3
where l.id = ai.island_id and l.lat is null;

-- Same idempotent atoll-centroid step as the previous migration, re-run in
-- case any atoll now has its first-ever geocoded child island.
update locations a
set lat = c.avg_lat, lng = c.avg_lng
from (
  select parent_id, avg(lat) as avg_lat, avg(lng) as avg_lng
  from locations
  where location_type = 'island' and lat is not null and parent_id is not null
  group by parent_id
) c
where a.id = c.parent_id and a.location_type = 'atoll' and a.lat is null;
