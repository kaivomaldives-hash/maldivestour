"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { detachMedia, uploadAndAttachMedia } from "@/lib/admin/media-actions";
import type { MediaRole, NodeMediaItem } from "@/lib/media/types";

/** Reusable image manager for any content node — upload a new image
 * (goes straight to the `media` Storage bucket + media_assets +
 * node_media, see media-actions.ts), or remove an existing attachment.
 * Only hero/gallery roles are exposed here; 'thumbnail'/'content'/'map'
 * are used by other parts of the app (articles, dive sites) but aren't
 * needed by this first round of admin content editors. */
export function NodeMediaManager({ nodeId, items, revalidatePath }: { nodeId: string; items: NodeMediaItem[]; revalidatePath: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<MediaRole>("gallery");
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function upload() {
    setError(null);
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    formData.set("role", role);
    formData.set("title", title);
    formData.set("altText", altText);
    startTransition(async () => {
      const result = await uploadAndAttachMedia(nodeId, formData, revalidatePath);
      if (!result.ok) {
        setError(result.error ?? "Upload failed.");
        return;
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTitle("");
      setAltText("");
      router.refresh();
    });
  }

  function remove(mediaId: string, itemRole: MediaRole) {
    setError(null);
    startTransition(async () => {
      const result = await detachMedia(nodeId, mediaId, itemRole, revalidatePath);
      if (!result.ok) {
        setError(result.error ?? "Failed to remove image.");
        return;
      }
      router.refresh();
    });
  }

  const groups: Array<{ label: string; role: MediaRole }> = [
    { label: "Hero image", role: "hero" },
    { label: "Gallery", role: "gallery" },
  ];

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Images</h2>

      {groups.map((group) => {
        const groupItems = items.filter((i) => i.role === group.role);
        return (
          <div key={group.role}>
            <p className="mb-2 text-xs font-medium text-neutral-500">{group.label}</p>
            {groupItems.length === 0 ? (
              <p className="text-sm text-neutral-400">No images yet.</p>
            ) : (
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {groupItems.map((item) => (
                  <li key={item.asset.id} className="overflow-hidden rounded-xl border border-neutral-200">
                    <div className="relative">
                      <MediaImage asset={item.asset} alt={item.asset.altText ?? ""} aspectClassName="aspect-square" />
                      <button
                        type="button"
                        onClick={() => remove(item.asset.id, item.role)}
                        disabled={isPending}
                        className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-black/80 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                    {(item.asset.title || item.asset.altText) && (
                      <div className="px-2 py-1.5 text-xs text-neutral-500">
                        {item.asset.title && <p className="truncate font-medium text-neutral-700">{item.asset.title}</p>}
                        {item.asset.altText && <p className="truncate">Alt: {item.asset.altText}</p>}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap items-end gap-3 border-t border-neutral-200 pt-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Add image</span>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="text-sm" />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Role</span>
          <select value={role} onChange={(e) => setRole(e.target.value as MediaRole)} className="rounded-xl border border-neutral-300 px-3 py-2 text-sm">
            <option value="hero">Hero</option>
            <option value="gallery">Gallery</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sunset over the lagoon"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Alt text</span>
          <input
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Describes the image for screen readers"
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
        </label>
        <Button type="button" size="sm" onClick={upload} disabled={isPending}>
          {isPending ? "Uploading…" : "Upload"}
        </Button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </section>
  );
}
