-- Undo for the photo alt text / title updates made 2026-10-25 (U02/U03),
-- values read from the live database just before the change.
begin;
update media_assets set alt_text = 'emperor fishing boat - Maldives fishing', title = null where id = '231eed3c-1bc0-71fb-4187-ca095c8d7630'; -- opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-boat.webp
update media_assets set alt_text = 'luxury dhaalu - Maldives fishing', title = null where id = '35f87a59-f0dc-f8d5-cf1f-dd2eeeee2203'; -- opt/uploads/assets/uploads/fishing/images/packages/luxury-dhaalu.webp
update media_assets set alt_text = 'maldives fishing boat emperor - Maldives fishing', title = null where id = '7e90fcd5-499f-8989-6783-c3ff27ee5bb1'; -- opt/uploads/assets/uploads/fishing/images/charters/maldives-fishing-boat-emperor.webp
update media_assets set alt_text = 'emperor fishing charter - Maldives fishing', title = null where id = '94bb6eed-690f-20c7-1169-f3c0b0a9466d'; -- opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp
update media_assets set alt_text = 'Half Day Trip Deep Jigging', title = null where id = 'a3212df8-100d-d0b6-5f03-22333dae40c6'; -- opt/legacy/images/fishing/half-day-trip-deep-jigging.webp
update media_assets set alt_text = 'emperor - Maldives fishing', title = null where id = 'e520e856-d8be-505a-1e39-bc1a61f726e0'; -- opt/uploads/assets/uploads/fishing/images/charters/emperor.webp
commit;
