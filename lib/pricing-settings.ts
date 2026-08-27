"use client";

import { useEffect, useState } from "react";

import {
  defaultPricingConfig,
  type PricingConfig,
} from "@/config/rates";

export type PricingConfigResponse = {
  config: PricingConfig;
  effectiveDate: string;
  updatedAt: string | null;
  version: number;
  source: "database" | "defaults";
};

const defaultResponse: PricingConfigResponse = {
  config: structuredClone(defaultPricingConfig) as PricingConfig,
  effectiveDate: "2026-01-01",
  updatedAt: null,
  version: 1,
  source: "defaults",
};

export function usePricingSettings() {
  const [pricing, setPricing] = useState(defaultResponse);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/pricing", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load shared pricing");
        return response.json() as Promise<PricingConfigResponse>;
      })
      .then((response) => {
        if (!cancelled) {
          setPricing(response);
          setError("");
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load shared pricing");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...pricing, loading, error };
}
