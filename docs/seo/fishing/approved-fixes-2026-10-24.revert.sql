-- Exact undo for docs/seo/fishing/approved-fixes-2026-10-24.sql (values
-- read from the live database on 2026-10-24, before any change).
begin;
update activities set price_from = 1500 where id = '23435db5-9605-46ed-a51e-335850b034c7';
update activities set price_from = 1000 where id = 'a001b2f2-45a8-44fd-a538-816f5f534b11';
update bookable_products set base_price = 1500 where id = '23435db5-9605-46ed-a51e-335850b034c7';
update bookable_products set base_price = 1000 where id = 'a001b2f2-45a8-44fd-a538-816f5f534b11';
update nodes set status = 'published' where id = 'c244ad69-035b-4c52-b698-5494b70f6579';
update nodes set meta_title = 'Sunset Fishing Trip | Maldives Fishing | MTG' where id = '9bae1c06-40f4-4081-bac1-2699cd37a752';
update nodes set meta_title = 'Sunset Fishing Trip | Maldives Fishing | MTG' where id = 'e6567447-5d7a-419d-96aa-97612b32109a';
update media_assets set alt_text = '100 Best things to Do in the Maldives: An Ultimate Guide', title = null where id = 'fe08057c-f29b-4da2-4955-b96beb91a921';
update media_assets set alt_text = 'Maldives in October: Weather, Activities & Expert Travel Guide', title = null where id = 'a0396492-c61d-9a26-f750-712a914f5b22';
update media_assets set alt_text = 'Maldives in December: Weather, Activities & Expert Travel Guide', title = null where id = '9a0dcad4-60ab-74d1-31cb-9ea1b325a38f';
update media_assets set alt_text = 'Maldives in August: Weather, Activities & Expert Travel Guide', title = null where id = '0270bec0-67a7-d923-e3cf-45e1009af53f';
commit;
