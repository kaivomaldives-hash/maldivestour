/** Guest-uploaded photos of an island/atoll/attraction/dive site, held in
 * a private Storage bucket until an admin approves the whole batch —
 * nothing here is ever public until that happens. */

export const MAX_SUBMISSION_IMAGES = 5;

export interface SubmitLocationMediaResult {
  ok: boolean;
  error?: string;
}
