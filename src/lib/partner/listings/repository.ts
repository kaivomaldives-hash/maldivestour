import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  AccommodationListingPayload,
  ActivityListingPayload,
  ListingNodeType,
  ListingSubmissionKind,
  ListingSubmissionStatus,
  ListingSubmissionSummary,
  MyListingItem,
  PackageListingPayload,
  TransferRouteListingPayload,
} from "@/lib/partner/listings/types";

/**
 * Reads for the partner's own listings + submissions. "My listings" reads
 * `nodes` directly (title/slug/summary already live there) rather than
 * joining the type-specific table, since a published node is already
 * publicly readable via each table's `*_public_read` policy and `nodes`
 * has its own equivalent — no new RLS needed for this file at all.
 */

interface NodeRow {
  id: string;
  node_type: ListingNodeType;
  title: string;
  slug: string;
  summary: string | null;
}

export async function getMyListings(nodeType: ListingNodeType): Promise<MyListingItem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("nodes")
    .select("id, node_type, title, slug, summary")
    .eq("node_type", nodeType)
    .eq("created_by", user.id)
    .order("title", { ascending: true })
    .returns<NodeRow[]>();
  if (error || !data) return [];

  return data.map((row) => ({ nodeId: row.id, nodeType: row.node_type, title: row.title, slug: row.slug, summary: row.summary }));
}

interface SubmissionRow {
  id: string;
  node_type: ListingNodeType;
  submission_kind: ListingSubmissionKind;
  title: string;
  status: ListingSubmissionStatus;
  admin_note: string | null;
  created_at: string;
}

export async function getMyListingSubmissions(): Promise<ListingSubmissionSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("listing_submissions")
    .select("id, node_type, submission_kind, title, status, admin_note, created_at")
    .eq("partner_id", user.id)
    .order("created_at", { ascending: false })
    .returns<SubmissionRow[]>();
  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    nodeType: row.node_type,
    submissionKind: row.submission_kind,
    title: row.title,
    status: row.status,
    adminNote: row.admin_note,
    createdAt: row.created_at,
  }));
}

/** Resolves which editor a given listing needs by its own real node_type
 * (not by inferring from the partner's account kind(s), which is no
 * longer 1:1 once a partner holds multiple kinds) — also verifies
 * ownership, since this is the first read on the edit page. */
export async function getListingNodeTypeForEdit(nodeId: string): Promise<ListingNodeType | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: node } = await supabase.from("nodes").select("node_type, created_by").eq("id", nodeId).maybeSingle<{ node_type: string; created_by: string | null }>();
  if (!node || node.created_by !== user.id) return null;
  if (!["accommodation", "activity", "package", "transfer_route"].includes(node.node_type)) return null;
  return node.node_type as ListingNodeType;
}

async function getPrimaryLocationId(nodeId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("node_locations")
    .select("location_id")
    .eq("node_id", nodeId)
    .eq("relation", "primary")
    .maybeSingle<{ location_id: string }>();
  return data?.location_id ?? null;
}

/** Loads the current live field values for one of the partner's own
 * listings, to prefill an edit form. Ownership (created_by = caller) is
 * checked explicitly here — not left to RLS alone — since a published
 * node's fields are otherwise publicly readable and this function must
 * never hand back another partner's listing for editing. */
export async function getAccommodationForEdit(nodeId: string): Promise<AccommodationListingPayload | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: node } = await supabase.from("nodes").select("title, summary, created_by").eq("id", nodeId).maybeSingle<{
    title: string;
    summary: string | null;
    created_by: string | null;
  }>();
  if (!node || node.created_by !== user.id) return null;

  const { data: accommodation } = await supabase
    .from("accommodations")
    .select("accommodation_type, star_rating, price_tier, room_count, all_inclusive, overwater_villas, check_in_time, check_out_time, currency, price_from")
    .eq("id", nodeId)
    .maybeSingle<{
      accommodation_type: AccommodationListingPayload["accommodationType"];
      star_rating: number | null;
      price_tier: AccommodationListingPayload["priceTier"];
      room_count: number | null;
      all_inclusive: boolean;
      overwater_villas: boolean;
      check_in_time: string | null;
      check_out_time: string | null;
      currency: string;
      price_from: number | null;
    }>();
  if (!accommodation) return null;

  const [{ data: rooms }, { data: bookable }] = await Promise.all([
    supabase
      .from("accommodation_rooms")
      .select("name, price_from, price_currency, bed_type, max_occupancy")
      .eq("accommodation_id", nodeId)
      .order("sort_order", { ascending: true })
      .returns<{ name: string; price_from: number | null; price_currency: string; bed_type: string | null; max_occupancy: number | null }[]>(),
    supabase.from("bookable_products").select("commission_percent").eq("id", nodeId).maybeSingle<{ commission_percent: number }>(),
  ]);

  return {
    title: node.title,
    summary: node.summary,
    accommodationType: accommodation.accommodation_type,
    starRating: accommodation.star_rating,
    priceTier: accommodation.price_tier,
    roomCount: accommodation.room_count,
    allInclusive: accommodation.all_inclusive,
    overwaterVillas: accommodation.overwater_villas,
    checkInTime: accommodation.check_in_time,
    checkOutTime: accommodation.check_out_time,
    currency: accommodation.currency,
    priceFrom: accommodation.price_from,
    locationId: await getPrimaryLocationId(nodeId),
    rooms: (rooms ?? []).map((r) => ({
      name: r.name,
      priceFrom: r.price_from,
      priceCurrency: r.price_currency,
      bedType: r.bed_type,
      maxOccupancy: r.max_occupancy,
    })),
    commissionPercent: bookable?.commission_percent ?? 15,
  };
}

export async function getActivityForEdit(nodeId: string): Promise<ActivityListingPayload | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: node } = await supabase.from("nodes").select("title, summary, created_by").eq("id", nodeId).maybeSingle<{
    title: string;
    summary: string | null;
    created_by: string | null;
  }>();
  if (!node || node.created_by !== user.id) return null;

  const [{ data: activity }, { data: bookable }] = await Promise.all([
    supabase
      .from("activities")
      .select("activity_category, duration_minutes, min_age, difficulty, price_from, currency, max_participants")
      .eq("id", nodeId)
      .maybeSingle<{
        activity_category: ActivityListingPayload["activityCategory"];
        duration_minutes: number | null;
        min_age: number | null;
        difficulty: ActivityListingPayload["difficulty"];
        price_from: number | null;
        currency: string;
        max_participants: number | null;
      }>(),
    supabase.from("bookable_products").select("commission_percent").eq("id", nodeId).maybeSingle<{ commission_percent: number }>(),
  ]);
  if (!activity) return null;

  return {
    title: node.title,
    summary: node.summary,
    activityCategory: activity.activity_category,
    durationMinutes: activity.duration_minutes,
    minAge: activity.min_age,
    difficulty: activity.difficulty,
    priceFrom: activity.price_from,
    currency: activity.currency,
    maxParticipants: activity.max_participants,
    locationId: await getPrimaryLocationId(nodeId),
    commissionPercent: bookable?.commission_percent ?? 15,
  };
}

export async function getPackageForEdit(nodeId: string): Promise<PackageListingPayload | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: node } = await supabase.from("nodes").select("title, summary, created_by").eq("id", nodeId).maybeSingle<{
    title: string;
    summary: string | null;
    created_by: string | null;
  }>();
  if (!node || node.created_by !== user.id) return null;

  const [{ data: pkg }, { data: bookable }] = await Promise.all([
    supabase
      .from("packages")
      .select("duration_nights, price_from, currency")
      .eq("id", nodeId)
      .maybeSingle<{ duration_nights: number | null; price_from: number | null; currency: string | null }>(),
    supabase.from("bookable_products").select("commission_percent").eq("id", nodeId).maybeSingle<{ commission_percent: number }>(),
  ]);
  if (!pkg) return null;

  return {
    title: node.title,
    summary: node.summary,
    durationNights: pkg.duration_nights,
    priceFrom: pkg.price_from,
    currency: pkg.currency ?? "USD",
    commissionPercent: bookable?.commission_percent ?? 15,
  };
}

export async function getTransferRouteForEdit(nodeId: string): Promise<TransferRouteListingPayload | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: node } = await supabase.from("nodes").select("title, summary, created_by").eq("id", nodeId).maybeSingle<{
    title: string;
    summary: string | null;
    created_by: string | null;
  }>();
  if (!node || node.created_by !== user.id) return null;

  const { data: route } = await supabase
    .from("transfer_routes")
    .select("origin_location_id, destination_location_id, distance_km, typical_duration_minutes")
    .eq("id", nodeId)
    .maybeSingle<{ origin_location_id: string; destination_location_id: string; distance_km: number | null; typical_duration_minutes: number | null }>();
  if (!route) return null;

  const { data: service } = await supabase
    .from("transfer_services")
    .select(
      "id, transfer_type, vehicle_type, shared_or_private, duration_minutes, price, currency, capacity, luggage_allowance, status, pickup_instructions, dropoff_instructions, booking_requirements, cancellation_policy, description, commission_percent",
    )
    .eq("route_id", nodeId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle<{
      id: string;
      transfer_type: TransferRouteListingPayload["service"]["transferType"];
      vehicle_type: string | null;
      shared_or_private: TransferRouteListingPayload["service"]["sharedOrPrivate"];
      duration_minutes: number | null;
      price: number;
      currency: string;
      capacity: number | null;
      luggage_allowance: string | null;
      status: TransferRouteListingPayload["service"]["status"];
      pickup_instructions: string | null;
      dropoff_instructions: string | null;
      booking_requirements: string | null;
      cancellation_policy: string | null;
      description: string | null;
      commission_percent: number;
    }>();

  return {
    title: node.title,
    summary: node.summary,
    originLocationId: route.origin_location_id,
    destinationLocationId: route.destination_location_id,
    distanceKm: route.distance_km,
    typicalDurationMinutes: route.typical_duration_minutes,
    service: service
      ? {
          id: service.id,
          transferType: service.transfer_type,
          vehicleType: service.vehicle_type,
          sharedOrPrivate: service.shared_or_private,
          durationMinutes: service.duration_minutes,
          price: service.price,
          currency: service.currency,
          capacity: service.capacity,
          luggageAllowance: service.luggage_allowance,
          status: service.status,
          pickupInstructions: service.pickup_instructions,
          dropoffInstructions: service.dropoff_instructions,
          bookingRequirements: service.booking_requirements,
          cancellationPolicy: service.cancellation_policy,
          description: service.description,
          commissionPercent: service.commission_percent,
        }
      : {
          id: null,
          transferType: "speedboat",
          vehicleType: null,
          sharedOrPrivate: "shared",
          durationMinutes: null,
          price: 0,
          currency: "USD",
          capacity: null,
          luggageAllowance: null,
          status: "active",
          pickupInstructions: null,
          dropoffInstructions: null,
          bookingRequirements: null,
          cancellationPolicy: null,
          description: null,
          commissionPercent: 15,
        },
  };
}
