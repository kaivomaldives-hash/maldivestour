-- Repoints image assets whose file never existed under the stored path:
-- transfer-route gallery rows referenced numbered files
-- (transfers/<folder>/1.webp ...) while the real photos in each folder
-- were uploaded under descriptive names -- each folder holds exactly as
-- many real photos as numbered references, mapped one-to-one (the
-- route-specific "Male-airport-to-..." shot first). The Tsunami Monument
-- hero now points at the owner's own photo of it, uploaded from
-- assets/uploads/articles/. Applied before
-- scripts/optimize-media-variants.mjs re-ran over these rows (see
-- 20261115001500_optimized_media_paths.sql for the opt/ repoint that
-- follows). Already applied directly against the live DB.
update media_assets set storage_path = 'transfers/jw-marriot-maldives/jw-marriot-island-speedboat.webp' where id = '006cf8b3-7f41-474b-9e71-4c1da1add896';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-transfers.webp' where id = '01c07c1c-2c38-4e76-9758-569bdd38c44b';
update media_assets set storage_path = 'transfers/all-routes-gallery/private-speedboat-charter-maldives.webp' where id = '01f9fd46-5bc4-4732-a158-234520d14fe4';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-budget-transfers.webp' where id = '02ff544d-84f2-4699-be5c-8718eaae9b15';
update media_assets set storage_path = 'transfers/makunudu-island/makunudu-maldives-transfer.webp' where id = '057c8dd3-3f63-4065-b5c0-a96a8864e0da';
update media_assets set storage_path = 'transfers/oblu-XPERIENCE-Ailafushi/oblu-xperience-ailafushi-maldives-transfer.webp' where id = '06720ff2-67ad-455c-8c44-69a5bfe08ed3';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-to-hotels.webp' where id = '087cf2b4-1700-436c-9a4e-89d03ff41b69';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-hotel-speedboat-transfers.webp' where id = '08db6732-79cf-4134-8531-58ea624c8e50';
update media_assets set storage_path = 'transfers/one-and-only-reethi-rah/Male-airport-to-one-and-only-reethi-rah-maldives.webp' where id = '09162220-cb76-4e79-9439-beff0672c87a';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-transfers-in-maldives.webp' where id = '0b5d7139-653c-4434-a9a1-9d7c3a2c78b1';
update media_assets set storage_path = 'transfers/ritz-carlton-maldives/the-ritz-carlton-island-maldives-speedboat.webp' where id = '0c337d90-03cc-4fdc-b7ef-8831df3811f6';
update media_assets set storage_path = 'transfers/all-routes-gallery/transfers.webp' where id = '0d00c231-5045-458d-bcef-fc2716459167';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-budget-transfers.webp' where id = '112eb711-80b2-409d-a983-c0ce84976d19';
update media_assets set storage_path = 'transfers/oblu-XPERIENCE-Ailafushi/Male-airport-to-oblu-xperience-ailafushi.webp' where id = '13395511-672d-4b1b-a5a4-b00ce22c383e';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-to-hotels.webp' where id = '1533cbaf-0547-4218-bb43-10a40cc2e469';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-service-in-maldives.webp' where id = '1a6bc8c5-894f-44a7-a4ac-500b0f83400c';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-hotel-speedboat-transfers.webp' where id = '1af6434c-7a8e-4a02-bbd7-9a0c18d64158';
update media_assets set storage_path = 'transfers/all-routes-gallery/transfers.webp' where id = '1bbfcaa8-a635-444a-8f67-6404ab1d204b';
update media_assets set storage_path = 'transfers/jw-marriot-maldives/jw-marriot-maldives-transfer.webp' where id = '1cc44d10-804d-48e2-937f-a2ee476fedc7';
update media_assets set storage_path = 'transfers/oblu-select-sangeli/Male-airport-to-oblu-select-sangeli.webp' where id = '28598302-45f7-4aaa-8265-42527e1c7d49';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-resort-transfers.webp' where id = '2ac79314-b307-4323-8409-501109f16145';
update media_assets set storage_path = 'transfers/clubmed-kani/Male-airport-to-clubmed-kani.webp' where id = '331cf801-b936-4194-9b08-fc85e9d77a6e';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-service-in-maldives.webp' where id = '3c47b48a-547c-4056-97d4-d40dc5d559bf';
update media_assets set storage_path = 'transfers/one-and-only-reethi-rah/one-and-only-reethirah-transfer.webp' where id = '3f475605-4ddf-4ed7-a620-c854b9bf053c';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-hotel-speedboat-transfers.webp' where id = '49a4c551-219a-4c9e-a3af-4af10f05ec3c';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-transfers.webp' where id = '4c9615d3-3619-41fa-800b-336cf76847fa';
update media_assets set storage_path = 'transfers/oblu-XPERIENCE-Ailafushi/oblu-xperience-ailafushi-island-maldives-speedboat.webp' where id = '4d2d69a8-2ceb-47f7-8049-8f8334010ef7';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-tour-guide-airport-staff.webp' where id = '506608b5-f035-4d6d-8e5d-96d972c953ac';
update media_assets set storage_path = 'transfers/all-routes-gallery/transfers.webp' where id = '51442c57-ee43-43c6-a6c0-dea815dcc890';
update media_assets set storage_path = 'transfers/crossroad-maldives/Male-airport-to-marina-crossroad.webp' where id = '539c7681-b2e1-4dbe-be69-4eb56bd69f21';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-hotel-speedboat-transfers.webp' where id = '5434e007-58d7-4a69-a837-a5c9aa1a161b';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-budget-transfers.webp' where id = '548fc551-90e5-403b-92f3-b3fc2b192988';
update media_assets set storage_path = 'transfers/makunudu-island/Male-airport-to-makunudu.webp' where id = '562d6bef-4232-4816-8497-9d528bb554d0';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-tour-guide-airport-staff.webp' where id = '57b3723f-dc11-4314-81df-2b42b9993cad';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-transfers-in-maldives.webp' where id = '5874c0e2-35e7-4af2-a79f-2f4586f3b9b9';
update media_assets set storage_path = 'transfers/all-routes-gallery/resort-transfers-maldives.webp' where id = '58ae8df3-94eb-4382-b222-e271c9dcca55';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-transfers-in-maldives.webp' where id = '5aa52527-a923-48eb-a660-35ea9090b079';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-service-in-maldives.webp' where id = '5dc8919f-a9ae-448c-b7c2-f78252c04157';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-resort-transfers.webp' where id = '60708368-b0c5-4397-82fe-ce62db3528cb';
update media_assets set storage_path = 'transfers/all-routes-gallery/private-speedboat-charter-maldives.webp' where id = '62cb74d6-7ce0-4fa2-95b3-2c769d4c1df7';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-to-hotels.webp' where id = '643624b1-b44d-4c39-852b-8b554b55832b';
update media_assets set storage_path = 'transfers/all-routes-gallery/private-speedboat-charter-maldives.webp' where id = '647c28a1-10c0-4340-9b73-881da68b4753';
update media_assets set storage_path = 'transfers/all-routes-gallery/resort-transfers-maldives.webp' where id = '66239bac-37bf-482c-8bc5-a8a3671d42ed';
update media_assets set storage_path = 'transfers/clubmed-kani/clubmed-kani-speedboat.webp' where id = '6977e2f3-8252-4f6d-82c1-31914b6d0fdb';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-budget-transfers.webp' where id = '6af655a1-40ef-41f5-8d55-fc4706d33d92';
update media_assets set storage_path = 'transfers/all-routes-gallery/resort-transfers-maldives.webp' where id = '6d58bd05-6a2c-409d-802a-4d8a968770bb';
update media_assets set storage_path = 'transfers/all-routes-gallery/private-speedboat-charter-maldives.webp' where id = '6e497c00-109f-48ac-9b1f-455b28fc1685';
update media_assets set storage_path = 'transfers/clubmed-kani/clubmed-kani-maldives-transfer.webp' where id = '74e024b6-4baf-4d55-87f2-4ed0c657609b';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-resort-transfers.webp' where id = '7817a4a2-4b43-4f60-8cc1-c96e06a13a29';
update media_assets set storage_path = 'transfers/ritz-carlton-maldives/the-ritz-carlton-transfer.webp' where id = '79c42233-a52e-4e86-b282-66712d21195f';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-hotel-speedboat-transfers.webp' where id = '7b523755-3831-480f-adf7-3145928989ab';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-transfers.webp' where id = '7b6301ef-deb1-493f-9984-50ede383cb03';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-transfers-in-maldives.webp' where id = '7d215f99-116f-4154-9a9e-3cc9aa9dc508';
update media_assets set storage_path = 'transfers/all-routes-gallery/private-speedboat-charter-maldives.webp' where id = '832e2dbb-75b2-489e-9752-efd2e27eb390';
update media_assets set storage_path = 'transfers/crossroad-maldives/marina-crossroad-transfer.webp' where id = '85711ff5-c778-4b28-94a1-bfc97b642671';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-to-hotels.webp' where id = '888e5303-93d6-4319-b771-485661b6115e';
update media_assets set storage_path = 'transfers/all-routes-gallery/transfers.webp' where id = '891d77d9-076d-4d40-9ee5-cd9ae7608e22';
update media_assets set storage_path = 'transfers/jw-marriot-maldives/Male-airport-to-jw-marriot.webp' where id = '8e998865-e8cc-4309-b29f-9f7415dea35e';
update media_assets set storage_path = 'transfers/oblu-XPERIENCE-Ailafushi/oblu-xperience-ailafushi-transfer.webp' where id = '91e59a31-9494-4d5c-94d4-6fd55ff5f20f';
update media_assets set storage_path = 'transfers/ritz-carlton-maldives/the-ritz-carlton-maldives-transfer.webp' where id = '954998fe-7544-4338-bca1-83cdf6101ce9';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-resort-transfers.webp' where id = '986ab1c3-72b9-4170-b343-5181cf709ab2';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-transfers.webp' where id = 'a08c9ba8-df9f-487d-8c71-c2c5406fa20d';
update media_assets set storage_path = 'transfers/crossroad-maldives/marina-crossroad-island-maldives-speedboat.webp' where id = 'a23c5376-f556-4e13-86f7-80ba84295f98';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-tour-guide-airport-staff.webp' where id = 'a43dc48c-694d-4943-8618-9341ca6bf378';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-transfers-in-maldives.webp' where id = 'a4e817f5-2fab-4960-a8a2-77e35dc37c91';
update media_assets set storage_path = 'transfers/all-routes-gallery/resort-transfers-maldives.webp' where id = 'a51ce579-f9ea-44b4-97c2-24cfad8535a8';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-tour-guide-airport-staff.webp' where id = 'adef84d2-f05a-4ec5-989e-96686ddae27b';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-service-in-maldives.webp' where id = 'b00aeebc-5669-419d-9504-ac22b922d29f';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-to-hotels.webp' where id = 'b15b68e8-de22-4a64-aba2-4f5150365768';
update media_assets set storage_path = 'transfers/jw-marriot-maldives/jw-marriot-transfer.webp' where id = 'b48d3bae-9442-4b0a-813e-7db7d938343b';
update media_assets set storage_path = 'transfers/all-routes-gallery/transfers.webp' where id = 'b4c0169a-6d33-486f-9884-9206089c7300';
update media_assets set storage_path = 'transfers/oblu-select-sangeli/oblu-select-sangeli-maldives-transfer.webp' where id = 'b75242dd-5293-4869-9f68-fe41d320813c';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-service-in-maldives.webp' where id = 'b7a1569c-e3c5-432a-b10b-35004d6055e0';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-resort-transfers.webp' where id = 'b8808bf2-68b8-4a0d-9938-9a66bb9fca9a';
update media_assets set storage_path = 'transfers/all-routes-gallery/resort-transfers-maldives.webp' where id = 'bc67b6b4-3572-49b8-88ee-a21c339e6ef6';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-budget-transfers.webp' where id = 'c1c45942-9237-4a60-81aa-0dbd455dff1f';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-to-hotels.webp' where id = 'c606e82c-89f1-40f8-996f-816abd0ceac7';
update media_assets set storage_path = 'transfers/clubmed-kani/clubmed-kani-transfer.webp' where id = 'c60c827d-ffd3-4351-86bc-e71ff975ae8f';
update media_assets set storage_path = 'transfers/makunudu-island/makunudu-island-maldives-speedboat.webp' where id = 'c9509ec6-af5c-46cf-8e3b-083f606d13d6';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-transfers.webp' where id = 'c9d166a6-b3a3-47ed-beb6-f5011235b190';
update media_assets set storage_path = 'transfers/crossroad-maldives/marina-crossroad-maldives-transfer.webp' where id = 'ca65ab07-f8f4-4e8f-b26b-9ca4a107c791';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-budget-transfers.webp' where id = 'ca9cda31-93a1-4b2a-a79d-f81e9d97c172';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-resort-transfers.webp' where id = 'cae5edd5-d480-4037-8792-65af44107d0b';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-transfers-in-maldives.webp' where id = 'd00e0cf9-5369-4dfd-acbf-704d4f0b5c00';
update media_assets set storage_path = 'transfers/oblu-select-sangeli/oblu-select-sangeli-island-maldives-speedboat.webp' where id = 'd64cd642-7aea-48d7-b3da-7b4a7806a72b';
update media_assets set storage_path = 'transfers/all-routes-gallery/resort-transfers-maldives.webp' where id = 'd9b2e775-81c9-478d-9780-a33bb13c9961';
update media_assets set storage_path = 'transfers/all-routes-gallery/speedboat-service-in-maldives.webp' where id = 'db11d319-70f9-4d0f-abaf-c3c95ef1067c';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-tour-guide-airport-staff.webp' where id = 'de34f983-d18b-4196-b309-ab45871e6eda';
update media_assets set storage_path = 'transfers/one-and-only-reethi-rah/one-and-only-reethirah-maldives-transfer.webp' where id = 'dfaee7a1-2974-4086-b69b-613fa93eb0e4';
update media_assets set storage_path = 'transfers/all-routes-gallery/private-speedboat-charter-maldives.webp' where id = 'e042d53c-f889-4e33-b49c-34ad6dde590a';
update media_assets set storage_path = 'transfers/all-routes-gallery/Maldives-tour-guide-airport-staff.webp' where id = 'e38ea3f6-294e-4111-9c34-39163ffc5fe8';
update media_assets set storage_path = 'uploads/assets/uploads/articles/Tsunami-Monument-in-Male.webp' where id = 'ec16a513-b74d-675f-aa34-930f0ab7ec3d';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-airport-transfers.webp' where id = 'ec504f1a-e24a-45b5-933c-6c6584980a7d';
update media_assets set storage_path = 'transfers/oblu-select-sangeli/oblu-select-sangeli-transfer.webp' where id = 'f26557c9-50c4-4643-ae9b-73abff1c5a22';
update media_assets set storage_path = 'transfers/makunudu-island/makunudu-transfer.webp' where id = 'f453d821-55a1-4b93-a3d4-a87ca9d5b882';
update media_assets set storage_path = 'transfers/all-routes-gallery/transfers.webp' where id = 'fc5aff72-f8a8-4792-9a90-d5b94cb075b2';
update media_assets set storage_path = 'transfers/ritz-carlton-maldives/Male-airport-to-the-ritz-carlton.webp' where id = 'fd2c0c1d-9c11-4aac-9113-c4f79e1ad6e0';
update media_assets set storage_path = 'transfers/one-and-only-reethi-rah/one-and-only-reethirah-speedboat.webp' where id = 'feccf53f-6bd4-40c5-8396-b1ca1521f9e4';
update media_assets set storage_path = 'transfers/all-routes-gallery/maldives-hotel-speedboat-transfers.webp' where id = 'ff6df82e-10f9-4396-ad03-7bcc2bdcdead';

-- Manta ray species card (src/lib/fishing/fish-species.ts): uploaded the owner's photo from
-- assets/uploads/diving/ straight into the opt/ layout (with variants).
update media_assets set storage_path = 'opt/uploads/assets/uploads/diving/manta-ray-snorkeling-in-the-maldives.webp', width = 1600, height = 900 where id = 'bd3b41a5-79b7-dd34-d52e-f6efd963ee14';
