#!/usr/bin/env python3
"""Download monthly Sentinel-2 NDVI for Jefferson Farm fields."""

import gc
import json
from datetime import datetime
from pathlib import Path

import planetary_computer
import pystac_client
import rasterio
import numpy as np
import requests
from rasterio.warp import reproject, Resampling, transform_bounds


BOUNDS_FILE = Path("notebooks/data/field_boundaries/bounds.json")
OUTPUT_DIR = Path("notebooks/data/ndvi")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

PLANETARY_COMPUTER_STAC_URL = "https://planetarycomputer.microsoft.com/api/stac/v1"

MONTHS_2024 = [(2024, m) for m in range(3, 12)]
MONTHS_2025 = [(2025, m) for m in range(3, 12)]


def download_month(year: int, month: int, bounds: list) -> Path | None:
    lon_min, lat_min, lon_max, lat_max = bounds
    start_date = f"{year}-{month:02d}-01"
    end_date = f"{year + 1}-01-01" if month == 12 else f"{year}-{month + 1:02d}-01"
    
    catalog = pystac_client.Client.open(PLANETARY_COMPUTER_STAC_URL)
    search = catalog.search(
        collections=["sentinel-2-l2a"],
        bbox=bounds,
        datetime=f"{start_date}/{end_date}",
        query={"eo:cloud_cover": {"lt": 20}}
    )
    
    items = list(search.items())
    if not items:
        print(f"  No scenes for {year}-{month:02d}")
        return None
    
    items.sort(key=lambda x: x.properties.get("eo:cloud_cover", 100))
    item = planetary_computer.sign(items[0])
    print(f"  {item.id} (cloud: {item.properties.get('eo:cloud_cover', 'N/A')}%)")
    
    output_path = OUTPUT_DIR / f"ndvi_{year}_{month:02d}.tif"
    if output_path.exists():
        print(f"  Already exists: {output_path.name}")
        return output_path
    
    # Download B04
    b04_href = item.assets["B04"].href
    print(f"  Downloading B04...")
    resp = requests.get(b04_href, stream=True, timeout=300)
    with open("/tmp/B04.tif", "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192 * 10):
            f.write(chunk)
    
    with rasterio.open("/tmp/B04.tif") as src:
        native_bounds = transform_bounds("EPSG:4326", src.crs, lon_min, lat_min, lon_max, lat_max)
        window = rasterio.windows.from_bounds(*native_bounds, src.transform)
        c, r = max(0, int(window.col_off)), max(0, int(window.row_off))
        w, h = max(1, int(window.width)), max(1, int(window.height))
        window = rasterio.windows.Window(c, r, w, h)
        
        b04 = src.read(1, window=window)
        src_trans = rasterio.windows.transform(window, src.transform)
        src_crs = src.crs
        del src
    gc.collect()
    
    # Download B08
    b08_href = item.assets["B08"].href
    print(f"  Downloading B08...")
    resp = requests.get(b08_href, stream=True, timeout=300)
    with open("/tmp/B08.tif", "wb") as f:
        for chunk in resp.iter_content(chunk_size=8192 * 10):
            f.write(chunk)
    
    with rasterio.open("/tmp/B08.tif") as src:
        b08 = src.read(1, window=window)
        del src
    gc.collect()
    
    # Compute NDVI
    b04_f = b04.astype(np.float32) / 10000.0
    b08_f = b08.astype(np.float32) / 10000.0
    del b04, b08
    gc.collect()
    
    ndvi = np.where((b08_f + b04_f) != 0, (b08_f - b04_f) / (b08_f + b04_f), np.nan)
    del b04_f, b08_f
    gc.collect()
    
    # Reproject to EPSG:4326
    target_res = 0.0001
    target_w = int((lon_max - lon_min) / target_res)
    target_h = int((lat_max - lat_min) / target_res)
    target_trans = rasterio.transform.from_bounds(lon_min, lat_min, lon_max, lat_max, target_w, target_h)
    
    ndvi_4326 = np.zeros((target_h, target_w), dtype=np.float32)
    reproject(
        source=ndvi,
        destination=ndvi_4326,
        src_crs=src_crs,
        dst_crs="EPSG:4326",
        src_transform=src_trans,
        dst_transform=target_trans,
        resampling=Resampling.bilinear
    )
    del ndvi
    gc.collect()
    
    # Save
    profile = {
        "driver": "GTiff",
        "height": target_h,
        "width": target_w,
        "count": 1,
        "dtype": np.float32,
        "crs": "EPSG:4326",
        "transform": target_trans,
        "nodata": np.nan,
        "compress": "lzw"
    }
    with rasterio.open(output_path, "w", **profile) as dst:
        dst.write(ndvi_4326, 1)
    
    print(f"  Saved: {output_path.name}")
    return output_path


def main():
    bounds_data = json.loads(BOUNDS_FILE.read_text())
    bounds = bounds_data["bbox"]
    
    print(f"Bounds: {bounds}")
    print(f"Output dir: {OUTPUT_DIR}")
    
    all_ndvi_files = []
    
    print("\n" + "=" * 60)
    print("DOWNLOADING 2024 NDVI")
    print("=" * 60)
    for year, month in MONTHS_2024:
        print(f"\n{year}-{month:02d}:")
        path = download_month(year, month, bounds)
        if path:
            all_ndvi_files.append(path)
        gc.collect()
    
    print("\n" + "=" * 60)
    print("DOWNLOADING 2025 NDVI")
    print("=" * 60)
    for year, month in MONTHS_2025:
        print(f"\n{year}-{month:02d}:")
        path = download_month(year, month, bounds)
        if path:
            all_ndvi_files.append(path)
        gc.collect()
    
    manifest = {
        "year": 2026,
        "farm": "Jefferson Farm",
        "years_processed": [2024, 2025],
        "months_per_year": list(range(3, 12)),
        "bounds": bounds,
        "files": [str(f.relative_to(OUTPUT_DIR)) for f in all_ndvi_files]
    }
    
    (OUTPUT_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2))
    print(f"\n\nDone! Downloaded {len(all_ndvi_files)} NDVI files")
    print(f"Manifest saved to {OUTPUT_DIR / 'manifest.json'}")


if __name__ == "__main__":
    main()
