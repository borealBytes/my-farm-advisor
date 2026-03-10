# R2 Seed Pipeline

**Domain:** Infrastructure / Persistent Storage Bootstrap  
**License:** Apache-2.0  
**Attribution:** Superior Byte Works LLC / borealBytes  
**Skill Type:** Storage Scaffold / One-Time Seed

---

## Overview

This skill seeds the Cloudflare R2 (S3-compatible) persistent storage layer for the
`my-farm-advisor` pipeline. It is the **starting point** for the project skeleton that
persists across all reboots, redeployments, or fresh worker instantiations.

The `src/` directory in this skill is the canonical scaffold — a curated, minimal,
representative dataset that boots the first version of a pipeline. Think of it as the
"factory defaults" for your data layer.

**The cardinal rule of this skill:**

> **Your data in `data/moltbot/` is yours. This skill will NEVER overwrite it without
> explicit, multi-step confirmation. Upgraded and evolved data always wins over seed
> data.**

---

## Architecture: Seed vs. Live Data

```
skills/…/r2-seed-pipeline/
└── src/                        ← SEED (this repo, read-only source of truth)
    ├── fields/
    ├── soil/
    ├── weather/
    └── config/

R2 Bucket (Cloudflare) or S3
└── data/moltbot/               ← LIVE (your data, never overwritten by seed)
    ├── fields/
    ├── soil/
    ├── weather/
    └── config/
```

Seeding copies `src/` → `data/moltbot/` **only for keys that do not yet exist**.
It is append-only and presence-checked by default. Your evolved data is always
treated as authoritative.

---

## Safety Model: Triple-Gate Overwrite Protection

Overwriting any existing key in `data/moltbot/` requires **all three gates** to pass:

| Gate | Mechanism | What it checks |
|------|-----------|----------------|
| **1 — Flag** | `--overwrite` CLI flag must be explicitly passed | Prevents accidental invocations |
| **2 — Existence Check** | Script lists destination keys and confirms overlap | Shows you exactly what would be clobbered |
| **3 — Interactive Confirmation** | Prompts `yes/[no]` with a list of affected paths | Requires a human to type `yes` — no defaulting |

If any gate fails, the script exits with a non-zero code and writes nothing.

---

## Commands

### Standard Seed (safe, additive only)

```bash
# Seed all missing keys from src/ into data/moltbot/ — will never touch existing keys
npx wrangler r2 object put --pipe \
  | node scripts/seed-r2.mjs \
      --src ./skills/my-farm-advisor/data-sources/r2-seed-pipeline/src \
      --dest data/moltbot \
      --bucket MY_FARM_R2
```

Or with the convenience script from repo root:

```bash
npm run seed:r2
```

This is safe to run at any time. Existing keys are detected and skipped. A summary
of skipped vs. seeded keys is printed at the end.

---

### Dry-Run (preview only, no writes)

```bash
npm run seed:r2 -- --dry-run
```

Prints a full diff of what would be seeded vs. skipped without touching R2.

---

### Overwrite Specific Keys (DANGEROUS — triple-gated)

```bash
npm run seed:r2 -- --overwrite --keys "fields/baraga-north.geojson,config/defaults.json"
```

**What happens:**

1. The `--overwrite` flag is detected — gate 1 passes.
2. The script fetches the destination key list and shows you exactly:
   ```
   ⚠  OVERWRITE REQUESTED for 2 key(s):
      → data/moltbot/fields/baraga-north.geojson  [EXISTS — will be overwritten]
      → data/moltbot/config/defaults.json          [EXISTS — will be overwritten]
   ```
3. Interactive prompt:
   ```
   Type 'yes' to confirm overwrite, anything else to abort: _
   ```
4. Only if `yes` is typed verbatim does writing proceed.

**There is no `--force` flag. There is no `--yes` or `-y` shorthand. The prompt
cannot be bypassed from the command line.**

---

### Full Reset (nuclear option — replaces ALL moltbot data with seed)

```bash
npm run seed:r2 -- --overwrite --all
```

This triggers the same triple-gate flow but shows every key in `data/moltbot/`
as a candidate for overwrite. Use only when you intentionally want to restore to
factory defaults — e.g., after a corrupted deployment or when starting a new
instance from scratch.

---

## Seed Dataset Contents (`src/`)

The seed data is intentionally small, representative, and structured to mirror the
live pipeline schema. It is **not** a test fixture — it is real, usable starting
data that a pipeline can immediately operate on.

```
src/
├── config/
│   ├── defaults.json           # Pipeline defaults (model params, thresholds)
│   └── field-registry.json     # Minimal field registry (1–3 real field stubs)
├── fields/
│   └── sample-field.geojson    # A single representative field boundary
├── soil/
│   └── ssurgo-stub.json        # One SSURGO map unit for pipeline boot
└── weather/
    └── nasa-power-stub.csv     # 30-day weather window for a single location
```

The seed is intentionally scoped to **one farm, one field, one season window** —
enough for the pipeline to boot, run a full inference cycle, and validate outputs
end-to-end.

---

## Sharing Improvements Back Upstream

This skill is part of a collaborative open-source ecosystem. If you evolve your seed
data in a way that would benefit others — cleaner schemas, better stub quality,
additional representative field types — please share it back.

**Workflow:**

1. Make your changes in `data/moltbot/` (your live data layer).
2. When a change is battle-tested and generalizable, copy it back to `src/` in this
   skill.
3. Open a PR to the source project:

```bash
# From repo root, on a feature branch
git checkout -b feat/seed-improvement-<short-description>

# Copy your evolved seed file(s) into the skill src
cp data/moltbot/config/defaults.json \
   skills/my-farm-advisor/data-sources/r2-seed-pipeline/src/config/defaults.json

git add skills/my-farm-advisor/data-sources/r2-seed-pipeline/src/
git commit -m "feat(seed): improve defaults.json with battle-tested pipeline params"
git push origin feat/seed-improvement-<short-description>

# Then open a PR on GitHub
gh pr create \
  --title "feat(seed): improve defaults.json with battle-tested pipeline params" \
  --body "Sharing evolved seed data from production moltbot run. Schema unchanged, values tuned for Upper Michigan small-farm context."
```

The upstream project maintainers will review, generalize if needed, and merge so
that other forks benefit from your operational learnings.

---

## Environment Variables

The seed script reads from `.dev.vars` (local) or Cloudflare secrets (production):

```bash
R2_BUCKET_NAME=my-farm-r2
R2_ACCOUNT_ID=<cloudflare-account-id>
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
SEED_DEST_PREFIX=data/moltbot        # default, override if your layout differs
```

See `.dev.vars.example` at the repo root for a full template.

---

## Implementation Notes for `scripts/seed-r2.mjs`

The seed script must implement:

- `listKeys(bucket, prefix)` — fetch all existing keys under `data/moltbot/`
- `fileExists(key)` — check before every individual write
- `writeKey(bucket, key, body)` — only called after all gate checks pass
- `--dry-run` mode that calls `listKeys` and prints diff without `writeKey`
- Exit codes: `0` = success or dry-run, `1` = user aborted, `2` = env error

The script must **never** accept `--yes`, `-y`, `--force`, or any flag that
bypasses the interactive confirmation prompt.

---

## Related Skills

| Skill | Relationship |
|-------|-------------|
| [farm-data-rebuild](../farm-data-rebuild/) | Rebuilds live data from sources; uses this seed as fallback baseline |
| [farm-intelligence-reporting](../farm-intelligence-reporting/) | Reads from `data/moltbot/` — requires seed to be present first |

---

## License

Apache-2.0 — See [LICENSE](../../../../LICENSE) for full terms.
