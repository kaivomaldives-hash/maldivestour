-- Owner-approved fishing fixes (decisions given 2026-10-24, see
-- docs/seo/fishing/01-existing-site-audit.md §13). NOT YET APPLIED -- the
-- session's permission settings blocked direct database writes. Run this
-- in the Supabase SQL editor (or allow the write and ask Claude to apply
-- it). Undo: docs/seo/fishing/approved-fixes-2026-10-24.revert.sql.
--
-- Values below were read from the live database on 2026-10-24.

begin;

-- 1. Charter prices: the owner confirmed USD 1,380 (full day) / 980 (half
--    day), matching the rate sheet (data/maldives/fishing/mfh-charters.json),
--    the hub/Emperor FAQs and the pages' own meta descriptions. The DB had
--    1,500 / 1,000, which the charter pages, cards and Offer JSON-LD show.
update activities set price_from = 1380 where id = '23435db5-9605-46ed-a51e-335850b034c7'; -- private-full-day-fishing-charter (was 1500)
update activities set price_from = 980  where id = 'a001b2f2-45a8-44fd-a538-816f5f534b11'; -- private-half-day-fishing-charter (was 1000)

-- 2. Unpublish Golden Reel Adventure (no operator, price, duration or
--    location). Draft, not deleted: reversible. Its English and translated
--    pages will 404 and drop out of the sitemap and listings.
update nodes set status = 'draft' where id = 'c244ad69-035b-4c52-b698-5494b70f6579'; -- golden-reel-adventure (was published)

-- 3. Distinct <title>s for the two trips both titled "Sunset Fishing Trip"
--    (the visible H1 is unchanged; only the meta title).
update nodes set meta_title = 'Sunset Handline Fishing Trip, Maafushi | Maldives Fishing | MTG'
  where id = '9bae1c06-40f4-4081-bac1-2699cd37a752'; -- sunset-fishing-trip (Active Watersports Maafushi)
update nodes set meta_title = 'Kaani Hotels Sunset Fishing Trip | Maldives Fishing | MTG'
  where id = 'e6567447-5d7a-419d-96aa-97612b32109a'; -- sunset-fishing-trip-maafushi (Kaani Hotels)

-- 4. Alt text + title that describe what each photo actually shows (each
--    image was viewed). Previously the alt text was an unrelated article
--    title and the title was empty. These assets also appear on travel
--    guide articles; the new text describes the photo, so it fits there too.
update media_assets set
  alt_text = 'Anglers on a fishing boat with trolling rods set, heading out across a Maldives lagoon',
  title = 'Fishing boat heading offshore in the Maldives'
  where id = 'fe08057c-f29b-4da2-4955-b96beb91a921'; -- opt/legacy/images/fishing/big-game-fishing-maldives.webp
update media_assets set
  alt_text = 'Angler holding a large giant trevally (GT) on a boat in the Maldives',
  title = 'Giant trevally catch in the Maldives'
  where id = 'a0396492-c61d-9a26-f750-712a914f5b22'; -- opt/legacy/images/fishing/maldives-fishing-trip.webp
update media_assets set
  alt_text = 'Sport-fishing boat with outrigger rods anchored at sunset in the Maldives',
  title = 'Fishing boat at sunset in the Maldives'
  where id = '9a0dcad4-60ab-74d1-31cb-9ea1b325a38f'; -- opt/legacy/images/fishing/maldives-night-fishing.webp
update media_assets set
  alt_text = 'Angler at night holding a yellow-edged lyretail grouper caught on a jig in the Maldives',
  title = 'Night fishing catch: yellow-edged lyretail grouper'
  where id = '0270bec0-67a7-d923-e3cf-45e1009af53f'; -- opt/legacy/images/fishing/night-fishing-in-maldives.webp

commit;
