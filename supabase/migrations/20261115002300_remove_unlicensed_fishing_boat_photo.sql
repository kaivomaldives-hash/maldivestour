-- Removes the "fishing-charter-boat" photo (another operator's boat, GT
-- HUNTER; no rights to use it) from the site, owner request 2026-10-29,
-- replacing it with photos of our own boat, Emperor. Applied live on
-- 2026-10-29; backup in docs/seo/fishing/backups/hero-image-2026-10-29/.
-- The fishing hero image itself is in code (FISHING_HERO_IMAGE).

-- Lodge gallery and the Gaafu Atoll guide's content photo.
update node_media set media_id = 'e520e856-d8be-505a-1e39-bc1a61f726e0'
where media_id = 'cdb0fc20-985d-4734-a1c8-79b6d020e07a' and node_id = 'c06723db-4d49-4104-9ad0-e3a4f7aea056'
  and not exists (select 1 from node_media where node_id = 'c06723db-4d49-4104-9ad0-e3a4f7aea056' and media_id = 'e520e856-d8be-505a-1e39-bc1a61f726e0');
update node_media set media_id = '94bb6eed-690f-20c7-1169-f3c0b0a9466d'
where media_id = 'cdb0fc20-985d-4734-a1c8-79b6d020e07a' and node_id = '136b82fb-180b-4fde-ae5a-3bdc855958ba'
  and not exists (select 1 from node_media where node_id = '136b82fb-180b-4fde-ae5a-3bdc855958ba' and media_id = '94bb6eed-690f-20c7-1169-f3c0b0a9466d');
delete from node_media where media_id = 'cdb0fc20-985d-4734-a1c8-79b6d020e07a';

-- Gaafu Atoll fishing guide body photo (English + translations).

update articles set body = replace(body, '<img src="opt/uploads/assets/uploads/fishing/images/gallery/fishing-charter-boat.webp" alt="Fishing charter boat in the Maldives"', '<img src="opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp" alt="Emperor, our private fishing boat, in deep blue water off an island in Gaafu Alifu Atoll"') where id = '136b82fb-180b-4fde-ae5a-3bdc855958ba';
update translations set body_html = replace(body_html, '<img src="opt/uploads/assets/uploads/fishing/images/gallery/fishing-charter-boat.webp" alt="Charterboot zum Angeln auf den Malediven"', '<img src="opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp" alt="Die Emperor, unser privates Angelboot, im tiefblauen Wasser vor einer Insel im Gaafu-Alifu-Atoll"') where id = '29afe0b4-f0ff-4f5f-8a4b-80b9880faa28';
update translations set body_html = replace(body_html, '<img src="opt/uploads/assets/uploads/fishing/images/gallery/fishing-charter-boat.webp" alt="Barca da charter per la pesca alle Maldive"', '<img src="opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp" alt="Emperor, la nostra barca da pesca privata, nelle acque blu al largo di un''isola dell''atollo di Gaafu Alifu"') where id = '28151d63-306f-476e-a353-b5901e075915';
update translations set body_html = replace(body_html, '<img src="opt/uploads/assets/uploads/fishing/images/gallery/fishing-charter-boat.webp" alt="Чартерная лодка для рыбалки на Мальдивах"', '<img src="opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp" alt="Emperor, наша частная рыболовная лодка, в синей воде у острова атолла Гаафу Алифу"') where id = '3234aad5-2f21-4c2e-8e7c-298fec6a0740';
update translations set body_html = replace(body_html, '<img src="opt/uploads/assets/uploads/fishing/images/gallery/fishing-charter-boat.webp" alt="モルディブのフィッシングチャーターボート"', '<img src="opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp" alt="ガーフ・アリフ環礁の島の沖、深い青の海に浮かぶ当社の釣り船エンペラー号"') where id = 'b9a00321-c078-4247-aac6-12fe0618912b';
update translations set body_html = replace(body_html, '<img src="opt/uploads/assets/uploads/fishing/images/gallery/fishing-charter-boat.webp" alt="马尔代夫钓鱼包船"', '<img src="opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp" alt="我们的私人钓鱼船 Emperor 停在加夫阿利夫环礁一座岛屿外的深蓝海面上"') where id = 'd4aad9dc-fce1-4049-abef-754f5b15c172';
update translations set body_html = replace(body_html, '<img src="opt/uploads/assets/uploads/fishing/images/gallery/fishing-charter-boat.webp" alt="Barco de charter de pesca en Maldivas"', '<img src="opt/uploads/assets/uploads/fishing/images/charters/emperor-fishing-charter.webp" alt="Emperor, nuestro barco de pesca privado, en aguas azules frente a una isla del atolón Gaafu Alifu"') where id = '1349f831-8e94-450f-b4be-a75151078b98';
