#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path

from bootstrap_runtime import ensure_runtime_environment

ensure_runtime_environment()

from lib.paths import DATA_ROOT, SCRIPTS_ROOT, shared_manifest_dir
from reporting_bootstrap import ensure_canonical_data_tree


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Initialize shared data-pipeline assets for first-run farm seeding"
    )
    parser.add_argument("--start-year", type=int, default=2021)
    parser.add_argument("--end-year", type=int, default=2025)
    parser.add_argument(
        "--coverage",
        choices=["traditional-corn-belt", "lower48"],
        default="lower48",
        help="County weather and maturity coverage",
    )
    parser.add_argument(
        "--weather-backend",
        choices=["zarr", "api"],
        default="zarr",
        help="Shared county weather backend",
    )
    parser.add_argument(
        "--weather-time-standard",
        choices=["lst", "utc"],
        default="lst",
        help="NASA POWER time standard for shared county weather",
    )
    parser.add_argument(
        "--cdl-scope",
        choices=["conus", "state"],
        default="conus",
        help="Shared CDL raster coverage. CONUS gives all-state support.",
    )
    parser.add_argument(
        "--cdl-state-fips",
        default=None,
        help="Comma-separated state FIPS values when --cdl-scope state",
    )
    parser.add_argument("--cdl-latest-year", type=int, default=2025)
    parser.add_argument("--cdl-window-years", type=int, default=5)
    parser.add_argument("--force", action="store_true")
    parser.add_argument(
        "--skip-maturity",
        action="store_true",
        help="Skip geoadmin, county weather, GDD, corn RM, and soybean MG outputs",
    )
    parser.add_argument("--skip-cdl", action="store_true", help="Skip shared CDL rasters")
    parser.add_argument(
        "--list-steps", action="store_true", help="Print planned commands and exit"
    )
    return parser.parse_args()


def _iso_now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def _runtime_relative(path: Path) -> str:
    try:
        return str(path.resolve(strict=False).relative_to(DATA_ROOT))
    except ValueError:
        return str(path)


def _run(command: list[str]) -> None:
    subprocess.run(command, cwd=str(DATA_ROOT), check=True)


def _commands(args: argparse.Namespace) -> list[tuple[str, list[str]]]:
    commands: list[tuple[str, list[str]]] = []
    if not args.skip_maturity:
        maturity = [
            sys.executable,
            str(SCRIPTS_ROOT / "run_maturity_years_by_fips.py"),
            "--start-year",
            str(args.start_year),
            "--end-year",
            str(args.end_year),
            "--coverage",
            args.coverage,
            "--weather-backend",
            args.weather_backend,
            "--weather-time-standard",
            args.weather_time_standard,
        ]
        if args.force:
            maturity.append("--force")
        commands.append(("shared-maturity", maturity))

    if not args.skip_cdl:
        cdl = [
            sys.executable,
            str(SCRIPTS_ROOT / "ingest" / "download_cdl.py"),
            "--raster-only",
            "--cdl-scope",
            args.cdl_scope,
            "--cdl-latest-year",
            str(args.cdl_latest_year),
            "--cdl-window-years",
            str(args.cdl_window_years),
        ]
        if args.cdl_state_fips:
            cdl.extend(["--cdl-state-fips", args.cdl_state_fips])
        if args.force:
            cdl.append("--force")
        commands.append(("shared-cdl", cdl))
    return commands


def main() -> int:
    args = parse_args()
    if args.start_year > args.end_year:
        raise SystemExit("--start-year must be <= --end-year")
    if args.cdl_window_years <= 0:
        raise SystemExit("--cdl-window-years must be positive")

    commands = _commands(args)
    if args.list_steps:
        print(
            json.dumps(
                {name: command for name, command in commands},
                indent=2,
                sort_keys=True,
            )
        )
        return 0

    ensure_canonical_data_tree(include_farm=False)
    completed: list[dict[str, object]] = []
    for name, command in commands:
        print(f"run {name}: {' '.join(command)}")
        _run(command)
        completed.append({"step": name, "status": "complete"})

    manifest = {
        "updated_at": _iso_now(),
        "start_year": args.start_year,
        "end_year": args.end_year,
        "coverage": args.coverage,
        "weather_backend": args.weather_backend,
        "weather_time_standard": args.weather_time_standard,
        "cdl_scope": args.cdl_scope,
        "cdl_latest_year": args.cdl_latest_year,
        "cdl_window_years": args.cdl_window_years,
        "steps": completed,
    }
    manifest_path = shared_manifest_dir() / "shared_data_initialization.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(
        json.dumps(
            {
                "status": "complete",
                "manifest_path": _runtime_relative(manifest_path),
                "steps": completed,
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
