"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { BOOKING_STATUSES } from "@/lib/admin/booking-status";
import {
  updateBookingNotes,
  updateBookingStatus,
  type AdminActionResult,
  type TransferBoatDetailsInput,
} from "@/lib/admin/bookings-actions";

const INPUT_CLASS =
  "w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-maldives-500 focus-visible:ring-offset-1";

function defaultPaymentNote(quotedPrice: number | null, currency: string): string {
  if (quotedPrice == null) {
    return "Payable in cash or by Crypto USDT on arrival. We do not accept card payments on the boat.";
  }
  return `Your total for this transfer is ${currency} ${quotedPrice}, payable in cash or by Crypto USDT on arrival. We do not accept card payments on the boat.`;
}

export interface BookingStatusFormProps {
  bookingId: string;
  currentStatus: string;
  currentNotes: string;
  source: string | null;
  hasReturnLeg: boolean;
  quotedPrice: number | null;
  currency: string;
  paymentNote: string | null;
  outboundBoat: TransferBoatDetailsInput;
  returnBoat: TransferBoatDetailsInput;
}

export function BookingStatusForm({
  bookingId,
  currentStatus,
  currentNotes,
  source,
  hasReturnLeg,
  quotedPrice,
  currency,
  paymentNote,
  outboundBoat,
  returnBoat,
}: BookingStatusFormProps) {
  const router = useRouter();
  const isTransfer = source === "transfer";

  const [status, setStatus] = useState(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [price, setPrice] = useState(quotedPrice != null ? String(quotedPrice) : "");
  const [curr, setCurr] = useState(currency);
  const [note, setNote] = useState(paymentNote ?? "");
  const [outbound, setOutbound] = useState<TransferBoatDetailsInput>(outboundBoat);
  const [ret, setRet] = useState<TransferBoatDetailsInput>(returnBoat);
  const [isPending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const parsedPrice = price.trim() === "" ? null : Number(price);
      const effectiveNote = note.trim() || (status === "confirmed" ? defaultPaymentNote(parsedPrice, curr) : note);

      const [statusResult, notesResult]: [AdminActionResult, AdminActionResult] = await Promise.all([
        updateBookingStatus(bookingId, {
          status,
          quotedPrice: parsedPrice,
          currency: curr,
          paymentNote: effectiveNote,
          outboundBoat: isTransfer ? outbound : undefined,
          returnBoat: isTransfer && hasReturnLeg ? ret : undefined,
        }),
        notes !== currentNotes ? updateBookingNotes(bookingId, notes) : Promise.resolve({ ok: true }),
      ]);
      if (!statusResult.ok || !notesResult.ok) {
        setError(statusResult.error ?? notesResult.error ?? "Something went wrong.");
        return;
      }
      setSavedAt(Date.now());
      router.refresh();
    });
  }

  const dirty =
    status !== currentStatus ||
    notes !== currentNotes ||
    price !== (quotedPrice != null ? String(quotedPrice) : "") ||
    curr !== currency ||
    note !== (paymentNote ?? "") ||
    JSON.stringify(outbound) !== JSON.stringify(outboundBoat) ||
    JSON.stringify(ret) !== JSON.stringify(returnBoat);

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={INPUT_CLASS}>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Quoted price</span>
          <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. a discounted rate" className={INPUT_CLASS} />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Currency</span>
          <input value={curr} onChange={(e) => setCurr(e.target.value.toUpperCase())} maxLength={3} className={INPUT_CLASS} />
        </label>
      </div>

      {isTransfer && (
        <>
          <BoatFields legend="Outbound boat / captain" value={outbound} onChange={setOutbound} />
          {hasReturnLeg && <BoatFields legend="Return boat / captain" value={ret} onChange={setRet} />}
        </>
      )}

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">
          Payment note {isTransfer && <span className="font-normal text-neutral-500">(shown to the customer on confirmation)</span>}
        </span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={defaultPaymentNote(price.trim() === "" ? null : Number(price), curr)}
          className={INPUT_CLASS}
        />
      </label>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-neutral-700">Internal notes (staff only — never shown to the customer)</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className={INPUT_CLASS} />
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={save} disabled={isPending || !dirty}>
          {isPending ? "Saving…" : "Save changes"}
        </Button>
        {!dirty && savedAt && <span className="text-sm text-neutral-500">Saved.</span>}
      </div>
    </div>
  );
}

function BoatFields({
  legend,
  value,
  onChange,
}: {
  legend: string;
  value: TransferBoatDetailsInput;
  onChange: (next: TransferBoatDetailsInput) => void;
}) {
  function set(field: keyof TransferBoatDetailsInput, v: string) {
    onChange({ ...value, [field]: v });
  }

  return (
    <fieldset className="space-y-2 rounded-xl border border-neutral-200 p-3">
      <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-neutral-500">{legend}</legend>
      <div className="grid grid-cols-2 gap-2">
        <input value={value.boatName ?? ""} onChange={(e) => set("boatName", e.target.value)} placeholder="Boat name" className={INPUT_CLASS} />
        <input value={value.boatSize ?? ""} onChange={(e) => set("boatSize", e.target.value)} placeholder="Boat size (e.g. 25 feet)" className={INPUT_CLASS} />
        <input
          value={value.boatContact ?? ""}
          onChange={(e) => set("boatContact", e.target.value)}
          placeholder="Boat contact number"
          className={`${INPUT_CLASS} col-span-2`}
        />
        <input value={value.captainName ?? ""} onChange={(e) => set("captainName", e.target.value)} placeholder="Captain name" className={INPUT_CLASS} />
        <input
          value={value.captainLicense ?? ""}
          onChange={(e) => set("captainLicense", e.target.value)}
          placeholder="License number"
          className={INPUT_CLASS}
        />
        <input
          value={value.registrationNumber ?? ""}
          onChange={(e) => set("registrationNumber", e.target.value)}
          placeholder="Registration number"
          className={`${INPUT_CLASS} col-span-2`}
        />
      </div>
    </fieldset>
  );
}
