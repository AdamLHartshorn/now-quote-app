import { NextResponse } from "next/server";
import { getSessionRole } from "@/lib/auth-server";
import territoryData from "@/lib/territory-data.json";
import { staticProspects } from "@/lib/territory-prospects";

export async function GET(request: Request) {
  if (!(await getSessionRole())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const zip = new URL(request.url).searchParams.get("zip") ?? "";
  if (!territoryData.territories.some((row) => row.zip === zip)) return NextResponse.json({ error: "ZIP not found" }, { status: 404 });
  const prospects = staticProspects[zip] ?? [];
  return NextResponse.json({ prospects, note: prospects.length ? undefined : "Research for this ZIP is still in progress. No reviewed prospects have been published here yet." });
}
