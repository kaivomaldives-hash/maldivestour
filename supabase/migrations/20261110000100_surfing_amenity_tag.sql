-- Tags real resorts near known surf breaks with a 'surfing' amenity, so
-- the Maldives Surfing hub page can show a real, maintainable "Surf
-- Resorts & Hotels" section instead of a hardcoded list. The
-- 'amenity' category_group already existed in the schema (Task 7
-- foundation) but was never actually seeded — this is its first use.
-- Only resorts whose own access_notes in 20250107000100_seed_surfing.sql
-- directly name them as sitting on/right next to a real break are tagged:
-- Cinnamon Dhonveli (exclusive access to Pasta Point) and Six Senses
-- Laamu (its own Tropicsurf program a few minutes from Yin-Yang). More
-- resorts can be tagged the same way later as new ones are confirmed.

insert into nodes (id, node_type, slug, title, status, published_at) values ('d8f3a6c2-1b4e-4a7d-9c5f-2e8b1a3d4c01', 'category', 'surfing', 'Surfing', 'published', now()) on conflict (node_type, slug) do nothing;
insert into categories (id, category_group, path) select id, 'amenity', 'surfing'::ltree from nodes where node_type = 'category' and slug = 'surfing' on conflict (id) do nothing;

insert into node_categories (node_id, category_id)
select n.id, (select id from nodes where node_type = 'category' and slug = 'surfing')
from nodes n
where n.node_type = 'accommodation' and n.slug in ('cinnamon-dhonveli-island-resort-maldives', 'six-senses-laamu')
on conflict do nothing;
