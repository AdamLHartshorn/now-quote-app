import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { filterProspects, prospectOwner, type HiringProspect } from "./prospect-watch.ts";

const data = JSON.parse(readFileSync(new URL("./prospect-watch-data.json", import.meta.url), "utf8")) as { records: HiringProspect[] };
test("admin ZIP overrides control prospect ownership; unknown sites are never guessed", () => {
  assert.equal(prospectOwner("46227", { "46227": "Jon" }, { "46227": "Shawn" }), "Shawn");
  assert.equal(prospectOwner(null, {}, {}), "Area-wide");
  assert.equal(prospectOwner("99999", {}, {}), "Outside assigned ZIPs");
  assert.equal(prospectOwner("46227", { "46227": "Jon" }, {}, false), "Assignment unavailable");
});
test("rep, search, and new filters intersect without losing data", () => {
  const all = data.records.map(p => ({ ...p, owner: p.id === "bay-insulation" ? "Jon" : "Adam" }));
  assert.equal(filterProspects(all, "Jon", "insulation 46227", true)[0]?.id, "bay-insulation");
  assert.equal(filterProspects(all, "Adam", "insulation 46227", true).length, 0);
  assert.equal(filterProspects(all, "ALL", "", false).length, data.records.length);
  assert.equal(filterProspects(all, "ALL", "zzzznothing", false).length, 0);
});
test("published records have unique identities, dated evidence, sources, and qualification context", () => {
  assert.equal(new Set(data.records.map(p => p.id)).size, data.records.length);
  for (const p of data.records) {
    assert.match(p.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(p.zip === null || /^\d{5}$/.test(p.zip));
    assert.equal(new URL(p.sourceUrl).protocol, "https:");
    assert.ok(p.evidence && p.qualification && p.opportunity && p.equipment.length);
  }
  assert.equal(data.records.find(p => p.id === "cornerstone-shelbyville")?.zip, "46176");
  assert.equal(data.records.find(p => p.id === "quench-indianapolis")?.zip, null);
  assert.ok(data.records.find(p => p.id === "graybar-indianapolis")?.sourceUrl.endsWith("R261110"));
});
