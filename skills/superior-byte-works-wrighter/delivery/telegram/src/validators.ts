import { promises as fs } from "fs";
import type { TelegramMessage, ValidationIssue, ValidationReport } from "./types.js";
import { plainTextLength } from "./utils/html.js";

export interface ValidatorOptions {
  maxTextLength: number;
  maxCaptionLength: number;
  maxPhotoBytes?: number;
  maxDocumentBytes?: number;
}

const DEFAULT_PHOTO_LIMIT_BYTES = 10 * 1024 * 1024;
const DEFAULT_DOCUMENT_LIMIT_BYTES = 50 * 1024 * 1024;

export async function validateMessages(
  messages: TelegramMessage[],
  options: ValidatorOptions,
): Promise<ValidationReport> {
  const issues: ValidationIssue[] = [];
  const photoLimit = options.maxPhotoBytes ?? DEFAULT_PHOTO_LIMIT_BYTES;
  const docLimit = options.maxDocumentBytes ?? DEFAULT_DOCUMENT_LIMIT_BYTES;

  for (const message of messages) {
    if (message.kind === "text") {
      const length = plainTextLength(message.html);
      if (length > options.maxTextLength) {
        issues.push({
          code: "text.length.exceeded",
          severity: "error",
          message: `Text message exceeds Telegram limit (${length} > ${options.maxTextLength})`,
          target: `message-${message.order}`,
          value: length,
          limit: options.maxTextLength,
        });
      }
    } else if (message.kind === "photo" || message.kind === "document") {
      if (message.caption) {
        const captionLength = plainTextLength(message.caption);
        if (captionLength > options.maxCaptionLength) {
          issues.push({
            code: "caption.length.exceeded",
            severity: "warning",
            message: `Caption length exceeds Telegram limit (${captionLength} > ${options.maxCaptionLength})`,
            target: `message-${message.order}`,
            value: captionLength,
            limit: options.maxCaptionLength,
          });
        }
      }

      const path = message.filePath;
      try {
        const stats = await fs.stat(path);
        message.sizeBytes = stats.size;
        if (message.kind === "photo" && stats.size > photoLimit) {
          issues.push({
            code: "photo.size.exceeded",
            severity: "error",
            message: `Photo exceeds maximum size (${formatBytes(stats.size)} > ${formatBytes(photoLimit)})`,
            target: path,
            value: stats.size,
            limit: photoLimit,
          });
        }
        if (message.kind === "document" && stats.size > docLimit) {
          issues.push({
            code: "document.size.exceeded",
            severity: "error",
            message: `Document exceeds maximum size (${formatBytes(stats.size)} > ${formatBytes(docLimit)})`,
            target: path,
            value: stats.size,
            limit: docLimit,
          });
        }
      } catch (error) {
        issues.push({
          code: "file.missing",
          severity: "error",
          message: `Media file not found: ${path}`,
          target: path,
        });
      }
    }
  }

  return {
    passed: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

function formatBytes(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
