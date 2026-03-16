import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const compatWriter = resolve(repoRoot, "scripts", "write-openclaw-plugin-sdk-compat.mjs");
const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe("openclaw plugin-sdk package compatibility", () => {
  it("writes runtime-compatible subpath shims from built plugin-sdk exports", async () => {
    const fixtureRoot = mkdtempSync(join(tmpdir(), "openclaw-compat-"));
    tempDirs.push(fixtureRoot);

    writeJson(resolve(fixtureRoot, "package.json"), {
      name: "my-farm-advisor",
      version: "0.0.0-test",
      type: "module",
      exports: {
        "./plugin-sdk": {
          types: "./dist/plugin-sdk/index.d.ts",
          default: "./dist/plugin-sdk/index.js",
        },
        "./plugin-sdk/core": {
          types: "./dist/plugin-sdk/core.d.ts",
          default: "./dist/plugin-sdk/core.js",
        },
        "./plugin-sdk/device-pair": {
          types: "./dist/plugin-sdk/device-pair.d.ts",
          default: "./dist/plugin-sdk/device-pair.js",
        },
        "./plugin-sdk/memory-core": {
          types: "./dist/plugin-sdk/memory-core.d.ts",
          default: "./dist/plugin-sdk/memory-core.js",
        },
      },
    });

    writeModule(fixtureRoot, "index", "export const rootTag = 'root';\n");
    writeModule(fixtureRoot, "core", "export const runtimeTag = 'core';\n");
    writeModule(fixtureRoot, "device-pair", "export const runtimeTag = 'device-pair';\n");
    writeModule(fixtureRoot, "memory-core", "export const runtimeTag = 'memory-core';\n");

    execFileSync(process.execPath, [compatWriter], {
      cwd: fixtureRoot,
      stdio: "pipe",
    });

    const requireFromFixture = createRequire(resolve(fixtureRoot, "compat-check.cjs"));
    const compatPackageJson = JSON.parse(
      readFileSync(resolve(fixtureRoot, "node_modules", "openclaw", "package.json"), "utf8"),
    ) as {
      exports: Record<string, { default: string; types?: string }>;
    };

    expect(compatPackageJson.exports["./plugin-sdk/core"]?.default).toBe("./plugin-sdk/core.js");
    expect(requireFromFixture.resolve("openclaw/plugin-sdk/core")).toBe(
      resolve(fixtureRoot, "node_modules", "openclaw", "plugin-sdk", "core.js"),
    );
    expect(requireFromFixture.resolve("openclaw/plugin-sdk/device-pair")).toBe(
      resolve(fixtureRoot, "node_modules", "openclaw", "plugin-sdk", "device-pair.js"),
    );
    expect(requireFromFixture.resolve("openclaw/plugin-sdk/memory-core")).toBe(
      resolve(fixtureRoot, "node_modules", "openclaw", "plugin-sdk", "memory-core.js"),
    );

    const coreModule = await import(
      pathToFileURL(requireFromFixture.resolve("openclaw/plugin-sdk/core")).href
    );
    const devicePairModule = await import(
      pathToFileURL(requireFromFixture.resolve("openclaw/plugin-sdk/device-pair")).href
    );
    const memoryCoreModule = await import(
      pathToFileURL(requireFromFixture.resolve("openclaw/plugin-sdk/memory-core")).href
    );

    expect(coreModule.runtimeTag).toBe("core");
    expect(devicePairModule.runtimeTag).toBe("device-pair");
    expect(memoryCoreModule.runtimeTag).toBe("memory-core");
  });
});

function writeModule(rootDir: string, name: string, body: string) {
  const distDir = resolve(rootDir, "dist", "plugin-sdk");
  mkdirSync(distDir, { recursive: true });
  writeFileSync(resolve(distDir, `${name}.js`), body);
  writeFileSync(resolve(distDir, `${name}.d.ts`), `export declare const runtimeTag: string;\n`);
}

function writeJson(filePath: string, value: unknown) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}
