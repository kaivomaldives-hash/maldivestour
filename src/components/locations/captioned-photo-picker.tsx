"use client";

import { useRef } from "react";

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,image/avif";

interface PickedPhoto {
  file: File;
  caption: string;
}

/**
 * Shared by AddPlaceForm and LocationMediaUploadForm — every guest-
 * submitted photo on this site used to go straight to media_assets
 * with alt_text left null (real, ongoing SEO loss on every image the
 * public ever uploads). This requires a short caption per photo before
 * it can be submitted, which the approval action then uses as both
 * media_assets.title and .alt_text.
 *
 * Deliberately not just a plain `<input type="file" multiple>`, since a
 * native file input can't attach per-file metadata — selection is
 * tracked in React state instead, and the raw input is cleared after
 * each pick so this component's own state is the only source of truth.
 * The parent form still submits these via a plain native
 * `new FormData(form)` for every other field; right before calling the
 * server action, append each picked file (`formData.append("files",
 * photo.file)`) and its caption (`formData.append("captions",
 * photo.caption)`) in the same order, so the server can zip them back
 * together by index.
 */
export function CaptionedPhotoPicker({ photos, onChange, max = 5 }: { photos: PickedPhoto[]; onChange: (photos: PickedPhoto[]) => void; max?: number }) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        disabled={photos.length >= max}
        className="block w-full text-sm text-neutral-700 disabled:opacity-50"
        onChange={(event) => {
          const newFiles = Array.from(event.target.files ?? []);
          onChange([...photos, ...newFiles.map((file) => ({ file, caption: "" }))].slice(0, max));
          if (inputRef.current) inputRef.current.value = "";
        }}
      />
      {photos.length > 0 && (
        <ul className="mt-2 space-y-2">
          {photos.map((photo, index) => (
            <li key={`${photo.file.name}-${index}`} className="flex items-center gap-2">
              <span className="w-28 shrink-0 truncate text-xs text-neutral-500">{photo.file.name}</span>
              <input
                type="text"
                required
                placeholder="What's in this photo?"
                value={photo.caption}
                onChange={(event) => {
                  const value = event.target.value;
                  onChange(photos.map((p, i) => (i === index ? { ...p, caption: value } : p)));
                }}
                className="flex-1 rounded-lg border border-neutral-300 px-2.5 py-1.5 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1"
              />
              <button
                type="button"
                onClick={() => onChange(photos.filter((_, i) => i !== index))}
                className="shrink-0 text-xs text-neutral-500 hover:text-red-600"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type { PickedPhoto };
