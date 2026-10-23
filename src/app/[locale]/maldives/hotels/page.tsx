import type { Metadata } from "next";

import { localizedStaysHubMetadata } from "@/components/i18n/localized-stays-metadata";
import { LocalizedStaysDirectory } from "@/components/i18n/localized-stays-pages";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 4800;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return localizedStaysHubMetadata(locale, "/maldives/hotels/", "hotel");
}

export default async function LocaleHotelsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LocalizedStaysDirectory locale={locale} type="hotel" />;
}
