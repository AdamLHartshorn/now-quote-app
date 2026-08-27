"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, ReactNode, useState } from "react";

import { type PricingConfig } from "@/config/rates";
import { usePricingSettings } from "@/lib/pricing-settings";

type RateInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
};

function RateInput({ label, value, onChange, prefix, suffix, step = "0.01" }: RateInputProps) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <div className="relative">
        {prefix && <span className="absolute left-4 top-[17px] text-sm font-bold text-slate-400">{prefix}</span>}
        <input
          type="number"
          min="0"
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={`control ${prefix ? "pl-8" : ""} ${suffix ? "pr-14" : ""}`}
        />
        {suffix && <span className="absolute right-4 top-[17px] text-xs font-bold text-slate-400">{suffix}</span>}
      </div>
    </label>
  );
}

function RateSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <details className="panel group" open={title === "Fuel surcharges"}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span>
          <span className="block text-sm font-extrabold text-[#102d3d]">{title}</span>
          {description && <span className="mt-1 block text-xs font-normal text-slate-500">{description}</span>}
        </span>
        <span className="text-xl text-[#008da3] transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-5 border-t border-slate-200 pt-5">{children}</div>
    </details>
  );
}

export default function AdminPage() {
  const pricing = usePricingSettings();

  if (pricing.loading) {
    return <main className="app-shell"><div className="page-frame"><p className="page-subtitle">Loading shared pricing…</p></div></main>;
  }

  return (
    <AdminPricingForm
      key={`${pricing.version}-${pricing.updatedAt}`}
      initialConfig={pricing.config}
      initialEffectiveDate={pricing.effectiveDate}
      initialVersion={pricing.version}
      source={pricing.source}
      loadError={pricing.error}
    />
  );
}

function AdminPricingForm({
  initialConfig,
  initialEffectiveDate,
  initialVersion,
  source,
  loadError,
}: {
  initialConfig: PricingConfig;
  initialEffectiveDate: string;
  initialVersion: number;
  source: "database" | "defaults";
  loadError: string;
}) {
  const [config, setConfig] = useState(() => structuredClone(initialConfig));
  const [effectiveDate, setEffectiveDate] = useState(initialEffectiveDate);
  const [version, setVersion] = useState(initialVersion);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(loadError);

  function update(path: string[], value: number) {
    setConfig((current) => {
      const next = structuredClone(current);
      let target = next as unknown as Record<string, unknown>;
      for (const key of path.slice(0, -1)) {
        target = target[key] as Record<string, unknown>;
      }
      target[path[path.length - 1]] = value;
      return next;
    });
    setMessage("");
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config, effectiveDate, version }),
    });
    const result = await response.json();
    setSaving(false);

    if (!response.ok) {
      setError(result.error ?? "Unable to save pricing");
      return;
    }

    setVersion(result.version);
    setMessage(`Shared pricing saved. Version ${result.version} is now live.`);
  }

  return (
    <main className="app-shell">
      <div className="page-frame">
        <header className="topbar">
          <Link href="/" className="back-link">← Quote menu</Link>
          <Image src="/now-logo.jpg" alt="NOW Courier" width={130} height={45} priority className="brand-logo" />
        </header>

        <div className="page-heading">
          <p className="eyebrow">Administration</p>
          <h1 className="page-title">Rate management</h1>
          <p className="page-subtitle">Control the shared baseline pricing used by every quote workflow.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
            <span className={`rounded-full px-3 py-1 ${source === "database" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {source === "database" ? "SHARED DATABASE" : "LOCAL DEFAULTS"}
            </span>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-600">VERSION {version}</span>
          </div>
        </div>

        <form onSubmit={save} className="form-stack">
          <section className="panel">
            <label className="block">
              <span className="field-label">Rates effective date</span>
              <input type="date" value={effectiveDate} onChange={(event) => setEffectiveDate(event.target.value)} className="control" />
            </label>
          </section>

          <RateSection title="Fuel surcharges" description="Weekly percentages by equipment class">
            <div className="grid gap-4 sm:grid-cols-3">
              {(["parcel", "commercial", "heavyCommercial"] as const).map((key) => (
                <RateInput
                  key={key}
                  label={key === "heavyCommercial" ? "Heavy commercial" : key[0].toUpperCase() + key.slice(1)}
                  value={Math.round(config.fuelSurcharge[key] * 1000) / 10}
                  suffix="%"
                  step="0.1"
                  onChange={(value) => update(["fuelSurcharge", key], value / 100)}
                />
              ))}
            </div>
          </RateSection>

          <RateSection title="Parcel service rates" description="Minimums and standard per-mile pricing">
            <div className="space-y-6">
              {Object.entries(config.parcelServiceRates).map(([service, rates]) => (
                <div key={service}>
                  <h3 className="mb-3 text-sm font-extrabold text-[#102d3d]">{service}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <RateInput label="Minimum" value={rates.minimum} prefix="$" onChange={(value) => update(["parcelServiceRates", service, "minimum"], value)} />
                    <RateInput label="Per mile" value={rates.ratePerMile} prefix="$" onChange={(value) => update(["parcelServiceRates", service, "ratePerMile"], value)} />
                  </div>
                </div>
              ))}
            </div>
          </RateSection>

          <RateSection title="Parcel vehicles" description="Upcharges, wait, weight, and long-distance rates">
            <div className="space-y-7">
              {Object.entries(config.parcelVehicleConfig).map(([vehicle, rates]) => (
                <div key={vehicle}>
                  <h3 className="mb-3 text-sm font-extrabold text-[#102d3d]">{vehicle}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <RateInput label="Vehicle upcharge" value={rates.upcharge} prefix="$" onChange={(value) => update(["parcelVehicleConfig", vehicle, "upcharge"], value)} />
                    <RateInput label="Over-threshold mile" value={rates.over50MileRate} prefix="$" onChange={(value) => update(["parcelVehicleConfig", vehicle, "over50MileRate"], value)} />
                    <RateInput label="Free wait" value={rates.freeWaitMinutes} suffix="MIN" step="1" onChange={(value) => update(["parcelVehicleConfig", vehicle, "freeWaitMinutes"], value)} />
                    <RateInput label="Wait per minute" value={rates.waitRatePerMinute} prefix="$" onChange={(value) => update(["parcelVehicleConfig", vehicle, "waitRatePerMinute"], value)} />
                    <RateInput label="Included weight" value={rates.includedWeight} suffix="LBS" step="1" onChange={(value) => update(["parcelVehicleConfig", vehicle, "includedWeight"], value)} />
                    <RateInput label="Overweight per CWT" value={rates.overweightRatePerCwt} prefix="$" onChange={(value) => update(["parcelVehicleConfig", vehicle, "overweightRatePerCwt"], value)} />
                  </div>
                </div>
              ))}
            </div>
          </RateSection>

          <RateSection title="Commercial equipment" description="Service, threshold, wait, weight, and accessorial pricing">
            <div className="space-y-8">
              {Object.entries(config.commercialEquipmentConfig).map(([equipment, rates]) => (
                <div key={equipment} className="border-b border-slate-200 pb-7 last:border-0 last:pb-0">
                  <h3 className="mb-4 text-base font-extrabold text-[#102d3d]">{equipment}</h3>
                  <div className="mb-5 space-y-4">
                    {Object.entries(rates.serviceRates).map(([service, serviceRates]) => (
                      <div key={service}>
                        <p className="mb-2 text-xs font-bold text-slate-500">{service}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <RateInput label="Base" value={serviceRates.base} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "serviceRates", service, "base"], value)} />
                          <RateInput label="Per mile" value={serviceRates.ratePerMile} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "serviceRates", service, "ratePerMile"], value)} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <RateInput label="Mileage threshold" value={rates.overMileageThreshold} suffix="MI" step="1" onChange={(value) => update(["commercialEquipmentConfig", equipment, "overMileageThreshold"], value)} />
                    {"overThresholdEntireTripRate" in rates ? (
                      <RateInput label="Full-trip threshold rate" value={rates.overThresholdEntireTripRate} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "overThresholdEntireTripRate"], value)} />
                    ) : (
                      <RateInput label="Additional excess-mile rate" value={rates.overThresholdAdditionalPerMile} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "overThresholdAdditionalPerMile"], value)} />
                    )}
                    <RateInput label="Free wait" value={rates.freeWaitMinutes} suffix="MIN" step="1" onChange={(value) => update(["commercialEquipmentConfig", equipment, "freeWaitMinutes"], value)} />
                    <RateInput label="Wait per minute" value={rates.waitRatePerMinute} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "waitRatePerMinute"], value)} />
                    <RateInput label="Included weight" value={rates.includedWeight} suffix="LBS" step="1" onChange={(value) => update(["commercialEquipmentConfig", equipment, "includedWeight"], value)} />
                    <RateInput label="Overweight per CWT" value={rates.overweightRatePerCwt} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "overweightRatePerCwt"], value)} />
                    <RateInput label="After hours" value={rates.afterHours} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "afterHours"], value)} />
                    <RateInput label="Sharp appointment" value={rates.sharp} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "sharp"], value)} />
                    <RateInput label="No load" value={rates.noLoad} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "noLoad"], value)} />
                    {"moffettCharge" in rates && <RateInput label="Moffett" value={rates.moffettCharge} prefix="$" onChange={(value) => update(["commercialEquipmentConfig", equipment, "moffettCharge"], value)} />}
                  </div>
                </div>
              ))}
            </div>
          </RateSection>

          <RateSection title="Dedicated hourly rates" description="Equipment-specific hourly baselines">
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(config.dedicatedRates).map(([equipment, rates]) => (
                <RateInput key={equipment} label={equipment} value={rates.hourly} prefix="$" suffix="/ HR" onChange={(value) => update(["dedicatedRates", equipment, "hourly"], value)} />
              ))}
            </div>
          </RateSection>

          <RateSection title="Accessorials" description="Shared flat-fee additions">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(config.accessorialRates).map(([key, value]) => (
                <RateInput key={key} label={key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())} value={value} prefix="$" onChange={(nextValue) => update(["accessorialRates", key], nextValue)} />
              ))}
            </div>
          </RateSection>

          <RateSection title="Global pricing rules" description="Thresholds, stops, and dedicated billing behavior">
            <div className="grid grid-cols-2 gap-3">
              <RateInput label="Parcel mileage threshold" value={config.globalPricingRules.parcelMileageThreshold} suffix="MI" step="1" onChange={(value) => update(["globalPricingRules", "parcelMileageThreshold"], value)} />
              <RateInput label="Additional stop" value={config.globalPricingRules.additionalStopCharge} prefix="$" onChange={(value) => update(["globalPricingRules", "additionalStopCharge"], value)} />
              <RateInput label="Dedicated minimum" value={config.globalPricingRules.dedicatedMinimumHours} suffix="HRS" step="0.25" onChange={(value) => update(["globalPricingRules", "dedicatedMinimumHours"], value)} />
              <RateInput label="Billing increment" value={config.globalPricingRules.dedicatedBillingIncrementHours} suffix="HRS" step="0.25" onChange={(value) => update(["globalPricingRules", "dedicatedBillingIncrementHours"], value)} />
            </div>
          </RateSection>

          {(error || message) && (
            <p className={`rounded-xl px-4 py-3 text-sm font-semibold ${error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`} role="status">
              {error || message}
            </p>
          )}

          <div className="sticky bottom-4 z-10 rounded-2xl border border-white/70 bg-white/90 p-3 shadow-[0_16px_45px_rgba(16,45,61,.18)] backdrop-blur">
            <button type="submit" className="primary-button" disabled={saving || source !== "database"}>
              {saving ? "SAVING SHARED PRICING…" : "SAVE & PUBLISH PRICING"}
            </button>
          </div>
        </form>

        <form action="/api/logout" method="post" className="mt-7 text-center">
          <button className="text-sm font-semibold text-slate-500 hover:text-slate-700">Log out</button>
        </form>
      </div>
    </main>
  );
}
