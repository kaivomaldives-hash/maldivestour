/** Guest-safe destination comments, admin-approval-gated before they're
 * public — same shape as src/lib/reviews/types.ts, minus the rating. */

export interface LocationComment {
  id: string;
  body: string;
  authorName: string;
  createdAt: string;
}
