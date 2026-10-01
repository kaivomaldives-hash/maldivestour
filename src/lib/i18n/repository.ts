import "server-only";

import { cachedRead } from "@/lib/cache/cached-read";
import { createClient } from "@/lib/supabase/public";
import type { Locale } from "@/lib/i18n/locales";

export type PageKey =
  | "homepage"
  | "maldives-hub"
  | "activities-hub"
  | "fishing-hub"
  | "diving-hub"
  | "surfing-hub"
  | "packages-hub"
  | "stays-hub"
  | "travel-guide-hub";

export interface PageTranslation {
  pageKey: PageKey;
  locale: Locale;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  heroHeading: string | null;
  heroIntro: string | null;
  sections: Record<string, unknown>;
}

type PageTranslationRow = {
  page_key: PageKey;
  locale: Locale;
  slug: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  hero_heading: string | null;
  hero_intro: string | null;
  sections: Record<string, unknown>;
};

function pageTranslationOf(row: PageTranslationRow): PageTranslation {
  return {
    pageKey: row.page_key,
    locale: row.locale,
    slug: row.slug,
    title: row.title,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    heroHeading: row.hero_heading,
    heroIntro: row.hero_intro,
    sections: row.sections ?? {},
  };
}

/** Only ever returns a row when it's actually `published` -- RLS already
 * enforces this (the anon-key public client can't read draft rows at
 * all), so this is a query, not a moderation decision made in app code. */
async function getPageTranslationUncached(pageKey: PageKey, locale: Locale): Promise<PageTranslation | null> {
  if (locale === "en") return null; // English never has a translation row -- it *is* the canonical content.
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_translations")
    .select("page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections")
    .eq("page_key", pageKey)
    .eq("locale", locale)
    .maybeSingle<PageTranslationRow>();

  if (error || !data) return null;
  return pageTranslationOf(data);
}

export const getPageTranslation = cachedRead(getPageTranslationUncached, ["i18n:page-translation"], 900);

/** Which locales currently have a *published* translation for this page
 * -- drives hreflang alternates and the language switcher's fallback
 * decision. Never includes a locale whose row exists but isn't published. */
async function getPublishedLocalesForPageUncached(pageKey: PageKey): Promise<Locale[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("page_translations").select("locale").eq("page_key", pageKey).returns<Array<{ locale: Locale }>>();

  if (error || !data) return [];
  return data.map((row) => row.locale);
}

export const getPublishedLocalesForPage = cachedRead(getPublishedLocalesForPageUncached, ["i18n:page-locales"], 900);

export interface EntityTranslation {
  entityId: string;
  entityType: string;
  locale: Locale;
  slug: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  /** Full translated long-form HTML body (articles only) -- null for every
   * other entity type, which has no equivalent field to translate. */
  bodyHtml: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

type EntityTranslationRow = {
  entity_id: string;
  entity_type: string;
  locale: Locale;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  body_html: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

function entityTranslationOf(row: EntityTranslationRow): EntityTranslation {
  return {
    entityId: row.entity_id,
    entityType: row.entity_type,
    locale: row.locale,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    description: row.description,
    bodyHtml: row.body_html,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

const ENTITY_TRANSLATION_SELECT =
  "entity_id, entity_type, locale, slug, title, short_description, description, body_html, meta_title, meta_description";

/** A single entity's translation for one locale, published only (same
 * RLS-backed guarantee as getPageTranslation). Used by product/detail
 * pages once they adopt the [locale] tree -- see the final report's
 * "remaining work" section for which entity types still need this
 * wired in. */
async function getEntityTranslationUncached(entityId: string, locale: Locale): Promise<EntityTranslation | null> {
  if (locale === "en") return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select(ENTITY_TRANSLATION_SELECT)
    .eq("entity_id", entityId)
    .eq("locale", locale)
    .maybeSingle<EntityTranslationRow>();

  if (error || !data) return null;
  return entityTranslationOf(data);
}

export const getEntityTranslation = cachedRead(getEntityTranslationUncached, ["i18n:entity-translation"], 900);

/** Look up a translated entity by its localized slug -- the inverse of
 * getEntityTranslation, for resolving an incoming /de/malediven/... URL
 * back to the canonical entity id. */
async function getEntityIdByLocalizedSlugUncached(locale: Locale, slug: string): Promise<string | null> {
  if (locale === "en") return null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("translations").select("entity_id").eq("locale", locale).eq("slug", slug).maybeSingle<{ entity_id: string }>();

  if (error || !data) return null;
  return data.entity_id;
}

export const getEntityIdByLocalizedSlug = cachedRead(getEntityIdByLocalizedSlugUncached, ["i18n:entity-by-slug"], 900);

/** One query combining the above two -- resolves straight from a
 * locale+slug URL to the full translation row, for detail pages that need
 * both the entity id (to join the canonical, non-translatable fields) and
 * the translated content itself. */
async function getEntityTranslationBySlugUncached(locale: Locale, slug: string): Promise<EntityTranslation | null> {
  if (locale === "en") return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select(ENTITY_TRANSLATION_SELECT)
    .eq("locale", locale)
    .eq("slug", slug)
    .maybeSingle<EntityTranslationRow>();

  if (error || !data) return null;
  return entityTranslationOf(data);
}

export const getEntityTranslationBySlug = cachedRead(getEntityTranslationBySlugUncached, ["i18n:entity-translation-by-slug"], 900);

/** Batch form of getEntityTranslation -- used to localize a list of related
 * entities (e.g. an article's "related articles") without an N+1 query per
 * item. Entities with no translation in this locale are simply absent from
 * the returned map, never filled with English content under a false
 * pretense of being translated. */
async function getEntityTranslationsByIdsUncached(entityIds: string[], locale: Locale): Promise<Map<string, EntityTranslation>> {
  const result = new Map<string, EntityTranslation>();
  if (locale === "en" || entityIds.length === 0) return result;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("translations")
    .select(ENTITY_TRANSLATION_SELECT)
    .eq("locale", locale)
    .in("entity_id", entityIds)
    .returns<EntityTranslationRow[]>();

  if (error || !data) return result;
  for (const row of data) result.set(row.entity_id, entityTranslationOf(row));
  return result;
}

export const getEntityTranslationsByIds = cachedRead(getEntityTranslationsByIdsUncached, ["i18n:entity-translations-by-ids"], 900);

/** Which locales currently have a *published* translation for this entity
 * -- drives hreflang alternates on a translated detail page, same role as
 * getPublishedLocalesForPage. */
async function getPublishedLocalesForEntityUncached(entityId: string): Promise<Locale[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("translations").select("locale").eq("entity_id", entityId).returns<Array<{ locale: Locale }>>();

  if (error || !data) return [];
  return data.map((row) => row.locale);
}

export const getPublishedLocalesForEntity = cachedRead(getPublishedLocalesForEntityUncached, ["i18n:entity-locales"], 900);

/** Every (locale, slug) pair this entity has a published translation
 * under -- unlike getPublishedLocalesForPage/hreflangAlternates (built for
 * the fixed page_key pages, which share one path across every locale),
 * an entity's translated slug is genuinely different per locale, so
 * hreflang alternates for an entity detail page have to be built from
 * real per-locale slugs rather than one shared path pattern. */
async function getEntitySlugsByLocaleUncached(entityId: string): Promise<Array<{ locale: Locale; slug: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("translations").select("locale, slug").eq("entity_id", entityId).returns<Array<{ locale: Locale; slug: string }>>();

  if (error || !data) return [];
  return data;
}

export const getEntitySlugsByLocale = cachedRead(getEntitySlugsByLocaleUncached, ["i18n:entity-slugs-by-locale"], 900);
