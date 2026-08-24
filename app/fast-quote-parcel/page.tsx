"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  parcelServiceRates,
  parcelVehicleConfig,
} from "@/config/rates";
import { useFuelSettings } from "@/lib/fuel-settings";

export default function FastQuoteParcel() {
  const fuelSurcharge = useFuelSettings();
  const [serviceType, setServiceType] =
    useState<keyof typeof parcelServiceRates>("Direct");

  const [vehicle, setVehicle] =
    useState<keyof typeof parcelVehicleConfig>("Car");

  const [miles, setMiles] = useState("");
  const [weight, setWeight] = useState("");

  const selectedService = parcelServiceRates[serviceType];
  const selectedVehicle = parcelVehicleConfig[vehicle];

  const mileage = Number(miles) || 0;
  const shipmentWeight = Number(weight) || 0;

  const mileageRate =
    mileage > 50
      ? selectedVehicle.over50MileRate
      : selectedService.ratePerMile;

  const transport =
    Math.max(selectedService.minimum, mileage * mileageRate) +
    selectedVehicle.upcharge;

  const overweightAmount = Math.max(
    0,
    shipmentWeight - selectedVehicle.includedWeight
  );

  const overweightCharge =
    Math.ceil(overweightAmount / 100) *
    selectedVehicle.overweightRatePerCwt;

  const fuelPercent = fuelSurcharge[selectedVehicle.fuelClass];
  const fuel = transport * fuelPercent;

  const total = transport + overweightCharge + fuel;

  return (
    <main className="min-h-screen bg-white text-slate-900 p-6">
      <div className="mx-auto w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-slate-500 text-sm">
            ← Back
          </Link>

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
            FAST QUOTE — PARCEL
          </h1>

          <p className="text-slate-500">
            Ballpark parcel quote for quick customer conversations.
          </p>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
              Service Type
            </span>

            <select
              value={serviceType}
              onChange={(event) =>
                setServiceType(
                  event.target.value as keyof typeof parcelServiceRates
                )
              }
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            >
              {Object.keys(parcelServiceRates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
              Vehicle
            </span>

            <select
              value={vehicle}
              onChange={(event) =>
                setVehicle(
                  event.target.value as keyof typeof parcelVehicleConfig
                )
              }
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            >
              {Object.keys(parcelVehicleConfig).map((item) => (
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
              <p>
                {vehicle} / {serviceType}
              </p>
              <p className="pt-2 text-slate-500">
                Ballpark only — final invoice may vary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
