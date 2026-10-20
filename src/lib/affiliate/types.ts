// Domain types for the Affiliate self-service programme. Phase 1:
// account application + admin approval (mirrors src/lib/partner/types.ts
// in shape). Phase 2 (below): promo-code commission tracking + manual
// payouts.

export type AffiliateStatus = "pending" | "approved" | "rejected" | "suspended";

export type AffiliateCommissionStatus = "pending" | "payable" | "void";

export interface AffiliateCommissionBooking {
  id: string;
  bookingReference: string;
  productTitle: string;
  commissionAmount: number | null;
  commissionStatus: AffiliateCommissionStatus;
  createdAt: string;
}

export interface AffiliatePayout {
  id: string;
  amount: number;
  currency: string;
  method: string | null;
  note: string | null;
  paidAt: string;
}

export interface AffiliatePendingPayoutRequest {
  id: string;
  requestedAmount: number;
  note: string | null;
  requestedAt: string;
}

export interface AffiliateEarningsSummary {
  /** Commission on a booking that hasn't completed yet — not owed yet,
   * shown so the affiliate can see what's coming. */
  pendingAmount: number;
  /** Commission on a completed booking, not yet paid out. */
  payableAmount: number;
  /** Total of every recorded payout, ever. */
  paidAmount: number;
  /** payableAmount - paidAmount — what's actually owed right now. */
  balanceDue: number;
  currency: string;
  bookings: AffiliateCommissionBooking[];
  payouts: AffiliatePayout[];
  /** Null unless a "Request Withdrawal" submission is still awaiting
   * staff action — request_affiliate_payout() allows at most one at a
   * time. */
  pendingPayoutRequest: AffiliatePendingPayoutRequest | null;
}

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
