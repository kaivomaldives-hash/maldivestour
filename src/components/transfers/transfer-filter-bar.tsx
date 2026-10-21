import Link from "next/link";

import type { AtollSummary } from "@/lib/locations/types";
import type { SharedOrPrivate, TransferType } from "@/lib/transfers/types";

const MODE_LABEL: Record<TransferType, string> = {
  speedboat: "Speedboat",
  seaplane: "Seaplane",
  domestic_flight: "Domestic Flight",
  ferry: "Ferry",
  private_yacht: "Private Yacht",
  land_transfer: "Car",
};

const MODES: TransferType[] = ["speedboat", "seaplane", "domestic_flight", "ferry", "private_yacht", "land_transfer"];

const TYPE_LABEL: Record<SharedOrPrivate, string> = {
  shared: "Shared",
  private: "Private",
};

const TYPES: SharedOrPrivate[] = ["shared", "private"];

function linkWith(basePath: string, currentParams: URLSearchParams, overrides: Record<string, string | undefined>): string {
  const params = new URLSearchParams(currentParams);
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) params.delete(key);
    else params.set(key, value);
  }
  const query = params.toString();
  return `${basePath}${query ? `?${query}` : ""}`;
}

/**
 * Query-string-driven filter bar for a transfer-category listing (Task:
 * "filter for by atolls, mode, and type private or shared") — same pill-
 * link + active-chips pattern as AccommodationFilterBar, so it needs no
 * client JS and works the same way every other directory filter on this
 * site does. `showMode` is false on /maldives/speedboat-transfers/, where
 * the mode is already fixed by the page itself — showing a redundant
 * "Speedboat" toggle there would be confusing, not useful.
 */
export function TransferFilterBar({
  basePath,
  currentParams,
  atolls,
  activeAtollSlug,
  activeMode,
  activeType,
  showMode,
  resultCount,
}: {
  basePath: string;
  currentParams: URLSearchParams;
  atolls: AtollSummary[];
  activeAtollSlug: string | undefined;
  activeMode: TransferType | undefined;
  activeType: SharedOrPrivate | undefined;
  showMode: boolean;
  resultCount: number;
}) {
  const activeChips: Array<{ label: string; clearHref: string }> = [];
  if (activeAtollSlug) {
    activeChips.push({
      label: atolls.find((a) => a.slug === activeAtollSlug)?.title ?? activeAtollSlug,
      clearHref: linkWith(basePath, currentParams, { atoll: undefined }),
    });
  }
  if (activeMode) activeChips.push({ label: MODE_LABEL[activeMode], clearHref: linkWith(basePath, currentParams, { mode: undefined }) });
  if (activeType) activeChips.push({ label: TYPE_LABEL[activeType], clearHref: linkWith(basePath, currentParams, { type: undefined }) });

  return (
    <div className="mt-6">
      <details className="group" open>
        <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 [&::-webkit-details-marker]:hidden">
          Filters
          <span aria-hidden="true" className="transition-transform group-open:rotate-180">
            &#9662;
          </span>
        </summary>

        <div className="mt-3 space-y-4 rounded-2xl border border-neutral-200 p-4">
          {atolls.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Atoll</p>
              <nav aria-label="Filter by atoll" className="mt-2 flex flex-wrap gap-2 text-sm">
                {atolls.map((atoll) => (
                  <Link
                    key={atoll.id}
                    href={linkWith(basePath, currentParams, { atoll: activeAtollSlug === atoll.slug ? undefined : atoll.slug })}
                    className={`rounded-full border px-3 py-1 ${activeAtollSlug === atoll.slug ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
                  >
                    {atoll.title}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          {showMode && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Mode</p>
              <nav aria-label="Filter by transfer mode" className="mt-2 flex flex-wrap gap-2 text-sm">
                {MODES.map((mode) => (
                  <Link
                    key={mode}
                    href={linkWith(basePath, currentParams, { mode: activeMode === mode ? undefined : mode })}
                    className={`rounded-full border px-3 py-1 ${activeMode === mode ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
                  >
                    {MODE_LABEL[mode]}
                  </Link>
                ))}
              </nav>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Type</p>
            <nav aria-label="Filter by shared or private" className="mt-2 flex flex-wrap gap-2 text-sm">
              {TYPES.map((type) => (
                <Link
                  key={type}
                  href={linkWith(basePath, currentParams, { type: activeType === type ? undefined : type })}
                  className={`rounded-full border px-3 py-1 ${activeType === type ? "border-maldives-600 bg-maldives-600 text-white" : "border-neutral-300 text-neutral-700"}`}
                >
                  {TYPE_LABEL[type]}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </details>

      {activeChips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <Link key={chip.label} href={chip.clearHref} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700 hover:bg-neutral-200">
              {chip.label} <span aria-hidden="true">&#10005;</span>
            </Link>
          ))}
          <Link href={basePath} className="text-xs font-medium text-maldives-600 hover:underline">
            Clear all
          </Link>
        </div>
      )}

      <p className="mt-3 text-sm text-neutral-600">{resultCount} transfer routes</p>
    </div>
  );
}
