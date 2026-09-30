export const SUPPORTED_LOCALES = ["en", "de", "fr", "es", "it", "ru", "zh", "ja", "ko"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

/** Every locale except the default -- these are the ones that get a
 * `/xx/...` URL prefix and a `src/app/[locale]/...` route tree. English
 * stays unprefixed at the existing routes (Task 19 §2/§18). */
export const PREFIXED_LOCALES = SUPPORTED_LOCALES.filter((l) => l !== DEFAULT_LOCALE) as Exclude<Locale, "en">[];

export function isLocale(value: string): value is Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export const LOCALE_NAMES: Record<Locale, { name: string; nativeName: string }> = {
  en: { name: "English", nativeName: "English" },
  de: { name: "German", nativeName: "Deutsch" },
  fr: { name: "French", nativeName: "Français" },
  es: { name: "Spanish", nativeName: "Español" },
  it: { name: "Italian", nativeName: "Italiano" },
  ru: { name: "Russian", nativeName: "Русский" },
  zh: { name: "Chinese", nativeName: "中文" },
  ja: { name: "Japanese", nativeName: "日本語" },
  ko: { name: "Korean", nativeName: "한국어" },
};

/** Prepends the locale prefix for non-English locales; returns the path
 * unchanged for English, which is never prefixed. `path` must already be
 * a site-relative path starting with "/". */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized}`;
}
