import { NextResponse } from "next/server";

import { searchTransferRoutes } from "@/lib/transfers/repository";

/** Backs the inline "search transfer routes by name" box (TransferRouteSearch)
 * — distinct from /api/transfers/finder-suggest, which backs the From/To
 * route-finder's location combobox. This one matches directly against a
 * route's own title (e.g. "Centara Ras Fushi"), so a visitor who already
 * knows the resort/hotel/island name can jump straight to its route page
 * instead of scanning a long card grid by eye. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const results = await searchTransferRoutes(q, { limit: 8 });

  return NextResponse.json(
    { results },
    { headers: { "Cache-Control": "private, max-age=30" } },
  );
}
