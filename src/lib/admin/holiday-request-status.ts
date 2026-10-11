/**
 * Pure constant/type, deliberately with no "server-only" import and no
 * Supabase client import — mirrors src/lib/admin/booking-status.ts. This
 * value is needed by a Client Component (holiday-request-status-form.tsx's
 * status dropdown) as well as by server-only repository/actions, so it
 * can't live in holiday-requests-repository.ts without pulling
 * "server-only" into the client bundle.
 */
export const HOLIDAY_REQUEST_STATUSES = ["pending", "contacted", "confirmed", "cancelled"] as const;
export type HolidayRequestStatus = (typeof HOLIDAY_REQUEST_STATUSES)[number];
