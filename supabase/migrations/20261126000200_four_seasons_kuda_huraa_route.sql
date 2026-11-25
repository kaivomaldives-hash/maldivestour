-- New transfer route: Velana International Airport -> Four Seasons Resort Maldives at Kuda Huraa
-- (owner request, 2026-11-26; one of the owner's main money routes, missing on maldivestour.guide).
--
-- * Destination is the real island location 'kuda-huraa' (not a fake resort "island";
--   see 20250126000100_fix_fake_resort_islands.sql).
-- * Price and time come from the owner's sister site maldives-transfers.com:
--   shared speedboat, about 25 minutes, USD 100 per person (children 2-11 half price).
-- * Booking settings (provider, facilities, booking flags, private-inquiry option) are copied
--   from the working Club Med Kani route so the new route books the same way.
--
-- Safe to run more than once: every insert is guarded.

-- 1. The route page itself
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, published_at)
values (
  'transfer_route',
  'velana-international-airport-to-four-seasons-kuda-huraa',
  'Velana International Airport to Four Seasons Resort Maldives at Kuda Huraa',
  'Speedboat transfer from Velana International Airport to Four Seasons Resort Maldives at Kuda Huraa in North Malé Atoll, with meet and greet at arrivals.',
  'published',
  'Malé Airport to Four Seasons Kuda Huraa Transfer: Speedboat Guide',
  'How to get from Velana Airport to Four Seasons Resort Maldives at Kuda Huraa by speedboat: journey time, prices, private boats and meet & greet with Maldives Tour Guide.',
  now()
)
on conflict (node_type, slug) do nothing;

-- 2. Route: airport -> Kuda Huraa island, about 25 minutes
insert into transfer_routes (id, origin_location_id, destination_location_id, typical_duration_minutes)
select n.id, o.id, d.id, 25
from nodes n, nodes o, nodes d
where n.node_type = 'transfer_route' and n.slug = 'velana-international-airport-to-four-seasons-kuda-huraa'
  and o.node_type = 'location' and o.slug = 'velana-international-airport'
  and d.node_type = 'location' and d.slug = 'kuda-huraa'
on conflict do nothing;

-- 3. Shared speedboat service, copied from Club Med Kani's shared service
insert into transfer_services (
  route_id, provider_id, transfer_type, vehicle_type, shared_or_private, duration_minutes, price, currency,
  capacity, luggage_allowance, status, pickup_instructions, dropoff_instructions, booking_requirements,
  cancellation_policy, description, is_bookable, facilities
)
select
  fs.id, s.provider_id, s.transfer_type, s.vehicle_type, s.shared_or_private, 25, 100, s.currency,
  s.capacity, s.luggage_allowance, s.status, s.pickup_instructions, s.dropoff_instructions, s.booking_requirements,
  s.cancellation_policy,
  'Direct speedboat transfer service from Velana International Airport to Four Seasons Resort Maldives at Kuda Huraa Child price (ages 2-11): USD 50.',
  s.is_bookable, s.facilities
from transfer_services s
join nodes kani on kani.id = s.route_id
  and kani.node_type = 'transfer_route'
  and kani.slug = 'velana-international-airport-to-club-med-kani-maldives'
join nodes fs on fs.node_type = 'transfer_route' and fs.slug = 'velana-international-airport-to-four-seasons-kuda-huraa'
join transfer_routes fsr on fsr.id = fs.id
where s.shared_or_private = 'shared'
  and not exists (select 1 from transfer_services x where x.route_id = fs.id)
order by s.price
limit 1;

-- 4. Private-boat enquiry option (same setting as Club Med Kani, if it has one)
insert into bookable_products (id, booking_mode, base_price, currency, max_guests)
select fs.id, bp.booking_mode, bp.base_price, bp.currency, bp.max_guests
from bookable_products bp
join nodes kani on kani.id = bp.id
  and kani.node_type = 'transfer_route'
  and kani.slug = 'velana-international-airport-to-club-med-kani-maldives'
join nodes fs on fs.node_type = 'transfer_route' and fs.slug = 'velana-international-airport-to-four-seasons-kuda-huraa'
join transfer_routes fsr on fsr.id = fs.id
on conflict (id) do nothing;

-- 5. Same categories as Club Med Kani (resort / airport transfer links on the page)
insert into node_categories (node_id, category_id)
select fs.id, nc.category_id
from node_categories nc
join nodes kani on kani.id = nc.node_id
  and kani.node_type = 'transfer_route'
  and kani.slug = 'velana-international-airport-to-club-med-kani-maldives'
join nodes fs on fs.node_type = 'transfer_route' and fs.slug = 'velana-international-airport-to-four-seasons-kuda-huraa'
join transfer_routes fsr on fsr.id = fs.id
on conflict do nothing;
