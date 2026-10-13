import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { AgentStatus } from "@/lib/agent/types";

/** Admin-only reads for the agent application queue — governed by the
 * `agent_accounts_staff_all` RLS policy. Same division of labour as
 * every other admin-*-repository.ts in this codebase. */

const PAGE_SIZE = 25;

export interface AdminAgentAccountListItem {
  id: string;
  businessName: string;
  contactEmail: string;
  status: AgentStatus;
  createdAt: string;
}

interface AgentAccountListRow {
  id: string;
  business_name: string;
  contact_email: string;
  status: AgentStatus;
  created_at: string;
}

export interface AdminAgentAccountListResult {
  items: AdminAgentAccountListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAgentAccountsAdmin(filters: { status?: AgentStatus; page?: number } = {}): Promise<AdminAgentAccountListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("agent_accounts")
    .select("id, business_name, contact_email, status, created_at", { count: "exact" })
    .order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error, count } = await query.range(from, to).returns<AgentAccountListRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  return {
    items: data.map((row) => ({
      id: row.id,
      businessName: row.business_name,
      contactEmail: row.contact_email,
      status: row.status,
      createdAt: row.created_at,
    })),
    total: count ?? data.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export interface AdminAgentAccountDetail {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypalEmail: string | null;
  status: AgentStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

interface AgentAccountDetailRow {
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

export async function getAgentAccountByIdAdmin(id: string): Promise<AdminAgentAccountDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("agent_accounts").select("*").eq("id", id).maybeSingle<AgentAccountDetailRow>();
  if (error || !data) return null;

  return {
    id: data.id,
    businessName: data.business_name,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
    whatsapp: data.whatsapp,
    country: data.country,
    paypalEmail: data.paypal_email,
    status: data.status,
    rejectionReason: data.rejection_reason,
    reviewedAt: data.reviewed_at,
    createdAt: data.created_at,
  };
}
