-- The original bulk atoll-content generation (20250122000200) produced a
-- broken "<Atoll> Transfers" section for 5 atolls: instead of naming real
-- transfer routes, each paragraph is just the atoll's own name (or, for
-- Kaafu, its "North/South Male Atoll" sub-region) repeated over and over
-- (Baa: 7x, Kaafu: 41x, Thaa: 1x, Gaafu Alifu: 3x, Gaafu Dhaalu: 2x). This
-- renders on /maldives/atolls/<slug>/ as a long run of plain "Baa Atoll"-
-- style lines under a "Transfers" heading — reported by the site owner.
-- Every other atoll's Transfers section already reads fine (e.g. Raa:
-- "Male' to Raa Atoll Resorts" / "Male' to Raa Atoll"); this replaces just
-- the broken section for these 5, in place, following that same two-line
-- style. Resort/island names (Soneva Fushi, Baros, Gili Lankanfushi,
-- Velassaru, Maafushi, Guraidhoo) and domestic airports (Thimarafushi,
-- Kooddoo, Kaadedhdhoo) are real and already present elsewhere in this
-- app's own seed data / are verifiable public facts — nothing here is
-- invented. Every other section (dive sites, activities, etc.) on these 5
-- atolls is untouched.

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select jsonb_agg(
      case when elem->>'heading' = 'Baa Atoll Transfers'
        then jsonb_build_object(
          'heading', elem->>'heading',
          'paragraphs', '["Male'' to Soneva Fushi", "Male'' to Baa Atoll Resorts"]'::jsonb
        )
        else elem
      end
      order by ord
    )
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
  )
)
where n.node_type = 'location' and n.slug = 'baa';

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select jsonb_agg(
      case when elem->>'heading' = 'Kaafu Atoll Transfers'
        then jsonb_build_object(
          'heading', elem->>'heading',
          'paragraphs', '["Male'' to North Male Atoll Resorts (Baros, Gili Lankanfushi, Velassaru)", "Male'' to South Male Atoll Resorts (Maafushi, Guraidhoo)"]'::jsonb
        )
        else elem
      end
      order by ord
    )
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
  )
)
where n.node_type = 'location' and n.slug = 'kaafu';

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select jsonb_agg(
      case when elem->>'heading' = 'Thaa Atoll Transfers'
        then jsonb_build_object(
          'heading', elem->>'heading',
          'paragraphs', '["Male'' to Thaa Atoll via Thimarafushi Airport", "Male'' to Thaa Atoll Resorts"]'::jsonb
        )
        else elem
      end
      order by ord
    )
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
  )
)
where n.node_type = 'location' and n.slug = 'thaa';

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select jsonb_agg(
      case when elem->>'heading' = 'Gaafu Alifu Atoll Transfers'
        then jsonb_build_object(
          'heading', elem->>'heading',
          'paragraphs', '["Male'' to Gaafu Alifu Atoll via Kooddoo Airport", "Male'' to Gaafu Alifu Atoll Resorts"]'::jsonb
        )
        else elem
      end
      order by ord
    )
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
  )
)
where n.node_type = 'location' and n.slug = 'gaafu-alifu';

update nodes n
set attributes = jsonb_set(
  n.attributes,
  '{atoll_sections}',
  (
    select jsonb_agg(
      case when elem->>'heading' = 'Gaafu Dhaalu Atoll Transfers'
        then jsonb_build_object(
          'heading', elem->>'heading',
          'paragraphs', '["Male'' to Gaafu Dhaalu Atoll via Kaadedhdhoo Airport", "Male'' to Gaafu Dhaalu Atoll Resorts"]'::jsonb
        )
        else elem
      end
      order by ord
    )
    from jsonb_array_elements(n.attributes->'atoll_sections') with ordinality as t(elem, ord)
  )
)
where n.node_type = 'location' and n.slug = 'gaafu-dhaalu';
