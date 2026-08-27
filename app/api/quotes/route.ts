import { NextResponse } from "next/server";

import { getSessionRole } from "@/lib/auth-server";
import { listArchivedQuotes, saveArchivedQuote } from "@/lib/quote-archive-server";
import type { SaveQuoteInput } from "@/lib/quote-archive-types";

export async function GET() {
  if (!(await getSessionRole())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try { return NextResponse.json(await listArchivedQuotes()); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load quote archive" }, { status: 503 }); }
}

export async function POST(request: Request) {
  if (!(await getSessionRole())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<SaveQuoteInput>;
  if (!body.customerName?.trim() || body.customerName.trim().length > 120 || !body.quoteType?.trim() || typeof body.amount !== "number" || !Number.isFinite(body.amount) || body.amount < 0 || !body.summary || typeof body.rateVersion !== "number") {
    return NextResponse.json({ error: "Customer name and valid quote details are required" }, { status: 400 });
  }
  try { return NextResponse.json(await saveArchivedQuote(body as SaveQuoteInput), { status: 201 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to archive quote" }, { status: 503 }); }
}
