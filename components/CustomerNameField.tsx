"use client";

import { useEffect, useState } from "react";
import type { QuoteArchiveEntry } from "@/lib/quote-archive-types";

export default function CustomerNameField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [customers, setCustomers] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quotes", { cache: "no-store" }).then((response) => response.ok ? response.json() : []).then((quotes: QuoteArchiveEntry[]) => {
      if (!cancelled) setCustomers([...new Set(quotes.map((quote) => quote.customerName))].sort((a, b) => a.localeCompare(b)));
    });
    return () => { cancelled = true; };
  }, []);

  return <section className="panel"><label><span className="field-label">Customer name</span><input className="control" list="customer-name-options" value={value} onChange={(event) => onChange(event.target.value)} placeholder="Type or select a customer" /><datalist id="customer-name-options">{customers.map((customer) => <option key={customer} value={customer} />)}</datalist></label><p className="mt-2 text-sm leading-5 text-slate-500">Required only when saving the quote.</p></section>;
}
