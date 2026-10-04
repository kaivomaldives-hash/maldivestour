"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { submitPartnerRequest } from "@/lib/partners/actions";
import { PARTNER_TYPES } from "@/lib/partners/types";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function PartnerRequestForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-maldives-200 bg-maldives-50 p-6 text-center">
        <p className="text-lg font-semibold text-ocean-900">Thanks for reaching out</p>
        <p className="mt-2 text-sm text-neutral-700">
          We&rsquo;ve received your partner request and our team will get back to you by email.
        </p>
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
          const result = await submitPartnerRequest({
            partnerType: String(data.get("partnerType") ?? ""),
            name: String(data.get("name") ?? ""),
            email: String(data.get("email") ?? ""),
            phone: String(data.get("phone") ?? ""),
            companyName: String(data.get("companyName") ?? ""),
            message: String(data.get("message") ?? ""),
            honeypot: String(data.get("website") ?? ""),
          });

          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          setDone(true);
        });
      }}
    >
      {/* Honeypot — see isSpam() in src/lib/partners/actions.ts. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Partner type <span aria-hidden="true">*</span>
        </span>
        <select name="partnerType" required defaultValue="" className={INPUT_CLASS}>
          <option value="" disabled>
            Select a partner type
          </option>
          {PARTNER_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Full name <span aria-hidden="true">*</span>
          </span>
          <input name="name" type="text" required autoComplete="name" className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">
            Email <span aria-hidden="true">*</span>
          </span>
          <input name="email" type="email" required autoComplete="email" className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Phone (optional)</span>
          <input name="phone" type="tel" autoComplete="tel" className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Company / business name (optional)</span>
          <input name="companyName" type="text" className={INPUT_CLASS} />
        </label>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Tell us about your business (optional)</span>
        <textarea name="message" rows={4} placeholder="What you offer, where you operate, anything useful to know" className={INPUT_CLASS} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-4 border-t border-neutral-200 pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending…" : "Submit Partner Request"}
        </Button>
      </div>
    </form>
  );
}
