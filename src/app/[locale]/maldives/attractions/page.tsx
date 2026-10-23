import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocalizedLinkPills, LocalizedPlaceGrid } from "@/components/i18n/localized-place-grid";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getAttractions } from "@/lib/attractions/repository";
import { ATTRACTION_SUPER_GROUP, type AttractionSuperGroup } from "@/lib/attractions/types";
import { DESTINATION_STRINGS_LOCALES, getDestinationStrings, labelFor } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4100;

/** Same three browse groups as the English directory
 * (ATTRACTION_SUPER_GROUP), in the same order. */
const GROUP_ORDER: AttractionSuperGroup[] = ["cultural", "natural", "marine"];

/**
 * Localized equivalent of src/components/attractions/attraction-directory-page.tsx
 * -- every attraction grouped by its browse group (cultural / natural /
 * marine), with translated names, summaries and URLs.
 */
function loadOrNotFound(locale: string): Locale {
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) return {};
  const h = getDestinationStrings(locale).attractionsHub;
  const url = localizedCanonicalUrl(locale, "/maldives/attractions/");

  return {
    title: h.metaTitle,
    description: h.description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/attractions/", DESTINATION_STRINGS_LOCALES) },
    openGraph: { title: h.metaTitle, description: h.description, url, locale },
  };
}

export default async function LocaleAttractionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);

  const { items: attractions } = await getAttractions({ pageSize: 200 });
  const cards = await localizeCards(locale, attractions, "/maldives/attractions/");
  const typeById = new Map(attractions.map((a) => [a.id, labelFor(s.attractionTypes, a.attractionType)]));
  const groupOf = (a: (typeof attractions)[number]) => (a.attractionType ? ATTRACTION_SUPER_GROUP[a.attractionType] : "cultural");

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: s.nav.attractions }]}
        eyebrow={s.attractionsHub.heroEyebrow}
        title={s.attractionsHub.title}
        description={s.attractionsHub.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm text-neutral-600">{s.attractionsHub.intro}</p>

        {GROUP_ORDER.map((group) => (
          <LocalizedPlaceGrid
            key={group}
            title={s.attractionGroups[group]}
            items={attractions.filter((a) => groupOf(a) === group)}
            cards={cards}
            subtitleFor={(id) => typeById.get(id) ?? null}
            showSummary
          />
        ))}

        <LocalizedLinkPills
          title={s.detail.exploreMoreTitle}
          links={[
            { href: localizeHubPath(locale, "/maldives/activities/"), label: ui.nav.activities },
            { href: localizeHubPath(locale, "/maldives/islands/"), label: s.nav.islands },
            { href: localizeHubPath(locale, "/maldives/travel-guide/"), label: ui.nav.travelGuide },
            { href: "/maldives/attractions/", label: s.detail.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}
