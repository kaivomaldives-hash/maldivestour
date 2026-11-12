"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useTransition, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { quickAddListing, suggestListingText } from "@/lib/partner/listings/ai-actions";
import type { ListingNodeType, ListingPayload } from "@/lib/partner/listings/types";

const AiEnabledContext = createContext(false);

/** Tells the listing forms whether the AI helpers are set up (GEMINI_API_KEY). */
export function ListingAiProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  return <AiEnabledContext value={enabled}>{children}</AiEnabledContext>;
}

export function useListingAiEnabled(): boolean {
  return useContext(AiEnabledContext);
}

const FIELDS = ["title", "summary", "description"] as const;
type Field = (typeof FIELDS)[number];

/**
 * "Write it for me": asks the AI for a better name and description from
 * what's already typed, puts them into the form, and keeps the old text
 * so one click undoes it.
 */
export function WriteForMeBar({
  nodeType,
  getForm,
  getPayload,
  onApplied,
}: {
  nodeType: ListingNodeType;
  getForm: () => HTMLFormElement | null;
  getPayload: () => ListingPayload | null;
  onApplied: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [previous, setPrevious] = useState<Partial<Record<Field, string>> | null>(null);

  function fieldOf(name: Field): HTMLInputElement | HTMLTextAreaElement | null {
    const el = getForm()?.elements.namedItem(name);
    return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement ? el : null;
  }

  function apply(values: Partial<Record<Field, string>>) {
    for (const name of FIELDS) {
      const el = fieldOf(name);
      if (el && values[name] !== undefined) el.value = values[name] ?? "";
    }
    onApplied();
  }

  return (
    <div className="rounded-xl border border-maldives-200 bg-maldives-50 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-neutral-700">
          <span className="font-medium text-ocean-900">Not sure what to write?</span> Type a few words about your product, then let AI write the name and description.
        </p>
        <Button
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() => {
            setMessage(null);
            const payload = getPayload();
            if (!payload) return;
            startTransition(async () => {
              const result = await suggestListingText({ nodeType, payload });
              if (!result.ok || !result.suggestion) {
                setMessage({ tone: "error", text: result.error ?? "Something went wrong. Please try again." });
                return;
              }
              const before: Partial<Record<Field, string>> = {};
              for (const name of FIELDS) {
                const el = fieldOf(name);
                if (el) before[name] = el.value;
              }
              setPrevious(before);
              const { title, summary, description } = result.suggestion;
              apply({ title, summary, ...(description ? { description } : {}) });
              setMessage({ tone: "ok", text: "Done. Please read it and change anything that isn't right." });
            });
          }}
        >
          {isPending ? "Writing…" : "Write it for me"}
        </Button>
      </div>
      {message && (
        <p role={message.tone === "error" ? "alert" : "status"} className={`mt-2 text-xs ${message.tone === "error" ? "text-red-600" : "text-neutral-600"}`}>
          {message.text}
          {message.tone === "ok" && previous && (
            <button
              type="button"
              className="ml-2 font-medium text-maldives-700 hover:underline"
              onClick={() => {
                apply(previous);
                setPrevious(null);
                setMessage({ tone: "ok", text: "Your original text is back." });
              }}
            >
              Undo
            </button>
          )}
        </p>
      )}
    </div>
  );
}

/**
 * "Quick add": the partner pastes what they already have (a WhatsApp
 * message, brochure text, their website) and gets a filled-in draft to
 * check, instead of typing every field.
 */
export function QuickAddListing({ nodeType }: { nodeType: ListingNodeType }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <details className="mb-6 rounded-xl border border-maldives-200 bg-maldives-50 px-4 py-3 text-sm" open>
      <summary className="cursor-pointer font-medium text-ocean-900">Quick add: paste your product details and let AI fill in the form</summary>
      <p className="mt-2 text-neutral-600">
        Paste what you already have, for example from WhatsApp, a brochure or your website. Include prices, times and what&rsquo;s included. You&rsquo;ll check everything before
        sending it for review.
      </p>
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        rows={6}
        maxLength={8000}
        placeholder="e.g. Sunset fishing trip from Maafushi, 3 hours, 5pm to 8pm. USD 45 per person, min 4 people. Includes equipment, bait, water and BBQ of your catch..."
        className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500"
      />
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {error}
        </p>
      )}
      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          disabled={isPending || text.trim().length < 20}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await quickAddListing({ nodeType, text });
              if (!result.ok || !result.draftId) {
                setError(result.error ?? "Something went wrong. Please try again.");
                return;
              }
              router.push(`/partner/listings/new?draft=${result.draftId}&ai=1`);
            });
          }}
        >
          {isPending ? "Reading your details…" : "Fill in the form for me"}
        </Button>
      </div>
    </details>
  );
}
