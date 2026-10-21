"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  finalizeRouteBulkPhotoUpload,
  getTransferRoutesForPhotoMatching,
  uploadMatchedRoutePhoto,
} from "@/lib/admin/transfer-route-photo-matching";
import { matchFilenameToRoute, type RouteMatchCandidate } from "@/lib/transfers/photo-filename-matching";

type RowStatus = "pending" | "uploading" | "done" | "skipped" | "error";

interface Row {
  file: File;
  routeId: string | null;
  confidence: "exact" | "fuzzy" | "none";
  alternateRouteIds: string[];
  status: RowStatus;
  message?: string;
}

const UPLOAD_CONCURRENCY = 3;

/**
 * Bulk route-photo uploader: staff select every file in a folder at once
 * (filenames matched to a route by resort/destination name — see
 * src/lib/transfers/photo-filename-matching.ts), review/correct the
 * matches, then upload. Files go up one request at a time with a small
 * concurrency limit — never all of them in one request, which would blow
 * past the 10MB Server Action body limit for anything more than a
 * handful of files (next.config.ts).
 */
export function TransferRouteBulkPhotoUpload() {
  const router = useRouter();
  const [routes, setRoutes] = useState<RouteMatchCandidate[]>([]);
  const [routesLoaded, setRoutesLoaded] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const routesById = useMemo(() => new Map(routes.map((r) => [r.routeId, r])), [routes]);

  async function handleFilesSelected(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setSummary(null);

    let currentRoutes = routes;
    if (!routesLoaded) {
      currentRoutes = await getTransferRoutesForPhotoMatching();
      setRoutes(currentRoutes);
      setRoutesLoaded(true);
    }

    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const newRows: Row[] = files.map((file) => {
      const match = matchFilenameToRoute(file.name, currentRoutes);
      return { file, routeId: match.routeId, confidence: match.confidence, alternateRouteIds: match.alternateRouteIds, status: "pending" };
    });
    setRows(newRows);
  }

  function updateRow(index: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  }

  const matchedCount = rows.filter((r) => r.routeId).length;
  const unmatchedCount = rows.length - matchedCount;
  const alreadyHasPhotoCount = rows.filter((r) => r.routeId && routesById.get(r.routeId)?.hasImage).length;

  async function startUpload() {
    setIsUploading(true);
    setSummary(null);

    const toUpload = rows
      .map((row, index) => ({ row, index }))
      .filter(({ row }) => row.routeId && row.status !== "done" && row.status !== "skipped");

    let cursor = 0;
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    async function worker() {
      while (cursor < toUpload.length) {
        const current = toUpload[cursor];
        cursor += 1;
        const { row, index } = current;
        if (!row.routeId) continue;

        const routeHasPhoto = routesById.get(row.routeId)?.hasImage ?? false;
        if (routeHasPhoto && !replaceExisting) {
          updateRow(index, { status: "skipped", message: "Already has a photo" });
          skipped += 1;
          continue;
        }

        updateRow(index, { status: "uploading" });
        const formData = new FormData();
        formData.set("file", row.file);
        try {
          const result = await uploadMatchedRoutePhoto(row.routeId, formData, replaceExisting);
          if (result.ok) {
            updateRow(index, { status: "done" });
            uploaded += 1;
          } else {
            updateRow(index, { status: "error", message: result.error });
            failed += 1;
          }
        } catch (err) {
          updateRow(index, { status: "error", message: err instanceof Error ? err.message : "Upload failed." });
          failed += 1;
        }
      }
    }

    await Promise.all(Array.from({ length: UPLOAD_CONCURRENCY }, () => worker()));
    await finalizeRouteBulkPhotoUpload();

    setIsUploading(false);
    setSummary(`${uploaded} uploaded, ${skipped} skipped (already had a photo), ${failed} failed.`);
    router.refresh();
  }

  return (
    <div className="mt-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-sm font-medium text-neutral-700">Bulk upload route photos</p>
      <p className="mt-1 text-sm text-neutral-500">
        Select every photo in a folder at once — each file is matched to a route by its filename (destination or resort name works best, e.g.{" "}
        <code className="rounded bg-neutral-100 px-1">centara-ras-fushi.jpg</code>). Review the matches below before uploading.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFilesSelected(e.target.files)}
          disabled={isUploading}
          className="text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-neutral-600">
          <input type="checkbox" checked={replaceExisting} onChange={(e) => setReplaceExisting(e.target.checked)} disabled={isUploading} />
          Replace existing photos on matched routes
        </label>
      </div>

      {rows.length > 0 && (
        <>
          <p className="mt-3 text-sm text-neutral-600">
            {rows.length} file{rows.length === 1 ? "" : "s"} selected — {matchedCount} matched, {unmatchedCount} unmatched
            {alreadyHasPhotoCount > 0 && !replaceExisting ? `, ${alreadyHasPhotoCount} already have a photo (will be skipped)` : ""}.
          </p>

          <div className="mt-3 max-h-96 overflow-y-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-neutral-50 text-xs text-neutral-500">
                <tr>
                  <th className="px-3 py-2">File</th>
                  <th className="px-3 py-2">Matched route</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((row, index) => (
                  <tr key={`${row.file.name}-${index}`} className={row.routeId ? "" : "bg-amber-50"}>
                    <td className="px-3 py-2 text-neutral-700">{row.file.name}</td>
                    <td className="px-3 py-2">
                      <select
                        value={row.routeId ?? ""}
                        onChange={(e) => updateRow(index, { routeId: e.target.value || null, confidence: "exact" })}
                        disabled={isUploading}
                        className={`w-full rounded-lg border px-2 py-1 text-sm ${row.routeId ? "border-neutral-300" : "border-amber-400"}`}
                      >
                        <option value="">— no match, skip —</option>
                        {routes.map((r) => (
                          <option key={r.routeId} value={r.routeId}>
                            {r.title}
                            {r.hasImage ? " (has photo)" : ""}
                          </option>
                        ))}
                      </select>
                      {row.confidence === "fuzzy" && row.alternateRouteIds.length > 0 && (
                        <p className="mt-0.5 text-xs text-amber-700">Uncertain match — double-check this one.</p>
                      )}
                    </td>
                    <td className="px-3 py-2 text-neutral-600">
                      {row.status === "pending" && "Ready"}
                      {row.status === "uploading" && "Uploading…"}
                      {row.status === "done" && <span className="text-emerald-600">Uploaded</span>}
                      {row.status === "skipped" && <span className="text-neutral-400">{row.message ?? "Skipped"}</span>}
                      {row.status === "error" && <span className="text-red-600">{row.message ?? "Failed"}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={startUpload}
            disabled={isUploading || matchedCount === 0}
            className="mt-3 rounded-full bg-maldives-600 px-4 py-2 text-sm font-medium text-white hover:bg-ocean-800 disabled:opacity-50"
          >
            {isUploading ? "Uploading…" : `Upload ${matchedCount} matched photo${matchedCount === 1 ? "" : "s"}`}
          </button>
        </>
      )}

      {summary && <p className="mt-3 text-sm text-maldives-600">{summary}</p>}
    </div>
  );
}
