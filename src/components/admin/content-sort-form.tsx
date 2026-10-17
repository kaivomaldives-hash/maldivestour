"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { setContentSortSetting } from "@/lib/admin/content-sort-actions";
import { CONTENT_SORT_MODES, CONTENT_SORT_LABELS, PRICE_SORT_SUPPORTED, type ContentSortMode, type SortableNodeType } from "@/lib/content-sort/types";

/** Lets staff set the default display order for a public listing page
 * (packages/activities/accommodations/transfers). Price sort options are
 * hidden for transfer_route since routes have no direct price column (see
 * PRICE_SORT_SUPPORTED's own comment). "Manual" mode is completed by the
 * per-row SortOrderInput on each list page, not by anything here. */
export function ContentSortForm({ nodeType, currentMode }: { nodeType: SortableNodeType; currentMode: ContentSortMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<ContentSortMode>(currentMode);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const modes = CONTENT_SORT_MODES.filter((m) => PRICE_SORT_SUPPORTED[nodeType] || (m !== "price_asc" && m !== "price_desc"));

  function save(next: ContentSortMode) {
    setMode(next);
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await setContentSortSetting(nodeType, next);
      if (!result.ok) {
        setError(result.error ?? "Failed to save.");
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor={`sort-${nodeType}`} className="text-xs font-medium text-neutral-600">
          Default order on the public site
        </label>
        <select
          id={`sort-${nodeType}`}
          value={mode}
          onChange={(e) => save(e.target.value as ContentSortMode)}
          disabled={isPending}
          className="rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
        >
          {modes.map((m) => (
            <option key={m} value={m}>
              {CONTENT_SORT_LABELS[m]}
            </option>
          ))}
        </select>
      </div>
      {isPending && <p className="text-sm text-neutral-500">Saving…</p>}
      {!isPending && saved && <p className="text-sm text-maldives-600">Saved.</p>}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {mode === "manual" && <p className="w-full text-sm text-neutral-500">Set each item&rsquo;s position in the &ldquo;Position&rdquo; column below. Lower numbers show first; items left blank sort last.</p>}
    </div>
  );
}
