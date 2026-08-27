"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { usePricingSettings } from "@/lib/pricing-settings";
import { calculateCommercialTransport } from "@/lib/pricing-engine";
import SaveQuote from "@/components/SaveQuote";
import MileageLookup from "@/components/MileageLookup";
import CustomerNameField from "@/components/CustomerNameField";

export default function FastQuoteCommercial() {
  const { config, version } = usePricingSettings();
  const { commercialEquipmentConfig, fuelSurcharge } = config;
  const [equipment, setEquipment] =
    useState<keyof typeof commercialEquipmentConfig>("Dock Truck");

  const selectedEquipment = commercialEquipmentConfig[equipment];

  type ServiceType = keyof typeof selectedEquipment.serviceRates;

  const availableServices =
    Object.keys(selectedEquipment.serviceRates) as ServiceType[];

  const [serviceType, setServiceType] = useState<string>("Direct");

  const [miles, setMiles] = useState("");
  const [weight, setWeight] = useState("");
  const [moffett, setMoffett] = useState(false);
  const [pickupAddress, setPickupAddress] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [customerName, setCustomerName] = useState("");

  const safeServiceType =
    availableServices.includes(serviceType as ServiceType)
      ? (serviceType as ServiceType)
      : availableServices[0];

  const selectedService = selectedEquipment.serviceRates[safeServiceType];

  const mileage = Number(miles) || 0;
  const shipmentWeight = Number(weight) || 0;

  const transport = calculateCommercialTransport(mileage, selectedService, selectedEquipment);

  const overweightAmount = Math.max(
    0,
    shipmentWeight - selectedEquipment.includedWeight
  );

  const overweightCharge =
    Math.ceil(overweightAmount / 100) *
    selectedEquipment.overweightRatePerCwt;

  const fuelPercent = fuelSurcharge[selectedEquipment.fuelClass];
  const fuel = transport * fuelPercent;

  const moffettCharge =
    moffett &&
    selectedEquipment.moffettAllowed &&
    "moffettCharge" in selectedEquipment
      ? selectedEquipment.moffettCharge
      : 0;

  const total = transport + overweightCharge + fuel + moffettCharge;

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
          <p className="eyebrow">Fast quote</p>
          <h1 className="page-title">Commercial</h1>

          <p className="page-subtitle">
            Ballpark commercial quote for quick customer conversations.
          </p>
        </div>

        <div className="form-stack">
          <CustomerNameField value={customerName} onChange={setCustomerName} />
          <MileageLookup pickup={pickupAddress} delivery={deliveryAddress} onPickupChange={setPickupAddress} onDeliveryChange={setDeliveryAddress} onMileage={(value) => setMiles(String(value))} />

          <label className="block">
            <span className="field-label">
              Equipment
            </span>

            <select
              value={equipment}
              onChange={(event) => {
                setEquipment(
                  event.target.value as keyof typeof commercialEquipmentConfig
                );
                setServiceType("Direct");
                setMoffett(false);
              }}
              className="control"
            >
              {Object.keys(commercialEquipmentConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">
              Service Type
            </span>

            <select
              value={safeServiceType}
              onChange={(event) => setServiceType(event.target.value)}
              className="control"
            >
              {availableServices.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">
              Miles
            </span>

            <input
              type="number"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              placeholder="Enter miles"
              className="control"
            />
          </label>

          <label className="block">
            <span className="field-label">
              Weight (lbs)
            </span>

            <input
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="Optional"
              className="control"
            />
          </label>

          <section className="panel">
            <p className="panel-title">
              Quick Add-ons
            </p>

            <button
              onClick={() => setMoffett(!moffett)}
              disabled={!selectedEquipment.moffettAllowed}
              className={`choice-button w-full p-4 text-base font-semibold border ${
                !selectedEquipment.moffettAllowed
                  ? "bg-slate-200 border-slate-300 text-slate-400"
                  : moffett
                    ? "bg-[#0093aa] border-[#0093aa] text-white"
                    : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              Moffett
            </button>
          </section>

          <div className="quote-card">
            <p className="quote-kicker">Ballpark quote</p>

            <p className="quote-amount">
              ${total.toFixed(2)}
            </p>

            <div className="breakdown">
              <p>Transport: ${transport.toFixed(2)}</p>
              <p>Overweight: ${overweightCharge.toFixed(2)}</p>
              <p>
                Fuel ({(fuelPercent * 100).toFixed(1)}%): $
                {fuel.toFixed(2)}
              </p>
              <p>Moffett: ${moffettCharge.toFixed(2)}</p>
              <p>
                {equipment} / {safeServiceType}
              </p>
              <p className="pt-2 text-slate-500">
                Ballpark only — confirm details for final quote.
              </p>
            </div>
          </div>
          <SaveQuote quoteType="Fast Quote — Commercial" amount={total} rateVersion={version} customerName={customerName} summary={{ Equipment: equipment, Service: safeServiceType, Pickup: pickupAddress || "Not entered", Delivery: deliveryAddress || "Not entered", Miles: mileage, "Weight (lbs)": shipmentWeight, Moffett: moffett, Transport: `$${transport.toFixed(2)}`, Fuel: `$${fuel.toFixed(2)}`, Total: `$${total.toFixed(2)}` }} />
        </div>
      </div>
    </main>
  );
}
