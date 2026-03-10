---
name: ssurgo-poster-cards
description: Generate poster-ready SSURGO soil profile cards from a local SQLite database, including single-profile, comparison, texture-color, and clustered layouts.
version: 1.0.0
author: Boreal Bytes
tags: [agriculture, soil, ssurgo, visualization, poster]
---

# SSURGO Poster Cards

## Use this skill when

- The user wants soil profile figures from SSURGO.
- The user wants poster-ready SVG, PDF, or high-resolution PNG exports.
- The user wants horizon rectangles plotted by top and bottom depth.
- The user wants profiles compared, texture-colored, or clustered.

## Inputs

- Path to a local SSURGO SQLite database.
- Optional MUKEY filters.
- Optional dominant-component-only flag.
- Optional variable choices for single-profile coloring, comparison coloring, and clustering.

## Expected tables

- `mapunit`
- `component`
- `chorizon`

## Required fields

- `mapunit.mukey`
- `mapunit.muname`
- `component.cokey`
- `component.compname`
- `component.comppct_r`
- `chorizon.hzname`
- `chorizon.hzdept_r`
- `chorizon.hzdepb_r`

## Optional fields used for coloring and clustering

- `chorizon.sandtotal_r`
- `chorizon.silttotal_r`
- `chorizon.claytotal_r`
- `chorizon.om_r`
- `chorizon.awc_r`
- `chorizon.ph1to1h2o_r`
- `chorizon.ksat_r`
- `chorizon.dbthirdbar_r`

## Outputs

- `card_01_single_profile.{svg,pdf,png}`
- `card_02_compare_profiles.{svg,pdf,png}`
- `card_03_texture_profiles.{svg,pdf,png}`
- `card_04_clustered_profiles.{svg,pdf,png}`

## Behavior

1. Join `mapunit`, `component`, and `chorizon`.
2. Filter to valid horizon top and bottom depths.
3. Optionally keep only the dominant component per map unit.
4. Build profile identifiers from MUKEY, component name, and component percentage.
5. Render one or more profile-card figure types.
6. Export vector and raster outputs into `outputs/cards/`.

## Notes

- Depth increases downward.
- `hzdept_r` is the top of the horizon.
- `hzdepb_r` is the bottom of the horizon.
- Texture-color mode maps sand to red, silt to green, and clay to blue.
- Cluster mode groups profiles by similarity across selected variables.

## Script entrypoint

Run:

```bash
python scripts/build_ssurgo_poster_cards.py --db data/raw/ssurgo.sqlite --out outputs/cards --dominant-only --max-profiles 6
```
