import Link from "next/link";

import { CARD_CLASS, CARD_IMAGE_BLEED_CLASS } from "@/components/ui/card";
import { MediaImage } from "@/components/ui/media-image";
import type { LocalizedCard } from "@/lib/i18n/repository";
import type { MediaAsset } from "@/lib/media/types";

/**
 * Card grid for the translated destination pages (atolls, islands, dive
 * sites, attractions) -- same card shape as IslandCard/DiveSiteCard/
 * AttractionCard, but titled and linked from a localizeCards() result so
 * each card shows its translated name and points at its own translated
 * URL (or its plain English one when it has no translation yet). Hidden
 * entirely when there's nothing to list.
 */
export function LocalizedPlaceGrid({
  title,
  items,
  cards,
  subtitleFor,
  showSummary = false,
  className = "mt-10",
}: {
  title: string;
  items: Array<{ id: string; heroImage: MediaAsset | null }>;
  cards: Map<string, LocalizedCard>;
  subtitleFor?: (id: string) => string | null;
  showSummary?: boolean;
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <section className={className}>
      <h2 className="text-xl font-semibold text-ocean-900">{title}</h2>
      <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const card = cards.get(item.id);
          if (!card) return null;
          const subtitle = subtitleFor?.(item.id);
          return (
            <li key={item.id} className={CARD_CLASS}>
              {item.heroImage && (
                <div className={CARD_IMAGE_BLEED_CLASS}>
                  <MediaImage asset={item.heroImage} alt={card.title} aspectClassName="aspect-[4/3]" />
                </div>
              )}
              <Link href={card.href} className="text-lg font-medium text-ocean-900 transition-colors hover:text-maldives-600">
                {card.title}
              </Link>
              {subtitle && <div className="mt-1.5 text-sm text-neutral-600">{subtitle}</div>}
              {showSummary && card.summary && <p className="mt-1.5 text-sm text-neutral-600 line-clamp-2">{card.summary}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** "Explore more" pill row shared by the translated destination pages. */
export function LocalizedLinkPills({ title, links }: { title: string; links: Array<{ href: string; label: string }> }) {
  return (
    <section className="mt-12 border-t border-neutral-200 pt-10">
      <h2 className="text-xl font-semibold text-ocean-900">{title}</h2>
      <nav aria-label="Related Maldives links" className="mt-4 flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:border-maldives-500 hover:text-maldives-600"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
