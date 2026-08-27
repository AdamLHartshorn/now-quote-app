import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteRoute, getRoute, updateRoute } from "@/lib/routes-server";
import { territories, type RouteStop, type Territory } from "@/lib/routing-types";

async function role() { return (await cookies()).get("now-auth")?.value; }

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await role())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const route = await getRoute((await params).id);
  return route ? NextResponse.json(route) : NextResponse.json({ error: "Route not found" }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await role())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as { title?: string; territory?: Territory; stops?: RouteStop[] };
  if (!body.title?.trim() || !body.territory || !territories.includes(body.territory) || !Array.isArray(body.stops) || body.stops.length < 1 || body.stops.length > 20) {
    return NextResponse.json({ error: "Invalid route update" }, { status: 400 });
  }
  try { return NextResponse.json(await updateRoute((await params).id, { title: body.title.trim(), territory: body.territory, stops: body.stops })); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update route" }, { status: 503 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if ((await role()) !== "admin") return NextResponse.json({ error: "Admin access required to delete routes" }, { status: 403 });
  try { await deleteRoute((await params).id); return new NextResponse(null, { status: 204 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete route" }, { status: 503 }); }
}
