"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { createNodeInquiry } from "@/lib/bookings/actions";

const WHATSAPP_NUMBER = "9607794332";

export interface NodeInquiryFormProps {
  productNodeId: string;
  productTitle: string;
  /** Shown above the submit button — e.g. "Request Private Charter",
   * "Enquire About This Vehicle". */
  submitLabel: string;
}

/**
 * Generic inquiry form for a bookable node with no fixed price/route —
 * private speedboat charters and car transfers (Task 20 §14/§17). Same
 * guest-safe RPC and WhatsApp-continuation pattern as RequestBookingForm,
 * just without the transfer-specific origin/destination/trip-type fields
 * that don't apply here.
 */
export function NodeInquiryForm({ productNodeId, productTitle, submitLabel }: NodeInquiryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  if (reference) {
    const waMessage = encodeURIComponent(`Hi, I'd like to follow up on my request ${reference} (${productTitle}).`);
    return (
      <div className="rounded-2xl border border-maldives-200 bg-maldives-50 p-6 text-center">
        <p className="text-lg font-semibold text-ocean-900">Request received</p>
        <p className="mt-1 text-sm text-neutral-700">
          Your reference is <span className="font-mono font-semibold">{reference}</span>. We&rsquo;ll follow up on the contact details you
          provided.
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
          const result = await createNodeInquiry({
            productNodeId,
            customerName: String(data.get("customerName") ?? ""),
            customerEmail: String(data.get("customerEmail") ?? ""),
            customerPhone: String(data.get("customerPhone") ?? ""),
            customerWhatsapp: String(data.get("customerWhatsapp") ?? ""),
            preferredDate: String(data.get("preferredDate") ?? "") || null,
            preferredTime: String(data.get("preferredTime") ?? "") || null,
            adults: Number(data.get("adults") ?? 1) || 1,
            children: Number(data.get("children") ?? 0) || 0,
            specialRequests: String(data.get("specialRequests") ?? "") || null,
          });

          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          setReference(result.bookingReference ?? null);
        });
      }}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full name" name="customerName" type="text" required autoComplete="name" />
        <Field label="Email" name="customerEmail" type="email" required autoComplete="email" />
        <Field label="Phone" name="customerPhone" type="tel" autoComplete="tel" />
        <Field label="WhatsApp number" name="customerWhatsapp" type="tel" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Preferred date (optional)" name="preferredDate" type="date" />
        <Field label="Preferred time (optional)" name="preferredTime" type="time" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Adults" name="adults" type="number" min={1} defaultValue={2} />
        <Field label="Children" name="children" type="number" min={0} defaultValue={0} />
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">What would you like to do? (optional)</span>
        <textarea
          name="specialRequests"
          rows={3}
          placeholder="Destination, duration, occasion, anything else useful to know"
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending…" : submitLabel}
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
