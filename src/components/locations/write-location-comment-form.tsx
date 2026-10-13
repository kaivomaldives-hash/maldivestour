"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { submitLocationComment } from "@/lib/locations/comments/actions";

/** A real submission form, wired to the guest-safe submit_location_comment
 * RPC. Every submission lands as status='pending' — the form is honest
 * about that rather than implying instant publication. */
export function WriteLocationCommentForm({ locationId }: { locationId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-xl border border-maldives-200 bg-maldives-50 p-4 text-sm text-ocean-900">
        Thanks — your comment has been submitted and will appear here once it&rsquo;s been checked.
      </p>
    );
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const form = event.currentTarget;
        const data = new FormData(form);

        startTransition(async () => {
          const result = await submitLocationComment({
            locationId,
            body: String(data.get("body") ?? ""),
            guestName: String(data.get("guestName") ?? ""),
            guestEmail: String(data.get("guestEmail") ?? ""),
          });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          setSubmitted(true);
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Your comment</span>
        <textarea name="body" rows={3} required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1" />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Your name</span>
          <input name="guestName" type="text" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1" />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Email (not shown publicly)</span>
          <input name="guestEmail" type="email" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1" />
        </label>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit comment"}
      </Button>
    </form>
  );
}
