# My Farm Advisor

**Domain:** Agricultural Data Science & Farm Management  
**License:** Apache-2.0  
**Attribution:** Superior Byte Works LLC / borealBytes

---

## Overview

My Farm Advisor is a comprehensive skill suite for agricultural data science and farm management. It provides tools for exploratory data analysis, field management, satellite imagery processing, soil analysis, crop strategy planning, and weather data integration. The suite is designed to help farmers, agronomists, and agricultural researchers make data-driven decisions.

---

## Exploratory Data Analysis (EDA)

Skills for analyzing and visualizing agricultural data.

| Skill | Purpose |
|-------|---------|
| [eda-compare](./eda/eda-compare/) | Compare datasets across different time periods or field zones |
| [eda-correlate](./eda/eda-correlate/) | Analyze correlations between yield, soil, weather, and management variables |
| [eda-explore](./eda/eda-explore/) | Interactive data exploration with filtering and aggregation |
| [eda-time-series](./eda/eda-time-series/) | Time series analysis for tracking field performance over seasons |
| [eda-visualize](./eda/eda-visualize/) | Create charts, maps, and dashboards from agricultural data |

---

## Data Sources

Skills for managing and rebuilding farm data sources.

| Skill | Purpose |
|-------|---------|
| [farm-data-rebuild](./data-sources/farm-data-rebuild/) | Rebuild and synchronize farm data from multiple sources |
| [farm-intelligence-reporting](./data-sources/farm-intelligence-reporting/) | Generate intelligence reports from aggregated farm data |

---

## Field Management

Skills for field sampling, boundary mapping, and headland calculations.

| Skill | Purpose |
|-------|---------|
| [csb-field-sampling](./field-management/csb-field-sampling/) | Create field sampling plans and manage soil sample collections |
| [field-boundaries](./field-management/field-boundaries/) | Define and manage field boundary geometries |
| [headlands-ring](./field-management/headlands-ring/) | Calculate headland areas and create turn-around zones |

---

## Imagery

Skills for processing satellite imagery from Landsat and Sentinel-2.

| Skill | Purpose |
|-------|---------|
| [landsat-imagery](./imagery/landsat-imagery/) | Access and process Landsat satellite imagery for field monitoring |
| [sentinel2-imagery](./imagery/sentinel2-imagery/) | Retrieve and analyze Sentinel-2 multispectral imagery |

---

## Soil

Skills for soil data analysis including SSURGO and Cropland Data Layer.

| Skill | Purpose |
|-------|---------|
| [cdl-cropland](./soil/cdl-cropland/) | Access USDA Cropland Data Layer for crop classification |
| [ssurgo-poster-cards](./soil/ssurgo-poster-cards/) | Generate soil summary cards from SSURGO data |
| [ssurgo-soil](./soil/ssurgo-soil/) | Query and analyze NRCS SSURGO soil survey data |

---

## Strategy

Skills for crop strategy planning and maturity analysis.

| Skill | Purpose |
|-------|---------|
| [crop-strategy](./strategy/crop-strategy/) | Develop crop rotation and management strategies |
| [maturity-by-fips](./strategy/maturity-by-fips/) | Analyze crop maturity patterns by FIPS county codes |

---

## Admin

Skills for geospatial administration and interactive mapping.

| Skill | Purpose |
|-------|---------|
| [geoadmin-admin](./admin/geoadmin-admin/) | Administrative tools for geospatial data management |
| [interactive-web-map](./admin/interactive-web-map/) | Create interactive web maps for farm visualization |

---

## Weather

Skills for accessing and processing weather data.

| Skill | Purpose |
|-------|---------|
| [nasa-power-weather](./weather/nasa-power-weather/) | Access NASA POWER weather and climate data for agricultural modeling |

---

## Data

This skill suite includes large data files (satellite imagery, shapefiles, reports) tracked with Git LFS. The following file types are managed by LFS:

- **Images:** `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.tiff`, `.tif`, `.svg`
- **Geospatial:** `.nc`, `.grd`, `.geojson`, `.shp`, `.shx`, `.dbf`, `.prj`
- **Data files:** `data/**/*.csv`, `data/**/*.json`
- **Documents:** `.pdf`, `.docx`, `.pptx`
- **Archives:** `.zip`, `.tar.gz`

To work with LFS files:

```bash
# Install Git LFS
git lfs install

# Pull LFS files
git lfs pull

# Check LFS status
git lfs status
```

---

## Usage

### Directory Structure

```
skills/my-farm-advisor/
├── SKILL.md                    # This file - orchestration overview
├── README.md                   # Quick reference guide
├── admin/
│   ├── geoadmin-admin/
│   └── interactive-web-map/
├── data-sources/
│   ├── farm-data-rebuild/
│   └── farm-intelligence-reporting/
├── eda/
│   ├── eda-compare/
│   ├── eda-correlate/
│   ├── eda-explore/
│   ├── eda-time-series/
│   └── eda-visualize/
├── field-management/
│   ├── csb-field-sampling/
│   ├── field-boundaries/
│   └── headlands-ring/
├── imagery/
│   ├── landsat-imagery/
│   └── sentinel2-imagery/
├── soil/
│   ├── cdl-cropland/
│   ├── ssurgo-poster-cards/
│   └── ssurgo-soil/
├── strategy/
│   ├── crop-strategy/
│   └── maturity-by-fips/
└── weather/
    └── nasa-power-weather/
```

### Getting Started

1. Navigate to a specific skill directory
2. Read the skill's `SKILL.md` for detailed documentation
3. Follow the usage instructions in each skill's README

---

## License

Apache-2.0 - See individual skill directories for full license details.
