"use client";

import { useState } from "react";

import {
  parcelServiceRates,
  parcelVehicleConfig,
  fuelSurcharge,
} from "@/config/rates";

export default function FastQuoteParcel() {
  const [serviceType, setServiceType] =
    useState<keyof typeof parcelServiceRates>("Direct");

  const [vehicle, setVehicle] =
    useState<keyof typeof parcelVehicleConfig>("Car");

  const [miles, setMiles] = useState("");

  const selectedService = parcelServiceRates[serviceType];
  const selectedVehicle = parcelVehicleConfig[vehicle];

  const mileage = Number(miles) || 0;

  const mileageRate =
    mileage > 50
      ? selectedVehicle.over50MileRate
      : selectedService.ratePerMile;

  const transport =
    Math.max(
      selectedService.minimum,
      mileage * mileageRate
    ) + selectedVehicle.upcharge;

  const fuelPercent =
    fuelSurcharge[selectedVehicle.fuelClass];

  const fuel =
    transport * fuelPercent;

  const total =
    transport + fuel;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="text-slate-400 text-sm">
          ← Back
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-2">
          FAST QUOTE — PARCEL
        </h1>

        <p className="text-slate-400 mb-8">
          Ballpark parcel quote for quick customer conversations.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-300">
              Service Type
            </span>

            <select
              value={serviceType}
              onChange={(event) =>
                setServiceType(
                  event.target.value as keyof typeof parcelServiceRates
                )
              }
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            >
              {Object.keys(parcelServiceRates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-300">
              Vehicle
            </span>

            <select
              value={vehicle}
              onChange={(event) =>
                setVehicle(
                  event.target.value as keyof typeof parcelVehicleConfig
                )
              }
              className="mt-2 w-full rounded-xl bg-slate-900 border border-slate-700 p-4 text-xl"
            >
              {Object.keys(parcelVehicleConfig).map((item) => (
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
                {vehicle} / {serviceType} @ ${mileageRate.toFixed(2)}/mile
              </p>
              <p className="pt-2 text-slate-400">
                Ballpark only — final invoice may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}