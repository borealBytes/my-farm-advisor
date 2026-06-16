#!/usr/bin/env python3
"""Generate clipped PNG images for each field per month."""

import base64
import io
import json
from pathlib import Path

import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
import rasterio
from PIL import Image
from rasterio.mask import mask as rasterio_mask
from shapely.geometry import mapping


FIELDS_FILE = Path("notebooks/data/field_boundaries/jefferson_farm_fields.geojson")
NDVI_DIR = Path("notebooks/data/ndvi")
OUTPUT_DIR = Path("notebooks/data/ndvi_per_field")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def ndvi_to_rgba(ndvi_array: np.ndarray) -> np.ndarray:
    """Convert NDVI array to RGBA image with vegetative color scheme.
    
    Green (healthy, 0.8-1.0) -> Bright Yellow (moderate, 0.5-0.6) -> Red (stressed, 0.0-0.2)
    """
    h, w = ndvi_array.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    
    valid = ~np.isnan(ndvi_array)
    ndvi_clipped = np.clip(ndvi_array, -1.0, 1.0)
    
    red = np.zeros_like(ndvi_array, dtype=np.float32)
    green = np.zeros_like(ndvi_array, dtype=np.float32)
    blue = np.zeros_like(ndvi_array, dtype=np.float32)
    
    mask_low = (ndvi_clipped >= 0.0) & (ndvi_clipped < 0.5)
    mask_mid = (ndvi_clipped >= 0.5) & (ndvi_clipped < 0.7)
    mask_high = (ndvi_clipped >= 0.7) & (ndvi_clipped <= 1.0)
    
    # Red (0.0) -> Orange -> Yellow (0.5)
    t = (ndvi_clipped - 0.0) / 0.5
    t = np.clip(t, 0, 1)
    red[mask_low] = 139.0 * (1 - t[mask_low]) + 255.0 * t[mask_low]
    green[mask_low] = 0.0 * (1 - t[mask_low]) + 215.0 * t[mask_low]
    blue[mask_low] = 0.0
    
    # Yellow (0.5) -> Light Green -> Dark Green (1.0)
    t = (ndvi_clipped - 0.5) / 0.5
    t = np.clip(t, 0, 1)
    red[mask_mid] = 255.0 * (1 - t[mask_mid]) + 0.0 * t[mask_mid]
    green[mask_mid] = 215.0 * (1 - t[mask_mid]) + 100.0 * t[mask_mid]
    blue[mask_mid] = 0.0
    
    # For high values (0.7-1.0), transition from light green to dark green
    t = (ndvi_clipped - 0.7) / 0.3
    t = np.clip(t, 0, 1)
    red[mask_high] = 144.0 * (1 - t[mask_high]) + 0.0 * t[mask_high]
    green[mask_high] = 238.0 * (1 - t[mask_high]) + 100.0 * t[mask_high]
    blue[mask_high] = 144.0 * (1 - t[mask_high]) + 0.0 * t[mask_high]
    
    rgba[..., 0] = np.clip(red, 0, 255).astype(np.uint8)
    rgba[..., 1] = np.clip(green, 0, 255).astype(np.uint8)
    rgba[..., 2] = np.clip(blue, 0, 255).astype(np.uint8)
    rgba[..., 3] = (valid * 255).astype(np.uint8)
    
    return rgba


def generate_clipped_png_base64(raster_path: Path, geom_dict: dict) -> str | None:
    """Generate clipped and colored PNG for a field, return as base64."""
    with rasterio.open(raster_path) as src:
        out_image, out_transform = rasterio_mask(src, [geom_dict], crop=True, nodata=np.nan)
        data = out_image[0]
        
        if np.all(np.isnan(data)):
            return None
        
        h, w = data.shape
        if h < 2 or w < 2:
            return None
        
        rgba = ndvi_to_rgba(data)
        
        img = Image.fromarray(rgba, mode='RGBA')
        
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        b64 = base64.b64encode(buf.read()).decode("utf-8")
        return b64


def main():
    print(f"Loading fields from {FIELDS_FILE}...")
    fields = gpd.read_file(str(FIELDS_FILE))
    print(f"Loaded {len(fields)} fields")
    
    ndvi_files = sorted(NDVI_DIR.glob("ndvi_*.tif"))
    print(f"Found {len(ndvi_files)} NDVI files")
    
    all_data = {}
    
    for ndvi_file in ndvi_files:
        month_key = ndvi_file.stem
        print(f"\nProcessing {month_key}...")
        
        all_data[month_key] = {}
        
        for idx, field in fields.iterrows():
            field_name = field.get("Name", field.get("name", f"field_{idx}"))
            geom_dict = mapping(field.geometry)
            
            b64 = generate_clipped_png_base64(ndvi_file, geom_dict)
            all_data[month_key][field_name] = b64
            
            if (idx + 1) % 10 == 0:
                print(f"  Processed {idx + 1}/{len(fields)} fields")
        
        print(f"  Done with {month_key}")
    
    output_file = OUTPUT_DIR / "per_field_images.json"
    output_file.write_text(json.dumps(all_data))
    print(f"\nSaved images to {output_file}")


if __name__ == "__main__":
    main()
