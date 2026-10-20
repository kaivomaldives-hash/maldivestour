// Payload shapes for partner-authored listing submissions
// (listing_submissions.payload). Each shape is deliberately a 1:1 subset
// of the matching admin Fields type (AccommodationFieldsAdmin etc. in
// src/lib/admin/*-repository.ts) so the staff "Approve" action can feed a
// validated payload straight into the exact same createX/updateX
// functions the staff editors already use — no separate apply logic per
// field, just per entity type. operatedByProviderId is deliberately NOT
// part of any of these shapes: it's always the approving partner's own
// provider_id, forced server-side on approval, never partner-submitted.

import type { AccommodationType, PriceTier } from "@/lib/accommodations/types";
import type { ActivityCategory, ActivityDifficulty } from "@/lib/activities/types";
import type { SharedOrPrivate, TransferServiceStatus, TransferType } from "@/lib/transfers/types";

export type ListingNodeType = "accommodation" | "activity" | "package" | "transfer_route";
export type ListingSubmissionKind = "create" | "update";
export type ListingSubmissionStatus = "pending" | "approved" | "rejected";

export interface PartnerRoomInput {
  name: string;
  priceFrom: number | null;
  priceCurrency: string;
  bedType: string | null;
  maxOccupancy: number | null;
}

export interface AccommodationListingPayload {
  title: string;
  summary: string | null;
  accommodationType: AccommodationType;
  starRating: number | null;
  priceTier: PriceTier | null;
  roomCount: number | null;
  allInclusive: boolean;
  overwaterVillas: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  currency: string;
  priceFrom: number | null;
  locationId: string | null;
  rooms: PartnerRoomInput[];
  /** The partner's own commission offer on this listing — floor enforced
   * both client-side (CommissionPercentField) and server-side
   * (submitListing, and again by the DB check constraint on
   * bookable_products/transfer_services once approved). */
  commissionPercent: number;
}

export interface ActivityListingPayload {
  title: string;
  summary: string | null;
  activityCategory: ActivityCategory;
  durationMinutes: number | null;
  minAge: number | null;
  difficulty: ActivityDifficulty | null;
  priceFrom: number | null;
  currency: string;
  maxParticipants: number | null;
  locationId: string | null;
  commissionPercent: number;
}

export interface PackageListingPayload {
  title: string;
  summary: string | null;
  durationNights: number | null;
  priceFrom: number | null;
  currency: string;
  commissionPercent: number;
}

export interface TransferServicePayload {
  id: string | null; // present when editing an existing service; null = create a new one on this route
  transferType: TransferType;
  vehicleType: string | null;
  sharedOrPrivate: SharedOrPrivate;
  durationMinutes: number | null;
  price: number;
  currency: string;
  capacity: number | null;
  luggageAllowance: string | null;
  status: TransferServiceStatus;
  pickupInstructions: string | null;
  dropoffInstructions: string | null;
  bookingRequirements: string | null;
  cancellationPolicy: string | null;
  description: string | null;
  commissionPercent: number;
}

export interface TransferRouteListingPayload {
  title: string;
  summary: string | null;
  originLocationId: string;
  destinationLocationId: string;
  distanceKm: number | null;
  typicalDurationMinutes: number | null;
  service: TransferServicePayload;
}

export type ListingPayload = AccommodationListingPayload | ActivityListingPayload | PackageListingPayload | TransferRouteListingPayload;

export const ACCOMMODATION_TYPES: { value: AccommodationType; label: string }[] = [
  { value: "resort", label: "Resort" },
  { value: "hotel", label: "Hotel" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "villa", label: "Villa" },
  { value: "liveaboard", label: "Liveaboard" },
  { value: "other", label: "Other" },
];

export const PRICE_TIERS: { value: PriceTier; label: string }[] = [
  { value: "budget", label: "Budget" },
  { value: "mid", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
  { value: "ultra_luxury", label: "Ultra-luxury" },
];

export const ACTIVITY_CATEGORIES: { value: ActivityCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "fishing", label: "Fishing" },
  { value: "diving", label: "Diving" },
  { value: "surfing", label: "Surfing" },
  { value: "watersports", label: "Watersports" },
  { value: "excursion", label: "Excursion" },
  { value: "island_hopping", label: "Island Hopping" },
  { value: "spa", label: "Spa" },
  { value: "culture", label: "Culture" },
];

export const ACTIVITY_DIFFICULTIES: { value: ActivityDifficulty; label: string }[] = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all_levels", label: "All levels" },
];

export const TRANSFER_TYPES: { value: TransferType; label: string }[] = [
  { value: "speedboat", label: "Speedboat" },
  { value: "seaplane", label: "Seaplane" },
  { value: "domestic_flight", label: "Domestic Flight" },
  { value: "ferry", label: "Ferry" },
  { value: "private_yacht", label: "Private Yacht" },
  { value: "land_transfer", label: "Land Transfer" },
];

export const SHARED_OR_PRIVATE: { value: SharedOrPrivate; label: string }[] = [
  { value: "shared", label: "Shared" },
  { value: "private", label: "Private" },
];

export interface ListingSubmissionSummary {
  id: string;
  nodeType: ListingNodeType;
  submissionKind: ListingSubmissionKind;
  title: string;
  status: ListingSubmissionStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface MyListingItem {
  nodeId: string;
  nodeType: ListingNodeType;
  title: string;
  slug: string;
  summary: string | null;
}
