"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import InterstateOverlay from "@/components/InterstateOverlay";
import BrandLockup from "@/components/BrandLockup";
import { researchDate, type ZipWatchProspect } from "@/lib/prospect-watch";
import territoryData from "@/lib/territory-data.json";
import { REPS, type Prospect, type Rep, type TerritoryRow } from "@/lib/territory-types";

type Filter = "ALL" | Rep;
type Geometry = { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
type Feature = { properties: TerritoryRow; geometry: Geometry };

const colors: Record<Rep | "Unassigned", string> = { Adam: "#08a6bd", Brad: "#6688f1", Dawn: "#ed9b48", Jon: "#b36de3", Shawn: "#4fbd83", Unassigned: "#94a3b8" };
const project = ([lon, lat]: number[]) => [(lon + 88) * 1000, (41.8 - lat) * 1000] as const;

function featurePoints(feature: Feature) {
  const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][];
  return polygons.flat(2);
}

function featurePath(feature: { geometry: Geometry }) {
  const polygons = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates as number[][][]] : feature.geometry.coordinates as number[][][][];
  return polygons.map((polygon) => polygon.map((ring) => ring.map((point, index) => { const [x, y] = project(point); return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ") + " Z").join(" ")).join(" ");
}

function bounds(features: Feature[]) {
  const points = features.flatMap(featurePoints).map(project);
  if (!points.length) return "0 0 100 100";
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const padding = Math.max(22, Math.max(maxX - minX, maxY - minY) * .045);
  return `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
}

export default function TerritoryMapClient({ isAdmin, initialZip }: { isAdmin: boolean; initialZip?: string }) {
  const rows = territoryData.territories as TerritoryRow[];
  const features = territoryData.geojson.features as Feature[];
  const [showHighways, setShowHighways] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [query, setQuery] = useState("");
  const [selectedZip, setSelectedZip] = useState<string | null>(initialZip ?? null);
  const [overrides, setOverrides] = useState<Partial<Record<string, Rep>>>({});
  const [watchProspects, setWatchProspects] = useState<ZipWatchProspect[]>([]);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [prospectNote, setProspectNote] = useState("");
  const [loadingProspects, setLoadingProspects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [draftRep, setDraftRep] = useState<Rep>("Adam");

  const owner = (row: TerritoryRow) => overrides[row.zip] ?? row.rep;
  const selected = rows.find((row) => row.zip === selectedZip);
  const visibleFeatures = useMemo(() => features.filter((feature) => filter === "ALL" || (overrides[feature.properties.zip] ?? feature.properties.rep) === filter), [features, filter, overrides]);
  const viewBox = useMemo(() => bounds(visibleFeatures), [visibleFeatures]);
  const matches = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    return rows.filter((row) => `${row.zip} ${row.city} ${row.county} ${owner(row)}`.toLowerCase().includes(value)).slice(0, 8);
  }, [query, overrides, rows]);

  useEffect(() => { void fetch("/api/territories").then((response) => response.ok ? response.json() : { overrides: {} }).then((data) => setOverrides(data.overrides ?? {})).catch(() => undefined); }, []);
  useEffect(() => { if (selected) { const rep = owner(selected); setDraftRep(rep === "Unassigned" ? "Adam" : rep); } }, [selectedZip, overrides]);
  useEffect(() => {
    if (!selectedZip) return;
    const controller = new AbortController();
    setLoadingProspects(true); setWatchProspects([]); setProspects([]); setProspectNote("");
    void fetch(`/api/territory-prospects?zip=${selectedZip}`, { signal: controller.signal }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error ?? "Prospects are temporarily unavailable."); if (controller.signal.aborted) return; setWatchProspects(data.watchProspects ?? []); setProspects(data.prospects ?? []); setProspectNote(data.note ?? ""); }).catch((error: Error) => { if (!controller.signal.aborted) setProspectNote(error.message); }).finally(() => { if (!controller.signal.aborted) setLoadingProspects(false); });
    return () => controller.abort();
  }, [selectedZip]);

  function choose(row: TerritoryRow) { setSelectedZip(row.zip); setFilter(owner(row) === "Unassigned" ? "ALL" : owner(row) as Rep); setQuery(""); setSaveMessage(""); }
  async function saveAssignment() {
    if (!selected) return;
    setSaving(true); setSaveMessage("");
    try { const response = await fetch("/api/territories", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ zip: selected.zip, rep: draftRep }) }); if (!response.ok) throw new Error("Assignment could not be saved."); setOverrides((current) => ({ ...current, [selected.zip]: draftRep })); setFilter(draftRep); setSaveMessage("Territory updated for everyone."); }
    catch (error) { setSaveMessage(error instanceof Error ? error.message : "Assignment could not be saved."); }
    finally { setSaving(false); }
  }

  return <main className="app-shell"><div className="page-frame" style={{ maxWidth: 1152 }}>
    <header className="topbar"><Link href="/" className="back-link">← Field Desk</Link><BrandLockup compact /></header>
    <div className="page-heading"><p className="eyebrow">Sales territories</p><h1 className="page-title">Know your ground.</h1><p className="page-subtitle">See every assigned ZIP at a glance, then tap one for Prospect Watch companies and researched business ideas.</p></div>

    <section className="mb-5 rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">{(["ALL", ...REPS] as Filter[]).map((name) => <button key={name} onClick={() => { setFilter(name); setSelectedZip(null); }} className={`min-h-12 rounded-xl px-2 text-sm font-extrabold transition ${filter === name ? "bg-[#102d3d] text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{name}</button>)}</div>
      <div className="relative mt-4"><label htmlFor="zip-search" className="sr-only">Search by ZIP, city, county, or rep</label><input id="zip-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ZIP, city, county, or rep…" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-base text-[#102d3d] outline-none focus:border-[#00a1b8] focus:ring-4 focus:ring-[#00a1b8]/10" />{matches.length > 0 && <div className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">{matches.map((row) => <button key={row.zip} onClick={() => choose(row)} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-slate-100"><span><strong className="text-[#102d3d]">{row.zip}</strong><span className="ml-2 text-sm text-slate-500">{row.city} · {row.county}</span></span><span className="text-xs font-extrabold" style={{ color: colors[owner(row)] }}>{owner(row)}</span></button>)}</div>}</div>
    </section>

    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(330px,.75fr)]">
      <section className="overflow-hidden rounded-[26px] border border-[#294b5b] bg-[#102d3d] shadow-[0_20px_50px_rgba(16,45,61,.2)]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-white/55">Current view</p><h2 className="mt-1 text-lg font-extrabold">{filter === "ALL" ? "All sales territories" : `${filter}’s territory`}</h2></div><span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold">{visibleFeatures.length} mapped ZIPs</span></div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3"><span className="text-sm font-semibold text-white/75">I-465 · I-70 · I-65 · I-74 · I-69</span><button type="button" aria-pressed={showHighways} onClick={() => setShowHighways(value => !value)} className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-bold transition ${showHighways ? "border-[#efe1b9]/60 bg-[#efe1b9]/15 text-[#fff2ce]" : "border-white/20 text-white/70 hover:bg-white/10"}`}>{showHighways ? "Hide highways" : "Show highways"}</button></div>
        <svg viewBox={viewBox} className="block aspect-[4/5] w-full bg-[radial-gradient(circle_at_center,#1b4d61,#102d3d_70%)] sm:aspect-[16/11]" role="img" aria-label={`${filter} sales territory map`}>
          <defs><pattern id="coverage-gap" patternUnits="userSpaceOnUse" width="12" height="12"><rect width="12" height="12" fill="#566776" /><path d="M0 0L12 12M-3 9L3 15M9 -3L15 3" stroke="#cbd5e1" strokeWidth="2" /></pattern></defs>
          {territoryData.coverageGaps.map((gap, index) => <path key={index} d={featurePath(gap as { geometry: Geometry })} fill="url(#coverage-gap)" stroke="#cbd5e1" strokeWidth="1" vectorEffect="non-scaling-stroke"><title>{gap.properties.label}</title></path>)}
          {features.map((feature) => { const rep = overrides[feature.properties.zip] ?? feature.properties.rep; const active = selectedZip === feature.properties.zip; return <path key={feature.properties.zip} d={featurePath(feature)} fill={colors[rep]} fillRule="evenodd" fillOpacity={active ? 1 : filter === "ALL" || filter === rep ? .82 : rep === "Unassigned" ? .7 : .16} stroke={active ? "#ffffff" : "#d9f5f7"} strokeWidth={active ? 3.5 : 1.1} vectorEffect="non-scaling-stroke" role="button" tabIndex={0} aria-label={`${feature.properties.zip} ${feature.properties.city}, ${rep}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(feature.properties); } }} className="cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:stroke-white" onClick={() => choose({ ...feature.properties, rep })}><title>{`${feature.properties.zip} · ${feature.properties.city} · ${rep}`}</title></path>; })}
          {showHighways && <InterstateOverlay viewBox={viewBox} />}
          {selectedZip && features.filter(feature => feature.properties.zip === selectedZip).map(feature => <path key={`selected-${selectedZip}`} d={featurePath(feature)} fill="none" stroke="white" strokeWidth="3.5" vectorEffect="non-scaling-stroke" pointerEvents="none" aria-hidden="true" />)}
        </svg>
        <p className="border-t border-white/10 px-5 py-3 text-sm leading-6 text-white/75">Hatched areas near Camp Atterbury have no ZIP boundary in the source data. Gray ZIPs await an admin assignment. Highway lines are geographic landmarks.</p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-white/10 px-5 py-4">{([...REPS, "Unassigned"] as const).map((rep) => <span key={rep} className="flex items-center gap-2 text-xs font-bold text-white/75"><span className="h-2.5 w-2.5 rounded-full" style={{ background: colors[rep] }} />{rep}</span>)}</div>
        <p className="px-5 pb-4 text-xs text-white/60">Highways: <a href="https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Transportation_LargeScale/MapServer/0" target="_blank" rel="noreferrer" className="underline underline-offset-2">U.S. Census Bureau, January 2026</a>.</p>
      </section>

      <aside className="space-y-5 lg:sticky lg:top-5">
        {!selected && rows.some((row) => owner(row) === "Unassigned") && <section className="rounded-[24px] border border-slate-200 bg-white p-5"><h2 className="text-lg font-extrabold text-[#102d3d]">ZIPs awaiting assignment</h2><p className="mt-2 text-sm leading-6 text-slate-600">These ZIPs were not in the November 10 territory sheet. {isAdmin ? "Select one to assign its rep." : "An admin can assign them."}</p><div className="mt-3 flex flex-wrap gap-2">{rows.filter((row) => owner(row) === "Unassigned").map((row) => <button key={row.zip} onClick={() => choose(row)} className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700">{row.zip} · {row.city}</button>)}</div></section>}
        {!selected && <section className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#008da3]">Pick a place</p><h2 className="mt-2 text-xl font-extrabold text-[#102d3d]">Tap any ZIP.</h2><p className="mt-2 leading-7 text-slate-600">See its owner and the reviewed business profiles published for that ZIP.</p></section>}
        {selected && <><section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-extrabold uppercase tracking-[.16em] text-slate-500">Selected ZIP</p><h2 className="mt-1 text-3xl font-black tracking-tight text-[#102d3d]">{selected.zip}</h2><p className="mt-1 font-semibold text-slate-600">{selected.city} · {selected.county}</p></div><span className="rounded-full px-3 py-1.5 text-sm font-extrabold text-white" style={{ background: colors[owner(selected)] }}>{owner(selected)}</span></div>
          {isAdmin && <div className="mt-5 border-t border-slate-200 pt-5"><p className="mb-2 text-xs font-extrabold uppercase tracking-[.14em] text-slate-500">Reassign this ZIP</p><div className="grid grid-cols-3 gap-2">{REPS.map((rep) => <button key={rep} onClick={() => setDraftRep(rep)} className={`rounded-xl border px-2 py-2 text-xs font-extrabold ${draftRep === rep ? "border-[#102d3d] bg-[#102d3d] text-white" : "border-slate-200 text-slate-600"}`}>{rep}</button>)}</div><button onClick={saveAssignment} disabled={saving} className="mt-3 w-full rounded-xl bg-[#00a1b8] px-4 py-3 text-sm font-extrabold text-white disabled:opacity-50">{saving ? "Saving…" : "Save assignment"}</button>{saveMessage && <p className="mt-2 text-sm font-semibold text-[#247080]">{saveMessage}</p>}</div>}
        </section>
        <section aria-live="polite" className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-extrabold text-[#102d3d]">Prospect Watch</h2>{!loadingProspects && <span className="rounded-full bg-[#e5f4f6] px-3 py-1 text-sm font-extrabold text-[#007f94]">{watchProspects.length}</span>}</div>
          <p className="mt-2 text-sm leading-6 text-slate-600">Hiring and delivery signals tied to this ZIP.</p>
          {loadingProspects ? <p className="mt-4 animate-pulse text-sm font-semibold text-slate-500">Loading researched prospects…</p> : watchProspects.length ? <div className="mt-4 space-y-3">{watchProspects.map(p => <Link key={p.id} href={`/prospect-watch/${p.id}?fromZip=${selected.zip}`} className="block rounded-2xl border border-slate-200 p-4 transition hover:border-[#008da3] hover:bg-[#f2f9fa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008da3]">
            <span className={`text-sm font-bold ${p.signalType === "current" ? "text-[#157259]" : "text-[#78591d]"}`}>{p.signalType === "current" ? "Current opening" : "Prior hiring signal"}</span>
            <h3 className="mt-2 text-lg font-extrabold leading-6 text-[#102d3d]">{p.company}</h3><p className="mt-2 text-base leading-6 text-slate-600">{p.role}</p>
            <p className="mt-2 text-sm text-slate-500">Reviewed {researchDate(p.checkedOn)}{p.limitedFit ? " · Limited fit" : ""}</p><span className="mt-3 inline-block text-base font-bold text-[#007f94]">View full profile →</span>
          </Link>)}</div> : <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{prospectNote || "No Prospect Watch companies have a confirmed branch ZIP here yet."}</p>}
          <Link href="/prospect-watch" className="mt-4 inline-block min-h-11 py-2 text-base font-bold text-[#007f94] underline underline-offset-4">Browse all Prospect Watch companies</Link>
        </section>
        {prospects.length > 0 && <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-[#008da3]">Researched prospects</p><h2 className="mt-1 text-xl font-extrabold text-[#102d3d]">Other business ideas</h2>{loadingProspects && <p className="mt-4 animate-pulse text-sm font-semibold text-slate-500">Loading researched prospects…</p>}{!loadingProspects && prospects.length === 0 && <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">{prospectNote || "Research for this ZIP is still in progress."}</p>}<div className="mt-4 space-y-3">{prospects.map((prospect, index) => <article key={prospect.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e5f4f6] text-xs font-black text-[#007f94]">{index + 1}</span><div><h3 className="font-extrabold text-[#102d3d]">{prospect.name}</h3><p className="mt-0.5 text-xs font-bold uppercase tracking-wide text-[#008da3]">{prospect.category}</p></div></div><p className="mt-3 text-sm leading-6 text-slate-600">{prospect.reason}</p><p className="mt-2 text-xs text-slate-500">Researched {prospect.researchedOn}</p><p className="mt-2 text-sm font-semibold text-slate-500">{prospect.address}</p><div className="mt-3 flex flex-wrap gap-2"><a className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-[#244c5a]" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${prospect.name} ${prospect.address}`)}`} target="_blank" rel="noreferrer">Open map</a>{prospect.phone && <a className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-[#244c5a]" href={`tel:${prospect.phone}`}>Call</a>}{prospect.sourceUrl && <a className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-[#244c5a]" href={prospect.sourceUrl} target="_blank" rel="noreferrer">Research source ↗</a>}{prospect.website && <a className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-extrabold text-[#244c5a]" href={prospect.website} target="_blank" rel="noreferrer">Website</a>}</div></article>)}</div>{prospects.length > 0 && prospectNote && <p className="mt-3 text-xs leading-5 text-slate-500">{prospectNote}</p>}<p className="mt-4 text-[11px] leading-4 text-slate-400">Curated research · November 10, 2026. Conversation starters are suggested outreach topics. Coverage is being built ZIP by ZIP.</p></section>}</>}
      </aside>
    </div>
  </div></main>;
}
