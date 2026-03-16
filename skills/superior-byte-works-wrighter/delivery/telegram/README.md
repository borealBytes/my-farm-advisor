# Wrighter Telegram Delivery Pipeline

This subskill provides a deterministic pipeline that converts raw Wrighter
outputs (markdown + frontmatter) into Telegram-ready message payloads. It:

- Parses Wrighter documents with support for GFM tables and LaTeX/math blocks
- Converts rich text into Telegram-safe HTML, preserving headings, lists, and
  inline formatting
- Renders Mermaid diagrams and block math expressions to PNG attachments using
  lightweight toolchains (`@mermaid-js/mermaid-cli`, `mathjax-full`, `sharp`)
- Applies smart chunking to keep text messages and captions within Telegram
  limits (4,096 chars for text, 1,024 for captions) and validates file sizes
- Emits a structured JSON result describing sequential messages plus asset
  metadata so the outbound router can send them safely

## Project Layout

```
delivery/telegram/
├── package.json          # Local dependencies and scripts
├── tsconfig.json         # TypeScript config (ES2022 modules)
├── src/
│   ├── index.ts          # Main `buildTelegramDelivery` orchestrator
│   ├── parser.ts         # Wrighter frontmatter + markdown parsing utilities
│   ├── renderers/        # Text, table, mermaid, math renderers
│   ├── splitter.ts       # Helpers to enforce Telegram message limits
│   ├── utils/html.ts     # HTML escaping/stripping helpers
│   └── validators.ts     # Post-processing validation (lengths, file sizes)
├── tests/basic.spec.ts   # Vitest coverage using stubbed renderers
└── README.md             # This file
```

The code is published as ES modules; consumer code should use ESM `import`
syntax when calling into `src/index.ts`.

## Prerequisites

- Node.js 20.x or later (local development uses `pnpm`, but any compatible
  package manager works)
- System dependencies for sharp (libvips) and Mermaid CLI (Chromium via
  Puppeteer) may be required depending on your platform

## Install

The `scripts/install.sh` helper bootstraps a local Python virtual environment,
installs the Node dependencies, and downloads the Chromium bundle that Mermaid
CLI (Puppeteer) requires:

```bash
cd skills/superior-byte-works-wrighter/delivery/telegram
chmod +x scripts/install.sh         # first run only
./scripts/install.sh
```

This script will create:

- `.venv/` – Python virtual environment used for the helper tooling
- `node_modules/` – pnpm-managed dependencies for the delivery pipeline
- `.cache/puppeteer/` – Chromium binaries cached locally for Mermaid CLI
- `../puppeteer.config.json` – shared Puppeteer configuration that keeps Chromium sandboxed by default and only adds `--no-sandbox` when running as root

If you prefer to perform each step manually:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pnpm install
PUPPETEER_CACHE_DIR=.cache/puppeteer pnpm dlx puppeteer browsers install chrome
```

## Usage

```ts
import { buildTelegramDelivery } from "./src/index.js";

const wrighterOutput = await fs.readFile("/path/to/writer.md", "utf8");

const result = await buildTelegramDelivery(
  { raw: wrighterOutput, sourcePath: "writer.md" },
  {
    outputDir: "./out/delivery", // optional, defaults to ./out/telegram-delivery
    maxTextLength: 3500, // optional safety margin for 4,096 char limit
    maxCaptionLength: 900, // optional safety margin for 1,024 char limit
    linkPreview: false, // keep Telegram from creating link previews
  },
);

// result.messages → ordered array of {kind: 'text'|'photo'|'document', ...}
// result.assets   → generated media metadata (inline photos/documents)
// result.validation → pass/fail flag with warnings or errors
```

The pipeline never sends messages; it only produces a deterministic payload
structure so existing outbound routers can deliver it.

### Framework Integration Hook

For OpenClaw we inject the transformer in `deliverOutboundPayloadsCore`, before
channel normalization, so every Telegram `ReplyPayload` that carries raw
Wrighter Phase‑1 output is rewritten into validated messages and inline media.
If you port this skill to a different agentic framework, ensure you hook the
transformer at the same stage—immediately before channel-specific delivery—so
Wrighter documents automatically receive Telegram-friendly splitting and media
generation without extra per-agent plumbing.

### CLI helper

For manual inspection, a small CLI is included:

```bash
pnpm cli path/to/input.md --out ./out/run
```

This writes a JSON summary plus generated media assets into the target folder.

### Custom renderers

`buildTelegramDelivery` accepts `renderers` overrides so tests (or air-gapped
environments) can supply mock renderers for Mermaid and math:

```ts
await buildTelegramDelivery(
  { raw },
  {
    renderers: {
      renderMermaid: async (code, ctx) => {
        /* return custom asset */
      },
      renderMath: async (expr, ctx) => {
        /* return custom asset */
      },
    },
  },
);
```

## Testing

```bash
pnpm exec vitest run
```

Tests mock the heavy renderers so they stay fast and deterministic while still
covering chunking, validation, and message composition rules.
