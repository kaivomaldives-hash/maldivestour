import "server-only";

import { createClient } from "@/lib/supabase/server";

/** Admin-only reads of node_comments — generic counterpart to
 * src/lib/admin/location-comments-repository.ts for category/hub-page
 * nodes. `node_comments_staff_read` lets staff see every status; the
 * public repository (src/lib/nodes/comments/repository.ts) only ever sees
 * status='published'. */

const PAGE_SIZE = 25;
export const NODE_COMMENT_STATUSES = ["pending", "published", "rejected"] as const;
export type NodeCommentStatus = (typeof NODE_COMMENT_STATUSES)[number];

export interface AdminNodeCommentItem {
  id: string;
  nodeId: string;
  nodeTitle: string;
  body: string;
  status: NodeCommentStatus;
  commenterName: string;
  commenterEmail: string | null;
  createdAt: string;
}

interface NodeCommentRow {
  id: string;
  node_id: string;
  user_id: string | null;
  body: string;
  status: NodeCommentStatus;
  guest_name: string | null;
  guest_email: string | null;
  created_at: string;
}

export interface AdminNodeCommentListResult {
  items: AdminNodeCommentItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getNodeCommentsAdmin(options: { status?: NodeCommentStatus; page?: number } = {}): Promise<AdminNodeCommentListResult> {
  const page = Math.max(1, options.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase.from("node_comments").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (options.status) query = query.eq("status", options.status);

  const { data, error, count } = await query.range(from, to).returns<NodeCommentRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  const nodeIds = [...new Set(data.map((c) => c.node_id))];
  const { data: nodes } = nodeIds.length
    ? await supabase.from("nodes").select("id, title").in("id", nodeIds).returns<Array<{ id: string; title: string }>>()
    : { data: [] as Array<{ id: string; title: string }> };
  const titleById = new Map((nodes ?? []).map((n) => [n.id, n.title]));

  const items: AdminNodeCommentItem[] = data.map((c) => ({
    id: c.id,
    nodeId: c.node_id,
    nodeTitle: titleById.get(c.node_id) ?? "(unknown page)",
    body: c.body,
    status: c.status,
    commenterName: c.guest_name ?? "(account holder)",
    commenterEmail: c.guest_email,
    createdAt: c.created_at,
  }));

  return { items, total: count ?? items.length, page, pageSize: PAGE_SIZE };
}
