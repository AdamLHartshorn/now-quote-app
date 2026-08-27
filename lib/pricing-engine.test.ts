import assert from "node:assert/strict";
import test from "node:test";

import { calculateCommercialTransport } from "./pricing-engine.ts";

test("Dock Truck uses its normal mileage rate through 50 miles", () => {
  assert.equal(
    calculateCommercialTransport(
      50,
      { base: 99, ratePerMile: 2.75 },
      { overMileageThreshold: 50, overThresholdEntireTripRate: 3.6 }
    ),
    236.5
  );
});

test("Dock Truck applies the written full-trip rate above 50 miles", () => {
  assert.equal(
    calculateCommercialTransport(
      51,
      { base: 99, ratePerMile: 2.75 },
      { overMileageThreshold: 50, overThresholdEntireTripRate: 3.6 }
    ),
    282.6
  );
});

test("Flatbed applies its additional rate only to excess miles", () => {
  assert.equal(
    calculateCommercialTransport(
      51,
      { base: 140, ratePerMile: 4.5 },
      { overMileageThreshold: 50, overThresholdAdditionalPerMile: 1.5 }
    ),
    371
  );
});
