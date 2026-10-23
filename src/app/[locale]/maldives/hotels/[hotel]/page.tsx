import type { Metadata } from "next";

import { localizedStayDetailMetadata } from "@/components/i18n/localized-stays-metadata";
import { LocalizedStayDetail } from "@/components/i18n/localized-stays-pages";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4720;

interface Params {
  locale: string;
  hotel: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, hotel } = await params;
  return localizedStayDetailMetadata(locale, "hotel", hotel);
}

export default async function LocaleHotelDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, hotel } = await params;
  return <LocalizedStayDetail locale={locale} type="hotel" slug={hotel} />;
}
