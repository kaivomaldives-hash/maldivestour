// Domain types for the Travel Agent self-service programme (Phase 1:
// account application + admin approval only — no discount/booking logic
// yet). Mirrors src/lib/partner/types.ts in shape.

export type AgentStatus = "pending" | "approved" | "rejected" | "suspended";

export interface AgentAccount {
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
