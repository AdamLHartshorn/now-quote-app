"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import BrandLockup from "@/components/BrandLockup";
import { usePricingSettings } from "@/lib/pricing-settings";
import { vehicleSpecs } from "@/lib/vehicle-specs";

type ReferenceSection = "menu" | "equipment" | "services" | "rules";

function Spec({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-[#f7fbfb] p-3"><dt className="text-[11px] font-extrabold uppercase tracking-[.08em] text-slate-500">{label}</dt><dd className="mt-1 text-lg font-extrabold text-[#082f57]">{value}</dd></div>;
}

function SectionCard({ title, description, detail, onClick }: { title: string; description: string; detail: string; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="panel group w-full text-left transition hover:-translate-y-0.5 hover:border-[#83bac4]"><div className="flex items-center justify-between gap-5"><div><p className="panel-title !mb-2">{title}</p><p className="text-sm text-slate-600">{description}</p><p className="mt-3 text-[11px] font-extrabold uppercase tracking-[.08em] text-[#007b90]">{detail}</p></div><span className="text-2xl font-bold text-[#00a3bd] transition group-hover:translate-x-1">→</span></div></button>;
}

function SectionHeading({ title, description, onBack }: { title: string; description: string; onBack: () => void }) {
  return <><button type="button" onClick={onBack} className="back-link mb-6">← All references</button><div className="page-heading"><p className="eyebrow">Quick reference</p><h2 className="page-title">{title}</h2><p className="page-subtitle">{description}</p></div></>;
}

export default function SalesReferenceClient() {
  const { config, error: pricingError } = usePricingSettings();
  const [section, setSection] = useState<ReferenceSection>("menu");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | "Parcel" | "Commercial">("All");
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [section]);
  const filtered = useMemo(() => vehicleSpecs.filter((spec) =>
    (category === "All" || spec.category === category) && spec.vehicle.toLowerCase().includes(search.trim().toLowerCase())
  ), [category, search]);

  return <main className="app-shell"><div className="page-frame">
    <header className="topbar"><Link href="/" className="back-link">← Quote menu</Link><BrandLockup compact /></header>

    {section === "menu" && <><div className="page-heading"><p className="eyebrow">Field sales playbook</p><h1 className="page-title">Quick reference</h1><p className="page-subtitle">Open the section you need for fast, confident customer conversations.</p></div><div className="form-stack"><SectionCard title="Equipment" description="Vehicle capacity, pallet limits, dimensions, weight, and liftgate availability." detail="12 vehicle configurations" onClick={() => setSection("equipment")} /><SectionCard title="Services" description="Current parcel, commercial, and dedicated service options used by the calculators." detail="Service levels and live baseline rates" onClick={() => setSection("services")} /><SectionCard title="Pricing rules" description="The mileage, fuel, weight, wait-time, stop, and equipment assumptions behind every quote." detail="Current calculator behavior" onClick={() => setSection("rules")} /></div></>}

    {section === "equipment" && <><SectionHeading title="Equipment" description="Approved vehicle constraints for selecting the right equipment." onBack={() => setSection("menu")} /><div className="form-stack">
      <section className="panel"><div className="mb-5 flex items-start justify-between gap-4"><div><p className="panel-title !mb-2">Vehicle capacity guide</p><p className="text-sm text-slate-600">Source: Vehicle Specs — July 30, 2026</p></div><span className="rounded-full bg-[#e5f4f6] px-3 py-1.5 text-[10px] font-extrabold text-[#007b90]">12 VEHICLES</span></div><label><span className="field-label">Find equipment</span><input className="control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search car, Transit, flatbed, semi…" /></label><div className="mt-4 grid grid-cols-3 gap-2">{(["All", "Parcel", "Commercial"] as const).map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`choice-button border px-2 text-sm font-extrabold ${category === item ? "border-[#008da3] bg-[#008da3] text-white" : "border-slate-200 bg-white text-slate-600"}`}>{item}</button>)}</div></section>
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">These are maximums from the approved source sheet—not a guarantee of availability or fit. Confirm unusually sized, heavy, or special-handling freight with Operations.</p>
      {filtered.length === 0 && <section className="panel text-center"><h2 className="font-extrabold text-[#082f57]">No matching equipment</h2><p className="mt-2 text-sm text-slate-600">Try a broader vehicle name or another category.</p></section>}
      {filtered.map((spec) => <article key={spec.vehicle} className="panel"><div className="mb-5 flex items-start justify-between gap-4"><div><span className="inline-flex rounded-full bg-[#e5f4f6] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#007b90]">{spec.category}</span><h2 className="mt-2 text-xl font-extrabold leading-tight text-[#082f57]">{spec.vehicle}</h2></div><p className="text-right text-sm font-bold text-slate-500">{spec.units ? `${spec.units} unit${spec.units === 1 ? "" : "s"}` : "Unit count N/A"}</p></div><dl className="grid grid-cols-2 gap-3"><Spec label="Pallets" value={spec.pallets?.toString() ?? "N/A"} /><Spec label="Max weight / GVW" value={`${spec.maxWeight.toLocaleString()} lbs.`} /><Spec label="Max length" value={spec.maxLength ?? "N/A"} /><Spec label="Max width" value={spec.maxWidth ?? "N/A"} /><Spec label="Max height" value={spec.maxHeight ?? "N/A"} /><Spec label="Liftgate" value={spec.liftgate ?? "N/A"} /></dl></article>)}
    </div></>}

    {section === "services" && <><SectionHeading title="Services" description="Service options and current baseline rates already used by Field Desk." onBack={() => setSection("menu")} /><div className="form-stack">
      {pricingError && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Live shared rates could not be loaded. Do not rely on the figures below until the connection is restored.</p>}
      <section className="panel"><p className="panel-title">Parcel service levels</p><p className="mb-5 text-sm text-slate-600">Available for Car, Small Truck, and Sprinter quotes. The calculator applies the greater of the minimum or mileage calculation.</p><div className="space-y-3">{Object.entries(config.parcelServiceRates).map(([name, rate]) => <div key={name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#f7fbfb] p-4"><strong className="text-[#082f57]">{name}</strong><span className="text-right text-sm font-bold text-slate-600">${rate.minimum.toFixed(2)} minimum<br />${rate.ratePerMile.toFixed(2)}/mile</span></div>)}</div></section>
      <section className="panel"><p className="panel-title">Dock Truck service levels</p><p className="mb-5 text-sm text-slate-600">Dock Truck supports four delivery speeds. Rates shown are the current service base plus mileage.</p><div className="space-y-3">{Object.entries(config.commercialEquipmentConfig["Dock Truck"].serviceRates).map(([name, rate]) => <div key={name} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#f7fbfb] p-4"><strong className="text-[#082f57]">{name}</strong><span className="text-right text-sm font-bold text-slate-600">${rate.base.toFixed(2)} base<br />${rate.ratePerMile.toFixed(2)}/mile</span></div>)}</div></section>
      <section className="panel"><p className="panel-title">Flatbed and semi service</p><p className="text-sm text-slate-600">The configured flatbed and semi equipment options use Direct service. Equipment-specific base rates, mileage, thresholds, wait time, weight, and allowed accessorials are applied by the calculator.</p></section>
      <section className="panel"><p className="panel-title">Dedicated service</p><p className="text-sm text-slate-600">Dedicated quotes reserve equipment by the hour. Field Desk uses a {config.globalPricingRules.dedicatedMinimumHours}-hour minimum, bills in {config.globalPricingRules.dedicatedBillingIncrementHours * 60}-minute increments, and loads the applicable fuel surcharge into the hourly rate.</p></section>
    </div></>}

    {section === "rules" && <><SectionHeading title="Pricing rules" description="The written assumptions and calculator behavior behind current quotes." onBack={() => setSection("menu")} /><div className="form-stack">
      {pricingError && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">Live shared rates could not be loaded. Do not rely on the figures below until the connection is restored.</p>}
      <section className="panel"><p className="panel-title">Mileage</p><ul className="space-y-4 text-sm text-slate-600"><li><strong className="text-[#082f57]">Parcel:</strong> through {config.globalPricingRules.parcelMileageThreshold} miles, the selected service rate applies. Above it, the vehicle’s long-distance per-mile rate applies.</li><li><strong className="text-[#082f57]">Dock Truck:</strong> above {config.commercialEquipmentConfig["Dock Truck"].overMileageThreshold} miles, the full-trip written rate replaces the normal mileage rate for every mile; the service base remains.</li><li><strong className="text-[#082f57]">Flatbeds and semis:</strong> the threshold surcharge applies only to miles beyond the equipment threshold; normal base and mileage charges remain.</li></ul></section>
      <section className="panel"><p className="panel-title">Fuel and weight</p><ul className="space-y-4 text-sm text-slate-600"><li><strong className="text-[#082f57]">Fuel:</strong> calculated on transportation charges using the parcel ({(config.fuelSurcharge.parcel * 100).toFixed(1)}%), commercial ({(config.fuelSurcharge.commercial * 100).toFixed(1)}%), or heavy-commercial ({(config.fuelSurcharge.heavyCommercial * 100).toFixed(1)}%) class.</li><li><strong className="text-[#082f57]">Weight:</strong> excess pounds are rounded up to the next 100 pounds before the CWT rate is applied.</li></ul></section>
      <section className="panel"><p className="panel-title">Time, stops, and exceptions</p><ul className="space-y-4 text-sm text-slate-600"><li><strong className="text-[#082f57]">Wait time:</strong> pickup and delivery wait are combined, free minutes are deducted once, then the per-minute rate applies.</li><li><strong className="text-[#082f57]">Additional stops:</strong> the first stop is included; each additional stop is ${config.globalPricingRules.additionalStopCharge.toFixed(2)}.</li><li><strong className="text-[#082f57]">No-load:</strong> transportation and fuel become zero, and the equipment no-load fee applies.</li><li><strong className="text-[#082f57]">Dedicated:</strong> {config.globalPricingRules.dedicatedMinimumHours}-hour minimum, rounded up in {config.globalPricingRules.dedicatedBillingIncrementHours * 60}-minute increments, with fuel loaded into the hourly rate.</li><li><strong className="text-[#082f57]">Equipment restrictions:</strong> liftgate and Moffett charges apply only where the selected equipment allows them.</li></ul></section>
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">Quotes are estimates. Confirm unusual freight, special handling, and pricing exceptions with Operations.</p>
    </div></>}
  </div></main>;
}
