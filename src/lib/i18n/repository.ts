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
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
  };
}

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
    .select("entity_id, entity_type, locale, slug, title, short_description, description, meta_title, meta_description")
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
