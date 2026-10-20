"use client";

import { useState, useTransition } from "react";

import { CaptionedPhotoPicker, type PickedPhoto } from "@/components/locations/captioned-photo-picker";
import { MapPicker } from "@/components/locations/map-picker";
import { Button } from "@/components/ui/button";
import { ATTRACTION_TYPE_LABEL, type AttractionType } from "@/lib/attractions/types";
import { createPlaceSubmission } from "@/lib/locations/place-submissions/actions";
import { MAX_SUBMISSION_IMAGES, type SubmissionPlaceCategory } from "@/lib/locations/place-submissions/types";

const PLACE_CATEGORY_OPTIONS: Array<{ value: SubmissionPlaceCategory; label: string }> = [
  { value: "attraction", label: "Attraction" },
  { value: "restaurant", label: "Restaurant" },
  { value: "shop", label: "Shop" },
  { value: "hospital", label: "Hospital" },
  { value: "school", label: "School" },
  { value: "gym", label: "Gym" },
];

const ATTRACTION_TYPE_OPTIONS = Object.entries(ATTRACTION_TYPE_LABEL) as Array<[AttractionType, string]>;

const INPUT_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

/** Lets any visitor propose a new attraction, restaurant, shop,
 * hospital, school, or gym for this island/atoll. Every submission
 * sits as status='pending' until staff approves it — nothing is
 * implied to be live instantly, same stance as LocationMediaUploadForm.
 * `initialLat`/`initialLng` just centers the map picker on the parent
 * island/atoll — they're not submitted as-is; only a pin the submitter
 * actually places is. */
export function AddPlaceForm({ locationId, initialLat, initialLng }: { locationId: string; initialLat?: number | null; initialLng?: number | null }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<SubmissionPlaceCategory>("attraction");
  const [photos, setPhotos] = useState<PickedPhoto[]>([]);

  if (submitted) {
    return (
      <p className="rounded-xl border border-maldives-200 bg-maldives-50 p-4 text-sm text-ocean-900">
        Thanks — your submission will be reviewed and added once it&rsquo;s been checked.
      </p>
    );
  }

  if (!showForm) {
    return (
      <Button size="sm" onClick={() => setShowForm(true)}>
        Add a place
      </Button>
    );
  }

  return (
    <form
      className="space-y-3 rounded-xl border border-neutral-200 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        const form = event.currentTarget;
        const data = new FormData(form);
        for (const photo of photos) {
          data.append("files", photo.file);
          data.append("captions", photo.caption);
        }

        startTransition(async () => {
          const result = await createPlaceSubmission(locationId, data);
          if (!result.ok) {
            setError(result.error ?? "Something went wrong. Please try again.");
            return;
          }
          setSubmitted(true);
        });
      }}
    >
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Category</span>
        <select
          name="placeCategory"
          value={category}
          onChange={(e) => setCategory(e.target.value as SubmissionPlaceCategory)}
          className={INPUT_CLASS}
        >
          {PLACE_CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {category === "attraction" && (
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Attraction type</span>
          <select name="attractionType" required defaultValue="" className={INPUT_CLASS}>
            <option value="" disabled>
              Choose one…
            </option>
            {ATTRACTION_TYPE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Name</span>
        <input name="name" type="text" required className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Description (optional)</span>
        <textarea name="description" rows={3} className={INPUT_CLASS} />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Phone number (optional)</span>
        <input name="phone" type="tel" className={INPUT_CLASS} />
      </label>

      <div className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Location on the map</span>
        <MapPicker initialLat={initialLat} initialLng={initialLng} />
      </div>

      <div className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Photos (optional, up to {MAX_SUBMISSION_IMAGES})</span>
        <CaptionedPhotoPicker photos={photos} onChange={setPhotos} max={MAX_SUBMISSION_IMAGES} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Your name</span>
          <input name="submitterName" type="text" required className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Email (not shown publicly)</span>
          <input name="submitterEmail" type="email" required className={INPUT_CLASS} />
        </label>
      </div>

      <label className="flex items-start gap-2 text-xs text-neutral-600">
        <input name="agreedToTerms" type="checkbox" required className="mt-0.5" />
        <span>
          I confirm this information (and any photos) is accurate and my own to share, and that I am solely responsible for what I
          submit. Maldives Tour Guide is not responsible for any claims arising from content I submit.
        </span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button type="submit" size="sm" disabled={isPending}>
        {isPending ? "Submitting…" : "Submit place"}
      </Button>
    </form>
  );
}
