import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OnboardingStatus, PartnerDocumentStatus, PartnerDocumentType, PartnerKind, PropertyType } from "@/lib/partner/types";
import type { PartnerCommissionStatus } from "@/lib/partner/bookings/repository";

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

export interface AdminPartnerCommissionBooking {
  id: string;
  bookingReference: string;
  customerName: string;
  productTitle: string;
  commissionAmount: number | null;
  commissionStatus: PartnerCommissionStatus;
  createdAt: string;
}

export interface AdminPartnerPayment {
  id: string;
  amount: number;
  currency: string;
  method: string | null;
  note: string | null;
  paidAt: string;
}

export interface AdminPartnerEarnings {
  pendingAmount: number;
  payableAmount: number;
  paidAmount: number;
  balanceDue: number;
  currency: string;
  bookings: AdminPartnerCommissionBooking[];
  payments: AdminPartnerPayment[];
}

interface CommissionBookingAdminRow {
  id: string;
  booking_reference: string;
  customer_name: string;
  product_type: "node" | "transfer_service";
  product_node_id: string | null;
  transfer_service_id: string | null;
  partner_commission_amount: number | null;
  partner_commission_status: PartnerCommissionStatus;
  created_at: string;
}

/** Staff already has unrestricted RLS access to `bookings`, same as
 * getAffiliateEarningsAdmin (src/lib/admin/affiliate-accounts-repository.ts). */
export async function getPartnerEarningsAdmin(partnerId: string): Promise<AdminPartnerEarnings> {
  const supabase = await createClient();

  const [bookingsResult, paymentsResult] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, booking_reference, customer_name, product_type, product_node_id, transfer_service_id, partner_commission_amount, partner_commission_status, created_at")
      .eq("partner_id", partnerId)
      .neq("partner_commission_status", "none")
      .order("created_at", { ascending: false })
      .returns<CommissionBookingAdminRow[]>(),
    supabase
      .from("partner_payments")
      .select("id, amount, currency, method, note, paid_at")
      .eq("partner_id", partnerId)
      .order("paid_at", { ascending: false })
      .returns<Array<{ id: string; amount: number; currency: string; method: string | null; note: string | null; paid_at: string }>>(),
  ]);

  const bookingRows = bookingsResult.data ?? [];
  const paymentRows = paymentsResult.data ?? [];

  const nodeIds = [...new Set(bookingRows.filter((r) => r.product_type === "node" && r.product_node_id).map((r) => r.product_node_id as string))];
  const serviceIds = [
    ...new Set(bookingRows.filter((r) => r.product_type === "transfer_service" && r.transfer_service_id).map((r) => r.transfer_service_id as string)),
  ];
  const titles = new Map<string, string>();
  if (nodeIds.length > 0) {
    const { data } = await supabase.from("nodes").select("id, title").in("id", nodeIds).returns<Array<{ id: string; title: string }>>();
    for (const n of data ?? []) titles.set(`node:${n.id}`, n.title);
  }
  if (serviceIds.length > 0) {
    const { data } = await supabase
      .from("transfer_services")
      .select("id, route_id")
      .in("id", serviceIds)
      .returns<Array<{ id: string; route_id: string }>>();
    const routeIds = [...new Set((data ?? []).map((s) => s.route_id))];
    const { data: routeNodes } =
      routeIds.length > 0
        ? await supabase.from("nodes").select("id, title").in("id", routeIds).returns<Array<{ id: string; title: string }>>()
        : { data: [] as Array<{ id: string; title: string }> };
    const routeTitleById = new Map((routeNodes ?? []).map((n) => [n.id, n.title]));
    for (const s of data ?? []) titles.set(`service:${s.id}`, routeTitleById.get(s.route_id) ?? "Transfer route");
  }

  const bookings = bookingRows.map((row) => {
    const key = row.product_type === "node" ? `node:${row.product_node_id}` : `service:${row.transfer_service_id}`;
    return {
      id: row.id,
      bookingReference: row.booking_reference,
      customerName: row.customer_name,
      productTitle: titles.get(key) ?? "(product not found)",
      commissionAmount: row.partner_commission_amount,
      commissionStatus: row.partner_commission_status,
      createdAt: row.created_at,
    };
  });

  const pendingAmount = bookings.filter((b) => b.commissionStatus === "pending").reduce((sum, b) => sum + (b.commissionAmount ?? 0), 0);
  const payableAmount = bookings.filter((b) => b.commissionStatus === "payable").reduce((sum, b) => sum + (b.commissionAmount ?? 0), 0);
  const paidAmount = paymentRows.reduce((sum, p) => sum + p.amount, 0);

  return {
    pendingAmount,
    payableAmount,
    paidAmount,
    balanceDue: payableAmount - paidAmount,
    currency: "USD",
    bookings,
    payments: paymentRows.map((p) => ({ id: p.id, amount: p.amount, currency: p.currency, method: p.method, note: p.note, paidAt: p.paid_at })),
  };
}
