import { NextResponse } from "next/server";
import { getSessionRole } from "@/lib/auth-server";
import territoryData from "@/lib/territory-data.json";
import watchData from "@/lib/prospect-watch-data.json";
import { prospectsForZip, type HiringProspect } from "@/lib/prospect-watch";
import { staticProspects } from "@/lib/territory-prospects";

export async function GET(request: Request) {
  if (!(await getSessionRole())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const zip = new URL(request.url).searchParams.get("zip") ?? "";
  if (!territoryData.territories.some((row) => row.zip === zip)) return NextResponse.json({ error: "ZIP not found" }, { status: 404 });
  const prospects = staticProspects[zip] ?? [];
  const watchProspects = prospectsForZip(watchData.records as HiringProspect[], zip);
  return NextResponse.json({ prospects, watchProspects, note: (prospects.length || watchProspects.length) ? undefined : "Research for this ZIP is still in progress. No reviewed prospects have been published here yet." }, { headers: { "Cache-Control": "private, no-store" } });
}
