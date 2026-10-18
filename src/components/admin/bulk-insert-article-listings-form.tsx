"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { bulkInsertActivityListingsIntoArticles } from "@/lib/admin/article-listing-bulk-actions";

/** One click: drop real `<!--listing:activity:SLUG-->` cards (the article
 * editor's own "+ Insert real listing" marker) into every published
 * article that doesn't have one yet, using each article's already-linked
 * related activities — see bulkInsertActivityListingsIntoArticles for why
 * this only ever uses real, non-fabricated relationships. */
export function BulkInsertArticleListingsForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function apply() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await bulkInsertActivityListingsIntoArticles();
      if (!result.ok) {
        setError(result.error ?? "Failed to insert listings.");
        return;
      }
      const updated = result.updatedCount ?? 0;
      const skipped = result.skippedCount ?? 0;
      setMessage(
        updated > 0
          ? `Added related activity listings to ${updated} article${updated === 1 ? "" : "s"}. ${skipped} skipped (already had listings or no related activities).`
          : "No articles needed updating — already have listings or have no related activities yet.",
      );
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-neutral-600">Insert related activity listings into every article missing them</p>
        <p className="text-xs text-neutral-400">Uses each article&rsquo;s real related activities — never a fabricated or guessed listing.</p>
      </div>
      <button
        type="button"
        onClick={apply}
        disabled={isPending}
        className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
      >
        {isPending ? "Applying…" : "Insert listings into all articles"}
      </button>
      {message && <p className="text-sm text-maldives-600">{message}</p>}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
