import type { Metadata } from "next";

import { localizedStayDetailMetadata } from "@/components/i18n/localized-stays-metadata";
import { LocalizedStayDetail } from "@/components/i18n/localized-stays-pages";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4700;

interface Params {
  locale: string;
  resort: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, resort } = await params;
  return localizedStayDetailMetadata(locale, "resort", resort);
}

export default async function LocaleResortDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, resort } = await params;
  return <LocalizedStayDetail locale={locale} type="resort" slug={resort} />;
}
