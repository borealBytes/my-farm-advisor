---
name: cdl-cropland
description: Download USDA NASS Cropland Data Layer crop type maps for agricultural fields. Use when the user needs annual crop classifications, land cover data, crop rotation history, or crop type rasters clipped to field boundaries.
version: 1.0.0
author: Boreal Bytes
tags: [usda, nass, cdl, cropland, raster, geospatial, download]
---

# Skill: cdl-cropland

## Description

Download and analyze USDA NASS Cropland Data Layer (CDL) annual crop type rasters. The CDL is a 30-meter resolution raster covering the contiguous US, classifying every pixel into one of 130+ crop and land cover types. This skill clips CDL rasters to field boundaries and extracts per-field crop classifications.

The skill now also supports reporting-oriented outputs that keep the full crop composition for each field-year so downstream dashboards and posters can render 100% stacked crop history charts rather than relying only on dominant crop summaries.

## When to Use This Skill

- **Crop identification**: Determine what crop was planted in a field for a given year
- **Rotation analysis**: Build multi-year crop sequences (e.g., corn-soybean rotation)
- **Land cover mapping**: Classify fields as cropland, forest, developed, wetland, etc.
- **Carbon credit verification**: Confirm crop history for sustainability programs
- **AOI clipping**: Extract CDL pixels within specific field polygons

## Prerequisites

```bash
# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Example Data

Sample data is included in the `examples/` directory:

- `examples/sample_cdl_2_fields.csv` - CDL crop classifications for 2 Minnesota fields (2020-2024)

These match the 2 fields from the `field-boundaries` skill (`examples/sample_2_fields.geojson`).

```python
import pandas as pd

# Load example CDL data
cdl = pd.read_csv('examples/sample_cdl_2_fields.csv')
print(cdl[['field_id', 'year', 'crop_code', 'crop_name', 'dominant_pct']])

# Output:
#           field_id  year  crop_code crop_name  dominant_pct
# 0  271623002471299  2020          1      Corn         94.3
# 1  271623002471299  2021          5  Soybeans         91.7
# 2  271623002471299  2022          1      Corn         96.1
# ...
```

## Quick Start

```bash
# Download CDL GeoTIFF and extract crop types for field boundaries
uv run --with rasterio --with geopandas --with rasterstats --with requests python << 'EOF'
import geopandas as gpd
import requests
import rasterio
from rasterio.mask import mask
from rasterstats import zonal_stats
from collections import Counter
from pathlib import Path

# Load field boundaries (from field-boundaries skill)
fields = gpd.read_file('../field-boundaries/examples/sample_2_fields.geojson')

year = 2023
state_fips = '29'  # Example only; set this to the farm state FIPS

# --- Step 1: Download CDL GeoTIFF from CropScape ---
# CropScape provides state-level or CONUS GeoTIFFs
cdl_url = (
    f'https://nassgeodata.gmu.edu/nass_data_cache/byfips/CDL_{year}_{state_fips}.tif'
)
cdl_path = Path(f'data/CDL_{year}_{state_fips}.tif')
cdl_path.parent.mkdir(parents=True, exist_ok=True)

if not cdl_path.exists():
    print(f'Downloading CDL {year} for state {state_fips}...')
    resp = requests.get(cdl_url, stream=True)
    resp.raise_for_status()
    with open(cdl_path, 'wb') as f:
        for chunk in resp.iter_content(chunk_size=8192):
            f.write(chunk)
    print(f'Saved to {cdl_path}')

# --- Step 2: Extract dominant crop per field ---
with rasterio.open(cdl_path) as src:
    # Reproject fields to match CDL CRS (typically EPSG:5070)
    fields_proj = fields.to_crs(src.crs)

    results = []
    for _, field in fields_proj.iterrows():
        # Clip raster to field boundary
        out_image, out_transform = mask(src, [field.geometry], crop=True)
        pixels = out_image[0]  # single band
        valid = pixels[pixels > 0]

        if len(valid) > 0:
            counts = Counter(valid.flat)
            dominant_code = counts.most_common(1)[0][0]
            dominant_pct = counts[dominant_code] / len(valid) * 100
        else:
            dominant_code = 0
            dominant_pct = 0.0

        results.append({
            'field_id': field['field_id'],
            'year': year,
            'crop_code': int(dominant_code),
            'dominant_pct': round(dominant_pct, 1),
            'total_pixels': len(valid),
        })

# --- Step 3: Map crop codes to names ---
CROP_CODES = {1: 'Corn', 5: 'Soybeans', 24: 'Winter Wheat', 36: 'Alfalfa', 61: 'Fallow/Idle'}
for r in results:
    r['crop_name'] = CROP_CODES.get(r['crop_code'], f"Code_{r['crop_code']}")

import pandas as pd
df = pd.DataFrame(results)
print(df[['field_id', 'year', 'crop_code', 'crop_name', 'dominant_pct']])
df.to_csv(f'data/shared/cdl/derived/tables/cdl_{year}_fields.csv', index=False)
EOF
```

## Installation (Isolated Environment)

This skill runs in an isolated environment to avoid dependency conflicts:

```bash
# Create dedicated environment for this skill
cd .skills/cdl-cropland
uv venv .venv
source .venv/bin/activate

# Install dependencies
uv pip install rasterio geopandas rasterstats requests pandas matplotlib
```

## Data Source

**USDA NASS Cropland Data Layer (CDL)**

- Coverage: Contiguous United States
- Resolution: 30m (1 pixel = 30x30m)
- Classification: 130+ crop/land cover classes
- Time Period: 2008-present (annual)
- Accuracy: 90%+ for major crops (corn, soybeans, wheat)
- Format: GeoTIFF raster (single band, uint8)
- CRS: EPSG:5070 (Conus Albers)

### Download Endpoints

| Method        | URL Pattern                                                                      | Notes                         |
| ------------- | -------------------------------------------------------------------------------- | ----------------------------- |
| State GeoTIFF | `https://nassgeodata.gmu.edu/nass_data_cache/byfips/CDL_{year}_{state_fips}.tif` | Fastest for single-state work |
| CONUS GeoTIFF | `https://nassgeodata.gmu.edu/nass_data_cache/byfips/CDL_{year}_CONUS.tif`        | Large (~2 GB), full US        |
| CropScape API | `https://nassgeodata.gmu.edu/CropScapeService/wps_cdldata.asmx`                  | Bounding-box queries          |

## Major Crop Classes

| Code | Crop          | Category     |
| ---- | ------------- | ------------ |
| 1    | Corn          | Row Crops    |
| 5    | Soybeans      | Row Crops    |
| 24   | Winter Wheat  | Small Grains |
| 27   | Rye           | Small Grains |
| 36   | Alfalfa       | Forage       |
| 61   | Fallow/Idle   | Fallow       |
| 176  | Grass/Pasture | Forage       |

See `src/__init__.py` for the full `CROP_CODES` dictionary (80+ entries).

## Usage Examples

### Example 1: Download CDL and Clip to Fields

```python
import geopandas as gpd
import rasterio
from rasterio.mask import mask
from collections import Counter
from pathlib import Path

# Load field boundaries (from field-boundaries skill)
fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson')

year = 2023
cdl_path = Path(f'data/CDL_{year}_27.tif')

with rasterio.open(cdl_path) as src:
    fields_proj = fields.to_crs(src.crs)

    for _, field in fields_proj.iterrows():
        out_image, _ = mask(src, [field.geometry], crop=True)
        pixels = out_image[0]
        valid = pixels[pixels > 0]

        counts = Counter(valid.flat)
        print(f"Field {field['field_id']}:")
        for code, count in counts.most_common(3):
            print(f"  Code {code}: {count} pixels")
```

### Example 2: Multi-Year Crop Rotation

```python
import pandas as pd

years = [2020, 2021, 2022, 2023, 2024]
all_results = []

for year in years:
    cdl_path = f'data/CDL_{year}_27.tif'
    # ... extract crops per field (see Quick Start) ...
    # all_results.extend(year_results)

df = pd.DataFrame(all_results)

# Build rotation sequences
for field_id, group in df.groupby('field_id'):
    sequence = group.sort_values('year')['crop_name'].tolist()
    print(f"{field_id}: {' -> '.join(sequence)}")
    # Example: 271623002471299: Corn -> Soybeans -> Corn -> Soybeans -> Corn
```

### Example 3: Zonal Statistics with rasterstats

```python
import geopandas as gpd
from rasterstats import zonal_stats

fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson')
cdl_path = 'data/CDL_2023_27.tif'

# Get pixel counts per crop code within each field
stats = zonal_stats(
    fields,
    cdl_path,
    categorical=True,
    geojson_out=True,
)

for feat in stats:
    props = feat['properties']
    field_id = props['field_id']
    # Categorical stats keys are pixel values
    crop_counts = {k: v for k, v in props.items() if isinstance(k, int)}
    print(f"{field_id}: {crop_counts}")
```

### Example 4: CropScape API (Small AOI)

```python
import requests

# Query CropScape for a bounding box (small areas only)
bbox = '-95.95,47.06,-95.94,47.07'  # lon_min,lat_min,lon_max,lat_max
year = 2023

url = (
    'https://nassgeodata.gmu.edu/CropScapeService/wps_cdldata.asmx'
    '/GetCDLData'
    f'?year={year}&bbox={bbox}'
)
resp = requests.get(url)
print(resp.text)  # Returns URL to clipped GeoTIFF
```

## Output Files

- `CDL_{year}_{state_fips}.tif` - State-level CDL GeoTIFF raster
- `cdl_{year}_fields.csv` - Extracted crop classifications per field

CSV columns: `field_id`, `year`, `crop_code`, `crop_name`, `dominant_pct`, `total_pixels`

## Notes

- CDL GeoTIFFs use **EPSG:5070** (Conus Albers); reproject fields before clipping
- State-level TIFs are 200-500 MB; download once and reuse across fields
- 30m resolution means small fields (<2 acres) may have very few pixels
- CDL is classified from satellite imagery acquired primarily June-September
- Double-cropped areas may show only the primary crop
- For field boundaries (AOI input), use the `field-boundaries` skill

## Environment Variables

No special environment variables required. The skill uses public USDA data.

## Resources

- [USDA NASS CDL](https://www.nass.usda.gov/Research_and_Science/Cropland/)
- [CropScape Viewer](https://nassgeodata.gmu.edu/CropScape/)
- [CDL FAQ](https://www.nass.usda.gov/Research_and_Science/Cropland/sarsfaqs2.php)
- [Rasterio Documentation](https://rasterio.readthedocs.io/)
- [rasterstats Documentation](https://pythonhosted.org/rasterstats/)
