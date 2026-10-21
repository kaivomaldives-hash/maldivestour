import type { Metadata } from "next";
import Link from "next/link";

import { TransferFilterBar } from "@/components/transfers/transfer-filter-bar";
import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { TransferRouteSearch } from "@/components/transfers/transfer-route-search";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { getAtolls } from "@/lib/locations/repository";
import type { MediaAsset } from "@/lib/media/types";
import { breadcrumbJsonLd, canonicalUrl, safeJsonLdStringify } from "@/lib/seo/site";
import { getTransferRoutes } from "@/lib/transfers/repository";
import type { SharedOrPrivate, TransferType } from "@/lib/transfers/types";

const MODE_VALUES = new Set<string>(["speedboat", "seaplane", "domestic_flight", "ferry", "private_yacht", "land_transfer"]);
const TYPE_VALUES = new Set<string>(["shared", "private"]);

export interface TransferCategorySearchParams {
  atoll?: string;
  mode?: string;
  type?: string;
}

/**
 * Task 20: one shared implementation behind the transfer-category landing
 * pages (airport/resort/hotel/island) plus speedboat-transfers. Each has
 * genuinely distinct copy and a genuinely distinct real subset of route
 * data — never the same content re-skinned. Since Task 20 §22, routes are
 * filtered by the real, non-exclusive transfer-category tags
 * (node_categories, group='transfer-category') rather than a single
 * transferType/isInhabited check, so a route genuinely appears on every
 * category page it qualifies for (e.g. airport AND resort AND island),
 * with no route duplicated in the underlying data. A dedicated "Velana
 * Airport transfers" page was deliberately NOT built as a separate route:
 * nearly every route originates at Velana International Airport, so
 * /maldives/airport-transfers/ already serves that exact search intent.
 */

export interface TransferCategoryConfig {
  slug: string;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  /** transfer-category slug (Task 20 §22): airport / resort-transfer /
   * hotel-transfer / island-transfer. */
  category?: string;
  /** Real transfer_type column filter — used only by speedboat-transfers,
   * which isn't a route-level category (a route can carry a speedboat
   * service alongside other service types). */
  transferType?: TransferType;
  emptyMessage: string;
  /** A real legacy image purpose-named for this category — never a
   * generic stock substitute. */
  heroImage?: MediaAsset;
}

const OTHER_CATEGORIES = [
  { slug: "airport-transfers", label: "Airport Transfers" },
  { slug: "resort-transfers", label: "Resort Transfers" },
  { slug: "hotel-transfers", label: "Hotel Transfers" },
  { slug: "island-transfers", label: "Island Transfers" },
  { slug: "speedboat-transfers", label: "Speedboat Transfers" },
];

export function transferCategoryMetadata(config: TransferCategoryConfig): Metadata {
  const url = canonicalUrl(`/maldives/${config.slug}`);
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: config.metaTitle, description: config.metaDescription, url },
  };
}

function faqJsonLd(faqs: TransferCategoryConfig["faqs"]) {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export async function TransferCategoryLandingPage({
  config,
  searchParams,
}: {
  config: TransferCategoryConfig;
  searchParams?: Promise<TransferCategorySearchParams>;
}) {
  const sp = (await searchParams) ?? {};
  const activeAtollSlug = sp.atoll;
  // The mode filter is hidden (and ignored) on speedboat-transfers, where
  // config.transferType already fixes the mode -- a visitor there can't
  // meaningfully pick a different one.
  const activeMode = !config.transferType && sp.mode && MODE_VALUES.has(sp.mode) ? (sp.mode as TransferType) : undefined;
  const activeType = sp.type && TYPE_VALUES.has(sp.type) ? (sp.type as SharedOrPrivate) : undefined;

  const atolls = await getAtolls();
  const activeAtoll = activeAtollSlug ? atolls.find((a) => a.slug === activeAtollSlug) : undefined;

  const fetched = await getTransferRoutes({
    category: config.category,
    transferType: config.transferType ?? activeMode,
    atollId: activeAtoll?.id,
    sharedOrPrivate: activeType,
    pageSize: 100,
  });
  const routes = fetched.items;
  const hasActiveFilters = Boolean(activeAtollSlug || activeMode || activeType);

  const currentParams = new URLSearchParams();
  if (sp.atoll) currentParams.set("atoll", sp.atoll);
  if (sp.mode) currentParams.set("mode", sp.mode);
  if (sp.type) currentParams.set("type", sp.type);

  const faq = faqJsonLd(config.faqs);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Transfers", href: "/maldives/transfers/" }, { label: config.h1 }],
              `/maldives/${config.slug}`,
            ),
          ),
        }}
      />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faq) }} />}

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Transfers", href: "/maldives/transfers/" }, { label: config.h1 }]}
        eyebrow={config.eyebrow}
        title={config.h1}
        description={config.intro}
        image={config.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <TransferRouteSearch />
        <TransferFilterBar
          basePath={`/maldives/${config.slug}/`}
          currentParams={currentParams}
          atolls={atolls}
          activeAtollSlug={activeAtollSlug}
          activeMode={activeMode}
          activeType={activeType}
          showMode={!config.transferType}
          resultCount={routes.length}
        />

        {routes.length === 0 ? (
          <div className="mt-6">
            <EmptyState title={hasActiveFilters ? "No transfer routes match these filters." : config.emptyMessage} />
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <TransferRouteCard key={route.id} route={route} />
            ))}
          </ul>
        )}

        <FaqSection faqs={config.faqs} title="Common questions" className="mt-14 border-t border-neutral-200 pt-10" />

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <p className="text-sm font-medium text-neutral-500">Browse other transfer types</p>
          <nav aria-label="Other transfer categories" className="mt-2 flex flex-wrap gap-2">
            {OTHER_CATEGORIES.filter((c) => c.slug !== config.slug).map((c) => (
              <Link
                key={c.slug}
                href={`/maldives/${c.slug}/`}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {c.label}
              </Link>
            ))}
          </nav>
          <Link href="/maldives/transfers/" className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:underline">
            ← All Maldives transfers
          </Link>
        </div>
      </div>
    </main>
  );
}
