-- Owner-uploaded transfer route photos (uploaded directly to Supabase
-- Storage's `media` bucket under transfers/<folder>/<n>.webp — not
-- through the admin app, so these rows never existed). 8 resorts get
-- their own real photos; every other transfer route still missing images
-- gets the shared 11-photo transfers/all-routes-gallery/ pool instead.
-- Each route gets its OWN media_assets rows (never shared across routes)
-- so its title/alt text names its own destination, not another route's.

-- ============================================================
-- Resort-specific folders (4 photos each: 1 hero + 3 gallery)
-- ============================================================

-- Club Med Kani Maldives
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-club-med-kani-maldives');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/clubmed-kani/1.webp', 'Club Med Kani Maldives', 'Speedboat transfer to Club Med Kani Maldives'),
    ('image', 'transfers/clubmed-kani/2.webp', 'Club Med Kani Maldives', 'Speedboat transfer to Club Med Kani Maldives'),
    ('image', 'transfers/clubmed-kani/3.webp', 'Club Med Kani Maldives', 'Speedboat transfer to Club Med Kani Maldives'),
    ('image', 'transfers/clubmed-kani/4.webp', 'Club Med Kani Maldives', 'Speedboat transfer to Club Med Kani Maldives')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-club-med-kani-maldives'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/clubmed-kani/1.webp' then 0
    when 'transfers/clubmed-kani/2.webp' then 0
    when 'transfers/clubmed-kani/3.webp' then 1
    when 'transfers/clubmed-kani/4.webp' then 2
  end
from new_media;

-- The Marina at CROSSROADS Maldives
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-the-marina-at-crossroads-maldives');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/crossroad-maldives/1.webp', 'The Marina at CROSSROADS Maldives', 'Speedboat transfer to The Marina at CROSSROADS Maldives'),
    ('image', 'transfers/crossroad-maldives/2.webp', 'The Marina at CROSSROADS Maldives', 'Speedboat transfer to The Marina at CROSSROADS Maldives'),
    ('image', 'transfers/crossroad-maldives/3.webp', 'The Marina at CROSSROADS Maldives', 'Speedboat transfer to The Marina at CROSSROADS Maldives'),
    ('image', 'transfers/crossroad-maldives/4.webp', 'The Marina at CROSSROADS Maldives', 'Speedboat transfer to The Marina at CROSSROADS Maldives')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-the-marina-at-crossroads-maldives'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/crossroad-maldives/1.webp' then 0
    when 'transfers/crossroad-maldives/2.webp' then 0
    when 'transfers/crossroad-maldives/3.webp' then 1
    when 'transfers/crossroad-maldives/4.webp' then 2
  end
from new_media;

-- JW Marriott Maldives Resort & Spa
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-jw-marriott-maldives-resort-spa');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/jw-marriot-maldives/1.webp', 'JW Marriott Maldives Resort & Spa', 'Speedboat transfer to JW Marriott Maldives Resort & Spa'),
    ('image', 'transfers/jw-marriot-maldives/2.webp', 'JW Marriott Maldives Resort & Spa', 'Speedboat transfer to JW Marriott Maldives Resort & Spa'),
    ('image', 'transfers/jw-marriot-maldives/3.webp', 'JW Marriott Maldives Resort & Spa', 'Speedboat transfer to JW Marriott Maldives Resort & Spa'),
    ('image', 'transfers/jw-marriot-maldives/4.webp', 'JW Marriott Maldives Resort & Spa', 'Speedboat transfer to JW Marriott Maldives Resort & Spa')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-jw-marriott-maldives-resort-spa'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/jw-marriot-maldives/1.webp' then 0
    when 'transfers/jw-marriot-maldives/2.webp' then 0
    when 'transfers/jw-marriot-maldives/3.webp' then 1
    when 'transfers/jw-marriot-maldives/4.webp' then 2
  end
from new_media;

-- Makunudu Island
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-makunudu-island');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/makunudu-island/1.webp', 'Makunudu Island', 'Speedboat transfer to Makunudu Island'),
    ('image', 'transfers/makunudu-island/2.webp', 'Makunudu Island', 'Speedboat transfer to Makunudu Island'),
    ('image', 'transfers/makunudu-island/3.webp', 'Makunudu Island', 'Speedboat transfer to Makunudu Island'),
    ('image', 'transfers/makunudu-island/4.webp', 'Makunudu Island', 'Speedboat transfer to Makunudu Island')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-makunudu-island'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/makunudu-island/1.webp' then 0
    when 'transfers/makunudu-island/2.webp' then 0
    when 'transfers/makunudu-island/3.webp' then 1
    when 'transfers/makunudu-island/4.webp' then 2
  end
from new_media;

-- OBLU SELECT Sangeli
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-oblu-select-sangeli');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/oblu-select-sangeli/1.webp', 'OBLU SELECT Sangeli', 'Speedboat transfer to OBLU SELECT Sangeli'),
    ('image', 'transfers/oblu-select-sangeli/2.webp', 'OBLU SELECT Sangeli', 'Speedboat transfer to OBLU SELECT Sangeli'),
    ('image', 'transfers/oblu-select-sangeli/3.webp', 'OBLU SELECT Sangeli', 'Speedboat transfer to OBLU SELECT Sangeli'),
    ('image', 'transfers/oblu-select-sangeli/4.webp', 'OBLU SELECT Sangeli', 'Speedboat transfer to OBLU SELECT Sangeli')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-oblu-select-sangeli'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/oblu-select-sangeli/1.webp' then 0
    when 'transfers/oblu-select-sangeli/2.webp' then 0
    when 'transfers/oblu-select-sangeli/3.webp' then 1
    when 'transfers/oblu-select-sangeli/4.webp' then 2
  end
from new_media;

-- OBLU XPERIENCE Ailafushi
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-oblu-xperience-ailafushi');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/oblu-XPERIENCE-Ailafushi/1.webp', 'OBLU XPERIENCE Ailafushi', 'Speedboat transfer to OBLU XPERIENCE Ailafushi'),
    ('image', 'transfers/oblu-XPERIENCE-Ailafushi/2.webp', 'OBLU XPERIENCE Ailafushi', 'Speedboat transfer to OBLU XPERIENCE Ailafushi'),
    ('image', 'transfers/oblu-XPERIENCE-Ailafushi/3.webp', 'OBLU XPERIENCE Ailafushi', 'Speedboat transfer to OBLU XPERIENCE Ailafushi'),
    ('image', 'transfers/oblu-XPERIENCE-Ailafushi/4.webp', 'OBLU XPERIENCE Ailafushi', 'Speedboat transfer to OBLU XPERIENCE Ailafushi')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-oblu-xperience-ailafushi'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/oblu-XPERIENCE-Ailafushi/1.webp' then 0
    when 'transfers/oblu-XPERIENCE-Ailafushi/2.webp' then 0
    when 'transfers/oblu-XPERIENCE-Ailafushi/3.webp' then 1
    when 'transfers/oblu-XPERIENCE-Ailafushi/4.webp' then 2
  end
from new_media;

-- One&Only Reethi Rah
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-one-only-reethi-rah');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/one-and-only-reethi-rah/1.webp', 'One&Only Reethi Rah', 'Speedboat transfer to One&Only Reethi Rah'),
    ('image', 'transfers/one-and-only-reethi-rah/2.webp', 'One&Only Reethi Rah', 'Speedboat transfer to One&Only Reethi Rah'),
    ('image', 'transfers/one-and-only-reethi-rah/3.webp', 'One&Only Reethi Rah', 'Speedboat transfer to One&Only Reethi Rah'),
    ('image', 'transfers/one-and-only-reethi-rah/4.webp', 'One&Only Reethi Rah', 'Speedboat transfer to One&Only Reethi Rah')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-one-only-reethi-rah'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/one-and-only-reethi-rah/1.webp' then 0
    when 'transfers/one-and-only-reethi-rah/2.webp' then 0
    when 'transfers/one-and-only-reethi-rah/3.webp' then 1
    when 'transfers/one-and-only-reethi-rah/4.webp' then 2
  end
from new_media;

-- The Ritz-Carlton Maldives, Fari Islands
delete from node_media where node_id = (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-the-ritz-carlton-maldives-fari-islands');
with new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  values
    ('image', 'transfers/ritz-carlton-maldives/1.webp', 'The Ritz-Carlton Maldives, Fari Islands', 'Speedboat transfer to The Ritz-Carlton Maldives, Fari Islands'),
    ('image', 'transfers/ritz-carlton-maldives/2.webp', 'The Ritz-Carlton Maldives, Fari Islands', 'Speedboat transfer to The Ritz-Carlton Maldives, Fari Islands'),
    ('image', 'transfers/ritz-carlton-maldives/3.webp', 'The Ritz-Carlton Maldives, Fari Islands', 'Speedboat transfer to The Ritz-Carlton Maldives, Fari Islands'),
    ('image', 'transfers/ritz-carlton-maldives/4.webp', 'The Ritz-Carlton Maldives, Fari Islands', 'Speedboat transfer to The Ritz-Carlton Maldives, Fari Islands')
  returning id, storage_path
)
insert into node_media (node_id, media_id, role, sort_order)
select (select id from nodes where node_type = 'transfer_route' and slug = 'velana-international-airport-to-the-ritz-carlton-maldives-fari-islands'),
  id,
  case when storage_path like '%/1.webp' then 'hero' else 'gallery' end,
  case storage_path
    when 'transfers/ritz-carlton-maldives/1.webp' then 0
    when 'transfers/ritz-carlton-maldives/2.webp' then 0
    when 'transfers/ritz-carlton-maldives/3.webp' then 1
    when 'transfers/ritz-carlton-maldives/4.webp' then 2
  end
from new_media;

-- ============================================================
-- Generic 11-photo pool (transfers/all-routes-gallery/) -> every OTHER
-- transfer route that still has zero images after the 8 inserts above.
-- Each qualifying route gets its OWN new media_assets rows (never shared
-- with another route) so its title/alt text names its own destination.
-- ============================================================
with target_routes as (
  select n.id as route_id, regexp_replace(n.title, '^Velana International Airport to ', '') as destination
  from nodes n
  where n.node_type = 'transfer_route'
    and not exists (select 1 from node_media nm where nm.node_id = n.id)
),
image_defs(n, role, sort_order) as (
  values (1,'hero',0), (2,'gallery',0), (3,'gallery',1), (4,'gallery',2), (5,'gallery',3),
         (6,'gallery',4), (7,'gallery',5), (8,'gallery',6), (9,'gallery',7), (10,'gallery',8), (11,'gallery',9)
),
expanded as (
  select tr.route_id, tr.destination, d.n, d.role, d.sort_order,
    'transfers/all-routes-gallery/' || d.n || '.webp' as storage_path
  from target_routes tr
  cross join image_defs d
),
new_media as (
  insert into media_assets (media_type, storage_path, title, alt_text)
  select 'image', e.storage_path, e.destination, 'Speedboat transfer to ' || e.destination
  from expanded e
  returning id, storage_path, title
)
insert into node_media (node_id, media_id, role, sort_order)
select e.route_id, nm.id, e.role, e.sort_order
from new_media nm
join expanded e on e.destination = nm.title and e.storage_path = nm.storage_path;
