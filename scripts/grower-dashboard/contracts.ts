import path from "node:path";

export const GROWER_DASHBOARD_CONTRACT_VERSION = "2026-03-24.ks-grower-dashboard.v2";
export const GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID = "grower-dashboard-payload";
export const GROWER_DASHBOARD_RUNTIME_DATA_MODE = "embedded-normalized-only" as const;
export const GROWER_DASHBOARD_KS_GROWER_SLUG = "ks-grower-02";
export const GROWER_DASHBOARD_HTML_BASENAME = `${GROWER_DASHBOARD_KS_GROWER_SLUG}-dashboard.html`;
export const GROWER_DASHBOARD_RELATIVE_OUTPUT_PATH = path.join(
  "data",
  "my-farm-advisor",
  "growers",
  GROWER_DASHBOARD_KS_GROWER_SLUG,
  GROWER_DASHBOARD_HTML_BASENAME,
);

export interface DashboardPointGeometry {
  lat: number;
  lon: number;
}

export interface DashboardPolygonGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface DashboardFieldBoundary {
  bbox: readonly [west: number, south: number, east: number, north: number];
  centroid: DashboardPointGeometry;
  geometry: DashboardPolygonGeometry;
}

export interface NormalizedGrowerDashboardGrower {
  growerSlug: string;
  growerName: string;
  growerRoot: string;
  timezone: string;
}

export interface NormalizedGrowerDashboardFarm {
  growerSlug: string;
  farmSlug: string;
  farmName: string;
  stateCode: string;
  countyName: string | null;
  totalAcres: number;
  fieldCount: number;
}

export interface NormalizedGrowerDashboardField {
  fieldId: string;
  fieldSlug: string;
  fieldName: string;
  areaAcres: number;
  countyName: string | null;
  stateCode: string;
  boundary: DashboardFieldBoundary;
}

export interface NormalizedGrowerDashboardWeatherSeriesEntry {
  fieldId: string;
  sourceLat: number | null;
  sourceLon: number | null;
  date: string;
  temperatureAvgC: number | null;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  precipitationMm: number | null;
  solarRadiationKwhM2: number | null;
  relativeHumidityPct: number | null;
  windSpeedMps: number | null;
  gddC: number | null;
}

export interface NormalizedGrowerDashboardSoilSummaryEntry {
  fieldId: string;
  dominantSoil: string | null;
  drainageClass: string | null;
  avgOrganicMatterPct: number | null;
  avgPh: number | null;
  avgCec: number | null;
  avgClayPct: number | null;
  avgSandPct: number | null;
  totalAwsInches: number | null;
  horizonCount: number;
}

export interface NormalizedGrowerDashboardSoilHorizonEntry {
  fieldId: string;
  componentName: string | null;
  componentPct: number | null;
  horizonTopCm: number | null;
  horizonBottomCm: number | null;
  organicMatterPct: number | null;
  ph: number | null;
  cec: number | null;
  clayPct: number | null;
  siltPct: number | null;
  sandPct: number | null;
  bulkDensity: number | null;
  availableWaterCapacity: number | null;
}

export interface NormalizedGrowerDashboardCropRotationEntry {
  fieldId: string;
  rotationSequence: string;
  rotationCount: number;
  rotationPatterns: string[];
  historyYears: number;
  historyStartYear: number | null;
  historyEndYear: number | null;
  cropDiversity: number;
  cornYears: number;
  soybeanYears: number;
  predictedNextCrop: string | null;
  predictedFollowingCrop: string | null;
  rotationConfidence: string | null;
  rotationOutlook: string;
  source: string;
}

export interface NormalizedGrowerDashboardCropCompositionEntry {
  fieldId: string;
  year: number;
  cropName: string;
  cropCode: string | null;
  pct: number;
  source: string;
}

export interface NormalizedGrowerDashboardImageryCoverageEntry {
  fieldId: string;
  source: string;
  firstSceneDate: string | null;
  lastSceneDate: string | null;
  sceneCount: number;
  expectedSceneCount: number | null;
  coveragePct: number | null;
  reconciled: boolean;
}

export interface NormalizedGrowerDashboardImagerySceneEntry {
  fieldId: string;
  source: string;
  sceneDate: string;
  sceneId: string;
  cloudPct: number | null;
  assetCount: number;
  notes: string[];
}

export interface NormalizedGrowerDashboardDiagnosticEntry {
  severity: "info" | "warning" | "error";
  code: string;
  message: string;
  fieldIds: string[];
  sourcePaths: string[];
}

export interface GrowerDashboardBrowserRuntimeContract {
  dataMode: typeof GROWER_DASHBOARD_RUNTIME_DATA_MODE;
  embeddedPayloadScriptId: typeof GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID;
  rawSourceAccess: "forbidden";
  networkFetch: "forbidden";
  serviceWorker: "forbidden";
  localStorage: "forbidden";
}

export interface NormalizedGrowerDashboardPayload {
  contractVersion: typeof GROWER_DASHBOARD_CONTRACT_VERSION;
  generatedAt: string;
  runtime: GrowerDashboardBrowserRuntimeContract;
  grower: NormalizedGrowerDashboardGrower;
  farm: NormalizedGrowerDashboardFarm;
  fields: NormalizedGrowerDashboardField[];
  weatherSeries: NormalizedGrowerDashboardWeatherSeriesEntry[];
  soilSummary: NormalizedGrowerDashboardSoilSummaryEntry[];
  soilHorizons: NormalizedGrowerDashboardSoilHorizonEntry[];
  cropRotation: NormalizedGrowerDashboardCropRotationEntry[];
  cropComposition: NormalizedGrowerDashboardCropCompositionEntry[];
  imageryCoverage: NormalizedGrowerDashboardImageryCoverageEntry[];
  imageryScenes: NormalizedGrowerDashboardImagerySceneEntry[];
  diagnostics: NormalizedGrowerDashboardDiagnosticEntry[];
}

export const GROWER_DASHBOARD_BROWSER_RUNTIME_CONTRACT: GrowerDashboardBrowserRuntimeContract = {
  dataMode: GROWER_DASHBOARD_RUNTIME_DATA_MODE,
  embeddedPayloadScriptId: GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  rawSourceAccess: "forbidden",
  networkFetch: "forbidden",
  serviceWorker: "forbidden",
  localStorage: "forbidden",
};

export function resolveGrowerDashboardOutputPath(repoRoot: string, growerSlug: string): string {
  return path.resolve(
    repoRoot,
    "data",
    "my-farm-advisor",
    "growers",
    growerSlug,
    `${growerSlug}-dashboard.html`,
  );
}

export function resolveKsGrowerDashboardOutputPath(repoRoot: string): string {
  return resolveGrowerDashboardOutputPath(repoRoot, GROWER_DASHBOARD_KS_GROWER_SLUG);
}

export function assertNormalizedGrowerDashboardPayload(
  payload: NormalizedGrowerDashboardPayload,
): void {
  if (payload.contractVersion !== GROWER_DASHBOARD_CONTRACT_VERSION) {
    throw new Error("Unsupported dashboard contract version: " + String(payload.contractVersion));
  }
  if (payload.runtime.dataMode !== GROWER_DASHBOARD_RUNTIME_DATA_MODE) {
    throw new Error("Dashboard runtime must consume embedded normalized data only.");
  }
  if (payload.runtime.embeddedPayloadScriptId !== GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID) {
    throw new Error("Dashboard runtime must read the canonical embedded payload script tag.");
  }
  if (
    payload.runtime.rawSourceAccess !== "forbidden" ||
    payload.runtime.networkFetch !== "forbidden" ||
    payload.runtime.serviceWorker !== "forbidden" ||
    payload.runtime.localStorage !== "forbidden"
  ) {
    throw new Error("Dashboard runtime cannot rely on raw files or browser storage/network APIs.");
  }

  const requiredCollections = [
    payload.fields,
    payload.weatherSeries,
    payload.soilSummary,
    payload.soilHorizons,
    payload.cropRotation,
    payload.cropComposition,
    payload.imageryCoverage,
    payload.imageryScenes,
    payload.diagnostics,
  ];
  if (requiredCollections.some((value) => !Array.isArray(value))) {
    throw new Error("Dashboard payload collections must all be normalized arrays.");
  }

  for (const weatherEntry of payload.weatherSeries) {
    if (!("solarRadiationKwhM2" in weatherEntry)) {
      throw new Error("Weather series entries must carry normalized solar radiation.");
    }
    if (!("relativeHumidityPct" in weatherEntry)) {
      throw new Error("Weather series entries must carry normalized relative humidity.");
    }
    if (!("windSpeedMps" in weatherEntry)) {
      throw new Error("Weather series entries must carry normalized wind speed.");
    }
  }

  for (const soilEntry of payload.soilSummary) {
    if (!("avgClayPct" in soilEntry) || !("avgSandPct" in soilEntry)) {
      throw new Error("Soil summary entries must carry normalized clay and sand percentages.");
    }
  }

  for (const rotationEntry of payload.cropRotation) {
    if (!rotationEntry.rotationSequence) {
      throw new Error("Crop rotation entries must carry the summarized rotation sequence.");
    }
    if (!rotationEntry.rotationOutlook) {
      throw new Error("Crop rotation entries must carry the summarized rotation outlook.");
    }
    if (!Array.isArray(rotationEntry.rotationPatterns)) {
      throw new Error("Crop rotation entries must normalize rotation patterns as an array.");
    }
  }
}
