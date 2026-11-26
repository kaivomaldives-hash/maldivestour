-- Owner's rule (26 Nov 2026): a private boat costs 4x the shared adult
-- price, per boat, one way, on every route. The site now shows that private
-- price automatically under each shared speedboat offer
-- (src/lib/bookings/transfer-price.ts, PRIVATE_BOAT_MULTIPLIER).
--
-- The old separate offers at USD 260 (Baros) and USD 302.44 (Gili
-- Lankanfushi) were seeded as "shared" and described as the resort's own
-- boat, so they showed as a second, much higher shared price. They are
-- retired (not deleted) so the rule is the only private price shown:
-- Baros private = 4 x 65 = 260, Gili Lankanfushi private = 4 x 75 = 300.
-- Matched by route + price (not by id) so this works on any copy of the DB.

update transfer_services set status = 'discontinued'
where route_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-baros')
  and price = 260;

update transfer_services set status = 'discontinued'
where route_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-lankanfushi')
  and price = 302.44;
