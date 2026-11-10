import { NextResponse } from "next/server";

import { getSessionRole } from "@/lib/auth-server";
import territoryData from "@/lib/territory-data.json";
import type { Prospect } from "@/lib/territory-types";

type Point = [number, number];
type Geometry = { type: "Polygon" | "MultiPolygon"; coordinates: number[][][] | number[][][][] };
type Element = {
  id: number; type: string; lat?: number; lon?: number; center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function rings(geometry: Geometry) {
  return geometry.type === "Polygon"
    ? (geometry.coordinates as number[][][])
    : (geometry.coordinates as number[][][][]).flat();
}

function pointInRing([x, y]: Point, ring: number[][]) {
  let inside = false;
  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index++) {
    const [xi, yi] = ring[index];
    const [xj, yj] = ring[previous];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function pointInGeometry(point: Point, geometry: Geometry) {
  if (geometry.type === "Polygon") {
    const polygon = geometry.coordinates as number[][][];
    return pointInRing(point, polygon[0]) && !polygon.slice(1).some((ring) => pointInRing(point, ring));
  }
  return (geometry.coordinates as number[][][][]).some((polygon) =>
    pointInRing(point, polygon[0]) && !polygon.slice(1).some((ring) => pointInRing(point, ring))
  );
}

function bounds(geometry: Geometry) {
  const points = rings(geometry).flat();
  const lons = points.map(([lon]) => lon);
  const lats = points.map(([, lat]) => lat);
  return { minLon: Math.min(...lons), maxLon: Math.max(...lons), minLat: Math.min(...lats), maxLat: Math.max(...lats) };
}

function prospectScore(tags: Record<string, string>) {
  if (tags.industrial || tags.man_made === "works") return 100;
  if (["wholesale", "trade", "car_parts", "medical_supply"].includes(tags.shop)) return 90;
  if (tags.healthcare === "laboratory") return 88;
  if (tags.craft) return 80;
  if (tags.office) return 65;
  return 40;
}

function category(tags: Record<string, string>) {
  if (tags.industrial) return tags.industrial.replaceAll("_", " ");
  if (tags.man_made === "works") return "Manufacturer";
  if (tags.shop) return tags.shop.replaceAll("_", " ");
  if (tags.craft) return tags.craft.replaceAll("_", " ");
  if (tags.healthcare === "laboratory") return "Laboratory";
  if (tags.office) return tags.office.replaceAll("_", " ");
  return "Local business";
}

function reason(tags: Record<string, string>) {
  if (tags.industrial || tags.man_made === "works") return "Industrial operation that may move parts, materials, or urgent freight.";
  if (["wholesale", "trade", "car_parts", "medical_supply"].includes(tags.shop)) return "Supply-focused business with potential same-day delivery needs.";
  if (tags.healthcare === "laboratory") return "Time-sensitive healthcare operation and a strong courier-use profile.";
  if (tags.craft) return "Local production or service shop that may need parts and material deliveries.";
  return "Established local business worth a quick introduction.";
}

function address(tags: Record<string, string>, fallback: string) {
  const street = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  return [street, tags["addr:city"], tags["addr:state"], tags["addr:postcode"]].filter(Boolean).join(", ") || fallback;
}

export async function GET(request: Request) {
  if (!(await getSessionRole())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const zip = new URL(request.url).searchParams.get("zip");
  const feature = territoryData.geojson.features.find((item) => item.properties.zip === zip);
  const row = territoryData.territories.find((item) => item.zip === zip);
  if (!zip?.match(/^\d{5}$/) || !row) return NextResponse.json({ error: "Territory ZIP not found" }, { status: 404 });
  if (!feature) return NextResponse.json({ prospects: [], note: "This ZIP does not have a geographic map area." });

  const geometry = feature.geometry as Geometry;
  const area = bounds(geometry);
  const latitude = (area.minLat + area.maxLat) / 2;
  const longitude = (area.minLon + area.maxLon) / 2;
  const radius = Math.min(25000, Math.max(5000, Math.hypot((area.maxLat - area.minLat) * 111000, (area.maxLon - area.minLon) * 85000)));
  const query = `[out:json][timeout:14];(nwr(around:${Math.round(radius)},${latitude},${longitude})["name"]["industrial"];nwr(around:${Math.round(radius)},${latitude},${longitude})["name"]["man_made"="works"];nwr(around:${Math.round(radius)},${latitude},${longitude})["name"]["office"];nwr(around:${Math.round(radius)},${latitude},${longitude})["name"]["craft"];nwr(around:${Math.round(radius)},${latitude},${longitude})["name"]["shop"~"^(wholesale|trade|car_parts|medical_supply|hardware)$"];nwr(around:${Math.round(radius)},${latitude},${longitude})["name"]["healthcare"="laboratory"];);out center tags 100;`;

  const endpoints = ["https://overpass-api.de/api/interpreter", "https://overpass.kumi.systems/api/interpreter"];
  let elements: Element[] = [];
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "NOW Field Desk/1.1 (ahartshorn@nowcourier.com)" },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(9000),
        cache: "no-store",
      });
      if (response.ok) { elements = ((await response.json()) as { elements: Element[] }).elements; break; }
    } catch { /* try the next public endpoint */ }
  }

  const seen = new Set<string>();
  const prospects: Prospect[] = elements
    .filter((element) => {
      const point = element.center ? [element.center.lon, element.center.lat] : [element.lon, element.lat];
      return point.every((value) => typeof value === "number") && pointInGeometry(point as Point, geometry);
    })
    .sort((a, b) => prospectScore(b.tags ?? {}) - prospectScore(a.tags ?? {}))
    .flatMap((element) => {
      const tags = element.tags ?? {};
      const name = tags.name?.trim();
      if (!name || seen.has(name.toLowerCase())) return [];
      seen.add(name.toLowerCase());
      return [{
        id: `${element.type}-${element.id}`,
        name,
        category: category(tags),
        reason: reason(tags),
        address: address(tags, `${row.city}, IN ${zip}`),
        phone: tags.phone ?? tags["contact:phone"],
        website: tags.website ?? tags["contact:website"],
      }];
    })
    .slice(0, 5);

  return NextResponse.json({
    prospects,
    note: prospects.length < 5 ? "Public map listings did not contain five qualified businesses in this ZIP yet." : undefined,
    attribution: "Business information from OpenStreetMap contributors.",
  });
}
