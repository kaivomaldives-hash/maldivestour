/**
 * Pure filename <-> route matching for the admin bulk photo uploader
 * (src/components/admin/transfer-route-bulk-photo-upload.tsx) — no
 * "server-only" import, since this same logic runs in the browser (to
 * preview matches the moment files are selected, before anything
 * uploads) and would otherwise need a round trip per file.
 */

export interface RouteMatchCandidate {
  routeId: string;
  slug: string;
  title: string;
  destinationTitle: string | null;
  hasImage: boolean;
}

export interface FilenameMatchResult {
  routeId: string | null;
  confidence: "exact" | "fuzzy" | "none";
  /** Other routes that matched about as well — surfaced so staff can
   * correct a wrong guess instead of silently attaching to the wrong
   * resort when a filename is ambiguous. */
  alternateRouteIds: string[];
}

/** Strips a file extension, folds separators/punctuation to spaces, and
 * lowercases — "Centara_Ras-Fushi.JPG" and "Centara Ras Fushi Resort &
 * Spa" both normalize toward the same comparable string. */
export function normalizeForMatch(input: string): string {
  return input
    .toLowerCase()
    .replace(/\.[a-z0-9]{2,5}$/i, "")
    .replace(/[&]/g, " and ")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function candidateLabels(route: RouteMatchCandidate): string[] {
  const labels = [route.title, route.slug.replace(/-/g, " ")];
  if (route.destinationTitle) labels.push(route.destinationTitle);
  return Array.from(new Set(labels.map(normalizeForMatch).filter((l) => l.length > 0)));
}

/** Every route in `routes` carries a destination-location title and a
 * slug alongside its own origin-included title, since a staff-named file
 * is far more likely to name just the destination ("centara-ras-fushi")
 * than the full "Velana International Airport to Centara Ras Fushi
 * Resort & Spa" title. */
export function matchFilenameToRoute(filename: string, routes: RouteMatchCandidate[]): FilenameMatchResult {
  const normalizedFile = normalizeForMatch(filename);
  if (!normalizedFile) return { routeId: null, confidence: "none", alternateRouteIds: [] };

  const exact = routes.filter((r) => candidateLabels(r).includes(normalizedFile));
  if (exact.length === 1) return { routeId: exact[0].routeId, confidence: "exact", alternateRouteIds: [] };
  if (exact.length > 1) return { routeId: exact[0].routeId, confidence: "fuzzy", alternateRouteIds: exact.slice(1).map((r) => r.routeId) };

  const fuzzy = routes.filter((r) =>
    candidateLabels(r).some((label) => label.length >= 4 && (label.includes(normalizedFile) || normalizedFile.includes(label))),
  );
  if (fuzzy.length === 0) return { routeId: null, confidence: "none", alternateRouteIds: [] };
  if (fuzzy.length === 1) return { routeId: fuzzy[0].routeId, confidence: "fuzzy", alternateRouteIds: [] };

  // Several plausible matches — rank by how close the best-matching label
  // is in length to the filename itself, and default to the closest one.
  const scored = fuzzy
    .map((route) => {
      const bestDiff = Math.min(...candidateLabels(route).map((label) => Math.abs(label.length - normalizedFile.length)));
      return { route, bestDiff };
    })
    .sort((a, b) => a.bestDiff - b.bestDiff);
  return { routeId: scored[0].route.routeId, confidence: "fuzzy", alternateRouteIds: scored.slice(1).map((s) => s.route.routeId) };
}
