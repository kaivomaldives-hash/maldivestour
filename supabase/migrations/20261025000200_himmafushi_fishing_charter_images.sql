-- The two Himmafushi fishing-charter activities had no image at all
-- (confirmed: no node_media row referenced either slug anywhere in the
-- migration history). Owner confirmed Emperor's boats actually serve
-- these charters, so this reuses the real Emperor boat photos already
-- uploaded and attached elsewhere (private-full-day-fishing-charter, see
-- 20250124000100_fishing_uploads_media.sql) rather than leaving them
-- unillustrated or inventing a stock photo.

insert into node_media (node_id, media_id, role, sort_order)
select id, '231eed3c-1bc0-71fb-4187-ca095c8d7630', 'hero', 0
from nodes where node_type = 'activity' and slug = 'himmafushi-half-day-fishing-charter'
on conflict (node_id, media_id, role) do nothing;

insert into node_media (node_id, media_id, role, sort_order)
select id, 'e520e856-d8be-505a-1e39-bc1a61f726e0', 'gallery', 1
from nodes where node_type = 'activity' and slug = 'himmafushi-half-day-fishing-charter'
on conflict (node_id, media_id, role) do nothing;

insert into node_media (node_id, media_id, role, sort_order)
select id, '94bb6eed-690f-20c7-1169-f3c0b0a9466d', 'hero', 0
from nodes where node_type = 'activity' and slug = 'himmafushi-full-day-fishing-charter'
on conflict (node_id, media_id, role) do nothing;

insert into node_media (node_id, media_id, role, sort_order)
select id, '7e90fcd5-499f-8989-6783-c3ff27ee5bb1', 'gallery', 1
from nodes where node_type = 'activity' and slug = 'himmafushi-full-day-fishing-charter'
on conflict (node_id, media_id, role) do nothing;
