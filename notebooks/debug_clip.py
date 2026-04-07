#!/usr/bin/env python3
"""Debug per-field NDVI clipping."""

import json
import numpy as np
import rasterio
from pathlib import Path
from shapely.geometry import mapping
import geopandas as gpd
from rasterio.mask import mask as rasterio_mask

FIELDS_FILE = Path("notebooks/data/field_boundaries/jefferson_farm_fields.geojson")
NDVI_FILE = Path("notebooks/data/ndvi/ndvi_2024_04.tif")
OUTPUT_FILE = Path("notebooks/data/ndvi_per_field/per_field_ndvi.json")

# Load fields
fields = gpd.read_file(str(FIELDS_FILE))
print(f"Loaded {len(fields)} fields")
print(f"Fields CRS: {fields.crs}")
print(f"Fields columns: {list(fields.columns)}")

# Check NDVI
with rasterio.open(NDVI_FILE) as src:
    print(f"\nNDVI CRS: {src.crs}")
    print(f"NDVI bounds: {src.bounds}")
    print(f"NDVI shape: {src.shape}")
    ndvi_data = src.read(1)
    print(f"NDVI range: {np.nanmin(ndvi_data):.3f} to {np.nanmax(ndvi_data):.3f}")
    print(f"NDVI valid pixels: {np.sum(~np.isnan(ndvi_data))}")

# Try clipping first field
print("\n--- Testing first field ---")
field = fields.iloc[0]
print(f"Field name: {field.get('name', field.get('Name', 'N/A'))}")

# Get geometry as geojson dict
geom = field.geometry
print(f"Field geometry type: {geom.geom_type}")

# Try different formats
geom_dict = mapping(geom)
print(f"Geometry as dict type: {geom_dict.get('type')}")

# Try clipping
try:
    with rasterio.open(NDVI_FILE) as src:
        # Try with list of geometry dicts
        geom_list = [geom_dict]
        out_image, out_transform = rasterio_mask(src, geom_list, crop=True, nodata=np.nan)
        print(f"Clipped shape: {out_image.shape}")
        print(f"Valid pixels: {np.sum(~np.isnan(out_image))}")
except Exception as e:
    print(f"Error with [geom_dict]: {e}")

# Try with geopandas geometry directly  
try:
    with rasterio.open(NDVI_FILE) as src:
        geom_list = [field.geometry]
        out_image, out_transform = rasterio_mask(src, geom_list, crop=True, nodata=np.nan)
        print(f"Clipped shape (geopandas): {out_image.shape}")
        print(f"Valid pixels (geopandas): {np.sum(~np.isnan(out_image))}")
except Exception as e:
    print(f"Error with geopandas: {e}")

# Check if geometry is valid
print(f"\nField geometry valid: {geom.is_valid}")
print(f"Field geometry area: {geom.area}")

# Check bounds
print(f"Field bounds: {geom.bounds}")
with rasterio.open(NDVI_FILE) as src:
    print(f"NDVI bounds: {src.bounds}")
