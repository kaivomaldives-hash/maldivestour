"use server";

import { createClient } from "@/lib/supabase/server";

/** Wraps the submit_node_comment RPC — generic counterpart to
 * src/lib/locations/comments/actions.ts for category/hub-page nodes that
 * aren't `locations` rows. */

export interface SubmitNodeCommentInput {
  nodeId: string;
  body: string;
  guestName: string;
  guestEmail: string;
  agreedToTerms: boolean;
}

export interface SubmitNodeCommentResult {
  ok: boolean;
  error?: string;
}

export async function submitNodeComment(input: SubmitNodeCommentInput): Promise<SubmitNodeCommentResult> {
  const name = input.guestName.trim();
  const email = input.guestEmail.trim();
  const body = input.body.trim();

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Please enter a valid email address." };
  if (!body) return { ok: false, error: "Please write a comment." };
  if (!input.agreedToTerms) return { ok: false, error: "Please confirm you are responsible for this content before submitting." };

  const supabase = await createClient();
  const rpcArgs = {
    p_node_id: input.nodeId,
    p_body: body,
    p_guest_name: name,
    p_guest_email: email,
    p_agreed_to_terms: true,
  };

  // src/types/database.ts is still the Task 3 placeholder (see the
  // identical, already-documented cast in src/lib/reviews/actions.ts).
  const { error } = await supabase.rpc("submit_node_comment" as unknown as never, rpcArgs as unknown as undefined);

  if (error) {
    if (error.message.includes("limit of 2 submissions per day")) {
      return { ok: false, error: "You've reached the limit of 2 submissions per day for this email address. Please try again tomorrow." };
    }
    return { ok: false, error: "We couldn't submit your comment right now. Please try again." };
  }

  return { ok: true };
}
