# Wrighter Offline HTML (Open Mode)

Turns Wrighter Phase‑1 markdown into a self-contained offline HTML document. The
builder renders Markdown (GFM + math), inlines Mermaid diagrams as SVG, and
embeds light CSS so the output works entirely offline.

## Install

```bash
cd skills/superior-byte-works-wrighter/delivery/offline-html-open
chmod +x scripts/install.sh
./scripts/install.sh
```

This uses the shared Wrighter delivery environment under
`skills/superior-byte-works-wrighter/delivery/` (shared `.venv`, shared
Puppeteer cache, shared Chromium setup), installs pnpm dependencies, and emits
compiled ESM into `dist/`.

## Usage

```ts
import { buildOfflineHtmlOpen } from "./dist/index.js";

const result = await buildOfflineHtmlOpen({ raw: wrighterMarkdown });

console.log(result.htmlPath); // absolute path to HTML
console.log(result.fileName); // suggested file name
console.log(result.summary); // short text summary
```

The caller is responsible for copying or streaming the generated HTML to an
outbound channel. In OpenClaw we call this builder inside the outbound delivery
hook (before channel normalization) so any Wrighter payload that requests
`offline-html-open` delivery automatically emits the artifact. Other agentic
frameworks should mirror that pattern—run the builder immediately before the
channel adapter so previews and attachments stay in sync.
