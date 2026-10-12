import type { Metadata } from "next";

import {
  AccommodationDetailPage,
  accommodationDetailMetadata,
} from "@/components/accommodation/accommodation-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4680;

interface Params {
  resort: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { resort } = await params;
  return accommodationDetailMetadata("resort", resort);
}

export default async function ResortDetailPage({ params }: { params: Promise<Params> }) {
  const { resort } = await params;
  return <AccommodationDetailPage type="resort" slug={resort} />;
}
