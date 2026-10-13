import type { Metadata } from "next";

import { surfingDetailMetadata } from "@/components/surfing/surfing-detail-metadata";
import { SurfingDetailPage } from "@/components/surfing/surfing-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4920;

interface Params {
  activity: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { activity } = await params;
  return surfingDetailMetadata(activity);
}

export default async function SurfingDetailRoute({ params }: { params: Promise<Params> }) {
  const { activity } = await params;
  return <SurfingDetailPage slug={activity} />;
}
