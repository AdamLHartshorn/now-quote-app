export const fuelSurcharge = {
  parcel: 0.285,
  commercial: 0.39,
  heavyCommercial: 0.19,
} as const;

export const parcelServiceRates = {
  Direct: {
    minimum: 20.99,
    ratePerMile: 2.79,
  },
  "2 Hour": {
    minimum: 16.99,
    ratePerMile: 2.19,
  },
  "4 Hour": {
    minimum: 14.99,
    ratePerMile: 1.89,
  },
  "Same Day": {
    minimum: 12.99,
    ratePerMile: 1.39,
  },
} as const;

export const parcelVehicleConfig = {
  Car: {
    fuelClass: "parcel",
    upcharge: 0,
    freeWaitMinutes: 5,
    waitRatePerMinute: 1,
    includedWeight: 99,
    overweightRatePerCwt: 0,
    over50MileRate: 2.79,
  },
  "Small Truck": {
    fuelClass: "parcel",
    upcharge: 10,
    freeWaitMinutes: 10,
    waitRatePerMinute: 1,
    includedWeight: 200,
    overweightRatePerCwt: 4,
    over50MileRate: 3,
  },
  Sprinter: {
    fuelClass: "parcel",
    upcharge: 25,
    freeWaitMinutes: 10,
    waitRatePerMinute: 1,
    includedWeight: 600,
    overweightRatePerCwt: 4,
    over50MileRate: 3.25,
  },
} as const;

export const commercialEquipmentConfig = {
  "Dock Truck": {
    fuelClass: "commercial",
    serviceRates: {
      Direct: { base: 99, ratePerMile: 2.75 },
      "3-Hour": { base: 89, ratePerMile: 2.35 },
      "5-Hour": { base: 79, ratePerMile: 1.85 },
      "Same Day": { base: 69, ratePerMile: 1.45 },
    },
    overMileageThreshold: 50,
    overThresholdEntireTripRate: 3.6,
    freeWaitMinutes: 15,
    waitRatePerMinute: 1.5,
    includedWeight: 4000,
    overweightRatePerCwt: 1,
    afterHours: 50,
    sharp: 50,
    noLoad: 50,
    liftgateAllowed: true,
    moffettAllowed: false,
  },

  "Flatbed Single Axle": {
    fuelClass: "heavyCommercial",
    serviceRates: {
      Direct: { base: 140, ratePerMile: 4.5 },
    },
    overMileageThreshold: 50,
    overThresholdAdditionalPerMile: 1.5,
    freeWaitMinutes: 30,
    waitRatePerMinute: 1.75,
    includedWeight: 4000,
    overweightRatePerCwt: 1,
    afterHours: 75,
    sharp: 75,
    noLoad: 75,
    liftgateAllowed: false,
    moffettAllowed: true,
    moffettCharge: 75,
  },

  "Flatbed Dual Axle": {
    fuelClass: "heavyCommercial",
    serviceRates: {
      Direct: { base: 175, ratePerMile: 5 },
    },
    overMileageThreshold: 50,
    overThresholdAdditionalPerMile: 1.5,
    freeWaitMinutes: 30,
    waitRatePerMinute: 1.75,
    includedWeight: 4000,
    overweightRatePerCwt: 1,
    afterHours: 75,
    sharp: 75,
    noLoad: 75,
    liftgateAllowed: false,
    moffettAllowed: true,
    moffettCharge: 75,
  },

  "Semi 53 Dry Van": {
    fuelClass: "heavyCommercial",
    serviceRates: {
      Direct: { base: 175, ratePerMile: 6.5 },
    },
    overMileageThreshold: 200,
    overThresholdAdditionalPerMile: 0.5,
    freeWaitMinutes: 30,
    waitRatePerMinute: 1.75,
    includedWeight: 20000,
    overweightRatePerCwt: 0.35,
    afterHours: 75,
    sharp: 75,
    noLoad: 75,
    liftgateAllowed: false,
    moffettAllowed: false,
  },

  "Semi Flatbed 42": {
    fuelClass: "heavyCommercial",
    serviceRates: {
      Direct: { base: 200, ratePerMile: 6.5 },
    },
    overMileageThreshold: 200,
    overThresholdAdditionalPerMile: 0.5,
    freeWaitMinutes: 30,
    waitRatePerMinute: 2.25,
    includedWeight: 20000,
    overweightRatePerCwt: 0.35,
    afterHours: 75,
    sharp: 75,
    noLoad: 75,
    liftgateAllowed: false,
    moffettAllowed: true,
    moffettCharge: 75,
  },

  "Semi Flatbed 48": {
    fuelClass: "heavyCommercial",
    serviceRates: {
      Direct: { base: 225, ratePerMile: 7 },
    },
    overMileageThreshold: 200,
    overThresholdAdditionalPerMile: 0.5,
    freeWaitMinutes: 30,
    waitRatePerMinute: 2.25,
    includedWeight: 20000,
    overweightRatePerCwt: 0.35,
    afterHours: 75,
    sharp: 75,
    noLoad: 75,
    liftgateAllowed: false,
    moffettAllowed: true,
    moffettCharge: 75,
  },
} as const;

export const dedicatedRates = {
  Car: { hourly: 45, fuelClass: "parcel" },
  "Minivan/Small Truck": { hourly: 55, fuelClass: "parcel" },
  Transit: { hourly: 60, fuelClass: "parcel" },
  Dock: { hourly: 95, fuelClass: "commercial" },
  "Flatbed (Single)": { hourly: 130, fuelClass: "heavyCommercial" },
  "Flatbed Moffett (Single)": { hourly: 165, fuelClass: "heavyCommercial" },
  "Flatbed (Dual)": { hourly: 150, fuelClass: "heavyCommercial" },
  "Flatbed Moffett (Dual)": { hourly: 185, fuelClass: "heavyCommercial" },
  Semi: { hourly: 125, fuelClass: "heavyCommercial" },
  "Flatbed Semi - 42": { hourly: 160, fuelClass: "heavyCommercial" },
  "Flatbed Moffett Semi - 42": { hourly: 195, fuelClass: "heavyCommercial" },
  "Flatbed Semi - 48": { hourly: 170, fuelClass: "heavyCommercial" },
  "Flatbed Moffett Semi - 48": { hourly: 205, fuelClass: "heavyCommercial" },
} as const;

export const accessorialRates = {
  hazmat: 50,
  airport: 30,
  liftgate: 25,
  parcelAfterHours: 25,
  parcelNoLoad: 20,
} as const;