"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { deleteRedirect } from "@/lib/admin/redirects-actions";

export function RedirectDeleteButton({ redirectId, sourcePath }: { redirectId: string; sourcePath: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(`Delete the redirect from ${sourcePath}? This can't be undone (disable it instead to keep it).`)) return;
        startTransition(async () => {
          const result = await deleteRedirect(redirectId);
          if (!result.ok) window.alert(result.error ?? "Failed to delete.");
          router.refresh();
        });
      }}
      className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-red-400 hover:text-red-600 disabled:opacity-50"
    >
      {isPending ? "…" : "Delete"}
    </button>
  );
}
