import assert from "node:assert/strict";
import test from "node:test";

import { createSessionToken, verifySessionToken } from "./auth-session.ts";

test("creates and verifies signed role sessions", async () => {
  process.env.AUTH_SECRET = "test-secret-that-is-long-enough-for-session-signing";
  const token = await createSessionToken("admin");
  assert.equal(await verifySessionToken(token), "admin");
});

test("rejects altered and legacy plain-text cookies", async () => {
  process.env.AUTH_SECRET = "test-secret-that-is-long-enough-for-session-signing";
  const token = await createSessionToken("staff");
  const [payload, signature] = token.split(".");
  const alteredPayload = `${payload[0] === "a" ? "b" : "a"}${payload.slice(1)}`;
  assert.equal(await verifySessionToken(`${alteredPayload}.${signature}`), null);
  assert.equal(await verifySessionToken("admin"), null);
});


test("rotating the signing secret invalidates existing staff and admin sessions", async () => {
  process.env.AUTH_SECRET = "previous-quarter-test-signing-secret";
  const staff = await createSessionToken("staff");
  const admin = await createSessionToken("admin");
  process.env.AUTH_SECRET = "new-quarter-test-signing-secret";
  assert.equal(await verifySessionToken(staff), null);
  assert.equal(await verifySessionToken(admin), null);
  assert.equal(await verifySessionToken(await createSessionToken("staff")), "staff");
  assert.equal(await verifySessionToken(await createSessionToken("admin")), "admin");
});
