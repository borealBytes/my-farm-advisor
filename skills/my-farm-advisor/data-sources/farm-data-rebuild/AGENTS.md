# Local Instructions

## Purpose

This folder owns deterministic rebuild guidance for `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/` from a field-boundary GeoJSON input into the canonical grower, farm, field, and shared data tree.

## Safe edit scope

Edits should stay in this folder and its children unless the user explicitly asks for a broader skill change. Do not change parent `SKILL.md`, sibling workflows, or root policy from a subskill task unless explicitly requested.

## Read nearby docs first

Read `README.md` first, then `../INDEX.md` and `../../SKILL.md` for routing context. The rebuild entrypoint is the installed runtime script `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/src/scripts/run_farm_pipeline.py`.

## Local workflow notes

- Required input: `--boundaries` pointing to field-boundary GeoJSON, usually under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/input/` or a canonical farm boundary path.
- Optional farm inputs: `--grower-slug`, `--farm-slug`, `--farm-name`, `--inventory-csv`, `--weather-csv`, and `--force`.
- If the user asks to initialize the data-pipeline and seed X fields for a grower in a specified state, prefer `my-farm-advisor/data-pipeline/scripts/install.sh --prepare-shared-data --seed-grower-slug <slug> --seed-state <state> --seed-field-count <n>`.
- Farm weather defaults are `--weather-backend zarr`, `--weather-start-year 2021`, `--weather-end-year 2025`, and `--weather-time-standard lst`. Use `--weather-backend api` only for small legacy NASA POWER REST API debug pulls.
- Use `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/src/scripts/ingest/bootstrap_farm_from_county.py` before rebuilds when a county bootstrap should create or append field boundaries and inventory mappings.
- The rebuild coordinates `field-boundaries`, `ssurgo-soil`, `nasa-power-weather`, `cdl-cropland`, `farm-intelligence-reporting`, and `ssurgo-poster-cards`.

## Local validation

When runtime scripts are available, run the documented rebuild command or `scripts/run_farm_pipeline.py --structure-test` against a temp runtime root. Otherwise run `./scripts/validate.sh` from the repository root after structural changes.

## Local-delta-only reminder

This nested AGENTS.md only records instructions that differ from the parent or root files. Do not duplicate root-wide asset, vendor, or validation policy here except this pointer to `../../../AGENTS.md`.
