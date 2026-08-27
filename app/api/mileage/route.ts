import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { calculateDrivingMileage } from "@/lib/route-optimizer";

export async function POST(request: Request) {
  if (!(await cookies()).get("now-auth")?.value) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { pickup?: string; delivery?: string };
  if (!body.pickup?.trim() || !body.delivery?.trim() || body.pickup.length > 200 || body.delivery.length > 200) {
    return NextResponse.json({ error: "Enter both pickup and delivery locations" }, { status: 400 });
  }
  try { return NextResponse.json(await calculateDrivingMileage(body.pickup.trim(), body.delivery.trim())); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to calculate mileage" }, { status: 503 }); }
}
