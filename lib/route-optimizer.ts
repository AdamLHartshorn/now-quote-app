import { randomUUID } from "node:crypto";

import type { NewRouteInput, RouteStop } from "@/lib/routing-types";

type Coordinate = { latitude: number; longitude: number; displayName: string };
type Matrix = { durations: number[][]; distances: number[][] };

const geocoderUrl = process.env.GEOCODING_BASE_URL ?? "https://nominatim.openstreetmap.org";
const routingUrl = process.env.ROUTING_BASE_URL ?? "https://router.project-osrm.org";

function pause(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function geocode(query: string): Promise<Coordinate> {
  const url = new URL("/search", geocoderUrl);
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "us");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "NOW Courier Routing Guide/1.0 (ahartshorn@nowcourier.com)",
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("The address service is temporarily unavailable");

  const results = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  if (!results[0]) throw new Error(`Address not found: ${query}`);
  return {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
    displayName: results[0].display_name,
  };
}

async function geocodeAll(input: NewRouteInput) {
  const locations: Coordinate[] = [];
  const queries = [input.startAddress, ...input.prospects.map((prospect) => prospect.address)];
  for (const query of queries) {
    locations.push(await geocode(query));
    if (query !== queries.at(-1)) await pause(1050);
  }
  return locations;
}

async function getMatrix(locations: Coordinate[]): Promise<Matrix> {
  const coordinates = locations.map(({ longitude, latitude }) => `${longitude},${latitude}`).join(";");
  const url = `${routingUrl}/table/v1/driving/${coordinates}?annotations=duration,distance`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("The driving-time service is temporarily unavailable");
  const matrix = (await response.json()) as { code: string; durations: Array<Array<number | null>>; distances: Array<Array<number | null>> };
  if (matrix.code !== "Ok") throw new Error("Unable to calculate a driving route for these addresses");
  return {
    durations: matrix.durations.map((row) => row.map((value) => value ?? Number.POSITIVE_INFINITY)),
    distances: matrix.distances.map((row) => row.map((value) => value ?? Number.POSITIVE_INFINITY)),
  };
}

function pathCost(path: number[], durations: number[][]) {
  let total = 0;
  for (let index = 1; index < path.length; index += 1) total += durations[path[index - 1]][path[index]];
  return total;
}

export function optimizeOpenRoute(durations: number[][]) {
  const unvisited = new Set(Array.from({ length: durations.length - 1 }, (_, index) => index + 1));
  const path = [0];
  while (unvisited.size) {
    const current = path.at(-1)!;
    const next = [...unvisited].reduce((best, candidate) =>
      durations[current][candidate] < durations[current][best] ? candidate : best
    );
    path.push(next);
    unvisited.delete(next);
  }

  let improved = true;
  while (improved) {
    improved = false;
    const currentCost = pathCost(path, durations);
    for (let start = 1; start < path.length - 1 && !improved; start += 1) {
      for (let end = start + 1; end < path.length; end += 1) {
        const candidate = [...path.slice(0, start), ...path.slice(start, end + 1).reverse(), ...path.slice(end + 1)];
        if (pathCost(candidate, durations) + 0.01 < currentCost) {
          path.splice(0, path.length, ...candidate);
          improved = true;
          break;
        }
      }
    }
  }
  return path;
}

export async function optimizeRoute(input: NewRouteInput) {
  const locations = await geocodeAll(input);
  const matrix = await getMatrix(locations);
  const order = optimizeOpenRoute(matrix.durations);
  const prospectOrder = order.slice(1);
  const stops: RouteStop[] = prospectOrder.map((sourceIndex) => ({
    id: randomUUID(),
    businessName: input.prospects[sourceIndex - 1].businessName,
    address: input.prospects[sourceIndex - 1].address,
    latitude: locations[sourceIndex].latitude,
    longitude: locations[sourceIndex].longitude,
    status: "pending",
  }));

  let distanceMeters = 0;
  let durationSeconds = 0;
  for (let index = 1; index < order.length; index += 1) {
    distanceMeters += matrix.distances[order[index - 1]][order[index]];
    durationSeconds += matrix.durations[order[index - 1]][order[index]];
  }

  return {
    start: locations[0],
    stops,
    totalDistanceMiles: Math.round((distanceMeters / 1609.344) * 10) / 10,
    totalDurationMinutes: Math.round(durationSeconds / 60),
  };
}
