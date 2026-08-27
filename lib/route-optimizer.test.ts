import assert from "node:assert/strict";
import test from "node:test";

import { optimizeOpenRoute } from "./route-optimizer.ts";

test("route optimization keeps the donut shop first", () => {
  const durations = [
    [0, 10, 2, 8],
    [10, 0, 9, 1],
    [2, 9, 0, 3],
    [8, 1, 3, 0],
  ];
  assert.deepEqual(optimizeOpenRoute(durations), [0, 2, 3, 1]);
});

test("route optimization includes every prospect exactly once", () => {
  const durations = [
    [0, 4, 7],
    [4, 0, 2],
    [7, 2, 0],
  ];
  const result = optimizeOpenRoute(durations);
  assert.equal(result[0], 0);
  assert.deepEqual([...result].sort((a, b) => a - b), [0, 1, 2]);
});
