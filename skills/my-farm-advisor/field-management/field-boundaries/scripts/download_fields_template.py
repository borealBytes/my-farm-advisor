#!/usr/bin/env python3
"""
Template script for downloading field boundaries.

This script downloads agricultural field boundaries from USDA NASS Crop Sequence Boundaries
and saves them for analysis. It creates both GeoJSON and GeoParquet formats.

Edit the parameters below to customize your download.

Usage:
    cd scripts
    python download_fields_template.py

Output:
    - ../data/fields_{region}_{date}.geojson
    - ../data/fields_{region}_{date}.parquet
"""

import sys
from datetime import datetime
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from field_boundaries import download_fields

# ============================================================================
# CUSTOMIZE THESE PARAMETERS
# ============================================================================

# Number of fields to download (keep small for testing: 2-10)
FIELD_COUNT = 10

# Regions to download from
# Options: 'corn_belt', 'great_plains', 'southeast'
REGIONS = ["corn_belt"]

# Crop types to include
# Options: 'corn', 'soybeans', 'wheat', 'cotton'
CROPS = ["corn", "soybeans"]

# Output filename prefix
OUTPUT_PREFIX = "my_fields"

# ============================================================================
# DOWNLOAD SCRIPT
# ============================================================================


def main():
    """Download fields and save to data directory."""

    # Create data directory
    data_dir = Path(__file__).parent.parent / "data"
    data_dir.mkdir(exist_ok=True)

    # Generate filename with date
    date_str = datetime.now().strftime("%Y%m%d")
    regions_str = "_".join(REGIONS)

    print(f"Downloading {FIELD_COUNT} fields...")
    print(f"  Regions: {', '.join(REGIONS)}")
    print(f"  Crops: {', '.join(CROPS)}")
    print()

    # Download fields
    fields = download_fields(count=FIELD_COUNT, regions=REGIONS, crops=CROPS)

    # Save as GeoJSON
    geojson_path = data_dir / f"{OUTPUT_PREFIX}_{regions_str}_{date_str}.geojson"
    fields.to_file(geojson_path, driver="GeoJSON")
    print(f"✓ Saved GeoJSON: {geojson_path}")

    # Save as GeoParquet (smaller, faster)
    parquet_path = data_dir / f"{OUTPUT_PREFIX}_{regions_str}_{date_str}.parquet"
    fields.to_parquet(parquet_path)
    print(f"✓ Saved GeoParquet: {parquet_path}")

    # Print summary
    print()
    print("Download Summary:")
    print(f"  Total fields: {len(fields)}")
    print(f"  Total area: {fields['area_acres'].sum():.1f} acres")
    print(f"  Average size: {fields['area_acres'].mean():.1f} acres")
    print()
    print("Output files:")
    print(f"  - {geojson_path.relative_to(Path(__file__).parent.parent)}")
    print(f"  - {parquet_path.relative_to(Path(__file__).parent.parent)}")

    return fields


if __name__ == "__main__":
    fields = main()
