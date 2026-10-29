import type { TranslatedContentSection } from "@/lib/content/content-section";
import type { PackageCategorySlug } from "@/lib/packages/view-types";

/** One package style page's translated copy -- mirrors the English
 * PACKAGE_CATEGORY_CONTENT entry (src/lib/packages/category-content.ts);
 * `relatedLabels` are the labels of its relatedLinks, in the same order. */
export interface PackageCategoryTranslation {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faqs: Array<{ question: string; answer: string }>;
  relatedLabels: string[];
  /** Translations of the English entry's sections, by position. */
  sections?: TranslatedContentSection[];
}

export interface PackageCategoryLocaleStrings {
  eyebrow: string;
  allPackages: string;
  relatedTitle: string;
  /** "{title}" is replaced with the category title. */
  emptyTitle: string;
  emptyDescription: string;
  /** Link to the English page, which has search and filters. */
  filtersInEnglish: string;
  /** "{n}" -> number of nights, for package price tables. */
  nights: string;
  categories: Record<PackageCategorySlug, PackageCategoryTranslation>;
}
