import type { MediaAsset } from "@/lib/media/types";

/** A long-form page section: heading, paragraphs and optionally a table,
 * related links and a photo. Rendered by ContentSections. */
export interface ContentSection {
  heading: string;
  paragraphs: string[];
  image?: MediaAsset;
  links?: Array<{ label: string; href: string | null }>;
  table?: { headers: string[]; rows: Array<Array<{ text: string; href?: string }>> };
}
