import {
  assertNormalizedGrowerDashboardPayload,
  GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  type DashboardPolygonGeometry,
  type NormalizedGrowerDashboardField,
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
.section-title,
.map-panel h2,
.teaser-card h2 {
  margin: 0;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.hero-note p,
.portfolio-copy,
.signal-copy,
.map-copy,
.teaser-copy {
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
.signal-grid,
.map-grid,
.teaser-metrics,
.weather-grid {
  display: grid;
  gap: 14px;
}

.portfolio-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 14px;
}

.summary-wrap,
.signal-wrap,
.map-wrap,
.weather-wrap,
.soil-wrap,
.crop-wrap {
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

.map-grid {
  grid-template-columns: minmax(0, 1.25fr) minmax(280px, 0.8fr);
  align-items: stretch;
}

.card,
.signal-card,
.map-panel,
.teaser-card,
.metric-card {
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

.map-header,
.teaser-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.map-badge,
.teaser-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.map-frame {
  margin-top: 16px;
  border-radius: 20px;
  padding: 14px;
  background: linear-gradient(180deg, #edf7ea 0%, #f8fbf7 100%);
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.map-svg {
  display: block;
  width: 100%;
  height: auto;
}

.field-node {
  cursor: pointer;
  outline: none;
}

.field-shape {
  stroke: rgba(24, 40, 29, 0.54);
  stroke-width: 2;
  transition: fill 140ms ease, stroke 140ms ease, transform 140ms ease, opacity 140ms ease;
}

.field-node:hover .field-shape,
.field-node.is-hovered .field-shape,
.field-node:focus .field-shape {
  stroke: #173d24;
  stroke-width: 3;
  filter: brightness(1.02);
}

.field-node.is-selected .field-shape {
  stroke: #173d24;
  stroke-width: 4;
  filter: drop-shadow(0 10px 14px rgba(39, 78, 53, 0.18));
}

.field-shape.tone-corn {
  fill: rgba(255, 224, 138, 0.9);
}

.field-shape.tone-soy {
  fill: rgba(200, 232, 177, 0.92);
}

.field-shape.tone-mixed {
  fill: rgba(201, 226, 189, 0.92);
}

.field-shape.tone-other {
  fill: rgba(209, 221, 216, 0.94);
}

.field-label {
  font-size: 12px;
  font-weight: 700;
  fill: #17311f;
  text-anchor: middle;
  pointer-events: none;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 14px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #4f695a;
  font-size: 0.88rem;
}

.legend-swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  border: 1px solid rgba(23, 38, 27, 0.16);
}

.legend-swatch.corn {
  background: #ffe08a;
}

.legend-swatch.soy {
  background: #c8e8b1;
}

.legend-swatch.other {
  background: #d1ddd8;
}

.teaser-copy {
  color: #476356;
}

.teaser-metrics {
  margin-top: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.weather-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.weather-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.weather-panel {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.weather-copy,
.weather-overview-copy,
.chart-subtitle {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #476356;
}

.weather-overview {
  display: grid;
  grid-template-columns: minmax(260px, 0.9fr) minmax(0, 1.1fr);
  gap: 18px;
  margin-top: 16px;
}

.weather-overview-card,
.weather-chart-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.weather-overview-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.weather-metric {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.weather-grid {
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: 16px;
}

.soil-panel {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.soil-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.soil-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.soil-copy,
.soil-summary-copy,
.soil-horizon-copy {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #476356;
}

.soil-grid {
  display: grid;
  grid-template-columns: minmax(260px, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  margin-top: 16px;
}

.soil-summary-card,
.soil-horizon-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.soil-summary-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.soil-metric {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.soil-metric .value {
  font-size: 1.05rem;
}

.crop-panel {
  border-radius: 22px;
  background: #f8fbf7;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 18px;
}

.crop-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.crop-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 7px 10px;
  background: rgba(69, 119, 83, 0.1);
  color: #31503c;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.crop-copy,
.crop-composition-copy,
.crop-rotation-copy {
  margin: 8px 0 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #476356;
}

.crop-grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.95fr) minmax(0, 1.05fr);
  gap: 18px;
  margin-top: 16px;
}

.crop-composition-card,
.crop-rotation-card {
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 16px;
}

.composition-list,
.rotation-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.composition-row,
.rotation-item {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
  padding: 12px;
}

.composition-topline,
.rotation-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.composition-name,
.rotation-name {
  font-weight: 700;
  color: #213a2a;
}

.composition-pct,
.rotation-value {
  color: #214d2f;
  font-weight: 700;
}

.composition-bar {
  margin-top: 10px;
  width: 100%;
  height: 10px;
  border-radius: 999px;
  overflow: hidden;
  background: #e6efe4;
}

.composition-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #9aca86 0%, #4f8b5f 100%);
}

.composition-meta,
.rotation-detail {
  margin-top: 8px;
  color: #4f695a;
  font-size: 0.88rem;
  line-height: 1.5;
}

.rotation-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.rotation-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.82rem;
  font-weight: 600;
}

.horizon-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.horizon-row {
  display: grid;
  gap: 8px;
  border-radius: 16px;
  padding: 12px;
  background: #f7fbf6;
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.horizon-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.horizon-name {
  font-weight: 700;
  color: #213a2a;
}

.horizon-depth {
  color: #4f695a;
  font-size: 0.88rem;
}

.horizon-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.horizon-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(69, 119, 83, 0.08);
  color: #31503c;
  font-size: 0.82rem;
  font-weight: 600;
}

.weather-chart-card {
  min-width: 0;
}

.chart-value {
  display: block;
  margin-top: 8px;
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.chart-frame {
  margin-top: 14px;
  border-radius: 16px;
  padding: 10px;
  background: linear-gradient(180deg, #eef7ec 0%, #f9fcf8 100%);
  border: 1px solid rgba(23, 38, 27, 0.08);
}

.weather-chart {
  display: block;
  width: 100%;
  height: auto;
}

.chart-grid-line {
  stroke: rgba(23, 38, 27, 0.1);
  stroke-width: 1;
}

.chart-line {
  fill: none;
  stroke: #3d7a50;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.chart-area {
  fill: rgba(112, 177, 112, 0.16);
}

.chart-dot {
  fill: #214d2f;
}

.metric-card {
  padding: 14px;
}

.metric-card .value {
  font-size: 1.15rem;
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
  .signal-grid,
  .map-grid {
    grid-template-columns: 1fr;
  }

  .summary-wrap,
  .signal-wrap,
  .map-wrap,
  .weather-wrap,
  .soil-wrap,
  .crop-wrap {
    padding: 0 20px 20px;
  }

  .hero {
    padding: 24px;
  }

  .weather-overview,
  .weather-grid,
  .soil-grid,
  .crop-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  main {
    padding: 16px 12px 40px;
  }

  .portfolio-grid,
  .teaser-metrics,
  .weather-overview-metrics,
  .soil-summary-metrics {
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
  const mapRoot = document.getElementById("field-map-root");
  const teaserName = document.getElementById("selected-field-name");
  const teaserAcreage = document.getElementById("selected-field-acreage");
  const teaserCounty = document.getElementById("selected-field-county");
  const teaserCrop = document.getElementById("selected-field-crop");
  const teaserWeather = document.getElementById("selected-field-weather");
  const teaserSoil = document.getElementById("selected-field-soil");
  const teaserSignal = document.getElementById("selected-field-signal");
  const weatherPanelField = document.getElementById("weather-selected-field");
  const weatherPanelSummary = document.getElementById("weather-selected-summary");
  const weatherLatestDate = document.getElementById("weather-latest-date");
  const weatherLatestTemp = document.getElementById("weather-latest-temp");
  const weatherLatestRain = document.getElementById("weather-latest-rain");
  const weatherLatestSolar = document.getElementById("weather-latest-solar");
  const weatherLatestHumidity = document.getElementById("weather-latest-humidity");
  const weatherLatestWind = document.getElementById("weather-latest-wind");
  const weatherCharts = {
    temperature: document.getElementById("weather-chart-temperature"),
    precipitation: document.getElementById("weather-chart-precipitation"),
    solar: document.getElementById("weather-chart-solar"),
    humidity: document.getElementById("weather-chart-humidity"),
    wind: document.getElementById("weather-chart-wind"),
  };
  const weatherValues = {
    temperature: document.getElementById("weather-value-temperature"),
    precipitation: document.getElementById("weather-value-precipitation"),
    solar: document.getElementById("weather-value-solar"),
    humidity: document.getElementById("weather-value-humidity"),
    wind: document.getElementById("weather-value-wind"),
  };
  const weatherSubtitles = {
    temperature: document.getElementById("weather-subtitle-temperature"),
    precipitation: document.getElementById("weather-subtitle-precipitation"),
    solar: document.getElementById("weather-subtitle-solar"),
    humidity: document.getElementById("weather-subtitle-humidity"),
    wind: document.getElementById("weather-subtitle-wind"),
  };
  const soilPanelField = document.getElementById("soil-selected-field");
  const soilPanelSummary = document.getElementById("soil-selected-summary");
  const soilDominant = document.getElementById("soil-dominant");
  const soilOm = document.getElementById("soil-om");
  const soilPh = document.getElementById("soil-ph");
  const soilAws = document.getElementById("soil-aws");
  const soilTexture = document.getElementById("soil-texture");
  const soilDrainage = document.getElementById("soil-drainage");
  const soilHorizonCount = document.getElementById("soil-horizon-count");
  const soilHorizonList = document.getElementById("soil-horizon-list");
  const cropPanelField = document.getElementById("crop-selected-field");
  const cropPanelSummary = document.getElementById("crop-selected-summary");
  const cropLatestYear = document.getElementById("crop-latest-year");
  const cropCompositionLead = document.getElementById("crop-composition-lead");
  const cropCompositionList = document.getElementById("crop-composition-list");
  const cropRotationNext = document.getElementById("crop-rotation-next");
  const cropRotationConfidence = document.getElementById("crop-rotation-confidence");
  const cropRotationSequence = document.getElementById("crop-rotation-sequence");
  const cropRotationHistory = document.getElementById("crop-rotation-history");
  const cropRotationPatterns = document.getElementById("crop-rotation-patterns");
  const cropRotationOutlook = document.getElementById("crop-rotation-outlook");

  if (
    !payloadScript ||
    !statusNode ||
    !mapRoot ||
    !teaserName ||
    !teaserAcreage ||
    !teaserCounty ||
    !teaserCrop ||
    !teaserWeather ||
    !teaserSoil ||
    !teaserSignal ||
    !weatherPanelField ||
    !weatherPanelSummary ||
    !weatherLatestDate ||
    !weatherLatestTemp ||
    !weatherLatestRain ||
    !weatherLatestSolar ||
    !weatherLatestHumidity ||
    !weatherLatestWind ||
    !weatherCharts.temperature ||
    !weatherCharts.precipitation ||
    !weatherCharts.solar ||
    !weatherCharts.humidity ||
    !weatherCharts.wind ||
    !weatherValues.temperature ||
    !weatherValues.precipitation ||
    !weatherValues.solar ||
    !weatherValues.humidity ||
    !weatherValues.wind ||
    !weatherSubtitles.temperature ||
    !weatherSubtitles.precipitation ||
    !weatherSubtitles.solar ||
    !weatherSubtitles.humidity ||
    !weatherSubtitles.wind ||
    !soilPanelField ||
    !soilPanelSummary ||
    !soilDominant ||
    !soilOm ||
    !soilPh ||
    !soilAws ||
    !soilTexture ||
    !soilDrainage ||
    !soilHorizonCount ||
    !soilHorizonList ||
    !cropPanelField ||
    !cropPanelSummary ||
    !cropLatestYear ||
    !cropCompositionLead ||
    !cropCompositionList ||
    !cropRotationNext ||
    !cropRotationConfidence ||
    !cropRotationSequence ||
    !cropRotationHistory ||
    !cropRotationPatterns ||
    !cropRotationOutlook
  ) {
    throw new Error("Dashboard HTML shell is missing the embedded payload weather/map nodes.");
  }

  const payload = JSON.parse(payloadScript.textContent || "null");

  function latestCropYear() {
    let year = null;
    for (const entry of payload.cropComposition) {
      if (year === null || entry.year > year) {
        year = entry.year;
      }
    }
    return year;
  }

  function dominantCrop(fieldId) {
    const year = latestCropYear();
    if (year === null) {
      return "Not available";
    }

    let best = null;
    for (const entry of payload.cropComposition) {
      if (entry.fieldId !== fieldId || entry.year !== year) {
        continue;
      }
      if (!best || entry.pct > best.pct) {
        best = entry;
      }
    }

    return best ? best.cropName + " (" + Number(best.pct).toFixed(1) + "%)" : "Not available";
  }

  function latestWeather(fieldId) {
    let best = null;
    for (const entry of payload.weatherSeries) {
      if (entry.fieldId !== fieldId) {
        continue;
      }
      if (!best || entry.date > best.date) {
        best = entry;
      }
    }
    if (!best) {
      return "Weather hint unavailable";
    }
    const temp = best.temperatureAvgC == null ? "n/a" : Number(best.temperatureAvgC).toFixed(1) + "°C";
    const rain = best.precipitationMm == null ? "n/a" : Number(best.precipitationMm).toFixed(1) + " mm rain";
    return best.date + " • " + temp + " • " + rain;
  }

  function soilHint(fieldId) {
    for (const entry of payload.soilSummary) {
      if (entry.fieldId !== fieldId) {
        continue;
      }
      const soil = entry.dominantSoil || "soil type unavailable";
      const om = entry.avgOrganicMatterPct == null ? "OM n/a" : "OM " + Number(entry.avgOrganicMatterPct).toFixed(1) + "%";
      return soil + " • " + om;
    }
    return "Soil hint unavailable";
  }

  function fieldSignal(fieldId) {
    for (const entry of payload.cropRotation) {
      if (entry.fieldId === fieldId) {
        return entry.predictedNextCrop
          ? "Rotation outlook favors " + entry.predictedNextCrop + "."
          : entry.rotationOutlook;
      }
    }
    return "Rotation signal unavailable.";
  }

  function latestCropYearValue() {
    let year = null;
    for (const entry of payload.cropComposition) {
      if (year === null || entry.year > year) {
        year = entry.year;
      }
    }
    return year;
  }

  function cropCompositionForField(fieldId) {
    const latestYear = latestCropYearValue();
    if (latestYear === null) {
      return { latestYear: null, rows: [] };
    }

    const rows = payload.cropComposition
      .filter(function (entry) {
        return entry.fieldId === fieldId && entry.year === latestYear;
      })
      .sort(function (left, right) {
        return right.pct - left.pct;
      });

    return { latestYear: latestYear, rows: rows };
  }

  function cropRotationForField(fieldId) {
    for (const entry of payload.cropRotation) {
      if (entry.fieldId === fieldId) {
        return entry;
      }
    }
    return null;
  }

  function compositionRowMarkup(entry) {
    return '<article class="composition-row"><div class="composition-topline"><span class="composition-name">' +
      entry.cropName +
      '</span><span class="composition-pct">' +
      Number(entry.pct).toFixed(1) +
      '%</span></div><div class="composition-bar"><div class="composition-fill" style="width:' +
      Math.max(0, Math.min(100, Number(entry.pct))) +
      '%"></div></div><div class="composition-meta">Crop code ' +
      (entry.cropCode || 'n/a') +
      ' • source ' +
      entry.source +
      '</div></article>';
  }

  function updateCropPanel(fieldId) {
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }

    const composition = cropCompositionForField(fieldId);
    const rotation = cropRotationForField(fieldId);
    const dominant = composition.rows.length > 0 ? composition.rows[0] : null;

    cropPanelField.textContent = field.fieldName;
    cropPanelSummary.textContent = dominant
      ? 'Latest-year crop composition and normalized rotation outlook for the selected field, updated directly from the embedded payload.'
      : 'No normalized crop composition was found for this field.';
    cropLatestYear.textContent = composition.latestYear === null ? 'Not available' : String(composition.latestYear);
    cropCompositionLead.textContent = dominant
      ? dominant.cropName + ' leads at ' + Number(dominant.pct).toFixed(1) + '%'
      : 'No latest-year composition available';
    cropCompositionList.innerHTML = composition.rows.length > 0
      ? composition.rows.map(function (entry) { return compositionRowMarkup(entry); }).join('')
      : '<article class="composition-row"><div class="composition-topline"><span class="composition-name">No composition data</span><span class="composition-pct">—</span></div><div class="composition-meta">The embedded payload has no latest-year crop composition rows for this field.</div></article>';

    cropRotationNext.textContent = rotation && rotation.predictedNextCrop ? rotation.predictedNextCrop : 'Not available';
    cropRotationConfidence.textContent = rotation && rotation.rotationConfidence ? rotation.rotationConfidence : 'Not available';
    cropRotationSequence.textContent = rotation ? rotation.rotationSequence : 'No normalized rotation sequence available';
    cropRotationHistory.textContent = rotation
      ? String(rotation.historyStartYear || '—') + ' → ' + String(rotation.historyEndYear || '—') + ' • diversity ' + String(rotation.cropDiversity)
      : 'History unavailable';
    cropRotationPatterns.innerHTML = rotation && rotation.rotationPatterns.length > 0
      ? rotation.rotationPatterns.map(function (pattern) { return '<span class="rotation-pill">' + pattern + '</span>'; }).join('')
      : '<span class="rotation-pill">No rotation patterns available</span>';
    cropRotationOutlook.textContent = rotation ? rotation.rotationOutlook : 'Rotation outlook unavailable';
  }

  function soilSummaryForField(fieldId) {
    for (const entry of payload.soilSummary) {
      if (entry.fieldId === fieldId) {
        return entry;
      }
    }
    return null;
  }

  function soilHorizonsForField(fieldId) {
    return payload.soilHorizons
      .filter(function (entry) {
        return entry.fieldId === fieldId;
      })
      .sort(function (left, right) {
        const leftTop = left.horizonTopCm === null || left.horizonTopCm === undefined ? 9999 : left.horizonTopCm;
        const rightTop = right.horizonTopCm === null || right.horizonTopCm === undefined ? 9999 : right.horizonTopCm;
        return leftTop - rightTop;
      });
  }

  function compactValue(value, suffix, fractionDigits) {
    if (value === null || value === undefined) {
      return "Not available";
    }
    return Number(value).toFixed(fractionDigits) + suffix;
  }

  function dominantTexture(horizon) {
    if (!horizon) {
      return "Texture unavailable";
    }
    const clay = horizon.clayPct;
    const sand = horizon.sandPct;
    const silt = horizon.siltPct;
    const parts = [];
    if (clay !== null && clay !== undefined) parts.push("Clay " + Number(clay).toFixed(0) + "%");
    if (silt !== null && silt !== undefined) parts.push("Silt " + Number(silt).toFixed(0) + "%");
    if (sand !== null && sand !== undefined) parts.push("Sand " + Number(sand).toFixed(0) + "%");
    return parts.length > 0 ? parts.join(" • ") : "Texture unavailable";
  }

  function renderHorizonRow(horizon) {
    const top = horizon.horizonTopCm === null || horizon.horizonTopCm === undefined ? "?" : Number(horizon.horizonTopCm).toFixed(0);
    const bottom = horizon.horizonBottomCm === null || horizon.horizonBottomCm === undefined ? "?" : Number(horizon.horizonBottomCm).toFixed(0);
    const pills = [
      horizon.componentPct !== null && horizon.componentPct !== undefined ? 'Component ' + Number(horizon.componentPct).toFixed(0) + '%' : null,
      horizon.ph !== null && horizon.ph !== undefined ? 'pH ' + Number(horizon.ph).toFixed(1) : null,
      horizon.organicMatterPct !== null && horizon.organicMatterPct !== undefined ? 'OM ' + Number(horizon.organicMatterPct).toFixed(1) + '%' : null,
      horizon.availableWaterCapacity !== null && horizon.availableWaterCapacity !== undefined ? 'AWC ' + Number(horizon.availableWaterCapacity).toFixed(2) : null,
      dominantTexture(horizon),
    ].filter(Boolean);

    return '<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">' +
      (horizon.componentName || 'Unnamed component') +
      '</span><span class="horizon-depth">' +
      top +
      '–' +
      bottom +
      ' cm</span></div><div class="horizon-metrics">' +
      pills.map(function (pill) { return '<span class="horizon-pill">' + pill + '</span>'; }).join('') +
      '</div></article>';
  }

  function updateSoilPanel(fieldId) {
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }
    const summary = soilSummaryForField(fieldId);
    const horizons = soilHorizonsForField(fieldId).slice(0, 5);
    const surfaceHorizon = horizons.length > 0 ? horizons[0] : null;

    soilPanelField.textContent = field.fieldName;
    soilPanelSummary.textContent = summary
      ? 'Decision-relevant soil metrics and compact horizon context for the selected field, updated from the embedded normalized soil payload.'
      : 'No normalized soil summary is available for this field.';
    soilDominant.textContent = summary && summary.dominantSoil ? summary.dominantSoil : 'Not available';
    soilOm.textContent = summary ? compactValue(summary.avgOrganicMatterPct, '%', 1) : 'Not available';
    soilPh.textContent = summary ? compactValue(summary.avgPh, '', 2) : 'Not available';
    soilAws.textContent = summary ? compactValue(summary.totalAwsInches, ' in', 2) : 'Not available';
    soilTexture.textContent = dominantTexture(surfaceHorizon);
    soilDrainage.textContent = summary && summary.drainageClass ? summary.drainageClass : 'Not available';
    soilHorizonCount.textContent = summary ? String(summary.horizonCount) : '0';
    soilHorizonList.innerHTML = horizons.length > 0
      ? horizons.map(function (horizon) { return renderHorizonRow(horizon); }).join('')
      : '<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">No horizon detail</span><span class="horizon-depth">—</span></div><div class="horizon-metrics"><span class="horizon-pill">No normalized soil horizon rows are available.</span></div></article>';
  }

  function weatherSeries(fieldId) {
    return payload.weatherSeries
      .filter(function (entry) {
        return entry.fieldId === fieldId;
      })
      .sort(function (left, right) {
        return left.date.localeCompare(right.date);
      });
  }

  function latestWeatherEntry(fieldId) {
    const rows = weatherSeries(fieldId);
    return rows.length > 0 ? rows[rows.length - 1] : null;
  }

  function trailingRows(fieldId, count) {
    const rows = weatherSeries(fieldId);
    return rows.slice(Math.max(0, rows.length - count));
  }

  function formatMetricValue(value, unit, fractionDigits) {
    if (value === null || value === undefined) {
      return "Not available";
    }

    return Number(value).toFixed(fractionDigits) + " " + unit;
  }

  function chartMarkup(values) {
    const width = 220;
    const height = 92;
    const paddingX = 10;
    const paddingY = 10;
    const usable = values.filter(function (value) {
      return value !== null && value !== undefined;
    });

    if (usable.length === 0) {
      return '<svg class="weather-chart" viewBox="0 0 220 92" role="img" aria-label="No weather data available"><line class="chart-grid-line" x1="10" y1="78" x2="210" y2="78"></line><text x="110" y="50" text-anchor="middle" fill="#587061" font-size="11">No data</text></svg>';
    }

    let min = usable[0];
    let max = usable[0];
    for (const value of usable) {
      if (value < min) min = value;
      if (value > max) max = value;
    }
    if (min === max) {
      min -= 1;
      max += 1;
    }

    const points = [];
    for (let index = 0; index < values.length; index += 1) {
      const rawValue = values[index];
      if (rawValue === null || rawValue === undefined) {
        continue;
      }
      const x = paddingX + (index / Math.max(values.length - 1, 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((rawValue - min) / (max - min)) * (height - paddingY * 2);
      points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
    }

    if (points.length === 0) {
      return '<svg class="weather-chart" viewBox="0 0 220 92" role="img" aria-label="No weather data available"><line class="chart-grid-line" x1="10" y1="78" x2="210" y2="78"></line><text x="110" y="50" text-anchor="middle" fill="#587061" font-size="11">No data</text></svg>';
    }

    const linePath = points
      .map(function (point, index) {
        return (index === 0 ? 'M ' : 'L ') + point.x + ' ' + point.y;
      })
      .join(' ');
    const areaPath =
      linePath +
      ' L ' +
      points[points.length - 1].x +
      ' ' +
      (height - paddingY) +
      ' L ' +
      points[0].x +
      ' ' +
      (height - paddingY) +
      ' Z';

    return '<svg class="weather-chart" viewBox="0 0 220 92" role="img" aria-label="Selected field weather trend"><line class="chart-grid-line" x1="10" y1="20" x2="210" y2="20"></line><line class="chart-grid-line" x1="10" y1="49" x2="210" y2="49"></line><line class="chart-grid-line" x1="10" y1="78" x2="210" y2="78"></line><path class="chart-area" d="' + areaPath + '"></path><path class="chart-line" d="' + linePath + '"></path><circle class="chart-dot" cx="' + points[points.length - 1].x + '" cy="' + points[points.length - 1].y + '" r="3.5"></circle></svg>';
  }

  function updateWeatherPanel(fieldId) {
    const rows = trailingRows(fieldId, 21);
    const latest = latestWeatherEntry(fieldId);
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }

    weatherPanelField.textContent = field.fieldName;
    weatherPanelSummary.textContent = rows.length > 0
      ? 'Latest ' + String(rows.length) + ' daily rows for ' + field.fieldName + ', updated from the embedded weather series without any external chart libraries.'
      : 'No embedded weather series are available for this field.';
    weatherLatestDate.textContent = latest ? latest.date : 'Not available';
    weatherLatestTemp.textContent = latest ? formatMetricValue(latest.temperatureAvgC, '°C', 1) : 'Not available';
    weatherLatestRain.textContent = latest ? formatMetricValue(latest.precipitationMm, 'mm', 1) : 'Not available';
    weatherLatestSolar.textContent = latest ? formatMetricValue(latest.solarRadiationKwhM2, 'kWh/m²', 1) : 'Not available';
    weatherLatestHumidity.textContent = latest ? formatMetricValue(latest.relativeHumidityPct, '%', 1) : 'Not available';
    weatherLatestWind.textContent = latest ? formatMetricValue(latest.windSpeedMps, 'm/s', 1) : 'Not available';

    const metrics = {
      temperature: {
        values: rows.map(function (row) { return row.temperatureAvgC; }),
        current: latest ? formatMetricValue(latest.temperatureAvgC, '°C', 1) : 'Not available',
        subtitle: rows.length > 0 ? rows[0].date + ' → ' + rows[rows.length - 1].date : 'No data range',
      },
      precipitation: {
        values: rows.map(function (row) { return row.precipitationMm; }),
        current: latest ? formatMetricValue(latest.precipitationMm, 'mm', 1) : 'Not available',
        subtitle: 'Daily precipitation trend',
      },
      solar: {
        values: rows.map(function (row) { return row.solarRadiationKwhM2; }),
        current: latest ? formatMetricValue(latest.solarRadiationKwhM2, 'kWh/m²', 1) : 'Not available',
        subtitle: 'Incoming solar radiation',
      },
      humidity: {
        values: rows.map(function (row) { return row.relativeHumidityPct; }),
        current: latest ? formatMetricValue(latest.relativeHumidityPct, '%', 1) : 'Not available',
        subtitle: 'Relative humidity trend',
      },
      wind: {
        values: rows.map(function (row) { return row.windSpeedMps; }),
        current: latest ? formatMetricValue(latest.windSpeedMps, 'm/s', 1) : 'Not available',
        subtitle: '10m wind speed trend',
      },
    };

    for (const key of Object.keys(metrics)) {
      weatherValues[key].textContent = metrics[key].current;
      weatherSubtitles[key].textContent = metrics[key].subtitle;
      weatherCharts[key].innerHTML = chartMarkup(metrics[key].values);
    }
  }

  const byFieldId = new Map();
  for (const field of payload.fields) {
    byFieldId.set(field.fieldId, field);
  }

  let selectedFieldId = mapRoot.getAttribute("data-initial-field-id") || (payload.fields[0] && payload.fields[0].fieldId);

  function updateSelection(fieldId) {
    const field = byFieldId.get(fieldId);
    if (!field) {
      return;
    }

    selectedFieldId = fieldId;
    const nodes = mapRoot.querySelectorAll("[data-field-id]");
    for (const node of nodes) {
      const isSelected = node.getAttribute("data-field-id") === fieldId;
      node.classList.toggle("is-selected", isSelected);
      node.setAttribute("aria-pressed", isSelected ? "true" : "false");
    }

    teaserName.textContent = field.fieldName;
    teaserAcreage.textContent = Number(field.areaAcres).toFixed(2) + " acres";
    teaserCounty.textContent = field.countyName || "County unavailable";
    teaserCrop.textContent = dominantCrop(fieldId);
    teaserWeather.textContent = latestWeather(fieldId);
    teaserSoil.textContent = soilHint(fieldId);
    teaserSignal.textContent = fieldSignal(fieldId);
    updateWeatherPanel(fieldId);
    updateSoilPanel(fieldId);
    updateCropPanel(fieldId);

    statusNode.textContent = [
      "Offline hero + map + weather shell loaded successfully.",
      "Farm: " + payload.farm.farmName,
      "Selected field: " + field.fieldId,
      "Rendered boundaries: " + String(payload.fields.length),
      "Interactive schematic: inline SVG only",
      "Weather charts: inline SVG only",
    ].join("\\n");
  }

  const nodes = mapRoot.querySelectorAll("[data-field-id]");
  for (const node of nodes) {
    node.addEventListener("click", function () {
      updateSelection(node.getAttribute("data-field-id"));
    });
    node.addEventListener("mouseenter", function () {
      node.classList.add("is-hovered");
    });
    node.addEventListener("mouseleave", function () {
      node.classList.remove("is-hovered");
    });
    node.addEventListener("focus", function () {
      node.classList.add("is-hovered");
    });
    node.addEventListener("blur", function () {
      node.classList.remove("is-hovered");
    });
    node.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        updateSelection(node.getAttribute("data-field-id"));
      }
    });
  }

  if (selectedFieldId) {
    updateSelection(selectedFieldId);
  }
})();
`;

type FieldCropTone = "corn" | "soy" | "mixed" | "other";

interface CropMixSummary {
  latestYear: number | null;
  cornPct: number;
  soyPct: number;
  cornFieldCount: number;
  soyFieldCount: number;
}

interface RecentWeatherSummary {
  latestDate: string | null;
  avgTempC: number | null;
  precipitationMm: number | null;
  windMps: number | null;
}

interface SoilSummaryOverview {
  avgOmPct: number | null;
  dominantSoil: string | null;
}

interface RotationSummaryOverview {
  topNextCrop: string | null;
  confidenceMix: string;
}

interface MapFeatureRender {
  field: NormalizedGrowerDashboardField;
  pathData: string;
  labelX: number;
  labelY: number;
  shortLabel: string;
  tone: FieldCropTone;
}

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

function summarizeCropMix(payload: NormalizedGrowerDashboardPayload): CropMixSummary {
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

function summarizeRecentWeather(payload: NormalizedGrowerDashboardPayload): RecentWeatherSummary {
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

function summarizeSoil(payload: NormalizedGrowerDashboardPayload): SoilSummaryOverview {
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

function summarizeRotation(payload: NormalizedGrowerDashboardPayload): RotationSummaryOverview {
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

function latestCropYear(payload: NormalizedGrowerDashboardPayload): number | null {
  return payload.cropComposition.reduce<number | null>(
    (maxYear, entry) => (maxYear == null || entry.year > maxYear ? entry.year : maxYear),
    null,
  );
}

function dominantCropForField(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): { name: string; pct: number } | null {
  const year = latestCropYear(payload);
  if (year == null) {
    return null;
  }

  let best: { name: string; pct: number } | null = null;
  for (const entry of payload.cropComposition) {
    if (entry.fieldId !== fieldId || entry.year !== year) {
      continue;
    }
    if (!best || entry.pct > best.pct) {
      best = { name: entry.cropName, pct: entry.pct };
    }
  }
  return best;
}

function toneForField(payload: NormalizedGrowerDashboardPayload, fieldId: string): FieldCropTone {
  const dominantCrop = dominantCropForField(payload, fieldId);
  if (!dominantCrop) {
    return "other";
  }

  const cropName = dominantCrop.name.trim().toLowerCase();
  if (cropName === "corn") {
    return "corn";
  }
  if (cropName === "soybeans" || cropName === "soybean") {
    return "soy";
  }

  const year = latestCropYear(payload);
  if (year == null) {
    return "other";
  }

  let corn = 0;
  let soy = 0;
  for (const entry of payload.cropComposition) {
    if (entry.fieldId !== fieldId || entry.year !== year) {
      continue;
    }
    const name = entry.cropName.trim().toLowerCase();
    if (name === "corn") {
      corn += entry.pct;
    }
    if (name === "soybeans" || name === "soybean") {
      soy += entry.pct;
    }
  }

  if (corn > 0 && soy > 0) {
    return "mixed";
  }
  return "other";
}

function flattenRings(geometry: DashboardPolygonGeometry): number[][][] {
  if (geometry.type === "Polygon") {
    return geometry.coordinates as number[][][];
  }

  const polygons = geometry.coordinates as number[][][][];
  const rings: number[][][] = [];
  for (const polygon of polygons) {
    for (const ring of polygon) {
      rings.push(ring);
    }
  }
  return rings;
}

function buildMapFeatures(payload: NormalizedGrowerDashboardPayload): MapFeatureRender[] {
  const width = 760;
  const height = 430;
  const margin = 24;
  const west = Math.min(...payload.fields.map((field) => field.boundary.bbox[0]));
  const south = Math.min(...payload.fields.map((field) => field.boundary.bbox[1]));
  const east = Math.max(...payload.fields.map((field) => field.boundary.bbox[2]));
  const north = Math.max(...payload.fields.map((field) => field.boundary.bbox[3]));
  const lonSpan = Math.max(east - west, 0.000001);
  const latSpan = Math.max(north - south, 0.000001);
  const scale = Math.min((width - margin * 2) / lonSpan, (height - margin * 2) / latSpan);

  const project = (lon: number, lat: number): [number, number] => {
    const x = margin + (lon - west) * scale;
    const y = height - margin - (lat - south) * scale;
    return [Number(x.toFixed(2)), Number(y.toFixed(2))];
  };

  return payload.fields.map((field, index) => {
    const rings = flattenRings(field.boundary.geometry);
    const pathData = rings
      .map((ring) => {
        return (
          ring
            .map(([lon, lat], pointIndex) => {
              const [x, y] = project(lon, lat);
              return `${pointIndex === 0 ? "M" : "L"} ${x} ${y}`;
            })
            .join(" ") + " Z"
        );
      })
      .join(" ");

    const [labelX, labelY] = project(field.boundary.centroid.lon, field.boundary.centroid.lat);

    return {
      field,
      pathData,
      labelX,
      labelY,
      shortLabel: `F${index + 1}`,
      tone: toneForField(payload, field.fieldId),
    };
  });
}

function formatFieldCropContext(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const dominantCrop = dominantCropForField(payload, fieldId);
  if (!dominantCrop) {
    return "Crop context unavailable";
  }
  return `${dominantCrop.name} (${formatNumber(dominantCrop.pct, 1)}%)`;
}

function formatFieldWeatherHint(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  let latestEntry = null as null | NormalizedGrowerDashboardPayload["weatherSeries"][number];
  for (const entry of payload.weatherSeries) {
    if (entry.fieldId !== fieldId) {
      continue;
    }
    if (!latestEntry || entry.date > latestEntry.date) {
      latestEntry = entry;
    }
  }
  if (!latestEntry) {
    return "Weather hint unavailable";
  }

  return `${latestEntry.date} • ${formatSignedNumber(latestEntry.temperatureAvgC, "°C")} • ${formatSignedNumber(latestEntry.precipitationMm, "mm")}`;
}

function formatFieldSoilHint(payload: NormalizedGrowerDashboardPayload, fieldId: string): string {
  const soil = payload.soilSummary.find((entry) => entry.fieldId === fieldId);
  if (!soil) {
    return "Soil hint unavailable";
  }

  const dominant = soil.dominantSoil ?? "soil type unavailable";
  const om =
    soil.avgOrganicMatterPct == null
      ? "OM n/a"
      : `OM ${formatNumber(soil.avgOrganicMatterPct, 1)}%`;
  return `${dominant} • ${om}`;
}

function soilSummaryForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["soilSummary"][number] | null {
  return payload.soilSummary.find((entry) => entry.fieldId === fieldId) ?? null;
}

function soilHorizonsForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["soilHorizons"] {
  return payload.soilHorizons
    .filter((entry) => entry.fieldId === fieldId)
    .toSorted((left, right) => {
      const leftTop = left.horizonTopCm ?? 9_999;
      const rightTop = right.horizonTopCm ?? 9_999;
      return leftTop - rightTop;
    });
}

function formatOptionalMetric(
  value: number | null,
  suffix: string,
  fractionDigits: number,
): string {
  if (value == null) {
    return "Not available";
  }

  return `${value.toFixed(fractionDigits)}${suffix}`;
}

function textureHintFromHorizon(
  horizon: NormalizedGrowerDashboardPayload["soilHorizons"][number] | null,
): string {
  if (!horizon) {
    return "Texture unavailable";
  }

  const parts: string[] = [];
  if (horizon.clayPct != null) {
    parts.push(`Clay ${horizon.clayPct.toFixed(0)}%`);
  }
  if (horizon.siltPct != null) {
    parts.push(`Silt ${horizon.siltPct.toFixed(0)}%`);
  }
  if (horizon.sandPct != null) {
    parts.push(`Sand ${horizon.sandPct.toFixed(0)}%`);
  }

  return parts.length > 0 ? parts.join(" • ") : "Texture unavailable";
}

function renderInitialSoilHorizonRows(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const horizons = soilHorizonsForFieldPayload(payload, fieldId).slice(0, 5);
  if (horizons.length === 0) {
    return '<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">No horizon detail</span><span class="horizon-depth">—</span></div><div class="horizon-metrics"><span class="horizon-pill">No normalized soil horizon rows are available.</span></div></article>';
  }

  return horizons
    .map((horizon) => {
      const pills = [
        horizon.componentPct != null ? `Component ${horizon.componentPct.toFixed(0)}%` : null,
        horizon.ph != null ? `pH ${horizon.ph.toFixed(1)}` : null,
        horizon.organicMatterPct != null ? `OM ${horizon.organicMatterPct.toFixed(1)}%` : null,
        horizon.availableWaterCapacity != null
          ? `AWC ${horizon.availableWaterCapacity.toFixed(2)}`
          : null,
        textureHintFromHorizon(horizon),
      ].filter((value): value is string => Boolean(value));
      const top = horizon.horizonTopCm != null ? horizon.horizonTopCm.toFixed(0) : "?";
      const bottom = horizon.horizonBottomCm != null ? horizon.horizonBottomCm.toFixed(0) : "?";

      return `<article class="horizon-row"><div class="horizon-topline"><span class="horizon-name">${escapeHtml(horizon.componentName ?? "Unnamed component")}</span><span class="horizon-depth">${escapeHtml(`${top}–${bottom} cm`)}</span></div><div class="horizon-metrics">${pills.map((pill) => `<span class="horizon-pill">${escapeHtml(pill)}</span>`).join("")}</div></article>`;
    })
    .join("");
}

function fieldRotationSignal(payload: NormalizedGrowerDashboardPayload, fieldId: string): string {
  const rotation = payload.cropRotation.find((entry) => entry.fieldId === fieldId);
  if (!rotation) {
    return "Rotation signal unavailable.";
  }
  return rotation.predictedNextCrop
    ? `Rotation outlook favors ${rotation.predictedNextCrop}.`
    : rotation.rotationOutlook;
}

function cropCompositionForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): {
  latestYear: number | null;
  rows: NormalizedGrowerDashboardPayload["cropComposition"];
} {
  const year = latestCropYear(payload);
  if (year == null) {
    return { latestYear: null, rows: [] };
  }

  return {
    latestYear: year,
    rows: payload.cropComposition
      .filter((entry) => entry.fieldId === fieldId && entry.year === year)
      .toSorted((left, right) => right.pct - left.pct),
  };
}

function cropRotationForFieldPayload(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): NormalizedGrowerDashboardPayload["cropRotation"][number] | null {
  return payload.cropRotation.find((entry) => entry.fieldId === fieldId) ?? null;
}

function renderInitialCropCompositionRows(
  payload: NormalizedGrowerDashboardPayload,
  fieldId: string,
): string {
  const composition = cropCompositionForFieldPayload(payload, fieldId);
  if (composition.rows.length === 0) {
    return '<article class="composition-row"><div class="composition-topline"><span class="composition-name">No composition data</span><span class="composition-pct">—</span></div><div class="composition-meta">The embedded payload has no latest-year crop composition rows for this field.</div></article>';
  }

  return composition.rows
    .map(
      (entry) =>
        `<article class="composition-row"><div class="composition-topline"><span class="composition-name">${escapeHtml(entry.cropName)}</span><span class="composition-pct">${escapeHtml(entry.pct.toFixed(1))}%</span></div><div class="composition-bar"><div class="composition-fill" style="width:${Math.max(0, Math.min(100, entry.pct))}%"></div></div><div class="composition-meta">Crop code ${escapeHtml(entry.cropCode ?? "n/a")} • source ${escapeHtml(entry.source)}</div></article>`,
    )
    .join("");
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
  const mapFeatures = buildMapFeatures(payload);
  const initialField = payload.fields[0];
  const initialSoilSummary = soilSummaryForFieldPayload(payload, initialField.fieldId);
  const initialSurfaceHorizon =
    soilHorizonsForFieldPayload(payload, initialField.fieldId)[0] ?? null;
  const initialCropComposition = cropCompositionForFieldPayload(payload, initialField.fieldId);
  const initialCropLead = initialCropComposition.rows[0] ?? null;
  const initialRotation = cropRotationForFieldPayload(payload, initialField.fieldId);

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
        </section>

        <section class="map-wrap" aria-label="Offline field boundary schematic">
          <p class="section-kicker">Field boundary schematic</p>
          <div class="map-grid">
            <section class="map-panel">
              <div class="map-header">
                <div>
                  <h2>Clickable offline farm map</h2>
                  <p class="map-copy">
                    All five field boundaries are rendered as inline SVG. Hover and select states stay local to this document with no tiles or mapping libraries.
                  </p>
                </div>
                <span class="map-badge">SVG only</span>
              </div>
              <div class="map-frame">
                <svg id="field-map-root" class="map-svg" viewBox="0 0 760 430" role="group" aria-label="Farm field boundary schematic" data-initial-field-id="${escapeHtml(initialField.fieldId)}">
                  ${mapFeatures
                    .map(
                      (feature) => `
                  <g class="field-node" data-field-id="${escapeHtml(feature.field.fieldId)}" tabindex="0" role="button" aria-pressed="false" aria-label="${escapeHtml(feature.field.fieldName)}">
                    <path class="field-shape tone-${feature.tone}" d="${feature.pathData}" />
                    <text class="field-label" x="${feature.labelX}" y="${feature.labelY}">${escapeHtml(feature.shortLabel)}</text>
                  </g>`,
                    )
                    .join("")}
                </svg>
              </div>
              <div class="legend" aria-label="Map legend">
                <span class="legend-item"><span class="legend-swatch corn"></span>Corn-led</span>
                <span class="legend-item"><span class="legend-swatch soy"></span>Soy-led</span>
                <span class="legend-item"><span class="legend-swatch other"></span>Other / mixed</span>
              </div>
            </section>

            <section class="teaser-card" aria-label="Selected field teaser">
              <div class="teaser-header">
                <div>
                  <h2 id="selected-field-name">${escapeHtml(initialField.fieldName)}</h2>
                  <p class="teaser-copy">
                    Click any field boundary to preview acreage, county, crop signal, and compact weather/soil hints before the full downstream panels are added.
                  </p>
                </div>
                <span class="teaser-badge">Selection teaser</span>
              </div>
              <div class="teaser-metrics">
                <article class="metric-card">
                  <span class="label">Acreage</span>
                  <span id="selected-field-acreage" class="value">${escapeHtml(`${formatNumber(initialField.areaAcres, 2)} acres`)}</span>
                </article>
                <article class="metric-card">
                  <span class="label">County</span>
                  <span id="selected-field-county" class="value">${escapeHtml(initialField.countyName ?? "County unavailable")}</span>
                </article>
                <article class="metric-card">
                  <span class="label">Crop context</span>
                  <span id="selected-field-crop" class="value">${escapeHtml(formatFieldCropContext(payload, initialField.fieldId))}</span>
                </article>
                <article class="metric-card">
                  <span class="label">Weather hint</span>
                  <span id="selected-field-weather" class="value">${escapeHtml(formatFieldWeatherHint(payload, initialField.fieldId))}</span>
                </article>
                <article class="metric-card">
                  <span class="label">Soil hint</span>
                  <span id="selected-field-soil" class="value">${escapeHtml(formatFieldSoilHint(payload, initialField.fieldId))}</span>
                </article>
                <article class="metric-card">
                  <span class="label">Rotation signal</span>
                  <span id="selected-field-signal" class="value">${escapeHtml(fieldRotationSignal(payload, initialField.fieldId))}</span>
                </article>
              </div>
              <div id="runtime-status" class="runtime-status" aria-live="polite">Loading embedded payload…</div>
            </section>
          </div>
        </section>

        <section class="weather-wrap" aria-label="Selected field weather panel">
          <p class="section-kicker">Selected field weather</p>
          <section class="weather-panel">
            <div class="weather-header">
              <div>
                <h2 id="weather-selected-field">${escapeHtml(initialField.fieldName)}</h2>
                <p id="weather-selected-summary" class="weather-copy">
                  Latest selected-field weather series rendered as inline SVG trend cards from the embedded payload only.
                </p>
              </div>
              <span class="weather-badge">Weather only</span>
            </div>

            <div class="weather-overview">
              <section class="weather-overview-card">
                <h2 class="section-title">Latest field snapshot</h2>
                <p class="weather-overview-copy">
                  Daily weather context updates instantly when you click a different field in the schematic above.
                </p>
                <div class="weather-overview-metrics">
                  <article class="weather-metric">
                    <span class="label">Latest date</span>
                    <span id="weather-latest-date" class="value">Loading…</span>
                  </article>
                  <article class="weather-metric">
                    <span class="label">Average temp</span>
                    <span id="weather-latest-temp" class="value">Loading…</span>
                  </article>
                  <article class="weather-metric">
                    <span class="label">Precipitation</span>
                    <span id="weather-latest-rain" class="value">Loading…</span>
                  </article>
                  <article class="weather-metric">
                    <span class="label">Solar</span>
                    <span id="weather-latest-solar" class="value">Loading…</span>
                  </article>
                  <article class="weather-metric">
                    <span class="label">Humidity</span>
                    <span id="weather-latest-humidity" class="value">Loading…</span>
                  </article>
                  <article class="weather-metric">
                    <span class="label">Wind</span>
                    <span id="weather-latest-wind" class="value">Loading…</span>
                  </article>
                </div>
              </section>

              <section class="weather-overview-card">
                <h2 class="section-title">Inline trend cards</h2>
                <p class="weather-overview-copy">
                  Each chart uses the latest embedded daily rows for the currently selected field and redraws without any page reload.
                </p>
              </section>
            </div>

            <div class="weather-grid">
              <article class="weather-chart-card">
                <span class="label">Temperature</span>
                <span id="weather-value-temperature" class="chart-value">Loading…</span>
                <p id="weather-subtitle-temperature" class="chart-subtitle">Preparing chart…</p>
                <div id="weather-chart-temperature" class="chart-frame"></div>
              </article>
              <article class="weather-chart-card">
                <span class="label">Precipitation</span>
                <span id="weather-value-precipitation" class="chart-value">Loading…</span>
                <p id="weather-subtitle-precipitation" class="chart-subtitle">Preparing chart…</p>
                <div id="weather-chart-precipitation" class="chart-frame"></div>
              </article>
              <article class="weather-chart-card">
                <span class="label">Solar</span>
                <span id="weather-value-solar" class="chart-value">Loading…</span>
                <p id="weather-subtitle-solar" class="chart-subtitle">Preparing chart…</p>
                <div id="weather-chart-solar" class="chart-frame"></div>
              </article>
              <article class="weather-chart-card">
                <span class="label">Humidity</span>
                <span id="weather-value-humidity" class="chart-value">Loading…</span>
                <p id="weather-subtitle-humidity" class="chart-subtitle">Preparing chart…</p>
                <div id="weather-chart-humidity" class="chart-frame"></div>
              </article>
              <article class="weather-chart-card">
                <span class="label">Wind</span>
                <span id="weather-value-wind" class="chart-value">Loading…</span>
                <p id="weather-subtitle-wind" class="chart-subtitle">Preparing chart…</p>
                <div id="weather-chart-wind" class="chart-frame"></div>
              </article>
            </div>
          </section>
        </section>

        <section class="soil-wrap" aria-label="Selected field soil panel">
          <p class="section-kicker">Selected field soil</p>
          <section class="soil-panel">
            <div class="soil-header">
              <div>
                <h2 id="soil-selected-field">${escapeHtml(initialField.fieldName)}</h2>
                <p id="soil-selected-summary" class="soil-copy">
                  Decision-relevant soil summary metrics and compact horizon detail for the currently selected field.
                </p>
              </div>
              <span class="soil-badge">Soil only</span>
            </div>

            <div class="soil-grid">
              <section class="soil-summary-card">
                <h2 class="section-title">Field soil summary</h2>
                <p class="soil-summary-copy">
                  Core soil signals stay visible for quick agronomic framing before deeper downstream panels are added.
                </p>
                <div class="soil-summary-metrics">
                  <article class="soil-metric">
                    <span class="label">Dominant soil</span>
                    <span id="soil-dominant" class="value">${escapeHtml(initialSoilSummary?.dominantSoil ?? "Not available")}</span>
                  </article>
                  <article class="soil-metric">
                    <span class="label">Organic matter</span>
                    <span id="soil-om" class="value">${escapeHtml(formatOptionalMetric(initialSoilSummary?.avgOrganicMatterPct ?? null, "%", 1))}</span>
                  </article>
                  <article class="soil-metric">
                    <span class="label">pH</span>
                    <span id="soil-ph" class="value">${escapeHtml(formatOptionalMetric(initialSoilSummary?.avgPh ?? null, "", 2))}</span>
                  </article>
                  <article class="soil-metric">
                    <span class="label">Total AWS</span>
                    <span id="soil-aws" class="value">${escapeHtml(formatOptionalMetric(initialSoilSummary?.totalAwsInches ?? null, " in", 2))}</span>
                  </article>
                  <article class="soil-metric">
                    <span class="label">Surface texture</span>
                    <span id="soil-texture" class="value">${escapeHtml(textureHintFromHorizon(initialSurfaceHorizon))}</span>
                  </article>
                  <article class="soil-metric">
                    <span class="label">Drainage</span>
                    <span id="soil-drainage" class="value">${escapeHtml(initialSoilSummary?.drainageClass ?? "Not available")}</span>
                  </article>
                </div>
              </section>

              <section class="soil-horizon-card">
                <h2 class="section-title">Compact horizon view</h2>
                <p class="soil-horizon-copy">
                  Normalized horizon rows are condensed into a quick read for depth, chemistry, water capacity, and texture.
                </p>
                <p class="soil-horizon-copy">
                  Horizon rows shown: <strong id="soil-horizon-count">${escapeHtml(String(initialSoilSummary?.horizonCount ?? 0))}</strong>
                </p>
                <div id="soil-horizon-list" class="horizon-list">${renderInitialSoilHorizonRows(payload, initialField.fieldId)}</div>
              </section>
            </div>
          </section>
        </section>

        <section class="crop-wrap" aria-label="Selected field crop and rotation panel">
          <p class="section-kicker">Selected field crop + rotation</p>
          <section class="crop-panel">
            <div class="crop-header">
              <div>
                <h2 id="crop-selected-field">${escapeHtml(initialField.fieldName)}</h2>
                <p id="crop-selected-summary" class="crop-copy">
                  Latest-year composition and normalized rotation outlook for the selected field, updated from the embedded payload only.
                </p>
              </div>
              <span class="crop-badge">Crop only</span>
            </div>

            <div class="crop-grid">
              <section class="crop-composition-card">
                <h2 class="section-title">Latest composition snapshot</h2>
                <p class="crop-composition-copy">
                  Farmer-friendly composition rows for the latest available year stay tied to the current map selection.
                </p>
                <div class="rotation-list">
                  <article class="rotation-item">
                    <div class="rotation-topline">
                      <span class="rotation-name">Latest crop year</span>
                      <span id="crop-latest-year" class="rotation-value">${escapeHtml(initialCropComposition.latestYear == null ? "Not available" : String(initialCropComposition.latestYear))}</span>
                    </div>
                    <div id="crop-composition-lead" class="rotation-detail">${escapeHtml(initialCropLead ? `${initialCropLead.cropName} leads at ${initialCropLead.pct.toFixed(1)}%` : "No latest-year composition available")}</div>
                  </article>
                </div>
                <div id="crop-composition-list" class="composition-list">${renderInitialCropCompositionRows(payload, initialField.fieldId)}</div>
              </section>

              <section class="crop-rotation-card">
                <h2 class="section-title">Rotation outlook</h2>
                <p class="crop-rotation-copy">
                  Short historical context plus next-crop signal from the normalized rotation summary for the selected field.
                </p>
                <div class="rotation-list">
                  <article class="rotation-item">
                    <div class="rotation-topline">
                      <span class="rotation-name">Predicted next crop</span>
                      <span id="crop-rotation-next" class="rotation-value">${escapeHtml(initialRotation?.predictedNextCrop ?? "Not available")}</span>
                    </div>
                    <div id="crop-rotation-confidence" class="rotation-detail">Confidence: ${escapeHtml(initialRotation?.rotationConfidence ?? "Not available")}</div>
                  </article>
                  <article class="rotation-item">
                    <div class="rotation-topline">
                      <span class="rotation-name">Sequence</span>
                    </div>
                    <div id="crop-rotation-sequence" class="rotation-detail">${escapeHtml(initialRotation?.rotationSequence ?? "No normalized rotation sequence available")}</div>
                  </article>
                  <article class="rotation-item">
                    <div class="rotation-topline">
                      <span class="rotation-name">History window</span>
                    </div>
                    <div id="crop-rotation-history" class="rotation-detail">${escapeHtml(initialRotation ? `${initialRotation.historyStartYear ?? "—"} → ${initialRotation.historyEndYear ?? "—"} • diversity ${initialRotation.cropDiversity}` : "History unavailable")}</div>
                  </article>
                  <article class="rotation-item">
                    <div class="rotation-topline">
                      <span class="rotation-name">Observed patterns</span>
                    </div>
                    <div id="crop-rotation-patterns" class="rotation-pills">${initialRotation && initialRotation.rotationPatterns.length > 0 ? initialRotation.rotationPatterns.map((pattern) => `<span class="rotation-pill">${escapeHtml(pattern)}</span>`).join("") : '<span class="rotation-pill">No rotation patterns available</span>'}</div>
                  </article>
                  <article class="rotation-item">
                    <div class="rotation-topline">
                      <span class="rotation-name">Rotation outlook</span>
                    </div>
                    <div id="crop-rotation-outlook" class="rotation-detail">${escapeHtml(initialRotation?.rotationOutlook ?? "Rotation outlook unavailable")}</div>
                  </article>
                </div>
              </section>
            </div>
          </section>
        </section>
      </section>
    </main>
    <script id="${GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID}" type="application/json">${embeddedPayload}</script>
    <script>${INLINE_JS}</script>
  </body>
</html>`;
}
