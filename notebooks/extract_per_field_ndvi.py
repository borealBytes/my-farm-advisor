#!/usr/bin/env python3
"""Extract per-field NDVI values and generate clipped PNGs for Jefferson Farm."""

import base64
import io
import json
from datetime import datetime
from pathlib import Path

import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
import rasterio
from matplotlib.colors import LinearSegmentedColormap
from rasterio.mask import mask as rasterio_mask
from shapely.geometry import mapping


FIELDS_FILE = Path("notebooks/data/field_boundaries/jefferson_farm_fields.geojson")
NDVI_DIR = Path("notebooks/data/ndvi")
OUTPUT_DIR = Path("notebooks/data/ndvi_per_field")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

COLOR_MAP = LinearSegmentedColormap.from_list(
    "ndvi",
    ["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"],
    N=256
)


def ndvi_to_rgba(ndvi_array: np.ndarray) -> np.ndarray:
    """Convert NDVI array to RGBA image with diverging color scheme.
    
    Green (healthy, 0.8-1.0) -> Yellow (moderate, 0.5-0.6) -> Red (stressed, 0.0-0.2)
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
    
    t = (ndvi_clipped - 0.0) / 0.5
    t = np.clip(t, 0, 1)
    red[mask_low] = 215.0 * (1 - t[mask_low]) + 253.0 * t[mask_low]
    green[mask_low] = 48.0 * (1 - t[mask_low]) + 174.0 * t[mask_low]
    blue[mask_low] = 39.0 * (1 - t[mask_low]) + 94.0 * t[mask_low]
    
    t = (ndvi_clipped - 0.5) / 0.2
    t = np.clip(t, 0, 1)
    red[mask_mid] = 253.0 * (1 - t[mask_mid]) + 254.0 * t[mask_mid]
    green[mask_mid] = 174.0 * (1 - t[mask_mid]) + 224.0 * t[mask_mid]
    blue[mask_mid] = 94.0 * (1 - t[mask_mid]) + 170.0 * t[mask_mid]
    
    t = (ndvi_clipped - 0.7) / 0.3
    t = np.clip(t, 0, 1)
    red[mask_high] = 254.0 * (1 - t[mask_high]) + 118.0 * t[mask_high]
    green[mask_high] = 224.0 * (1 - t[mask_high]) + 189.0 * t[mask_high]
    blue[mask_high] = 170.0 * (1 - t[mask_high]) + 44.0 * t[mask_high]
    
    rgba[..., 0] = np.clip(red, 0, 255).astype(np.uint8)
    rgba[..., 1] = np.clip(green, 0, 255).astype(np.uint8)
    rgba[..., 2] = np.clip(blue, 0, 255).astype(np.uint8)
    rgba[..., 3] = (valid * 255).astype(np.uint8)
    
    return rgba


def extract_field_ndvi(raster_path: Path, geom_dict: dict) -> dict:
    """Extract NDVI statistics for a single field."""
    with rasterio.open(raster_path) as src:
        out_image, _ = rasterio_mask(src, [geom_dict], crop=True, nodata=np.nan)
        data = out_image[0]
        valid = data[~np.isnan(data)]
        
        if len(valid) > 0:
            return {
                "mean": float(np.mean(valid)),
                "std": float(np.std(valid)),
                "min": float(np.min(valid)),
                "max": float(np.max(valid)),
                "pixel_count": int(len(valid)),
                "valid": True
            }
        return {"valid": False, "pixel_count": 0}


def generate_clipped_png(raster_path: Path, geom_dict: dict, bounds: tuple) -> str | None:
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
        
        buf = io.BytesIO()
        plt.figure(figsize=(w/100, h/100), dpi=100)
        plt.imshow(rgba)
        plt.axis("off")
        plt.tight_layout(pad=0)
        plt.savefig(buf, format="png", transparent=True, bbox_inches="tight", pad_inches=0)
        plt.close()
        buf.seek(0)
        b64 = base64.b64encode(buf.read()).decode("utf-8")
        return b64


def main():
    print(f"Loading fields from {FIELDS_FILE}...")
    fields = gpd.read_file(str(FIELDS_FILE))
    print(f"Loaded {len(fields)} fields")
    
    ndvi_files = sorted(NDVI_DIR.glob("ndvi_*.tif"))
    print(f"Found {len(ndvi_files)} NDVI files")
    
    results = {}
    
    for ndvi_file in ndvi_files:
        month_key = ndvi_file.stem
        print(f"\nProcessing {month_key}...")
        
        results[month_key] = {}
        
        with rasterio.open(ndvi_file) as src:
            ndvi_data = src.read(1)
            print(f"  NDVI range: {np.nanmin(ndvi_data):.3f} to {np.nanmax(ndvi_data):.3f}")
        
        for idx, field in fields.iterrows():
            field_name = field.get("Name", field.get("name", f"field_{idx}"))
            geom_dict = mapping(field.geometry)
            bounds = field.geometry.bounds
            
            stats = extract_field_ndvi(ndvi_file, geom_dict)
            
            results[month_key][field_name] = {
                "mean": stats.get("mean"),
                "std": stats.get("std"),
                "min": stats.get("min"),
                "max": stats.get("max"),
                "pixel_count": stats.get("pixel_count"),
                "valid": stats.get("valid", False)
            }
        
        valid_count = sum(1 for v in results[month_key].values() if v.get("valid"))
        print(f"  Extracted stats for {valid_count}/{len(fields)} fields")
    
    output_file = OUTPUT_DIR / "per_field_ndvi.json"
    output_file.write_text(json.dumps(results, indent=2))
    print(f"\nSaved stats to {output_file}")


if __name__ == "__main__":
    main()
