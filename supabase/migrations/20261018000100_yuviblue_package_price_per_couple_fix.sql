-- Fixes a real pricing-label bug: 6 of Yuvi Blue Maldives' (Himmafushi)
-- real packages (20261001006700_yuviblue_himmafushi.sql, "Packages A"
-- plus the 2 custom day-by-day packages) stored the partner's own
-- "Agency Package Total" net rate — already the total for 2 guests
-- sharing a Deluxe Double/Twin room — but labeled it "per person" in
-- the title/summary/meta_description text. It should read "per couple".
-- (The 3 "Packages B" combo packages were already handled correctly:
-- that migration's own comment says they were deliberately divided by 2
-- to store a genuine per-person figure, with the per-couple source total
-- kept in the summary for transparency — those are untouched here.)
--
-- Root cause, fixed at the schema level: `packages` had no price_type
-- column at all, so realPackageToView() (src/lib/packages/view.ts)
-- hardcoded every real package's displayed price type to "per-person" --
-- meaning the UI itself, not just this migration's seed text, would
-- always have shown "per person" for these regardless of what the text
-- said. Adding the column and reading it in view.ts fixes both: the
-- data now says what it actually is, and the UI renders whatever this
-- column holds instead of assuming "per-person" for every real package.

alter table packages
  add column price_type text not null default 'per-person'
  check (price_type in ('per-person', 'per-couple', 'per-package'));

update packages set price_type = 'per-couple'
where id in (
  select n.id from nodes n
  where n.node_type = 'package'
  and n.slug in (
    'himmafushi-stingray-snorkeling-package',
    'himmafushi-sunset-fishing-package',
    'himmafushi-nurse-shark-point-package',
    'himmafushi-serenity-escape',
    '4-night-himmafushi-explorer-package',
    '5-night-himmafushi-adventure-package'
  )
);

update nodes set
  summary = 'Himmafushi Stingray Snorkeling Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a complimentary wellness yoga class, a beach honeymoon dinner, and Stingray Point snorkeling. From USD 667 per couple (2 guests sharing a Deluxe Double/Twin room).',
  meta_description = 'Himmafushi Stingray Snorkeling Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and Stingray Point snorkeling. From USD 667 per couple.'
where node_type = 'package' and slug = 'himmafushi-stingray-snorkeling-package';

update nodes set
  summary = 'Himmafushi Sunset Fishing Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a complimentary wellness yoga class, a beach honeymoon dinner, and sunset fishing. From USD 678.50 per couple (2 guests sharing a Deluxe Double/Twin room).',
  meta_description = 'Himmafushi Sunset Fishing Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and sunset fishing. From USD 678.50 per couple.'
where node_type = 'package' and slug = 'himmafushi-sunset-fishing-package';

update nodes set
  summary = 'Himmafushi Nurse Shark Point Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a beach honeymoon dinner, and a Nurse Shark Point excursion. From USD 690 per couple (2 guests sharing a Deluxe Double/Twin room).',
  meta_description = 'Himmafushi Nurse Shark Point Package is a 5-night stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and a Nurse Shark Point excursion. From USD 690 per couple.'
where node_type = 'package' and slug = 'himmafushi-nurse-shark-point-package';

update nodes set
  summary = 'Himmafushi Serenity Escape is a 3-night stay at Yuvi Blue Maldives, Himmafushi, including Bed & Breakfast accommodation, return speedboat transfer, a complimentary wellness yoga class, a beach honeymoon dinner, a sunset cruise, a 30-minute spa massage, and Turtle Point snorkeling. From USD 621 per couple (2 guests sharing a Deluxe Double/Twin room). Valid for stays from 15 October 2026 to 31 August 2027.',
  meta_description = 'Himmafushi Serenity Escape is a 3-night stay at Yuvi Blue Maldives, Himmafushi, with a sunset cruise, spa massage and Turtle Point snorkeling. From USD 621 per couple.'
where node_type = 'package' and slug = 'himmafushi-serenity-escape';

update nodes set
  summary = '4-Night Himmafushi Explorer Package is a 4-night Bed & Breakfast stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and a different real excursion each day: Turtle Point snorkeling, a local fishing trip, stand up paddleboarding, and jet skiing. From USD 451.95 per couple (2 guests sharing a Deluxe Double/Twin room).',
  meta_description = '4-Night Himmafushi Explorer Package: Yuvi Blue Maldives, Himmafushi, with snorkeling, fishing, paddleboarding and jet skiing, one per day. From USD 451.95 per couple.'
where node_type = 'package' and slug = '4-night-himmafushi-explorer-package';

update nodes set
  summary = '5-Night Himmafushi Adventure Package is a 5-night Bed & Breakfast stay at Yuvi Blue Maldives, Himmafushi, with return speedboat transfer and a different real excursion each day: Coral Garden snorkeling, Sting Ray Point snorkeling, a surf lesson, parasailing, and a fun tube ride. From USD 609.50 per couple (2 guests sharing a Deluxe Double/Twin room).',
  meta_description = '5-Night Himmafushi Adventure Package: Yuvi Blue Maldives, Himmafushi, with snorkeling, surfing, parasailing and a fun tube ride, one per day. From USD 609.50 per couple.'
where node_type = 'package' and slug = '5-night-himmafushi-adventure-package';
