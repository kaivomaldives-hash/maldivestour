"use client";

import { useState, useTransition } from "react";

import { updateNodeSortOrder } from "@/lib/admin/content-sort-actions";

/** Per-row numeric position field for "manual" sort mode. Commits on blur
 * or Enter so staff can tab through a whole table without a save button
 * per row; an empty value clears the position (sorts last, per the
 * nulls-last ordering every repository applies). */
export function SortOrderInput({ nodeId, defaultValue }: { nodeId: string; defaultValue: number | null }) {
  const [value, setValue] = useState<string>(defaultValue === null ? "" : String(defaultValue));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function commit() {
    const trimmed = value.trim();
    const position = trimmed === "" ? null : Number(trimmed);
    if (position !== null && (!Number.isInteger(position) || position < 0)) {
      setError("Whole number ≥ 0");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateNodeSortOrder(nodeId, position);
      if (!result.ok) setError(result.error ?? "Failed to save.");
    });
  }

  return (
    <div className="flex flex-col gap-0.5">
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
        }}
        disabled={isPending}
        placeholder="—"
        className="w-20 rounded-lg border border-neutral-300 px-2 py-1 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
      />
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
