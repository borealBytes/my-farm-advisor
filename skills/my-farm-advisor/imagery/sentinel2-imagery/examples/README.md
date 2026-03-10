# Sentinel-2 Imagery Example Data

This directory contains sample data and metadata for Sentinel-2 imagery processing.

## Files

- **sample_aoi.geojson** - Bounding box AOI (~1km buffer) around field 271623002471299 from field-boundaries examples
- **sample_ndvi_metadata.json** - Metadata for a sample NDVI calculation
- **sample_field_stats.csv** - Example field-level NDVI statistics (time series across 4 dates)
- **sample_ndvi_pixels.csv** - Tiny sample of per-pixel NDVI values (for demos/tests; not a real raster)

## Data Source

- **Provider**: ESA Copernicus Sentinel-2
- **Satellite**: Sentinel-2A/2B
- **Product Type**: S2MSI2A (Level-2A, atmospherically corrected)
- **Resolution**: 10m (RGB + NIR bands)
- **AOI CRS**: EPSG:4326 (GeoJSON / CRS84)
- **Imagery CRS**: Sentinel-2 band rasters are typically delivered in a UTM CRS per tile (your NDVI output will inherit the band CRS)

## Relationship to field-boundaries Skill

The AOI and field IDs in these examples are derived from the `field-boundaries` skill:

- `sample_aoi.geojson` is a bounding box around field `271623002471299` from `../field-boundaries/examples/sample_2_fields.geojson`
- Field IDs in `sample_field_stats.csv` match those in the field-boundaries examples
- Use both skills together: field-boundaries for AOI, sentinel2-imagery for satellite data

## Sample Acquisition

The sample files represent an illustrative Sentinel-2 NDVI workflow:

- **Location**: Corn Belt region, Minnesota (from field-boundaries sample fields)
- **Dates**: 2024-06-15 through 2024-08-01 (4 acquisitions)
- **Cloud Cover**: 8-20%
- **Fields**: 2 agricultural fields (from field-boundaries examples)

## Usage

```python
import json
import pandas as pd
from sentinelsat import read_geojson, geojson_to_wkt

# Load AOI for Sentinel-2 search
aoi = read_geojson('sample_aoi.geojson')
footprint = geojson_to_wkt(aoi)
print(f"Search footprint: {footprint[:60]}...")

# Load NDVI metadata
with open('sample_ndvi_metadata.json') as f:
    metadata = json.load(f)
print(f"Acquisition: {metadata['acquisition_date']}")
print(f"Cloud cover: {metadata['cloud_cover']}%")

# Load field statistics time series
stats = pd.read_csv('sample_field_stats.csv')
print(stats[['field_id', 'acquisition_date', 'mean_ndvi', 'crop_name']])
```

## Notes

- These are small example metadata/stat files for testing and development
- Actual Sentinel-2 imagery must be downloaded from Copernicus
- Use the main SKILL.md for complete download instructions
- Field IDs correspond to the field-boundaries skill examples
- The AOI geometry covers ~2km x 2km around field 271623002471299 in Minnesota
