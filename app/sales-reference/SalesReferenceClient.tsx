"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import BrandLockup from "@/components/BrandLockup";
import { vehicleSpecs } from "@/lib/vehicle-specs";

const upcomingSections = [
  ["Services", "Definitions, timing, use cases, and customer-facing explanations."],
  ["Pricing rules", "Mileage, weight, wait time, fuel, and accessorial assumptions."],
  ["Discovery questions", "The essential questions to ask before recommending service."],
  ["Objections & responses", "Clear, approved language for common customer questions."],
  ["When to escalate", "Situations that require Operations or leadership review."],
] as const;

function Spec({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-[#f7fbfb] p-3"><dt className="text-[11px] font-extrabold uppercase tracking-[.08em] text-slate-500">{label}</dt><dd className="mt-1 text-lg font-extrabold text-[#082f57]">{value}</dd></div>;
}

export default function SalesReferenceClient() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"All" | "Parcel" | "Commercial">("All");
  const filtered = useMemo(() => vehicleSpecs.filter((spec) =>
    (category === "All" || spec.category === category) && spec.vehicle.toLowerCase().includes(search.trim().toLowerCase())
  ), [category, search]);

  return <main className="app-shell"><div className="page-frame">
    <header className="topbar"><Link href="/" className="back-link">← Quote menu</Link><BrandLockup compact /></header>
    <div className="page-heading"><p className="eyebrow">Field sales playbook</p><h1 className="page-title">Quick reference</h1><p className="page-subtitle">Approved vehicle constraints and sales guidance for fast, confident conversations.</p></div>

    <div className="form-stack">
      <section className="panel">
        <div className="mb-5 flex items-start justify-between gap-4"><div><p className="panel-title !mb-2">Vehicle capacity guide</p><p className="text-sm text-slate-600">Source: Vehicle Specs — July 30, 2026</p></div><span className="rounded-full bg-[#e5f4f6] px-3 py-1.5 text-[10px] font-extrabold text-[#007b90]">12 VEHICLES</span></div>
        <label><span className="field-label">Find equipment</span><input className="control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search car, Transit, flatbed, semi…" /></label>
        <div className="mt-4 grid grid-cols-3 gap-2">{(["All", "Parcel", "Commercial"] as const).map((item) => <button type="button" key={item} onClick={() => setCategory(item)} className={`choice-button border px-2 text-sm font-extrabold ${category === item ? "border-[#008da3] bg-[#008da3] text-white" : "border-slate-200 bg-white text-slate-600"}`}>{item}</button>)}</div>
      </section>

      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-7 text-amber-900">These are maximums from the approved source sheet—not a guarantee of availability or fit. Confirm unusually sized, heavy, or special-handling freight with Operations.</p>

      {filtered.length === 0 && <section className="panel text-center"><h2 className="font-extrabold text-[#082f57]">No matching equipment</h2><p className="mt-2 text-sm text-slate-600">Try a broader vehicle name or another category.</p></section>}

      {filtered.map((spec) => <article key={spec.vehicle} className="panel">
        <div className="mb-5 flex items-start justify-between gap-4"><div><span className="inline-flex rounded-full bg-[#e5f4f6] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#007b90]">{spec.category}</span><h2 className="mt-2 text-xl font-extrabold leading-tight text-[#082f57]">{spec.vehicle}</h2></div><p className="text-right text-sm font-bold text-slate-500">{spec.units ? `${spec.units} unit${spec.units === 1 ? "" : "s"}` : "Unit count N/A"}</p></div>
        <dl className="grid grid-cols-2 gap-3">
          <Spec label="Pallets" value={spec.pallets?.toString() ?? "N/A"} />
          <Spec label="Max weight / GVW" value={`${spec.maxWeight.toLocaleString()} lbs.`} />
          <Spec label="Max length" value={spec.maxLength ?? "N/A"} />
          <Spec label="Max width" value={spec.maxWidth ?? "N/A"} />
          <Spec label="Max height" value={spec.maxHeight ?? "N/A"} />
          <Spec label="Liftgate" value={spec.liftgate ?? "N/A"} />
        </dl>
      </article>)}

      <section className="pt-3"><p className="eyebrow">More reference sections</p><div className="form-stack">{upcomingSections.map(([title, description]) => <div key={title} className="panel flex items-start justify-between gap-4"><div><h2 className="font-extrabold text-[#102d3d]">{title}</h2><p className="mt-2 text-sm text-slate-600">{description}</p></div><span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-extrabold tracking-wide text-slate-500">COMING SOON</span></div>)}</div></section>
    </div>
  </div></main>;
}
