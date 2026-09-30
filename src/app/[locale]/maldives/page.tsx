import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CONTAINER_CLASS } from "@/components/ui/container";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getPageTranslation, getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

export const revalidate = 900;

/**
 * Sections a visitor can go to from here. Each one falls back to the
 * plain English URL until its own /{locale}/... translation is
 * published (Task 19 §16/§29) — never a fabricated German URL for
 * content that doesn't exist yet. As more page_translations rows get
 * published, swap the relevant `href` to `/${locale}/...` the same way
 * the homepage link below already does.
 */
const SECTIONS: Array<{ labelKey: keyof ReturnType<typeof getUiStrings>["nav"]; englishHref: string }> = [
  { labelKey: "activities", englishHref: "/maldives/activities/" },
  { labelKey: "fishing", englishHref: "/maldives/fishing/" },
  { labelKey: "diving", englishHref: "/maldives/diving/" },
  { labelKey: "packages", englishHref: "/maldives/packages/" },
  { labelKey: "stays", englishHref: "/maldives/stays/" },
  { labelKey: "transfers", englishHref: "/maldives/transfers/" },
];

async function loadOrNotFound(locale: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const translation = await getPageTranslation("maldives-hub", locale);
  if (!translation) notFound();
  return { locale: locale as Locale, translation };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const translation = await getPageTranslation("maldives-hub", locale);
  if (!translation) return {};

  const publishedLocales = await getPublishedLocalesForPage("maldives-hub");
  const title = translation.metaTitle ?? translation.title;
  const description = translation.metaDescription ?? translation.heroIntro ?? "";
  const url = localizedCanonicalUrl(locale, "/maldives/");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/", publishedLocales) },
    openGraph: { title, description, url, locale },
  };
}

export default async function LocaleMaldivesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const { locale, translation } = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);

  return (
    <main>
      <section className="bg-lagoon-50 py-16">
        <div className={CONTAINER_CLASS}>
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-neutral-500">
            <Link href={`/${locale}/`} className="hover:text-ocean-900">
              {ui.breadcrumbHome}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ocean-900">{ui.nav.maldives}</span>
          </nav>
          <h1 className="text-3xl font-semibold tracking-tight text-ocean-900 sm:text-4xl">{translation.heroHeading ?? translation.title}</h1>
          {translation.heroIntro && <p className="mt-4 max-w-2xl text-lg text-neutral-700">{translation.heroIntro}</p>}
        </div>
      </section>

      <section className={`${CONTAINER_CLASS} py-12`}>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {SECTIONS.map((section) => (
            <li key={section.englishHref}>
              <Link
                href={section.englishHref}
                className="block rounded-lg border border-neutral-200 px-4 py-3 text-center font-medium text-ocean-900 transition-colors hover:border-maldives-600 hover:bg-lagoon-50"
              >
                {ui.nav[section.labelKey]}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-neutral-500">
          {/* Honest about the current rollout stage rather than silently mixing languages without explanation. */}
          {locale === "de"
            ? "Diese Bereiche sind derzeit nur auf Englisch verfügbar — weitere Übersetzungen folgen."
            : null}
        </p>
      </section>
    </main>
  );
}
