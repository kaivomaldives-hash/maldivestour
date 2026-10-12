import type { Metadata } from "next";

import { DivingDetailPage, divingDetailMetadata } from "@/components/diving/diving-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4200;

interface Params {
  activity: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { activity } = await params;
  return divingDetailMetadata(activity);
}

export default async function DivingDetailRoute({ params }: { params: Promise<Params> }) {
  const { activity } = await params;
  return <DivingDetailPage slug={activity} />;
}
