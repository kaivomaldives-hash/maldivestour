"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CommissionPercentField } from "@/components/partner/commission-percent-field";
import { PartnerLocationPicker } from "@/components/partner/partner-location-picker";
import { Button } from "@/components/ui/button";
import type { PartnerLocationOption } from "@/lib/partner/location-search-actions";
import { submitListing } from "@/lib/partner/listings/actions";
import { SHARED_OR_PRIVATE, TRANSFER_TYPES, type TransferRouteListingPayload } from "@/lib/partner/listings/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function PartnerTransferForm({
  nodeId,
  initial,
  initialOrigin,
  initialDestination,
}: {
  nodeId: string | null;
  initial: TransferRouteListingPayload | null;
  initialOrigin: PartnerLocationOption | null;
  initialDestination: PartnerLocationOption | null;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState<PartnerLocationOption | null>(initialOrigin);
  const [destination, setDestination] = useState<PartnerLocationOption | null>(initialDestination);

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        if (!origin || !destination) {
          setError("Origin and destination are both required.");
          return;
        }
        const data = new FormData(event.currentTarget);

        const payload: TransferRouteListingPayload = {
          title: String(data.get("title") ?? ""),
          summary: String(data.get("summary") ?? "") || null,
          originLocationId: origin.id,
          destinationLocationId: destination.id,
          distanceKm: Number(data.get("distanceKm")) || null,
          typicalDurationMinutes: Number(data.get("typicalDurationMinutes")) || null,
          service: {
            id: initial?.service.id ?? null,
            transferType: String(data.get("transferType") ?? "speedboat") as TransferRouteListingPayload["service"]["transferType"],
            vehicleType: String(data.get("vehicleType") ?? "") || null,
            sharedOrPrivate: String(data.get("sharedOrPrivate") ?? "shared") as TransferRouteListingPayload["service"]["sharedOrPrivate"],
            durationMinutes: Number(data.get("serviceDurationMinutes")) || null,
            price: Number(data.get("price")) || 0,
            currency: String(data.get("currency") ?? "USD") || "USD",
            capacity: Number(data.get("capacity")) || null,
            luggageAllowance: String(data.get("luggageAllowance") ?? "") || null,
            status: "active",
            pickupInstructions: String(data.get("pickupInstructions") ?? "") || null,
            dropoffInstructions: String(data.get("dropoffInstructions") ?? "") || null,
            bookingRequirements: String(data.get("bookingRequirements") ?? "") || null,
            cancellationPolicy: String(data.get("cancellationPolicy") ?? "") || null,
            description: String(data.get("description") ?? "") || null,
            commissionPercent: Number(data.get("commissionPercent")) || 15,
          },
        };

        if (!payload.service.price || payload.service.price <= 0) {
          setError("Price must be greater than zero.");
          return;
        }

        startTransition(async () => {
          const result = await submitListing({ nodeType: "transfer_route", submissionKind: nodeId ? "update" : "create", nodeId, payload });
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
          Route name <span aria-hidden="true">*</span>
        </span>
        <input name="title" type="text" required defaultValue={initial?.title ?? ""} placeholder="e.g. Male Airport to Maafushi" className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Summary</span>
        <textarea name="summary" rows={2} defaultValue={initial?.summary ?? ""} className={INPUT_CLASS} />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PartnerLocationPicker value={origin} onChange={setOrigin} label="Origin *" />
        <PartnerLocationPicker value={destination} onChange={setDestination} label="Destination *" />
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Distance (km)</span>
          <input name="distanceKm" type="number" min={0} step="0.1" defaultValue={initial?.distanceKm ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Typical duration (minutes)</span>
          <input name="typicalDurationMinutes" type="number" min={0} defaultValue={initial?.typicalDurationMinutes ?? ""} className={INPUT_CLASS} />
        </label>
      </div>

      <h3 className="border-t border-neutral-200 pt-4 text-sm font-semibold text-ocean-900">Service details</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Transfer type</span>
          <select name="transferType" defaultValue={initial?.service.transferType ?? "speedboat"} className={INPUT_CLASS}>
            {TRANSFER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Shared or private</span>
          <select name="sharedOrPrivate" defaultValue={initial?.service.sharedOrPrivate ?? "shared"} className={INPUT_CLASS}>
            {SHARED_OR_PRIVATE.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Vehicle/boat type</span>
          <input name="vehicleType" type="text" defaultValue={initial?.service.vehicleType ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Duration (minutes)</span>
          <input name="serviceDurationMinutes" type="number" min={0} defaultValue={initial?.service.durationMinutes ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Price <span aria-hidden="true">*</span>
          </span>
          <input name="price" type="number" min={0.01} step="0.01" required defaultValue={initial?.service.price ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Currency</span>
          <input name="currency" type="text" defaultValue={initial?.service.currency ?? "USD"} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Capacity</span>
          <input name="capacity" type="number" min={1} defaultValue={initial?.service.capacity ?? ""} className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Luggage allowance</span>
          <input name="luggageAllowance" type="text" defaultValue={initial?.service.luggageAllowance ?? ""} className={INPUT_CLASS} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Pickup instructions</span>
        <textarea name="pickupInstructions" rows={2} defaultValue={initial?.service.pickupInstructions ?? ""} className={INPUT_CLASS} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Drop-off instructions</span>
        <textarea name="dropoffInstructions" rows={2} defaultValue={initial?.service.dropoffInstructions ?? ""} className={INPUT_CLASS} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Booking requirements</span>
        <textarea name="bookingRequirements" rows={2} defaultValue={initial?.service.bookingRequirements ?? ""} className={INPUT_CLASS} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Cancellation policy</span>
        <textarea name="cancellationPolicy" rows={2} defaultValue={initial?.service.cancellationPolicy ?? ""} className={INPUT_CLASS} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Description</span>
        <textarea name="description" rows={3} defaultValue={initial?.service.description ?? ""} className={INPUT_CLASS} />
      </label>

      <CommissionPercentField defaultValue={initial?.service.commissionPercent ?? null} />

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
