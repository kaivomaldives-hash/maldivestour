"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { AdminBasicsSection } from "@/components/admin/admin-basics-section";
import { AdminPricingVideoSection } from "@/components/admin/admin-pricing-video-section";
import { AdminSeoSection } from "@/components/admin/admin-seo-section";
import { CategoryPicker } from "@/components/admin/category-picker";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { MultiLocationPicker } from "@/components/admin/multi-location-picker";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { Button } from "@/components/ui/button";
import type { ActivityFieldsAdmin } from "@/lib/admin/activities-repository";
import { createActivity, updateActivity } from "@/lib/admin/activities-actions";
import type { NodeCoreInput } from "@/lib/admin/node-actions";
import { setNodeCategories, setNodeLocations } from "@/lib/admin/node-relations-actions";
import type { CategoryOption, LocationOption } from "@/lib/admin/node-relations-repository";
import type { ActivityCategory, ActivityDifficulty } from "@/lib/activities/types";
import type { NodeMediaItem } from "@/lib/media/types";
import type { ProviderOption } from "@/lib/admin/providers-repository";

const ACTIVITY_CATEGORIES: ActivityCategory[] = ["general", "fishing", "diving", "surfing", "watersports", "excursion", "island_hopping", "spa", "culture"];
const DIFFICULTIES: ActivityDifficulty[] = ["beginner", "intermediate", "advanced", "all_levels"];

export interface ActivityFormInitial {
  id: string;
  core: NodeCoreInput;
  fields: ActivityFieldsAdmin;
  locations: LocationOption[];
  media: NodeMediaItem[];
  activityTypeIds: string[];
}

const EMPTY_CORE: NodeCoreInput = { title: "", slug: "", summary: null, status: "draft", metaTitle: null, metaDescription: null };
const EMPTY_FIELDS: ActivityFieldsAdmin = {
  activityCategory: "general",
  operatedByProviderId: null,
  durationMinutes: null,
  minAge: null,
  difficulty: null,
  priceFrom: null,
  currency: "USD",
  maxParticipants: null,
  videoYoutubeId: null,
};

export function ActivityForm({
  initial,
  providerOptions,
  activityTypeOptions,
}: {
  initial?: ActivityFormInitial;
  providerOptions: ProviderOption[];
  activityTypeOptions: CategoryOption[];
}) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<ActivityFieldsAdmin>(initial?.fields ?? EMPTY_FIELDS);
  const [locations, setLocations] = useState<LocationOption[]>(initial?.locations ?? []);
  const [activityTypeIds, setActivityTypeIds] = useState<string[]>(initial?.activityTypeIds ?? []);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Set the instant a fresh create succeeds, so Images can appear in place
  // without waiting on navigation to the edit page (Task 23).
  const [createdId, setCreatedId] = useState<string | null>(null);
  const nodeId = initial?.id ?? createdId;

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    startTransition(async () => {
      const result = nodeId ? await updateActivity(nodeId, core, fields) : await createActivity(core, fields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      const id = nodeId ?? (result as { id?: string }).id;
      if (id) {
        const revalidateAt = `/admin/activities/${id}`;
        await setNodeLocations(id, locations.map((l) => l.id), revalidateAt);
        await setNodeCategories(id, activityTypeIds, revalidateAt);
      }
      if (id && !nodeId) {
        setCreatedId(id);
        router.replace(`/admin/activities/${id}`);
      } else {
        router.push("/admin/activities");
      }
      router.refresh();
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <AdminBasicsSection
        core={core}
        setCore={setCore}
        slugTouched={slugTouched}
        setSlugTouched={setSlugTouched}
        wasPublished={wasPublished}
        slugChanged={slugChanged}
      />

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Category & details</h2>
        <p className="text-xs text-neutral-500">Fishing, diving and surfing are each just a category here — they share this one editor.</p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Category</span>
            <select
              value={fields.activityCategory}
              onChange={(e) => setFields((f) => ({ ...f, activityCategory: e.target.value as ActivityCategory }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              {ACTIVITY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Operated by</span>
            <select
              value={fields.operatedByProviderId ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, operatedByProviderId: e.target.value || null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">— None —</option>
              {providerOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Duration (minutes)</span>
            <input
              type="number"
              min={0}
              value={fields.durationMinutes ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, durationMinutes: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Difficulty</span>
            <select
              value={fields.difficulty ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, difficulty: (e.target.value || null) as ActivityDifficulty | null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            >
              <option value="">—</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Minimum age</span>
            <input
              type="number"
              min={0}
              value={fields.minAge ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, minAge: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Max participants</span>
            <input
              type="number"
              min={0}
              value={fields.maxParticipants ?? ""}
              onChange={(e) => setFields((f) => ({ ...f, maxParticipants: e.target.value ? Number(e.target.value) : null }))}
              className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <MultiLocationPicker value={locations} onChange={setLocations} />
        <CategoryPicker
          label="Type (drives the diving/fishing sub-type filters)"
          options={activityTypeOptions}
          selectedIds={activityTypeIds}
          onChange={setActivityTypeIds}
        />
      </section>

      <AdminPricingVideoSection fields={fields} setFields={setFields} />

      <AdminSeoSection core={core} setCore={setCore} />

      {nodeId ? (
        <NodeMediaManager nodeId={nodeId} items={initial?.media ?? []} revalidatePath={`/admin/activities/${nodeId}`} />
      ) : (
        <p className="text-sm text-neutral-500">Save the activity first — you can add images right after.</p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : nodeId ? "Save changes" : "Create activity"}
        </Button>
        {nodeId && <DeleteNodeButton nodeId={nodeId} redirectTo="/admin/activities" />}
      </div>
    </div>
  );
}
