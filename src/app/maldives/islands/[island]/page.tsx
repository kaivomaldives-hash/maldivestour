import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/location/breadcrumbs";
import { getChildLocations, getIslandBySlug } from "@/lib/locations/repository";
import { canonicalUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

interface Params {
  island: string;
}

async function getAtollSummary(atollId: string | null) {
  if (!atollId) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("nodes")
    .select("slug, title")
    .eq("id", atollId)
    .eq("node_type", "location")
    .maybeSingle<{ slug: string; title: string }>();
  return data;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { island: slug } = await params;
  const island = await getIslandBySlug(slug);
  if (!island) return {};

  const title = island.metaTitle ?? `${island.title} | Maldives Islands | MTG`;
  const description = island.metaDescription ?? island.summary ?? undefined;
  const url = canonicalUrl(`/maldives/islands/${island.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

export default async function IslandPage({ params }: { params: Promise<Params> }) {
  const { island: slug } = await params;
  const island = await getIslandBySlug(slug);
  if (!island) notFound();

  const [atoll, children] = await Promise.all([
    getAtollSummary(island.parentId),
    getChildLocations(island.id),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Maldives", href: "/maldives/" },
          { label: "Atolls", href: "/maldives/atolls/" },
          ...(atoll ? [{ label: atoll.title, href: `/maldives/atolls/${atoll.slug}/` }] : []),
          { label: island.title },
        ]}
      />
      <h1 className="mt-4 text-3xl font-semibold">{island.title}</h1>
      {island.summary && <p className="mt-3 text-neutral-700">{island.summary}</p>}

      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-neutral-500">Location type</dt>
          <dd className="font-medium capitalize">{island.locationType}</dd>
        </div>
        {island.isInhabited !== null && (
          <div>
            <dt className="text-neutral-500">Inhabited</dt>
            <dd className="font-medium">{island.isInhabited ? "Yes" : "No"}</dd>
          </div>
        )}
        {atoll && (
          <div>
            <dt className="text-neutral-500">Atoll</dt>
            <dd className="font-medium">
              <Link href={`/maldives/atolls/${atoll.slug}/`} className="hover:underline">
                {atoll.title}
              </Link>
            </dd>
          </div>
        )}
      </dl>

      {children.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold">On this island</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
            {children.map((child) => (
              <li key={child.id} className="capitalize">
                {child.title}
                <span className="ml-1 text-xs text-neutral-500">({child.locationType.replace("_", " ")})</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Future content sections (accommodation, activities, transfers, packages)
          attach to this island via node_locations once those entity types
          exist — intentionally not built yet (Task 4 is geography-only). */}
    </main>
  );
}
