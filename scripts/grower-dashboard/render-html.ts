import {
  assertNormalizedGrowerDashboardPayload,
  GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  type NormalizedGrowerDashboardPayload,
} from "./contracts.ts";

const INLINE_CSS = `
:root {
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #eef4ec;
  color: #17261b;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  background:
    radial-gradient(circle at top right, rgba(137, 198, 126, 0.18), transparent 28%),
    linear-gradient(180deg, #f7fbf5 0%, #eef4ec 100%);
}

main {
  max-width: 1180px;
  margin: 0 auto;
  padding: 36px 20px 72px;
}

.shell {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(23, 38, 27, 0.08);
  border-radius: 30px;
  box-shadow: 0 24px 70px rgba(43, 69, 50, 0.12);
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.95fr);
  gap: 24px;
  padding: 32px;
  background:
    linear-gradient(135deg, rgba(230, 244, 226, 0.95), rgba(245, 250, 241, 0.98)),
    #f6faf3;
}

.hero-copy {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.eyebrow {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4d7758;
}

h1 {
  margin: 0;
  font-size: clamp(2.4rem, 4vw, 4rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.lede {
  margin: 0;
  max-width: 62ch;
  font-size: 1.02rem;
  line-height: 1.7;
  color: #355141;
}

.sublede {
  margin: 0;
  color: #587061;
  font-size: 0.96rem;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid rgba(23, 38, 27, 0.08);
  color: #31503c;
  font-size: 0.9rem;
  font-weight: 600;
}

.hero-aside {
  display: grid;
  gap: 14px;
}

.hero-note {
  padding: 18px;
  border-radius: 24px;
  background: #18281d;
  color: #f2f8f1;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.hero-note h2,
.portfolio h2,
.section-title {
  margin: 0;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.hero-note p,
.portfolio-copy,
.signal-copy {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: inherit;
}

.portfolio {
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.portfolio-grid,
.summary-grid,
.signal-grid {
  display: grid;
  gap: 14px;
}

.portfolio-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;
}

.summary-wrap,
.signal-wrap {
  padding: 0 32px 32px;
}

.summary-wrap {
  margin-top: -8px;
}

.summary-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.signal-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 14px;
}

.card,
.signal-card {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
  min-height: 100%;
}

.label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #5a7464;
}

.value {
  display: block;
  margin-top: 8px;
  font-size: clamp(1.18rem, 2vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.detail {
  display: block;
  margin-top: 8px;
  color: #4f695a;
  font-size: 0.93rem;
  line-height: 1.5;
}

.portfolio-card {
  border-radius: 20px;
  padding: 16px;
  color: #16311d;
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.portfolio-card.corn {
  background: linear-gradient(180deg, #fff3bf 0%, #ffe08a 100%);
}

.portfolio-card.soy {
  background: linear-gradient(180deg, #dff5d2 0%, #c8e8b1 100%);
}

.portfolio-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.82;
}

.portfolio-value {
  display: block;
  margin-top: 8px;
  font-size: clamp(1.6rem, 2.3vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.portfolio-detail {
  display: block;
  margin-top: 10px;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(22, 49, 29, 0.82);
}

.section-kicker {
  margin: 0 0 8px;
  color: #537060;
  font-size: 0.84rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
}

.runtime-status {
  margin-top: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  background: #18281d;
  color: #f7fbf6;
  font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, monospace;
  white-space: pre-wrap;
}

@media (max-width: 980px) {
  .hero,
  .summary-grid,
  .signal-grid {
    grid-template-columns: 1fr;
  }

  .summary-wrap,
  .signal-wrap {
    padding: 0 20px 20px;
  }

  .hero {
    padding: 24px;
  }
}

@media (max-width: 640px) {
  main {
    padding: 16px 12px 40px;
  }

  .portfolio-grid {
    grid-template-columns: 1fr;
  }
}
`;

const INLINE_JS = `
(function () {
  "use strict";

  const payloadScript = document.getElementById(${JSON.stringify(
    GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  )});
  const statusNode = document.getElementById("runtime-status");

  if (!payloadScript || !statusNode) {
    throw new Error("Dashboard HTML shell is missing the embedded payload nodes.");
  }

  const payload = JSON.parse(payloadScript.textContent || "null");
  const summary = [
    "Offline hero shell loaded successfully.",
    "Farm: " + payload.farm.farmName,
    "Fields: " + String(payload.fields.length),
    "Crop composition rows: " + String(payload.cropComposition.length),
    "Imagery sources: " + String(payload.imageryCoverage.length),
  ].join("\\n");

  statusNode.textContent = summary;
})();
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeEmbeddedPayload(payload: NormalizedGrowerDashboardPayload): string {
  return JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/<\/script/giu, "<\\/script");
}

function formatNumber(value: number, maximumFractionDigits: number = 0): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

function formatSignedNumber(
  value: number | null,
  unit: string,
  fractionDigits: number = 1,
): string {
  if (value == null) {
    return "Not available";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)} ${unit}`;
}

function summarizeCropMix(payload: NormalizedGrowerDashboardPayload): {
  latestYear: number | null;
  cornPct: number;
  soyPct: number;
  cornFieldCount: number;
  soyFieldCount: number;
} {
  const latestYear = payload.cropComposition.reduce<number | null>(
    (maxYear, entry) => (maxYear == null || entry.year > maxYear ? entry.year : maxYear),
    null,
  );

  if (latestYear == null) {
    return { latestYear: null, cornPct: 0, soyPct: 0, cornFieldCount: 0, soyFieldCount: 0 };
  }

  const fieldTotals = new Map<string, { corn: number; soy: number }>();
  for (const entry of payload.cropComposition) {
    if (entry.year !== latestYear) {
      continue;
    }
    const bucket = fieldTotals.get(entry.fieldId) ?? { corn: 0, soy: 0 };
    const normalizedName = entry.cropName.trim().toLowerCase();
    if (normalizedName === "corn") {
      bucket.corn += entry.pct;
    }
    if (normalizedName === "soybeans" || normalizedName === "soybean") {
      bucket.soy += entry.pct;
    }
    fieldTotals.set(entry.fieldId, bucket);
  }

  let cornPct = 0;
  let soyPct = 0;
  let cornFieldCount = 0;
  let soyFieldCount = 0;
  for (const totals of fieldTotals.values()) {
    cornPct += totals.corn;
    soyPct += totals.soy;
    if (totals.corn > 0) {
      cornFieldCount += 1;
    }
    if (totals.soy > 0) {
      soyFieldCount += 1;
    }
  }

  const denominator = fieldTotals.size || 1;
  return {
    latestYear,
    cornPct: cornPct / denominator,
    soyPct: soyPct / denominator,
    cornFieldCount,
    soyFieldCount,
  };
}

function summarizeRecentWeather(payload: NormalizedGrowerDashboardPayload): {
  latestDate: string | null;
  avgTempC: number | null;
  precipitationMm: number | null;
  windMps: number | null;
} {
  const latestDate = payload.weatherSeries.reduce<string | null>(
    (maxDate, entry) => (maxDate == null || entry.date > maxDate ? entry.date : maxDate),
    null,
  );

  if (latestDate == null) {
    return { latestDate: null, avgTempC: null, precipitationMm: null, windMps: null };
  }

  const rows = payload.weatherSeries.filter((entry) => entry.date === latestDate);
  const average = (values: Array<number | null>): number | null => {
    const usable = values.filter((value): value is number => value != null);
    if (usable.length === 0) {
      return null;
    }
    return usable.reduce((sum, value) => sum + value, 0) / usable.length;
  };

  return {
    latestDate,
    avgTempC: average(rows.map((entry) => entry.temperatureAvgC)),
    precipitationMm: average(rows.map((entry) => entry.precipitationMm)),
    windMps: average(rows.map((entry) => entry.windSpeedMps)),
  };
}

function summarizeSoil(payload: NormalizedGrowerDashboardPayload): {
  avgOmPct: number | null;
  dominantSoil: string | null;
} {
  const omValues = payload.soilSummary
    .map((entry) => entry.avgOrganicMatterPct)
    .filter((value): value is number => value != null);
  const avgOmPct =
    omValues.length > 0 ? omValues.reduce((sum, value) => sum + value, 0) / omValues.length : null;

  const dominantCounts = new Map<string, number>();
  for (const entry of payload.soilSummary) {
    if (!entry.dominantSoil) {
      continue;
    }
    dominantCounts.set(entry.dominantSoil, (dominantCounts.get(entry.dominantSoil) ?? 0) + 1);
  }

  let dominantSoil: string | null = null;
  let dominantCount = -1;
  for (const [soil, count] of dominantCounts.entries()) {
    if (count > dominantCount) {
      dominantSoil = soil;
      dominantCount = count;
    }
  }

  return { avgOmPct, dominantSoil };
}

function summarizeRotation(payload: NormalizedGrowerDashboardPayload): {
  topNextCrop: string | null;
  confidenceMix: string;
} {
  const nextCropCounts = new Map<string, number>();
  const confidenceCounts = new Map<string, number>();

  for (const entry of payload.cropRotation) {
    if (entry.predictedNextCrop) {
      nextCropCounts.set(
        entry.predictedNextCrop,
        (nextCropCounts.get(entry.predictedNextCrop) ?? 0) + 1,
      );
    }
    if (entry.rotationConfidence) {
      confidenceCounts.set(
        entry.rotationConfidence,
        (confidenceCounts.get(entry.rotationConfidence) ?? 0) + 1,
      );
    }
  }

  let topNextCrop: string | null = null;
  let topNextCropCount = -1;
  for (const [crop, count] of nextCropCounts.entries()) {
    if (count > topNextCropCount) {
      topNextCrop = crop;
      topNextCropCount = count;
    }
  }

  const confidenceMix = [...confidenceCounts.entries()]
    .toSorted((left, right) => right[1] - left[1])
    .map(([label, count]) => `${label} ${count}`)
    .join(" • ");

  return { topNextCrop, confidenceMix: confidenceMix || "Not available" };
}

function countImageryReadyFields(payload: NormalizedGrowerDashboardPayload): number {
  return new Set(
    payload.imageryCoverage.filter((entry) => entry.sceneCount > 0).map((entry) => entry.fieldId),
  ).size;
}

export function renderGrowerDashboardHtml(payload: NormalizedGrowerDashboardPayload): string {
  assertNormalizedGrowerDashboardPayload(payload);

  const title = `${payload.farm.farmName} Dashboard`;
  const embeddedPayload = serializeEmbeddedPayload(payload);
  const fieldCountLabel = formatNumber(payload.fields.length);
  const acreageLabel = `${formatNumber(payload.farm.totalAcres, 2)} acres`;
  const generatedAtLabel = new Date(payload.generatedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: payload.grower.timezone,
  });
  const imageryReadyFields = countImageryReadyFields(payload);
  const cropMix = summarizeCropMix(payload);
  const recentWeather = summarizeRecentWeather(payload);
  const soilSummary = summarizeSoil(payload);
  const rotationSummary = summarizeRotation(payload);
  const recentWeatherDateLabel = recentWeather.latestDate
    ? new Date(`${recentWeather.latestDate}T12:00:00Z`).toLocaleDateString("en-US", {
        dateStyle: "medium",
        timeZone: payload.grower.timezone,
      })
    : "Not available";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(title)}</title>
    <style>${INLINE_CSS}</style>
  </head>
  <body>
    <main>
      <section class="shell" aria-label="Grower dashboard hero overview">
        <section class="hero">
          <div class="hero-copy">
            <p class="eyebrow">Offline classroom demo dashboard</p>
            <h1>${escapeHtml(payload.farm.farmName)}</h1>
            <p class="lede">
              A single self-contained farm dashboard for ${escapeHtml(payload.grower.growerName)} that
              opens directly from disk, keeps corn and soy visible as equal portfolio lenses, and
              summarizes field-scale readiness before deeper panels arrive.
            </p>
            <p class="sublede">
              ${escapeHtml(payload.farm.countyName ?? "Kansas county")} County, ${escapeHtml(payload.farm.stateCode)} • Generated ${escapeHtml(generatedAtLabel)}
            </p>
            <div class="chip-row" aria-label="Hero quick facts">
              <span class="chip">${escapeHtml(fieldCountLabel)} fields</span>
              <span class="chip">${escapeHtml(acreageLabel)}</span>
              <span class="chip">${escapeHtml(String(imageryReadyFields))}/${escapeHtml(fieldCountLabel)} imagery-ready</span>
              <span class="chip">Latest crop year ${escapeHtml(cropMix.latestYear == null ? "N/A" : String(cropMix.latestYear))}</span>
            </div>
          </div>

          <div class="hero-aside">
            <section class="portfolio" aria-label="Equal corn and soy framing">
              <h2>Equal corn + soy opening lens</h2>
              <p class="portfolio-copy">
                Both portfolio anchors stay visible on first load so the classroom demo starts with a balanced crop story instead of a single-crop default.
              </p>
              <div class="portfolio-grid">
                <article class="portfolio-card corn">
                  <span class="portfolio-label">Corn lens</span>
                  <span class="portfolio-value">${escapeHtml(formatNumber(cropMix.cornPct, 1))}%</span>
                  <span class="portfolio-detail">Average latest-year corn share across the portfolio • present in ${escapeHtml(String(cropMix.cornFieldCount))} field(s)</span>
                </article>
                <article class="portfolio-card soy">
                  <span class="portfolio-label">Soy lens</span>
                  <span class="portfolio-value">${escapeHtml(formatNumber(cropMix.soyPct, 1))}%</span>
                  <span class="portfolio-detail">Average latest-year soybean share across the portfolio • present in ${escapeHtml(String(cropMix.soyFieldCount))} field(s)</span>
                </article>
              </div>
            </section>

            <section class="hero-note" aria-label="Offline runtime note">
              <h2>Offline-safe delivery</h2>
              <p>
                The HTML, CSS, JavaScript, and normalized payload are all embedded in this one document. No fetches, no CDN assets, and no browser storage dependencies are required.
              </p>
            </section>
          </div>
        </section>

        <section class="summary-wrap" aria-label="Portfolio summary cards">
          <p class="section-kicker">Portfolio summary</p>
          <div class="summary-grid">
            <article class="card">
              <span class="label">Total acreage</span>
              <span class="value">${escapeHtml(acreageLabel)}</span>
              <span class="detail">Unified across all five normalized field records.</span>
            </article>
            <article class="card">
              <span class="label">Field count</span>
              <span class="value">${escapeHtml(fieldCountLabel)}</span>
              <span class="detail">Every field carries boundary, weather, soil, and crop data.</span>
            </article>
            <article class="card">
              <span class="label">Imagery-ready fields</span>
              <span class="value">${escapeHtml(String(imageryReadyFields))}</span>
              <span class="detail">Based on reconciled on-disk TIFF presence, not manifest claims alone.</span>
            </article>
            <article class="card">
              <span class="label">Rotation outlook leader</span>
              <span class="value">${escapeHtml(rotationSummary.topNextCrop ?? "Not available")}</span>
              <span class="detail">Confidence mix: ${escapeHtml(rotationSummary.confidenceMix)}</span>
            </article>
          </div>
        </section>

        <section class="signal-wrap" aria-label="Recent agronomic signals">
          <p class="section-kicker">Recent agronomic signals</p>
          <div class="signal-grid">
            <article class="signal-card">
              <h2 class="section-title">Latest weather snapshot</h2>
              <p class="signal-copy">
                ${escapeHtml(recentWeatherDateLabel)} averages ${escapeHtml(formatSignedNumber(recentWeather.avgTempC, "°C"))} with ${escapeHtml(formatSignedNumber(recentWeather.precipitationMm, "mm"))} precipitation and ${escapeHtml(formatSignedNumber(recentWeather.windMps, "m/s"))} wind across the portfolio.
              </p>
            </article>
            <article class="signal-card">
              <h2 class="section-title">Soil footing</h2>
              <p class="signal-copy">
                Average organic matter sits near ${escapeHtml(formatSignedNumber(soilSummary.avgOmPct, "%"))}, while the most common dominant soil family is ${escapeHtml(soilSummary.dominantSoil ?? "not available")}.
              </p>
            </article>
            <article class="signal-card">
              <h2 class="section-title">Crop signal</h2>
              <p class="signal-copy">
                Latest composition year ${escapeHtml(cropMix.latestYear == null ? "N/A" : String(cropMix.latestYear))} keeps both corn and soy visible immediately: corn at ${escapeHtml(formatNumber(cropMix.cornPct, 1))}% average share and soy at ${escapeHtml(formatNumber(cropMix.soyPct, 1))}%.
              </p>
            </article>
          </div>
          <div id="runtime-status" class="runtime-status" aria-live="polite">Loading embedded payload…</div>
        </section>
      </section>
    </main>
    <script id="${GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID}" type="application/json">${embeddedPayload}</script>
    <script>${INLINE_JS}</script>
  </body>
</html>`;
}
