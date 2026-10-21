-- Removes dead transfer-route photo references confirmed broken by
-- directly checking Supabase Storage (not guessed) during a live
-- debugging session on 2026-10-21: every one of these 39 storage_paths
-- returns "Object not found" / NoSuchKey from the `media` bucket's public
-- URL, across 13 transfer routes (94 node_media/media_assets rows total)
-- -- including the JW Marriott, Ritz-Carlton Fari Islands, One&Only
-- Reethi Rah, Makunudu Island, OBLU Select Sangeli, OBLU XPERIENCE
-- Ailafushi, and CROSSROADS Maldives routes, plus six local-island routes
-- (Male/Maafushi/Hulhumale/Vihamanaafushi/Kunfunadhoo, both directions)
-- that all shared one now-broken "all-routes-gallery" image set. For each
-- of these 13 routes, EVERY attached image (hero and gallery) is broken
-- -- the route page currently shows nothing but broken-image icons.
--
-- These legacy `transfers/...` paths were never actually present in
-- Storage (confirmed via direct HTTP checks, not merely a stale
-- media_assets row pointing at something since deleted) -- a gap from
-- however this data was originally seeded/migrated, unrelated to and far
-- larger in scope than the Club Med Kani mislabeled-photo issue fixed
-- earlier (and since independently resolved by a fresh staff upload).
-- Supersedes the now-withdrawn 20261112000100_fix_borrowed_transfer_
-- route_photos.sql, which targeted shared/duplicate storage_path rows as
-- a proxy for "wrong photo" -- live data showed that theory caught only
-- one (already-broken) duplicate group and missed every one of these 39
-- genuinely-dead, non-duplicated paths, so a directly-verified list is
-- used here instead.
--
-- Scoped to transfer_route nodes only (confirmed via a live join that
-- every node_media row referencing these storage_paths belongs to a
-- transfer_route node, nothing else) -- deleting is safe precisely
-- because every row removed points at a file that does not exist; no
-- working image anywhere on the site is touched. The routes fall back to
-- their destination's own accommodation photo where one exists, or show
-- no image -- an honest gap that the site owner's upcoming bulk
-- real-photo upload (Admin -> Transfer routes -> "Bulk upload route
-- photos") will fill in for real.

with broken_paths (storage_path) as (
  values
  ('transfers/all-routes-gallery/1.webp'),
  ('transfers/all-routes-gallery/10.webp'),
  ('transfers/all-routes-gallery/11.webp'),
  ('transfers/all-routes-gallery/2.webp'),
  ('transfers/all-routes-gallery/3.webp'),
  ('transfers/all-routes-gallery/4.webp'),
  ('transfers/all-routes-gallery/5.webp'),
  ('transfers/all-routes-gallery/6.webp'),
  ('transfers/all-routes-gallery/7.webp'),
  ('transfers/all-routes-gallery/8.webp'),
  ('transfers/all-routes-gallery/9.webp'),
  ('transfers/crossroad-maldives/1.webp'),
  ('transfers/crossroad-maldives/2.webp'),
  ('transfers/crossroad-maldives/3.webp'),
  ('transfers/crossroad-maldives/4.webp'),
  ('transfers/jw-marriot-maldives/1.webp'),
  ('transfers/jw-marriot-maldives/2.webp'),
  ('transfers/jw-marriot-maldives/3.webp'),
  ('transfers/jw-marriot-maldives/4.webp'),
  ('transfers/makunudu-island/1.webp'),
  ('transfers/makunudu-island/2.webp'),
  ('transfers/makunudu-island/3.webp'),
  ('transfers/makunudu-island/4.webp'),
  ('transfers/oblu-XPERIENCE-Ailafushi/1.webp'),
  ('transfers/oblu-XPERIENCE-Ailafushi/2.webp'),
  ('transfers/oblu-XPERIENCE-Ailafushi/3.webp'),
  ('transfers/oblu-XPERIENCE-Ailafushi/4.webp'),
  ('transfers/oblu-select-sangeli/1.webp'),
  ('transfers/oblu-select-sangeli/2.webp'),
  ('transfers/oblu-select-sangeli/3.webp'),
  ('transfers/oblu-select-sangeli/4.webp'),
  ('transfers/one-and-only-reethi-rah/1.webp'),
  ('transfers/one-and-only-reethi-rah/2.webp'),
  ('transfers/one-and-only-reethi-rah/3.webp'),
  ('transfers/one-and-only-reethi-rah/4.webp'),
  ('transfers/ritz-carlton-maldives/1.webp'),
  ('transfers/ritz-carlton-maldives/2.webp'),
  ('transfers/ritz-carlton-maldives/3.webp'),
  ('transfers/ritz-carlton-maldives/4.webp')
),
broken_assets as (
  select ma.id
  from media_assets ma
  join broken_paths bp on bp.storage_path = ma.storage_path
)

delete from node_media nm
using broken_assets ba
where nm.media_id = ba.id;

delete from media_assets ma
using broken_assets ba
where ma.id = ba.id
  and not exists (select 1 from node_media nm where nm.media_id = ma.id);
