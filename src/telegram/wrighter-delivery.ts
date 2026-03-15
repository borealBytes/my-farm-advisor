import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { ReplyPayload } from "../auto-reply/types.js";
import {
  resolveHtmlDeliveryConfig,
  maybeBuildHtmlArtifact,
  type HtmlDeliveryResult,
} from "../delivery/wrighter-html.js";
import { resolvePreferredOpenClawTmpDir } from "../infra/tmp-openclaw-dir.js";
import { createSubsystemLogger } from "../logging/subsystem.js";

const log = createSubsystemLogger("telegram/wrighter-delivery");

const WRIGHTER_MARKER = "__wrighterDelivery";

type TelegramTextMessage = {
  kind: "text";
  order: number;
  html: string;
};

type TelegramMediaMessage = {
  kind: "photo" | "document";
  order: number;
  filePath: string;
  caption?: string;
  mimeType?: string;
};

type TelegramMessage = TelegramTextMessage | TelegramMediaMessage;

type TelegramDeliveryResult = {
  frontmatter: Record<string, unknown>;
  messages: TelegramMessage[];
  validation: {
    passed: boolean;
    issues: Array<{
      code?: string;
      severity: "error" | "warning";
      message: string;
      target?: string;
    }>;
  };
};

type BuildTelegramDeliveryFn = (
  input: { raw: string; sourcePath?: string },
  options?: { outputDir?: string; maxTextLength?: number; maxCaptionLength?: number },
) => Promise<TelegramDeliveryResult>;

type CleanupFn = () => Promise<void>;

export type WrighterTelegramTransformResult = {
  payloads: ReplyPayload[];
  cleanup: CleanupFn[];
};

let cachedBuilderPromise: Promise<BuildTelegramDeliveryFn> | null = null;

async function loadBuildTelegramDelivery(): Promise<BuildTelegramDeliveryFn> {
  if (!cachedBuilderPromise) {
    const moduleUrl = new URL(
      "../../skills/superior-byte-works-wrighter/delivery/telegram/dist/index.js",
      import.meta.url,
    );
    cachedBuilderPromise = import(moduleUrl.href).then((mod) => {
      const builder = (mod as { buildTelegramDelivery?: BuildTelegramDeliveryFn })
        .buildTelegramDelivery;
      if (typeof builder !== "function") {
        throw new Error("Wrighter Telegram delivery module export missing buildTelegramDelivery");
      }
      return builder;
    });
  }
  return cachedBuilderPromise;
}

export async function maybeTransformWrighterTelegramPayloads(
  payloads: readonly ReplyPayload[],
): Promise<WrighterTelegramTransformResult> {
  const cleanup: CleanupFn[] = [];
  const transformed: ReplyPayload[] = [];

  let builder: BuildTelegramDeliveryFn | null = null;

  for (const payload of payloads) {
    if (!shouldTransformPayload(payload)) {
      transformed.push(payload);
      continue;
    }

    try {
      builder = builder ?? (await loadBuildTelegramDelivery());
      const runDir = await createRunDirectory();
      try {
        const result = await builder({ raw: payload.text ?? "" }, { outputDir: runDir });
        if (!result.validation.passed) {
          log.warn("wrighter telegram delivery validation reported issues", {
            issues: result.validation.issues,
          });
        }
        if (result.messages.length === 0) {
          await removeDirSafe(runDir);
          transformed.push(payload);
          continue;
        }
        transformed.push(...convertMessagesToPayloads(payload, result.messages));
        await maybeAddHtmlAttachment(
          payload,
          result.frontmatter,
          payload.text ?? "",
          transformed,
          cleanup,
        );
        cleanup.push(() => removeDirSafe(runDir));
      } catch (err) {
        await removeDirSafe(runDir);
        throw err;
      }
    } catch (err) {
      log.warn("wrighter telegram delivery transform failed", {
        err,
      });
      transformed.push(payload);
    }
  }

  return { payloads: transformed, cleanup };
}

function shouldTransformPayload(payload: ReplyPayload): boolean {
  if (!payload?.text || !payload.text.trim()) {
    return false;
  }
  const telegramData = payload.channelData?.telegram as Record<string, unknown> | undefined;
  if (telegramData && telegramData[WRIGHTER_MARKER]) {
    return false;
  }
  if (payload.mediaUrl || (payload.mediaUrls?.length ?? 0) > 0) {
    return false;
  }
  const trimmed = payload.text.trimStart();
  if (!trimmed.startsWith("---")) {
    return false;
  }
  return true;
}

async function createRunDirectory(): Promise<string> {
  const baseDir = path.join(resolvePreferredOpenClawTmpDir(), "wrighter-telegram");
  await fs.mkdir(baseDir, { recursive: true, mode: 0o700 });
  const prefix = path.join(baseDir, `${randomUUID()}-`);
  return await fs.mkdtemp(prefix);
}

function convertMessagesToPayloads(
  original: ReplyPayload,
  messages: TelegramMessage[],
): ReplyPayload[] {
  const results: ReplyPayload[] = [];
  for (const message of messages) {
    const base: ReplyPayload = {
      ...original,
      text: "",
      mediaUrl: undefined,
      mediaUrls: undefined,
      channelData: markTelegramChannelData(original.channelData),
    };
    if (message.kind === "text") {
      base.text = message.html;
    } else {
      const mediaMessage = message;
      const mediaUrl = pathToFileURL(mediaMessage.filePath).href;
      base.text = mediaMessage.caption ?? "";
      base.mediaUrl = mediaUrl;
      base.mediaUrls = [mediaUrl];
      const telegramData = base.channelData?.telegram as Record<string, unknown>;
      const fileName = path.basename(mediaMessage.filePath);
      const mimeType = inferMimeType(mediaMessage);
      telegramData.mimeType = telegramData.mimeType ?? mimeType;
      telegramData.contentType = telegramData.contentType ?? mimeType;
      telegramData.fileName = telegramData.fileName ?? fileName;
      if ("role" in mediaMessage && mediaMessage.role) {
        telegramData.assetRole = telegramData.assetRole ?? mediaMessage.role;
      }
    }
    results.push(base);
  }
  return results;
}

async function maybeAddHtmlAttachment(
  original: ReplyPayload,
  frontmatter: Record<string, unknown>,
  rawMarkdown: string,
  payloads: ReplyPayload[],
  cleanup: CleanupFn[],
): Promise<void> {
  try {
    const config = resolveHtmlDeliveryConfig(frontmatter);
    const artifact = await maybeBuildHtmlArtifact({ raw: rawMarkdown, frontmatter }, config);
    if (!artifact) {
      return;
    }
    const payload = createHtmlDocumentPayload(original, artifact);
    payloads.push(payload);
    cleanup.push(artifact.cleanup);
  } catch (err) {
    log.warn("wrighter telegram html attachment generation failed", { err });
  }
}

function createHtmlDocumentPayload(
  original: ReplyPayload,
  artifact: HtmlDeliveryResult,
): ReplyPayload {
  const base: ReplyPayload = {
    ...original,
    text: artifact.summary,
    mediaUrl: pathToFileURL(artifact.htmlPath).href,
    mediaUrls: [pathToFileURL(artifact.htmlPath).href],
    channelData: markTelegramChannelData(original.channelData),
  };
  const telegramData = base.channelData?.telegram as Record<string, unknown>;
  telegramData.mimeType = "text/html";
  telegramData.contentType = "text/html";
  telegramData.fileName = artifact.fileName;
  telegramData.deliveryMode = artifact.mode;
  if (artifact.fingerprintId) {
    telegramData.fingerprintId = artifact.fingerprintId;
  }
  if (artifact.principals) {
    telegramData.principals = artifact.principals;
  }
  return base;
}

function markTelegramChannelData(
  channelData: ReplyPayload["channelData"],
): ReplyPayload["channelData"] {
  const merged = channelData ? { ...channelData } : {};
  const existingTelegram =
    channelData?.telegram && typeof channelData.telegram === "object"
      ? { ...(channelData.telegram as Record<string, unknown>) }
      : {};
  existingTelegram[WRIGHTER_MARKER] = true;
  merged.telegram = existingTelegram;
  return merged;
}

async function removeDirSafe(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch (err) {
    log.debug?.("failed to remove wrighter telegram temp dir", { dir, err });
  }
}

function inferMimeType(message: TelegramMediaMessage): string {
  if ("mimeType" in message && message.mimeType) {
    return message.mimeType;
  }
  const ext = path.extname(message.filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".html":
    case ".htm":
      return "text/html";
    case ".pdf":
      return "application/pdf";
    default:
      return message.kind === "photo" ? "image/png" : "application/octet-stream";
  }
}
