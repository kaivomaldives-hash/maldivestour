import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AgentAccount, AgentStatus } from "@/lib/agent/types";

interface AgentAccountRow {
  id: string;
  business_name: string;
  contact_email: string;
  contact_phone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypal_email: string | null;
  status: AgentStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
}

function fromRow(row: AgentAccountRow): AgentAccount {
  return {
    id: row.id,
    businessName: row.business_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    whatsapp: row.whatsapp,
    country: row.country,
    paypalEmail: row.paypal_email,
    status: row.status,
    rejectionReason: row.rejection_reason,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
  };
}

/** The signed-in agent's own account — governed by the
 * `agent_accounts_self_select` RLS policy, so this can never return
 * another agent's row regardless of what id is asked for (there isn't
 * one to ask for; it always reads auth.uid() implicitly via RLS). */
export async function getMyAgentAccount(): Promise<AgentAccount | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("agent_accounts").select("*").eq("id", user.id).maybeSingle<AgentAccountRow>();
  return data ? fromRow(data) : null;
}
