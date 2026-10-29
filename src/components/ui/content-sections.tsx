import Link from "next/link";

import { ChipLinkList } from "@/components/fishing/chip-link-list";
import { MediaImage } from "@/components/ui/media-image";
import type { ContentSection } from "@/lib/content/content-section";

/** Renders long-form ContentSection blocks (species pages, package
 * category pages): text with an optional table and links, and an optional
 * photo beside it on wider screens. */
export function ContentSections({ sections }: { sections: ContentSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.heading} className="mt-12 border-t border-neutral-200 pt-10">
          <h2 className="text-xl font-semibold text-ocean-900">{section.heading}</h2>
          <div className={section.image ? "mt-3 grid grid-cols-1 gap-6 md:grid-cols-[1fr_320px]" : "mt-3"}>
            <div className="space-y-3 text-sm text-neutral-700">
              {section.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {section.table && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr>
                        {section.table.headers.map((h) => (
                          <th key={h} className="border border-neutral-200 bg-neutral-50 p-2 text-left font-medium text-ocean-900">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0].text}>
                          {row.map((cell, i) => (
                            <td key={i} className="border border-neutral-200 p-2">
                              {cell.href ? (
                                <Link href={cell.href} className="text-maldives-600 hover:underline">
                                  {cell.text}
                                </Link>
                              ) : (
                                cell.text
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.links && <ChipLinkList items={section.links} />}
            </div>
            {section.image && (
              <div className="overflow-hidden rounded-2xl">
                <MediaImage asset={section.image} alt={section.image.altText ?? ""} aspectClassName="aspect-[4/3]" />
              </div>
            )}
          </div>
        </section>
      ))}
    </>
  );
}
