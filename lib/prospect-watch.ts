export type HiringProspect = {
  id: string;
  company: string;
  city: string;
  zip: string | null;
  address: string;
  role: string;
  evidence: string;
  sourceUrl: string;
  sourceLabel: string;
  opportunity: string;
  equipment: string[];
  qualification: string;
  contactRole: string;
  newToCollection: boolean;
  phone: string | null;
  locationSourceUrl: string | null;
  postedOn: string | null;
  checkedOn: string;
  baselineIndex: number | null;
};

export function prospectOwner(zip: string | null, base: Record<string, string>, overrides: Record<string, string>, assignmentsAvailable = true) {
  if (!zip) return "Area-wide";
  if (!assignmentsAvailable) return "Assignment unavailable";
  return overrides[zip] ?? base[zip] ?? "Outside assigned ZIPs";
}

export function filterProspects<T extends HiringProspect & { owner: string }>(records: T[], rep: string, query: string, onlyNew: boolean) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return records.filter(p => (rep === "ALL" || p.owner === rep) && (!onlyNew || p.newToCollection) && terms.every(term => `${p.company} ${p.city} ${p.zip ?? ""} ${p.owner} ${p.role} ${p.equipment.join(" ")} ${p.address}`.toLocaleLowerCase().includes(term)))
    .sort((a, b) => b.checkedOn.localeCompare(a.checkedOn) || Number(b.newToCollection) - Number(a.newToCollection) || a.company.localeCompare(b.company));
}

export function researchDate(value: string) {
  return new Date(`${value}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}
