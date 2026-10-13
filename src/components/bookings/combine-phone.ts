import { DEFAULT_DIAL_CODE } from "@/lib/bookings/countries";

/** Combines a PhoneField's two FormData entries into one country-code-
 * prefixed string, or "" if no number was entered (so an optional phone
 * field stays genuinely optional rather than becoming "+960" alone). */
export function combinePhone(data: FormData, name: string): string {
  const code = String(data.get(`${name}Code`) ?? DEFAULT_DIAL_CODE);
  const number = String(data.get(`${name}Number`) ?? "").trim().replace(/[^\d]/g, "");
  return number ? `${code}${number}` : "";
}
