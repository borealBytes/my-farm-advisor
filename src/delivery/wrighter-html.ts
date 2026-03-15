import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("delivery/wrighter-html");

type OpenBuilderModule =
  typeof import("../../skills/superior-byte-works-wrighter/delivery/offline-html-open/dist/index.js");
type SealedBuilderModule =
  typeof import("../../skills/superior-byte-works-wrighter/delivery/offline-html-sealed/dist/index.js");

let cachedOpenBuilder: Promise<OpenBuilderModule["buildOfflineHtmlOpen"]> | null = null;
let cachedSealedBuilder: Promise<SealedBuilderModule["buildOfflineHtmlSealed"]> | null = null;

export type HtmlDeliveryMode = "open" | "sealed" | "none";

export interface HtmlDeliveryResult {
  mode: HtmlDeliveryMode;
  htmlPath: string;
  fileName: string;
  summary: string;
  deliveryId: string;
  fingerprintId?: string;
  principals?: string[];
  cleanup: () => Promise<void>;
}

export interface HtmlDeliveryConfig {
  mode: HtmlDeliveryMode;
  outputDir?: string;
}

export function resolveHtmlDeliveryConfig(
  frontmatter: Record<string, unknown>,
): HtmlDeliveryConfig {
  const raw = frontmatter?.delivery;
  if (!raw || typeof raw !== "object") {
    return { mode: "none" };
  }
  const config = raw as Record<string, unknown>;
  const modeValue = typeof config.mode === "string" ? config.mode.trim().toLowerCase() : "";
  if (modeValue === "offline-html-open" || modeValue === "open-html" || modeValue === "open") {
    return { mode: "open" };
  }
  if (
    modeValue === "offline-html-sealed" ||
    modeValue === "sealed-html" ||
    modeValue === "sealed"
  ) {
    return { mode: "sealed" };
  }
  return { mode: "none" };
}

export async function maybeBuildHtmlArtifact(
  input: { raw: string; sourcePath?: string; frontmatter: Record<string, unknown> },
  config: HtmlDeliveryConfig,
): Promise<HtmlDeliveryResult | null> {
  if (config.mode === "none") {
    return null;
  }

  const outputRoot = config.outputDir
    ? path.resolve(config.outputDir)
    : await createTempOutputDir(config.mode);
  const cleanup = async () => {
    if (!config.outputDir) {
      await fs.rm(outputRoot, { recursive: true, force: true }).catch(() => {});
    }
  };

  try {
    if (config.mode === "open") {
      const builder = await loadOpenBuilder();
      const result = await builder(
        { raw: input.raw, sourcePath: input.sourcePath },
        { outputDir: outputRoot },
      );
      return {
        mode: "open",
        htmlPath: result.htmlPath,
        fileName: result.fileName,
        summary: result.summary,
        deliveryId: result.deliveryId,
        cleanup,
      };
    }

    if (config.mode === "sealed") {
      const builder = await loadSealedBuilder();
      const result = await builder(
        { raw: input.raw, sourcePath: input.sourcePath },
        { outputDir: outputRoot },
      );
      return {
        mode: "sealed",
        htmlPath: result.htmlPath,
        fileName: result.fileName,
        summary: result.summary,
        deliveryId: result.deliveryId,
        fingerprintId: result.fingerprintId,
        principals: result.principals,
        cleanup,
      };
    }
  } catch (err) {
    await cleanup().catch(() => {});
    log.warn("failed to build html delivery artifact", { mode: config.mode, err });
    throw err;
  }

  await cleanup().catch(() => {});
  return null;
}

async function createTempOutputDir(mode: string): Promise<string> {
  const baseDir = path.join(resolvePreferredOpenClawTmpDir(), `wrighter-html-${mode}`);
  await fs.mkdir(baseDir, { recursive: true, mode: 0o700 });
  return await fs.mkdtemp(path.join(baseDir, `${randomUUID()}-`));
}

async function loadOpenBuilder(): Promise<OpenBuilderModule["buildOfflineHtmlOpen"]> {
  if (!cachedOpenBuilder) {
    cachedOpenBuilder = import(
      new URL(
        "../../skills/superior-byte-works-wrighter/delivery/offline-html-open/dist/index.js",
        import.meta.url,
      ).href
    ).then((mod) => {
      const builder = (mod as OpenBuilderModule).buildOfflineHtmlOpen;
      if (typeof builder !== "function") {
        throw new Error("offline-html-open build output missing buildOfflineHtmlOpen");
      }
      return builder;
    });
  }
  return cachedOpenBuilder;
}

async function loadSealedBuilder(): Promise<SealedBuilderModule["buildOfflineHtmlSealed"]> {
  if (!cachedSealedBuilder) {
    cachedSealedBuilder = import(
      new URL(
        "../../skills/superior-byte-works-wrighter/delivery/offline-html-sealed/dist/index.js",
        import.meta.url,
      ).href
    ).then((mod) => {
      const builder = (mod as SealedBuilderModule).buildOfflineHtmlSealed;
      if (typeof builder !== "function") {
        throw new Error("offline-html-sealed build output missing buildOfflineHtmlSealed");
      }
      return builder;
    });
  }
  return cachedSealedBuilder;
}
