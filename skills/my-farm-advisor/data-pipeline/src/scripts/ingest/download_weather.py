#!/usr/bin/env python3
# pyright: reportMissingImports=false, reportAttributeAccessIssue=false, reportGeneralTypeIssues=false, reportArgumentType=false, reportCallIssue=false
"""Download NASA POWER weather data into canonical grower paths."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from typing import cast

import geopandas as gpd
import pandas as pd

_SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))
sys.path.insert(0, str(_SCRIPTS_DIR))

from nasa_power import WEATHER_COLUMNS, assign_power_grid, build_zarr_grid_weather, query_api_point_weather
from paths import farm_boundary_path, farm_manifest_dir, farm_weather_path, field_weather_path
from reporting_bootstrap import ensure_canonical_data_tree, field_slug_map_from_inventory

DEFAULT_START_YEAR = 2021
DEFAULT_END_YEAR = 2025


def _env_int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if raw is None or raw.strip() == "":
        return default
    return int(raw)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--grower-slug", default=os.environ.get("AG_GROWER_SLUG", "default-grower"))
    parser.add_argument("--farm-slug", default=os.environ.get("AG_FARM_SLUG", "default-farm"))
    parser.add_argument(
        "--inventory-csv",
        default=os.environ.get("AG_INVENTORY_CSV"),
        help="Path to field inventory CSV with field_id,field_slug",
    )
    parser.add_argument(
        "--weather-csv",
        default=os.environ.get("AG_WEATHER_CSV"),
        help="Optional canonical weather CSV override to stage into the farm output path",
    )
    parser.add_argument(
        "--weather-backend",
        choices=["zarr", "api"],
        default=os.environ.get("AG_WEATHER_BACKEND", "zarr"),
        help="Use NASA POWER S3 Zarr by default; api keeps the legacy point-request path",
    )
    parser.add_argument(
        "--weather-start-year",
        type=int,
        default=_env_int("AG_WEATHER_START_YEAR", DEFAULT_START_YEAR),
    )
    parser.add_argument(
        "--weather-end-year",
        type=int,
        default=_env_int("AG_WEATHER_END_YEAR", DEFAULT_END_YEAR),
    )
    parser.add_argument(
        "--weather-time-standard",
        choices=["lst", "utc"],
        default=os.environ.get("AG_WEATHER_TIME_STANDARD", "lst"),
        help="NASA POWER time standard for field weather outputs",
    )
    parser.add_argument("--force", action="store_true", default=os.environ.get("AG_FORCE") == "1")
    args = parser.parse_args()
    if args.weather_start_year > args.weather_end_year:
        raise SystemExit("--weather-start-year must be <= --weather-end-year")
    return args


def _resolve_runtime_path(path: str | Path) -> Path:
    candidate = Path(path)
    return candidate if candidate.is_absolute() else Path.cwd() / candidate


def _attach_field_centroids(fields: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
    fields = fields.copy()
    projected = fields.to_crs("EPSG:5070") if fields.crs else fields
    centroids = projected.geometry.centroid
    centroid_wgs84 = gpd.GeoSeries(centroids, crs=projected.crs).to_crs("EPSG:4326")
    fields["lat"] = centroid_wgs84.y.values
    fields["lon"] = centroid_wgs84.x.values
    fields["field_id"] = fields["field_id"].astype(str)
    return fields


def _write_weather_outputs(
    weather_df: pd.DataFrame,
    *,
    combined_output: Path,
    grower_slug: str,
    farm_slug: str,
    field_slug_map: dict[str, str],
) -> None:
    combined_output.parent.mkdir(parents=True, exist_ok=True)
    weather_df.to_csv(combined_output, index=False)

    if field_slug_map and not weather_df.empty:
        for field_id, field_slug in field_slug_map.items():
            field_weather = weather_df[
                weather_df["field_id"].astype(str) == str(field_id)
            ].copy()
            if field_weather.empty:
                continue
            target = field_weather_path(grower_slug, farm_slug, field_slug)
            target.parent.mkdir(parents=True, exist_ok=True)
            field_weather.to_csv(target, index=False)


def _stage_weather_override(weather_csv: str, combined_output: Path) -> pd.DataFrame:
    override_path = _resolve_runtime_path(weather_csv)
    if not override_path.exists():
        raise FileNotFoundError(f"weather CSV override not found: {override_path}")
    weather_df = pd.read_csv(override_path, parse_dates=["date"])
    if "field_id" not in weather_df.columns:
        raise RuntimeError("weather CSV override must include a field_id column")
    missing = [column for column in ["lat", "lon", "date", *WEATHER_COLUMNS] if column not in weather_df.columns]
    if missing:
        raise RuntimeError(f"weather CSV override missing columns: {missing}")
    weather_df = cast(
        pd.DataFrame,
        weather_df[["field_id", "lat", "lon", "date", *WEATHER_COLUMNS]].copy(),
    )
    combined_output.parent.mkdir(parents=True, exist_ok=True)
    weather_df.to_csv(combined_output, index=False)
    return weather_df


def _download_zarr_weather(
    fields: gpd.GeoDataFrame,
    *,
    start_year: int,
    end_year: int,
    time_standard: str,
) -> pd.DataFrame:
    point_lookup = cast(pd.DataFrame, fields[["field_id", "lat", "lon"]].copy())
    scoped_lookup = assign_power_grid(point_lookup, lat_column="lat", lon_column="lon")
    grid_lookup = cast(
        pd.DataFrame,
        scoped_lookup[["grid_key", "grid_lat", "grid_lon"]]
        .drop_duplicates()
        .reset_index(drop=True),
    )
    frames: list[pd.DataFrame] = []
    print(f"Reading NASA POWER Zarr for {len(grid_lookup)} grid cells...")
    for year in range(start_year, end_year + 1):
        print(f"  {year} ({time_standard})", end=" ")
        grid_weather = build_zarr_grid_weather(
            grid_lookup,
            year=year,
            time_standard=time_standard,
        )
        if grid_weather.empty:
            print("FAILED")
            continue
        field_weather = cast(
            pd.DataFrame,
            scoped_lookup.merge(
                grid_weather, on=["grid_key", "grid_lat", "grid_lon"], how="inner"
            ),
        )
        frames.append(
            cast(
                pd.DataFrame,
                field_weather[["field_id", "lat", "lon", "date", *WEATHER_COLUMNS]].copy(),
            )
        )
        print("OK")
    if not frames:
        raise RuntimeError("No field weather data retrieved from NASA POWER Zarr")
    return cast(
        pd.DataFrame,
        pd.concat(frames, ignore_index=True)
        .sort_values(["field_id", "date"])
        .reset_index(drop=True),
    )


def _download_api_weather(
    fields: gpd.GeoDataFrame,
    *,
    start_year: int,
    end_year: int,
    time_standard: str,
) -> pd.DataFrame:
    all_weather: list[pd.DataFrame] = []
    for _, field in fields.iterrows():
        field_id = str(field["field_id"])
        lat = float(field["lat"])
        lon = float(field["lon"])

        print(f"Fetching {field_id[-6:]} @ ({lat:.4f}, {lon:.4f})...", end=" ")
        try:
            field_frames: list[pd.DataFrame] = []
            for year in range(start_year, end_year + 1):
                weather = query_api_point_weather(
                    lat=lat,
                    lon=lon,
                    year=year,
                    time_standard=time_standard,
                    parameters=WEATHER_COLUMNS,
                )
                if weather.empty:
                    continue
                weather.insert(0, "field_id", field_id)
                weather.insert(1, "lat", lat)
                weather.insert(2, "lon", lon)
                field_frames.append(weather[["field_id", "lat", "lon", "date", *WEATHER_COLUMNS]])
            if field_frames:
                all_weather.append(pd.concat(field_frames, ignore_index=True))
            print("OK")
        except Exception as exc:
            print(f"FAILED: {exc}")

    if not all_weather:
        raise RuntimeError("No field weather data retrieved from NASA POWER API")
    return cast(
        pd.DataFrame,
        pd.concat(all_weather, ignore_index=True)
        .sort_values(["field_id", "date"])
        .reset_index(drop=True),
    )


def main():
    print("=" * 60)
    print("Step 3: Download NASA POWER Weather Data")
    print("=" * 60)

    args = parse_args()
    grower_slug = args.grower_slug
    farm_slug = args.farm_slug
    default_inventory = farm_manifest_dir(grower_slug, farm_slug) / "field-inventory.csv"
    inventory_path = _resolve_runtime_path(args.inventory_csv) if args.inventory_csv else default_inventory
    ensure_canonical_data_tree(
        grower_slug=grower_slug, farm_slug=farm_slug, inventory_path=inventory_path
    )

    boundaries_path = farm_boundary_path(grower_slug, farm_slug)
    fields = _attach_field_centroids(gpd.read_file(boundaries_path))
    field_slug_map = field_slug_map_from_inventory(
        inventory_path if inventory_path.exists() else None
    )
    force = bool(args.force)
    combined_output = farm_weather_path(
        grower_slug,
        farm_slug,
        args.weather_start_year,
        args.weather_end_year,
    )

    if args.weather_csv:
        weather_df = _stage_weather_override(args.weather_csv, combined_output)
        _write_weather_outputs(
            weather_df,
            combined_output=combined_output,
            grower_slug=grower_slug,
            farm_slug=farm_slug,
            field_slug_map=field_slug_map,
        )
        print(f"staged weather CSV override: {combined_output}")
        return weather_df

    if combined_output.exists() and not force:
        weather_df = pd.read_csv(combined_output, parse_dates=["date"])
        _write_weather_outputs(
            weather_df,
            combined_output=combined_output,
            grower_slug=grower_slug,
            farm_slug=farm_slug,
            field_slug_map=field_slug_map,
        )
        print(f"skip  weather fetch (cached): {combined_output}")
        return weather_df

    print(f"Loaded {len(fields)} fields")
    print(
        f"Weather backend: {args.weather_backend} "
        f"({args.weather_start_year}-{args.weather_end_year}, {args.weather_time_standard})"
    )

    if args.weather_backend == "zarr":
        weather_df = _download_zarr_weather(
            fields,
            start_year=args.weather_start_year,
            end_year=args.weather_end_year,
            time_standard=args.weather_time_standard,
        )
    else:
        weather_df = _download_api_weather(
            fields,
            start_year=args.weather_start_year,
            end_year=args.weather_end_year,
            time_standard=args.weather_time_standard,
        )

    _write_weather_outputs(
        weather_df,
        combined_output=combined_output,
        grower_slug=grower_slug,
        farm_slug=farm_slug,
        field_slug_map=field_slug_map,
    )

    print(f"\n✓ Downloaded {len(weather_df)} daily weather records")
    print(f"  Date range: {weather_df['date'].min().date()} to {weather_df['date'].max().date()}")
    print(f"  Output: {combined_output}")

    return weather_df


if __name__ == "__main__":
    main()
