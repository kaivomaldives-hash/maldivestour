"use client";

import { useEffect, useId, useRef, useState } from "react";

import { publicStorageUrl } from "@/lib/media/types";
import { uploadListingPhoto } from "@/lib/partner/listings/actions";

const MAX_PHOTOS = 15;
// Shrinking in the browser first keeps uploads quick on slow connections
// and well under the server's size limit; the server resizes again anyway.
const MAX_EDGE = 2400;
const JPEG_QUALITY = 0.88;

async function shrinkPhoto(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 3 * 1024 * 1024) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    // Formats the browser can't decode (e.g. HEIC on some browsers) go up
    // as they are; the server converts them.
    return file;
  }
}

export function ListingPhotoUploader({ photos, onChange }: { photos: string[]; onChange: (photos: string[]) => void }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  // Uploads finish one by one; keep the latest list so none overwrite another.
  const latest = useRef(photos);
  useEffect(() => {
    latest.current = photos;
  }, [photos]);

  async function addFiles(fileList: FileList | File[]) {
    const room = MAX_PHOTOS - latest.current.length;
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (files.length === 0) return;
    const accepted = files.slice(0, Math.max(0, room));
    const newErrors: string[] = [];
    if (files.length > accepted.length) newErrors.push(`Only ${MAX_PHOTOS} photos per listing: ${files.length - accepted.length} were not added.`);

    setProgress({ done: 0, total: accepted.length });
    for (const [index, original] of accepted.entries()) {
      const file = await shrinkPhoto(original);
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadListingPhoto(formData);
      if (result.ok && result.storagePath) {
        const next = [...latest.current, result.storagePath];
        latest.current = next;
        onChange(next);
      } else {
        newErrors.push(result.error ?? `${original.name} couldn't be uploaded.`);
      }
      setProgress({ done: index + 1, total: accepted.length });
    }
    setProgress(null);
    setErrors(newErrors);
  }

  function remove(path: string) {
    onChange(photos.filter((p) => p !== path));
  }

  function makeCover(path: string) {
    onChange([path, ...photos.filter((p) => p !== path)]);
  }

  const uploading = progress !== null;

  return (
    <div className="text-sm">
      <span className="mb-1 block font-medium text-neutral-700">Photos</span>
      <p className="mb-2 text-xs text-neutral-500">Add up to {MAX_PHOTOS} photos. The first one is the cover photo guests see first. Only use photos you own.</p>

      {photos.length > 0 && (
        <ul className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photos.map((path, index) => {
            const url = publicStorageUrl(path);
            return (
              <li key={path} className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
                {url && (
                  // eslint-disable-next-line @next/next/no-img-element -- plain preview of an already-optimized upload
                  <img src={url} alt="" className="aspect-[4/3] w-full object-cover" />
                )}
                {index === 0 && <span className="absolute left-2 top-2 rounded-full bg-ocean-900/80 px-2 py-0.5 text-xs font-medium text-white">Cover</span>}
                <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                  {index === 0 ? (
                    <span className="text-xs text-neutral-500">Cover photo</span>
                  ) : (
                    <button type="button" onClick={() => makeCover(path)} className="text-xs font-medium text-maldives-700 hover:underline">
                      Make cover
                    </button>
                  )}
                  <button type="button" onClick={() => remove(path)} className="text-xs font-medium text-red-600 hover:underline" aria-label={`Remove photo ${index + 1}`}>
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {photos.length < MAX_PHOTOS && (
        <label
          htmlFor={inputId}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (!uploading) void addFiles(event.dataTransfer.files);
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors ${
            dragging ? "border-maldives-500 bg-maldives-50" : "border-neutral-300 hover:border-maldives-400"
          } ${uploading ? "pointer-events-none opacity-70" : ""}`}
        >
          <span className="font-medium text-ocean-900">{uploading ? `Uploading ${progress.done + 1} of ${progress.total}…` : "Add photos"}</span>
          <span className="mt-1 text-xs text-neutral-500">{uploading ? "Keep this page open" : "Tap to choose, or drag photos here"}</span>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            className="sr-only"
            disabled={uploading}
            onChange={(event) => {
              const files = event.target.files;
              if (files) void addFiles(files);
              event.target.value = "";
            }}
          />
        </label>
      )}

      {errors.length > 0 && (
        <ul role="alert" className="mt-2 space-y-0.5 text-xs text-red-600">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
