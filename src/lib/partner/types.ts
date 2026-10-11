// Domain types for the partner self-service portal (phase 1 — account +
// onboarding only; listing management and bookings are later phases).

export type PartnerKind = "property" | "activity" | "package" | "transfer";
export type PropertyType = "resort" | "hotel" | "guesthouse" | "liveaboard";
export type OnboardingStatus = "profile" | "submitted" | "approved" | "rejected" | "suspended";
export type PartnerDocumentType = "business_license" | "owner_id" | "bank_proof" | "property_proof";
export type PartnerDocumentStatus = "pending" | "approved" | "rejected";

export const PARTNER_KINDS: { value: PartnerKind; label: string }[] = [
  { value: "property", label: "Property (resort, hotel, guesthouse, liveaboard)" },
  { value: "activity", label: "Activity operator (diving, fishing, excursions, etc.)" },
  { value: "package", label: "Holiday package operator" },
  { value: "transfer", label: "Transfer operator (speedboat, ferry, land transfer)" },
];

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "resort", label: "Resort" },
  { value: "hotel", label: "Hotel" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "liveaboard", label: "Liveaboard" },
];

export const PARTNER_DOCUMENT_TYPES: { value: PartnerDocumentType; label: string; description: string }[] = [
  { value: "business_license", label: "Business / tourism license", description: "Proof your business is a registered, licensed Maldivian tourism operator." },
  { value: "owner_id", label: "Owner / manager ID", description: "A national ID or passport for the person registering as the partner." },
  { value: "bank_proof", label: "Bank account proof", description: "A bank statement or equivalent confirming the bank details you enter are real." },
  { value: "property_proof", label: "Property photos / ownership proof", description: "Evidence you actually operate the property or service you plan to list." },
];

export interface PartnerAccount {
  id: string;
  providerId: string | null;
  partnerKind: PartnerKind;
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
}

export interface PartnerBankDetails {
  accountHolderName: string | null;
  bankName: string | null;
  accountNumber: string | null;
  ibanOrSwift: string | null;
  branchAddress: string | null;
  currency: string;
}

export interface PartnerDocument {
  id: string;
  documentType: PartnerDocumentType;
  storagePath: string;
  fileName: string | null;
  status: PartnerDocumentStatus;
  adminNote: string | null;
  uploadedAt: string;
}
