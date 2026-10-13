// Domain types for the Affiliate self-service programme (Phase 1:
// account application + admin approval only — referral tracking,
// discounts, and commissions are later, separate phases). Mirrors
// src/lib/partner/types.ts in shape.

export type AffiliateStatus = "pending" | "approved" | "rejected" | "suspended";

export interface AffiliateAccount {
  id: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string | null;
  whatsapp: string | null;
  country: string | null;
  paypalEmail: string | null;
  referralCode: string;
  status: AffiliateStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
}
