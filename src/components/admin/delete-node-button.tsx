"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { checkNodeDeletable, deleteNode, type NodeDeleteCheck } from "@/lib/admin/node-actions";

/** Generic destructive-action confirmation for any content node — checks
 * for existing bookings/reviews before showing the dialog so the admin
 * sees a clear reason rather than a raw database error (see
 * checkNodeDeletable()'s own comment on why bookings block the delete
 * outright while reviews are only a warning). Uses the native <dialog>
 * element for a real modal (focus trap, backdrop, Escape-to-close) with
 * no extra dependency. */
export function DeleteNodeButton({ nodeId, redirectTo, label = "Delete" }: { nodeId: string; redirectTo: string; label?: string }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [check, setCheck] = useState<NodeDeleteCheck | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function open() {
    setError(null);
    setCheck(null);
    dialogRef.current?.showModal();
    startTransition(async () => {
      setCheck(await checkNodeDeletable(nodeId));
    });
  }

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteNode(nodeId);
      if (!result.ok) {
        setError(result.error ?? "Failed to delete.");
        return;
      }
      dialogRef.current?.close();
      router.push(redirectTo);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        onClick={open}
        className="border-red-300 text-red-700 hover:border-red-500 hover:text-red-800"
      >
        {label}
      </Button>
      <dialog ref={dialogRef} className="w-full max-w-md rounded-2xl border border-neutral-200 p-0 backdrop:bg-black/40">
        <div className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ocean-900">Delete this entry?</h2>

          {check === null ? (
            <p className="text-sm text-neutral-500">Checking for related records…</p>
          ) : !check.canDelete ? (
            <p className="text-sm text-red-600">
              This can&rsquo;t be deleted — it has {check.bookingCount} existing booking{check.bookingCount === 1 ? "" : "s"}. Unpublish it instead
              (set status to draft or archived) if you want to hide it.
            </p>
          ) : (
            <p className="text-sm text-neutral-600">
              This permanently deletes the entry{check.reviewCount > 0 ? `, along with ${check.reviewCount} review${check.reviewCount === 1 ? "" : "s"}` : ""}
              . This can&rsquo;t be undone.
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => dialogRef.current?.close()} disabled={isPending}>
              Cancel
            </Button>
            {check?.canDelete && (
              <Button type="button" onClick={confirmDelete} disabled={isPending} className="bg-red-600 hover:bg-red-700">
                {isPending ? "Deleting…" : "Delete permanently"}
              </Button>
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
