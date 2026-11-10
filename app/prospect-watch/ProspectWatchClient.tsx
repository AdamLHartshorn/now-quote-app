"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import BrandLockup from "@/components/BrandLockup";
import { REPS } from "@/lib/territory-types";
import { filterProspects, researchDate, type HiringProspect } from "@/lib/prospect-watch";

type Props = { records: (HiringProspect & { owner: string })[]; reviewedOn: string; assignmentsAvailable: boolean; initialRep: string; initialQuery: string; initialNew: boolean; initialSignal: string };
const filters: readonly string[] = ["ALL", ...REPS];

export default function ProspectWatchClient({ records, reviewedOn, assignmentsAvailable, initialRep, initialQuery, initialNew, initialSignal }: Props) {
  const [rep, setRep] = useState(assignmentsAvailable && filters.includes(initialRep) ? initialRep : "ALL");
  const [query, setQuery] = useState(initialQuery);
  const [onlyNew, setOnlyNew] = useState(initialNew);
  const [signal, setSignal] = useState(initialSignal);
  const [limit, setLimit] = useState(24);
  const visible = useMemo(() => filterProspects(records, rep, query, onlyNew, signal), [records, rep, query, onlyNew, signal]);
  const currentCount = records.filter(p => p.signalType === "current").length;
  const params = new URLSearchParams({ rep, ...(query ? { q: query } : {}), ...(onlyNew ? { new: "1" } : {}), ...(signal !== "all" ? { signal } : {}) });
  const otherCount = records.filter(p => !REPS.some(r => r === p.owner)).length;
  function reset() { setRep("ALL"); setQuery(""); setOnlyNew(false); setSignal("all"); setLimit(24); }

  return <main className="app-shell"><div className="page-frame" style={{ maxWidth: 1000 }}>
    <header className="topbar"><Link href="/" className="back-link">← Home</Link><BrandLockup compact /></header>
    <div className="page-heading"><p className="eyebrow">Prospect watch · Delivery opportunities</p><h1 className="page-title">A reason to reach out.</h1><p className="page-subtitle">Current openings and earlier hiring signals—useful reasons to ask about delivery support.</p></div>
    <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-[#183443] px-5 py-4 text-white"><span className="font-extrabold">{records.length} prospect profiles</span><span className="text-sm text-white/85">{currentCount} current openings · {records.length - currentCount} prior signals</span><span className="text-sm text-white/85">Reviewed {researchDate(reviewedOn)}</span></div>
    <p className="mb-6 text-base leading-relaxed text-slate-600">A filled role or expired link does not erase a delivery opportunity. <strong className="text-[#183443]">Current opening</strong> means a live hiring signal was confirmed at review. <strong className="text-[#183443]">Prior hiring signal</strong> preserves earlier research without claiming the company is still hiring.</p>
    <section aria-label="Filter prospects" className="panel mb-7">
      <div className="mb-5 grid grid-cols-3 gap-2 sm:grid-cols-6" aria-label="Sales representative">
        {filters.map(name => <button key={name} aria-pressed={rep === name} disabled={!assignmentsAvailable && name !== "ALL"} onClick={() => { setRep(name); setLimit(24); }} className={`min-h-12 rounded-xl px-3 py-3 text-base font-bold transition disabled:opacity-40 ${rep === name ? "bg-[#183443] text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-[#e3f0f2]"}`}>{name}</button>)}
      </div>
      <label className="mb-5 block"><span className="field-label">Hiring signal</span><select value={signal} onChange={event => { setSignal(event.target.value); setLimit(24); }} className="control"><option value="all">All prospects</option><option value="current">Current openings</option><option value="historical">Prior hiring signals</option></select></label>
      <label className="block"><span className="field-label">Find a company or area</span><input type="search" value={query} onChange={event => { setQuery(event.target.value); setLimit(24); }} className="control" placeholder="Company, city, ZIP, or equipment" /></label>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><label className="flex min-h-11 cursor-pointer items-center gap-3 text-base font-semibold text-slate-700"><input type="checkbox" checked={onlyNew} onChange={event => { setOnlyNew(event.target.checked); setLimit(24); }} className="h-5 w-5 accent-[#007f94]" />New to this collection</label>{(query || rep !== "ALL" || onlyNew || signal !== "all") && <button onClick={reset} className="min-h-11 rounded-lg px-3 font-bold text-[#007f94] underline underline-offset-4">Clear filters</button>}</div>
      {!assignmentsAvailable && <p role="alert" className="mt-4 rounded-xl bg-amber-50 p-4 text-base text-amber-900">Current territory assignments could not be loaded. All prospects are available; refresh this page to restore rep filters.</p>}
    </section>
    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3"><p role="status" aria-live="polite" className="font-bold text-[#183443]">{visible.length} {visible.length === 1 ? "prospect" : "prospects"}{rep !== "ALL" ? ` · ${rep}` : ""}</p><Link href="/territory-map" className="min-h-11 py-2 font-bold text-[#007f94] underline underline-offset-4">Open territory map →</Link></div>
    <div className="grid gap-4 md:grid-cols-2">
      {visible.slice(0, limit).map(p => <Link key={p.id} href={`/prospect-watch/${p.id}?${params}`} className="group flex flex-col rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[#7abac5] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#007f94]">
        <div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#edf6f7] px-3 py-1 text-sm font-bold text-[#196273]">{p.owner}</span>{p.newToCollection && <span className="rounded-full bg-[#f6efdf] px-3 py-1 text-sm font-bold text-[#78591d]">New to collection</span>}</div>
        <p className={`mb-3 text-sm font-bold ${p.signalType === "current" ? "text-[#157259]" : "text-[#78591d]"}`}>{p.signalType === "current" ? "Current opening" : "Prior hiring signal"}{p.limitedFit ? " · Limited fit" : ""}</p>
        <h2 className="text-xl leading-snug font-extrabold text-[#183443]">{p.company}</h2><p className="mt-1 text-base text-slate-600">{p.city}{p.zip ? ` · ${p.zip}` : " · Branch ZIP unconfirmed"}</p>
        <p className="mt-5 text-base leading-relaxed text-slate-700"><strong className="text-[#183443]">{p.signalType === "current" ? "Hiring:" : "Earlier role:"}</strong> {p.role}</p><p className="mt-3 flex-1 text-base leading-relaxed text-slate-700">{p.opportunity}</p>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4"><span className="text-sm text-slate-500">{p.signalType === "current" ? "Confirmed" : "Reviewed"} {researchDate(p.checkedOn)}</span><span className="font-extrabold text-[#007f94]">View details →</span></div>
      </Link>)}
    </div>
    {visible.length > limit && <div className="mt-7 text-center"><p className="mb-3 text-base text-slate-600">Showing {limit} of {visible.length} prospects</p><button onClick={() => setLimit(n => n + 24)} className="min-h-12 rounded-xl bg-[#183443] px-6 py-3 text-base font-bold text-white">Show more prospects</button></div>}
    {!visible.length && <div className="panel py-10 text-center"><h2 className="text-xl font-bold text-[#183443]">No matching prospects in this edition.</h2><p className="mt-3 text-base text-slate-600">Try another rep or broaden your search. Current and prior signals are both available in All prospects.</p><button onClick={reset} className="mt-5 rounded-xl bg-[#183443] px-6 py-3 font-bold text-white">Show all prospects</button></div>}
    <footer className="mt-8 space-y-3 text-base leading-relaxed text-slate-600"><p>Research was reviewed on the date shown. Prior signals are dated in each profile; they do not assert an open vacancy or paid advertisement. Openings can close after a review. Suggested NOW opportunities and equipment fit are starting points for a conversation, not confirmed delivery requirements.</p>{otherCount > 0 && assignmentsAvailable && <p>ALL also includes {otherCount} {otherCount === 1 ? "listing" : "listings"} without an assigned territory. A market-wide job is not assigned to a rep until its operating ZIP is known.</p>}<Link href="/help" className="inline-block min-h-11 py-2 font-bold text-[#007f94] underline underline-offset-4">How to use Prospect Watch</Link></footer>
  </div></main>;
}
