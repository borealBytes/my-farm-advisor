#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path

import pandas as pd

from bootstrap_runtime import ensure_runtime_environment

ensure_runtime_environment()

from lib.paths import DATA_ROOT, SCRIPTS_ROOT, shared_manifest_dir
from reporting_bootstrap import ensure_canonical_data_tree

DEFAULT_START_YEAR = 2021
DEFAULT_END_YEAR = 2025


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare multi-year shared maturity-by-FIPS weather, GDD, corn RM, and soybean MG outputs"
    )
    parser.add_argument(
        "--start-year",
        type=int,
        default=DEFAULT_START_YEAR,
        help=f"First annual output year when --years is not provided (default: {DEFAULT_START_YEAR})",
    )
    parser.add_argument(
        "--end-year",
        type=int,
        default=DEFAULT_END_YEAR,
        help=f"Last annual output year when --years is not provided (default: {DEFAULT_END_YEAR})",
    )
    parser.add_argument(
        "--years",
        default=None,
        help="Comma-separated annual output years; overrides --start-year/--end-year",
    )
    parser.add_argument("--weather-source", default="nasa-power")
    parser.add_argument(
        "--weather-backend",
        choices=["zarr", "api"],
        default="zarr",
        help="County weather backend; zarr avoids POWER point API rate limits",
    )
    parser.add_argument(
        "--weather-time-standard",
        choices=["lst", "utc"],
        default="lst",
        help="NASA POWER time standard for county weather outputs",
    )
    parser.add_argument(
        "--coverage",
        choices=["traditional-corn-belt", "lower48"],
        default="lower48",
        help="Shared county weather scope for annual maturity outputs",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Rebuild annual outputs even when target files already exist",
    )
    parser.add_argument(
        "--list-years",
        action="store_true",
        help="Print the resolved years and exit",
    )
    return parser.parse_args()


def _iso_now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def _runtime_relative(path: Path) -> str:
    try:
        return str(path.resolve(strict=False).relative_to(DATA_ROOT))
    except ValueError:
        return str(path)


def _resolve_years(args: argparse.Namespace) -> list[int]:
    if args.years:
        years = sorted({int(part.strip()) for part in args.years.split(",") if part.strip()})
    else:
        if args.start_year > args.end_year:
            raise SystemExit("--start-year must be <= --end-year")
        years = list(range(args.start_year, args.end_year + 1))
    if not years:
        raise SystemExit("At least one maturity year is required")
    return years


def _file_record(path: Path) -> dict[str, object]:
    record: dict[str, object] = {
        "path": _runtime_relative(path),
        "exists": path.exists(),
    }
    if path.exists():
        record["size_bytes"] = path.stat().st_size
    return record


def _object_int(value: object) -> int:
    if isinstance(value, (int, float, str)):
        return int(value)
    return 0


def _year_outputs(year: int, weather_source: str) -> list[Path]:
    from lib.paths import (
        shared_corn_gdd_table_path,
        shared_corn_rm_csv_path,
        shared_corn_rm_table_path,
        shared_soybean_mg_csv_path,
        shared_soybean_mg_table_path,
        shared_weather_county_table_path,
    )

    return [
        shared_weather_county_table_path(weather_source, year, "daily_weather_by_fips.parquet"),
        shared_weather_county_table_path(weather_source, year, "county_weather_coverage_summary.json"),
        shared_corn_gdd_table_path(year),
        shared_corn_rm_table_path(year),
        shared_corn_rm_csv_path(year),
        shared_soybean_mg_table_path(year),
        shared_soybean_mg_csv_path(year),
    ]


def _average_outputs(start_year: int, end_year: int) -> list[Path]:
    from lib.paths import (
        shared_corn_maturity_metadata_dir,
        shared_corn_rm_average_csv_path,
        shared_corn_rm_average_table_path,
        shared_soybean_maturity_metadata_dir,
        shared_soybean_mg_average_csv_path,
        shared_soybean_mg_average_table_path,
    )

    return [
        shared_corn_rm_average_table_path(start_year, end_year),
        shared_corn_rm_average_csv_path(start_year, end_year),
        shared_corn_maturity_metadata_dir() / f"rm_by_fips_{start_year}_{end_year}_average.json",
        shared_soybean_mg_average_table_path(start_year, end_year),
        shared_soybean_mg_average_csv_path(start_year, end_year),
        shared_soybean_maturity_metadata_dir() / f"mg_by_fips_{start_year}_{end_year}_average.json",
    ]


def _average_numeric_columns(
    frames: list[pd.DataFrame], *, value_columns: list[str], average_years: list[int]
) -> pd.DataFrame:
    combined = pd.concat(frames, ignore_index=True)
    combined["fips"] = combined["fips"].astype(str).str.zfill(5)
    for column in value_columns:
        combined[column] = pd.to_numeric(combined[column], errors="coerce")
    id_columns = [
        column
        for column in ["fips", "state_fips", "county_fips", "county_name", "county_name_full"]
        if column in combined.columns
    ]
    averaged = (
        combined.groupby(id_columns, dropna=False)
        .agg(
            **{
                column: (column, "mean")
                for column in value_columns
            },
            years_in_average=("year", "nunique"),
            min_annual_year=("year", "min"),
            max_annual_year=("year", "max"),
        )
        .reset_index()
        .sort_values("fips")
        .reset_index(drop=True)
    )
    for column in value_columns:
        averaged[column] = averaged[column].round(1)
    averaged.insert(0, "year_start", min(average_years))
    averaged.insert(1, "year_end", max(average_years))
    averaged.insert(2, "aggregation", "mean")
    return averaged


def _write_average_outputs(years: list[int]) -> dict[str, object]:
    from lib.paths import (
        shared_corn_maturity_metadata_dir,
        shared_corn_rm_average_csv_path,
        shared_corn_rm_average_table_path,
        shared_corn_rm_table_path,
        shared_soybean_maturity_metadata_dir,
        shared_soybean_mg_average_csv_path,
        shared_soybean_mg_average_table_path,
        shared_soybean_mg_table_path,
    )

    average_years = sorted(years)[-5:]
    start_year = min(average_years)
    end_year = max(average_years)
    corn_frames = [pd.read_parquet(shared_corn_rm_table_path(year)) for year in average_years]
    soybean_frames = [pd.read_parquet(shared_soybean_mg_table_path(year)) for year in average_years]

    corn_average = _average_numeric_columns(
        corn_frames,
        value_columns=["gdd_total_c", "observation_days", "rm_relative_maturity"],
        average_years=average_years,
    )
    corn_average["rm_band"] = (5 * (corn_average["rm_relative_maturity"] / 5).round()).astype(int)
    soybean_average = _average_numeric_columns(
        soybean_frames,
        value_columns=["gdd_total_c", "observation_days", "mg_optimal", "mg_early", "mg_late"],
        average_years=average_years,
    )
    soybean_average["mg_band"] = (soybean_average["mg_optimal"] * 2).round().div(2).round(1)

    corn_table = shared_corn_rm_average_table_path(start_year, end_year)
    corn_csv = shared_corn_rm_average_csv_path(start_year, end_year)
    corn_metadata = shared_corn_maturity_metadata_dir() / f"rm_by_fips_{start_year}_{end_year}_average.json"
    soybean_table = shared_soybean_mg_average_table_path(start_year, end_year)
    soybean_csv = shared_soybean_mg_average_csv_path(start_year, end_year)
    soybean_metadata = shared_soybean_maturity_metadata_dir() / f"mg_by_fips_{start_year}_{end_year}_average.json"

    for path in (corn_table, corn_csv, corn_metadata, soybean_table, soybean_csv, soybean_metadata):
        path.parent.mkdir(parents=True, exist_ok=True)

    corn_average.to_parquet(corn_table, index=False)
    corn_average.to_csv(corn_csv, index=False)
    soybean_average.to_parquet(soybean_table, index=False)
    soybean_average.to_csv(soybean_csv, index=False)

    corn_payload = {
        "product": "corn_rm_by_fips_average",
        "aggregation": "mean",
        "years": average_years,
        "year_start": start_year,
        "year_end": end_year,
        "county_count": int(len(corn_average)),
        "source": "annual rm_by_fips outputs",
        "caveat": "Corn RM averages are planning heuristics derived from county GDD and are not recommendation-grade hybrid guidance.",
        "updated_at": _iso_now(),
    }
    soybean_payload = {
        "product": "soybean_mg_by_fips_average",
        "aggregation": "mean",
        "years": average_years,
        "year_start": start_year,
        "year_end": end_year,
        "county_count": int(len(soybean_average)),
        "source": "annual mg_by_fips outputs",
        "caveat": "Soybean MG averages are latitude/GDD planning heuristics and are not recommendation-grade variety guidance.",
        "updated_at": _iso_now(),
    }
    corn_metadata.write_text(json.dumps(corn_payload, indent=2) + "\n", encoding="utf-8")
    soybean_metadata.write_text(json.dumps(soybean_payload, indent=2) + "\n", encoding="utf-8")

    outputs = _average_outputs(start_year, end_year)
    return {
        "status": "complete",
        "years": average_years,
        "start_year": start_year,
        "end_year": end_year,
        "outputs": [_file_record(path) for path in outputs],
        "total_size_bytes": sum(path.stat().st_size for path in outputs if path.exists()),
    }


def _run_year(args: argparse.Namespace, year: int) -> dict[str, object]:
    command = [
        sys.executable,
        str(SCRIPTS_ROOT / "run_maturity_by_fips.py"),
        "--year",
        str(year),
        "--weather-source",
        args.weather_source,
        "--weather-backend",
        args.weather_backend,
        "--weather-time-standard",
        args.weather_time_standard,
        "--coverage",
        args.coverage,
    ]
    if args.force:
        command.append("--force")

    print(f"run maturity-year {year}: {' '.join(command)}")
    subprocess.run(command, cwd=str(DATA_ROOT), check=True)
    outputs = [_file_record(path) for path in _year_outputs(year, args.weather_source)]
    return {
        "year": year,
        "status": "complete",
        "outputs": outputs,
        "total_size_bytes": sum(
            _object_int(record.get("size_bytes", 0))
            for record in outputs
            if record.get("exists")
        ),
    }


def main() -> int:
    args = parse_args()
    years = _resolve_years(args)
    if args.list_years:
        print(json.dumps({"years": years}, indent=2, sort_keys=True))
        return 0

    ensure_canonical_data_tree(include_farm=False)
    records = [_run_year(args, year) for year in years]
    averages = _write_average_outputs(years)
    total_size_bytes = sum(_object_int(record["total_size_bytes"]) for record in records) + _object_int(
        averages["total_size_bytes"]
    )
    manifest = {
        "years": years,
        "start_year": min(years),
        "end_year": max(years),
        "weather_source": args.weather_source,
        "weather_backend": args.weather_backend,
        "weather_time_standard": args.weather_time_standard,
        "coverage": args.coverage,
        "updated_at": _iso_now(),
        "annual_outputs": records,
        "average_outputs": averages,
        "total_size_bytes": total_size_bytes,
    }
    manifest_path = shared_manifest_dir() / f"maturity_by_fips_{min(years)}_{max(years)}.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "years": years,
                "weather_source": args.weather_source,
                "weather_backend": args.weather_backend,
                "weather_time_standard": args.weather_time_standard,
                "coverage": args.coverage,
                "manifest_path": _runtime_relative(manifest_path),
                "average_outputs": averages,
                "total_size_bytes": total_size_bytes,
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
