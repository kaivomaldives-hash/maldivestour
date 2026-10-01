-- Admin Dashboard follow-up: image titles + a YouTube video field on the
-- content types that don't yet have one.
--
-- 1. accommodations already has video_youtube_id (added in
--    20250123000100_stays_ecosystem_schema.sql) and its admin form already
--    exposes it. Extending the exact same column + convention (a bare
--    YouTube video id, never a full URL) to the other four node-backed
--    content types so every admin content form can carry a video, not just
--    accommodations.
alter table activities add column video_youtube_id text;
alter table transfer_routes add column video_youtube_id text;
alter table packages add column video_youtube_id text;
alter table articles add column video_youtube_id text;

-- 2. A short display title per media asset — e.g. "Sunset over the
--    lagoon" — distinct from alt_text (screen-reader wording) and credit
--    (attribution). Nullable; existing rows simply have none.
alter table media_assets add column title text;
