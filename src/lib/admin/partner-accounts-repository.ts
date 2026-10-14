import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OnboardingStatus, PartnerDocumentStatus, PartnerDocumentType, PartnerKind, PropertyType } from "@/lib/partner/types";

/**
 * Admin-only reads for the partner onboarding queue — governed by the
 * `partner_accounts_staff_all`/`partner_bank_details_staff_all`/`partner_
 * documents_staff_all` RLS policies (supabase/migrations/20261011000100_
 * partner_portal_foundation.sql). Same division of labour as every other
 * admin-*-repository.ts in this codebase.
 */

const PAGE_SIZE = 25;

export interface AdminPartnerAccountListItem {
  id: string;
  businessName: string;
  partnerKinds: PartnerKind[];
  propertyType: PropertyType | null;
  contactEmail: string;
  onboardingStatus: OnboardingStatus;
  submittedAt: string | null;
  createdAt: string;
}

interface PartnerAccountListRow {
  id: string;
  business_name: string;
  partner_kinds: PartnerKind[];
  property_type: PropertyType | null;
  contact_email: string;
  onboarding_status: OnboardingStatus;
  submitted_at: string | null;
  created_at: string;
}

export interface AdminPartnerAccountListResult {
  items: AdminPartnerAccountListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getPartnerAccountsAdmin(filters: { status?: OnboardingStatus; page?: number } = {}): Promise<AdminPartnerAccountListResult> {
  const page = Math.max(1, filters.page ?? 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();
  let query = supabase
    .from("partner_accounts")
    .select("id, business_name, partner_kinds, property_type, contact_email, onboarding_status, submitted_at, created_at", { count: "exact" })
    .order("submitted_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (filters.status) query = query.eq("onboarding_status", filters.status);

  const { data, error, count } = await query.range(from, to).returns<PartnerAccountListRow[]>();
  if (error || !data) return { items: [], total: 0, page, pageSize: PAGE_SIZE };

  return {
    items: data.map((row) => ({
      id: row.id,
      businessName: row.business_name,
      partnerKinds: row.partner_kinds,
      propertyType: row.property_type,
      contactEmail: row.contact_email,
      onboardingStatus: row.onboarding_status,
      submittedAt: row.submitted_at,
      createdAt: row.created_at,
    })),
    total: count ?? data.length,
    page,
    pageSize: PAGE_SIZE,
  };
}

export interface AdminPartnerAccountDetail {
  id: string;
  providerId: string | null;
  partnerKinds: PartnerKind[];
  propertyType: PropertyType | null;
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  address: string | null;
  description: string | null;
  onboardingStatus: OnboardingStatus;
  rejectionReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  bankDetails: {
    accountHolderName: string | null;
    bankName: string | null;
    accountNumber: string | null;
    ibanOrSwift: string | null;
    branchAddress: string | null;
    currency: string;
  } | null;
  documents: {
    id: string;
    documentType: PartnerDocumentType;
    storagePath: string;
    fileName: string | null;
    status: PartnerDocumentStatus;
    adminNote: string | null;
    uploadedAt: string;
  }[];
}

interface PartnerAccountDetailRow {
  id: string;
  provider_id: string | null;
  partner_kinds: PartnerKind[];
  property_type: PropertyType | null;
  business_name: string;
  contact_email: string;
  contact_phone: string | null;
  whatsapp: string | null;
  country: string | null;
  address: string | null;
  description: string | null;
  onboarding_status: OnboardingStatus;
  rejection_reason: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export async function getPartnerAccountByIdAdmin(id: string): Promise<AdminPartnerAccountDetail | null> {
  const supabase = await createClient();

  const [accountResult, bankResult, documentsResult] = await Promise.all([
    supabase.from("partner_accounts").select("*").eq("id", id).maybeSingle<PartnerAccountDetailRow>(),
    supabase
      .from("partner_bank_details")
      .select("account_holder_name, bank_name, account_number, iban_or_swift, branch_address, currency")
      .eq("partner_id", id)
      .maybeSingle<{
        account_holder_name: string | null;
        bank_name: string | null;
        account_number: string | null;
        iban_or_swift: string | null;
        branch_address: string | null;
        currency: string;
      }>(),
    supabase
      .from("partner_documents")
      .select("id, document_type, storage_path, file_name, status, admin_note, uploaded_at")
      .eq("partner_id", id)
      .order("uploaded_at", { ascending: false })
      .returns<
        {
          id: string;
          document_type: PartnerDocumentType;
          storage_path: string;
          file_name: string | null;
          status: PartnerDocumentStatus;
          admin_note: string | null;
          uploaded_at: string;
        }[]
      >(),
  ]);

  const row = accountResult.data;
  if (accountResult.error || !row) return null;

  const bank = bankResult.data;
  const documents = documentsResult.data ?? [];

  return {
    id: row.id,
    providerId: row.provider_id,
    partnerKinds: row.partner_kinds,
    propertyType: row.property_type,
    businessName: row.business_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    whatsapp: row.whatsapp,
    country: row.country,
    address: row.address,
    description: row.description,
    onboardingStatus: row.onboarding_status,
    rejectionReason: row.rejection_reason,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
    createdAt: row.created_at,
    bankDetails: bank
      ? {
          accountHolderName: bank.account_holder_name,
          bankName: bank.bank_name,
          accountNumber: bank.account_number,
          ibanOrSwift: bank.iban_or_swift,
          branchAddress: bank.branch_address,
          currency: bank.currency,
        }
      : null,
    documents: documents.map((d) => ({
      id: d.id,
      documentType: d.document_type,
      storagePath: d.storage_path,
      fileName: d.file_name,
      status: d.status,
      adminNote: d.admin_note,
      uploadedAt: d.uploaded_at,
    })),
  };
}
