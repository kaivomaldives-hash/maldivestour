import type { Metadata } from "next";
import Link from "next/link";

import { TransferRouteCard } from "@/components/transfers/transfer-route-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHero } from "@/components/ui/page-hero";
import { getLocationBySlug } from "@/lib/locations/repository";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";
import { getTransferRoutes } from "@/lib/transfers/repository";
import type { TransferRouteSummary, TransferType } from "@/lib/transfers/types";

/**
 * Task 18: one shared implementation behind the 5 category landing pages
 * (airport/speedboat/resort/hotel/island) — each has genuinely distinct
 * copy and a genuinely distinct filtered subset of the real migrated
 * route data (never the same content re-skinned), but the fetch/render
 * shape is identical, so it lives once. A dedicated "Velana Airport
 * transfers" page was deliberately NOT built as a separate route: nearly
 * every migrated route already originates at Velana International
 * Airport, so /maldives/airport-transfers/ already serves that exact
 * search intent — a second page would be the near-duplicate-content
 * problem Task 18 explicitly warns against.
 */

export interface TransferCategoryConfig {
  slug: string;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  /** Filtered server-side via getTransferRoutes — use for a real column
   * the repository already supports (transfer type). */
  transferType?: TransferType;
  /** Post-fetch filter for criteria the repository doesn't expose as a
   * query option (e.g. destination.isInhabited) — applied after the
   * (already origin-scoped, and optionally transferType-scoped) fetch. */
  filter?: (route: TransferRouteSummary) => boolean;
  emptyMessage: string;
}

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

export async function TransferCategoryLandingPage({ config }: { config: TransferCategoryConfig }) {
  const velanaAirport = await getLocationBySlug("velana-international-airport");
  const fetched = velanaAirport
    ? await getTransferRoutes({ originLocationId: velanaAirport.id, transferType: config.transferType, pageSize: 100 })
    : { items: [] };
  const routes = config.filter ? fetched.items.filter(config.filter) : fetched.items;

  const faq = faqJsonLd(config.faqs);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Transfers", href: "/maldives/transfers/" }, { label: config.h1 }],
              `/maldives/${config.slug}`,
            ),
          ),
        }}
      />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Transfers", href: "/maldives/transfers/" }, { label: config.h1 }]}
        eyebrow={config.eyebrow}
        title={config.h1}
        description={config.intro}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {routes.length === 0 ? (
          <EmptyState title={config.emptyMessage} />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <TransferRouteCard key={route.id} route={route} />
            ))}
          </ul>
        )}

        {config.faqs.length > 0 && (
          <section className="mt-14 border-t border-neutral-200 pt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Common questions</h2>
            <dl className="mt-4 space-y-6">
              {config.faqs.map((faq) => (
                <div key={faq.question}>
                  <dt className="font-medium text-ocean-900">{faq.question}</dt>
                  <dd className="mt-1 text-sm text-neutral-700">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <Link href="/maldives/transfers/" className="text-sm font-medium text-maldives-600 hover:underline">
            ← All Maldives transfers
          </Link>
        </div>
      </div>
    </main>
  );
}
