"use client";

import { useState } from "react";

export default function MileageLookup({ pickup, delivery, onPickupChange, onDeliveryChange, onMileage }: { pickup: string; delivery: string; onPickupChange: (value: string) => void; onDeliveryChange: (value: string) => void; onMileage: (miles: number) => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ miles: number; minutes: number; pickupMatch: string; deliveryMatch: string } | null>(null);
  const [error, setError] = useState("");

  async function calculate() {
    setLoading(true); setError(""); setResult(null);
    try {
      const response = await fetch("/api/mileage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pickup, delivery }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to calculate mileage");
      setResult(data); onMileage(data.miles);
    } catch (lookupError) { setError(lookupError instanceof Error ? lookupError.message : "Unable to calculate mileage"); }
    finally { setLoading(false); }
  }

  return <section className="panel mt-3 space-y-5"><div><p className="panel-title !mb-1">Route mileage</p><p className="text-sm leading-6 text-slate-500">Enter a full address or a recognizable location. Calculated mileage remains editable below.</p></div><label><span className="field-label">Pickup</span><input className="control" value={pickup} onChange={(event) => onPickupChange(event.target.value)} placeholder="Pickup address or location" /></label><label><span className="field-label">Delivery</span><input className="control" value={delivery} onChange={(event) => onDeliveryChange(event.target.value)} placeholder="Delivery address or location" /></label><button type="button" className="secondary-button !border-[#8fc2ca] !text-[#00798d]" disabled={loading || !pickup.trim() || !delivery.trim()} onClick={calculate}>{loading ? "CALCULATING DRIVING ROUTE…" : "CALCULATE DRIVING MILES"}</button>{error && <p className="text-sm font-bold text-red-600">{error}</p>}{result && <div className="rounded-xl bg-[#edf7f8] p-4 text-sm leading-6 text-[#38515e]"><p className="font-extrabold text-[#00798d]">{result.miles} miles · about {result.minutes} minutes</p><p className="mt-1 text-xs text-slate-500">Pickup match: {result.pickupMatch}</p><p className="text-xs text-slate-500">Delivery match: {result.deliveryMatch}</p></div>}</section>;
}
