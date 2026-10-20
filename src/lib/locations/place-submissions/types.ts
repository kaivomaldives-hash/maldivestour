/** Guest-submitted places (attraction/restaurant/shop/hospital/school/
 * gym) tied to an island or atoll, held pending until an admin approves
 * them — see supabase/migrations/20261104000100_place_submissions.sql.
 * Photos are optional here, unlike location_media_submissions (which
 * exists specifically to collect photos) — a place submission's
 * primary content is the listing itself. */

export const MAX_SUBMISSION_IMAGES = 5;

export type SubmissionPlaceCategory = "attraction" | "restaurant" | "shop" | "hospital" | "school" | "gym";

export interface SubmitPlaceResult {
  ok: boolean;
  error?: string;
}
