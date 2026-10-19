"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createLocationMediaSubmission } from "@/lib/locations/media-submissions/actions";
import { MAX_SUBMISSION_IMAGES } from "@/lib/locations/media-submissions/types";

/** Guest photo submission form. Every submission sits as status='pending'
 * until staff approves it — nothing is implied to be live instantly. */
export function LocationMediaUploadForm({ locationId }: { locationId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <p className="rounded-xl border border-maldives-200 bg-maldives-50 p-4 text-sm text-ocean-900">
        Thanks — your photos have been submitted and will be added to the gallery once they&rsquo;ve been checked.
      </p>
    );
  }

  if (!showForm) {
    return (
      <Button size="sm" onClick={() => setShowForm(true)}>
        Share your photos
      </Button>
    );
  }

  return (
    <form
      className="space-y-3 rounded-xl border border-neutral-200 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const form = event.currentTarget;
        const data = new FormData(form);

        startTransition(async () => {
          const result = await createLocationMediaSubmission(locationId, data);
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          setSubmitted(true);
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Photos (up to {MAX_SUBMISSION_IMAGES})</span>
        <input
          name="files"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          required
          className="block w-full text-sm text-neutral-700"
        />
      </label>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Your name</span>
          <input name="submitterName" type="text" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1" />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Email (not shown publicly)</span>
          <input name="submitterEmail" type="email" required className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1" />
        </label>
      </div>

      <label className="flex items-start gap-2 text-xs text-neutral-600">
        <input name="agreedToTerms" type="checkbox" required className="mt-0.5" />
        <span>
          I confirm these photos are my own, or that I have the right to share them, and that I am solely responsible for
          what I submit. Maldives Tour Guide is not responsible for any copyright or other claims arising from content I
          submit.
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Uploading…" : "Submit photos"}
      </Button>
    </form>
  );
}
