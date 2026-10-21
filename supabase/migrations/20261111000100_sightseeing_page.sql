-- New "Maldives Sightseeing" SEO landing page — same 'activity-category'
-- mechanism as 20261107000100 (snorkeling, excursions, etc.), combining
-- two already-real, already-tagged groups of listings into one page:
-- the 5 real Male city tours (already tagged 'city-tour' under
-- 'activity-type' — see 20250201000100_male_city_tour_and_whale_submarine)
-- and every real activity_category='island_hopping' listing (same
-- selection already used for /maldives/island-hopping/).

insert into nodes (id, node_type, slug, title, status, published_at) values ('e1f4b7c9-3a6d-4b2e-8f1c-5d9a2e7b4c01', 'category', 'sightseeing', 'Sightseeing', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'activity-category', 'sightseeing'::ltree from nodes where node_type = 'category' and slug = 'sightseeing' on conflict (id) do nothing;

-- City tours: every activity already tagged with the real 'city-tour'
-- activity-type category.
insert into node_categories (node_id, category_id)
select nc.node_id, (select id from nodes where node_type = 'category' and slug = 'sightseeing')
from node_categories nc
where nc.category_id = (select id from nodes where node_type = 'category' and slug = 'city-tour')
on conflict do nothing;

-- Island hopping: the existing 'island_hopping' activity_category bucket
-- (same real listings already shown on /maldives/island-hopping/).
insert into node_categories (node_id, category_id)
select a.id, (select id from nodes where node_type = 'category' and slug = 'sightseeing')
from activities a
where a.activity_category = 'island_hopping'
on conflict do nothing;
