import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildKsGrowerDashboard } from "../../scripts/grower-dashboard/build-ks-grower-02.ts";
import { GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID } from "../../scripts/grower-dashboard/contracts.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("grower dashboard regression surface", () => {
  it("renders the redesigned hierarchy in the generated offline html", () => {
    const outputPath = buildKsGrowerDashboard(repoRoot);
    const html = fs.readFileSync(outputPath, "utf8");

    const portfolioSummaryIndex = html.indexOf('aria-label="Portfolio summary cards"');
    const mapSectionIndex = html.indexOf('aria-label="Offline field boundary schematic"');
    const focusedPanelIndex = html.indexOf('id="selected-field-focus"');
    const actionTableIndex = html.indexOf('aria-label="Field action table"');
    const conciseEvidenceIndex = html.indexOf('aria-label="Concise supporting evidence block"');
    const expandedEvidenceIndex = html.indexOf('aria-label="Expanded selected-field evidence"');

    expect(portfolioSummaryIndex).toBeGreaterThanOrEqual(0);
    expect(mapSectionIndex).toBeGreaterThan(portfolioSummaryIndex);
    expect(focusedPanelIndex).toBeGreaterThan(mapSectionIndex);
    expect(actionTableIndex).toBeGreaterThan(mapSectionIndex);
    expect(conciseEvidenceIndex).toBeGreaterThan(focusedPanelIndex);
    expect(expandedEvidenceIndex).toBeGreaterThan(conciseEvidenceIndex);

    expect(html).toContain('aria-label="Portfolio summary cards"');
    expect(html).toContain("Corn earliest band");
    expect(html).toContain("Soy earliest band");
    expect(html).toContain("Field fit readiness");
    expect(html).toContain("Next workable / access window");
    expect(html).toContain("Imagery-ready fields");

    expect(html).toContain('aria-label="Offline field boundary schematic"');
    expect(html).toContain('id="field-map-root"');
    expect(html).toContain('aria-label="Farm field boundary schematic"');

    expect(html).toContain('id="selected-field-focus"');
    expect(html).toContain('aria-label="Focused selected-field detail panel"');
    expect(html).toContain('id="selected-showcase-field"');
    expect(html).toContain('id="selected-showcase-summary"');
    expect(html).toContain('id="selected-field-reset"');
    expect(html).toContain('aria-label="Concise supporting evidence block"');
    expect(html).toContain('id="selected-field-crop"');
    expect(html).toContain('id="selected-field-weather"');
    expect(html).toContain('id="selected-field-soil"');
    expect(html).toContain('id="selected-field-signal"');
    expect(html).toContain('aria-label="Expanded selected-field evidence"');
    expect(html.match(/class="field-evidence-card"/g)?.length).toBe(4);

    expect(html).toContain('aria-label="Field action table"');
    expect(html).toContain('aria-label="Primary field action table"');
    expect(html).toContain('class="selection-table-row"');
    expect(html).toContain('class="field-table-button');

    expect(html).toContain('aria-label="Selected field weather panel"');
    expect(html).toContain('id="weather-selected-field"');
    expect(html).toContain('id="weather-chart-temperature"');

    expect(html).toContain('aria-label="Selected field soil panel"');
    expect(html).toContain('id="soil-selected-field"');
    expect(html).toContain('id="soil-horizon-list"');

    expect(html).toContain('aria-label="Selected field crop and rotation panel"');
    expect(html).toContain('id="crop-selected-field"');
    expect(html).toContain('id="crop-rotation-outlook"');

    expect(html).toContain('aria-label="Selected field imagery panel"');
    expect(html).toContain('id="imagery-selected-field"');
    expect(html).toContain('id="imagery-scene-list"');

    expect(html).toContain(`id="${GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID}"`);
  });
});
