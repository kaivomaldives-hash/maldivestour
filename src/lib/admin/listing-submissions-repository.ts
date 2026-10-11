import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  ListingNodeType,
  ListingPayload,
  ListingSubmissionKind,
  ListingSubmissionStatus,
} from "@/lib/partner/listings/types";

const PAGE_SIZE = 25;

export interface AdminListingSubmissionItem {
  id: string;
  partnerId: string;
  partnerBusinessName: string;
  nodeType: ListingNodeType;
  submissionKind: ListingSubmissionKind;
  title: string;
  status: ListingSubmissionStatus;
  createdAt: string;
}

interface SubmissionListRow {
  id: string;
  partner_id: string;
  node_type: ListingNodeType;
  submission_kind: ListingSubmissionKind;
  title: string;
  status: ListingSubmissionStatus;
  created_at: string;
  partner_accounts: { business_name: string } | null;
}

export interface AdminListingSubmissionListResult {
  items: AdminListingSubmissionItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getListingSubmissionsAdmin(filters: { status?: ListingSubmissionStatus; page?: number } = {}): Promise<AdminListingSubmissionListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("listing_submissions")
    .select("id, partner_id, node_type, submission_kind, title, status, created_at, partner_accounts(business_name)", { count: "exact" })
    .order("created_at", { ascending: false });
  if (filters.status) query = query.eq("status", filters.status);

  const { data, error, count } = await query.range(from, to).returns<SubmissionListRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  return {
    items: data.map((row) => ({
      id: row.id,
      partnerId: row.partner_id,
      partnerBusinessName: row.partner_accounts?.business_name ?? "Unknown partner",
      nodeType: row.node_type,
      submissionKind: row.submission_kind,
      title: row.title,
      status: row.status,
      createdAt: row.created_at,
    })),
    total: count ?? data.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export interface AdminListingSubmissionDetail {
  id: string;
  partnerId: string;
  partnerBusinessName: string;
  providerId: string | null;
  nodeId: string | null;
  nodeType: ListingNodeType;
  submissionKind: ListingSubmissionKind;
  title: string;
  payload: ListingPayload;
  status: ListingSubmissionStatus;
  adminNote: string | null;
  createdAt: string;
}

interface SubmissionDetailRow {
  id: string;
  partner_id: string;
  node_id: string | null;
  node_type: ListingNodeType;
  submission_kind: ListingSubmissionKind;
  title: string;
  payload: ListingPayload;
  status: ListingSubmissionStatus;
  admin_note: string | null;
  created_at: string;
  partner_accounts: { business_name: string; provider_id: string | null } | null;
}

export async function getListingSubmissionByIdAdmin(id: string): Promise<AdminListingSubmissionDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listing_submissions")
    .select("id, partner_id, node_id, node_type, submission_kind, title, payload, status, admin_note, created_at, partner_accounts(business_name, provider_id)")
    .eq("id", id)
    .maybeSingle<SubmissionDetailRow>();
  if (error || !data) return null;

  return {
    id: data.id,
    partnerId: data.partner_id,
    partnerBusinessName: data.partner_accounts?.business_name ?? "Unknown partner",
    providerId: data.partner_accounts?.provider_id ?? null,
    nodeId: data.node_id,
    nodeType: data.node_type,
    submissionKind: data.submission_kind,
    title: data.title,
    payload: data.payload,
    status: data.status,
    adminNote: data.admin_note,
    createdAt: data.created_at,
  };
}
