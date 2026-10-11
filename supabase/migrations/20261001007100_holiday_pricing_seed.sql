-- Initial holiday_pricing_config rows for the Custom Holiday Builder.
-- Every figure here is either (a) a real rate already on this site
-- (Yuvi Blue Maldives, Himmafushi — the only live partner rate contract
-- this platform has) or (b) a publicly-researched BENCHMARK derived from
-- third-party aggregator listings, since no official rate card was
-- reachable for either reference property class. Every (b) row says so
-- plainly in source_note and carries the aggregator URLs that were
-- actually checked — this is disclosure for staff
-- (src/app/admin/holiday-pricing), never shown to customers. All of this
-- is admin-editable from day one; nothing here is meant to be final.

-- ============================================================
-- Local island rooms — anchored to Yuvi Blue Maldives' real contracted
-- rate (Deluxe Double/Twin, Bed & Breakfast, USD 80.50/room/night at
-- +15%; see supabase/migrations/20261001006700_yuviblue_himmafushi.sql).
-- The 5 generic customer-facing room types are a reasonable scaled
-- ladder around that one real figure, not independently sourced — the
-- only real local-island rate this platform has.
-- ============================================================
insert into holiday_pricing_config (category, stay_type, key, label, price_usd, unit, source_note, sort_order) values
('local_island_room', 'local_island', 'garden_view', 'Garden View', 75.00, 'per_room_per_night', 'Benchmark scaled from Yuvi Blue Maldives, Himmafushi real contracted rate (Deluxe Double/Twin BB, USD 80.50/room/night incl. 15% markup) — the only real local-island rate on this platform.', 1),
('local_island_room', 'local_island', 'ground_floor', 'Ground Floor Room', 80.50, 'per_room_per_night', 'Yuvi Blue Maldives, Himmafushi real contracted rate (Deluxe Double/Twin BB, +15% markup).', 2),
('local_island_room', 'local_island', 'first_floor', 'First Floor Room', 85.00, 'per_room_per_night', 'Benchmark scaled from Yuvi Blue Maldives, Himmafushi real contracted rate (small premium over ground floor).', 3),
('local_island_room', 'local_island', 'balcony_room', 'Balcony Room', 90.00, 'per_room_per_night', 'Benchmark scaled from Yuvi Blue Maldives, Himmafushi real contracted rate (balcony premium).', 4),
('local_island_room', 'local_island', 'beach_room', 'Beach Room', 100.00, 'per_room_per_night', 'Benchmark scaled from Yuvi Blue Maldives, Himmafushi real contracted rate (beachfront premium).', 5)
on conflict (category, stay_type, key) do nothing;

-- Local island meal plan surcharge, per person per night, derived from
-- Yuvi Blue's own real per-room BB->HB->FB deltas (Double/Twin: BB $80.50,
-- HB $103.50, FB $126.50, i.e. +$23/+$46 per room), halved for a
-- per-person figure assuming double occupancy.
insert into holiday_pricing_config (category, stay_type, key, label, price_usd, unit, source_note, sort_order) values
('meal_plan_local_island', 'local_island', 'breakfast', 'Breakfast', 0.00, 'per_person_per_night', 'Included in the base room rate, same as Yuvi Blue Maldives real contract (Bed & Breakfast is the base tier).', 1),
('meal_plan_local_island', 'local_island', 'half_board', 'Half Board', 11.50, 'per_person_per_night', 'Derived from Yuvi Blue Maldives real contracted BB->HB delta (+USD 23/room/night at +15%), divided by 2 for double occupancy.', 2),
('meal_plan_local_island', 'local_island', 'full_board', 'Full Board', 23.00, 'per_person_per_night', 'Derived from Yuvi Blue Maldives real contracted BB->FB delta (+USD 46/room/night at +15%), divided by 2 for double occupancy.', 3)
on conflict (category, stay_type, key) do nothing;

-- ============================================================
-- Resort rooms — public benchmark only (no official rate card reachable
-- for the reference property; aggregator figures varied from ~$136pp/
-- night to ~$1,100/night for villa-tier rooms). A 5-tier ladder scaled
-- across that range. NEVER shown with any resort/supplier name to
-- customers — see src/lib/holiday-builder/pricing-calculator.ts.
-- ============================================================
insert into holiday_pricing_config (category, stay_type, key, label, price_usd, unit, source_note, source_url, sort_order) values
('resort_room', 'resort', 'garden_villa', 'Garden Villa', 350.00, 'per_room_per_night', 'Public benchmark estimate — no official resort rate card was reachable; aggregator listings for mid-range Maldives island-resort villas ranged ~USD 136-1100/night. Needs supplier confirmation before quoting a real customer.', 'https://bluewaterdivetravel.com/resort/kurumba-maldives-resort', 1),
('resort_room', 'resort', 'beach_villa', 'Beach Villa', 450.00, 'per_room_per_night', 'Public benchmark estimate, same sourcing caveat as Garden Villa.', 'https://amaldives.com/resorts/kurumba-maldives', 2),
('resort_room', 'resort', 'family_villa', 'Family Villa', 550.00, 'per_room_per_night', 'Public benchmark estimate, same sourcing caveat as Garden Villa.', 'https://amaldives.com/resorts/kurumba-maldives', 3),
('resort_room', 'resort', 'pool_villa', 'Pool Villa', 600.00, 'per_room_per_night', 'Public benchmark estimate, same sourcing caveat as Garden Villa.', 'https://amaldives.com/resorts/kurumba-maldives', 4),
('resort_room', 'resort', 'water_villa', 'Water Villa', 750.00, 'per_room_per_night', 'Public benchmark estimate — top tier of the aggregator range. Needs supplier confirmation (the reference property researched may not itself offer an overwater villa category).', 'https://amaldives.com/resorts/kurumba-maldives', 5)
on conflict (category, stay_type, key) do nothing;

-- Resort meal plan surcharge, per person per night — typical Maldives
-- resort meal-plan step-up pattern, not property-specific (no resort
-- quoted a meal-plan breakdown in the research).
insert into holiday_pricing_config (category, stay_type, key, label, price_usd, unit, source_note, sort_order) values
('meal_plan_resort', 'resort', 'breakfast', 'Breakfast', 0.00, 'per_person_per_night', 'Included in the base room rate.', 1),
('meal_plan_resort', 'resort', 'half_board', 'Half Board', 40.00, 'per_person_per_night', 'Public benchmark estimate — typical Maldives resort meal-plan step-up, not property-specific. Needs supplier confirmation.', 2),
('meal_plan_resort', 'resort', 'full_board', 'Full Board', 70.00, 'per_person_per_night', 'Public benchmark estimate, same caveat as Half Board.', 3),
('meal_plan_resort', 'resort', 'all_inclusive', 'All-Inclusive', 120.00, 'per_person_per_night', 'Public benchmark estimate, same caveat as Half Board.', 4)
on conflict (category, stay_type, key) do nothing;

-- ============================================================
-- Safari (liveaboard) cabins — public benchmark only. Liveaboards are
-- conventionally sold per-person, full-board included (no separate meal
-- plan selector for Safari in the builder UI).
-- ============================================================
insert into holiday_pricing_config (category, stay_type, key, label, price_usd, unit, source_note, source_url, sort_order) values
('safari_cabin', 'safari', 'shared_cabin', 'Shared Cabin (Full Board)', 180.00, 'per_person_per_night', 'Public benchmark estimate — aggregator listings put budget liveaboard shared cabins at roughly USD 150-250/person/night, full board included. No specific operator confirmed; needs supplier confirmation before quoting a real customer.', 'https://www.bluewaterdivetravel.com/liveaboard-destination/maldives-liveaboards', 1),
('safari_cabin', 'safari', 'standard_cabin', 'Standard Cabin (Full Board)', 250.00, 'per_person_per_night', 'Public benchmark estimate, same sourcing caveat as Shared Cabin.', 'https://12knots.com/en/cabin-charters/destinations/indian-ocean/maldives/best-maldives-dive-safari/', 2),
('safari_cabin', 'safari', 'deluxe_cabin', 'Deluxe Cabin (Full Board)', 380.00, 'per_person_per_night', 'Public benchmark estimate — aggregator listings for mid/upper-tier Maldives liveaboards ranged roughly USD 240-650+/person/night. Needs supplier confirmation.', 'https://premierliveaboarddiving.com/destination/maldives', 3)
on conflict (category, stay_type, key) do nothing;

-- ============================================================
-- Transfers
-- ============================================================
insert into holiday_pricing_config (category, stay_type, key, label, price_usd, unit, source_note, sort_order) values
('transfer', null, 'shared_speedboat', 'Shared Speedboat', 25.00, 'per_person_per_way', 'Yuvi Blue Maldives, Himmafushi real contracted shared-transfer rate (the only real transfer rate this platform has for a local island). A different destination''s real shared-transfer price may differ — needs confirmation per request.', 1),
('transfer', null, 'private_speedboat', 'Private Speedboat (entire boat)', 250.00, 'per_boat_per_way', 'Site owner-specified rate: USD 250 each way for the entire private boat (not per person).', 2)
on conflict (category, stay_type, key) do nothing;
