-- Sitewide replace of the accented "Malé" place-name family with its
-- unaccented spelling, across every real content column that could hold
-- prose mentioning it — visitors search "male", not "malé", and the
-- accent was blocking those searches from matching (confirmed by the
-- site owner; overrides the usual SEO guidance to keep local spellings).
--
-- Deliberately NOT touched: user-submitted content (reviews, comments,
-- booking/customer records, partner submissions) — this only rewrites
-- copy the site itself authored, never something a visitor or partner
-- typed in.
--
-- "Malé" nests as a literal, always-lowercase substring inside
-- "Hulhumalé"/"Vilimalé"/"Villimalé"/"Sinamalé" (only the compound's own
-- first letter is ever capitalized), and "MALÉ" nests the same way
-- inside any all-caps heading — so three plain substring replacements of
-- "Malé" (Title case, lowercase, and all-caps) correctly fix every one of
-- those compounds too, with no separate rule needed per place. "Hulhulé"
-- is the one exception: it's "Hulhu" + "lé", not "Hulhu" + "malé", so it
-- gets its own three case variants. Safe as a plain substring (not a
-- whole-word) replace: "é" doesn't appear in English prose except inside
-- this place-name family, and the WHERE guards below only touch rows
-- that actually contain an accented "e" in the first place.
create or replace function _strip_male_accent(txt text) returns text as $$
  select replace(
           replace(
             replace(
               replace(
                 replace(
                   replace(txt, 'Malé', 'Male'),
                 'malé', 'male'),
               'MALÉ', 'MALE'),
             'Hulhulé', 'Hulhule'),
           'hulhulé', 'hulhule'),
         'HULHULÉ', 'HULHULE');
$$ language sql immutable;

-- nodes: every entity's own title/summary/meta fields, plus the free-form
-- attributes jsonb (text-level replace on its JSON representation is
-- safe here — the substitution never changes string length in a way that
-- could break JSON syntax, since it only swaps letters inside existing
-- string values).
update nodes set title = _strip_male_accent(title) where title ilike '%é%';
update nodes set summary = _strip_male_accent(summary) where summary ilike '%é%';
update nodes set meta_title = _strip_male_accent(meta_title) where meta_title ilike '%é%';
update nodes set meta_description = _strip_male_accent(meta_description) where meta_description ilike '%é%';
update nodes set attributes = _strip_male_accent(attributes::text)::jsonb where attributes::text ilike '%é%';

-- articles: body HTML.
update articles set body = _strip_male_accent(body) where body ilike '%é%';

-- translations: localized copy for every translatable entity, all locales.
update translations set title = _strip_male_accent(title) where title ilike '%é%';
update translations set short_description = _strip_male_accent(short_description) where short_description ilike '%é%';
update translations set description = _strip_male_accent(description) where description ilike '%é%';
update translations set meta_title = _strip_male_accent(meta_title) where meta_title ilike '%é%';
update translations set meta_description = _strip_male_accent(meta_description) where meta_description ilike '%é%';

-- page_translations: localized hand-curated hub/landing pages.
update page_translations set title = _strip_male_accent(title) where title ilike '%é%';
update page_translations set meta_title = _strip_male_accent(meta_title) where meta_title ilike '%é%';
update page_translations set meta_description = _strip_male_accent(meta_description) where meta_description ilike '%é%';
update page_translations set hero_heading = _strip_male_accent(hero_heading) where hero_heading ilike '%é%';
update page_translations set hero_intro = _strip_male_accent(hero_intro) where hero_intro ilike '%é%';
update page_translations set sections = _strip_male_accent(sections::text)::jsonb where sections::text ilike '%é%';

-- transfer_services: the commercial offering copy shown on route pages.
update transfer_services set description = _strip_male_accent(description) where description ilike '%é%';
update transfer_services set pickup_instructions = _strip_male_accent(pickup_instructions) where pickup_instructions ilike '%é%';
update transfer_services set dropoff_instructions = _strip_male_accent(dropoff_instructions) where dropoff_instructions ilike '%é%';
update transfer_services set booking_requirements = _strip_male_accent(booking_requirements) where booking_requirements ilike '%é%';
update transfer_services set cancellation_policy = _strip_male_accent(cancellation_policy) where cancellation_policy ilike '%é%';
update transfer_services set luggage_allowance = _strip_male_accent(luggage_allowance) where luggage_allowance ilike '%é%';

-- package_itinerary_stages / package_itinerary_items: day-by-day copy.
update package_itinerary_stages set title = _strip_male_accent(title) where title ilike '%é%';
update package_itinerary_stages set description = _strip_male_accent(description) where description ilike '%é%';
update package_itinerary_items set notes = _strip_male_accent(notes) where notes ilike '%é%';

-- media_assets: photo title/alt text/credit lines.
update media_assets set title = _strip_male_accent(title) where title ilike '%é%';
update media_assets set alt_text = _strip_male_accent(alt_text) where alt_text ilike '%é%';
update media_assets set credit = _strip_male_accent(credit) where credit ilike '%é%';

drop function _strip_male_accent(text);
