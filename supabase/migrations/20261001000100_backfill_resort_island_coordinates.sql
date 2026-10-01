-- Backfill lat/lng for the real island/atoll `locations` rows that
-- accommodation and atoll pages actually read for LocationMap (Task 22,
-- src/components/locations/location-map.tsx).
--
-- Root cause: 20250112000100_legacy_transfers_rebuild.sql recovered real
-- lat/lng for ~55 resorts from their legacy transfer pages (JSON-LD "geo"),
-- but stored them on a *separate* `locations` row it created per resort,
-- titled after the resort itself (e.g. "Adaaran Club Rannalhi"), used only
-- as a transfer_routes destination. Accommodations don't point at that row
-- -- their `node_locations` (relation = 'primary') points at the real
-- geographic island row from the later island pipeline (Task 24, e.g.
-- "Rannalhi"), which was never geocoded. LocationMap correctly renders
-- nothing when lat/lng is null, so it silently never showed on any
-- accommodation or atoll page -- not a missing feature, a disconnected one.
--
-- This matches each accommodation's own title (normalized: lowercased,
-- marketing suffixes like "Island Resort"/"Maldives"/"& Spa" stripped,
-- non-alphanumerics removed) against the transfer-only location rows'
-- titles, normalized the same way, and copies lat/lng onto the real island
-- row the accommodation actually uses -- exact normalized match only, no
-- fuzzy/substring matching, to avoid false positives (verified by hand:
-- e.g. "Bandos" must NOT match "Malahini Kuda Bandos", a different resort).
-- Matched and verified against a local copy of this schema: 34 of 154
-- accommodations' islands. The rest have no coordinate source anywhere in
-- this database and need geocoding -- add it per-location via
-- /admin/locations/[id] (the lat/lng fields already exist there).
with norm as (
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
  where node_type in ('location', 'accommodation')
),
resort_loc as (
  -- The transfer-only location rows that do have legacy-sourced coordinates.
  select l.id, l.lat, l.lng, nn.norm_title
  from locations l
  join norm nn on nn.id = l.id
  where l.location_type = 'island' and l.lat is not null
),
acc_island as (
  -- Each accommodation's real primary-location island, where it's not
  -- geocoded yet.
  select distinct nl.location_id as island_id, nn.norm_title as acc_norm
  from accommodations a
  join norm nn on nn.id = a.id
  join node_locations nl on nl.node_id = a.id and nl.relation = 'primary'
  join locations il on il.id = nl.location_id
  where il.lat is null
)
update locations l
set lat = rl.lat, lng = rl.lng
from acc_island ai
join resort_loc rl on rl.norm_title = ai.acc_norm and length(ai.acc_norm) > 3
where l.id = ai.island_id and l.lat is null;

-- Atoll-level coordinates (for the atoll detail page's LocationMap): no
-- atoll row has ever had lat/lng. Approximate each atoll's point as the
-- centroid of its child islands that now have coordinates -- only ever
-- fills atolls with at least one geocoded island, never fabricated.
update locations a
set lat = c.avg_lat, lng = c.avg_lng
from (
  select parent_id, avg(lat) as avg_lat, avg(lng) as avg_lng
  from locations
  where location_type = 'island' and lat is not null and parent_id is not null
  group by parent_id
) c
where a.id = c.parent_id and a.location_type = 'atoll' and a.lat is null;
