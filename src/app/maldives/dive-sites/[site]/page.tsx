import type { Metadata } from "next";

import { DiveSiteDetailPage, diveSiteDetailMetadata } from "@/components/diving/dive-site-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4140;

interface Params {
  site: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { site } = await params;
  return diveSiteDetailMetadata(site);
}

export default async function DiveSiteDetailRoute({ params }: { params: Promise<Params> }) {
  const { site } = await params;
  return <DiveSiteDetailPage slug={site} />;
}
