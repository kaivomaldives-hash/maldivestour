import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getAtollBySlug, getIslandsByAtoll } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";

export const revalidate = 3600;

interface Params {
  atoll: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { atoll: slug } = await params;
  const atoll = await getAtollBySlug(slug);
  if (!atoll) return {};

  const title = atoll.metaTitle ?? `${atoll.title} | Maldives Atolls | MTG`;
  const description = atoll.metaDescription ?? atoll.summary ?? undefined;
  const url = canonicalUrl(`/maldives/atolls/${atoll.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function AtollPage({ params }: { params: Promise<Params> }) {
  const { atoll: slug } = await params;
  const atoll = await getAtollBySlug(slug);
  if (!atoll) notFound();

  const islands = await getIslandsByAtoll(slug);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Atolls", href: "/maldives/atolls/" },
          { label: atoll.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">{atoll.title}</h1>
      {atoll.summary && <p className="mt-3 text-neutral-700">{atoll.summary}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        {atoll.administrativeCode && (
          <div>
            <dt className="text-neutral-500">Administrative code</dt>
            <dd className="font-medium">{atoll.administrativeCode}</dd>
          </div>
        )}
        <div>
          <dt className="text-neutral-500">Inhabited islands</dt>
          <dd className="font-medium">{islands.length}</dd>
        </div>
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Islands in {atoll.title}</h2>
        {islands.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-600">No islands recorded for this atoll yet.</p>
        ) : (
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {islands.map((island) => (
              <li key={island.id}>
                <Link href={`/maldives/islands/${island.slug}/`} className="hover:underline">
                  {island.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Future content sections (hotels, resorts, activities, transfers, packages)
          attach to this atoll via node_locations once those entity types exist —
          intentionally not built yet (Task 4 is geography-only). */}
    </main>
  );
}
