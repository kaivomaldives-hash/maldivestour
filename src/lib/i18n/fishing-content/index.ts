import { DE } from "@/lib/i18n/fishing-content/de";
import { ES } from "@/lib/i18n/fishing-content/es";
import { IT } from "@/lib/i18n/fishing-content/it";
import { JA } from "@/lib/i18n/fishing-content/ja";
import { RU } from "@/lib/i18n/fishing-content/ru";
import type { FishingContentUpdate, PageUpdate } from "@/lib/i18n/fishing-content/types";
import { ZH } from "@/lib/i18n/fishing-content/zh";
import type { Locale } from "@/lib/i18n/locales";

const UPDATES: Partial<Record<Locale, FishingContentUpdate>> = { de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

export function getFishingContentUpdate(locale: Locale): FishingContentUpdate | null {
  return UPDATES[locale] ?? null;
}

/** Applies a PageUpdate over a translated species/technique entry. */
export function applyPageUpdate<T extends { metaTitle: string; metaDescription: string; h1: string; faqs: Array<{ question: string; answer: string }> }>(
  base: T,
  update: PageUpdate | undefined,
): T {
  if (!update) return base;
  const { extraFaqs, metaTitle, metaDescription, h1, heroDescription, extraSections } = update;
  return {
    ...base,
    ...(metaTitle && { metaTitle }),
    ...(metaDescription && { metaDescription }),
    ...(h1 && { h1 }),
    ...(heroDescription && "heroDescription" in base && { heroDescription }),
    extraSections,
    faqs: [...base.faqs, ...extraFaqs],
  };
}
