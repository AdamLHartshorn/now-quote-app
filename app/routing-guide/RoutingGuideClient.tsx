"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { territories, type RouteStop, type SavedRoute, type StopStatus, type Territory } from "@/lib/routing-types";

type ProspectDraft = { businessName: string; address: string };
const blankProspect = (): ProspectDraft => ({ businessName: "", address: "" });

export default function RoutingGuideClient({ isAdmin }: { isAdmin: boolean }) {
  const [routes, setRoutes] = useState<SavedRoute[]>([]);
  const [selected, setSelected] = useState<SavedRoute | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/routes", { cache: "no-store" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Unable to load routes");
        return result as SavedRoute[];
      })
      .then((result) => { if (!cancelled) setRoutes(result); })
      .catch((loadError: unknown) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load routes"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function storeRoute(route: SavedRoute) {
    setRoutes((current) => [route, ...current.filter((item) => item.id !== route.id)]);
    setSelected(route);
    setCreating(false);
  }

  function removeRoute(id: string) {
    setRoutes((current) => current.filter((route) => route.id !== id));
    setSelected(null);
  }

  return (
    <main className="app-shell">
      <div className="page-frame">
        <header className="topbar">
          <Link href="/" className="back-link">← Quote menu</Link>
          <Image src="/now-logo.jpg" alt="NOW Courier" width={130} height={45} priority className="brand-logo" />
        </header>

        {!selected && !creating && (
          <RouteLibrary routes={routes} loading={loading} error={error} onSelect={setSelected} onCreate={() => setCreating(true)} />
        )}
        {creating && <CreateRoute onCancel={() => setCreating(false)} onCreated={storeRoute} />}
        {selected && <RouteDetail route={selected} isAdmin={isAdmin} onBack={() => setSelected(null)} onSaved={storeRoute} onDeleted={removeRoute} />}
      </div>
    </main>
  );
}

function RouteLibrary({ routes, loading, error, onSelect, onCreate }: { routes: SavedRoute[]; loading: boolean; error: string; onSelect: (route: SavedRoute) => void; onCreate: () => void }) {
  const [search, setSearch] = useState("");
  const [territory, setTerritory] = useState<"ALL" | Territory>("ALL");
  const filtered = routes.filter((route) =>
    (territory === "ALL" || route.territory === territory) && route.title.toLowerCase().includes(search.toLowerCase())
  );

  return <>
    <div className="page-heading">
      <p className="eyebrow">Prospect planning</p>
      <h1 className="page-title">Routing guide</h1>
      <p className="page-subtitle">Build, save, and work the most efficient order for every prospect list.</p>
    </div>
    <div className="form-stack">
      <button type="button" className="primary-button" onClick={onCreate}>+ BUILD A NEW ROUTE</button>
      <section className="panel space-y-3">
        <input className="control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search saved routes" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["ALL", ...territories] as const).map((item) => <button key={item} type="button" onClick={() => setTerritory(item)} className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold ${territory === item ? "bg-[#008da3] text-white" : "bg-slate-100 text-slate-600"}`}>{item}</button>)}
        </div>
      </section>
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {loading && <p className="page-subtitle">Loading saved routes…</p>}
      {!loading && !filtered.length && !error && <section className="panel text-center"><p className="font-extrabold text-[#102d3d]">No routes found</p><p className="mt-2 text-sm text-slate-500">Build the first route or change your filters.</p></section>}
      {filtered.map((route) => {
        const completed = route.stops.filter((stop) => stop.status === "completed").length;
        return <button key={route.id} type="button" onClick={() => onSelect(route)} className="panel w-full text-left transition hover:-translate-y-0.5 hover:border-[#83bac4]">
          <div className="flex items-start justify-between gap-4">
            <div><span className="mb-2 inline-flex rounded-full bg-[#e3f1f3] px-2.5 py-1 text-[10px] font-extrabold text-[#00798d]">{route.territory}</span><h2 className="text-base font-extrabold text-[#102d3d]">{route.title}</h2><p className="mt-1 text-xs text-slate-500">Starts at {route.startName}</p></div>
            <span className="text-xl text-[#008da3]">→</span>
          </div>
          <div className="mt-4 flex gap-4 border-t border-slate-100 pt-3 text-xs font-bold text-slate-500"><span>{route.stops.length} stops</span><span>{route.totalDistanceMiles} mi</span><span>{completed}/{route.stops.length} complete</span></div>
        </button>;
      })}
    </div>
  </>;
}

function CreateRoute({ onCancel, onCreated }: { onCancel: () => void; onCreated: (route: SavedRoute) => void }) {
  const [title, setTitle] = useState("");
  const [territory, setTerritory] = useState<Territory>("N");
  const [startName, setStartName] = useState("");
  const [startAddress, setStartAddress] = useState("");
  const [prospects, setProspects] = useState<ProspectDraft[]>([blankProspect()]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateProspect(index: number, field: keyof ProspectDraft, value: string) {
    setProspects((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const response = await fetch("/api/routes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, territory, startName, startAddress, prospects }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "Unable to build route");
      onCreated(result as SavedRoute);
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Unable to build route"); }
    finally { setSaving(false); }
  }

  return <>
    <div className="page-heading"><p className="eyebrow">New prospect route</p><h1 className="page-title">Build a route</h1><p className="page-subtitle">Begin the title with your name, then add the donut-shop start and 1–20 prospects.</p></div>
    <form className="form-stack" onSubmit={submit}>
      <section className="panel space-y-4">
        <label><span className="field-label">Route name — your name first</span><input required maxLength={100} className="control" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ADAM — NORTH INDY DENTISTS" /></label>
        <div><span className="field-label">Territory</span><div className="grid grid-cols-4 gap-2">{territories.map((item) => <button key={item} type="button" onClick={() => setTerritory(item)} className={`choice-button border text-sm font-extrabold ${territory === item ? "border-[#008da3] bg-[#008da3] text-white" : "border-slate-200 bg-white text-slate-600"}`}>{item}</button>)}</div></div>
      </section>
      <section className="panel space-y-4"><div><p className="panel-title !mb-1">Starting location</p><p className="text-xs text-slate-500">The donut shop is always locked as the route start.</p></div><label><span className="field-label">Donut shop name</span><input required className="control" value={startName} onChange={(event) => setStartName(event.target.value)} placeholder="Donut shop name" /></label><label><span className="field-label">Address</span><input required className="control" value={startAddress} onChange={(event) => setStartAddress(event.target.value)} placeholder="Address, street, neighborhood, or city" /></label></section>
      <section className="panel space-y-5">
        <div><p className="panel-title !mb-1">Prospects</p><p className="text-xs text-slate-500">{prospects.length} of 20 · The first best location match is used automatically.</p></div>
        {prospects.map((prospect, index) => <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div className="mb-2 flex justify-between"><span className="text-[10px] font-extrabold tracking-wider text-[#102d3d]">STOP {index + 1}</span>{prospects.length > 1 && <button type="button" onClick={() => setProspects((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="text-[10px] font-bold text-red-500">REMOVE</button>}</div><div className="grid gap-2 sm:grid-cols-2"><input required className="control !min-h-12 !text-[15px]" value={prospect.businessName} onChange={(event) => updateProspect(index, "businessName", event.target.value)} placeholder="Business name" /><input required className="control !min-h-12 !text-[15px]" value={prospect.address} onChange={(event) => updateProspect(index, "address", event.target.value)} placeholder="Address, 30th St, Franklin…" /></div></div>)}
        {prospects.length < 20 && <button type="button" onClick={() => setProspects((current) => [...current, blankProspect()])} className="secondary-button !border-[#a7cdd3] !text-[#00798d]">+ ADD STOP</button>}
      </section>
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      {saving && <p className="rounded-xl bg-[#e8f4f5] p-4 text-sm font-semibold text-[#006f83]">Validating addresses and finding the best order… Larger routes can take a moment.</p>}
      <button disabled={saving} className="primary-button">{saving ? "OPTIMIZING ROUTE…" : "BUILD & SAVE ROUTE"}</button>
      <button type="button" disabled={saving} className="secondary-button" onClick={onCancel}>Cancel</button>
    </form>
  </>;
}

function RouteDetail({ route: initialRoute, isAdmin, onBack, onSaved, onDeleted }: { route: SavedRoute; isAdmin: boolean; onBack: () => void; onSaved: (route: SavedRoute) => void; onDeleted: (id: string) => void }) {
  const [route, setRoute] = useState(initialRoute);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const completeCount = useMemo(() => route.stops.filter((stop) => stop.status === "completed").length, [route.stops]);

  async function persist(next: SavedRoute) {
    setRoute(next); setSaving(true); setError("");
    const response = await fetch(`/api/routes/${route.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: next.title, territory: next.territory, stops: next.stops }) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { setError(result.error ?? "Unable to update route"); setRoute(route); return; }
    setRoute(result); onSaved(result);
  }

  function status(index: number, value: StopStatus) { void persist({ ...route, stops: route.stops.map((stop, itemIndex) => itemIndex === index ? { ...stop, status: value } : stop) }); }
  function move(index: number, direction: -1 | 1) { const next = [...route.stops]; const target = index + direction; if (target < 0 || target >= next.length) return; [next[index], next[target]] = [next[target], next[index]]; void persist({ ...route, stops: next }); }
  function reset() { void persist({ ...route, stops: route.stops.map((stop) => ({ ...stop, status: "pending" as const })) }); }

  async function remove() {
    if (!window.confirm(`Delete ${route.title}? This cannot be undone.`)) return;
    const response = await fetch(`/api/routes/${route.id}`, { method: "DELETE" });
    if (response.ok) onDeleted(route.id); else setError((await response.json()).error ?? "Unable to delete route");
  }

  return <>
    <button type="button" onClick={onBack} className="back-link mb-7">← Saved routes</button>
    <div className="page-heading">
      <div className="mb-3 flex items-center gap-2"><span className="rounded-full bg-[#e3f1f3] px-3 py-1 text-[10px] font-extrabold text-[#00798d]">{route.territory}</span>{saving && <span className="text-[10px] font-bold text-slate-400">SAVING…</span>}</div>
      <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-[#102d3d]">{route.title}</h1>
      <p className="page-subtitle">{route.stops.length} prospects · {route.totalDistanceMiles} miles · about {Math.floor(route.totalDurationMinutes / 60) ? `${Math.floor(route.totalDurationMinutes / 60)} hr ` : ""}{route.totalDurationMinutes % 60} min driving</p>
    </div>
    <div className="form-stack">
      <section className="quote-card"><p className="quote-kicker">Route progress</p><p className="quote-amount">{completeCount}/{route.stops.length}</p><div className="breakdown"><div className="h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#39c1d3]" style={{ width: `${(completeCount / route.stops.length) * 100}%` }} /></div></div></section>
      <section className="panel"><p className="text-[10px] font-extrabold tracking-[.14em] text-[#008da3]">START HERE</p><h2 className="mt-2 font-extrabold text-[#102d3d]">{route.startName}</h2><p className="mt-1 text-sm leading-5 text-slate-500">{route.startAddress}</p></section>
      <div className="space-y-3">{route.stops.map((stop, index) => <StopCard key={stop.id} stop={stop} index={index} onStatus={(value) => status(index, value)} onMove={(direction) => move(index, direction)} first={index === 0} last={index === route.stops.length - 1} />)}</div>
      {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      <button type="button" className="secondary-button" onClick={reset}>Reset route progress</button>
      <button type="button" className="secondary-button" onClick={() => setEditing(!editing)}>{editing ? "Close route settings" : "Rename or change territory"}</button>
      {editing && <RouteSettings route={route} onSave={(title, territory) => { void persist({ ...route, title, territory }); setEditing(false); }} />}
      {isAdmin && <button type="button" onClick={remove} className="min-h-12 rounded-xl border border-red-200 bg-red-50 px-4 text-sm font-extrabold text-red-600">Delete route</button>}
    </div>
  </>;
}

function StopCard({ stop, index, onStatus, onMove, first, last }: { stop: RouteStop; index: number; onStatus: (status: StopStatus) => void; onMove: (direction: -1 | 1) => void; first: boolean; last: boolean }) {
  const tone = stop.status === "completed" ? "border-emerald-200 bg-emerald-50" : stop.status === "skipped" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white";
  return <article className={`rounded-2xl border p-4 shadow-sm ${tone}`}><div className="flex gap-4"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#15394b] text-sm font-extrabold text-white">{index + 1}</div><div className="min-w-0 flex-1"><h3 className={`font-extrabold text-[#102d3d] ${stop.status === "completed" ? "line-through opacity-60" : ""}`}>{stop.businessName}</h3><p className="mt-1 text-sm leading-5 text-slate-500">{stop.address}</p>{stop.resolvedAddress && <p className="mt-2 text-[10px] font-semibold leading-4 text-slate-400">MATCHED TO: {stop.resolvedAddress}</p>}<div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => onStatus(stop.status === "completed" ? "pending" : "completed")} className="rounded-lg bg-emerald-100 px-3 py-2 text-[10px] font-extrabold text-emerald-700">{stop.status === "completed" ? "UNDO" : "COMPLETE"}</button><button type="button" onClick={() => onStatus(stop.status === "skipped" ? "pending" : "skipped")} className="rounded-lg bg-amber-100 px-3 py-2 text-[10px] font-extrabold text-amber-700">{stop.status === "skipped" ? "UNDO" : "SKIP"}</button><button disabled={first} type="button" onClick={() => onMove(-1)} className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-600 disabled:opacity-30">↑</button><button disabled={last} type="button" onClick={() => onMove(1)} className="rounded-lg bg-slate-100 px-3 py-2 text-[10px] font-extrabold text-slate-600 disabled:opacity-30">↓</button></div></div></div></article>;
}

function RouteSettings({ route, onSave }: { route: SavedRoute; onSave: (title: string, territory: Territory) => void }) {
  const [title, setTitle] = useState(route.title); const [territory, setTerritory] = useState(route.territory);
  return <section className="panel space-y-4"><label><span className="field-label">Route name</span><input className="control" value={title} onChange={(event) => setTitle(event.target.value)} /></label><div><span className="field-label">Territory</span><div className="grid grid-cols-4 gap-2">{territories.map((item) => <button type="button" key={item} onClick={() => setTerritory(item)} className={`choice-button border text-sm font-extrabold ${territory === item ? "border-[#008da3] bg-[#008da3] text-white" : "border-slate-200 bg-white text-slate-600"}`}>{item}</button>)}</div></div><button type="button" disabled={!title.trim()} className="primary-button" onClick={() => onSave(title.trim(), territory)}>SAVE SETTINGS</button></section>;
}
