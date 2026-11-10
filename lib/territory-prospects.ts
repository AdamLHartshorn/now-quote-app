import type { Prospect } from "./territory-types";
import data from "./territory-prospect-data.json";

// Published editorial snapshot. ZIPs are based on business street addresses;
// suggested conversation starters do not establish an actual shipping need.
export const prospectResearchDate = data.researchedOn;
export const prospectTargetPerZip = data.targetPerZip;
export const prospectCoverage: Record<string, { prospects: Prospect[]; note?: string }> = data.zips;
export const staticProspects: Record<string, Prospect[]> = Object.fromEntries(
  Object.entries(prospectCoverage).map(([zip, entry]) => [zip, entry.prospects]),
);
