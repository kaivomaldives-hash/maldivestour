import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { FaqSection } from "@/components/ui/faq-section";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizedSiteHref, localizeHubPath } from "@/lib/i18n/hub-paths";
import { getPageTranslation, getPublishedLocalesForPage, localizedEntityHref } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { TRANSFER_CATEGORY_IMAGES } from "@/lib/transfers/category-images";
import { getTransferRoutes } from "@/lib/transfers/repository";
import type { TransferRouteSummary } from "@/lib/transfers/types";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 3790;

/**
 * Mirrors the real English transfers hub's section structure
 * (src/components/transfers/transfer-directory-page.tsx) in simplified
 * form -- same airport/resort/island category queries -- with only the
 * surrounding copy localized (getUiStrings().transfersHub). Route
 * titles themselves stay as their real listing data, but each card
 * links to that route's OWN translated URL when one exists for this
 * locale (via localizedEntityHref), falling back to the plain English
 * URL otherwise. Deliberately omits the speedboat-charter, car-transfer,
 * ferry-schedule, and how-it-works sections of the English page (those
 * are separate, un-translated verticals) -- this page links out to the
 * English hub for anyone who wants the full picture.
 */
const EXPLORE_MORE_LINKS = [
  { href: "/maldives/packages/", labelKey: "packages" },
  { href: "/maldives/activities/", labelKey: "activities" },
  { href: "/maldives/diving/", labelKey: "diving" },
  { href: "/maldives/travel-guide/", labelKey: "travelGuide" },
] as const;

function exploreMoreHref(locale: Locale, href: string): string {
  return localizedSiteHref(locale, href);
}

async function loadOrNotFound(locale: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const translation = await getPageTranslation("transfers-hub", locale);
  if (!translation) notFound();
  return { locale: locale as Locale, translation };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const translation = await getPageTranslation("transfers-hub", locale);
  if (!translation) return {};

  const publishedLocales = await getPublishedLocalesForPage("transfers-hub");
  const title = translation.metaTitle ?? translation.title;
  const description = translation.metaDescription ?? translation.title;
  const url = localizedCanonicalUrl(locale, "/maldives/transfers/");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/transfers/", publishedLocales) },
    openGraph: { title, description, url, locale },
  };
}

async function RouteCardList({ locale, routes }: { locale: Locale; routes: TransferRouteSummary[] }) {
  const hrefs = await Promise.all(routes.map((r) => localizedEntityHref(locale, r.id, r.slug, "/maldives/transfers/")));
  return (
    <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {routes.map((r, i) => (
        <li key={r.id} className={CARD_CLASS}>
          {r.heroImage && (
            <div className={CARD_IMAGE_BLEED_CLASS}>
              <MediaImage asset={r.heroImage} alt={r.title} aspectClassName="aspect-[16/10]" />
            </div>
          )}
          <Link href={hrefs[i]} className="text-lg font-medium text-ocean-900 hover:text-maldives-600">
            {r.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function LocaleTransfersHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const { locale } = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const h = ui.transfersHub;

  const [airportResult, resortResult, islandResult] = await Promise.all([
    getTransferRoutes({ category: "airport", pageSize: 6 }),
    getTransferRoutes({ category: "resort-transfer", pageSize: 6 }),
    getTransferRoutes({ category: "island-transfer", pageSize: 6 }),
  ]);

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: ui.nav.transfers }]}
        eyebrow={h.heroEyebrow}
        title={h.title}
        description={h.description}
        image={TRANSFER_CATEGORY_IMAGES.mainHub}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <section className="prose-sm max-w-none text-sm text-neutral-700">
          <p>{h.introP1}</p>
          <p className="mt-3">{h.introP2}</p>
          <p className="mt-3">
            <Link href="/maldives/transfers/" className="font-medium text-maldives-600 hover:underline">
              {ui.nav.transfers} (English) →
            </Link>
          </p>
        </section>

        {airportResult.items.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{h.airportSectionTitle}</h2>
            <RouteCardList locale={locale} routes={airportResult.items} />
          </section>
        )}

        {resortResult.items.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{h.resortSectionTitle}</h2>
            <RouteCardList locale={locale} routes={resortResult.items} />
          </section>
        )}

        {islandResult.items.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{h.islandSectionTitle}</h2>
            <RouteCardList locale={locale} routes={islandResult.items} />
          </section>
        )}

        <FaqSection faqs={h.faqs} title={h.faqTitle} className="mt-12 border-t border-neutral-200 pt-10" />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{h.exploreMoreTitle}</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {EXPLORE_MORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={exploreMoreHref(locale, link.href)}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {ui.nav[link.labelKey]}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
