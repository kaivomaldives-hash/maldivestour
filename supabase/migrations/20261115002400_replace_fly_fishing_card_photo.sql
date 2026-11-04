-- Replaces the "maldives-fly-fishing" photo on the fly fishing charter
-- cards with the owner's own fly fishing photos (owner request
-- 2026-11-04). Applied live on 2026-11-04; backup in
-- docs/seo/fishing/backups/fly-photo-2026-11-04/. The image files were
-- uploaded to media/opt/uploads/assets/uploads/fishing/images/fly-fishing/
-- (full size plus .w480/.w640/.w768/.w960/.w1280 variants).

insert into media_assets (id, media_type, storage_path, alt_text, title, width, height) values
  ('e05c5fce-76ba-587a-b085-a8f019fc61ab', 'image', 'opt/uploads/assets/uploads/fishing/images/fly-fishing/giant-trevally-fly-fishing-maldives-surf.webp', 'Angler kneeling in the surf holding a giant trevally caught on a purple fly, island palms behind, Maldives fly fishing', 'Giant trevally on the fly', 1600, 1200),
  ('30789daf-8fc2-56ca-8cc1-017ad2b7c2a5', 'image', 'opt/uploads/assets/uploads/fishing/images/fly-fishing/bluefin-trevally-fly-fishing-maldives.webp', 'Bluefin trevally caught on a yellow fly, held up with a fly rod and reel on a sandy Maldives flat', 'Bluefin trevally on the fly', 1600, 1200),
  ('c6070241-d582-5362-975c-64f94ae09aa3', 'image', 'opt/uploads/assets/uploads/fishing/images/fly-fishing/golden-trevally-fly-fishing-maldives.webp', 'Angler standing waist-deep on a clear Maldives flat holding a golden trevally caught fly fishing', 'Golden trevally on the fly', 1600, 1200),
  ('a5470898-d2f1-5921-85a7-b07eed97af17', 'image', 'opt/uploads/assets/uploads/fishing/images/fly-fishing/bonefish-fly-fishing-maldives.webp', 'Angler crouching on a Maldives beach holding a bonefish caught fly fishing on the flats', 'Bonefish on the fly', 1600, 1200),
  ('5c9fe494-0f07-53d0-a912-1fc348f6201e', 'image', 'opt/uploads/assets/uploads/fishing/images/fly-fishing/giant-trevally-fly-fishing-maldives-flats.webp', 'Angler in a sun hood releasing a large giant trevally in clear turquoise water on a Maldives flat', 'Giant trevally released on the flats', 1600, 1200)
on conflict (id) do nothing;

-- Fly fishing charters: new hero photos, all five in the gallery.
update node_media set media_id = '5c9fe494-0f07-53d0-a912-1fc348f6201e'
where node_id = 'd1b8299c-69c9-463f-a503-5dc6c4ad0005' and media_id = 'df242384-66bf-6063-1664-5c69a9e14f73' and role = 'hero';
update node_media set media_id = '30789daf-8fc2-56ca-8cc1-017ad2b7c2a5'
where node_id = '4e4cde74-38ee-439c-9045-5dbf29c44483' and media_id = 'df242384-66bf-6063-1664-5c69a9e14f73' and role = 'hero';
insert into node_media (node_id, media_id, role, sort_order) values
  ('d1b8299c-69c9-463f-a503-5dc6c4ad0005', 'e05c5fce-76ba-587a-b085-a8f019fc61ab', 'gallery', 1),
  ('d1b8299c-69c9-463f-a503-5dc6c4ad0005', '30789daf-8fc2-56ca-8cc1-017ad2b7c2a5', 'gallery', 2),
  ('d1b8299c-69c9-463f-a503-5dc6c4ad0005', 'c6070241-d582-5362-975c-64f94ae09aa3', 'gallery', 3),
  ('d1b8299c-69c9-463f-a503-5dc6c4ad0005', 'a5470898-d2f1-5921-85a7-b07eed97af17', 'gallery', 4),
  ('d1b8299c-69c9-463f-a503-5dc6c4ad0005', '5c9fe494-0f07-53d0-a912-1fc348f6201e', 'gallery', 5),
  ('4e4cde74-38ee-439c-9045-5dbf29c44483', 'c6070241-d582-5362-975c-64f94ae09aa3', 'gallery', 1),
  ('4e4cde74-38ee-439c-9045-5dbf29c44483', 'e05c5fce-76ba-587a-b085-a8f019fc61ab', 'gallery', 2),
  ('4e4cde74-38ee-439c-9045-5dbf29c44483', 'a5470898-d2f1-5921-85a7-b07eed97af17', 'gallery', 3),
  ('4e4cde74-38ee-439c-9045-5dbf29c44483', '5c9fe494-0f07-53d0-a912-1fc348f6201e', 'gallery', 4),
  ('4e4cde74-38ee-439c-9045-5dbf29c44483', '30789daf-8fc2-56ca-8cc1-017ad2b7c2a5', 'gallery', 5)
on conflict (node_id, media_id, role) do nothing;
delete from node_media where media_id = 'df242384-66bf-6063-1664-5c69a9e14f73';
