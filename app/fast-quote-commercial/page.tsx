"use client";

import { useState } from "react";
import Image from "next/image";

import {
  commercialEquipmentConfig,
  fuelSurcharge,
} from "@/config/rates";

export default function FastQuoteCommercial() {
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

  const safeServiceType =
    availableServices.includes(serviceType as ServiceType)
      ? (serviceType as ServiceType)
      : availableServices[0];

  const selectedService = selectedEquipment.serviceRates[safeServiceType];

  const mileage = Number(miles) || 0;
  const shipmentWeight = Number(weight) || 0;

  const baseTransport =
    selectedService.base + mileage * selectedService.ratePerMile;

  const overThresholdCharge =
    "overThresholdEntireTripRate" in selectedEquipment &&
    mileage > selectedEquipment.overMileageThreshold
      ? mileage * selectedEquipment.overThresholdEntireTripRate
      : "overThresholdAdditionalPerMile" in selectedEquipment &&
          mileage > selectedEquipment.overMileageThreshold
        ? (mileage - selectedEquipment.overMileageThreshold) *
          selectedEquipment.overThresholdAdditionalPerMile
        : 0;

  const transport = baseTransport + overThresholdCharge;

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
    <main className="min-h-screen bg-white text-slate-900 p-6">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <a href="/" className="text-slate-500 text-sm">
            ← Back
          </a>

          <Image
            src="/now-logo.jpg"
            alt="NOW Courier"
            width={130}
            height={45}
            priority
          />
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            FAST QUOTE — COMMERCIAL
          </h1>

          <p className="text-slate-500">
            Ballpark commercial quote for quick customer conversations.
          </p>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
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
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            >
              {Object.keys(commercialEquipmentConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
              Service Type
            </span>

            <select
              value={safeServiceType}
              onChange={(event) => setServiceType(event.target.value)}
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            >
              {availableServices.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
              Miles
            </span>

            <input
              type="number"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              placeholder="Enter miles"
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            />
          </label>

          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
              Weight (lbs)
            </span>

            <input
              type="number"
              value={weight}
              onChange={(event) => setWeight(event.target.value)}
              placeholder="Optional"
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            />
          </label>

          <section className="rounded-2xl bg-slate-100 border border-slate-300 p-4 shadow-sm">
            <p className="text-sm text-slate-600 font-medium mb-3">
              Quick Add-ons
            </p>

            <button
              onClick={() => setMoffett(!moffett)}
              disabled={!selectedEquipment.moffettAllowed}
              className={`w-full rounded-xl p-4 text-lg font-semibold border ${
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

          <div className="rounded-2xl bg-slate-100 border border-slate-300 p-6 text-center shadow-sm">
            <p className="text-slate-500 text-sm">Ballpark Quote</p>

            <p className="text-5xl font-bold mt-2 text-slate-900">
              ${total.toFixed(2)}
            </p>

            <div className="text-slate-600 text-sm mt-4 space-y-1">
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
        </div>
      </div>
    </main>
  );
}