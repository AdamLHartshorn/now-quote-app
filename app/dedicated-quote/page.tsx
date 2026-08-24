"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { dedicatedRates } from "@/config/rates";
import { useFuelSettings } from "@/lib/fuel-settings";

export default function DedicatedQuote() {
  const fuelSurcharge = useFuelSettings();
  const [equipment, setEquipment] =
    useState<keyof typeof dedicatedRates>("Car");

  const [hours, setHours] = useState("");

  const selectedRate = dedicatedRates[equipment];
  const rawHours = Number(hours) || 0;

  const billedHours = Math.max(4, Math.ceil(rawHours * 4) / 4);

  const fuelPercent = fuelSurcharge[selectedRate.fuelClass];

  const loadedHourlyRate =
    selectedRate.hourly * (1 + fuelPercent);

  const total = billedHours * loadedHourlyRate;

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
            DEDICATED QUOTE
          </h1>

          <p className="text-slate-500">
            Hourly dedicated pricing with 4-hour minimum.
          </p>
        </div>

        <div className="space-y-5">
          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
              Equipment
            </span>

            <select
              value={equipment}
              onChange={(event) =>
                setEquipment(
                  event.target.value as keyof typeof dedicatedRates
                )
              }
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            >
              {Object.keys(dedicatedRates).map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-slate-600 font-medium">
              Estimated Hours
            </span>

            <input
              type="number"
              step="0.25"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              placeholder="Enter hours"
              className="mt-2 w-full rounded-xl bg-slate-50 border border-slate-300 p-4 text-xl text-slate-900"
            />
          </label>

          <div className="rounded-2xl bg-slate-100 border border-slate-300 p-6 text-center shadow-sm">
            <p className="text-slate-500 text-sm">
              Estimated Dedicated Quote
            </p>

            <p className="text-5xl font-bold mt-2 text-slate-900">
              ${total.toFixed(2)}
            </p>

            <div className="text-slate-600 text-sm mt-4 space-y-1">
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
