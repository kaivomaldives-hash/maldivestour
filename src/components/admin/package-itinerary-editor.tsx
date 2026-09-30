"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { EntityPicker, TransferServicePicker } from "@/components/admin/entity-picker";
import { Button } from "@/components/ui/button";
import {
  createItineraryItem,
  createItineraryStage,
  deleteItineraryItem,
  deleteItineraryStage,
  updateItineraryItem,
  updateItineraryStage,
  type ItineraryItemInput,
  type ItineraryStageInput,
} from "@/lib/admin/packages-actions";
import type { AdminItineraryStage } from "@/lib/admin/packages-repository";
import type { ItineraryNodeOption, TransferServiceOption } from "@/lib/admin/packages-actions";
import type { PackageItineraryComponentRole } from "@/lib/packages/types";

const COMPONENT_ROLES: PackageItineraryComponentRole[] = ["accommodation", "activity", "transfer", "meal", "free_time", "excursion", "other"];

const EMPTY_STAGE: ItineraryStageInput = { stageNumber: 1, dayStart: 1, dayEnd: 1, nightCount: 0, title: null, description: null, sortOrder: 0 };
const EMPTY_ITEM: ItineraryItemInput = {
  componentType: "node",
  componentNodeId: null,
  transferServiceId: null,
  componentRole: "accommodation",
  quantity: 1,
  notes: null,
  sortOrder: 0,
};

/** A deliberately simplified itinerary editor — not a full drag-and-drop
 * day builder. Stages and items are each managed with the same inline
 * expand/collapse form pattern as TransferServicesManager; a package
 * typically has a handful of stages and a few items per stage, so a
 * lightweight list-plus-form UI is enough without the complexity of a
 * dedicated drag-reorder builder. */
export function PackageItineraryEditor({ packageId, stages }: { packageId: string; stages: AdminItineraryStage[] }) {
  const router = useRouter();
  const [editingStageId, setEditingStageId] = useState<string | "new" | null>(null);
  const [stageInput, setStageInput] = useState<ItineraryStageInput>(EMPTY_STAGE);
  const [stageError, setStageError] = useState<string | null>(null);

  const [itemStageId, setItemStageId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | "new" | null>(null);
  const [itemInput, setItemInput] = useState<ItineraryItemInput>(EMPTY_ITEM);
  const [itemNodeOption, setItemNodeOption] = useState<ItineraryNodeOption | null>(null);
  const [itemServiceOption, setItemServiceOption] = useState<TransferServiceOption | null>(null);
  const [itemError, setItemError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  function openNewStage() {
    const nextNumber = stages.length > 0 ? Math.max(...stages.map((s) => s.stageNumber)) + 1 : 1;
    setEditingStageId("new");
    setStageInput({ ...EMPTY_STAGE, stageNumber: nextNumber, sortOrder: nextNumber });
    setStageError(null);
  }

  function openEditStage(stage: AdminItineraryStage) {
    setEditingStageId(stage.id);
    setStageInput({
      stageNumber: stage.stageNumber,
      dayStart: stage.dayStart,
      dayEnd: stage.dayEnd,
      nightCount: stage.nightCount,
      title: stage.title,
      description: stage.description,
      sortOrder: stage.sortOrder,
    });
    setStageError(null);
  }

  function saveStage() {
    setStageError(null);
    startTransition(async () => {
      const result =
        editingStageId && editingStageId !== "new" ? await updateItineraryStage(editingStageId, packageId, stageInput) : await createItineraryStage(packageId, stageInput);
      if (!result.ok) {
        setStageError(result.error ?? "Something went wrong.");
        return;
      }
      setEditingStageId(null);
      router.refresh();
    });
  }

  function removeStage(stageId: string) {
    startTransition(async () => {
      const result = await deleteItineraryStage(stageId, packageId);
      if (result.ok) router.refresh();
    });
  }

  function openNewItem(stageId: string) {
    setItemStageId(stageId);
    setEditingItemId("new");
    setItemInput(EMPTY_ITEM);
    setItemNodeOption(null);
    setItemServiceOption(null);
    setItemError(null);
  }

  function openEditItem(stageId: string, item: AdminItineraryStage["items"][number]) {
    setItemStageId(stageId);
    setEditingItemId(item.id);
    setItemInput({
      componentType: item.componentType,
      componentNodeId: item.componentNodeId,
      transferServiceId: item.transferServiceId,
      componentRole: item.componentRole,
      quantity: item.quantity,
      notes: item.notes,
      sortOrder: item.sortOrder,
    });
    setItemNodeOption(item.componentNodeId && item.componentNodeLabel ? { id: item.componentNodeId, title: item.componentNodeLabel, nodeType: "" } : null);
    setItemServiceOption(item.transferServiceId && item.transferServiceLabel ? { id: item.transferServiceId, label: item.transferServiceLabel } : null);
    setItemError(null);
  }

  function closeItemForm() {
    setItemStageId(null);
    setEditingItemId(null);
    setItemError(null);
  }

  function saveItem() {
    setItemError(null);
    if (!itemStageId) return;
    const payload: ItineraryItemInput = {
      ...itemInput,
      componentNodeId: itemInput.componentType === "node" ? itemNodeOption?.id ?? null : null,
      transferServiceId: itemInput.componentType === "transfer_service" ? itemServiceOption?.id ?? null : null,
    };
    startTransition(async () => {
      const result =
        editingItemId && editingItemId !== "new"
          ? await updateItineraryItem(editingItemId, packageId, payload)
          : await createItineraryItem(itemStageId, packageId, payload);
      if (!result.ok) {
        setItemError(result.error ?? "Something went wrong.");
        return;
      }
      closeItemForm();
      router.refresh();
    });
  }

  function removeItem(itemId: string) {
    startTransition(async () => {
      const result = await deleteItineraryItem(itemId, packageId);
      if (result.ok) router.refresh();
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Itinerary ({stages.length} stages)</h2>
        {editingStageId === null && (
          <Button type="button" size="sm" onClick={openNewStage}>
            Add stage
          </Button>
        )}
      </div>

      {stages.length === 0 && editingStageId === null && <p className="text-sm text-neutral-500">No itinerary stages yet.</p>}

      <div className="space-y-4">
        {stages.map((stage) => (
          <div key={stage.id} className="rounded-xl border border-neutral-200 p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Stage {stage.stageNumber} · Days {stage.dayStart}–{stage.dayEnd} ({stage.nightCount} night{stage.nightCount === 1 ? "" : "s"})
                </p>
                {stage.title && <p className="text-sm text-neutral-600">{stage.title}</p>}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => openEditStage(stage)} className="text-xs font-medium text-maldives-600 hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => removeStage(stage.id)} disabled={isPending} className="text-xs font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>

            {editingStageId === stage.id && (
              <StageFormFields input={stageInput} setInput={setStageInput} error={stageError} isPending={isPending} onSave={saveStage} onCancel={() => setEditingStageId(null)} />
            )}

            <div className="mt-3 space-y-2">
              {stage.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2 text-sm">
                  <div>
                    <span className="font-medium text-neutral-700 capitalize">{item.componentRole.replace("_", " ")}</span>{" "}
                    <span className="text-neutral-600">{item.componentType === "node" ? item.componentNodeLabel ?? "—" : item.transferServiceLabel ?? "—"}</span>
                    {item.notes && <p className="text-xs text-neutral-500">{item.notes}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" onClick={() => openEditItem(stage.id, item)} className="text-xs font-medium text-maldives-600 hover:underline">
                      Edit
                    </button>
                    <button type="button" onClick={() => removeItem(item.id)} disabled={isPending} className="text-xs font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {editingItemId === null && itemStageId !== stage.id && (
                <button type="button" onClick={() => openNewItem(stage.id)} className="text-xs font-medium text-maldives-600 hover:underline">
                  + Add item
                </button>
              )}
            </div>

            {itemStageId === stage.id && editingItemId !== null && (
              <div className="mt-3 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-neutral-700">References</span>
                    <select
                      value={itemInput.componentType}
                      onChange={(e) => setItemInput((f) => ({ ...f, componentType: e.target.value as "node" | "transfer_service" }))}
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                    >
                      <option value="node">An entity (accommodation/activity/package/etc.)</option>
                      <option value="transfer_service">A transfer service</option>
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-neutral-700">Role</span>
                    <select
                      value={itemInput.componentRole}
                      onChange={(e) => setItemInput((f) => ({ ...f, componentRole: e.target.value as PackageItineraryComponentRole }))}
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                    >
                      {COMPONENT_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {itemInput.componentType === "node" ? (
                  <EntityPicker value={itemNodeOption} onChange={setItemNodeOption} />
                ) : (
                  <TransferServicePicker value={itemServiceOption} onChange={setItemServiceOption} />
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-neutral-700">Quantity</span>
                    <input
                      type="number"
                      min={1}
                      value={itemInput.quantity}
                      onChange={(e) => setItemInput((f) => ({ ...f, quantity: Number(e.target.value) || 1 }))}
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block font-medium text-neutral-700">Notes</span>
                    <input
                      value={itemInput.notes ?? ""}
                      onChange={(e) => setItemInput((f) => ({ ...f, notes: e.target.value || null }))}
                      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
                    />
                  </label>
                </div>

                {itemError && (
                  <p role="alert" className="text-sm text-red-600">
                    {itemError}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <Button type="button" size="sm" onClick={saveItem} disabled={isPending}>
                    {isPending ? "Saving…" : editingItemId === "new" ? "Add item" : "Save item"}
                  </Button>
                  <button type="button" onClick={closeItemForm} className="text-sm text-neutral-600 hover:underline">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {editingStageId === "new" && (
        <div className="rounded-xl border border-neutral-200 p-3">
          <p className="mb-2 text-sm font-semibold text-neutral-700">New stage</p>
          <StageFormFields input={stageInput} setInput={setStageInput} error={stageError} isPending={isPending} onSave={saveStage} onCancel={() => setEditingStageId(null)} />
        </div>
      )}
    </section>
  );
}

function StageFormFields({
  input,
  setInput,
  error,
  isPending,
  onSave,
  onCancel,
}: {
  input: ItineraryStageInput;
  setInput: (updater: (f: ItineraryStageInput) => ItineraryStageInput) => void;
  error: string | null;
  isPending: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-3 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Stage #</span>
          <input
            type="number"
            min={1}
            value={input.stageNumber}
            onChange={(e) => setInput((f) => ({ ...f, stageNumber: Number(e.target.value) || 1 }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Day start</span>
          <input
            type="number"
            min={1}
            value={input.dayStart}
            onChange={(e) => setInput((f) => ({ ...f, dayStart: Number(e.target.value) || 1 }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Day end</span>
          <input
            type="number"
            min={1}
            value={input.dayEnd}
            onChange={(e) => setInput((f) => ({ ...f, dayEnd: Number(e.target.value) || 1 }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Nights</span>
          <input
            type="number"
            min={0}
            value={input.nightCount}
            onChange={(e) => setInput((f) => ({ ...f, nightCount: Number(e.target.value) || 0 }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Title</span>
        <input
          value={input.title ?? ""}
          onChange={(e) => setInput((f) => ({ ...f, title: e.target.value || null }))}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Description</span>
        <textarea
          value={input.description ?? ""}
          onChange={(e) => setInput((f) => ({ ...f, description: e.target.value || null }))}
          rows={2}
          className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
        />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="button" size="sm" onClick={onSave} disabled={isPending}>
          {isPending ? "Saving…" : "Save stage"}
        </Button>
        <button type="button" onClick={onCancel} className="text-sm text-neutral-600 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
}
