import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { createRequire } from "module";
import { tmpdir } from "os";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import type { MediaAsset, MediaRenderContext } from "../types.js";

const require = createRequire(import.meta.url);

export async function renderMermaidDiagram(
  code: string,
  context: MediaRenderContext,
): Promise<MediaAsset> {
  const { outputDir, baseFileName, assetIndex } = context;
  await fs.mkdir(outputDir, { recursive: true });

  const fileName = `${baseFileName}-${String(assetIndex).padStart(3, "0")}.png`;
  const finalPath = path.resolve(outputDir, fileName);

  const tempDir = await fs.mkdtemp(path.join(tmpdir(), "mermaid-"));
  const inputPath = path.join(tempDir, `${randomUUID()}.mmd`);
  const tempOutputPath = path.join(tempDir, `${randomUUID()}.png`);
  const puppeteerConfigPath = path.resolve(
    process.cwd(),
    "skills/superior-byte-works-wrighter/delivery/telegram/puppeteer.config.cjs",
  );

  await fs.writeFile(inputPath, code, "utf8");

  const cliPath = resolveMermaidCli();

  try {
    const args = [cliPath, "-i", inputPath, "-o", tempOutputPath];
    try {
      await fs.access(puppeteerConfigPath);
      args.push("-p", puppeteerConfigPath);
    } catch {}
    await execa(process.execPath, args, {
      stdio: "pipe",
    });
  } finally {
    await fs.unlink(inputPath).catch(() => undefined);
  }

  await fs.mkdir(path.dirname(finalPath), { recursive: true });
  await fs.rename(tempOutputPath, finalPath);
  await fs.rm(tempDir, { recursive: true, force: true }).catch(() => undefined);

  const stats = await fs.stat(finalPath);

  return {
    type: "photo",
    filePath: finalPath,
    sizeBytes: stats.size,
    role: "mermaid",
  };
}

function resolveMermaidCli(): string {
  if (typeof import.meta.resolve === "function") {
    try {
      const resolved = import.meta.resolve("@mermaid-js/mermaid-cli");
      const rootDir = path.dirname(fileURLToPath(resolved));
      return path.resolve(rootDir, "cli.js");
    } catch (error) {}
  }

  const entry = require.resolve("@mermaid-js/mermaid-cli");
  const rootDir = path.dirname(entry);
  return path.resolve(rootDir, "cli.js");
}
