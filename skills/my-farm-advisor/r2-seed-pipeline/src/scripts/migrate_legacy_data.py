#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
from pathlib import Path

_REPO = Path(__file__).resolve().parents[2]
_DATA = _REPO / "data"

_LEGACY_ROOTS = {
    "cdl": _DATA / "cdl",
    "eda": _DATA / "EDA",
    "field_boundaries": _DATA / "field-boundaries",
    "soil": _DATA / "soil",
    "weather": _DATA / "weather",
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
        _LEGACY_ROOTS["cdl"], _DATA / "shared" / "cdl" / "derived" / "tables"
    )
    print(f"CDL backfill: copied={cdl_copied} existing={cdl_existing}")

    boundary_source = _LEGACY_ROOTS["field_boundaries"] / "iowa_10_fields.geojson"
    boundary_target = (
        _DATA
        / "growers"
        / "iowa-demo-grower"
        / "farms"
        / "iowa-demo-farm"
        / "boundary"
        / "field_boundaries.geojson"
    )
    if boundary_source.exists():
        status = _copy_if_missing(boundary_source, boundary_target)
        print(f"Boundary backfill: {status} -> {boundary_target}")
    else:
        print("Boundary backfill: source missing; nothing to copy")

    soil_copied, soil_existing = _copy_tree(
        _LEGACY_ROOTS["soil"],
        _DATA / "growers" / "iowa-demo-grower" / "farms" / "iowa-demo-farm" / "derived" / "tables",
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
            target = (
                _DATA
                / "growers"
                / "iowa-demo-grower"
                / "farms"
                / "iowa-demo-farm"
                / "fields"
                / field_slug
                / "soil"
                / "ssurgo_soil_types.geojson"
            )
            status = _copy_if_missing(source, target)
            if status == "copied":
                cache_copied += 1
            else:
                cache_existing += 1
    print(f"Soil cache backfill: copied={cache_copied} existing={cache_existing}")

    weather_copied, weather_existing = _copy_tree(
        _LEGACY_ROOTS["weather"],
        _DATA / "growers" / "iowa-demo-grower" / "farms" / "iowa-demo-farm" / "derived" / "tables",
    )
    print(f"Weather backfill: copied={weather_copied} existing={weather_existing}")

    eda_copied, eda_existing = _copy_tree(
        _LEGACY_ROOTS["eda"], _DATA / "reporting" / "legacy-backfill" / "EDA"
    )
    print(f"EDA artifact backfill: copied={eda_copied} existing={eda_existing}")

    if delete_legacy:
        for name, legacy in _LEGACY_ROOTS.items():
            if legacy.exists():
                shutil.rmtree(legacy)
                print(f"Deleted legacy root: {name} -> {legacy}")

    print("\n✓ Legacy backfill complete")


def main() -> None:
    parser = argparse.ArgumentParser(description="Backfill legacy data roots into canonical roots")
    parser.add_argument(
        "--delete-legacy", action="store_true", help="Delete legacy roots after backfill"
    )
    args = parser.parse_args()
    migrate(delete_legacy=args.delete_legacy)


if __name__ == "__main__":
    main()
