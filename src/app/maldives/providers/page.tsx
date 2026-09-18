import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getProviders } from "@/lib/providers/repository";
import { canonicalUrl } from "@/lib/seo/site";

export function generateMetadata(): Metadata {
  const title = "Maldives Accommodation Providers | MTG";
  const description = "Operators and companies running accommodation in the Maldives.";
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl("/maldives/providers") },
    openGraph: { title, description, url: canonicalUrl("/maldives/providers") },
  };
}

export default async function ProvidersPage() {
  const { items: providers } = await getProviders({ pageSize: 100 });

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Maldives", href: "/maldives/" }, { label: "Providers" }]} />
      <h1 className="mt-4 text-3xl font-semibold">Providers</h1>
      <p className="mt-2 text-neutral-600">Companies operating accommodation in the Maldives.</p>

      {providers.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-600">No providers recorded yet.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {providers.map((provider) => (
            <li key={provider.id} className="rounded border border-neutral-200 p-4">
              <Link href={`/maldives/providers/${provider.slug}/`} className="text-lg font-medium hover:underline">
                {provider.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
