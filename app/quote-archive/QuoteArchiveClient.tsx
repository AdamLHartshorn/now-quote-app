"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { QuoteArchiveEntry } from "@/lib/quote-archive-types";
import BrandLockup from "@/components/BrandLockup";

export default function QuoteArchiveClient({ isAdmin }: { isAdmin: boolean }) {
  const [quotes, setQuotes] = useState<QuoteArchiveEntry[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quotes", { cache: "no-store" })
      .then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error ?? "Unable to load quotes"); return result as QuoteArchiveEntry[]; })
      .then((result) => { if (!cancelled) setQuotes(result); })
      .catch((loadError: unknown) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load quotes"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => quotes.filter((quote) => `${quote.customerName} ${quote.quoteType}`.toLowerCase().includes(search.toLowerCase())), [quotes, search]);

  async function remove(quote: QuoteArchiveEntry) {
    if (!window.confirm(`Delete the archived quote for ${quote.customerName}?`)) return;
    const response = await fetch(`/api/quotes/${quote.id}`, { method: "DELETE" });
    if (response.ok) { setQuotes((current) => current.filter((item) => item.id !== quote.id)); setSelected(null); }
    else setError((await response.json()).error ?? "Unable to delete quote");
  }

  return (
    <main className="app-shell"><div className="page-frame">
      <header className="topbar"><Link href="/" className="back-link">← Quote menu</Link><BrandLockup compact /></header>
      <div className="page-heading"><p className="eyebrow">Shared reference library</p><h1 className="page-title">Quote archive</h1><p className="page-subtitle">Saved calculator results only—no pipeline, ownership, or follow-up activity.</p></div>
      <div className="form-stack">
        <input className="control" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search customer or quote type" />
        {error && <p className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
        {loading && <p className="page-subtitle">Loading quote archive…</p>}
        {!loading && !filtered.length && <section className="panel text-center"><p className="font-extrabold text-[#102d3d]">No archived quotes found</p><p className="mt-2 text-sm text-slate-500">Quotes saved from any calculator will appear here.</p></section>}
        {filtered.map((quote) => <button type="button" key={quote.id} onClick={() => setSelected(selected === quote.id ? null : quote.id)} className="panel w-full text-left"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-extrabold tracking-[.12em] text-[#008da3]">{quote.quoteType}</p><h2 className="mt-1 font-extrabold text-[#102d3d]">{quote.customerName}</h2><p className="mt-1 text-xs text-slate-500">{new Date(quote.createdAt).toLocaleString()} · Rate version {quote.rateVersion}</p></div><p className="text-xl font-extrabold text-[#102d3d]">${quote.amount.toFixed(2)}</p></div>{selected === quote.id && <div className="mt-5 border-t border-slate-200 pt-4"><dl className="grid gap-2 text-sm">{Object.entries(quote.summary).map(([key, value]) => <div key={key} className="flex justify-between gap-4"><dt className="text-slate-500">{key}</dt><dd className="text-right font-bold text-[#102d3d]">{typeof value === "boolean" ? (value ? "Yes" : "No") : String(value)}</dd></div>)}</dl>{isAdmin && <button type="button" onClick={(event) => { event.stopPropagation(); void remove(quote); }} className="mt-5 text-xs font-extrabold text-red-600">DELETE ARCHIVED QUOTE</button>}</div>}</button>)}
      </div>
    </div></main>
  );
}
