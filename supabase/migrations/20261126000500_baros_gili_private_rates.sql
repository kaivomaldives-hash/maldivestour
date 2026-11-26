-- The USD 260 (Baros) and USD 302.44 (Gili Lankanfushi) offers are the
-- owner's PRIVATE speedboat rates (per boat, one way), confirmed by the
-- owner on 2026-11-26. They were seeded as "shared" and described as the
-- resort's own boat, so the page showed two different "shared" prices.
-- Relabel them as private, sold by Maldives Tour Guide, with plain wording.
-- Matched by route + price (not by id) so this works on any copy of the DB.

update transfer_services ts set
  shared_or_private = 'private',
  provider_id = (select id from nodes where node_type = 'provider' and slug = 'maldives-tour-guide-transfers'),
  is_bookable = true,
  description = 'Private speedboat from Velana International Airport to Baros, just for your group. Price is for the whole boat, one way. About 25 minutes.',
  pickup_instructions = 'Our team meets you at the arrivals hall of Velana International Airport, timed to your flight.',
  dropoff_instructions = 'Baros jetty, Baros island, Kaafu Atoll.',
  booking_requirements = 'Send your flight number and arrival time when you book.'
where ts.route_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-baros')
  and ts.price = 260;

update transfer_services ts set
  shared_or_private = 'private',
  provider_id = (select id from nodes where node_type = 'provider' and slug = 'maldives-tour-guide-transfers'),
  is_bookable = true,
  description = 'Private speedboat from Velana International Airport to Gili Lankanfushi, just for your group. Price is for the whole boat, one way. About 30 minutes.',
  pickup_instructions = 'Our team meets you at the arrivals hall of Velana International Airport, timed to your flight.',
  dropoff_instructions = 'Gili Lankanfushi jetty, Lankanfushi island, North Malé Atoll.',
  booking_requirements = 'Send your flight number and arrival time when you book.'
where ts.route_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-lankanfushi')
  and ts.price = 302.44;
