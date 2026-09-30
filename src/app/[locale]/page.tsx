import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CONTAINER_CLASS } from "@/components/ui/container";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getPageTranslation, getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

export const revalidate = 900;

async function loadOrNotFound(locale: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const translation = await getPageTranslation("homepage", locale);
  if (!translation) notFound(); // Not published yet -- never serve an English-content page under a locale URL.
  return { locale: locale as Locale, translation };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const translation = await getPageTranslation("homepage", locale);
  if (!translation) return {};

  const publishedLocales = await getPublishedLocalesForPage("homepage");
  const title = translation.metaTitle ?? translation.title;
  const description = translation.metaDescription ?? translation.heroIntro ?? "";
  const url = localizedCanonicalUrl(locale, "/");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/", publishedLocales) },
    openGraph: { title, description, url, locale },
  };
}

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const { locale, translation } = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);

  return (
    <main>
      <section className="bg-lagoon-50 py-16 sm:py-24">
        <div className={CONTAINER_CLASS}>
          <h1 className="text-4xl font-semibold tracking-tight text-ocean-900 sm:text-5xl">{translation.heroHeading ?? translation.title}</h1>
          {translation.heroIntro && <p className="mt-6 max-w-2xl text-lg text-neutral-700">{translation.heroIntro}</p>}
          <div className="mt-8">
            <Link
              href={`/${locale}/maldives/`}
              className="inline-flex items-center justify-center rounded-full bg-maldives-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-ocean-800"
            >
              {ui.nav.maldives}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
