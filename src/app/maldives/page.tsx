import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { IslandCard } from "@/components/locations/island-card";
import { MapPinIcon } from "@/components/ui/icons";
import { SearchBox } from "@/components/search/search-box";
import { CARD_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { MediaImage } from "@/components/ui/media-image";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { getAtolls, getCountry, getIslandBySlug } from "@/lib/locations/repository";
import { getMediaAssetsByIds } from "@/lib/media/repository";
import type { MediaAsset } from "@/lib/media/types";
import { getMaldivesHubHeroVideo } from "@/lib/media/site-hero-video";
import { breadcrumbJsonLd, canonicalUrl, itemListJsonLd, safeJsonLdStringify } from "@/lib/seo/site";

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountry();
  if (!country) return {};

  const title = country.metaTitle ?? country.title;
  const description = country.metaDescription ?? country.summary ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl("/maldives") },
    openGraph: { title, description, url: canonicalUrl("/maldives") },
  };
}

// A cross-section of real, well-known local islands (not an arbitrary
// pick) — each one only renders if it actually exists as a published
// island node, so this list can never surface a broken card.
const FEATURED_ISLAND_SLUGS = ["thulusdhoo", "maafushi", "dhigurah", "ukulhas", "fuvahmulah", "gan"];

// Real legacy-site images already migrated into media_assets (see
// supabase/migrations/20250115000100_full_legacy_image_library.sql) —
// reused here rather than uploaded again, for the country-level
// People/Community/History/Economy context section below.
const COUNTRY_CONTEXT_MEDIA_IDS = {
  people: "60630ddc-d244-a2ea-bd3c-469a719f1d6d",
  community: "f326cf2a-f6ab-5dcb-9e77-88a167c319e4",
  history: "640bfe55-191e-8218-073b-cd325ef238d1",
  economy: "534b411e-fd78-091f-10b9-009abcc1a99a",
} as const;

function ContextSection({
  eyebrow,
  title,
  image,
  imageAlt,
  reverse,
  children,
}: {
  eyebrow: string;
  title: string;
  image: MediaAsset | null | undefined;
  imageAlt: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10 ${reverse ? "sm:flex-row-reverse" : ""}`}>
      {image && (
        <div className="w-full shrink-0 overflow-hidden rounded-2xl sm:w-64">
          <MediaImage asset={image} alt={imageAlt} aspectClassName="aspect-[4/3]" />
        </div>
      )}
      <div className="flex-1 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-maldives-600">{eyebrow}</p>
        <h3 className="text-lg font-semibold text-ocean-900">{title}</h3>
        <div className="space-y-3 text-sm text-neutral-700">{children}</div>
      </div>
    </div>
  );
}

export default async function MaldivesPage() {
  const country = await getCountry();
  if (!country) notFound();

  const [atolls, featuredIslandResults, countryContextMedia] = await Promise.all([
    getAtolls(),
    Promise.all(FEATURED_ISLAND_SLUGS.map((slug) => getIslandBySlug(slug))),
    getMediaAssetsByIds(Object.values(COUNTRY_CONTEXT_MEDIA_IDS)),
  ]);
  const totalIslands = atolls.reduce((sum, atoll) => sum + atoll.islandCount, 0);
  const featuredIslands = featuredIslandResults.filter((i): i is NonNullable<typeof i> => i !== null);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbJsonLd([{ label: "Maldives" }], "/maldives")) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(itemListJsonLd(atolls.map((a) => ({ title: a.title, href: `/maldives/atolls/${a.slug}/`, summary: a.summary })), "Place")),
        }}
      />

      <PageHero
        variant="ocean"
        video={getMaldivesHubHeroVideo()}
        eyebrow="Maldives Tour Guide"
        title={country.title}
        description={country.summary ?? undefined}
        action={
          <div className="max-w-xl">
            <SearchBox variant="inline" placeholder="Search islands, resorts, activities…" />
          </div>
        }
        meta={
          <>
            <span>
              <strong className="font-semibold text-white">{atolls.length}</strong> administrative atolls
            </span>
            <span>
              <strong className="font-semibold text-white">{totalIslands}</strong> inhabited islands
            </span>
          </>
        }
      />

      <div className={`${CONTAINER_CLASS} py-12 sm:py-16`}>
        <section className="prose-sm max-w-none text-sm text-neutral-700">
          <p>
            The Maldives is a nation of coral atolls in the Indian Ocean, made up of the capital Male, a scattering of
            resort islands, and {totalIslands} inhabited local islands spread across {atolls.length} administrative
            atolls. Most travellers stay in one of two very different ways: a private resort island — one island, one
            property, all-inclusive — or a local island, where guesthouses sit inside a real Maldivian community
            alongside its mosque, school and harbour. Both give access to the same reefs, lagoons and marine life;
            what differs is the kind of trip. Everything below — atolls, islands, stays, activities, transfers,
            packages and travel guides — links back to the same real MTG catalogue, so wherever you start, you can
            get to everything else.
          </p>
        </section>

        <div className="mt-10">
          <SectionHeader
            eyebrow="Destinations"
            title="Browse by atoll"
            description="The Maldives is organized into administrative atolls, each made up of inhabited islands."
            action={{ label: "View all atolls", href: "/maldives/atolls/" }}
          />
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {atolls.map((atoll) => (
              <li key={atoll.id} className={CARD_CLASS}>
                <Link href={`/maldives/atolls/${atoll.slug}/`} className="flex items-center gap-3">
                  {atoll.heroImage ? (
                    <div className="w-14 shrink-0 overflow-hidden rounded-lg">
                      <MediaImage asset={atoll.heroImage} alt={atoll.title} aspectClassName="aspect-square" />
                    </div>
                  ) : (
                    <MapPinIcon className="h-5 w-5 shrink-0 text-maldives-600" />
                  )}
                  <span>
                    <span className="block font-medium text-ocean-900">{atoll.title}</span>
                    <span className="text-xs text-neutral-500">
                      {atoll.islandCount} island{atoll.islandCount === 1 ? "" : "s"}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {featuredIslands.length > 0 && (
          <div className="mt-12">
            <SectionHeader
              title="Featured local islands"
              description="A starting point, not the whole list — every inhabited island has its own page."
              action={{ label: "View all islands", href: "/maldives/islands/" }}
            />
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredIslands.map((island) => (
                <IslandCard key={island.id} island={island} />
              ))}
            </ul>
          </div>
        )}

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Maldives Local Islands</h2>
          <div className="mt-4 grid grid-cols-1 gap-6 text-sm text-neutral-700 sm:grid-cols-2">
            <p>
              A &ldquo;local island&rdquo; is simply an inhabited Maldivian island that welcomes overnight guests —
              usually in small, independently run guesthouses rather than a single resort operator. You&rsquo;ll be
              staying inside a real community: shops, a mosque, a school, a working harbour, and neighbours going
              about daily life around you.
            </p>
            <p>
              It&rsquo;s generally the more affordable way to experience the Maldives, since you pay for a room and
              meals rather than an entire private island. Local dress and behaviour norms are more conservative than
              on a resort island — swimwear is for designated &ldquo;bikini beaches&rdquo; only, for example — and
              in exchange you get easier access to real Maldivian food, culture and everyday life.
            </p>
          </div>
          <p className="mt-4 text-sm text-neutral-600">
            <Link href="/maldives/islands/" className="font-medium text-maldives-600 hover:underline">
              Browse every local island →
            </Link>{" "}
            or see{" "}
            <Link href="/maldives/guesthouses/" className="font-medium text-maldives-600 hover:underline">
              guesthouses
            </Link>{" "}
            for places to stay on them.
          </p>
        </section>

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <SectionHeader
            eyebrow="Beyond the Beaches"
            title="People, Culture, History & Economy"
            description="The Maldives is more than reefs and resorts — a quick look at who Maldivians are, how they live, and how the country got here."
          />
          <div className="mt-8 space-y-10">
            <ContextSection eyebrow="People" title="The Maldivian People" image={countryContextMedia.get(COUNTRY_CONTEXT_MEDIA_IDS.people)} imageAlt="Maldivian people">
              <p>
                Around 520,000 people call the Maldives home, descended from South Indian, Sri Lankan, Arab and East
                African sailors and settlers who mixed over more than a thousand years of Indian Ocean trade. They
                speak Dhivehi, a language written right-to-left in the distinctive Thaana script, and the country is
                constitutionally 100% Sunni Muslim — Islam shapes everyday life, from the five daily calls to prayer
                to the Friday holiday. Close to a third of the population lives in the capital, Male, one of the
                most densely built cities in the world; the rest are spread thinly across the country&rsquo;s{" "}
                {atolls.length} atolls and {totalIslands} inhabited islands.
              </p>
            </ContextSection>

            <ContextSection
              eyebrow="Community"
              title="Life on a Local Island"
              image={countryContextMedia.get(COUNTRY_CONTEXT_MEDIA_IDS.community)}
              imageAlt="Community life on a Maldivian local island"
              reverse
            >
              <p>
                Away from the resorts, a Maldivian island is a tight-knit community built around its mosque, a
                harbour where the day&rsquo;s catch comes in, a school, and a scatter of small shops and cafés.
                Many islands hold only a few hundred residents, so family and neighbourhood ties run deep, and
                everyone genuinely knows everyone. Dress and behaviour are more conservative than on a resort
                island — swimwear is kept to designated &ldquo;bikini beaches&rdquo; — and in return visitors get
                an honest look at Maldivian food, music and daily routine that a private resort island, by design,
                can&rsquo;t offer.
              </p>
            </ContextSection>

            <ContextSection eyebrow="History" title="A Short History" image={countryContextMedia.get(COUNTRY_CONTEXT_MEDIA_IDS.history)} imageAlt="Maldives history">
              <p>
                The islands were first settled by Buddhist seafarers over two thousand years ago, before the
                Maldives converted to Islam in 1153 CE under Sultan Dharumavantha Rasgefaanu — a single, unbroken
                sultanate followed for almost 800 years afterward. Portuguese and Dutch traders passed through the
                region from the 16th century, and the Maldives became a British protectorate in 1887, retaining its
                own sultan and internal rule throughout. Full independence came on 26 July 1965, the sultanate was
                replaced by a republic in 1968, and the country held its first multi-party democratic presidential
                election in 2008 — a history now marked each year by Independence Day and Republic Day
                celebrations across the islands.
              </p>
            </ContextSection>

            <ContextSection
              eyebrow="Economy"
              title="How the Maldives Makes a Living"
              image={countryContextMedia.get(COUNTRY_CONTEXT_MEDIA_IDS.economy)}
              imageAlt="Maldives fish market and economy"
              reverse
            >
              <p>
                Fishing — especially pole-and-line skipjack tuna, still certified as one of the most sustainable
                methods in the world — was the backbone of the Maldivian economy for centuries, and tuna remains a
                major export today. Since the first resort opened in 1972, tourism has overtaken it to become the
                country&rsquo;s largest industry, contributing roughly a quarter of GDP and the majority of foreign
                exchange earnings, directly funding the roads, ferries, airports, schools and hospitals used across
                the islands. Boat building, shipping and, increasingly, agriculture round out an economy still
                largely tied to the ocean around it.
              </p>
            </ContextSection>
          </div>
        </section>

        <section className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">Explore More Maldives</h2>
          <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
            {[
              { href: "/maldives/activities/", label: "Things to Do" },
              { href: "/maldives/diving/", label: "Diving" },
              { href: "/maldives/fishing/", label: "Fishing" },
              { href: "/maldives/surfing/", label: "Surfing" },
              { href: "/maldives/attractions/", label: "Attractions" },
              { href: "/maldives/resorts/", label: "Resorts" },
              { href: "/maldives/guesthouses/", label: "Guesthouses" },
              { href: "/maldives/transfers/", label: "Transfers" },
              { href: "/maldives/packages/", label: "Packages" },
              { href: "/maldives/travel-guide/", label: "Travel Guide" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
