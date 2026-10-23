import { DE } from "@/lib/i18n/activity-categories/de";
import { ES } from "@/lib/i18n/activity-categories/es";
import { IT } from "@/lib/i18n/activity-categories/it";
import { JA } from "@/lib/i18n/activity-categories/ja";
import { RU } from "@/lib/i18n/activity-categories/ru";
import { ACTIVITY_CATEGORY_SLUGS, type ActivityCategoryLocaleStrings, type ActivityCategorySlug } from "@/lib/i18n/activity-categories/types";
import { ZH } from "@/lib/i18n/activity-categories/zh";
import type { Locale } from "@/lib/i18n/locales";

const STRINGS: Partial<Record<Locale, ActivityCategoryLocaleStrings>> = { de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

/** Every locale the activity-category landing pages are translated into (hreflang, sitemap). */
export const ACTIVITY_CATEGORY_LOCALES = Object.keys(STRINGS) as Locale[];

export function getActivityCategoryStrings(locale: Locale): ActivityCategoryLocaleStrings | null {
  return STRINGS[locale] ?? null;
}

export function isActivityCategorySlug(slug: string): slug is ActivityCategorySlug {
  return (ACTIVITY_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export { ACTIVITY_CATEGORY_SLUGS, type ActivityCategorySlug };
