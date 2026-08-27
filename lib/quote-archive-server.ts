import type { QuoteArchiveEntry, SaveQuoteInput } from "@/lib/quote-archive-types";

type QuoteRow = { id: string; customer_name: string; quote_type: string; amount: number; summary: Record<string, string | number | boolean>; rate_version: number; created_at: string };

function connection() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Quote archive storage is not configured");
  return { url, key };
}

function headers(key: string, prefer?: string) {
  return { apikey: key, ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}), "Content-Type": "application/json", ...(prefer ? { Prefer: prefer } : {}) };
}

function mapRow(row: QuoteRow): QuoteArchiveEntry {
  return { id: row.id, customerName: row.customer_name, quoteType: row.quote_type, amount: Number(row.amount), summary: row.summary, rateVersion: row.rate_version, createdAt: row.created_at };
}

export async function listArchivedQuotes() {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/quote_archive?select=*&order=created_at.desc`, { headers: headers(key), cache: "no-store" });
  if (!response.ok) throw new Error(`Quote archive returned ${response.status}`);
  return ((await response.json()) as QuoteRow[]).map(mapRow);
}

export async function saveArchivedQuote(input: SaveQuoteInput) {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/quote_archive`, { method: "POST", headers: headers(key, "return=representation"), body: JSON.stringify({ customer_name: input.customerName.trim(), quote_type: input.quoteType, amount: input.amount, summary: input.summary, rate_version: input.rateVersion }) });
  if (!response.ok) throw new Error(`Unable to archive quote: ${await response.text()}`);
  return mapRow(((await response.json()) as QuoteRow[])[0]);
}

export async function deleteArchivedQuote(id: string) {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/quote_archive?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: headers(key) });
  if (!response.ok) throw new Error(`Unable to delete archived quote: ${await response.text()}`);
}
