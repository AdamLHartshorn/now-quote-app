"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

import {
  defaultFuelSettings,
  resetFuelSettings,
  saveFuelSettings,
  useFuelSettings,
} from "@/lib/fuel-settings";

type FormValues = Record<keyof typeof defaultFuelSettings, string>;

const fields: Array<{
  key: keyof typeof defaultFuelSettings;
  label: string;
  description: string;
}> = [
  { key: "parcel", label: "Parcel fuel", description: "Car, Small Truck, and Sprinter quotes" },
  { key: "commercial", label: "Commercial fuel", description: "Dock Truck quotes" },
  { key: "heavyCommercial", label: "Heavy commercial fuel", description: "Flatbed and Semi quotes" },
];

function toFormValues(settings: typeof defaultFuelSettings): FormValues {
  return {
    parcel: String(settings.parcel * 100),
    commercial: String(settings.commercial * 100),
    heavyCommercial: String(settings.heavyCommercial * 100),
  };
}

export default function AdminPage() {
  const currentSettings = useFuelSettings();

  return (
    <FuelSettingsForm
      key={JSON.stringify(currentSettings)}
      initialSettings={currentSettings}
    />
  );
}

function FuelSettingsForm({ initialSettings }: { initialSettings: typeof defaultFuelSettings }) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(initialSettings));
  const [message, setMessage] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const percentages = fields.map(({ key }) => Number(values[key]));
    if (percentages.some((value) => !Number.isFinite(value) || value < 0 || value > 100)) {
      setMessage("Enter a percentage from 0 to 100 for every category.");
      return;
    }

    saveFuelSettings({
      parcel: percentages[0] / 100,
      commercial: percentages[1] / 100,
      heavyCommercial: percentages[2] / 100,
    });
    setMessage("Fuel surcharges saved for this device.");
  }

  function restoreDefaults() {
    resetFuelSettings();
    setValues(toFormValues(defaultFuelSettings));
    setMessage("Default fuel surcharges restored.");
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="mx-auto w-full max-w-lg">
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-slate-500 text-sm">← Quote menu</Link>
          <Image src="/now-logo.jpg" alt="NOW Courier" width={130} height={45} priority />
        </header>

        <div className="mb-8">
          <p className="text-xs tracking-widest text-[#007c91] font-bold mb-2">ADMIN</p>
          <h1 className="text-4xl font-bold mb-2">Pricing settings</h1>
          <p className="text-slate-500">Update the weekly fuel percentages used by every quote calculator on this device.</p>
        </div>

        <form onSubmit={submit} className="bg-white border border-slate-300 rounded-2xl p-6 shadow-sm space-y-5">
          {fields.map((field) => (
            <label className="block" key={field.key}>
              <span className="text-sm text-slate-700 font-bold">{field.label}</span>
              <span className="block text-xs text-slate-500 mt-1">{field.description}</span>
              <div className="relative mt-2">
                <input
                  type="number"
                  inputMode="decimal"
                  min="0"
                  max="100"
                  step="0.1"
                  value={values[field.key]}
                  onChange={(event) => {
                    setValues((current) => ({ ...current, [field.key]: event.target.value }));
                    setMessage("");
                  }}
                  className="w-full rounded-xl bg-slate-50 border border-slate-300 p-4 pr-12 text-xl text-slate-900"
                />
                <span className="absolute right-4 top-4 text-xl text-slate-500">%</span>
              </div>
            </label>
          ))}

          <button type="submit" className="w-full bg-[#0093aa] hover:bg-[#007c91] text-white rounded-xl p-4 font-bold text-lg">
            SAVE FUEL SURCHARGES
          </button>
          <button type="button" onClick={restoreDefaults} className="w-full border border-slate-300 hover:bg-slate-50 rounded-xl p-3 font-semibold text-slate-600">
            Restore defaults
          </button>
          {message && <p className="text-sm text-center text-slate-600" role="status">{message}</p>}
        </form>

        <form action="/api/logout" method="post" className="mt-6 text-center">
          <button className="text-sm text-slate-500 hover:text-slate-700">Log out</button>
        </form>
      </div>
    </main>
  );
}
