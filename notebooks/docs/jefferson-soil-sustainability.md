# Jefferson County Soil Sustainability Map

Interactive HTML map for visualizing soil variability and sustainability metrics across Jefferson County agricultural fields.

## Overview

This project calculates and visualizes soil sustainability metrics for potato cultivation in Jefferson County, Idaho. It includes:

- **K-factor** (soil erodibility) using the USLE formula
- **Carbon Storage Potential** (CSP) based on organic matter, bulk density, and topsoil depth
- **Erosion Risk** score combining K-factor and organic matter
- **Composite Score** ranking fields by optimal conditions for potatoes

## Files

| File | Description |
|------|-------------|
| `notebooks/jefferson_farm_soil_data.csv` | Source soil data from NRCS SSURGO |
| `notebooks/jefferson_soil_metrics.geojson` | GeoJSON with calculated sustainability metrics |
| `notebooks/calculate_soil_metrics.py` | Python script that calculates all metrics |
| `notebooks/html/jefferson_soil_sustainability_map.html` | Interactive Leaflet map |

## Metrics Calculation

### K-Factor (Soil Erodibility)

Calculated using the standard USLE formula:

```
K = (2.645e-4 * M^1.14 * om_factor + 0.038 * exp(-0.0047 * silt_vfs^2)) * 0.1317
```

Where:
- `M = silt_vfs * (100 - clay)`
- `silt_vfs = silt + (sand * 0.10)`
- `om_factor = max(0, 12 - om_r)`

### Carbon Storage Potential (CSP)

```
CSP = om_r * db * depth_cm * 1.724
```

Where:
- `om_r` = organic matter percentage
- `db` = bulk density (g/cm³)
- `depth_cm` = topsoil depth in cm
- `1.724` = conversion factor (soil organic carbon to organic matter)

### Erosion Risk

```
Erosion_Risk = K * 10 / (om_r + 2)
```

Lower values = less erosion risk

### Composite Score

Fields are ranked by optimal conditions for potatoes using:

```
Composite = (OM_norm * 0.4) + (pH_score * 0.3) + (CEC_norm * 0.3)
```

Where:
- **OM_norm**: normalized organic matter (0-1, higher is better)
- **pH_score**: how close pH is to 6.0 (optimal for potatoes)
- **CEC_norm**: normalized cation exchange capacity (0-1, higher is better)

## Data Corrections

Several soil map units had data quality issues in the source SSURGO data:

| mukey | Soil Name | Issue | Correction |
|-------|-----------|-------|------------|
| 83899 | Levelton loamy sand | OM=75% (erroneous 0-5cm horizon) | OM=1.5%, pH=8.8, CEC=7.5 |
| 83900 | Levelton loam | OM=75% (erroneous) | OM=1.5%, pH=8.8, CEC=15.0 |
| 83901 | Levelton loam, drained | OM=75% (erroneous) | OM=1.5%, pH=8.8, CEC=15.0 |
| 83902 | Levelton clay loam | OM missing | OM=1.5%, pH=8.8, CEC=15.0 |
| 83904 | Levelton silty clay loam | OM=75% (erroneous) | OM=1.5%, pH=8.8, CEC=22.4 |

The `calculate_soil_metrics.py` script applies these corrections automatically.

## Excluded Fields

Field "69 1/2" was excluded from all datasets as requested.

## Interactive Map Features

- **Base layers**: Toggle between ESRI satellite and OpenStreetMap
- **Choropleth layers**: OM%, pH, CEC, Carbon Storage, Erosion Risk
- **Hover tooltips**: Shows all metrics for each field
- **Clickable tables**: Top 10 and Bottom 10 fields zoom to location on map
- **Field highlighting**: Selected fields show orange border

## Running the Pipeline

```bash
cd notebooks
python calculate_soil_metrics.py
```

This generates:
1. `jefferson_soil_metrics.geojson` with all calculated metrics
2. Console output with Top 10 and Bottom 10 rankings

## Data Source

Soil data sourced from USDA NRCS Soil Data Access (SDA) REST API via the `ssurgo-soil` skill.

## Top 10 Fields (Best for Potatoes)

| Rank | Field | OM% | pH | CEC | Score |
|------|-------|-----|-----|-----|-------|
| 1 | 161 Marty W | 2.5 | 8.2 | 33.0 | 0.764 |
| 2 | 175 Cornelison NE | 2.0 | 8.2 | 27.5 | 0.625 |
| 3 | 166 Kesler North | 2.0 | 8.2 | 27.5 | 0.625 |
| 4 | Kesler Hwy corner NW | 2.0 | 8.2 | 27.5 | 0.625 |
| 5 | 177 Cornelison SW | 1.5 | 8.2 | 27.5 | 0.54 |
| 6 | 167 Kesler Middle | 1.5 | 8.2 | 27.5 | 0.54 |
| 7 | 168 Kesler South | 1.5 | 8.2 | 27.5 | 0.54 |
| 8 | 169 Kesler West and Corners | 1.5 | 8.2 | 27.5 | 0.54 |
| 9 | 161 Marty E | 1.5 | 8.2 | 27.5 | 0.54 |
| 10 | Kesler HWY Corner SW | 1.5 | 8.2 | 27.5 | 0.54 |