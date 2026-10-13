import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AgentSignOutButton } from "@/components/agent/agent-sign-out-button";
import { Badge } from "@/components/ui/badge";
import { requireAgent } from "@/lib/agent/auth";
import { getMyAgentAccount } from "@/lib/agent/repository";
import type { AgentStatus } from "@/lib/agent/types";

export const metadata: Metadata = {
  title: "Travel Agent Dashboard | MTG",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<AgentStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Changes requested",
  suspended: "Suspended",
};

const STATUS_TONE: Record<AgentStatus, "neutral" | "maldives" | "aqua" | "outline"> = {
  pending: "aqua",
  approved: "maldives",
  rejected: "outline",
  suspended: "outline",
};

/** Every route under src/app/agent/(dashboard)/* renders behind
 * requireAgent() — same Server-Component-gate shape as
 * src/app/partner/(dashboard)/layout.tsx. /agent/login and /agent/signup
 * deliberately sit outside this route group. */
export default async function AgentDashboardLayout({ children }: { children: ReactNode }) {
  await requireAgent();
  const account = await getMyAgentAccount();
  if (!account) notFound();

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="truncate font-semibold text-ocean-900">{account.businessName}</span>
          <Badge tone={STATUS_TONE[account.status]}>{STATUS_LABEL[account.status]}</Badge>
        </div>
        <AgentSignOutButton />
      </div>
      <main className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  );
}
