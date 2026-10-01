/**
 * Pure constant/type, deliberately in its own plain module with no
 * "use server" directive — node-actions.ts (where this used to live) is a
 * "use server" file, and Next.js only preserves async-function exports
 * from a "use server" module in the client bundle; a plain value export
 * like NODE_STATUSES silently becomes `undefined` on the client, not a
 * build error, so this broke every admin form's status <select> at
 * runtime (`NODE_STATUSES.map is not a function`) without ever failing a
 * build or typecheck. Same fix already applied to BookingStatus/
 * BOOKING_STATUSES in booking-status.ts for the identical reason — see
 * that file's own comment.
 */
export type NodeStatus = "draft" | "published" | "archived";
export const NODE_STATUSES: readonly NodeStatus[] = ["draft", "published", "archived"];
