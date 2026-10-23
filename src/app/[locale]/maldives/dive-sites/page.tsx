import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LocalizedLinkPills, LocalizedPlaceGrid } from "@/components/i18n/localized-place-grid";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getDiveSites } from "@/lib/diving/repository";
import { DESTINATION_STRINGS_LOCALES, getDestinationStrings, labelFor } from "@/lib/i18n/destination-strings";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { localizeCards } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4020;

/**
 * Localized equivalent of src/components/diving/dive-site-directory-page.tsx
 * -- every dive site grouped by its (translated) atoll instead of the
 * English page's type filter + pagination: there are few enough sites
 * that one grouped page shows them all.
 */
function loadOrNotFound(locale: string): Locale {
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) notFound();
  return locale;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en" || !DESTINATION_STRINGS_LOCALES.includes(locale)) return {};
  const h = getDestinationStrings(locale).diveSitesHub;
  const url = localizedCanonicalUrl(locale, "/maldives/dive-sites/");

  return {
    title: h.metaTitle,
    description: h.description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/dive-sites/", DESTINATION_STRINGS_LOCALES) },
    openGraph: { title: h.metaTitle, description: h.description, url, locale },
  };
}

export default async function LocaleDiveSitesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const s = getDestinationStrings(locale);

  const { items: sites } = await getDiveSites({ pageSize: 200 });
  const atolls = Array.from(new Map(sites.flatMap((site) => (site.atoll ? [[site.atoll.id, site.atoll] as const] : []))).values());
  const [siteCards, atollCards] = await Promise.all([
    localizeCards(locale, sites, "/maldives/dive-sites/"),
    localizeCards(locale, atolls, "/maldives/atolls/"),
  ]);
  const siteTypeById = new Map(sites.map((site) => [site.id, labelFor(s.siteTypes, site.siteType)]));
  const sortedAtolls = [...atolls].sort((a, b) => atollCards.get(a.id)!.title.localeCompare(atollCards.get(b.id)!.title, locale));

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: s.nav.diveSites }]}
        eyebrow={s.diveSitesHub.heroEyebrow}
        title={s.diveSitesHub.title}
        description={s.diveSitesHub.description}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm text-neutral-600">
          {s.diveSitesHub.intro}{" "}
          <Link href={localizeHubPath(locale, "/maldives/diving/")} className="font-medium text-maldives-600 hover:underline">
            {ui.nav.diving} →
          </Link>
        </p>

        {sortedAtolls.map((atoll) => (
          <LocalizedPlaceGrid
            key={atoll.id}
            title={atollCards.get(atoll.id)!.title}
            items={sites.filter((site) => site.atoll?.id === atoll.id)}
            cards={siteCards}
            subtitleFor={(id) => siteTypeById.get(id) ?? null}
          />
        ))}
        <LocalizedPlaceGrid
          title={s.nav.diveSites}
          items={sites.filter((site) => !site.atoll)}
          cards={siteCards}
          subtitleFor={(id) => siteTypeById.get(id) ?? null}
        />

        <LocalizedLinkPills
          title={s.detail.exploreMoreTitle}
          links={[
            { href: localizeHubPath(locale, "/maldives/diving/"), label: ui.nav.diving },
            { href: localizeHubPath(locale, "/maldives/atolls/"), label: s.nav.atolls },
            { href: localizeHubPath(locale, "/maldives/packages/"), label: ui.nav.packages },
            { href: "/maldives/dive-sites/", label: s.detail.englishVersionLink },
          ]}
        />
      </div>
    </main>
  );
}
