# Link Checker Tool

This directory contains a `lychee`-based link checker for `wrighter` markdown content.

## Files

- `SKILL.md`: skill-level contract and workflow integration.
- `link-checker.sh`: script wrapper for scanning, reporting, and manual overrides.
- `config.toml`: shared lychee configuration.

## Requirements

- `lychee` installed (`cargo install lychee`)
- `python3` installed

## Quick Start

Run from repository root:

```bash
bash skills/_core/wrighter/craft/link-checker/link-checker.sh
```

Outputs:

- `link-check-report.md`
- `link-check-report.json`

## Common Commands

Check a specific directory:

```bash
bash skills/_core/wrighter/craft/link-checker/link-checker.sh --target skills/_core/wrighter
```

Run non-interactive (CI-safe):

```bash
bash skills/_core/wrighter/craft/link-checker/link-checker.sh --non-interactive
```

Custom memory file:

```bash
bash skills/_core/wrighter/craft/link-checker/link-checker.sh --memory .sisyphus/memory/link-overrides.json
```

## Override Memory

The script stores manual confirmations in `.sisyphus/memory/link-overrides.json`.

Format:

```json
{
  "link-overrides": {
    "https://example.com/page": {
      "status": "manually_verified",
      "verified_by": "user",
      "date": "2026-02-28",
      "notes": "Site blocks bots but works in browser"
    }
  }
}
```

## User Interaction

When a link returns `403` or `429`, the script prompts:

```text
Link https://example.com returned 403/429. Site may block bots.
Please verify in browser: Does this link work? [y/n]
```

- `y`: link is saved as `manually_verified`.
- `n`: link is treated as broken and remains in the report.

## Three-Phase Workflow

1. Phase 1: write markdown.
2. Phase 2: run this link checker.
3. Phase 3: fix broken links or manually verify bot-blocked links, then rerun.
