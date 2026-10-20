/** Guest-safe comment on any node (category/hub pages today), admin-
 * approval-gated before public — generic counterpart to
 * src/lib/locations/comments/types.ts for nodes that aren't `locations`
 * rows. */

export interface NodeComment {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
}
