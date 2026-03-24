import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  GROWER_DASHBOARD_BROWSER_RUNTIME_CONTRACT,
  GROWER_DASHBOARD_CONTRACT_VERSION,
  GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  GROWER_DASHBOARD_KS_GROWER_SLUG,
  GROWER_DASHBOARD_RELATIVE_OUTPUT_PATH,
  assertNormalizedGrowerDashboardPayload,
  resolveGrowerDashboardOutputPath,
  resolveKsGrowerDashboardOutputPath,
  type NormalizedGrowerDashboardPayload,
} from "../../scripts/grower-dashboard/contracts.ts";

describe("grower dashboard contract", () => {
  it("locks the offline html output to the grower root for ks-grower-02", () => {
    expect(GROWER_DASHBOARD_RELATIVE_OUTPUT_PATH).toBe(
      path.join(
        "data",
        "my-farm-advisor",
        "growers",
        "ks-grower-02",
        "ks-grower-02-dashboard.html",
      ),
    );

    expect(resolveKsGrowerDashboardOutputPath("/repo")).toBe(
      path.resolve(
        "/repo",
        "data",
        "my-farm-advisor",
        "growers",
        "ks-grower-02",
        "ks-grower-02-dashboard.html",
      ),
    );

    expect(resolveGrowerDashboardOutputPath("/repo", GROWER_DASHBOARD_KS_GROWER_SLUG)).toBe(
      resolveKsGrowerDashboardOutputPath("/repo"),
    );
  });

  it("requires browser runtime to consume embedded normalized data only", () => {
    const payload: NormalizedGrowerDashboardPayload = {
      contractVersion: GROWER_DASHBOARD_CONTRACT_VERSION,
      generatedAt: "2026-03-24T00:00:00.000Z",
      runtime: GROWER_DASHBOARD_BROWSER_RUNTIME_CONTRACT,
      grower: {
        growerSlug: "ks-grower-02",
        growerName: "KS Grower 02",
        growerRoot: "data/my-farm-advisor/growers/ks-grower-02",
        timezone: "America/Chicago",
      },
      farm: {
        growerSlug: "ks-grower-02",
        farmSlug: "ks-farm-01",
        farmName: "Kansas Farm 01",
        stateCode: "KS",
        countyName: "Finney",
        totalAcres: 640,
        fieldCount: 1,
      },
      fields: [
        {
          fieldId: "field-001",
          fieldSlug: "field-001",
          fieldName: "Field 001",
          areaAcres: 128,
          countyName: "Finney",
          stateCode: "KS",
          boundary: {
            bbox: [-100.0, 37.0, -99.9, 37.1],
            centroid: { lat: 37.05, lon: -99.95 },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-100.0, 37.0],
                  [-99.9, 37.0],
                  [-99.9, 37.1],
                  [-100.0, 37.1],
                  [-100.0, 37.0],
                ],
              ],
            },
          },
        },
      ],
      weatherSeries: [
        {
          fieldId: "field-001",
          sourceLat: 37.64,
          sourceLon: -97.14,
          date: "2025-05-01",
          temperatureAvgC: 18,
          temperatureMinC: 9,
          temperatureMaxC: 27,
          precipitationMm: 4,
          solarRadiationKwhM2: 8.5,
          relativeHumidityPct: 77.34,
          windSpeedMps: 4.82,
          gddC: 10,
        },
      ],
      soilSummary: [
        {
          fieldId: "field-001",
          dominantSoil: "Richfield silt loam",
          drainageClass: "Well drained",
          avgOrganicMatterPct: 2.6,
          avgPh: 6.8,
          avgCec: 18.2,
          avgClayPct: 18,
          avgSandPct: 24,
          totalAwsInches: 8.5,
          horizonCount: 3,
        },
      ],
      soilHorizons: [
        {
          fieldId: "field-001",
          componentName: "Richfield",
          componentPct: 82,
          horizonTopCm: 0,
          horizonBottomCm: 20,
          organicMatterPct: 2.4,
          ph: 6.7,
          cec: 17.5,
          clayPct: 18,
          siltPct: 58,
          sandPct: 24,
          bulkDensity: 1.28,
          availableWaterCapacity: 0.19,
        },
      ],
      cropRotation: [
        {
          fieldId: "field-001",
          rotationSequence: "Soybeans -> Corn -> Soybeans -> Corn -> Soybeans",
          rotationCount: 4,
          rotationPatterns: ["Corn → Soybeans", "Soybeans → Corn"],
          historyYears: 5,
          historyStartYear: 2020,
          historyEndYear: 2024,
          cropDiversity: 2,
          cornYears: 2,
          soybeanYears: 3,
          predictedNextCrop: "Corn",
          predictedFollowingCrop: "Soybeans",
          rotationConfidence: "high",
          rotationOutlook:
            "Heuristic outlook: Corn next, then Soybeans, based on the recent rotation pattern.",
          source: "prairie_crop_rotation.csv",
        },
      ],
      cropComposition: [
        {
          fieldId: "field-001",
          year: 2024,
          cropName: "Corn",
          cropCode: "1",
          pct: 100,
          source: "cdl",
        },
      ],
      imageryCoverage: [
        {
          fieldId: "field-001",
          source: "sentinel-2",
          firstSceneDate: "2025-04-01",
          lastSceneDate: "2025-05-01",
          sceneCount: 4,
          expectedSceneCount: 5,
          coveragePct: 80,
          reconciled: true,
        },
      ],
      imageryScenes: [
        {
          fieldId: "field-001",
          source: "sentinel-2",
          sceneDate: "2025-05-01",
          sceneId: "S2A_20250501_FIELD001",
          cloudPct: 12,
          assetCount: 2,
          notes: ["coverage reconciled against local manifest"],
        },
      ],
      diagnostics: [
        {
          severity: "warning",
          code: "farm-json-location-mismatch",
          message: "Farm metadata needs manual review before rendering labels.",
          fieldIds: ["field-001"],
          sourcePaths: ["data/my-farm-advisor/growers/ks-grower-02/farms/ks-farm-01/farm.json"],
        },
      ],
    };

    expect(payload.runtime.embeddedPayloadScriptId).toBe(
      GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
    );
    expect(() => assertNormalizedGrowerDashboardPayload(payload)).not.toThrow();
  });

  it("matches ks-grower-02 rotation summary semantics and expanded weather dimensions", () => {
    const payload: NormalizedGrowerDashboardPayload = {
      contractVersion: GROWER_DASHBOARD_CONTRACT_VERSION,
      generatedAt: "2026-03-24T00:00:00.000Z",
      runtime: GROWER_DASHBOARD_BROWSER_RUNTIME_CONTRACT,
      grower: {
        growerSlug: "ks-grower-02",
        growerName: "KS Grower 02",
        growerRoot: "data/my-farm-advisor/growers/ks-grower-02",
        timezone: "America/Chicago",
      },
      farm: {
        growerSlug: "ks-grower-02",
        farmSlug: "prairie-farm",
        farmName: "Prairie Farm",
        stateCode: "KS",
        countyName: "Sedgwick",
        totalAcres: 640,
        fieldCount: 5,
      },
      fields: [],
      weatherSeries: [
        {
          fieldId: "osm-1423087101",
          sourceLat: 37.640009321983264,
          sourceLon: -97.14141907248593,
          date: "2021-01-05",
          temperatureAvgC: 2.98,
          temperatureMinC: -2.53,
          temperatureMaxC: 9.1,
          precipitationMm: 0.01,
          solarRadiationKwhM2: 8.5,
          relativeHumidityPct: 77.34,
          windSpeedMps: 4.82,
          gddC: 0,
        },
      ],
      soilSummary: [
        {
          fieldId: "osm-1423087101",
          dominantSoil: null,
          drainageClass: null,
          avgOrganicMatterPct: null,
          avgPh: null,
          avgCec: null,
          avgClayPct: 18,
          avgSandPct: 24,
          totalAwsInches: null,
          horizonCount: 0,
        },
      ],
      soilHorizons: [],
      cropRotation: [
        {
          fieldId: "osm-666033354",
          rotationSequence: "Soybeans -> Corn -> Soybeans -> Corn -> Soybeans",
          rotationCount: 4,
          rotationPatterns: ["Corn → Soybeans", "Soybeans → Corn"],
          historyYears: 5,
          historyStartYear: 2020,
          historyEndYear: 2024,
          cropDiversity: 2,
          cornYears: 2,
          soybeanYears: 3,
          predictedNextCrop: "Corn",
          predictedFollowingCrop: "Soybeans",
          rotationConfidence: "high",
          rotationOutlook:
            "Heuristic outlook: Corn next, then Soybeans, based on the recent rotation pattern.",
          source: "prairie_crop_rotation.csv",
        },
      ],
      cropComposition: [
        {
          fieldId: "osm-666033354",
          year: 2024,
          cropName: "Soybeans",
          cropCode: "5",
          pct: 79.17,
          source: "prairie_cdl_2020_2024_full_composition.csv",
        },
      ],
      imageryCoverage: [],
      imageryScenes: [],
      diagnostics: [],
    };

    expect(payload.cropRotation[0]).toMatchObject({
      rotationSequence: "Soybeans -> Corn -> Soybeans -> Corn -> Soybeans",
      historyStartYear: 2020,
      historyEndYear: 2024,
      predictedNextCrop: "Corn",
      predictedFollowingCrop: "Soybeans",
      rotationConfidence: "high",
    });
    expect(payload.cropComposition[0]).toMatchObject({
      year: 2024,
      cropName: "Soybeans",
      cropCode: "5",
      pct: 79.17,
    });
    expect(payload.weatherSeries[0]).toMatchObject({
      sourceLat: 37.640009321983264,
      sourceLon: -97.14141907248593,
      solarRadiationKwhM2: 8.5,
      relativeHumidityPct: 77.34,
      windSpeedMps: 4.82,
    });
    expect(payload.soilSummary[0]).toMatchObject({
      avgClayPct: 18,
      avgSandPct: 24,
    });
    expect(() => assertNormalizedGrowerDashboardPayload(payload)).not.toThrow();
  });
});
