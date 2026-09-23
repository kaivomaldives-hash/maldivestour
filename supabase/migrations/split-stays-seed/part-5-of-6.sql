-- Part 5 of 6 - run this in the Supabase SQL Editor AFTER the previous parts.
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

-- Sun-Siyam-Olhuveli
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'sun-siyam-olhuveli-maldives-island-resort', 'Sun Siyam Olhuveli Maldives Island Resort', 'The large island of Olhuveli is only a 45-minute speedboat trip away from where you landed. With no need for a seaplane, you can get right into visiting our two islands or just relaxing. This is your time together. Sun Siyam Olhuveli combines traditional Maldivian style with modern design, with accommodations ranging from Maldivian-inspired suites to sleek contemporary villas. We have three pools to appeal to your every need, including an adults-only infinity pool that never fails to please - but be careful, the lagoon may pull you into adventure.', 'published', 'Sun Siyam Olhuveli Maldives Island Resort | Maldives Resorts | MTG', 'The large island of Olhuveli is only a 45-minute speedboat trip away from where you landed. With no need for a seaplane, you can get right into visiting our two islands or just relaxing. This is your time together. Sun Siyam Olhuveli combines traditional Maldivian style with modern design, with accommodations ranging from Maldivian-inspired suites to sleek contemporary villas. We have three pools to appeal to your every need, including an adults-only infinity pool that never fails to please - but be careful, the lagoon may pull you into adventure.', '{"overview_paragraphs":["The large island of Olhuveli is only a 45-minute speedboat trip away from where you landed. With no need for a seaplane, you can get right into visiting our two islands or just relaxing. This is your time together. Sun Siyam Olhuveli combines traditional Maldivian style with modern design, with accommodations ranging from Maldivian-inspired suites to sleek contemporary villas. We have three pools to appeal to your every need, including an adults-only infinity pool that never fails to please - but be careful, the lagoon may pull you into adventure.","King-size bedrooms include clean white lines with vibrant bursts of colour, as well as an alcoved daybed great for curling up with a good book. The outdoor baths are spacious, and there is an eating area, daybed, and sun loungers on the oceanfront terrace.","These traditional Maldivian overwater villas have an outdoor jet tub and steps that go straight into the lagoon. The king-size beds are located behind a comfy sofa, well positioned to soak in the views, and each bathroom has a standalone tub.","Step into your new home at Sun Siyam Olhuveli Maldives for the next several pleasant days. Each of the 164 villas, which include Deluxe Rooms, Beach Villas, Deluxe Water Villas, Jacuzzi Water Villas, and Honeymoon Water Villas, as well as the luxury Presidential Water Suite, has been designed with comfort, relaxation, and elegance in mind. The rooms were created using natural materials and integrating them with modern elegance and open-air styled to take advantage of the Maldivian sunlight and serene vistas. A variety of villas offer the ideal option of lodging for families, couples, honeymooners, and individuals alike.","The scenic Sun Siyam Olhuveli Maldives is located on the tip of South Male'' Atoll, 34 kilometres from Velana International Airport, and is known for its magnificent beaches and numerous sandbanks. A scenic 45-minute speedboat ride takes you to the resort.","Malaafaiy, which is perfectly located for Dream Island guests, provides something for everyone all day long. Ocean vistas and a pleasant sea wind will accompany every meal, whether you''re fueling up before a long day of activity, stopping in for a quick lunch, or visiting us for dinner."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 800, 'H-_NBKBb1fw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'sun-siyam-olhuveli-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'sun-siyam-olhuveli-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'olhuveli'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'sun-siyam-olhuveli-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Garden Beach Villa', 800, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'sun-siyam-olhuveli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Water Villa', 800, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'sun-siyam-olhuveli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Sun-Siyam-ViluReef
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'sun-siyam-vilu-reef-maldives-island-resort', 'Sun Siyam Vilu Reef Maldives Island Resort', 'Stay at Sun Siyam Vilu Reef Maldives'' water villas and enjoy 5 star luxury with sand beneath your feet. Sink into new depths of relaxation with the waves as your soundtrack in this perfect honeymoon destination. You''ll quickly understand why we welcome so many familiar faces back year after year. Sun Siyam Vilu Reef''s water villas are surrounded by some of the nicest coral reef in the Maldives, and we''ve been sharing the resort''s island home with unique flora and animals for over 20 years. Coconut palms flutter in the air, and don''t be shocked if you see a heron or a hermit crab on your walk to breakfast.', 'published', 'Sun Siyam Vilu Reef Maldives Island Resort | Maldives Resorts | MTG', 'Stay at Sun Siyam Vilu Reef Maldives'' water villas and enjoy 5 star luxury with sand beneath your feet. Sink into new depths of relaxation with the waves as your soundtrack in this perfect honeymoon destination. You''ll quickly understand why we welcome so many familiar faces back year after year. Sun Siyam Vilu Reef''s water villas are surrounded by some of the nicest coral reef in the Maldives, and we''ve been sharing the resort''s island home with unique flora and animals for over 20 years. Coconut palms flutter in the air, and don''t be shocked if you see a heron or a hermit crab on your walk to breakfast.', '{"overview_paragraphs":["Stay at Sun Siyam Vilu Reef Maldives'' water villas and enjoy 5 star luxury with sand beneath your feet. Sink into new depths of relaxation with the waves as your soundtrack in this perfect honeymoon destination. You''ll quickly understand why we welcome so many familiar faces back year after year. Sun Siyam Vilu Reef''s water villas are surrounded by some of the nicest coral reef in the Maldives, and we''ve been sharing the resort''s island home with unique flora and animals for over 20 years. Coconut palms flutter in the air, and don''t be shocked if you see a heron or a hermit crab on your walk to breakfast.","Our 14 Beach Bungalows are directly on the beach, only steps from the lagoon. Bright white furnishings contrast with tropical colour accents, and each suite has a king-size bed, an alcoved daybed, an outdoor bathroom with a rain shower, and a covered terrace with loungers and a dining space.","There are just six Aqua Villas on the jetty, and with infinity plunge pools, overwater hammocks, and big outside terraces with stairs straight down to the lagoon, it''s simple to understand why. Sliding glass doors let in natural light and seaside breezes, and the bathrooms include freestanding tubs and separate showers.","Sun Siyam Vilu Reef villas provide a taste of island living - a relaxed luxury brimming with friendliness. Sleep to the sound of the waves and jump into the sea from your own private jetty. They truly offer something for everyone, with 103 beautiful Villas, 6 Suites, 62 Land Villas, and 35 Over Water Villas.","Get away from the fast-paced city life and start your trip to luxury. Sun Siyam Vilu Reef is approximately a 35-minute seaplane journey from the international airport. The ride to Vilu Reef is breathtaking, so your escape to paradise begins as soon as you land at the airport.","Seafood lovers should attend to our monthly lobster and champagne feast, served on the beach with live music, from the restaurants and bars at Sun Siyam Vilu Reef Maldives. Cocktail experts will like our herb-infused creations, while wine connoisseurs will enjoy our award-winning cellar, which houses over 1,400 wines."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 800, 'KWl90P4Oe10', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'sun-siyam-vilu-reef-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'sun-siyam-vilu-reef-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'meedhuffushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'sun-siyam-vilu-reef-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 800, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'sun-siyam-vilu-reef-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Aqua Villa', 1000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'sun-siyam-vilu-reef-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Taj-Coral-Reef
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'taj-coral-reef-resort-spa-maldives', 'Taj Coral Reef Resort & Spa Maldives', 'Taj Coral Reef Resort & Spa, located on heart-shaped Hembadhu Island, is a modern tropical haven hidden atop a 1000-year-old beautiful coral atoll in sunny Maldives. A 45-minute speed boat trip from Velana International Airport, 62 magnificent thatched-roof villas are built above our house reef to provide ecologically friendly, all-inclusive holidays.', 'published', 'Taj Coral Reef Resort & Spa Maldives | Maldives Resorts | MTG', 'Taj Coral Reef Resort & Spa, located on heart-shaped Hembadhu Island, is a modern tropical haven hidden atop a 1000-year-old beautiful coral atoll in sunny Maldives. A 45-minute speed boat trip from Velana International Airport, 62 magnificent thatched-roof villas are built above our house reef to provide ecologically friendly, all-inclusive holidays.', '{"overview_paragraphs":["Taj Coral Reef Resort & Spa, located on heart-shaped Hembadhu Island, is a modern tropical haven hidden atop a 1000-year-old beautiful coral atoll in sunny Maldives. A 45-minute speed boat trip from Velana International Airport, 62 magnificent thatched-roof villas are built above our house reef to provide ecologically friendly, all-inclusive holidays.","Superior Beach Villas are 58 square metres of ultimate luxury, with 12 attractively decorated Superior Beach Villas. Our airy Superior beach villas at Taj Coral Reef, Maldives work their spell on you with amazing views, outdoor bathrooms, and a distinctively constructed open area, and are built in subdued and relaxing pastel colours with a wide comfy sea-facing bed. These magnificent rooms, with distinctive thatched roofs, provide complete solitude for your tropical escape. You may enjoy all of the greatest amenities at these beach villas. Wrap yourself in 100% cotton robes, indulge in delectable snacks from our 24-hour in-villa dining, or simply watch a movie on our 43\" LED TV with home theatre system. Come on in and let us immerse you in ecstasy.","Our Taj Coral Reef, Maldives'' 32 Premium Water Villas will delight all of your senses. This is a great area for supper, with 85 square metres designed to be your personal paradise, a thatched roof, and an exterior terrace facing the sea with sun loungers. Absolute joy! An open-air shower and a large wooden stairway leading directly into the lagoon would complete the indoor-outdoor experience. Inside, you''ll find a wide peaceful sea-facing bed, a wardrobe, and direct access to the outdoor terrace from the bedroom and bathroom. A comfortable day bed, attractive furnishings, and the Treat Yourself minibar, which features organic foods and drinks, are among the other amenities. Begin your tropical transformation now.","The resort provides modern conveniences in a natural setting, with most of the magnificent apartments and villas enjoying ocean views, whether on the beach or across the lagoon. Spacious thatched villas provide sophisticated décor, soft furniture, and stunning bathrooms with open air showers, while private decks provide relaxing places. Some villas include a private plunge pool for extra luxury, while the Nirvana Presidential Suites are ideal for families with two bedrooms split across two storeys.","The resort is located on Hembadhu Island, less than 32 kilometres from Velana International Airport. Amateurs and pros can explore the resort''s own own house reef and shipwreck. Those who choose to stay on land will be captivated by the beauty of the lagoon studded with water homes.","What is a world-class island trip without excellent seafood, beach barbecues, and elegant private dining? Our Coral All-Inclusive Meal Plan is your gastronomic passport to a wide range of international and regional cuisines at these fashionable establishments. The Coral All-Inclusive provides everything you need for a fantastic holiday in one easy package. We''ve curated a bouquet of our best gourmet and aquatic experiences so you may see and do it all without having to pick and choose."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1150, 'dPFQMGyAFck', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'taj-coral-reef-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'taj-coral-reef-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'hembadhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'taj-coral-reef-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Superior Beach Villa', 1150, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'taj-coral-reef-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Premium Water Villa', 1400, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'taj-coral-reef-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Taj-Exotica
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'taj-exotica-resort-spa-maldives', 'Taj Exotica Resort & Spa Maldives', 'Escape the frantic speed and confusion of everyday life at Taj Exotica Resort & Spa in the Maldives. Away from the bright lights of Male, our 5 star Maldives hotel is set across the Emboodhu Finolhu island in the heart of one of the Maldives'' biggest lagoons. This tropical isle, also known as the Three Coconut Isle, is located among coral reefs and is recognised for its abundant flora and wildlife. A 15- to 20-minute speedboat journey from the airport takes you to Male''s lovely beach resort, which is encircled by the blue seas of the Indian Ocean. Set gently above the lagoon, this postcard-perfect Maldives retreat offers 64 sea-view suites and villas that are sumptuous and extravagant while remaining affordable.', 'published', 'Taj Exotica Resort & Spa Maldives | Maldives Resorts | MTG', 'Escape the frantic speed and confusion of everyday life at Taj Exotica Resort & Spa in the Maldives. Away from the bright lights of Male, our 5 star Maldives hotel is set across the Emboodhu Finolhu island in the heart of one of the Maldives'' biggest lagoons. This tropical isle, also known as the Three Coconut Isle, is located among coral reefs and is recognised for its abundant flora and wildlife. A 15- to 20-minute speedboat journey from the airport takes you to Male''s lovely beach resort, which is encircled by the blue seas of the Indian Ocean. Set gently above the lagoon, this postcard-perfect Maldives retreat offers 64 sea-view suites and villas that are sumptuous and extravagant while remaining affordable.', '{"overview_paragraphs":["Escape the frantic speed and confusion of everyday life at Taj Exotica Resort & Spa in the Maldives. Away from the bright lights of Male, our 5 star Maldives hotel is set across the Emboodhu Finolhu island in the heart of one of the Maldives'' biggest lagoons. This tropical isle, also known as the Three Coconut Isle, is located among coral reefs and is recognised for its abundant flora and wildlife. A 15- to 20-minute speedboat journey from the airport takes you to Male''s lovely beach resort, which is encircled by the blue seas of the Indian Ocean. Set gently above the lagoon, this postcard-perfect Maldives retreat offers 64 sea-view suites and villas that are sumptuous and extravagant while remaining affordable.","These lovely homes are set on excellent white beach sand and are only steps away from the lagoon. To round out your Maldives experience, indulge in the joys of a tropical outdoor shower in your private walled garden.","Overwater Villas on stilts with private sun decks, loungers, and easy chairs, as well as direct access to the lagoon. Each villa has a double vanity bathroom, rain showers, and bathtubs, as well as breathtaking views of the Indian Ocean.","This postcard-perfect retreat is set gently above the lagoon and provides 64 sea-view villas and suites that are sumptuous and extravagant while maintaining a fine balance with nature. The Taj Exotica Resort & Spa also includes a world-famous, award-winning presidential suite that is probably the most gorgeous spot on the planet.","Taj Exotica Resort & Spa is located away from the bright lights of Male'', on Emboodhu Finolhu island, in the heart of one of the Maldives'' biggest lagoons. The lovely resort is bordered by the blue seas of the Indian Ocean and is only a 15-minute speedboat ride from the airport.","At Taj Exotica Maldives, you can eat your way across the globe. The chefs at our award-winning Maldives restaurants guarantee to take you on a culinary tour de force. This, along with the splendour of the Maldives, creates an otherworldly experience."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 2500, 'AHXkN6Zbg3E', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'taj-exotica-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'taj-exotica-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'emboodhu-finolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'taj-exotica-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Beach Pool Villa', 3400, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'taj-exotica-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 2500, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'taj-exotica-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- The-Ritz-Carlton
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'the-ritz-carlton-maldives-fari-island-resort', 'The Ritz Carlton Maldives Fari Island Resort', 'The Ritz-Carlton Maldives, Fari Islands invites you to immerse yourself in island life and relax in an azure lagoon surrounded by white sand beaches. From Velana International Airport, the resort is a 45-minute picturesque voyage by luxury speedboat or a 10-minute seaplane flight away. The resort features 100 elegantly built villas by Kerry Hill Architect, inspired by water and circular movement, where modern architecture meets the Maldives. Each villa features a private pool, sundeck, en-suite bathroom, and a spectacular assortment of individualized amenities both indoors and out.', 'published', 'The Ritz Carlton Maldives Fari Island Resort | Maldives Resorts | MTG', 'The Ritz-Carlton Maldives, Fari Islands invites you to immerse yourself in island life and relax in an azure lagoon surrounded by white sand beaches. From Velana International Airport, the resort is a 45-minute picturesque voyage by luxury speedboat or a 10-minute seaplane flight away. The resort features 100 elegantly built villas by Kerry Hill Architect, inspired by water and circular movement, where modern architecture meets the Maldives. Each villa features a private pool, sundeck, en-suite bathroom, and a spectacular assortment of individualized amenities both indoors and out.', '{"overview_paragraphs":["The Ritz-Carlton Maldives, Fari Islands invites you to immerse yourself in island life and relax in an azure lagoon surrounded by white sand beaches. From Velana International Airport, the resort is a 45-minute picturesque voyage by luxury speedboat or a 10-minute seaplane flight away. The resort features 100 elegantly built villas by Kerry Hill Architect, inspired by water and circular movement, where modern architecture meets the Maldives. Each villa features a private pool, sundeck, en-suite bathroom, and a spectacular assortment of individualized amenities both indoors and out."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 2384, 'Zcocq4od2Tw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'the-ritz-carlton-maldives-fari-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'the-ritz-carlton-maldives-fari-island-resort'
  and l.node_type = 'location' and l.slug = 'fari-islands'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'the-ritz-carlton-maldives-fari-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 2887, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'the-ritz-carlton-maldives-fari-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Pool Villa', 2384, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'the-ritz-carlton-maldives-fari-island-resort'
on conflict (accommodation_id, name) do nothing;

-- VARU-Atmosphere
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'varu-by-atmosphere-maldives-island-resort', 'VARU by Atmosphere Maldives Island Resort', 'Atmosphere Hotels & Resorts introduces VARU by Atmosphere, a Maldives all-inclusive resort, nestled in the beautiful Indian Oceans of the Maldives. Enjoy your first moments in paradise on a 40-minute speed boat ride from Male International Airport to the Maldives'' northwestern coast. Experience the local culture and genuine hospitality while receiving 5 star treatment during your stay. ''Varu'' in Dhivehi, the local dialect, means strength, resilience, and plenty, all of which come to life at the resort, with its ideal combination of contemporary architecture and tropical feelings of the island paradise.', 'published', 'VARU by Atmosphere Maldives Island Resort | Maldives Resorts | MTG', 'Atmosphere Hotels & Resorts introduces VARU by Atmosphere, a Maldives all-inclusive resort, nestled in the beautiful Indian Oceans of the Maldives. Enjoy your first moments in paradise on a 40-minute speed boat ride from Male International Airport to the Maldives'' northwestern coast. Experience the local culture and genuine hospitality while receiving 5 star treatment during your stay. ''Varu'' in Dhivehi, the local dialect, means strength, resilience, and plenty, all of which come to life at the resort, with its ideal combination of contemporary architecture and tropical feelings of the island paradise.', '{"overview_paragraphs":["Atmosphere Hotels & Resorts introduces VARU by Atmosphere, a Maldives all-inclusive resort, nestled in the beautiful Indian Oceans of the Maldives. Enjoy your first moments in paradise on a 40-minute speed boat ride from Male International Airport to the Maldives'' northwestern coast. Experience the local culture and genuine hospitality while receiving 5 star treatment during your stay. ''Varu'' in Dhivehi, the local dialect, means strength, resilience, and plenty, all of which come to life at the resort, with its ideal combination of contemporary architecture and tropical feelings of the island paradise.","Beach Villas with Pool are located along the palm-fringed beach, only steps from from the gorgeous white sandy beach. Relax in well-appointed surroundings with natural wood and stone accents, minimalistic design, and ornamental things. The expansive outside terrace is surrounded by lush green flora and a private infinity pool of 10m2.","Escape to an exquisite getaway at our Maldives Overwater pool villa, just steps from from the blue lagoon. This precisely constructed apartment combines the finest of modern living with cutting-edge conveniences. Everything here reflects the island''s fascinating Indian Ocean surroundings, from Maldivian-style interiors to enticing tropical features. The wide veranda has a private 10m2 infinity pool, ideal for a refreshing dip while admiring the lovely lagoon views.","VARU is positioned as a modern and ''Naturally Maldivian'' resort experience, with 108 Villas strewn along the white sandy beaches and spreading over the blue lagoons onto three jetties with over-water accommodation.","VARU is located on the northwestern border of the Malé Atoll Maldives.","Indulge in a gastronomical adventure at VARU by Atmosphere in the Maldives, with the top Maldives restaurants bringing the world to you on a plate through the most delectable culinary experiences. Choose from the best culinary dishes from Europe to Asia, with a Maldivian twist. To create that unique experience for the ages, enjoy magnificent lunch and supper dishes with stunning presentations matched by exquisite vistas."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1200, 'JCoOrSl6-as', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'varu-by-atmosphere-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'varu-by-atmosphere-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'madivaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'varu-by-atmosphere-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1200, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'varu-by-atmosphere-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Pool Villa', 1400, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'varu-by-atmosphere-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Vakkaru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'vakkaru-maldives-island-resort', 'Vakkaru Maldives Island Resort', 'Vakkaru Maldives is an isolated coral island inside the UNESCO Biosphere Reserve of Baa Atoll, blessed with timeless ocean vistas, powder-soft, beautiful white sands, deep blue holes, and a house reef with unique marine fauna. A picturesque 30-minute seaplane journey from Male International Airport whisks you away to this pristine hideaway, which has been intelligently built for tourists seeking timeless experiences.', 'published', 'Vakkaru Maldives Island Resort | Maldives Resorts | MTG', 'Vakkaru Maldives is an isolated coral island inside the UNESCO Biosphere Reserve of Baa Atoll, blessed with timeless ocean vistas, powder-soft, beautiful white sands, deep blue holes, and a house reef with unique marine fauna. A picturesque 30-minute seaplane journey from Male International Airport whisks you away to this pristine hideaway, which has been intelligently built for tourists seeking timeless experiences.', '{"overview_paragraphs":["Vakkaru Maldives is an isolated coral island inside the UNESCO Biosphere Reserve of Baa Atoll, blessed with timeless ocean vistas, powder-soft, beautiful white sands, deep blue holes, and a house reef with unique marine fauna. A picturesque 30-minute seaplane journey from Male International Airport whisks you away to this pristine hideaway, which has been intelligently built for tourists seeking timeless experiences.","Beach Villa with Plunge Pool, surrounded by swaying coconut palms and lush greenery, with direct beach access and a private terrace, as well as a recently added open-air Jacuzzi suited for couples seeking romantic relaxation.","Our Over Water Villas are the perfect romantic getaway positioned over the turquoise lagoon, with a private over water patio and hammock for two people wishing to savour the splendour of their aquatic surrounds.","Whether you are travelling as a couple on a romantic getaway or in a bigger group with family and friends, Vakkaru Maldives has a fantastic selection of luxury hotel choices. All 113 beach and over water villas and Residences have an earthy yet sophisticated style, in line with the rustic charms of Maldivian culture, and give an unparalleled feeling of spaciousness and breathtaking ocean vistas.","From Velana International Airport, a picturesque 25-minute seaplane trip takes you to Vakkaru Maldives, an enchanting sanctuary organically built to heal the soul and quiet the spirit.","To begin the day, enjoy healthy flavours in a quiet, light, and airy atmosphere by the beach, with an interactive presentation of world cuisines and inspired meals enhanced with local tastes and tropical tones."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 3000, '-tmrOPCI3-Q', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'vakkaru-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'vakkaru-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'vakkaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'vakkaru-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 4800, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'vakkaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 3000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'vakkaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Veligandu-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'veligandu-island-resort-spa-maldives', 'Veligandu Island Resort & Spa Maldives', 'The jewel of the Indian Ocean is Veligandu Island Resort & Spa. A charming tropical paradise filled with swaying palm palms, white sand beaches, crystal clear water, and exuberant coral reefs alive with marine life. This green island retreat provides peace and serenity, which feed one''s well-being.', 'published', 'Veligandu Island Resort & Spa Maldives | Maldives Resorts | MTG', 'The jewel of the Indian Ocean is Veligandu Island Resort & Spa. A charming tropical paradise filled with swaying palm palms, white sand beaches, crystal clear water, and exuberant coral reefs alive with marine life. This green island retreat provides peace and serenity, which feed one''s well-being.', '{"overview_paragraphs":["The jewel of the Indian Ocean is Veligandu Island Resort & Spa. A charming tropical paradise filled with swaying palm palms, white sand beaches, crystal clear water, and exuberant coral reefs alive with marine life. This green island retreat provides peace and serenity, which feed one''s well-being.","Enjoy beachfront views from your Maldives Beach Villa, which is only a few steps from the water. All of our 11 Beach Villas are set among lush tropical flora and beneath swaying coconut palms and offer the needed facilities for a pleasant, comfortable vacation in paradise.","Slip away to your private ocean retreat and enjoy the pleasure of direct access to the blue waters of the ocean through the stairs on your Water Villa''s sun-kissed balcony.","Private porches, lagoon views, flat-screen TVs, and complimentary high-speed Internet are available in the exquisite villas. Upgraded villas have whirlpool spas or Jacuzzis, and some are perched on stilts over the lagoon. Some villas accept children aged 14 and under.","A 20-minute seaplane journey from Velana International Airport takes you to this quiet resort on a 600-meter-long island. Surrounded by stunning lagoons, a great house reef, and long expanses of pristine white sand,","Enjoy the exquisite joys of paradise while tickling your taste senses. Veligandu, home to some of the top restaurants in the Maldives, serves flavorful native food as well as cuisines from across the world. Dhonveli, our primary restaurant, offers a wide range of cuisines. During breakfast, lunch, and supper, the buffet offers a diverse selection of gastronomic pleasures. Madivaru, our famous à la carte restaurant, serves a fine dining menu full of delectable specialties, all while overlooking the lagoon. Relaxed afternoons and evenings are best spent at one of our bars, with a cool drink in hand."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 600, '8RTjyBXGrJA', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'veligandu-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'veligandu-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'veligandu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'veligandu-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'veligandu-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 600, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'veligandu-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Vilamendhoo-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'vilamendhoo-island-resort-spa-maldives', 'Vilamendhoo Island Resort & Spa Maldives', 'Your vacation journey begins at Vilamendhoo Island Resort & Spa, located in the South Ari Atoll and following the Maldives'' famed ''One Island, One Resort'' idea. This island is around 55 acres in size, 900 metres long by 250 metres broad, and is encircled by a stunning house reef a short swim away from the large sandy beach. Vilamendhoo is the ultimate diving and snorkelling adventure.', 'published', 'Vilamendhoo Island Resort & Spa Maldives | Maldives Resorts | MTG', 'Your vacation journey begins at Vilamendhoo Island Resort & Spa, located in the South Ari Atoll and following the Maldives'' famed ''One Island, One Resort'' idea. This island is around 55 acres in size, 900 metres long by 250 metres broad, and is encircled by a stunning house reef a short swim away from the large sandy beach. Vilamendhoo is the ultimate diving and snorkelling adventure.', '{"overview_paragraphs":["Your vacation journey begins at Vilamendhoo Island Resort & Spa, located in the South Ari Atoll and following the Maldives'' famed ''One Island, One Resort'' idea. This island is around 55 acres in size, 900 metres long by 250 metres broad, and is encircled by a stunning house reef a short swim away from the large sandy beach. Vilamendhoo is the ultimate diving and snorkelling adventure.","Garden Rooms are situated in the natural island gardens, each with its own privacy screen. This tropical lodging provides leisure and comfort in between fun-filled island experiences. These accommodations provide convenient access to the island''s services, including the main restaurant and bar.","Extend your love of the sea to your vacation living area by booking the Jacuzzi Water Villa. The over-water villas in the Maldives are designed for adventure seekers, romance, and water enthusiasts, and have a private sundeck with stairs going into the sea. The Jacuzzi Water Villas at Vilamendhoo are only available to visitors over the age of 18.","The island is divided into two sections: one for adults exclusively (including an Overwater Villa) and one for families. Beach Villas with additional beds are offered for small families with young children, as well as exclusive and romantic Water Front Villas for couples seeking privacy. All villas are outfitted with the most up-to-date conveniences and are divided by a screen to offer optimum seclusion.","This snorkelling and diving paradise is only a 25-minute seaplane ride away. The Vilamendhoo Island Resort is surrounded by a gorgeous lagoon, an outstanding house reef, and extensive lengths of immaculate dunes, making it an ideal position to see the sought whale sharks that migrate through the Maldives.","Before embarking on your travels, or after a day of fun on the island, stop for a bite to eat or a refreshing drink at any of the island''s restaurants and pubs. Vilamendhoo provides one-of-a-kind dining experiences in the Maldives, with a delectable selection of regional and international cuisines. The two buffet restaurants, one family-friendly and one for adults-only, contribute to the island''s laid-back atmosphere. The restaurants are open-air with sand flooring, reflecting Maldivian customs and offering a relaxed dining experience. Enjoy à la carte eating experiences, whether on the lake at Asian Wok or on the beach at Hot Rock. Reserve a table for a private al fresco supper on the beach for a totally unique and romantic experience."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 400, 'vBYLNZEdaYI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'vilamendhoo-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'vilamendhoo-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'vilamendhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'vilamendhoo-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Garden Villa', 400, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'vilamendhoo-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Jacuzzi Water Villa', 792, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'vilamendhoo-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Waldorf-Astoria
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'waldorf-astoria-maldives-ithaafushi-island-resort', 'Waldorf Astoria Maldives Ithaafushi Island Resort', 'The Waldorf Astoria Maldives Ithaafushi resort is a 45-minute boat ride from Velana International Airport, nestled among beautiful dunes and crystal blue seas. The resort has 11 acclaimed dining locations, including Michelin-starred chef Dave Pynt''s Zuma Maldives and Terra, the only private hand-crafted bamboo dining pods in the Maldives, a world-class spa retreat, the only water wellness centre of its type in the Maldives, and an exclusive private island. The Waldorf Astoria Maldives Ithaafushi offers 119 beach, reef, and overwater villas with private pools, including a private island, as well as world-class facilities for a wonderful visit. Ithaafushi - The Private Island is the largest Maldivian private island in the Indian Ocean, spanning 32,000 square metres and accommodating up to 24 guests across two elegantly designed villas and one four-bedroom residence, ideal for bonding with loved ones or celebrating life''s significant milestones with close friends.', 'published', 'Waldorf Astoria Maldives Ithaafushi Island Resort | Maldives Resorts | MTG', 'The Waldorf Astoria Maldives Ithaafushi resort is a 45-minute boat ride from Velana International Airport, nestled among beautiful dunes and crystal blue seas. The resort has 11 acclaimed dining locations, including Michelin-starred chef Dave Pynt''s Zuma Maldives and Terra, the only private hand-crafted bamboo dining pods in the Maldives, a world-class spa retreat, the only water wellness centre of its type in the Maldives, and an exclusive private island. The Waldorf Astoria Maldives Ithaafushi offers 119 beach, reef, and overwater villas with private pools, including a private island, as well as world-class facilities for a wonderful visit. Ithaafushi - The Private Island is the largest Maldivian private island in the Indian Ocean, spanning 32,000 square metres and accommodating up to 24 guests across two elegantly designed villas and one four-bedroom residence, ideal for bonding with loved ones or celebrating life''s significant milestones with close friends.', '{"overview_paragraphs":["The Waldorf Astoria Maldives Ithaafushi resort is a 45-minute boat ride from Velana International Airport, nestled among beautiful dunes and crystal blue seas. The resort has 11 acclaimed dining locations, including Michelin-starred chef Dave Pynt''s Zuma Maldives and Terra, the only private hand-crafted bamboo dining pods in the Maldives, a world-class spa retreat, the only water wellness centre of its type in the Maldives, and an exclusive private island. The Waldorf Astoria Maldives Ithaafushi offers 119 beach, reef, and overwater villas with private pools, including a private island, as well as world-class facilities for a wonderful visit. Ithaafushi - The Private Island is the largest Maldivian private island in the Indian Ocean, spanning 32,000 square metres and accommodating up to 24 guests across two elegantly designed villas and one four-bedroom residence, ideal for bonding with loved ones or celebrating life''s significant milestones with close friends.","This contemporary property has enough interior living, eating, and sleeping space. Relax on a daybed or hammock by the pool, surrounded by swaying palm palms.","These overwater homes provide breathtaking ocean views through floor-to-ceiling windows. There is space for both indoor and outdoor life.","There are 119 villas spread out over three private islands. Choose from one, two, or three-bedroom villas, each with its own private pool, swing daybeds, dining gazebos, and in-water couches, and all with unobstructed views of the Indian Ocean.","The magnificent Waldorf Astoria Maldives Ithaafushi is nestled among beautiful dunes and crystal blue lagoons, about 45 minutes by boat from Malé International Airport.","Discover a unique dining experience in one of 11 strategically located restaurants and bars, or just dine on your villa''s own terrace with a tailor-made personalised menu."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, null, 'gXK48Tb4Pic', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'waldorf-astoria-maldives-ithaafushi-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'waldorf-astoria-maldives-ithaafushi-island-resort'
  and l.node_type = 'location' and l.slug = 'ithaafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'waldorf-astoria-maldives-ithaafushi-island-resort'
on conflict (id) do nothing;

-- Westin-Miriandhoo
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'the-westin-maldives-miriandhoo-resort', 'The Westin Maldives Miriandhoo Resort', 'The Westin Maldives Miriandhoo Resort promises an unforgettable experience. Our lovely family-friendly resort offers an unparalleled environment for your Maldives visit, beautifully positioned on the ocean in the UNESCO Biosphere Reserve in Baa Atoll, surrounded by the Indian Ocean. Your luxury journey begins the moment you arrive at our resort, whether by seaplane or boat. Return to your isolated apartment or villa for uninterrupted ocean views, a private deck, and, in select accommodations, a private pool. We encourage you to taste exquisite eating in our restaurants, relax poolside or on the beach, indulge at our wellness spa, play tennis, or explore the resort grounds when you are ready to leave your paradise. Our skilled crew is waiting to make your stay on Baa Atoll great in every way, whether you are celebrating a special family event or spending time with a loved one. Make unforgettable experiences at The Westin Maldives Miriandhoo Resort.', 'published', 'The Westin Maldives Miriandhoo Resort | Maldives Resorts | MTG', 'The Westin Maldives Miriandhoo Resort promises an unforgettable experience. Our lovely family-friendly resort offers an unparalleled environment for your Maldives visit, beautifully positioned on the ocean in the UNESCO Biosphere Reserve in Baa Atoll, surrounded by the Indian Ocean. Your luxury journey begins the moment you arrive at our resort, whether by seaplane or boat. Return to your isolated apartment or villa for uninterrupted ocean views, a private deck, and, in select accommodations, a private pool. We encourage you to taste exquisite eating in our restaurants, relax poolside or on the beach, indulge at our wellness spa, play tennis, or explore the resort grounds when you are ready to leave your paradise. Our skilled crew is waiting to make your stay on Baa Atoll great in every way, whether you are celebrating a special family event or spending time with a loved one. Make unforgettable experiences at The Westin Maldives Miriandhoo Resort.', '{"overview_paragraphs":["The Westin Maldives Miriandhoo Resort promises an unforgettable experience. Our lovely family-friendly resort offers an unparalleled environment for your Maldives visit, beautifully positioned on the ocean in the UNESCO Biosphere Reserve in Baa Atoll, surrounded by the Indian Ocean. Your luxury journey begins the moment you arrive at our resort, whether by seaplane or boat. Return to your isolated apartment or villa for uninterrupted ocean views, a private deck, and, in select accommodations, a private pool. We encourage you to taste exquisite eating in our restaurants, relax poolside or on the beach, indulge at our wellness spa, play tennis, or explore the resort grounds when you are ready to leave your paradise. Our skilled crew is waiting to make your stay on Baa Atoll great in every way, whether you are celebrating a special family event or spending time with a loved one. Make unforgettable experiences at The Westin Maldives Miriandhoo Resort.","Our beach villas, located along the palm-fringed shoreline with direct beach access, gaze out over the huge waves of the Indian Ocean, embodying subtle style and constructed with exquisite open-plan living in mind. The Westin Maldives Miriandhoo Resort Heavenly Bath® is more than just a bathroom; it offers a rejuvenating bathing experience for body and soul, with a separate bathtub and rain-forest shower. The Island Villas are up to 140 square metres in size and have a private pool and sun terrace.","There are 41 stunning on-island and 29 over-sea homes in six categories, ranging from a one-bedroom pool villa to a two-bedroom, three-bathroom garden property with a kitchenette. Most feature pools, and all offer ocean vistas, huge ''Heavenly'' mattresses, outdoor rain showers, original artwork, and high-quality facilities. The overwater villas are among the most spacious in Baa Atoll.","The Westin Maldives Miriandhoo Resort is located 112 kilometres north of Velana International Airport on an 11-acre island in Baa Atoll, Maldives'' first and only UNESCO Biosphere Reserve. The island is roughly 30 minutes by sea plane and 20 minutes by domestic aircraft to Dharavandhoo Airport in Baa Atoll, followed by a 10-minute speed boat trip to the resort.","During your stay at the Westin Maldives Miriandhoo Resort, you may choose from four distinct dining selections. The three restaurants and elevated bar provide unforgettable gastronomic experiences in stunning settings. Cuisines range from The Pearl''s exquisite Japanese menu with a seafood focus to Island Kitchen''s healthful, cosmopolitan meals and all-day eating. Hawker, a colourful bar and restaurant, serves real Asian street cuisine in a bustling market-place setting, while Sunset Bar provides a relaxing conclusion to the day with tapas and seaside views.","The picturesque resort also has the Heavenly Spa by WestinTM, Westin''s own branded spa concept. The Spa also incorporates the most recent aesthetic technologies and has a big treatment suite for two with a Jacuzzi and panoramic ocean views. The Spa area''s design conveys a private and calm ambience. The treatments available at The Heavenly Spa by WestinTM represent the resort''s dedication to wellbeing, allowing visitors to relax and revitalise via a personalised sensory experience. An appointment is necessary."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1080, 'Z67wPR8r8P8', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'the-westin-maldives-miriandhoo-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'the-westin-maldives-miriandhoo-resort'
  and l.node_type = 'location' and l.slug = 'miriandhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'the-westin-maldives-miriandhoo-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1080, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'the-westin-maldives-miriandhoo-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 1200, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'the-westin-maldives-miriandhoo-resort'
on conflict (accommodation_id, name) do nothing;

-- You-and-Me
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'you-me-by-cocoon-maldives-island-resort', 'You & Me by Cocoon Maldives Island Resort', 'You & Me is a quiet, rustic, and romantic island located in a stunning, unspoiled area of the Maldives. You & Me is the place to unwind, snuggle up, and enjoy some quality ''us time'' away from the worries of everyday life. You & Me is a brand new 5-star resort in Raa atoll, northern Maldives, about 20 minutes by speedboat from Ifuru domestic airport or a breathtaking 45-minute seaplane flight from Male'' international airport. The adults-only island is aimed towards couples, honeymooners, and friends looking for a peaceful, relaxing escape away from other hotels.', 'published', 'You & Me by Cocoon Maldives Island Resort | Maldives Resorts | MTG', 'You & Me is a quiet, rustic, and romantic island located in a stunning, unspoiled area of the Maldives. You & Me is the place to unwind, snuggle up, and enjoy some quality ''us time'' away from the worries of everyday life. You & Me is a brand new 5-star resort in Raa atoll, northern Maldives, about 20 minutes by speedboat from Ifuru domestic airport or a breathtaking 45-minute seaplane flight from Male'' international airport. The adults-only island is aimed towards couples, honeymooners, and friends looking for a peaceful, relaxing escape away from other hotels.', '{"overview_paragraphs":["You & Me is a quiet, rustic, and romantic island located in a stunning, unspoiled area of the Maldives. You & Me is the place to unwind, snuggle up, and enjoy some quality ''us time'' away from the worries of everyday life. You & Me is a brand new 5-star resort in Raa atoll, northern Maldives, about 20 minutes by speedboat from Ifuru domestic airport or a breathtaking 45-minute seaplane flight from Male'' international airport. The adults-only island is aimed towards couples, honeymooners, and friends looking for a peaceful, relaxing escape away from other hotels.","These big rooms on the beach have a magnificent and rustic vibe, with a lovely bathroom complete with a couple''s bathtub and rain shower, a king size bed overlooking the beach, a sofa, balcony, and private pool with private beach and sea views.","These rustic water villas have unrivalled sunset views and have polished hardwood flooring, a king-sized bed facing the ocean, a comfy sofa, a rain shower, and a seaside porch with lagoon views.","You & Me by Cocoon features 109 rooms, including 99 overlooking the ocean and 10 on the beach. You & Me by Cocoon is the place to unwind, snuggle up, and enjoy some quality ''us time'' away from the worries of everyday life.","You & Me by Cocoon is in Raa atoll, northern Maldives, about 20 minutes by speedboat from Ifuru domestic airport or a breathtaking 45-minute seaplane flight from Velana international airport.","You & Me''s standout feature is a totally submerged, underwater restaurant that provides customers with a glimpse of the Maldives'' stunning marine environment as they enjoy a great meal."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 950, 'ncv136ZRUx0', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'you-me-by-cocoon-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'you-me-by-cocoon-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'uthurumafaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'you-me-by-cocoon-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Suite', 950, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'you-me-by-cocoon-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Dolphin Villa', 950, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'you-me-by-cocoon-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- adaaran-club-rannalhi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'adaaran-club-rannalhi-island-resort-maldives', 'Adaaran Club Rannalhi Island Resort Maldives', 'Adaaran Club Rannalhi is one of the greatest hotels in Maldives, located at the point of the South Male atoll in the Maldives, an unique collection of islands. During your stay at our pleasant Maldives hotel, bask in the golden sun and romp on the soft sands while experiencing warm Maldivian hospitality and seeing the rich tropical marvels of a dynamic island nation.', 'published', 'Adaaran Club Rannalhi Island Resort Maldives | Maldives Resorts | MTG', 'Adaaran Club Rannalhi is one of the greatest hotels in Maldives, located at the point of the South Male atoll in the Maldives, an unique collection of islands. During your stay at our pleasant Maldives hotel, bask in the golden sun and romp on the soft sands while experiencing warm Maldivian hospitality and seeing the rich tropical marvels of a dynamic island nation.', '{"overview_paragraphs":["Adaaran Club Rannalhi is one of the greatest hotels in Maldives, located at the point of the South Male atoll in the Maldives, an unique collection of islands. During your stay at our pleasant Maldives hotel, bask in the golden sun and romp on the soft sands while experiencing warm Maldivian hospitality and seeing the rich tropical marvels of a dynamic island nation.","Adaaran Club Rannalhi is a charming Maldives Island resort located on the beautiful dunes of this tropical paradise. Adaaran Club Rannalhi is just 34 kilometers from Male International Airport and may be accessed through a 45-minute speedboat journey over breathtaking blue seas.","The 96 standard rooms at Adaaran Club Rannalhi provide excellent Maldives accommodation with all modern comforts while complimenting the natural surroundings and contributing to the mood. The Adaaran Club Rannalhi''s 34 large and private Water Bungalows offer breathtaking ocean views and access to the changing scenery as the day fades to night."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 302, 'JnsS3oIjDiM', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'adaaran-club-rannalhi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'adaaran-club-rannalhi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'rannalhi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'adaaran-club-rannalhi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Standard Room', 302, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'adaaran-club-rannalhi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow', 525, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'adaaran-club-rannalhi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- anantara-dhigu
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'anantara-dhigu-island-resort-maldives', 'Anantara Dhigu Island Resort Maldives', 'Anantara Dhigu Maldives is a tropical haven in the Indian Ocean. Indulge in barefoot sophistication in a tropical haven that caters to the entire family. This is a great place to build an unforgettable vacation, with a range of luxurious accommodations offering breathtaking views and private pools. For easy fun, try a variety of cuisines, relax with soothing spa treatments, and explore the nearby lagoon.', 'published', 'Anantara Dhigu Island Resort Maldives | Maldives Resorts | MTG', 'Anantara Dhigu Maldives is a tropical haven in the Indian Ocean. Indulge in barefoot sophistication in a tropical haven that caters to the entire family. This is a great place to build an unforgettable vacation, with a range of luxurious accommodations offering breathtaking views and private pools. For easy fun, try a variety of cuisines, relax with soothing spa treatments, and explore the nearby lagoon.', '{"overview_paragraphs":["Anantara Dhigu Maldives is a tropical haven in the Indian Ocean. Indulge in barefoot sophistication in a tropical haven that caters to the entire family. This is a great place to build an unforgettable vacation, with a range of luxurious accommodations offering breathtaking views and private pools. For easy fun, try a variety of cuisines, relax with soothing spa treatments, and explore the nearby lagoon.","The 110 villas and suites at Anantara Maldives offer a variety of room sizes, with some perched above the water and others nestled on unspoiled sands. Choose from sunrise or sunset views, or a villa with your own private pool."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 540, 'CqbUr7mdR6w', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'anantara-dhigu-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'anantara-dhigu-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'dhigufinolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'anantara-dhigu-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 540, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'anantara-dhigu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Pool Villa', 739, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'anantara-dhigu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Two bedroom Family Villa', 1426, 'USD', 'Double', null, 2
from nodes where node_type = 'accommodation' and slug = 'anantara-dhigu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 775, 'USD', 'King', 3, 3
from nodes where node_type = 'accommodation' and slug = 'anantara-dhigu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- centara-rasfushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'centara-rasfushi-island-resort-maldives', 'Centara Rasfushi Island Resort Maldives', 'Centara Ras Fushi Resort & Spa is an adult-only resort that provides a relaxing and inspiring vacation experience, as well as ample opportunities to indulge, play, and rejuvenate at the excellent well-being area and numerous restaurants and bars. These 140 luxury villas of Centara Ras Fushi Resort & Spa are built as adults-only accommodation and fit harmoniously with the island''s green interior and white powdery beaches. Using flowing and natural architectural forms and a minimalist decor, these villas are designed to immerse you in total serenity and enjoy breathtaking ocean vistas. Only two adults are allowed in each villa.', 'published', 'Centara Rasfushi Island Resort Maldives | Maldives Resorts | MTG', 'Centara Ras Fushi Resort & Spa is an adult-only resort that provides a relaxing and inspiring vacation experience, as well as ample opportunities to indulge, play, and rejuvenate at the excellent well-being area and numerous restaurants and bars. These 140 luxury villas of Centara Ras Fushi Resort & Spa are built as adults-only accommodation and fit harmoniously with the island''s green interior and white powdery beaches. Using flowing and natural architectural forms and a minimalist decor, these villas are designed to immerse you in total serenity and enjoy breathtaking ocean vistas. Only two adults are allowed in each villa.', '{"overview_paragraphs":["Centara Ras Fushi Resort & Spa is an adult-only resort that provides a relaxing and inspiring vacation experience, as well as ample opportunities to indulge, play, and rejuvenate at the excellent well-being area and numerous restaurants and bars. These 140 luxury villas of Centara Ras Fushi Resort & Spa are built as adults-only accommodation and fit harmoniously with the island''s green interior and white powdery beaches. Using flowing and natural architectural forms and a minimalist decor, these villas are designed to immerse you in total serenity and enjoy breathtaking ocean vistas. Only two adults are allowed in each villa."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 208, 'F1a21IInpQ4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'centara-rasfushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'centara-rasfushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'giraavaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'centara-rasfushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Oceanfront Beach Villa', 208, 'USD', 'King', 2, 0
from nodes where node_type = 'accommodation' and slug = 'centara-rasfushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Oceanfront Beach Villa', 292, 'USD', 'Double', null, 1
from nodes where node_type = 'accommodation' and slug = 'centara-rasfushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Water Villa', 364, 'USD', 'Double', null, 2
from nodes where node_type = 'accommodation' and slug = 'centara-rasfushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- embudu-village
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'embudu-village-island-maldives', 'Embudu Village Island Maldives', 'Embudu Village has remained pure and natural since its inception as one of the Maldives'' first resorts. When you step foot on Embudu Village, you will be fully relaxed, surrounded by the calmness of the turquoise waters and the sound of the waves on the endless beaches.', 'published', 'Embudu Village Island Maldives | Maldives Resorts | MTG', 'Embudu Village has remained pure and natural since its inception as one of the Maldives'' first resorts. When you step foot on Embudu Village, you will be fully relaxed, surrounded by the calmness of the turquoise waters and the sound of the waves on the endless beaches.', '{"overview_paragraphs":["Embudu Village has remained pure and natural since its inception as one of the Maldives'' first resorts. When you step foot on Embudu Village, you will be fully relaxed, surrounded by the calmness of the turquoise waters and the sound of the waves on the endless beaches.","Embudu Village is a small island off the coast of Male'' Atoll, about a 30-minute speedboat ride from Velana International Airport. As a result, it is readily accessible and a common destination for most visitors. Embudu Village''s villas are all close to the beach and surrounded by palm fronds and tropical plants, giving each room a sense of seclusion and privacy."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 179, 'pGzhOylYfog', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'embudu-village-island-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'embudu-village-island-maldives'
  and l.node_type = 'location' and l.slug = 'embudu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'embudu-village-island-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Room', 179, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'embudu-village-island-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Room', 259, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'embudu-village-island-maldives'
on conflict (accommodation_id, name) do nothing;

-- fihalhohi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'fihaalhohi-island-resort-maldives', 'Fihaalhohi Island Resort Maldives', 'Come to a spot where a breathtaking view of the Indian Ocean and the island''s natural tropical elegance are a daily backdrop. The Maldives'' Fihalhohi Island Resort is an utter paradise island escape. A truly idyllic location where the mind and body are rejuvenated and time stands still. The island''s ideal warm weather makes it ideal for water sports and excursions. A beautiful house reef surrounds the beach, teeming with rich aquatic life that can be enjoyed when diving. Huvandhumaa spa therapists have a variety of Balinese and foreign therapies in a lush tropical environment.', 'published', 'Fihaalhohi Island Resort Maldives | Maldives Resorts | MTG', 'Come to a spot where a breathtaking view of the Indian Ocean and the island''s natural tropical elegance are a daily backdrop. The Maldives'' Fihalhohi Island Resort is an utter paradise island escape. A truly idyllic location where the mind and body are rejuvenated and time stands still. The island''s ideal warm weather makes it ideal for water sports and excursions. A beautiful house reef surrounds the beach, teeming with rich aquatic life that can be enjoyed when diving. Huvandhumaa spa therapists have a variety of Balinese and foreign therapies in a lush tropical environment.', '{"overview_paragraphs":["Come to a spot where a breathtaking view of the Indian Ocean and the island''s natural tropical elegance are a daily backdrop. The Maldives'' Fihalhohi Island Resort is an utter paradise island escape. A truly idyllic location where the mind and body are rejuvenated and time stands still. The island''s ideal warm weather makes it ideal for water sports and excursions. A beautiful house reef surrounds the beach, teeming with rich aquatic life that can be enjoyed when diving. Huvandhumaa spa therapists have a variety of Balinese and foreign therapies in a lush tropical environment.","There are 138 beachfront rooms and 12 well-appointed water villas available for your stay on the island. A total of 150 rooms are available. Both rooms have a hair dryer, Bath & Beach Towels, room safe, Mini Bar, Individually Controlled Air-conditioning and Fan, telephones, and a hair dryer."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 141, 'pgTJIQbrvuw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'fihaalhohi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'fihaalhohi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'fihalhohi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'fihaalhohi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 141, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'fihaalhohi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Room', 308, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'fihaalhohi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- huvafenfushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'huvafen-fushi-island-resort-maldives', 'Huvafen Fushi Island Resort Maldives', 'Huvafen Fushi Maldives is a naturalist''s paradise set inside its own lagoon, where the breathtaking scenery, both above and below the waterline, is an attraction in and of itself. Their ocean bungalow''s glass floor captures a perfect vision of the turquoise waters and features extravagant and spacious villas. They have accommodation on the water as well as a designer yacht with modern and opulent amenities. Cruise about, savor the finest food prepared by international cooks, and relax with spa treatments. Huvafen Fushi Maldives is a stunning, luxurious, and expensive Maldivian property that is one of the best options in the Maldives.', 'published', 'Huvafen Fushi Island Resort Maldives | Maldives Resorts | MTG', 'Huvafen Fushi Maldives is a naturalist''s paradise set inside its own lagoon, where the breathtaking scenery, both above and below the waterline, is an attraction in and of itself. Their ocean bungalow''s glass floor captures a perfect vision of the turquoise waters and features extravagant and spacious villas. They have accommodation on the water as well as a designer yacht with modern and opulent amenities. Cruise about, savor the finest food prepared by international cooks, and relax with spa treatments. Huvafen Fushi Maldives is a stunning, luxurious, and expensive Maldivian property that is one of the best options in the Maldives.', '{"overview_paragraphs":["Huvafen Fushi Maldives is a naturalist''s paradise set inside its own lagoon, where the breathtaking scenery, both above and below the waterline, is an attraction in and of itself. Their ocean bungalow''s glass floor captures a perfect vision of the turquoise waters and features extravagant and spacious villas. They have accommodation on the water as well as a designer yacht with modern and opulent amenities. Cruise about, savor the finest food prepared by international cooks, and relax with spa treatments. Huvafen Fushi Maldives is a stunning, luxurious, and expensive Maldivian property that is one of the best options in the Maldives.","Huvafen Fushi Maldives offers over-water and beach bungalows with private beaches, as well as free Wi-Fi and six dining options. A sundeck, big flat-screen satellite TV, and a Bang and Olufsen Bluetooth speaker are included with each spacious bungalow. A rain shower and a separate bathtub are included in the attached bathrooms."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 1054, 'jpzWIVnQNic', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'huvafen-fushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'huvafen-fushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'nakatchafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'huvafen-fushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Bungalow', 1054, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'huvafen-fushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow Pool', 1314, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'huvafen-fushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- kuda-Villingili
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'kuda-villingili-resort-maldives', 'Kuda Villingili Resort Maldives', 'Kuda Villingili Resort Maldives is a private island that redefines time and space. Whether guests are travelling as a couple, family, group of friends, or alone, Kuda Villingili is a slice of paradise where everyone is welcome. The resort''s emphasis on time and space, which balances togetherness and inclusion with solitude and independence, allows guests to enjoy a personalised experience, making each voyage unique.', 'published', 'Kuda Villingili Resort Maldives | Maldives Resorts | MTG', 'Kuda Villingili Resort Maldives is a private island that redefines time and space. Whether guests are travelling as a couple, family, group of friends, or alone, Kuda Villingili is a slice of paradise where everyone is welcome. The resort''s emphasis on time and space, which balances togetherness and inclusion with solitude and independence, allows guests to enjoy a personalised experience, making each voyage unique.', '{"overview_paragraphs":["Kuda Villingili Resort Maldives is a private island that redefines time and space. Whether guests are travelling as a couple, family, group of friends, or alone, Kuda Villingili is a slice of paradise where everyone is welcome. The resort''s emphasis on time and space, which balances togetherness and inclusion with solitude and independence, allows guests to enjoy a personalised experience, making each voyage unique.","This tropical refuge on the pearl white beach is encircled by thick trees. The Deluxe Haven villa''s rustic wood furnishings are accented with stone features that shimmer in the sunlight. Relax on the beachside terrace or relax in a warm bath with uninterrupted ocean views.","The beach is right outside the door of this beachfront property with a private pool. Relax in an essential oil bath before laying out on the king-sized bed made of the finest Egyptian cotton and gazing out over the Maldivian sea.","Wake awake to the sound of the ocean waves in one of KudaVillingili''s oceanfront villas. The villas facing the turquoise sea include king-sized bedrooms, big bathrooms, covered dining patios with views of the horizon, and vast living areas with windows that enable the ocean breeze to flow in and out.","The resort offers a range of lodging options, making it ideal for lone travellers, couples, families, and groups of friends. The fascinating beauty of the Maldives inspired all 59 beach villas and 36 water villas.","The Kuda Villingili is located in North Malé Atoll and is only a 30-minute speedboat trip from Velana International Airport (MLE), ensuring a convenient, pleasant, and quick travel."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 1700, '8902D6Z2FQo', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'kuda-villingili-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'kuda-villingili-resort-maldives'
  and l.node_type = 'location' and l.slug = 'kuda-villingili'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'kuda-villingili-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Haven With Patio', 1700, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'kuda-villingili-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa Pool', 2900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'kuda-villingili-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 1850, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'kuda-villingili-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- nautilus
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'the-nautilus-island-resort-maldives', 'The Nautilus Island Resort Maldives', 'Each house and residence at The Nautilus is a distinct and sophisticated escape, inspired by the lasting shape of the nautilus shell. Each space is replete with curved lines and spiraled components. Our philosophy, like this symbol of the deep, is universal and eternal.', 'published', 'The Nautilus Island Resort Maldives | Maldives Resorts | MTG', 'Each house and residence at The Nautilus is a distinct and sophisticated escape, inspired by the lasting shape of the nautilus shell. Each space is replete with curved lines and spiraled components. Our philosophy, like this symbol of the deep, is universal and eternal.', '{"overview_paragraphs":["Each house and residence at The Nautilus is a distinct and sophisticated escape, inspired by the lasting shape of the nautilus shell. Each space is replete with curved lines and spiraled components. Our philosophy, like this symbol of the deep, is universal and eternal.","The Nautilus has 26 ultra-private beach and overwater homes, each with a luxurious master suite, separate dining space, expansive sundeck, and private pool. These bohemian, suite-style sanctuaries each come with private butler service and are steps away from azure seas."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 2069, 'K4RmfjxrmyY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'the-nautilus-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'the-nautilus-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'thiladhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'the-nautilus-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach House', 2262, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'the-nautilus-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean House', 2069, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'the-nautilus-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- paradise
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'paradise-island-resort-maldives', 'Paradise Island Resort Maldives', 'This is paradise, or more precisely, Paradise Island Resort & Spa, an uncompromising haven of luxury and convenience. A network of paved pathways runs through the lush grounds, linking oceanfront accommodations, gourmet dining spots, sports facilities, and an inspiring spa, all of which contribute to making your Maldives island resort vacation everything you want it to be.', 'published', 'Paradise Island Resort Maldives | Maldives Resorts | MTG', 'This is paradise, or more precisely, Paradise Island Resort & Spa, an uncompromising haven of luxury and convenience. A network of paved pathways runs through the lush grounds, linking oceanfront accommodations, gourmet dining spots, sports facilities, and an inspiring spa, all of which contribute to making your Maldives island resort vacation everything you want it to be.', '{"overview_paragraphs":["This is paradise, or more precisely, Paradise Island Resort & Spa, an uncompromising haven of luxury and convenience. A network of paved pathways runs through the lush grounds, linking oceanfront accommodations, gourmet dining spots, sports facilities, and an inspiring spa, all of which contribute to making your Maldives island resort vacation everything you want it to be.","Paradise Island Resort offers 282 beautifully appointed guest rooms and suites in a casual luxury and luxurious environment. The resort has an outdoor pool, four bars, and a salon with many amenities."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 204, '6DZ5G4PYy3Y', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'paradise-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'paradise-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'lankanfinolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'paradise-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 204, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'paradise-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 271, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'paradise-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 496, 'USD', 'King', 2, 2
from nodes where node_type = 'accommodation' and slug = 'paradise-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- summer-island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'summer-island-resort-maldives', 'Summer Island Resort Maldives', 'Summer Island Maldives mixes a barefoot beach lifestyle with all the amenities of a beach. The resort, which is owned and operated locally, has been meticulously designed to have a truly Maldivian experience.', 'published', 'Summer Island Resort Maldives | Maldives Resorts | MTG', 'Summer Island Maldives mixes a barefoot beach lifestyle with all the amenities of a beach. The resort, which is owned and operated locally, has been meticulously designed to have a truly Maldivian experience.', '{"overview_paragraphs":["Summer Island Maldives mixes a barefoot beach lifestyle with all the amenities of a beach. The resort, which is owned and operated locally, has been meticulously designed to have a truly Maldivian experience.","Summer Island''s rooms are light and airy, with zesty interiors and plenty of space to spread out and lounge. Each space and villa has open balconies or verandas that look out onto a spectacular summer sunrise or sunset."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 153, 'kZCfEKeP9dM', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'summer-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'summer-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'ziyaaraifushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'summer-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Garden Villa', 153, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'summer-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 216, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'summer-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 332, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'summer-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- vommuli
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'the-st-regis-vommuli-island-resort-maldives', 'The St. Regis Vommuli Island Resort Maldives', 'The St. Regis Maldives Vommuli Resort overlooks the alluring waves of the Indian Ocean, nestled between verdant rain forest and white-sand beaches on a private island. Explore the quiet, eco-friendly setting''s tropical beauty and abundant marine life. The Iridium Spa and outdoor swimming pool, as well as the private lagoon, offer unrivaled relaxation. At the beach, there is a wide range of water sports and excursions. The butlers, the diving center''s signature operation, will arrange a wide range of water sports and excursions. In addition, their six restaurants and bars serve delectable cuisine.', 'published', 'The St. Regis Vommuli Island Resort Maldives | Maldives Resorts | MTG', 'The St. Regis Maldives Vommuli Resort overlooks the alluring waves of the Indian Ocean, nestled between verdant rain forest and white-sand beaches on a private island. Explore the quiet, eco-friendly setting''s tropical beauty and abundant marine life. The Iridium Spa and outdoor swimming pool, as well as the private lagoon, offer unrivaled relaxation. At the beach, there is a wide range of water sports and excursions. The butlers, the diving center''s signature operation, will arrange a wide range of water sports and excursions. In addition, their six restaurants and bars serve delectable cuisine.', '{"overview_paragraphs":["The St. Regis Maldives Vommuli Resort overlooks the alluring waves of the Indian Ocean, nestled between verdant rain forest and white-sand beaches on a private island. Explore the quiet, eco-friendly setting''s tropical beauty and abundant marine life. The Iridium Spa and outdoor swimming pool, as well as the private lagoon, offer unrivaled relaxation. At the beach, there is a wide range of water sports and excursions. The butlers, the diving center''s signature operation, will arrange a wide range of water sports and excursions. In addition, their six restaurants and bars serve delectable cuisine.","Each of the 33 on-land and 44 over-water villas at St. Regis Maldives Vommuli Resort offers picturesque ocean or garden views from private terraces and pools, as well as refined furnishings and island-inspired architecture. The legendary Butlers of the St. Regis provide personalized service at all hours of the day and night."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 763, 'SrtYhHoTGfw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'the-st-regis-vommuli-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'the-st-regis-vommuli-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'vommuli'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'the-st-regis-vommuli-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Garden Pool Villa', 763, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'the-st-regis-vommuli-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 859, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'the-st-regis-vommuli-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Pool Villa', 910, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'the-st-regis-vommuli-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- w-maldives
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'w-maldives-island-resort-maldives', 'W Maldives Island Resort Maldives', 'W Maldives is a wonderland of white sand beaches, turquoise lagoons, and stunning reefs where you can relax, mingle, dance, and enhance your paradise adventure. W Maldives is a peaceful haven with a Diving Center, Fitness Center, and open-air Infinity Pool. Expansive Villas come with a private plunge pool and direct beach, lagoon, or ocean entry. AWAY® Spa, which offers massage, Ayurvedic, and facial treatments, is a haven of indulgence. Water Sports, Yoga, and Aqua Aerobics are among the activities available to visitors.', 'published', 'W Maldives Island Resort Maldives | Maldives Resorts | MTG', 'W Maldives is a wonderland of white sand beaches, turquoise lagoons, and stunning reefs where you can relax, mingle, dance, and enhance your paradise adventure. W Maldives is a peaceful haven with a Diving Center, Fitness Center, and open-air Infinity Pool. Expansive Villas come with a private plunge pool and direct beach, lagoon, or ocean entry. AWAY® Spa, which offers massage, Ayurvedic, and facial treatments, is a haven of indulgence. Water Sports, Yoga, and Aqua Aerobics are among the activities available to visitors.', '{"overview_paragraphs":["W Maldives is a wonderland of white sand beaches, turquoise lagoons, and stunning reefs where you can relax, mingle, dance, and enhance your paradise adventure. W Maldives is a peaceful haven with a Diving Center, Fitness Center, and open-air Infinity Pool. Expansive Villas come with a private plunge pool and direct beach, lagoon, or ocean entry. AWAY® Spa, which offers massage, Ayurvedic, and facial treatments, is a haven of indulgence. Water Sports, Yoga, and Aqua Aerobics are among the activities available to visitors.","On W Maldives, there are 78 different Retreats to choose from. There are 28 land-based Beach Oasis, including three twin Beach Oasis; 25 over-water Ocean Oasis and 21 Ocean Oasis Lagoon View Retreats; 3 Seascape Escapes, our Junior Suites; and one Extreme WOW Villa, the 2-Bedroom Ocean Haven."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 728, 'dVPW7ifhylg', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'w-maldives-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'w-maldives-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'fesdu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'w-maldives-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 824, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'w-maldives-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Pool Villa', 728, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'w-maldives-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Amra-Palace
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'amra-palace-island-hotel-maldives', 'Amra Palace Island Hotel Maldives', 'Amra Palace is a private gated residence surrounded by lush tropical gardens. It is the ideal setting for unwinding, relaxing, and enjoying the Maldives'' natural beauty. The friendly staff at Amra Hotel can arrange you a variety of activities such as diving, snorkelling, island hopping, and dolphin watching, while the in-house restaurant serves local and foreign cuisine. In-room eating is also available through room service.', 'published', 'Amra Palace Island Hotel Maldives | Maldives Hotels | MTG', 'Amra Palace is a private gated residence surrounded by lush tropical gardens. It is the ideal setting for unwinding, relaxing, and enjoying the Maldives'' natural beauty. The friendly staff at Amra Hotel can arrange you a variety of activities such as diving, snorkelling, island hopping, and dolphin watching, while the in-house restaurant serves local and foreign cuisine. In-room eating is also available through room service.', '{"overview_paragraphs":["Amra Palace is a private gated residence surrounded by lush tropical gardens. It is the ideal setting for unwinding, relaxing, and enjoying the Maldives'' natural beauty. The friendly staff at Amra Hotel can arrange you a variety of activities such as diving, snorkelling, island hopping, and dolphin watching, while the in-house restaurant serves local and foreign cuisine. In-room eating is also available through room service.","The rooms of Amra Palace are divided into two categories: deluxe and outstanding. Superior rooms are located on the first level and are big and pleasant, as well as equipped with all modern comforts. Deluxe rooms are on the ground level and enjoy a beautiful view of the Amra Palace grounds and gardens. Amra Palace can also accommodate families, with twin beds and interconnecting rooms available.","Amra Palace is located in a vibrant and dynamic local community and is accessible through a 35-minute flight from Velana International Airport to Kaddhoo Domestic Airport and a 10-minute car ride. It is ideally located a 5-minute walk from one of the Gan Atoll''s nicest, most opulent, and prettiest beaches."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'hotel', null, null, 'BNO2diluGHE', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'amra-palace-island-hotel-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'amra-palace-island-hotel-maldives'
  and l.node_type = 'location' and l.slug = 'gan'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'amra-palace-island-hotel-maldives'
on conflict (id) do nothing;

-- casa-retreat
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'casa-retreat', 'casa-retreat', 'Casa Retreat is an ideal place to stay in Male City and Airport for travelers seeking beauty, comfort, and convenience. This is a convenient property that is near to the airport and easily accessible from both Male'' and Hulhumale''. The hotel has its own spa, which will deliver a 1-hour spa treatment at a reduced rate, as well as other excursions.', 'published', 'casa-retreat | Maldives Guesthouses | MTG', 'Casa Retreat is an ideal place to stay in Male City and Airport for travelers seeking beauty, comfort, and convenience. This is a convenient property that is near to the airport and easily accessible from both Male'' and Hulhumale''. The hotel has its own spa, which will deliver a 1-hour spa treatment at a reduced rate, as well as other excursions.', '{"overview_paragraphs":["Casa Retreat is an ideal place to stay in Male City and Airport for travelers seeking beauty, comfort, and convenience. This is a convenient property that is near to the airport and easily accessible from both Male'' and Hulhumale''. The hotel has its own spa, which will deliver a 1-hour spa treatment at a reduced rate, as well as other excursions.","Hotel have excellent services and amenities, ensuring that you have a pleasant stay. The hotel offers complimentary Wi-Fi in all rooms, as well as daily housekeeping and a restaurant. Some facilities, such as \"things to do and ways to relax,\" are available outside of the accommodation."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'guesthouse', null, 67, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'casa-retreat'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'casa-retreat'
  and l.node_type = 'location' and l.slug = 'hulhumale'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'casa-retreat'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Standard Room', 67, 'USD', null, null, 0
from nodes where node_type = 'accommodation' and slug = 'casa-retreat'
on conflict (accommodation_id, name) do nothing;

-- gaafaru-view-inn-maldives
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'gaafari-view-inn-hotel-maldives', 'Gaafari view inn Hotel Maldives', 'Gaafaru View Inn is a three-star Guest House in the Maldives. The guest house provides guests with 7 air-conditioned rooms with private bathrooms and balconies, 1 main restaurant, as well as a variety of excursions, private dining experiences, and local culture. Our restaurant serves both regional and foreign cuisine.', 'published', 'Gaafari view inn Hotel Maldives | Maldives Guesthouses | MTG', 'Gaafaru View Inn is a three-star Guest House in the Maldives. The guest house provides guests with 7 air-conditioned rooms with private bathrooms and balconies, 1 main restaurant, as well as a variety of excursions, private dining experiences, and local culture. Our restaurant serves both regional and foreign cuisine.', '{"overview_paragraphs":["Gaafaru View Inn is a three-star Guest House in the Maldives. The guest house provides guests with 7 air-conditioned rooms with private bathrooms and balconies, 1 main restaurant, as well as a variety of excursions, private dining experiences, and local culture. Our restaurant serves both regional and foreign cuisine.","The Gaafaru View Inn is situated on one of the Maldives'' major lagoons. Gaafaru View inn Maldives, which is situated on a big lagoon with numerous snorkeling and diving areas, strives to give visitors a taste of the Maldives underwater beauty through a variety of organized trips to neighboring locations. Every day, turtles, manta rays, sharks, and dolphins can be spotted in these areas.","The Gaafaru Bikini Beach is only 2 minutes away from Gaafaru View Inn. Gaafaru View Inn attempts to deliver all you may want from a Maldives vacation at an inexpensive price, including white sand beaches, swaying palm trees, golden sunset views, and colorful corals and fish beneath the lagoon.","Gaafaru is one of Kaafu Atoll''s inhabited islands, as well as the lone island of the Gaafaru natural atoll. As the name suggests, Gaafaru refers to corals and Faru refers to reefs. On a nearby pristine island, see how the local Maldivians live. It''s a little fishing village in the Maldives. You will get a really private holiday experience, as it will not be overcrowded. The population of Gaafaru is estimated to be around 1500 people, with fishing being their primary source of income. As a result, the harbor is home to a variety of fishing boats ranging in size from 25 to 90 feet. The land area is estimated to be 17.2 hectares"]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'guesthouse', 3, 40, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'gaafari-view-inn-hotel-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'gaafari-view-inn-hotel-maldives'
  and l.node_type = 'location' and l.slug = 'gaafaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'gaafari-view-inn-hotel-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Room', 40, 'USD', null, null, 0
from nodes where node_type = 'accommodation' and slug = 'gaafari-view-inn-hotel-maldives'
on conflict (accommodation_id, name) do nothing;

-- island-break-fulidhoo
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'island-break-fulidhoo-maldives', 'Island Break Fulidhoo Maldives', 'OurHotel is located in vaavu atoll Fulidhoo. Located 1 hour away from the Male international airport.The hotel is owned and run by 3 three young enthusiastic brothers. The Hotel islocated at the east end of the island, Which give our guest maximum privacy from the locals.The hotel is featuredwith an onsite restaurant, our restaurant is set up to provide an expectational service and quality food to our clients. Where they got to eat daily fresh Catchor seafood platters and so on, Our hotel consists of 7 Rooms and also providing an expectational day out activities like, Swimming with dolphins, mantas, Snorkeling withturtle, Snorkeling with Nurse Sharks and other snorkeling points, Day out tosandbanks, Visiting Ship Wrack.', 'published', 'Island Break Fulidhoo Maldives | Maldives Guesthouses | MTG', 'OurHotel is located in vaavu atoll Fulidhoo. Located 1 hour away from the Male international airport.The hotel is owned and run by 3 three young enthusiastic brothers. The Hotel islocated at the east end of the island, Which give our guest maximum privacy from the locals.The hotel is featuredwith an onsite restaurant, our restaurant is set up to provide an expectational service and quality food to our clients. Where they got to eat daily fresh Catchor seafood platters and so on, Our hotel consists of 7 Rooms and also providing an expectational day out activities like, Swimming with dolphins, mantas, Snorkeling withturtle, Snorkeling with Nurse Sharks and other snorkeling points, Day out tosandbanks, Visiting Ship Wrack.', '{"overview_paragraphs":["OurHotel is located in vaavu atoll Fulidhoo. Located 1 hour away from the Male international airport.The hotel is owned and run by 3 three young enthusiastic brothers. The Hotel islocated at the east end of the island, Which give our guest maximum privacy from the locals.The hotel is featuredwith an onsite restaurant, our restaurant is set up to provide an expectational service and quality food to our clients. Where they got to eat daily fresh Catchor seafood platters and so on, Our hotel consists of 7 Rooms and also providing an expectational day out activities like, Swimming with dolphins, mantas, Snorkeling withturtle, Snorkeling with Nurse Sharks and other snorkeling points, Day out tosandbanks, Visiting Ship Wrack."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'guesthouse', null, 65, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'island-break-fulidhoo-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'island-break-fulidhoo-maldives'
  and l.node_type = 'location' and l.slug = 'fulidhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'island-break-fulidhoo-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ground Room', 65, 'USD', 'Double', null, 0
from nodes where node_type = 'accommodation' and slug = 'island-break-fulidhoo-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Luxury Coconut Suit with Balcony', 75, 'USD', 'Double', null, 1
from nodes where node_type = 'accommodation' and slug = 'island-break-fulidhoo-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Luxury Coconut Suit Triple Room with Balcony', 85, 'USD', 'Triple', null, 2
from nodes where node_type = 'accommodation' and slug = 'island-break-fulidhoo-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Luxury Coconut Suit with Balcony Twin Room', 75, 'USD', 'Double', null, 3
from nodes where node_type = 'accommodation' and slug = 'island-break-fulidhoo-maldives'
on conflict (accommodation_id, name) do nothing;

-- maagiri
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'maagiri-hotel-male-maldives', 'Maagiri Hotel Male Maldives', 'The Maagiri Hotel is conveniently located across the street from the Hulhumale'' Ferry Terminal in the capital Male''. Maagiri offers a 4-star accommodation to compliment its excellent service, set against a scenic backdrop of the surrounding ocean and a few of the Maldives'' many islands.', 'published', 'Maagiri Hotel Male Maldives | Maldives Hotels | MTG', 'The Maagiri Hotel is conveniently located across the street from the Hulhumale'' Ferry Terminal in the capital Male''. Maagiri offers a 4-star accommodation to compliment its excellent service, set against a scenic backdrop of the surrounding ocean and a few of the Maldives'' many islands.', '{"overview_paragraphs":["The Maagiri Hotel is conveniently located across the street from the Hulhumale'' Ferry Terminal in the capital Male''. Maagiri offers a 4-star accommodation to compliment its excellent service, set against a scenic backdrop of the surrounding ocean and a few of the Maldives'' many islands.","Maagiri has four different types of rooms, each with elegant interiors, luxury amenities, and panoramic views of the Maldivian seas."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'hotel', 4, 220, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'maagiri-hotel-male-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'maagiri-hotel-male-maldives'
  and l.node_type = 'location' and l.slug = 'male'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'maagiri-hotel-male-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Premier Room', 220, 'USD', 'Double', null, 0
from nodes where node_type = 'accommodation' and slug = 'maagiri-hotel-male-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Junior Suit', 228, 'USD', null, null, 1
from nodes where node_type = 'accommodation' and slug = 'maagiri-hotel-male-maldives'
on conflict (accommodation_id, name) do nothing;

-- mantha-view-hotel
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'mantha-view-hotel-maldives', 'Mantha view Hotel Maldives', 'The Maldives'' Manta View Guest House is located in Vaavu, Keyodhoo. It includes five rooms, each with a double bed and a toilet. There are four rooms with air conditioning. We provide the following activities: Snorkeling with a professional guide [sandbanks and reefs] Snorkeling for half a day Fishing for the entire day Fishing in the morning Fishing at night Bivacco journey Trip to the Alimatha Resort', 'published', 'Mantha view Hotel Maldives | Maldives Guesthouses | MTG', 'The Maldives'' Manta View Guest House is located in Vaavu, Keyodhoo. It includes five rooms, each with a double bed and a toilet. There are four rooms with air conditioning. We provide the following activities: Snorkeling with a professional guide [sandbanks and reefs] Snorkeling for half a day Fishing for the entire day Fishing in the morning Fishing at night Bivacco journey Trip to the Alimatha Resort', '{"overview_paragraphs":["The Maldives'' Manta View Guest House is located in Vaavu, Keyodhoo. It includes five rooms, each with a double bed and a toilet. There are four rooms with air conditioning. We provide the following activities: Snorkeling with a professional guide [sandbanks and reefs] Snorkeling for half a day Fishing for the entire day Fishing in the morning Fishing at night Bivacco journey Trip to the Alimatha Resort","When visiting the Maldives Islands, Keyodhoo Manta View Guest House, which offers exceptional accommodation and excellent service, will make you feel right at home. Guests will have easy access to everything the vibrant city has to offer from here. The hotel''s ideal location allows guests to easily access the city''s must-see attractions. This Maldives Islands hotel offers an abundance of exceptional services and amenities. On-site amenities include 24-hour room service, daily housekeeping, portable wi-fi rental, luggage storage, and valet parking for hotel guests. During your visit, you will have access to high-quality room amenities.","Towels, air conditioning, wireless internet connection (fees apply), shower, and washing machine are available in some rooms to let guests unwind after a hard day. Top-notch recreational facilities such as snorkeling, private beach, and fishing will keep you amused whether you''re a fitness fanatic or simply searching for a way to unwind after a long day. Keyodhoo Manta View Guest House is a fantastic choice for your stay in the Maldives Islands, whatever your reason for visiting."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'guesthouse', null, 40, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'mantha-view-hotel-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'mantha-view-hotel-maldives'
  and l.node_type = 'location' and l.slug = 'keyodhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'mantha-view-hotel-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Room', 40, 'USD', null, null, 0
from nodes where node_type = 'accommodation' and slug = 'mantha-view-hotel-maldives'
on conflict (accommodation_id, name) do nothing;

-- reveries-village
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'reveries-village', 'reveries-village', 'Reveries Diving Village proudly opened its doors as Laamu’s first guest house, in the heart of the atoll. The aim was to invite the world to experience the culture and beauty of Dhivehi island society at an affordable price. Our pioneering venture found its home on Gan, the longest island in the country, at the northern end of the Thundi village. From here, Reveries has gone from strength to strength, combining vibrant island culture and stunning natural environment with comfort and luxury for guests who wish to sample all the Maldives has to offer. A typical day with Reveries might take you from the comfort of your room, out past our private beach, snorkeling over the reef and diving down into the pristine lagoon. The next morning, you can let our guides take you on a tour of their island and relax in our rooftop spa before a candlelit dinner in our verdant garden. Reveries is a gateway to the precious underwater kingdom and best surfing experience. It’s your paradise.', 'published', 'reveries-village | Maldives Guesthouses | MTG', 'Reveries Diving Village proudly opened its doors as Laamu’s first guest house, in the heart of the atoll. The aim was to invite the world to experience the culture and beauty of Dhivehi island society at an affordable price. Our pioneering venture found its home on Gan, the longest island in the country, at the northern end of the Thundi village. From here, Reveries has gone from strength to strength, combining vibrant island culture and stunning natural environment with comfort and luxury for guests who wish to sample all the Maldives has to offer. A typical day with Reveries might take you from the comfort of your room, out past our private beach, snorkeling over the reef and diving down into the pristine lagoon. The next morning, you can let our guides take you on a tour of their island and relax in our rooftop spa before a candlelit dinner in our verdant garden. Reveries is a gateway to the precious underwater kingdom and best surfing experience. It’s your paradise.', '{"overview_paragraphs":["Reveries Diving Village proudly opened its doors as Laamu’s first guest house, in the heart of the atoll. The aim was to invite the world to experience the culture and beauty of Dhivehi island society at an affordable price. Our pioneering venture found its home on Gan, the longest island in the country, at the northern end of the Thundi village. From here, Reveries has gone from strength to strength, combining vibrant island culture and stunning natural environment with comfort and luxury for guests who wish to sample all the Maldives has to offer. A typical day with Reveries might take you from the comfort of your room, out past our private beach, snorkeling over the reef and diving down into the pristine lagoon. The next morning, you can let our guides take you on a tour of their island and relax in our rooftop spa before a candlelit dinner in our verdant garden. Reveries is a gateway to the precious underwater kingdom and best surfing experience. It’s your paradise."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'guesthouse', null, 65, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'reveries-village'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'reveries-village'
  and l.node_type = 'location' and l.slug = 'gan'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'reveries-village'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Room', 65, 'USD', 'King', 2, 0
from nodes where node_type = 'accommodation' and slug = 'reveries-village'
on conflict (accommodation_id, name) do nothing;

-- rosemery-maafushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'rosemery-maafushi', 'rosemery-maafushi', 'Rosemary Boutique is a boutique on the beautiful island of Maafushi that offers a variety of events and thrilling journeys for visitors. Maafushi island is 24 kilometers from the airport and is easily accessible all over the island.', 'published', 'rosemery-maafushi | Maldives Hotels | MTG', 'Rosemary Boutique is a boutique on the beautiful island of Maafushi that offers a variety of events and thrilling journeys for visitors. Maafushi island is 24 kilometers from the airport and is easily accessible all over the island.', '{"overview_paragraphs":["Rosemary Boutique is a boutique on the beautiful island of Maafushi that offers a variety of events and thrilling journeys for visitors. Maafushi island is 24 kilometers from the airport and is easily accessible all over the island.","There are a variety of rooms available, ranging from simple double rooms to suites with modern amenities. There are a total of 22 rooms available to accommodate all travel classes."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'hotel', null, 44, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'rosemery-maafushi'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'rosemery-maafushi'
  and l.node_type = 'location' and l.slug = 'maafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'rosemery-maafushi'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Double Balcony Room', 44, 'USD', 'Double', null, 0
from nodes where node_type = 'accommodation' and slug = 'rosemery-maafushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Tripple Balcony Room', 52, 'USD', 'Maximum', null, 1
from nodes where node_type = 'accommodation' and slug = 'rosemery-maafushi'
on conflict (accommodation_id, name) do nothing;

-- surfview-male
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'surfview-hotel-male-maldives', 'Surfview Hotel Male Maldives', 'The hotel has spectacular sea and city views and is located on the seafront with 11 signature rooms that offer comfort and connectivity. Surfview Raalhugandhu is centrally located in Male'' City, just a short walk from banks, parks, and souvenir shops.', 'published', 'Surfview Hotel Male Maldives | Maldives Guesthouses | MTG', 'The hotel has spectacular sea and city views and is located on the seafront with 11 signature rooms that offer comfort and connectivity. Surfview Raalhugandhu is centrally located in Male'' City, just a short walk from banks, parks, and souvenir shops.', '{"overview_paragraphs":["The hotel has spectacular sea and city views and is located on the seafront with 11 signature rooms that offer comfort and connectivity. Surfview Raalhugandhu is centrally located in Male'' City, just a short walk from banks, parks, and souvenir shops.","Surfview Raalhugandhu has 11 signature rooms that will provide guests with the best in service and comfort."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'guesthouse', null, 64, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'surfview-hotel-male-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'surfview-hotel-male-maldives'
  and l.node_type = 'location' and l.slug = 'male'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'surfview-hotel-male-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Superior Room', 64, 'USD', null, null, 0
from nodes where node_type = 'accommodation' and slug = 'surfview-hotel-male-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sea View Room', 93, 'USD', null, null, 1
from nodes where node_type = 'accommodation' and slug = 'surfview-hotel-male-maldives'
on conflict (accommodation_id, name) do nothing;

-- Enriching already-seeded Task 5 accommodations with this round's
-- real price/video/room/overview data (same physical resorts — see
-- mergeIntoExistingSlug in merge-accommodation-research.mjs).
-- Baros-Island -> baros-maldives
update accommodations set
  price_from = coalesce(accommodations.price_from, 780),
  video_youtube_id = coalesce(accommodations.video_youtube_id, '9NssgRLiKF8')
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'baros-maldives';

update nodes set attributes = attributes || '{"overview_paragraphs":["Turquoise seas lap against white-sand beaches. Palm trees rustle in the breeze. Welcome to Baros, a lush island canopy natural paradise about 25 minutes by speedboat from the Maldives'' international airport. We''ve been greeting visitors since 1973, and we''ve spent decades polishing our services and developing our surroundings to create what we feel to be a renowned resort. Today, we''re one of the most popular Maldives resorts, and we can''t wait to show you what makes us so unique.","Unrivaled in its attention to detail, Baros creates really transformative experiences by putting the individual first, customising to their specific needs and expectations in a spirit of true generosity. Allow us to contact you in order to design your Maldives vacation.","The lavish furniture and unique artworks in this enormous property create a warm and welcome atmosphere. A private pool is bordered by tropical flowers in the garden courtyard, and a front balcony leads to your own length of Baros beach. Butler service is available 24 hours a day, seven days a week, ensuring that you have whatever you need, when you need it.","Turquoise seas lap against white-sand beaches. Palm trees rustle in the breeze. A beautiful island canopy in a natural wonderland within 25 minutes by speedboat from the Maldives'' international airport. We''ve been greeting visitors since 1973, and we''ve spent decades perfecting our services and nurturing our surroundings.","Take a supper cruise for two on a dhoni. Or, for a special gourmet supper, come to the Piano Deck with your own private chef. Alternatively, enjoy the sunset with cocktails and canapés at The Lighthouse. Every meal is yours to savour at these gourmet restaurants in Baros, and every mouthful is meant to inspire. For more than 40 years, we''ve been working to refine classic meals while experimenting with new techniques and ingredients from across the world. From opulent buffet breakfasts by the pool to exquisite dining at the famed Lighthouse, each meal is another chance to indulge in a favourite or try something new.","Serenity Spa, a haven of relaxation and a sanctuary nestled in the forest, welcomes you into a world of luxurious spa and beauty rituals. You can come here to unwind for a few hours or to create a personalised wellness journey with a series of daily treatments. From daily yoga classes to therapeutic massage, everything here is geared to help you regain your balance and find your peace. Request a yoga session anywhere on the island for something out of the usual, or get a soothing massage in the privacy of your comfy home."]}'::jsonb
where node_type = 'accommodation' and slug = 'baros-maldives' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Villa', 780, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'baros-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 1100, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'baros-maldives'
on conflict (accommodation_id, name) do nothing;

-- Gili-Lankanfushi -> gili-lankanfushi
update accommodations set
  price_from = coalesce(accommodations.price_from, 1600),
  video_youtube_id = coalesce(accommodations.video_youtube_id, 'Xx61PgIeXRA')
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'gili-lankanfushi';

update nodes set attributes = attributes || '{"overview_paragraphs":["With sustainably designed homes hanging above turquoise seas that reach as far as the eye can see, our exclusive island refuge provides peace by design. Spend your days doing anything you want—snorkeling, relaxing at the spa, sailing on a catamaran—and don''t be afraid to ask for help and guidance from our helpful staff. Nourish your body with locally produced products and worldwide cuisines, enjoy the sunset from your rustic-luxe villa, and fall asleep with the moon shining gloriously in the sky.","These 18 one-bedroom retreats are ideal for couples. Each apartment has an open-air living area, a huge bathroom, and a separate rooftop terrace from which to take in the vistas. Spend your days swimming and snorkelling in the coral gardens at the base of your sundeck, which has direct ocean access. At night, relax on catamaran nets while watching the sky.","Our five overwater Gili Lagoon Villas face west and provide breathtaking sunset views. The one-bedroom hideaways with thatched roofs are split across two storeys and include open-air living spaces, big bathrooms, and private rooftop terraces. Relax on the deck or swim out to your own own water hammock. You may pass by eagle rays, reef sharks, and shoals of luminous fish.","The Family Villa, perched at the end of our Western-facing jetty, is an open-air paradise with unrivalled views of the surrounding seascape. The main bedroom has an en-suite bathroom as well as an outdoor tub and shower. Two huge, air-conditioned living areas offer plenty of living (and sleeping) space. When you''re not napping off in the sun, take use of your own gym, steam room, or rooftop Jacuzzi. Alternatively, venture off the quiet Three Palm Island to relax in a magnificent cabana.","45 rustic-chic thatched villas float over the clear lagoon waters of Gili Lankanfushi in the Maldives. Many are linked to wooden jetties that extend from a little island, while others stand alone in the water. Simple, yet magnificent abodes (all created from sustainable materials) can serve as the ideal foundation for any modern-day Robinson Crusoe trip.","Gili Lankanfushi Maldives, perched above the Indian Ocean, offers exquisite accommodation near to the sun and water. Gili Lankanfushi Maldives is located on the private island of Lankanfushi in Male Atoll, a 20-minute speedboat journey from Male International Airport."]}'::jsonb
where node_type = 'accommodation' and slug = 'gili-lankanfushi' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Villa Suite', 1600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'gili-lankanfushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Gili Lagoon Villa', 1800, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'gili-lankanfushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Family Villa', 4000, 'USD', 'King', 9, 2
from nodes where node_type = 'accommodation' and slug = 'gili-lankanfushi'
on conflict (accommodation_id, name) do nothing;

-- Kurumba -> kurumba-maldives
update accommodations set
  price_from = coalesce(accommodations.price_from, 300),
  video_youtube_id = coalesce(accommodations.video_youtube_id, '8ODifdytxy4')
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'kurumba-maldives';

update nodes set attributes = attributes || '{"overview_paragraphs":["Kurumba Maldives welcomes you. A Maldives island resort with more to offer than sun, sand, and water! A resort full of surprises, engaging activities, energetic entertainment, and friendly people that will make your Maldives vacation that much more memorable. Kurumba is appropriate for guests of all ages. We are glad to offer couples, honeymooners, friends, families, and small groups with a grin and a splash of Maldivian charm via our choice of entertainment, facilities, activities, and social events.","Accommodation that is both spacious and reasonably priced. Walk onto the beach, the water beneath your feet and Malé in the distance.","A huge pool villa with a large balcony. An open-plan area with views of the Maldives ocean on the east and seclusion and excellent lagoon on the west.","Kurumba Maldives provides classic modern style with character and thoughtful touches in 8 different room types.","Make every opportunity count. We are only a 10-minute speedboat trip from Velana International Airport (open 24 hours), so you may be on the beach with a beverage in hand within seconds of landing.","Veli Spa is a real Maldivian experience, set among beautiful grounds. While embracing contemporary therapies, our Spa is inspired by the tranquillity of the Maldives Islands, the balance of the waters, the vitality of the Maldivian indigenous people, and the healing powers of human touch."]}'::jsonb
where node_type = 'accommodation' and slug = 'kurumba-maldives' and not (attributes ? 'overview_paragraphs');

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Superior Room', 300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'kurumba-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Pool Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'kurumba-maldives'
on conflict (accommodation_id, name) do nothing;

-- Six-Senses-Laamu -> six-senses-laamu
update accommodations set
  price_from = coalesce(accommodations.price_from, 1000),
  video_youtube_id = coalesce(accommodations.video_youtube_id, 'nR4SchedAl8')
from nodes n where n.id = accommodations.id and n.node_type = 'accommodation' and n.slug = 'six-senses-laamu';
