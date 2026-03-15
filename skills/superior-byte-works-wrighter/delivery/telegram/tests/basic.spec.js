import { mkdtemp, rm, writeFile } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { buildTelegramDelivery } from "../src/index.js";
const SAMPLE_MARKDOWN = [
  "---",
  "title: Sample Delivery",
  "---",
  "",
  "# Unified Output Demo",
  "",
  "This paragraph explains the delivery pipeline for Telegram.",
  "",
  "```mermaid",
  "---",
  "accTitle: Pipeline Overview",
  "accDescr: Flow from wrighter output to Telegram delivery",
  "---",
  "flowchart TD",
  "    A[Wrighter Output] --> B[Delivery Pipeline]",
  "    B --> C[Telegram]",
  "```",
  "",
  "$$",
  "E = mc^2",
  "$$",
  "",
  "| Key | Value |",
  "| --- | ----- |",
  "| Alpha | 1 |",
  "| Beta | 2 |",
  "",
].join("\n");
const createStubRenderers = () => ({
  renderMermaid: async (_code, context) => {
    const filePath = path.join(
      context.outputDir,
      `${context.baseFileName}-${String(context.assetIndex).padStart(3, "0")}.png`,
    );
    await writeFile(filePath, Buffer.from("stub"));
    return {
      type: "photo",
      filePath,
      sizeBytes: 4,
      role: "mermaid",
    };
  },
  renderMath: async (_expression, context) => {
    const filePath = path.join(
      context.outputDir,
      `${context.baseFileName}-math-${String(context.assetIndex).padStart(3, "0")}.png`,
    );
    await writeFile(filePath, Buffer.from("math"));
    return {
      type: "photo",
      filePath,
      sizeBytes: 4,
      role: "math",
      caption: "E = mc^2",
    };
  },
});
describe("Telegram delivery pipeline", () => {
  let tempDir;
  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), "telegram-delivery-test-"));
  });
  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
  });
  it("converts wrighter markdown into Telegram-friendly payloads", async () => {
    const result = await buildTelegramDelivery(
      { raw: SAMPLE_MARKDOWN, sourcePath: "sample.md" },
      {
        outputDir: tempDir,
        renderers: createStubRenderers(),
      },
    );
    expect(result.messages.length).toBeGreaterThan(0);
    expect(result.messages.some((msg) => msg.kind === "text")).toBe(true);
    expect(result.messages.some((msg) => msg.kind === "photo" && msg.role === "mermaid")).toBe(
      true,
    );
    expect(result.messages.some((msg) => msg.kind === "photo" && msg.role === "math")).toBe(true);
    expect(result.validation.passed).toBe(true);
    expect(result.stats.attachments).toBeGreaterThan(0);
  });
});
