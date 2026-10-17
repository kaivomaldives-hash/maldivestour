import "server-only";

import { cachedRead } from "@/lib/cache/cached-read";
import { CONTENT_SORT_MODES, type ContentSortMode, type SortableNodeType } from "@/lib/content-sort/types";
import { createClient } from "@/lib/supabase/public";

async function getContentSortSettingUncached(nodeType: SortableNodeType): Promise<ContentSortMode> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_sort_settings")
    .select("default_sort")
    .eq("node_type", nodeType)
    .maybeSingle<{ default_sort: string }>();

  const mode = data?.default_sort;
  return mode && (CONTENT_SORT_MODES as readonly string[]).includes(mode) ? (mode as ContentSortMode) : "title_asc";
}

/** The configured default sort order for a content type's public listing
 * pages — read by every public repository (packages/activities/
 * accommodations/transfers) so they all apply the same admin-chosen
 * order. Short TTL since this is an admin setting an editor expects to
 * take effect quickly, not slow-changing catalog data. */
export const getContentSortSetting = cachedRead(getContentSortSettingUncached, ["content-sort-settings"], 60, ["content-sort-settings"]);
