---
name: my-farm-advisor
description: >
  Umbrella agricultural data science and farm management skill that routes requests into
  field management, imagery, soil, weather, exploratory analysis, strategy, and farm-data
  rebuild/reporting workflows.
license: Apache-2.0
metadata:
  skill-author: Clayton Young / Superior Byte Works, LLC (@borealBytes)
  skill-version: "1.0.0"
---

# My Farm Advisor

**Domain:** Agricultural Data Science & Farm Management  
**License:** Apache-2.0  
**Attribution:** Superior Byte Works LLC / borealBytes

---

## Purpose

Use My Farm Advisor as the umbrella skill for agricultural data-science and farm-management work. It routes requests into the correct operational area, then into the specific guide or playbook for that task.

## Start Here

Open the subtree index that matches the request:

- [Admin](INDEX.md#admin) via [admin/INDEX.md](admin/INDEX.md)
- [Data Sources](INDEX.md#data-sources) via [data-sources/INDEX.md](data-sources/INDEX.md)
- [EDA](INDEX.md#eda) via [eda/INDEX.md](eda/INDEX.md)
- [Field Management](INDEX.md#field-management) via [field-management/INDEX.md](field-management/INDEX.md)
- [Imagery](INDEX.md#imagery) via [imagery/INDEX.md](imagery/INDEX.md)
- [Soil](INDEX.md#soil) via [soil/INDEX.md](soil/INDEX.md)
- [Strategy](INDEX.md#strategy) via [strategy/INDEX.md](strategy/INDEX.md)
- [Weather](INDEX.md#weather) via [weather/INDEX.md](weather/INDEX.md)

## Routing Guidance

- Use **Field Management** for boundaries, deterministic field sampling, or headlands.
- Use **Imagery** for Landsat or Sentinel-2 scene acquisition and vegetation products.
- Use **Soil** for SSURGO and CDL-derived soil and crop-layer analysis.
- Use **EDA** for exploration, comparisons, correlations, visualization, and time series.
- Use **Data Sources** for canonical data rebuilds and farm-level intelligence reporting.
- Use **Strategy** for maturity planning and crop-strategy decisions.
- Use **Weather** for NASA POWER weather acquisition and downstream farm weather analysis.
- Use **Admin** for geospatial administration and browser-based interactive map workflows.

## Runtime Notes

This umbrella skill contains large supporting assets and examples. The nested documents are no longer separate discoverable skills; instead, use the subtree indexes and linked guides/playbooks for progressive discovery.

## Data Notes

This skill suite includes large data files (satellite imagery, shapefiles, reports) tracked with Git LFS. Pull LFS files before running data-heavy workflows.
