# Local Instructions

## Purpose

This folder owns composable, idempotent field-level and farm-level reporting from farm boundaries, headlands, soils, weather, crop history, and remote sensing inputs.

## Safe edit scope

Edits should stay in this folder and its children unless the user explicitly asks for a broader skill change. Do not change parent `SKILL.md`, sibling workflows, or root policy from a subskill task unless explicitly requested.

## Read nearby docs first

Read `../INDEX.md` first, then `../../README.md` and `../../SKILL.md` for routing context. Reporting scripts live under `../../data-pipeline/src/scripts/reporting/`.

## Local workflow notes

- Use this workflow for field posters, farm overview reports, idempotent refreshes, and composable reporting.
- Keep business logic in modules, not one-off scripts.
- Preserve the public API names `FieldReportingConfig`, `StepManifest`, `build_step_manifest(...)`, `step_is_stale(...)`, `build_field_context(...)`, and `build_farm_summary(...)` when editing reporting code.
- Canonical reporting datasets belong under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/growers/<grower>/farms/<farm>/derived/` and `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/`; report outputs belong under farm-level `derived/reports/`.
- Self-contained HTML should embed report data so it can open without a backing server.

## Local validation

When runtime scripts are available, run the narrow reporting command from `../../data-pipeline/src/scripts/reporting/` against a small demo farm. Otherwise run `./scripts/validate.sh` from the repository root after structural changes.

## Local-delta-only reminder

This nested AGENTS.md only records instructions that differ from the parent or root files. Do not duplicate root-wide asset, vendor, or validation policy here except this pointer to `../../../AGENTS.md`.
