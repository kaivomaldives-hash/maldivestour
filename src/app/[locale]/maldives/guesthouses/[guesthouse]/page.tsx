import type { Metadata } from "next";

import { localizedStayDetailMetadata } from "@/components/i18n/localized-stays-metadata";
import { LocalizedStayDetail } from "@/components/i18n/localized-stays-pages";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4740;

interface Params {
  locale: string;
  guesthouse: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, guesthouse } = await params;
  return localizedStayDetailMetadata(locale, "guesthouse", guesthouse);
}

export default async function LocaleGuesthouseDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, guesthouse } = await params;
  return <LocalizedStayDetail locale={locale} type="guesthouse" slug={guesthouse} />;
}
