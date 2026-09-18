import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">{country.title}</h1>
      {country.summary && <p className="mt-4 text-lg text-neutral-700">{country.summary}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-neutral-500">Administrative atolls</dt>
          <dd className="text-lg font-medium">{atolls.length}</dd>
        </div>
        <div>
          <dt className="text-neutral-500">Inhabited islands</dt>
          <dd className="text-lg font-medium">{totalIslands}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Browse by atoll</h2>
        <p className="mt-1 text-sm text-neutral-600">
          The Maldives is organized into administrative atolls, each made up of inhabited islands.
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
          {atolls.map((atoll) => (
            <li key={atoll.id}>
              <Link href={`/maldives/atolls/${atoll.slug}/`} className="hover:underline">
                {atoll.title}
              </Link>
              <span className="ml-1 text-xs text-neutral-500">({atoll.islandCount})</span>
            </li>
          ))}
        </ul>
        <Link href="/maldives/atolls/" className="mt-4 inline-block text-sm font-medium hover:underline">
          View all atolls →
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Browse islands</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Every inhabited island in the Maldives, searchable across all atolls.
        </p>
        <Link href="/maldives/islands/" className="mt-2 inline-block text-sm font-medium hover:underline">
          View all islands →
        </Link>
      </section>
    </main>
  );
}
