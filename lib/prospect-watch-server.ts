import data from "@/lib/prospect-watch-data.json";
import territories from "@/lib/territory-data.json";
import { listTerritoryOverrides } from "@/lib/territories-server";
import { prospectOwner, type HiringProspect } from "@/lib/prospect-watch";

export async function loadProspectWatch() {
  const base = Object.fromEntries(territories.territories.map(row => [row.zip, row.rep]));
  let overrides: Record<string, string> = {};
  let assignmentsAvailable = true;
  try {
    overrides = Object.fromEntries((await listTerritoryOverrides()).map(row => [row.zip_code, row.rep]));
  } catch {
    assignmentsAvailable = false;
  }
  return {
    reviewedOn: data.reviewedOn,
    assignmentsAvailable,
    records: (data.records as HiringProspect[]).map(p => ({ ...p, owner: prospectOwner(p.zip, base, overrides, assignmentsAvailable) })),
  };
}
