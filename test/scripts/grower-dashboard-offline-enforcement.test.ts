import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { buildKsGrowerDashboard } from "../../scripts/grower-dashboard/build-ks-grower-02.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

describe("grower dashboard strict offline enforcement", () => {
  it("keeps the generated ks-grower-02 dashboard fully inline and free of forbidden runtime references", () => {
    const outputPath = buildKsGrowerDashboard(repoRoot);
    const html = fs.readFileSync(outputPath, "utf8");

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
