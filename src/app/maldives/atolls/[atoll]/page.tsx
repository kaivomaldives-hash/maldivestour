import type { Metadata } from "next";

import { AtollDetailPage, atollDetailMetadata } from "@/components/locations/atoll-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4020;

interface Params {
  atoll: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { atoll: slug } = await params;
  return atollDetailMetadata(slug);
}

export default async function AtollPage({ params }: { params: Promise<Params> }) {
  const { atoll: slug } = await params;
  return <AtollDetailPage slug={slug} />;
}
