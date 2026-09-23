-- Part 1 of 6 - run this in the Supabase SQL Editor AFTER the previous parts.
-- Safe to re-run: every statement in the source file is idempotent (on
-- conflict do nothing / coalesce jsonb merge).

-- MTG: Stays ecosystem seed — 148 real resort/hotel/guesthouse
-- properties, migrated from the legacy site (Phase 1-2 of the Stays
-- ecosystem task).
-- GENERATED FILE — do not hand-edit. Source of truth:
--   data/maldives/accommodations-v2/resolved-properties.json
--   (built by scripts/extract-legacy-accommodations.mjs +
--    scripts/merge-accommodation-research.mjs from WebSearch-verified
--    atoll/island research — see resolution-review.json for the 2
--    properties deliberately excluded: an ambiguous 'Crystal Beach'
--    among 3 same-named guesthouses, and 'Vakarufalhi', rebranded to
--    NOVA Maldives in 2019 and kept under its current name only.)
-- Regenerate with: node scripts/generate-stays-seed.mjs
--
-- Adds to, never replaces, the original 14-property seed from Task 5
-- (20250103000100_seed_accommodations.sql) — idempotent, ON CONFLICT DO
-- NOTHING keyed by slug, same convention as every other generator here.
--
-- No providers are assigned: unlike Task 5's activities/fishing data,
-- the legacy resort/hotel pages never name a distinct booking operator
-- for the property itself (only in-page booking WIDGETS, already
-- confirmed non-content by the Phase 1 audit) — leaving
-- operated_by_provider_id null here is the honest reflection of that,
-- not an oversight.

-- New private/resort islands not covered by the Task 4 inhabited-islands
-- seed or the Task 5 six-resort-island set (deduped — e.g. Fari Islands
-- is shared by two resorts and gets exactly one row here).

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhoores', 'Dhoores', 'Dhoores is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhoores'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhoores'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'lhohifushi', 'Lhohifushi', 'Lhohifushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'lhohifushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'lhohifushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'meedhupparu', 'Meedhupparu', 'Meedhupparu is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'meedhupparu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'meedhupparu'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vadoo', 'Vadoo', 'Vadoo is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vadoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vadoo'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kothaifaru', 'Kothaifaru', 'Kothaifaru is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kothaifaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kothaifaru'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'alimatha', 'Alimatha', 'Alimatha is a resort island in Vaavu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'alimatha'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'alimatha'
  and p.node_type = 'location' and p.slug = 'vaavu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'havodda', 'Havodda', 'Havodda is a resort island in Gaafu Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'havodda'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'havodda'
  and p.node_type = 'location' and p.slug = 'gaafu-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kuda-rah', 'Kuda Rah', 'Kuda Rah is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kuda_rah'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kuda-rah'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'amilla-fushi', 'Amilla Fushi', 'Amilla Fushi is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'amilla_fushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'amilla-fushi'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'angaga', 'Angaga', 'Angaga is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'angaga'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'angaga'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'velavaru', 'Velavaru', 'Velavaru is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'velavaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'velavaru'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kanifushi', 'Kanifushi', 'Kanifushi is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kanifushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kanifushi'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maguhdhuvaa', 'Maguhdhuvaa', 'Maguhdhuvaa is a resort island in Gaafu Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maguhdhuvaa'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maguhdhuvaa'
  and p.node_type = 'location' and p.slug = 'gaafu-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maagau', 'Maagau', 'Maagau is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maagau'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maagau'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'bandos', 'Bandos', 'Bandos is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'bandos'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'bandos'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vabbinfaru', 'Vabbinfaru', 'Vabbinfaru is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vabbinfaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vabbinfaru'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'makunufushi', 'Makunufushi', 'Makunufushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'makunufushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'makunufushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maalifushi', 'Maalifushi', 'Maalifushi is a resort island in Thaa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maalifushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maalifushi'
  and p.node_type = 'location' and p.slug = 'thaa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kanuhuraa', 'Kanuhuraa', 'Kanuhuraa is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kanuhuraa'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kanuhuraa'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'hakuraa-huraa', 'Hakuraa Huraa', 'Hakuraa Huraa is a resort island in Meemu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'hakuraa_huraa'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'hakuraa-huraa'
  and p.node_type = 'location' and p.slug = 'meemu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'velifushi', 'Velifushi', 'Velifushi is a resort island in Vaavu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'velifushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'velifushi'
  and p.node_type = 'location' and p.slug = 'vaavu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'bodu-hithi', 'Bodu Hithi', 'Bodu Hithi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'bodu_hithi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'bodu-hithi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vashugiri', 'Vashugiri', 'Vashugiri is a resort island in Vaavu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vashugiri'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vashugiri'
  and p.node_type = 'location' and p.slug = 'vaavu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'ookolhufinolhu', 'Ookolhufinolhu', 'Ookolhufinolhu is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'ookolhufinolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'ookolhufinolhu'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'rangali', 'Rangali', 'Rangali is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'rangali'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'rangali'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maamigili', 'Maamigili', 'Maamigili is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maamigili'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maamigili'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhigali', 'Dhigali', 'Dhigali is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhigali'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhigali'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhiggiri', 'Dhiggiri', 'Dhiggiri is a resort island in Vaavu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhiggiri'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhiggiri'
  and p.node_type = 'location' and p.slug = 'vaavu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhigufaru', 'Dhigufaru', 'Dhigufaru is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhigufaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhigufaru'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'thudufushi', 'Thudufushi', 'Thudufushi is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'thudufushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'thudufushi'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'mudhdhoo', 'Mudhdhoo', 'Mudhdhoo is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'mudhdhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'mudhdhoo'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'fasmendhoo', 'Fasmendhoo', 'Fasmendhoo is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'fasmendhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'fasmendhoo'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'eriyadu', 'Eriyadu', 'Eriyadu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'eriyadu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'eriyadu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'faarufushi', 'Faarufushi', 'Faarufushi is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'faarufushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'faarufushi'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'sirru-fen-fushi', 'Sirru Fen Fushi', 'Sirru Fen Fushi is a resort island in Shaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'sirru_fen_fushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'sirru-fen-fushi'
  and p.node_type = 'location' and p.slug = 'shaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'filitheyo', 'Filitheyo', 'Filitheyo is a resort island in Faafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'filitheyo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'filitheyo'
  and p.node_type = 'location' and p.slug = 'faafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kanufushi', 'Kanufushi', 'Kanufushi is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kanufushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kanufushi'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'landaa-giraavaru', 'Landaa Giraavaru', 'Landaa Giraavaru is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'landaa_giraavaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'landaa-giraavaru'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kuda-huraa', 'Kuda Huraa', 'Kuda Huraa is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kuda_huraa'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kuda-huraa'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'voavah', 'Voavah', 'Voavah is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'voavah'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'voavah'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'bodufinolhu', 'Bodufinolhu', 'Bodufinolhu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'bodufinolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'bodufinolhu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'furaveri', 'Furaveri', 'Furaveri is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'furaveri'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'furaveri'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'fushifaru', 'Fushifaru', 'Fushifaru is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'fushifaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'fushifaru'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'gangehi', 'Gangehi', 'Gangehi is a resort island in Alif Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'gangehi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'gangehi'
  and p.node_type = 'location' and p.slug = 'alif-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kodhipparu', 'Kodhipparu', 'Kodhipparu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kodhipparu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kodhipparu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'akasdhoo', 'Akasdhoo', 'Akasdhoo is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'akasdhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'akasdhoo'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'aarah', 'Aarah', 'Aarah is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'aarah'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'aarah'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhonakulhi', 'Dhonakulhi', 'Dhonakulhi is a resort island in Haa Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhonakulhi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhonakulhi'
  and p.node_type = 'location' and p.slug = 'haa-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kedhigandu', 'Kedhigandu', 'Kedhigandu is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kedhigandu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kedhigandu'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'hurawalhi', 'Hurawalhi', 'Hurawalhi is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'hurawalhi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'hurawalhi'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'innahura', 'Innahura', 'Innahura is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'innahura'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'innahura'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maamunagau', 'Maamunagau', 'Maamunagau is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maamunagau'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maamunagau'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'manafaru', 'Manafaru', 'Manafaru is a resort island in Haa Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'manafaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'manafaru'
  and p.node_type = 'location' and p.slug = 'haa-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'muravandhoo', 'Muravandhoo', 'Muravandhoo is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'muravandhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'muravandhoo'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vagaru', 'Vagaru', 'Vagaru is a resort island in Shaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vagaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vagaru'
  and p.node_type = 'location' and p.slug = 'shaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'olhahali', 'Olhahali', 'Olhahali is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'olhahali'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'olhahali'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kandima', 'Kandima', 'Kandima is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kandima'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kandima'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kandolhu', 'Kandolhu', 'Kandolhu is a resort island in Alif Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kandolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kandolhu'
  and p.node_type = 'location' and p.slug = 'alif-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'komandoo', 'Komandoo', 'Komandoo is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'komandoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'komandoo'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kudadoo', 'Kudadoo', 'Kudadoo is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kudadoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kudadoo'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhidhoofinolhu', 'Dhidhoofinolhu', 'Dhidhoofinolhu is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhidhoofinolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhidhoofinolhu'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'huvahendhoo', 'Huvahendhoo', 'Huvahendhoo is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'huvahendhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'huvahendhoo'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maayafushi', 'Maayafushi', 'Maayafushi is a resort island in Alif Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maayafushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maayafushi'
  and p.node_type = 'location' and p.slug = 'alif-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'makunudu', 'Makunudu', 'Makunudu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'makunudu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'makunudu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kuda-bandos', 'Kuda Bandos', 'Kuda Bandos is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kuda_bandos'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kuda-bandos'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'medhufushi', 'Medhufushi', 'Medhufushi is a resort island in Meemu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'medhufushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'medhufushi'
  and p.node_type = 'location' and p.slug = 'meemu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'meerufenfushi', 'Meerufenfushi', 'Meerufenfushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'meerufenfushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'meerufenfushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'milaidhoo', 'Milaidhoo', 'Milaidhoo is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'milaidhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'milaidhoo'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'mirihi', 'Mirihi', 'Mirihi is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'mirihi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'mirihi'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kuredhivaru', 'Kuredhivaru', 'Kuredhivaru is a resort island in Noonu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kuredhivaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kuredhivaru'
  and p.node_type = 'location' and p.slug = 'noonu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kudafolhudhoo', 'Kudafolhudhoo', 'Kudafolhudhoo is a resort island in Alif Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kudafolhudhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kudafolhudhoo'
  and p.node_type = 'location' and p.slug = 'alif-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kudafunafaru', 'Kudafunafaru', 'Kudafunafaru is a resort island in Noonu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kudafunafaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kudafunafaru'
  and p.node_type = 'location' and p.slug = 'noonu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vakarufalhi', 'Vakarufalhi', 'Vakarufalhi is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vakarufalhi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vakarufalhi'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'helengeli', 'Helengeli', 'Helengeli is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'helengeli'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'helengeli'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'lobigili', 'Lobigili', 'Lobigili is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'lobigili'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'lobigili'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'sangeli', 'Sangeli', 'Sangeli is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'sangeli'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'sangeli'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'ailafushi', 'Ailafushi', 'Ailafushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'ailafushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'ailafushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maadhoo', 'Maadhoo', 'Maadhoo is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maadhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maadhoo'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'reethi-rah', 'Reethi Rah', 'Reethi Rah is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'reethi_rah'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'reethi-rah'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'konotta', 'Konotta', 'Konotta is a resort island in Gaafu Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'konotta'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'konotta'
  and p.node_type = 'location' and p.slug = 'gaafu-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maafushivaru', 'Maafushivaru', 'Maafushivaru is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maafushivaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maafushivaru'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'bolifushi', 'Bolifushi', 'Bolifushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'bolifushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'bolifushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'madhiriguraidhoo', 'Madhiriguraidhoo', 'Madhiriguraidhoo is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'madhiriguraidhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'madhiriguraidhoo'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'hadahaa', 'Hadahaa', 'Hadahaa is a resort island in Gaafu Alifu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'hadahaa'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'hadahaa'
  and p.node_type = 'location' and p.slug = 'gaafu-alifu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'fari-islands', 'Fari Islands', 'Fari Islands is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'fari_islands'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'fari-islands'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'maamutaa', 'Maamutaa', 'Maamutaa is a resort island in Gaafu Alifu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'maamutaa'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'maamutaa'
  and p.node_type = 'location' and p.slug = 'gaafu-alifu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'huruelhi', 'Huruelhi', 'Huruelhi is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'huruelhi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'huruelhi'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'meradhoo', 'Meradhoo', 'Meradhoo is a resort island in Gaafu Alifu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'meradhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'meradhoo'
  and p.node_type = 'location' and p.slug = 'gaafu-alifu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kudafares', 'Kudafares', 'Kudafares is a resort island in Laamu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kudafares'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kudafares'
  and p.node_type = 'location' and p.slug = 'laamu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'fonimagoodhoo', 'Fonimagoodhoo', 'Fonimagoodhoo is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'fonimagoodhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'fonimagoodhoo'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'filaidhoo', 'Filaidhoo', 'Filaidhoo is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'filaidhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'filaidhoo'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhigurah', 'Dhigurah', 'Dhigurah is a resort island in Gaafu Alifu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhigurah'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhigurah'
  and p.node_type = 'location' and p.slug = 'gaafu-alifu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'falhumaafushi', 'Falhumaafushi', 'Falhumaafushi is a resort island in Gaafu Alifu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'falhumaafushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'falhumaafushi'
  and p.node_type = 'location' and p.slug = 'gaafu-alifu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'mahaanaelhihuraa', 'Mahaanaelhihuraa', 'Mahaanaelhihuraa is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'mahaanaelhihuraa'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'mahaanaelhihuraa'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'orivaru', 'Orivaru', 'Orivaru is a resort island in Noonu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'orivaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'orivaru'
  and p.node_type = 'location' and p.slug = 'noonu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'funamadua', 'Funamadua', 'Funamadua is a resort island in Gaafu Alifu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'funamadua'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'funamadua'
  and p.node_type = 'location' and p.slug = 'gaafu-alifu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'horubadhoo', 'Horubadhoo', 'Horubadhoo is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'horubadhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'horubadhoo'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'embudu-finolhu', 'Embudu Finolhu', 'Embudu Finolhu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'embudu_finolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'embudu-finolhu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'mushimasgali', 'Mushimasgali', 'Mushimasgali is a resort island in Alif Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'mushimasgali'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'mushimasgali'
  and p.node_type = 'location' and p.slug = 'alif-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'furanafushi', 'Furanafushi', 'Furanafushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'furanafushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'furanafushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kanuhura', 'Kanuhura', 'Kanuhura is a resort island in Lhaviyani Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kanuhura'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kanuhura'
  and p.node_type = 'location' and p.slug = 'lhaviyani'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'iru-fushi', 'Iru Fushi', 'Iru Fushi is a resort island in Noonu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'iru_fushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'iru-fushi'
  and p.node_type = 'location' and p.slug = 'noonu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'medhufaru', 'Medhufaru', 'Medhufaru is a resort island in Noonu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'medhufaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'medhufaru'
  and p.node_type = 'location' and p.slug = 'noonu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'ismehela-hera', 'Ismehela Hera', 'Ismehela Hera is a resort island in Seenu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'ismehela_hera'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'ismehela-hera'
  and p.node_type = 'location' and p.slug = 'seenu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'nalaguraidhoo', 'Nalaguraidhoo', 'Nalaguraidhoo is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'nalaguraidhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'nalaguraidhoo'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'aloofushi', 'Aloofushi', 'Aloofushi is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'aloofushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'aloofushi'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'olhuveli', 'Olhuveli', 'Olhuveli is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'olhuveli'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'olhuveli'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'meedhuffushi', 'Meedhuffushi', 'Meedhuffushi is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'meedhuffushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'meedhuffushi'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'hembadhu', 'Hembadhu', 'Hembadhu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'hembadhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'hembadhu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'emboodhu-finolhu', 'Emboodhu Finolhu', 'Emboodhu Finolhu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'emboodhu_finolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'emboodhu-finolhu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'madivaru', 'Madivaru', 'Madivaru is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'madivaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'madivaru'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vakkaru', 'Vakkaru', 'Vakkaru is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vakkaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vakkaru'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'veligandu', 'Veligandu', 'Veligandu is a resort island in Alif Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'veligandu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'veligandu'
  and p.node_type = 'location' and p.slug = 'alif-alif'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vilamendhoo', 'Vilamendhoo', 'Vilamendhoo is a resort island in Alif Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vilamendhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vilamendhoo'
  and p.node_type = 'location' and p.slug = 'alif-dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'ithaafushi', 'Ithaafushi', 'Ithaafushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'ithaafushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'ithaafushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'miriandhoo', 'Miriandhoo', 'Miriandhoo is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'miriandhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'miriandhoo'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'uthurumafaru', 'Uthurumafaru', 'Uthurumafaru is a resort island in Raa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'uthurumafaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'uthurumafaru'
  and p.node_type = 'location' and p.slug = 'raa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'rannalhi', 'Rannalhi', 'Rannalhi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'rannalhi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'rannalhi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'dhigufinolhu', 'Dhigufinolhu', 'Dhigufinolhu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'dhigufinolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'dhigufinolhu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'giraavaru', 'Giraavaru', 'Giraavaru is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'giraavaru'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'giraavaru'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'embudu', 'Embudu', 'Embudu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'embudu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'embudu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'fihalhohi', 'Fihalhohi', 'Fihalhohi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'fihalhohi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'fihalhohi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'nakatchafushi', 'Nakatchafushi', 'Nakatchafushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'nakatchafushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'nakatchafushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'kuda-villingili', 'Kuda Villingili', 'Kuda Villingili is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'kuda_villingili'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'kuda-villingili'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'thiladhoo', 'Thiladhoo', 'Thiladhoo is a resort island in Baa Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'thiladhoo'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'thiladhoo'
  and p.node_type = 'location' and p.slug = 'baa'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'lankanfinolhu', 'Lankanfinolhu', 'Lankanfinolhu is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'lankanfinolhu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'lankanfinolhu'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'ziyaaraifushi', 'Ziyaaraifushi', 'Ziyaaraifushi is a resort island in Kaafu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'ziyaaraifushi'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'ziyaaraifushi'
  and p.node_type = 'location' and p.slug = 'kaafu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'vommuli', 'Vommuli', 'Vommuli is a resort island in Dhaalu Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'vommuli'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'vommuli'
  and p.node_type = 'location' and p.slug = 'dhaalu'
on conflict (id) do nothing;

insert into nodes (node_type, slug, title, summary, status, published_at)
values ('location', 'fesdu', 'Fesdu', 'Fesdu is a resort island in Alif Alif Atoll, Maldives.', 'published', now())
on conflict (node_type, slug) do nothing;

insert into locations (id, location_type, parent_id, path, is_inhabited)
select n.id, 'island', p.id, (p_loc.path || 'fesdu'::ltree), false
from nodes n, nodes p join locations p_loc on p_loc.id = p.id
where n.node_type = 'location' and n.slug = 'fesdu'
  and p.node_type = 'location' and p.slug = 'alif-alif'
on conflict (id) do nothing;

-- Accommodations
-- Aaaveee-Natures-Paradise
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'aaaveee-natures-paradise-island-resort-maldives', 'Aaaveee Nature''s Paradise Island Resort Maldives', 'Come to the Maldives'' most environmentally friendly resort ever built. Nature''s at the core of this gorgeous island in Dhaalu Atoll. The island is a tiny 8 hectare treasure located on the northern portion of Dhaalu Atoll with a short 40 minute seaplane flight and step onto this amazing island in the Maldives.', 'published', 'Aaaveee Nature''s Paradise Island Resort Maldives | Maldives Resorts | MTG', 'Come to the Maldives'' most environmentally friendly resort ever built. Nature''s at the core of this gorgeous island in Dhaalu Atoll. The island is a tiny 8 hectare treasure located on the northern portion of Dhaalu Atoll with a short 40 minute seaplane flight and step onto this amazing island in the Maldives.', '{"overview_paragraphs":["Come to the Maldives'' most environmentally friendly resort ever built. Nature''s at the core of this gorgeous island in Dhaalu Atoll. The island is a tiny 8 hectare treasure located on the northern portion of Dhaalu Atoll with a short 40 minute seaplane flight and step onto this amazing island in the Maldives.","A discovery in nature Maldivian Retreat presenting the true original Maldivian way of life in private retreats back in 1972, when Maldives tourism first began. Come to the Maldives'' most environmentally friendly resort ever built. Nature''s Paradise has it all, whether it''s a house reef, foliage, a lagoon, or anything... It''s your resort, your island, your life, and your universe. The only true Maldivian hideaway, regarded as the best \"Nature Discovery Island Resort\" in the world.","Aaaveee Nature''s Paradise is located in the northwestern section of Dhaalu atoll, about 35 minutes by seaplane from Velana International Airport. It is also 25 kilometers north of the projected Kudahuvadhoo domestic airport and 25 kilometers south of Maamigili International Airport. It is a quick 20-minute speedboat ferry or ride from Kudahuvadhoo airport.","Aaaveee Nature''s Paradise has 33 eco-friendly rooms and three types of lodging that are unique to Aaaveee Nature''s Paradise.","If traveling within 6 months of the wedding date, they will receive a fruit basket with a bottle of wine and a bed decoration. At the time of check-in, the Resort may request a copy of the wedding certificate.","If you stay at aaaVeee Nature''s Paradise on the anniversary date, you will receive a cake with a bottle of wine and a bed decoration. At the time of check-in, the Resort may request a copy of the wedding certificate."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 437, 'Yp51yOrPzpA', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'aaaveee-natures-paradise-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'aaaveee-natures-paradise-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'dhoores'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'aaaveee-natures-paradise-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deck Villa', 437, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'aaaveee-natures-paradise-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 543, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'aaaveee-natures-paradise-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Adaaran-Hudhuranfushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'adaaran-select-hudhuran-fushi-island-resort-maldives', 'Adaaran Select Hudhuran Fushi Island Resort Maldives', 'Adaaran Select Hudhuranfushi offers an unforgettable tropical vacation. The Island of White Gold, blessed with abundant vegetation and clean seas, is located in quiet isolation in the North Male Atoll. Set on 83 acres of beautiful tropical beach property on Kani Beach on Lhohifushi Island, the resort''s architecture allows it to fit in as one of the top resorts in Maldives. Discover a secret paradise where the sun rises to paint the skies in deep orange colours and the gentle waves of the Indian Ocean caress the coastline with elegance.', 'published', 'Adaaran Select Hudhuran Fushi Island Resort Maldives | Maldives Resorts | MTG', 'Adaaran Select Hudhuranfushi offers an unforgettable tropical vacation. The Island of White Gold, blessed with abundant vegetation and clean seas, is located in quiet isolation in the North Male Atoll. Set on 83 acres of beautiful tropical beach property on Kani Beach on Lhohifushi Island, the resort''s architecture allows it to fit in as one of the top resorts in Maldives. Discover a secret paradise where the sun rises to paint the skies in deep orange colours and the gentle waves of the Indian Ocean caress the coastline with elegance.', '{"overview_paragraphs":["Adaaran Select Hudhuranfushi offers an unforgettable tropical vacation. The Island of White Gold, blessed with abundant vegetation and clean seas, is located in quiet isolation in the North Male Atoll. Set on 83 acres of beautiful tropical beach property on Kani Beach on Lhohifushi Island, the resort''s architecture allows it to fit in as one of the top resorts in Maldives. Discover a secret paradise where the sun rises to paint the skies in deep orange colours and the gentle waves of the Indian Ocean caress the coastline with elegance.","Note: This hotel has different rates for diferrent season and this may not be the updated rates as we do not use Hotel PMS software.","The 165 air-conditioned villas are outfitted with modern facilities, exquisite furniture, and tropical-themed décor. Enjoy a slice of paradise at the 37 Ocean Villas, which radiate a world of elegance and luxury while also providing a plethora of exclusive amenities. The air-conditioned villas provide contemporary facilities as well as a private sun deck with 24-hour access to the surrounding ocean."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 320, 'DDBNdhpfmHk', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'adaaran-select-hudhuran-fushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'adaaran-select-hudhuran-fushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'lhohifushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'adaaran-select-hudhuran-fushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 320, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'adaaran-select-hudhuran-fushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Villa', 600, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'adaaran-select-hudhuran-fushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Adaaran-Select
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'adaaran-select-meedhupparu-island-resort-maldives', 'Adaaran Select Meedhupparu Island Resort Maldives', 'Adaaran Select Meedhupparu, one of the greatest resorts in Maldives, offers heavenly accommodation for the discriminating tourist to the Maldives with the promise of an exceptional experience in the tropics. Bask in the healing sun and take in the tempting sights and sounds of a really wonderful tropical island. Adaaran Select Meedhupparu provides calm settings that are oozing with elegance. Set your sights on a vacation filled with stunning adventures that will leave you with memories to last a lifetime.', 'published', 'Adaaran Select Meedhupparu Island Resort Maldives | Maldives Resorts | MTG', 'Adaaran Select Meedhupparu, one of the greatest resorts in Maldives, offers heavenly accommodation for the discriminating tourist to the Maldives with the promise of an exceptional experience in the tropics. Bask in the healing sun and take in the tempting sights and sounds of a really wonderful tropical island. Adaaran Select Meedhupparu provides calm settings that are oozing with elegance. Set your sights on a vacation filled with stunning adventures that will leave you with memories to last a lifetime.', '{"overview_paragraphs":["Adaaran Select Meedhupparu, one of the greatest resorts in Maldives, offers heavenly accommodation for the discriminating tourist to the Maldives with the promise of an exceptional experience in the tropics. Bask in the healing sun and take in the tempting sights and sounds of a really wonderful tropical island. Adaaran Select Meedhupparu provides calm settings that are oozing with elegance. Set your sights on a vacation filled with stunning adventures that will leave you with memories to last a lifetime.","Adaaran Select Meedhupparu - Premium All Inclusive- Premium All Inclusive is located in the Maldives'' Ra Atoll and offers large bungalows with views of the beach and ocean. The resort also has an outdoor swimming pool, specialty spa services, and 5 dining options.","Each beach cottage has a private bathroom and a balcony with sun loungers. A minibar is available for a cost, as well as a tea and coffee machine.","At the water sports centre, guests may learn to dive. There are recreation amenities accessible, such as a workout centre, beach volleyball, and snorkelling.","The resort''s main restaurant has a breakfast, lunch, and supper buffet with Asian and Western cuisines, with beverages available at four bars.","Adaaran Select Meedhupparu - Premium All Inclusive is a 45-minute picturesque sea plane flight from Malé International Airport."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 356, '1JV3MeBgVFs', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'adaaran-select-meedhupparu-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'adaaran-select-meedhupparu-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'meedhupparu'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'adaaran-select-meedhupparu-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Villa', 356, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'adaaran-select-meedhupparu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa With Jaccuzi', 775, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'adaaran-select-meedhupparu-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Adaaran-Vadoo
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'adaaran-prestige-vadoo-island-resort-maldives', 'Adaaran Prestige Vadoo Island Resort Maldives', 'Adaaran Prestige Vadoo is a premium Maldives Island resort that was named the World''s Leading Water Villa Retreat at the World Travel Awards in 2010. Only the mesmerising lushness of the surroundings can equal the list of luxuries that await you at our Maldives Island resort.', 'published', 'Adaaran Prestige Vadoo Island Resort Maldives | Maldives Resorts | MTG', 'Adaaran Prestige Vadoo is a premium Maldives Island resort that was named the World''s Leading Water Villa Retreat at the World Travel Awards in 2010. Only the mesmerising lushness of the surroundings can equal the list of luxuries that await you at our Maldives Island resort.', '{"overview_paragraphs":["Adaaran Prestige Vadoo is a premium Maldives Island resort that was named the World''s Leading Water Villa Retreat at the World Travel Awards in 2010. Only the mesmerising lushness of the surroundings can equal the list of luxuries that await you at our Maldives Island resort.","Note: This hotel has different rates for diferrent season and this may not be the updated rates as we do not use Hotel PMS software.","Adaaran Prestige Vadoo is a luxury resort in the Maldives with 50 water villas, six of which are inspired by classic Japanese design and embody the distinctive Nihon values of elegant simplicity blended with controlled grandeur. Each house is perched on blue waves, providing unrivalled access to the huge Indian Ocean.","Sun, sand, and surf are some of the most prized features of a Maldives vacation, and the lovely island of Vadoo does not disappoint with immaculate beaches and shimmering waters beneath the radiance of exquisite tropical sky. Adaaran Prestige Vadoo is easily accessible by speedboat from the international airport, with the quick water voyage taking only 15 minutes in a picturesque southerly direction."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 620, '-diTGI7I0PI', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'adaaran-prestige-vadoo-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'adaaran-prestige-vadoo-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'vadoo'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'adaaran-prestige-vadoo-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Jacuzzi Water Villa', 620, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'adaaran-prestige-vadoo-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Alila-Kothaifaru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'alila-kothaifaru-maldives-island-resort', 'Alila Kothaifaru Maldives Island Resort', 'Relax in calm privacy with breathtaking views at this all-pool-villa retreat. Our 11.2 acre private island getaway is located in Raa Atoll, on the northern tip of the Maldives, and is accessible by a breathtaking 45-minute seaplane flight from Malé. Lush foliage, azure waterways, and an abundance of marine life set the stage for a relaxed visit punctuated by adventure.', 'published', 'Alila Kothaifaru Maldives Island Resort | Maldives Resorts | MTG', 'Relax in calm privacy with breathtaking views at this all-pool-villa retreat. Our 11.2 acre private island getaway is located in Raa Atoll, on the northern tip of the Maldives, and is accessible by a breathtaking 45-minute seaplane flight from Malé. Lush foliage, azure waterways, and an abundance of marine life set the stage for a relaxed visit punctuated by adventure.', '{"overview_paragraphs":["Relax in calm privacy with breathtaking views at this all-pool-villa retreat. Our 11.2 acre private island getaway is located in Raa Atoll, on the northern tip of the Maldives, and is accessible by a breathtaking 45-minute seaplane flight from Malé. Lush foliage, azure waterways, and an abundance of marine life set the stage for a relaxed visit punctuated by adventure.","The resort''s tiered pavilions and villas are seamlessly incorporated into the landscape and mix solitude with openness to the outdoors in a unique expression of minimalist beauty. Each of the resort''s 44 beachfront villas and 36 overwater villas has a private pool and has contemporary furnishings in a palette of relaxing colours with natural textures. These vast hideaways have been thoughtfully placed to give complete seclusion and comfort in an understated, classy manner.","Each of the resort''s 44 beachfront villas and 36 overwater villas has a private pool for your enjoyment and is designed for calm relaxation in harmony with nature. These roomy hideaways are thoughtfully positioned to give seclusion and comfort in modest, classy design, with contemporary décor in a palette of calming colours and natural textures.","Our 11.2 acre private island getaway is located on the northernmost tip of the Maldives, in the Raa Atoll, and is accessible by a picturesque 45-minute seaplane flight from Malé."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 950, 'iSxvRiuoJ80', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'alila-kothaifaru-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'alila-kothaifaru-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'kothaifaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'alila-kothaifaru-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 950, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'alila-kothaifaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Lagoon Water Villa', 1050, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'alila-kothaifaru-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Alimathaa
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'nakai-alimathaa-island-resort-maldives', 'Nakai Alimathaa Island Resort Maldives', 'Alimathà originally meant "woman''s face." The island, as seen from above, now has the shape of a heart with a beach of fine white sand that goes deep into the Maldives sea. It is bordered by a stunning and colourful coral reef that is home to hundreds of different fish species. Alimathà is the ideal combination of relaxation on a white sand beach and physical activity, with dozens of sporting activities available on the island.', 'published', 'Nakai Alimathaa Island Resort Maldives | Maldives Resorts | MTG', 'Alimathà originally meant "woman''s face." The island, as seen from above, now has the shape of a heart with a beach of fine white sand that goes deep into the Maldives sea. It is bordered by a stunning and colourful coral reef that is home to hundreds of different fish species. Alimathà is the ideal combination of relaxation on a white sand beach and physical activity, with dozens of sporting activities available on the island.', '{"overview_paragraphs":["Alimathà originally meant \"woman''s face.\" The island, as seen from above, now has the shape of a heart with a beach of fine white sand that goes deep into the Maldives sea. It is bordered by a stunning and colourful coral reef that is home to hundreds of different fish species. Alimathà is the ideal combination of relaxation on a white sand beach and physical activity, with dozens of sporting activities available on the island.","Through our daily excursions, you can explore the surrounding islands and immerse yourself in the cultural beauty of the Maldives. Cocogiri is your private gateway to tropical paradise, located only 18 minutes by seaplane or 60 minutes by speed boat from Male International Airport.","The 96 Beach Bungalows are arranged around the full ring of the island and front right onto Alimathà''s beautiful coral beach. From your deck, you can gaze out at the horizon through the trunks and leaves of the palms, and you''ll only need a few steps to reach the beach, where you may dive into the sea or simply relax in the sun.","The 34 Over Water of Alimathà, which faces true north, opens up in a fan that rotates at sunrise and sunset. They are located in the quietest part of the island and are surrounded by an environment of calm and tranquillity. The Over Water is an excellent choice for taking in the beauty of the horizon while relaxing on a comfortable sun lounger on your private balcony.","Alimathà offers three distinct types of rooms to its guests, ranging from the Over Water viewing the ocean to the Beach Bungalows just steps from the beach, to the Garden Villa surrounded by flora. Choose the one that best suits you and let yourself to be whisked away by Alimathà''s enchantment.","Alimathà Maldives is located in Vaavu atoll, 65 kilometres from Velana International Airport, and may be reached by a 20-minute seaplane ride or an hour and a half by speed boat. Surrounding the island are fantastic dive sites so gorgeous that they have been included to the government-sanctioned list of protected dive sites, including exquisite beaches and crystal clear waters, which serve as the daily backdrop for this small slice of paradise."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 320, 'jOZq8S7pJzA', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'nakai-alimathaa-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'nakai-alimathaa-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'alimatha'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'nakai-alimathaa-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 320, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'nakai-alimathaa-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Bungalow', 350, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'nakai-alimathaa-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Amari-Havodda
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'amari-havodda-maldives-island-resort', 'Amari Havodda Maldives Island Resort', 'situated on a quiet private island 400 kilometres south of Male, in the Gaafu Dhaalu Atoll, an Indian Ocean paradise Amari Havodda Maldives is a secluded refuge with tropical flora, crystal-clear blue seas, and white sandy beaches. This pristine refuge is all yours, allowing you to completely unplug and rejuvenate on your own terms.', 'published', 'Amari Havodda Maldives Island Resort | Maldives Resorts | MTG', 'situated on a quiet private island 400 kilometres south of Male, in the Gaafu Dhaalu Atoll, an Indian Ocean paradise Amari Havodda Maldives is a secluded refuge with tropical flora, crystal-clear blue seas, and white sandy beaches. This pristine refuge is all yours, allowing you to completely unplug and rejuvenate on your own terms.', '{"overview_paragraphs":["situated on a quiet private island 400 kilometres south of Male, in the Gaafu Dhaalu Atoll, an Indian Ocean paradise Amari Havodda Maldives is a secluded refuge with tropical flora, crystal-clear blue seas, and white sandy beaches. This pristine refuge is all yours, allowing you to completely unplug and rejuvenate on your own terms.","Our interiors have been meticulously created to provide a welcoming home-away-from-home experience. We''ve tweaked the décor to highlight modern workmanship at every turn - a modern reimagining of the traditional Maldivian house. Our resort also provides a diverse range of recreational and athletic activities, as well as unique dining experiences under the stars.","Welcome to your personal haven, your own bit of bliss. Our magnificent villas at Amari Havodda Maldives are warm, stylish, and homey. Your beach or overwater retreat boasts natural timber floors, towering palm-thatched roofs, beautiful furniture, an outdoor open-air shower, and modern technology inspired by traditional Maldivian architecture and created within a concept of natural simplicity.","Our resort is located in the Indian Ocean on a private island 400 kilometres south of Male in the Gaafu Dhaalu Atoll. Amari Havodda is accessible through a 55-60 minute domestic air transfer."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 480, 'Gg2E1SAp9HY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'amari-havodda-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'amari-havodda-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'havodda'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'amari-havodda-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Deluxe Beach Villa', 480, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'amari-havodda-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunrise Beach Pool Villa', 700, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'amari-havodda-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Over Water Villa', 700, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'amari-havodda-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Amaya-Resort
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'amaya-kuda-rah-island-resort-maldives', 'Amaya Kuda Rah Island Resort Maldives', 'Enter an island paradise where the ocean begs you to live and love at one of the Maldives'' greatest luxury resorts. Dive into an underwater wonderland at the neighbouring Kuda Rah Thila, celebrate romance on a sunset boat, and find inner joy at our spa; come experience Amaya Kuda Rah''s real emotional welcome.', 'published', 'Amaya Kuda Rah Island Resort Maldives | Maldives Resorts | MTG', 'Enter an island paradise where the ocean begs you to live and love at one of the Maldives'' greatest luxury resorts. Dive into an underwater wonderland at the neighbouring Kuda Rah Thila, celebrate romance on a sunset boat, and find inner joy at our spa; come experience Amaya Kuda Rah''s real emotional welcome.', '{"overview_paragraphs":["Enter an island paradise where the ocean begs you to live and love at one of the Maldives'' greatest luxury resorts. Dive into an underwater wonderland at the neighbouring Kuda Rah Thila, celebrate romance on a sunset boat, and find inner joy at our spa; come experience Amaya Kuda Rah''s real emotional welcome.","You may visit our resort all year round. You may encounter overcast skies and rain showers from May to October, since this is considered our low season, but you may take advantage of some excellent deals during this time. From December through April, the island enjoys bright sky.","As you relax in dreamlike peace at Amaya Kuda Rah, let the beauty of the Maldives soak through every inch of their rooms. Their expansive villas and suites have been deliberately constructed to provide you with unparalleled enjoyment during your stay. Sunbathe on hardwood terraces, relax in your private plunge pool, or retire to your room for some well-deserved slumber.","The facility, located 94 kilometres south of Velana International Airport, features large villas with private pools, as well as a full-service spa and wellness centre. Amaya Kuda Rah may be reached by seaplane in 25 minutes. A 15-minute speedboat journey from this pier will take you to your beautiful little sanctuary of joy. Furthermore, Amaya Kuda Rah is just minutes away from the well-known diving location of Kuda Rah Thila, which is home to an abundance of marine life."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 240, '24h6vGDC5gs', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'amaya-kuda-rah-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'amaya-kuda-rah-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'kuda-rah'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'amaya-kuda-rah-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 240, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'amaya-kuda-rah-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Pool Water Villa', 390, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'amaya-kuda-rah-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Amilla-Fushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'amilla-fushi-island-resort-maldives', 'Amilla Fushi Island Resort Maldives', 'Explore one of the Maldives'' largest and most expansive five-star resorts. With just 67 villas with spacious outside spaces and individual plunge pools, you can experience the luxury of space. Over 70% of our island is unspoiled forest with stunning white sand beaches. The only footfall you hear are your own. Our Maldives private island resort is fortunate to be positioned in the UNESCO World Biosphere Reserve of Baa Atoll. Hanifaru Bay, which hosts the world''s greatest aggregations of manta rays, beckons divers and snorkelers. Sustainability and wellbeing are key to our Considerate Collection of Small Luxury Hotels.', 'published', 'Amilla Fushi Island Resort Maldives | Maldives Resorts | MTG', 'Explore one of the Maldives'' largest and most expansive five-star resorts. With just 67 villas with spacious outside spaces and individual plunge pools, you can experience the luxury of space. Over 70% of our island is unspoiled forest with stunning white sand beaches. The only footfall you hear are your own. Our Maldives private island resort is fortunate to be positioned in the UNESCO World Biosphere Reserve of Baa Atoll. Hanifaru Bay, which hosts the world''s greatest aggregations of manta rays, beckons divers and snorkelers. Sustainability and wellbeing are key to our Considerate Collection of Small Luxury Hotels.', '{"overview_paragraphs":["Explore one of the Maldives'' largest and most expansive five-star resorts. With just 67 villas with spacious outside spaces and individual plunge pools, you can experience the luxury of space. Over 70% of our island is unspoiled forest with stunning white sand beaches. The only footfall you hear are your own. Our Maldives private island resort is fortunate to be positioned in the UNESCO World Biosphere Reserve of Baa Atoll. Hanifaru Bay, which hosts the world''s greatest aggregations of manta rays, beckons divers and snorkelers. Sustainability and wellbeing are key to our Considerate Collection of Small Luxury Hotels.","The private villas at Amilla Maldives Resort and Residence are located on sandy, sun-drenched coastlines that extend out over the lagoon. Each is a quiet enclave where elegance meets calm, a monument to the sky and water.","Amilla Maldives, a small island less than one kilometre long, rises on the outskirts of the Baa Atoll, home to some of the Maldives'' finest seas and a biosphere reserve designated as a UNESCO World Heritage site since 2011. Arrive at your Baa Atoll Maldives resort in 30 minutes by seaplane from Malé or 10 minutes by speedboat from Dharavandhoo Airport."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 1380, '9vdcB98lF6E', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'amilla-fushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'amilla-fushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'amilla-fushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'amilla-fushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 1590, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'amilla-fushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Water Villa', 1380, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'amilla-fushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Angaga-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'angaga-island-resort-spa-maldives', 'Angaga Island Resort & Spa Maldives', 'The Angaga Island resort and spa is located in the heart of Ari Atoll''s south. South Ari Atoll is well renowned for its abundant marine life and excellent diving opportunities. The island is bordered by white powdery sandy beaches, a crystal clear water lagoon, and a house reef teeming with colourful fish species, making it a snorkelling and diving paradise. The island is roughly 42372 square metres in size. The island is around 85 kilometres from Male airport and takes about 25 minutes to arrive by seaplane.', 'published', 'Angaga Island Resort & Spa Maldives | Maldives Resorts | MTG', 'The Angaga Island resort and spa is located in the heart of Ari Atoll''s south. South Ari Atoll is well renowned for its abundant marine life and excellent diving opportunities. The island is bordered by white powdery sandy beaches, a crystal clear water lagoon, and a house reef teeming with colourful fish species, making it a snorkelling and diving paradise. The island is roughly 42372 square metres in size. The island is around 85 kilometres from Male airport and takes about 25 minutes to arrive by seaplane.', '{"overview_paragraphs":["The Angaga Island resort and spa is located in the heart of Ari Atoll''s south. South Ari Atoll is well renowned for its abundant marine life and excellent diving opportunities. The island is bordered by white powdery sandy beaches, a crystal clear water lagoon, and a house reef teeming with colourful fish species, making it a snorkelling and diving paradise. The island is roughly 42372 square metres in size. The island is around 85 kilometres from Male airport and takes about 25 minutes to arrive by seaplane.","Your house surrounded by tropical trees, turquoise and crystal clear blue seas to stare up on where the sun always smiles. The main jetty provides access to the resort''s excellent house reef for snorkelling. Keep an eye out for schools of snappers, soldierfish, batfish, and other species. Stingrays, sharks, and turtles frequent the reef, and you are extremely likely to see them when snorkelling or diving near it.","Because Angaga Island Resort & Spa is located in the heart of South Ari Atoll in the Maldives, it is a popular diving destination, and many visitors come year after year. Angaga has 50 freestanding beach bungalows, 20 water villas built on stilts over the lagoon, and another 20 premium water villas that were just erected.","Angaga Island Resort is located in the heart of South Ari Atoll, on a tiny island of 320 x 160 metres that can be accessed by seaplane in 25 minutes from Velana International Airport. Because of its handy location, it is simple to combine the tranquillity of the island with a few days of sightseeing in the surrounding town."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 250, 'p21Ix-mticw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'angaga-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'angaga-island-resort-spa-maldives'
  and l.node_type = 'location' and l.slug = 'angaga'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'angaga-island-resort-spa-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Bungalow', 250, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'angaga-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Bungalow', 350, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'angaga-island-resort-spa-maldives'
on conflict (accommodation_id, name) do nothing;

-- Angsana-Velavaru
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'angsana-velavaru-island-resort-maldives', 'Angsana Velavaru Island Resort Maldives', 'Angsana Velavaru (known as "Turtle Island" in the local Dhivehi language) is perched on an expansive private lagoon in the virtually untouched South Nilandhe Atoll in the Maldives, and is just a 40-minute seaplane journey from Velana International Airport. It is surrounded by sparkling turquoise waters and ocean views as far as the eye can see.', 'published', 'Angsana Velavaru Island Resort Maldives | Maldives Resorts | MTG', 'Angsana Velavaru (known as "Turtle Island" in the local Dhivehi language) is perched on an expansive private lagoon in the virtually untouched South Nilandhe Atoll in the Maldives, and is just a 40-minute seaplane journey from Velana International Airport. It is surrounded by sparkling turquoise waters and ocean views as far as the eye can see.', '{"overview_paragraphs":["Angsana Velavaru (known as \"Turtle Island\" in the local Dhivehi language) is perched on an expansive private lagoon in the virtually untouched South Nilandhe Atoll in the Maldives, and is just a 40-minute seaplane journey from Velana International Airport. It is surrounded by sparkling turquoise waters and ocean views as far as the eye can see.","Angsana Velavaru is a wonderful island destination playground, with 5 All-Inclusive Packages intended to cater to different types of vacationers. Angsana''s All-Inclusive Concept presents a new kind of intrepid travel in the Maldives allowing you to enjoy the very best of #AngsanaMoments during your stay, from gourmet foodies to family travellers, spa enthusiasts, novice and expert divers. Take advantage of the opportunity and enter the uplifting world of Angsana Velavaru, the ideal destination playground for a wonderful year-round tropical holiday.","The 79 island villas and 34 In Ocean Villas are nestled in Velavaru Lagoon, offering amazing views and direct access to the Indian Ocean.","Angsana Velavaru is partly on the crystal blue waters of the Maldivian ocean and half on the white sandy beaches of the South Nilandhe Atoll to capture the finest of both worlds. Velana International Airport is 45 minutes distant via seaplane."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 700, 'G9Q7xzdH5AU', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'angsana-velavaru-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'angsana-velavaru-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'velavaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'angsana-velavaru-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 700, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'angsana-velavaru-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Pool Villa', 739, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'angsana-velavaru-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Villa', 1230, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'angsana-velavaru-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Atmosphere-Kanifushi
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'atmosphere-kanifushi-island-resort-maldives', 'Atmosphere Kanifushi Island Resort Maldives', 'Escape to a private island retreat surrounded by blue Indian Ocean waves. The island''s two kilometres of beach and water homes have expansive living areas with exquisite décor. Our award-winning culinary experiences, along with exceptional service, are sure to impress even the most discriminating traveller, making it a standout among Maldives luxury resorts.', 'published', 'Atmosphere Kanifushi Island Resort Maldives | Maldives Resorts | MTG', 'Escape to a private island retreat surrounded by blue Indian Ocean waves. The island''s two kilometres of beach and water homes have expansive living areas with exquisite décor. Our award-winning culinary experiences, along with exceptional service, are sure to impress even the most discriminating traveller, making it a standout among Maldives luxury resorts.', '{"overview_paragraphs":["Escape to a private island retreat surrounded by blue Indian Ocean waves. The island''s two kilometres of beach and water homes have expansive living areas with exquisite décor. Our award-winning culinary experiences, along with exceptional service, are sure to impress even the most discriminating traveller, making it a standout among Maldives luxury resorts.","Our magnificent all-inclusive vacation package promises a relaxed, five-star resort experience. Offering premium wines and spirits, as well as buffet, fine dining, and theme night dining options, as well as a variety of experiences ranging from excursions and sunset fishing to snorkelling and non-motorized water sports.","A thrilling 35-minute seaplane trip from Malé''s International Airport takes you to the beautiful Kanifushi Island. The island is about 2 kilometres long and 90 metres broad, and it is covered with lush tropical flora and natural coral reefs. Kanifushi''s atmosphere will enchant you with its white sandy beaches, swaying palm trees, and lush tropical gardens. As the sun shines over the blue lake, time stands still. Under crystal pure waters, magical regions await exploration. Choose how you want to spend your days.","Atmosphere For guest solitude, Kanifushi Maldives provides 132 independent villas and suites separated by a few metres of tropical flora. All villas offer immediate access to the immaculate white beach and the stunning blue lagoon beyond, and are bordered by some of the region''s tallest coconut palms and lush tropical flora.","Kanifushi Island, located in the sparsely populated Lhaviyani Atoll, is roughly 2 km long and 90 metres broad, with beautiful green palm trees and blooming tropical flora surrounded by a big natural coral reef."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', 5, 800, 'Tm37BJAKfiw', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'atmosphere-kanifushi-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'atmosphere-kanifushi-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'kanifushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'atmosphere-kanifushi-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Beach Villa', 800, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'atmosphere-kanifushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Sunset Pool Villa', 1000, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'atmosphere-kanifushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 875, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'atmosphere-kanifushi-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Ayada
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'ayada-maldives-island-resort', 'Ayada Maldives Island Resort', 'Ayada Maldives, located on a lovely private island with pristine beaches and rich tropical flora, offers a really magnificent escape in true Maldivian style. Ayada Maldives is a wonderful choice because of its many restaurants, huge villas with private infinity pools, and our numerous award-winning AySpa. Our visitors may choose from a wide range of water sports, excursions, and other activities.', 'published', 'Ayada Maldives Island Resort | Maldives Resorts | MTG', 'Ayada Maldives, located on a lovely private island with pristine beaches and rich tropical flora, offers a really magnificent escape in true Maldivian style. Ayada Maldives is a wonderful choice because of its many restaurants, huge villas with private infinity pools, and our numerous award-winning AySpa. Our visitors may choose from a wide range of water sports, excursions, and other activities.', '{"overview_paragraphs":["Ayada Maldives, located on a lovely private island with pristine beaches and rich tropical flora, offers a really magnificent escape in true Maldivian style. Ayada Maldives is a wonderful choice because of its many restaurants, huge villas with private infinity pools, and our numerous award-winning AySpa. Our visitors may choose from a wide range of water sports, excursions, and other activities.","At Ayada Maldives, we have 8 outlets, each offering a different cuisine and unique dining experience, such as Teppanyaki, Mediterranean fine dining, and Asian delicacies. We use fresh organic ingredients from our garden and nearby farmers in each restaurant, which makes our meal genuine and wonderfully delicious. Ile de Joie, our over-water wine cellar, provides a one-of-a-kind wine and cheese experience. Our cooks are prepared to accommodate any dietary restrictions.","Ayada Maldives provides nine different types of luxury accommodation, all of which incorporate contemporary and traditional Maldivian design aspects. The stilted water villas have been carefully situated on the beautifully formed jetty to catch amazing views of the boundless horizon, whilst the beach villas provide an enclave of perfect seclusion and quiet only 30 steps from the Indian Ocean.","The magnificent and spacious 10 Garden Villas, 33 Beach Villas, 4 Beach Suites, 14 Sunset Beach Villas, 11 Sunset Lagoon Suites, 33 Ocean Villas, 14 Sunset Ocean Suites, 2 Sunset Family Suites, and Ayada Royal Suite are all tastefully designed and furnished to provide maximum privacy and utmost comfort.","Ayada Maldives is situated in the beautiful Gaafu Dhaalu Atoll in the country''s south. When passengers arrive at Velena (MLE), they are met by one of our airport personnel and brought to the domestic lounge, followed by the leaving domestic aircraft gate. The resort is merely a 55-minute domestic flight and a 50-minute speed boat ride from Male."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 670, 'CZGxcfCXJz0', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'ayada-maldives-island-resort'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'ayada-maldives-island-resort'
  and l.node_type = 'location' and l.slug = 'maguhdhuvaa'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'ayada-maldives-island-resort'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Garden Villa', 670, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'ayada-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Pool Villa', 850, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'ayada-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Ocean Villa', 1300, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'ayada-maldives-island-resort'
on conflict (accommodation_id, name) do nothing;

-- Baglioni-Resort
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'baglioni-island-resort-maldives', 'Baglioni Island Resort Maldives', 'Lose yourself in the expanse of the Indian Ocean, only to resurface peacefully under a palm tree. This is just one of the extraordinary experiences available at the Baglioni Resort Maldives. This amazing resort is bathed in tropical natural splendour and is dreamily dazzling on the island of Maagau in Dhaalu atoll.', 'published', 'Baglioni Island Resort Maldives | Maldives Resorts | MTG', 'Lose yourself in the expanse of the Indian Ocean, only to resurface peacefully under a palm tree. This is just one of the extraordinary experiences available at the Baglioni Resort Maldives. This amazing resort is bathed in tropical natural splendour and is dreamily dazzling on the island of Maagau in Dhaalu atoll.', '{"overview_paragraphs":["Lose yourself in the expanse of the Indian Ocean, only to resurface peacefully under a palm tree. This is just one of the extraordinary experiences available at the Baglioni Resort Maldives. This amazing resort is bathed in tropical natural splendour and is dreamily dazzling on the island of Maagau in Dhaalu atoll.","Baglioni Resort Maldives received outstanding recognitions at the World Luxury Hotel Awards (Continent Winner, Luxury Beach Resort Spa - Country Winner, Fine Dining Cuisine - Regional Winner) and the Luxury Lifestyle Awards in 2022. (Best Luxury Beach Hotel).","Luxury villas surrounded by lush tropical vegetation, blue seas, and velvety-soft white beaches. Accommodation designed with typical Italian attention to detail, employing materials and design approaches for maximum sustainability while maximising the natural surroundings and its all-encompassing beauty.","Baglioni Resort Maldives is drenched with tropical natural beauty and is dreamily resplendent on the island of Maagau in Dhaalu atoll, a 40-minute seaplane ride from Malé, the Maldives'' capital. Baglioni Resort Maldives was designed to minimise environmental impact, with sustainable materials and measures for maximum sustainability and efficiency. It is the ideal destination for an unforgettable stay between sport and relaxation, all complemented by a prestigious gastronomic offer for the most discerning international clientele.","From breakfast to after dinner, the Resort''s unique Italian cuisine will thrill the most discerning international clients. A pool bar and grill, three excellent restaurants serving gourmet cuisine, and a Kids'' Menu designed specifically for younger guests are available. Sophisticated aperitivi, wine tastings, and bespoke private dinners round out the menu.","Relax and revitalise the body and spirit with Maldivian tradition''s rich rituals. At the Baglioni SPA, your Italian paradise in the middle of nature, you may share beauty and health experiences with your loved ones. In addition, our visiting professional practitioner will assist you through your inner self awareness and holistic well-being: meditation, Kundalini yoga, stress reduction and chakra balancing, alternative medical treatments such as Acupuncture and Naturopathy."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 1180, '5d1Pp6Ky0-8', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'baglioni-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'baglioni-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'maagau'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'baglioni-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 1180, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'baglioni-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 1320, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'baglioni-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Bandos-Island
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'bandos-island-resort-maldives', 'Bandos Island Resort Maldives', 'The island of Bandos is located in the centre of the Indian Ocean. A picture-perfect sanctuary tucked away from the worries of everyday life. The stunning blue ocean, colourful plant life, and white sandy beaches immediately generate a sense of calm. From the time you arrive, you will experience the pleasant, attentive service that has earned Bandos the nickname "Island of Hospitality." We deliver the finest without having to travel any further, as we are only 10 minutes from the international airport.', 'published', 'Bandos Island Resort Maldives | Maldives Resorts | MTG', 'The island of Bandos is located in the centre of the Indian Ocean. A picture-perfect sanctuary tucked away from the worries of everyday life. The stunning blue ocean, colourful plant life, and white sandy beaches immediately generate a sense of calm. From the time you arrive, you will experience the pleasant, attentive service that has earned Bandos the nickname "Island of Hospitality." We deliver the finest without having to travel any further, as we are only 10 minutes from the international airport.', '{"overview_paragraphs":["The island of Bandos is located in the centre of the Indian Ocean. A picture-perfect sanctuary tucked away from the worries of everyday life. The stunning blue ocean, colourful plant life, and white sandy beaches immediately generate a sense of calm. From the time you arrive, you will experience the pleasant, attentive service that has earned Bandos the nickname \"Island of Hospitality.\" We deliver the finest without having to travel any further, as we are only 10 minutes from the international airport.","Bandos Maldives is well-known for being a family-friendly resort. You may unwind and enjoy yourself as your children have the time of their lives. Our medical facility, which is equipped with a hyperbaric and decompression chamber, has two doctors on call 24 hours a day, seven days a week for general and dive-related needs. We have numerous repeat customers that have been with us for over 20 years. We are also pleased to be one of the best rated hotels in the Maldives across all booking and review sites.","Bandos'' lodging options, which range from ultra-exclusive and magnificent Water Villas to regular rooms, clearly reflect the different interests and expectations of our guests.","Bandos Island, located 10 minutes from Velana International Airport, offers the finest without the burden of travelling further.","Bandos Maldives now offers an All Inclusive Package. Breakfast, lunch, and supper at the Gallery restaurant are included, as well as alcoholic and non-alcoholic beverages at the Sand Bar, Huvan, and Gallery restaurant. The bundle also includes a choice of sports and entertainment options. Enjoy a wonderful bargain vacation today on the white-sand beaches of Bandos, Maldives.","Everything at Orchid Spa is pleasurable: the energy of the pool, the calm of the tropical setting, the natural noises, the hot steam and sauna baths that enter the muscles and release stress. The quaint tiny hair salon offers Crème Baths, deep soothing head massages, hair conditioning treatments, and manicure services. Relax your body and mind with a wonderful massage at Orchid Spa while on vacation in Bandos. Spa''s private villas and cabanas provide intimacy and solitude."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 350, 'NXykEIVZthY', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'bandos-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'bandos-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'bandos'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'bandos-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Villa', 350, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'bandos-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 800, 'USD', 'King', 3, 1
from nodes where node_type = 'accommodation' and slug = 'bandos-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Water Villa', 910, 'USD', 'King', 3, 2
from nodes where node_type = 'accommodation' and slug = 'bandos-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- Banyan-Tree
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'banyan-tree-vabbinfaru-island-resort-maldives', 'Banyan Tree Vabbinfaru Island Resort Maldives', 'Step into a barefoot luxury tropical paradise where the sea meets the sky. Be enchanted by the all-natural beauty of Banyan Tree Vabbinfaru, set in the heart of North Male'' Atoll, just a 20-minute speedboat trip from Velana International Airport.', 'published', 'Banyan Tree Vabbinfaru Island Resort Maldives | Maldives Resorts | MTG', 'Step into a barefoot luxury tropical paradise where the sea meets the sky. Be enchanted by the all-natural beauty of Banyan Tree Vabbinfaru, set in the heart of North Male'' Atoll, just a 20-minute speedboat trip from Velana International Airport.', '{"overview_paragraphs":["Step into a barefoot luxury tropical paradise where the sea meets the sky. Be enchanted by the all-natural beauty of Banyan Tree Vabbinfaru, set in the heart of North Male'' Atoll, just a 20-minute speedboat trip from Velana International Airport.","Relax at the all-pool villas on this gorgeous island, which are set among swaying palm trees. Explore the colourful underwater world of the Maldives and the Indian Ocean on a luxury Catamaran. Set off on a delectable gastronomic adventure that will make your heart sing. Time-honored Asian-inspired therapies at the award-winning Banyan Tree Spa round off a completely refreshing vacation.","48 beautiful villas are set on a coral atoll in the Indian Ocean, surrounded by a white powdery beach. Banyan Tree Vabbinfaru villas all include one bedroom, an open patio, a manicured garden, and a private sundeck.","Banyan Tree Vabbinfaru is located in North Male'' Atoll, a 35-minute speedboat ride from Velana International Airport.","At the informal seaside Ilaafathi, where indigenous food is presented alongside worldwide favourites, indulge in unhurried gastronomic delights with barefoot eating. Naiboli Bar features breathtaking sunsets, delightful drinks, and Bodu Beru nights of energising dance performances.","Destination Dining is a one-of-a-kind experience that even the most seasoned traveller should enjoy. A private table accentuated with romantic accents, an expansive view of the Indian Ocean before you, and a star-filled sky overhead combine to provide a private dinner experience in Maldives to remember."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, 980, 'j1sbqolKVj4', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'banyan-tree-vabbinfaru-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'banyan-tree-vabbinfaru-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'vabbinfaru'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'banyan-tree-vabbinfaru-island-resort-maldives'
on conflict (id) do nothing;

insert into accommodation_rooms (accommodation_id, name, price_from, price_currency, bed_type, max_occupancy, sort_order)
select id, 'Beach Pool Villa', 980, 'USD', 'King', 3, 0
from nodes where node_type = 'accommodation' and slug = 'banyan-tree-vabbinfaru-island-resort-maldives'
on conflict (accommodation_id, name) do nothing;

-- COMO-Cocoa
insert into nodes (node_type, slug, title, summary, status, meta_title, meta_description, attributes, published_at)
values ('accommodation', 'como-cocoa-island-resort-maldives', 'COMO Cocoa Island Resort Maldives', 'COMO''s white-sand private island retreat in the Maldives is a small, intimate resort with 33 overwater villas overlooking a turquoise lagoon. At its core? The essence of relaxation – and an outstanding COMO Shambhala health resort.', 'published', 'COMO Cocoa Island Resort Maldives | Maldives Resorts | MTG', 'COMO''s white-sand private island retreat in the Maldives is a small, intimate resort with 33 overwater villas overlooking a turquoise lagoon. At its core? The essence of relaxation – and an outstanding COMO Shambhala health resort.', '{"overview_paragraphs":["COMO''s white-sand private island retreat in the Maldives is a small, intimate resort with 33 overwater villas overlooking a turquoise lagoon. At its core? The essence of relaxation – and an outstanding COMO Shambhala health resort.","Our one- to three-bedroom villas inhabit the gently curved shapes of indigenous ''dhoni'' boats, so you can stroll along wooden paths to your apartment."]}'::jsonb, now())
on conflict (node_type, slug) do nothing;

insert into accommodations (
  id, accommodation_type, star_rating, price_from, video_youtube_id, currency
)
select
  n.id, 'resort', null, null, '_XB8pI2cRwU', 'USD'
from nodes n where n.node_type = 'accommodation' and n.slug = 'como-cocoa-island-resort-maldives'
on conflict (id) do nothing;

insert into node_locations (node_id, location_id, relation)
select n.id, l.id, 'primary'
from nodes n, nodes l
where n.node_type = 'accommodation' and n.slug = 'como-cocoa-island-resort-maldives'
  and l.node_type = 'location' and l.slug = 'makunufushi'
on conflict (node_id, location_id) do nothing;

insert into bookable_products (id, booking_mode)
select id, 'inquiry' from nodes where node_type = 'accommodation' and slug = 'como-cocoa-island-resort-maldives'
on conflict (id) do nothing;
