import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRoute, listRoutes } from "@/lib/routes-server";
import { territories, type NewRouteInput } from "@/lib/routing-types";

async function authorized() { return Boolean((await cookies()).get("now-auth")?.value); }

function validInput(value: unknown): value is NewRouteInput {
  if (!value || typeof value !== "object") return false;
  const input = value as Partial<NewRouteInput>;
  return Boolean(
    input.title?.trim() && input.title.trim().length <= 100 &&
    input.startName?.trim() && input.startAddress?.trim() &&
    input.territory && territories.includes(input.territory) &&
    Array.isArray(input.prospects) && input.prospects.length >= 1 && input.prospects.length <= 20 &&
    input.prospects.every((item) => item.businessName?.trim() && item.address?.trim())
  );
}

export async function GET() {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await listRoutes()); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load routes" }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!(await authorized())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const input = await request.json();
  if (!validInput(input)) return NextResponse.json({ error: "Complete the route name, territory, donut shop, and 1–20 prospects." }, { status: 400 });
  try { return NextResponse.json(await createRoute(input), { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to build route" }, { status: 503 }); }
}
