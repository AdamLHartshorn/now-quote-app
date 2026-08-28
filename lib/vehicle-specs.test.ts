import assert from "node:assert/strict";
import test from "node:test";

import { vehicleSpecs } from "./vehicle-specs.ts";

test("vehicle reference preserves all twelve source rows", () => {
  assert.equal(vehicleSpecs.length, 12);
  assert.equal(vehicleSpecs.find((spec) => spec.vehicle === "Transit")?.maxWeight, 3000);
  assert.equal(vehicleSpecs.find((spec) => spec.vehicle === "Semi (Swing Door)")?.maxWeight, 70000);
  assert.equal(vehicleSpecs.find((spec) => spec.vehicle === "Dock")?.liftgate, "2,000 lbs.");
});

test("42 and 48 foot Moffett configurations retain their source limits", () => {
  assert.deepEqual(
    vehicleSpecs.filter((spec) => spec.vehicle.includes("Moffett Semi")).map((spec) => [spec.maxLength, spec.maxWeight]),
    [["42 ft", 32287], ["48 ft", 41000]]
  );
});
