#!/usr/bin/env node
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { buildTelegramDelivery } from "./index.js";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  const inputPath = path.resolve(args[0]);
  const outputFlagIndex = args.findIndex((arg) => arg === "--out" || arg === "-o");
  const outputDir =
    outputFlagIndex >= 0 && args[outputFlagIndex + 1]
      ? path.resolve(args[outputFlagIndex + 1])
      : path.resolve(process.cwd(), "out", "telegram-delivery-run");

  const raw = await readFile(inputPath, "utf8");

  const result = await buildTelegramDelivery({ raw, sourcePath: inputPath }, { outputDir });

  await mkdir(outputDir, { recursive: true });
  const summaryPath = path.join(outputDir, "delivery-summary.json");
  await writeFile(summaryPath, JSON.stringify(result, null, 2), "utf8");

  console.log(`✔ Telegram delivery prepared. Summary written to ${summaryPath}`);
  console.log(
    `   Messages: ${result.stats.totalMessages} (text: ${result.stats.textMessages}, media: ${result.stats.mediaMessages}), attachments: ${result.stats.attachments}`,
  );
}

function printHelp() {
  console.log(`Telegram delivery CLI\n\nUsage:\n  pnpm cli <input.md> [--out <directory>]\n`);
}

main().catch((error) => {
  console.error("✖ Telegram delivery failed:", error);
  process.exitCode = 1;
});
