# Skill Instructions

## Skill purpose

This skill routes farm advisory work across data rebuilds, field operations, imagery, soil, weather, EDA, strategy, reporting, and admin map workflows.

## Safe edit scope

Edits should stay inside `my-farm-advisor/` unless the user explicitly asks for repo-wide work. Do not edit sibling skill trees for local farm fixes. Do not duplicate root-wide vendor, asset, or validation policy here, see `../AGENTS.md`.

## Start here

Always read `SKILL.md` first for routing, then `README.md` for the overview. Read `PROVENANCE.md` before import, source, or update work. Open `INDEX.md`, then the matching subtree index, guide, AGENTS file, README, or script docs.

## Local routing notes

- Use this skill for farm advisory routing, farm data rebuilds, field management, imagery, soil, weather, EDA, strategy, and admin map workflows.
- Route through `INDEX.md` into `admin/`, `data-sources/`, `eda/`, `field-management/`, `imagery/`, `soil/`, `strategy/`, or `weather/`.
- Treat `data-pipeline/` as the authoritative source for deterministic runtime paths, data-source defaults, generated-output destinations, shared datasets, and pipeline commands. Other subskill guides should reference those conventions instead of inventing alternate `data/` roots.
- Canonical generated outputs belong under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline`, with farm assets under `growers/<grower>/farms/<farm>/...` and shared assets under `shared/...`.
- For geoadmin work, preserve committed metadata and downloader scripts, but keep generated payloads out of Git per `../AGENTS.md`.

## Local validation

Prefer the root validator from the repo root: `./scripts/validate.sh`. When changing runnable examples or scripts, run the narrow local check or example command documented in the nearby README or guide when dependencies are available.

## Contribution default pointer

Branch work should create a new skill unless the user explicitly asks to add, extend, or modify an existing skill.
