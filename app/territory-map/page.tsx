import territoryData from "@/lib/territory-data.json";
import { getSessionRole } from "@/lib/auth-server";

import TerritoryMapClient from "./TerritoryMapClient";

export default async function TerritoryMapPage({ searchParams }: { searchParams: Promise<{ zip?: string }> }) {
  const { zip } = await searchParams;
  const initialZip = territoryData.territories.some(row => row.zip === zip) ? zip : undefined;
  return <TerritoryMapClient initialZip={initialZip} isAdmin={(await getSessionRole()) === "admin"} />;
}
