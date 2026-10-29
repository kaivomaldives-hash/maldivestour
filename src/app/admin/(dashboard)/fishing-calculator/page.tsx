import Link from "next/link";

import { FishingCalculatorForm } from "@/components/admin/fishing-calculator-form";
import { getFishingCalculatorSettingsAdmin } from "@/lib/admin/fishing-calculator-repository";

export default async function AdminFishingCalculatorPage() {
  const settings = await getFishingCalculatorSettingsAdmin();

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-semibold text-ocean-900">Fishing Package Calculator</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Rates and fishing packages used by the public calculator on{" "}
        <Link href="/maldives/fishing/calculator/" className="text-maldives-600 hover:underline" target="_blank">
          /maldives/fishing/calculator/
        </Link>{" "}
        and the fishing page. Changes apply to the public calculator as soon as you save.
      </p>

      {settings.source === "missing-table" && (
        <p role="alert" className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          The settings table doesn&rsquo;t exist yet. Run <code>supabase/manual/2026-10-29_fishing_calculator_settings.sql</code> in the Supabase SQL
          editor, then reload this page. Until then the site uses the built-in rates shown below.
        </p>
      )}
      {settings.source === "defaults" && !settings.error && (
        <p className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          Nothing saved yet — showing the built-in rates the site uses now. Save once to start managing them here.
        </p>
      )}
      {settings.error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {settings.error}
        </p>
      )}
      {settings.updatedAt && <p className="mt-2 text-xs text-neutral-500">Last saved {new Date(settings.updatedAt).toLocaleString("en-GB")}</p>}

      <div className="mt-6">
        <FishingCalculatorForm initialConfig={settings.config} />
      </div>
    </div>
  );
}
