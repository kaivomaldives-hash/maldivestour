-- Updates the 14 existing Maldives Fishing and Holiday (MFH) packages
-- (20250119000100_seed_mfh_fishing.sql, Maamendhoo, Gaafu Alifu Atoll) and
-- its 2 private charter activities to the owner-supplied "Gotripmaldives
-- Customer Fishing Rate Sheet.pdf" (valid until 31 December 2027) — this
-- is the SAME real lodge/operator (the PDF's own accommodation line names
-- "Maldives Fishing and Holidays Lodge" exactly), just updated current
-- pricing. UPDATE statements, not re-inserts, since the original migration
-- may already be live (its `on conflict do nothing` inserts would never
-- have touched existing rows' prices).
--
-- price_from (website) = this PDF's 5-guest "best value" tier minus the
-- existing USD 20 website-discount convention already used for this exact
-- product line (see src/lib/packages/mfh-price-tables.ts / the original
-- generate-mfh-seed.mjs comment) — continued here, not newly invented.

-- 2-night-maldives-fishing-package-full-day-fishing
update packages set price_from = 970 where id = (select id from nodes where node_type = 'package' and slug = '2-night-maldives-fishing-package-full-day-fishing');
update bookable_products set base_price = 970 where id = (select id from nodes where node_type = 'package' and slug = '2-night-maldives-fishing-package-full-day-fishing');
-- 3-night-maldives-fishing-package-full-day-fishing
update packages set price_from = 1270 where id = (select id from nodes where node_type = 'package' and slug = '3-night-maldives-fishing-package-full-day-fishing');
update bookable_products set base_price = 1270 where id = (select id from nodes where node_type = 'package' and slug = '3-night-maldives-fishing-package-full-day-fishing');
-- 4-night-maldives-fishing-package-full-day-fishing
update packages set price_from = 1570 where id = (select id from nodes where node_type = 'package' and slug = '4-night-maldives-fishing-package-full-day-fishing');
update bookable_products set base_price = 1570 where id = (select id from nodes where node_type = 'package' and slug = '4-night-maldives-fishing-package-full-day-fishing');
-- 5-night-maldives-fishing-package-full-day-fishing
update packages set price_from = 1870 where id = (select id from nodes where node_type = 'package' and slug = '5-night-maldives-fishing-package-full-day-fishing');
update bookable_products set base_price = 1870 where id = (select id from nodes where node_type = 'package' and slug = '5-night-maldives-fishing-package-full-day-fishing');
-- 6-night-maldives-fishing-package-full-day-fishing
update packages set price_from = 2170 where id = (select id from nodes where node_type = 'package' and slug = '6-night-maldives-fishing-package-full-day-fishing');
update bookable_products set base_price = 2170 where id = (select id from nodes where node_type = 'package' and slug = '6-night-maldives-fishing-package-full-day-fishing');
-- 7-night-maldives-fishing-package-full-day-fishing
update packages set price_from = 2470 where id = (select id from nodes where node_type = 'package' and slug = '7-night-maldives-fishing-package-full-day-fishing');
update bookable_products set base_price = 2470 where id = (select id from nodes where node_type = 'package' and slug = '7-night-maldives-fishing-package-full-day-fishing');
-- 8-night-maldives-fishing-package-full-day-fishing
update packages set price_from = 2770 where id = (select id from nodes where node_type = 'package' and slug = '8-night-maldives-fishing-package-full-day-fishing');
update bookable_products set base_price = 2770 where id = (select id from nodes where node_type = 'package' and slug = '8-night-maldives-fishing-package-full-day-fishing');
-- 2-night-maldives-fishing-package-half-day-fishing
update packages set price_from = 870 where id = (select id from nodes where node_type = 'package' and slug = '2-night-maldives-fishing-package-half-day-fishing');
update bookable_products set base_price = 870 where id = (select id from nodes where node_type = 'package' and slug = '2-night-maldives-fishing-package-half-day-fishing');
-- 3-night-maldives-fishing-package-half-day-fishing
update packages set price_from = 1070 where id = (select id from nodes where node_type = 'package' and slug = '3-night-maldives-fishing-package-half-day-fishing');
update bookable_products set base_price = 1070 where id = (select id from nodes where node_type = 'package' and slug = '3-night-maldives-fishing-package-half-day-fishing');
-- 4-night-maldives-fishing-package-half-day-fishing
update packages set price_from = 1270 where id = (select id from nodes where node_type = 'package' and slug = '4-night-maldives-fishing-package-half-day-fishing');
update bookable_products set base_price = 1270 where id = (select id from nodes where node_type = 'package' and slug = '4-night-maldives-fishing-package-half-day-fishing');
-- 5-night-maldives-fishing-package-half-day-fishing
update packages set price_from = 1470 where id = (select id from nodes where node_type = 'package' and slug = '5-night-maldives-fishing-package-half-day-fishing');
update bookable_products set base_price = 1470 where id = (select id from nodes where node_type = 'package' and slug = '5-night-maldives-fishing-package-half-day-fishing');
-- 6-night-maldives-fishing-package-half-day-fishing
update packages set price_from = 1670 where id = (select id from nodes where node_type = 'package' and slug = '6-night-maldives-fishing-package-half-day-fishing');
update bookable_products set base_price = 1670 where id = (select id from nodes where node_type = 'package' and slug = '6-night-maldives-fishing-package-half-day-fishing');
-- 7-night-maldives-fishing-package-half-day-fishing
update packages set price_from = 1870 where id = (select id from nodes where node_type = 'package' and slug = '7-night-maldives-fishing-package-half-day-fishing');
update bookable_products set base_price = 1870 where id = (select id from nodes where node_type = 'package' and slug = '7-night-maldives-fishing-package-half-day-fishing');
-- 8-night-maldives-fishing-package-half-day-fishing
update packages set price_from = 2070 where id = (select id from nodes where node_type = 'package' and slug = '8-night-maldives-fishing-package-half-day-fishing');
update bookable_products set base_price = 2070 where id = (select id from nodes where node_type = 'package' and slug = '8-night-maldives-fishing-package-half-day-fishing');

-- Two private charter activities (now flat per-boat rates, not guest-tiered)
update activities set price_from = 1500.00 where id = (select id from nodes where node_type = 'activity' and slug = 'private-full-day-fishing-charter');
update bookable_products set base_price = 1500.00 where id = (select id from nodes where node_type = 'activity' and slug = 'private-full-day-fishing-charter');
update activities set price_from = 1000.00 where id = (select id from nodes where node_type = 'activity' and slug = 'private-half-day-fishing-charter');
update bookable_products set base_price = 1000.00 where id = (select id from nodes where node_type = 'activity' and slug = 'private-half-day-fishing-charter');

