-- Undo for the photo alt text / title updates made 2026-10-25 (U02/U03),
-- values read from the live database just before the change.
begin;
update media_assets set alt_text = 'emperor fishing boat - Maldives fishing', title = null where id = '231eed3c-1bc0-71fb-4187-ca095c8d7630'; -- opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-boat.webp
update media_assets set alt_text = 'luxury dhaalu - Maldives fishing', title = null where id = '35f87a59-f0dc-f8d5-cf1f-dd2eeeee2203'; -- opt/uploads/assets/uploads/fishing/images/packages/luxury-dhaalu.webp
update media_assets set alt_text = 'maldives fishing boat emperor - Maldives fishing', title = null where id = '7e90fcd5-499f-8989-6783-c3ff27ee5bb1'; -- opt/uploads/assets/uploads/fishing/images/charters/maldives-fishing-boat-emperor.webp
update media_assets set alt_text = 'emperor fishing charter - Maldives fishing', title = null where id = '94bb6eed-690f-20c7-1169-f3c0b0a9466d'; -- opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp
update media_assets set alt_text = 'Half Day Trip Deep Jigging', title = null where id = 'a3212df8-100d-d0b6-5f03-22333dae40c6'; -- opt/legacy/images/fishing/half-day-trip-deep-jigging.webp
update media_assets set alt_text = 'emperor - Maldives fishing', title = null where id = 'e520e856-d8be-505a-1e39-bc1a61f726e0'; -- opt/uploads/assets/uploads/fishing/images/charters/emperor.webp
update media_assets set alt_text = 'giant trevally - Maldives fishing', title = null where id = 'c1e3ca08-0e43-1f98-3061-c6d9951c6834'; -- opt/uploads/assets/uploads/fishing/images/gallery/giant-trevally.webp
update media_assets set alt_text = 'reef baa - Maldives fishing', title = null where id = 'ead2e1da-00ff-1554-b001-6bdc3d5885fe'; -- opt/uploads/assets/uploads/fishing/images/packages/reef-baa.webp
update media_assets set alt_text = 'Popping Fishing', title = null where id = '6df03edc-e48a-1f54-4ba0-9bd8f587046d';
update media_assets set alt_text = 'sports fishing maldives - Maldives fishing', title = null where id = '7fb94bc0-e308-f850-82cf-10a86c0ee91d';
update media_assets set alt_text = 'Maldives atoll aerial view - Maldives fishing', title = null where id = '8c2e8baf-376e-b0b6-a222-a8450b073a09';
update media_assets set alt_text = 'maldives fishing charters - Maldives fishing', title = null where id = 'd82258a7-f7ae-f6ea-c603-5c18159eff68';
update media_assets set alt_text = 'giant yellowfin tuna - Maldives fishing', title = null where id = '65ce543b-f8cb-5760-a0ed-e49aefe7280d';
update media_assets set alt_text = 'fishing tours maldives - Maldives fishing', title = null where id = '8dc28836-323e-85d9-d5ad-4d4ddd294c13';
update media_assets set alt_text = 'Yellowfin tuna fishing Maldives - Maldives fishing', title = null where id = 'a8ba6833-886f-504b-136f-7cb31111c497';
update media_assets set alt_text = 'wahoo in maldives - Maldives fishing', title = null where id = 'e5ffdf3e-f374-906a-92b3-61c4c7190d3c';
update media_assets set alt_text = 'fishing in maldives - Maldives fishing', title = null where id = 'f7b6b8e0-4d72-6329-b52b-62c5f8b24472';
commit;
