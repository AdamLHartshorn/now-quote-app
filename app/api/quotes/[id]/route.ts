import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { deleteArchivedQuote } from "@/lib/quote-archive-server";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if ((await cookies()).get("now-auth")?.value !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  try { await deleteArchivedQuote((await params).id); return new NextResponse(null, { status: 204 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete quote" }, { status: 503 }); }
}
