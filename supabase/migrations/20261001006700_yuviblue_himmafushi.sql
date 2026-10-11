-- New partner onboarding: Yuvi Blue Maldives, a 17-room guesthouse on
-- Himmafushi (K. Atoll / North Malé Atoll), its real excursion/watersports
-- rate card, and 9 packages built from the partner's own 2026/2027 B2B
-- rate contract.
--
-- Every price in this file is the partner's own "Agent Net" rate with a
-- flat 15% markup applied before listing publicly, per the site owner's
-- instruction and per the contract's own clause ("the Agent agrees to
-- markup on the contract rates by a minimum of 15%"). Net figures are
-- recorded in each row's comment for audit; only the marked-up figure is
-- ever stored/shown.
--
-- Source: the partner's own PARTNER CONTRACT.pdf (room rates, transfer
-- rates), the "Excursions & Watersports" rate card image, and 7 draft
-- package flyers (4 single-experience 3/5-night packages, 3 five-night
-- "combo" packages) — all supplied directly by the site owner. Two of the
-- 7 draft flyers ("Middle East Package" and "Maldives Serenity Escape")
-- were byte-for-byte identical content under two different names; only
-- one is listed here (as "Himmafushi Serenity Escape", the better-named
-- and dated of the two) to avoid publishing duplicate content.
--
-- The 2 new custom day-by-day packages (4-night, 5-night) are this
-- migration's own design, built from the real excursion rate card per the
-- site owner's request — never copied from the partner's own flyers.

-- ============================================================
-- Provider
-- ============================================================
insert into nodes (node_type, slug, title, summary, status, published_at)
values ('provider', 'yuvi-blue-maldives', 'Yuvi Blue Maldives', 'Yuvi Blue Maldives operates a 17-room guesthouse and its own excursion and watersports desk on Himmafushi, K. Atoll (North Malé Atoll).', 'published', now())
on conflict (node_type, slug) do nothing;

insert into providers (id, contact_email, contact_phone, legal_name, is_verified)
select id, 'reservations@yuviblue.com', '+960 9299302', 'Yuvi Blue', true
from nodes where node_type = 'provider' and slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

-- ============================================================
-- Accommodation
-- ============================================================
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'accommodation', 'yuvi-blue-maldives-himmafushi', 'Yuvi Blue Maldives',
  'Yuvi Blue Maldives is a 17-room guesthouse on Himmafushi, K. Atoll — a 20-minute speedboat transfer from Malé — offering Deluxe Double/Twin and Deluxe Family rooms, an on-site restaurant and spa, and its own excursion and watersports desk covering snorkeling, fishing, surfing and more around North Malé Atoll.',
  'published',
  'Yuvi Blue Maldives, Himmafushi | Guesthouses | MTG',
  'Yuvi Blue Maldives is a 17-room guesthouse on Himmafushi, K. Atoll, a 20-minute speedboat transfer from Male, with its own excursion and watersports desk.',
  now()
)
on conflict (node_type, slug) do nothing;

-- price_from: cheapest real room/meal-plan combo, Deluxe Double/Twin Bed &
-- Breakfast (net USD 70/night -> USD 80.50 at +15%).
insert into accommodations (id, accommodation_type, operated_by_provider_id, room_count, price_from, currency)
select n.id, 'guesthouse', p.id, 17, 80.50, 'USD'
from nodes n, nodes p
where n.node_type = 'accommodation' and n.slug = 'yuvi-blue-maldives-himmafushi'
  and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'yuvi-blue-maldives-himmafushi'
  and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi'
on conflict (id) do nothing;

-- Rooms: the partner's 2026/2027 "Agent Net" rate card has 2 room
-- categories x 3 meal plans each (net USD, then +15%):
--   Deluxe Double/Twin: BB $70->$80.50, HB $90->$103.50, FB $110->$126.50
--   Deluxe Family:      BB $80->$92.00, HB $120->$138.00, FB $160->$184.00
-- The admin's own occupancy table additionally names a "YUVi triple room"
-- and "YUVi deluxe twin room" with no separate rate row of their own —
-- mapped to the Family and Double/Twin rates respectively (occupancy and
-- room class both match), noted here since it's this migration's own
-- inference, not stated outright in the source documents.
insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Double/Twin Room - Bed & Breakfast', 80.50, 'USD', 'Double/Twin', 2, 0
from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Double/Twin Room - Half Board', 103.50, 'USD', 'Double/Twin', 2, 1
from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Double/Twin Room - Full Board', 126.50, 'USD', 'Double/Twin', 2, 2
from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Family Room - Bed & Breakfast', 92.00, 'USD', 'Family', 3, 3
from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Family Room - Half Board', 138.00, 'USD', 'Family', 3, 4
from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Family Room - Full Board', 184.00, 'USD', 'Family', 3, 5
from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi'
on conflict (accommodation_id, name) do nothing;

-- ============================================================
-- Activities: the partner's real excursion + watersports rate card
-- (net USD, then +15%). Every item requires a minimum of 2 guests per
-- the rate card's own header, noted in each summary. Watersports with
-- more than one duration tier store the CHEAPEST tier as price_from (a
-- genuine "from" price), with the other tier(s) named in the summary.
-- ============================================================

-- Fishing Trip (1-2 Hours) — net $60 -> $69.00
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-fishing-trip', 'Himmafushi Fishing Trip', 'Himmafushi Fishing Trip is a 1-2 hour local fishing trip from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 69 per person (minimum 2 guests).', 'published', 'Himmafushi Fishing Trip | Maldives Fishing | MTG', 'Himmafushi Fishing Trip is a 1-2 hour local fishing trip from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 69 per person (minimum 2 guests).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'fishing', p.id, 90, 69.00, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-fishing-trip' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-fishing-trip' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 69.00, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-fishing-trip'
on conflict (id) do nothing;

-- Snorkeling Trip to Shark Point — net $55 -> $63.25
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-snorkeling-shark-point', 'Snorkeling Trip to Shark Point', 'Snorkeling Trip to Shark Point is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 63.25 per person (minimum 2 guests).', 'published', 'Snorkeling Trip to Shark Point, Himmafushi | Maldives Activities | MTG', 'Snorkeling Trip to Shark Point is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 63.25 per person (minimum 2 guests).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'excursion', p.id, null, 63.25, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-shark-point' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-shark-point' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 63.25, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-snorkeling-shark-point'
on conflict (id) do nothing;

-- Snorkeling Trip to Turtle Point — net $45 -> $51.75
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-snorkeling-turtle-point', 'Snorkeling Trip to Turtle Point', 'Snorkeling Trip to Turtle Point is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 51.75 per person (minimum 2 guests).', 'published', 'Snorkeling Trip to Turtle Point, Himmafushi | Maldives Activities | MTG', 'Snorkeling Trip to Turtle Point is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 51.75 per person (minimum 2 guests).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'excursion', p.id, null, 51.75, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-turtle-point' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-turtle-point' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 51.75, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-snorkeling-turtle-point'
on conflict (id) do nothing;

-- Snorkeling Trip to Sting Ray Point — net $50 -> $57.50
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-snorkeling-sting-ray-point', 'Snorkeling Trip to Sting Ray Point', 'Snorkeling Trip to Sting Ray Point is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 57.50 per person (minimum 2 guests).', 'published', 'Snorkeling Trip to Sting Ray Point, Himmafushi | Maldives Activities | MTG', 'Snorkeling Trip to Sting Ray Point is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 57.50 per person (minimum 2 guests).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'excursion', p.id, null, 57.50, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-sting-ray-point' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-sting-ray-point' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 57.50, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-snorkeling-sting-ray-point'
on conflict (id) do nothing;

-- Snorkeling Trip to Coral Garden — net $40 -> $46.00
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-snorkeling-coral-garden', 'Snorkeling Trip to Coral Garden', 'Snorkeling Trip to Coral Garden is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 46 per person (minimum 2 guests).', 'published', 'Snorkeling Trip to Coral Garden, Himmafushi | Maldives Activities | MTG', 'Snorkeling Trip to Coral Garden is a guided snorkeling excursion from Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 46 per person (minimum 2 guests).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'excursion', p.id, null, 46.00, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-coral-garden' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-coral-garden' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 46.00, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-snorkeling-coral-garden'
on conflict (id) do nothing;

-- Snorkeling Gear Rental — net $15 -> $17.25 (a rental, not a trip)
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-snorkeling-gear-rental', 'Snorkeling Gear Rental', 'Snorkeling Gear Rental from Yuvi Blue Maldives, Himmafushi, K. Atoll. From USD 17.25 per person.', 'published', 'Snorkeling Gear Rental, Himmafushi | Maldives Activities | MTG', 'Snorkeling Gear Rental from Yuvi Blue Maldives, Himmafushi, K. Atoll. From USD 17.25 per person.', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'excursion', p.id, null, 17.25, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-gear-rental' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-snorkeling-gear-rental' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 17.25, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-snorkeling-gear-rental'
on conflict (id) do nothing;

-- Surf Lesson — net $60 -> $69.00
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-surf-lesson', 'Surf Lesson at Himmafushi', 'Surf Lesson at Himmafushi, K. Atoll, run by Yuvi Blue Maldives, close to the North Male Atoll breaks of Jailbreaks, Sultans and Honkys. From USD 69 per person (minimum 2 guests).', 'published', 'Surf Lesson at Himmafushi | Maldives Surfing | MTG', 'Surf Lesson at Himmafushi, K. Atoll, run by Yuvi Blue Maldives, close to the North Male Atoll breaks of Jailbreaks, Sultans and Honkys. From USD 69 per person (minimum 2 guests).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'surfing', p.id, null, 69.00, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-surf-lesson' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-surf-lesson' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 69.00, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-surf-lesson'
on conflict (id) do nothing;

-- Jet Ski — net 30min $80/1hr $120 -> $92.00/$138.00 (price_from = cheaper 30min tier)
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-jet-ski', 'Jet Ski at Himmafushi', 'Jet Ski at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 92 per person for 30 minutes (USD 138 for 1 hour).', 'published', 'Jet Ski at Himmafushi | Maldives Watersports | MTG', 'Jet Ski at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 92 per person for 30 minutes (USD 138 for 1 hour).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'watersports', p.id, 30, 92.00, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-jet-ski' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-jet-ski' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 92.00, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-jet-ski'
on conflict (id) do nothing;

-- Water Skiing — net 30min $70/1hr $120 -> $80.50/$138.00
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-water-skiing', 'Water Skiing at Himmafushi', 'Water Skiing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 80.50 per person for 30 minutes (USD 138 for 1 hour).', 'published', 'Water Skiing at Himmafushi | Maldives Watersports | MTG', 'Water Skiing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 80.50 per person for 30 minutes (USD 138 for 1 hour).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'watersports', p.id, 30, 80.50, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-water-skiing' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-water-skiing' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 80.50, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-water-skiing'
on conflict (id) do nothing;

-- Fun Tube — net 15min $35/30min $50/1hr $120 -> $40.25/$57.50/$138.00
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-fun-tube', 'Fun Tube Ride at Himmafushi', 'Fun Tube Ride at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 40.25 per person for 15 minutes (USD 57.50 for 30 minutes, USD 138 for 1 hour).', 'published', 'Fun Tube Ride at Himmafushi | Maldives Watersports | MTG', 'Fun Tube Ride at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 40.25 per person for 15 minutes (USD 57.50 for 30 minutes, USD 138 for 1 hour).', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'watersports', p.id, 15, 40.25, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-fun-tube' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-fun-tube' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 40.25, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-fun-tube'
on conflict (id) do nothing;

-- Wind Surfing — net 1hr $70 -> $80.50 (only tier)
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-wind-surfing', 'Wind Surfing at Himmafushi', 'Wind Surfing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 80.50 per person for 1 hour.', 'published', 'Wind Surfing at Himmafushi | Maldives Watersports | MTG', 'Wind Surfing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 80.50 per person for 1 hour.', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'watersports', p.id, 60, 80.50, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-wind-surfing' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-wind-surfing' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 80.50, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-wind-surfing'
on conflict (id) do nothing;

-- Canoeing — net 1hr $18 -> $20.70
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-canoeing', 'Canoeing at Himmafushi', 'Canoeing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 20.70 per person for 1 hour.', 'published', 'Canoeing at Himmafushi | Maldives Watersports | MTG', 'Canoeing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 20.70 per person for 1 hour.', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'watersports', p.id, 60, 20.70, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-canoeing' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-canoeing' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 20.70, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-canoeing'
on conflict (id) do nothing;

-- Stand Up Paddleboarding — net 1hr $18 -> $20.70
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-stand-up-paddle', 'Stand Up Paddleboarding at Himmafushi', 'Stand Up Paddleboarding at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 20.70 per person for 1 hour.', 'published', 'Stand Up Paddleboarding at Himmafushi | Maldives Watersports | MTG', 'Stand Up Paddleboarding at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 20.70 per person for 1 hour.', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'watersports', p.id, 60, 20.70, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-stand-up-paddle' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-stand-up-paddle' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 20.70, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-stand-up-paddle'
on conflict (id) do nothing;

-- Parasailing — net 15min $120 -> $138.00 (only tier)
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values ('activity', 'himmafushi-parasailing', 'Parasailing at Himmafushi', 'Parasailing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 138 per person for 15 minutes.', 'published', 'Parasailing at Himmafushi | Maldives Watersports | MTG', 'Parasailing at Himmafushi, K. Atoll, run by Yuvi Blue Maldives. From USD 138 per person for 15 minutes.', now())
on conflict (node_type, slug) do nothing;

insert into activities (id, activity_category, operated_by_provider_id, duration_minutes, price_from, currency, max_participants)
select n.id, 'watersports', p.id, 15, 138.00, 'USD', null
from nodes n, nodes p where n.node_type = 'activity' and n.slug = 'himmafushi-parasailing' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'activity' and n.slug = 'himmafushi-parasailing' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 138.00, 'USD' from nodes where node_type = 'activity' and slug = 'himmafushi-parasailing'
on conflict (id) do nothing;

-- ============================================================
-- Packages A: the partner's 4 single-experience draft packages (5-night
-- x3, 3-night x1) — each is one of the partner's own bundled "Agency
-- Package Total" net figures, +15%. Priced per person (2 guests sharing
-- a Deluxe Double/Twin room), consistent with every other package on
-- this site.
-- ============================================================

-- Himmafushi Stingray Snorkeling Package: net $580 (5N room+transfer) -> $667.00
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', 'himmafushi-stingray-snorkeling-package', 'Himmafushi Stingray Snorkeling Package',
  'Himmafushi Stingray Snorkeling Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a complimentary wellness yoga class, a beach honeymoon dinner, and Stingray Point snorkeling. From USD 667 per person (2 guests sharing a Deluxe Double/Twin room).',
  'published',
  'Himmafushi Stingray Snorkeling Package | Maldives Packages | MTG',
  'Himmafushi Stingray Snorkeling Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and Stingray Point snorkeling. From USD 667 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 5, 667.00, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = 'himmafushi-stingray-snorkeling-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 667.00, 'USD' from nodes where node_type = 'package' and slug = 'himmafushi-stingray-snorkeling-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = 'himmafushi-stingray-snorkeling-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 5, 5, 'Yuvi Blue Maldives, Himmafushi', '5 nights at Yuvi Blue Maldives, Himmafushi, Bed & Breakfast. Return speedboat transfer from Male/Velana International Airport included. Includes a complimentary 1-hour wellness yoga class, a beach honeymoon dinner, and Stingray Point snorkeling.', 1
from nodes where node_type = 'package' and slug = 'himmafushi-stingray-snorkeling-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e01'::uuid, s.id, 'node', comp.id, 'accommodation', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = 'himmafushi-stingray-snorkeling-package' and s.stage_number = 1
on conflict (id) do nothing;

-- Himmafushi Sunset Fishing Package: net $590 (5N room+transfer) -> $678.50
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', 'himmafushi-sunset-fishing-package', 'Himmafushi Sunset Fishing Package',
  'Himmafushi Sunset Fishing Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a complimentary wellness yoga class, a beach honeymoon dinner, and sunset fishing. From USD 678.50 per person (2 guests sharing a Deluxe Double/Twin room).',
  'published',
  'Himmafushi Sunset Fishing Package | Maldives Fishing Packages | MTG',
  'Himmafushi Sunset Fishing Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and sunset fishing. From USD 678.50 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 5, 678.50, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = 'himmafushi-sunset-fishing-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 678.50, 'USD' from nodes where node_type = 'package' and slug = 'himmafushi-sunset-fishing-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = 'himmafushi-sunset-fishing-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into node_categories (node_id, category_id)
select n.id, c.id from nodes n, nodes c where n.node_type = 'package' and n.slug = 'himmafushi-sunset-fishing-package' and c.node_type = 'category' and c.slug = 'fishing'
on conflict (node_id, category_id) do nothing;

insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 5, 5, 'Yuvi Blue Maldives, Himmafushi', '5 nights at Yuvi Blue Maldives, Himmafushi, Bed & Breakfast. Return speedboat transfer from Male/Velana International Airport included. Includes a complimentary 1-hour wellness yoga class, a beach honeymoon dinner, and a sunset fishing trip.', 1
from nodes where node_type = 'package' and slug = 'himmafushi-sunset-fishing-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e02'::uuid, s.id, 'node', comp.id, 'accommodation', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = 'himmafushi-sunset-fishing-package' and s.stage_number = 1
on conflict (id) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e03'::uuid, s.id, 'node', comp.id, 'activity', 1, 1
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-fishing-trip'
where p.node_type = 'package' and p.slug = 'himmafushi-sunset-fishing-package' and s.stage_number = 1
on conflict (id) do nothing;

-- Himmafushi Nurse Shark Point Package: net $600 (5N room+transfer) -> $690.00
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', 'himmafushi-nurse-shark-point-package', 'Himmafushi Nurse Shark Point Package',
  'Himmafushi Nurse Shark Point Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a beach honeymoon dinner, and a Nurse Shark Point excursion. From USD 690 per person (2 guests sharing a Deluxe Double/Twin room).',
  'published',
  'Himmafushi Nurse Shark Point Package | Maldives Packages | MTG',
  'Himmafushi Nurse Shark Point Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and a Nurse Shark Point excursion. From USD 690 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 5, 690.00, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = 'himmafushi-nurse-shark-point-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 690.00, 'USD' from nodes where node_type = 'package' and slug = 'himmafushi-nurse-shark-point-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = 'himmafushi-nurse-shark-point-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 5, 5, 'Yuvi Blue Maldives, Himmafushi', '5 nights at Yuvi Blue Maldives, Himmafushi, Bed & Breakfast. Return speedboat transfer from Male/Velana International Airport included. Includes a beach honeymoon dinner and a Nurse Shark Point excursion.', 1
from nodes where node_type = 'package' and slug = 'himmafushi-nurse-shark-point-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e04'::uuid, s.id, 'node', comp.id, 'accommodation', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = 'himmafushi-nurse-shark-point-package' and s.stage_number = 1
on conflict (id) do nothing;

-- Himmafushi Serenity Escape: net $540 (3N room+transfer) -> $621.00
-- (the partner's "Middle East Package" flyer was identical content under
-- a different name — not separately listed, see migration header note)
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', 'himmafushi-serenity-escape', 'Himmafushi Serenity Escape',
  'Himmafushi Serenity Escape is a 3-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a complimentary wellness yoga class, a beach honeymoon dinner, a sunset cruise, a 30-minute spa massage, and Turtle Point snorkeling. From USD 621 per person (2 guests sharing a Deluxe Double/Twin room). Valid for stays from 15 October 2026 to 31 August 2027.',
  'published',
  'Himmafushi Serenity Escape | Maldives Packages | MTG',
  'Himmafushi Serenity Escape is a 3-night stay at Yuvi Blue Maldives, Himmafushi, with a sunset cruise, spa massage and Turtle Point snorkeling. From USD 621 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 3, 621.00, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = 'himmafushi-serenity-escape' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 621.00, 'USD' from nodes where node_type = 'package' and slug = 'himmafushi-serenity-escape'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = 'himmafushi-serenity-escape' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 3, 3, 'Yuvi Blue Maldives, Himmafushi', '3 nights at Yuvi Blue Maldives, Himmafushi, Bed & Breakfast. Return speedboat transfer from Male/Velana International Airport included. Day 1: sunset cruise. Day 2: 30-minute spa massage and 1-hour wellness yoga class. Day 3: Turtle Point snorkeling and a beach honeymoon dinner.', 1
from nodes where node_type = 'package' and slug = 'himmafushi-serenity-escape'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e05'::uuid, s.id, 'node', comp.id, 'accommodation', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = 'himmafushi-serenity-escape' and s.stage_number = 1
on conflict (id) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e06'::uuid, s.id, 'node', comp.id, 'activity', 1, 1
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-snorkeling-turtle-point'
where p.node_type = 'package' and p.slug = 'himmafushi-serenity-escape' and s.stage_number = 1
on conflict (id) do nothing;

-- ============================================================
-- Packages B: the partner's 3 draft "combo" packages, 5 nights each,
-- quoted per couple in the source flyer (net $569/$549/$529 per couple).
-- Stored per-person (divided by 2, 2 guests sharing one room), +15%,
-- consistent with every other package on this site — the source per-
-- couple total is kept in each summary for transparency.
-- ============================================================

-- Himmafushi Island Bliss Package: net $569/couple -> $654.35/couple -> $327.18/person
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', 'himmafushi-island-bliss-package', 'Himmafushi Island Bliss Package',
  'Himmafushi Island Bliss Package is a 5-night Half Board stay at Yuvi Blue Maldives, Himmafushi, including return speedboat transfer, a day visit to a nearby resort (welcome drink, buffet lunch, pool and beach access), a beach candlelight dinner, and morning yoga. From USD 327.18 per person (USD 654.35 per couple, 2 guests sharing a Deluxe Double/Twin room).',
  'published',
  'Himmafushi Island Bliss Package | Maldives Packages | MTG',
  'Himmafushi Island Bliss Package is a 5-night Half Board stay at Yuvi Blue Maldives, Himmafushi, with a resort day visit and candlelight dinner. From USD 327.18 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 5, 327.18, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = 'himmafushi-island-bliss-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 327.18, 'USD' from nodes where node_type = 'package' and slug = 'himmafushi-island-bliss-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = 'himmafushi-island-bliss-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 5, 5, 'Yuvi Blue Maldives, Himmafushi', '5 nights at Yuvi Blue Maldives, Himmafushi, Half Board. Return speedboat transfer from Male/Velana International Airport included, plus a Himmafushi-Dhonveli roundtrip speedboat for the resort day visit. Includes a day visit to a nearby resort (welcome drink, buffet lunch, pool and beach access), a beach candlelight dinner, and morning yoga.', 1
from nodes where node_type = 'package' and slug = 'himmafushi-island-bliss-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e07'::uuid, s.id, 'node', comp.id, 'accommodation', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = 'himmafushi-island-bliss-package' and s.stage_number = 1
on conflict (id) do nothing;

-- Himmafushi Ocean Wonders Package: net $549/couple -> $631.35/couple -> $315.68/person
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', 'himmafushi-ocean-wonders-package', 'Himmafushi Ocean Wonders Package',
  'Himmafushi Ocean Wonders Package is a 5-night Bed & Breakfast stay at Yuvi Blue Maldives, Himmafushi, including return speedboat transfer, Turtle Point snorkeling, a sandbank visit with lunch, snorkeling gear, water and soft drinks, and photography. From USD 315.68 per person (USD 631.35 per couple, 2 guests sharing a Deluxe Double/Twin room).',
  'published',
  'Himmafushi Ocean Wonders Package | Maldives Packages | MTG',
  'Himmafushi Ocean Wonders Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with Turtle Point snorkeling and a sandbank picnic. From USD 315.68 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 5, 315.68, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = 'himmafushi-ocean-wonders-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 315.68, 'USD' from nodes where node_type = 'package' and slug = 'himmafushi-ocean-wonders-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = 'himmafushi-ocean-wonders-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 5, 5, 'Yuvi Blue Maldives, Himmafushi', '5 nights at Yuvi Blue Maldives, Himmafushi, Bed & Breakfast. Return speedboat transfer from Male/Velana International Airport included. Includes Turtle Point snorkeling, a sandbank visit with lunch, snorkeling gear, water and soft drinks, and photography.', 1
from nodes where node_type = 'package' and slug = 'himmafushi-ocean-wonders-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e08'::uuid, s.id, 'node', comp.id, 'accommodation', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = 'himmafushi-ocean-wonders-package' and s.stage_number = 1
on conflict (id) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e09'::uuid, s.id, 'node', comp.id, 'activity', 1, 1
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-snorkeling-turtle-point'
where p.node_type = 'package' and p.slug = 'himmafushi-ocean-wonders-package' and s.stage_number = 1
on conflict (id) do nothing;

-- Himmafushi Rejuvenate & Explore Package: net $529/couple -> $608.35/couple -> $304.18/person
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', 'himmafushi-rejuvenate-explore-package', 'Himmafushi Rejuvenate & Explore Package',
  'Himmafushi Rejuvenate & Explore Package is a 5-night Bed & Breakfast stay at Yuvi Blue Maldives, Himmafushi, including return speedboat transfer, a 30-minute spa massage, a wellness yoga class, a choice of dolphin watching or a sunset cruise, snorkeling gear, and photography. From USD 304.18 per person (USD 608.35 per couple, 2 guests sharing a Deluxe Double/Twin room).',
  'published',
  'Himmafushi Rejuvenate & Explore Package | Maldives Packages | MTG',
  'Himmafushi Rejuvenate & Explore Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with spa, yoga and a dolphin or sunset cruise. From USD 304.18 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 5, 304.18, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = 'himmafushi-rejuvenate-explore-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 304.18, 'USD' from nodes where node_type = 'package' and slug = 'himmafushi-rejuvenate-explore-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = 'himmafushi-rejuvenate-explore-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 5, 5, 'Yuvi Blue Maldives, Himmafushi', '5 nights at Yuvi Blue Maldives, Himmafushi, Bed & Breakfast. Return speedboat transfer from Male/Velana International Airport included. Includes a 30-minute spa massage, a wellness yoga class, a choice of dolphin watching or a sunset cruise, snorkeling gear, and photography.', 1
from nodes where node_type = 'package' and slug = 'himmafushi-rejuvenate-explore-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select '9b1c1a9e-5a2a-4a1a-9c3a-1a2b3c4d5e10'::uuid, s.id, 'node', comp.id, 'accommodation', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = 'himmafushi-rejuvenate-explore-package' and s.stage_number = 1
on conflict (id) do nothing;

-- ============================================================
-- Packages C: 2 new custom day-by-day packages (this migration's own
-- design, per the site owner's request), built entirely from the real
-- excursion rate card, +15%, one real activity per day. Priced per
-- person (2 guests sharing a Deluxe Double/Twin Bed & Breakfast room).
-- ============================================================

-- 4-Night Himmafushi Explorer Package
-- Room: 4 x $80.50 / 2 people = $161.00 | Transfer: $57.50
-- Day1 Turtle Point $51.75 + Day2 Fishing Trip $69.00 + Day3 Stand Up
-- Paddle $20.70 + Day4 Jet Ski (30min) $92.00 = $233.45
-- Total per person: 161.00 + 57.50 + 233.45 = $451.95
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', '4-night-himmafushi-explorer-package', '4-Night Himmafushi Explorer Package',
  '4-Night Himmafushi Explorer Package is a 4-night Bed & Breakfast stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and a different real excursion each day: Turtle Point snorkeling, a local fishing trip, stand up paddleboarding, and jet skiing. From USD 451.95 per person (2 guests sharing a Deluxe Double/Twin room).',
  'published',
  '4-Night Himmafushi Explorer Package | Maldives Packages | MTG',
  '4-Night Himmafushi Explorer Package: Yuvi Blue Maldives, Himmafushi, with snorkeling, fishing, paddleboarding and jet skiing, one per day. From USD 451.95 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 4, 451.95, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = '4-night-himmafushi-explorer-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 451.95, 'USD' from nodes where node_type = 'package' and slug = '4-night-himmafushi-explorer-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = '4-night-himmafushi-explorer-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

-- Day 1: arrival + accommodation (for the whole stay) + Turtle Point snorkeling
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 1, 1, 'Day 1 — Arrival & Turtle Point Snorkeling', 'Arrive at Yuvi Blue Maldives, Himmafushi (return speedboat transfer from Male/Velana International Airport included). Check in, then a Turtle Point snorkeling trip.', 1
from nodes where node_type = 'package' and slug = '4-night-himmafushi-explorer-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, notes, sort_order)
select 'c1e1a111-0001-4a1a-9c3a-4e4e4e4e4e01'::uuid, s.id, 'node', comp.id, 'accommodation', 1, '4 nights, Bed & Breakfast', 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = '4-night-himmafushi-explorer-package' and s.stage_number = 1
on conflict (id) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0001-4a1a-9c3a-4e4e4e4e4e02'::uuid, s.id, 'node', comp.id, 'activity', 1, 1
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-snorkeling-turtle-point'
where p.node_type = 'package' and p.slug = '4-night-himmafushi-explorer-package' and s.stage_number = 1
on conflict (id) do nothing;

-- Day 2: fishing trip
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 2, 2, 2, 1, 'Day 2 — Fishing Trip', 'A 1-2 hour local fishing trip from Himmafushi.', 2
from nodes where node_type = 'package' and slug = '4-night-himmafushi-explorer-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0001-4a1a-9c3a-4e4e4e4e4e03'::uuid, s.id, 'node', comp.id, 'activity', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-fishing-trip'
where p.node_type = 'package' and p.slug = '4-night-himmafushi-explorer-package' and s.stage_number = 2
on conflict (id) do nothing;

-- Day 3: stand up paddleboarding
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 3, 3, 3, 1, 'Day 3 — Stand Up Paddleboarding', 'A relaxed 1-hour stand up paddleboarding session off Himmafushi.', 3
from nodes where node_type = 'package' and slug = '4-night-himmafushi-explorer-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0001-4a1a-9c3a-4e4e4e4e4e04'::uuid, s.id, 'node', comp.id, 'activity', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-stand-up-paddle'
where p.node_type = 'package' and p.slug = '4-night-himmafushi-explorer-package' and s.stage_number = 3
on conflict (id) do nothing;

-- Day 4: jet ski + departure
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 4, 4, 4, 1, 'Day 4 — Jet Ski & Departure', 'A 30-minute jet ski session, then return speedboat transfer to Male/Velana International Airport.', 4
from nodes where node_type = 'package' and slug = '4-night-himmafushi-explorer-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0001-4a1a-9c3a-4e4e4e4e4e05'::uuid, s.id, 'node', comp.id, 'activity', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-jet-ski'
where p.node_type = 'package' and p.slug = '4-night-himmafushi-explorer-package' and s.stage_number = 4
on conflict (id) do nothing;

-- 5-Night Himmafushi Adventure Package
-- Room: 5 x $80.50 / 2 people = $201.25 | Transfer: $57.50
-- Day1 Coral Garden $46.00 + Day2 Sting Ray Point $57.50 + Day3 Surf
-- Lesson $69.00 + Day4 Parasailing $138.00 + Day5 Fun Tube (15min) $40.25
-- = $350.75
-- Total per person: 201.25 + 57.50 + 350.75 = $609.50
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'package', '5-night-himmafushi-adventure-package', '5-Night Himmafushi Adventure Package',
  '5-Night Himmafushi Adventure Package is a 5-night Bed & Breakfast stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and a different real excursion each day: Coral Garden snorkeling, Sting Ray Point snorkeling, a surf lesson, parasailing, and a fun tube ride. From USD 609.50 per person (2 guests sharing a Deluxe Double/Twin room).',
  'published',
  '5-Night Himmafushi Adventure Package | Maldives Packages | MTG',
  '5-Night Himmafushi Adventure Package: Yuvi Blue Maldives, Himmafushi, with snorkeling, surfing, parasailing and a fun tube ride, one per day. From USD 609.50 per person.',
  now()
)
on conflict (node_type, slug) do nothing;

insert into packages (id, duration_nights, price_from, currency, operated_by_provider_id)
select n.id, 5, 609.50, 'USD', p.id from nodes n, nodes p where n.node_type = 'package' and n.slug = '5-night-himmafushi-adventure-package' and p.node_type = 'provider' and p.slug = 'yuvi-blue-maldives'
on conflict (id) do nothing;

insert into bookable_products (id, booking_mode, base_price, currency)
select id, 'inquiry', 609.50, 'USD' from nodes where node_type = 'package' and slug = '5-night-himmafushi-adventure-package'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary' from nodes n, nodes l where n.node_type = 'package' and n.slug = '5-night-himmafushi-adventure-package' and l.node_type = 'location' and l.slug = 'himmafushi'
on conflict (node_id, location_id) do nothing;

-- Day 1: arrival + accommodation (for the whole stay) + Coral Garden snorkeling
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 1, 1, 1, 1, 'Day 1 — Arrival & Coral Garden Snorkeling', 'Arrive at Yuvi Blue Maldives, Himmafushi (return speedboat transfer from Male/Velana International Airport included). Check in, then a Coral Garden snorkeling trip.', 1
from nodes where node_type = 'package' and slug = '5-night-himmafushi-adventure-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, notes, sort_order)
select 'c1e1a111-0002-4a1a-9c3a-4e4e4e4e4e01'::uuid, s.id, 'node', comp.id, 'accommodation', 1, '5 nights, Bed & Breakfast', 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'accommodation' and comp.slug = 'yuvi-blue-maldives-himmafushi'
where p.node_type = 'package' and p.slug = '5-night-himmafushi-adventure-package' and s.stage_number = 1
on conflict (id) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0002-4a1a-9c3a-4e4e4e4e4e02'::uuid, s.id, 'node', comp.id, 'activity', 1, 1
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-snorkeling-coral-garden'
where p.node_type = 'package' and p.slug = '5-night-himmafushi-adventure-package' and s.stage_number = 1
on conflict (id) do nothing;

-- Day 2: Sting Ray Point snorkeling
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 2, 2, 2, 1, 'Day 2 — Sting Ray Point Snorkeling', 'A guided snorkeling trip to Sting Ray Point.', 2
from nodes where node_type = 'package' and slug = '5-night-himmafushi-adventure-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0002-4a1a-9c3a-4e4e4e4e4e03'::uuid, s.id, 'node', comp.id, 'activity', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-snorkeling-sting-ray-point'
where p.node_type = 'package' and p.slug = '5-night-himmafushi-adventure-package' and s.stage_number = 2
on conflict (id) do nothing;

-- Day 3: surf lesson
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 3, 3, 3, 1, 'Day 3 — Surf Lesson', 'A surf lesson close to the North Male Atoll breaks of Jailbreaks, Sultans and Honkys.', 3
from nodes where node_type = 'package' and slug = '5-night-himmafushi-adventure-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0002-4a1a-9c3a-4e4e4e4e4e04'::uuid, s.id, 'node', comp.id, 'activity', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-surf-lesson'
where p.node_type = 'package' and p.slug = '5-night-himmafushi-adventure-package' and s.stage_number = 3
on conflict (id) do nothing;

-- Day 4: parasailing
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 4, 4, 4, 1, 'Day 4 — Parasailing', 'A 15-minute parasailing flight off Himmafushi.', 4
from nodes where node_type = 'package' and slug = '5-night-himmafushi-adventure-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0002-4a1a-9c3a-4e4e4e4e4e05'::uuid, s.id, 'node', comp.id, 'activity', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-parasailing'
where p.node_type = 'package' and p.slug = '5-night-himmafushi-adventure-package' and s.stage_number = 4
on conflict (id) do nothing;

-- Day 5: fun tube + departure
insert into package_itinerary_stages (package_id, stage_number, day_start, day_end, night_count, title, description, sort_order)
select id, 5, 5, 5, 1, 'Day 5 — Fun Tube & Departure', 'A 15-minute fun tube ride, then return speedboat transfer to Male/Velana International Airport.', 5
from nodes where node_type = 'package' and slug = '5-night-himmafushi-adventure-package'
on conflict (package_id, stage_number) do nothing;

insert into package_itinerary_items (id, stage_id, component_type, component_node_id, component_role, quantity, sort_order)
select 'c1e1a111-0002-4a1a-9c3a-4e4e4e4e4e06'::uuid, s.id, 'node', comp.id, 'activity', 1, 0
from package_itinerary_stages s join nodes p on p.id = s.package_id join nodes comp on comp.node_type = 'activity' and comp.slug = 'himmafushi-fun-tube'
where p.node_type = 'package' and p.slug = '5-night-himmafushi-adventure-package' and s.stage_number = 5
on conflict (id) do nothing;
