"use client";

import { useState } from "react";

export default function SaveQuote({ quoteType, amount, summary, rateVersion, customerName }: { quoteType: string; amount: number; summary: Record<string, string | number | boolean>; rateVersion: number; customerName: string }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save() {
    if (!customerName.trim()) { setError("Enter or select a customer name above."); return; }
    setSaving(true); setError(""); setMessage("");
    const response = await fetch("/api/quotes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerName, quoteType, amount, summary, rateVersion }) });
    const result = await response.json(); setSaving(false);
    if (!response.ok) { setError(result.error ?? "Unable to archive quote"); return; }
    setMessage("Quote saved to the shared archive.");
  }

  return <div className="sticky bottom-4 z-10 mt-2 rounded-2xl border border-white/80 bg-white/95 p-2.5 shadow-[0_16px_45px_rgba(16,45,61,.18)] backdrop-blur"><div className="flex items-center gap-3"><div className="min-w-0 flex-1 px-2"><p className="truncate text-sm font-extrabold text-[#102d3d]">{customerName.trim() || "Customer name required"}</p><p className="text-xs text-slate-500">Save this ${amount.toFixed(2)} quote</p></div><button type="button" disabled={saving || amount <= 0} onClick={save} className="primary-button !min-h-12 !w-auto shrink-0 !px-5">{saving ? "SAVING…" : "SAVE QUOTE"}</button></div>{error && <p className="px-2 pt-2 text-sm font-bold text-red-600">{error}</p>}{message && <p className="px-2 pt-2 text-sm font-bold text-emerald-700">{message}</p>}</div>;
}
