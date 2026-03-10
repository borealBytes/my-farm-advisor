---
name: csb-field-sampling
description: Sample agricultural field boundaries from USDA NASS Crop Sequence Boundaries (CSB) with deterministic random selection, region filtering, and AOI-based extraction. Use when you need real field boundaries for analysis without mock data.
license: MIT
compatibility: Requires Python 3.11+, geopandas, shapely. Uses existing field-boundaries sample data as fallback.
metadata:
  author: Boreal Bytes
  version: '1.0.0'
  category: geospatial
  tags: [csb, usda, nass, field-boundaries, sampling, agriculture, deterministic]
---

# CSB Field Sampling Skill

_Deterministic sampling from USDA NASS Crop Sequence Boundaries._

---

## What this skill covers

1. Load real field boundaries from existing sample data
2. Sample fields deterministically using random seeds
3. Filter fields by region, crop type, or AOI
4. Export sampled fields for downstream analysis

---

## Dataset metadata

This skill uses the existing field-boundaries sample data as its source:

- **Path**: `../field-boundaries/examples/sample_2_fields.geojson`
- **Fields**: Real Minnesota crop fields with verified boundaries
- **CRS**: EPSG:4326 (WGS84)

For production use with full CSB dataset, see [USDA NASS CSB](https://www.nass.usda.gov/Research_and_Science/Crop-Sequence-Boundaries/index.php).

---

## Quick Start

```bash
cd .skills/csb-field-sampling

uv run --with geopandas --with shapely python << 'EOF'
from src.csb_sampling import sample_fields, get_random_fields, get_fields_by_aoi

# Sample 5 fields deterministically
fields = sample_fields(n_fields=5, seed=42)
print(f"Sampled {len(fields)} fields")
print(fields[['field_id', 'crop_name', 'area_acres']])
EOF
```

---

## API Reference

### `sample_fields(n_fields, seed=None, regions=None, crops=None)`

Sample field boundaries deterministically.

**Parameters:**

- `n_fields` (int): Number of fields to sample (1-100)
- `seed` (int, optional): Random seed for reproducibility
- `regions` (list, optional): Filter by regions ['corn_belt', 'great_plains', 'southeast']
- `crops` (list, optional): Filter by crops ['corn', 'soybeans', 'wheat', 'cotton']

**Returns:**

- `GeoDataFrame`: Sampled fields with geometry and attributes

**Example:**

```python
from src.csb_sampling import sample_fields

# Deterministic sample
fields = sample_fields(n_fields=10, seed=42, regions=['corn_belt'])
fields.to_file('output/sampled_fields.geojson')
```

---

### `get_random_fields(count, seed=None)`

Get random fields with optional seed for reproducibility.

**Parameters:**

- `count` (int): Number of fields to select
- `seed` (int, optional): Random seed

**Returns:**

- `GeoDataFrame`: Randomly selected fields

**Example:**

```python
from src.csb_sampling import get_random_fields

# Reproducible random selection
fields = get_random_fields(count=5, seed=123)
```

---

### `get_fields_by_aoi(aoi_geometry, buffer_km=0)`

Get fields within an area of interest.

**Parameters:**

- `aoi_geometry` (shapely.geometry): AOI polygon
- `buffer_km` (float): Optional buffer in kilometers

**Returns:**

- `GeoDataFrame`: Fields intersecting the AOI

**Example:**

```python
from src.csb_sampling import get_fields_by_aoi
from shapely.geometry import box

# Define AOI
aoi = box(-93.5, 41.5, -93.0, 42.0)  # minx, miny, maxx, maxy
fields = get_fields_by_aoi(aoi, buffer_km=5)
```

---

## Example Data

Sample outputs included:

- `examples/sampled_5_fields.geojson` — 5 deterministically sampled fields
- `examples/sampled_10_corn_belt.geojson` — 10 corn belt fields
- `examples/README.md` — Example usage documentation

---

## Integration with Other Skills

```python
# Sample fields, then get satellite imagery
from src.csb_sampling import sample_fields
import geopandas as gpd

# Get sample fields
fields = sample_fields(n_fields=2, seed=42)

# Use with sentinel2-imagery skill
fields.to_file('../sentinel2-imagery/examples/my_aoi.geojson')

# Or with landsat-imagery skill
fields.to_file('../landsat-imagery/examples/my_aoi.geojson')
```

---

## Output Schema

Sampled fields include these attributes:

| Column     | Type    | Description                      |
| ---------- | ------- | -------------------------------- |
| field_id   | str     | Unique field identifier          |
| crop_name  | str     | Crop type (corn, soybeans, etc.) |
| region     | str     | Agricultural region              |
| area_acres | float   | Field area in acres              |
| geometry   | Polygon | Field boundary geometry          |

---

## Data Source

- **Provider**: USDA NASS
- **Dataset**: Crop Sequence Boundaries (CSB)
- **Sample Data**: `.skills/field-boundaries/examples/sample_2_fields.geojson`
- **CRS**: EPSG:4326 (WGS84)

---

## References

- [USDA NASS CSB](https://www.nass.usda.gov/Research_and_Science/Crop-Sequence-Boundaries/index.php)
- [CSB Metadata](https://data.nass.usda.gov/Research_and_Science/Crop-Sequence-Boundaries/metadata_Crop-Sequence-Boundaries-2024.htm)
- [field-boundaries skill](../field-boundaries/SKILL.md)
