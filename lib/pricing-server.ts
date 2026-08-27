import {
  defaultPricingConfig,
  type PricingConfig,
} from "@/config/rates";

export type StoredPricingConfig = {
  config: PricingConfig;
  effectiveDate: string;
  updatedAt: string | null;
  version: number;
  source: "database" | "defaults";
};

type PricingRow = {
  config: PricingConfig;
  effective_date: string;
  updated_at: string;
  version: number;
};

function credentials() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url, key } : null;
}

function headers(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function getPricingConfig(): Promise<StoredPricingConfig> {
  const supabase = credentials();
  if (!supabase) {
    return {
      config: structuredClone(defaultPricingConfig) as PricingConfig,
      effectiveDate: "2026-01-01",
      updatedAt: null,
      version: 1,
      source: "defaults",
    };
  }

  const response = await fetch(
    `${supabase.url}/rest/v1/pricing_config?id=eq.current&select=config,effective_date,updated_at,version&limit=1`,
    { headers: headers(supabase.key), cache: "no-store" }
  );
  if (!response.ok) throw new Error(`Pricing database returned ${response.status}`);

  const rows = (await response.json()) as PricingRow[];
  const row = rows[0];
  if (!row) throw new Error("Shared pricing configuration is missing");

  return {
    config: row.config,
    effectiveDate: row.effective_date,
    updatedAt: row.updated_at,
    version: row.version,
    source: "database",
  };
}

export async function savePricingConfig(
  config: PricingConfig,
  effectiveDate: string,
  expectedVersion: number
) {
  const supabase = credentials();
  if (!supabase) throw new Error("Supabase is not configured");

  const response = await fetch(
    `${supabase.url}/rest/v1/rpc/update_pricing_config`,
    {
      method: "POST",
      headers: headers(supabase.key),
      body: JSON.stringify({
        new_config: config,
        new_effective_date: effectiveDate,
        expected_version: expectedVersion,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const detail = await response.text();
    if (response.status === 409 || detail.includes("version conflict") || detail.includes("40001")) {
      throw new Error("Pricing was changed in another session. Reload before saving.");
    }
    throw new Error(`Unable to save shared pricing: ${detail}`);
  }

  return getPricingConfig();
}
