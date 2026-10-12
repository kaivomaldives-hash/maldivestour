"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { deleteUser } from "@/lib/admin/users-actions";

/** Same native-<dialog> confirmation shape as DeleteNodeButton, simpler --
 * there's no "existing bookings/reviews block this" check to run first,
 * profiles.id's `on delete cascade` to auth.users means there's nothing
 * else in this app's own tables to worry about leaving behind. */
export function DeleteUserButton({ userId, email, isSelf }: { userId: string; email: string | null; isSelf: boolean }) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (isSelf) {
    return <span className="text-xs text-neutral-400">—</span>;
  }

  function confirmDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteUser(userId);
      if (!result.ok) {
        setError(result.error ?? "Failed to delete.");
        return;
      }
      dialogRef.current?.close();
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setError(null);
          dialogRef.current?.showModal();
        }}
        className="text-sm font-medium text-red-600 hover:text-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Delete
      </button>
      <dialog ref={dialogRef} className="w-full max-w-md rounded-2xl border border-neutral-200 p-0 backdrop:bg-black/40">
        <div className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ocean-900">Delete this account?</h2>
          <p className="text-sm text-neutral-600">
            This permanently removes {email ?? "this user"}&rsquo;s login and staff access. This can&rsquo;t be undone.
          </p>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              disabled={isPending}
              className="min-touch-target rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={isPending}
              className="min-touch-target rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {isPending ? "Deleting…" : "Delete permanently"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
