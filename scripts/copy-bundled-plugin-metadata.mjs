#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { collectBundledPluginSources } from "./lib/bundled-plugin-source-utils.mjs";

const rootDir = process.cwd();

let copied = 0;
for (const plugin of collectBundledPluginSources({
  repoRoot: rootDir,
  requirePackageJson: false,
})) {
  copied += copyIfPresent(plugin.dirName, plugin.manifestPath, "openclaw.plugin.json");
  copied += copyIfPresent(plugin.dirName, plugin.packageJsonPath, "package.json");
}

console.log(`[copy-bundled-plugin-metadata] Copied ${copied} bundled plugin metadata files.`);

function copyIfPresent(pluginId, sourcePath, fileName) {
  if (!sourcePath || !fs.existsSync(sourcePath)) {
    return 0;
  }

  const destPath = path.join(rootDir, "dist", "extensions", pluginId, fileName);
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.copyFileSync(sourcePath, destPath);
  return 1;
}
