-- Task 19: Multilingual SEO architecture -- schema foundation.
--
-- Two tables, not nine per-language duplicate content tables:
--
-- 1. translations: a localized representation of one existing entity
--    (activity, accommodation, location, article, category, package --
--    everything in this schema already shares the universal `nodes.id`
--    space, so a single FK covers all of them). The canonical English
--    content stays exactly where it already lives (nodes/activities/
--    accommodations/etc.) -- this table only ever adds an alternate-
--    language view on top, never a duplicate record.
--
-- 2. page_translations: localized copy for the handful of hand-curated
--    top-level landing pages (homepage, the /maldives hub, the
--    activities/fishing/diving/packages hubs) that aren't "an entity" in
--    the node graph -- there's no single nodes row a homepage hero
--    heading belongs to. Keyed by a small fixed page_key set instead of
--    an entity id.
--
-- Both carry an explicit translation_status so a page only ever becomes
-- indexable once it has real, reviewed content -- never publishing a
-- machine-draft or half-finished translation under a crawlable locale
-- URL (spec section 5).

create table translations (
  id                  uuid primary key default gen_random_uuid(),
  entity_id           uuid not null references nodes(id) on delete cascade,
  -- Denormalized copy of nodes.node_type at write time -- lets an admin
  -- listing/report query translation coverage without a join, at the
  -- cost of needing to stay in sync if a node's type ever changed (which
  -- this schema's node_type check constraint makes effectively never).
  entity_type         text not null,
  locale              text not null check (locale in ('en','de','fr','es','it','ru','zh','ja','ko')),
  slug                text not null,
  title               text not null,
  short_description   text,
  description         text,
  meta_title          text,
  meta_description    text,
  translation_status  text not null default 'draft' check (translation_status in ('draft','machine_draft','review_required','published')),
  translated_by        text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (entity_id, locale),
  unique (locale, slug)
);
create index translations_entity_idx on translations(entity_id);
create index translations_locale_status_idx on translations(locale, translation_status);

create table page_translations (
  id                  uuid primary key default gen_random_uuid(),
  -- Fixed, small set -- not a free-text key -- so a typo can't silently
  -- create an orphaned, unreachable translation row.
  page_key            text not null check (page_key in (
                         'homepage', 'maldives-hub', 'activities-hub', 'fishing-hub',
                         'diving-hub', 'surfing-hub', 'packages-hub', 'stays-hub',
                         'travel-guide-hub'
                       )),
  locale              text not null check (locale in ('en','de','fr','es','it','ru','zh','ja','ko')),
  slug                text not null,
  title               text not null,
  meta_title          text,
  meta_description    text,
  hero_heading        text,
  hero_intro          text,
  -- Flexible extra copy blocks (section headings, FAQ, card labels) that
  -- vary per page and don't warrant their own columns. Never used for
  -- anything that needs to be queried/filtered on -- structured content
  -- stays in real columns per this project's established convention.
  sections            jsonb not null default '{}'::jsonb,
  translation_status  text not null default 'draft' check (translation_status in ('draft','machine_draft','review_required','published')),
  translated_by        text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (page_key, locale),
  unique (locale, slug)
);
create index page_translations_locale_status_idx on page_translations(locale, translation_status);

create trigger translations_set_updated_at
  before update on translations
  for each row execute function set_updated_at();

create trigger page_translations_set_updated_at
  before update on page_translations
  for each row execute function set_updated_at();

-- RLS: identical shape to every other content table in this schema --
-- public read gated on published status, staff-only write.
alter table translations enable row level security;
create policy translations_public_read on translations for select
  using (translation_status = 'published');
create policy translations_staff_all on translations for all
  using (is_staff()) with check (is_staff());

alter table page_translations enable row level security;
create policy page_translations_public_read on page_translations for select
  using (translation_status = 'published');
create policy page_translations_staff_all on page_translations for all
  using (is_staff()) with check (is_staff());

grant select on translations, page_translations to anon;
grant select, insert, update, delete on translations, page_translations to authenticated;
grant select, insert, update, delete on translations, page_translations to service_role;
