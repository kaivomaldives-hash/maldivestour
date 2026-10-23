export const ACTIVITY_CATEGORY_SLUGS = ["snorkeling", "excursions", "sandbank-tours", "water-sports", "island-hopping", "dolphin-whale-watching", "sightseeing"] as const;

export type ActivityCategorySlug = (typeof ACTIVITY_CATEGORY_SLUGS)[number];

/** One activity-category landing page's translated copy -- mirrors the
 * English page's ActivityCategoryConfig (src/app/maldives/{slug}/page.tsx). */
export interface ActivityCategoryTranslation {
  /** Short label for the "other activity types" chips. */
  label: string;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  emptyMessage: string;
}

export interface ActivityCategoryLocaleStrings {
  otherTypes: string;
  allActivities: string;
  categories: Record<ActivityCategorySlug, ActivityCategoryTranslation>;
}
