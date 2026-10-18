"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { bulkApplyRouteMediaToRoutesWithoutImages } from "@/lib/admin/transfer-media-bulk-actions";

/** Lets staff upload a route's photos once (through this route's own
 * Images section) and then copy that same set onto every OTHER transfer
 * route that has zero images yet — avoids repeating the same upload
 * one-by-one across a long route list. See
 * bulkApplyRouteMediaToRoutesWithoutImages for why this exists instead of
 * a server-side bulk upload. */
export function BulkApplyRouteMediaForm({ routesWithMedia }: { routesWithMedia: Array<{ id: string; title: string }> }) {
  const router = useRouter();
  const [sourceId, setSourceId] = useState(routesWithMedia[0]?.id ?? "");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (routesWithMedia.length === 0) return null;

  function apply() {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const result = await bulkApplyRouteMediaToRoutesWithoutImages(sourceId);
      if (!result.ok) {
        setError(result.error ?? "Failed to apply images.");
        return;
      }
      const count = result.appliedCount ?? 0;
      setMessage(count > 0 ? `Applied to ${count} route${count === 1 ? "" : "s"} that had no images.` : "Every route already has images — nothing to apply.");
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="bulk-media-source" className="text-xs font-medium text-neutral-600">
          Apply this route&rsquo;s images to every route with none yet
        </label>
        <select
          id="bulk-media-source"
          value={sourceId}
          onChange={(e) => setSourceId(e.target.value)}
          disabled={isPending}
          className="rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
        >
          {routesWithMedia.map((r) => (
            <option key={r.id} value={r.id}>
              {r.title}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={apply}
        disabled={isPending || !sourceId}
        className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
      >
        {isPending ? "Applying…" : "Apply to routes missing images"}
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
