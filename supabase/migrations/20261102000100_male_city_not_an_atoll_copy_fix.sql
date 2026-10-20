-- Malé City's seeded copy (20250102000100_seed_maldives_locations.sql)
-- described it as "one of the Maldives' administrative atolls" -- wrong.
-- Unlike the Maldives' 20 natural atolls (each seeded with a real atoll
-- name and an island that happens to be its administrative capital),
-- Malé City is the country's capital *city* administrative division:
-- Malé island itself plus the nearby islands of Hulhumalé and Vilimalé.
-- It keeps location_type='atoll' in `locations` (it's still correctly a
-- top-level division containing child islands, same shape the routing/
-- breadcrumb/hierarchy code already relies on, and /maldives/atolls/
-- male-city/ stays the same URL -- no redirect needed), but the actual
-- on-page copy and search-result snippet should never call it an atoll.
update nodes
set
  summary = 'Malé City is the Maldives'' capital administrative division — Malé island itself, the country''s capital, plus the nearby islands of Hulhumalé and Vilimalé. Unlike the Maldives'' 20 natural atolls, Malé City isn''t a geographic atoll; it''s the capital territory.',
  meta_title = 'Malé City | Capital of the Maldives | MTG',
  meta_description = 'Malé is the capital city of the Maldives. Explore Malé City — the capital island, Hulhumalé and Vilimalé — things to do, landmarks, hotels and transport.'
where node_type = 'location' and slug = 'male-city';
