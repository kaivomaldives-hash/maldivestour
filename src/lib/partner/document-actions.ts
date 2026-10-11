"use server";

import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/partner/actions";
import type { PartnerDocumentType } from "@/lib/partner/types";

const DOCUMENT_TYPES: readonly PartnerDocumentType[] = ["business_license", "owner_id", "bank_proof", "property_proof"];
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB — leaves headroom under the 10mb server action body limit (next.config.ts).

/** Uploads one verification document to the private `partner-documents`
 * Storage bucket and records it in `partner_documents`. Takes FormData
 * (not a typed object) because it's handling a real file, same reason
 * every other file-accepting path in this codebase does. Storage path is
 * always `<partner_id>/<document_type>/<timestamp>-<filename>` — the
 * `<partner_id>` prefix is what the `partner_documents_bucket_self_*`
 * Storage RLS policies check via storage.foldername(name)[1]. */
export async function uploadPartnerDocument(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const documentType = String(formData.get("documentType") ?? "");
  if (!DOCUMENT_TYPES.includes(documentType as PartnerDocumentType)) {
    return { ok: false, error: "Invalid document type." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Please choose a file." };
  }
  if (file.size > MAX_FILE_BYTES) {
    return { ok: false, error: "File is too large (8MB maximum)." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9_.-]/g, "_");
  const storagePath = `${user.id}/${documentType}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("partner-documents")
    .upload(storagePath, file, { contentType: file.type || undefined });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { error: insertError } = await supabase.from("partner_documents").insert({
    partner_id: user.id,
    document_type: documentType,
    storage_path: storagePath,
    file_name: file.name,
  } as unknown as never);

  if (insertError) {
    // Best-effort cleanup — leaving an orphaned Storage object behind is
    // harmless (it's invisible without a matching partner_documents row
    // driving the UI to it), but worth not leaving around if the delete
    // is cheap and available.
    await supabase.storage.from("partner-documents").remove([storagePath]);
    return { ok: false, error: insertError.message };
  }

  return { ok: true };
}

/** Deletes a pending (not yet reviewed) document — RLS's `partner_
 * documents_self_delete` policy enforces the "only while pending" rule
 * independently of this check. */
export async function deletePartnerDocument(documentId: string, storagePath: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("partner_documents").delete().eq("id", documentId).eq("partner_id", user.id);
  if (error) return { ok: false, error: error.message };

  await supabase.storage.from("partner-documents").remove([storagePath]);
  return { ok: true };
}
