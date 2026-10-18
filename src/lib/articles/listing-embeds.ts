import "server-only";

import { getAccommodationBySlug } from "@/lib/accommodations/repository";
import type { AccommodationDetail } from "@/lib/accommodations/types";
import { LISTING_EMBED_NODE_TYPES, type ListingEmbedNodeType } from "@/lib/admin/listing-embed-types";
import { getActivityBySlug } from "@/lib/activities/repository";
import type { ActivityDetail } from "@/lib/activities/types";
import { getPackageBySlug } from "@/lib/packages/repository";
import { realPackageToView } from "@/lib/packages/view";
import type { PackageView } from "@/lib/packages/view-types";
import { getTransferRouteBySlug } from "@/lib/transfers/repository";
import type { TransferRouteDetail } from "@/lib/transfers/types";

export type { ListingEmbedNodeType };

const LISTING_MARKER_RE = new RegExp(`<!--\\s*listing:(${LISTING_EMBED_NODE_TYPES.join("|")}):([a-z0-9-]+)\\s*-->`, "g");

export type ArticleBodySegment = { kind: "html"; html: string } | { kind: "listing"; nodeType: ListingEmbedNodeType; slug: string };

export type ResolvedListingEmbed =
  | { nodeType: "accommodation"; data: AccommodationDetail }
  | { nodeType: "activity"; data: ActivityDetail }
  | { nodeType: "package"; data: PackageView }
  | { nodeType: "transfer_route"; data: TransferRouteDetail };

/**
 * Splits an article's already-rendered body HTML on the
 * <!--listing:TYPE:SLUG--> markers the "+ Insert real listing" editor
 * button writes (src/components/admin/listing-insert-picker.tsx) — lets
 * the public article page interleave real rendered listing cards with
 * the author's own HTML, instead of a dead HTML comment sitting inertly
 * in dangerouslySetInnerHTML. A plain regex split is enough here because
 * the marker is always its own self-contained HTML comment — it can
 * never itself be split across, or nested inside, the surrounding
 * markup.
 */
export function splitArticleBodyOnListings(html: string): ArticleBodySegment[] {
  const segments: ArticleBodySegment[] = [];
  let lastIndex = 0;
  for (const match of html.matchAll(LISTING_MARKER_RE)) {
    const [full, nodeType, slug] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ kind: "html", html: html.slice(lastIndex, index) });
    segments.push({ kind: "listing", nodeType: nodeType as ListingEmbedNodeType, slug });
    lastIndex = index + full.length;
  }
  if (lastIndex < html.length) segments.push({ kind: "html", html: html.slice(lastIndex) });
  return segments;
}

/**
 * Resolves every listing segment to its real, currently-published node.
 * A marker whose slug no longer resolves — deleted, unpublished since
 * the marker was inserted, or mistyped by hand — is simply absent from
 * the returned map; the page then renders nothing for that segment
 * rather than a broken card, same "never fabricate" rule as every other
 * related-content block in this codebase.
 */
export async function resolveListingEmbeds(segments: ArticleBodySegment[]): Promise<Map<string, ResolvedListingEmbed>> {
  const resolved = new Map<string, ResolvedListingEmbed>();
  const listingSegments = segments.filter((s): s is { kind: "listing"; nodeType: ListingEmbedNodeType; slug: string } => s.kind === "listing");

  await Promise.all(
    listingSegments.map(async (segment) => {
      const key = `${segment.nodeType}:${segment.slug}`;
      if (resolved.has(key)) return;
      switch (segment.nodeType) {
        case "accommodation": {
          const data = await getAccommodationBySlug(segment.slug);
          if (data) resolved.set(key, { nodeType: "accommodation", data });
          return;
        }
        case "activity": {
          const data = await getActivityBySlug(segment.slug);
          if (data) resolved.set(key, { nodeType: "activity", data });
          return;
        }
        case "package": {
          const data = await getPackageBySlug(segment.slug);
          if (data) resolved.set(key, { nodeType: "package", data: realPackageToView(data) });
          return;
        }
        case "transfer_route": {
          const data = await getTransferRouteBySlug(segment.slug);
          if (data) resolved.set(key, { nodeType: "transfer_route", data });
          return;
        }
      }
    }),
  );

  return resolved;
}
