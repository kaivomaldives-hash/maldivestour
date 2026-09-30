"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProviderOption } from "@/lib/admin/providers-repository";
import type { AdminTransferServiceItem } from "@/lib/admin/transfers-repository";
import {
  createTransferService,
  deleteTransferService,
  updateTransferService,
  type TransferServiceInput,
} from "@/lib/admin/transfers-actions";
import type { SharedOrPrivate, TransferServiceStatus, TransferType } from "@/lib/transfers/types";

const TRANSFER_TYPES: TransferType[] = ["speedboat", "seaplane", "domestic_flight", "ferry", "private_yacht", "land_transfer"];
const SHARED_OR_PRIVATE: SharedOrPrivate[] = ["shared", "private"];
const SERVICE_STATUSES: TransferServiceStatus[] = ["active", "seasonal", "suspended", "discontinued"];

const STATUS_TONE: Record<TransferServiceStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  active: "maldives",
  seasonal: "aqua",
  suspended: "outline",
  discontinued: "neutral",
};

const EMPTY_INPUT: TransferServiceInput = {
  providerId: null,
  transferType: "speedboat",
  vehicleType: null,
  sharedOrPrivate: "shared",
  durationMinutes: null,
  price: 0,
  currency: "USD",
  capacity: null,
  luggageAllowance: null,
  status: "active",
  pickupInstructions: null,
  dropoffInstructions: null,
  bookingRequirements: null,
  cancellationPolicy: null,
  description: null,
  isBookable: true,
  facilities: [],
};

function inputFromService(s: AdminTransferServiceItem): TransferServiceInput {
  return {
    providerId: s.providerId,
    transferType: s.transferType,
    vehicleType: s.vehicleType,
    sharedOrPrivate: s.sharedOrPrivate,
    durationMinutes: s.durationMinutes,
    price: s.price,
    currency: s.currency,
    capacity: s.capacity,
    luggageAllowance: s.luggageAllowance,
    status: s.status,
    pickupInstructions: s.pickupInstructions,
    dropoffInstructions: s.dropoffInstructions,
    bookingRequirements: s.bookingRequirements,
    cancellationPolicy: s.cancellationPolicy,
    description: s.description,
    isBookable: s.isBookable,
    facilities: s.facilities,
  };
}

/** Manages the commercial offerings on one transfer route. Unlike
 * accommodations/activities, transfer_services is not node-backed (see
 * transfers-repository.ts's top comment), so this has its own create/
 * update/delete actions rather than reusing node-actions.ts — and its own
 * inline expand/collapse form rather than a full page, since a route
 * typically has only a handful of services. */
export function TransferServicesManager({
  routeId,
  services,
  providerOptions,
}: {
  routeId: string;
  services: AdminTransferServiceItem[];
  providerOptions: ProviderOption[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [input, setInput] = useState<TransferServiceInput>(EMPTY_INPUT);
  const [facilitiesText, setFacilitiesText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setEditingId("new");
    setInput(EMPTY_INPUT);
    setFacilitiesText("");
    setError(null);
  }

  function openEdit(service: AdminTransferServiceItem) {
    setEditingId(service.id);
    setInput(inputFromService(service));
    setFacilitiesText(service.facilities.join(", "));
    setError(null);
  }

  function closeForm() {
    setEditingId(null);
    setError(null);
  }

  function save() {
    setError(null);
    const facilities = facilitiesText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const payload: TransferServiceInput = { ...input, facilities };

    startTransition(async () => {
      const result =
        editingId && editingId !== "new" ? await updateTransferService(editingId, routeId, payload) : await createTransferService(routeId, payload);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      setEditingId(null);
      router.refresh();
    });
  }

  function remove(serviceId: string) {
    setError(null);
    startTransition(async () => {
      const result = await deleteTransferService(serviceId, routeId);
      if (!result.ok) {
        setError(result.error ?? "Failed to delete.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Services ({services.length})</h2>
        {editingId === null && (
          <Button type="button" size="sm" onClick={openNew}>
            Add service
          </Button>
        )}
      </div>

      {services.length === 0 && editingId === null && <p className="text-sm text-neutral-500">No services on this route yet.</p>}

      {services.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Shared/Private</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Provider</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-neutral-50">
                  <td className="px-3 py-2">{s.transferType.replace("_", " ")}</td>
                  <td className="px-3 py-2 capitalize">{s.sharedOrPrivate}</td>
                  <td className="px-3 py-2">
                    {s.currency} {s.price.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 text-neutral-600">{s.providerName ?? "—"}</td>
                  <td className="px-3 py-2">
                    <Badge tone={STATUS_TONE[s.status]}>{s.status}</Badge>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => openEdit(s)} className="text-xs font-medium text-maldives-600 hover:underline">
                        Edit
                      </button>
                      <button type="button" onClick={() => remove(s.id)} disabled={isPending} className="text-xs font-medium text-red-600 hover:underline">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId !== null && (
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <h3 className="text-sm font-semibold text-neutral-700">{editingId === "new" ? "New service" : "Edit service"}</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Transfer type</span>
              <select
                value={input.transferType}
                onChange={(e) => setInput((f) => ({ ...f, transferType: e.target.value as TransferType }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              >
                {TRANSFER_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Shared or private</span>
              <select
                value={input.sharedOrPrivate}
                onChange={(e) => setInput((f) => ({ ...f, sharedOrPrivate: e.target.value as SharedOrPrivate }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              >
                {SHARED_OR_PRIVATE.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Status</span>
              <select
                value={input.status}
                onChange={(e) => setInput((f) => ({ ...f, status: e.target.value as TransferServiceStatus }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              >
                {SERVICE_STATUSES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Provider</span>
              <select
                value={input.providerId ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, providerId: e.target.value || null }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              >
                <option value="">— None —</option>
                {providerOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Vehicle type</span>
              <input
                value={input.vehicleType ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, vehicleType: e.target.value || null }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Duration (minutes)</span>
              <input
                type="number"
                min={0}
                value={input.durationMinutes ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, durationMinutes: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Price *</span>
              <input
                type="number"
                min={0}
                step="0.01"
                value={input.price || ""}
                onChange={(e) => setInput((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : 0 }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Currency</span>
              <input
                value={input.currency}
                onChange={(e) => setInput((f) => ({ ...f, currency: e.target.value.toUpperCase() }))}
                maxLength={3}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm uppercase"
              />
            </label>

            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Capacity</span>
              <input
                type="number"
                min={0}
                value={input.capacity ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, capacity: e.target.value ? Number(e.target.value) : null }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-neutral-700">Luggage allowance</span>
              <input
                value={input.luggageAllowance ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, luggageAllowance: e.target.value || null }))}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={input.isBookable} onChange={(e) => setInput((f) => ({ ...f, isBookable: e.target.checked }))} />
              <span className="font-medium text-neutral-700">Bookable online</span>
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Facilities (comma-separated)</span>
            <input
              value={facilitiesText}
              onChange={(e) => setFacilitiesText(e.target.value)}
              placeholder="e.g. Life jackets, Air conditioning"
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Description</span>
            <textarea
              value={input.description ?? ""}
              onChange={(e) => setInput((f) => ({ ...f, description: e.target.value || null }))}
              rows={2}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Pickup instructions</span>
              <textarea
                value={input.pickupInstructions ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, pickupInstructions: e.target.value || null }))}
                rows={2}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Drop-off instructions</span>
              <textarea
                value={input.dropoffInstructions ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, dropoffInstructions: e.target.value || null }))}
                rows={2}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Booking requirements</span>
              <textarea
                value={input.bookingRequirements ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, bookingRequirements: e.target.value || null }))}
                rows={2}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-neutral-700">Cancellation policy</span>
              <textarea
                value={input.cancellationPolicy ?? ""}
                onChange={(e) => setInput((f) => ({ ...f, cancellationPolicy: e.target.value || null }))}
                rows={2}
                className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <Button type="button" onClick={save} disabled={isPending} size="sm">
              {isPending ? "Saving…" : editingId === "new" ? "Add service" : "Save service"}
            </Button>
            <button type="button" onClick={closeForm} className="text-sm text-neutral-600 hover:underline">
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
