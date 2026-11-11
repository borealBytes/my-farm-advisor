# Field Boundaries Example Data

This directory contains sample field boundary data downloaded from USDA NASS Crop Sequence Boundaries.

## Files

- **real_10_fields_iowa.geojson** - 10 real agricultural field boundaries from Iowa

## Data Source

- **Provider**: USDA National Agricultural Statistics Service (NASS)
- **Dataset**: Crop Sequence Boundaries (CSB) 2023
- **Access**: Source Cooperative (<https://source.coop/fiboa/us-usda-cropland>)
- **Format**: GeoJSON
- **CRS**: EPSG:4326 (WGS84)

## Fields Included

| Field ID prefix | Region    | State | Crop label |
| --------------- | --------- | ----- | ---------- |
| OSM_*           | corn_belt | Iowa  | farmland or meadow |

## Usage

```python
import geopandas as gpd

# Load sample fields
fields = gpd.read_file('real_10_fields_iowa.geojson')

# View data
print(fields[['field_id', 'region', 'area_acres', 'crop_name']])

# Plot
fields.plot()
```

## Notes

- These are real field boundaries from Iowa
- Downloaded using the `field-boundaries` skill
- Used as reference data for testing and examples
