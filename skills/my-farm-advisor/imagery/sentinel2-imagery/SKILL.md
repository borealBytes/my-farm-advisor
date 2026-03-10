---
name: sentinel2-imagery
description: Download Sentinel-2 Level-2A imagery for an AOI, compute NDVI with rasterio, and extract per-field NDVI statistics. Use when you need cloud-filtered Sentinel-2 scenes and field-level vegetation metrics.
license: MIT
compatibility: Requires Python 3.11+, internet access, and a Copernicus Data Space account. Uses uv for setup, sentinelsat for search/download, and rasterio for raster processing.
metadata:
  author: Boreal Bytes
  version: '1.0.0'
  category: geospatial
  tags: sentinel-2, copernicus, remote-sensing, ndvi, rasterio, sentinelsat, agriculture
---

# Sentinel-2 Imagery Skill

_Standard-library workflow using `sentinelsat` + `rasterio`._

---

## What this skill covers

1. Build an AOI (area of interest) from field boundaries (GeoJSON)
2. Search Sentinel-2 products by date range and cloud cover
3. Download a product ZIP and extract the `.SAFE` directory
4. Read JP2 bands (B04 red, B08 NIR) and compute NDVI
5. Reproject field boundaries to the raster CRS and compute per-field NDVI stats
6. Select best cloud-filtered scenes and prepare reporting-friendly NDVI time-series summaries for poster and HTML outputs

## Class 7 NDVI panel mapping (canonical)

When asked for a Class 7 NDVI panel/grid output, route to this canonical
workflow script:

```bash
python docs/classes/examples/class7-satellite-and-drone-intelligence/07-complete-workflow/scripts/08_make_visualization_grid.py
```

Expected final artifact path:

- `docs/classes/examples/class7-satellite-and-drone-intelligence/07-complete-workflow/output/visualization_grid_OSM_21854396.png`

Expected scope for the final panel workflow:

- 2025 growing season (`2025-03-01` to `2025-11-30`)
- 3x4 grid with explicit `combined NDVI` and `scaled NDVI (0-1)` labeling
- cloud diagnostics including cloud-masked overlay and cloud-frequency heatmap
- scaled NDVI is derived directly from the same combined NDVI scene (value
  stretch only to [0,1], no geometry/projection change)

## Example AOI (from field-boundaries)

Use the field-boundaries sample data as your AOI source:

- `../field-boundaries/examples/sample_2_fields.geojson`

This skill also includes a small AOI GeoJSON you can use immediately:

- `examples/sample_aoi.geojson`

## Example outputs (for testing)

This skill includes small, non-imagery example files you can use for tests and demos:

- `examples/sample_ndvi_metadata.json`
- `examples/sample_field_stats.csv`
- `examples/sample_ndvi_pixels.csv`

## UV environment setup

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh

cd .skills/sentinel2-imagery
uv venv .venv
source .venv/bin/activate

uv pip install sentinelsat rasterio geopandas shapely pyproj numpy pandas matplotlib
```

## Credentials (environment variables)

Never commit credentials.

```bash
export COPERNICUS_USERNAME='your_username'
export COPERNICUS_PASSWORD='your_password'
export COPERNICUS_API_URL='https://apihub.copernicus.eu/apihub'
```

## Real example: search + download one Sentinel-2 L2A product

```bash
cd .skills/sentinel2-imagery

uv run \
  --with sentinelsat \
  --with pandas \
  python << 'PY'
import os
from sentinelsat import SentinelAPI, read_geojson, geojson_to_wkt

api = SentinelAPI(
    os.environ['COPERNICUS_USERNAME'],
    os.environ['COPERNICUS_PASSWORD'],
    os.environ.get('COPERNICUS_API_URL', 'https://apihub.copernicus.eu/apihub'),
)

footprint = geojson_to_wkt(read_geojson('examples/sample_aoi.geojson'))

products = api.query(
    footprint,
    date=('20240601', '20240831'),
    platformname='Sentinel-2',
    producttype='S2MSI2A',
    cloudcoverpercentage=(0, 20),
)

df = api.to_dataframe(products)
if df.empty:
    raise SystemExit('No products found. Widen date range or increase cloud limit.')

df = df.sort_values(['cloudcoverpercentage', 'beginposition'])
product_id = df.index[0]
title = df.loc[product_id, 'title']
cloud = df.loc[product_id].get('cloudcoverpercentage', None)

print(f"Selected: {title} (cloud={cloud}%)")
download = api.download(product_id, directory_path='data/sentinel2')
print(f"Saved: {download['path']}")
PY
```

## Real example: unzip, compute NDVI, and extract per-field stats

This example:

- downloads a scene for `examples/sample_aoi.geojson`
- extracts B04/B08 10 m JP2 band files from the `.SAFE`
- writes an NDVI GeoTIFF
- computes per-field NDVI stats using `../field-boundaries/examples/sample_2_fields.geojson`

```bash
cd .skills/sentinel2-imagery

uv run \
  --with sentinelsat \
  --with rasterio \
  --with geopandas \
  --with numpy \
  --with pandas \
  python << 'PY'
import os
import zipfile
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
import rasterio
from rasterio.mask import mask
from sentinelsat import SentinelAPI, read_geojson, geojson_to_wkt


def find_band_jp2(safe_dir: Path, band: str, resolution: str = '10m') -> Path:
    pattern = f"*_{band}_{resolution}.jp2"
    matches = list(safe_dir.rglob(pattern))
    if not matches:
        raise FileNotFoundError(f"Could not find {pattern} under {safe_dir}")
    return matches[0]


def write_ndvi(red_path: Path, nir_path: Path, out_path: Path) -> Path:
    with rasterio.open(red_path) as red_src:
        red = red_src.read(1).astype('float32')
        profile = red_src.profile.copy()

    with rasterio.open(nir_path) as nir_src:
        nir = nir_src.read(1).astype('float32')

    denom = nir + red
    ndvi = np.where(denom != 0, (nir - red) / denom, np.nan).astype('float32')

    out_path.parent.mkdir(parents=True, exist_ok=True)
    profile.update(dtype='float32', count=1, nodata=np.nan, compress='lzw')
    with rasterio.open(out_path, 'w', **profile) as dst:
        dst.write(ndvi, 1)

    return out_path


api = SentinelAPI(
    os.environ['COPERNICUS_USERNAME'],
    os.environ['COPERNICUS_PASSWORD'],
    os.environ.get('COPERNICUS_API_URL', 'https://apihub.copernicus.eu/apihub'),
)

footprint = geojson_to_wkt(read_geojson('examples/sample_aoi.geojson'))
products = api.query(
    footprint,
    date=('20240601', '20240831'),
    platformname='Sentinel-2',
    producttype='S2MSI2A',
    cloudcoverpercentage=(0, 20),
)

df = api.to_dataframe(products)
if df.empty:
    raise SystemExit('No products found.')

df = df.sort_values(['cloudcoverpercentage', 'beginposition'])
product_id = df.index[0]
title = df.loc[product_id, 'title']

download = api.download(product_id, directory_path='data/sentinel2')
zip_path = Path(download['path'])

extract_root = Path('data/sentinel2/extracted') / zip_path.stem
extract_root.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(zip_path) as zf:
    zf.extractall(extract_root)

safe_dirs = [p for p in extract_root.iterdir() if p.suffix == '.SAFE']
if not safe_dirs:
    raise SystemExit(f"No .SAFE directory found under {extract_root}")
safe_dir = safe_dirs[0]

red_path = find_band_jp2(safe_dir, 'B04', '10m')
nir_path = find_band_jp2(safe_dir, 'B08', '10m')

ndvi_path = write_ndvi(
    red_path,
    nir_path,
    Path('data/sentinel2/ndvi') / f"{title}_NDVI.tif",
)

fields = gpd.read_file('../field-boundaries/examples/sample_2_fields.geojson')

rows = []
with rasterio.open(ndvi_path) as src:
    fields_proj = fields.to_crs(src.crs)

    for idx, field in fields_proj.iterrows():
        geom = [field.geometry.__geo_interface__]
        out, _ = mask(src, geom, crop=True, nodata=np.nan)
        data = out[0]
        valid = data[~np.isnan(data)]
        if valid.size == 0:
            continue

        rows.append({
            'field_id': str(field.get('field_id', idx)),
            'mean_ndvi': float(np.mean(valid)),
            'min_ndvi': float(np.min(valid)),
            'max_ndvi': float(np.max(valid)),
            'std_ndvi': float(np.std(valid)),
            'pixel_count': int(valid.size),
            'product_title': str(title),
        })

stats = pd.DataFrame(rows)
out_csv = Path('data/sentinel2/field_ndvi_stats.csv')
out_csv.parent.mkdir(parents=True, exist_ok=True)
stats.to_csv(out_csv, index=False)
print(f"Wrote: {out_csv}")
print(stats)
PY
```

## AOI pattern: union polygon (tighter than bbox)

If you want a tighter AOI than the included bbox sample, build a union polygon from the field boundaries:

```python
import geopandas as gpd
from shapely.geometry import mapping
from sentinelsat import geojson_to_wkt

fields = gpd.read_file('../field-boundaries/examples/sample_2_fields.geojson')
union = fields.unary_union

feature_collection = {
    'type': 'FeatureCollection',
    'features': [{'type': 'Feature', 'properties': {}, 'geometry': mapping(union)}],
}

footprint = geojson_to_wkt(feature_collection)
```

## Reusable Panel Output (Class 7 style)

If the user asks for a panel NDVI visualization, use the reproducible Class 7 panel script:

```bash
python docs/classes/examples/class7-satellite-and-drone-intelligence/07-complete-workflow/scripts/08_make_visualization_grid.py
```

This generates a publication-style 3x4 grid for one field with:

- Sentinel red + NIR and Landsat red + NIR context panels
- RGB composite and Sentinel/Landsat NDVI panels
- Cloud-masked NDVI with masked-cell annotation
- Combined NDVI panel and scaled NDVI (0-1) panel
- Cloud-frequency heatmap panel
- In-season Sentinel NDVI time series with IQR bounds

Primary output:

- `docs/classes/examples/class7-satellite-and-drone-intelligence/07-complete-workflow/output/visualization_grid_OSM_21854396.png`

## Troubleshooting

| Symptom                   | Likely cause                 | Fix                                                                      |
| ------------------------- | ---------------------------- | ------------------------------------------------------------------------ |
| Auth fails                | Wrong credentials / endpoint | Check `COPERNICUS_USERNAME`, `COPERNICUS_PASSWORD`, `COPERNICUS_API_URL` |
| Query returns no products | Filters too strict           | Widen date range or raise cloud max                                      |
| `mask()` returns empty    | CRS mismatch                 | Always `fields.to_crs(src.crs)` before clipping                          |
| Band JP2 not found        | Different SAFE layout        | Print `safe_dir.rglob('*.jp2')` to inspect names                         |

## References

- [sentinelsat API overview](https://sentinelsat.readthedocs.io/en/stable/api_overview.html)
- [sentinelsat API reference (SentinelAPI defaults)](https://sentinelsat.readthedocs.io/en/v1.1.0/api_reference.html)
- [rasterio documentation](https://rasterio.readthedocs.io/)
- [Copernicus Data Space documentation](https://documentation.dataspace.copernicus.eu/)
