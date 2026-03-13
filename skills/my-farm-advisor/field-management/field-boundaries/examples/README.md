# Field Boundaries Example Data

This directory contains sample field boundary data downloaded from USDA NASS Crop Sequence Boundaries.

## Files

- **sample_2_fields.geojson** - 2 real agricultural field boundaries from the Corn Belt region

## Data Source

- **Provider**: USDA National Agricultural Statistics Service (NASS)
- **Dataset**: Crop Sequence Boundaries (CSB) 2023
- **Access**: Source Cooperative (<https://source.coop/fiboa/us-usda-cropland>)
- **Format**: GeoJSON
- **CRS**: EPSG:4326 (WGS84)

## Fields Included

| Field ID        | Region    | State FIPS | Area (acres) | Crop |
| --------------- | --------- | ---------- | ------------ | ---- |
| 271623002471299 | corn_belt | 27 (MN)    | 3.70         | Corn |
| 271623001561551 | corn_belt | 27 (MN)    | 6.41         | Corn |

## Usage

```python
import geopandas as gpd

# Load sample fields
fields = gpd.read_file('sample_2_fields.geojson')

# View data
print(fields[['field_id', 'region', 'area_acres', 'crop_name']])

# Plot
fields.plot()
```

## Notes

- These are real field boundaries from Minnesota (State FIPS: 27)
- Downloaded using the `field-boundaries` skill
- Used as reference data for testing and examples
