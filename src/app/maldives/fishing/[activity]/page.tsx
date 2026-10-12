import type { Metadata } from "next";

import { FishingDetailPage, fishingDetailMetadata } from "@/components/fishing/fishing-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4260;

interface Params {
  activity: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { activity } = await params;
  return fishingDetailMetadata(activity);
}

export default async function FishingDetailRoute({ params }: { params: Promise<Params> }) {
  const { activity } = await params;
  return <FishingDetailPage slug={activity} />;
}
