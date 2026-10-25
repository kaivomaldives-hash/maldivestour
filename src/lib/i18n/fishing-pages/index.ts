import { applyPageUpdate, getFishingContentUpdate } from "@/lib/i18n/fishing-content";
import { DE } from "@/lib/i18n/fishing-pages/de";
import { ES } from "@/lib/i18n/fishing-pages/es";
import { IT } from "@/lib/i18n/fishing-pages/it";
import { JA } from "@/lib/i18n/fishing-pages/ja";
import { RU } from "@/lib/i18n/fishing-pages/ru";
import {
  FISHING_SPECIES_PAGE_SLUGS,
  FISHING_TECHNIQUE_PAGE_SLUGS,
  type FishingPagesLocaleStrings,
  type FishingSpeciesPageSlug,
  type FishingTechniquePageSlug,
} from "@/lib/i18n/fishing-pages/types";
import { ZH } from "@/lib/i18n/fishing-pages/zh";
import type { Locale } from "@/lib/i18n/locales";

const STRINGS: Partial<Record<Locale, FishingPagesLocaleStrings>> = { de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

/** Every locale the fishing species/technique pages are translated into (hreflang, sitemap). */
export const FISHING_PAGES_LOCALES = Object.keys(STRINGS) as Locale[];

export function getFishingPagesStrings(locale: Locale): FishingPagesLocaleStrings | null {
  const base = STRINGS[locale];
  if (!base) return null;
  const update = getFishingContentUpdate(locale);
  if (!update) return base;
  const species = { ...base.species };
  for (const slug of FISHING_SPECIES_PAGE_SLUGS) species[slug] = applyPageUpdate(base.species[slug], update.species[slug]);
  const techniques = { ...base.techniques };
  for (const slug of FISHING_TECHNIQUE_PAGE_SLUGS) techniques[slug] = applyPageUpdate(base.techniques[slug], update.techniques[slug]);
  return { ...base, species, techniques };
}

export function isFishingSpeciesPageSlug(slug: string): slug is FishingSpeciesPageSlug {
  return (FISHING_SPECIES_PAGE_SLUGS as readonly string[]).includes(slug);
}

export function isFishingTechniquePageSlug(slug: string): slug is FishingTechniquePageSlug {
  return (FISHING_TECHNIQUE_PAGE_SLUGS as readonly string[]).includes(slug);
}

export { FISHING_SPECIES_PAGE_SLUGS, FISHING_TECHNIQUE_PAGE_SLUGS, type FishingSpeciesPageSlug, type FishingTechniquePageSlug };
