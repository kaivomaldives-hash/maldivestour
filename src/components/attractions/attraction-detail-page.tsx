import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ActivityCard } from "@/components/activity/activity-card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { getActivitiesByLocation } from "@/lib/activities/repository";
import { getAttractionBySlug } from "@/lib/attractions/repository";
import { getArticleBySlug } from "@/lib/articles/repository";
import { articleHref } from "@/lib/articles/types";
import { breadcrumbJsonLd, canonicalUrl } from "@/lib/seo/site";

const ATTRACTION_TYPE_LABEL: Record<string, string> = {
  religious: "Religious site",
  museum: "Museum",
  monument: "Monument",
  park: "Park",
  beach: "Beach",
  market: "Market",
  landmark: "Landmark",
  infrastructure: "Landmark",
};

export async function attractionDetailMetadata(slug: string): Promise<Metadata> {
  const attraction = await getAttractionBySlug(slug);
  if (!attraction) return {};

  const title = `${attraction.title} | Maldives Attractions | MTG`;
  const description = attraction.summary ?? `${attraction.title}, a Maldives attraction.`;
  const url = canonicalUrl(`/maldives/attractions/${attraction.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

function touristAttractionJsonLd(attraction: NonNullable<Awaited<ReturnType<typeof getAttractionBySlug>>>) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: attraction.title,
    description: attraction.summary ?? undefined,
    image: attraction.heroImage ? [attraction.heroImage.storagePath] : undefined,
    address: attraction.island
      ? { "@type": "PostalAddress", addressLocality: attraction.island.title, addressCountry: "MV" }
      : undefined,
    url: canonicalUrl(`/maldives/attractions/${attraction.slug}`),
  };
}

export async function AttractionDetailPage({ slug }: { slug: string }) {
  const attraction = await getAttractionBySlug(slug);
  if (!attraction) notFound();

  const [activities, sourceArticle] = await Promise.all([
    attraction.island ? getActivitiesByLocation(attraction.island.id) : Promise.resolve([]),
    attraction.sourceArticleSlug ? getArticleBySlug(attraction.sourceArticleSlug) : Promise.resolve(null),
  ]);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([{ label: "Maldives", href: "/maldives/" }, { label: "Attractions", href: "/maldives/attractions/" }, { label: attraction.title }], "/maldives/attractions")) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd(attraction)) }} />

      <PageHero
        breadcrumbs={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Attractions", href: "/maldives/attractions/" },
          { label: attraction.title },
        ]}
        eyebrow="Attraction"
        title={attraction.title}
        description={attraction.summary ?? undefined}
        image={attraction.heroImage}
      />

      <div className={`${CONTAINER_CLASS} py-10 sm:py-14`}>
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          A physical attraction — not a bookable product. See activities below for trips and experiences nearby.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
          {attraction.attractionType && (
            <div>
              <dt className="text-neutral-500">Type</dt>
              <dd className="font-medium">{ATTRACTION_TYPE_LABEL[attraction.attractionType] ?? attraction.attractionType}</dd>
            </div>
          )}
          {attraction.island && (
            <div>
              <dt className="text-neutral-500">Island</dt>
              <dd className="font-medium">
                <Link href={`/maldives/islands/${attraction.island.slug}/`} className="hover:underline">
                  {attraction.island.title}
                </Link>
              </dd>
            </div>
          )}
          {attraction.atoll && (
            <div>
              <dt className="text-neutral-500">Atoll</dt>
              <dd className="font-medium">
                <Link href={`/maldives/atolls/${attraction.atoll.slug}/`} className="hover:underline">
                  {attraction.atoll.title}
                </Link>
              </dd>
            </div>
          )}
          {attraction.bestFor && (
            <div>
              <dt className="text-neutral-500">Best for</dt>
              <dd className="font-medium">{attraction.bestFor}</dd>
            </div>
          )}
        </dl>

        {attraction.body && (
          <section className="prose-sm mt-6 max-w-none text-sm text-neutral-700">
            <p>{attraction.body}</p>
          </section>
        )}

        {sourceArticle && (
          <p className="mt-6 text-sm text-neutral-600">
            Read more in{" "}
            <Link href={articleHref(sourceArticle)} className="text-maldives-600 hover:underline">
              {sourceArticle.title}
            </Link>
            .
          </p>
        )}

        {activities.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold text-ocean-900">Activities near {attraction.title}</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activities.slice(0, 6).map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More Maldives</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/attractions/", label: "All Attractions" },
              { href: "/maldives/activities/", label: "All Activities" },
              { href: "/maldives/travel-guide/", label: "Travel Guide" },
              ...(attraction.island ? [{ href: `/maldives/islands/${attraction.island.slug}/`, label: attraction.island.title }] : []),
            ].map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
