import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { DESTINATION_STRINGS_LOCALES, getDestinationStrings } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { getAtolls, getIslandsByAtollId } from "@/lib/locations/repository";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 3980;

/**
 * Localized equivalent of src/app/maldives/islands/page.tsx. The English
 * directory is a paginated, searchable flat list; this one lists every
 * island at once, grouped under its (translated) atoll -- a few hundred
 * plain links, the same density as the English list, and a grouping that
 * reads naturally without a search box. Search itself stays on the
 * English page (linked), since searchLocations matches English names.
 */
function loadOrNotFound(locale: string): Locale {
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) return {};
  const h = getDestinationStrings(locale).islandsHub;
  const url = localizedCanonicalUrl(locale, "/maldives/islands/");

  return {
    title: h.metaTitle,
    description: h.description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/islands/", DESTINATION_STRINGS_LOCALES) },
    openGraph: { title: h.metaTitle, description: h.description, url, locale },
  };
}

export default async function LocaleIslandsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);

  const atolls = await getAtolls();
  const islandsByAtoll = await Promise.all(atolls.map((atoll) => getIslandsByAtollId(atoll.id)));
  const allIslands = islandsByAtoll.flat();
  const [atollCards, islandCards] = await Promise.all([
    localizeCards(locale, atolls, "/maldives/atolls/"),
    localizeCards(locale, allIslands, "/maldives/islands/"),
  ]);

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: s.nav.islands }]}
        eyebrow={s.islandsHub.heroEyebrow}
        title={s.islandsHub.title}
        description={s.islandsHub.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm">
          <Link href="/maldives/islands/" className="font-medium text-maldives-600 hover:underline">
            {s.islandsHub.searchInEnglish} →
          </Link>
        </p>

        {atolls.map((atoll, i) => {
          const islands = islandsByAtoll[i];
          if (islands.length === 0) return null;
          const atollCard = atollCards.get(atoll.id)!;
          return (
            <section key={atoll.id} className="mt-10">
              <h2 className="text-xl font-semibold text-ocean-900">
                <Link href={atollCard.href} className="hover:text-maldives-600">
                  {atollCard.title}
                </Link>
              </h2>
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
                {islands.map((island) => {
                  const card = islandCards.get(island.id)!;
                  return (
                    <li key={island.id}>
                      <Link href={card.href} className="text-sm text-ocean-900 hover:text-maldives-600 hover:underline">
                        {card.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
