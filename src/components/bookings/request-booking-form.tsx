"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createTransferBookingInquiry } from "@/lib/bookings/actions";

const WHATSAPP_NUMBER = "9607794332";

export interface RequestBookingFormProps {
  transferServiceId: string;
  originLocationId: string | null;
  destinationLocationId: string | null;
  originTitle: string;
  destinationTitle: string;
  price: number;
  currency: string;
}

/**
 * Task 18: the first UI ever wired to the existing create_booking_inquiry
 * RPC (Task 2/3) — see src/lib/bookings/actions.ts for why this is a thin
 * wrapper, not a new booking system. A successful submission is a real
 * row in `bookings` with a real, sequentially-generated booking_reference;
 * there is no email/SMS delivery integration in this project to plug into
 * (checked — booking_notifications only records an email row for a
 * separate process to send, nothing sends it yet), so the confirmation
 * honestly offers WhatsApp as the immediate next step, using the site's
 * own real, already-published number (src/components/site-header.tsx).
 */
export function RequestBookingForm({
  transferServiceId,
  originLocationId,
  destinationLocationId,
  originTitle,
  destinationTitle,
  price,
  currency,
}: RequestBookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [tripType, setTripType] = useState<"one_way" | "round_trip">("one_way");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  if (reference) {
    const waMessage = encodeURIComponent(`Hi, I'd like to confirm my transfer booking ${reference} (${originTitle} to ${destinationTitle}).`);
    return (
      <div className="rounded-2xl border border-maldives-200 bg-maldives-50 p-6 text-center">
        <p className="text-lg font-semibold text-ocean-900">Request received</p>
        <p className="mt-1 text-sm text-neutral-700">
          Your reference is <span className="font-mono font-semibold">{reference}</span>. We&rsquo;ll confirm availability and follow up on
          the contact details you provided.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          Continue on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const form = event.currentTarget;
        const data = new FormData(form);

        startTransition(async () => {
          const result = await createTransferBookingInquiry({
            transferServiceId,
            originLocationId,
            destinationLocationId,
            customerName: String(data.get("customerName") ?? ""),
            customerEmail: String(data.get("customerEmail") ?? ""),
            customerPhone: String(data.get("customerPhone") ?? ""),
            customerWhatsapp: String(data.get("customerWhatsapp") ?? ""),
            travelDate: String(data.get("travelDate") ?? ""),
            travelTime: String(data.get("travelTime") ?? "") || null,
            returnDate: tripType === "round_trip" ? String(data.get("returnDate") ?? "") || null : null,
            returnTime: tripType === "round_trip" ? String(data.get("returnTime") ?? "") || null : null,
            tripType,
            adults: Number(data.get("adults") ?? 1) || 1,
            children: Number(data.get("children") ?? 0) || 0,
            infants: Number(data.get("infants") ?? 0) || 0,
            flightNumber: String(data.get("flightNumber") ?? "") || null,
            specialRequests: String(data.get("specialRequests") ?? "") || null,
            estimatedPrice: price,
            currency,
          });

          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          setReference(result.bookingReference ?? null);
        });
      }}
    >
      <div className="flex gap-2" role="radiogroup" aria-label="Trip type">
        {(["one_way", "round_trip"] as const).map((type) => (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={tripType === type}
            onClick={() => setTripType(type)}
            className={`min-touch-target rounded-full border px-4 py-2 text-sm font-medium ${
              tripType === type ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"
            }`}
          >
            {type === "one_way" ? "One-way" : "Round trip"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" name="customerName" type="text" required autoComplete="name" />
        <Field label="Email" name="customerEmail" type="email" required autoComplete="email" />
        <Field label="Phone" name="customerPhone" type="tel" autoComplete="tel" />
        <Field label="WhatsApp number" name="customerWhatsapp" type="tel" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Travel date" name="travelDate" type="date" required />
        <Field label="Travel time" name="travelTime" type="time" />
        {tripType === "round_trip" && (
          <>
            <Field label="Return date" name="returnDate" type="date" required />
            <Field label="Return time" name="returnTime" type="time" />
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Adults" name="adults" type="number" min={1} defaultValue={2} />
        <Field label="Children" name="children" type="number" min={0} defaultValue={0} />
        <Field label="Infants" name="infants" type="number" min={0} defaultValue={0} />
      </div>

      <Field label="Flight number (optional)" name="flightNumber" type="text" />

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Special requests (optional)</span>
        <textarea
          name="specialRequests"
          rows={3}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-4">
        <p className="text-sm text-neutral-600">
          From {currency} <span className="font-semibold text-ocean-900">{price}</span> per person
        </p>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending…" : "Request this transfer"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
  min,
  defaultValue,
}: {
  label: string;
  name: string;
  type: string;
  required?: boolean;
  autoComplete?: string;
  min?: number;
  defaultValue?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-neutral-700">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        min={min}
        defaultValue={defaultValue}
        className="min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
      />
    </label>
  );
}
