# Crop Strategy Guide

This workflow owns crop-specific planning guidance and the small recommendation engine used by farm intelligence reports. Use it when a request asks for 2026 crop strategy, crop choice context, regional watchouts, or field-level agronomic recommendation framing.

## Start Here

- Code: `src/crop_strategy.py`
- Corn resource: `resources/2026-usa-corn.md`
- Soybean resource: `resources/2026-usa-soybean.md`
- Cotton resource: `resources/2026-usa-cotton.md`
- Wheat resource: `resources/2026-usa-wheat.md`
- Sorghum resource: `resources/2026-us-sorghum.md`

## Report Integration

The data pipeline imports `generate_farm_recommendations(...)` and `generate_field_recommendations(...)` from `src/crop_strategy.py`.

- Farm Markdown and HTML reports use farm-level bullets from `generate_farm_recommendations(...)`.
- Field Markdown and HTML cards use field-level action plans, watchouts, and optimization bullets from `generate_field_recommendations(...)`.
- Field posters currently use `compute_management_implications(...)` from farm intelligence reporting; add crop-strategy text there only when the task explicitly asks for poster strategy copy.

## Available Field Inputs

Keep generated advice tied to columns that already exist in the field reporting dataset:

- SSURGO: `avg_ph`, `avg_om_pct`, `total_aws_inches`, `drainage_class`, `avg_clay_pct`, `erosion_risk`
- CDL history: `rotation_sequence`, `rotation_outlook`, `predicted_next_crop`, `predicted_following_crop`, `crop_diversity`, `corn_years`, `soybean_years`
- Weather: `avg_temp_c`, `annual_precip_mm`, `max_gdd_cumulative`
- Operations: `area_acres`, `headlands_pct`, `headlands_area_acres`

Do not invent field attributes in recommendation text. If a source guide names an input that is not present in the reporting dataset, phrase it as a scouting or local-consultation check rather than as a measured field fact.

## Source Standards

Prefer USDA, NASS, ERS, land-grant extension, Crop Protection Network, commodity-board technical guides, and peer-reviewed agronomy references. Avoid using vendor claims as primary evidence for rates, disease thresholds, or economics unless no extension source exists and the text clearly labels the source type.

Treat 2026 outlook values as planning assumptions, not guarantees. Separate national market or acreage outlook from field-specific recommendations generated from local farm data.

## Local Validation

After changing Python strategy code, run a syntax check and a small smoke call from the repository root:

```bash
python -m py_compile my-farm-advisor/strategy/crop-strategy/src/crop_strategy.py
```

Run repository validation after documentation or structural changes:

```bash
./scripts/validate.sh
```
