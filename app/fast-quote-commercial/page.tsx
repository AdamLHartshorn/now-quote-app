"use client";

import { useState } from "react";

import {
  commercialEquipmentConfig,
  fuelSurcharge,
} from "@/config/rates";

export default function FastQuoteCommercial() {
  const [equipment, setEquipment] =
    useState<keyof typeof commercialEquipmentConfig>("Dock Truck");

  const selectedEquipment =
    commercialEquipmentConfig[equipment];

  type ServiceType =
    keyof typeof selectedEquipment.serviceRates;

  const availableServices =
    Object.keys(selectedEquipment.serviceRates) as ServiceType[];

  const [serviceType, setServiceType] =
    useState<string>("Direct");

  const [miles, setMiles] = useState("");
  const [afterHours, setAfterHours] = useState(false);
  const [moffett, setMoffett] = useState(false);

  const safeServiceType =
    availableServices.includes(serviceType as ServiceType)
      ? (serviceType as ServiceType)
      : availableServices[0];

  const selectedService =
    selectedEquipment.serviceRates[safeServiceType];

  const mileage = Number(miles) || 0;

  const baseTransport =
    selectedService.base +
    mileage * selectedService.ratePerMile;

  const overThresholdCharge =
    "overThresholdEntireTripRate" in selectedEquipment &&
    mileage > selectedEquipment.overMileageThreshold
      ? mileage * selectedEquipment.overThresholdEntireTripRate
      : "overThresholdAdditionalPerMile" in selectedEquipment &&
          mileage > selectedEquipment.overMileageThreshold
        ? (mileage - selectedEquipment.overMileageThreshold) *
          selectedEquipment.overThresholdAdditionalPerMile
        : 0;

  const transport =
    baseTransport + overThresholdCharge;

  const fuelPercent =
    fuelSurcharge[selectedEquipment.fuelClass];

  const fuel =
    transport * fuelPercent;

  const afterHoursCharge =
    afterHours ? selectedEquipment.afterHours : 0;

  const moffettCharge =
    moffett &&
    selectedEquipment.moffettAllowed &&
    "moffettCharge" in selectedEquipment
      ? selectedEquipment.moffettCharge
      : 0;

  const total =
    transport +
    fuel +
    afterHoursCharge +
    moffettCharge;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="text-slate-400 text-sm">
          ← Back
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-2">
          FAST QUOTE — COMMERCIAL
        </h1>

        <p className="text-slate-400 mb-8">
          Ballpark commercial quote for quick customer conversations.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">
              Equipment
            </span>

            <select
              value={equipment}
              onChange={(event) => {
                setEquipment(
                  event.target.value as keyof typeof commercialEquipmentConfig
                );
                setServiceType("Direct");
              }}
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            >
              {Object.keys(commercialEquipmentConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">
              Service Type
            </span>

            <select
              value={safeServiceType}
              onChange={(event) =>
                setServiceType(event.target.value)
              }
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            >
              {availableServices.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">
              Miles
            </span>

            <input
              type="number"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              placeholder="Enter miles"
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            />
          </label>

          <section className="rounded-2xl bg-slate-900 border border-slate-700 p-4">
            <p className="text-sm text-slate-300 mb-3">
              Quick Add-ons
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAfterHours(!afterHours)}
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  afterHours
                    ? "bg-blue-600 border-blue-500"
                    : "bg-slate-950 border-slate-700"
                }`}
              >
                After Hours
              </button>

              <button
                onClick={() => setMoffett(!moffett)}
                disabled={!selectedEquipment.moffettAllowed}
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  !selectedEquipment.moffettAllowed
                    ? "bg-slate-800 border-slate-700 text-slate-600"
                    : moffett
                      ? "bg-blue-600 border-blue-500"
                      : "bg-slate-950 border-slate-700"
                }`}
              >
                Moffett
              </button>
            </div>
          </section>

          <div className="rounded-2xl bg-slate-900 border border-slate-700 p-6 text-center">
            <p className="text-slate-400 text-sm">
              Ballpark Quote
            </p>

            <p className="text-5xl font-bold mt-2">
              ${total.toFixed(2)}
            </p>

            <div className="text-slate-500 text-sm mt-4 space-y-1">
              <p>Transport: ${transport.toFixed(2)}</p>
              <p>
                Fuel ({(fuelPercent * 100).toFixed(1)}%): $
                {fuel.toFixed(2)}
              </p>
              <p>
                Add-ons: $
                {(afterHoursCharge + moffettCharge).toFixed(2)}
              </p>
              <p>
                {equipment} / {safeServiceType}
              </p>
              <p className="pt-2 text-slate-400">
                Ballpark only — confirm details for final quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}