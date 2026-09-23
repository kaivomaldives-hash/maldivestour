-- Part 3 of 6 - run this in the Supabase SQL Editor AFTER the previous parts.
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

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Water Villa With Pool', 1220, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'hideaway-beach-resort-spa-maldives-island'
on conflict (accommodation_id, name) do nothing;

-- Hotel-Riu
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'riu-palace-maldives-island-resort', 'RIU Palace Maldives Island Resort', 'If you want to spend a luxurious vacation in a tropical paradise, Hotel Riu Palace Maldivas is the place to stay. This Maldives all-inclusive resort is located on the private island of Kedhigandu and provides 24-hour all-inclusive service, free Wi-Fi throughout the hotel, a variety of restaurants, and several leisure and entertainment opportunities.', 'published', 'RIU Palace Maldives Island Resort | Maldives Resorts | MTG', 'If you want to spend a luxurious vacation in a tropical paradise, Hotel Riu Palace Maldivas is the place to stay. This Maldives all-inclusive resort is located on the private island of Kedhigandu and provides 24-hour all-inclusive service, free Wi-Fi throughout the hotel, a variety of restaurants, and several leisure and entertainment opportunities.', '{"overview_paragraphs":["If you want to spend a luxurious vacation in a tropical paradise, Hotel Riu Palace Maldivas is the place to stay. This Maldives all-inclusive resort is located on the private island of Kedhigandu and provides 24-hour all-inclusive service, free Wi-Fi throughout the hotel, a variety of restaurants, and several leisure and entertainment opportunities.","To make your stay as comfortable as possible, the Hotel Riu Palace Maldives offers Junior Suites in various villas, as well as rare overwater suites, some of which have tiny private pools. Its more than 150 rooms have minibars, beverage dispensers, kettles, air conditioning, and satellite television, among other amenities.","If you wish to stay on the beach, these junior rooms at the Hotel Riu Palace Maldives are an excellent alternative. These 40-square-meter rooms have a king-size bed (200x200 cm) or two tiny double beds (125x200 cm), a sofa or sofa-bed in the living area, satellite TV, air conditioning, a ceiling fan, drink dispensers, a minibar, and a kettle. Furthermore, the beachside terrace will make your vacation experience one-of-a-kind.","These exquisite accommodations on the water will provide you with an amazing vacation. These 47-square-meter suites at the Hotel Riu Palace Maldives have one king-size bed (200x200 cm) or two tiny double beds (125x200 cm), a couch in the living area, satellite TV, air conditioning, a ceiling fan, drink dispensers, a minibar, and a kettle. In addition, there is a bathtub, a Balinese bed, sun loungers, and direct access to the sea on the terrace.","The RIU Palace Maldives will have 176 land-based villas with direct sea access and water villas with a private terrace and stairs going to the sea, some of which will have private pools. The Overwater Villas at RIU Palace are believed to be the most luxury since they will include a private pool and baths on the terrace with direct access to the tiny lagoon.","RIU Palace Maldives is located on the pristine island of Gadifuri, part of Dhaalu Atoll, and is connected to their sister resort, RIU Atoll, via a walkway. Its proximity to Kudahuvadhoo Island, which also has a domestic airport, will make getting to these two resorts a breeze."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 400, 'LlGWVpZYozE', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'riu-palace-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'riu-palace-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'kedhigandu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'riu-palace-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Junior Suite With Beach Access', 400, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'riu-palace-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Overwater Suite', 680, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'riu-palace-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Hurawalhi-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'hurawalhi-island-resort-maldives', 'Hurawalhi Island Resort Maldives', 'Hurawalhi Island Resort, located on an idyllic private island in the Maldives'' pristine Lhaviyani Atoll, is much like your relationship: it is a perfect balance of calm and excitement, comfort and adventure; it stirs up your every atom with an intricate blend of closeness and adrenaline.', 'published', 'Hurawalhi Island Resort Maldives | Maldives Resorts | MTG', 'Hurawalhi Island Resort, located on an idyllic private island in the Maldives'' pristine Lhaviyani Atoll, is much like your relationship: it is a perfect balance of calm and excitement, comfort and adventure; it stirs up your every atom with an intricate blend of closeness and adrenaline.', '{"overview_paragraphs":["Hurawalhi Island Resort, located on an idyllic private island in the Maldives'' pristine Lhaviyani Atoll, is much like your relationship: it is a perfect balance of calm and excitement, comfort and adventure; it stirs up your every atom with an intricate blend of closeness and adrenaline.","Hurawalhi is where you may fill your days with an abundance of extraordinary people, your head with wonder, and your heart with romance. The 90-villa, adults-only luxury resort is as beautiful as the ocean that laps against its beaches and more stunning than any island you''ve ever seen. Nothing prepares you for the stunning combination of barefoot joy and contemporary style found at Hurawalhi than photographs of the Maldives.","Enjoy the best of seaside happiness - Beach Pool Villas have a clean, unassuming appeal and an outstanding location on Hurawalhi''s attractive beach. They are popular with couples whose dream vacation includes seaside luxury.","The Maldives'' grandeur is epitomised by sleek and beautiful homes hung over the gleaming Indian Ocean. Slip into the lagoon from the sundeck and experience Hurawalhi''s spectacular grandeur from the solitude of your villa or your very own infinity pool.","Hurawalhi Island Resort''s villas pamper with opulent luxury, exclusivity, and breathtaking views. With the option of beach-side or over-water luxury, you may enjoy your chosen perspective and setting while having paradise at your fingertips - with the ocean just outside your door.","Hurawalhi Island Resort, nestled away in the north of the pristine Lhaviyani Atoll, combines striking natural beauty and elegant design. During the day, a picturesque 40-minute seaplane ride from Velana'' International Airport will take you to this tropical paradise (MLE). The resort is situated on a private coral island that is approximately 400 m x 165 m in size and is surrounded by the Indian Ocean; the year-round warmth of the water in which Hurawalhi Island Resort is situated is comparable to the shades and variations of blue that stretch out as far as the eye can see."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 900, 'xznjFXZmNPI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'hurawalhi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'hurawalhi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'hurawalhi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'hurawalhi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1150, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'hurawalhi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'hurawalhi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Innahura
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'innahura-maldives-island-resort', 'Innahura Maldives Island Resort', 'Innahura''s formula for a fantastic Maldives vacation is simple: we take the key sun, sea, and sand ingredients, add a traditional twist to modern amenities, and top it off with a large dose of unique experiences. This modest jewel in the south-east Lhaviyani Atoll entices sunseekers, young and old, who are looking for a Maldives resort where letting your hair down and savouring life''s simple pleasures are the norm. You''ll fall in love with Innahura because it''s laid-back, fun, and constantly ready for new adventures, just like you.', 'published', 'Innahura Maldives Island Resort | Maldives Resorts | MTG', 'Innahura''s formula for a fantastic Maldives vacation is simple: we take the key sun, sea, and sand ingredients, add a traditional twist to modern amenities, and top it off with a large dose of unique experiences. This modest jewel in the south-east Lhaviyani Atoll entices sunseekers, young and old, who are looking for a Maldives resort where letting your hair down and savouring life''s simple pleasures are the norm. You''ll fall in love with Innahura because it''s laid-back, fun, and constantly ready for new adventures, just like you.', '{"overview_paragraphs":["Innahura''s formula for a fantastic Maldives vacation is simple: we take the key sun, sea, and sand ingredients, add a traditional twist to modern amenities, and top it off with a large dose of unique experiences. This modest jewel in the south-east Lhaviyani Atoll entices sunseekers, young and old, who are looking for a Maldives resort where letting your hair down and savouring life''s simple pleasures are the norm. You''ll fall in love with Innahura because it''s laid-back, fun, and constantly ready for new adventures, just like you.","Palm trees sway in the air, loungers vie for your attention under them, a length of sand so silky it tickles your feet and takes you from your bungalow to a lagoon as clear as it gets - welcome to Innahura! This is most likely how you imagined your Maldives vacation...","Innahura''s allure rests in his return to simplicity. The bungalows at the resort are designed for folks like you and me: they are simple yet comfortable, unassuming yet unforgettable. They deliver on the promise of a tropical, laid-back refuge from which to lavish on the island''s many attractions. These bright bungalows are big, on the beach, with a minibar, and private sunloungers - these are all your Maldives fantasies are made of, without the expensive price tag.","Innahura Maldives has 78 luxurious accommodations, including 33 Sunset Beach Bungalows and 45 Sunrise Beach Bungalows, as well as 4 neighbouring bungalows for families.","The island of Innahura Maldives is located in the Lhaviyani Atoll to the north of the Maldives. It takes 40 minutes by seaplane, during which you may enjoy a breathtaking view of the Maldives'' garland of islands.","Life is better at the beach, especially when accompanied with delicious food, refreshing beverages, and great company. The resort''s venues bring it all together and contribute to the mix of Innahura''s characteristic casual ambiance; mellow places that keep your tummy full, your thirst satiated, and your days filled with get-togethers and unplanned meet-ups with newly made friends."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 300, '6JHqOSK--sw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'innahura-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'innahura-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'innahura'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'innahura-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'innahura-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- InterContinental
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'intercontinental-maldives-maamunagau-island-resort', 'InterContinental Maldives Maamunagau Island Resort', 'In the vast azure panorama of the Indian Ocean, escape and reconnect with nature, yourself, and those who mean most. From the time you board the seaplane to the serene shores of the Raa Atoll, you will be captivated by island life with silky white dunes and palm tree dotted terraces. Prepare to be astounded by the abundance of marine life in our lagoon, which is near to the UNESCO Biosphere Reserve and has a unique manta ray sanctuary.', 'published', 'InterContinental Maldives Maamunagau Island Resort | Maldives Resorts | MTG', 'In the vast azure panorama of the Indian Ocean, escape and reconnect with nature, yourself, and those who mean most. From the time you board the seaplane to the serene shores of the Raa Atoll, you will be captivated by island life with silky white dunes and palm tree dotted terraces. Prepare to be astounded by the abundance of marine life in our lagoon, which is near to the UNESCO Biosphere Reserve and has a unique manta ray sanctuary.', '{"overview_paragraphs":["In the vast azure panorama of the Indian Ocean, escape and reconnect with nature, yourself, and those who mean most. From the time you board the seaplane to the serene shores of the Raa Atoll, you will be captivated by island life with silky white dunes and palm tree dotted terraces. Prepare to be astounded by the abundance of marine life in our lagoon, which is near to the UNESCO Biosphere Reserve and has a unique manta ray sanctuary.","When you hire the entire island for an intimate family celebration or business trip, you will find something for everyone with a variety of eating places, miles of beautiful beach, and a choice of recreational and wellness activities.","The InterContinental Maldives Maamunagau Resort''s spacious 81 Beach, Lagoon, and Overwater Villas and Residences provide stunning views of the Maldives. Choose between relaxing lagoon or dramatic ocean views from your private patio, and enjoy a beautiful dawn or sunset.","The resort is located on a private island in Raa Atoll, 152 kilometres north of Velana International Airport. Guests will be charmed by the unusual marine life, which includes manta rays and dolphins, since it is located adjacent to the Baa Atoll UNESCO Reserve. Among these intriguing spots to visit nearby, Hanifaru Bay is 35 minutes away by speedboat and is well-known for being a nursery ground for grey sharks and sting rays.","Simple yet remarkable, guests will begin on a gastronomic adventure from the top of the Lighthouse with a predinner cocktail and rare 360 degree views of the Indian Ocean, followed by a personalised private dining experience or a communal sharing dinner at the main restaurant area.","AVI Spa is meant to rejuvenate the spirit by waking the senses and is inspired by the ethereality of the ocean and the transforming power of clean island air. Rejuvenate in one of six over-the-water treatment villas, each of which uses the psychology of natural light and sound to put you in a profound state of relaxation."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 800, 'enmAUSapMec', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'intercontinental-maldives-maamunagau-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'intercontinental-maldives-maamunagau-island-resort'
  and l.node_type = 'location' and l.slug = 'maamunagau'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'intercontinental-maldives-maamunagau-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1200, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'intercontinental-maldives-maamunagau-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Overwater Pool Villa', 800, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'intercontinental-maldives-maamunagau-island-resort'
on conflict (accommodation_id, name) do nothing;

-- JA-Manafaru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'ja-manafaru-maldives-island-resort', 'JA Manafaru Maldives Island Resort', 'Dreams of Romance in a Tropical Island Paradise Experience an enchanting island retreat in the Maldives'' remote sanctuary of JA Manafaru. A tropical Maldives resort in the Indian Ocean blends the tranquillity of the Maldives with six venues, extra In-villa and Destination Dining offers, numerous recreational activities, and unique spa and wellness amenities.', 'published', 'JA Manafaru Maldives Island Resort | Maldives Resorts | MTG', 'Dreams of Romance in a Tropical Island Paradise Experience an enchanting island retreat in the Maldives'' remote sanctuary of JA Manafaru. A tropical Maldives resort in the Indian Ocean blends the tranquillity of the Maldives with six venues, extra In-villa and Destination Dining offers, numerous recreational activities, and unique spa and wellness amenities.', '{"overview_paragraphs":["Dreams of Romance in a Tropical Island Paradise Experience an enchanting island retreat in the Maldives'' remote sanctuary of JA Manafaru. A tropical Maldives resort in the Indian Ocean blends the tranquillity of the Maldives with six venues, extra In-villa and Destination Dining offers, numerous recreational activities, and unique spa and wellness amenities.","Set amid a beautiful oasis around the resort''s main swimming pool, the Mediterranean-inspired Bistro is available for lunch and afternoon meals until early evening. Ideal for couples and families that require all-day dining till late meal.","Pool on the beach Villa surrounded by tropical vegetation, just steps from the gorgeous beach and your private beach cabana. Cozy living rooms with an open-air bathroom that leads to an attractive sundeck, a pool, a daybed and sun loungers in the garden and on the beach. While dining al fresco in your private beach dining cabana, take in the wind.","Wake awake to the sound of the Indian Ocean. As the sun rises over the horizon, watch the water below your villa reflect the morning light from your sun terrace. Connect with nature directly from your villa or view from the glass floor panel in luxury. Relax your body and mind in your own infinity pool or on the terrace with the most breathtaking views.","Do you fantasise of a romantic getaway in your own overwater villa with direct access to the ocean? Maybe you fantasise of walking out of your Beach Villa onto the lovely beach that surrounds the island. Whatever your heart desires, we offer many of alternatives for your island stay, and all of them include your very own private plunge pool and daily breakfast. Discover nature''s splendours at their best. Whether you choose beachfront or waterfront living, each of JA Manafaru''s 84 villas and homes has been designed to fit in with the island''s natural scenery.","Domestic flight: The trip from Male'' International Airport to Hanimadhoo Island takes around 55 minutes. After that, a 45-minute speedboat ride from Hanimadhoo Island to JA Manafaru Private Island follows. Private seaplane flight: The voyage from Male'' International Airport to JA Manafaru Private Island takes around 90 minutes."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 1200, 'RUmR4femVf4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'ja-manafaru-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'ja-manafaru-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'manafaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'ja-manafaru-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1200, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'ja-manafaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Water Villa Pool', 1400, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'ja-manafaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- JOALI
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'joali-maldives-island-resort', 'JOALI Maldives Island Resort', 'Our tale began with the ambition of creating a one-of-a-kind creative resort in the beautiful Raa Atoll. Thus was created JOALI Maldives, an utopia of creativity, pleasure, and adventure. Through a magnificent collection of artworks that spread over the island, visitors may feel the joy of life.', 'published', 'JOALI Maldives Island Resort | Maldives Resorts | MTG', 'Our tale began with the ambition of creating a one-of-a-kind creative resort in the beautiful Raa Atoll. Thus was created JOALI Maldives, an utopia of creativity, pleasure, and adventure. Through a magnificent collection of artworks that spread over the island, visitors may feel the joy of life.', '{"overview_paragraphs":["Our tale began with the ambition of creating a one-of-a-kind creative resort in the beautiful Raa Atoll. Thus was created JOALI Maldives, an utopia of creativity, pleasure, and adventure. Through a magnificent collection of artworks that spread over the island, visitors may feel the joy of life.","An art-infused luxury island resort located on Muravandhoo Island in Raa Atoll in the Maldives'' northernmost reaches. Coral reefs teem with life and colour where lovely white dunes meet magnificent blue seas. Raise a glass to long-lasting glamour in this enchanted realm, a constant expression of joie de vivre.","Our luxurious one-bedroom beach home offers views of the Maldives'' beach, garden, and ocean. Featuring hand-selected art objects, a private beach garden, and an infinity pool.","Discover the allure of ocean life from this one-bedroom water cottage. You are in for an unforgettable luxury resort experience.","Discover the best of island living. Awaken to glistening seascapes and delicate white dunes. Experience the awe of an impressionist sunset. Allow the waves to lull you to sleep. The Indian Ocean is your constant companion, bringing you joy at all hours of the day and night. The magnificent private villas and houses at the resort epitomise sustainable luxury. Each of JOALI''s 73 villas was inspired by a different story and was created to take visitors on a sensory journey. An environment of unusual luxury is created through artisanal amenities, selected in-room book shelves, careful décor, and exquisite objet d''art.","JOALI Maldives is located on Muravandhoo island in the Raa Atoll in the Maldives'' northernmost region. Arriving guests will be welcomed inside the special JOALI airport lounge at Male Airport. Before your transfer to the resort, you may unwind there. Transfer takes 40 minutes by seaplane or 35 minutes by domestic flight followed by 15 minutes by speedboat."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 2300, '0VIhza1IyE0', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'joali-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'joali-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'muravandhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'joali-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 2900, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'joali-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa Pool', 2300, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'joali-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- JW-Marriott
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'jw-marriott-maldives-island-resort', 'JW Marriott Maldives Island Resort', 'JW Marriott Maldives Resort & Spa is a picturesque luxury haven on the blue seas of Shaviyani Atoll. Relax in contemporary overwater villas and beach villas with luxurious mattresses, private pools, and decks with breathtaking views of the Indian Ocean. At our different dining places, delight your palette with exceptional Japanese, Italian, and world cuisine, as well as treetop dining and buffet breakfasts. Explore a wide range of sports such as snorkelling, scuba diving, jet skiing, and sailing. Our Little Griffins kids'' group allows children to have their own experiences in the Maldives. Refresh in our dazzling pool or have an intense workout in our modern fitness centre. Make a wonderful day in Shaviyani Atoll with a refreshing beauty or massage treatment.', 'published', 'JW Marriott Maldives Island Resort | Maldives Resorts | MTG', 'JW Marriott Maldives Resort & Spa is a picturesque luxury haven on the blue seas of Shaviyani Atoll. Relax in contemporary overwater villas and beach villas with luxurious mattresses, private pools, and decks with breathtaking views of the Indian Ocean. At our different dining places, delight your palette with exceptional Japanese, Italian, and world cuisine, as well as treetop dining and buffet breakfasts. Explore a wide range of sports such as snorkelling, scuba diving, jet skiing, and sailing. Our Little Griffins kids'' group allows children to have their own experiences in the Maldives. Refresh in our dazzling pool or have an intense workout in our modern fitness centre. Make a wonderful day in Shaviyani Atoll with a refreshing beauty or massage treatment.', '{"overview_paragraphs":["JW Marriott Maldives Resort & Spa is a picturesque luxury haven on the blue seas of Shaviyani Atoll. Relax in contemporary overwater villas and beach villas with luxurious mattresses, private pools, and decks with breathtaking views of the Indian Ocean. At our different dining places, delight your palette with exceptional Japanese, Italian, and world cuisine, as well as treetop dining and buffet breakfasts. Explore a wide range of sports such as snorkelling, scuba diving, jet skiing, and sailing. Our Little Griffins kids'' group allows children to have their own experiences in the Maldives. Refresh in our dazzling pool or have an intense workout in our modern fitness centre. Make a wonderful day in Shaviyani Atoll with a refreshing beauty or massage treatment.","JW Marriott Maldives Resort & Spa offers 60 luxury Beach and Overwater Pool Villas with living sizes ranging from 234 sqm to 285 sqm. Our beautiful and large Beach and Overwater Pool Villas are suitable for both couples and families visiting Maldives, with contemporary and airy décor offering the utmost seclusion and tranquillity. From your private villa terrace with its own huge private wooden deck, pool, and outdoor shower, you may enjoy an unimpeded view of the Indian Ocean or our island''s beautiful tropical gardens. Each villa at the JW Marriott Maldives Resort & Spa is inspired by the natural surroundings and Maldivian culture, with colours and materials that reflect the island locale. Villas'' thatched roofs are suggestive of upside-down Dhoni boats, Maldives'' traditional wooden fishing vessels, and sloping roof tips are reminiscent of white herons dipping their heads into the ocean.","JW Marriott Maldives Resort & Spa provides a tropical island haven with 61 magnificent Beach and Overwater Pool villas in the remote Shaviyani Atoll. The Villas have been created with modern roomy and airy interiors that give an intimate setting that allows for seclusion while still providing thoughtful interacting places if desired.","JW Marriott Maldives Resort & Spa is located on the beautiful island of Van''gaaru in the Shaviyani Atoll, a picturesque 55-minute seaplane ride from Velana International Airport in Male, Maldives.","JW Marriott Maldives Resort & Spa offers a diverse range of gastronomic experiences. Begin your day with a hearty breakfast at Aailaa, then order your favourite pizza from Fiamma for a quiet lunch by the pool, or spice up your day with genuine Thai food from Kaashi. Horizon offers a tranquil view of the Maldivian sunset while serving your favourite cocktails. Visit our Wine Room for a wine-pairing dining experience, or Rum Baan to build your own drink. For pre-dinner beverages, try our famous smoked cocktails at Wabi Sabi before indulging in Japanese delicacies at Hashi or the best prime cut meats and crustaceans at Shio, our namesake restaurant.","We believe that genuine well-being begins with mind-body harmony at Spa by JW. As a result, we design places that can support a variety of health activities, from activeness to more restorative mindfulness periods, while letting in natural light and enabling access to more natural settings. There is no better place in the world to experiment with natural remedies than on a private island paradise. Join us for a Personal Training Session, a Personal Yoga Class, or a Guided Meditation to revitalise your mind, body, and spirit."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 750, 'EHZiO7QOToA', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'jw-marriott-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'jw-marriott-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'vagaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'jw-marriott-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Pool Villa', 800, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'jw-marriott-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Over Water Villa Pool', 750, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'jw-marriott-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Jumeirah-Olhahali
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'jumeirah-maldives-olhahali-island-resort', 'Jumeirah Maldives Olhahali Island Resort', 'The Jumeirah Maldives Olhahali Island is an all-day dining venue with professional chefs serving a diverse menu of foreign delicacies. Take in the soft sea breeze on the open-air terrace atop the seclusion of your beautiful villa while you revel in your rooftop movie experience, whether it''s a treasured family event or a significant romantic getaway. Our beach boutique offers an uplifting luxury experience for discerning travellers seeking serenity away from it all. Discover a diverse range of outstanding and ecologically responsible resort wear, menswear, womenswear, childrenswear, accessories, and jewellery from across the world, as well as Maldivian crafts.', 'published', 'Jumeirah Maldives Olhahali Island Resort | Maldives Resorts | MTG', 'The Jumeirah Maldives Olhahali Island is an all-day dining venue with professional chefs serving a diverse menu of foreign delicacies. Take in the soft sea breeze on the open-air terrace atop the seclusion of your beautiful villa while you revel in your rooftop movie experience, whether it''s a treasured family event or a significant romantic getaway. Our beach boutique offers an uplifting luxury experience for discerning travellers seeking serenity away from it all. Discover a diverse range of outstanding and ecologically responsible resort wear, menswear, womenswear, childrenswear, accessories, and jewellery from across the world, as well as Maldivian crafts.', '{"overview_paragraphs":["The Jumeirah Maldives Olhahali Island is an all-day dining venue with professional chefs serving a diverse menu of foreign delicacies. Take in the soft sea breeze on the open-air terrace atop the seclusion of your beautiful villa while you revel in your rooftop movie experience, whether it''s a treasured family event or a significant romantic getaway. Our beach boutique offers an uplifting luxury experience for discerning travellers seeking serenity away from it all. Discover a diverse range of outstanding and ecologically responsible resort wear, menswear, womenswear, childrenswear, accessories, and jewellery from across the world, as well as Maldivian crafts.","A isolated one-bedroom villa with its own infinity pool that ends only with the atoll''s beautiful dunes and blue ocean. Relax on your rooftop or poolside and enjoy views that are uniquely yours.","Our Water Villa is perched atop the coral, on a pier extending out into the blue waters of the North Lagoon. From your private rooftop terrace, where you may dine or simply rest, you can see even further across the ocean. Sit in a covered sunken salon on the lower deck, or chill off and drift in your own pool.","Each house is capped with a stunning private Sky-Lounge for the first time in the Maldives. Every room, whether on the beach or on stilts over water, has a private pool and an inspiring expanse of sky-lounge roof deck. With all seven accommodation types elevating indoor-outdoor living to new heights of breezy sophistication, this is a Maldives-exclusive elevated island experience.","It takes 45 minutes by luxury speedboat from Velana International Airport to reach this tiny resort, which is a visual feast of nautical forms and tones. Each of the 67 double-story villas offers a private pool with a vibrant South Beach vibe, thanks to the new vision of Singaporean design studio Miaja.","Set sail over the glistening sea on one of Jumeirah Maldives'' special yachts, from awe-inspiring sunset cruises to a joyous adventure in search of the friendly Maldivian dolphins. Guests at Jumeirah Maldives may also book chartered tailored excursions, including as fishing trips or visits to other local islands."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 2100, 'EAExZzTcTGI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'jumeirah-maldives-olhahali-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'jumeirah-maldives-olhahali-island-resort'
  and l.node_type = 'location' and l.slug = 'olhahali'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'jumeirah-maldives-olhahali-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 2300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'jumeirah-maldives-olhahali-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa Pool', 2100, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'jumeirah-maldives-olhahali-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Kandima
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'kandima-maldives-island-resort', 'Kandima Maldives Island Resort', 'KWelcome to one of the world''s most beautiful islands: a UNESCO Biosphere Reserve wilderness where iridescent blues, jungle greens, and bright whites collide with innovation, conservation, and health. Snorkel with manta rays in aquarium-like waters, help sea turtles at our Marine Discovery Centre, relax at AyurMa, and eat at Blu Beach Club. Kandima Maldives is more than simply a vacation; it''s a way of life! Experience this new game-changing location, which features 264 elegantly built apartments and villas, 10 amazing eating establishments, and a plethora of fun-filled activities. This very sophisticated resort welcomes visitors of all ages and income levels, including families, couples, groups of friends, and honeymooners. Kandima Maldives provides something for everyone, whether you''re looking for a romance holiday, aquatic adventures, fitness activities, spa escapes, or just family time. The island, located in the Dhaalu Atoll, is only a thirty-minute flight from Velana International Airport, followed by a twenty-minute boat journey to this very elegant island.', 'published', 'Kandima Maldives Island Resort | Maldives Resorts | MTG', 'KWelcome to one of the world''s most beautiful islands: a UNESCO Biosphere Reserve wilderness where iridescent blues, jungle greens, and bright whites collide with innovation, conservation, and health. Snorkel with manta rays in aquarium-like waters, help sea turtles at our Marine Discovery Centre, relax at AyurMa, and eat at Blu Beach Club. Kandima Maldives is more than simply a vacation; it''s a way of life! Experience this new game-changing location, which features 264 elegantly built apartments and villas, 10 amazing eating establishments, and a plethora of fun-filled activities. This very sophisticated resort welcomes visitors of all ages and income levels, including families, couples, groups of friends, and honeymooners. Kandima Maldives provides something for everyone, whether you''re looking for a romance holiday, aquatic adventures, fitness activities, spa escapes, or just family time. The island, located in the Dhaalu Atoll, is only a thirty-minute flight from Velana International Airport, followed by a twenty-minute boat journey to this very elegant island.', '{"overview_paragraphs":["KWelcome to one of the world''s most beautiful islands: a UNESCO Biosphere Reserve wilderness where iridescent blues, jungle greens, and bright whites collide with innovation, conservation, and health. Snorkel with manta rays in aquarium-like waters, help sea turtles at our Marine Discovery Centre, relax at AyurMa, and eat at Blu Beach Club. Kandima Maldives is more than simply a vacation; it''s a way of life! Experience this new game-changing location, which features 264 elegantly built apartments and villas, 10 amazing eating establishments, and a plethora of fun-filled activities. This very sophisticated resort welcomes visitors of all ages and income levels, including families, couples, groups of friends, and honeymooners. Kandima Maldives provides something for everyone, whether you''re looking for a romance holiday, aquatic adventures, fitness activities, spa escapes, or just family time. The island, located in the Dhaalu Atoll, is only a thirty-minute flight from Velana International Airport, followed by a twenty-minute boat journey to this very elegant island.","Welcome to your own cool and elegant hideaway. Take in the breathtaking view of Kandima''s huge lagoon from above the treetops, or just walk to the shore. Do you require extra space? We have 8 Two-Bedroom Family Sky Suites that are joined by a lounge space and are ideal for groups of friends or families that want to stay near together. That''s what we mean by \"home away from home.\"","Do you need some sea rehabilitation? These villas are perched overwater and have direct access to the lagoon, making them ideal for those looking for the ultimate overwater vacation. The private sundeck with sun loungers and a bathroom give a stunning view of Kandima''s expansive lagoon. Your daily \"vitamin sea\" dosage is assured.","Our 264 apartments and villas are not just elegantly pleasant, but also intelligent! Our apartments and villas are anything from average, with tech-savvy amenities, service at your fingertips, and bright and airy décor. Even if you''re miles from anything, you can stay connected with free Wi-Fi.","Kandima Maldives is located on one of the Maldives'' most secluded atolls. Only 7 of the atoll''s 57 islands are inhabited, making Dhaalu atoll one of the country''s most pristine places.","This trendy beach house on the beach with indoor and outdoor seating provides informal dining by day and sophisticated trademark dining on the beach by night. Enjoy an unlimited variety of Mediterranean cuisine, seafood, tapas, steaks, oven-baked pizzas, and great wines from our cellar. With a wide garden area, this restaurant is ideal for hosting outdoor gala dinner events for bigger parties or gatherings of family and friends."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, null, 'yUpZcB6oe_A', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'kandima-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'kandima-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'kandima'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'kandima-maldives-island-resort'
on conflict (id) do nothing;

-- Kandolhu
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'kandolhu-maldives-island-resort', 'Kandolhu Maldives Island Resort', 'An island as neatly constructed as Kandolhu is unusual even in the Maldives. The island is beautiful, with vast sandy beaches surrounding the emerald green water, and it is home to one of the Maldives'' most colourful and dynamic house reefs. Kandolhu is an amazing Maldives resort with just 30 villas that flawlessly integrate natural Maldivian elements with modern architecture and creature-comforts, creating an experience that will stay with you forever.', 'published', 'Kandolhu Maldives Island Resort | Maldives Resorts | MTG', 'An island as neatly constructed as Kandolhu is unusual even in the Maldives. The island is beautiful, with vast sandy beaches surrounding the emerald green water, and it is home to one of the Maldives'' most colourful and dynamic house reefs. Kandolhu is an amazing Maldives resort with just 30 villas that flawlessly integrate natural Maldivian elements with modern architecture and creature-comforts, creating an experience that will stay with you forever.', '{"overview_paragraphs":["An island as neatly constructed as Kandolhu is unusual even in the Maldives. The island is beautiful, with vast sandy beaches surrounding the emerald green water, and it is home to one of the Maldives'' most colourful and dynamic house reefs. Kandolhu is an amazing Maldives resort with just 30 villas that flawlessly integrate natural Maldivian elements with modern architecture and creature-comforts, creating an experience that will stay with you forever.","These one-of-a-kind Maldives beach villas on Kandolhu''s western coastlines have a king bed and a big open air garden bathroom with a jetted bathtub, shower, and twin vanity. A second outdoor shower has been installed in the backyard. The front veranda has a comfortable daybed and an eating area, while the neighbouring sundeck has sun loungers and a sun umbrella.","The magnificent Pool Villa, which faces east, has a spacious bedroom with a king-sized bed overlooking the pool and the turquoise lagoon beyond. Enter the big open air bathroom through the expansive wardrobe, which has a freestanding bath, shower, dual vanity, and an outside garden shower. These Maldives luxury homes have wide verandas with an outdoor daybed. Each outside deck features a 9-square-meter pool, sun loungers, a sun shade, and an eating area.","This exquisite seaside villa in the Maldives is located above the water and has A huge bedroom with a king bed, a daybed, and views of the ocean. This luxurious villa''s bathroom overlooks the lagoon and features a jetted bathtub, dual vanity, shower, and dressing space. The sun terrace is secluded and equipped with sun loungers, a sun umbrella, and stairs leading down to the water.","Kandolhu Maldives has 30 villas in 5 different designs, each with its own unique design. All homes have Maldivian architecture with contemporary decor. They are all in outstanding sites, having either immediate beach access or unobstructed views of the Indian Ocean.","Kandolhu Maldives is 70 kilometres from Velana International Airport and can be accessed by a 20-minute seaplane flight followed by a 15-minute speedboat ride."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 700, 'uvRrBgIp_1I', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'kandolhu-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'kandolhu-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'kandolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'kandolhu-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 700, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'kandolhu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'kandolhu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Villa', 1100, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'kandolhu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Komandoo-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'komandoo-island-resort-and-spa-maldives', 'Komandoo Island Resort and Spa Maldives', 'Komandoo is tailor-made for romance, combining the splendour of the Maldives with the charm of a tiny resort. A laid-back hideaway guaranteed by award-winning attentiveness and a variety of leisure activities, ideal for your honeymoon, a calm romantic holiday, or a trip with friends. Pure and uncomplicated paradise awaits. The Maldives is linked with honeymoons and unforgettable vacations, and it is a popular destination for adults-only retreats. One of the many reasons people pick the Maldives as a vacation destination is the ''One Island, One Resort'' idea.', 'published', 'Komandoo Island Resort and Spa Maldives | Maldives Resorts | MTG', 'Komandoo is tailor-made for romance, combining the splendour of the Maldives with the charm of a tiny resort. A laid-back hideaway guaranteed by award-winning attentiveness and a variety of leisure activities, ideal for your honeymoon, a calm romantic holiday, or a trip with friends. Pure and uncomplicated paradise awaits. The Maldives is linked with honeymoons and unforgettable vacations, and it is a popular destination for adults-only retreats. One of the many reasons people pick the Maldives as a vacation destination is the ''One Island, One Resort'' idea.', '{"overview_paragraphs":["Komandoo is tailor-made for romance, combining the splendour of the Maldives with the charm of a tiny resort. A laid-back hideaway guaranteed by award-winning attentiveness and a variety of leisure activities, ideal for your honeymoon, a calm romantic holiday, or a trip with friends. Pure and uncomplicated paradise awaits. The Maldives is linked with honeymoons and unforgettable vacations, and it is a popular destination for adults-only retreats. One of the many reasons people pick the Maldives as a vacation destination is the ''One Island, One Resort'' idea.","Komandoo''s Beach Villas, with their tastefully equipped environment reminiscent of traditional Maldives, are the ideal hideaway for those looking for a romantic break. Enjoy your own private terrace with views of Komandoo''s stunning blue lagoon. The Komandoo Beach Villas are huge timber bungalows tucked away along the beach. Each villa includes a wooden balcony from which to enjoy the sound of the ocean and the breathtaking scenery. These traditional Maldivian villas create a peaceful environment for your stay at Komandoo.","The most coveted villas on Komandoo ensure a magnificent and romantic setting for your stay in paradise. A spacious, partially roofed wooden terrace with a stairway running down to the water provides you with your own own slice of paradise. The tranquillity of the lagoon makes these villas an ideal choice for your honeymoon or a romantic holiday with your sweetheart. Relax in your own Jacuzzi or spa bath while staring out over the horizon where turquoise seas meet sapphire-colored skies.","Nothing says \"vacation\" like a lovely villa that provides much-needed peace and relaxation. Offering genuine Maldivian luxury and charm, as well as a picture-perfect site, either on the beach or above the lagoon. The villas at Komandoo will take your breath away with their lovely surroundings.","Komandoo is located in the Lhaviyani Atoll, a scenic 40-minute seaplane ride from Male\"s Velana International Airport.","Whether it''s a romantic lunch for two beneath the stars, a bountiful buffet, or fine dining, Komandoo provides great dining options for all occasions, including the opportunity to dine under the sea at our sister resort, Hurawalhi Maldives. Komandoo''s dining and drinking options are rounded out with a selection of bars where you may sip your favourite libation. Aqua, Komandoo''s a-la-carte restaurant, is just breathtaking. Diners may savour exquisite delicacies while perched on stilts over the lagoon, surrounded by the natural splendour of the Maldives."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 500, 'USCSU8yKo_Y', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'komandoo-island-resort-and-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'komandoo-island-resort-and-spa-maldives'
  and l.node_type = 'location' and l.slug = 'komandoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'komandoo-island-resort-and-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 500, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'komandoo-island-resort-and-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'JACUZZI WATER VILLA', 700, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'komandoo-island-resort-and-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Kudadoo
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'kudadoo-maldives-private-island-resort', 'Kudadoo Maldives Private Island Resort', 'KUDADOO MALDIVES PRIVATE ISLAND PROVIDES A COMPLETE EXPERIENCE WITH EVERYTHING UNDER THE MOON AVAILABLE TO YOU AT ANY TIME AND FROM ANYWHERE. THIS PRIVATE ISLAND HAS BEEN DESIGNED FOR ESCAPES FROM THE CONFINES OF EVERYDAY LIFE AND IS SURE TO IMPRESS EVEN THE MOST DISCERNING TRAVELLER. MAGNIFICENT MOMENTS TAKE THE FORM OF DELICIOUS CULINARY CREATIONS, ENDLESS LEISURE ACTIVITIES, AND WELLNESS. SEIZE YOUR DAYS ON THIS TINY TROPICAL ISLAND WITH THE HELP OF YOUR PERSONAL BUTLER, WHO CAN ASSIST YOU IN CREATING THE PERFECT HOLIDAY ITINERARY. KUDADOO SETS A NEW STANDARD IN SUSTAINABLE LUXURY HOSPITALITY WITH THE ARCHITECTURAL MASTERMIND, YUJI YAMAZAKI; WE TAKE GREAT PRIDE IN THE FOLLOWING ACCOLADES: LUXURY TRAVEL INTELLIGENCE''S BEST NEW LUXURY HOTEL FOR 2018; ROBB REPORT''S BEST ISLAND RESORT 2019.', 'published', 'Kudadoo Maldives Private Island Resort | Maldives Resorts | MTG', 'KUDADOO MALDIVES PRIVATE ISLAND PROVIDES A COMPLETE EXPERIENCE WITH EVERYTHING UNDER THE MOON AVAILABLE TO YOU AT ANY TIME AND FROM ANYWHERE. THIS PRIVATE ISLAND HAS BEEN DESIGNED FOR ESCAPES FROM THE CONFINES OF EVERYDAY LIFE AND IS SURE TO IMPRESS EVEN THE MOST DISCERNING TRAVELLER. MAGNIFICENT MOMENTS TAKE THE FORM OF DELICIOUS CULINARY CREATIONS, ENDLESS LEISURE ACTIVITIES, AND WELLNESS. SEIZE YOUR DAYS ON THIS TINY TROPICAL ISLAND WITH THE HELP OF YOUR PERSONAL BUTLER, WHO CAN ASSIST YOU IN CREATING THE PERFECT HOLIDAY ITINERARY. KUDADOO SETS A NEW STANDARD IN SUSTAINABLE LUXURY HOSPITALITY WITH THE ARCHITECTURAL MASTERMIND, YUJI YAMAZAKI; WE TAKE GREAT PRIDE IN THE FOLLOWING ACCOLADES: LUXURY TRAVEL INTELLIGENCE''S BEST NEW LUXURY HOTEL FOR 2018; ROBB REPORT''S BEST ISLAND RESORT 2019.', '{"overview_paragraphs":["KUDADOO MALDIVES PRIVATE ISLAND PROVIDES A COMPLETE EXPERIENCE WITH EVERYTHING UNDER THE MOON AVAILABLE TO YOU AT ANY TIME AND FROM ANYWHERE. THIS PRIVATE ISLAND HAS BEEN DESIGNED FOR ESCAPES FROM THE CONFINES OF EVERYDAY LIFE AND IS SURE TO IMPRESS EVEN THE MOST DISCERNING TRAVELLER. MAGNIFICENT MOMENTS TAKE THE FORM OF DELICIOUS CULINARY CREATIONS, ENDLESS LEISURE ACTIVITIES, AND WELLNESS. SEIZE YOUR DAYS ON THIS TINY TROPICAL ISLAND WITH THE HELP OF YOUR PERSONAL BUTLER, WHO CAN ASSIST YOU IN CREATING THE PERFECT HOLIDAY ITINERARY. KUDADOO SETS A NEW STANDARD IN SUSTAINABLE LUXURY HOSPITALITY WITH THE ARCHITECTURAL MASTERMIND, YUJI YAMAZAKI; WE TAKE GREAT PRIDE IN THE FOLLOWING ACCOLADES: LUXURY TRAVEL INTELLIGENCE''S BEST NEW LUXURY HOTEL FOR 2018; ROBB REPORT''S BEST ISLAND RESORT 2019.","YOUR SECLUDED HIDEAWAY IS LOCATED ON TOP OF AN AQUAMARINE LAGOON. THE RESIDENCES ON KUDADOO MALDIVES PRIVATE ISLAND HAVE CAREFULLY CRAFTED INTERIORS AND EXTERIORS. THEY BRING FREEDOM OF TIME, SPACE, AND UNRESTRICTED CONNECTIONS. IN PRECIOUS MOMENTS OF INDULGENCE, AN ENVIRONMENTALLY CONSCIOUS DESIGN, SHEER COMFORT, AND THE UTMOST PRIVACY COME TOGETHER. THIS IS A PLACE WHERE YOU CAN EXPLORE YOURSELF.","Hurawalhi''s Kudadoo Maldives Private Island is an elite resort with just 15 large, overwater Ocean Residences with 44 sq metre terrace pools. Each property floats on an azure lagoon and boasts a carefully crafted interior and outdoor space that exudes connection.","Kudadoo Maldives is a private island with a gorgeous lagoon, a stunning house reef, and extensive lengths of white sandy beach. Kudadoo is approximately 200 metres long and 200 metres broad. A direct seaplane trip from Velana International Airport takes 40 minutes and is a picturesque flight.","LIKE GOOD FOOD, NOTHING BRINGS PEOPLE TOGETHER. KUDADOO IS FULL OF TASTE EXPERIENCES CAREFULLY CURATE BY THE EXECUTIVE CHEF. THE MENUS INCLUDE ALL-TIME FAVORITES IN ADDITION TO FINE DINING TREATS, AND A RANGE OF DIETARY REQUIREMENTS AND PREFERENCES CAN BE ACCOMMODATED UPON REQUEST.","SULHA SPA AT THE RETREAT IS A SANCTUARY SUSPENDED OVER THE OCEAN THAT ALLOWS YOU TO CALM THE PERSISTENT CONSCIOUS LOOP WITH IMMERSIVE EXPERIENCES SO YOU CAN REST, RESET, AND CONNECT. YOU WILL FEEL BETTER THAN YOU HAVE IN YEARS IF YOU SPEND AS MUCH TIME AS YOU WISH ENJOYING WORLD-CLASS SPA AND WELL-BEING EXPERIENCES."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 4300, 'Kmbrx_LYk0Q', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'kudadoo-maldives-private-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'kudadoo-maldives-private-island-resort'
  and l.node_type = 'location' and l.slug = 'kudadoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'kudadoo-maldives-private-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Pool Residence Single Bedroom', 4300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'kudadoo-maldives-private-island-resort'
on conflict (accommodation_id, name) do nothing;

-- LUX-South
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'lux-south-ari-atoll-resorts-maldives-island', 'LUX* South Ari Atoll Resorts Maldives Island', 'The Maldives is one of those destinations that keeps appearing on travellers'' wish lists. And not without cause. If you''ve ever dreamt of living like Robinson Crusoe on a remote tropical island, you''ve come to the correct spot. At LUX* South Ari Atoll, you can ride your bicycle along the jetty, swim with whale sharks, relax in your stilted bungalow, dine at any of the eight restaurants, dance the night away, and participate in marine conservation... Whatever you''re looking for, you''ll find it at LUX* South Ari Atoll.', 'published', 'LUX* South Ari Atoll Resorts Maldives Island | Maldives Resorts | MTG', 'The Maldives is one of those destinations that keeps appearing on travellers'' wish lists. And not without cause. If you''ve ever dreamt of living like Robinson Crusoe on a remote tropical island, you''ve come to the correct spot. At LUX* South Ari Atoll, you can ride your bicycle along the jetty, swim with whale sharks, relax in your stilted bungalow, dine at any of the eight restaurants, dance the night away, and participate in marine conservation... Whatever you''re looking for, you''ll find it at LUX* South Ari Atoll.', '{"overview_paragraphs":["The Maldives is one of those destinations that keeps appearing on travellers'' wish lists. And not without cause. If you''ve ever dreamt of living like Robinson Crusoe on a remote tropical island, you''ve come to the correct spot. At LUX* South Ari Atoll, you can ride your bicycle along the jetty, swim with whale sharks, relax in your stilted bungalow, dine at any of the eight restaurants, dance the night away, and participate in marine conservation... Whatever you''re looking for, you''ll find it at LUX* South Ari Atoll.","You couldn''t get much closer to the shore if you tried. Our thatched-roof beach pavilion is as stylish as they come. There is the option of interconnecting rooms, making this a good choice for families with small children or friends who enjoy going on double dates.","If picture-perfect vacations are your goal, you''ll enjoy our elegant beach home. A seaside house. The most beautiful private pool. Amenities tailored to the needs of the leisure tourist. The most romantic indoor-outdoor bathroom imaginable. Welcome to your Maldives home.","As hoteliers who like travelling, we understand the value of a good night''s sleep. It''s the nicest feeling to having a home away from home. Our Maldives water villa is that house, but on stilts with the Indian Ocean as your pool!","At LUX* South Ari Atoll, 193 private villas are scattered over two miles of powder fine beaches and situated on stilts above a beautiful lagoon. These incredibly big rooms and suites provide a totally unique atmosphere of coastal, beach house flair to the Maldives, whether on land or above water, sunset facing or dawn facing.","The picture-perfect island of Dhidhoofinolhu is home to LUX* South Ari Atoll, a luxury resort where your ideal of a laid-back, desert island paradise is about to come true, whether you desire a calm getaway or active adventure. This home is also in one of Maamigili''s prime locations. South Ari Atoll is 30 minutes by seaplane from Malé International Airport."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 600, '0wkm-EuG-Aw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'lux-south-ari-atoll-resorts-maldives-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'lux-south-ari-atoll-resorts-maldives-island'
  and l.node_type = 'location' and l.slug = 'dhidhoofinolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'lux-south-ari-atoll-resorts-maldives-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pavillion', 600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'lux-south-ari-atoll-resorts-maldives-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1100, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'lux-south-ari-atoll-resorts-maldives-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 1000, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'lux-south-ari-atoll-resorts-maldives-island'
on conflict (accommodation_id, name) do nothing;

-- Lily-beach
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'lily-beach-resort-spa-maldives-island-resort', 'Lily Beach Resort & Spa Maldives Island Resort', 'Lily Beach Resort & Spa''s Platinum Plan allows you to enjoy a hassle-free, outstanding value-for-money vacation. This is an all-inclusive package that includes a magnificent assortment of high-quality services such as exquisite dining experiences, romantic excursions, sporting activities, and high-quality items such as premium wines and spirits.', 'published', 'Lily Beach Resort & Spa Maldives Island Resort | Maldives Resorts | MTG', 'Lily Beach Resort & Spa''s Platinum Plan allows you to enjoy a hassle-free, outstanding value-for-money vacation. This is an all-inclusive package that includes a magnificent assortment of high-quality services such as exquisite dining experiences, romantic excursions, sporting activities, and high-quality items such as premium wines and spirits.', '{"overview_paragraphs":["Lily Beach Resort & Spa''s Platinum Plan allows you to enjoy a hassle-free, outstanding value-for-money vacation. This is an all-inclusive package that includes a magnificent assortment of high-quality services such as exquisite dining experiences, romantic excursions, sporting activities, and high-quality items such as premium wines and spirits.","The Beach Villas allow you to fully enjoy the lovely natural playground just outside your door. The Villas are set among lush greenery, only steps from the warm Indian Ocean and a short walk from the resort''s main area.","Many of our visitors prefer the Lagoon Villas because of their private patio with direct access to the lagoon and tropical surroundings.","At Lily Beach Huvahendhoo, the pleasure never stops, and the hotel seeks to enliven days, enrapture evenings, and awaken visitors to a heightened level of well-being. The major goal has been to transform the resort into a high-quality, premium experience. All of its villas and public rooms are made entirely of natural materials. The finished project is a synthesis of current design and Maldivian architecture. It is a great combination of wood, various types of natural stones, and modern design that blends in wonderfully with the island''s natural environment.","Lily Beach Resort is located on the island of Huvahendhoo, South Ari Atoll, and is 600 m long and 110 m wide. It is a 25-minute sea plane flight from Male International Airport. Because of its advantageous location in the magnificent Ari Atoll, it is adjacent to some of the world''s most remarkable dive locations.","Maa, the local term for flower, is a place where your love of delicious cuisine may blossom into a pleasurable eating experience. The genuine value of this wonderful sand-floored restaurant is provided by its magnificent, all-inclusive buffet dishes that will whet anyone''s appetite. Lily Maa, the primary buffet-style restaurant, will enable you bloom into a genuine gourmet, recognising that the quality of your Maldives experience will unavoidably expand through the seduction of your taste senses as well. Every day of the week, a new foreign cuisine to transport you to other corners of the world while being at the one you wouldn''t exchange for anything else. Whatever your favourite dish, Lily Maa is an unrivalled gastronomic treat, recognised across the Maldives for its chefs'' feasts. Don’t"]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1100, 'JEgqJqbA79E', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'lily-beach-resort-spa-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'lily-beach-resort-spa-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'huvahendhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'lily-beach-resort-spa-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 1100, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'lily-beach-resort-spa-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 1200, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'lily-beach-resort-spa-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Maayafushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'nakai-maayafushi-maldives-island-resort', 'NAKAI Maayafushi Maldives Island Resort', 'Maayafushi, located in the northern portion of the Ari Atoll, contains all of the characteristics that distinguish this little region of Maldives: from the untamed nature of the vegetation to the bottom inhabited by the most diverse types of fish. The resort is framed by crystal blue waters and lovely beaches, and its rooms can provide tourists with every type of comfort. The island, with its well-known diving spots, is a popular destination for divers from all over the world, from the most experienced to those who want to dive for the first time in these enchanted depths.', 'published', 'NAKAI Maayafushi Maldives Island Resort | Maldives Resorts | MTG', 'Maayafushi, located in the northern portion of the Ari Atoll, contains all of the characteristics that distinguish this little region of Maldives: from the untamed nature of the vegetation to the bottom inhabited by the most diverse types of fish. The resort is framed by crystal blue waters and lovely beaches, and its rooms can provide tourists with every type of comfort. The island, with its well-known diving spots, is a popular destination for divers from all over the world, from the most experienced to those who want to dive for the first time in these enchanted depths.', '{"overview_paragraphs":["Maayafushi, located in the northern portion of the Ari Atoll, contains all of the characteristics that distinguish this little region of Maldives: from the untamed nature of the vegetation to the bottom inhabited by the most diverse types of fish. The resort is framed by crystal blue waters and lovely beaches, and its rooms can provide tourists with every type of comfort. The island, with its well-known diving spots, is a popular destination for divers from all over the world, from the most experienced to those who want to dive for the first time in these enchanted depths.","The allure of a walk in nature, the sensation of sand and wood beneath your feet before returning to your bed. Maayafushi''s 60 Beach Bungalows mesmerise with a green vista from which to scan the azure horizon of the Indian Ocean.","Maayafushi''s 8 Over Water survey the ocean''s limitless horizon, leaving them dumbfounded. The charm of water, which cradles the minutes before sleep and the seconds after rising, provides unforgettable pleasures. You will be immersed in the sounds of the sea in these rooms, and there will be a large outside deck where you may rest.","Guests may choose between three sorts of accommodation categories: Garden Rooms, Beach Bungalows, and Water Bungalows, all of which are constructed in harmony with the surrounding environment of the island while keeping comfort in mind. The rooms are large and well-equipped.","Maayafushi is located 65 kilometres from Velana International Airport and may be accessible either seaplane or a short ferry boat ride. The Ari''s atoll, well-known across the globe for its white sand and beautiful beaches, has become a scuba diver''s paradise on Earth. Sightings of whale sharks and hammerhead sharks, as well as other species dwelling in the coral reef that runs all the way around the shore, are common.","Let yourself be conquered by the tastes of the island in Maayafushi''s eateries and pubs. Our dining menu has been created to be as diverse as possible in order to fulfil the demands of all customers. In the restaurants, you may sample the delights of Italian and Maldivian cuisine, cooked and served daily by our Chefs. Our bars will be the ideal spot to unwind and have a refreshing drink while taking in the sights and sounds that only the Maldives can provide."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, null, '09xGGXQ0WA0', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'nakai-maayafushi-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'nakai-maayafushi-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'maayafushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'nakai-maayafushi-maldives-island-resort'
on conflict (id) do nothing;

-- Makunudu-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'makunudu-island-resort-maldives', 'Makunudu Island Resort Maldives', 'Makunudu Island, located in North Malé Atoll and a 50-minute speedboat trip from Male International Airport, welcomes you into the warm embrace of an authentic Maldivian getaway. Where gleaming beaches give way to the turquoise lagoon''s crystal pure waters, melting into endless ocean views. Where serenity permeates into your spirit and real hospitality greets you like a friend. A rare retreat, gloriously undisturbed, that has a particular place in the hearts of people who explore the world. Remove your shoes and immerse yourself in island time...', 'published', 'Makunudu Island Resort Maldives | Maldives Resorts | MTG', 'Makunudu Island, located in North Malé Atoll and a 50-minute speedboat trip from Male International Airport, welcomes you into the warm embrace of an authentic Maldivian getaway. Where gleaming beaches give way to the turquoise lagoon''s crystal pure waters, melting into endless ocean views. Where serenity permeates into your spirit and real hospitality greets you like a friend. A rare retreat, gloriously undisturbed, that has a particular place in the hearts of people who explore the world. Remove your shoes and immerse yourself in island time...', '{"overview_paragraphs":["Makunudu Island, located in North Malé Atoll and a 50-minute speedboat trip from Male International Airport, welcomes you into the warm embrace of an authentic Maldivian getaway. Where gleaming beaches give way to the turquoise lagoon''s crystal pure waters, melting into endless ocean views. Where serenity permeates into your spirit and real hospitality greets you like a friend. A rare retreat, gloriously undisturbed, that has a particular place in the hearts of people who explore the world. Remove your shoes and immerse yourself in island time...","These vast havens of leisure merge rustic beauty with modern conveniences, thoughtfully designed in traditional Maldivian style utilising native woods, stones, and a palette of earthy colours. Enjoy the pleasure of a garden shower that is accessible to the outdoors yet entirely concealed. Relax on your individual sun loungers in the shade of the palms or under the warm Maldivian sun. Sleep quietly to the soothing sounds of lapping waves.","The Deluxe bungalows, inspired by its Maldivian history, represent the island''s native culture and energy. One of 36 beachfront villas set among thick tropical greenery only steps from the beach is your own little getaway.","We are located in North Malé Atoll, 45 minutes via speedboat from Malé International Airport.","Indulge in spectacular buffets of meats, seafood, and tropical fruits, table-served set dinners, and once a week, a scorching barbeque and a wonderful slice of Maldivian spice in a beautiful Maldivian buffet supper. Quench your thirst at the Sand Bar, day or night, with delicious beverages and sunset cocktails, while conversing with fellow travellers and being cooled by the ocean wind. A carefully made candlelit supper beneath the stars on the beach, in your bungalow, or other secluded locales is an experience to truly savour on those special occasions.","Your rejuvenation journey begins with therapies that include the finest of Maldivian, Asian, and European wellness methods and traditions. A Maldivian massage utilising seashells and pure indigenous coconut oil is available. A customised face will restore your natural glow. Relax and restore balance from head to toe with an Ayurvedic Indian head massage or reflexology."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 300, 'm16ooP56quk', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'makunudu-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'makunudu-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'makunudu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'makunudu-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'makunudu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Malahini-Kuda-Bandos
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'malahini-kuda-bandos-maldives-island-resort', 'Malahini Kuda Bandos Maldives Island Resort', 'Malahini Kuda Bandos, Celebrate your marriage with a honeymoon on beautiful pristine beaches overlooking turquoise waters while dining on delicious cuisine. We provide customised honeymoon packages with loads of advantages!', 'published', 'Malahini Kuda Bandos Maldives Island Resort | Maldives Resorts | MTG', 'Malahini Kuda Bandos, Celebrate your marriage with a honeymoon on beautiful pristine beaches overlooking turquoise waters while dining on delicious cuisine. We provide customised honeymoon packages with loads of advantages!', '{"overview_paragraphs":["Malahini Kuda Bandos, Celebrate your marriage with a honeymoon on beautiful pristine beaches overlooking turquoise waters while dining on delicious cuisine. We provide customised honeymoon packages with loads of advantages!","Our Deluxe accommodations, which are located along the beach, have a partial view of the ocean. Each room is 27 square metres in size and has the following amenities to provide a comfortable stay:","This year, Malahini Kuda Bandos might be your pleasant spot to relax with their modern and contemporary homes. Beach Villas, Superior Rooms, Deluxe Rooms, and Classic Rooms are the five accommodation types available.","Malahini Kuda Bandos is a ten-minute boat journey from Velana International Airport and provides basic luxury without breaking the wallet.","Sit at the water''s edge and have breakfast, lunch, or dinner in our modern and stunning restaurant that overlooks our lovely lagoon. If you like to eat under the stars, please sit on our open-air deck and listen to the waves breaking around you. If you would like to have a private dinner experience on the beach, please contact our Maaga Crew and they would be pleased to arrange one for you. To gratify our broad group of travellers, the Maaga Buffet is painstakingly created to feature a range of cuisines from all around the world.","Visit Alizé to calm your senses and absorb the peacefulness of our surroundings. Our spa pavilions at Alizé are inspired by age-old Asian and Maldivian traditions and are meant to offer you with a refuge from the world while also considering your well-being. Pamper yourself with a manicure or pedicure while admiring the ocean!"]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 355, 'f_g5hU7gpHI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'malahini-kuda-bandos-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'malahini-kuda-bandos-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'kuda-bandos'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'malahini-kuda-bandos-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Room', 355, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'malahini-kuda-bandos-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Medhufushi-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'medhufushi-island-resort-maldives', 'Medhufushi Island Resort Maldives', 'Medhufushi Island Resort is a peaceful and relaxing haven. The lovely island, decorated with shaded coconut palms and tropical flowers, exudes serenity. A magnificent lagoon in turquoise and sparkling azure blue surrounds the island. Medhufushi Island Resort is the best place to get away from it all and experience inexpensive, laid-back rustic at a Maldives resort.', 'published', 'Medhufushi Island Resort Maldives | Maldives Resorts | MTG', 'Medhufushi Island Resort is a peaceful and relaxing haven. The lovely island, decorated with shaded coconut palms and tropical flowers, exudes serenity. A magnificent lagoon in turquoise and sparkling azure blue surrounds the island. Medhufushi Island Resort is the best place to get away from it all and experience inexpensive, laid-back rustic at a Maldives resort.', '{"overview_paragraphs":["Medhufushi Island Resort is a peaceful and relaxing haven. The lovely island, decorated with shaded coconut palms and tropical flowers, exudes serenity. A magnificent lagoon in turquoise and sparkling azure blue surrounds the island. Medhufushi Island Resort is the best place to get away from it all and experience inexpensive, laid-back rustic at a Maldives resort.","For further solitude, the beach villas are built on pristine white sand and surrounded by lush flora such as hibiscus and sea cabbage. The four-poster king-size bed/twin beds and outdoor rain showers are highlights. 14 of the beach homes are semi-detached and offer more room as well as a partition door connecting the villas.","The sunrise or sunset-facing Water Villas have floor-to-ceiling windows in the bedroom that fold back over the whole fourth wall, allowing you to completely appreciate the ocean views. They also provide direct access to the lagoon from your private sundeck via steps.","Medhufushi is one of only two resorts in the picturesque Meemu Atoll, distant from the bustle and congestion of modern life. It includes 112 villas spread across around 10 hectares of land. Each villa is intended to provide natural luxury as well as the joy of a perfect refuge. All of the conveniences of home are offered in these spacious and appealing villas, which include a private sundeck and a traditional Maldivian swing chair. There is no better place to observe the soothing waves than under the shade of the ''undholi.'' The unique Lagoon Suites are the best in luxury.","This five-star resort is located on Meemu Atoll, 130 kilometres from Velana International Airport, a breathtaking 40-minute seaplane flight away.","This poolside restaurant, named after the Dhivehi word for mermaid, provides breathtaking views of the ocean. The restaurant serves buffet-style breakfasts, lunches, and dinners, with chefs working live cooking stations to customise your dish to your preferences. The food of Malaafaiy Restaurant is inspired by culinary traditions from throughout the world."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 250, '5j7XZjsxiP8', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'medhufushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'medhufushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'medhufushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'medhufushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 250, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'medhufushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 430, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'medhufushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Meeru-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'meeru-island-resort-spa-maldives', 'Meeru Island Resort & Spa Maldives', 'Meeru Island Resort welcomes you to experience an unique beach filled holiday with a splash of simply Maldivian mixing into every facet of your stay, boasting one of the world''s most amazing beaches. Meeru takes pride in servicing the Maldives hotel sector for over 40 years. Explore the authentic Maldivian culture all throughout the island, including our very own state-of-the-art island museum. You will undoubtedly share Magical Moments with your loved ones when visiting here.', 'published', 'Meeru Island Resort & Spa Maldives | Maldives Resorts | MTG', 'Meeru Island Resort welcomes you to experience an unique beach filled holiday with a splash of simply Maldivian mixing into every facet of your stay, boasting one of the world''s most amazing beaches. Meeru takes pride in servicing the Maldives hotel sector for over 40 years. Explore the authentic Maldivian culture all throughout the island, including our very own state-of-the-art island museum. You will undoubtedly share Magical Moments with your loved ones when visiting here.', '{"overview_paragraphs":["Meeru Island Resort welcomes you to experience an unique beach filled holiday with a splash of simply Maldivian mixing into every facet of your stay, boasting one of the world''s most amazing beaches. Meeru takes pride in servicing the Maldives hotel sector for over 40 years. Explore the authentic Maldivian culture all throughout the island, including our very own state-of-the-art island museum. You will undoubtedly share Magical Moments with your loved ones when visiting here.","Meeru''s Beach Villas are big, well-appointed wooden bungalows on the beach with a stunning view of the lagoon. Step right onto the secluded beach, which offers breathtaking views of the island lagoon. These wooden bungalows provide a real Maldives beachfront experience. Relax on the villa terrace or on your beach sun loungers while listening to natural noises and inhaling in the ocean wind.","These classic Maldives villas are set in the lagoon, over-the-water. Only a short walk along your private jetty to this isolated refuge where you may immerse yourself in a Jacuzzi for two \"under the stars\" and simply climb the stairs into the water with the most spectacular views of all.","Meeru offers pleasant accommodation with tropical décor and modern conveniences, whether close to the beach or over-the-water, with 284 guest rooms divided into 5 room types. All Rooms have tropical décor, a king-sized bed, a private porch with furniture, air conditioning, a ceiling fan, a partially open-air bathroom (except Garden Rooms) with a rain shower, and amenities for an unforgettable Meeru stay.","Much of this lovely island remains undisturbed, with its bordering coconut palm trees, rich greenery, and brilliant coral reefs alive with marine life. It takes a 55-minute scenic motorboat trip from Velana International Airport to reach this unspoilt, natural paradise. Whether on a family holiday in the sun or an intimate beach gateway with a loved one, enjoy a relaxed, calm ambiance in a natural setting.","Meeru Island has two Buffet Restaurants, both with the same menu and a range of foreign and regional cuisines to suit everyone''s taste. Breakfast, lunch, and supper are all-you-can-eat buffet style, with vibrant Theme Nights. Friday evenings are Maldivian theme nights, complete with a themed cuisine and staff dressed in traditional clothes. Sunday brunch includes free Sparkling Wine."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 440, '7cJKIs_Ps0Q', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'meeru-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'meeru-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'meerufenfushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'meeru-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 440, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'meeru-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Jacuzzi Water Villa', 500, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'meeru-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Milaidhoo
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'milaidhoo-maldives-island-resort', 'Milaidhoo Maldives Island Resort', 'Come on in, take off your shoes, and let us tell you a story... Once upon a time, there was a little tropical island, an emerald drop of paradise surrounded by a colourful coral reef, caressed by warm turquoise waves, and nestled in the centre of a UNESCO Biosphere Reserve. That island is Milaidhoo. That time has here, and this is our tale. Milaidhoo is not just another five-star resort in the Maldives; we call it re-invented luxury. We don''t conceive of our visitors as vacationers, but rather as storytellers who are creating their ideal vacation. This is the start of your narrative about a little island.', 'published', 'Milaidhoo Maldives Island Resort | Maldives Resorts | MTG', 'Come on in, take off your shoes, and let us tell you a story... Once upon a time, there was a little tropical island, an emerald drop of paradise surrounded by a colourful coral reef, caressed by warm turquoise waves, and nestled in the centre of a UNESCO Biosphere Reserve. That island is Milaidhoo. That time has here, and this is our tale. Milaidhoo is not just another five-star resort in the Maldives; we call it re-invented luxury. We don''t conceive of our visitors as vacationers, but rather as storytellers who are creating their ideal vacation. This is the start of your narrative about a little island.', '{"overview_paragraphs":["Come on in, take off your shoes, and let us tell you a story... Once upon a time, there was a little tropical island, an emerald drop of paradise surrounded by a colourful coral reef, caressed by warm turquoise waves, and nestled in the centre of a UNESCO Biosphere Reserve. That island is Milaidhoo. That time has here, and this is our tale. Milaidhoo is not just another five-star resort in the Maldives; we call it re-invented luxury. We don''t conceive of our visitors as vacationers, but rather as storytellers who are creating their ideal vacation. This is the start of your narrative about a little island.","Milaidhoo, which opened in November 2016, is a boutique luxury resort in the Baa Atoll UNESCO Biosphere Reserve, adjacent to Hanifaru Bay, 126 kilometres north-west of Male''. We''re ideal for environment enthusiasts since our own coral reef, which encircles the island, is a protected area and a popular snorkelling and diving destination. Our magnificent island, which is densely forested, spans just 300m by 180m and is surrounded by a smooth, deep white sand beach. We welcome guests aged nine and up and have a strict no-drone policy on the island, making it ideal for couples seeking quiet and seclusion. Everything at Milaidhoo is handcrafted to order and designed with your comfort in mind. Service is excellent yet always pleasant, in keeping with","These bright and large 290sqm thatched-roof villas open up 180 degrees to a wide sundeck and amazing views, and are set on a white, powder soft, sand beach among palm trees and lush, tropical flora. Each villa has a king-size bed with stunning views of the beach and ocean. Each home has high ceilings that create a sense of spaciousness and light. The custom-made furniture are complemented by a concealed flat-screen television, a specialised wine cooler, a full-sized, quiet refrigerator and mini bar, coffee machine, ceiling fan, and air conditioning.","The Beach Pool Villas at Milaidhoo welcome guests to a private island house designed to take advantage of the natural tranquilly given by the thick greenery that surrounds the property. The contemporary interior design incorporates numerous local details, creating a sense of belonging.","These enormous 245sqm thatched-roof houses on stilts above the ocean are tranquil and full of light, leading out to a massive sundeck surrounded by the clean air of a fresh sea wind. The sun deck is built around a 42sqm private freshwater infinity pool and has a Maldivian-style swing sofa, sun loungers, a huge umbrella, a dining table with seats, and a wide, covered daybed. Steps descend into the lagoon, providing easy access to the neighbouring coral reef.","The interior design of the Water Pool Villa is inspired by Maldivian tradition and culture, with furniture custom-made for Milaidhoo and room colours that mirror the vibrant hues of the natural surroundings. The spacious bathroom in the Villa has a large bathtub with an ocean view. The bathroom has a tropical rain shower."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1900, 'fQsrXcjbvqE', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'milaidhoo-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'milaidhoo-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'milaidhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'milaidhoo-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 2200, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'milaidhoo-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Pool Villa', 1900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'milaidhoo-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Mirihi-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'mirihi-island-resort-maldives', 'Mirihi Island Resort Maldives', 'Mirihi Island Resort is a modest and precious jewel with white sands and swaying palms in the soft air. Surrounded by the infinite azure of the Indian Ocean, eco-friendly Mirihi is one of the Maldives'' tiniest resorts, giving our guests the unique impression of being on their own little island.', 'published', 'Mirihi Island Resort Maldives | Maldives Resorts | MTG', 'Mirihi Island Resort is a modest and precious jewel with white sands and swaying palms in the soft air. Surrounded by the infinite azure of the Indian Ocean, eco-friendly Mirihi is one of the Maldives'' tiniest resorts, giving our guests the unique impression of being on their own little island.', '{"overview_paragraphs":["Mirihi Island Resort is a modest and precious jewel with white sands and swaying palms in the soft air. Surrounded by the infinite azure of the Indian Ocean, eco-friendly Mirihi is one of the Maldives'' tiniest resorts, giving our guests the unique impression of being on their own little island.","We are a world apart, a heaven of calm and tranquillity, with no television in the villas, no motorised water sports, no discos or nightlife to bother you with loud music and noise, and nothing else to come between you and the genuine definition of relaxation and joy. Our customised service and committed team of well-trained professionals ensure that your experience is as unspoiled and soothing as if you were the first to come in a location designed just for you, and as unique as you are.","Six elegantly constructed Beach Villas (53 m2) are ideally placed on the island''s sunset side, with direct access to our talcum powdery beach. These cosy homes, surrounded by thick tropical flora and swaying palms, provide full solitude and unrivalled ocean views. Designer furnishings, polished wooden flooring, king or twin beds, semi-open air baths, Bose audio system with Bluetooth connectivity, free high speed WI-FI, Nespresso machine, personal safe, and fully stocked Villa Bar are all included.","Our 30 Water Villas (53 m2) are built on stilts over the blue lagoon and provide direct access to our lively house reef. These nicely constructed cosy villas are endowed with an unbroken view of the blue ocean from the entire seclusion of the sun deck, with a view of the dawn or sunset. All Villas feature the same high-quality designer furnishings, polished wooden floors, king-size or twin beds, en suite bathrooms with glass doors overlooking the Indian Ocean, Bose music system with Bluetooth connectivity, free high-speed Wi-Fi, Nespresso machine, personal safe, and fully stocked Villa Bar. The Water Villa requires children to be 8 years old for safety reasons.","The 37 attractively constructed Villas have recently been refurbished, delivering luxury and comfort while also providing space and natural light. They are conveniently positioned all across the island and provide perfect seclusion. Each luxurious mansion is given a distinct Dhivehi (Maldivian) name drawn from the land or sea. The villas, which include 6 Beach Villas, 30 Water Villas, 1 Two-Bedroom Water Suite, and 1 Two-Bedroom Beach Suite, are exquisitely positioned around the island and above the active house reef, providing unending views of the vast horizon. Each villa is the ideal hideaway from the rest of the world, whether from your private deck or private beach.","The island is only 350 metres long and 50 metres broad, with palm-fringed beaches and powder soft, sun-kissed sand. This beautiful, private island is reached through a 30-minute seaplane flight and is encircled by 6 kilometres of one of the Maldives'' greatest house reefs. It''s also a great place to watch whale sharks."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 550, '22tRj_0CFDQ', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'mirihi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'mirihi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'mirihi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'mirihi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'mirihi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 550, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'mirihi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Movenpick
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'movenpick-resort-kuredhivaru-maldives-resort', 'Movenpick Resort Kuredhivaru Maldives Resort', 'The Mövenpick Resort Kuredhivaru Maldives is a beautiful refuge and tropical paradise located in the unspoiled Noonu Atoll. Our 5 star luxury beach resort is located 45 minutes north of Male International Airport. In each of the 72 overwater pool villas, 30 beach pool suites, and three beach spa pool homes, you may relax in your own private plunge pool.', 'published', 'Movenpick Resort Kuredhivaru Maldives Resort | Maldives Resorts | MTG', 'The Mövenpick Resort Kuredhivaru Maldives is a beautiful refuge and tropical paradise located in the unspoiled Noonu Atoll. Our 5 star luxury beach resort is located 45 minutes north of Male International Airport. In each of the 72 overwater pool villas, 30 beach pool suites, and three beach spa pool homes, you may relax in your own private plunge pool.', '{"overview_paragraphs":["The Mövenpick Resort Kuredhivaru Maldives is a beautiful refuge and tropical paradise located in the unspoiled Noonu Atoll. Our 5 star luxury beach resort is located 45 minutes north of Male International Airport. In each of the 72 overwater pool villas, 30 beach pool suites, and three beach spa pool homes, you may relax in your own private plunge pool.","Mövenpick Resort Kuredhivaru Maldives'' restaurants brilliantly mix gourmet delights with breathtaking views of the Maldives. You may treat yourself and your loved one endlessly throughout your relaxed vacation with us in the Maldives, from a seafood fine dining experience to a private romantic candlelit meal on the beach.","Feel the sand between your toes as you walk along the powder-white beaches and explore the plethora of colourful marine life that the Indian Ocean has to offer. Enjoy delicious food at three restaurants and a refreshing drink at our bar while admiring the breathtaking views of the Indian Ocean. Relax at the Healing Earth Sun Spa, redirect your energy with yoga, and let your kids play at the Little Birds Club. Allow us to tailor-make a very distinctive Maldives experience for you during your stay at Mövenpick Resort Kuredhivaru Maldives.","This home is surrounded by beautiful nature and is located right close to a white-sand beach. Relax by your own infinity pool or relax in a swinging chair outdoors. Enjoy the stunning Maldivian reef, as well as free Chocolate Hours, snorkelling equipment, and non-motorized watersports.","Our over water villas with see-through floors provide lagoon views and are located over the turquoise lagoon. Open the glass doors and dive into your infinity-edge pool. Daily Chocolate Hours, unlimited water, snorkelling equipment, and non-motorized water activities are all available.","Mövenpick Resort boasts a modern design with an emphasis on comfortable accommodations and a secluded, yet dynamic resort experience. Every modern convenience is integrated with the desert-island luxury, reflecting Mövenpick''s famous devotion to authentic comforts provided extremely well."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 800, 'hEpEZxGW_Js', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'movenpick-resort-kuredhivaru-maldives-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'movenpick-resort-kuredhivaru-maldives-resort'
  and l.node_type = 'location' and l.slug = 'kuredhivaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'movenpick-resort-kuredhivaru-maldives-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Suite', 1000, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'movenpick-resort-kuredhivaru-maldives-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Pool Lagoon', 800, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'movenpick-resort-kuredhivaru-maldives-resort'
on conflict (accommodation_id, name) do nothing;

-- Nika-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'nika-island-resort-spa-maldives', 'Nika Island Resort & Spa Maldives', 'Nika Island is a piece of Maldivian history, since it was one of the first islands in Ari Atoll to become a world-renowned tourist attraction. Nika Island is our collective imagination''s paradise island. A forum where traditional Maldivian beauty and custom meet Italian culture. Nothing has changed on the island of Nika. A destination where you may relive the Maldives of yesteryear. "A item of beauty is a delight forever," said the English poet Keats, and Nika''s beauty beyond words. This island is frozen in time, impervious to the tremendous tourism forces that are altering the Maldives today. An unrepeatable and completely successful alchemical experiment that has written a significant chapter in history.', 'published', 'Nika Island Resort & Spa Maldives | Maldives Resorts | MTG', 'Nika Island is a piece of Maldivian history, since it was one of the first islands in Ari Atoll to become a world-renowned tourist attraction. Nika Island is our collective imagination''s paradise island. A forum where traditional Maldivian beauty and custom meet Italian culture. Nothing has changed on the island of Nika. A destination where you may relive the Maldives of yesteryear. "A item of beauty is a delight forever," said the English poet Keats, and Nika''s beauty beyond words. This island is frozen in time, impervious to the tremendous tourism forces that are altering the Maldives today. An unrepeatable and completely successful alchemical experiment that has written a significant chapter in history.', '{"overview_paragraphs":["Nika Island is a piece of Maldivian history, since it was one of the first islands in Ari Atoll to become a world-renowned tourist attraction. Nika Island is our collective imagination''s paradise island. A forum where traditional Maldivian beauty and custom meet Italian culture. Nothing has changed on the island of Nika. A destination where you may relive the Maldives of yesteryear. \"A item of beauty is a delight forever,\" said the English poet Keats, and Nika''s beauty beyond words. This island is frozen in time, impervious to the tremendous tourism forces that are altering the Maldives today. An unrepeatable and completely successful alchemical experiment that has written a significant chapter in history.","10 Beach Villas (about 80 square feet) with a double room, living area, and bathroom. They are on the north side of the island, facing a big lagoon, with swimming access to the barrier reef from your own private beach. All Beach Villas face the ocean and are constructed with natural materials in accordance with Maldives architectural heritage norms. They are separated from one another by thick greenery and are encircled by a garden with gazebo and hot tub. One Beach Villa has been modified to accommodate people with disabilities.","8 Water Villas (about 1200sqft) with double room, living room, bathroom, terrace with direct beach access, and solarium. Water Villas are located on the north side of the island in the lagoon, facing one of the best maintained barrier reefs in the Indian Ocean. Water Villas are divided into three levels: the first is on the water, where you can dive right in; the second is a wooden terrace where you can rest on comfy deck chairs; and the third is on the roof, where you can watch the ocean and enjoy the wonderful sea wind. Guests have access to two public beaches with sun loungers, bathrooms, and beach umbrellas, one near the Water Villas boardwalk and one in front of the hotel.","Only 43 villas on an island surrounded by a gorgeous house reef, rich greenery, and helpful personnel will make you feel perfectly at home: 6 Garden rooms, 10 Beach Villas, 10 Deluxe Beach Villas, 3 Family Beach Villas, 3 Family Deluxe Beach Villas, 1 Sultan Suite, and 10 Water Villas.","Nika Island Resort & Spa is situated on its own own island on the western fringe of North Ari Atoll. Male International Airport is 75 kilometres away and may be reached in 25/30 minutes by seaplane. The Nika Maldives experience begins with a warm greeting from the resort host at the arrival port, who will accompany visitors to the Nika lounge till the departure by sea plane for the breathtaking ride to the resort.","Nika Restaurant provides full-board, half-board, and all-inclusive packages, with a buffet meal rotating alongside an à la carte menu. A Maldivian feast and BBQ is offered once a week. The restaurant is a big open-air building that is appealing. The food is mostly Italian and Mediterranean. Our chefs are available to accommodate any requirement, even customers with dietary sensitivities. The wine cellar on the island has approximately 100 different varieties of wine. A unique candlelit meal with a fish-and-shellfish-based cuisine may be organised upon request, either on your villa''s private beach or on the desert island within a few minutes boat ride from Nika."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 400, '7WBGJrqLLz4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'nika-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'nika-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'kudafolhudhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'nika-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 400, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'nika-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 450, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'nika-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Noku
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'noku-maldives-island-resort', 'Noku Maldives Island Resort', 'Twenty beach villas and 30 over-water villas are nestled among lush tropical flora and surrounded by a tranquil blue lagoon. Each spacious unit is intended to give maximum seclusion and is outfitted with modern conveniences to ensure comfort. Each villa''s subtle elegance, with gentle white colours and dark wood accents, complements the splendour of nature as viewed via huge bay windows and french doors.', 'published', 'Noku Maldives Island Resort | Maldives Resorts | MTG', 'Twenty beach villas and 30 over-water villas are nestled among lush tropical flora and surrounded by a tranquil blue lagoon. Each spacious unit is intended to give maximum seclusion and is outfitted with modern conveniences to ensure comfort. Each villa''s subtle elegance, with gentle white colours and dark wood accents, complements the splendour of nature as viewed via huge bay windows and french doors.', '{"overview_paragraphs":["Twenty beach villas and 30 over-water villas are nestled among lush tropical flora and surrounded by a tranquil blue lagoon. Each spacious unit is intended to give maximum seclusion and is outfitted with modern conveniences to ensure comfort. Each villa''s subtle elegance, with gentle white colours and dark wood accents, complements the splendour of nature as viewed via huge bay windows and french doors.","Each of the contemporary Beach Villas is large and stylishly constructed to capture natural light and amazing views of the Indian Ocean, and is surrounded by lush tropical foliage. Enjoy a visual delight of a Maldivian sunrise or sunset from the direct beach access and spacious sundeck.","Wake up to a stunning dawn through the gentle white tones of this one-bedroom villa, or from the expansive sundeck with a private plunge pool. Enjoy cleaning routines in the outdoor rain shower, indoor shower, or standalone bathtub.","This magnificent one-bedroom house positioned immediately above the turquoise lagoon, facing South East, offers unrivalled views of the Indian Ocean. A spacious sundeck captures the spectacular dawn and gives direct access to the water below. There are indoor and outdoor showers as well as a standalone bathtub for further relaxation.","The resort has been elegantly renovated using sustainable materials, selected hand-made design items, and attention to detail on the island of Kuda-Funafaru in Noonu Atoll, 189 kilometres from Velana International Airport. The island is 750 metres long and 250 metres wide, making it the ideal size for relaxing in tropical tranquillity.","From locally grown vegetables with a Maldivian twist to international cuisine such as Japanese, Singaporean, and Thai, there is something for everyone. Our menu selection at Thari Restaurant, which includes components of Maldivian, Thai, Japanese, and Singaporean cuisines, will give you a flavorful sense of the nations where our Noku hotels are located."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 800, 'LRyhlGZy_q0', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'noku-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'noku-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'kudafunafaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'noku-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 800, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'noku-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'noku-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 850, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'noku-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Nova
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'nova-maldives-island-resort', 'NOVA Maldives Island Resort', 'Everyone is welcome to our home-away-from-home, whether they are travelling alone, with loved ones, friends, or family. You may do whatever you want here, as much or as little as your spirit wishes. Dive, go to the gym, or relax beneath the palm trees and enjoy something simple and genuine. I''m glad to be here. Happy in the moment- at Nova, one of the top all-inclusive resorts in the Maldives.', 'published', 'NOVA Maldives Island Resort | Maldives Resorts | MTG', 'Everyone is welcome to our home-away-from-home, whether they are travelling alone, with loved ones, friends, or family. You may do whatever you want here, as much or as little as your spirit wishes. Dive, go to the gym, or relax beneath the palm trees and enjoy something simple and genuine. I''m glad to be here. Happy in the moment- at Nova, one of the top all-inclusive resorts in the Maldives.', '{"overview_paragraphs":["Everyone is welcome to our home-away-from-home, whether they are travelling alone, with loved ones, friends, or family. You may do whatever you want here, as much or as little as your spirit wishes. Dive, go to the gym, or relax beneath the palm trees and enjoy something simple and genuine. I''m glad to be here. Happy in the moment- at Nova, one of the top all-inclusive resorts in the Maldives.","These accommodations are just a few feet from the beach and provide direct access to the endless blue lagoons. The 80-square-meter rooms have bespoke furnishings, natural light, and warmth, as well as a king-size bed with soft linen and cushions.","Beach Villa with Private Pool is a sanctuary of comfort overlooking the turquoise waves, with direct access to the coastline. It is set in an immensely soothing environment. Each room has 160 square metres of space and a king-size bed with luxury linen and cushions.","These suites provide an unrivalled view of the Indian Ocean and direct access to the lagoon below. Spend the day relaxing on the sun loungers on the expansive sun terrace, or down the private stairway and swim laps in the lagoon.","It''s a novel spin on the all-inclusive concept, going beyond meals and services and inviting everyone to take use of everything Nova has to offer. There are 76 lovely beach and over-water villas, beach volleyball, diving, local art and culture, and delightfully fresh dining at its three restaurants and two bars. People in Nova make time for the things that make them happy.","Nova is located in South Ari Atoll and may be accessed by a picturesque 25-minute seaplane flight."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 600, 'pNaa-necLJQ', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'nova-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'nova-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'vakarufalhi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'nova-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'nova-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1100, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'nova-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 900, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'nova-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- OBLU-NATURE-Helengeli
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'oblu-nature-helengeli-maldives-island-resort', 'OBLU NATURE Helengeli Maldives Island Resort', 'OBLU NATURE Helengeli is a thrilling 50-minute speedboat journey from Malé International Airport and provides all the enchantment of flora and animals. Helengeli is a favourite among Maldives all-inclusive resorts for ardent explorers, snorkelers, and channel divers due to its island-inspired, bohemia ambiance. The resort has its own house-reef only steps from the coast and is home to a breathtaking display of marine dwellers all year round, with 116 villas with vivid, tropical interiors amidst lush flora.', 'published', 'OBLU NATURE Helengeli Maldives Island Resort | Maldives Resorts | MTG', 'OBLU NATURE Helengeli is a thrilling 50-minute speedboat journey from Malé International Airport and provides all the enchantment of flora and animals. Helengeli is a favourite among Maldives all-inclusive resorts for ardent explorers, snorkelers, and channel divers due to its island-inspired, bohemia ambiance. The resort has its own house-reef only steps from the coast and is home to a breathtaking display of marine dwellers all year round, with 116 villas with vivid, tropical interiors amidst lush flora.', '{"overview_paragraphs":["OBLU NATURE Helengeli is a thrilling 50-minute speedboat journey from Malé International Airport and provides all the enchantment of flora and animals. Helengeli is a favourite among Maldives all-inclusive resorts for ardent explorers, snorkelers, and channel divers due to its island-inspired, bohemia ambiance. The resort has its own house-reef only steps from the coast and is home to a breathtaking display of marine dwellers all year round, with 116 villas with vivid, tropical interiors amidst lush flora.","These semi-detached beach homes are a few steps from Helengeli island''s coastlines and are ideal for fun and relaxation.","These exquisite homes are constructed partially on land and provide excellent sunset views. The terrace leads into the tranquil turquoise lagoon.","The resort has 116 villas in four categories that are all-inclusive with high-quality international cuisine and a variety of activities such as spectacular Channel Diving and a tranquil Garden Spa! OBLU by Atmosphere in Helengeli, a Four-Star Superior resort, strives to offer a ''Best in Class'' Maldivian Beach holiday experience!","OBLU by Atmosphere at Helengeli is located in North Male'' Atoll and is a 50-minute speedboat ride from Velana International Airport.","The Spice offers a stunning Maldives resort dining experience with a lagoon-facing wooden terrace and inside seats on a natural sandy floor. Relax by the pool with a beverage and some bar snacks at Helen''s Bar. Just Grill offers a wonderful dining experience with scrumptious grilled meats and fresh seafood."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 600, 'f9bdiPl0bWY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'oblu-nature-helengeli-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'oblu-nature-helengeli-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'helengeli'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'oblu-nature-helengeli-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'oblu-nature-helengeli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa Pool', 700, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'oblu-nature-helengeli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- OBLU-SELECT-Lobigili
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'oblu-select-lobigili-maldives-island-resort', 'OBLU SELECT Lobigili Maldives Island Resort', 'Helengeli Island, North Male'' Atoll, is known for its Exotic House Reef, which is home to Silver-tipped Sharks, Lobsters, and Giant Sea Turtles. Embracing the lush environment on Helengeli Island and guaranteeing that the amazing house reef, only metres away from the island, is totally conserved in its original condition - the colourful, stylish, and hip resort, OBLU by Atmosphere at Helengeli, opened its doors on November 1, 2015!', 'published', 'OBLU SELECT Lobigili Maldives Island Resort | Maldives Resorts | MTG', 'Helengeli Island, North Male'' Atoll, is known for its Exotic House Reef, which is home to Silver-tipped Sharks, Lobsters, and Giant Sea Turtles. Embracing the lush environment on Helengeli Island and guaranteeing that the amazing house reef, only metres away from the island, is totally conserved in its original condition - the colourful, stylish, and hip resort, OBLU by Atmosphere at Helengeli, opened its doors on November 1, 2015!', '{"overview_paragraphs":["Helengeli Island, North Male'' Atoll, is known for its Exotic House Reef, which is home to Silver-tipped Sharks, Lobsters, and Giant Sea Turtles. Embracing the lush environment on Helengeli Island and guaranteeing that the amazing house reef, only metres away from the island, is totally conserved in its original condition - the colourful, stylish, and hip resort, OBLU by Atmosphere at Helengeli, opened its doors on November 1, 2015!","This airy, sun-lit one-bedroom beach cottage is the ultimate in relaxation. Lush tropical gardens and palm palms provide complete solitude. Carefree days begin with a pleasant swim in the pool or the sea. Inside, vibrant tropical sensations follow you, with hardwood textures, intriguing modern décor, and earthy red tones adding a sensuous touch. After a day in paradise, the sumptuous outdoor-indoor Maldivian bathroom with an open-air freestanding bathtub is ideal for a leisurely start-lit soak.","Immerse yourself in crystal-clear lagoon views and elegantly furnished areas. This one-bedroom overwater home exudes tropical serenity. The interiors are modern and lively, with relaxing white walls, warm hardwood flooring, gorgeous ocean-framing windows, and a luxurious bathroom with a tempting, deep-soaking bathtub and private overwater hammock.","OBLU CHOICE Lobigili is exclusively for adults, featuring postcard-perfect coastal and overwater homes. These remote vacation houses merge tropical panoramas and nature-inspired architecture for a romantic, castaway vibe, making them ideal for romantic getaways. While Loabigili Island is great for a romantic interlude for two, it is also suitable for adults-only trips such as a bachelorette party, carousing with friends, or a romantic couples stay in the Indian Ocean.","Ylang-Ylang (All-Day Dining) - Global flavours with an Italian twist are sure to satisfy your taste buds. Choose from a variety of live culinary stations, tandoors, and desserts ranging from the Italian specialty tiramisu to Thai Loy Coconut Milk.","Only Blu Specialty Underwater Restaurant - Culinary feast in a mystical underwater atmosphere. Our continually changing menu highlights fresh ingredients and current culinary methods to produce a one-of-a-kind dining experience that will live on forever, paired with the appropriate wine."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 800, 'RwiYnEODZuk', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'oblu-select-lobigili-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'oblu-select-lobigili-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'lobigili'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'oblu-select-lobigili-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'SunNest Beach Pool Villa', 900, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'oblu-select-lobigili-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Nest Water Villa', 800, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'oblu-select-lobigili-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- OBLU-SELECT-Sangeli
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'oblu-select-sangeli-maldives-island-resort', 'OBLU SELECT Sangeli Maldives Island Resort', 'The gloriously lovely OBLU SELECT Sangeli is located on the northwestern point of Malé Atoll, Maldives. Stay in elegant, tropical villas and suites and sample exotic cuisine at exotic restaurants and bars. Enjoy a scenic environment with swaying palm trees, pure white beaches, and a blue lagoon brimming with colourful coral life. Every aspect of a deluxe holiday is included into your stay for a really carefree and unforgettable trip at the Maldives'' greatest beach resort!', 'published', 'OBLU SELECT Sangeli Maldives Island Resort | Maldives Resorts | MTG', 'The gloriously lovely OBLU SELECT Sangeli is located on the northwestern point of Malé Atoll, Maldives. Stay in elegant, tropical villas and suites and sample exotic cuisine at exotic restaurants and bars. Enjoy a scenic environment with swaying palm trees, pure white beaches, and a blue lagoon brimming with colourful coral life. Every aspect of a deluxe holiday is included into your stay for a really carefree and unforgettable trip at the Maldives'' greatest beach resort!', '{"overview_paragraphs":["The gloriously lovely OBLU SELECT Sangeli is located on the northwestern point of Malé Atoll, Maldives. Stay in elegant, tropical villas and suites and sample exotic cuisine at exotic restaurants and bars. Enjoy a scenic environment with swaying palm trees, pure white beaches, and a blue lagoon brimming with colourful coral life. Every aspect of a deluxe holiday is included into your stay for a really carefree and unforgettable trip at the Maldives'' greatest beach resort!","These stand-alone Maldives beach bungalows are vibrant and tropical, overlooking Sangeli island''s gorgeous blue lagoons. Each has a bedroom with high ceilings, a walk-in closet, and a partially open-air Maldivian bathroom. A warm, inviting room is created by combining current design concepts with traditional Maldivian architecture. Step out onto the spacious terrace, which leads to a private garden and beach.","The stand-alone beach villas with pool on Sangeli Island''s lush green northern side are the best among Maldives hotels. Some of the attractions of this property include 5 star in-villa facilities, an open-air porch, a luxury 13m2 plunge pool, and a tropical garden going directly out to the stunning white beach and a brilliantly blue lagoon!","A stretch of ocean-facing water villas curves around the turquoise waters of the enormous Sangeli lagoon. These Maldives overwater villas are light and airy, with separate sundecks and steps going directly into the lagoon. Indulgent facilities, stunning views, and sophisticated design combine to create a deliciously intimate atmosphere, ideal for a romantic holiday!","The villas are the genuine stars of OBLU SELECT at Sangeli. On their Maldives vacation, these havens provide postcard-perfect luxury, with stand-alone villas offering private pools, lagoon-facing beach villas with direct beach access, and open-air baths. Of course, there are the Maldives'' iconic 42 over-water villas with direct lagoon access, 26 of which have a private 8 square metre plunge pool. In-villa minibars are equipped with beer, wine, soft drinks, and a variety of food and are restocked once daily. Whatever sort of accommodation you seek on your next Maldives vacation, OBLU SELECT at Sangeli has the ideal villa for you.","OBLU SELECT at Sangeli is ideally located at the northwestern tip of Male'' Atoll and is only 50 minutes by speed boat from Velana International Airport. The spacious Stand-Alone Beach & Water Villas - with & without Private Pools, an upgraded All-Inclusive plan - THE SERENITY PlanTM, with inclusions of Fine Dining experiences at two specialty restaurants - JUST GRILL & SIMPLY VEG, as well as In-Villa Mini Bar replenishment at no extra charge, set this resort apart from the rest!"]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 700, 'B_VEo7K5gCI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'oblu-select-sangeli-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'oblu-select-sangeli-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'sangeli'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'oblu-select-sangeli-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 700, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'oblu-select-sangeli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'oblu-select-sangeli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 780, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'oblu-select-sangeli-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- OBLU-XPERIENCE-Ailafushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'oblu-xperience-ailafushi-maldives-island-resort', 'OBLU XPErience Ailafushi Maldives Island Resort', 'Immerse yourself in carefree tropical island living at OBLU Xperience Ailafushi, with exhilarating activities, whimsical decor, and a vibrant party environment. Ailafushi island, which means "family island" in Dhivehi, is a 15-minute speedboat journey from Malé International Airport. This limited-service 4-Star Island Resort has 268 rooms divided into four categories. With its busy retail and café environment, La Promenade offers a touch of sophistication where you can socialise with like-minded folks. Simply unbeatable!', 'published', 'OBLU XPErience Ailafushi Maldives Island Resort | Maldives Resorts | MTG', 'Immerse yourself in carefree tropical island living at OBLU Xperience Ailafushi, with exhilarating activities, whimsical decor, and a vibrant party environment. Ailafushi island, which means "family island" in Dhivehi, is a 15-minute speedboat journey from Malé International Airport. This limited-service 4-Star Island Resort has 268 rooms divided into four categories. With its busy retail and café environment, La Promenade offers a touch of sophistication where you can socialise with like-minded folks. Simply unbeatable!', '{"overview_paragraphs":["Immerse yourself in carefree tropical island living at OBLU Xperience Ailafushi, with exhilarating activities, whimsical decor, and a vibrant party environment. Ailafushi island, which means \"family island\" in Dhivehi, is a 15-minute speedboat journey from Malé International Airport. This limited-service 4-Star Island Resort has 268 rooms divided into four categories. With its busy retail and café environment, La Promenade offers a touch of sophistication where you can socialise with like-minded folks. Simply unbeatable!","The beautiful Beach Villas are only a few steps away from the white, sandy beach. Dip into the lagoon whenever you like. Alternatively, relax on your private outside veranda and garden. Warm, oak floors, a soft bed, a large sofa, beautiful themes, and vivid fabrics make the interiors just as appealing. A walk-in closet connects to a spa-like bathroom with marble vanity and an outdoor shower overlooking a garden. Everything you need to unwind in luxury is available! Enjoy your favourite beverages in your villa, with a selection of wines and spirits available for buy separately at the Wine Boutique at La Promenade and other resort locations.","The water homes are accessible through a wooden pier that stretches into the beautiful lagoon. Each overwater refuge is designed in the style of a traditional Maldivian boat - a ''dhoni'' - giving the impression of an intimate, romantic getaway. Relax on your private terrace or descend the staircase for a relaxing dip in the warm sea lapped softly against your villa. Enjoy your favourite beverages in your villa, with a selection of wines and spirits available for buy separately at the Wine Boutique at La Promenade and other resort locations.","Experience the magnificent Indian Ocean from a bright beach or overwater villa with spectacular ocean views. A joyful, free-spirited stay is created by refreshingly warm, compassionate service and delightfully furnished spaces.","The OBLU XPErience Ailafushi is conveniently positioned on the northwestern tip of Male'' Atoll, about 20 minutes via speed boat from Velana International Airport. The magnificent Beach & Water Villas on their own.","At Element X, a limited-service all-day eating restaurant, a joyful, chilled-out balance is at the centre of the dining experience. Share wonderful family memories over delectable feasts and self-service beverage kiosks. Immerse in a multi-layered experience at the vibrant X360 bar - with a distinctively engaging, joyful, and exuberant ambiance. Try the Copper Pot Food Truck''s refreshing ''Surf & Turf'' grills beneath a starlit sky, or book a reservation for a refined Modern Gastronomic experience at the iconic under ocean restaurant, Only BLU. The Fushi PlanTM includes the Element X and X360 bar. Dining at Copper Pot Food Truck and Only BLU is fee-based."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 500, '2KS4bmFNL7Y', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'oblu-xperience-ailafushi-maldives-island-resort'
on conflict (id) do nothing;
