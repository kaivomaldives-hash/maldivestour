import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MapPinIcon } from "@/components/ui/icons";
import { CARD_CLASS } from "@/components/ui/card";
import { CONTAINER_CLASS } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeader } from "@/components/ui/section-header";
import { getAtolls, getCountry } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

export async function generateMetadata(): Promise<Metadata> {
  const country = await getCountry();
  if (!country) return {};

  const title = country.metaTitle ?? `${country.title} Travel Guide | MTG`;
  const description = country.metaDescription ?? country.summary ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl("/maldives") },
    openGraph: { title, description, url: canonicalUrl("/maldives") },
  };
}

export default async function MaldivesPage() {
  const country = await getCountry();
  if (!country) notFound();

  const atolls = await getAtolls();
  const totalIslands = atolls.reduce((sum, atoll) => sum + atoll.islandCount, 0);

  return (
    <main>
      <PageHero
        variant="ocean"
        eyebrow="Maldives Tour Guide"
        title={country.title}
        description={country.summary ?? undefined}
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
        <SectionHeader
          eyebrow="Destinations"
          title="Browse by atoll"
          description="The Maldives is organized into administrative atolls, each made up of inhabited islands."
          action={{ label: "View all atolls", href: "/maldives/atolls/" }}
        />
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {atolls.map((atoll) => (
            <li key={atoll.id}>
              <Link href={`/maldives/atolls/${atoll.slug}/`} className={`${CARD_CLASS} flex items-center gap-3`}>
                <MapPinIcon className="h-5 w-5 shrink-0 text-maldives-600" />
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

        <div className="mt-12">
          <SectionHeader
            title="Browse islands"
            description="Every inhabited island in the Maldives, searchable across all atolls."
            action={{ label: "View all islands", href: "/maldives/islands/" }}
          />
        </div>
      </div>
    </main>
  );
}
