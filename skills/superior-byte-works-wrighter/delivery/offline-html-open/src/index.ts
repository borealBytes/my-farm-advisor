// @ts-nocheck
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execa } from "execa";
import matter from "gray-matter";
import { nanoid } from "nanoid";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export interface BuildOfflineHtmlOptions {
  outputDir?: string;
  fileName?: string;
  mermaidCliPath?: string;
}

export interface OfflineHtmlResult {
  frontmatter: Record<string, unknown>;
  content: string;
  htmlPath: string;
  fileName: string;
  summary: string;
  deliveryId: string;
}

export async function buildOfflineHtmlOpen(
  input: { raw: string; sourcePath?: string },
  options: BuildOfflineHtmlOptions = {},
): Promise<OfflineHtmlResult> {
  const parsed = matter(input.raw ?? "");
  const frontmatter = parsed.data ?? {};
  const content = parsed.content ?? "";
  const baseOutputDir = options.outputDir
    ? path.resolve(options.outputDir)
    : path.join(process.cwd(), "out", "wrighter-offline-html-open");
  await fs.mkdir(baseOutputDir, { recursive: true, mode: 0o700 });

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "wrighter-html-open-"));
  try {
    const htmlBody = await renderMarkdownToHtml(content, {
      tempRoot,
      mermaidCliPath: options.mermaidCliPath,
    });
    const title = resolveTitle(frontmatter, input.sourcePath);
    const description = resolveDescription(frontmatter);
    const summary = buildSummary(htmlBody);
    const deliveryId = resolveDeliveryId(frontmatter);
    const htmlDocument = buildHtmlDocument({
      title,
      description,
      body: htmlBody,
      deliveryId,
      frontmatter,
    });

    const baseFileName = options.fileName ?? `${slugify(title)}.html`;
    const htmlPath = path.join(baseOutputDir, baseFileName);
    await fs.writeFile(htmlPath, htmlDocument, "utf8");

    return {
      frontmatter,
      content,
      htmlPath,
      fileName: baseFileName,
      summary,
      deliveryId,
    };
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true }).catch(() => {});
  }
}

async function renderMarkdownToHtml(
  markdown: string,
  context: { tempRoot: string; mermaidCliPath?: string },
): Promise<string> {
  const { markdown: workMarkdown, replacements } = await applyMermaidReplacements(
    markdown,
    context,
  );

  const processor: any = unified();
  // @ts-ignore unified plugin typing gaps
  processor.use(remarkParse);
  // @ts-ignore unified plugin typing gaps
  processor.use(remarkGfm);
  // @ts-ignore unified plugin typing gaps
  processor.use(remarkMath);
  // @ts-ignore unified plugin typing gaps
  processor.use(remarkRehype, { allowDangerousHtml: true });
  // @ts-ignore unified plugin typing gaps
  processor.use(rehypeRaw);
  // @ts-ignore unified plugin typing gaps
  processor.use(rehypeSlug);
  // @ts-ignore unified plugin typing gaps
  processor.use(rehypeAutolinkHeadings, {
    behavior: "append",
    properties: {
      className: ["anchor"],
    },
    content: {
      type: "text",
      value: "#",
    },
  });
  // @ts-ignore unified plugin typing gaps
  processor.use(rehypeKatex);
  // @ts-ignore unified plugin typing gaps
  processor.use(rehypeStringify, { allowDangerousHtml: true });

  // @ts-ignore unified plugin typing gaps
  const file = await processor.process(workMarkdown);
  let html = String(file);
  for (const replacement of replacements) {
    const tokenRegex = new RegExp(escapeRegex(replacement.token), "g");
    const paragraphRegex = new RegExp(`<p>${escapeRegex(replacement.token)}<\/p>`, "g");
    const codeRegex = new RegExp(
      `<pre><code>${escapeRegex(replacement.token)}<\/code><\/pre>`,
      "g",
    );
    html = html.replace(codeRegex, replacement.svg);
    html = html.replace(paragraphRegex, replacement.svg);
    html = html.replace(tokenRegex, replacement.svg);
  }
  return html;
}

async function renderMermaidToSvg(
  code: string,
  options: { tempRoot: string; mermaidCliPath?: string },
): Promise<string> {
  const cliPath = await resolveMermaidCli(options.mermaidCliPath);
  const workDir = await fs.mkdtemp(path.join(options.tempRoot, "mermaid-"));
  const inputPath = path.join(workDir, "diagram.mmd");
  const outputPath = path.join(workDir, "diagram.svg");
  const sharedPuppeteerConfigPath = path.resolve(
    process.cwd(),
    "skills/superior-byte-works-wrighter/delivery/puppeteer.config.json",
  );
  const sharedPuppeteerCacheDir = path.resolve(
    process.cwd(),
    "skills/superior-byte-works-wrighter/delivery/.cache/puppeteer",
  );
  try {
    await fs.writeFile(inputPath, code, "utf8");
    const args = [cliPath, "-i", inputPath, "-o", outputPath, "--quiet"];
    try {
      await fs.access(sharedPuppeteerConfigPath);
      args.push("-p", sharedPuppeteerConfigPath);
    } catch {}
    await execa(process.execPath, args, {
      env: {
        ...process.env,
        PUPPETEER_CACHE_DIR: sharedPuppeteerCacheDir,
      },
    });
    const svg = await fs.readFile(outputPath, "utf8");
    return svg.trim();
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

async function resolveMermaidCli(override?: string): Promise<string> {
  if (override) {
    return override;
  }
  if (typeof (import.meta as any).resolve === "function") {
    try {
      const resolved = (import.meta as any).resolve("@mermaid-js/mermaid-cli");
      const rootDir = path.dirname(fileUrlToPath(resolved));
      return path.resolve(rootDir, "cli.js");
    } catch {}
  }
  const { createRequire } = await import("module");
  const require = createRequire(import.meta.url);
  const entry = require.resolve("@mermaid-js/mermaid-cli");
  return path.resolve(path.dirname(entry), "cli.js");
}

function fileUrlToPath(url: string): string {
  if (!url.startsWith("file://")) {
    return url;
  }
  return fileURLToPath(url);
}

function resolveTitle(frontmatter: Record<string, unknown>, sourcePath?: string): string {
  const candidates = [
    frontmatter.title,
    frontmatter.name,
    frontmatter.heading,
    sourcePath ? path.basename(sourcePath, path.extname(sourcePath)) : null,
    "wrighter-delivery",
  ];
  return String(
    candidates.find((value) => typeof value === "string" && value.trim()) ?? "wrighter-delivery",
  );
}

function resolveDescription(frontmatter: Record<string, unknown>): string | undefined {
  const value = frontmatter.description ?? frontmatter.summary;
  if (typeof value !== "string") {
    return undefined;
  }
  return value.trim() || undefined;
}

function resolveDeliveryId(frontmatter: Record<string, unknown>): string {
  const raw = frontmatter.delivery_id ?? frontmatter.deliveryId;
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }
  return `open-${nanoid(12)}`;
}

function buildHtmlDocument(params: {
  title: string;
  description?: string;
  body: string;
  deliveryId: string;
  frontmatter: Record<string, unknown>;
}): string {
  const metaDescription = params.description
    ? `<meta name="description" content="${escapeAttribute(params.description)}">`
    : "";
  const generated = new Date().toISOString();
  const frontmatterJson = JSON.stringify(params.frontmatter ?? {}, null, 2);
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${metaDescription}
    <meta name="generator" content="wrighter-offline-html-open">
    <meta name="wrighter-delivery-id" content="${escapeAttribute(params.deliveryId)}">
    <title>${escapeHtml(params.title)}</title>
    <style>${BASE_CSS}</style>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-pIiYiK9t+zrYKCuuy3R0CFVZa6D+PfYZ7RUTpujISiFDUFxIr05oig3F+1wZ7wZp" crossorigin="anonymous">
    <script type="application/json" id="wrighter-frontmatter">${escapeHtml(frontmatterJson)}</script>
  </head>
  <body data-wrighter-delivery-id="${escapeAttribute(params.deliveryId)}">
    <header class="document-banner">
      <h1>${escapeHtml(params.title)}</h1>
      <p class="document-generated">Generated <time datetime="${escapeAttribute(generated)}">${escapeHtml(generated)}</time></p>
    </header>
    <main class="document-body">
      ${params.body}
    </main>
  </body>
</html>`;
}

function buildSummary(html: string): string {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.slice(0, 360);
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `delivery-${randomUUID()}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string): string {
  return escapeHtml(value);
}

const MERMAID_BLOCK_RE = /```mermaid(?:[^\n]*)?\n([\s\S]*?)```/gi;

async function applyMermaidReplacements(
  markdown: string,
  context: { tempRoot: string; mermaidCliPath?: string },
): Promise<{ markdown: string; replacements: Array<{ token: string; svg: string }> }> {
  const matches = Array.from(markdown.matchAll(MERMAID_BLOCK_RE));
  if (matches.length === 0) {
    return { markdown, replacements: [] };
  }
  let working = markdown;
  const replacements: Array<{ token: string; svg: string }> = [];
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    if (!match || !match[0]) {
      continue;
    }
    const fullBlock = match[0];
    const code = match[1] ?? "";
    const token = `WRIGHTER_MERMAID_${index}_${randomUUID()}`;
    const svg = await renderMermaidToSvg(code, context);
    replacements.push({ token, svg });
    working = working.replace(fullBlock, token);
  }
  return { markdown: working, replacements };
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const BASE_CSS = `:root {
  color-scheme: light dark;
  --page-background: #f9fafb;
  --page-foreground: #0f172a;
  --muted-foreground: #475569;
  --card-background: rgba(255, 255, 255, 0.9);
  --accent: #2563eb;
  font-family: "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
}

html, body {
  margin: 0;
  padding: 0;
  background: var(--page-background);
  color: var(--page-foreground);
}

.document-banner {
  padding: 3rem 4vw 2rem;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 116, 144, 0.08));
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.document-banner h1 {
  margin: 0 0 0.75rem 0;
  font-size: clamp(2rem, 4vw, 3rem);
  letter-spacing: -0.02em;
}

.document-generated {
  margin: 0;
  color: var(--muted-foreground);
  font-size: 0.9rem;
}

.document-body {
  padding: 2.5rem 4vw 4rem;
  max-width: 960px;
  margin: 0 auto;
  background: var(--card-background);
  border-radius: 1.25rem 1.25rem 0 0;
  box-shadow: 0 32px 60px rgba(15, 23, 42, 0.08);
}

.document-body h2,
.document-body h3,
.document-body h4 {
  margin-top: 2.5rem;
  position: relative;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.document-body p,
.document-body li {
  line-height: 1.7;
  font-size: 1rem;
}

pre {
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.9);
  color: #f8fafc;
  border-radius: 0.75rem;
  overflow-x: auto;
}

code {
  font-family: "JetBrains Mono", "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
}

th, td {
  padding: 0.85rem 1rem;
  text-align: left;
}

thead tr {
  background: rgba(37, 99, 235, 0.12);
}

tbody tr:nth-child(every) {
  background: rgba(15, 23, 42, 0.02);
}

img, svg {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 2rem auto;
}

blockquote {
  border-left: 4px solid var(--accent);
  padding: 0.1rem 1.25rem;
  color: var(--muted-foreground);
  font-style: italic;
  background: rgba(37, 99, 235, 0.06);
  border-radius: 0.5rem;
}

.anchor {
  color: var(--accent);
  margin-left: 0.4rem;
  text-decoration: none;
  opacity: 0;
  transition: opacity 0.15s ease;
}

h2:hover .anchor,
h3:hover .anchor,
h4:hover .anchor {
  opacity: 1;
}

@media (max-width: 768px) {
  .document-body {
    padding: 2rem 6vw 3rem;
  }

  table {
    display: block;
    overflow-x: auto;
  }
}`;
