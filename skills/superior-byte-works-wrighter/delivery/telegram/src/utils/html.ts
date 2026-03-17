const HTML_ESCAPE_REGEX = /[&<>"]/g;
const HTML_UNESCAPE_MAP: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

export function escapeHtml(value: string): string {
  return value.replace(HTML_ESCAPE_REGEX, (char) => HTML_ESCAPE_MAP[char] ?? char);
}

export function escapeAttribute(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

export function stripTelegramHtml(html: string): string {
  if (!html) {
    return "";
  }

  let text = html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|blockquote|pre)>/gi, "\n")
    .replace(/<pre><code[^>]*>/gi, "")
    .replace(/<\/code><\/pre>/gi, "")
    .replace(/<[^>]+>/g, "");

  text = text.replace(/&[#a-zA-Z0-9]+;/g, (entity) => HTML_UNESCAPE_MAP[entity] ?? entity);
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

export function plainTextLength(html: string): number {
  return stripTelegramHtml(html).length;
}

export function chunkPlainText(text: string, maxLength: number): string[] {
  if (text.length <= maxLength) {
    return [text.trim()];
  }

  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let buffer = "";

  const pushBuffer = () => {
    const trimmed = buffer.trim();
    if (trimmed) {
      chunks.push(trimmed);
    }
    buffer = "";
  };

  for (const paragraph of paragraphs) {
    const candidate = buffer ? `${buffer}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxLength) {
      buffer = candidate;
      continue;
    }

    pushBuffer();
    if (paragraph.length <= maxLength) {
      buffer = paragraph;
      continue;
    }

    const sentences = paragraph.split(/(?<=[.!?])\s+/);
    let sentenceBuffer = "";

    const pushSentenceBuffer = () => {
      const trimmed = sentenceBuffer.trim();
      if (trimmed) {
        chunks.push(trimmed);
      }
      sentenceBuffer = "";
    };

    for (const sentence of sentences) {
      const candidateSentence = sentenceBuffer ? `${sentenceBuffer} ${sentence}` : sentence;
      if (candidateSentence.length <= maxLength) {
        sentenceBuffer = candidateSentence;
        continue;
      }

      pushSentenceBuffer();
      if (sentence.length <= maxLength) {
        sentenceBuffer = sentence;
        continue;
      }

      let remaining = sentence;
      while (remaining.length > maxLength) {
        chunks.push(remaining.slice(0, maxLength));
        remaining = remaining.slice(maxLength);
      }
      sentenceBuffer = remaining;
    }

    pushSentenceBuffer();
  }

  pushBuffer();
  return chunks;
}

export function decodeEntities(value: string): string {
  return value.replace(/&[#a-zA-Z0-9]+;/g, (entity) => HTML_UNESCAPE_MAP[entity] ?? entity);
}

export function slugify(value: string, fallback = "telegram-asset"): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
  return slug || fallback;
}

export function hasAllowedProtocol(url: string): boolean {
  const lower = url.trim().toLowerCase();
  return (
    lower.startsWith("http://") ||
    lower.startsWith("https://") ||
    lower.startsWith("mailto:") ||
    lower.startsWith("tg://") ||
    lower.startsWith("tel:")
  );
}
