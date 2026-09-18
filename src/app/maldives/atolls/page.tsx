import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getAtolls } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

export function generateMetadata(): Metadata {
  const title = "Maldives Atolls | MTG";
  const description = "Every administrative atoll of the Maldives, with its inhabited islands.";
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl("/maldives/atolls") },
    openGraph: { title, description, url: canonicalUrl("/maldives/atolls") },
  };
}

export default async function AtollsPage() {
  const atolls = await getAtolls();

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Atolls" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">Atolls of the Maldives</h1>
      <p className="mt-2 text-neutral-600">{atolls.length} administrative atolls.</p>

      <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {atolls.map((atoll) => (
          <li key={atoll.id} className="rounded border border-neutral-200 p-4">
            <Link href={`/maldives/atolls/${atoll.slug}/`} className="text-lg font-medium hover:underline">
              {atoll.title}
            </Link>
            <p className="mt-1 text-sm text-neutral-600">
              {atoll.islandCount} inhabited island{atoll.islandCount === 1 ? "" : "s"}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
