"use server";

import { revalidatePath } from "next/cache";

import { createAccommodation, updateAccommodation } from "@/lib/admin/accommodations-actions";
import { createActivity, updateActivity } from "@/lib/admin/activities-actions";
import { getActivityByIdAdmin } from "@/lib/admin/activities-repository";
import { requireStaff } from "@/lib/admin/auth";
import { getListingSubmissionByIdAdmin } from "@/lib/admin/listing-submissions-repository";
import type { AdminActionResult, NodeCoreInput } from "@/lib/admin/node-actions";
import { setPrimaryLocation } from "@/lib/admin/node-relations-actions";
import { createPackage, updatePackage } from "@/lib/admin/packages-actions";
import { createTransferRoute, createTransferService, updateTransferRoute, updateTransferService } from "@/lib/admin/transfers-actions";
import type {
  AccommodationListingPayload,
  ActivityListingPayload,
  PackageListingPayload,
  TransferRouteListingPayload,
} from "@/lib/partner/listings/types";
import { createClient } from "@/lib/supabase/server";

/**
 * The ONLY place a partner-authored listing_submissions payload ever
 * becomes a real accommodations/activities/packages/transfer_routes row.
 * Every branch below reuses the exact same createX/updateX functions the
 * staff admin editors call directly (src/lib/admin/*-actions.ts) — this
 * file adds no new write path to those tables, it just supplies a staff-
 * approved payload to the existing one. See the migration's own header
 * comment (20261011000200_partner_listings_and_bookings.sql) for why.
 */

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  return `${base || "listing"}-${Math.random().toString(36).slice(2, 8)}`;
}

async function getCurrentNodeCore(nodeId: string): Promise<{ slug: string; status: "draft" | "published" | "archived"; metaTitle: string | null; metaDescription: string | null } | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("nodes").select("slug, status, meta_title, meta_description").eq("id", nodeId).maybeSingle<{
    slug: string;
    status: "draft" | "published" | "archived";
    meta_title: string | null;
    meta_description: string | null;
  }>();
  if (!data) return null;
  return { slug: data.slug, status: data.status, metaTitle: data.meta_title, metaDescription: data.meta_description };
}

/** Staff-only direct update — createNode()/updateNodeCore() don't set
 * created_by at all (confirmed: every existing admin editor leaves it
 * null), so a newly-approved listing needs this one extra step to be
 * attributed to the partner who authored it. This is what lets "My
 * Listings" (nodes.created_by = auth.uid()) find it afterward. */
async function setNodeCreatedBy(nodeId: string, partnerId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("nodes").update({ created_by: partnerId } as unknown as never).eq("id", nodeId);
}

export async function approveListingSubmission(submissionId: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  const submission = await getListingSubmissionByIdAdmin(submissionId);
  if (!submission) return { ok: false, error: "Submission not found." };
  if (submission.status !== "pending") return { ok: false, error: "This submission has already been reviewed." };
  if (!submission.providerId) return { ok: false, error: "This partner has no linked provider — approve their profile first." };

  const supabase = await createClient();
  let resultNodeId: string | null = submission.nodeId;

  if (submission.nodeType === "accommodation") {
    const payload = submission.payload as AccommodationListingPayload;
    const fields = {
      accommodationType: payload.accommodationType,
      starRating: payload.starRating,
      priceTier: payload.priceTier,
      roomCount: payload.roomCount,
      allInclusive: payload.allInclusive,
      overwaterVillas: payload.overwaterVillas,
      checkInTime: payload.checkInTime,
      checkOutTime: payload.checkOutTime,
      currency: payload.currency,
      operatedByProviderId: submission.providerId,
      priceFrom: payload.priceFrom,
      videoYoutubeId: null,
    };

    if (submission.submissionKind === "create") {
      const slug = slugify(payload.title);
      const core: NodeCoreInput = { title: payload.title, slug, summary: payload.summary, status: "published", metaTitle: null, metaDescription: null };
      const created = await createAccommodation(core, fields);
      if (!created.ok || !created.id) return { ok: false, error: created.error ?? "Failed to create listing." };
      resultNodeId = created.id;
      await setNodeCreatedBy(resultNodeId, submission.partnerId);
    } else {
      if (!resultNodeId) return { ok: false, error: "Missing listing to update." };
      const existing = await getCurrentNodeCore(resultNodeId);
      if (!existing) return { ok: false, error: "The live listing no longer exists." };
      const core: NodeCoreInput = { title: payload.title, slug: existing.slug, summary: payload.summary, status: existing.status, metaTitle: existing.metaTitle, metaDescription: existing.metaDescription };
      const updated = await updateAccommodation(resultNodeId, core, fields);
      if (!updated.ok) return { ok: false, error: updated.error };
    }

    await setPrimaryLocation(resultNodeId, payload.locationId, `/maldives/resorts/`);
    await supabase.from("accommodation_rooms").delete().eq("accommodation_id", resultNodeId);
    if (payload.rooms.length > 0) {
      await supabase.from("accommodation_rooms").insert(
        payload.rooms.map((r, i) => ({
          accommodation_id: resultNodeId,
          name: r.name,
          price_from: r.priceFrom,
          price_currency: r.priceCurrency,
          bed_type: r.bedType,
          max_occupancy: r.maxOccupancy,
          sort_order: i,
        })) as unknown as never,
      );
    }
  } else if (submission.nodeType === "activity") {
    const payload = submission.payload as ActivityListingPayload;
    const baseFields = {
      activityCategory: payload.activityCategory,
      operatedByProviderId: submission.providerId,
      durationMinutes: payload.durationMinutes,
      minAge: payload.minAge,
      difficulty: payload.difficulty,
      priceFrom: payload.priceFrom,
      currency: payload.currency,
      maxParticipants: payload.maxParticipants,
    };

    if (submission.submissionKind === "create") {
      const slug = slugify(payload.title);
      const core: NodeCoreInput = { title: payload.title, slug, summary: payload.summary, status: "published", metaTitle: null, metaDescription: null };
      const created = await createActivity(core, { ...baseFields, videoYoutubeId: null, description: null, itinerary: [], rates: [] });
      if (!created.ok || !created.id) return { ok: false, error: created.error ?? "Failed to create listing." };
      resultNodeId = created.id;
      await setNodeCreatedBy(resultNodeId, submission.partnerId);
    } else {
      if (!resultNodeId) return { ok: false, error: "Missing listing to update." };
      const existing = await getCurrentNodeCore(resultNodeId);
      if (!existing) return { ok: false, error: "The live listing no longer exists." };
      // The partner's listing payload has no way to carry video/
      // description/itinerary/rates (staff-only fields, set from the
      // admin editor) -- preserve whatever is already there rather than
      // wiping it out just because this edit got approved.
      const currentFields = (await getActivityByIdAdmin(resultNodeId))?.fields;
      const core: NodeCoreInput = { title: payload.title, slug: existing.slug, summary: payload.summary, status: existing.status, metaTitle: existing.metaTitle, metaDescription: existing.metaDescription };
      const updated = await updateActivity(resultNodeId, core, {
        ...baseFields,
        videoYoutubeId: currentFields?.videoYoutubeId ?? null,
        description: currentFields?.description ?? null,
        itinerary: currentFields?.itinerary ?? [],
        rates: currentFields?.rates ?? [],
      });
      if (!updated.ok) return { ok: false, error: updated.error };
    }

    await setPrimaryLocation(resultNodeId, payload.locationId, `/maldives/activities/`);
  } else if (submission.nodeType === "package") {
    const payload = submission.payload as PackageListingPayload;
    const fields = { durationNights: payload.durationNights, priceFrom: payload.priceFrom, currency: payload.currency, operatedByProviderId: submission.providerId, videoYoutubeId: null };

    if (submission.submissionKind === "create") {
      const slug = slugify(payload.title);
      const core: NodeCoreInput = { title: payload.title, slug, summary: payload.summary, status: "published", metaTitle: null, metaDescription: null };
      const created = await createPackage(core, fields);
      if (!created.ok || !created.id) return { ok: false, error: created.error ?? "Failed to create listing." };
      resultNodeId = created.id;
      await setNodeCreatedBy(resultNodeId, submission.partnerId);
    } else {
      if (!resultNodeId) return { ok: false, error: "Missing listing to update." };
      const existing = await getCurrentNodeCore(resultNodeId);
      if (!existing) return { ok: false, error: "The live listing no longer exists." };
      const core: NodeCoreInput = { title: payload.title, slug: existing.slug, summary: payload.summary, status: existing.status, metaTitle: existing.metaTitle, metaDescription: existing.metaDescription };
      const updated = await updatePackage(resultNodeId, core, fields);
      if (!updated.ok) return { ok: false, error: updated.error };
    }
  } else {
    const payload = submission.payload as TransferRouteListingPayload;
    const routeFields = {
      originLocationId: payload.originLocationId,
      destinationLocationId: payload.destinationLocationId,
      distanceKm: payload.distanceKm,
      typicalDurationMinutes: payload.typicalDurationMinutes,
      videoYoutubeId: null,
    };

    if (submission.submissionKind === "create") {
      const slug = slugify(payload.title);
      const core: NodeCoreInput = { title: payload.title, slug, summary: payload.summary, status: "published", metaTitle: null, metaDescription: null };
      const created = await createTransferRoute(core, routeFields);
      if (!created.ok || !created.id) return { ok: false, error: created.error ?? "Failed to create route." };
      resultNodeId = created.id;
      await setNodeCreatedBy(resultNodeId, submission.partnerId);
    } else {
      if (!resultNodeId) return { ok: false, error: "Missing listing to update." };
      const existing = await getCurrentNodeCore(resultNodeId);
      if (!existing) return { ok: false, error: "The live listing no longer exists." };
      const core: NodeCoreInput = { title: payload.title, slug: existing.slug, summary: payload.summary, status: existing.status, metaTitle: existing.metaTitle, metaDescription: existing.metaDescription };
      const updated = await updateTransferRoute(resultNodeId, core, routeFields);
      if (!updated.ok) return { ok: false, error: updated.error };
    }

    const serviceInput = {
      providerId: submission.providerId,
      transferType: payload.service.transferType,
      vehicleType: payload.service.vehicleType,
      sharedOrPrivate: payload.service.sharedOrPrivate,
      durationMinutes: payload.service.durationMinutes,
      price: payload.service.price,
      currency: payload.service.currency,
      capacity: payload.service.capacity,
      luggageAllowance: payload.service.luggageAllowance,
      status: payload.service.status,
      pickupInstructions: payload.service.pickupInstructions,
      dropoffInstructions: payload.service.dropoffInstructions,
      bookingRequirements: payload.service.bookingRequirements,
      cancellationPolicy: payload.service.cancellationPolicy,
      description: payload.service.description,
      isBookable: true,
      facilities: [] as string[],
    };

    if (payload.service.id) {
      const serviceResult = await updateTransferService(payload.service.id, resultNodeId, serviceInput);
      if (!serviceResult.ok) return { ok: false, error: serviceResult.error };
    } else {
      const serviceResult = await createTransferService(resultNodeId, serviceInput);
      if (!serviceResult.ok) return { ok: false, error: serviceResult.error };
    }
  }

  if (!resultNodeId) return { ok: false, error: "Something went wrong — no listing id was produced." };

  const { error: closeError } = await supabase
    .from("listing_submissions")
    .update({ status: "approved", node_id: resultNodeId, reviewed_by: userId, reviewed_at: new Date().toISOString() } as unknown as never)
    .eq("id", submissionId);
  if (closeError) return { ok: false, error: closeError.message };

  revalidatePath("/admin/partner-listings");
  revalidatePath(`/admin/partner-listings/${submissionId}`);
  return { ok: true };
}

export async function rejectListingSubmission(submissionId: string, reason: string): Promise<AdminActionResult> {
  const { userId } = await requireStaff();
  if (!reason.trim()) return { ok: false, error: "A reason is required so the partner knows what to fix." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("listing_submissions")
    .update({ status: "rejected", admin_note: reason.trim(), reviewed_by: userId, reviewed_at: new Date().toISOString() } as unknown as never)
    .eq("id", submissionId)
    .eq("status", "pending");
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/partner-listings");
  revalidatePath(`/admin/partner-listings/${submissionId}`);
  return { ok: true };
}
