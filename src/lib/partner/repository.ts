import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  OnboardingStatus,
  PartnerAccount,
  PartnerBankDetails,
  PartnerDocument,
  PartnerDocumentStatus,
  PartnerDocumentType,
  PartnerKind,
  PropertyType,
} from "@/lib/partner/types";

/**
 * Reads scoped to the signed-in partner's own row, governed by the
 * `partner_accounts_self_select`/`partner_bank_details_self_all`/
 * `partner_documents_self_select` RLS policies — this file adds no new
 * access path, it just shapes what those policies already allow into the
 * app's TypeScript types (same division of labour as every other
 * repository in this codebase).
 */

interface PartnerAccountRow {
  id: string;
  provider_id: string | null;
  partner_kind: PartnerKind;
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

function accountOf(row: PartnerAccountRow): PartnerAccount {
  return {
    id: row.id,
    providerId: row.provider_id,
    partnerKind: row.partner_kind,
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
  };
}

/** The signed-in partner's own account row, or null if none exists (not
 * signed up as a partner) or the session isn't authenticated. */
export async function getMyPartnerAccount(): Promise<PartnerAccount | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("partner_accounts")
    .select("*")
    .eq("id", user.id)
    .maybeSingle<PartnerAccountRow>();
  if (error || !data) return null;
  return accountOf(data);
}

interface BankDetailsRow {
  account_holder_name: string | null;
  bank_name: string | null;
  account_number: string | null;
  iban_or_swift: string | null;
  branch_address: string | null;
  currency: string;
}

export async function getMyBankDetails(partnerId: string): Promise<PartnerBankDetails | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partner_bank_details")
    .select("account_holder_name, bank_name, account_number, iban_or_swift, branch_address, currency")
    .eq("partner_id", partnerId)
    .maybeSingle<BankDetailsRow>();
  if (error || !data) return null;
  return {
    accountHolderName: data.account_holder_name,
    bankName: data.bank_name,
    accountNumber: data.account_number,
    ibanOrSwift: data.iban_or_swift,
    branchAddress: data.branch_address,
    currency: data.currency,
  };
}

interface DocumentRow {
  id: string;
  document_type: PartnerDocumentType;
  storage_path: string;
  file_name: string | null;
  status: PartnerDocumentStatus;
  admin_note: string | null;
  uploaded_at: string;
}

export async function getMyDocuments(partnerId: string): Promise<PartnerDocument[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partner_documents")
    .select("id, document_type, storage_path, file_name, status, admin_note, uploaded_at")
    .eq("partner_id", partnerId)
    .order("uploaded_at", { ascending: false })
    .returns<DocumentRow[]>();
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    documentType: row.document_type,
    storagePath: row.storage_path,
    fileName: row.file_name,
    status: row.status,
    adminNote: row.admin_note,
    uploadedAt: row.uploaded_at,
  }));
}
