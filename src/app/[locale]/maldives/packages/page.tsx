import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PackageCard } from "@/components/packages/package-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getPageTranslation, getPublishedLocalesForPage } from "@/lib/i18n/repository";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { PACKAGE_CATEGORY_FALLBACK_IMAGES } from "@/lib/packages/category-images";
import { getFeaturedPackageViews } from "@/lib/packages/view-repository";
import { PACKAGE_CATEGORIES, type PackageCategorySlug } from "@/lib/packages/view-types";
import { hreflangAlternates, localizedCanonicalUrl } from "@/lib/seo/site";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 3690;

/**
 * Mirrors the real English packages hub's section structure
 * (src/components/packages/package-directory-page.tsx) in simplified
 * form -- same featured-packages query, same category list -- with only
 * the surrounding copy localized (getUiStrings().packagesHub). Package
 * titles themselves stay as their real, un-translated listing data.
 * Deliberately omits the full filter bar / search / pagination of the
 * English page (that machinery assumes English-only query params and
 * isn't worth re-localizing yet); this page links out to the English
 * listing for anyone who wants to filter. Category links point at plain
 * English URLs -- those verticals have no translated route yet (Task 19
 * §16/§29: never a fabricated URL for content that doesn't exist).
 * "Explore More" links use localizeHubPath per-item, so a sibling hub
 * that's since been translated (transfers, travel guide) automatically
 * gets its own real localized URL without this file needing to change
 * again later.
 */
type CategoryLabelKey =
  | "categoryLuxury"
  | "categoryFamily"
  | "categoryAdultsOnly"
  | "categoryLongStay"
  | "categoryBudget"
  | "categoryHoneymoon"
  | "categorySolo"
  | "categoryDiving"
  | "categoryFishing"
  | "categorySurfing"
  | "categoryLiveaboard";

const CATEGORY_LABEL_KEY: Record<PackageCategorySlug, CategoryLabelKey> = {
  luxury: "categoryLuxury",
  family: "categoryFamily",
  "adults-only": "categoryAdultsOnly",
  "long-stay": "categoryLongStay",
  budget: "categoryBudget",
  honeymoon: "categoryHoneymoon",
  solo: "categorySolo",
  diving: "categoryDiving",
  fishing: "categoryFishing",
  surfing: "categorySurfing",
  liveaboard: "categoryLiveaboard",
};

const EXPLORE_MORE_LINKS = [
  { href: "/maldives/resorts/", labelKey: "stays" },
  { href: "/maldives/activities/", labelKey: "activities" },
  { href: "/maldives/diving/", labelKey: "diving" },
  { href: "/maldives/transfers/", labelKey: "transfers" },
  { href: "/maldives/travel-guide/", labelKey: "travelGuide" },
] as const;

function exploreMoreHref(locale: Locale, href: string): string {
  return href === "/maldives/transfers/" || href === "/maldives/travel-guide/" ? localizeHubPath(locale, href) : href;
}

async function loadOrNotFound(locale: string) {
  if (!isLocale(locale) || locale === "en") notFound();
  const translation = await getPageTranslation("packages-hub", locale);
  if (!translation) notFound();
  return { locale: locale as Locale, translation };
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const translation = await getPageTranslation("packages-hub", locale);
  if (!translation) return {};

  const publishedLocales = await getPublishedLocalesForPage("packages-hub");
  const title = translation.metaTitle ?? translation.title;
  const description = translation.metaDescription ?? translation.title;
  const url = localizedCanonicalUrl(locale, "/maldives/packages/");

  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/maldives/packages/", publishedLocales) },
    openGraph: { title, description, url, locale },
  };
}

export default async function LocalePackagesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const { locale } = await loadOrNotFound(rawLocale);
  const ui = getUiStrings(locale);
  const h = ui.packagesHub;

  const featured = await getFeaturedPackageViews(8);

  return (
    <main>
      <PageHero
        breadcrumbs={[{ label: ui.breadcrumbHome, href: `/${locale}/` }, { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") }, { label: ui.nav.packages }]}
        eyebrow={h.heroEyebrow}
        title={h.title}
        description={h.description}
        image={PACKAGE_CATEGORY_FALLBACK_IMAGES.mainHub}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <section className="prose-sm max-w-none text-sm text-neutral-700">
          <p>{h.introP1}</p>
          <p className="mt-3">{h.introP2}</p>
          <p className="mt-3">
            <Link href="/maldives/packages/" className="font-medium text-maldives-600 hover:underline">
              {ui.nav.packages} (English) →
            </Link>
          </p>
        </section>

        {featured.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">{h.featuredTitle}</h2>
            <ul className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((pkg) => (
                <PackageCard key={pkg.slug} pkg={pkg} />
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{h.styleTitle}</h2>
          <nav aria-label="Package categories" className="mt-4 flex flex-wrap gap-2">
            {PACKAGE_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/maldives/packages/${c.slug}/`}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {h[CATEGORY_LABEL_KEY[c.slug]]}
              </Link>
            ))}
          </nav>
        </section>

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
