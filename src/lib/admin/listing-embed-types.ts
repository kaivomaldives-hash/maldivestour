/** Shared between the "use server" search action
 * (./listing-embed-actions.ts) and its callers — a "use server" file's
 * exports must all be async functions, so the plain constants/types it
 * needs live here instead, same split as content-sort/types.ts vs.
 * admin/content-sort-actions.ts. */

export const LISTING_EMBED_NODE_TYPES = ["accommodation", "activity", "package", "transfer_route"] as const;
export type ListingEmbedNodeType = (typeof LISTING_EMBED_NODE_TYPES)[number];

export const LISTING_EMBED_TYPE_LABEL: Record<ListingEmbedNodeType, string> = {
  accommodation: "Property",
  activity: "Activity",
  package: "Package",
  transfer_route: "Transfer",
};

export interface ListingEmbedOption {
  nodeType: ListingEmbedNodeType;
  slug: string;
  title: string;
}
