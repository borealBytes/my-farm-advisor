# CDL Cropland Example Data

This directory contains sample Cropland Data Layer (CDL) crop classifications extracted for the 2 Minnesota fields from the `field-boundaries` skill.

## Files

- **sample_cdl_2_fields.csv** - CDL crop type classifications for 2 fields across 5 years (2020-2024)

## Data Source

- **Provider**: USDA National Agricultural Statistics Service (NASS)
- **Dataset**: Cropland Data Layer (CDL)
- **Resolution**: 30m raster, dominant crop extracted per field
- **Years**: 2020-2024
- **CRS**: Original raster is EPSG:5070; fields reprojected for clipping

## Fields Included

| Field ID        | State | Area (acres) | Rotation Pattern      |
| --------------- | ----- | ------------ | --------------------- |
| 271623002471299 | MN    | 3.70         | Corn-Soybean (2-year) |
| 271623001561551 | MN    | 6.41         | Soybean-Corn (2-year) |

Both fields show a classic corn-soybean rotation common in the Corn Belt.

## CSV Columns

| Column         | Description                                                              |
| -------------- | ------------------------------------------------------------------------ |
| `field_id`     | Matches field IDs in `field-boundaries/examples/sample_2_fields.geojson` |
| `year`         | CDL classification year                                                  |
| `crop_code`    | USDA CDL numeric crop code (1=Corn, 5=Soybeans, etc.)                    |
| `crop_name`    | Human-readable crop name                                                 |
| `dominant_pct` | Percentage of field pixels classified as the dominant crop               |
| `total_pixels` | Number of 30m CDL pixels within the field boundary                       |

## Usage

```python
import pandas as pd

# Load CDL data
cdl = pd.read_csv('sample_cdl_2_fields.csv')

# View crop rotation for each field
for field_id, group in cdl.groupby('field_id'):
    sequence = group.sort_values('year')['crop_name'].tolist()
    print(f"{field_id}: {' -> '.join(sequence)}")

# Output:
# 271623002471299: Corn -> Soybeans -> Corn -> Soybeans -> Corn
# 271623001561551: Soybeans -> Corn -> Soybeans -> Corn -> Soybeans
```

## Relationship to field-boundaries Skill

The field boundaries used to clip these CDL rasters come from:

```
.skills/field-boundaries/examples/sample_2_fields.geojson
```

Load both together for spatial analysis:

```python
import geopandas as gpd
import pandas as pd

fields = gpd.read_file('../field-boundaries/examples/sample_2_fields.geojson')
cdl = pd.read_csv('sample_cdl_2_fields.csv')

# Merge CDL data onto field geometries
merged = fields.merge(cdl[cdl['year'] == 2023], on='field_id')
print(merged[['field_id', 'crop_name', 'dominant_pct', 'area_acres']])
```

## Notes

- Pixel counts reflect 30m resolution: the 3.7-acre field has ~16 pixels, the 6.4-acre field has ~29 pixels
- Dominant percentage >90% indicates a clean single-crop field
- These are real CDL classification values for these field locations
