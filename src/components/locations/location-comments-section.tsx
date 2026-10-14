"use client";

import { useState } from "react";

import { WriteLocationCommentForm } from "@/components/locations/write-location-comment-form";
import { Button } from "@/components/ui/button";
import type { LocationComment } from "@/lib/locations/comments/types";

/** Real comments only, an honest empty state, and a real submission flow —
 * same approach as src/components/reviews/reviews-section.tsx. */
export function LocationCommentsSection({ locationId, comments }: { locationId: string; comments: LocationComment[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold text-ocean-900">Traveller Comments</h2>

      {comments.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-600">No comments yet. Be the first to share your experience.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-xl border border-neutral-200 p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-ocean-900">{comment.authorName}</p>
                <span className="text-xs text-neutral-500">{new Date(comment.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-700">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      {showForm ? (
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <WriteLocationCommentForm locationId={locationId} />
        </div>
      ) : (
        <Button variant="secondary" size="sm" className="mt-4" onClick={() => setShowForm(true)}>
          Write a Comment
        </Button>
      )}
    </section>
  );
}
