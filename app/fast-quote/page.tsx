"use client";

import { useState } from "react";

import {
  parcelServiceRates,
  parcelVehicleConfig,
  fuelSurcharge,
  accessorialRates,
} from "@/config/rates";

export default function FastQuote() {
  const [serviceType, setServiceType] =
    useState<keyof typeof parcelServiceRates>("Direct");

  const [vehicle, setVehicle] =
    useState<keyof typeof parcelVehicleConfig>("Car");

  const [miles, setMiles] = useState("");

  const [afterHours, setAfterHours] = useState(false);
  const [airport, setAirport] = useState(false);
  const [liftgate, setLiftgate] = useState(false);

  const selectedService = parcelServiceRates[serviceType];
  const selectedVehicle = parcelVehicleConfig[vehicle];

  const mileage = Number(miles) || 0;

  const mileageRate =
    mileage > 50
      ? selectedVehicle.over50MileRate
      : selectedService.ratePerMile;

  const baseTransport =
    Math.max(
      selectedService.minimum,
      mileage * mileageRate
    ) + selectedVehicle.upcharge;

  const fuelPercent =
    fuelSurcharge[selectedVehicle.fuelClass];

  const fuelCharge =
    baseTransport * fuelPercent;

  const accessorialTotal =
    (afterHours ? accessorialRates.parcelAfterHours : 0) +
    (airport ? accessorialRates.airport : 0) +
    (liftgate ? accessorialRates.liftgate : 0);

  const estimatedQuote =
    baseTransport +
    fuelCharge +
    accessorialTotal;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="text-gray-400 text-sm">
          ← Back
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-2">
          FAST QUOTE
        </h1>

        <p className="text-gray-400 mb-8">
          Quick parcel-style quote.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-gray-300">
              Service Type
            </span>

            <select
              value={serviceType}
              onChange={(event) =>
                setServiceType(
                  event.target.value as keyof typeof parcelServiceRates
                )
              }
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            >
              {Object.keys(parcelServiceRates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">
              Vehicle
            </span>

            <select
              value={vehicle}
              onChange={(event) =>
                setVehicle(
                  event.target.value as keyof typeof parcelVehicleConfig
                )
              }
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            >
              {Object.keys(parcelVehicleConfig).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">
              Miles
            </span>

            <input
              type="number"
              value={miles}
              onChange={(event) => setMiles(event.target.value)}
              placeholder="Enter miles"
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            />
          </label>

          <section className="rounded-2xl bg-gray-900 border border-gray-700 p-4">
            <p className="text-sm text-gray-300 mb-3">
              Add-ons
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setAfterHours(!afterHours)}
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  afterHours
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                After Hours
              </button>

              <button
                onClick={() => setAirport(!airport)}
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  airport
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Airport
              </button>

              <button
                onClick={() => setLiftgate(!liftgate)}
                className={`rounded-xl p-4 text-lg font-semibold border ${
                  liftgate
                    ? "bg-red-600 border-red-500"
                    : "bg-black border-gray-700"
                }`}
              >
                Liftgate
              </button>
            </div>
          </section>

          <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 text-center">
            <p className="text-gray-400 text-sm">
              Estimated Quote
            </p>

            <p className="text-5xl font-bold mt-2">
              ${estimatedQuote.toFixed(2)}
            </p>

            <div className="text-gray-500 text-sm mt-4 space-y-1">
              <p>Transport: ${baseTransport.toFixed(2)}</p>
              <p>
                Fuel ({(fuelPercent * 100).toFixed(1)}%): $
                {fuelCharge.toFixed(2)}
              </p>
              <p>Add-ons: ${accessorialTotal.toFixed(2)}</p>
              <p>
                {vehicle} / {serviceType} @ ${mileageRate.toFixed(2)}/mile
              </p>
              <p>Minimum: ${selectedService.minimum.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}