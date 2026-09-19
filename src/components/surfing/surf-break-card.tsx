import Link from "next/link";

import type { SurfBreakSummary } from "@/lib/surfing/types";

const BREAK_TYPE_LABEL: Record<string, string> = {
  reef_break: "Reef break",
  point_break: "Point break",
  beach_break: "Beach break",
  channel: "Channel",
};

export function SurfBreakCard({ surfBreak }: { surfBreak: SurfBreakSummary }) {
  return (
    <li className="rounded border border-neutral-200 p-4">
      <Link href={`/maldives/surf-breaks/${surfBreak.slug}/`} className="text-lg font-medium hover:underline">
        {surfBreak.title}
      </Link>
      {surfBreak.breakType && (
        <div className="mt-1 text-sm text-neutral-600">{BREAK_TYPE_LABEL[surfBreak.breakType] ?? surfBreak.breakType}</div>
      )}
    </li>
  );
}
