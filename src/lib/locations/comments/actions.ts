"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Wraps the submit_location_comment RPC — same guest-safe pattern as
 * submitReview (src/lib/reviews/actions.ts): server-side validation, then a
 * thin, typed call. Comments are inserted with status='pending' by the RPC
 * itself and never shown until an admin approves them.
 */

export interface SubmitLocationCommentInput {
  locationId: string;
  body: string;
  guestName: string;
  guestEmail: string;
}

export interface SubmitLocationCommentResult {
  ok: boolean;
  error?: string;
}

export async function submitLocationComment(input: SubmitLocationCommentInput): Promise<SubmitLocationCommentResult> {
  const name = input.guestName.trim();
  const email = input.guestEmail.trim();
  const body = input.body.trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!body) return { ok: false, error: "Please write a comment." };

  const supabase = await createClient();
  const rpcArgs = {
    p_location_id: input.locationId,
    p_body: body,
    p_guest_name: name,
    p_guest_email: email,
  };

  // src/types/database.ts is still the Task 3 placeholder (see the
  // identical, already-documented cast in src/lib/reviews/actions.ts) —
  // narrowly scoped to this one call, not a widening of the shared type.
  const { error } = await supabase.rpc("submit_location_comment" as unknown as never, rpcArgs as unknown as undefined);

  if (error) {
    if (error.message.includes("limit of 2 submissions per day")) {
      return { ok: false, error: "You've reached the limit of 2 submissions per day for this email address. Please try again tomorrow." };
    }
    return { ok: false, error: "We couldn't submit your comment right now. Please try again." };
  }

  return { ok: true };
}
