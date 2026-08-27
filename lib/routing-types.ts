export const territories = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"] as const;
export type Territory = (typeof territories)[number];
export type StopStatus = "pending" | "completed" | "skipped";

export type RouteStop = {
  id: string;
  businessName: string;
  address: string;
  resolvedAddress?: string;
  latitude: number;
  longitude: number;
  status: StopStatus;
};

export type SavedRoute = {
  id: string;
  title: string;
  territory: Territory;
  startName: string;
  startAddress: string;
  startLatitude: number;
  startLongitude: number;
  stops: RouteStop[];
  totalDistanceMiles: number;
  totalDurationMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type NewRouteInput = {
  title: string;
  territory: Territory;
  startName: string;
  startAddress: string;
  prospects: Array<{ businessName: string; address: string }>;
};
