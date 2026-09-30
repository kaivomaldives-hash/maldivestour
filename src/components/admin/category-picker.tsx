"use client";

import type { CategoryOption } from "@/lib/admin/node-relations-repository";

/** Controlled multi-select checkbox picker for one taxonomy group at a
 * time (see setNodeCategories()'s comment on why it's scoped per-group).
 * `options` is loaded server-side once per page render — the taxonomy
 * groups this is used for (package-style, traveler-type, ...) are small,
 * fixed lists, not worth a search-as-you-type picker. */
export function CategoryPicker({
  label,
  options,
  selectedIds,
  onChange,
}: {
  label: string;
  options: CategoryOption[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  if (options.length === 0) return null;

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((i) => i !== id) : [...selectedIds, id]);
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-medium text-neutral-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = selectedIds.includes(option.id);
          return (
            <label
              key={option.id}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition-colors ${
                checked ? "border-maldives-600 bg-lagoon-100 text-ocean-900" : "border-neutral-300 text-neutral-700 hover:border-maldives-500"
              }`}
            >
              <input type="checkbox" checked={checked} onChange={() => toggle(option.id)} className="sr-only" />
              {option.title}
            </label>
          );
        })}
      </div>
    </div>
  );
}
