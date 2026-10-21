import type { Metadata } from "next";
import Link from "next/link";

import { ActivityCard } from "@/components/activity/activity-card";
import { HubPageExtras } from "@/components/nodes/hub-page-extras";
import type { GalleryVideo } from "@/components/ui/video-gallery-section";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { FaqSection } from "@/components/ui/faq-section";
import { PageHero } from "@/components/ui/page-hero";
import { getNodeIdsByCategory, getCategoryBySlug } from "@/lib/categories/repository";
import { getActivities } from "@/lib/activities/repository";
import type { MediaAsset } from "@/lib/media/types";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, safeJsonLdStringify } from "@/lib/seo/site";
import { activityHref } from "@/lib/activities/types";

/**
 * Shared implementation behind the activity-category SEO landing pages
 * (snorkeling, excursions, sandbank tours, water sports, island hopping,
 * dolphin & whale watching) — same shape as
 * src/components/transfers/transfer-category-landing-page.tsx, one level
 * up from fishing/diving/surfing (which get a full dedicated vertical with
 * their own repository; these stay thin wrappers over the shared
 * /maldives/activities/ pool, filtered by the 'activity-category'
 * node_categories tag set in 20261107000100_activity_category_seo_pages).
 */

export interface ActivityCategoryConfig {
  slug: string;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  /** activity-category tag slug (matches the node inserted by the
   * migration above), used to resolve the real, explicitly-tagged
   * listings for this page. */
  category: string;
  emptyMessage: string;
  heroImage?: MediaAsset;
  /** Real, already-vetted YouTube videos on this exact topic (see
   * src/components/activity/activities-video-jsonld.ts) — omitted
   * entirely, never substituted, when nothing genuinely on-topic exists
   * yet. */
  videos?: ReadonlyArray<GalleryVideo>;
}

const OTHER_CATEGORIES = [
  { slug: "snorkeling", label: "Snorkeling" },
  { slug: "excursions", label: "Excursions" },
  { slug: "sandbank-tours", label: "Sandbank Tours" },
  { slug: "water-sports", label: "Water Sports" },
  { slug: "island-hopping", label: "Island Hopping" },
  { slug: "dolphin-whale-watching", label: "Dolphin & Whale Watching" },
  { slug: "sightseeing", label: "Sightseeing" },
];

export function activityCategoryMetadata(config: ActivityCategoryConfig): Metadata {
  const url = canonicalUrl(`/maldives/${config.slug}`);
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: config.metaTitle, description: config.metaDescription, url },
  };
}

function faqJsonLd(faqs: ActivityCategoryConfig["faqs"]) {
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

export async function ActivityCategoryLandingPage({ config }: { config: ActivityCategoryConfig }) {
  const category = await getCategoryBySlug(config.category, "activity-category");
  const nodeIds = category ? await getNodeIdsByCategory(category.id) : [];
  const activities = nodeIds.length > 0 ? (await getActivities({ nodeIds, pageSize: 100 })).items : [];

  const faq = faqJsonLd(config.faqs);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(
            breadcrumbJsonLd(
              [{ label: "Maldives", href: "/maldives/" }, { label: "Activities", href: "/maldives/activities/" }, { label: config.h1 }],
              `/maldives/${config.slug}`,
            ),
          ),
        }}
      />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faq) }} />}
      {activities.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLdStringify(
              itemListJsonLd(
                activities.map((a) => ({ title: a.title, href: activityHref(a), summary: a.summary })),
                "Service",
              ),
            ),
          }}
        />
      )}

      <PageHero
        breadcrumbs={[{ label: "Maldives", href: "/maldives/" }, { label: "Activities", href: "/maldives/activities/" }, { label: config.h1 }]}
        eyebrow={config.eyebrow}
        title={config.h1}
        description={config.intro}
        image={config.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        {activities.length === 0 ? (
          <EmptyState title={config.emptyMessage} />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </ul>
        )}

        <FaqSection faqs={config.faqs} title="Common questions" className="mt-14 border-t border-neutral-200 pt-10" />

        {category && (
          <HubPageExtras
            nodeId={category.id}
            galleryNodeIds={nodeIds}
            galleryTitle={config.h1}
            videos={config.videos}
            videoTitle={`${config.h1} — Videos`}
          />
        )}

        <div className="mt-10 border-t border-neutral-200 pt-6">
          <p className="text-sm font-medium text-neutral-500">Browse other activity types</p>
          <nav aria-label="Other activity categories" className="mt-2 flex flex-wrap gap-2">
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
          <Link href="/maldives/activities/" className="mt-4 inline-block text-sm font-medium text-maldives-600 hover:underline">
            ← All Maldives activities
          </Link>
        </div>
      </div>
    </main>
  );
}
