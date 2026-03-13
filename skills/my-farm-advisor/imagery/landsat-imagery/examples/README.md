# Landsat Imagery Example Data

This directory contains sample Landsat scene metadata for the field-boundaries sample AOI.

## Files

- **sample_scene_metadata.json** — Representative Landsat 8/9 scene metadata from a USGS M2M API search over Minnesota corn fields during the 2024 growing season

## AOI Source

The search bounding box comes from the field-boundaries skill:

- **File**: `.skills/field-boundaries/examples/sample_2_fields.geojson`
- **Fields**: 2 corn fields in Minnesota (State FIPS: 27)
- **Bbox**: `[-95.9483, 44.5544, -92.8838, 47.0645]` (WGS84)

## Scene Metadata

| Scene ID                                 | Satellite | Date       | Cloud % | WRS Path/Row |
| ---------------------------------------- | --------- | ---------- | ------- | ------------ |
| LC09_L2SP_027029_20240710_20240711_02_T1 | Landsat 9 | 2024-07-10 | 4.2     | 027/029      |
| LC08_L2SP_027029_20240718_20240723_02_T1 | Landsat 8 | 2024-07-18 | 8.7     | 027/029      |
| LC09_L2SP_027029_20240726_20240727_02_T1 | Landsat 9 | 2024-07-26 | 12.1    | 027/029      |
| LC09_L2SP_028029_20240801_20240802_02_T1 | Landsat 9 | 2024-08-01 | 6.3     | 028/029      |
| LC08_L2SP_027029_20240819_20240822_02_T1 | Landsat 8 | 2024-08-19 | 15.4    | 027/029      |

## Usage

```python
import json

# Load scene metadata
with open('examples/sample_scene_metadata.json') as f:
    data = json.load(f)

# List available scenes
for scene in data['scenes']:
    print(f"{scene['display_id']} — {scene['acquisition_date']} — cloud: {scene['cloud_cover']}%")

# Get the clearest scene
best = sorted(data['scenes'], key=lambda s: s['cloud_cover'])[0]
print(f"\nBest scene: {best['display_id']} ({best['cloud_cover']}% cloud)")
```

## Data Source

- **Provider**: USGS / NASA
- **Dataset**: Landsat Collection 2 Level-2 Science Products
- **Access**: USGS EarthExplorer M2M API via `landsatxplore`
- **CRS**: EPSG:32615 (UTM Zone 15N — native), EPSG:4326 (WGS84 — for field integration)

## Notes

- These are representative metadata records (actual imagery requires a USGS EarthExplorer account)
- Collection 2 Level-2 products include surface reflectance (SR) and surface temperature (ST)
- Scene IDs follow the Landsat Product Identifier format: `LXSS_LLLL_PPPRRR_YYYYMMDD_yyyymmdd_CC_TX`
- WRS path/row 027/029 and 028/029 cover central Minnesota
