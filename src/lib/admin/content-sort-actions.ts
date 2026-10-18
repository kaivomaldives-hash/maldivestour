"use server";

import { updateTag } from "next/cache";

import { requireStaff } from "@/lib/admin/auth";
import type { AdminActionResult } from "@/lib/admin/node-actions";
import { CONTENT_SORT_MODES, type ContentSortMode, type SortableNodeType } from "@/lib/content-sort/types";
import { createClient } from "@/lib/supabase/server";

/** Sets the default public sort order for a content type's listing pages
 * (e.g. /maldives/packages/, /maldives/resorts/). Busts the
 * "content-sort-settings" cache tag so every public repository's next
 * read picks up the change immediately rather than waiting out the
 * read's own TTL — see src/lib/content-sort/repository.ts. */
export async function setContentSortSetting(nodeType: SortableNodeType, mode: ContentSortMode): Promise<AdminActionResult> {
  await requireStaff();
  if (!(CONTENT_SORT_MODES as readonly string[]).includes(mode)) return { ok: false, error: "Invalid sort mode." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("content_sort_settings")
    .upsert({ node_type: nodeType, default_sort: mode, updated_at: new Date().toISOString() } as unknown as never, { onConflict: "node_type" });

  if (error) return { ok: false, error: error.message };
  updateTag("content-sort-settings");
  return { ok: true };
}

/** Sets (or clears, with `position: null`) a single node's manual display
 * position. Also switches that content type's default sort to "manual" —
 * setting a position only means anything in manual mode, and staff using
 * this field clearly want it applied, not silently ignored because the
 * dropdown above was left on a different mode. Busts every public
 * list-read tag whose repository could show this node, plus the sort-
 * settings tag, so the change is reflected immediately for visitors
 * rather than after each repository's own cache TTL. */
export async function updateNodeSortOrder(nodeId: string, position: number | null, nodeType: SortableNodeType): Promise<AdminActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("nodes").update({ sort_order: position } as unknown as never).eq("id", nodeId);
  if (error) return { ok: false, error: error.message };

  const { error: modeError } = await supabase
    .from("content_sort_settings")
    .upsert({ node_type: nodeType, default_sort: "manual", updated_at: new Date().toISOString() } as unknown as never, { onConflict: "node_type" });
  if (modeError) return { ok: false, error: modeError.message };

  updateTag("packages:list");
  updateTag("activities:list");
  updateTag("accommodations:list");
  updateTag("transfers:routes-list");
  updateTag("content-sort-settings");
  return { ok: true };
}
