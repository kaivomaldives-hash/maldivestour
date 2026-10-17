-- Owner-uploaded photos for 4 of the 14 Himmafushi/Yuvi Blue
-- watersports activities (assets/uploads/himmafushi/watersports/) --
-- none of the 14 had any image before this (confirmed by grepping the
-- whole migration history for a node_media row on any of their slugs).
-- GENERATED FILE, regenerate with:
--   node scripts/attach-himmafushi-watersports-uploads.mjs --commit

-- himmafushi-canoeing
insert into media_assets (id, media_type, storage_path, alt_text) values ('b445966a-c097-0aa8-0321-00fab3db572a', 'image', 'uploads/assets/uploads/himmafushi/watersports/himmafushi-canoeing.webp', 'canoeing - Himmafushi, Maldives') on conflict (id) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, 'b445966a-c097-0aa8-0321-00fab3db572a', 'hero', 0 from nodes where node_type = 'activity' and slug = 'himmafushi-canoeing' on conflict (node_id, media_id, role) do nothing;

-- himmafushi-fun-tube
insert into media_assets (id, media_type, storage_path, alt_text) values ('4f7dbe9c-9335-daf4-52d0-6bc965077290', 'image', 'uploads/assets/uploads/himmafushi/watersports/himmafushi-fun-tube.webp', 'fun tube - Himmafushi, Maldives') on conflict (id) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, '4f7dbe9c-9335-daf4-52d0-6bc965077290', 'hero', 0 from nodes where node_type = 'activity' and slug = 'himmafushi-fun-tube' on conflict (node_id, media_id, role) do nothing;

-- himmafushi-jet-ski
insert into media_assets (id, media_type, storage_path, alt_text) values ('cd7f9bd3-6ca7-5d32-fa27-864472755928', 'image', 'uploads/assets/uploads/himmafushi/watersports/himmafushi-jet-ski.webp', 'jet ski - Himmafushi, Maldives') on conflict (id) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, 'cd7f9bd3-6ca7-5d32-fa27-864472755928', 'hero', 0 from nodes where node_type = 'activity' and slug = 'himmafushi-jet-ski' on conflict (node_id, media_id, role) do nothing;

-- himmafushi-parasailing
insert into media_assets (id, media_type, storage_path, alt_text) values ('d9d8e4ca-9694-2e8b-3974-444aa2b5279a', 'image', 'uploads/assets/uploads/himmafushi/watersports/himmafushi-parasailing.webp', 'parasailing - Himmafushi, Maldives') on conflict (id) do nothing;
insert into node_media (node_id, media_id, role, sort_order) select id, 'd9d8e4ca-9694-2e8b-3974-444aa2b5279a', 'hero', 0 from nodes where node_type = 'activity' and slug = 'himmafushi-parasailing' on conflict (node_id, media_id, role) do nothing;

