# Local Instructions

## Purpose

This folder owns crop strategy and maturity planning workflows that turn field, farm, county, weather, soil, and crop-history context into operator-ready agronomic guidance.

## Safe edit scope

Edits should stay in `my-farm-advisor/strategy/` unless the user explicitly asks for broader farm-advisor work. Do not change sibling farm workflow trees from a strategy task unless report integration requires a small, clearly scoped touchpoint.

## Read nearby docs first

Read `INDEX.md` first, then open the matching subworkflow guide and local `AGENTS.md`:

- `crop-strategy/GUIDE.md` for crop-specific planning, field-level recommendations, and report wording.
- `maturity-by-fips/GUIDE.md` for county/FIPS maturity outputs and shared corn RM or soybean MG assets.

If runtime data paths or generated report destinations are involved, defer to `../data-pipeline/AGENTS.md` for the canonical `${DATA_PIPELINE_DATA_ROOT}/data-pipeline` contract.

## Local workflow notes

- Keep strategy resources source-backed and extension-grade. Prefer USDA, NASS, ERS, land-grant extension, Crop Protection Network, and commodity-board technical references over vendor marketing or unattributed summaries.
- Treat 2026 outlook values as planning assumptions. Distinguish USDA/NASS forecasts from field-level recommendations generated from local soil, weather, crop-history, and operations data.
- Report recommendations should map to fields using existing pipeline columns when possible: SSURGO soil summaries, CDL crop history, NASA POWER weather summaries, field geometry, headlands, and maturity-by-FIPS outputs.
- Keep `SKILL.md` compact. Put detailed strategy instructions in `INDEX.md`, `GUIDE.md`, resources, or local source modules.

## Local validation

Run `./scripts/validate.sh` from the repository root after documentation or structural changes. If Python strategy code changes, also run `python -m py_compile` on changed modules and a small smoke call for the changed public functions.

## Local-delta-only reminder

This nested AGENTS.md only records instructions that differ from the parent or root files. Do not duplicate root-wide asset, vendor, or validation policy here except this pointer to `../../AGENTS.md`.
