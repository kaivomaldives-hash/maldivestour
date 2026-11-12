"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition, type ReactNode } from "react";

import { useListingAiEnabled, WriteForMeBar } from "@/components/partner/listing-ai";
import { ListingPhotoUploader } from "@/components/partner/listing-photo-uploader";
import { Button } from "@/components/ui/button";
import { saveListingDraft, submitListing } from "@/lib/partner/listings/actions";
import type { ListingDraftRef, ListingNodeType, ListingPayload } from "@/lib/partner/listings/types";

const AUTOSAVE_DELAY_MS = 2500;

type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * The part every partner listing form shares: photos, autosaving drafts,
 * "Save draft" and "Submit for review". Each form only renders its own
 * fields and turns them into a payload (`buildPayload`).
 *
 * `watch` lists form state that lives outside the inputs (a location
 * picker, a rooms table), so changing it also triggers an autosave.
 */
export function ListingFormShell({
  nodeType,
  nodeId,
  draft,
  canSubmit,
  buildPayload,
  validate,
  watch = [],
  className = "space-y-4",
  children,
}: {
  nodeType: ListingNodeType;
  nodeId: string | null;
  draft: ListingDraftRef | null;
  canSubmit: boolean;
  buildPayload: (data: FormData) => ListingPayload;
  /** Checks only needed to submit (drafts may be incomplete): an error message, or null. */
  validate?: (payload: ListingPayload) => string | null;
  watch?: unknown[];
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>(draft?.photos ?? []);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const draftIdRef = useRef<string | null>(draft?.id ?? null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef<Promise<void>>(Promise.resolve());
  const dirtyRef = useRef(false);
  const submittedRef = useRef(false);
  const submissionKind = nodeId ? "update" : "create";
  const aiEnabled = useListingAiEnabled();

  const currentPayload = useCallback((): ListingPayload | null => {
    if (!formRef.current) return null;
    return { ...buildPayload(new FormData(formRef.current)), photos };
  }, [buildPayload, photos]);

  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    // Saves run one after another so two never create two drafts.
    savingRef.current = savingRef.current.then(async () => {
      if (submittedRef.current) return;
      const payload = currentPayload();
      if (!payload) return;
      dirtyRef.current = false;
      setSaveState("saving");
      const result = await saveListingDraft({ nodeType, submissionKind, nodeId, payload, draftId: draftIdRef.current });
      if (result.ok && result.draftId) {
        // A new listing's first save: point the address at the draft, so a
        // reload or a shared link continues it instead of starting over.
        if (!draftIdRef.current && !nodeId) window.history.replaceState(null, "", `/partner/listings/new?draft=${result.draftId}`);
        draftIdRef.current = result.draftId;
        setSaveState("saved");
      } else {
        dirtyRef.current = true;
        setSaveState("error");
      }
    });
    await savingRef.current;
  }, [currentPayload, nodeId, nodeType, submissionKind]);

  // The timer calls the latest saveNow, so it always reads current state.
  const saveNowRef = useRef(saveNow);
  useEffect(() => {
    saveNowRef.current = saveNow;
  }, [saveNow]);

  const scheduleSave = useCallback(() => {
    dirtyRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void saveNowRef.current(), AUTOSAVE_DELAY_MS);
  }, []);

  // Photos and outside-the-form state changes count as edits too (not on
  // first render).
  const watchKey = JSON.stringify([photos, ...watch]);
  const firstWatch = useRef(true);
  useEffect(() => {
    if (firstWatch.current) {
      firstWatch.current = false;
      return;
    }
    scheduleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- watchKey stands in for photos and watch
  }, [watchKey]);

  // Save on the way out if something changed since the last save.
  useEffect(() => {
    const onHide = () => {
      if (dirtyRef.current && document.visibilityState === "hidden") void saveNow();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [saveNow]);

  return (
    <form
      ref={formRef}
      className={className}
      onInput={scheduleSave}
      onChange={scheduleSave}
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const payload = currentPayload();
        if (!payload) return;
        const problem = validate?.(payload);
        if (problem) {
          setError(problem);
          return;
        }
        if (timerRef.current) clearTimeout(timerRef.current);
        startTransition(async () => {
          await savingRef.current;
          const result = await submitListing({ nodeType, submissionKind, nodeId, payload, draftId: draftIdRef.current });
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          submittedRef.current = true;
          router.push("/partner/listings?submitted=1");
        });
      }}
    >
      {aiEnabled && <WriteForMeBar nodeType={nodeType} getForm={() => formRef.current} getPayload={currentPayload} onApplied={scheduleSave} />}

      {children}

      <ListingPhotoUploader photos={photos} onChange={setPhotos} />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-4">
        <p className="text-xs text-neutral-500" aria-live="polite">
          {saveState === "saving" && "Saving draft…"}
          {saveState === "saved" && "Draft saved. You can come back and finish it any time."}
          {saveState === "error" && <span className="text-red-600">Couldn&rsquo;t save the draft. Check your connection.</span>}
          {saveState === "idle" && "Your work saves automatically as a draft."}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" disabled={isPending || saveState === "saving"} onClick={() => void saveNow()}>
            Save draft
          </Button>
          <Button type="submit" disabled={isPending || !canSubmit}>
            {isPending ? "Submitting…" : nodeId ? "Submit Changes for Review" : "Submit for Review"}
          </Button>
        </div>
        {!canSubmit && (
          <p className="w-full text-right text-xs text-neutral-500">You can send listings for review once your partner profile is approved. Until then, your drafts are kept.</p>
        )}
      </div>
    </form>
  );
}
