-- Fix the existing Four Seasons Kuda Huraa route (created 2026-09-20).
-- * It pointed at 'huraa' (Huraa, a different local island). Four Seasons Resort Maldives
--   at Kuda Huraa is on Kuda Huraa, so point it at the 'kuda-huraa' location.
-- * Give it the same search title style as the other top resort routes (owner request 2026-11-26).
-- Price (USD 100 shared) and time (25 minutes) are already correct and are not touched.

update transfer_routes r
set destination_location_id = d.id
from nodes n, nodes d
where r.id = n.id
  and n.node_type = 'transfer_route'
  and n.slug = 'velana-international-airport-to-four-seasons-kuda-huraa'
  and d.node_type = 'location'
  and d.slug = 'kuda-huraa'
  and not exists (
    select 1 from transfer_routes x
    where x.origin_location_id = r.origin_location_id
      and x.destination_location_id = d.id
      and x.id <> r.id
  );

update nodes
set title = 'Velana International Airport to Four Seasons Resort Maldives at Kuda Huraa',
    meta_title = 'Malé Airport to Four Seasons Kuda Huraa: 25-Min Speedboat Transfer',
    meta_description = 'Velana Airport to Four Seasons Resort Maldives at Kuda Huraa by speedboat: about 25 minutes, shared boat from USD 100 per person, private boats and meet & greet.',
    updated_at = now()
where node_type = 'transfer_route'
  and slug = 'velana-international-airport-to-four-seasons-kuda-huraa';
