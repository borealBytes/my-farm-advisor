import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  collectGrowerCoverageMatrix,
  loadKsGrowerDashboardPayload,
} from "../../scripts/grower-dashboard/data-adapter.ts";

const repoRoot = path.resolve(import.meta.dirname, "..", "..");

describe("ks grower dashboard data adapter", () => {
  it("normalizes ks-grower-02 into the Task 1 payload contract", () => {
    const payload = loadKsGrowerDashboardPayload(repoRoot);

    expect(payload.grower).toMatchObject({
      growerSlug: "ks-grower-02",
      growerName: "KS Grower 02",
      timezone: "America/Chicago",
    });
    expect(payload.farm).toMatchObject({
      farmSlug: "prairie-farm",
      farmName: "Prairie Farm",
      stateCode: "KS",
      countyName: "Butler",
      fieldCount: 5,
    });
    expect(payload.fields.map((field) => field.fieldId)).toEqual([
      "osm-1423087101",
      "osm-1423116261",
      "osm-1424247197",
      "osm-666033354",
      "osm-667302408",
    ]);
    expect(payload.fields.every((field) => field.stateCode === "KS")).toBe(true);
  });

  it("preserves source mismatches in diagnostics while exposing kansas-consistent labels", () => {
    const payload = loadKsGrowerDashboardPayload(repoRoot);

    const farmMismatch = payload.diagnostics.find(
      (entry) => entry.code === "farm-json-location-mismatch",
    );
    expect(payload.farm.farmName).toBe("Prairie Farm");
    expect(payload.farm.stateCode).toBe("KS");
    expect(farmMismatch).toMatchObject({
      severity: "warning",
      fieldIds: payload.fields.map((field) => field.fieldId),
    });
    expect(farmMismatch?.message).toContain("Iowa Demo Farm");
    expect(farmMismatch?.message).toContain("Prairie Farm");

    const fieldIdDiagnostics = payload.diagnostics.filter(
      (entry) => entry.code === "field-json-field-id-case-normalized",
    );
    expect(fieldIdDiagnostics).toHaveLength(5);
    expect(fieldIdDiagnostics[0]?.message).toContain("OSM_");
  });

  it("reconciles imagery coverage from on-disk tiff presence instead of manifest truth alone", () => {
    const payload = loadKsGrowerDashboardPayload(repoRoot);

    const staleCoverage = payload.imageryCoverage.find(
      (entry) => entry.fieldId === "osm-1424247197" && entry.source === "landsat",
    );
    expect(staleCoverage).toMatchObject({
      fieldId: "osm-1424247197",
      source: "landsat",
      expectedSceneCount: 0,
      reconciled: true,
    });
    expect(staleCoverage?.sceneCount).toBeGreaterThan(0);

    const derivedScene = payload.imageryScenes.find(
      (entry) => entry.fieldId === "osm-1424247197" && entry.source === "landsat",
    );
    expect(derivedScene?.notes).toContain(
      "scene derived from on-disk TIFF presence because manifest metadata was missing",
    );

    const staleDiagnostic = payload.diagnostics.find(
      (entry) => entry.code === "imagery-manifest-stale-filesystem-wins",
    );
    expect(staleDiagnostic).toMatchObject({
      severity: "warning",
      fieldIds: ["osm-1424247197"],
    });
  });

  it("produces the expected five-field coverage matrix with three imagery-ready fields", () => {
    const payload = loadKsGrowerDashboardPayload(repoRoot);
    const coverageMatrix = collectGrowerCoverageMatrix(payload);

    expect(coverageMatrix).toEqual([
      {
        fieldId: "osm-1423087101",
        boundary: true,
        weather: true,
        soil: true,
        crop: true,
        imagery: true,
      },
      {
        fieldId: "osm-1423116261",
        boundary: true,
        weather: true,
        soil: true,
        crop: true,
        imagery: true,
      },
      {
        fieldId: "osm-1424247197",
        boundary: true,
        weather: true,
        soil: true,
        crop: true,
        imagery: true,
      },
      {
        fieldId: "osm-666033354",
        boundary: true,
        weather: true,
        soil: true,
        crop: true,
        imagery: false,
      },
      {
        fieldId: "osm-667302408",
        boundary: true,
        weather: true,
        soil: true,
        crop: true,
        imagery: false,
      },
    ]);

    expect(
      coverageMatrix.filter((entry) => entry.boundary && entry.weather && entry.soil && entry.crop),
    ).toHaveLength(5);
    expect(coverageMatrix.filter((entry) => entry.imagery)).toHaveLength(3);
  });
});
