import type { NewRouteInput, RouteStop, SavedRoute, Territory } from "@/lib/routing-types";
import { optimizeRoute } from "@/lib/route-optimizer";

type RouteRow = {
  id: string; title: string; territory: Territory; start_name: string; start_address: string;
  start_latitude: number; start_longitude: number; stops: RouteStop[]; total_distance_miles: number;
  total_duration_minutes: number; created_at: string; updated_at: string;
};

function connection() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Shared route storage is not configured");
  return { url, key };
}

function headers(key: string, prefer?: string) {
  return {
    apikey: key,
    ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

function toSavedRoute(row: RouteRow): SavedRoute {
  return {
    id: row.id, title: row.title, territory: row.territory, startName: row.start_name,
    startAddress: row.start_address, startLatitude: row.start_latitude, startLongitude: row.start_longitude,
    stops: row.stops, totalDistanceMiles: row.total_distance_miles,
    totalDurationMinutes: row.total_duration_minutes, createdAt: row.created_at, updatedAt: row.updated_at,
  };
}

export async function listRoutes() {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/route_plans?select=*&order=updated_at.desc`, { headers: headers(key), cache: "no-store" });
  if (!response.ok) throw new Error(`Route database returned ${response.status}`);
  return ((await response.json()) as RouteRow[]).map(toSavedRoute);
}

export async function getRoute(id: string) {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/route_plans?id=eq.${encodeURIComponent(id)}&select=*&limit=1`, { headers: headers(key), cache: "no-store" });
  if (!response.ok) throw new Error(`Route database returned ${response.status}`);
  const row = ((await response.json()) as RouteRow[])[0];
  return row ? toSavedRoute(row) : null;
}

export async function createRoute(input: NewRouteInput) {
  const optimized = await optimizeRoute(input);
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/route_plans`, {
    method: "POST", headers: headers(key, "return=representation"),
    body: JSON.stringify({
      title: input.title, territory: input.territory, start_name: input.startName,
      start_address: input.startAddress, start_latitude: optimized.start.latitude,
      start_longitude: optimized.start.longitude, stops: optimized.stops,
      total_distance_miles: optimized.totalDistanceMiles, total_duration_minutes: optimized.totalDurationMinutes,
    }),
  });
  if (!response.ok) throw new Error(`Unable to save route: ${await response.text()}`);
  return toSavedRoute(((await response.json()) as RouteRow[])[0]);
}

export async function updateRoute(id: string, values: { title: string; territory: Territory; stops: RouteStop[] }) {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/route_plans?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH", headers: headers(key, "return=representation"),
    body: JSON.stringify({ title: values.title, territory: values.territory, stops: values.stops, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error(`Unable to update route: ${await response.text()}`);
  const row = ((await response.json()) as RouteRow[])[0];
  if (!row) throw new Error("Route not found");
  return toSavedRoute(row);
}

export async function deleteRoute(id: string) {
  const { url, key } = connection();
  const response = await fetch(`${url}/rest/v1/route_plans?id=eq.${encodeURIComponent(id)}`, { method: "DELETE", headers: headers(key) });
  if (!response.ok) throw new Error(`Unable to delete route: ${await response.text()}`);
}
