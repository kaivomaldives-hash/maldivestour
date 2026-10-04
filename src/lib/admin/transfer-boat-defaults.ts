import type { TransferBoatDetailsInput } from "@/lib/admin/bookings-actions";

/**
 * The site owner's one boat/captain today — pre-filled on every transfer
 * booking's confirm screen so staff don't retype it each time, but still
 * fully editable per booking (and per leg) for when a different boat is
 * used, or once more boats are added later. Only used as a fallback for a
 * booking that has never had boat details saved yet — a booking's own
 * saved values (even if identical to this) always take precedence once
 * set. A plain module, not part of bookings-actions.ts's "use server"
 * file — that file may only export async functions, not a constant.
 */
export const DEFAULT_TRANSFER_BOAT: TransferBoatDetailsInput = {
  boatName: "Chill",
  boatSize: "25 feet",
  boatContact: "+9607648444 / 9607323500",
  captainName: "Azuhad Naseem",
  captainLicense: "MMD-0398-P",
  registrationNumber: "P9258B-02",
};
