-- Part 2 of 6 - run this in the Supabase SQL Editor AFTER the previous parts.
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

-- COMO-Maalifushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'como-maalifushi-island-resort-maldives', 'COMO Maalifushi Island Resort Maldives', 'The Maldives'' largest private island resort, COMO, includes multi-room villas both above water and in tropical gardens. In the Indian Ocean, we''re surrounded by uninhabited islands, world-class surf breaks, and teeming marine life – a world away.', 'published', 'COMO Maalifushi Island Resort Maldives | Maldives Resorts | MTG', 'The Maldives'' largest private island resort, COMO, includes multi-room villas both above water and in tropical gardens. In the Indian Ocean, we''re surrounded by uninhabited islands, world-class surf breaks, and teeming marine life – a world away.', '{"overview_paragraphs":["The Maldives'' largest private island resort, COMO, includes multi-room villas both above water and in tropical gardens. In the Indian Ocean, we''re surrounded by uninhabited islands, world-class surf breaks, and teeming marine life – a world away.","COMO Maalifushi offers a variety of elegantly furnished hotel rooms with indigenous style and decor. Guests can pick from seven distinct accommodation categories. Each room provides complete solitude and is well equipped with the newest equipment and amenities, allowing you to relax and enjoy the natural tropical surroundings.","COMO Maalifushi is located in Thaa Atoll, in the southern Maldives, and may be reached by a 50-minute sea plane flight from Velana International Airport.","Our Japanese restaurant, Tai, serves local seafood as sushi and sashimi in the evenings. With beach barbecues, nutritious salads, and COMO Cuisine classics, Madi''s all-day eating emphasises flavour and freshness. In-room access to our healthy COMO Shambhala meals is also available.","COMO Shambhala Retreat offers wellbeing in the Maldives, where the sea breeze sweeps through our open-air yoga pavilion and our overwater treatment rooms overlook blue horizons. This is the island where our award-winning holistic health method is based.","Exploring excellent surf breaks and uninhabited private islands under the Maldives'' endless sunshine is one of the experiences available at COMO Maalifushi. Play by COMO''s carefully curated programmes benefit younger guests."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 1260, 'JXF1GshPotc', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'como-maalifushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'como-maalifushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'maalifushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'como-maalifushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Suite', 1260, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'como-maalifushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Suite', 1560, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'como-maalifushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Cinnamon-Dhonveli
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'cinnamon-dhonveli-island-resort-maldives', 'Cinnamon Dhonveli Island Resort Maldives', 'Cinnamon Dhonveli Maldives, a stunning tropical island resort with exclusive access to the legendary Pasta Point surf break, is an island of both action and sumptuous rest. There is something for everyone in this exotic paradise, whether you bring the family, a group of friends, or even your significant other. When you stay with us, you may enjoy stunning over-water suites, couples'' spa treatments, sunset cruises, and intimate, beautiful dinners on the white sand beach.', 'published', 'Cinnamon Dhonveli Island Resort Maldives | Maldives Resorts | MTG', 'Cinnamon Dhonveli Maldives, a stunning tropical island resort with exclusive access to the legendary Pasta Point surf break, is an island of both action and sumptuous rest. There is something for everyone in this exotic paradise, whether you bring the family, a group of friends, or even your significant other. When you stay with us, you may enjoy stunning over-water suites, couples'' spa treatments, sunset cruises, and intimate, beautiful dinners on the white sand beach.', '{"overview_paragraphs":["Cinnamon Dhonveli Maldives, a stunning tropical island resort with exclusive access to the legendary Pasta Point surf break, is an island of both action and sumptuous rest. There is something for everyone in this exotic paradise, whether you bring the family, a group of friends, or even your significant other. When you stay with us, you may enjoy stunning over-water suites, couples'' spa treatments, sunset cruises, and intimate, beautiful dinners on the white sand beach.","Release your inner adrenaline junkie by riding a jet ski across the ocean, water skiing or windsurfing over the waves, or taking a catamaran ride. Sign up for a diving lesson at our dive centre or simply drop in for some leisurely snorkelling if you''d rather go beneath the surface than above it.","Of course, they have a beautiful view from every part of the island! This means that beautiful sunrises, sunsets, and the deep blue Indian Ocean are just outside your window no matter where you stay. Each accommodation at Cinnamon Dhonveli is meant to transport you to heaven while also making you feel completely at home.","The excitement of your exciting destination begins with an amazing 25-minute speedboat voyage to an island 13 kilometres from Malé. Cinnamon Dhonveli Maldives promises a lovely tropical trip packed with cultural excursions and marine life in the heart of the North Malé Atoll!","Pasta Point, a world-famous surf break in the Maldives, is a dream location for surfers from all over the world. This surf location, named after an Italian cafe that used to be in the same area, is known as the \"wave-machine\" of the North Malé Atoll because to its regular wave output, which averages 4-6 feet in height."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 280, '9Cblu6zFvVA', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'cinnamon-dhonveli-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'cinnamon-dhonveli-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'kanuhuraa'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'cinnamon-dhonveli-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 280, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'cinnamon-dhonveli-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow', 360, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'cinnamon-dhonveli-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Cinnamon-Hakuraa
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'cinnamon-hakuraa-huraa-island-resort-maldives', 'Cinnamon Hakuraa Huraa Island Resort Maldives', 'The Maldives are a haven for couples in love, and the beauty of Cinnamon Hakuraa Huraa Maldives takes romance to a whole new level. You''re staring at one of the Maldives'' largest shallow lagoons - and a great location for a photo shoot! Following a warm welcome at the welcome pavilion, you will be brought to your luxurious room near the sandy beach or an overwater cottage. If you are on your honeymoon, a fruit basket and a bottle of wine will be waiting for you.', 'published', 'Cinnamon Hakuraa Huraa Island Resort Maldives | Maldives Resorts | MTG', 'The Maldives are a haven for couples in love, and the beauty of Cinnamon Hakuraa Huraa Maldives takes romance to a whole new level. You''re staring at one of the Maldives'' largest shallow lagoons - and a great location for a photo shoot! Following a warm welcome at the welcome pavilion, you will be brought to your luxurious room near the sandy beach or an overwater cottage. If you are on your honeymoon, a fruit basket and a bottle of wine will be waiting for you.', '{"overview_paragraphs":["The Maldives are a haven for couples in love, and the beauty of Cinnamon Hakuraa Huraa Maldives takes romance to a whole new level. You''re staring at one of the Maldives'' largest shallow lagoons - and a great location for a photo shoot! Following a warm welcome at the welcome pavilion, you will be brought to your luxurious room near the sandy beach or an overwater cottage. If you are on your honeymoon, a fruit basket and a bottle of wine will be waiting for you.","You''ll be walking on water at this resort. Allow us to indulge you and your significant other with a delectable supper away from the hustle and bustle, on a romantic beach in barefoot luxury. Despite our numerous activities and excursions, we recognise that when you''re in love, sometimes it''s simply enough to be. Relax on a white sandy beach alongside a crystal blue lagoon in complete peace. Honeymooners are invited to the Platinum Island, an adults-only retreat at Cinnamon Hakuraa Huraa Maldives that features a private pool, Manzaru Restaurant, Vevu Bar and Lounge, and the magnificent Platinum Beach Bungalows. This is the place to go if you want complete seclusion.","Cinnamon Hakuraa Huraa offers Beach Bungalows, Water Bungalows, and Platinum Beach Bungalows for a higher level of luxury. Every bungalow has gone above and beyond the degree of design and décor of a luxury yet comfortable existence.","The huge, turquoise halo surrounding the land will be the first thing you notice as your seaplane glides across the seas through the faraway Meemu Atoll. You''re staring at one of the Maldives'' largest shallow lagoons - and an ideal location for a photo shoot.","When you''re not having a romantic private dining experience for two on your own balcony, you may enjoy the aromas, colours, and breathtaking modern architecture of our restaurants and lounges.","Mandara Spa, a specialist in relaxation and luxurious therapies, is bringing some Balinese opulence to our humble island."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 430, 'xOcMV9PMeSU', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'cinnamon-hakuraa-huraa-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'cinnamon-hakuraa-huraa-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'hakuraa-huraa'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'cinnamon-hakuraa-huraa-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 430, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'cinnamon-hakuraa-huraa-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow', 490, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'cinnamon-hakuraa-huraa-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Cinnamon-Velifushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'cinnamon-velifushi-island-resort-maldives', 'Cinnamon Velifushi Island Resort Maldives', 'This tranquil aquatic sanctuary is teeming with marine life, including the majestic nurse shark. These sluggish creatures, which are harmless to humans, can grow up to 10 feet long and make a stunning spectacle as they glide gently along the reef. At this pristine atoll, kids will appreciate getting up close and personal with nature. Wildlife is more likely to visit when there is less disturbance from boats and planes. Even our Over-water villas and suites feature a sinuous pathway that, from above, resembles a stingray!', 'published', 'Cinnamon Velifushi Island Resort Maldives | Maldives Resorts | MTG', 'This tranquil aquatic sanctuary is teeming with marine life, including the majestic nurse shark. These sluggish creatures, which are harmless to humans, can grow up to 10 feet long and make a stunning spectacle as they glide gently along the reef. At this pristine atoll, kids will appreciate getting up close and personal with nature. Wildlife is more likely to visit when there is less disturbance from boats and planes. Even our Over-water villas and suites feature a sinuous pathway that, from above, resembles a stingray!', '{"overview_paragraphs":["This tranquil aquatic sanctuary is teeming with marine life, including the majestic nurse shark. These sluggish creatures, which are harmless to humans, can grow up to 10 feet long and make a stunning spectacle as they glide gently along the reef. At this pristine atoll, kids will appreciate getting up close and personal with nature. Wildlife is more likely to visit when there is less disturbance from boats and planes. Even our Over-water villas and suites feature a sinuous pathway that, from above, resembles a stingray!","Consider booking an appointment at the resort spa for an exquisite massage or any other unique spa treatment for a more relaxing activity. With our diverse eating alternatives, meals are never boring. Local and foreign cuisine is available, so you can try something new or savour the taste of an old favourite. If you want something more romantic, we will gladly create a more personalised dinner experience in a remote area, such as one of our white sand beaches.","When it''s time to call it a day, relax in one of our 90 incredibly spacious rooms. The spacious, open, Italian-styled décor effectively compliment the magnificent vistas from each elegant accommodation at Cinnamon Velifushi Maldives. Nothing but you and the wide sea in our water villas! Every accent throughout the hotel echoes the movements and natural tones of the ocean''s depths, so feel free to go with the flow...","This resort will have 66 over-water accommodations, including a Water Suite with a Pool, and 24 land-based rooms, including Beach Bungalows. The resort will also have an Over Water Spa, an Over Water Al-a-cater Restaurant, and other attractions.","The most precious things in life are said to come in small packages, and this glittering 5-star private island retreat is no exception, measuring 5 hectares. Cinnamon Velifushi Maldives is a short seaplane (or speedboat, if you prefer) ride away from Malé, and will provide you with all the breathing space from reality that you require.","We are always willing to add extra unique touches to your stay in order to enhance the romanticism of your holiday. Consider private dinners, island vacations, and personalised experiences for two. Here in Cinnamon Velifushi Maldives, the choices are endless."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 400, 'kbMWsPEN_tI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'cinnamon-velifushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'cinnamon-velifushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'velifushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'cinnamon-velifushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 400, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'cinnamon-velifushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow', 490, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'cinnamon-velifushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Coco-Bodu-Hithi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'coco-bodu-hithi-island-resort-maldives', 'Coco Bodu Hithi Island Resort Maldives', 'The Coco Bodu Hithi Resort in the Maldives captures the essence of the island in every detail. Our Maldives resort is your stylish haven. Reconnect with yourself, your loved ones, and the natural world''s wonders. Remind yourself what it''s like to take a break and travel. Breathe in the fresh sea air. The Hawksbill turtles have arrived. Witness the local Nurse sharks'' tranquil majesty. Investigate the unusual colours of the reef''s inhabitants. Swim beside Manta rays. Take a peaceful sunset cruise across the river. Sink your toes into the white sand and become acquainted with island life and its dreamlike rhythm. All of this is available to you at the Coco Bodu Hithi Maldives Resort.', 'published', 'Coco Bodu Hithi Island Resort Maldives | Maldives Resorts | MTG', 'The Coco Bodu Hithi Resort in the Maldives captures the essence of the island in every detail. Our Maldives resort is your stylish haven. Reconnect with yourself, your loved ones, and the natural world''s wonders. Remind yourself what it''s like to take a break and travel. Breathe in the fresh sea air. The Hawksbill turtles have arrived. Witness the local Nurse sharks'' tranquil majesty. Investigate the unusual colours of the reef''s inhabitants. Swim beside Manta rays. Take a peaceful sunset cruise across the river. Sink your toes into the white sand and become acquainted with island life and its dreamlike rhythm. All of this is available to you at the Coco Bodu Hithi Maldives Resort.', '{"overview_paragraphs":["The Coco Bodu Hithi Resort in the Maldives captures the essence of the island in every detail. Our Maldives resort is your stylish haven. Reconnect with yourself, your loved ones, and the natural world''s wonders. Remind yourself what it''s like to take a break and travel. Breathe in the fresh sea air. The Hawksbill turtles have arrived. Witness the local Nurse sharks'' tranquil majesty. Investigate the unusual colours of the reef''s inhabitants. Swim beside Manta rays. Take a peaceful sunset cruise across the river. Sink your toes into the white sand and become acquainted with island life and its dreamlike rhythm. All of this is available to you at the Coco Bodu Hithi Maldives Resort.","The Maldives'' private Coco Bodu Hithi villas combine the principles of ample space, private pools and outdoor decks, elegant decor, and true comfort. Our Island Villas offer one experience of Bodu Hithi, nestled in thick tropical flora only steps from the water, each with its own space on the beach. Our Water Villas and Escape Water Villas stand gently above the lagoon off the east coast of the island. Waking up to this vision of an endless ocean is eternally uplifting. Coco Residences, which face northwest, stand as an enclave on water, forming an unique wing of the resort.","Coco Bodu Hithi is an island paradise in North Male Atoll, 40 minutes by speedboat from Velana International Airport.","Every night, there''s something new for you to experience, from Maldives fine dining to beach picnics. Our varied breakfast buffets and themed evenings are served at Air. Aqua is our fine-dining establishment that specialises in fish. Tsuki serves authentic Japanese cuisine. Stars combines flavours from the East and the Mediterranean. The Wine Loft is an oenophile''s paradise, while Latitude is a cocktail lover''s fantasy. If you simply cannot leave the sanctuary of your villa, you can order from an In-villa menu featuring a variety of food and drinks from our Maldives Restaurants, including dishes suitable for children.","Coco Spa in the Maldives exudes tranquillity. Eight chambers, each named after a different section of the coconut palm, provide the ideal retreat for disconnecting from the outer world and reconnecting with your body and mind. A variety of extremely restorative treatments inspired by ancient Indonesian, Thai, and Indian traditions and augmented with tea-inspired products. You can relax in the Raa room with our professional Thai masseurs or in the Kurumba room with our distinctive ritual, Journey to the Maldives. Each room at our Maldives Spa provides a tranquil setting in which to unwind after treatments and prolong the sensation of being pampered.","We recognise two things: the richness of our island home is found in its natural beauty, tropical climate, and slow pace, and the shared vision of those who visit us is to be refreshed, enriched, and inspired by their time with us. In response to the qualities of Bodu Hithi and the desires of our guests, we have designed excursions, adventures, and activities that allow you to discover the Maldives and combine it all into unforgettable, cherished realities."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 690, 'xGAFeyMV4XI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'coco-bodu-hithi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'coco-bodu-hithi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'bodu-hithi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'coco-bodu-hithi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Island Villa', 690, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'coco-bodu-hithi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'coco-bodu-hithi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Cocogiri-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'cocogiri-island-resort-maldives', 'Cocogiri Island Resort Maldives', 'Our swimming pool is right adjacent to White Sand''s Bar and Cafe and the beach, giving our visitors with spectacular views of the Indian Ocean. Enjoy a delicious drink from our Bar while lying by the pool in the Maldivian sun. Our Swimming Pool also features a children''s section for the enjoyment of the entire family.', 'published', 'Cocogiri Island Resort Maldives | Maldives Resorts | MTG', 'Our swimming pool is right adjacent to White Sand''s Bar and Cafe and the beach, giving our visitors with spectacular views of the Indian Ocean. Enjoy a delicious drink from our Bar while lying by the pool in the Maldivian sun. Our Swimming Pool also features a children''s section for the enjoyment of the entire family.', '{"overview_paragraphs":["Our swimming pool is right adjacent to White Sand''s Bar and Cafe and the beach, giving our visitors with spectacular views of the Indian Ocean. Enjoy a delicious drink from our Bar while lying by the pool in the Maldivian sun. Our Swimming Pool also features a children''s section for the enjoyment of the entire family.","Through our daily excursions, you can explore the surrounding islands and immerse yourself in the cultural beauty of the Maldives. Cocogiri is your private gateway to tropical paradise, located only 18 minutes by seaplane or 60 minutes by speed boat from Male International Airport.","Azure Lagoona Restaurant offers a pleasant dining experience with views of the Indian Ocean. The buffet offers a diverse selection of cuisine, as well as live cooking stations and themed evenings. Take your dining experience to the next level by ordering from our A La Carte menu. Breakfast, lunch, and dinner are all gastronomic experiences at Azure Lagoona Restaurant, where delectable specialties are prepared using only the finest ingredients.","Ameera Spa is created in discrete pods to provide our visitors with a sense of calm and joy. Our Spa Therapists are trained to provide a variety of services such as massage, facials, body wraps, scrubs, and numerous aesthetic treatments. Begin your day with a revitalising facial treatment or relax after a day of activities with our hot stone massage.","The secluded Vaavu Atoll has some of the Maldives'' most stunning coral reefs and sandbanks. The Vaavu Atoll is well-known for its diverse marine life, including dolphins, turtles, manta rays, eagle rays, living coral, and whale sharks. It is also home to Fotteyo Kandu, the Maldives'' largest unbroken barrier reef stretching over 50 kilometers, making it one of the best places in the world for diving."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 540, 'CqbUr7mdR6w', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'cocogiri-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'cocogiri-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'vashugiri'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'cocogiri-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 540, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'cocogiri-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Cocoon
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'cocoon-island-resort-maldives', 'Cocoon Island Resort Maldives', 'Cocoon Maldives combines the best of Italian design with the spectacular natural beauty of the Maldives, all against the backdrop of the turquoise Indian Ocean.', 'published', 'Cocoon Island Resort Maldives | Maldives Resorts | MTG', 'Cocoon Maldives combines the best of Italian design with the spectacular natural beauty of the Maldives, all against the backdrop of the turquoise Indian Ocean.', '{"overview_paragraphs":["Cocoon Maldives combines the best of Italian design with the spectacular natural beauty of the Maldives, all against the backdrop of the turquoise Indian Ocean.","The villas are completely equipped to allow you to rest, unwind, and enjoy a timeless vacation with us. The beachfront terrace views the gorgeous crystal-clear ocean, while your private garden, with with sun loungers, day bed, swimming pool, and outdoor shower, is the ideal place to spend sunny days. The natural beauty of the Maldives combined with the best of Italian design is a harmonious marriage of style and nature. Cocoon includes 150 guest villas, 3 restaurants, and 2 bars exclusively created by LAGO, the award-winning Italian designer, with mattresses that float in the air and rustic wildwood tables.","Cocoon Maldives is situated on the beautiful island of Ookolhufinolhu in the Lhaviyani Atoll. The resort is a picturesque 30-minute seaplane ride from Malé''s Velana International Airport.","You will be spoiled for choice with three restaurants and two bars. The main restaurant, OCTOPUS, entices you with world cuisines in themed buffets and interactive live stations. MANTA Restaurant in the lagoon offers à la carte eating for those looking for a romantic evening by candlelight to the rising lovers'' moon. JAPANESE GARDEN serves traditional Japanese cuisine while overlooking the Indian Ocean. KURUM-BAR is a laid-back spot for sunset cocktails, and the LOABI LOABI pool Bar is a convivial gathering spot that hosts nighttime parties.","Cocoon''s skilled spa therapists provide a wide range of therapeutic treatments from around the world to ensure a sublime spa experience that heals the mind, body, and spirit.","Cocoon Maldives has activities for everyone, from sports to entertainment and diving aficionados. Excursions activities such as island tours and dolphin cruises can be scheduled through our Travel & Tour Assistance staff. Daily entertainment includes a live band, a disco, a Maldivian cultural show, and other activities. Sporting activities such as Big Game fishing trips, Snorkeling Explorer, and others are available. You will be overwhelmed with options."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 390, 'VBv-4dBPSy4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'cocoon-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'cocoon-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'ookolhufinolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'cocoon-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 390, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'cocoon-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoo Villa', 450, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'cocoon-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Conrad-Rangali
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'conrad-maldives-rangali-island-resort-maldives', 'Conrad Maldives Rangali Island Resort Maldives', 'Conrad Maldives Rangali Island is on an environmental mission. Our partnership with the environmental nonprofit Parley For The Oceans strives to influence change and promote sustainable travel. Each villa will be given a Parley Kit, which will encourage visitors to use less of the materials that have a negative influence on the environment and the ocean. Join us in honouring our oceans and caring for our threatened ecosystem.', 'published', 'Conrad Maldives Rangali Island Resort Maldives | Maldives Resorts | MTG', 'Conrad Maldives Rangali Island is on an environmental mission. Our partnership with the environmental nonprofit Parley For The Oceans strives to influence change and promote sustainable travel. Each villa will be given a Parley Kit, which will encourage visitors to use less of the materials that have a negative influence on the environment and the ocean. Join us in honouring our oceans and caring for our threatened ecosystem.', '{"overview_paragraphs":["Conrad Maldives Rangali Island is on an environmental mission. Our partnership with the environmental nonprofit Parley For The Oceans strives to influence change and promote sustainable travel. Each villa will be given a Parley Kit, which will encourage visitors to use less of the materials that have a negative influence on the environment and the ocean. Join us in honouring our oceans and caring for our threatened ecosystem.","Conrad Maldives Rangali Island will give you a new perspective on life. THE MURAKA is a one-of-a-kind property nestled in a private portion of the dazzling lagoon, providing completely integrated living, dining, entertaining, and sleeping above and below the Indian Ocean with unimpeded views at every step.","This property on Rangali-Finolhu Island is nestled among swaying palm trees and tropical foliage and has direct access to the powder soft white sand beach and turquoise sea of the Indian Ocean. Relax in the enormous bedroom with floor-to-ceiling glass windows; for further privacy, this villa has the option of creating a curtained-off section morphing into an alcove for a day bed.","Soak in the sound of the waves on the intimate outdoor patio, or take advantage of a one-of-a-kind open-air bathroom with rain shower and a magnificent thatch-roofed outdoor bathing pavilion. Beach villas are positioned on either side of the island, with some facing the morning sunrise and others facing the evening sunset.","Wake up to the relaxing sound of the ocean and the sun shining through your private sundeck, which offers unobstructed views of infinite blue. This villa is located on Rangali Island, our isolated adults-only island, and is ideal for a romantic island escape for two.","Spend the day snorkelling directly from your sundeck steps, swimming with exotic reef species in crystal clear water, or simply relaxing and sunbathing in the infinity plunge pool. This stilted thatch-roofed water villa has a big room with a lounge area, a glass desk set atop a glass-paneled floor with views into the ocean below, and a bathroom with an ocean-view tub, rain shower, and double vanity."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 1200, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'conrad-maldives-rangali-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'conrad-maldives-rangali-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'rangali'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'conrad-maldives-rangali-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 1200, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'conrad-maldives-rangali-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Water Villa', 1700, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'conrad-maldives-rangali-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Cora-Cora
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'cora-cora-maldives-island-resort-maldives', 'Cora Cora Maldives Island Resort Maldives', 'I''ve spent a lot of time in the Maldives staring down at huge islands, silently hoping that the resort I''m about to land at isn''t the one with the kilometer-long, villa-lined boardwalk snaking out to sea. Don''t get me wrong: staying at larger resorts has advantages, but Cora Cora Maldives, which opened last year, is a shining example of the advantages of smaller ones.', 'published', 'Cora Cora Maldives Island Resort Maldives | Maldives Resorts | MTG', 'I''ve spent a lot of time in the Maldives staring down at huge islands, silently hoping that the resort I''m about to land at isn''t the one with the kilometer-long, villa-lined boardwalk snaking out to sea. Don''t get me wrong: staying at larger resorts has advantages, but Cora Cora Maldives, which opened last year, is a shining example of the advantages of smaller ones.', '{"overview_paragraphs":["I''ve spent a lot of time in the Maldives staring down at huge islands, silently hoping that the resort I''m about to land at isn''t the one with the kilometer-long, villa-lined boardwalk snaking out to sea. Don''t get me wrong: staying at larger resorts has advantages, but Cora Cora Maldives, which opened last year, is a shining example of the advantages of smaller ones."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 600, null, 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'cora-cora-maldives-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'cora-cora-maldives-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'maamigili'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'cora-cora-maldives-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'cora-cora-maldives-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'cora-cora-maldives-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 620, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'cora-cora-maldives-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Dhigali
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'dhigali-maldives-island-resort', 'Dhigali Maldives Island Resort', 'Dhigali Island, a slender coral cay in the Raa Atoll, is pure Maldivian bliss. This is a luxurious getaway with a twist, surrounded by coral and kissed by the sun. The island''s pristine blue border is dotted with castaway houses and overwater bungalows. The colourful life abounds in the house-reef. The depths of the Lakshadweep Sea beyond the lagoon provide magnificent sights. To set foot on the sands of Dhigali in the Maldives is to embark on an adventure. The excitement of discovery awaits on land, at sea, or undersea. Dhigali gives a warm Maldivian welcome to all guests. Design innovation, breathtaking scenery, and inspired, intuitive service combine to create a truly sublime island experience.', 'published', 'Dhigali Maldives Island Resort | Maldives Resorts | MTG', 'Dhigali Island, a slender coral cay in the Raa Atoll, is pure Maldivian bliss. This is a luxurious getaway with a twist, surrounded by coral and kissed by the sun. The island''s pristine blue border is dotted with castaway houses and overwater bungalows. The colourful life abounds in the house-reef. The depths of the Lakshadweep Sea beyond the lagoon provide magnificent sights. To set foot on the sands of Dhigali in the Maldives is to embark on an adventure. The excitement of discovery awaits on land, at sea, or undersea. Dhigali gives a warm Maldivian welcome to all guests. Design innovation, breathtaking scenery, and inspired, intuitive service combine to create a truly sublime island experience.', '{"overview_paragraphs":["Dhigali Island, a slender coral cay in the Raa Atoll, is pure Maldivian bliss. This is a luxurious getaway with a twist, surrounded by coral and kissed by the sun. The island''s pristine blue border is dotted with castaway houses and overwater bungalows. The colourful life abounds in the house-reef. The depths of the Lakshadweep Sea beyond the lagoon provide magnificent sights. To set foot on the sands of Dhigali in the Maldives is to embark on an adventure. The excitement of discovery awaits on land, at sea, or undersea. Dhigali gives a warm Maldivian welcome to all guests. Design innovation, breathtaking scenery, and inspired, intuitive service combine to create a truly sublime island experience.","The 20 beach cottages at Dhigali are concealed among natural vegetation. Each features an open-air bathroom as well as a luxurious semi-open rainfall shower. A large, covered patio with private sun loungers.","Beach Villas with private pools at Dhigali Maldives resort are excellent for couples celebrating romance. The villas offer breathtaking views of the sparkling blue-green waters, as well as a bathroom with an exhilarating rainfall shower that is open to the balmy island air and an expansive covered outdoor veranda that leads to the porcelain sands of the beach, where private sun loungers sit under native fronds.","Dhigali''s 24 Overwater villas in the Maldives are elegantly situated over crystal clear water, just a short paddle from the colourful house reef. Each villa has a large wooden sundeck that steps down to the sea, where exciting excursions await.","Dhigali Maldives'' crystal blue periphery is dotted with castaway homes and Over Water Bungalows. Some rooms include a lounge space for your comfort. There is a coffee machine in the room. Every room has its own bathroom, which has a bath or shower, a bidet, and a selection of amenities.","Beyond the lagoon, Dhigali Maldives is encircled by a massive house reef in Raa Atoll. Dhigali Maldives is a 45-minute seaplane flight from Velana International Airport. Domestic flights from Ifuru/Dharavandhoo Airport take only 70 minutes, including the transfer by speedboat."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 889, 'mK3be2nNVlI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'dhigali-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'dhigali-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'dhigali'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'dhigali-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 889, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'dhigali-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1400, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'dhigali-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 1180, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'dhigali-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Dhiggiri
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'nakai-dhiggiri-island-resort-maldives', 'NAKAI Dhiggiri Island Resort Maldives', 'Dhiggiri is a three-hectare island in the peaceful and intriguing Vaavu atoll, 20 minutes by seaplane and 90 minutes by speed boat north of Male. It is a "niche" atoll that only the most ardent Maldives fans are familiar with due to its magnificent points of immersion and distinct naturalistic tone. Its low population density and resulting small number of human settlements result in breathtaking natural vistas that can capture the eyes and hearts of people who cross it.', 'published', 'NAKAI Dhiggiri Island Resort Maldives | Maldives Resorts | MTG', 'Dhiggiri is a three-hectare island in the peaceful and intriguing Vaavu atoll, 20 minutes by seaplane and 90 minutes by speed boat north of Male. It is a "niche" atoll that only the most ardent Maldives fans are familiar with due to its magnificent points of immersion and distinct naturalistic tone. Its low population density and resulting small number of human settlements result in breathtaking natural vistas that can capture the eyes and hearts of people who cross it.', '{"overview_paragraphs":["Dhiggiri is a three-hectare island in the peaceful and intriguing Vaavu atoll, 20 minutes by seaplane and 90 minutes by speed boat north of Male. It is a \"niche\" atoll that only the most ardent Maldives fans are familiar with due to its magnificent points of immersion and distinct naturalistic tone. Its low population density and resulting small number of human settlements result in breathtaking natural vistas that can capture the eyes and hearts of people who cross it.","A modern structure surrounded by traditional Maldivian coral. In addition to the distinctive comfort and unsurpassed charm of the beachfront, the 27 beach bungalows of Dhiggiri will provide you with the tranquillity that only the most intimate and friendly environs can provide.","You will wake up to the sound of the sea and a stunning horizon at the 34 Over Water of Dhiggiri. The Over Water woods combine exquisite minimalism with sensory stimulation, ushering you into a new day of relaxation and tranquillity.","Dhiggiri offers three various types of rooms to its guests, ranging from the Over Water Rooms that view the ocean to the Beach Bungalows that are just a few steps from the beach, passing through a Garden Villa that is surrounded by flora. Choose the one that best suits you and let yourself to be whisked away by Dhiggiri''s enchantment.","It is close to a variety of diving sites in the Maldives, some of which are protected areas on the list of the greatest dive sites in the world, making it suitable for both expert and beginner divers. Dhiggiri is about 20 minutes by seaplane and 90 minutes by speed boat from Velana International Airport.","Let yourself be enslaved by the flavours of the island in Dhiggiri''s restaurants and pubs. Our dining menu has been created to be as diverse as possible in order to fulfil the demands of all customers. In the restaurants, you can sample the delights of Italian and Maldivian cuisine, prepared and served daily by our Chefs. Our bars will be the ideal place to unwind and have a refreshing drink while taking in the sights and sounds that only the Maldives can provide."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 310, 'Ng4M3P60Mio', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'nakai-dhiggiri-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'nakai-dhiggiri-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'dhiggiri'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'nakai-dhiggiri-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 310, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'nakai-dhiggiri-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 375, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'nakai-dhiggiri-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Dhigufaru-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'dhigufaru-island-resort-maldives', 'Dhigufaru Island Resort Maldives', 'Dhigufaru Island, meaning "a long reef," is the essence of an exotic hideaway, nestled in the protected Biosphere reserve of Baa Atoll. We offer the right blend of both if you choose to kick back, relax, and take in the majestic, stunning beauty of the island and surrounding coral, or if you prefer a more action-packed, exotic trip. Dhigufaru Island Resort welcomes you.', 'published', 'Dhigufaru Island Resort Maldives | Maldives Resorts | MTG', 'Dhigufaru Island, meaning "a long reef," is the essence of an exotic hideaway, nestled in the protected Biosphere reserve of Baa Atoll. We offer the right blend of both if you choose to kick back, relax, and take in the majestic, stunning beauty of the island and surrounding coral, or if you prefer a more action-packed, exotic trip. Dhigufaru Island Resort welcomes you.', '{"overview_paragraphs":["Dhigufaru Island, meaning \"a long reef,\" is the essence of an exotic hideaway, nestled in the protected Biosphere reserve of Baa Atoll. We offer the right blend of both if you choose to kick back, relax, and take in the majestic, stunning beauty of the island and surrounding coral, or if you prefer a more action-packed, exotic trip. Dhigufaru Island Resort welcomes you.","We invite you to a whole unique experience, one that lets you to discover the Maldives'' natural beauty from both above and below the water. We offer you an opportunity unlike any other, one that allows you to be as busy or as peaceful as you desire.","With breathtaking views and direct beach access from each of the 10 Veli Pool Beach Villas, 12 Veli Beach Villas, 8 Boaku Beach Villas, and 2 Family Beach Villas, you may choose between the serenity and tranquillity of the eastern facing Boaku beach and the stunning majesty of the Veli beach. Each Villa contains a semi-outdoor shower area, an inside bathroom, and a vanity area for him and her. The room is outfitted with all of the modern conveniences you''ll need. Each accommodation connects to your own veranda, which is surrounded by a private garden and offers views of the beach and lagoon.","The 10 Veli Pool Villas, located just within the beach tree line, offer the ultimate tropical luxury with views of the sun, sea, and sand. Everything you need for your comfort is provided within the room, including elegantly constructed comfy furnishings, satellite television, air conditioning, and ambient lighting. Step through to the decked veranda imbedded with a plunge pool facing the beach, fitted with comfortable sun loungers for all-day sunbathing.","Our amazing 20 Fidhanfulhu Water Villas are the pinnacle of comfort and enjoyment. These exquisite Water villas are big, bright, and luxuriously outfitted. Every Villa has its own stairway that leads down to the crystal clear lagoon below, ideal for swimming or snorkelling. Spend your days reclining just a few feet above the beautiful waves of the Indian Ocean on your private chaise, soaking up the sun while being pampered by our attentive staff.","The accommodations are positioned along the island''s perimeter, allowing you to appreciate the unique natural characteristics that make Dhigufaru Island Resort so fascinating."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 480, 'ni9GAZMyeBY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'dhigufaru-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'dhigufaru-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'dhigufaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'dhigufaru-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Boaku Beach Villa', 480, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'dhigufaru-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Veli Pool Villa', 600, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'dhigufaru-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Fidhanfulhu Water Villa', 700, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'dhigufaru-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Diamonds-Thudufushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'diamond-thudufushi-maldives-resort-and-spa', 'Diamond Thudufushi Maldives Resort and Spa', 'Welcome to the magnificent Diamonds Thudufushi Beach and Water Villas. Elegant beach bungalows and luxury overwater villas can be found on the island. A wellness centre provides ayurvedic treatments, and a diving centre caters to our guests'' underwater experience. The Diamonds Thudufushi resort is only a 20-minute scenic seaplane flight from Malé International Airport. Thudufushi is the ideal resort to begin exploring the Maldives in a centre of excellence, where every detail has been carefully selected to make your journey unforgettable.', 'published', 'Diamond Thudufushi Maldives Resort and Spa | Maldives Resorts | MTG', 'Welcome to the magnificent Diamonds Thudufushi Beach and Water Villas. Elegant beach bungalows and luxury overwater villas can be found on the island. A wellness centre provides ayurvedic treatments, and a diving centre caters to our guests'' underwater experience. The Diamonds Thudufushi resort is only a 20-minute scenic seaplane flight from Malé International Airport. Thudufushi is the ideal resort to begin exploring the Maldives in a centre of excellence, where every detail has been carefully selected to make your journey unforgettable.', '{"overview_paragraphs":["Welcome to the magnificent Diamonds Thudufushi Beach and Water Villas. Elegant beach bungalows and luxury overwater villas can be found on the island. A wellness centre provides ayurvedic treatments, and a diving centre caters to our guests'' underwater experience. The Diamonds Thudufushi resort is only a 20-minute scenic seaplane flight from Malé International Airport. Thudufushi is the ideal resort to begin exploring the Maldives in a centre of excellence, where every detail has been carefully selected to make your journey unforgettable.","Your dives and excursions will be guided by experts, ranging from biologists who will reveal the secrets of the reef to qualified personnel who will ensure that your entire stay is unique and unforgettable. Because of our all-inclusive formula, you will be able to fully enjoy every second at Diamonds Thudufushi.","The 12 Beach Bungalows face the unspoiled waters and have direct access to the beach. They have verandas with private terraces with armchairs, tables, and sun loungers. Each of the rooms has an outdoor shower.","14 Water Villas have a large private terrace with direct ocean access. All of the rooms have a spacious living area with elegant furniture, a four poster bed, a comfortable sofa and corner bar, contemporary Italian lighting, and beautiful parquet floors.","Thudufushi is the ideal resort for exploring the Maldives and having an unforgettable vacation. During their stay, guests can relax in Beach Villas or enjoy an exquisite experience in Water Villas.","Malé International Airport is only a scenic 25-minute flight away."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 300, 'Caues3sglgg', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'diamond-thudufushi-maldives-resort-and-spa'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'diamond-thudufushi-maldives-resort-and-spa'
  and l.node_type = 'location' and l.slug = 'thudufushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'diamond-thudufushi-maldives-resort-and-spa'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'diamond-thudufushi-maldives-resort-and-spa'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 500, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'diamond-thudufushi-maldives-resort-and-spa'
on conflict (accommodation_id, name) do nothing;

-- Dusit-Thani
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'dusit-thani-island-resort-maldives', 'Dusit Thani Island Resort Maldives', 'Thai heritage combined with the warm and welcoming Maldivian island culture Dusit Thani Maldives is located on Mudhdhoo Island in Baa Atoll, Maldives'' first UNESCO World Biosphere Reserve, and is only 35 minutes by seaplane from the capital city, Malé, or a 25-minute domestic flight and 10 minutes by speedboat from Dharavandhoo Airport.', 'published', 'Dusit Thani Island Resort Maldives | Maldives Resorts | MTG', 'Thai heritage combined with the warm and welcoming Maldivian island culture Dusit Thani Maldives is located on Mudhdhoo Island in Baa Atoll, Maldives'' first UNESCO World Biosphere Reserve, and is only 35 minutes by seaplane from the capital city, Malé, or a 25-minute domestic flight and 10 minutes by speedboat from Dharavandhoo Airport.', '{"overview_paragraphs":["Thai heritage combined with the warm and welcoming Maldivian island culture Dusit Thani Maldives is located on Mudhdhoo Island in Baa Atoll, Maldives'' first UNESCO World Biosphere Reserve, and is only 35 minutes by seaplane from the capital city, Malé, or a 25-minute domestic flight and 10 minutes by speedboat from Dharavandhoo Airport.","Guests seeking island adventure, fine dining, and relaxation will find a luxurious Maldives hotel on the beach as well as over-water villas and residences. The house reef is teeming with marine life, Devarana Spa provides elevated treatment rooms among the coconut trees, and full-service amenities cater to every whim.","Your luxurious Beach Villa awaits, spread across 122 square metres and surrounded by tropical flora, with modern amenities and full-service facilities on hand. Relax on your private terrace before taking a step down to the secluded sands below.","Your stylish Beach Villa offers poolside luxury in paradise, with a generous 122 sq. m of living space enhanced by elegant Thai decor. Take a dip on your private deck or relax on the terrace. Take advantage of the open-air garden bathroom and the direct beach access.","Your luxurious Water Villa, suspended over the turquoise lagoon''s crystal waters, measures 150 square metres and is decorated with Thai flourishes and equipped with all the amenities you require. Relax on your private terrace by the pool or plunge into the ocean.","Choose from a variety of beach and over-water villas and residences to create your ideal private paradise. Dusit Thani Maldives is a 5-star resort in the Maldives with elegant Thai interiors, modern conveniences, and butler service. Luxurious beach retreats await at Dusit Thani Maldives."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1000, 'PmHX8kEUcLI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'dusit-thani-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'dusit-thani-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'mudhdhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'dusit-thani-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 1000, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'dusit-thani-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1150, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'dusit-thani-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Pool Water Villa', 1300, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'dusit-thani-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Emerald-Maldives
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'emerald-maldives-resort-spa-fasmendhoo', 'Emerald Maldives Resort & Spa Fasmendhoo', 'Welcome to the Emerald Maldives Resort & Spa, a new 5-star Deluxe All-Inclusive Resort and proud member of The Leading Hotels of the World. The Resort combines tropical nature with modern design, creating atmospheres of natural and informal elegance, offering the ideal backdrop for guests to construct fresh and memorable experiences.', 'published', 'Emerald Maldives Resort & Spa Fasmendhoo | Maldives Resorts | MTG', 'Welcome to the Emerald Maldives Resort & Spa, a new 5-star Deluxe All-Inclusive Resort and proud member of The Leading Hotels of the World. The Resort combines tropical nature with modern design, creating atmospheres of natural and informal elegance, offering the ideal backdrop for guests to construct fresh and memorable experiences.', '{"overview_paragraphs":["Welcome to the Emerald Maldives Resort & Spa, a new 5-star Deluxe All-Inclusive Resort and proud member of The Leading Hotels of the World. The Resort combines tropical nature with modern design, creating atmospheres of natural and informal elegance, offering the ideal backdrop for guests to construct fresh and memorable experiences.","The spacious Beach Villas have a private garden outside the bathroom, a bedroom, and covered and open patios to relax on after a long day in Paradise.","The Beach Villas with Pool have a private pool in the private garden right outside the bathroom, as well as a bedroom and covered and open patios, allowing guests to be rewarded by a refreshing and quiet moment whenever they choose.","The Water Villas, which are directly on the pier and overlook the turquoise saltwater, provide a bedroom with a bathroom and a walk-in closet, as well as a terrace with a view of the sea.","The Emerald Maldives Resort & Spa has 120 luxury villas with modern and tropical elements, separated into 60 beach villas and 60 overwater villas. Not to add that more than half of the Villas will have their own private pool and Jacuzzi.","Fasmendhoo is an island in Raa Atoll, in the Maldives'' North West area. A breathtaking seaplane trip from Male will take 40 minutes, or you may take a 30-minute domestic flight to Ifuru Domestic Airport, where guests will enjoy a 15-minute speedboat ride to Emerald Maldives Resort. Guests will be able to conveniently connect with their intercontinental flights in the evening thanks to the domestic flight option."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 770, 'C5NRgq0L8_8', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'emerald-maldives-resort-spa-fasmendhoo'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'emerald-maldives-resort-spa-fasmendhoo'
  and l.node_type = 'location' and l.slug = 'fasmendhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'emerald-maldives-resort-spa-fasmendhoo'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 770, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'emerald-maldives-resort-spa-fasmendhoo'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'emerald-maldives-resort-spa-fasmendhoo'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 800, 'USD', 'Double', null, 2
from nodes where node_type = 'accommodation' and slug = 'emerald-maldives-resort-spa-fasmendhoo'
on conflict (accommodation_id, name) do nothing;

-- Eriyadu-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'eriyadu-island-resort-maldives', 'Eriyadu Island Resort Maldives', 'Feel a faraway wind, hear quiet laughing, and glide into a delicate groove that continually and beautifully fills this perfect piece of nature. Lie down on the sun-drenched white sand beach. Eriyadu Island exists, unlike a prophesied legend or a fantasy-scape, with its earthy-woody architecture and salty sea; it''s all real and it''s all here. When you arrive, you''ll be whisked away to the little island known for some of the world''s best diving.', 'published', 'Eriyadu Island Resort Maldives | Maldives Resorts | MTG', 'Feel a faraway wind, hear quiet laughing, and glide into a delicate groove that continually and beautifully fills this perfect piece of nature. Lie down on the sun-drenched white sand beach. Eriyadu Island exists, unlike a prophesied legend or a fantasy-scape, with its earthy-woody architecture and salty sea; it''s all real and it''s all here. When you arrive, you''ll be whisked away to the little island known for some of the world''s best diving.', '{"overview_paragraphs":["Feel a faraway wind, hear quiet laughing, and glide into a delicate groove that continually and beautifully fills this perfect piece of nature. Lie down on the sun-drenched white sand beach. Eriyadu Island exists, unlike a prophesied legend or a fantasy-scape, with its earthy-woody architecture and salty sea; it''s all real and it''s all here. When you arrive, you''ll be whisked away to the little island known for some of the world''s best diving.","SMARTLINE Eriyadu is a modest resort created with comfort in mind in the traditional Maldivian manner. These villas are tucked along the shoreline, beneath the sheltered fronds of palm trees.","SMARTLINE Eriyadu is located 45 minutes from Velana International Airport in North Male'' Atoll and is easily accessible by speed boat."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 130, 'dYXK4n48TUI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'eriyadu-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'eriyadu-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'eriyadu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'eriyadu-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sea View Sky Room', 130, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'eriyadu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Faarufushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'emerald-faarufushi-island-resort-maldives', 'Emerald Faarufushi Island Resort Maldives', 'Welcome to the Emerald Faarufushi Resort & Spa, a new 5-star Deluxe All-Inclusive Resort and a proud member of The Leading Hotels of the World, where tropical landscapes and swaying palm trees welcome you to a refined fusion of nature and indulgence, creating an enchanting atmosphere of barefoot elegance. The resort is located in the Raa Atoll, in the northern part of the Maldives archipelago, on a beautiful private 7-hectare island with 1.2 kilometres of white sandy beach, and it is surrounded by a stunning 100-hectare lagoon with one of the Maldivian ecosystem''s finest coral reefs.', 'published', 'Emerald Faarufushi Island Resort Maldives | Maldives Resorts | MTG', 'Welcome to the Emerald Faarufushi Resort & Spa, a new 5-star Deluxe All-Inclusive Resort and a proud member of The Leading Hotels of the World, where tropical landscapes and swaying palm trees welcome you to a refined fusion of nature and indulgence, creating an enchanting atmosphere of barefoot elegance. The resort is located in the Raa Atoll, in the northern part of the Maldives archipelago, on a beautiful private 7-hectare island with 1.2 kilometres of white sandy beach, and it is surrounded by a stunning 100-hectare lagoon with one of the Maldivian ecosystem''s finest coral reefs.', '{"overview_paragraphs":["Welcome to the Emerald Faarufushi Resort & Spa, a new 5-star Deluxe All-Inclusive Resort and a proud member of The Leading Hotels of the World, where tropical landscapes and swaying palm trees welcome you to a refined fusion of nature and indulgence, creating an enchanting atmosphere of barefoot elegance. The resort is located in the Raa Atoll, in the northern part of the Maldives archipelago, on a beautiful private 7-hectare island with 1.2 kilometres of white sandy beach, and it is surrounded by a stunning 100-hectare lagoon with one of the Maldivian ecosystem''s finest coral reefs.","Emerald Faarufushi was created with the discriminating visitor in mind, and it distinguishes out for its simple yet modern architecture, real cultural experiences, and precisely perfected services that defy pretence. The island has 80 magnificent homes divided into six types, including 38 beach villas and 42 overwater villas.","The Beach Villas include an own furnished terrace and an open-air bathroom. Clean lines, subdued wood tones, and delicate pastel accents characterise this elegantly modest building. Access to a covered timber deck bordered by greenery with views of the sea.","The Beach Villas with Pool give direct access to the white-sand beach of Emerald Faarufushi. Views that reach all the way to the horizon. Every morning, the view is front and centre thanks to the vaulted ceilings, simple décor, and floor-to-ceiling windows. The finishing touch is a private plunge pool between the front entrance and the sea. They also have a private infinity pool, a large closet, an air-conditioned bathroom, and a private covered terrace with lounge chairs.","The Water Villas with Pool are located along the jetty of Emerald Faarufushi. Because they are all about the vista, they are completed in warm wood tones and large glass. Whether you''re relaxing in the tub, swimming in the pool, or spreading out on the terrace. Take it all in. They have a private infinity pool, a large closet, an air-conditioned bathroom, and a private covered terrace with lounge chairs.","All homes were developed with the purpose of blending in with the surrounding nature and have a simple, elegant style that integrates natural materials of stone and wood. The villas are luxuriously understated: sleek, contemporary, and delectably soothing. All 80 villas are meticulously curated havens with a stunning Indian Ocean view, perched either on the white sandy beach or immediately on the ocean. Flat satellite TVs, king size mattresses, walk-in and \"under the stars\" bathrooms, baths, ample closets, room-controlled air conditioning, and high-speed Wi-Fi are among the thoughtful pleasures. Seventy of the villas have their own private pool overlooking the ocean."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 775, '_WWq9VYHs5I', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'emerald-faarufushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'emerald-faarufushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'faarufushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'emerald-faarufushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Retreat With Pool', 775, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'emerald-faarufushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Fairmont
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'fairmont-maldives-sirru-fen-fushi', 'Fairmont Maldives Sirru Fen Fushi', 'Sirru Fen Fushi is more than simply your own retreat. It is located on the Shaviyani Atoll, which contains one of the country''s largest resort lagoons, Fairmont Maldives. Our "hidden water island," as the locals call it, shines like a gem. Postcard-perfect white sand beaches bordered with swaying palms, lapped by the turquoise waters of the 600-hectare lagoon that leads to the calm blues of the Indian Ocean and an endless horizon.', 'published', 'Fairmont Maldives Sirru Fen Fushi | Maldives Resorts | MTG', 'Sirru Fen Fushi is more than simply your own retreat. It is located on the Shaviyani Atoll, which contains one of the country''s largest resort lagoons, Fairmont Maldives. Our "hidden water island," as the locals call it, shines like a gem. Postcard-perfect white sand beaches bordered with swaying palms, lapped by the turquoise waters of the 600-hectare lagoon that leads to the calm blues of the Indian Ocean and an endless horizon.', '{"overview_paragraphs":["Sirru Fen Fushi is more than simply your own retreat. It is located on the Shaviyani Atoll, which contains one of the country''s largest resort lagoons, Fairmont Maldives. Our \"hidden water island,\" as the locals call it, shines like a gem. Postcard-perfect white sand beaches bordered with swaying palms, lapped by the turquoise waters of the 600-hectare lagoon that leads to the calm blues of the Indian Ocean and an endless horizon.","Our magnificent resort has the Maldives'' largest infinity pool, which leads to the Coralarium, the Maldives'' first and only coral regeneration project in the form of an underwater art installation by Jason deCaires Taylor. Sirru Fen Fushi at Fairmont Maldives is surrounded by magnificent Beach Villas, decadent Over Water Villas, and the unique luxury Tented Jungle Villas.","The Beach Sunset Villas, nestled among thick mangrove greenery on the edge of beautiful white sands, have an en-suite private bathroom with separate shower, twin vanities, a Nespresso coffee machine, wine fridge, a Bose sound system, and a California king-size bed. Outside, there''s a private alfresco bathroom with bathtub and shower, a 14-square-meter plunge pool, and a sala where you can rest and eat. Your personal butler is accessible 24 hours a day to attend to every detail and is only a phone call away. Alternatively, ride your bike along the resort''s sandy roads.","These 495 sqm private luxury pool homes on the island''s east coast are ideal for families, tucked among lush tropical flora. The villas offer private tropical gardens, a plunge pool, big indoor and outdoor bathrooms with separate shower and double sink, a Nespresso coffee maker, wine fridge, Bose Hi-Fi system, a California King-size bed, and a separate living room space. A professional Villa Host is on hand 24 hours a day and takes care in making your stay as pleasant as possible; simply call them and begin exploring our private water island.","These 495 sqm private premium pool homes tucked on the island''s east coast are ideal for families. The pristine Indian Ocean in front of you, lush mangrove behind, the villas feature private tropical gardens, plunge pool, generous indoor and outdoor bathrooms with separate shower and double sink, a Nespresso coffee machine, wine fridge, Bose Hi-Fi system, a California King-size bed, and a separate living room area. A specialised Villa Host is accessible 24 hours a day and takes delight in making your stay as pleasant as possible; simply call them and begin exploring our secret water island.","Relax into the natural elegance of Fairmont Maldives Sirru Fen Fushi''s rustic chic Beach and Water Villas, each with its own private pool, or retreat in true tropical flair to Tented Jungle Villa while indulging in an inspiring Maldivian experience."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 850, 'jGU84_1YfzM', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'fairmont-maldives-sirru-fen-fushi'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'fairmont-maldives-sirru-fen-fushi'
  and l.node_type = 'location' and l.slug = 'sirru-fen-fushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'fairmont-maldives-sirru-fen-fushi'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 850, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'fairmont-maldives-sirru-fen-fushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Beach Sunrise Villa', 1280, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'fairmont-maldives-sirru-fen-fushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Sunrise Villa', 1111, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'fairmont-maldives-sirru-fen-fushi'
on conflict (accommodation_id, name) do nothing;

-- Filitheyo-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'filitheyo-island-resort-maldives', 'Filitheyo Island Resort Maldives', 'Welcome to an island paradise of verdant jungle greenery and gleaming white beaches. Filitheyo resort is located on Faafu Atoll, one of the Maldives'' most pristine atolls, which is rich in colourful marine life and brilliant coral 120. It takes 35 minutes by sea plane to reach 7 km from Male Velana International Airport, followed by a 10-minute traditional dhoni ride. Seaplane transfers are the only way for visitors to reach this beautiful island.', 'published', 'Filitheyo Island Resort Maldives | Maldives Resorts | MTG', 'Welcome to an island paradise of verdant jungle greenery and gleaming white beaches. Filitheyo resort is located on Faafu Atoll, one of the Maldives'' most pristine atolls, which is rich in colourful marine life and brilliant coral 120. It takes 35 minutes by sea plane to reach 7 km from Male Velana International Airport, followed by a 10-minute traditional dhoni ride. Seaplane transfers are the only way for visitors to reach this beautiful island.', '{"overview_paragraphs":["Welcome to an island paradise of verdant jungle greenery and gleaming white beaches. Filitheyo resort is located on Faafu Atoll, one of the Maldives'' most pristine atolls, which is rich in colourful marine life and brilliant coral 120. It takes 35 minutes by sea plane to reach 7 km from Male Velana International Airport, followed by a 10-minute traditional dhoni ride. Seaplane transfers are the only way for visitors to reach this beautiful island.","This quaint Maldives resort offers a spa unlike any other. The jungle spa, located in the middle of the island, is a tranquil haven surrounded by lush tropical flora. Spa therapists provide a variety of Balinese and foreign treatments. Filitheyo is also a scuba diver''s heaven. The house reef is teeming with aquatic life, such as fish, reef sharks, and rays, and our Werner Lau dive centre offers a variety of daily excursions. The freeform infinity-edge swimming pool adjacent to the sea, complete with a swim-up bar, is an ideal place to unwind.","These semi-detached villas on the beachfront provide a king size four poster bed or twin beds, a private sundeck with a day bed, and a semi-open-air bathroom with an outdoor shower. Families and groups can request interconnecting rooms.","The spacious water villas are built on stilts above the lagoon and have a king size four poster bed or twin beds, a huge bathroom with a jacuzzi, day bed, and a private sundeck with a traditional ''udoli'' (swing chair) and private stairs going right into the water.","Filitheyo, with a total land area of around 21 hectares, contains 125 homes built to blend in with the island ambience, creating the image of wooden cottages with thatched roofs covered by palm trees. They are all outfitted with the greatest and most up-to-date accommodation amenities and services.","Filitheyo resort, located in Faafu Atoll, is 121 kilometres from Velana International Airport and is accessible by sea plane in 35 minutes, followed by a 15-minute traditional dhoni ride. Seaplane transfers are the sole way for visitors to reach this picturesque island."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 250, 'N-FaHyKf1uI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'filitheyo-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'filitheyo-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'filitheyo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'filitheyo-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Superior Villa', 250, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'filitheyo-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 620, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'filitheyo-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Finolhu
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'finolhu-maldives-island-resort-kanufushi', 'Finolhu Maldives Island Resort Kanufushi', 'Finolhu, a Maldives resort, provides similar experiences. Imagine you''re relaxing on the patio of your private villa at sunset when a manta ray swims past. Or perhaps you''re snorkelling in the morning and are met by a colourful and interested turtle. Finolhu lies on the cusp of a very different world: the sea is the world''s largest natural ecosystem. And here in Baa Atoll, a UNESCO biosphere reserve, the colours of the corals and fish reveal their very distinct enchantment. Finolhu is a fantastic destination, both on the beach and in the ocean. So please tell us about your dreams! We are excited to meet you!', 'published', 'Finolhu Maldives Island Resort Kanufushi | Maldives Resorts | MTG', 'Finolhu, a Maldives resort, provides similar experiences. Imagine you''re relaxing on the patio of your private villa at sunset when a manta ray swims past. Or perhaps you''re snorkelling in the morning and are met by a colourful and interested turtle. Finolhu lies on the cusp of a very different world: the sea is the world''s largest natural ecosystem. And here in Baa Atoll, a UNESCO biosphere reserve, the colours of the corals and fish reveal their very distinct enchantment. Finolhu is a fantastic destination, both on the beach and in the ocean. So please tell us about your dreams! We are excited to meet you!', '{"overview_paragraphs":["Finolhu, a Maldives resort, provides similar experiences. Imagine you''re relaxing on the patio of your private villa at sunset when a manta ray swims past. Or perhaps you''re snorkelling in the morning and are met by a colourful and interested turtle. Finolhu lies on the cusp of a very different world: the sea is the world''s largest natural ecosystem. And here in Baa Atoll, a UNESCO biosphere reserve, the colours of the corals and fish reveal their very distinct enchantment. Finolhu is a fantastic destination, both on the beach and in the ocean. So please tell us about your dreams! We are excited to meet you!","Our Maldivian Beach Villas provide that laid-back island vibe. You can see your lush garden and the beach beyond without getting out of bed, and the blue sea is immediately behind you. The subtle changes in forms and tones of blue and green, as well as the apricot tone of the setting sun, provide lightness and freshness to this lovely 205-square-meter garden cottage. A large bathroom with tub and shower at the back contains an open-air space where you may stare at the stars while having a shower.","In one of our beachfront pool villas, you can experience true Maldivian comfort and relaxation. Imagine waking up in the morning and gazing out at your beautiful private garden, then wandering through it to the beach and the stunning lagoon beyond. Life can be so carefree and lovely when you''re lying entirely comfortable in your own private pool, reading a book under the palm trees, or taking a refreshing shower in the open-air section of the bathroom. The pool villa is 205 square metres (2206 ft2) with indoor and outdoor areas and provides a pleasant blend of privacy and spaciousness, while the beautiful colour composition gives this home lightness and freshness.","The view over the tranquil waters of the lagoon with its countless colours of blue from this stylish Lagoon Villa may be seductive. You may sprawl out and relax on the sun loungers of your hidden wooden deck, which has 145 square metres of private area immediately above the ocean, while a private jetty runs directly into the sea. Take another drink while listening to your favourite music on the cutting-edge Marshall Sound System. Life is really amazing here!","Living by the sea and seeing its countless colours of blue on a daily basis is healthy for the soul. When one looks out over the water, the spirit is transported by the waves, and all sense of time fades. Staying in any of our 125 villas puts you right on the beach, on the lagoon, or on stilts above the water, and 79 of them have their own swimming pool. The acclaimed designers from Muza Lab in London have integrated the brilliant colours of nature inside the villas in an almost irresistible way, creating a kaleidoscope effect. Each villa not only has luxurious furnishings but also a high level of privacy, allowing you to sleep, relax, and shower in peace.","Finolhu Maldives lies in the UNESCO World Biosphere Reserve in Baa Atoll. Traveling by seaplane from Velana International Airport takes only 30 minutes, or take a 20-minute trip to Dharavandhoo Domestic Airport on Baa Atoll, followed by a 20-minute speedboat journey to Finolhu."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 800, 'WRlxlbZ3pYU', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'finolhu-maldives-island-resort-kanufushi'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'finolhu-maldives-island-resort-kanufushi'
  and l.node_type = 'location' and l.slug = 'kanufushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'finolhu-maldives-island-resort-kanufushi'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 950, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'finolhu-maldives-island-resort-kanufushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1400, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'finolhu-maldives-island-resort-kanufushi'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 800, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'finolhu-maldives-island-resort-kanufushi'
on conflict (accommodation_id, name) do nothing;

-- Four-Seasons-Giraavaru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'four-seasons-resort-maldives-at-landaa-giraavaru', 'Four Seasons Resort Maldives at Landaa Giraavaru', 'Welcome to one of the most beautiful islands in the world: a UNESCO Biosphere Reserve wilderness where iridescent blues, jungle greens, and brilliant whites meet innovation, conservation, and health. Snorkel with manta rays in aquarium-like seas, rehabilitate sea turtles at our Marine Discovery Centre, enjoy world-class wellness at AyurMa, and dine at Blu Beach Club.', 'published', 'Four Seasons Resort Maldives at Landaa Giraavaru | Maldives Resorts | MTG', 'Welcome to one of the most beautiful islands in the world: a UNESCO Biosphere Reserve wilderness where iridescent blues, jungle greens, and brilliant whites meet innovation, conservation, and health. Snorkel with manta rays in aquarium-like seas, rehabilitate sea turtles at our Marine Discovery Centre, enjoy world-class wellness at AyurMa, and dine at Blu Beach Club.', '{"overview_paragraphs":["Welcome to one of the most beautiful islands in the world: a UNESCO Biosphere Reserve wilderness where iridescent blues, jungle greens, and brilliant whites meet innovation, conservation, and health. Snorkel with manta rays in aquarium-like seas, rehabilitate sea turtles at our Marine Discovery Centre, enjoy world-class wellness at AyurMa, and dine at Blu Beach Club.","Swim with the crew that is working relentlessly to safeguard the world''s biggest known population of manta rays. Sign up for our Manta On Call service and you will be whisked away by speedboat whenever manta rays are seen near the Resort for an amazing snorkelling experience.","Walk away from the beach and through a turquoise gate to your walled Beach Villa, which features a private lap pool flanked by a cushioned daybed, an open-air living and dining pavilion, and an island-style bedroom surrounded by tropical foliage.","In these west-facing infinity-pool villas, you can enjoy kaleidoscopic sunsets. Submit to the cool simplicity of indoor-outdoor life, from outdoor showers and a loft-level lounge to midnight dives in your private pool, isolated off a double jetty.","The villas and bungalows are a modest, modern fusion of Maldivian building techniques with Sri Lankan shapes. Four Seasons Landaa Giraavaru provides 13 various room types on both land and sea, each with its own private beach, pool, outdoor showers, beautiful private gardens, huge sundecks, outdoor showers, and nets for over-water sunbathing.","Four Seasons Landaa Giraavaru is a 44-acre utopia on the Baa Atoll UNESCO Biosphere Reserve that combines innovation, wellness, and conservation. Following your arrival at Velana International Airport (MLE), your adventure to Landaa Giraavaru continues with a 35-minute seaplane ride that provides a breathtaking view of the crystalline seas and secluded islands."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 2500, '74y61Fcw970', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'four-seasons-resort-maldives-at-landaa-giraavaru'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'four-seasons-resort-maldives-at-landaa-giraavaru'
  and l.node_type = 'location' and l.slug = 'landaa-giraavaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'four-seasons-resort-maldives-at-landaa-giraavaru'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa With Pool', 2500, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'four-seasons-resort-maldives-at-landaa-giraavaru'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Water Villa With Pool', 2500, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'four-seasons-resort-maldives-at-landaa-giraavaru'
on conflict (accommodation_id, name) do nothing;

-- Four-Seasons-Huraa
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'four-seasons-resort-maldives-at-kuda-huraa', 'FOUR SEASONS RESORT MALDIVES AT KUDA HURAA', 'Kuda Huraa rises gently from a sheet of turquoise, making it difficult to determine where the water stops and the sky starts. We embrace our gorgeous surroundings to bring you closer to the sea and its mysteries, which are as enthralling beneath the waves as they are above them. Discover a lagoon, flower gardens, a secluded spa island, and large new Beach Pavilion hideaways in a beautiful village setting, granted a Forbes Five-Star rating in 2020.', 'published', 'FOUR SEASONS RESORT MALDIVES AT KUDA HURAA | Maldives Resorts | MTG', 'Kuda Huraa rises gently from a sheet of turquoise, making it difficult to determine where the water stops and the sky starts. We embrace our gorgeous surroundings to bring you closer to the sea and its mysteries, which are as enthralling beneath the waves as they are above them. Discover a lagoon, flower gardens, a secluded spa island, and large new Beach Pavilion hideaways in a beautiful village setting, granted a Forbes Five-Star rating in 2020.', '{"overview_paragraphs":["Kuda Huraa rises gently from a sheet of turquoise, making it difficult to determine where the water stops and the sky starts. We embrace our gorgeous surroundings to bring you closer to the sea and its mysteries, which are as enthralling beneath the waves as they are above them. Discover a lagoon, flower gardens, a secluded spa island, and large new Beach Pavilion hideaways in a beautiful village setting, granted a Forbes Five-Star rating in 2020.","Take to the skies with a team of professional guides in search of the greatest surf and the largest waves in the Maldives. It''s your chance, only via our Resort, to fly into the heart of Maldivian surf wildness.","From internal solitude to the white-sand beach, from sunbathing on your private deck to cooling off in your plunge pool, you can do it all with ease. Our Sunrise Beach Bungalows with Pool are set among a paradise of tropical vegetation and mature palms and offer the finest of indoor-outdoor living.","Dive right from your bedroom into the infinity pool. Relax on overwater hammocks. At the water''s edge living and eating pavilion, soak up the sunset blues. Descend the steps into the warm clear lagoon, which is teeming with reef fish and corals.","The Four Seasons Kuda Huraa offers 13 distinct accommodation types, each with breathtaking views of the ocean.","Four Seasons Kuda Huraa is located on the North Malé Atoll, in the peaceful turquoise seas of the Indian Ocean, a 25-minute speedboat trip from Velana International Airport."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1500, '-8e3_fdwxmk', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'four-seasons-resort-maldives-at-kuda-huraa'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'four-seasons-resort-maldives-at-kuda-huraa'
  and l.node_type = 'location' and l.slug = 'kuda-huraa'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'four-seasons-resort-maldives-at-kuda-huraa'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Bangalow With Pool', 1500, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'four-seasons-resort-maldives-at-kuda-huraa'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Water Villa With Pool', 2200, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'four-seasons-resort-maldives-at-kuda-huraa'
on conflict (accommodation_id, name) do nothing;

-- Four-Seasons-Voavah
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'four-seasons-maldives-private-island-at-voavah-resort-maldives', 'Four Seasons Maldives Private Island at Voavah Resort Maldives', 'What would you do if you had a whole island to yourself? The answer is "anything" at the five-acre UNESCO refuge of Four Seasons Maldives Private Island in Voavah. Remove your barriers, broaden your horizons, retreat, explore, connect, or rejoice. Voavah offers you - and up to 21 guests - to dream with your eyes open, with your own 19-metre (62-foot) boat, dive centre, spa, Beach House, seven bedrooms, and resident pod of dolphins. Only one island. One reservation. This is one incredible hideout.', 'published', 'Four Seasons Maldives Private Island at Voavah Resort Maldives | Maldives Resorts | MTG', 'What would you do if you had a whole island to yourself? The answer is "anything" at the five-acre UNESCO refuge of Four Seasons Maldives Private Island in Voavah. Remove your barriers, broaden your horizons, retreat, explore, connect, or rejoice. Voavah offers you - and up to 21 guests - to dream with your eyes open, with your own 19-metre (62-foot) boat, dive centre, spa, Beach House, seven bedrooms, and resident pod of dolphins. Only one island. One reservation. This is one incredible hideout.', '{"overview_paragraphs":["What would you do if you had a whole island to yourself? The answer is \"anything\" at the five-acre UNESCO refuge of Four Seasons Maldives Private Island in Voavah. Remove your barriers, broaden your horizons, retreat, explore, connect, or rejoice. Voavah offers you - and up to 21 guests - to dream with your eyes open, with your own 19-metre (62-foot) boat, dive centre, spa, Beach House, seven bedrooms, and resident pod of dolphins. Only one island. One reservation. This is one incredible hideout.","Days at Voavah centre on the double-story Beach House and its nearby powder-white sands, pristine lagoon, and active coral, all of which are exceptional even by Maldives standards. Relax in the open-air lounge''s shade. Dive the clear seas. A moonlight dinner or pool party is a classy way to celebrate. Exercise in the gym. Relax at the Library. Allow the children to assist the cooks as you view the great blueness of your Biosphere territory.","Voavah''s isolated mid-ocean position, along with the option to travel by private jet to Velana or Maafaru International Airports and then continue by private seaplane, allows for anonymous access for anybody seeking to fly in and out without being detected. On-site privacy is maintained by 24-hour security and patrols, CCTV, and night-vision cameras.","What is it today? A floating breakfast in your pool, a tantalising tandoor lunch, and a BBQ on a sandbank? Or how about a morning picnic on the beach, hand-caught sashimi aboard your yacht, and a torchlit Bedouin beach banquet? Cocktails in the kitchen and a star-studded pool party? Wok masterpieces, wood-fired pizzas, or fine-dining bites? Alternatively, don''t think at all and let us surprise you.","After a day of resting on Voavah''s beautiful coastlines, indulge yourself to a tailored treatment in the serene settings of the Ocean of Consciousness - the island''s exclusive Spa. Through breath preparation, a salt-and-crystal scrub, a bath soak, an awakening massage, and a deeply immersive sound bath, our hallmark treatment utilises the limitless power of sound to link you to the layers of awakened wisdom both inside and around you.","There are no neighbours, no paparazzi, and no restrictions on what you may do at Voavah. Keep the music going all night and celebrate an important anniversary with a big-name artist. Make your own mini-Woodstock or Coachella on the beach, plan an unforgettable island-wide proposal trail, or transform the island into a wedding fantasia."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 540, 'CqbUr7mdR6w', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'four-seasons-maldives-private-island-at-voavah-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'four-seasons-maldives-private-island-at-voavah-resort-maldives'
  and l.node_type = 'location' and l.slug = 'voavah'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'four-seasons-maldives-private-island-at-voavah-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 540, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'four-seasons-maldives-private-island-at-voavah-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Pool Villa', 739, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'four-seasons-maldives-private-island-at-voavah-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 775, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'four-seasons-maldives-private-island-at-voavah-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Fun-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'fun-island-resort-spa-maldives', 'Fun Island Resort & Spa Maldives', 'This well-known resort may be described as exotic, desolate, and unspoilt. Fun Island is a fantastic combination of ''Fun in the Sun.'' The island''s biggest draw, however, is Fun Island''s massive lagoon, which provides ideal conditions for a variety of water sports, while the powder white beaches provide endless opportunities to enjoy the sun and sea in picturesque settings.', 'published', 'Fun Island Resort & Spa Maldives | Maldives Resorts | MTG', 'This well-known resort may be described as exotic, desolate, and unspoilt. Fun Island is a fantastic combination of ''Fun in the Sun.'' The island''s biggest draw, however, is Fun Island''s massive lagoon, which provides ideal conditions for a variety of water sports, while the powder white beaches provide endless opportunities to enjoy the sun and sea in picturesque settings.', '{"overview_paragraphs":["This well-known resort may be described as exotic, desolate, and unspoilt. Fun Island is a fantastic combination of ''Fun in the Sun.'' The island''s biggest draw, however, is Fun Island''s massive lagoon, which provides ideal conditions for a variety of water sports, while the powder white beaches provide endless opportunities to enjoy the sun and sea in picturesque settings.","Our Maldivian Beach Villas provide that laid-back island vibe. You can see your lush garden and the beach beyond without getting out of bed, and the blue sea is immediately behind you. The subtle changes in forms and tones of blue and green, as well as the apricot tone of the setting sun, provide lightness and freshness to this lovely 205-square-meter garden cottage. A large bathroom with tub and shower at the back contains an open-air space where you may stare at the stars while having a shower.","Fun Island Resort has 75 rooms and offers cheap accommodations with big decor and excellent views of the ocean or atolls. They also have plenty of seats and private toilets with hot showers and amenities.","Fun Island Resort is located on the south coast of Male'' Atoll, 37 kilometres from Velana International Airport. It takes around 45 minutes by speed boat to get to the resort and be met by the wonderful resort crew. It''s also worth noting that the island is just 700 m long and 168 m broad, so the amenities are easily accessible."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 300, '9Q9Kcl2V2CI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'fun-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'fun-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'bodufinolhu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'fun-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 300, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'fun-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Furaveri
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'furaveri-maldives-island-resort', 'Furaveri Maldives Island Resort', 'We tuned in to the basic beauty of the surroundings, staying loyal to key ideals such as making the best of what we had. Furaveri Maldives is a five-star premium resort where the open ocean meets the lagoon and the warm sunset yellow of wonderful evenings by the beach lulls you to sleep in a tree-fortified hideaway. An island abounding in life, as seen by the white herons that can be found across the island, the vivid screwpine trees, the numerous turtles in our reef, and the gentle mantas that visit us on occasion.', 'published', 'Furaveri Maldives Island Resort | Maldives Resorts | MTG', 'We tuned in to the basic beauty of the surroundings, staying loyal to key ideals such as making the best of what we had. Furaveri Maldives is a five-star premium resort where the open ocean meets the lagoon and the warm sunset yellow of wonderful evenings by the beach lulls you to sleep in a tree-fortified hideaway. An island abounding in life, as seen by the white herons that can be found across the island, the vivid screwpine trees, the numerous turtles in our reef, and the gentle mantas that visit us on occasion.', '{"overview_paragraphs":["We tuned in to the basic beauty of the surroundings, staying loyal to key ideals such as making the best of what we had. Furaveri Maldives is a five-star premium resort where the open ocean meets the lagoon and the warm sunset yellow of wonderful evenings by the beach lulls you to sleep in a tree-fortified hideaway. An island abounding in life, as seen by the white herons that can be found across the island, the vivid screwpine trees, the numerous turtles in our reef, and the gentle mantas that visit us on occasion.","Our Beach Villas, perched along Furaveri''s secluded beachfront, appear to move more leisurely, the perfect fantasy of carefree island living. As you relax in the maximum luxury of your strange, hidden sanctuary, take in clear views of the hypnotic blues beyond. Barefoot luxury in its purest form.","Enjoy maximum seaside enjoyment at our magnificent Beach Pool Villas, which combine all of the wonders that the Maldives is famous for. These villas, located in front of Furaveri''s pure unspoilt beach, are the ideal choice for anyone looking to relax and soak in the island enchantment. What you have here is pure and simple bliss.","The view from our sleek and modern Water Villas is never the same twice, surrounded by ever-changing blue colours. Relax in an artistically crafted area, and when the ocean beckons, stroll down a few steps and slide into the lagoon directly from your sundeck. A delightful getaway in a wonderfully gorgeous environment.","We offer a variety of cosy options for your stay at Furaveri Maldives, from entry level Garden Villas to luxurious Ocean Pool Villas and Residences, all of which have been specifically designed to meet guests'' individual preferences and are set among lush vegetation and over water, on a sandy white beach, or settled above a sparkling turquoise lagoon.","Furaveri Maldives is a tropical 23-hectare coral island that is around 750m long and 400m broad. It is located in the unique Raa Atoll, some 151km north of the capital city, Malé. Furaveri is only a lovely 45-minute seaplane journey from the international airport. Domestic flights from adjacent Dharavandhoo and Ifuru airports take 20 minutes, followed by a 45-minute speed boat trip to Furaveri Maldives."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 450, 'qucF2L2aKvY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'furaveri-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'furaveri-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'furaveri'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'furaveri-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 450, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'furaveri-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 600, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'furaveri-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 500, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'furaveri-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Fushifaru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'fushifaru-maldives-island-resort', 'Fushifaru Maldives Island Resort', 'Fushifaru Maldives is your private paradise island. The resort is blissfully marooned in the midst of the Indian Ocean, surrounded by powder white sand beaches and brilliant turquoise waters, and provides exquisite amenities and complete seclusion.', 'published', 'Fushifaru Maldives Island Resort | Maldives Resorts | MTG', 'Fushifaru Maldives is your private paradise island. The resort is blissfully marooned in the midst of the Indian Ocean, surrounded by powder white sand beaches and brilliant turquoise waters, and provides exquisite amenities and complete seclusion.', '{"overview_paragraphs":["Fushifaru Maldives is your private paradise island. The resort is blissfully marooned in the midst of the Indian Ocean, surrounded by powder white sand beaches and brilliant turquoise waters, and provides exquisite amenities and complete seclusion.","These villas are positioned on the island''s eastern side, facing the sunrise, and have a view of the \"Maakandu,\" the huge Indian Ocean.","Facing the blue lagoon, the Pool Beach Villas look out towards ''Maakandu'' - the wild open Indian Ocean. Sip cocktails from your private deck or enjoy.","The thatch-roof water villas are perched on top of timber stilts and include a romantic outdoor Jacuzzi with views of the pristine lagoon. Take a swim in.","Fushifaru Maldives has 49 Beach and Water Villas that will highlight your experience of nature while enveloping you in its comfortable interiors. These sanctuaries are built on land and on water, with views of the \"Maakandu,\" the wild open sea, the \"Etherevari,\" the peaceful lagoon, and the \"Kandu-olhi,\" the active channel.","Fushifaru Maldives is an amazing tiny island located on the far north east boundary of Lhaviyani Atoll, wedged between a national Marine Protected Area and three of the Maldives'' most renowned diving spots. Velana International Airport is approximately a 35-minute spectacular seaplane trip away."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 550, 'Lr0Y0xhbVsY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'fushifaru-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'fushifaru-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'fushifaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'fushifaru-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 550, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'fushifaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 900, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'fushifaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Jacuzzi Water Villa', 900, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'fushifaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Gangehi-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'gangehi-island-resort-maldives', 'Gangehi Island Resort Maldives', 'Discover a beautiful and serene island with rich flora and white sandy beaches, a spectacular and one-of-a-kind location on the planet. The island is a jewel of white sand and coconut trees surrounded by a crystal clear water, protected by its coral reef. Enjoy our gorgeous Overwater Villas, dine at our two restaurants, or unwind in the Ginger Spa. Gangehi Island Resort is the ideal destination for a fantasy Maldives vacation.', 'published', 'Gangehi Island Resort Maldives | Maldives Resorts | MTG', 'Discover a beautiful and serene island with rich flora and white sandy beaches, a spectacular and one-of-a-kind location on the planet. The island is a jewel of white sand and coconut trees surrounded by a crystal clear water, protected by its coral reef. Enjoy our gorgeous Overwater Villas, dine at our two restaurants, or unwind in the Ginger Spa. Gangehi Island Resort is the ideal destination for a fantasy Maldives vacation.', '{"overview_paragraphs":["Discover a beautiful and serene island with rich flora and white sandy beaches, a spectacular and one-of-a-kind location on the planet. The island is a jewel of white sand and coconut trees surrounded by a crystal clear water, protected by its coral reef. Enjoy our gorgeous Overwater Villas, dine at our two restaurants, or unwind in the Ginger Spa. Gangehi Island Resort is the ideal destination for a fantasy Maldives vacation.","Our cosy and useful Club Rooms are designed with teak wood and provide a tranquil view of the garden. Every room has its own private balcony where you may unwind.","Our Overwater Villas in the Maldives give you the impression of waking up every day on the sea. All of the apartments are warmly decorated with teak wood and provide a fantastic view of the sunset and the magnificent lagoon. They consist of one spacious room and a stone bathroom."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 220, 'm3ixdDDUZU4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'gangehi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'gangehi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'gangehi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'gangehi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Club Room', 220, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'gangehi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 500, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'gangehi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Grand-Park-Kodhipparu
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'grand-park-kodhipparu-maldives-island-resort', 'Grand Park Kodhipparu Maldives Island Resort', 'Welcome to Grand Park Kodhipparu, Maldives, the first luxury resort of Park Hotel Group and your unique address in the stunning Maldives. We invite you to explore your paradise on an island with a variety of gorgeous villas, pristine beaches, and stunning scenery, nestled in North Male Atoll, a simple 20-minute speedboat trip from Velana International Airport, Malé, Maldives. The resort, designed by Hirsch Bedner Associates, has elegant architecture and a modern façade with Maldives'' traditional influence of wood and rattan, innovative rustic charm, and an appealing serene ambiance.', 'published', 'Grand Park Kodhipparu Maldives Island Resort | Maldives Resorts | MTG', 'Welcome to Grand Park Kodhipparu, Maldives, the first luxury resort of Park Hotel Group and your unique address in the stunning Maldives. We invite you to explore your paradise on an island with a variety of gorgeous villas, pristine beaches, and stunning scenery, nestled in North Male Atoll, a simple 20-minute speedboat trip from Velana International Airport, Malé, Maldives. The resort, designed by Hirsch Bedner Associates, has elegant architecture and a modern façade with Maldives'' traditional influence of wood and rattan, innovative rustic charm, and an appealing serene ambiance.', '{"overview_paragraphs":["Welcome to Grand Park Kodhipparu, Maldives, the first luxury resort of Park Hotel Group and your unique address in the stunning Maldives. We invite you to explore your paradise on an island with a variety of gorgeous villas, pristine beaches, and stunning scenery, nestled in North Male Atoll, a simple 20-minute speedboat trip from Velana International Airport, Malé, Maldives. The resort, designed by Hirsch Bedner Associates, has elegant architecture and a modern façade with Maldives'' traditional influence of wood and rattan, innovative rustic charm, and an appealing serene ambiance.","With its assortment of beach and water villas, award-winning dining venues, recreational areas, and an award-winning overwater spa, the exquisite one-island-one-resort location invites you into an oasis of peace. Grand Park Kodhipparu, Maldives, is ideal for any traveller, whether a couple or honeymooners, since it is surrounded by thrilling underwater adventures of renowned snorkelling and diving locations surrounding the island. Families may also enjoy their stay on the island because the island has family-friendly facilities that provide a variety of children''s activities.","The beach home in Maldives is surrounded by lush foliage and has a private plunge pool overlooking the horizon. Listen to the waves crashing on the coast or take a walk on the beach to feel the white powdery sand beneath your feet; the beach is only a few steps away from your terrace.","Wake up to a gorgeous bright day in one of the greatest water villas in Maldives by Grand Park Kodhipparu, Maldives, which offers unrivalled views of the serene blue ocean and sky. The property also has a large bathroom, indoor and outdoor showers, and direct access to the seaside through an attractive stairway.","Our exquisite one-island-one-resort location features 120 Maldives villas with stunning vistas and opulent in-room amenities. All of our beach, ocean, and lagoon villas have stunning tropical views and private pools, and are designed with a contemporary façade with Maldives'' traditional influence. Relax with the calming sounds of the waves while sitting on your balcony or resting in the plunge pool, feet from the beach - ready for you to discover the colourful marine life.","If you like the sand and sea, the beach pool villas are surrounded by lush flora and are only steps from from the beach while staying near to the resort''s amenities. Our Grand Residences provide a perfect holiday home-away-from-home with two bedrooms, a living room, an infinity pool with spectacular ocean views, and an outside private dining space."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 780, 'fcqLbMY_V18', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'grand-park-kodhipparu-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'grand-park-kodhipparu-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'kodhipparu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'grand-park-kodhipparu-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 880, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'grand-park-kodhipparu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Water Villa', 780, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'grand-park-kodhipparu-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Hard-Rock-Hotel
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'hard-rock-hotel-maldives-island-resort', 'Hard Rock Hotel Maldives Island Resort', 'Invite the entire team, plus a few extras, to our five-star beach resort in the Indian Ocean, Hard Rock Hotel Maldives. Music is our forte, and we''ve blended it into our underwater melodies at Pool Bar, Hard Rock Cafe Maldives memorabilia, and Crosley turntable luxury. Load your belongings onto the speedboat, set sail for Emboodhoo Lagoon, and meet us at the Arrival Pavilion 20 minutes later for our Sundown Ritual. We''ll see you later.', 'published', 'Hard Rock Hotel Maldives Island Resort | Maldives Resorts | MTG', 'Invite the entire team, plus a few extras, to our five-star beach resort in the Indian Ocean, Hard Rock Hotel Maldives. Music is our forte, and we''ve blended it into our underwater melodies at Pool Bar, Hard Rock Cafe Maldives memorabilia, and Crosley turntable luxury. Load your belongings onto the speedboat, set sail for Emboodhoo Lagoon, and meet us at the Arrival Pavilion 20 minutes later for our Sundown Ritual. We''ll see you later.', '{"overview_paragraphs":["Invite the entire team, plus a few extras, to our five-star beach resort in the Indian Ocean, Hard Rock Hotel Maldives. Music is our forte, and we''ve blended it into our underwater melodies at Pool Bar, Hard Rock Cafe Maldives memorabilia, and Crosley turntable luxury. Load your belongings onto the speedboat, set sail for Emboodhoo Lagoon, and meet us at the Arrival Pavilion 20 minutes later for our Sundown Ritual. We''ll see you later.","The Silver Beach Studio at Hard Rock Hotel Maldives features a private terrace with direct beach access, 1 king bed or 2 double beds, sun loungers, ocean views, indoor and outdoor bathrooms, and distinctive amenities ideal for your island holiday.","Our Platinum Overwater Villa with 1 king bed or 2 twin beds has a million reasons to adore it. Relax on sun loungers on your private patio and take in the vista. Enjoy immediate access to the azure blue lagoon and outdoor life on the lounge net above the water.","Stay at Hard Rock and you''ll discover more than simply a place to unwind and relax. They have entirely altered the ordinary visitor experience into something spectacular, with breathtaking vistas and renowned facilities to elevate holidays to new heights. Their 178 guest rooms, Suites, Villas, and Overwater Villas are inspired by local culture and include tropical architecture combined with modern style. They offer a hotel or suite to accommodate anyone''s requirements and wishes, whether they are travelling with family, that particular someone, or friends.","Hard Rock Hotel Maldives is located in North Male'' Atoll within Emboodhoo Lagoon, the Maldives'' first integrated resort destination, and is only a breathtaking 15-minute boat ride from Velana International Airport.","Our resort dining is a cut above the rest, always amplified and never toned down. Visit our swim-up Pool Bar for specialty beers, cocktails, and other mood-setting beverages. Stop by Hard Rock Cafe ® Maldives for burgers as tall as our vinyl collection. Kick up your heels or tap your toes to the pulse of Balearic music at The Beach Club, the renowned club located at the opposite end of our 500-metre footbridge. Emboodhoo Lagoon is home to award-winning eateries."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 600, 'aglVRgHZars', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'hard-rock-hotel-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'hard-rock-hotel-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'akasdhoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'hard-rock-hotel-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Silver Beach Studio', 600, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'hard-rock-hotel-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Pletinum Water Villa', 820, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'hard-rock-hotel-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Heritance-Aarah
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'heritance-aarah-maldives-island-resort', 'Heritance Aarah Maldives Island Resort', 'Return to Heritance Aarah… Wake up to the sound of the sea in paradise, dive among unique underwater wonders, and dine beneath a beautiful star-studded sky over one of the greatest Maldives luxury resorts.', 'published', 'Heritance Aarah Maldives Island Resort | Maldives Resorts | MTG', 'Return to Heritance Aarah… Wake up to the sound of the sea in paradise, dive among unique underwater wonders, and dine beneath a beautiful star-studded sky over one of the greatest Maldives luxury resorts.', '{"overview_paragraphs":["Return to Heritance Aarah… Wake up to the sound of the sea in paradise, dive among unique underwater wonders, and dine beneath a beautiful star-studded sky over one of the greatest Maldives luxury resorts.","With golden sands at your doorstep and the pull of the sea all around, the options for relaxation and pleasure at our Beach Villa in Maldives seem limitless. Each house is elegantly constructed and has immediate beach access as well as a wide open-air terrace where you can soak in the lovely coastal environment.","Our trademark accommodation, the beautiful Pool Beach Villa, includes a private pool with sun loungers. This Maldives pool property has immediate beach access, ideal for a refreshing plunge in the Indian Ocean''s stunning seas.","Our Ocean Villas, which lie over a beautiful lagoon and overlook a limitless horizon, are the ideal getaway for romantic times. These exquisite Maldives overwater villas provide a separate outdoor space where you may snuggle up on a daybed together or step down to the seas below.","For solitude, Heritance Aarah has 150 villas and suites divided by tropical flora. Every property has immediate access to the pure sandy beach and the stunning blue lagoon beyond. The Resort was planned and developed with a combination of indigenous Maldivian and modern architecture, providing an overall contemporary luxury feel with a Maldivian touch - delivering solitude and comfort for a well-deserved vacation experience.","The resort is located in Raa Atoll, in a picturesque lagoon surrounded by an unending stretch of white sandy beach, and provides visitors with a premium 5-star Maldivian resort experience. A 40-minute seaplane flight from Velana International Airport provides stunning views of the Indian Ocean."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 900, 'kEchVUUdLCg', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'heritance-aarah-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'heritance-aarah-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'aarah'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'heritance-aarah-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 900, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'heritance-aarah-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'heritance-aarah-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Villa', 950, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'heritance-aarah-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Hideaway-Beach
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'hideaway-beach-resort-spa-maldives-island', 'Hideaway Beach Resort & Spa Maldives Island', 'Enjoy the ultimate Maldives beach holiday experience at Hideaway Beach Resort & Spa with our White Platinum All Inclusive Plan. We think that the finest vacations happen naturally, so we''ve included everything you could want in your White Platinum Plan, from excellent meals to fantastic adventures.', 'published', 'Hideaway Beach Resort & Spa Maldives Island | Maldives Resorts | MTG', 'Enjoy the ultimate Maldives beach holiday experience at Hideaway Beach Resort & Spa with our White Platinum All Inclusive Plan. We think that the finest vacations happen naturally, so we''ve included everything you could want in your White Platinum Plan, from excellent meals to fantastic adventures.', '{"overview_paragraphs":["Enjoy the ultimate Maldives beach holiday experience at Hideaway Beach Resort & Spa with our White Platinum All Inclusive Plan. We think that the finest vacations happen naturally, so we''ve included everything you could want in your White Platinum Plan, from excellent meals to fantastic adventures.","The Sunset Beach Villa is a cosy home away from home in a tropical paradise - an excellent setting for a relaxing Maldives beach vacation. This beachside home epitomises understated elegance, located on your very own private beach only moments away from the welcoming blue of the Indian Ocean. In addition to the main bedroom, the villa offers a separate living space. The Sunset Beach Villa includes its own Personal Butler to assist you in tailoring your stay and attending to your requirements.","The Beach Residence with Plunge Pool at Hideaway Beach Resort and Spa in the Maldives is your very own hidden beach home - a luxury villa, the ideal spot to unwind and appreciate paradise''s luxurious surrounds. The villa itself has a living and dining space, a master bedroom, and a spacious bathroom with a jacuzzi bath tub. This villa may be configured to suit families or groups of people. A master bedroom that can be locked affords total seclusion. Its own white sand beach is readily accessible from both the bright and large bedroom and living area. The Beach Residence with Plunge Pool includes its own Personal Butler to assist you in tailoring your stay and attending to your requirements.","The Deluxe Water Villa with Pool at Hideaway Beach Resort and Spa in the Maldives is the pinnacle of Maldivian luxury villa vacations. Allow yourself to be surrounded by the beauty and immensity of the ocean. Built on wooden stilts above the glistening blue lagoon, with floor-to-ceiling windows that maximise the spectacular panoramic Maldivian views. The Deluxe Water Villa with Pool is divided into two portions by an entry space, with the main bedroom on one side and the bathroom on the other. The enormous outside terrace runs the entire length of the property. Couples will appreciate this aquatic hideaway''s subtle modern comfort.","The 103 apartments are located on the beach among coconut trees and lush flora, or on stilts over the lovely lagoon, and provide world-class services as well as incomparable solitude. Each villa at Hideaway Beach Resort Maldives has its own butler to take care of all requirements. Our 10 various villa models, ranging from 130 sqm to 1,420 sqm, are among the largest luxury villas in the Maldives, and all beachfront villas have their own private beach.","Hideaway Beach Resort & Spa is located on the crescent-shaped Dhonakulhi Island in the Maldives'' northwestern Haa Alifu Atoll. Malé is 290 kilometres away."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 700, 'cckWsTSD3l4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'hideaway-beach-resort-spa-maldives-island'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'hideaway-beach-resort-spa-maldives-island'
  and l.node_type = 'location' and l.slug = 'dhonakulhi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'hideaway-beach-resort-spa-maldives-island'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Beach Villa', 700, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'hideaway-beach-resort-spa-maldives-island'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Residence With Pool', 880, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'hideaway-beach-resort-spa-maldives-island'
on conflict (accommodation_id, name) do nothing;
