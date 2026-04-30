import fs from "node:fs";
import path from "node:path";
import {
  assertNormalizedGrowerDashboardPayload,
  GROWER_DASHBOARD_BROWSER_RUNTIME_CONTRACT,
  GROWER_DASHBOARD_CONTRACT_VERSION,
  GROWER_DASHBOARD_KS_GROWER_SLUG,
  type DashboardFieldBoundary,
  type DashboardPolygonGeometry,
  type NormalizedGrowerDashboardCropCompositionEntry,
  type NormalizedGrowerDashboardCropRotationEntry,
  type NormalizedGrowerDashboardDiagnosticEntry,
  type NormalizedGrowerDashboardField,
  type NormalizedGrowerDashboardImageryCoverageEntry,
  type NormalizedGrowerDashboardImagerySceneEntry,
  type NormalizedGrowerDashboardPayload,
  type NormalizedGrowerDashboardSoilHorizonEntry,
  type NormalizedGrowerDashboardSoilSummaryEntry,
  type NormalizedGrowerDashboardWeatherSeriesEntry,
} from "./contracts.ts";

type CsvRow = Record<string, string>;

type BoundaryFeature = {
  properties: {
    field_id: string;
    county_name?: string;
    state_fips?: string;
    area_acres?: number;
  };
  geometry: DashboardPolygonGeometry;
};

type FieldMetadata = {
  field_slug?: string;
  display_name?: string;
  field_id?: string;
};

type FarmMetadata = {
  farm_slug?: string;
  display_name?: string;
  state?: string;
};

type GrowerMetadata = {
  display_name?: string;
};

type ManifestScene = {
  scene_id?: string;
  scene_date?: string;
  cloud_cover?: number;
  raw_tiffs?: Record<string, string>;
  ndvi_tif?: string;
};

type ManifestYear = {
  year?: number;
  scene_count?: number;
  scenes?: ManifestScene[];
};

type SatelliteManifest = {
  field_id?: string;
  field_slug?: string;
  years?: ManifestYear[];
};

type ActualScene = {
  sceneDate: string;
  sceneKey: string;
  assetCount: number;
};

type CoverageMatrixEntry = {
  fieldId: string;
  boundary: boolean;
  weather: boolean;
  soil: boolean;
  crop: boolean;
  imagery: boolean;
};

const STATE_FIPS_TO_CODE: Record<string, string> = {
  "20": "KS",
};

const GROWER_TIMEZONE = "America/Chicago";
const GDD_BASE_C = 10;
const IMAGERY_SOURCES = ["landsat", "sentinel"] as const;

export function normalizeFieldId(rawValue: string | null | undefined): string {
  return String(rawValue ?? "")
    .trim()
    .replace(/_/g, "-")
    .toLowerCase();
}

function readJsonFile<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function parseCsv(content: string): CsvRow[] {
  const lines = content
    .split(/\r?\n/u)
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row: CsvRow = {};
    for (const [index, header] of headers.entries()) {
      row[header] = values[index] ?? "";
    }
    return row;
  });
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function readCsvFile(filePath: string): CsvRow[] {
  return parseCsv(fs.readFileSync(filePath, "utf8"));
}

function toNullableNumber(value: string | null | undefined): number | null {
  if (value == null || value.trim() === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toRequiredNumber(value: string | null | undefined, context: string): number {
  const parsed = toNullableNumber(value);
  if (parsed == null) {
    throw new Error(`Expected numeric value for ${context}.`);
  }
  return parsed;
}

function titleCaseSlug(value: string): string {
  return value
    .split(/[-_\s]+/u)
    .filter(Boolean)
    .map((part) => {
      if (/^[a-z]{2}$/iu.test(part)) {
        return part.toUpperCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

function flattenCoordinates(coordinates: DashboardPolygonGeometry["coordinates"]): number[][] {
  const flattened: number[][] = [];
  const walk = (value: DashboardPolygonGeometry["coordinates"] | number[][] | number[]): void => {
    if (!Array.isArray(value) || value.length === 0) {
      return;
    }
    if (typeof value[0] === "number") {
      flattened.push(value as number[]);
      return;
    }
    for (const entry of value as Array<
      DashboardPolygonGeometry["coordinates"] | number[][] | number[]
    >) {
      walk(entry);
    }
  };
  walk(coordinates);
  return flattened;
}

function buildBoundary(feature: BoundaryFeature): DashboardFieldBoundary {
  const points = flattenCoordinates(feature.geometry.coordinates);
  let west = Number.POSITIVE_INFINITY;
  let south = Number.POSITIVE_INFINITY;
  let east = Number.NEGATIVE_INFINITY;
  let north = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    const [lon, lat] = point;
    west = Math.min(west, lon);
    south = Math.min(south, lat);
    east = Math.max(east, lon);
    north = Math.max(north, lat);
  }

  return {
    bbox: [west, south, east, north],
    centroid: {
      lat: (south + north) / 2,
      lon: (west + east) / 2,
    },
    geometry: feature.geometry,
  };
}

function listActualScenes(sourceDirectory: string): ActualScene[] {
  if (!fs.existsSync(sourceDirectory)) {
    return [];
  }

  const scenes: ActualScene[] = [];
  const yearEntries = fs.readdirSync(sourceDirectory, { withFileTypes: true });

  for (const yearEntry of yearEntries) {
    if (!yearEntry.isDirectory()) {
      continue;
    }
    const yearPath = path.join(sourceDirectory, yearEntry.name);
    for (const sceneEntry of fs.readdirSync(yearPath, { withFileTypes: true })) {
      if (!sceneEntry.isDirectory()) {
        continue;
      }
      const scenePath = path.join(yearPath, sceneEntry.name);
      const assetCount = fs
        .readdirSync(scenePath, { withFileTypes: true })
        .filter(
          (entry) =>
            entry.isFile() && [".tif", ".tiff"].includes(path.extname(entry.name).toLowerCase()),
        ).length;

      if (assetCount === 0) {
        continue;
      }

      const dateMatch = sceneEntry.name.match(/(\d{4})(\d{2})(\d{2})/u);
      const sceneDate = dateMatch
        ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
        : `${yearEntry.name}-01-01`;

      scenes.push({
        sceneDate,
        sceneKey: sceneEntry.name,
        assetCount,
      });
    }
  }

  scenes.sort((left, right) => left.sceneDate.localeCompare(right.sceneDate));
  return scenes;
}

function expectedSceneCount(manifest: SatelliteManifest): number {
  return (manifest.years ?? []).reduce((total, year) => total + (year.scenes?.length ?? 0), 0);
}

function indexManifestScenes(manifest: SatelliteManifest): Map<string, ManifestScene[]> {
  const index = new Map<string, ManifestScene[]>();
  for (const year of manifest.years ?? []) {
    for (const scene of year.scenes ?? []) {
      if (!scene.scene_date) {
        continue;
      }
      const existing = index.get(scene.scene_date) ?? [];
      existing.push(scene);
      index.set(scene.scene_date, existing);
    }
  }
  return index;
}

function firstDefined<T>(values: T[]): T | null {
  for (const value of values) {
    if (value != null) {
      return value;
    }
  }
  return null;
}

function normalizeRotationPatterns(value: string): string[] {
  return value
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

function relativeToRepo(repoRoot: string, absolutePath: string): string {
  return path.relative(repoRoot, absolutePath).split(path.sep).join("/");
}

export function loadKsGrowerDashboardPayload(repoRoot: string): NormalizedGrowerDashboardPayload {
  const growerRoot = path.resolve(
    repoRoot,
    "data",
    "my-farm-advisor",
    "growers",
    GROWER_DASHBOARD_KS_GROWER_SLUG,
  );
  const farmRoot = path.join(growerRoot, "farms", "prairie-farm");
  const diagnostics: NormalizedGrowerDashboardDiagnosticEntry[] = [];

  const growerJsonPath = path.join(growerRoot, "grower.json");
  const farmJsonPath = path.join(farmRoot, "farm.json");
  const inventoryPath = path.join(farmRoot, "manifests", "field-inventory.csv");
  const boundaryPath = path.join(farmRoot, "boundary", "field_boundaries.geojson");
  const weatherPath = path.join(farmRoot, "derived", "tables", "prairie_weather_2021_2025.csv");
  const soilSummaryPath = path.join(farmRoot, "derived", "tables", "prairie_ssurgo_summary.csv");
  const soilDetailPath = path.join(farmRoot, "derived", "tables", "prairie_fields_soil.csv");
  const rotationPath = path.join(farmRoot, "derived", "tables", "prairie_crop_rotation.csv");
  const compositionPath = path.join(
    farmRoot,
    "derived",
    "tables",
    "prairie_cdl_2020_2024_full_composition.csv",
  );

  const growerMetadata = readJsonFile<GrowerMetadata>(growerJsonPath);
  const farmMetadata = readJsonFile<FarmMetadata>(farmJsonPath);
  const inventoryRows = readCsvFile(inventoryPath);
  const boundaryCollection = readJsonFile<{ features: BoundaryFeature[] }>(boundaryPath);
  const weatherRows = readCsvFile(weatherPath);
  const soilSummaryRows = readCsvFile(soilSummaryPath);
  const soilDetailRows = readCsvFile(soilDetailPath);
  const rotationRows = readCsvFile(rotationPath);
  const compositionRows = readCsvFile(compositionPath);

  const inventoryFieldIds = inventoryRows.map((row) => normalizeFieldId(row.field_id));
  const boundaryByFieldId = new Map(
    boundaryCollection.features.map((feature) => [
      normalizeFieldId(feature.properties.field_id),
      feature,
    ]),
  );

  const weatherSeries: NormalizedGrowerDashboardWeatherSeriesEntry[] = weatherRows.map((row) => {
    const temperatureAvgC = toNullableNumber(row.T2M);
    return {
      fieldId: normalizeFieldId(row.field_id),
      sourceLat: toNullableNumber(row.lat),
      sourceLon: toNullableNumber(row.lon),
      date: row.date,
      temperatureAvgC,
      temperatureMinC: toNullableNumber(row.T2M_MIN),
      temperatureMaxC: toNullableNumber(row.T2M_MAX),
      precipitationMm: toNullableNumber(row.PRECTOTCORR),
      solarRadiationKwhM2: toNullableNumber(row.ALLSKY_SFC_SW_DWN),
      relativeHumidityPct: toNullableNumber(row.RH2M),
      windSpeedMps: toNullableNumber(row.WS10M),
      gddC: temperatureAvgC == null ? null : Math.max(temperatureAvgC - GDD_BASE_C, 0),
    };
  });

  const soilSummary: NormalizedGrowerDashboardSoilSummaryEntry[] = soilSummaryRows.map((row) => ({
    fieldId: normalizeFieldId(row.field_id),
    dominantSoil: row.dominant_soil || null,
    drainageClass: row.drainage_class || null,
    avgOrganicMatterPct: toNullableNumber(row.avg_om_pct),
    avgPh: toNullableNumber(row.avg_ph),
    avgCec: toNullableNumber(row.avg_cec),
    avgClayPct: toNullableNumber(row.avg_clay_pct),
    avgSandPct: toNullableNumber(row.avg_sand_pct),
    totalAwsInches: toNullableNumber(row.total_aws_inches),
    horizonCount: toRequiredNumber(
      row.n_horizons,
      `soil summary horizon count for ${row.field_id}`,
    ),
  }));

  const soilHorizons: NormalizedGrowerDashboardSoilHorizonEntry[] = soilDetailRows.map((row) => ({
    fieldId: normalizeFieldId(row.field_id),
    componentName: row.compname || null,
    componentPct: toNullableNumber(row.comppct_r),
    horizonTopCm: toNullableNumber(row.hzdept_r),
    horizonBottomCm: toNullableNumber(row.hzdepb_r),
    organicMatterPct: toNullableNumber(row.om_r),
    ph: toNullableNumber(row.ph1to1h2o_r),
    cec: toNullableNumber(row.cec7_r),
    clayPct: toNullableNumber(row.claytotal_r),
    siltPct: toNullableNumber(row.silttotal_r),
    sandPct: toNullableNumber(row.sandtotal_r),
    bulkDensity: toNullableNumber(row.dbthirdbar_r),
    availableWaterCapacity: toNullableNumber(row.awc_r),
  }));

  const cropRotation: NormalizedGrowerDashboardCropRotationEntry[] = rotationRows.map((row) => ({
    fieldId: normalizeFieldId(row.field_id),
    rotationSequence: row.rotation_sequence,
    rotationCount: toRequiredNumber(row.rotation_count, `rotation count for ${row.field_id}`),
    rotationPatterns: normalizeRotationPatterns(row.rotation_patterns),
    historyYears: toRequiredNumber(row.history_years, `rotation history years for ${row.field_id}`),
    historyStartYear: toNullableNumber(row.history_start_year),
    historyEndYear: toNullableNumber(row.history_end_year),
    cropDiversity: toRequiredNumber(row.crop_diversity, `crop diversity for ${row.field_id}`),
    cornYears: toRequiredNumber(row.corn_years, `corn years for ${row.field_id}`),
    soybeanYears: toRequiredNumber(row.soybean_years, `soybean years for ${row.field_id}`),
    predictedNextCrop: row.predicted_next_crop || null,
    predictedFollowingCrop: row.predicted_following_crop || null,
    rotationConfidence: row.rotation_confidence || null,
    rotationOutlook: row.rotation_outlook,
    source: relativeToRepo(repoRoot, rotationPath),
  }));

  const cropComposition: NormalizedGrowerDashboardCropCompositionEntry[] = compositionRows.map(
    (row) => ({
      fieldId: normalizeFieldId(row.field_id),
      year: toRequiredNumber(row.year, `crop composition year for ${row.field_id}`),
      cropName: row.crop_name,
      cropCode: row.crop_code || null,
      pct: toRequiredNumber(row.pct, `crop composition percent for ${row.field_id}`),
      source: relativeToRepo(repoRoot, compositionPath),
    }),
  );

  const imageryCoverage: NormalizedGrowerDashboardImageryCoverageEntry[] = [];
  const imageryScenes: NormalizedGrowerDashboardImagerySceneEntry[] = [];

  const fields: NormalizedGrowerDashboardField[] = inventoryFieldIds.map((fieldId) => {
    const feature = boundaryByFieldId.get(fieldId);
    if (!feature) {
      throw new Error(`Missing boundary feature for field '${fieldId}'.`);
    }

    const fieldJsonPath = path.join(farmRoot, "fields", fieldId, "field.json");
    const fieldMetadata = readJsonFile<FieldMetadata>(fieldJsonPath);
    const rawFieldId = fieldMetadata.field_id ?? "";
    const normalizedFieldJsonId = normalizeFieldId(rawFieldId);
    if (normalizedFieldJsonId !== fieldId) {
      diagnostics.push({
        severity: "warning",
        code: "field-json-field-id-mismatch",
        message: `Field metadata uses raw field_id '${rawFieldId}' while normalized joins use '${fieldId}'.`,
        fieldIds: [fieldId],
        sourcePaths: [relativeToRepo(repoRoot, fieldJsonPath)],
      });
    } else if (rawFieldId !== fieldId) {
      diagnostics.push({
        severity: "info",
        code: "field-json-field-id-case-normalized",
        message: `Field metadata raw field_id '${rawFieldId}' is normalized to lowercase join key '${fieldId}'.`,
        fieldIds: [fieldId],
        sourcePaths: [relativeToRepo(repoRoot, fieldJsonPath)],
      });
    }

    const sourceStateCode = STATE_FIPS_TO_CODE[feature.properties.state_fips ?? ""] ?? "KS";
    const boundary = buildBoundary(feature);

    for (const source of IMAGERY_SOURCES) {
      const manifestPath = path.join(
        farmRoot,
        "fields",
        fieldId,
        "satellite",
        source,
        "manifest.json",
      );
      const sourceDirectory = path.dirname(manifestPath);
      const manifest = readJsonFile<SatelliteManifest>(manifestPath);
      const actualScenes = listActualScenes(sourceDirectory);
      const manifestByDate = indexManifestScenes(manifest);
      const expectedCount = expectedSceneCount(manifest);

      if (
        (manifest.field_id && normalizeFieldId(manifest.field_id) !== fieldId) ||
        (manifest.field_slug && normalizeFieldId(manifest.field_slug) !== fieldId)
      ) {
        diagnostics.push({
          severity: "warning",
          code: "imagery-manifest-field-id-mismatch",
          message: `Imagery manifest for ${fieldId}/${source} references a mismatched field identifier.`,
          fieldIds: [fieldId],
          sourcePaths: [relativeToRepo(repoRoot, manifestPath)],
        });
      }

      if (expectedCount === 0 && actualScenes.length > 0) {
        diagnostics.push({
          severity: fieldId === "osm-1424247197" && source === "landsat" ? "warning" : "info",
          code:
            fieldId === "osm-1424247197" && source === "landsat"
              ? "imagery-manifest-stale-filesystem-wins"
              : "imagery-manifest-empty-filesystem-populated",
          message:
            fieldId === "osm-1424247197" && source === "landsat"
              ? "Landsat manifest reports no years for osm-1424247197, but on-disk TIFF scenes are present and drive normalization."
              : `Imagery manifest for ${fieldId}/${source} reports no scenes, but on-disk TIFF scenes are present and were used instead.`,
          fieldIds: [fieldId],
          sourcePaths: [
            relativeToRepo(repoRoot, manifestPath),
            relativeToRepo(repoRoot, sourceDirectory),
          ],
        });
      }

      const matchedDates = new Set<string>();
      for (const scene of actualScenes) {
        const manifestScene = firstDefined(manifestByDate.get(scene.sceneDate) ?? []);
        if (manifestScene?.scene_date) {
          matchedDates.add(manifestScene.scene_date);
        }

        const manifestAssetCount =
          Object.keys(manifestScene?.raw_tiffs ?? {}).length + (manifestScene?.ndvi_tif ? 1 : 0);
        const notes: string[] = [];
        if (!manifestScene) {
          notes.push(
            "scene derived from on-disk TIFF presence because manifest metadata was missing",
          );
        }
        if (manifestAssetCount > 0 && manifestAssetCount !== scene.assetCount) {
          notes.push(
            `manifest declared ${manifestAssetCount} raster assets but ${scene.assetCount} TIFF files were found locally`,
          );
        }

        imageryScenes.push({
          fieldId,
          source,
          sceneDate: scene.sceneDate,
          sceneId: manifestScene?.scene_id ?? scene.sceneKey,
          cloudPct: manifestScene?.cloud_cover ?? null,
          assetCount: scene.assetCount,
          notes,
        });
      }

      const missingManifestDates = [...manifestByDate.keys()].filter(
        (sceneDate) => !matchedDates.has(sceneDate),
      );
      if (missingManifestDates.length > 0) {
        diagnostics.push({
          severity: "warning",
          code: "imagery-manifest-scenes-missing-on-disk",
          message: `Imagery manifest for ${fieldId}/${source} lists ${missingManifestDates.length} scene(s) without matching on-disk TIFF coverage.`,
          fieldIds: [fieldId],
          sourcePaths: [
            relativeToRepo(repoRoot, manifestPath),
            relativeToRepo(repoRoot, sourceDirectory),
          ],
        });
      }

      imageryCoverage.push({
        fieldId,
        source,
        firstSceneDate: actualScenes[0]?.sceneDate ?? null,
        lastSceneDate:
          actualScenes.length > 0 ? actualScenes[actualScenes.length - 1].sceneDate : null,
        sceneCount: actualScenes.length,
        expectedSceneCount: expectedCount,
        coveragePct:
          expectedCount > 0
            ? Number(((actualScenes.length / expectedCount) * 100).toFixed(2))
            : null,
        reconciled: true,
      });
    }

    return {
      fieldId,
      fieldSlug: fieldMetadata.field_slug ?? fieldId,
      fieldName: fieldMetadata.display_name || fieldMetadata.field_slug || fieldId,
      areaAcres: feature.properties.area_acres ?? 0,
      countyName: feature.properties.county_name ?? null,
      stateCode: sourceStateCode,
      boundary,
    };
  });

  const uniqueCountyNames = [
    ...new Set(
      fields.map((field) => field.countyName).filter((value): value is string => Boolean(value)),
    ),
  ];
  const inferredStateCode = [...new Set(fields.map((field) => field.stateCode))][0] ?? "KS";
  const normalizedFarmName = titleCaseSlug(farmMetadata.farm_slug ?? "prairie-farm");

  if (
    farmMetadata.display_name !== normalizedFarmName ||
    farmMetadata.state !== inferredStateCode
  ) {
    diagnostics.push({
      severity: "warning",
      code: "farm-json-location-mismatch",
      message: `Farm metadata reports '${farmMetadata.display_name ?? "(missing)"}' in state '${farmMetadata.state ?? "(missing)"}', but field boundaries normalize the dashboard label to '${normalizedFarmName}' in '${inferredStateCode}'.`,
      fieldIds: fields.map((field) => field.fieldId),
      sourcePaths: [relativeToRepo(repoRoot, farmJsonPath), relativeToRepo(repoRoot, boundaryPath)],
    });
  }

  const payload: NormalizedGrowerDashboardPayload = {
    contractVersion: GROWER_DASHBOARD_CONTRACT_VERSION,
    generatedAt: new Date().toISOString(),
    runtime: GROWER_DASHBOARD_BROWSER_RUNTIME_CONTRACT,
    grower: {
      growerSlug: GROWER_DASHBOARD_KS_GROWER_SLUG,
      growerName: titleCaseSlug(growerMetadata.display_name ?? GROWER_DASHBOARD_KS_GROWER_SLUG),
      growerRoot: relativeToRepo(repoRoot, growerRoot),
      timezone: GROWER_TIMEZONE,
    },
    farm: {
      growerSlug: GROWER_DASHBOARD_KS_GROWER_SLUG,
      farmSlug: farmMetadata.farm_slug ?? "prairie-farm",
      farmName: normalizedFarmName,
      stateCode: inferredStateCode,
      countyName: uniqueCountyNames.length === 1 ? uniqueCountyNames[0] : null,
      totalAcres: Number(fields.reduce((total, field) => total + field.areaAcres, 0).toFixed(2)),
      fieldCount: fields.length,
    },
    fields,
    weatherSeries,
    soilSummary,
    soilHorizons,
    cropRotation,
    cropComposition,
    imageryCoverage,
    imageryScenes,
    diagnostics,
  };

  assertNormalizedGrowerDashboardPayload(payload);
  return payload;
}

export function collectGrowerCoverageMatrix(
  payload: NormalizedGrowerDashboardPayload,
): CoverageMatrixEntry[] {
  return payload.fields.map((field) => ({
    fieldId: field.fieldId,
    boundary: true,
    weather: payload.weatherSeries.some((entry) => entry.fieldId === field.fieldId),
    soil:
      payload.soilSummary.some((entry) => entry.fieldId === field.fieldId) &&
      payload.soilHorizons.some((entry) => entry.fieldId === field.fieldId),
    crop:
      payload.cropRotation.some((entry) => entry.fieldId === field.fieldId) &&
      payload.cropComposition.some((entry) => entry.fieldId === field.fieldId),
    imagery: payload.imageryCoverage.some(
      (entry) => entry.fieldId === field.fieldId && entry.sceneCount > 0,
    ),
  }));
}
