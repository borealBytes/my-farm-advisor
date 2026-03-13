#!/usr/bin/env python3
"""Build canonical county/FIPS weather tables for the lower 48 states."""

from __future__ import annotations

import argparse
import importlib
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any, cast

import pandas as pd
import requests

_SCRIPTS_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _SCRIPTS_DIR.parents[2]
sys.path.insert(0, str(_SCRIPTS_DIR))
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, required=True)
    parser.add_argument("--weather-source", default="nasa-power")
    parser.add_argument(
        "--coverage",
        choices=["traditional-corn-belt", "lower48", "field-mapped"],
        default="traditional-corn-belt",
        help="County weather sourcing mode",
    )
    parser.add_argument(
        "--grower-slug",
        default="iowa-demo-grower",
        help="Used only when coverage=field-mapped",
    )
    parser.add_argument(
        "--farm-slug",
        default="iowa-demo-farm",
        help="Used only when coverage=field-mapped",
    )
    parser.add_argument("--workers", type=int, default=5)
    parser.add_argument("--timeout", type=int, default=60)
    parser.add_argument("--retries", type=int, default=3)
    parser.add_argument("--request-delay", type=float, default=0.5)
    return parser.parse_args()


def _repo_relative(path: Path) -> str:
    return str(path.resolve().relative_to(_REPO_ROOT))


def _paths_module() -> Any:
    return importlib.import_module("paths")


def _maturity_module() -> Any:
    return importlib.import_module("maturity_by_fips")


def _query_grid_weather(
    grid_row: dict[str, object],
    *,
    year: int,
    retries: int,
    timeout: int,
    request_delay: float,
) -> tuple[str, pd.DataFrame | None]:
    start_date = f"{year}-01-01"
    end_date = f"{year}-12-31"
    lat = float(str(grid_row["grid_lat"]))
    lon = float(str(grid_row["grid_lon"]))
    last_error: Exception | None = None
    parameters = [
        "T2M",
        "T2M_MAX",
        "T2M_MIN",
        "PRECTOTCORR",
        "ALLSKY_SFC_SW_DWN",
        "RH2M",
        "WS10M",
    ]

    for attempt in range(retries):
        try:
            response = requests.get(
                "https://power.larc.nasa.gov/api/temporal/daily/point",
                params={
                    "parameters": ",".join(parameters),
                    "community": "AG",
                    "longitude": lon,
                    "latitude": lat,
                    "start": start_date.replace("-", ""),
                    "end": end_date.replace("-", ""),
                    "format": "JSON",
                },
                timeout=timeout,
            )
            response.raise_for_status()
            payload = response.json()
            parameter_data = payload.get("properties", {}).get("parameter", {})
            if not parameter_data:
                return str(grid_row["grid_key"]), None
            dates = list(parameter_data[parameters[0]].keys())
            records: list[dict[str, object]] = []
            for date_key in dates:
                record: dict[str, object] = {
                    "date": pd.to_datetime(date_key, format="%Y%m%d")
                }
                for parameter in parameters:
                    value = parameter_data.get(parameter, {}).get(date_key, -999.0)
                    record[parameter] = None if value == -999.0 else value
                records.append(record)
            weather = pd.DataFrame(records)
            if weather.empty:
                return str(grid_row["grid_key"]), None
            weather.insert(0, "grid_key", str(grid_row["grid_key"]))
            weather.insert(1, "grid_lat", lat)
            weather.insert(2, "grid_lon", lon)
            weather["date"] = pd.to_datetime(weather["date"])
            weather["year"] = weather["date"].dt.year.astype(int)
            ordered_columns = [
                "date",
                "year",
                "grid_key",
                "grid_lat",
                "grid_lon",
                "T2M",
                "T2M_MAX",
                "T2M_MIN",
                "PRECTOTCORR",
                "ALLSKY_SFC_SW_DWN",
                "RH2M",
                "WS10M",
            ]
            if request_delay > 0:
                time.sleep(request_delay)
            return str(grid_row["grid_key"]), cast(
                pd.DataFrame, weather[ordered_columns].copy()
            )
        except Exception as exc:  # requests errors bubble here
            last_error = exc
            if attempt + 1 < retries:
                backoff = (
                    max(request_delay, 1.0)
                    * (5 if "429" in str(exc) else 1.5)
                    * (attempt + 1)
                )
                time.sleep(backoff)

    if last_error is not None:
        print(f"FAILED grid {grid_row['grid_key']}: {last_error}", file=sys.stderr)
    return str(grid_row["grid_key"]), None


def _assign_power_grid(county_lookup: pd.DataFrame) -> pd.DataFrame:
    lookup = county_lookup.copy()
    lookup["grid_lat"] = (lookup["centroid_lat"] / 0.5).round() * 0.5
    lookup["grid_lon"] = (lookup["centroid_lon"] / 0.625).round() * 0.625
    lookup["grid_key"] = (
        lookup["grid_lat"].map("{:.3f}".format)
        + ":"
        + lookup["grid_lon"].map("{:.3f}".format)
    )
    return cast(pd.DataFrame, lookup)


def _build_lower48_county_weather(
    county_lookup: pd.DataFrame,
    *,
    year: int,
    workers: int,
    timeout: int,
    retries: int,
    request_delay: float,
    completed_grid_keys: set[str] | None = None,
) -> tuple[pd.DataFrame, int, int, int]:
    scoped_lookup = _assign_power_grid(county_lookup)
    grid_lookup = cast(
        pd.DataFrame,
        scoped_lookup[["grid_key", "grid_lat", "grid_lon"]]
        .drop_duplicates()
        .reset_index(drop=True),
    )
    total_grid_count = int(len(grid_lookup))
    completed_grid_keys = completed_grid_keys or set()
    if completed_grid_keys:
        grid_lookup = cast(
            pd.DataFrame,
            grid_lookup[
                ~grid_lookup["grid_key"].isin(sorted(completed_grid_keys))
            ].reset_index(drop=True),
        )
        scoped_lookup = cast(
            pd.DataFrame,
            scoped_lookup[
                ~scoped_lookup["grid_key"].isin(sorted(completed_grid_keys))
            ].copy(),
        )
    grids = cast(list[dict[str, object]], grid_lookup.to_dict(orient="records"))
    frames: list[pd.DataFrame] = []
    failures = 0
    queried_grid_count = int(len(grid_lookup))

    if not grids:
        return scoped_lookup.iloc[0:0].copy(), 0, total_grid_count, queried_grid_count

    with ThreadPoolExecutor(max_workers=max(1, workers)) as executor:
        futures = {
            executor.submit(
                _query_grid_weather,
                grid,
                year=year,
                retries=retries,
                timeout=timeout,
                request_delay=request_delay,
            ): str(grid["grid_key"])
            for grid in grids
        }
        for future in as_completed(futures):
            grid_key, weather = future.result()
            if weather is None or weather.empty:
                failures += 1
                scoped_lookup = cast(
                    pd.DataFrame,
                    scoped_lookup[scoped_lookup["grid_key"] != grid_key].copy(),
                )
                continue
            frames.append(weather)

    if not frames:
        raise RuntimeError("No county weather data retrieved for the lower 48 states")

    grid_weather = cast(pd.DataFrame, pd.concat(frames, ignore_index=True))
    county_weather = cast(
        pd.DataFrame,
        scoped_lookup.merge(
            grid_weather, on=["grid_key", "grid_lat", "grid_lon"], how="inner"
        ),
    )
    county_weather["field_count"] = 0
    county_weather = cast(
        pd.DataFrame,
        county_weather[
            [
                "date",
                "year",
                "fips",
                "state_fips",
                "county_fips",
                "county_name",
                "county_name_full",
                "field_count",
                "centroid_lat",
                "centroid_lon",
                "T2M",
                "T2M_MAX",
                "T2M_MIN",
                "PRECTOTCORR",
                "ALLSKY_SFC_SW_DWN",
                "RH2M",
                "WS10M",
            ]
        ].copy(),
    )
    county_weather = cast(
        pd.DataFrame,
        county_weather.sort_values(by=["date", "fips"]).reset_index(drop=True),
    )
    return county_weather, failures, total_grid_count, queried_grid_count


def _build_field_mapped_county_weather(
    *,
    grower_slug: str,
    farm_slug: str,
) -> pd.DataFrame:
    farm_weather_path = _paths_module().farm_weather_path
    farm_table_path = _paths_module().farm_table_path
    aggregate_weather_to_counties = _maturity_module().aggregate_weather_to_counties
    weather_csv = farm_weather_path(grower_slug, farm_slug, 2021, 2025)
    field_fips_path = farm_table_path(
        grower_slug, farm_slug, "field_fips_mapping.parquet"
    )
    weather = pd.read_csv(weather_csv, parse_dates=["date"])
    mapping = pd.read_parquet(field_fips_path)
    return aggregate_weather_to_counties(weather, mapping)


def main() -> int:
    from reporting_bootstrap import ensure_canonical_data_tree, ensure_skill_path

    args = parse_args()
    ensure_canonical_data_tree(grower_slug=args.grower_slug, farm_slug=args.farm_slug)
    ensure_skill_path("maturity-by-fips")
    ensure_skill_path("nasa-power-weather")

    shared_geoadmin_counties_dir = _paths_module().shared_geoadmin_counties_dir
    shared_weather_county_table_path = _paths_module().shared_weather_county_table_path
    build_county_weather_coverage_summary = (
        _maturity_module().build_county_weather_coverage_summary
    )
    county_lookup_for_scope = _maturity_module().county_lookup_for_scope

    table_path = shared_weather_county_table_path(
        args.weather_source, args.year, "daily_weather_by_fips.parquet"
    )
    summary_path = shared_weather_county_table_path(
        args.weather_source, args.year, "county_weather_coverage_summary.json"
    )
    county_lookup = pd.read_parquet(
        shared_geoadmin_counties_dir() / "fips_lookup.parquet"
    )
    scoped_lookup = county_lookup_for_scope(county_lookup, args.coverage)
    existing_weather = pd.DataFrame()
    completed_grid_keys: set[str] = set()
    if table_path.exists() and args.coverage in {"traditional-corn-belt", "lower48"}:
        existing_weather = pd.read_parquet(table_path)
        if not existing_weather.empty and "fips" in existing_weather.columns:
            existing_weather["fips"] = existing_weather["fips"].astype(str).str.zfill(5)
            scoped_fips = sorted(set(scoped_lookup["fips"]))
            existing_weather = cast(
                pd.DataFrame,
                existing_weather[existing_weather["fips"].isin(scoped_fips)].copy(),
            )
            completed_lookup = cast(
                pd.DataFrame,
                scoped_lookup[
                    scoped_lookup["fips"].isin(sorted(set(existing_weather["fips"])))
                ].copy(),
            )
            if not completed_lookup.empty:
                completed_grid_keys = set(
                    _assign_power_grid(completed_lookup)["grid_key"]
                )

    if args.coverage in {"traditional-corn-belt", "lower48"}:
        county_weather_new, failure_count, total_grid_count, queried_grid_count = (
            _build_lower48_county_weather(
                scoped_lookup,
                year=args.year,
                workers=args.workers,
                timeout=args.timeout,
                retries=args.retries,
                request_delay=args.request_delay,
                completed_grid_keys=completed_grid_keys,
            )
        )
        if existing_weather.empty:
            county_weather = county_weather_new
        elif county_weather_new.empty:
            county_weather = existing_weather
        else:
            county_weather = cast(
                pd.DataFrame,
                pd.concat([existing_weather, county_weather_new], ignore_index=True)
                .drop_duplicates(subset=["date", "fips"], keep="last")
                .reset_index(drop=True),
            )
        county_weather = cast(
            pd.DataFrame,
            county_weather[county_weather["year"] == args.year].copy(),
        )
        coverage_lookup = scoped_lookup
    else:
        county_weather = _build_field_mapped_county_weather(
            grower_slug=args.grower_slug,
            farm_slug=args.farm_slug,
        )
        county_weather = county_weather[county_weather["year"] == args.year].copy()
        coverage_lookup = county_lookup
        failure_count = 0
        total_grid_count = 0
        queried_grid_count = 0

    coverage_summary = build_county_weather_coverage_summary(
        county_weather,
        coverage_lookup,
        weather_source=args.weather_source,
        year=args.year,
        coverage_scope=args.coverage,
        county_scope=args.coverage,
        request_failure_count=failure_count,
    )

    table_path.parent.mkdir(parents=True, exist_ok=True)
    county_weather.to_parquet(table_path, index=False)
    summary_path.write_text(
        json.dumps(coverage_summary, indent=2) + "\n", encoding="utf-8"
    )

    print(
        json.dumps(
            {
                "year": args.year,
                "weather_source": args.weather_source,
                "coverage": args.coverage,
                "county_weather_path": _repo_relative(table_path),
                "coverage_summary_path": _repo_relative(summary_path),
                "row_count": int(len(county_weather)),
                "county_count_covered": int(coverage_summary["county_count_covered"]),
                "county_count_uncovered": int(
                    coverage_summary["county_count_uncovered"]
                ),
                "grid_cell_count_total": int(total_grid_count),
                "grid_cell_count_queried": int(queried_grid_count),
                "request_failure_count": int(coverage_summary["request_failure_count"]),
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
