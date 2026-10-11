"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PartnerLocationPicker } from "@/components/partner/partner-location-picker";
import { Button } from "@/components/ui/button";
import type { PartnerLocationOption } from "@/lib/partner/location-search-actions";
import { submitListing } from "@/lib/partner/listings/actions";
import { ACCOMMODATION_TYPES, PRICE_TIERS, type AccommodationListingPayload, type PartnerRoomInput } from "@/lib/partner/listings/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

const EMPTY_ROOM: PartnerRoomInput = { name: "", priceFrom: null, priceCurrency: "USD", bedType: "", maxOccupancy: null };

export function PartnerAccommodationForm({
  nodeId,
  initial,
  initialLocation,
}: {
  nodeId: string | null;
  initial: AccommodationListingPayload | null;
  initialLocation: PartnerLocationOption | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<PartnerLocationOption | null>(initialLocation);
  const [rooms, setRooms] = useState<PartnerRoomInput[]>(initial?.rooms.length ? initial.rooms : [{ ...EMPTY_ROOM }]);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const data = new FormData(event.currentTarget);

        const payload: AccommodationListingPayload = {
          title: String(data.get("title") ?? ""),
          summary: String(data.get("summary") ?? "") || null,
          accommodationType: String(data.get("accommodationType") ?? "resort") as AccommodationListingPayload["accommodationType"],
          starRating: Number(data.get("starRating")) || null,
          priceTier: (String(data.get("priceTier") ?? "") || null) as AccommodationListingPayload["priceTier"],
          roomCount: Number(data.get("roomCount")) || null,
          allInclusive: data.get("allInclusive") === "on",
          overwaterVillas: data.get("overwaterVillas") === "on",
          checkInTime: String(data.get("checkInTime") ?? "") || null,
          checkOutTime: String(data.get("checkOutTime") ?? "") || null,
          currency: String(data.get("currency") ?? "USD") || "USD",
          priceFrom: Number(data.get("priceFrom")) || null,
          locationId: location?.id ?? null,
          rooms: rooms.filter((r) => r.name.trim().length > 0),
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-neutral-700">
            Property name <span aria-hidden="true">*</span>
          </span>
          <input name="title" type="text" required defaultValue={initial?.title ?? ""} className={INPUT_CLASS} />
        </label>

        <label className="block text-sm sm:col-span-2">
          <span className="mb-1 block font-medium text-neutral-700">Summary</span>
          <textarea name="summary" rows={3} defaultValue={initial?.summary ?? ""} className={INPUT_CLASS} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Property type</span>
          <select name="accommodationType" defaultValue={initial?.accommodationType ?? "resort"} className={INPUT_CLASS}>
            {ACCOMMODATION_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Price tier</span>
          <select name="priceTier" defaultValue={initial?.priceTier ?? ""} className={INPUT_CLASS}>
            <option value="">No preference</option>
            {PRICE_TIERS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Star rating</span>
          <input name="starRating" type="number" min={1} max={5} defaultValue={initial?.starRating ?? ""} className={INPUT_CLASS} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Room count</span>
          <input name="roomCount" type="number" min={0} defaultValue={initial?.roomCount ?? ""} className={INPUT_CLASS} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Check-in time</span>
          <input name="checkInTime" type="time" defaultValue={initial?.checkInTime ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Check-out time</span>
          <input name="checkOutTime" type="time" defaultValue={initial?.checkOutTime ?? ""} className={INPUT_CLASS} />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">From price (per night)</span>
          <input name="priceFrom" type="number" min={0} step="0.01" defaultValue={initial?.priceFrom ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Currency</span>
          <input name="currency" type="text" defaultValue={initial?.currency ?? "USD"} className={INPUT_CLASS} />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input name="allInclusive" type="checkbox" defaultChecked={initial?.allInclusive ?? false} />
          <span className="font-medium text-neutral-700">All-inclusive</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="overwaterVillas" type="checkbox" defaultChecked={initial?.overwaterVillas ?? false} />
          <span className="font-medium text-neutral-700">Overwater villas</span>
        </label>
      </div>

      <PartnerLocationPicker value={location} onChange={setLocation} label="Island / location" />

      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">Room types</span>
          <button
            type="button"
            onClick={() => setRooms((prev) => [...prev, { ...EMPTY_ROOM }])}
            className="text-sm font-medium text-maldives-600 hover:underline"
          >
            + Add room type
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {rooms.map((room, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-neutral-200 p-3 sm:grid-cols-5">
              <input
                value={room.name}
                onChange={(e) => setRooms((prev) => prev.map((r, j) => (j === i ? { ...r, name: e.target.value } : r)))}
                placeholder="Room name"
                className={`${INPUT_CLASS} sm:col-span-2`}
              />
              <input
                value={room.priceFrom ?? ""}
                onChange={(e) => setRooms((prev) => prev.map((r, j) => (j === i ? { ...r, priceFrom: Number(e.target.value) || null } : r)))}
                type="number"
                placeholder="Price/night"
                className={INPUT_CLASS}
              />
              <input
                value={room.bedType ?? ""}
                onChange={(e) => setRooms((prev) => prev.map((r, j) => (j === i ? { ...r, bedType: e.target.value } : r)))}
                placeholder="Bed type"
                className={INPUT_CLASS}
              />
              <div className="flex items-center gap-2">
                <input
                  value={room.maxOccupancy ?? ""}
                  onChange={(e) => setRooms((prev) => prev.map((r, j) => (j === i ? { ...r, maxOccupancy: Number(e.target.value) || null } : r)))}
                  type="number"
                  placeholder="Max guests"
                  className={INPUT_CLASS}
                />
                {rooms.length > 1 && (
                  <button type="button" onClick={() => setRooms((prev) => prev.filter((_, j) => j !== i))} className="shrink-0 text-xs text-neutral-500 hover:text-red-600">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-neutral-500">
        Photos aren&rsquo;t part of this form yet — our team will add gallery images for your property once it&rsquo;s approved.
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
