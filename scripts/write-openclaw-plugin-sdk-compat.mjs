#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const rootDir = process.cwd();
const packageJsonPath = resolve(rootDir, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const distPluginSdkDir = resolve(rootDir, "dist", "plugin-sdk");

if (!existsSync(distPluginSdkDir)) {
  console.log("skip openclaw plugin-sdk compatibility shim: dist/plugin-sdk is missing");
  process.exit(0);
}

const compatRootDir = resolve(rootDir, "node_modules", "openclaw");
const compatPluginSdkDir = resolve(compatRootDir, "plugin-sdk");

const pluginSdkEntries = Object.entries(packageJson.exports ?? {})
  .filter(([key]) => key === "./plugin-sdk" || /^\.\/plugin-sdk\/[^/]+$/.test(key))
  .map(([key, value]) => {
    const exportConfig =
      value && typeof value === "object" && !Array.isArray(value)
        ? value
        : {
            default: value,
          };

    if (typeof exportConfig.default !== "string") {
      throw new Error(`Expected a default export target for ${key}`);
    }

    return {
      exportKey: key,
      subpath: key === "./plugin-sdk" ? "index" : key.slice("./plugin-sdk/".length),
      runtimeTarget: exportConfig.default,
      typesTarget: typeof exportConfig.types === "string" ? exportConfig.types : null,
    };
  });

mkdirSync(compatRootDir, { recursive: true });
rmSync(compatPluginSdkDir, { recursive: true, force: true });
mkdirSync(compatPluginSdkDir, { recursive: true });

const compatExports = {};

for (const entry of pluginSdkEntries) {
  const jsRelativePath = `./plugin-sdk/${entry.subpath}.js`;
  const dtsRelativePath = `./plugin-sdk/${entry.subpath}.d.ts`;
  const jsFilePath = resolve(compatRootDir, jsRelativePath);
  const dtsFilePath = resolve(compatRootDir, dtsRelativePath);
  const runtimeImportPath = resolveImportTarget(jsFilePath, resolve(rootDir, entry.runtimeTarget));

  compatExports[entry.exportKey] = {
    ...(entry.typesTarget ? { types: dtsRelativePath } : {}),
    default: jsRelativePath,
  };

  writeFile(jsFilePath, buildRuntimeWrapper(runtimeImportPath));

  if (entry.typesTarget) {
    const typesImportPath = resolveImportTarget(dtsFilePath, resolve(rootDir, entry.typesTarget));
    writeFile(dtsFilePath, buildTypesWrapper(typesImportPath));
  }
}

writeFile(
  resolve(compatRootDir, "package.json"),
  `${JSON.stringify(
    {
      name: "openclaw",
      version: packageJson.version,
      private: true,
      type: "module",
      exports: compatExports,
    },
    null,
    2,
  )}\n`,
);

console.log(`wrote openclaw plugin-sdk compatibility shim to ${compatRootDir}`);

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content);
}

function resolveImportTarget(fromFilePath, toFilePath) {
  const relativePath = toFilePath.replace(/\\/g, "/").split("/");
  const fromDirParts = dirname(fromFilePath).replace(/\\/g, "/").split("/");

  while (
    relativePath.length > 0 &&
    fromDirParts.length > 0 &&
    relativePath[0] === fromDirParts[0]
  ) {
    relativePath.shift();
    fromDirParts.shift();
  }

  const up = fromDirParts.map(() => "..");
  return [...up, ...relativePath].join("/");
}

function buildRuntimeWrapper(importTarget) {
  return [
    `export * from ${JSON.stringify(importTarget)};`,
    `import * as moduleNamespace from ${JSON.stringify(importTarget)};`,
    "export default moduleNamespace;",
    "",
  ].join("\n");
}

function buildTypesWrapper(importTarget) {
  return [
    `export * from ${JSON.stringify(importTarget)};`,
    `import * as moduleNamespace from ${JSON.stringify(importTarget)};`,
    "export default moduleNamespace;",
    "",
  ].join("\n");
}
