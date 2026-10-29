import { getFishingContentUpdate } from "@/lib/i18n/fishing-content";
import { DE } from "@/lib/i18n/package-categories/de";
import { ES } from "@/lib/i18n/package-categories/es";
import { IT } from "@/lib/i18n/package-categories/it";
import { JA } from "@/lib/i18n/package-categories/ja";
import { RU } from "@/lib/i18n/package-categories/ru";
import type { PackageCategoryLocaleStrings } from "@/lib/i18n/package-categories/types";
import { ZH } from "@/lib/i18n/package-categories/zh";
import type { Locale } from "@/lib/i18n/locales";

const STRINGS: Partial<Record<Locale, PackageCategoryLocaleStrings>> = { de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

/** Translated package style pages (honeymoon, family, ...) -- null for English and any locale without them. */
/** Every locale the package style pages are translated into (hreflang, sitemap). */
export const PACKAGE_CATEGORY_LOCALES = Object.keys(STRINGS) as Locale[];

export function getPackageCategoryStrings(locale: Locale): PackageCategoryLocaleStrings | null {
  const base = STRINGS[locale];
  if (!base) return null;
  const update = getFishingContentUpdate(locale);
  if (!update) return base;
  return { ...base, categories: { ...base.categories, fishing: { ...base.categories.fishing, ...update.packagesFishing } } };
}
