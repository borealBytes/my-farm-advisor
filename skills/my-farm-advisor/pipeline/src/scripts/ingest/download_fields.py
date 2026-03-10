#!/usr/bin/env python3
"""Load farm field boundaries into canonical grower paths."""

import os
import sys
from pathlib import Path
from shutil import copy2

import geopandas as gpd

_SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_SCRIPTS_DIR))


def _load_bootstrap_helpers():
    from lib.paths import farm_boundary_path, field_boundary_path
    from reporting_bootstrap import (
        ensure_canonical_data_tree,
        ensure_skill_path,
        field_slug_map_from_inventory,
    )

    ensure_skill_path("field-boundaries")
    from field_boundaries import download_fields  # pyright: ignore[reportMissingImports]

    return (
        farm_boundary_path,
        field_boundary_path,
        ensure_canonical_data_tree,
        field_slug_map_from_inventory,
        download_fields,
    )


def main():
    (
        farm_boundary_path,
        field_boundary_path,
        ensure_canonical_data_tree,
        field_slug_map_from_inventory,
        download_fields,
    ) = _load_bootstrap_helpers()

    print("=" * 60)
    print("Step 1: Load Farm Field Boundaries")
    print("=" * 60)

    grower_slug = os.environ.get("AG_GROWER_SLUG", "iowa-demo-grower")
    farm_slug = os.environ.get("AG_FARM_SLUG", "iowa-demo-farm")
    boundary_source_env = os.environ.get("AG_BOUNDARIES")
    inventory_path = Path(
        os.environ.get("AG_INVENTORY_CSV", ".sisyphus/evidence/task-3-field-inventory.csv")
    )
    ensure_canonical_data_tree(
        grower_slug=grower_slug, farm_slug=farm_slug, inventory_path=inventory_path
    )
    canonical_output = farm_boundary_path(grower_slug, farm_slug)
    canonical_output.parent.mkdir(parents=True, exist_ok=True)
    force = os.environ.get("AG_FORCE") == "1"
    boundary_source = Path(boundary_source_env) if boundary_source_env else None

    if boundary_source and boundary_source.exists():
        if boundary_source.resolve() != canonical_output.resolve():
            copy2(boundary_source, canonical_output)
        fields = gpd.read_file(canonical_output)
        source_label = f"provided boundary source: {boundary_source}"
    elif canonical_output.exists():
        fields = gpd.read_file(canonical_output)
        source_label = f"cached boundary file: {canonical_output}"
    else:
        try:
            fields = download_fields(
                count=10, regions=["corn_belt"], output_path=str(canonical_output)
            )
            source_label = "downloaded demo field sample"
        except Exception as exc:
            if not canonical_output.exists():
                raise
            print(f"  Warning: live boundary download failed ({exc}); reusing {canonical_output}")
            fields = gpd.read_file(canonical_output)
            source_label = f"cached boundary file after download failure: {canonical_output}"

    if force and boundary_source and not boundary_source.exists():
        print(f"  Warning: requested boundary source not found, using {source_label}")

    field_slug_map = field_slug_map_from_inventory(
        inventory_path if inventory_path.exists() else None
    )
    if field_slug_map:
        fields_gdf = gpd.read_file(canonical_output)
        for _, row in fields_gdf.iterrows():
            field_id = str(row.get("field_id", "")).strip()
            field_slug = field_slug_map.get(field_id)
            if not field_slug:
                continue
            single = gpd.GeoDataFrame([row], geometry="geometry", crs=fields_gdf.crs)
            target = field_boundary_path(grower_slug, farm_slug, field_slug)
            target.parent.mkdir(parents=True, exist_ok=True)
            single.to_file(target, driver="GeoJSON")

    print(f"\n✓ Downloaded {len(fields)} fields")
    print(f"  Total area: {fields['area_acres'].sum():.1f} acres")
    print(f"  Source: {source_label}")
    print(f"  Output: {canonical_output}")

    return fields


if __name__ == "__main__":
    main()
