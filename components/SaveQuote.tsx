"use client";

import { useEffect, useState } from "react";

import type { QuoteArchiveEntry } from "@/lib/quote-archive-types";

export default function SaveQuote({ quoteType, amount, summary, rateVersion, defaultCustomer = "" }: { quoteType: string; amount: number; summary: Record<string, string | number | boolean>; rateVersion: number; defaultCustomer?: string }) {
  const [customerName, setCustomerName] = useState(defaultCustomer);
  const [customers, setCustomers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const selectedCustomer = customerName || defaultCustomer;

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quotes", { cache: "no-store" }).then((response) => response.ok ? response.json() : []).then((quotes: QuoteArchiveEntry[]) => {
      if (!cancelled) setCustomers([...new Set(quotes.map((quote) => quote.customerName))].sort((a, b) => a.localeCompare(b)));
    });
    return () => { cancelled = true; };
  }, []);

  async function save() {
    if (!selectedCustomer.trim()) { setError("Enter or select a customer name."); return; }
    setSaving(true); setError(""); setMessage("");
    const response = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerName: selectedCustomer, quoteType, amount, summary, rateVersion }) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { setError(result.error ?? "Unable to archive quote"); return; }
    setMessage("Quote saved to the shared archive.");
    if (!customers.includes(selectedCustomer.trim())) setCustomers((current) => [...current, selectedCustomer.trim()].sort((a, b) => a.localeCompare(b)));
  }

  return <section className="panel sticky bottom-4 z-10 space-y-3 border-white/80 bg-white/95 backdrop-blur"><div><p className="panel-title !mb-1">Save this quote</p><p className="text-xs text-slate-500">Archive this calculation for future reference. This does not create pipeline activity.</p></div><label><span className="field-label">Customer name</span><input className="control" list="saved-customer-names" value={selectedCustomer} onChange={(event) => setCustomerName(event.target.value)} placeholder="Type or select a customer" /><datalist id="saved-customer-names">{customers.map((customer) => <option key={customer} value={customer} />)}</datalist></label>{error && <p className="text-xs font-bold text-red-600">{error}</p>}{message && <p className="text-xs font-bold text-emerald-700">{message}</p>}<button type="button" disabled={saving || amount <= 0} onClick={save} className="primary-button">{saving ? "SAVING…" : "SAVE TO QUOTE ARCHIVE"}</button></section>;
}
