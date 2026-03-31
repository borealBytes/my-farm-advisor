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
  it("loads the local file artifact and keeps map, action table, and focused detail panel synchronized", async () => {
    const outputPath = buildKsGrowerDashboard(repoRoot);
    const browser = await chromium.launch({
      executablePath: resolveChromiumExecutablePath(),
      headless: true,
    });

    try {
      const page = await browser.newPage();
      await page.goto(pathToFileURL(outputPath).href);

      const portfolioSummary = page.getByRole("region", { name: "Portfolio summary cards" });
      const mapSection = page.getByRole("region", { name: "Offline field boundary schematic" });
      const actionTableSection = page.getByRole("region", { name: "Field action table" });
      const focusedDetailPanel = page.getByRole("region", {
        name: "Focused selected-field detail panel",
      });
      const conciseEvidenceBlock = focusedDetailPanel.getByRole("region", {
        name: "Concise supporting evidence block",
      });
      const expandedEvidence = focusedDetailPanel.getByRole("region", {
        name: "Expanded selected-field evidence",
      });
      const actionTable = page.getByRole("table", { name: "Primary field action table" });
      const showcaseField = page.locator("#selected-showcase-field");
      const weatherSelectedField = page.locator("#weather-selected-field");
      const fieldFocus = page.locator("#selected-field-focus");
      const resetButton = page.locator("#selected-field-reset");

      await showcaseField.waitFor();

      await portfolioSummary.waitFor();
      expect(await portfolioSummary.locator("article").count()).toBe(5);
      await mapSection.waitFor();
      await page.locator("#field-map-root").waitFor();
      await actionTableSection.waitFor();
      await actionTable.waitFor();
      await focusedDetailPanel.waitFor();
      await conciseEvidenceBlock.waitFor();
      await expandedEvidence.waitFor();
      expect(await expandedEvidence.locator("details.field-evidence-card").count()).toBe(4);
      expect(await portfolioSummary.isVisible()).toBe(true);
      expect(await mapSection.isVisible()).toBe(true);
      expect(await actionTableSection.isVisible()).toBe(true);
      expect(await actionTable.isVisible()).toBe(true);
      expect(await focusedDetailPanel.isVisible()).toBe(true);
      expect(await conciseEvidenceBlock.isVisible()).toBe(true);
      expect(await expandedEvidence.isVisible()).toBe(true);

      const initialFieldText = await showcaseField.textContent();
      expect(initialFieldText).toBeTruthy();

      const targetFieldId = "osm-1423116261";
      const targetMapField = page.locator(`#field-map-root [data-field-id="${targetFieldId}"]`);
      const targetTableRow = page.locator(
        `.selection-table-row[data-selection-field-id="${targetFieldId}"]`,
      );
      const targetTableButton = page.locator(
        `.field-table-button[data-selection-field-id="${targetFieldId}"]`,
      );

      await targetMapField.click();

      await page.waitForFunction((fieldId) => {
        const body = document.body;
        const showcase = document.querySelector("#selected-showcase-field");
        const weather = document.querySelector("#weather-selected-field");
        const selectedRow = document.querySelector(
          `.selection-table-row[data-selection-field-id="${fieldId}"]`,
        );
        const selectedButton = document.querySelector(
          `.field-table-button[data-selection-field-id="${fieldId}"]`,
        );

        return (
          body.dataset.selectedFieldId === fieldId &&
          showcase?.textContent === fieldId &&
          weather?.textContent === fieldId &&
          selectedRow?.getAttribute("data-selected") === "true" &&
          selectedButton?.classList.contains("is-selected") === true &&
          selectedButton?.getAttribute("data-field-id") === fieldId
        );
      }, targetFieldId);

      expect(await showcaseField.textContent()).toBe(targetFieldId);
      expect(await showcaseField.textContent()).not.toBe(initialFieldText);
      expect(await weatherSelectedField.textContent()).toBe(targetFieldId);
      expect(await fieldFocus.getAttribute("data-detail-state")).toBe("selected");
      expect(await page.locator("body").getAttribute("data-selected-field-id")).toBe(targetFieldId);
      expect(await targetTableRow.getAttribute("data-selected")).toBe("true");
      expect(await targetTableButton.getAttribute("class")).toContain("is-selected");

      await resetButton.click();

      await page.waitForFunction(() => {
        const body = document.body;
        const showcase = document.querySelector("#selected-showcase-field");
        const weather = document.querySelector("#weather-selected-field");
        const focus = document.querySelector("#selected-field-focus");
        const selectedRows = document.querySelectorAll(
          '.selection-table-row[data-selected="true"]',
        );
        const selectedButtons = document.querySelectorAll(".field-table-button.is-selected");

        return (
          body.dataset.selectedFieldId === "" &&
          showcase?.textContent === "Farm overview" &&
          weather?.textContent === "Farm overview" &&
          focus?.getAttribute("data-detail-state") === "overview" &&
          selectedRows.length === 0 &&
          selectedButtons.length === 0
        );
      });

      expect(await page.locator("body").getAttribute("data-selected-field-id")).toBe("");
      expect(await fieldFocus.getAttribute("data-detail-state")).toBe("overview");
      expect(await showcaseField.textContent()).toBe("Farm overview");
      expect(await page.locator("#selected-showcase-summary").textContent()).toContain(
        "Use the map or action table to reopen one focused field panel.",
      );
      expect(await weatherSelectedField.textContent()).toBe("Farm overview");
      expect(await page.locator("#soil-selected-field").textContent()).toBe("Farm overview");
      expect(await targetTableRow.getAttribute("data-selected")).toBe("false");
      expect((await targetTableButton.getAttribute("class")) ?? "").not.toContain("is-selected");

      await targetTableButton.click();

      await page.waitForFunction((fieldId) => {
        const body = document.body;
        const showcase = document.querySelector("#selected-showcase-field");
        const weather = document.querySelector("#weather-selected-field");
        const focus = document.querySelector("#selected-field-focus");
        const selectedRow = document.querySelector(
          `.selection-table-row[data-selection-field-id="${fieldId}"]`,
        );
        const selectedButton = document.querySelector(
          `.field-table-button[data-selection-field-id="${fieldId}"]`,
        );

        return (
          body.dataset.selectedFieldId === fieldId &&
          showcase?.textContent === fieldId &&
          weather?.textContent === fieldId &&
          focus?.getAttribute("data-detail-state") === "selected" &&
          selectedRow?.getAttribute("data-selected") === "true" &&
          selectedButton?.classList.contains("is-selected") === true
        );
      }, targetFieldId);

      expect(await page.locator("body").getAttribute("data-selected-field-id")).toBe(targetFieldId);
      expect(await fieldFocus.getAttribute("data-detail-state")).toBe("selected");
      expect(await showcaseField.textContent()).toBe(targetFieldId);
      expect(await weatherSelectedField.textContent()).toBe(targetFieldId);
      expect(await targetTableRow.getAttribute("data-selected")).toBe("true");
      expect(await targetTableButton.getAttribute("class")).toContain("is-selected");
    } finally {
      await browser.close();
    }
  });
});
