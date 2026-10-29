import type { TranslatedContentSection } from "@/lib/content/content-section";
import type { EmperorStrings } from "@/lib/i18n/fishing-pages/emperor";
import type { FishingSpeciesPageSlug, FishingTechniquePageSlug } from "@/lib/i18n/fishing-pages/types";
import type { PackageCategoryTranslation } from "@/lib/i18n/package-categories/types";

type Faq = { question: string; answer: string };

/** Translated copy for content added to the English fishing pages after
 * their first translation (fishing SEO plan, topics #3, #5, #6, #15, #16
 * and the Emperor update), merged over the original per-locale strings. */
export interface PageUpdate {
  metaTitle?: string;
  metaDescription?: string;
  h1?: string;
  heroDescription?: string;
  /** Translations of the English extraSections, by position. */
  extraSections: TranslatedContentSection[];
  /** Appended to the page's existing translated FAQs. */
  extraFaqs: Faq[];
}

export interface FishingContentUpdate {
  species: Partial<Record<FishingSpeciesPageSlug, PageUpdate>>;
  techniques: Partial<Record<FishingTechniquePageSlug, PageUpdate>>;
  emperor: Required<Pick<EmperorStrings, "dayTitle" | "dayParagraphs" | "includedTitle" | "includedHeading" | "notIncludedHeading" | "included" | "notIncluded" | "packageBefore" | "packageLink" | "packageAfter">>;
  packagesFishing: Omit<PackageCategoryTranslation, "title">;
}
