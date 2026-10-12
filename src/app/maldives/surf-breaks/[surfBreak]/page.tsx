import type { Metadata } from "next";

import { SurfBreakDetailPage, surfBreakDetailMetadata } from "@/components/surfing/surf-break-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4800;

interface Params {
  surfBreak: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { surfBreak } = await params;
  return surfBreakDetailMetadata(surfBreak);
}

export default async function SurfBreakDetailRoute({ params }: { params: Promise<Params> }) {
  const { surfBreak } = await params;
  return <SurfBreakDetailPage slug={surfBreak} />;
}
