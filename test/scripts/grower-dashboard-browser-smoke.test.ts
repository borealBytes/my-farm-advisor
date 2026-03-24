import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { describe, expect, it } from "vitest";
import { buildKsGrowerDashboard } from "../../scripts/grower-dashboard/build-ks-grower-02.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function resolveChromiumExecutablePath(): string {
  const cacheRoots = [
    path.join(os.homedir(), ".cache", "ms-playwright"),
    path.join(process.env.HOME ?? "", ".cache", "ms-playwright"),
    "/home/clay/.cache/ms-playwright",
  ];

  const cachedChromiumCandidates = [...new Set(cacheRoots)]
    .filter((root) => root.length > 0 && fs.existsSync(root))
    .flatMap((root) =>
      fs
        .readdirSync(root)
        .filter((entry) => entry.startsWith("chromium-"))
        .toSorted()
        .toReversed()
        .map((entry) => path.join(root, entry, "chrome-linux64", "chrome")),
    );

  const candidates = [
    ...cachedChromiumCandidates,
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
  ];

  const executablePath = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executablePath) {
    throw new Error("No local Chromium executable found for playwright-core smoke testing.");
  }

  return executablePath;
}

describe("grower dashboard browser smoke", () => {
  it("loads the local file artifact and updates selected-field state after a map click", async () => {
    const outputPath = buildKsGrowerDashboard(repoRoot);
    const browser = await chromium.launch({
      executablePath: resolveChromiumExecutablePath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.goto(pathToFileURL(outputPath).href);

      const showcaseField = page.locator("#selected-showcase-field");
      await showcaseField.waitFor();
      const initialFieldText = await showcaseField.textContent();
      expect(initialFieldText).toBeTruthy();

      const targetField = page.locator('[data-field-id="osm-1423116261"]');
      await targetField.click();

      await page.waitForFunction(() => {
        const showcase = document.querySelector("#selected-showcase-field");
        const weather = document.querySelector("#weather-selected-field");
        return (
          showcase?.textContent === "osm-1423116261" && weather?.textContent === "osm-1423116261"
        );
      });

      expect(await showcaseField.textContent()).toBe("osm-1423116261");
      expect(await showcaseField.textContent()).not.toBe(initialFieldText);
      expect(await page.locator("#weather-selected-field").textContent()).toBe("osm-1423116261");
    } finally {
      await browser.close();
    }
  });
});
