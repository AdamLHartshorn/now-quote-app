import type { Rep } from "@/lib/territory-types";

type AssignmentRow = { zip_code: string; rep: Rep; updated_at: string };

function connection() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Territory storage is not configured");
  return { url, key };
}

function headers(key: string, prefer?: string) {
  return {
    apikey: key,
    ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export async function listTerritoryOverrides() {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/territory_assignments?select=zip_code,rep,updated_at`, {
    headers: headers(key), cache: "no-store",
  });
  if (!response.ok) throw new Error(`Territory database returned ${response.status}`);
  return (await response.json()) as AssignmentRow[];
}

export async function saveTerritoryAssignment(zip: string, rep: Rep) {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/territory_assignments?on_conflict=zip_code`, {
    method: "POST",
    headers: headers(key, "resolution=merge-duplicates,return=representation"),
    body: JSON.stringify({ zip_code: zip, rep, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error(`Unable to update territory: ${await response.text()}`);
  return ((await response.json()) as AssignmentRow[])[0];
}
