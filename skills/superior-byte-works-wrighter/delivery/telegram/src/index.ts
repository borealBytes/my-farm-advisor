import { promises as fs } from "fs";
import path from "path";
import type { BlockContent, Code, Table } from "mdast";
import { nanoid } from "nanoid";
import { parseWrighterDocument } from "./parser.js";
import { renderMathExpression } from "./renderers/math.js";
import { renderMermaidDiagram } from "./renderers/mermaid.js";
import { renderTable } from "./renderers/table.js";
import {
  renderParagraph,
  renderHeading,
  renderList,
  renderBlockquote,
  renderCodeBlock,
} from "./renderers/text.js";
import { ensureHtmlWithinLimit } from "./splitter.js";
import type {
  DeliveryOptions,
  MediaAsset,
  RendererOverrides,
  TelegramDeliveryResult,
  TelegramMessage,
  TextRenderContext,
  WrighterDeliveryInput,
} from "./types.js";
import { chunkPlainText, escapeHtml, plainTextLength, slugify } from "./utils/html.js";
import { validateMessages } from "./validators.js";

type MdastMathNode = {
  type: "math";
  value?: string;
};

const DEFAULT_TEXT_LIMIT = 3500;
const DEFAULT_CAPTION_LIMIT = 900;

export async function buildTelegramDelivery(
  input: WrighterDeliveryInput,
  options: DeliveryOptions = {},
): Promise<TelegramDeliveryResult> {
  const parsed = parseWrighterDocument(input);
  const baseDir = path.resolve(
    options.outputDir ?? path.join(process.cwd(), "out", "telegram-delivery"),
  );
  const mediaDir = path.join(baseDir, "media");
  await fs.mkdir(mediaDir, { recursive: true });

  const slugSource =
    (parsed.frontmatter.title as string | undefined) ??
    (parsed.frontmatter.name as string | undefined) ??
    (parsed.frontmatter.slug as string | undefined) ??
    (input.sourcePath
      ? path.basename(input.sourcePath, path.extname(input.sourcePath))
      : undefined) ??
    nanoid(6);
  const baseFileName = slugify(slugSource);

  const textLimit = options.maxTextLength ?? DEFAULT_TEXT_LIMIT;
  const captionLimit = options.maxCaptionLength ?? DEFAULT_CAPTION_LIMIT;

  const renderers: RendererOverrides = {
    renderMermaid:
      options.renderers?.renderMermaid ?? ((code, context) => renderMermaidDiagram(code, context)),
    renderMath:
      options.renderers?.renderMath ??
      ((expression, context) => renderMathExpression(expression, context)),
  };

  const messages: TelegramMessage[] = [];
  const assets: MediaAsset[] = [];
  const textContext: TextRenderContext = {
    allowLinkPreview: options.linkPreview,
  };

  let textBuffer = "";
  let assetIndex = 1;

  const flushTextBuffer = () => {
    const trimmed = textBuffer.trim();
    if (!trimmed) {
      textBuffer = "";
      return;
    }
    messages.push({
      kind: "text",
      order: messages.length,
      html: trimmed,
      plainTextLength: plainTextLength(trimmed),
    });
    textBuffer = "";
  };

  const appendChunk = (chunk: string) => {
    const trimmed = chunk.trim();
    if (!trimmed) {
      return;
    }
    if (!textBuffer) {
      textBuffer = trimmed;
      return;
    }
    const candidate = `${textBuffer}\n\n${trimmed}`;
    if (plainTextLength(candidate) <= textLimit) {
      textBuffer = candidate;
      return;
    }
    flushTextBuffer();
    textBuffer = trimmed;
  };

  const pushText = (html: string) => {
    const segments = ensureHtmlWithinLimit(html, textLimit);
    segments.forEach((segment) => appendChunk(segment));
  };

  const handleCaptionOverflow = (caption?: string) => {
    if (!caption) {
      return {
        caption: undefined as string | undefined,
        overflow: undefined as string | undefined,
      };
    }
    const trimmed = caption.trim();
    if (!trimmed) {
      return { caption: undefined, overflow: undefined };
    }
    if (trimmed.length <= captionLimit) {
      return { caption: escapeHtml(trimmed), overflow: undefined };
    }
    const parts = chunkPlainText(trimmed, captionLimit);
    const [first, ...rest] = parts;
    const overflowHtml = rest.map((part) => escapeHtml(part)).join("\n\n");
    return {
      caption: escapeHtml(first),
      overflow: overflowHtml || undefined,
    };
  };

  for (const node of parsed.tree.children) {
    switch (node.type) {
      case "paragraph":
        pushText(renderParagraph(node, textContext));
        break;
      case "heading":
        pushText(renderHeading(node, textContext));
        break;
      case "list":
        pushText(renderList(node, textContext));
        break;
      case "blockquote":
        pushText(renderBlockquote(node, textContext));
        break;
      case "thematicBreak":
        pushText("────────");
        break;
      case "code": {
        const codeNode = node as Code;
        if (codeNode.lang && codeNode.lang.toLowerCase().startsWith("mermaid")) {
          flushTextBuffer();
          const asset = await renderers.renderMermaid(codeNode.value ?? "", {
            outputDir: mediaDir,
            baseFileName,
            assetIndex,
          });
          assetIndex += 1;
          assets.push(asset);
          const captionSource = extractMermaidCaption(codeNode.value ?? "");
          const processed = handleCaptionOverflow(captionSource);
          if (processed.overflow) {
            pushText(processed.overflow);
            flushTextBuffer();
          }
          messages.push({
            kind: "photo",
            order: messages.length,
            filePath: asset.filePath,
            caption: processed.caption,
            captionLength: processed.caption ? plainTextLength(processed.caption) : undefined,
            sizeBytes: asset.sizeBytes,
            role: "mermaid",
          });
        } else {
          pushText(renderCodeBlock(codeNode));
        }
        break;
      }
      case "math": {
        const mathNode = node as MdastMathNode;
        flushTextBuffer();
        const asset = await renderers.renderMath(mathNode.value ?? "", {
          outputDir: mediaDir,
          baseFileName,
          assetIndex,
        });
        assetIndex += 1;
        assets.push(asset);
        const processed = handleCaptionOverflow(asset.caption ?? mathNode.value);
        if (processed.overflow) {
          pushText(processed.overflow);
          flushTextBuffer();
        }
        messages.push({
          kind: "photo",
          order: messages.length,
          filePath: asset.filePath,
          caption: processed.caption,
          captionLength: processed.caption ? plainTextLength(processed.caption) : undefined,
          sizeBytes: asset.sizeBytes,
          role: "math",
        });
        break;
      }
      case "table": {
        const tableNode = node as Table;
        const tableHtml = renderTable(tableNode, textContext);
        pushText(tableHtml);
        break;
      }
      default: {
        const fallback = renderGenericBlock(node as BlockContent, textContext);
        if (fallback) {
          pushText(fallback);
        }
      }
    }
  }

  flushTextBuffer();

  const validation = await validateMessages(messages, {
    maxTextLength: textLimit,
    maxCaptionLength: captionLimit,
  });

  const stats = {
    totalMessages: messages.length,
    textMessages: messages.filter((msg) => msg.kind === "text").length,
    mediaMessages: messages.filter((msg) => msg.kind !== "text").length,
    attachments: assets.length,
    totalBytes: assets.reduce((acc, asset) => acc + (asset.sizeBytes ?? 0), 0),
  };

  return {
    frontmatter: parsed.frontmatter,
    messages,
    assets,
    validation,
    stats,
  };
}

function renderGenericBlock(node: BlockContent, context: TextRenderContext): string {
  switch (node.type) {
    case "paragraph":
      return renderParagraph(node, context);
    case "heading":
      return renderHeading(node, context);
    case "list":
      return renderList(node, context);
    case "blockquote":
      return renderBlockquote(node, context);
    case "thematicBreak":
      return "────────";
    case "code":
      return renderCodeBlock(node);
    default:
      return "";
  }
}

function extractMermaidCaption(code: string): string | undefined {
  const lines = code.split(/\r?\n/);
  let title: string | undefined;
  let description: string | undefined;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.toLowerCase().startsWith("acctitle:")) {
      title = line.slice("acctitle:".length).trim();
    } else if (line.toLowerCase().startsWith("accdescr:")) {
      description = line.slice("accdescr:".length).trim();
    }
    if (title && description) {
      break;
    }
  }

  if (title && description) {
    return `${title} — ${description}`;
  }
  if (title) {
    return title;
  }
  if (description) {
    return description;
  }
  return undefined;
}

export type { TelegramDeliveryResult, TelegramMessage } from "./types.js";
