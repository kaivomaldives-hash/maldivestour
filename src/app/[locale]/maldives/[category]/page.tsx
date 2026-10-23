import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LocalizedActivityCategoryPage, localizedActivityCategoryMetadata } from "@/components/i18n/localized-activity-category-page";
import { getActivityCategoryStrings, isActivityCategorySlug } from "@/lib/i18n/activity-categories";
import { isLocale } from "@/lib/i18n/locales";

// Staggered (not a round 3600) so ISR regenerations don't cluster with
// every other route's -- see src/app/page.tsx for why.
export const revalidate = 3720;

type Params = { locale: string; category: string };

/**
 * Translated single landing pages that sit directly under /maldives/ in
 * English (/maldives/snorkeling/, ...). next.config.ts rewrites each
 * translated URL (e.g. /de/malediven/schnorcheln/) to its English slug
 * here -- see src/lib/i18n/localized-leaf-pages.json. Every other slug
 * 404s; the real hubs (/maldives/packages/ etc.) are static siblings.
 */
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  if (isActivityCategorySlug(category)) return localizedActivityCategoryMetadata(locale, category);
  return {};
}

export default async function LocaleMaldivesLandingPage({ params }: { params: Promise<Params> }) {
  const { locale, category } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  if (isActivityCategorySlug(category) && getActivityCategoryStrings(locale)) return <LocalizedActivityCategoryPage locale={locale} slug={category} />;
  notFound();
}
