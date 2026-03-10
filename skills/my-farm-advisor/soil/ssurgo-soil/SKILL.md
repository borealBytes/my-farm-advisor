---
name: ssurgo-soil
description: Download USDA NRCS SSURGO soil data for agricultural fields
version: 1.0.0
author: Boreal Bytes
tags: [usda, nrcs, ssurgo, soil, geospatial, download]
---

# Skill: ssurgo-soil

## Description

Download, map, and analyze USDA NRCS SSURGO (Soil Survey Geographic Database) soil properties for agricultural fields. This skill queries the free NRCS Soil Data Access (SDA) REST API to retrieve soil organic matter, pH, texture, drainage class, and other properties, then supports field-level choropleths, SSURGO overlays, and headlands-ring workflow figures. No API key required.

## When to Use This Skill

- **Getting soil data**: Download soil properties for field boundaries or points
- **Soil analysis**: Organic matter, pH, texture, drainage, bulk density, CEC
- **Field characterization**: Identify dominant soil types and properties per field
- **Crop planning**: Assess soil suitability for different crops
- **Data integration**: Join soil data to field boundaries for spatial analysis
- **SSURGO choropleths**: Generate natural-breaks soil-property maps with legends
- **Headlands workflow**: Build field-boundary minus inner-buffer ring for combine-width exclusion zones
- **Publication visuals**: Render complete workflow figures with styled soil-property tables

## Prerequisites

```bash
# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Example Data

Sample data is included in the `examples/` directory:

- `examples/soil_data_2_fields.csv` - Real SSURGO soil data for 2 Minnesota fields
- `examples/soil_data_2_fields.json` - Same data in JSON format

The example data was downloaded from NRCS SDA for the fields in `field-boundaries/examples/sample_2_fields.geojson`.

```python
import pandas as pd

# Load example soil data
soil = pd.read_csv('examples/soil_data_2_fields.csv')
print(soil[['field_id', 'compname', 'om_r', 'ph1to1h2o_r', 'drainagecl']])

# Output:
#           field_id  compname  om_r  ph1to1h2o_r              drainagecl
# 0  271623002471299    Winger   5.0          7.9          Poorly drained
# 1  271623002471299  Wyndmere   6.5          7.5  Somewhat poorly drained
# 2  271623002471299   Balaton   4.0          7.6  Moderately well drained
# ...
```

## Quick Start

```bash
# Run in isolated environment - download soil for field boundaries
uv run --with geopandas --with pandas --with requests python << 'EOF'
import geopandas as gpd
from ssurgo_soil import download_soil, get_dominant_soil

# Load field boundaries (from field-boundaries skill)
fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson')

# Download soil data for all fields
soil = download_soil(fields, output_path='data/growers/demo-grower/farms/demo-farm/derived/tables/soil_data.csv')
print(f'Downloaded {len(soil)} soil records for {soil["field_id"].nunique()} fields')

# Get dominant soil per field
dominant = get_dominant_soil(soil)
print(dominant[['field_id', 'compname', 'om_r', 'ph1to1h2o_r', 'drainagecl']])
EOF
```

## Installation (Isolated Environment)

This skill runs in an isolated environment to avoid dependency conflicts:

```bash
# Create dedicated environment for this skill
cd .skills/ssurgo-soil
uv venv .venv
source .venv/bin/activate

# Install dependencies
uv pip install geopandas pandas requests
```

## Data Source

**USDA NRCS Soil Data Access (SDA)**

- **API**: <https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest>
- **Database**: SSURGO (Soil Survey Geographic Database)
- **Coverage**: Most agricultural areas in the US
- **Resolution**: 1:12,000 to 1:63,360 (detailed field-level)
- **Authentication**: None required (public API)
- **Format**: JSON via REST, SQL query interface

The SDA API accepts SQL queries against the SSURGO database tables:

- `mapunit` - Map units (soil polygons)
- `component` - Soil components within map units
- `chorizon` - Soil horizon (layer) properties

## Key Soil Attributes

| SSURGO Column  | Description              | Units       | Typical Range |
| -------------- | ------------------------ | ----------- | ------------- |
| `om_r`         | Organic matter           | %           | 0-20          |
| `ph1to1h2o_r`  | pH in water              | pH units    | 3.5-10.0      |
| `awc_r`        | Available water capacity | inches/inch | 0-0.25        |
| `drainagecl`   | Drainage class           | categorical | -             |
| `claytotal_r`  | Clay content             | %           | 0-100         |
| `sandtotal_r`  | Sand content             | %           | 0-100         |
| `silttotal_r`  | Silt content             | %           | 0-100         |
| `dbthirdbar_r` | Bulk density             | g/cm3       | 0.5-2.0       |
| `cec7_r`       | Cation exchange capacity | meq/100g    | 0-50          |

## Usage Examples

### Example 1: Query Soil at a Point

```python
from ssurgo_soil import get_soil_at_point

# Query soil at a specific location (lon, lat in WGS84)
soil = get_soil_at_point(lon=-93.5, lat=42.0)
print(soil[['compname', 'om_r', 'ph1to1h2o_r', 'drainagecl']])
```

### Example 2: Download for Field Boundaries

```python
import geopandas as gpd
from ssurgo_soil import download_soil, get_dominant_soil

# Load field boundaries
fields = gpd.read_file('data/growers/demo-grower/farms/demo-farm/boundary/field_boundaries.geojson')

# Download soil data for all fields
soil = download_soil(
    fields,
    field_id_column='field_id',
    max_depth_cm=30,
    output_path='data/growers/demo-grower/farms/demo-farm/derived/tables/soil_EPSG4326.csv'
)

# Get one row per field (dominant soil)
dominant = get_dominant_soil(soil)
print(f'Average OM: {dominant["om_r"].mean():.1f}%')
print(f'Average pH: {dominant["ph1to1h2o_r"].mean():.1f}')
```

### Example 3: Direct SDA Query

```python
from ssurgo_soil import query_sda

# Run a custom SQL query against the SSURGO database
rows = query_sda('''
    SELECT mu.mukey, mu.muname, c.compname, c.comppct_r
    FROM mapunit mu
    INNER JOIN component c ON mu.mukey = c.mukey
    WHERE mu.mukey IN (
        SELECT * FROM SDA_Get_Mukey_from_intersection_with_WktWgs84(
            'POINT(-93.5 42.0)'
        )
    )
    AND c.majcompflag = 'Yes'
    ORDER BY c.comppct_r DESC
''')
for row in rows:
    print(row)
```

### Example 4: Classify Drainage

```python
from ssurgo_soil import download_soil, classify_drainage

soil = download_soil(fields)
soil['drainage_category'] = soil['drainagecl'].apply(classify_drainage)
print(soil['drainage_category'].value_counts())
# good         5
# poor         4
# excessive    2
```

## Python API Reference

### Mapping and Workflow Utilities

These are exposed from `ssurgo_workflows` via `from ssurgo_soil import ...`:

- `prepare_ssurgo_field_package(field_wgs84, ...)`
  - Returns `(ssurgo_polygons, detail_table, aggregated_by_mukey)`.
  - Handles SDA polygon query + optional fallback polygons.
  - Produces detail table sorted by `mukey, hzdept_r, comppct_r`.

- `render_ssurgo_property_map(field_wgs84, ssurgo_wgs84, property_col, output_path, ...)`
  - Creates a single-field natural-breaks choropleth with value-range legend.
  - Supports light satellite basemap and optional axis-label suppression.

- `headlands_ring(field_utm, combine_width_m=9.0)`
  - Computes `field - field.buffer(-combine_width)` to produce inner edge strip.

- `render_complete_workflow_figure(field_wgs84, ssurgo_wgs84, detail_table, output_path, ...)`
  - Renders complete workflow figure with:
    1. WGS84 boundary panel,
    2. WGS84 SSURGO panel,
    3. UTM headlands + OM overlay panel,
    4. styled soil table panel.

### Example 5: SSURGO Choropleth + Workflow Figure

```python
import geopandas as gpd
from ssurgo_soil import (
    prepare_ssurgo_field_package,
    render_ssurgo_property_map,
    render_complete_workflow_figure,
)

fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson').to_crs('EPSG:4326')
field = fields[fields['field_id'] == '271623002471299'].copy()

ssurgo_polys, detail_table, _ = prepare_ssurgo_field_package(
    field,
    field_id_column='field_id',
    fallback_mukey_geojson='docs/classes/examples/class6-geospatial-analysis/03-spatial-joins/output/ssurgo_field_271623002471299_mukey_polygons.geojson',
)

render_ssurgo_property_map(
    field,
    ssurgo_polys,
    'om_r',
    'output/soil_property_271623002471299_om_r.png',
    title='OM (Natural Breaks)',
    show_axis_labels=False,
)

render_complete_workflow_figure(
    field,
    ssurgo_polys,
    detail_table,
    'output/workflow_visualization_271623002471299.png',
    combine_width_m=9.0,
)
```

### `download_soil(fields, field_id_column, max_depth_cm, output_path)`

Download SSURGO soil data for multiple field boundaries.

**Parameters:**

- `fields` (GeoDataFrame): Field boundaries in EPSG:4326
- `field_id_column` (str): Column with field IDs (default: 'field_id')
- `max_depth_cm` (int): Maximum soil depth to query (default: 30)
- `output_path` (str): Optional path to save CSV

**Returns:** DataFrame with soil properties and field_id column

### `get_soil_at_point(lon, lat, max_depth_cm)`

Get soil properties at a geographic point.

**Parameters:**

- `lon` (float): Longitude (WGS84)
- `lat` (float): Latitude (WGS84)
- `max_depth_cm` (int): Maximum depth in cm (default: 30)

**Returns:** DataFrame with soil properties

### `get_soil_for_polygon(wkt, max_depth_cm)`

Get soil properties for a WKT polygon geometry.

**Parameters:**

- `wkt` (str): WKT polygon string in WGS84
- `max_depth_cm` (int): Maximum depth in cm (default: 30)

**Returns:** DataFrame with soil properties

### `get_dominant_soil(soil_data)`

Extract dominant soil component per field (highest comppct_r, topmost horizon).

**Parameters:**

- `soil_data` (DataFrame): Output from download_soil()

**Returns:** DataFrame with one row per field

### `classify_drainage(drainage_class)`

Classify SSURGO drainage class into simple categories.

**Parameters:**

- `drainage_class` (str): SSURGO drainage class string

**Returns:** One of: 'excessive', 'good', 'poor', 'unknown'

### `query_sda(sql)`

Execute raw SQL against the NRCS SDA REST API.

**Parameters:**

- `sql` (str): SQL query using SSURGO table/column names

**Returns:** List of dictionaries

## Output Files

- `soil_data.csv` - Soil data with field_id for joining to field boundaries
- Columns: field_id, mukey, muname, compname, comppct_r, drainagecl, hzdept_r, hzdepb_r, om_r, ph1to1h2o_r, awc_r, claytotal_r, sandtotal_r, silttotal_r, dbthirdbar_r, cec7_r

## Notes

- Queries use polygon intersection (falls back to centroid if polygon fails)
- Multiple map units and components may exist per field
- Use `get_dominant_soil()` to get one representative row per field
- pH valid range: 3.5-10.0
- Organic matter typical range: 0-20%
- Top 30cm (topsoil) queried by default; adjust `max_depth_cm` for deeper data
- SDA has rate limits; avoid querying hundreds of fields in rapid succession

## Resources

- [NRCS Soil Data Access](https://sdmdataaccess.nrcs.usda.gov/)
- [SDA Query Guide](https://sdmdataaccess.nrcs.usda.gov/WebServiceHelp.aspx)
- [SSURGO Database](https://www.nrcs.usda.gov/resources/data-and-reports/soil-survey-geographic-database-ssurgo)
- [Web Soil Survey](https://websoilsurvey.sc.egov.usda.gov/)
