import Link from "next/link";
import { notFound } from "next/navigation";

import { AccommodationCard } from "@/components/accommodation/accommodation-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { ACCOMMODATION_TYPE_SEGMENT, type AccommodationType } from "@/lib/accommodations/types";
import { getAccommodationSeoLandingSpec } from "@/lib/accommodations/seo-landing-content";
import { getAccommodationSeoLandingResults } from "@/lib/accommodations/seo-landing-repository";
import { breadcrumbJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

const TYPE_LABEL: Record<AccommodationType, string> = {
  hotel: "Hotels",
  resort: "Resorts",
  guesthouse: "Guesthouses",
  villa: "Villas",
  liveaboard: "Liveaboards",
  other: "Accommodation",
};

/** A handful of real, well-known atolls to point readers toward for a more
 * local view of this same filter intent (e.g. "luxury resorts in Kaafu
 * Atoll") — the existing /maldives/atolls/[atoll]/ page is the canonical
 * landing page for that combination (it lists that atoll's own real
 * resorts/hotels directly), not a new near-duplicate route here. */
const FEATURED_ATOLL_LINKS = [
  { slug: "kaafu", title: "Kaafu Atoll" },
  { slug: "baa", title: "Baa Atoll" },
  { slug: "alif-dhaalu", title: "Alif Dhaalu Atoll" },
];

function faqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
  };
}

export async function AccommodationSeoLandingPage({ type, slug }: { type: AccommodationType; slug: string }) {
  const spec = getAccommodationSeoLandingSpec(type, slug);
  if (!spec) notFound();

  const segment = ACCOMMODATION_TYPE_SEGMENT[type];
  const label = TYPE_LABEL[type];
  const { items, total } = await getAccommodationSeoLandingResults(spec);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label, href: `/maldives/${segment}/` }, { label: spec.h1 }], `/maldives/${segment}/${slug}`),
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqJsonLd(spec.faqs)) }} />

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label, href: `/maldives/${segment}/` }, { label: spec.h1 }]}
        eyebrow={`Places to stay`}
        title={spec.h1}
        description={spec.intro}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-sm text-neutral-600">
          {total} {total === 1 ? label.toLowerCase().replace(/s$/, "") : label.toLowerCase()} found.{" "}
          <Link href={`/maldives/${segment}/`} className="underline">
            See all {label.toLowerCase()}
          </Link>
        </p>

        {items.length === 0 ? (
          <EmptyState title={`No ${label.toLowerCase()} match this yet`} description="Check back soon, or browse all accommodation below." />
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((accommodation) => (
              <AccommodationCard key={accommodation.id} accommodation={accommodation} />
            ))}
          </ul>
        )}

        <FaqSection faqs={spec.faqs} className="mt-14 border-t border-neutral-200 pt-10" />

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Browse by Atoll</h2>
          <p className="mt-2 text-sm text-neutral-700">Looking for {spec.h1.toLowerCase()} in a specific atoll? Start with one of these real atoll guides:</p>
          <nav aria-label="Browse by atoll" className="mt-4 flex flex-wrap gap-2">
            {FEATURED_ATOLL_LINKS.map((a) => (
              <Link key={a.slug} href={`/maldives/atolls/${a.slug}/`} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                {a.title}
              </Link>
            ))}
            <Link href="/maldives/atolls/" className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
              All Atolls
            </Link>
          </nav>
        </section>
      </div>
    </main>
  );
}
