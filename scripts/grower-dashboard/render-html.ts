import {
  assertNormalizedGrowerDashboardPayload,
  GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  type NormalizedGrowerDashboardPayload,
} from "./contracts.ts";

const INLINE_CSS = `
:root {
  color-scheme: light;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f4f7f2;
  color: #18281d;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: linear-gradient(180deg, #f7faf6 0%, #eef4ec 100%);
}

main {
  max-width: 960px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}

.shell {
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(24, 40, 29, 0.08);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(42, 72, 53, 0.1);
  padding: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #4e7a5b;
}

h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.1;
}

.lede {
  margin: 16px 0 0;
  max-width: 60ch;
  font-size: 1rem;
  line-height: 1.6;
  color: #355240;
}

.meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 28px 0 0;
}

.card {
  border-radius: 16px;
  background: #f7fbf6;
  border: 1px solid rgba(24, 40, 29, 0.08);
  padding: 16px;
}

.label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #5d7767;
}

.value {
  display: block;
  margin-top: 6px;
  font-size: 1.2rem;
  font-weight: 700;
}

#runtime-status {
  margin-top: 24px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #18281d;
  color: #f7fbf6;
  font-family: ui-monospace, SFMono-Regular, SFMono-Regular, Menlo, monospace;
  white-space: pre-wrap;
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
    "Offline dashboard shell loaded successfully.",
    "Farm: " + payload.farm.farmName,
    "Fields: " + String(payload.fields.length),
    "Weather rows: " + String(payload.weatherSeries.length),
    "Diagnostics: " + String(payload.diagnostics.length),
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

export function renderGrowerDashboardHtml(payload: NormalizedGrowerDashboardPayload): string {
  assertNormalizedGrowerDashboardPayload(payload);

  const title = `${payload.farm.farmName} Dashboard`;
  const embeddedPayload = serializeEmbeddedPayload(payload);
  const fieldCountLabel = String(payload.fields.length);
  const acreageLabel = `${payload.farm.totalAcres.toFixed(2)} acres`;
  const generatedAtLabel = new Date(payload.generatedAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: payload.grower.timezone,
  });

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
      <section class="shell" aria-label="Grower dashboard shell">
        <p class="eyebrow">Offline dashboard preview</p>
        <h1>${escapeHtml(payload.farm.farmName)}</h1>
        <p class="lede">
          This single-file HTML shell already embeds the normalized grower payload and runs without
          fetches, imports, sibling assets, or browser storage APIs.
        </p>
        <div class="meta" aria-label="Farm summary placeholder">
          <article class="card"><span class="label">Grower</span><span class="value">${escapeHtml(payload.grower.growerName)}</span></article>
          <article class="card"><span class="label">Fields</span><span class="value">${escapeHtml(fieldCountLabel)}</span></article>
          <article class="card"><span class="label">Acreage</span><span class="value">${escapeHtml(acreageLabel)}</span></article>
          <article class="card"><span class="label">Generated</span><span class="value">${escapeHtml(generatedAtLabel)}</span></article>
        </div>
        <div id="runtime-status" aria-live="polite">Loading embedded payload…</div>
      </section>
    </main>
    <script id="${GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID}" type="application/json">${embeddedPayload}</script>
    <script>${INLINE_JS}</script>
  </body>
</html>`;
}
