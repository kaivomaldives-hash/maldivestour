-- Owner-uploaded real photos of Yuvi Blue Maldives (Himmafushi guesthouse)
-- (assets/uploads/hotels/yuvi-blue-himmafushi/) — the partner's rate-card
-- screenshot graphics are deliberately excluded from this set (reference
-- pricing material, not public gallery photography).
-- GENERATED FILE, regenerate with:
--   node scripts/attach-yuviblue-uploads.mjs --commit

insert into media_assets (id, media_type, storage_path, alt_text) values ('a23d658f-4b58-d531-64c0-b5cd689a4337', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/himmafushi-beach.jpeg', 'himmafushi beach - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('7513d22b-64a3-59d9-93f5-52e32e64d0c9', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/himmafushi-island.jpeg', 'himmafushi island - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('b5310fa2-3053-5f06-2e1f-0f955ef87d24', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-beach-dinner.jpeg', 'yuvi beach dinner - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('6c5fd4da-f919-2ed8-1958-003f0660cce0', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-business-center.jpeg', 'yuvi business center - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('2328ce4a-60ef-8a32-f850-6c73396db249', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-double-room.jpeg', 'yuvi double room - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('75d7e8bc-b32e-fabc-ada3-c1df1e25f303', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-family-room.jpeg', 'yuvi family room - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('f475d684-f6ee-6697-dcd5-b67d907d8ef8', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-guest-house.jpeg', 'yuvi guest house - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('2a1d2f10-9aec-d39f-cd3e-b205d2609152', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-lobby.jpeg', 'yuvi lobby - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('bfd2fccd-a391-491e-7f37-45f9ae252fff', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-reception.jpeg', 'yuvi reception - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;
insert into media_assets (id, media_type, storage_path, alt_text) values ('b0c5840e-2ee9-2f50-003d-a06cceec0bf3', 'image', 'uploads/assets/uploads/hotels/yuvi-blue-himmafushi/yuvi-single-room.jpeg', 'yuvi single room - Yuvi Blue Maldives, Himmafushi') on conflict (id) do nothing;

-- Accommodation: yuvi-blue-maldives-himmafushi
delete from node_media where role = 'hero' and node_id = (select id from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi');
insert into node_media (node_id, media_id, role, sort_order) select id, 'f475d684-f6ee-6697-dcd5-b67d907d8ef8', 'hero', 0 from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi' on conflict (node_id, media_id, role) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, '2a1d2f10-9aec-d39f-cd3e-b205d2609152', 'gallery', 1 from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi' on conflict (node_id, media_id, role) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, 'bfd2fccd-a391-491e-7f37-45f9ae252fff', 'gallery', 2 from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi' on conflict (node_id, media_id, role) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, '6c5fd4da-f919-2ed8-1958-003f0660cce0', 'gallery', 3 from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi' on conflict (node_id, media_id, role) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, 'b5310fa2-3053-5f06-2e1f-0f955ef87d24', 'gallery', 4 from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi' on conflict (node_id, media_id, role) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, 'b0c5840e-2ee9-2f50-003d-a06cceec0bf3', 'gallery', 5 from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi' on conflict (node_id, media_id, role) do nothing;

-- Room photo: Deluxe Double/Twin Room - Bed & Breakfast
insert into accommodation_room_media (room_id, media_id, sort_order) select r.id, '2328ce4a-60ef-8a32-f850-6c73396db249', 0 from accommodation_rooms r join nodes n on n.id = r.accommodation_id where n.node_type = 'accommodation' and n.slug = 'yuvi-blue-maldives-himmafushi' and r.name = 'Deluxe Double/Twin Room - Bed & Breakfast' on conflict do nothing;
-- Room photo: Deluxe Family Room - Bed & Breakfast
insert into accommodation_room_media (room_id, media_id, sort_order) select r.id, '75d7e8bc-b32e-fabc-ada3-c1df1e25f303', 0 from accommodation_rooms r join nodes n on n.id = r.accommodation_id where n.node_type = 'accommodation' and n.slug = 'yuvi-blue-maldives-himmafushi' and r.name = 'Deluxe Family Room - Bed & Breakfast' on conflict do nothing;

-- Location gallery: himmafushi
insert into node_media (node_id, media_id, role, sort_order) select id, 'a23d658f-4b58-d531-64c0-b5cd689a4337', 'gallery', 100 + 0 from nodes where node_type = 'location' and slug = 'himmafushi' on conflict (node_id, media_id, role) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, '7513d22b-64a3-59d9-93f5-52e32e64d0c9', 'gallery', 100 + 1 from nodes where node_type = 'location' and slug = 'himmafushi' on conflict (node_id, media_id, role) do nothing;

