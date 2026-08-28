export type VehicleSpec = {
  vehicle: string;
  category: "Parcel" | "Commercial";
  units: number | null;
  pallets: number | null;
  maxWeight: number;
  maxLength: string | null;
  maxWidth: string | null;
  maxHeight: string | null;
  liftgate: string | null;
};

export const vehicleSpecs: VehicleSpec[] = [
  { vehicle: "Car", category: "Parcel", units: null, pallets: null, maxWeight: 500, maxLength: null, maxWidth: null, maxHeight: null, liftgate: null },
  { vehicle: "Minivan / Small Truck", category: "Parcel", units: null, pallets: null, maxWeight: 1500, maxLength: null, maxWidth: null, maxHeight: null, liftgate: null },
  { vehicle: "Transit", category: "Parcel", units: 8, pallets: 2, maxWeight: 3000, maxLength: '126"', maxWidth: '53.5"', maxHeight: '72"', liftgate: null },
  { vehicle: "Dock", category: "Commercial", units: 14, pallets: 12, maxWeight: 15000, maxLength: "26 ft", maxWidth: '90"', maxHeight: '162"', liftgate: "2,000 lbs." },
  { vehicle: "Flatbed (Dual)", category: "Commercial", units: 1, pallets: 12, maxWeight: 30000, maxLength: "26 ft", maxWidth: '102"', maxHeight: '109"', liftgate: null },
  { vehicle: "Flatbed Moffett (Dual)", category: "Commercial", units: 1, pallets: 12, maxWeight: 25000, maxLength: "26 ft", maxWidth: '102"', maxHeight: '109"', liftgate: null },
  { vehicle: "Semi (Swing Door)", category: "Commercial", units: 2, pallets: 26, maxWeight: 70000, maxLength: "53 ft", maxWidth: '101"', maxHeight: '110"', liftgate: null },
  { vehicle: "Semi (Roll Up)", category: "Commercial", units: 3, pallets: 26, maxWeight: 68000, maxLength: "53 ft", maxWidth: '101"', maxHeight: '104"', liftgate: null },
  { vehicle: "Flatbed Semi — 42 ft", category: "Commercial", units: 3, pallets: 18, maxWeight: 36287, maxLength: "42 ft", maxWidth: '102"', maxHeight: '109"', liftgate: null },
  { vehicle: "Flatbed Moffett Semi — 42 ft", category: "Commercial", units: 3, pallets: 18, maxWeight: 32287, maxLength: "42 ft", maxWidth: '102"', maxHeight: '109"', liftgate: null },
  { vehicle: "Flatbed Semi — 48 ft", category: "Commercial", units: 2, pallets: 22, maxWeight: 45000, maxLength: "48 ft", maxWidth: '102"', maxHeight: '109"', liftgate: null },
  { vehicle: "Flatbed Moffett Semi — 48 ft", category: "Commercial", units: 2, pallets: 22, maxWeight: 41000, maxLength: "48 ft", maxWidth: '102"', maxHeight: '109"', liftgate: null },
];
