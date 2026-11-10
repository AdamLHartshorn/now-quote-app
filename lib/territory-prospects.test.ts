import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

type Profile = { id: string; name: string; category: string; address: string; reason: string; sourceUrl: string; researchedOn: string };
const read = (name: string) => JSON.parse(readFileSync(new URL(name, import.meta.url), "utf8"));
const data = read("./territory-prospect-data.json") as { researchedOn: string; targetPerZip: number; summary: { totalProspects: number; totalZips: number; zipsAtTarget: number; zipsWithProspects: number }; zips: Record<string, { prospects: Profile[]; note?: string }> };
const territory = read("./territory-data.json") as { territories: { zip: string }[] };

test("every map ZIP has an exact research result or an explicit shortfall", () => {
  assert.deepEqual(Object.keys(data.zips).sort(), territory.territories.map(p => p.zip).sort());
  assert.equal(data.targetPerZip, 5);
  for (const [zip, entry] of Object.entries(data.zips)) {
    assert.ok(entry.prospects.length <= 5, zip);
    assert.equal(Boolean(entry.note), entry.prospects.length < 5, zip);
    if (entry.note) assert.ok(entry.note.startsWith(`${entry.prospects.length} of 5 target prospects published.`));
    for (const p of entry.prospects) {
      assert.match(p.address, new RegExp(`\\bIN,? ${zip}(?:-\\d{4})?\\b`), p.name);
      assert.ok(!/P\.?(?:O|\sO)\.?\s*Box/i.test(p.address), p.name);
      assert.ok(p.name && p.category && p.reason && p.sourceUrl, p.id);
      assert.ok(["http:", "https:"].includes(new URL(p.sourceUrl).protocol));
      assert.equal(p.researchedOn, data.researchedOn);
    }
  }
});

test("published identities are unique and all 35 original prospects remain", () => {
  const profiles = Object.values(data.zips).flatMap(p => p.prospects);
  const ids = new Set(profiles.map(p => p.id));
  assert.equal(ids.size, profiles.length);
  for (const zip of ["47201", "47203", "46140", "46168", "46112", "46060", "46176"]) {
    for (let i = 1; i <= 5; i++) assert.ok(ids.has(`${zip}-${i}`));
  }
  for (const { prospects } of Object.values(data.zips)) {
    const names = prospects.map(p => p.name.toLowerCase().replace(/[^a-z0-9]/g, ""));
    assert.equal(new Set(names).size, names.length);
    assert.equal(new Set(prospects.map(p => p.address.toLowerCase())).size, prospects.length);
  }
});

test("coverage totals never count shortfalls as complete ZIPs", () => {
  const entries = Object.values(data.zips);
  assert.equal(data.summary.totalProspects, entries.reduce((sum, e) => sum + e.prospects.length, 0));
  assert.equal(data.summary.totalZips, entries.length);
  assert.equal(data.summary.zipsAtTarget, entries.filter(e => e.prospects.length === 5).length);
  assert.equal(data.summary.zipsWithProspects, entries.filter(e => e.prospects.length > 0).length);
  assert.ok(data.summary.totalProspects > 35);
  assert.equal(data.zips["46255"].prospects.length, 0);
  assert.ok(data.zips["46255"].note?.includes("special-use ZIP"));
});
