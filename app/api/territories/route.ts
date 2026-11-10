import { NextResponse } from "next/server";

import { getSessionRole } from "@/lib/auth-server";
import { listTerritoryOverrides, saveTerritoryAssignment } from "@/lib/territories-server";
import { REPS, type Rep } from "@/lib/territory-types";

export async function GET() {
  if (!(await getSessionRole())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const rows = await listTerritoryOverrides();
    return NextResponse.json({ overrides: Object.fromEntries(rows.map((row) => [row.zip_code, row.rep])) });
  }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load territories" }, { status: 503 }); }
}

export async function PUT(request: Request) {
  if ((await getSessionRole()) !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = (await request.json()) as { zip?: string; rep?: Rep };
  if (!body.zip?.match(/^\d{5}$/) || !body.rep || !REPS.includes(body.rep)) {
    return NextResponse.json({ error: "Valid ZIP and rep are required" }, { status: 400 });
  }
  try { return NextResponse.json(await saveTerritoryAssignment(body.zip, body.rep)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update territory" }, { status: 503 }); }
}
