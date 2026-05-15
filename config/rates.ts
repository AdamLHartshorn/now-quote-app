export const fuelSurcharge = {
  parcel: 0.18,
  commercial: 0.285,
  heavyCommercial: 0.36,
} as const;

export const equipmentConfig = {
  Car: {
    category: "parcel",
    ratePerMile: 2.25,
    hourly: 45,
    fuelClass: "parcel",
    minimum: 75,
    freeWaitMinutes: 15,
    waitRatePerMinute: 1.25,
    includedWeight: 250,
    overweightRate: 0.15,
  },

  "Pickup Truck": {
    category: "parcel",
    ratePerMile: 2.5,
    hourly: 50,
    fuelClass: "parcel",
    minimum: 85,
    freeWaitMinutes: 15,
    waitRatePerMinute: 1.5,
    includedWeight: 1000,
    overweightRate: 0.18,
  },

  Sprinter: {
    category: "parcel",
    ratePerMile: 2.75,
    hourly: 55,
    fuelClass: "parcel",
    minimum: 95,
    freeWaitMinutes: 15,
    waitRatePerMinute: 1.5,
    includedWeight: 2500,
    overweightRate: 0.2,
  },

  "Cargo Van": {
    category: "parcel",
    ratePerMile: 2.75,
    hourly: 55,
    fuelClass: "parcel",
    minimum: 95,
    freeWaitMinutes: 15,
    waitRatePerMinute: 1.5,
    includedWeight: 2500,
    overweightRate: 0.2,
  },

  "Dock Truck": {
    category: "commercial",
    ratePerMile: 3.5,
    hourly: 75,
    fuelClass: "commercial",
    minimum: 150,
    freeWaitMinutes: 30,
    waitRatePerMinute: 2,
    includedWeight: 5000,
    overweightRate: 0.25,
  },

  "Box Truck": {
    category: "commercial",
    ratePerMile: 3.75,
    hourly: 80,
    fuelClass: "commercial",
    minimum: 175,
    freeWaitMinutes: 30,
    waitRatePerMinute: 2,
    includedWeight: 7500,
    overweightRate: 0.3,
  },

  Flatbed: {
    category: "commercial",
    ratePerMile: 4,
    hourly: 90,
    fuelClass: "commercial",
    minimum: 200,
    freeWaitMinutes: 45,
    waitRatePerMinute: 2.25,
    includedWeight: 10000,
    overweightRate: 0.35,
  },

  "Flatbed Moffett": {
    category: "heavyCommercial",
    ratePerMile: 5,
    hourly: 125,
    fuelClass: "heavyCommercial",
    minimum: 350,
    freeWaitMinutes: 60,
    waitRatePerMinute: 3,
    includedWeight: 20000,
    overweightRate: 0.5,
  },

  Semi: {
    category: "heavyCommercial",
    ratePerMile: 5.5,
    hourly: 135,
    fuelClass: "heavyCommercial",
    minimum: 400,
    freeWaitMinutes: 60,
    waitRatePerMinute: 3,
    includedWeight: 40000,
    overweightRate: 0.6,
  },

  "Straight Truck": {
    category: "heavyCommercial",
    ratePerMile: 4.25,
    hourly: 95,
    fuelClass: "heavyCommercial",
    minimum: 225,
    freeWaitMinutes: 45,
    waitRatePerMinute: 2.5,
    includedWeight: 10000,
    overweightRate: 0.35,
  },
} as const;

export const accessorialRates = {
  rush: 25,
  afterHours: 50,
  liftgate: 75,
  twoPerson: 100,
  palletJack: 40,
  insideDelivery: 50,
  moffett: 150,
  airport: 75,
} as const;

export const serviceMultipliers = {
  "2-Hour": 1.25,
  "Same Day": 1,
  "Next Day": 0.85,
  Scheduled: 1,
} as const;