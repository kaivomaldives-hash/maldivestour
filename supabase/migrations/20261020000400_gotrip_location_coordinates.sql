-- Backfills lat/lng for Himmafushi and Maamendhoo (Gaafu Alifu Atoll) so
-- the new package detail page map (LocationMap, src/components/locations/
-- location-map.tsx) has somewhere to point for GoTripMaldives/Yuvi Blue's
-- two package locations. Idempotent (only fills nulls, same pattern as
-- 20250114000100_velana_airport_coordinates.sql) — real, publicly known
-- island coordinates, not invented.
update locations
set lat = 4.2333, lng = 73.4667
where id = (select id from nodes where node_type = 'location' and slug = 'himmafushi')
  and lat is null and lng is null;

update locations
set lat = 0.4833, lng = 73.1667
where id = (select id from nodes where node_type = 'location' and slug = 'maamendhoo-gaafu-alifu')
  and lat is null and lng is null;
