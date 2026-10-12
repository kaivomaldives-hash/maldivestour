import type { Metadata } from "next";

import { AttractionDetailPage, attractionDetailMetadata } from "@/components/attractions/attraction-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4080;

interface Params {
  attraction: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { attraction } = await params;
  return attractionDetailMetadata(attraction);
}

export default async function AttractionDetailRoute({ params }: { params: Promise<Params> }) {
  const { attraction } = await params;
  return <AttractionDetailPage slug={attraction} />;
}
