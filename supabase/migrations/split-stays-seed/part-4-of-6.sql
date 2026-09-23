-- Part 4 of 6 - run this in the Supabase SQL Editor AFTER the previous parts.
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

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'oblu-xperience-ailafushi-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'ailafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'oblu-xperience-ailafushi-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 500, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'oblu-xperience-ailafushi-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 500, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'oblu-xperience-ailafushi-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- OZEN-LIFE-MAADHOO
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'ozen-life-maadhoo-maldives-island-resort', 'Ozen Life Maadhoo Maldives Island Resort', 'The first OZEN resort, a favourite among Maldives 5 star resorts, OZEN LIFE MAADHOO, is a serene palm-painted paradise of luxury located in the beautiful turquoise colours of South Malé Atoll. The resort provides exciting experiences and a dynamic island lifestyle, with 94 tastefully built villas and one unique Residence. An exquisite Maldives stay combines all the characteristics of an ultra-luxe vacation, from underwater dining at M6m to adrenaline ocean excursions.', 'published', 'Ozen Life Maadhoo Maldives Island Resort | Maldives Resorts | MTG', 'The first OZEN resort, a favourite among Maldives 5 star resorts, OZEN LIFE MAADHOO, is a serene palm-painted paradise of luxury located in the beautiful turquoise colours of South Malé Atoll. The resort provides exciting experiences and a dynamic island lifestyle, with 94 tastefully built villas and one unique Residence. An exquisite Maldives stay combines all the characteristics of an ultra-luxe vacation, from underwater dining at M6m to adrenaline ocean excursions.', '{"overview_paragraphs":["The first OZEN resort, a favourite among Maldives 5 star resorts, OZEN LIFE MAADHOO, is a serene palm-painted paradise of luxury located in the beautiful turquoise colours of South Malé Atoll. The resort provides exciting experiences and a dynamic island lifestyle, with 94 tastefully built villas and one unique Residence. An exquisite Maldives stay combines all the characteristics of an ultra-luxe vacation, from underwater dining at M6m to adrenaline ocean excursions.","Elegant, vibrant, and inviting. The Earth Villas are a cheerful and small beach holiday property. Bask in the assurance of Refined Elegance at these 185m2 stand-alone villas, which have a beautiful tropical garden that opens onto a relaxing, white, fine sandy beach and blue ocean waves. A balmy island atmosphere is created by high-pitched roofs, massive panoramic windows, open spaces, and trendy interiors done up in warm and bright colours. Each villa features a large sun terrace as well as a large outdoor bathroom with a handmade bathtub and a monsoon shower—a wonderfully refreshing vacation!","The Earth Villas with Pool is a Maldives villa that has all of the facilities of the Earth Villas as well as two more features for an even more luxurious vacation! The first is a 20-square-metre infinity pool with ambient underwater lighting. The other is stunning lagoon views, complete with a front-row ticket to the Maldivian sunset!","New, romantic, and inspiring! There are 24 charming 112 m2 Wind Villas located along the lagoon to the north of Maadhoo Island. They are built on stilts over the ocean and offer ultimate island life, which is often described as pleasant, romantic, and inspirational. Their stylish tropical décor and exquisite interiors provide a welcoming living place. The beautiful facilities, complete with free-standing elliptical bathtubs and unobstructed views of the horizon, provide for a profoundly pleasurable experience.","OZEN LIFE MAADHOO has 90 private villas in 6 categories, positioned overwater and beachfront, as well as a luxury superyacht. Each villa has its own private pool as well as direct beach or lagoon access. They provide visitors with the ultimate in luxury in massive vacation homes in the most beautiful places on the island. The opulent architecture, premium facilities, and exclusive services provide guests with an out-of-this-world experience.","Maadhoo Island is located in a remote area of the South Malé atoll. The island is reached by a 40-minute speedboat journey from Velana International Airport."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1120, 'UYUayGwigOI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'ozen-life-maadhoo-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'ozen-life-maadhoo-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'maadhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'ozen-life-maadhoo-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Earth Villa', 1150, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'ozen-life-maadhoo-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Earth Pool Villa', 1400, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'ozen-life-maadhoo-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Wind Villa', 1120, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'ozen-life-maadhoo-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- One-and-Only
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'one-only-reethi-rah-maldives-island-resort', 'One & Only Reethi Rah Maldives Island Resort', 'This Christmas season, One&Only Reethi Rah transforms into a Sparkling Wonderland, inspired by our pristine white beach surrounding by the sun-kissed Indian Ocean. The resort is bustling with entertainment, parties, and music, from acrobats to a 15-piece showband, fire dancers, and fairy ballerinas.', 'published', 'One & Only Reethi Rah Maldives Island Resort | Maldives Resorts | MTG', 'This Christmas season, One&Only Reethi Rah transforms into a Sparkling Wonderland, inspired by our pristine white beach surrounding by the sun-kissed Indian Ocean. The resort is bustling with entertainment, parties, and music, from acrobats to a 15-piece showband, fire dancers, and fairy ballerinas.', '{"overview_paragraphs":["This Christmas season, One&Only Reethi Rah transforms into a Sparkling Wonderland, inspired by our pristine white beach surrounding by the sun-kissed Indian Ocean. The resort is bustling with entertainment, parties, and music, from acrobats to a 15-piece showband, fire dancers, and fairy ballerinas.","Each one-bedroom villa has a king-size bed and a large terrazzo bath with a walk-in rain and jet shower. Wake up to the sounds of soothing waves ebbing and flowing just metres away from your bright and spacious Maldives beachfront home. Step out into the sand from your outdoor wooden patio, through your private sun loungers and refreshing outdoor shower, and onto your own beachfront. While you settle into island life, your host and villa valet will attend to your every need discreetly.","The enormous bedroom has a king-size bed and floor-to-ceiling windows with beautiful ocean views, as well as a wide, sun-drenched en suite with soaking tub. The airy, roomy layout welcomes long and leisurely days relaxing between your living room and sun-lit patio through the wide villa doors. At our unique Maldives resort, you may relax in the solitude of your own swimming pool and length of sandy beach. Relax among the swaying palms in your hammock - a standard in all of our villas.","Our beautiful Water Villas in the Maldives have an open-plan bedroom with a king-size bed and floor-to-ceiling windows that provide panoramic water-to-sky vistas. A separate living and eating area joins a spacious bathroom, with the beautiful enormous tub affording its own spectacular perspective of the quiet waters beyond. On the split-level hardwood deck that encases the house and a coconut-thatched covered veranda, discover wrap-around netting hammocks hung just over the glittering sea.","The beautiful villas at One & Only Reethi Rah are set either over the lagoon or along the beach. These villas are sleek and stunning, with outstanding solitude and views.","One&Only Reethi Rah is located on one of the biggest islands in North Malé Atoll, surrounded by the wonders of the Indian Ocean. It is located around 700 kilometres (430 miles) southwest of Sri Lanka and is a gem among a line of coral atolls, lagoons, and white sands. Guests may reach the resort in 20 minutes via seaplane transfer or 45 minutes by speedboat transport."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 2050, '4yLvHcjWaMY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'one-only-reethi-rah-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'one-only-reethi-rah-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'reethi-rah'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'one-only-reethi-rah-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 2050, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'one-only-reethi-rah-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 2600, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'one-only-reethi-rah-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 2450, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'one-only-reethi-rah-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Outrigger-Konotta
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'outrigger-konotta-maldives-island-resort', 'Outrigger Konotta Maldives Island Resort', 'Outrigger Konotta Maldives Resort offers full solitude and intimate luxury among the beautiful seas of Gaafu Dhaalu Atoll. Outrigger hospitality is unrivalled in this haven of superb over-water villas, inventive Maldivian cuisine, the relaxing Navasana Spa, reef adventure, and stunning sea life.', 'published', 'Outrigger Konotta Maldives Island Resort | Maldives Resorts | MTG', 'Outrigger Konotta Maldives Resort offers full solitude and intimate luxury among the beautiful seas of Gaafu Dhaalu Atoll. Outrigger hospitality is unrivalled in this haven of superb over-water villas, inventive Maldivian cuisine, the relaxing Navasana Spa, reef adventure, and stunning sea life.', '{"overview_paragraphs":["Outrigger Konotta Maldives Resort offers full solitude and intimate luxury among the beautiful seas of Gaafu Dhaalu Atoll. Outrigger hospitality is unrivalled in this haven of superb over-water villas, inventive Maldivian cuisine, the relaxing Navasana Spa, reef adventure, and stunning sea life.","Outrigger Konotta Maldives Resort offers ultimate solitude and intimate luxury with 21 Beach Pool Villas, 21 Ocean Pool Villas, 8 Two Bedroom Beach Pool Villas, 2 Lagoon Pool Villas, and the Grand Konotta Villa.","Outrigger Konotta Maldives Resort is located on Konotta, a private island in the Gaafu Dhaalu Atoll, 340 kilometres south of Male'' and easily accessible through a 55-minute flight to Kaadedhdhoo Airport (KDM), followed by a spectacular 30-minute speed boat ride."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, null, 'eZFc1P6ivgw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'outrigger-konotta-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'outrigger-konotta-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'konotta'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'outrigger-konotta-maldives-island-resort'
on conflict (id) do nothing;

-- Outrigger-Maafushivaru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'outrigger-maldives-maafushivaru-resort-island', 'Outrigger Maldives Maafushivaru Resort Island', 'Outrigger Maldives Maafushivaru Resort is located on the picturesque South Ari Atoll, just a 25-minute seaplane ride from Male. You''ll be surrounded by kilometres of the Maldives'' signature blue seas. This resort is located on a 350-metre-long island that is partially sheltered by thick foliage and surrounded by beautiful beaches adjacent to a stunning house reef.', 'published', 'Outrigger Maldives Maafushivaru Resort Island | Maldives Resorts | MTG', 'Outrigger Maldives Maafushivaru Resort is located on the picturesque South Ari Atoll, just a 25-minute seaplane ride from Male. You''ll be surrounded by kilometres of the Maldives'' signature blue seas. This resort is located on a 350-metre-long island that is partially sheltered by thick foliage and surrounded by beautiful beaches adjacent to a stunning house reef.', '{"overview_paragraphs":["Outrigger Maldives Maafushivaru Resort is located on the picturesque South Ari Atoll, just a 25-minute seaplane ride from Male. You''ll be surrounded by kilometres of the Maldives'' signature blue seas. This resort is located on a 350-metre-long island that is partially sheltered by thick foliage and surrounded by beautiful beaches adjacent to a stunning house reef.","Our beach villas are self-contained and positioned directly near the beach, surrounded by lush greenery, with sun loungers on a private balcony facing the sea.","The beach pool villas have king-sized bedrooms, a modern distinctive silver glass crystal tiled bathroom, a twin vanity, and separate indoor and outdoor showers in your own garden.","Luxury villas with contemporary conveniences and unique lagoon views. The large bedroom has a king-sized bed and a daybed.","Maafushivaru has 81 villas in various types, all with direct access to the beach or great views of the ocean. The villas are well-appointed but basic in style and architecture, combining in wonderfully with the Maldives'' laid-back atmosphere. All are well equipped with everything you need for a comfortable vacation near to nature.","Maafushivaru, located 93 kilometres from the airport in the beautiful South Ari Atoll, provides five various types of villas, each blending features of Maldivian architecture with elegant and trendy finishing touches, and appeals to couples seeking romantic pursuits. Allow Maafushivaru to assist you in creating memories that will last a lifetime."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 900, 'pN2jDp7fIA0', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'outrigger-maldives-maafushivaru-resort-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'outrigger-maldives-maafushivaru-resort-island'
  and l.node_type = 'location' and l.slug = 'maafushivaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'outrigger-maldives-maafushivaru-resort-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 950, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'outrigger-maldives-maafushivaru-resort-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1100, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'outrigger-maldives-maafushivaru-resort-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 900, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'outrigger-maldives-maafushivaru-resort-island'
on conflict (accommodation_id, name) do nothing;

-- Ozen-Reserve-Bolifushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'ozen-reserve-bolifushi-maldives-island-resort', 'Ozen Reserve Bolifushi Maldives Island Resort', 'OZEN RESERVE BOLIFUSHI brings to life your fantasies of Maldives 5-star resorts. The exclusive island resort embodies elegance, flair, and timeless sophistication, surrounded by a stunning natural reef and blue seas. Every experience is precisely created to pamper you with an extraordinary break, from stunning overwater villas with slides to exotic gourmet dining and ice skating by the beach.', 'published', 'Ozen Reserve Bolifushi Maldives Island Resort | Maldives Resorts | MTG', 'OZEN RESERVE BOLIFUSHI brings to life your fantasies of Maldives 5-star resorts. The exclusive island resort embodies elegance, flair, and timeless sophistication, surrounded by a stunning natural reef and blue seas. Every experience is precisely created to pamper you with an extraordinary break, from stunning overwater villas with slides to exotic gourmet dining and ice skating by the beach.', '{"overview_paragraphs":["OZEN RESERVE BOLIFUSHI brings to life your fantasies of Maldives 5-star resorts. The exclusive island resort embodies elegance, flair, and timeless sophistication, surrounded by a stunning natural reef and blue seas. Every experience is precisely created to pamper you with an extraordinary break, from stunning overwater villas with slides to exotic gourmet dining and ice skating by the beach.","Enjoy the stunning sunset views from this peaceful, expansive, and elegantly elegant retreat. These beautiful tropical havens are ideal for all types of travellers, including small families, couples, and groups of friends. They provide the ideal Maldivian retreat! Earth Pool Villa Sunset is a tropical oasis built for all sorts of visitors, from small families and groups of friends to couples searching for an unique Maldivian holiday.","The mystical Indian Ocean is just a few feet away from the Ocean Pool Suite. Its vast outside terrace, surrounded by the lagoon, is a real haven for calm sunbathing or relaxing stargazing beneath shimmering sky. It has a private infinity pool, sunken seats, an overwater hammock, and a few stairs going down to the cerulean lagoon bubbling below. This is the ultimate way to feel the Maldives'' real essence! If the outside is paradise, the inside is just as gorgeous. This beautiful house is finished with a teak floor, colourful tropical furnishings, and sophisticated décor.","The 5-star villas at Ozen Reserve Bolifushi have an open-concept plan that allows guests to enjoy the spectacular sea views and pleasant breezes. There are 43 beach villas and suites, 46 water villas and ocean suites, and 1 Royal Residence in the resort. Every villa has its own pool and direct access to the beach or lagoon. Not to add that there is free WiFi in the rooms.","This tranquil island resort retreat is only a 20-minute boat trip from Velana International Airport. This is a luxurious hideaway that is easily accessible, located on the south side of Male Atoll. You''ll discover large lengths of white sandy beaches and clear seas at Ozen Reserve Bolifushi, providing a magnificent vision for you to gaze upon while you let the leisurely joys of life take over.","A world of captivating culinary surprises greets each guest at OZEN RESERVE BOLIFUSHI. Enjoy customised dining experiences in Maldivian beauty, with breathtaking views of the Indian Ocean from each. For an exquisite culinary experience, choose from three specialty restaurants, an all-day dining restaurant, and two pubs. Our enthusiastic chefs create meals and delectable dishes using the freshest produce from our Chef''s Garden, which they individually handpick. So sit back, relax, and enjoy this delightful adventure at our resort!"]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1900, 'il6USSNhBDY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'ozen-reserve-bolifushi-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'ozen-reserve-bolifushi-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'bolifushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'ozen-reserve-bolifushi-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Earth Pool Villa Sunset', 1900, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'ozen-reserve-bolifushi-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Pool Suite', 2000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'ozen-reserve-bolifushi-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Palm-Beach
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'palm-beach-island-resort-spa-maldives', 'Palm Beach Island Resort & Spa Maldives', 'The 4-star Palm Beach Island Resort & Spa Maldives Lhaviyani Atoll is located near Madhiriguraidhoo Island and offers medical services, 24-hour cleaning, and wake-up calls. Fushifaru Thila is 3.1 km away, while Palm Beach Resort & Spa is 0.5 km distant. The rooms include a private safe, Wi-Fi, and a work desk, as well as an electric kettle, glasses, and coffee/tea making facilities for cooking. Some flats have views of the garden. A spa bathtub, a hair dryer, and towels are also available to guests.', 'published', 'Palm Beach Island Resort & Spa Maldives | Maldives Resorts | MTG', 'The 4-star Palm Beach Island Resort & Spa Maldives Lhaviyani Atoll is located near Madhiriguraidhoo Island and offers medical services, 24-hour cleaning, and wake-up calls. Fushifaru Thila is 3.1 km away, while Palm Beach Resort & Spa is 0.5 km distant. The rooms include a private safe, Wi-Fi, and a work desk, as well as an electric kettle, glasses, and coffee/tea making facilities for cooking. Some flats have views of the garden. A spa bathtub, a hair dryer, and towels are also available to guests.', '{"overview_paragraphs":["The 4-star Palm Beach Island Resort & Spa Maldives Lhaviyani Atoll is located near Madhiriguraidhoo Island and offers medical services, 24-hour cleaning, and wake-up calls. Fushifaru Thila is 3.1 km away, while Palm Beach Resort & Spa is 0.5 km distant. The rooms include a private safe, Wi-Fi, and a work desk, as well as an electric kettle, glasses, and coffee/tea making facilities for cooking. Some flats have views of the garden. A spa bathtub, a hair dryer, and towels are also available to guests.","Choose from a selection of magnificent Villas and Suites that provide a hidden hideaway among lush tropical foliage while gazing over the beautiful colours of a setting sun or the serene splendour of morning coming.","On your picturesque 40-minute seaplane ride to Lhaviyani Atoll and onto infinite expanses of immaculate white beach set by groves of coconut palms rustling softly to the beat of tropical winds, gaze at jewel tones of turquoise, jade, and bright tones across the Maldives archipelago."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, null, 'zS3TfPEFOcc', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'palm-beach-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'palm-beach-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'madhiriguraidhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'palm-beach-island-resort-spa-maldives'
on conflict (id) do nothing;

-- Park-Hyatt
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'park-hyatt-maldives-hadahaa-island-resort', 'Park Hyatt Maldives Hadahaa Island Resort', 'Explore the natural beauty of the remote Huvadhoo Atoll, whether as a ''castaway'' learning essential survival skills before feasting on a BBQ of fresh fish from the lagoon, picnicking on a remote uninhabited island, or snorkelling and diving among sea turtles, black tip reef sharks, barracudas, spotted eagle rays, and colourful tropical fish species. Engaging children''s activities immersed in nature''s playground, as well as a deeper dive into the ocean and marine life preservation at the Blue Journeys Dive and Activity Center, provide insights into long-term projects to protect the endangered ecosystem and traditional Maldivian way of life. Exquisite culinary excursions await at sophisticated but relaxed restaurant, bar, and lounge options, as well as amazing personalised private dining.', 'published', 'Park Hyatt Maldives Hadahaa Island Resort | Maldives Resorts | MTG', 'Explore the natural beauty of the remote Huvadhoo Atoll, whether as a ''castaway'' learning essential survival skills before feasting on a BBQ of fresh fish from the lagoon, picnicking on a remote uninhabited island, or snorkelling and diving among sea turtles, black tip reef sharks, barracudas, spotted eagle rays, and colourful tropical fish species. Engaging children''s activities immersed in nature''s playground, as well as a deeper dive into the ocean and marine life preservation at the Blue Journeys Dive and Activity Center, provide insights into long-term projects to protect the endangered ecosystem and traditional Maldivian way of life. Exquisite culinary excursions await at sophisticated but relaxed restaurant, bar, and lounge options, as well as amazing personalised private dining.', '{"overview_paragraphs":["Explore the natural beauty of the remote Huvadhoo Atoll, whether as a ''castaway'' learning essential survival skills before feasting on a BBQ of fresh fish from the lagoon, picnicking on a remote uninhabited island, or snorkelling and diving among sea turtles, black tip reef sharks, barracudas, spotted eagle rays, and colourful tropical fish species. Engaging children''s activities immersed in nature''s playground, as well as a deeper dive into the ocean and marine life preservation at the Blue Journeys Dive and Activity Center, provide insights into long-term projects to protect the endangered ecosystem and traditional Maldivian way of life. Exquisite culinary excursions await at sophisticated but relaxed restaurant, bar, and lounge options, as well as amazing personalised private dining.","Our 165-square-meter villas have a king bed with chaise lounge, a private deck with table and chairs, loungers, an indoor and outdoor shower area with terrazzo bathtub and rain shower, and direct beach access.","Our 180-square-meter villas have a king bed, a chaise lounge overlooking a private plunge pool and balcony, an indoor and outdoor shower room with terrazzo bathtub and rain shower area, and direct beach access.","Relax in our 115 sq m water villas, which include 180° views of the ocean, a king bed, an indoor bathtub, a sun porch with a daybed, and direct access to the house reef.","This resort has 51 villas, each having a private deck with table and chairs, an outdoor garden bathroom with bathtub and rain shower, and private beach access with two sun loungers. The Deluxe Beach Pool Villas and Two Bedroom Beach Pool Villas have a private 55 sq m (592 sq ft) luxury plunge pool, as well as an outside bale/cabana with table and chairs. Overwater Sunset Pool Villas include their own freshwater plunge pool and outdoor cabana. From the private terrace outside, all water villas have stunning panoramic ocean views and individual access to the coral-filled seas below. Every villa has a personal home entertainment system, a digital media centre, an in-villa iPad with an interactive resort compendium, a flat-screen television, a DVD player, and a CD player.","Guests take a pleasant domestic flight with Maldivian to Kooddoo Domestic Airport on the North Huvadhoo (Gaafu Alifu) atoll, which takes between 60 and 105 minutes depending on the route, followed by an entertaining 30-minute speedboat ride to the resort."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1300, 'MHEVNKQTr28', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'park-hyatt-maldives-hadahaa-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'park-hyatt-maldives-hadahaa-island-resort'
  and l.node_type = 'location' and l.slug = 'hadahaa'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'park-hyatt-maldives-hadahaa-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 1300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'park-hyatt-maldives-hadahaa-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1600, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'park-hyatt-maldives-hadahaa-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 1950, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'park-hyatt-maldives-hadahaa-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Patina-Maldives
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'the-patina-maldives-fari-island-resort', 'The Patina Maldives Fari Island Resort', 'Far from all you know, there is a freedom inspired by everything you are - an island of pure beauty and surprising depth. Deep serenity or a shared experience. Follow your instincts to find what you require. Find the best luxury resort in the Maldives for your next vacation. At our Maldives resort, sophisticated rooms coexist with stimulating adventures. Create an unforgettable visit with Patina Maldives, Fari Islands'' special packages and seasonal discounts.', 'published', 'The Patina Maldives Fari Island Resort | Maldives Resorts | MTG', 'Far from all you know, there is a freedom inspired by everything you are - an island of pure beauty and surprising depth. Deep serenity or a shared experience. Follow your instincts to find what you require. Find the best luxury resort in the Maldives for your next vacation. At our Maldives resort, sophisticated rooms coexist with stimulating adventures. Create an unforgettable visit with Patina Maldives, Fari Islands'' special packages and seasonal discounts.', '{"overview_paragraphs":["Far from all you know, there is a freedom inspired by everything you are - an island of pure beauty and surprising depth. Deep serenity or a shared experience. Follow your instincts to find what you require. Find the best luxury resort in the Maldives for your next vacation. At our Maldives resort, sophisticated rooms coexist with stimulating adventures. Create an unforgettable visit with Patina Maldives, Fari Islands'' special packages and seasonal discounts.","Some of these one-bedroom villas offer views of the white sand beach, and they are all surrounded by a gorgeous garden of mature, natural tropical plants. This natural abundance provides the property and its grounds with seclusion and peace, making it perfect for seasoned travellers looking for a Maldives beach villa with a private pool. This is also felt within the villa, as floor-to-ceiling glass windows and doors open on three sides to provide a seamless transition between inside and outdoors.","Floor-to-ceiling panoramic glass swings back to reveal magnificent one-bedroom villas overlooking the turquoise ocean and at one with our local marine life. Nothing but the gentle ripples of the lagoon disrupt the horizon views from the private terrace. Inside our Maldives private water villa, the bedroom, bathroom, and lounge are crafted from natural materials that are in perfect harmony with our breathtaking setting.","In a secluded sanctuary, verdant landscaping envelops each of Patina Maldives'' 90 contemporary one- to three-bedroom Beach and Water Pool Villas, as well as 20 Fari Studios, yet opens invitingly into the surrounding island life; a simultaneous sensation of seclusion and belonging.","The property is located on the North Malé Atoll, 45 minutes via speedboat from Malé International Airport.","Each of our 12 ideas, a selected ensemble of the greatest food, gives a new viewpoint on what a Maldives restaurant should be, where the best ingredients and methods take centre stage. To build a worldwide connection via cuisine, our chefs retain time-honored skills with a dash of creativity."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 2600, 'g5ECncmC0OI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'the-patina-maldives-fari-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'the-patina-maldives-fari-island-resort'
  and l.node_type = 'location' and l.slug = 'fari-islands'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'the-patina-maldives-fari-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 2600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'the-patina-maldives-fari-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 3000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'the-patina-maldives-fari-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Pullman
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'pullman-maldives-maamutaa-island-resort', 'Pullman Maldives Maamutaa Island Resort', 'Pullman Maldives Maamutaa is a Maldives premium all-inclusive resort where visitors may take advantage of special privileges, inspire their thoughts, and test their horizons. You''ll discover everything you need to improve your game right here. Our creative playground is headquartered on Maamutaa Island in Gaafu Alifu Atoll, in the southern Maldives. Set within 18 hectares of lush forest and around a natural lake, our aim is to provide our visitors with a holiday of a lifetime.', 'published', 'Pullman Maldives Maamutaa Island Resort | Maldives Resorts | MTG', 'Pullman Maldives Maamutaa is a Maldives premium all-inclusive resort where visitors may take advantage of special privileges, inspire their thoughts, and test their horizons. You''ll discover everything you need to improve your game right here. Our creative playground is headquartered on Maamutaa Island in Gaafu Alifu Atoll, in the southern Maldives. Set within 18 hectares of lush forest and around a natural lake, our aim is to provide our visitors with a holiday of a lifetime.', '{"overview_paragraphs":["Pullman Maldives Maamutaa is a Maldives premium all-inclusive resort where visitors may take advantage of special privileges, inspire their thoughts, and test their horizons. You''ll discover everything you need to improve your game right here. Our creative playground is headquartered on Maamutaa Island in Gaafu Alifu Atoll, in the southern Maldives. Set within 18 hectares of lush forest and around a natural lake, our aim is to provide our visitors with a holiday of a lifetime.","The Pullman Beach Villa is a tranquil haven in perfect harmony with its surroundings. A king-size bed dominates the 200sqm of modern living area. A huge private balcony captures sea breezes to the accompaniment of rustling palms and gently lapping waves. From the beautiful garden to the azure Indian Ocean, a quiet pathway leads. The spacious indoor-outdoor bath space has two refreshing showers and a luxurious island tub.","A chic hideaway surrounded by rich natural greenery, with the beach''s coral-white beaches just feet away. A shaded balcony overlooks the private pool and captures the sea wind. The Pullman Beach Pool Villa is a sophisticated traveler''s island getaway. Together or alone. The understated interior design combines Maldivian heritage with modern flair. A generous 240sqm of area provides plenty of room to do nothing. Alternatively, you could do everything. The bath space is centred on a deep island tub, with indoor and outdoor showers and his and hers wash basins.","Steps descend immediately from a large timber terrace to the lovely, tranquil sea. Pullman''s Ocean Villa is ideal for couples who want to savour every minute. Both day and night. An mesmerising view of the rich aquatic life below is provided via a lighted glass aperture in the floor. A large quantity of space (160sqm) means you''ll have plenty of room to stretch out. The open air living environment will revitalise and reconnect you with nature. Or soak it all up in the netting hammock floating above water.","Discover Pullman''s The Aqua Villa experience, an immersive encounter with aquatic life from the luxury of your bed that will nourish and bring to life your childhood fantasies. Enjoy the tranquillity of the Indian Ocean while finding the right combination of play and refreshment. Because Pullman believes in blending work and leisure, there is so much more to do at Pullman Maldives than just kick back, sleep, and take a picture. This luxurious two-level Aqua Villa features a submerged master bedroom as well as an overwater bedroom, as well as lots of space for you to relax and live your once-in-a-lifetime narrative. The Aqua Villa Experience brings your childhood fantasies to reality. It''s not a game.","The resort has 122 villas, including magnificent and unusual underwater villas. Honeymooners may enjoy their Private Beach and Water Pool Villas, while families can enjoy spacious 2 -3 Bedroom Villas."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1000, 'aCmdCbfQu10', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'pullman-maldives-maamutaa-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'pullman-maldives-maamutaa-island-resort'
  and l.node_type = 'location' and l.slug = 'maamutaa'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'pullman-maldives-maamutaa-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 1000, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'pullman-maldives-maamutaa-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1150, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'pullman-maldives-maamutaa-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Villa', 1000, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'pullman-maldives-maamutaa-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Aqua Villa', 3700, 'USD', 'King', 3, 3
from nodes where node_type = 'accommodation' and slug = 'pullman-maldives-maamutaa-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Radisson-Blu
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'radisson-blu-maldives-island-resort', 'Radisson Blu Maldives Island Resort', 'The Radisson Blu Resort Maldives, a hidden jewel in the Indian Ocean, allows you to escape from the world and rest in elegance. Our knowledgeable team will arrange for your transportation to the hotel''s island. Enjoy world-class snorkelling and diving, as well as some of the greatest spots on the planet to observe whale sharks, throughout your vacation. You may explore nearby islands such as Dhigurah and Maamigili, or you can dive right here at our Dive and Water Sports Center. Relax with a glass of champagne in your villa''s own pool and share your fondest Fenfushi coral reef memories.', 'published', 'Radisson Blu Maldives Island Resort | Maldives Resorts | MTG', 'The Radisson Blu Resort Maldives, a hidden jewel in the Indian Ocean, allows you to escape from the world and rest in elegance. Our knowledgeable team will arrange for your transportation to the hotel''s island. Enjoy world-class snorkelling and diving, as well as some of the greatest spots on the planet to observe whale sharks, throughout your vacation. You may explore nearby islands such as Dhigurah and Maamigili, or you can dive right here at our Dive and Water Sports Center. Relax with a glass of champagne in your villa''s own pool and share your fondest Fenfushi coral reef memories.', '{"overview_paragraphs":["The Radisson Blu Resort Maldives, a hidden jewel in the Indian Ocean, allows you to escape from the world and rest in elegance. Our knowledgeable team will arrange for your transportation to the hotel''s island. Enjoy world-class snorkelling and diving, as well as some of the greatest spots on the planet to observe whale sharks, throughout your vacation. You may explore nearby islands such as Dhigurah and Maamigili, or you can dive right here at our Dive and Water Sports Center. Relax with a glass of champagne in your villa''s own pool and share your fondest Fenfushi coral reef memories.","In this property, enjoy your coffee while relaxing on the sun porch. This contemporary option offers amazing views of the Indian Ocean, unimpeded access to the beach, and a private pool. When you''re ready to go, refresh up in the bathroom, which has a bathtub, a rain shower, and a dual vanity counter. An IPTV, a sofa, a daybed, a vanity kit, IDD phones, and outside lounge chairs are among common features.","With spectacular views, a private outdoor terrace, an overwater hammock, and easy access to the pristine ocean waters, our overwater home helps you experience island life. Sunbathe on a beach chair or take a break from the sun by watching your favourite show on IPTV. A walk-in closet, a daybed, a sofa, a vanity kit, twin vanity counters, and IDD phones are other standard features.","Whether you''re visiting the Maldives for world-class snorkelling and diving activities or to celebrate your honeymoon with your spouse, our villa-style accommodations provide the finest of island life with private pools, breathtaking ocean views, and 24-hour room service. To have direct access to the gorgeous beach, book a beachfront villa. Outdoor decks, sun loungers, and dual vanity counters are standard features in all villas. Begin your day with a complimentary breakfast and a hot beverage from the espresso machine. Please keep in mind that additional guests who exceed a villa''s standard occupancy may be charged. Children under the age of 12 are admitted free of charge. Furthermore, we do not recommend that minors under the age of 12 stay in our overwater lodgings.","The resort is adjacent to Velana International Airport and provides two modes of transportation (domestic aircraft and seaplane) between the airport and the resort. Located in Alifu Dhaalu Atoll, an atoll known for its diverse marine life, multiple diving locations, and year-round whale shark and manta sightings.","Our restaurants at the Radisson Blu Resort Maldives inspire guests to experience something different, from Japanese cuisine to Mediterranean dishes flavoured with Asian flare. Visit Raha for an international buffet breakfast, lunch, and supper, or make an appointment at Alifaan for grilled specialties from around the world. Dine at Kabuki, our Japanese restaurant, for a journey of discovery prepared by our expert Japanese chefs, which includes a variety of drinks from Japan and the rest of the world."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 950, 'od5aJv768h4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'radisson-blu-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'radisson-blu-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'huruelhi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'radisson-blu-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1180, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'radisson-blu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Pool Villa', 950, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'radisson-blu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Raffles
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'raffles-maldives-meradhoo-island-resort', 'Raffles Maldives Meradhoo Island Resort', 'Raffles Maldives Meradhoo is an exceptional refuge. It is as far removed from the rhythm of regular life as one can get in its isolated location on the southern extremity of the Maldives archipelago. Guests establish their own beat here. They rest, reconnect, and realign in harmony with nature. It''s easy to forget about the outer world when you''re surrounded by clear Indian Ocean seas teeming with unspoiled house reefs and their wonderful residents. For its exceptional service and magnificent beauty, Raffles Maldives Meradhoo has been named one of the greatest new hotels in the Indian Ocean by discriminating travel enthusiasts and guests. The crew works hard to ensure that guests have a good time and remember it fondly.', 'published', 'Raffles Maldives Meradhoo Island Resort | Maldives Resorts | MTG', 'Raffles Maldives Meradhoo is an exceptional refuge. It is as far removed from the rhythm of regular life as one can get in its isolated location on the southern extremity of the Maldives archipelago. Guests establish their own beat here. They rest, reconnect, and realign in harmony with nature. It''s easy to forget about the outer world when you''re surrounded by clear Indian Ocean seas teeming with unspoiled house reefs and their wonderful residents. For its exceptional service and magnificent beauty, Raffles Maldives Meradhoo has been named one of the greatest new hotels in the Indian Ocean by discriminating travel enthusiasts and guests. The crew works hard to ensure that guests have a good time and remember it fondly.', '{"overview_paragraphs":["Raffles Maldives Meradhoo is an exceptional refuge. It is as far removed from the rhythm of regular life as one can get in its isolated location on the southern extremity of the Maldives archipelago. Guests establish their own beat here. They rest, reconnect, and realign in harmony with nature. It''s easy to forget about the outer world when you''re surrounded by clear Indian Ocean seas teeming with unspoiled house reefs and their wonderful residents. For its exceptional service and magnificent beauty, Raffles Maldives Meradhoo has been named one of the greatest new hotels in the Indian Ocean by discriminating travel enthusiasts and guests. The crew works hard to ensure that guests have a good time and remember it fondly.","This property, just yards from the beach, is stunning from the moment you step inside. The interior colour scheme is inspired by the maritime environment and is soothing to the senses. With spacious outdoor areas featuring a private garden and pool, a wide verandah opening directly onto the beach, and a choice of daybeds both inside and outdoors, this wonderful spot is designed for leisure. Take a step outside and let the ocean wind wash away your problems.","A stay at our Overwater Villa is set against the backdrop of nature. The sun glinting on the lagoon''s calm, clear water, a kaleidoscope of colours beneath the surface as fish dart across the ocean bottom beneath you, and the brightest stars in the night sky. It is the ideal venue for appreciating the natural world''s beauties. Comfort is entirely up to you within your villa. Enclose the living rooms for air-conditioned comfort or open up the entire area to the soothing wind and sounds of the sea. Relax in your private pool or deep indoor bathtub, or indulge in the ultimate luxury by stepping down from your balcony into the clear waters of the lagoon and interacting with the marine life.","The resort''s beach villas are located on a natural island, only steps away from pristine sands and the vast Indian Ocean. The rooms are decorated in gentle sky blue and duck egg tones that mirror the natural beauty of their surrounds, and include furnishings such as the famed Raffles'' writer''s desk. A private pool and outdoor shower on the terrace are ideal for cool starry nights. On the natural island is also located the spectacular Raffles Royal Residence. The magnificent Overwater Residence and Sunset Overwater Residence are located alongside the villas.","A remarkable oasis located at the southern extremity of the Maldives, among the beautiful seas of the Indian Ocean: Meradhoo Raffles Maldives.","From pastries and fresh fruits for breakfast to vivid salads and a la carte meals for lunch and themed dinner evenings, visitors may unwind in this casual, open atmosphere as the soothing ocean breeze cools them."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1900, 'q5l7E02JyYY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'raffles-maldives-meradhoo-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'raffles-maldives-meradhoo-island-resort'
  and l.node_type = 'location' and l.slug = 'meradhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'raffles-maldives-meradhoo-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1900, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'raffles-maldives-meradhoo-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa Pool', 2250, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'raffles-maldives-meradhoo-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Rahaa-Resort
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'rahaa-resort-maldives-island', 'Rahaa Resort Maldives Island', 'Rahaa is a four-star resort in the pristine Laamu Atoll. A naturally stunning setting with native flora, long lengths of beach, and a salt-water lake. Rahaa is accessible through a 30- to 40-minute domestic flight followed by a 20- to 30-minute speed boat trip. Rahaa is an ideal vacation destination for all types of visitors, including honeymooners, singles, adventurers, and families.', 'published', 'Rahaa Resort Maldives Island | Maldives Resorts | MTG', 'Rahaa is a four-star resort in the pristine Laamu Atoll. A naturally stunning setting with native flora, long lengths of beach, and a salt-water lake. Rahaa is accessible through a 30- to 40-minute domestic flight followed by a 20- to 30-minute speed boat trip. Rahaa is an ideal vacation destination for all types of visitors, including honeymooners, singles, adventurers, and families.', '{"overview_paragraphs":["Rahaa is a four-star resort in the pristine Laamu Atoll. A naturally stunning setting with native flora, long lengths of beach, and a salt-water lake. Rahaa is accessible through a 30- to 40-minute domestic flight followed by a 20- to 30-minute speed boat trip. Rahaa is an ideal vacation destination for all types of visitors, including honeymooners, singles, adventurers, and families.","The Ocean View Villas, tucked away amid dense vegetation and backed by gently swaying palms, provide absolute solitude and breathtaking views of the Indian Ocean. Relax on the outdoor daybed or read a book while enjoying the fresh coastal wind.","Rahaa Resort offers Lake View Villas and Ocean View Villas for visitors to enjoy diverse views throughout their stay.","Laamu Atoll is a gorgeous and unspoiled atoll. The domestic trip from Male International Airport to Kadhdhoo Airport takes around 25 minutes, followed by a fast speed boat ride to the resort.","This opulent beachfront restaurant provides worldwide cuisine for breakfast, lunch, and supper buffet style, as well as a selection of A La Carte entrees. Theme evenings will take you on a seven-day journey across the world. As live cooking stations sprout up on the beach and the ocean air filled with pleasant noises and scents to stimulate your appetite, travel from the Maldives to the Mediterranean and back to the streets of Asia.","The Maldives, surrounded by the serenity of the sea, is known as one of the best places to restore your mind and body to their natural balance of energy. Rahaa Spa, which overlooks the turquoise lagoon, is your location for releasing tension and unwinding into the serenity you know you deserve. Our massage and body care treatments, which combine the therapeutic characteristics of natural Maldivian materials, will meet your pampering requirements in the hands of our expert specialists."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 200, 'pFyLzV795hc', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'rahaa-resort-maldives-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'rahaa-resort-maldives-island'
  and l.node_type = 'location' and l.slug = 'kudafares'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'rahaa-resort-maldives-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean View Villa', 200, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'rahaa-resort-maldives-island'
on conflict (accommodation_id, name) do nothing;

-- Reethi-Beach
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'reethi-beach-resort-maldives', 'Reethi Beach Resort Maldives', 'In this hectic world, visitors may still enjoy tranquillity mixed with a real Maldivian jungle vibe on a tiny island in Baa Atoll, a simple 35-minute seaplane flight from Male''. Our spacious freestanding and semi-detached villas are attentively designed while providing a one-of-a-kind service in a distinctive setting.', 'published', 'Reethi Beach Resort Maldives | Maldives Resorts | MTG', 'In this hectic world, visitors may still enjoy tranquillity mixed with a real Maldivian jungle vibe on a tiny island in Baa Atoll, a simple 35-minute seaplane flight from Male''. Our spacious freestanding and semi-detached villas are attentively designed while providing a one-of-a-kind service in a distinctive setting.', '{"overview_paragraphs":["In this hectic world, visitors may still enjoy tranquillity mixed with a real Maldivian jungle vibe on a tiny island in Baa Atoll, a simple 35-minute seaplane flight from Male''. Our spacious freestanding and semi-detached villas are attentively designed while providing a one-of-a-kind service in a distinctive setting.","Sunset Deluxe Villas are single standing apartments located on the westside of the island by the excellent sandy beach with a spectacular view of the crystal blue lagoon. Wooden deck chairs on the patio and a traditional Maldivian swing right outside the villa encourage you to unwind. Each villa has a king-size bed, a wider living space, and an open-air Maldivian bathroom with a bathtub and rain shower.","This is a must-see for every ocean lover, built on stilts over the lagoon''s gorgeous waters. There are 30 semi-detached Water Villas of 61 sqm available, each with a bathroom with bathtub and shower, bathrobes, a big sitting area with direct access to the lagoon, and a sun umbrella with sun loungers.","Each exquisite villa on the island offers luxury in a unique environment and is intended to promote personal relaxation. The villas were created from natural materials in traditional Maldivian architecture and are ideally positioned among tropical greenery, on the gorgeous sandy beach, or on stilts above the pure waters of the turquoise lagoon.","Take a breathtaking 35-minute seaplane journey with a spectacular aerial view of the Maldivian thousand isles, or take a 20-minute domestic flight to Dharavandhoo airport and then a 15-minute speed boat ride to the island. The 600 m x 200 m resort is set among lush flora, covered by majestic palm trees, encircled by a white sandy beach, and edged by a lovely house reef 30 m to 100 m from the island.","Dine in a variety of locations, including beachside and overwater. We provide to the most demanding consumer with 5 restaurants, including a buffet restaurant, dine dining, and specialised restaurants. Our main restaurant, which overlooks the garden and the sea, provides buffet-style breakfast, lunch, and supper. Dinner is especially exceptional, with an unique ''theme'' every night of the week and a biweekly menu change. Special dietary needs are met on a case-by-case basis; vegetarian and ''healthy eating'' choices are always available."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, null, 'su-IqEO2mS4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'reethi-beach-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'reethi-beach-resort-maldives'
  and l.node_type = 'location' and l.slug = 'fonimagoodhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'reethi-beach-resort-maldives'
on conflict (id) do nothing;

-- Reethi-Faru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'reethi-faru-resort-maldives-island', 'Reethi Faru Resort Maldives Island', 'Reethi Faru is a luxurious retreat on the quiet, beautiful, and private island of Filaidhoo. Discover this one-of-a-kind tropical island paradise, where the sparkling crystal clear water meets the limitless white coral beach and lush flora transforms it into a genuinely wonderful lagoon hideaway. We are confident that you will be immersed in peace the moment you walk into its crystal clear light blue seas reaching across the smooth dunes. A wonderfully enchanting but one-of-a-kind location where you may select from a variety of things to enjoy throughout your stay.', 'published', 'Reethi Faru Resort Maldives Island | Maldives Resorts | MTG', 'Reethi Faru is a luxurious retreat on the quiet, beautiful, and private island of Filaidhoo. Discover this one-of-a-kind tropical island paradise, where the sparkling crystal clear water meets the limitless white coral beach and lush flora transforms it into a genuinely wonderful lagoon hideaway. We are confident that you will be immersed in peace the moment you walk into its crystal clear light blue seas reaching across the smooth dunes. A wonderfully enchanting but one-of-a-kind location where you may select from a variety of things to enjoy throughout your stay.', '{"overview_paragraphs":["Reethi Faru is a luxurious retreat on the quiet, beautiful, and private island of Filaidhoo. Discover this one-of-a-kind tropical island paradise, where the sparkling crystal clear water meets the limitless white coral beach and lush flora transforms it into a genuinely wonderful lagoon hideaway. We are confident that you will be immersed in peace the moment you walk into its crystal clear light blue seas reaching across the smooth dunes. A wonderfully enchanting but one-of-a-kind location where you may select from a variety of things to enjoy throughout your stay.","The totally private location will inspire you to enjoy the ''Me'' time you''ve always desired. Each villa has its own sunset cabana, sun loungers, and reading chairs. A book, some gentle music, and the natural surroundings in the midst of lots of sunlight will provide you with enough reasons to smile without giving you another cause to grin.","This is your place, with your very own sky. If staring at the sky or taking up the scenery while holding hands in a secluded environment sounds romantic, this is it. These Villas have magnificent natural lighting, hardwood ceilings, and inviting décor that is frequently caressed by a fresh wind.","To give the perfect vacation at Reethi Faru Resort, special care has been made to the design and placement of each of the 150 villas. You will discover a fully serviced villa that matches all of your requirements and interests, from family-friendly accommodations to perfectly located romantic hideaways.","Reethi Faru Resort is a newly new 5-star resort in Raa Atoll, north-west of Male'', on the little island of Filaidhoo, with a lovely house reef only 80 metres from shore. Reethi Faru Resort is a breathtaking 45-minute seaplane journey or a 20-minute domestic flight to Dharavandhoo followed by a 40-minute speed boat ride directly to the Resort from the international airport.","With breakfast being the most essential meal of the day, there is something for everyone at the restaurant. Our breakfast buffet includes a live area with waffles, pancakes, omelettes, and local delicacies, as well as continental spreads with a variety of flavours to tempt your taste buds. The menu expands to include a variety of lunch and supper options."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 250, 'gvkORhQg47s', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'reethi-faru-resort-maldives-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'reethi-faru-resort-maldives-island'
  and l.node_type = 'location' and l.slug = 'filaidhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'reethi-faru-resort-maldives-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Beach Villa', 250, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'reethi-faru-resort-maldives-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 300, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'reethi-faru-resort-maldives-island'
on conflict (accommodation_id, name) do nothing;

-- Residence-Dhigurah
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'the-residence-maldives-at-dhigurah-island-resort', 'The Residence Maldives at Dhigurah Island Resort', 'Discover your own own luxury retreat at The Residence Maldives at Dhigurah, nestled in the Gaafu Alifu Atoll in the southern Maldives. A palm-fringed paradise surrounded by turquoise lagoons, relaxing ocean blues, and a beautiful natural wilderness of over 2500 well-preserved coconut palm trees where you may immerse yourself in blissful relaxation.', 'published', 'The Residence Maldives at Dhigurah Island Resort | Maldives Resorts | MTG', 'Discover your own own luxury retreat at The Residence Maldives at Dhigurah, nestled in the Gaafu Alifu Atoll in the southern Maldives. A palm-fringed paradise surrounded by turquoise lagoons, relaxing ocean blues, and a beautiful natural wilderness of over 2500 well-preserved coconut palm trees where you may immerse yourself in blissful relaxation.', '{"overview_paragraphs":["Discover your own own luxury retreat at The Residence Maldives at Dhigurah, nestled in the Gaafu Alifu Atoll in the southern Maldives. A palm-fringed paradise surrounded by turquoise lagoons, relaxing ocean blues, and a beautiful natural wilderness of over 2500 well-preserved coconut palm trees where you may immerse yourself in blissful relaxation.","Feel the stresses of contemporary life fade away as this 173-villa resort takes you to a haven of unsurpassed serenity and relaxation, surrounded by nature''s pristine splendour. Lounging on pristine sun-kissed beaches, snorkelling amid colourful coral reefs in clear lagoons, and diving with marine critters in the ocean depths are all pure delights here.","Relax in the comfort of the island''s large villas, which have been thoughtfully constructed to blend in with their surroundings. At Li Bai, you may savour a fascinating world of exotic flavours ranging from Indian Ocean specialities to Mediterranean tapas and contemporary Cantonese cuisine. The resort''s unique Spa by Clarins health retreat, set in lush tropical gardens, promises a journey to blissful wellbeing for the ultimate in pampering.","Children are also well cared for, with a variety of Kids Club activities designed to keep young brains occupied and interested. On a marine exploration or garden ramble, uncover nature''s complicated eco-systems while gathering freshly produced vegetables from the resort''s own Earth Basket. Picnics on our private Castaway Island or at Dhigurah''s sister resort on neighbouring Falhumaafushi island, which you may reach through a one-kilometer bridge. The Residence Maldives at Dhigurah is the ideal hideaway you''ve been looking for, from romantic getaways to unforgettable family vacations.","With a lagoon-facing bedroom that opens out onto a big verandah and indoor and outdoor baths, these tastefully fitted villas have an intimate environment cocooned within the natural surroundings. Relax on the sun loungers beside your own pool, sipping a beverage and taking in the sense of total relaxation and the caress of the ocean air.","The Lagoon Pool Villas, which are located above the lagoon, provide a haven of peace and comfort. Immerse yourself in a magnificent bathroom experience that includes a huge bathtub as well as indoor and outdoor showers. Enjoy the picturesque surroundings from your private verandah and pool, as well as a private garden just outside your door."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1100, '1rqPO5YR71c', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'the-residence-maldives-at-dhigurah-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'the-residence-maldives-at-dhigurah-island-resort'
  and l.node_type = 'location' and l.slug = 'dhigurah'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'the-residence-maldives-at-dhigurah-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Pool Villa', 1100, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'the-residence-maldives-at-dhigurah-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 1340, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'the-residence-maldives-at-dhigurah-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Residence-Falhumaafushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'the-residence-maldives-at-falhumaafushi-island-resort', 'The Residence Maldives at Falhumaafushi Island Resort', 'The Residence Maldives is located on Falhumaafushi, a beautiful island in the Gaafu Alifu Atoll, one of the world''s biggest atolls. Indulge in our hidden retreat''s private island feeling, where nature''s unrivalled beauty forms a mesmerising background for your blissful relaxation.', 'published', 'The Residence Maldives at Falhumaafushi Island Resort | Maldives Resorts | MTG', 'The Residence Maldives is located on Falhumaafushi, a beautiful island in the Gaafu Alifu Atoll, one of the world''s biggest atolls. Indulge in our hidden retreat''s private island feeling, where nature''s unrivalled beauty forms a mesmerising background for your blissful relaxation.', '{"overview_paragraphs":["The Residence Maldives is located on Falhumaafushi, a beautiful island in the Gaafu Alifu Atoll, one of the world''s biggest atolls. Indulge in our hidden retreat''s private island feeling, where nature''s unrivalled beauty forms a mesmerising background for your blissful relaxation.","The Residence Maldives creates the time and space for you to rediscover the meaning of leisure, carefully taken care of by our attentive yet discreet hospitality. The resort was designed to be in sync with the natural environment, perfectly blending traditional Maldivian architecture with contemporary elegance and modern conveniences. Relax in the tranquilly of the resort''s beachfront and over-water villas, which provide a sanctuary only feet from the sand, or enjoy the delight of slipping directly from your deck into the cold, clear waters to reach your own private lagoon.","Embrace the destination with our one-of-a-kind culinary experiences and a plethora of activities ranging from sunbathing on sun-kissed beaches to snorkelling, island hopping, or seeing the incredible marine life at several local diving spots. Whether you''re looking for the ideal couple''s hideaway or a spectacular family vacation, let The Residence Maldives captivate you.","Experience the airy tranquilly of our Beach Villas, which are situated among peaceful flora along the glittering shoreline. Enjoy immediate beach access, a palm-fringed playground for your children, and a huge living area that opens out to a private terrace with magnificent ocean views.","Relax on the beach or by your private pool, just steps away from the luxurious internal amenities of this huge beachfront property with amazing ocean views. A great place to stay for families travelling together. Twin beds are available in the second bedroom.","Beautiful views of the water. Gentle waves lapping at your front door. In the shimmering seas beneath your feet, schools of fish fly across vibrant coral reefs. Such are the joys of our Water Villas, which each include a big living area that opens to a private verandah where you may bask in the Maldivian sun and marvel at the live aquarium right in front of your eyes."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 950, 'SE3hjQNVa-c', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'the-residence-maldives-at-falhumaafushi-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'the-residence-maldives-at-falhumaafushi-island-resort'
  and l.node_type = 'location' and l.slug = 'falhumaafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'the-residence-maldives-at-falhumaafushi-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 950, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'the-residence-maldives-at-falhumaafushi-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1100, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'the-residence-maldives-at-falhumaafushi-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 1250, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'the-residence-maldives-at-falhumaafushi-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Rihiveli
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'rihiveli-maldives', 'Rihiveli Maldives', 'Enjoy being outside, whether on the beach or on your private balcony. Do you want to get a tan, listen to fantastic music, dive among the magnificent aquatic life, or drink your favourite cocktail? Rihiveli Maldives Resort offers the finest of what the Maldives has to offer in a barefoot island environment. Allow yourself to truly appreciate the Maldives'' unparalleled and one-of-a-kind beauty.', 'published', 'Rihiveli Maldives | Maldives Resorts | MTG', 'Enjoy being outside, whether on the beach or on your private balcony. Do you want to get a tan, listen to fantastic music, dive among the magnificent aquatic life, or drink your favourite cocktail? Rihiveli Maldives Resort offers the finest of what the Maldives has to offer in a barefoot island environment. Allow yourself to truly appreciate the Maldives'' unparalleled and one-of-a-kind beauty.', '{"overview_paragraphs":["Enjoy being outside, whether on the beach or on your private balcony. Do you want to get a tan, listen to fantastic music, dive among the magnificent aquatic life, or drink your favourite cocktail? Rihiveli Maldives Resort offers the finest of what the Maldives has to offer in a barefoot island environment. Allow yourself to truly appreciate the Maldives'' unparalleled and one-of-a-kind beauty.","Charming bungalows with a sea view (sunrise or sunset side), wonderfully covered by palm palms, keeping the rooms cool.","The island is located in the Kaafu South Male atoll, 43 kilometres from the airport, and can be accessed by speed boat in 50 minutes.","Serene, light, and airy beach settings to start or end the day; to enjoy healthy flavours in an interactive presentation of many cuisines and innovative meals enhanced with local flavours and tropical tones. Relax, sip, savour, and enjoy yourself every day.","After a day of relaxing on Voavah''s magnificent coasts, treat yourself to a customised treatment at the Ocean of Consciousness - the island''s unique Spa. Our signature treatment, which includes breath preparation, a salt-and-crystal scrub, a bath soak, an awakening massage, and a fully immersive sound bath, harnesses the unlimited power of sound to connect you to the layers of awakened wisdom both inside and outside of you.","At Voavah, there are no neighbours, no paparazzi, and no limits on what you may do. Continue the music all night and commemorate a major milestone with a well-known performer. Make your own mini-Woodstock or Coachella on the beach, organise an incredible island-wide proposal trail, or turn the island into a wedding fantasy."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, null, 'CqbUr7mdR6w', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'rihiveli-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'rihiveli-maldives'
  and l.node_type = 'location' and l.slug = 'mahaanaelhihuraa'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'rihiveli-maldives'
on conflict (id) do nothing;

-- Robinson-Club
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'robinson-club-noonu-maldives-island-resort', 'Robinson Club Noonu Maldives Island Resort', 'Robinson Club Noonu, You''ll experience the Maldives in a whole new manner with ROBINSON, whether you''re barefoot on the sand at our famous Sundowner bar on the peninsula, tastefully attired in our Teppanyaki restaurant elevated on stilts, or on a dive over the stunning Noonu Atoll. Our all-inclusive "crafted by ROBINSON" package and our island''s easy accessibility from Malé (only 45 minutes) make it ideal for families. We hope to see you there!', 'published', 'Robinson Club Noonu Maldives Island Resort | Maldives Resorts | MTG', 'Robinson Club Noonu, You''ll experience the Maldives in a whole new manner with ROBINSON, whether you''re barefoot on the sand at our famous Sundowner bar on the peninsula, tastefully attired in our Teppanyaki restaurant elevated on stilts, or on a dive over the stunning Noonu Atoll. Our all-inclusive "crafted by ROBINSON" package and our island''s easy accessibility from Malé (only 45 minutes) make it ideal for families. We hope to see you there!', '{"overview_paragraphs":["Robinson Club Noonu, You''ll experience the Maldives in a whole new manner with ROBINSON, whether you''re barefoot on the sand at our famous Sundowner bar on the peninsula, tastefully attired in our Teppanyaki restaurant elevated on stilts, or on a dive over the stunning Noonu Atoll. Our all-inclusive \"crafted by ROBINSON\" package and our island''s easy accessibility from Malé (only 45 minutes) make it ideal for families. We hope to see you there!","The Robinson Club Noonu has 150 rooms, three restaurants, and two bars to keep you entertained during your stay.","The club situated on the island of Orivaru Noonu Atoll, some 200 kilometres north of Male International Airport. Transfer time: 45 minutes by seaplane from/to Male, or 35 minutes by domestic aircraft to Ifuru, followed by 45 minutes by speedboat.","Vegetarian dishes, vegan dinners, whole foods, food combining alternatives, gourmet plated meals, nutrition-conscious cuisine, lactose-free dishes, regional and seasonal produce. Meals tailored to individual dietary needs (e.g., allergies) in collaboration with the resort and based on area alternatives.","Dive locations with pristine coral reefs, club-owned reefs, and rare marine life. PADI organises the ROBINSON diving centre, and the instructors are trained in compliance with the applicable association requirements.","Snorkeling or diving: the Maldives are suitable for all types of underwater activities. Both services are offered for an extra fee at ROBINSON NOONU."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 300, 'UXjDrUMTT-Y', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'robinson-club-noonu-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'robinson-club-noonu-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'orivaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'robinson-club-noonu-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Room Seaview Balcony', 300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'robinson-club-noonu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Bungalow', 530, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'robinson-club-noonu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Overwater Pool Bungalow', 500, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'robinson-club-noonu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Robinson-Maldives
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'robinson-club-maldives-island-resort', 'Robinson Club Maldives Island Resort', 'For some, this is Funamadua; for us, it is paradise: exotic underwater wonderland, white dream beach, sunsets that leave you speechless...it is no surprise that so many couples marry here. Even if you do not have a romantic wedding ceremony, you may have a memorable holiday in the Maldives, whether as a couple, with friends, or alone, whether lounging by the pool or snorkelling and diving together. Meet people from all over the world for a meet and greet with WellFit and beach volleyball, or wind off the day with a sundowner.', 'published', 'Robinson Club Maldives Island Resort | Maldives Resorts | MTG', 'For some, this is Funamadua; for us, it is paradise: exotic underwater wonderland, white dream beach, sunsets that leave you speechless...it is no surprise that so many couples marry here. Even if you do not have a romantic wedding ceremony, you may have a memorable holiday in the Maldives, whether as a couple, with friends, or alone, whether lounging by the pool or snorkelling and diving together. Meet people from all over the world for a meet and greet with WellFit and beach volleyball, or wind off the day with a sundowner.', '{"overview_paragraphs":["For some, this is Funamadua; for us, it is paradise: exotic underwater wonderland, white dream beach, sunsets that leave you speechless...it is no surprise that so many couples marry here. Even if you do not have a romantic wedding ceremony, you may have a memorable holiday in the Maldives, whether as a couple, with friends, or alone, whether lounging by the pool or snorkelling and diving together. Meet people from all over the world for a meet and greet with WellFit and beach volleyball, or wind off the day with a sundowner.","The Robinson Club features Garden Bungalows, Beach Bungalow Sea, and Beach Bungalow Sea, with more to come. Robinson Club has 121 rooms, 2 restaurants, and 3 bars to keep you entertained during your stay.","The Robinson Club is located on the island of Funamadua in the Gaaf Alif Atoll, approximately 60 kilometres north of the equator, and is surrounded by a beautiful, mostly undisturbed coral reef (the house reef is 20 to 200 metres away).","Breakfast, lunch, and supper buffets, late-night breakfast, Coffee specialities for breakfast, all beverages at the bar throughout the day (excluding selected wines, sparkling wines, spirits, and other specialties), soft drinks (branded drinks), beer, table wine, filter coffee, and tea available in the buffet area.","Allow yourself time and rest, and allow yourself to be treated according to all of the principles of the art. I treat myself to a health break, whether it''s a massage or a beauty treatment, in the sanarium or with a sauna infusion.","ROBINSON MALDIVES'' culinary highlights satisfy all senses - sample the most delectable meals every day. The best quality and utmost freshness are prioritised. Finish the night with cool beverages and exotic drinks while viewing the sunset."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 400, 'ctxxnGAKqlk', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'robinson-club-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'robinson-club-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'funamadua'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'robinson-club-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 400, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'robinson-club-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 500, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'robinson-club-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Royal-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'royal-island-premium-all-inclusive-maldives-island-resort', 'Royal Island Premium All Inclusive Maldives Island Resort', 'Your incredible All-Inclusive vacation begins here at Royal Island, which includes three daily meals at the main buffet style restaurant, beverages during and after meal times, and a variety of activities. Immerse yourself in a colourful voyage in the pristine and protected UNESCO Biosphere Reserve of Baa Atoll, whether you''re looking for calm or action. Unrivaled services and amenities, such as the exquisite Araamu Spa and a world-class range of restaurants and bars, are available. Discover infinite interactions with the natural environment while relaxing and recharging in one of the world''s most wonderful settings.', 'published', 'Royal Island Premium All Inclusive Maldives Island Resort | Maldives Resorts | MTG', 'Your incredible All-Inclusive vacation begins here at Royal Island, which includes three daily meals at the main buffet style restaurant, beverages during and after meal times, and a variety of activities. Immerse yourself in a colourful voyage in the pristine and protected UNESCO Biosphere Reserve of Baa Atoll, whether you''re looking for calm or action. Unrivaled services and amenities, such as the exquisite Araamu Spa and a world-class range of restaurants and bars, are available. Discover infinite interactions with the natural environment while relaxing and recharging in one of the world''s most wonderful settings.', '{"overview_paragraphs":["Your incredible All-Inclusive vacation begins here at Royal Island, which includes three daily meals at the main buffet style restaurant, beverages during and after meal times, and a variety of activities. Immerse yourself in a colourful voyage in the pristine and protected UNESCO Biosphere Reserve of Baa Atoll, whether you''re looking for calm or action. Unrivaled services and amenities, such as the exquisite Araamu Spa and a world-class range of restaurants and bars, are available. Discover infinite interactions with the natural environment while relaxing and recharging in one of the world''s most wonderful settings.","Royal Island villas are secluded luxury getaways in the middle of nature, giving breathtaking sunrise and sunset views while only steps away from the pure white beach and blue lagoon. Each house is thoughtfully built with rich and colourful aesthetics, stunning marble features, and elaborately carved wooden furnishings, with a focus on laid-back luxury. At Royal Island Resort & Spa, you may embrace independence and tropical tranquillity.","Royal Island Resort, located in the Baa Atoll, is only a 20-minute domestic flight from Velana International Airport. This resort is nearly 800 m long and 220 m wide, and offers the ideal holiday destination, set amongst lush tropical vegetation and perfect untouched beaches, and surrounded by the beautiful lagoon shimmering under the tropical sun.","Enjoy traditional Maldivian delicacies as well as exquisite cuisine from all around the world. Dine alfresco beneath a beautiful star-studded sky or in the traditional elegance of our Asian-style restaurant with breathtaking views of the Indian Ocean. Make memories that will last a lifetime by dancing the night away with friends and family at one of our chic pubs.","Araamu Spa will transport you to a tropical paradise. Discover a world of relaxation and tranquillity in the midst of beautiful coconut palms and tropical greenery. Indulge in a variety of Asian-inspired therapies meant to refresh and rejuvenate mind and body. Aromatherapy, reflexology, body wraps, and luxury pedicures and manicures are among the signature services.","Discover a plethora of resort activities and bucket-list adventures in a naturalist''s paradise. In the magnificent UNESCO Biosphere Reserve of Baa Atoll, where lush nature meets the dazzling waves of the Indian Ocean, really unique activities await. Soar high above the turquoise waves on a thrilling parasailing trip, dine on a sumptuous meal on a secluded sandbank, or unwind at Araamu Spa."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 300, 'YBSyiXv-LBQ', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'royal-island-premium-all-inclusive-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'royal-island-premium-all-inclusive-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'horubadhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'royal-island-premium-all-inclusive-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'royal-island-premium-all-inclusive-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Two Bedroom Family Beach Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'royal-island-premium-all-inclusive-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- SAii-Lagoon
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'saii-lagoon-maldives-island-resort', 'Saii Lagoon Maldives Island Resort', 'The large and elegant Sky Rooms on the upper level of SAii have an indoor chill-out space, comfy bespoke furniture, and private balconies that surround the peaceful Indian Ocean and the stunning views of the Maldives island hotel. The bathroom has a double basin, a rainshower, and natural bathing items that visitors can personalise at the M.I.Y. Aroma Lab.', 'published', 'Saii Lagoon Maldives Island Resort | Maldives Resorts | MTG', 'The large and elegant Sky Rooms on the upper level of SAii have an indoor chill-out space, comfy bespoke furniture, and private balconies that surround the peaceful Indian Ocean and the stunning views of the Maldives island hotel. The bathroom has a double basin, a rainshower, and natural bathing items that visitors can personalise at the M.I.Y. Aroma Lab.', '{"overview_paragraphs":["The large and elegant Sky Rooms on the upper level of SAii have an indoor chill-out space, comfy bespoke furniture, and private balconies that surround the peaceful Indian Ocean and the stunning views of the Maldives island hotel. The bathroom has a double basin, a rainshower, and natural bathing items that visitors can personalise at the M.I.Y. Aroma Lab.","Our Maldives Overwater Villas are spacious villas positioned over the water for easy dips into the ocean, with welcoming, modern rustic décor, tailor-made furnishings, and big furnished terraces with a lounging net and a bathtub, all drenched in stunning seascapes. Signature beds invite rest and replenishment, while en-suite bathrooms with double basins and waterfall showers promote relaxing lavation.","The décor will be calming, with natural tones and textures. Complimentary Wi-Fi, HDTVs, complimentary tea and coffee, huge bathrooms with waterfall showers, and furnished decks or balconies with ocean views will be among the in-room amenities. Beach villas will have more room, whereas overwater villas will be surrounded by blue water. The two-bedroom overwater villas with breathtaking ocean views include private pools and are ideal for families or groups of friends.","A unique and fascinating new resort experience awaits in the Maldives, approximately 15 minutes by speed boat from Velana International Airport. SAii Lagoon Maldives is a cerulean hideaway designed for couples, families, and friends looking for a fun holiday getaway.","It is our joy to please you with a cool blend of thrills, sensations, and inspirations when you stay the SAii way. Whether you are looking for comfort cuisine, inventive tastes, inspired mixology, or a cause to party, SAii delights blend an exciting mix of culinary and lifestyle trends to deliver unique experiences that attach to your soul and make your trip complete at our Maldives restaurants. Not to mention a range of eating options, including one of Asia''s 50 Best Restaurants, which is only a 5-minute walk away at The Marina @ CROSSROADS Maldives and will take you on an unforgettable gastronomic trip.","The Maldives'' first free-standing double-story spa and wellness facility, offering quick and easy foot and neck massages as well as more extensive treatments. Lèn Be Well introduces a novel wellness concept that includes remarkable new degrees of relaxation, spa treatments, holistic activities, and gastronomic pleasures. Allow the aura of serenity and joy to wash over you as you indulge in some ultimate pampering and a full journey of wellbeing."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 500, '1HZWfy0F1-Y', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'saii-lagoon-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'saii-lagoon-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'embudu-finolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'saii-lagoon-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sky Room', 500, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'saii-lagoon-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Overwater Villa', 950, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'saii-lagoon-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Safari-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'safari-island-resort-and-spa-maldives', 'Safari Island Resort and Spa Maldives', 'Safari Island is located in the Republic of Maldives'' North Ari Atoll. The island is roughly 30,000 square metres in size. The island is around 60 kilometres from Velana International Airport (Male'' International Airport) and takes about 25 minutes to arrive by seaplane. The island is bordered by white powdery, sandy beaches, a crystal clear water lagoon, and a house reef that is ideal for snorkelling and diving.', 'published', 'Safari Island Resort and Spa Maldives | Maldives Resorts | MTG', 'Safari Island is located in the Republic of Maldives'' North Ari Atoll. The island is roughly 30,000 square metres in size. The island is around 60 kilometres from Velana International Airport (Male'' International Airport) and takes about 25 minutes to arrive by seaplane. The island is bordered by white powdery, sandy beaches, a crystal clear water lagoon, and a house reef that is ideal for snorkelling and diving.', '{"overview_paragraphs":["Safari Island is located in the Republic of Maldives'' North Ari Atoll. The island is roughly 30,000 square metres in size. The island is around 60 kilometres from Velana International Airport (Male'' International Airport) and takes about 25 minutes to arrive by seaplane. The island is bordered by white powdery, sandy beaches, a crystal clear water lagoon, and a house reef that is ideal for snorkelling and diving.","Beach room with a deluxe en suite bathroom that has panoramic glass mirrors and twin wash basins. The room has a full glass door that leads to a private wooden porch with seats.","Overwater villas with a beautiful glass-bottomed coffee table. Back private sun deck going to blue lagoon.","On one end of the island, a line of 15 Semi-Water Bungalows runs. A jetty at the other end leads to 39 Water Bungalows. The 30 Beach Bungalows are located on an island surrounded by beautiful green flora, including palm palms. All 84 rooms have a sea view.","It is around 60 kilometres from Velana International Airport and takes about 25 minutes to get by seaplane.","Tropical haven Safari Island is a must-see destination in the Maldives. A visit to our great restaurant, an icon in the Maldives, would not be complete without a tour. The main restaurant, shaded by a spectacular white canopy and floating over the lagoon, serves breakfast, lunch, and supper in an all-you-can-eat buffet format with a range of international and regional cuisines to accommodate everyone''s taste."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 230, 'runiGf6kyVA', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'safari-island-resort-and-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'safari-island-resort-and-spa-maldives'
  and l.node_type = 'location' and l.slug = 'mushimasgali'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'safari-island-resort-and-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 230, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'safari-island-resort-and-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow', 300, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'safari-island-resort-and-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Sheraton
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'sheraton-maldives-full-moon-resort-spa-island', 'Sheraton Maldives Full Moon Resort & Spa Island', 'We encourage you to enjoy all that the Sheraton Maldives Full Moon Resort & Spa has to offer from a beautiful 360° panoramic view. Plan your next holiday with your loved ones by exploring our stunning white sand beaches, lush tropical vegetation, over-water homes, and so much more. We travel not to escape life, but to prevent life from escaping us. Bring your loved ones and create wonderful moments. Explore the Maldives with your family, set among beautiful tropical gardens and outfitted with modern conveniences such as an outdoor garden shower and a big terrace with a garden, beach, or plunge pool view. Those who wish to stay near the water may be interested in our water villas and bungalows. There is a private plunge pool option available.', 'published', 'Sheraton Maldives Full Moon Resort & Spa Island | Maldives Resorts | MTG', 'We encourage you to enjoy all that the Sheraton Maldives Full Moon Resort & Spa has to offer from a beautiful 360° panoramic view. Plan your next holiday with your loved ones by exploring our stunning white sand beaches, lush tropical vegetation, over-water homes, and so much more. We travel not to escape life, but to prevent life from escaping us. Bring your loved ones and create wonderful moments. Explore the Maldives with your family, set among beautiful tropical gardens and outfitted with modern conveniences such as an outdoor garden shower and a big terrace with a garden, beach, or plunge pool view. Those who wish to stay near the water may be interested in our water villas and bungalows. There is a private plunge pool option available.', '{"overview_paragraphs":["We encourage you to enjoy all that the Sheraton Maldives Full Moon Resort & Spa has to offer from a beautiful 360° panoramic view. Plan your next holiday with your loved ones by exploring our stunning white sand beaches, lush tropical vegetation, over-water homes, and so much more. We travel not to escape life, but to prevent life from escaping us. Bring your loved ones and create wonderful moments. Explore the Maldives with your family, set among beautiful tropical gardens and outfitted with modern conveniences such as an outdoor garden shower and a big terrace with a garden, beach, or plunge pool view. Those who wish to stay near the water may be interested in our water villas and bungalows. There is a private plunge pool option available.","The Sheraton Maldives Full Moon Resort is a 5-star beach resort with 176 guest rooms ranging from beach huts to over water villas, all decorated in a tropical manner. With the greatest facilities, slipping into the rhythm of exquisite island living this side of heaven has never been easier. Enjoy the fantastic pool and nicely equipped suites.","Sheraton Maldives Full Moon Resort is conveniently positioned on Furanafushi Island in North Male'' Atoll, about 15-20 minutes from Velana International Airport and 1 km from the next populated island.","We eat first, then we do everything else. The lovely sound of the ocean sets the tone for a romantic evening at Sea Salt, which provides courteous illuminated beach dining. Anchorage offers conventional pizzas, amazing salads, and Mediterranean favourites that are ideal for sharing while watching the sunset. The resort''s buffet dining area, Feast, offers a diverse selection with interactive cooking stations. We recommend Baan Thai, our traditional Thai restaurant, or Masala Hut, our Indian restaurant, for bold tastes. Kakuni Hut is our Caribbean-inspired restaurant that serves fresh tacos, sweets, and handcrafted drinks. ChopstiX is ideal for a late meal, with handmade dumplings and filling noodle bowls. Take a gastronomic adventure with our destination dining for a unique experience.","Escape to paradise at our Maldives resort hotel on North Malé Atoll''s newly remodelled Shine Spa for SheratonTM. On a secluded island with sea views, verdant gardens, and a yoga pavilion, rejuvenate with specialty treatments in your own spa pavilion.","Everything is available at Sheraton Maldives Full Moon Resort & Spa, with its azure blue oceans, exotic islands, and gorgeous sunsets, from sandbank picnics to sunset excursions for two."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 500, 'ogVBxqQp3y4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'sheraton-maldives-full-moon-resort-spa-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'sheraton-maldives-full-moon-resort-spa-island'
  and l.node_type = 'location' and l.slug = 'furanafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'sheraton-maldives-full-moon-resort-spa-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Front Deluxe', 500, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'sheraton-maldives-full-moon-resort-spa-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'sheraton-maldives-full-moon-resort-spa-island'
on conflict (accommodation_id, name) do nothing;

-- Six-Senses-Kanuhura
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'six-senses-kanuhura-maldives-private-island', 'Six Senses Kanuhura Maldives Private Island', 'This is an exciting time in Kanuhura''s lengthy history since we will be incorporating new wellness, sustainability, and conservation efforts into our everyday operations, as well as locally inspired experiences and activities. Kokaa Spa will become a Six Senses Spa, adopting the brand''s high-touch, high-tech approach to health, while our restaurants will follow the Eat With Six Senses concept of natural, local, and sustainable products, and less is more. This will mark the start of a new chapter in the resort''s history, which we are very eager to reveal later this year.', 'published', 'Six Senses Kanuhura Maldives Private Island | Maldives Resorts | MTG', 'This is an exciting time in Kanuhura''s lengthy history since we will be incorporating new wellness, sustainability, and conservation efforts into our everyday operations, as well as locally inspired experiences and activities. Kokaa Spa will become a Six Senses Spa, adopting the brand''s high-touch, high-tech approach to health, while our restaurants will follow the Eat With Six Senses concept of natural, local, and sustainable products, and less is more. This will mark the start of a new chapter in the resort''s history, which we are very eager to reveal later this year.', '{"overview_paragraphs":["This is an exciting time in Kanuhura''s lengthy history since we will be incorporating new wellness, sustainability, and conservation efforts into our everyday operations, as well as locally inspired experiences and activities. Kokaa Spa will become a Six Senses Spa, adopting the brand''s high-touch, high-tech approach to health, while our restaurants will follow the Eat With Six Senses concept of natural, local, and sustainable products, and less is more. This will mark the start of a new chapter in the resort''s history, which we are very eager to reveal later this year.","20 January 2022 - Our second Maldives resort, which will open in December 2022, has three white-sanded private islands, two of which are uninhabited, giving the ultimate choice of where to hang your hammock.","The Lhaviyani Atoll has about 40 diving spots where you may explore marine life. Through our relationship with Ocean Wings, additional watersport activities and high-performance equipment will be offered in the coming months. There will be a variety of events to excite people about the significance of ocean conservation, from touring the coasts of Jehunuhura Island to getting hands-on with coral and seagrass protection."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 540, 'CqbUr7mdR6w', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'six-senses-kanuhura-maldives-private-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'six-senses-kanuhura-maldives-private-island'
  and l.node_type = 'location' and l.slug = 'kanuhura'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'six-senses-kanuhura-maldives-private-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 540, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'six-senses-kanuhura-maldives-private-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Pool Villa', 739, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'six-senses-kanuhura-maldives-private-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 775, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'six-senses-kanuhura-maldives-private-island'
on conflict (accommodation_id, name) do nothing;

-- Siyam-World
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'siyam-world-maldives-island-resort', 'Siyam World Maldives Island Resort', 'Siyam World is a stunning new picture of the Maldives'' rich natural beauties, a carefree playground with an intriguing, diversified, and never-before-seen assortment of ''never-seen-before'' experiences guaranteed to leave you speechless. Premium An all-inclusive island vacation that bridges cultures and boundaries. Designed for fun-loving, open-minded couples, romance seekers, families, or bigger groups of friends who like to wander, socialise, and participate in an island community. Siyam World is one of the Maldives'' biggest islands, including a resort and spectacular villas - The Beach House Collection.', 'published', 'Siyam World Maldives Island Resort | Maldives Resorts | MTG', 'Siyam World is a stunning new picture of the Maldives'' rich natural beauties, a carefree playground with an intriguing, diversified, and never-before-seen assortment of ''never-seen-before'' experiences guaranteed to leave you speechless. Premium An all-inclusive island vacation that bridges cultures and boundaries. Designed for fun-loving, open-minded couples, romance seekers, families, or bigger groups of friends who like to wander, socialise, and participate in an island community. Siyam World is one of the Maldives'' biggest islands, including a resort and spectacular villas - The Beach House Collection.', '{"overview_paragraphs":["Siyam World is a stunning new picture of the Maldives'' rich natural beauties, a carefree playground with an intriguing, diversified, and never-before-seen assortment of ''never-seen-before'' experiences guaranteed to leave you speechless. Premium An all-inclusive island vacation that bridges cultures and boundaries. Designed for fun-loving, open-minded couples, romance seekers, families, or bigger groups of friends who like to wander, socialise, and participate in an island community. Siyam World is one of the Maldives'' biggest islands, including a resort and spectacular villas - The Beach House Collection.","Are there any sunset chasers around? Sunset Pool Beach Villas are located on the beachfront and have easy access to the beach where you may sway into the sunset on a fun fox swing. Take use of a private pool, a mini bar, Wi-Fi, a bathroom with a bathtub, and indoor and outdoor showers. Isn''t it amazing?","These unique Water Villas provide your own private pool as well as a fun slide. Ideal for people who enjoy having a little fun on their vacations in order to create great memories. Enjoy your private sundeck with sun loungers, a bathroom with an indoor shower, a mini bar, Wi-Fi, and breathtaking views. We believe that sliding into the lagoon is more enjoyable.","Our villas are located right on the beach. All of the villas are on the beach or on stilts over the lagoon, and half have their own pool. They not only provide excellent amenities, but also a high level of seclusion - while you sleep, rest, and wash outside. Dreams come true at our villas, which have been identified as being among the top Maldives island resorts!","Located in the famous Noonu Atoll, the resort is only a 45-minute direct seaplane journey or a 40-minute domestic flight from Maafaru International Airport, followed by a 10-minute speedboat ride.","Tempo, located east of the island and set on a gorgeous beach terrace, serves a variety of world cuisines. This casual dining restaurant serves a worldwide marketplace of scents and sensations in a buffet format with live cooking stations."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 700, 'FPEuNEfCHv8', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'siyam-world-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'siyam-world-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'iru-fushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'siyam-world-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Beach Pool Villa', 750, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'siyam-world-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Pool Villa Slide', 700, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'siyam-world-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Soneva-Jani
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'soneva-jani-maldives-island-resort', 'Soneva Jani Maldives Island Resort', 'Soneva Jani is tucked away in the calm waters of the Noonu Atoll, where sun-drenched blue sky and turquoise seas reach out in every direction. There are only 51 over-water and three island properties, the largest and most luxury villas in the Maldives, each constructed for utmost seclusion, space, and stunning ocean views. Relax in one of the renowned Water or Island Villas for the ultimate in luxury.', 'published', 'Soneva Jani Maldives Island Resort | Maldives Resorts | MTG', 'Soneva Jani is tucked away in the calm waters of the Noonu Atoll, where sun-drenched blue sky and turquoise seas reach out in every direction. There are only 51 over-water and three island properties, the largest and most luxury villas in the Maldives, each constructed for utmost seclusion, space, and stunning ocean views. Relax in one of the renowned Water or Island Villas for the ultimate in luxury.', '{"overview_paragraphs":["Soneva Jani is tucked away in the calm waters of the Noonu Atoll, where sun-drenched blue sky and turquoise seas reach out in every direction. There are only 51 over-water and three island properties, the largest and most luxury villas in the Maldives, each constructed for utmost seclusion, space, and stunning ocean views. Relax in one of the renowned Water or Island Villas for the ultimate in luxury.","Villa 34''s one-of-a-kind design is inspired by nature''s graceful, undulating curves. This three-bedroom seaside mansion is 1,956 square metres in size, with no straight lines in sight. It contains a freshwater swimming pool as well as a children''s pool with a water slide. By the pool, there is also a children''s treehouse.","The One Bedroom Water Retreat is spread across two stories and includes a private pool surrounded by plenty of space for sunbathing and admiring the ocean views. With the retractable roof of the villa, you can see the stars from the luxury of your master bedroom.","Our magnificent overwater and island villas are all built to provide maximum room, seclusion, and breathtaking views. Our 51 Water Villas, which range in size from one to four bedrooms, all include private pools, waterslides into the lagoon, and a retractable roof over the master bedroom. Our three Island Reserves are just feet from the beach and include private pools as well as ample interior and outdoor living space.","Soneva Jani is a five-island resort in Noonu Atoll''s Medhufaru lagoon, the largest of which is Medhufaru, which is 150 acres in size. The resort is accessible by a spectacular 40-minute seaplane trip from Malé International Airport. Furthermore, the resort is accessible through a 60-minute speedboat journey from Soneva Fushi, or with a relaxing full-day cruise aboard Soneva in Aqua from Soneva Fushi.","Discover all of our eating options and experiences at Soneva Jani and the pristine islands that surround us. Our Hosts would gladly personalise each experience for a special event, celebration, or simply because."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 4200, 'f3smYTocVT0', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'soneva-jani-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'soneva-jani-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'medhufaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'soneva-jani-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, '3 Bedroom Island Reserve', 23400, 'USD', 'King', 9, 0
from nodes where node_type = 'accommodation' and slug = 'soneva-jani-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, '1 bedroom Water Retreat', 4200, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'soneva-jani-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- South-Palm
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'south-palm-resort-maldives-island', 'South Palm Resort Maldives Island', 'South Palm Resort Maldives is a haven of unparalleled tranquillity, solitude, and comfort. Addu Atoll is surrounded by beautiful sandy beaches, a clean lagoon, and serene blue ocean vistas. South Palm Resort Maldives is a million miles away from the worries and strains of everyday life, located on a private island in the remote, southern edge of the Maldives. South Palm Resort Maldives offers 6 Villa kinds of stylish accommodation to meet all of your holiday needs. The island features a plethora of activities and outstanding amenities, including the first ever floating spa rooms in the Maldives, if not the globe. This makes it a great getaway for couples and honeymooners, as well as a fun-filled family resort.', 'published', 'South Palm Resort Maldives Island | Maldives Resorts | MTG', 'South Palm Resort Maldives is a haven of unparalleled tranquillity, solitude, and comfort. Addu Atoll is surrounded by beautiful sandy beaches, a clean lagoon, and serene blue ocean vistas. South Palm Resort Maldives is a million miles away from the worries and strains of everyday life, located on a private island in the remote, southern edge of the Maldives. South Palm Resort Maldives offers 6 Villa kinds of stylish accommodation to meet all of your holiday needs. The island features a plethora of activities and outstanding amenities, including the first ever floating spa rooms in the Maldives, if not the globe. This makes it a great getaway for couples and honeymooners, as well as a fun-filled family resort.', '{"overview_paragraphs":["South Palm Resort Maldives is a haven of unparalleled tranquillity, solitude, and comfort. Addu Atoll is surrounded by beautiful sandy beaches, a clean lagoon, and serene blue ocean vistas. South Palm Resort Maldives is a million miles away from the worries and strains of everyday life, located on a private island in the remote, southern edge of the Maldives. South Palm Resort Maldives offers 6 Villa kinds of stylish accommodation to meet all of your holiday needs. The island features a plethora of activities and outstanding amenities, including the first ever floating spa rooms in the Maldives, if not the globe. This makes it a great getaway for couples and honeymooners, as well as a fun-filled family resort.","From your Sunrise Villa, watch the first rays of morning sunshine rise over the Indian Ocean. After the concert, relax on your outside daybed and soak in the sea wind. The large 50sqm Villas, the most inexpensive accommodation category, have modern furnishings, elegant lines, and comfortable bedding.","Allow the peaceful sounds of the Indian Ocean to lull you to sleep in the middle of the day, and then wake up to experience the stunning colours of the sunset. In these huge 70 Sqm over-water villas, relax on the daybed on the wooden terrace and count the stars with a loved one.","The South Palm villas have been tastefully designed as a tranquil place for you to unwind and enjoy beautiful ocean views. A selection of 100 land-based beachfront Villas and 30 over-water Villas awaits to meet all of your vacation demands.","Located on a private island in the Maldives'' southernmost tip. Ismehela Hera is located on the western rim of Addu atoll. Gan International Airport on Addu Atoll is a 10-minute speedboat trip away.","The Banyan Restaurant, South Palm Resort''s primary dining location, offers an abundance of options. With breathtaking views of the Indian Ocean, dine on Asian and international cuisine as well as traditional Maldivian fare."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 220, 'aYQPJc27w60', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'south-palm-resort-maldives-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'south-palm-resort-maldives-island'
  and l.node_type = 'location' and l.slug = 'ismehela-hera'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'south-palm-resort-maldives-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Villa', 220, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'south-palm-resort-maldives-island'
on conflict (accommodation_id, name) do nothing;

-- Sun-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'sun-island-resort-spa-maldives', 'Sun Island Resort & Spa Maldives', 'Discover a world of adventure at Sun Island Resort & Spa, nestled in South Ari Atoll in the South Ari Marine Protected Area, whether you want adrenaline-fueled thrills or calm (SAMPA). Sun Island Resort & Spa, located on one of the biggest Maldivian islands and home to a healthy biodiversity and marine life, is a premium eco resort where natural beauty meets bright interior design and magnificent indoor-outdoor living areas. This Maldivian oasis, nestled among lush coconut trees, offers you to experience warm hospitality as well as an abundance of opportunities and exceptional seclusion to reconnect with nature.', 'published', 'Sun Island Resort & Spa Maldives | Maldives Resorts | MTG', 'Discover a world of adventure at Sun Island Resort & Spa, nestled in South Ari Atoll in the South Ari Marine Protected Area, whether you want adrenaline-fueled thrills or calm (SAMPA). Sun Island Resort & Spa, located on one of the biggest Maldivian islands and home to a healthy biodiversity and marine life, is a premium eco resort where natural beauty meets bright interior design and magnificent indoor-outdoor living areas. This Maldivian oasis, nestled among lush coconut trees, offers you to experience warm hospitality as well as an abundance of opportunities and exceptional seclusion to reconnect with nature.', '{"overview_paragraphs":["Discover a world of adventure at Sun Island Resort & Spa, nestled in South Ari Atoll in the South Ari Marine Protected Area, whether you want adrenaline-fueled thrills or calm (SAMPA). Sun Island Resort & Spa, located on one of the biggest Maldivian islands and home to a healthy biodiversity and marine life, is a premium eco resort where natural beauty meets bright interior design and magnificent indoor-outdoor living areas. This Maldivian oasis, nestled among lush coconut trees, offers you to experience warm hospitality as well as an abundance of opportunities and exceptional seclusion to reconnect with nature.","Sun Villas are tranquil getaways in the middle of the island, surrounded by luscious coconut trees and lush green flora. Large garden villas offer a calm and private place for families with young children to unwind and revitalise in the midst of Maldivian nature.","Beach Pool Villas include private pools, a wide 121sqm open plan living room with an attractive design, a private veranda, contemporary conveniences, and everything you need for an amazing Maldives vacation. Relax in your private pool while enjoying a tropical island breeze, or explore the gorgeous white beach and turquoise seas just outside your door.","The Water Villas at Sun Island Resort & Spa provide a quiet refuge located over crystal pure water. Enjoy carefree island living while admiring the expansive horizon from your private sundeck. Enjoy direct access to the lagoon from your private stairway and explore adjacent colourful reefs to enjoy the beauty of the natural aquatic environment. These luxury villas provide an unforgettable experience in one of the world''s most spectacular locations.","Sun Island Resort & Spa features 462 well appointed rooms. All of the rooms are intended to provide comfort and a pleasing outlook. From garden villas to water bungalows, all of the accommodations feature modern conveniences and are well-equipped for the modern traveller.","Sun Island Resort & Spa is situated on Nalaguraidhoo Island in South Ari Atoll, south of Malé International Airport. It is the largest resort in the Maldives, and its size comes with an unrivalled array of facilities as well as very great value for money. The resort is accessible via a 17-minute domestic flight from Male International Airport."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 200, 'B9eBA_LNeJc', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'sun-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'sun-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'nalaguraidhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'sun-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sun Villa', 200, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'sun-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 700, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'sun-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 600, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'sun-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Sun-Siyam-IruVeli
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'sun-siyam-iru-veli-maldives-island-resort', 'Sun Siyam Iru Veli Maldives Island Resort', 'Sun Siyam Iru Veli is the perfect tropical hideaway, with sleek and spacious suites. With front-row lagoon views and a freshwater pool in each five-star room, all you have to do is check in, relax, and watch our neighbouring dolphins swim by each day. Shoes are left at the entrance from the time you walk in, so forget about dress rules and come as you are. We live in the barefoot idyll, so relax and bury your toes into the smoothest white sand - it doesn''t get any better than this.', 'published', 'Sun Siyam Iru Veli Maldives Island Resort | Maldives Resorts | MTG', 'Sun Siyam Iru Veli is the perfect tropical hideaway, with sleek and spacious suites. With front-row lagoon views and a freshwater pool in each five-star room, all you have to do is check in, relax, and watch our neighbouring dolphins swim by each day. Shoes are left at the entrance from the time you walk in, so forget about dress rules and come as you are. We live in the barefoot idyll, so relax and bury your toes into the smoothest white sand - it doesn''t get any better than this.', '{"overview_paragraphs":["Sun Siyam Iru Veli is the perfect tropical hideaway, with sleek and spacious suites. With front-row lagoon views and a freshwater pool in each five-star room, all you have to do is check in, relax, and watch our neighbouring dolphins swim by each day. Shoes are left at the entrance from the time you walk in, so forget about dress rules and come as you are. We live in the barefoot idyll, so relax and bury your toes into the smoothest white sand - it doesn''t get any better than this.","These suites are spacious and appealing, with views of the dawn or sunset and lots of space to assemble. Plenty of natural light is provided through floor-to-ceiling glass doors and an outdoor bathroom, as well as space to enjoy outside on the wide sundeck, your own length of beach, or in your private pool.","These suites provide front-row seats for seeing dolphins swim by every day - a spectacular sight you''ll never forget. We''ve brought the beach right to your door, with your very own length of sand constructed into the deck.","Enjoy the good life in our 125 sun-drizzled suites, which are scattered over the lagoon and across sugar-fine dunes and are bathed in warm, natural light. Each is a luxurious hideaway with its own private pool.","Sun Siyam Iru Veli lives on Aluvifushi, an island in South Nilandhe Atoll (also known as Dhaalu Atoll). Sun Siyam Iru Veli is 40 minutes from Velana International Airport via seaplane.","The buffet at Aqua Orange is a visual feast, presenting an incredible assortment of cuisines from across the world. Following breakfast, lunch and supper will entice you with Italian classics, Maldivian specialties, and themed evenings. With tables placed out on the beach, you may enjoy stunning lagoon views as your backdrop."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1300, '1ljyDTmN1Yk', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'sun-siyam-iru-veli-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'sun-siyam-iru-veli-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'aloofushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'sun-siyam-iru-veli-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Family Suite Pool', 1400, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'sun-siyam-iru-veli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Dolphin Ocean Suite', 1300, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'sun-siyam-iru-veli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;
