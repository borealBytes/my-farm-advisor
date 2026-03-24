import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildKsGrowerDashboard } from "../../scripts/grower-dashboard/build-ks-grower-02.ts";
import { GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID } from "../../scripts/grower-dashboard/contracts.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("grower dashboard regression surface", () => {
  it("renders the coordinated ks-grower-02 product sections in the generated offline html", () => {
    const outputPath = buildKsGrowerDashboard(repoRoot);
    const html = fs.readFileSync(outputPath, "utf8");

    expect(html).toContain('class="hero"');
    expect(html).toContain("Offline classroom demo dashboard");

    expect(html).toContain('aria-label="Offline field boundary schematic"');
    expect(html).toContain('id="field-map-root"');

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

    expect(html).toContain('aria-label="Diagnostics and lineage panel"');
    expect(html).toContain('class="diagnostics-disclosure"');
    expect(html).toContain("Secondary lineage and anomaly view");

    expect(html).toContain(`id="${GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID}"`);
  });
});
