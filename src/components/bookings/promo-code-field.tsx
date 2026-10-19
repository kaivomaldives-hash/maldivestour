"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { validatePromoCode } from "@/lib/bookings/actions";

/**
 * Optional promo-code input, shared by both booking forms
 * (RequestBookingForm, NodeInquiryForm) — an affiliate's referral code,
 * typed in by the customer. Debounced the same 250ms-after-the-last-
 * keystroke way as every other live-lookup field on the site (see
 * search-box.tsx, location-combobox.tsx, DestinationField in
 * node-inquiry-form.tsx) rather than validating on every keystroke.
 *
 * Purely cosmetic feedback ("5% off applied") — the actual discount/
 * commission resolution happens again, authoritatively, server-side
 * inside create_booking_inquiry when the form is submitted. A wrong or
 * unrecognized code never blocks submission, it just shows no discount.
 */
export function PromoCodeField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [status, setStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [discountPercent, setDiscountPercent] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function handleChange(next: string) {
    onChange(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = next.trim();
    if (trimmed.length < 4) {
      setStatus("idle");
      setDiscountPercent(null);
      return;
    }

    setStatus("checking");
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const result = await validatePromoCode(trimmed);
        setStatus(result.valid ? "valid" : "invalid");
        setDiscountPercent(result.discountPercent);
      });
    }, 250);
  }

  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-neutral-700">Promo code (optional)</span>
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Have a promo code?"
        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm uppercase focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
      />
      {status === "checking" && <p className="mt-1 text-xs text-neutral-500">Checking…</p>}
      {status === "valid" && discountPercent !== null && (
        <p className="mt-1 text-xs font-medium text-maldives-600">Code applied — {discountPercent}% off.</p>
      )}
      {status === "invalid" && <p className="mt-1 text-xs text-red-600">That code isn&rsquo;t valid or has expired.</p>}
    </label>
  );
}
