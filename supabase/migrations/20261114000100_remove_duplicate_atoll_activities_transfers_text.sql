-- Removes the static "<Atoll> Activities" / "More Things to Do in
-- <Atoll>" and "<Atoll> Transfers" text sections from every atoll's
-- stored content (attributes->atoll_sections) -- requested by the site
-- owner after finding these duplicate, lower-quality copies of content
-- the atoll page already shows properly elsewhere on the same page, via
-- real data with photos: the "Activities in <Atoll>" card section
-- (getActivitiesByAtoll + ActivityCard) and the "Transfers" card section
-- (getTransferRoutesByAtoll + TransferRouteCard). These static sections
-- were also the source of the "DescriptionDuration: Xhrs" run-together
-- text bug reported on 2026-10-21 (confirmed across 81 paragraphs on 17
-- atolls) -- rather than patch that text in place, removing the section
-- outright fixes the readability bug too, and does it for every atoll
-- that has either section, not just the ones with the concatenation bug
-- (Faafu and Dhaalu's "Activities" sections read fine as prose but are
-- still the same duplicate-with-the-real-section content).
--
-- Every other section (Welcome, Best Dive Sites, Popular Activities in
-- <Atoll> [a genuine prose overview, not an itemized duplicate], Getting
-- to <Atoll>, Best Time to Visit, Discover <Atoll> Islands, Cultural
-- Heritage, etc.) is untouched -- confirmed by listing every atoll's
-- headings against this migration's match pattern before writing it; it
-- matches exactly the 26 sections intended (one or two per atoll, 20
-- atolls) and nothing else.

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select coalesce(jsonb_agg(elem order by ord), '[]'::jsonb)
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
    where not (
      (elem->>'heading') ~* '^.+ Atoll Activities$'
      or (elem->>'heading') ~* '^More Things to Do in '
      or (elem->>'heading') ~* ' Transfers$'
    )
  )
)
where n.node_type = 'location'
  and n.attributes ? 'atoll_sections'
  and exists (
    select 1
    from jsonb_array_elements(n.attributes->'atoll_sections') as s
    where (s->>'heading') ~* '^.+ Atoll Activities$'
       or (s->>'heading') ~* '^More Things to Do in '
       or (s->>'heading') ~* ' Transfers$'
  );
