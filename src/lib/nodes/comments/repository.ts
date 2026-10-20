import "server-only";

import { cachedRead } from "@/lib/cache/cached-read";
import type { NodeComment } from "@/lib/nodes/comments/types";
import { createClient } from "@/lib/supabase/public";

type NodeCommentRow = {
  id: string;
  body: string;
  guest_name: string | null;
  created_at: string;
};

/** Only status='published' rows — generic counterpart to
 * src/lib/locations/comments/repository.ts for category/hub-page nodes. */
async function getPublishedNodeCommentsUncached(nodeId: string): Promise<NodeComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("node_comments")
    .select("id, body, guest_name, created_at")
    .eq("node_id", nodeId)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<NodeCommentRow[]>();

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    body: row.body,
    authorName: row.guest_name ?? "Verified traveller",
    createdAt: row.created_at,
  }));
}

export const getPublishedNodeComments = cachedRead(
  getPublishedNodeCommentsUncached,
  ["node-comments-for-node"],
  300,
  ["node-comments-for-node", "node-comments"],
);
