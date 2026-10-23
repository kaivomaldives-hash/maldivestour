export const FISHING_SPECIES_PAGE_SLUGS = ["gt-fishing", "tuna-fishing", "wahoo-fishing", "dogtooth-tuna", "mahi-mahi-fishing", "marlin-fishing", "sailfish-fishing"] as const;
export const FISHING_TECHNIQUE_PAGE_SLUGS = ["popping", "jigging", "big-game-fishing", "trolling", "fly-fishing"] as const;

export type FishingSpeciesPageSlug = (typeof FISHING_SPECIES_PAGE_SLUGS)[number];
export type FishingTechniquePageSlug = (typeof FISHING_TECHNIQUE_PAGE_SLUGS)[number];

type Faq = { question: string; answer: string };

/** Mirrors a SPECIES_PAGES entry (src/lib/fishing/species-content.ts) plus
 * its fish-species.ts bio, where one exists. Arrays line up with the
 * English entry's (whyMaldives paragraphs, techniques). */
export interface FishingSpeciesTranslation {
  displayName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  /** Hero text: the species bio description, or the English fallbackDescription's translation. */
  description: string;
  /** Translated bio facts -- only for species with a fish-species.ts entry. */
  bio?: { size: string; habitat: string; season: string };
  whyMaldives: string[];
  techniqueLabels: string[];
  faqs: Faq[];
}

/** Mirrors a TECHNIQUE_PAGES entry (src/lib/fishing/technique-content.ts). */
export interface FishingTechniqueTranslation {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroDescription: string;
  howItWorks: string[];
  targetSpeciesLabels: string[];
  faqs: Faq[];
}

export interface FishingPagesLocaleStrings {
  speciesEyebrow: string;
  techniqueEyebrow: string;
  whatsappCta: string;
  /** "{name}" -> species display name. */
  whyMaldivesTitle: string;
  size: string;
  habitat: string;
  bestSeason: string;
  seasonTitle: string;
  /** "{name}" and "{season}" placeholders; the guide link text follows it. */
  seasonText: string;
  seasonGuideLink: string;
  /** Text after the guide link (closing punctuation, or the verb in ja/zh). */
  seasonTextAfter: string;
  techniquesTitle: string;
  targetSpeciesTitle: string;
  howItWorksTitle: string;
  chartersTitle: string;
  /** Text before and after the "Emperor" link. */
  chartersIntroBefore: string;
  chartersIntroAfter: string;
  from: string;
  perBoat: string;
  packagePrompt: string;
  packageLink: string;
  exploreMoreTitle: string;
  related: { fishing: string; emperor: string; allFishes: string; fishingPackages: string; gtFishing: string; tunaFishing: string };
  /** WhatsApp message templates ("{name}" -> species display name / technique h1). */
  waSpecies: string;
  waTechnique: string;
  species: Record<FishingSpeciesPageSlug, FishingSpeciesTranslation>;
  techniques: Record<FishingTechniquePageSlug, FishingTechniqueTranslation>;
}
