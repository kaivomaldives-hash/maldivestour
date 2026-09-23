-- Part 6 of 6 - run this in the Supabase SQL Editor AFTER the previous parts.
-- Safe to re-run: every statement in the source file is idempotent (on
-- conflict do nothing / coalesce jsonb merge).

-- MTG: Stays ecosystem seed — 148 real resort/hotel/guesthouse
-- properties, migrated from the legacy site (Phase 1-2 of the Stays
-- ecosystem task).
-- GENERATED FILE — do not hand-edit. Source of truth:
--   data/maldives/accommodations-v2/resolved-properties.json
--   (built by scripts/extract-legacy-accommodations.mjs +
--    scripts/merge-accommodation-research.mjs from WebSearch-verified
--    atoll/island research — see resolution-review.json for the 2
--    properties deliberately excluded: an ambiguous 'Crystal Beach'
--    among 3 same-named guesthouses, and 'Vakarufalhi', rebranded to
--    NOVA Maldives in 2019 and kept under its current name only.)
-- Regenerate with: node scripts/generate-stays-seed.mjs
--
-- Adds to, never replaces, the original 14-property seed from Task 5
-- (20250103000100_seed_accommodations.sql) — idempotent, ON CONFLICT DO
-- NOTHING keyed by slug, same convention as every other generator here.
--
-- No providers are assigned: unlike Task 5's activities/fishing data,
-- the legacy resort/hotel pages never name a distinct booking operator
-- for the property itself (only in-page booking WIDGETS, already
-- confirmed non-content by the Phase 1 audit) — leaving
-- operated_by_provider_id null here is the honest reflection of that,
-- not an oversight.

-- New private/resort islands not covered by the Task 4 inhabited-islands
-- seed or the Task 5 six-resort-island set (deduped — e.g. Fari Islands
-- is shared by two resorts and gets exactly one row here).

update nodes set attributes = attributes || '{"overview_paragraphs":["Award-winning marine conservation effort located at Six Senses Laamu in conjunction with three partner NGOs: The Manta Trust, Blue Marine Foundation, and Olive Ridley Project, all of which collaborate to achieve research, guest education, and community outreach objectives. Is this your ideal palm-fringed paradise? It''s the sole resort in the secluded Laamu Atoll in the Maldives'' south, yet it''s only a short inter-island flight and boat ride away. On-land and over-water homes, dolphins playing in the warm sapphire waters, and restaurants offering delectable East-West cuisine combine to create an amazing, natural paradise.","These beach homes, hidden among the thick tropical flora overlooking the lagoon, feature a private pool and give complete seclusion surrounded by the turquoise lagoon waters. The pool is only a few metres from the beach, and sun loungers are strategically placed beside the pool deck for sun and shade. Feel the soothing sea wind streaming through the leaves while you bathe in the open-air branch-encircled shower or outdoor bathtub, or simply rest in the secluded garden area. Climb to your treetop terrace, which has a comfortable seating and dining space, for a unique panoramic view of Maldivian nature, sapphire ocean, and an incredible beautiful sunset.","A short bike ride on the aged timber jetties will take you to these overwater hideaways, which are surrounded by towering wooden walls. With direct access to the sea, you may go swimming or snorkelling around the lagoon, or simply rest on the overwater netted hammock. If you want to soak up some sun or watch the sunset over the lagoon, you may relax on the sun loungers or around the glass-bottom table on the outdoor deck. The water villas have an outdoor rain shower and a glass overwater bathtub with a view of the lagoon. You may obtain a unique panoramic view of the Indian Ocean, sapphire seascape, and an outstanding vivid tropical sunset here.","Six Senses Laamu''s beautifully built, air-conditioned villas have an outdoor bathroom with rain shower where guests may shower beneath the stars. Guests may enjoy the Maldivian sun from the luxury of their villas thanks to private day beds and sun loungers. The rooms include an electric kettle, slippers, and a dental kit.","The Six Senses Laamu is the sole resort in the Laamu Atoll, which is located in the Maldives'' south. Olhuveli Island is a 35-minute inter-island domestic flight from Male International Airport to Kadhdhoo, followed by a short motorboat journey.","Every day begins with a hearty breakfast with buffet and a la carte selections, as well as a daily changing live cooking station and fruit cut to order. Dinners are international themed events with a concentration on South Asia. There are also live cooking nights where chefs produce fresh meals from a range of different cuisines on the spot."]}'::jsonb
where node_type = 'accommodation' and slug = 'six-senses-laamu' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Beach Villa Pool', 1080, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'six-senses-laamu'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Water Villa', 1000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'six-senses-laamu'
on conflict (accommodation_id, name) do nothing;

-- Soneva-Fushi -> soneva-fushi
update accommodations set
  price_from = coalesce(accommodations.price_from, 2000),
  video_youtube_id = coalesce(accommodations.video_youtube_id, 'SPn2V6YP_eg')
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'soneva-fushi';

update nodes set attributes = attributes || '{"overview_paragraphs":["Soneva Fushi is a natural wonder located in the UNESCO Biosphere Reserve of Baa Atoll, one of the Maldives'' biggest islands. Sixty-four private island homes are tucked away in a lush expanse of lush vegetation. All have expansive living areas and views of the dawn or sunset, and most have their own pools in addition to being just steps from the beach. Our eight Water Retreats are among the largest of their kind in the world, boasting a terrace with a private pool and an ocean water slide. All Soneva Fushi villas have our personalised Barefoot Guardian service, which is available 24 hours a day, seven days a week.","Take a relaxing plunge in your private pool, which is protected by trees. If you wish to experience the pristine Maldivian ocean''s underwater delights, you''re only a few steps away. Relax among the whimsically rustic-chic apartments and balconies and succumb to the shipwrecked vibe.","Sunrise over the water has a mystical quality about it. With three two-story bungalows facing the ocean, there are infinite opportunities to enjoy the sunrise at this expansive seaside Retreat. Promenade the elevated walkway. Swim in the cool private pool. Bathe under the stars in the open-air garden bathrooms. Enjoy a leisurely lunch on the elevated dining pavilion, complemented by a cold beverage from the in-villa wine cooler.","The 1 Bedroom Water Retreat with Slide is positioned right over the pristine waters of the Indian Ocean and is accessible from the main island through a curving dock. The vast home has a light-filled, wide living space with a neighbouring pantry and minibar, as well as sleek and modest décor inspired by the sea.","Fifty-seven individual villas, each with its own length of beach, are tucked away among deep greenery and within touching distance of a magnificent coral reef. Our Soneva Fushi villas are located on the island''s sunset or dawn side. Despite the fact that there are little distinctions, both sides boast the Maldives'' characteristic white-sand beaches and crystal clear turquoise seas. Mr./Ms. Friday butlers deliver intuitive service.","Guests may fly directly to Soneva Fushi from Malé International Airport. Please keep in mind that the seaplane only operates throughout the day, with the latest trip departing at 17:00. Guests can also fly domestically to the neighbouring Dharavandhoo Airport, then take a 15-minute speedboat journey to the resorts. The final domestic flight departs at 23:15. Both flights last between 30 and 40 minutes. We recommend arriving by seaplane to get a bird''s eye perspective of the Maldives'' gorgeous islands."]}'::jsonb
where node_type = 'accommodation' and slug = 'soneva-fushi' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Crusoe Villa Pool', 2000, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'soneva-fushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Villa 41 Three Bedroom Pool Residence', 21700, 'USD', 'King', 9, 1
from nodes where node_type = 'accommodation' and slug = 'soneva-fushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, '1 Bedroom Water Retreat Slide', 5700, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'soneva-fushi'
on conflict (accommodation_id, name) do nothing;

-- Velassaru -> velassaru-maldives
update accommodations set
  price_from = coalesce(accommodations.price_from, 800),
  video_youtube_id = coalesce(accommodations.video_youtube_id, 'UBywDUXX3dA')
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'velassaru-maldives';

update nodes set attributes = attributes || '{"overview_paragraphs":["Crystal-clear oceans, soft white beaches. A picture-perfect lovely lagoon with breathtaking sunset views. Chic private hideaways dot the coastline. Five restaurants and two pubs serve exquisite flavours from all around the world. Explore our abundant coral reefs, sail beyond the horizon, or simply unwind on our idyllic Maldivian beaches.","Luxurious in a subtle way. Your Deluxe Villa is a haven unto itself, with easy access to a lovely white sandy beach:","Each Beach Villa with Pool is located on the beach and has direct access to the ocean. Each one has all you need for a comfortable stay:","Our 24 Water Villas are sophisticated over-water ocean villas with stunning lagoon views. Each one has all you need for a comfortable stay:","Contemporary-styled villas and bungalows offer stylish seclusion tucked away in gorgeous gardens, located along the seaside, or perched above water. Every villa in Velassaru Maldives has everything you need for a relaxing stay.","Velassaru Maldives is a 25-minute speedboat journey from Malé International Airport in South Malé Atoll. Our guest services crew will be at the airport to greet visitors and transport them to waiting speedboats."]}'::jsonb
where node_type = 'accommodation' and slug = 'velassaru-maldives' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Villa', 800, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'velassaru-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1050, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'velassaru-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 1400, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'velassaru-maldives'
on conflict (accommodation_id, name) do nothing;

-- arena-maafushi -> arena-beach-hotel
update accommodations set
  price_from = coalesce(accommodations.price_from, 59),
  video_youtube_id = coalesce(accommodations.video_youtube_id, null)
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'arena-beach-hotel';

update nodes set attributes = attributes || '{"overview_paragraphs":["The Arena Beach Hotel in Maafushi, Maldives, is located on the coast of the South Male Atoll. The island has a breathtaking view of the Indian Ocean and the turquoise lagoon. Let go of your worries and revel in the thrills that await you at every stop. Arena Beach Hotel offers the most accessible way to explore the real Maldives.","Seven Double Deluxe Rooms with balconies have views of the city with coconut trees swaying softly in the breeze, while nine Double Deluxe Rooms with balconies have views of the island''s stunning turquoise lagoon reaching out across the Indian Ocean. In addition, Arena Beach Hotel offers two Super Deluxe Sea View Rooms, which deliver just what the name implies."]}'::jsonb
where node_type = 'accommodation' and slug = 'arena-beach-hotel' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Standard Room', 59, 'USD', 'Double', null, 0
from nodes where node_type = 'accommodation' and slug = 'arena-beach-hotel'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Double Sea View Balcony Room', 89, 'USD', 'Double', null, 1
from nodes where node_type = 'accommodation' and slug = 'arena-beach-hotel'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Balcony Sea View Tripple Room', 112, 'USD', 'Double', null, 2
from nodes where node_type = 'accommodation' and slug = 'arena-beach-hotel'
on conflict (accommodation_id, name) do nothing;

-- kaanibeach-maafushi -> kaani-beach-hotel
update accommodations set
  price_from = coalesce(accommodations.price_from, 71),
  video_youtube_id = coalesce(accommodations.video_youtube_id, null)
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'kaani-beach-hotel';

update nodes set attributes = attributes || '{"overview_paragraphs":["On Maafushi Island, a sunny beach getaway surrounded by coconut palm trees, the 3-star Kaani Beach Hotel is located. On-site activities include scuba diving, island picnics, dolphin viewing, and snorkeling. Kaani Beach Hotel is the ideal choice for anyone looking for a romantic getaway or something a little more laid-back.","Sea View rooms with private balconies are available at Kaani Beach Hotel, a sunny beach getaway surrounded by coconut palm trees. All of the rooms have air conditioning, a hot water shower, satellite television, wireless Internet, a mini bar, a hair dryer, and a safe. There is also a restaurant offering buffet breakfast and dinner, as well as a rooftop open-air terrace with loungers."]}'::jsonb
where node_type = 'accommodation' and slug = 'kaani-beach-hotel' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Sea View Balcony Room', 71, 'USD', 'Double', null, 0
from nodes where node_type = 'accommodation' and slug = 'kaani-beach-hotel'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Tripple Sea View Balcony Room', 84, 'USD', 'Tripple', null, 1
from nodes where node_type = 'accommodation' and slug = 'kaani-beach-hotel'
on conflict (accommodation_id, name) do nothing;
