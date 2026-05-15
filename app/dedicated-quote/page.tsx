"use client";

import { useState } from "react";
import { dedicatedRates, fuelSurcharge } from "@/config/rates";

export default function DedicatedQuote() {
  const [equipment, setEquipment] =
    useState<keyof typeof dedicatedRates>("Car");

  const [hours, setHours] = useState("");

  const selectedRate = dedicatedRates[equipment];

  const rawHours = Number(hours) || 0;

  const billedHours = Math.max(
    4,
    Math.ceil(rawHours * 4) / 4
  );

  const fuelPercent =
    fuelSurcharge[selectedRate.fuelClass];

  const loadedHourlyRate =
    selectedRate.hourly * (1 + fuelPercent);

  const total =
    billedHours * loadedHourlyRate;

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto w-full max-w-md">
        <a href="/" className="text-gray-400 text-sm">
          ← Back
        </a>

        <h1 className="text-4xl font-bold mt-6 mb-2">
          DEDICATED QUOTE
        </h1>

        <p className="text-gray-400 mb-8">
          Hourly dedicated pricing with 4-hour minimum.
        </p>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-gray-300">
              Equipment
            </span>

            <select
              value={equipment}
              onChange={(event) =>
                setEquipment(
                  event.target.value as keyof typeof dedicatedRates
                )
              }
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            >
              {Object.keys(dedicatedRates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-gray-300">
              Estimated Hours
            </span>

            <input
              type="number"
              step="0.25"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              placeholder="Enter hours"
              className="mt-2 w-full rounded-xl bg-gray-900 border border-gray-700 p-4 text-xl"
            />
          </label>

          <div className="rounded-2xl bg-gray-900 border border-gray-700 p-6 text-center">
            <p className="text-gray-400 text-sm">
              Estimated Dedicated Quote
            </p>

            <p className="text-5xl font-bold mt-2">
              ${total.toFixed(2)}
            </p>

            <div className="text-gray-500 text-sm mt-4 space-y-1">
              <p>Billed Hours: {billedHours.toFixed(2)}</p>
              <p>Base Hourly: ${selectedRate.hourly.toFixed(2)}</p>
              <p>Fuel: {(fuelPercent * 100).toFixed(1)}%</p>
              <p>Loaded Hourly: ${loadedHourlyRate.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}