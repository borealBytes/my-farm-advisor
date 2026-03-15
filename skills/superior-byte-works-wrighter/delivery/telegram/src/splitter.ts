import { chunkPlainText, escapeHtml, plainTextLength, stripTelegramHtml } from "./utils/html.js";

export function ensureHtmlWithinLimit(html: string, maxLength: number): string[] {
  const trimmed = html.trim();
  if (!trimmed) {
    return [];
  }

  if (plainTextLength(trimmed) <= maxLength) {
    return [trimmed];
  }

  const plain = stripTelegramHtml(trimmed);
  const chunks = chunkPlainText(plain, maxLength);
  return chunks.map((chunk) => escapeHtml(chunk));
}
