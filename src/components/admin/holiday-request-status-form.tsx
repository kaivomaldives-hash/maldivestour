"use client";

import { useState, useTransition } from "react";

import { updateHolidayRequestStatus } from "@/lib/admin/holiday-requests-actions";
import { HOLIDAY_REQUEST_STATUSES } from "@/lib/admin/holiday-request-status";

const INPUT_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function HolidayRequestStatusForm({ requestId, currentStatus, currentNotes }: { requestId: string; currentStatus: string; currentNotes: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const result = await updateHolidayRequestStatus(requestId, status, notes);
      if (!result.ok) {
        setError(result.error ?? "Failed to save.");
        return;
      }
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Status</h2>
      <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${INPUT_CLASS} mt-3`}>
        {HOLIDAY_REQUEST_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s[0].toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>

      <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Internal notes</h2>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className={`${INPUT_CLASS} mt-2`} placeholder="Staff-only notes…" />

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save"}
        </button>
        {savedAt && !isPending && <span className="text-xs text-neutral-500">Saved</span>}
      </div>
    </div>
  );
}
