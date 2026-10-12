import type { Metadata } from "next";

import { IslandDetailPage, islandDetailMetadata } from "@/components/locations/island-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4440;

interface Params {
  island: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { island: slug } = await params;
  return islandDetailMetadata(slug);
}

export default async function IslandPage({ params }: { params: Promise<Params> }) {
  const { island: slug } = await params;
  return <IslandDetailPage slug={slug} />;
}
