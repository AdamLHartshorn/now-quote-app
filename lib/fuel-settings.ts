"use client";

import { useEffect, useState } from "react";

import { fuelSurcharge as defaultFuelSurcharge } from "@/config/rates";

export type FuelSettings = {
  parcel: number;
  commercial: number;
  heavyCommercial: number;
};

export const FUEL_SETTINGS_KEY = "now-fuel-surcharge";

export const defaultFuelSettings: FuelSettings = {
  ...defaultFuelSurcharge,
};

function readFuelSettings(): FuelSettings {
  try {
    const stored = window.localStorage.getItem(FUEL_SETTINGS_KEY);
    if (!stored) return defaultFuelSettings;

    const parsed = JSON.parse(stored) as Partial<FuelSettings>;
    return {
      parcel: Number.isFinite(parsed.parcel) ? parsed.parcel! : defaultFuelSettings.parcel,
      commercial: Number.isFinite(parsed.commercial)
        ? parsed.commercial!
        : defaultFuelSettings.commercial,
      heavyCommercial: Number.isFinite(parsed.heavyCommercial)
        ? parsed.heavyCommercial!
        : defaultFuelSettings.heavyCommercial,
    };
  } catch {
    return defaultFuelSettings;
  }
}

export function saveFuelSettings(settings: FuelSettings) {
  window.localStorage.setItem(FUEL_SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("now-fuel-settings-changed"));
}

export function resetFuelSettings() {
  window.localStorage.removeItem(FUEL_SETTINGS_KEY);
  window.dispatchEvent(new Event("now-fuel-settings-changed"));
}

export function useFuelSettings() {
  const [settings, setSettings] = useState<FuelSettings>(defaultFuelSettings);

  useEffect(() => {
    const refresh = () => setSettings(readFuelSettings());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("now-fuel-settings-changed", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("now-fuel-settings-changed", refresh);
    };
  }, []);

  return settings;
}
