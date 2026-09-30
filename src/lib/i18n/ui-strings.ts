import type { Locale } from "@/lib/i18n/locales";

/**
 * Navigation/CTA/breadcrumb copy — small, fixed, code-adjacent strings
 * that ship with the app rather than living in the translations table
 * (Task 19 §30-31). Every locale must have an entry; locales without a
 * real translation fall back to English rather than showing an empty
 * label, but only English/German are populated with genuine copy today
 * (see data/maldives/i18n/translation-status.json for rollout status).
 */
export interface UiStrings {
  nav: {
    maldives: string;
    stays: string;
    activities: string;
    diving: string;
    fishing: string;
    transfers: string;
    packages: string;
    travelGuide: string;
  };
  breadcrumbHome: string;
  ctaGetInTouch: string;
  languageSwitcherLabel: string;
  currencySwitcherLabel: string;
}

const EN: UiStrings = {
  nav: {
    maldives: "Maldives",
    stays: "Stays",
    activities: "Activities",
    diving: "Diving",
    fishing: "Fishing",
    transfers: "Transfers",
    packages: "Packages",
    travelGuide: "Travel Guide",
  },
  breadcrumbHome: "Home",
  ctaGetInTouch: "Get in touch",
  languageSwitcherLabel: "Language",
  currencySwitcherLabel: "Currency",
};

const DE: UiStrings = {
  nav: {
    maldives: "Malediven",
    stays: "Unterkünfte",
    activities: "Aktivitäten",
    diving: "Tauchen",
    fishing: "Angeln",
    transfers: "Transfer",
    packages: "Pakete",
    travelGuide: "Reiseführer",
  },
  breadcrumbHome: "Startseite",
  ctaGetInTouch: "Kontakt aufnehmen",
  languageSwitcherLabel: "Sprache",
  currencySwitcherLabel: "Währung",
};

const UI_STRINGS: Partial<Record<Locale, UiStrings>> = { en: EN, de: DE };

/** Falls back to English for any locale that doesn't have real copy yet
 * — never throws, never renders a blank label. */
export function getUiStrings(locale: Locale): UiStrings {
  return UI_STRINGS[locale] ?? EN;
}
