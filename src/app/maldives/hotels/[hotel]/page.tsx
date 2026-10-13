import type { Metadata } from "next";

import { accommodationDetailMetadata } from "@/components/accommodation/accommodation-detail-metadata";
import { AccommodationDetailPage } from "@/components/accommodation/accommodation-detail-page";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4380;

interface Params {
  hotel: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { hotel } = await params;
  return accommodationDetailMetadata("hotel", hotel);
}

export default async function HotelDetailPage({ params }: { params: Promise<Params> }) {
  const { hotel } = await params;
  return <AccommodationDetailPage type="hotel" slug={hotel} />;
}
