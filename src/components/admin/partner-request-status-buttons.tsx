"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { updatePartnerRequestStatus } from "@/lib/admin/partners-actions";

export function PartnerRequestStatusButtons({ requestId, status }: { requestId: string; status: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function setStatus(next: string) {
    startTransition(async () => {
      await updatePartnerRequestStatus(requestId, next);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      {status !== "contacted" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => setStatus("contacted")}
          className="rounded-full bg-maldives-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
        >
          Mark contacted
        </button>
      )}
      {status !== "archived" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => setStatus("archived")}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-red-400 hover:text-red-600 disabled:opacity-50"
        >
          Archive
        </button>
      )}
      {status !== "new" && (
        <button
          type="button"
          disabled={isPending}
          onClick={() => setStatus("new")}
          className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-amber-400 disabled:opacity-50"
        >
          Reset to new
        </button>
      )}
    </div>
  );
}
