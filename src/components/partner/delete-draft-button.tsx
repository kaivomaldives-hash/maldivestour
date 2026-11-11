"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteListingDraft } from "@/lib/partner/listings/actions";

export function DeleteDraftButton({ draftId, title }: { draftId: string; title: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`Delete the draft "${title}"? This can't be undone.`)) return;
        startTransition(async () => {
          const result = await deleteListingDraft(draftId);
          if (!result.ok) window.alert(result.error ?? "Couldn't delete the draft.");
          router.refresh();
        });
      }}
      className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
    >
      {isPending ? "Deleting…" : "Delete"}
    </button>
  );
}
