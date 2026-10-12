"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { updateMyProfile } from "@/lib/admin/users-actions";

const INPUT_CLASS =
  "min-touch-target w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

export function ProfileForm({
  displayName,
  bio,
  homeCountry,
  role,
}: {
  displayName: string;
  bio: string;
  homeCountry: string;
  role: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setSaved(false);
        const data = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await updateMyProfile({
            displayName: String(data.get("displayName") ?? "").trim() || null,
            bio: String(data.get("bio") ?? "").trim() || null,
            homeCountry: String(data.get("homeCountry") ?? "").trim() || null,
          });
          if (!result.ok) {
            setError(result.error ?? "Failed to save.");
            return;
          }
          setSaved(true);
          router.refresh();
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Role</span>
        <input value={role} disabled className={`${INPUT_CLASS} bg-neutral-50 text-neutral-500`} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Display name</span>
        <input name="displayName" type="text" defaultValue={displayName} className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Home country</span>
        <input name="homeCountry" type="text" defaultValue={homeCountry} className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Bio</span>
        <textarea name="bio" rows={4} defaultValue={bio} className={INPUT_CLASS} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      {saved && !error && <p className="text-sm text-maldives-700">Saved.</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
