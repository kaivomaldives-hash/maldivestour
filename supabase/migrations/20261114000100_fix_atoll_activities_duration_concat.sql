-- Fixes a mechanical formatting bug found across the original bulk atoll-
-- content generation (20250122000200, same root cause as the degenerate
-- "<Atoll> Transfers" sections fixed in 20261106000100): every "<Atoll>
-- Activities" / "More Things to Do in <Atoll>" paragraph was built by
-- concatenating an activity's description directly against its duration
-- label with no separator -- e.g. "Explore vibrant coral reefs and marine
-- lifeDuration: 3hrs" -- rendering as unreadable run-together text on
-- /maldives/atolls/<slug>/. Confirmed live on 2026-10-21 via a scan of
-- every atoll's stored atoll_sections: 81 paragraphs across 17 atolls
-- (Kaafu, Gaafu Alifu, Gaafu Dhaalu, Shaviyani, Noonu, Raa, Baa, Meemu,
-- Faafu, Dhaalu, Laamu, Gnaviyani, Seenu, Thaa, and others) all share the
-- exact same pattern -- a site-wide mechanical fix, not a per-atoll
-- content rewrite: this only inserts " — " between the description and
-- "Duration:" wherever they're jammed together, never changes the actual
-- words. Every section's heading and every other paragraph is passed
-- through unchanged.

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select jsonb_agg(
      jsonb_build_object(
        'heading', elem->>'heading',
        'paragraphs', (
          select coalesce(jsonb_agg(regexp_replace(p.value, '([a-z])Duration:', '\1 — Duration:', 'g') order by p.ord), '[]'::jsonb)
          from jsonb_array_elements_text(elem->'paragraphs') with ordinality as p(value, ord)
        )
      )
      order by ord
    )
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
  )
)
where n.node_type = 'location'
  and n.attributes ? 'atoll_sections'
  and exists (
    select 1
    from jsonb_array_elements(n.attributes->'atoll_sections') as s,
         jsonb_array_elements_text(s->'paragraphs') as p
    where p ~ '[a-z]Duration:'
  );
