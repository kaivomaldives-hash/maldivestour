"use server";

import { requireStaff } from "@/lib/admin/auth";
import { LISTING_EMBED_NODE_TYPES, type ListingEmbedOption } from "@/lib/admin/listing-embed-types";
import { createClient } from "@/lib/supabase/server";
import { titleSearchFilter } from "@/lib/search/normalize";

/**
 * Backs the article editor's "Insert real listing" picker
 * (src/components/admin/listing-insert-picker.tsx) — search across the
 * four content types that have their own real public page and a
 * matching *-detail-page card component (same set as dashboard.ts's
 * LISTING_NODE_TYPES, minus "article": an article embedding another
 * article isn't a listing). Published only, since inserting a listing
 * into an article is specifically about pointing a reader at something
 * they can see/book right now, not a draft in progress.
 */
export async function searchListingEmbedOptions(query: string): Promise<ListingEmbedOption[]> {
  await requireStaff();
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("nodes")
    .select("slug, title, node_type")
    .in("node_type", LISTING_EMBED_NODE_TYPES as unknown as string[])
    .eq("status", "published")
    .filter("title", ...titleSearchFilter(trimmed))
    .order("title", { ascending: true })
    .limit(15)
    .returns<Array<{ slug: string; title: string; node_type: ListingEmbedOption["nodeType"] }>>();
  if (error || !data) return [];
  return data.map((n) => ({ nodeType: n.node_type, slug: n.slug, title: n.title }));
}
