"use client";

import { useState, useTransition } from "react";

import { subscribeToUpdates } from "@/lib/customers/actions";

/**
 * Compact newsletter sign-up for the footer, next to the social links.
 * Same honeypot + server action pattern as the booking forms (see
 * src/components/bookings/node-inquiry-form.tsx) — just two fields, since
 * the only data this collects is name + email (src/lib/customers/
 * actions.ts's subscribeToUpdates), deduplicated into the same `customers`
 * table a booking populates.
 */
export function FooterSubscribeForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="mt-4 text-sm text-lagoon-100/80">Thanks — you&apos;re subscribed.</p>;
  }

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const form = event.currentTarget;
        const data = new FormData(form);

        startTransition(async () => {
          const result = await subscribeToUpdates({
            name: String(data.get("name") ?? ""),
            email: String(data.get("email") ?? ""),
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
      <p className="text-xs font-semibold uppercase tracking-wide text-lagoon-300">Subscribe</p>
      <p className="mt-1 text-xs text-lagoon-100/70">Travel tips and offers, no spam.</p>

      {/* Honeypot: see src/components/bookings/node-inquiry-form.tsx's own comment. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          name="name"
          type="text"
          required
          placeholder="Your name"
          autoComplete="name"
          className="min-touch-target w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-lagoon-100/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-lagoon-300 sm:w-36"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Your email"
          autoComplete="email"
          className="min-touch-target w-full rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder:text-lagoon-100/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-lagoon-300 sm:w-44"
        />
        <button
          type="submit"
          disabled={isPending}
          className="min-touch-target shrink-0 rounded-full bg-lagoon-300 px-4 py-2 text-sm font-medium text-ocean-950 transition-colors hover:bg-lagoon-200 disabled:opacity-60"
        >
          {isPending ? "…" : "Subscribe"}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {error}
        </p>
      )}
    </form>
  );
}
