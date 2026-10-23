import type { Metadata } from "next";
import Link from "next/link";

import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { localizeHubPath } from "@/lib/i18n/hub-paths";
import { getLinkLocalizer } from "@/lib/i18n/link-localizer";
import type { Locale } from "@/lib/i18n/locales";
import { getTransferCategoryStrings, TRANSFER_CATEGORY_LOCALES, TRANSFER_CATEGORY_SLUGS, type TransferCategorySlug } from "@/lib/i18n/transfer-categories";
import { getUiStrings } from "@/lib/i18n/ui-strings";
import { breadcrumbJsonLd, hreflangAlternates, localizedCanonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { TRANSFER_CATEGORY_IMAGES } from "@/lib/transfers/category-images";
import { getTransferRoutes } from "@/lib/transfers/repository";
import type { TransferType } from "@/lib/transfers/types";

/** The same route subset and hero photo per page as the English configs
 * (src/app/maldives/{slug}/page.tsx). */
const ROUTE_FILTER: Record<TransferCategorySlug, { category?: string; transferType?: TransferType; image: keyof typeof TRANSFER_CATEGORY_IMAGES }> = {
  "airport-transfers": { category: "airport", image: "airportTransfers" },
  "resort-transfers": { category: "resort-transfer", image: "resortTransfers" },
  "hotel-transfers": { category: "hotel-transfer", image: "hotelTransfers" },
  "island-transfers": { category: "island-transfer", image: "islandTransfers" },
  "speedboat-transfers": { transferType: "speedboat", image: "speedboatTransfers" },
};

export function localizedTransferCategoryMetadata(locale: Locale, slug: TransferCategorySlug): Metadata {
  const strings = getTransferCategoryStrings(locale);
  if (!strings) return {};
  const t = strings.categories[slug];
  const englishPath = `/maldives/${slug}/`;
  const url = localizedCanonicalUrl(locale, englishPath);
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: { canonical: url, languages: hreflangAlternates(englishPath, TRANSFER_CATEGORY_LOCALES) },
    openGraph: { title: t.metaTitle, description: t.metaDescription, url, locale },
  };
}

/**
 * The translated form of a transfer-category landing page (src/components/
 * transfers/transfer-category-landing-page.tsx): same routes and hero
 * photo, translated copy from src/lib/i18n/transfer-categories.ts, cards
 * linking to each route's translated page. Route search and the
 * atoll/mode filters stay on the English page, linked from here.
 */
export async function LocalizedTransferCategoryPage({ locale, slug }: { locale: Locale; slug: TransferCategorySlug }) {
  const strings = getTransferCategoryStrings(locale)!;
  const t = strings.categories[slug];
  const ui = getUiStrings(locale);
  const filter = ROUTE_FILTER[slug];

  const [routes, L] = await Promise.all([
    getTransferRoutes({ category: filter.category, transferType: filter.transferType, pageSize: 100 }).then((r) => r.items),
    getLinkLocalizer(locale),
  ]);

  const breadcrumbs = [
    { label: ui.breadcrumbHome, href: `/${locale}/` },
    { label: ui.nav.maldives, href: localizeHubPath(locale, "/maldives/") },
    { label: ui.nav.transfers, href: localizeHubPath(locale, "/maldives/transfers/") },
    { label: t.h1 },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: t.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd(breadcrumbs, localizeHubPath(locale, `/maldives/${slug}/`))) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd) }} />

      <PageHero breadcrumbs={breadcrumbs} eyebrow={t.eyebrow} title={t.h1} description={t.intro} image={TRANSFER_CATEGORY_IMAGES[filter.image]} />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm">
          <Link href={`/maldives/${slug}/`} hrefLang="en" className="font-medium text-maldives-600 hover:underline">
            {strings.filtersInEnglish} →
          </Link>
        </p>

        {routes.length === 0 ? (
          <div className="mt-6">
            <EmptyState title={t.emptyMessage} />
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <TransferRouteCard key={route.id} route={route} localize={L} />
            ))}
          </ul>
        )}

        <FaqSection faqs={t.faqs} title={ui.packagesHub.faqTitle} className="mt-14 border-t border-neutral-200 pt-10" />

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <p className="text-sm font-medium text-neutral-500">{strings.otherTypes}</p>
          <nav aria-label={strings.otherTypes} className="mt-2 flex flex-wrap gap-2">
            {TRANSFER_CATEGORY_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link
                key={s}
                href={L.href(`/maldives/${s}/`)}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {strings.categories[s].label}
              </Link>
            ))}
          </nav>
          <Link href={L.href("/maldives/transfers/")} className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:underline">
            ← {strings.allTransfers}
          </Link>
        </div>
      </div>
    </main>
  );
}
