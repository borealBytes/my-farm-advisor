# Wrighter Offline HTML (Sealed Mode)

Wraps the open-mode offline HTML output with fingerprinting, per-recipient
metadata, and optional passphrase gating. This pipeline expects the open-mode
builder (`offline-html-open`) to be built first and will reuse its output before
layering sealed semantics on top.

## Install

```bash
cd skills/superior-byte-works-wrighter/delivery/offline-html-sealed
chmod +x scripts/install.sh
./scripts/install.sh
```

The install script ensures the open-mode builder is compiled, installs local
dependencies, and emits ESM into `dist/`.

## Usage

```ts
import { buildOfflineHtmlSealed } from "./dist/index.js";

const result = await buildOfflineHtmlSealed({ raw: wrighterMarkdown });

console.log(result.htmlPath); // sealed HTML path
console.log(result.fingerprintId); // forensic fingerprint identifier
console.log(result.principals); // principal list declared in front matter
```

### Front Matter Fields

```yaml
delivery:
  mode: offline-html-sealed
  principals: ["clay"]
  fingerprint_id: fp-2026-03-15
  delivery_id: d-2026-03-15
  protection: local-unlock # none | local-unlock | principal-unlock
  passphrase: "shared-secret" # optional (only when protection != none)
  passphrase_hint: "Shared on Mar 15"
```

### Integration Hook

In OpenClaw we run this builder inside the outbound delivery hook right after
the Telegram preprocessing step. That means any Wrighter payload that declares
`delivery.mode: offline-html-sealed` automatically emits a downloadable HTML
artifact alongside the channel-specific preview. Other frameworks should wire
it at the same stage—immediately before channel adapters—so sealed artifacts are
available without duplicating channel logic.
