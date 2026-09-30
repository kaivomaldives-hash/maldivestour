-- Idempotent retry of 20250210000100_i18n_translations_schema.sql.
--
-- Diagnosed live: `translations` already existed in production with
-- exactly the columns this migration defines (confirmed via
-- information_schema.columns before writing this), meaning an earlier
-- attempt at 20250210000100 got partway through -- `create table
-- translations` succeeded, then something after it (a later `create
-- table`, index, trigger, or policy) hadn't been confirmed yet. Rather
-- than guess exactly where it stopped, every statement below is made
-- safe to re-run regardless: `if not exists` for tables/indexes, a
-- `drop ... if exists` before each trigger/policy (`create or replace`
-- doesn't apply to triggers or policies), and `grant` (already
-- idempotent -- re-granting is a no-op, never an error).
--
-- Never edit 20250210000100 itself -- this is a new, additive
-- corrective migration per this project's standing convention.

create table if not exists translations (
  id                  uuid primary key default gen_random_uuid(),
  entity_id           uuid not null references nodes(id) on delete cascade,
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
create index if not exists translations_entity_idx on translations(entity_id);
create index if not exists translations_locale_status_idx on translations(locale, translation_status);

create table if not exists page_translations (
  id                  uuid primary key default gen_random_uuid(),
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
  sections            jsonb not null default '{}'::jsonb,
  translation_status  text not null default 'draft' check (translation_status in ('draft','machine_draft','review_required','published')),
  translated_by        text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (page_key, locale),
  unique (locale, slug)
);
create index if not exists page_translations_locale_status_idx on page_translations(locale, translation_status);

drop trigger if exists translations_set_updated_at on translations;
create trigger translations_set_updated_at
  before update on translations
  for each row execute function set_updated_at();

drop trigger if exists page_translations_set_updated_at on page_translations;
create trigger page_translations_set_updated_at
  before update on page_translations
  for each row execute function set_updated_at();

alter table translations enable row level security;
drop policy if exists translations_public_read on translations;
create policy translations_public_read on translations for select
  using (translation_status = 'published');
drop policy if exists translations_staff_all on translations;
create policy translations_staff_all on translations for all
  using (is_staff()) with check (is_staff());

alter table page_translations enable row level security;
drop policy if exists page_translations_public_read on page_translations;
create policy page_translations_public_read on page_translations for select
  using (translation_status = 'published');
drop policy if exists page_translations_staff_all on page_translations;
create policy page_translations_staff_all on page_translations for all
  using (is_staff()) with check (is_staff());

grant select on translations, page_translations to anon;
grant select, insert, update, delete on translations, page_translations to authenticated;
grant select, insert, update, delete on translations, page_translations to service_role;
