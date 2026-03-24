import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolveKsGrowerDashboardOutputPath } from "./contracts.ts";
import { loadKsGrowerDashboardPayload } from "./data-adapter.ts";
import { renderGrowerDashboardHtml } from "./render-html.ts";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export function buildKsGrowerDashboard(rootDir: string = repoRoot): string {
  const payload = loadKsGrowerDashboardPayload(rootDir);
  const html = renderGrowerDashboardHtml(payload);
  const outputPath = resolveKsGrowerDashboardOutputPath(rootDir);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html, "utf8");

  return outputPath;
}

function isDirectExecution(): boolean {
  const entryPoint = process.argv[1];
  if (!entryPoint) {
    return false;
  }

  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isDirectExecution()) {
  const outputPath = buildKsGrowerDashboard();
  process.stdout.write(outputPath + "\n");
}
