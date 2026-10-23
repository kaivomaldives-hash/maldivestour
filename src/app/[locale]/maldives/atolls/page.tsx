import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { DESTINATION_STRINGS_LOCALES, getDestinationStrings } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getAtolls } from "@/lib/locations/repository";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 3940;

/**
 * Localized equivalent of src/app/maldives/atolls/page.tsx -- same atoll
 * card grid, with each atoll's translated name/URL (localizeCards) and
 * localized surrounding copy. UI-strings-only hub (no page_translations
 * row), same as the Travel Guide hub.
 */
function loadOrNotFound(locale: string): Locale {
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) return {};
  const h = getDestinationStrings(locale).atollsHub;
  const url = localizedCanonicalUrl(locale, "/maldives/atolls/");

  return {
    title: h.metaTitle,
    description: h.description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/atolls/", DESTINATION_STRINGS_LOCALES) },
    openGraph: { title: h.metaTitle, description: h.description, url, locale },
  };
}

export default async function LocaleAtollsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);

  const atolls = await getAtolls();
  const cards = await localizeCards(locale, atolls, "/maldives/atolls/");

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: s.nav.atolls }]}
        eyebrow={s.atollsHub.heroEyebrow}
        title={s.atollsHub.title}
        description={s.atollsHub.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {atolls.map((atoll) => {
            const card = cards.get(atoll.id)!;
            return (
              <li key={atoll.id}>
                <Link href={card.href} className={`${CARD_CLASS} block`}>
                  {atoll.heroImage && (
                    <div className={CARD_IMAGE_BLEED_CLASS}>
                      <MediaImage asset={atoll.heroImage} alt={card.title} aspectClassName="aspect-[16/10]" />
                    </div>
                  )}
                  <span className="text-lg font-medium text-ocean-900">{card.title}</span>
                  <p className="mt-1 text-sm text-neutral-600">
                    {s.atollsHub.inhabitedIslandsLabel}: {atoll.islandCount}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
