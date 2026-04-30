import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildKsGrowerDashboard } from "../../scripts/grower-dashboard/build-ks-grower-02.ts";
import {
  GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID,
  resolveKsGrowerDashboardOutputPath,
} from "../../scripts/grower-dashboard/contracts.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("grower dashboard generation", () => {
  it("writes the canonical offline html with embedded payload and no external references", () => {
    const outputPath = buildKsGrowerDashboard(repoRoot);
    const expectedOutputPath = resolveKsGrowerDashboardOutputPath(repoRoot);
    const html = fs.readFileSync(outputPath, "utf8");

    expect(outputPath).toBe(expectedOutputPath);
    expect(html).toContain(`id="${GROWER_DASHBOARD_EMBEDDED_PAYLOAD_SCRIPT_ID}"`);

    for (const forbiddenPattern of [
      "http://",
      "https://",
      /<script\s+src/iu,
      /<link\s+rel/iu,
      /fetch\(/u,
      /import\(/u,
    ]) {
      expect(html).not.toMatch(forbiddenPattern);
    }

    expect(html).toMatch(/<style>[\s\S]+<\/style>/u);
    expect(html).toMatch(/<script>([\s\S]+)<\/script>/u);
  });
});
