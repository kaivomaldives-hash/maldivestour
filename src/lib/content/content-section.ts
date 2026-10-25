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

/** The translated text of a ContentSection, matched to the English
 * section by position. Photos, link targets and prices come from the
 * English section. */
export interface TranslatedContentSection {
  heading: string;
  paragraphs: string[];
  /** Labels for the English section's links, in the same order. */
  linkLabels?: string[];
  /** Table headers, plus optional full cell text (same shape as the English rows). */
  table?: { headers: string[]; cells?: string[][] };
}

/**
 * Builds the sections for a translated page: translated text over the
 * English structure. A section with no translation is left out rather
 * than shown in English. `href` localizes internal links; `nights`
 * formats the "N nights" package labels the price tables generate.
 */
export function localizeContentSections(
  english: ContentSection[] | undefined,
  translated: TranslatedContentSection[] | undefined,
  href: (englishHref: string) => string,
  nights: (n: number) => string,
): ContentSection[] {
  if (!english || !translated) return [];
  return english.flatMap((section, i) => {
    const tr = translated[i];
    if (!tr) return [];
    return [
      {
        heading: tr.heading,
        paragraphs: tr.paragraphs,
        image: section.image,
        links: section.links?.map((link, j) => ({ label: tr.linkLabels?.[j] ?? link.label, href: link.href && href(link.href) })),
        table: section.table && {
          headers: tr.table?.headers ?? section.table.headers,
          rows: section.table.rows.map((row, r) =>
            row.map((cell, c) => {
              const nightsMatch = /^(\d+) nights$/.exec(cell.text);
              const text = tr.table?.cells?.[r]?.[c] ?? (nightsMatch ? nights(Number(nightsMatch[1])) : cell.text);
              return { text, href: cell.href && href(cell.href) };
            }),
          ),
        },
      },
    ];
  });
}
