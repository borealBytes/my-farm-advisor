---
name: farm-data-rebuild
description: Rebuild the canonical data folder deterministically from a field-boundary input by orchestrating existing ag skills and pipeline scripts.
version: 1.0.0
author: Boreal Bytes
tags: [agriculture, pipeline, rebuild, deterministic, data-tree]
---

# Skill: farm-data-rebuild

## Use this skill when

- You want one command/skill to recreate `data/` from scratch.
- You have any field-boundary GeoJSON input and need canonical outputs.
- You want deterministic field slug ordering and canonical folder layout.

## Inputs

- `--boundaries` (required): path to GeoJSON boundaries
- `--grower-slug` (optional)
- `--farm-slug` (optional)
- `--farm-name` (optional)
- `--skip-downloads` (optional)
- `--keep-legacy-workdirs` (optional)

### County bootstrap companion

Use `data/scripts/ingest/bootstrap_farm_from_county.py` to create or append
field boundaries and inventory mappings for any U.S. county before running
this rebuild skill.

- New farm: run bootstrap script without `--append`
- Expand existing farm: run bootstrap script with `--append`

## Nested skills used internally

- `field-boundaries`
- `ssurgo-soil`
- `nasa-power-weather`
- `cdl-cropland`
- `farm-intelligence-reporting`
- `ssurgo-poster-cards`

## Entrypoint

```bash
python scripts/rebuild_data_folder.py --boundaries path/to/fields.geojson
```

## Output guarantee

- Canonical outputs are verified under:
  - `data/scripts/`
  - `data/shared/`
  - `data/growers/<grower_slug>/farms/<farm_slug>/fields/<field_slug>/...`
