-- Removes the "Discover <Atoll> Islands" / "Explore <Atoll>'s Islands"
-- section wherever its text is word-for-word identical to another
-- section in the same atoll's content (e.g. Gaafu Alifu Atoll has this
-- exact text under both "Discover Gaafu Alifu Atoll Islands" and
-- "Cultural Heritage of Gaafu Alifu Atoll" -- confirmed live on
-- 2026-10-21 across 11 atolls). The surviving heading is kept -- it's
-- the more specific one (Cultural Heritage / UNESCO Biosphere Reserve /
-- Marine Life & Diving / Visitor Experiences, depending on the atoll),
-- which also actually matches what the shared paragraphs are about
-- (island culture/heritage, not the islands themselves -- the atoll page
-- already has a real "Islands in <Atoll>" card section elsewhere, so this
-- heading was redundant with that too, same as the Activities/Transfers
-- sections removed in 20261114000100).
--
-- Deliberately keyed off an exact text match, not just the heading name:
-- 3 atolls (Kaafu, Faafu, Laamu) have a "Discover <Atoll> Islands"
-- section with genuinely unique content, not a duplicate of anything
-- else -- confirmed live before writing this -- so those are left alone.

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select coalesce(jsonb_agg(elem order by ord), '[]'::jsonb)
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
    where not (
      (elem->>'heading') ~ '^(Discover|Explore) .*Islands$'
      and exists (
        select 1
        from jsonb_array_elements(n.attributes->'atoll_sections') as other
        where other->'paragraphs' = elem->'paragraphs'
          and other->>'heading' <> elem->>'heading'
      )
    )
  )
)
where n.node_type = 'location'
  and n.attributes ? 'atoll_sections'
  and exists (
    select 1
    from jsonb_array_elements(n.attributes->'atoll_sections') as s
    where (s->>'heading') ~ '^(Discover|Explore) .*Islands$'
      and exists (
        select 1
        from jsonb_array_elements(n.attributes->'atoll_sections') as other
        where other->'paragraphs' = s->'paragraphs'
          and other->>'heading' <> s->>'heading'
      )
  );
