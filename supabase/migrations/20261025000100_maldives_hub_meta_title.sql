-- Owner wants the /maldives/ hub page's title to be exactly "Maldives" to
-- target that single keyword, rather than the originally-seeded
-- "Maldives Travel Guide | MTG" (supabase/migrations/20250102000100_
-- seed_maldives_locations.sql). nodes.meta_title (when set) always wins
-- over the page's own code fallback (src/app/maldives/page.tsx), so this
-- has to change here, not just in code.

update nodes
set meta_title = 'Maldives'
where node_type = 'location' and slug = 'maldives' and meta_title = 'Maldives Travel Guide | MTG';
