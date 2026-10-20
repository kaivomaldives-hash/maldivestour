-- New SEO landing pages for activity sub-niches that don't have their own
-- URL today (snorkeling, excursions, sandbank tours, water sports, island
-- hopping, dolphin & whale watching) — fishing/diving/surfing already have
-- dedicated verticals and are untouched here. Mirrors the exact mechanism
-- already used for /maldives/airport-transfers/ etc. (20250113000100/
-- 20250113000200): a new category_group ('activity-category', parallel to
-- 'transfer-category') tags real existing activity nodes via
-- node_categories, so a listing can belong to any number of these SEO
-- pages with zero new tables and zero duplicated listings. This is
-- deliberately a *different* category_group from the pre-existing
-- 'activity-type' (fishing/diving/surfing's own in-vertical filter facets,
-- e.g. 'night-diving') — these are cross-cutting landing pages over the
-- shared /maldives/activities/ pool, the same relationship
-- 'transfer-category' has to the generic transfer_routes pool.

alter table categories drop constraint categories_category_group_check;
alter table categories add constraint categories_category_group_check
  check (category_group in (
    'accommodation-type', 'activity-type', 'amenity',
    'traveler-type', 'package-style', 'duration-band', 'inclusion', 'theme',
    'article-category', 'transfer-category', 'activity-category'
  ));

insert into nodes (id, node_type, slug, title, status, published_at) values ('b4e1b5b1-6b0a-4b3f-9c1a-2f6a0f9b1a01', 'category', 'snorkeling', 'Snorkeling', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'activity-category', 'snorkeling'::ltree from nodes where node_type = 'category' and slug = 'snorkeling' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('b4e1b5b1-6b0a-4b3f-9c1a-2f6a0f9b1a02', 'category', 'excursions', 'Excursions', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'activity-category', 'excursions'::ltree from nodes where node_type = 'category' and slug = 'excursions' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('b4e1b5b1-6b0a-4b3f-9c1a-2f6a0f9b1a03', 'category', 'sandbank-tours', 'Sandbank Tours', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'activity-category', 'sandbank_tours'::ltree from nodes where node_type = 'category' and slug = 'sandbank-tours' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('b4e1b5b1-6b0a-4b3f-9c1a-2f6a0f9b1a04', 'category', 'water-sports', 'Water Sports', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'activity-category', 'water_sports'::ltree from nodes where node_type = 'category' and slug = 'water-sports' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('b4e1b5b1-6b0a-4b3f-9c1a-2f6a0f9b1a05', 'category', 'island-hopping', 'Island Hopping', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'activity-category', 'island_hopping'::ltree from nodes where node_type = 'category' and slug = 'island-hopping' on conflict (id) do nothing;

insert into nodes (id, node_type, slug, title, status, published_at) values ('b4e1b5b1-6b0a-4b3f-9c1a-2f6a0f9b1a06', 'category', 'dolphin-whale-watching', 'Dolphin & Whale Watching', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'activity-category', 'dolphin_whale_watching'::ltree from nodes where node_type = 'category' and slug = 'dolphin-whale-watching' on conflict (id) do nothing;

-- Snorkeling: every activity whose title names it (real listings only --
-- no activity_category column cleanly isolates snorkeling, it's spread
-- across excursion/watersports/island_hopping in the seed data).
insert into node_categories (node_id, category_id)
select a.id, (select id from nodes where node_type = 'category' and slug = 'snorkeling')
from activities a join nodes n on n.id = a.id
where n.title ilike '%snorkel%'
on conflict do nothing;

-- Excursions: the existing 'excursion' activity_category bucket is exactly
-- this intent already.
insert into node_categories (node_id, category_id)
select a.id, (select id from nodes where node_type = 'category' and slug = 'excursions')
from activities a
where a.activity_category = 'excursion'
on conflict do nothing;

-- Sandbank tours: title match, same reasoning as snorkeling above.
insert into node_categories (node_id, category_id)
select a.id, (select id from nodes where node_type = 'category' and slug = 'sandbank-tours')
from activities a join nodes n on n.id = a.id
where n.title ilike '%sandbank%'
on conflict do nothing;

-- Water sports: the existing 'watersports' activity_category bucket.
insert into node_categories (node_id, category_id)
select a.id, (select id from nodes where node_type = 'category' and slug = 'water-sports')
from activities a
where a.activity_category = 'watersports'
on conflict do nothing;

-- Island hopping: the existing 'island_hopping' activity_category bucket.
insert into node_categories (node_id, category_id)
select a.id, (select id from nodes where node_type = 'category' and slug = 'island-hopping')
from activities a
where a.activity_category = 'island_hopping'
on conflict do nothing;

-- Dolphin & whale watching: title match (dolphin cruises are real listings;
-- there's no dedicated whale-watching listing yet, only the whale
-- submarine tour, which is title-matched here too since it's the one real
-- marine-wildlife-viewing listing closest to that intent).
insert into node_categories (node_id, category_id)
select a.id, (select id from nodes where node_type = 'category' and slug = 'dolphin-whale-watching')
from activities a join nodes n on n.id = a.id
where n.title ilike '%dolphin%' or n.title ilike '%whale%'
on conflict do nothing;

-- Pre-existing legacy redirect for this exact old URL pointed at the
-- generic activities hub since no dedicated snorkeling page existed yet
-- (20250111000100). Now that one does, point it there instead — strictly
-- more specific, same intent.
update url_redirects
set target_path = '/maldives/snorkeling/', notes = '[redirect, confidence=high] Dedicated snorkeling landing page now exists at /maldives/snorkeling/ — updated from the generic activities hub.', updated_at = now()
where source_path = '/transfer/snorkeling-and-diving-activities-in-maldives.html';
