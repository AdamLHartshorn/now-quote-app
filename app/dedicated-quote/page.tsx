"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { usePricingSettings } from "@/lib/pricing-settings";
import SaveQuote from "@/components/SaveQuote";
import CustomerNameField from "@/components/CustomerNameField";

export default function DedicatedQuote() {
  const { config, version } = usePricingSettings();
  const { dedicatedRates, fuelSurcharge, globalPricingRules } = config;
  const [equipment, setEquipment] =
    useState<keyof typeof dedicatedRates>("Car");

  const [hours, setHours] = useState("");
  const [customerName, setCustomerName] = useState("");

  const selectedRate = dedicatedRates[equipment];
  const rawHours = Number(hours) || 0;

  const billedHours = Math.max(
    globalPricingRules.dedicatedMinimumHours,
    Math.ceil(rawHours / globalPricingRules.dedicatedBillingIncrementHours) *
      globalPricingRules.dedicatedBillingIncrementHours
  );

  const fuelPercent = fuelSurcharge[selectedRate.fuelClass];

  const loadedHourlyRate =
    selectedRate.hourly * (1 + fuelPercent);

  const total = billedHours * loadedHourlyRate;

  return (
    <main className="app-shell">
      <div className="page-frame">
        <div className="topbar">
          <Link href="/" className="back-link">
            ← Back
          </Link>

          <Image
            src="/now-logo.jpg"
            alt="NOW Courier"
            width={130}
            height={45}
            priority
            className="brand-logo"
          />
        </div>

        <div className="page-heading">
          <p className="eyebrow">Hourly service</p>
          <h1 className="page-title">Dedicated</h1>

          <p className="page-subtitle">
            Hourly dedicated pricing with a {globalPricingRules.dedicatedMinimumHours}-hour minimum.
          </p>
        </div>

        <div className="form-stack">
          <CustomerNameField value={customerName} onChange={setCustomerName} />
          <label className="block">
            <span className="field-label">
              Equipment
            </span>

            <select
              value={equipment}
              onChange={(event) =>
                setEquipment(
                  event.target.value as keyof typeof dedicatedRates
                )
              }
              className="control"
            >
              {Object.keys(dedicatedRates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">
              Estimated Hours
            </span>

            <input
              type="number"
              step="0.25"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              placeholder="Enter hours"
              className="control"
            />
          </label>

          <div className="quote-card">
            <p className="quote-kicker">
              Estimated Dedicated Quote
            </p>

            <p className="quote-amount">
              ${total.toFixed(2)}
            </p>

            <div className="breakdown">
              <p>Billed Hours: {billedHours.toFixed(2)}</p>
              <p>Base Hourly: ${selectedRate.hourly.toFixed(2)}</p>
              <p>Fuel: {(fuelPercent * 100).toFixed(1)}%</p>
              <p>Loaded Hourly: ${loadedHourlyRate.toFixed(2)}</p>
            </div>
          </div>
          <SaveQuote quoteType="Dedicated Quote" amount={total} rateVersion={version} customerName={customerName} summary={{ Equipment: equipment, "Entered hours": rawHours, "Billed hours": billedHours, "Loaded hourly": `$${loadedHourlyRate.toFixed(2)}`, Total: `$${total.toFixed(2)}` }} />
        </div>
      </div>
    </main>
  );
}
