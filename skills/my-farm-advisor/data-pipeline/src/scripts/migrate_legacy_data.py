#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from lib.paths import (
    DATA_ROOT,
    farm_boundary_path,
    farm_tables_dir,
    field_soil_polygon_path,
    shared_cdl_tables_dir,
)

_CHECKOUT_SKILL_ROOT = Path(__file__).resolve().parents[3]
_LEGACY_DATA_ROOT = _CHECKOUT_SKILL_ROOT / "data"
_DEFAULT_GROWER = "default-grower"
_DEFAULT_FARM = "default-farm"

_LEGACY_ROOTS = {
    "cdl": _LEGACY_DATA_ROOT / "cdl",
    "eda": _LEGACY_DATA_ROOT / "EDA",
    "field_boundaries": _LEGACY_DATA_ROOT / "field-boundaries",
    "soil": _LEGACY_DATA_ROOT / "soil",
    "weather": _LEGACY_DATA_ROOT / "weather",
}


def _copy_if_missing(source: Path, target: Path) -> str:
    target.parent.mkdir(parents=True, exist_ok=True)
    if target.exists():
        return "exists"
    shutil.copy2(source, target)
    return "copied"


def _copy_tree(source_root: Path, target_root: Path) -> tuple[int, int]:
    copied = 0
    existing = 0
    if not source_root.exists():
        return copied, existing
    for source in source_root.rglob("*"):
        if source.is_dir():
            continue
        rel = source.relative_to(source_root)
        target = target_root / rel
        status = _copy_if_missing(source, target)
        if status == "copied":
            copied += 1
        else:
            existing += 1
    return copied, existing


def _field_slug_from_cache_name(name: str) -> str | None:
    if not name.startswith("OSM_") or not name.endswith("_polygons.geojson"):
        return None
    core = name[len("OSM_") : -len("_polygons.geojson")]
    if not core.isdigit():
        return None
    return f"osm-{core}"


def migrate(delete_legacy: bool = False) -> None:
    print("=" * 60)
    print("Legacy data backfill to canonical roots")
    print("=" * 60)

    cdl_copied, cdl_existing = _copy_tree(
        _LEGACY_ROOTS["cdl"], shared_cdl_tables_dir()
    )
    print(f"CDL backfill: copied={cdl_copied} existing={cdl_existing}")

    boundary_source = _LEGACY_ROOTS["field_boundaries"] / "iowa_10_fields.geojson"
    boundary_target = farm_boundary_path(_DEFAULT_GROWER, _DEFAULT_FARM)
    if boundary_source.exists():
        status = _copy_if_missing(boundary_source, boundary_target)
        print(f"Boundary backfill: {status} -> {boundary_target}")
    else:
        print("Boundary backfill: source missing; nothing to copy")

    soil_copied, soil_existing = _copy_tree(
        _LEGACY_ROOTS["soil"],
        farm_tables_dir(_DEFAULT_GROWER, _DEFAULT_FARM),
    )
    print(f"Soil table backfill: copied={soil_copied} existing={soil_existing}")

    cache_root = _LEGACY_ROOTS["soil"] / "cache"
    cache_copied = 0
    cache_existing = 0
    if cache_root.exists():
        for source in cache_root.glob("*_polygons.geojson"):
            field_slug = _field_slug_from_cache_name(source.name)
            if field_slug is None:
                continue
            target = field_soil_polygon_path(_DEFAULT_GROWER, _DEFAULT_FARM, field_slug)
            status = _copy_if_missing(source, target)
            if status == "copied":
                cache_copied += 1
            else:
                cache_existing += 1
    print(f"Soil cache backfill: copied={cache_copied} existing={cache_existing}")

    weather_copied, weather_existing = _copy_tree(
        _LEGACY_ROOTS["weather"],
        farm_tables_dir(_DEFAULT_GROWER, _DEFAULT_FARM),
    )
    print(f"Weather backfill: copied={weather_copied} existing={weather_existing}")

    eda_copied, eda_existing = _copy_tree(
        _LEGACY_ROOTS["eda"], DATA_ROOT / "reporting" / "legacy-backfill" / "EDA"
    )
    print(f"EDA artifact backfill: copied={eda_copied} existing={eda_existing}")

    if delete_legacy:
        for name, legacy in _LEGACY_ROOTS.items():
            if legacy.exists():
                shutil.rmtree(legacy)
                print(f"Deleted legacy root: {name} -> {legacy}")

    print("\n✓ Legacy backfill complete")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Backfill legacy data roots into canonical roots"
    )
    parser.add_argument(
        "--delete-legacy",
        action="store_true",
        help="Delete legacy roots after backfill",
    )
    args = parser.parse_args()
    migrate(delete_legacy=args.delete_legacy)


if __name__ == "__main__":
    main()
