"use client";

import { useId } from "react";

/**
 * Labeled search input for the admin list pages' "?q=" filter — same
 * visual weight as a bare placeholder-only input, but with a real,
 * persistent label a screen reader announces and that stays on screen
 * once the user starts typing (a placeholder disappears at that point).
 * useId() keeps the label/input pairing unique even though every admin
 * list page renders one of these.
 */
export function AdminSearchField({
  label,
  name,
  defaultValue,
  placeholder,
  className = "w-72",
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-neutral-600">
        {label}
      </label>
      <input
        id={id}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className={`${className} rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1`}
      />
    </div>
  );
}
