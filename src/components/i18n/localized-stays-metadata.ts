import type { Metadata } from "next";

import { getTranslatedAccommodationBySlug } from "@/lib/accommodations/repository";
import { ACCOMMODATION_TYPE_SEGMENT } from "@/lib/accommodations/types";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { entityHreflangLanguages } from "@/lib/i18n/repository";
import { getStaysStrings, STAYS_STRINGS_LOCALES } from "@/lib/i18n/stays-strings";
import { canonicalUrl, hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

export type LocalizedStayType = "resort" | "hotel" | "guesthouse";

/** Same type check as the English loadAndVerify: a resort's translation
 * is only reachable under the resorts segment, never under hotels. */
export async function loadLocalizedStay(locale: string, type: LocalizedStayType, slug: string) {
  if (!isLocale(locale) || locale === "en") return null;
  const accommodation = await getTranslatedAccommodationBySlug(locale, slug);
  if (!accommodation || accommodation.accommodationType !== type) return null;
  return { locale: locale as Locale, accommodation };
}

export function isStaysLocale(locale: string): locale is Locale {
  return isLocale(locale) && locale !== "en" && STAYS_STRINGS_LOCALES.includes(locale);
}

export function localizedStaysHubMetadata(locale: string, englishPath: string, type?: LocalizedStayType): Metadata {
  if (!isStaysLocale(locale)) return {};
  const s = getStaysStrings(locale);
  const { metaTitle, description } = type ? s.directory[type] : { metaTitle: s.hub.metaTitle, description: s.hub.description };
  const url = localizedCanonicalUrl(locale, englishPath);
  return {
    title: metaTitle,
    description,
    alternates: { canonical: url, languages: hreflangAlternates(englishPath, STAYS_STRINGS_LOCALES) },
    openGraph: { title: metaTitle, description, url, locale },
  };
}

export async function localizedStayDetailMetadata(locale: string, type: LocalizedStayType, slug: string): Promise<Metadata> {
  const loaded = await loadLocalizedStay(locale, type, slug);
  if (!loaded) return {};
  const { accommodation } = loaded;
  const prefix = `/maldives/${ACCOMMODATION_TYPE_SEGMENT[type]}/`;

  const title = accommodation.metaTitle ?? accommodation.title;
  const description = accommodation.metaDescription ?? accommodation.summary ?? undefined;
  const url = canonicalUrl(localizeHubPath(loaded.locale, `${prefix}${accommodation.slug}/`));
  const languages = await entityHreflangLanguages(accommodation.id, accommodation.englishSlug, prefix);

  return { title, description, alternates: { canonical: url, languages }, openGraph: { title, description, url } };
}
