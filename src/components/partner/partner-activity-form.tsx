"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PartnerLocationPicker } from "@/components/partner/partner-location-picker";
import { Button } from "@/components/ui/button";
import type { PartnerLocationOption } from "@/lib/partner/location-search-actions";
import { submitListing } from "@/lib/partner/listings/actions";
import { ACTIVITY_CATEGORIES, ACTIVITY_DIFFICULTIES, type ActivityListingPayload } from "@/lib/partner/listings/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function PartnerActivityForm({
  nodeId,
  initial,
  initialLocation,
}: {
  nodeId: string | null;
  initial: ActivityListingPayload | null;
  initialLocation: PartnerLocationOption | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<PartnerLocationOption | null>(initialLocation);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);

        const payload: ActivityListingPayload = {
          title: String(data.get("title") ?? ""),
          summary: String(data.get("summary") ?? "") || null,
          activityCategory: String(data.get("activityCategory") ?? "general") as ActivityListingPayload["activityCategory"],
          durationMinutes: Number(data.get("durationMinutes")) || null,
          minAge: Number(data.get("minAge")) || null,
          difficulty: (String(data.get("difficulty") ?? "") || null) as ActivityListingPayload["difficulty"],
          priceFrom: Number(data.get("priceFrom")) || null,
          currency: String(data.get("currency") ?? "USD") || "USD",
          maxParticipants: Number(data.get("maxParticipants")) || null,
          locationId: location?.id ?? null,
        };

        startTransition(async () => {
          const result = await submitListing({ submissionKind: nodeId ? "update" : "create", nodeId, payload });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          router.push("/partner/listings");
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Activity name <span aria-hidden="true">*</span>
        </span>
        <input name="title" type="text" required defaultValue={initial?.title ?? ""} className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Summary</span>
        <textarea name="summary" rows={3} defaultValue={initial?.summary ?? ""} className={INPUT_CLASS} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Category</span>
          <select name="activityCategory" defaultValue={initial?.activityCategory ?? "general"} className={INPUT_CLASS}>
            {ACTIVITY_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Difficulty</span>
          <select name="difficulty" defaultValue={initial?.difficulty ?? ""} className={INPUT_CLASS}>
            <option value="">No preference</option>
            {ACTIVITY_DIFFICULTIES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Duration (minutes)</span>
          <input name="durationMinutes" type="number" min={0} defaultValue={initial?.durationMinutes ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Minimum age</span>
          <input name="minAge" type="number" min={0} defaultValue={initial?.minAge ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Max participants</span>
          <input name="maxParticipants" type="number" min={1} defaultValue={initial?.maxParticipants ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">From price</span>
          <input name="priceFrom" type="number" min={0} step="0.01" defaultValue={initial?.priceFrom ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Currency</span>
          <input name="currency" type="text" defaultValue={initial?.currency ?? "USD"} className={INPUT_CLASS} />
        </label>
      </div>

      <PartnerLocationPicker value={location} onChange={setLocation} label="Island / location" />

      <p className="text-xs text-neutral-500">
        Photos aren&rsquo;t part of this form yet — our team will add gallery images once it&rsquo;s approved.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting…" : nodeId ? "Submit Changes for Review" : "Submit for Review"}
        </Button>
      </div>
    </form>
  );
}
