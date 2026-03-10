#!/usr/bin/env python3
"""Compute annual county GDD outputs from canonical county weather tables."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import pandas as pd

_SCRIPTS_DIR = Path(__file__).resolve().parent.parent
_REPO_ROOT = _SCRIPTS_DIR.parents[2]
sys.path.insert(0, str(_SCRIPTS_DIR))
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, required=True)
    parser.add_argument("--weather-source", default="nasa-power")
    parser.add_argument("--base-temp-c", type=float, default=10.0)
    parser.add_argument("--max-temp-c", type=float, default=30.0)
    return parser.parse_args()


def _repo_relative(path: Path) -> str:
    return str(path.resolve().relative_to(_REPO_ROOT))


def main() -> int:
    from paths import (
        shared_corn_gdd_table_path,
        shared_corn_maturity_metadata_dir,
        shared_weather_county_table_path,
    )
    from reporting_bootstrap import ensure_canonical_data_tree, ensure_skill_path

    args = parse_args()
    ensure_canonical_data_tree()
    ensure_skill_path("maturity-by-fips")

    from maturity_by_fips import build_gdd_summary, compute_county_gdd

    county_weather_path = shared_weather_county_table_path(
        args.weather_source, args.year, "daily_weather_by_fips.parquet"
    )
    county_weather = pd.read_parquet(county_weather_path)
    county_gdd = compute_county_gdd(
        county_weather,
        base_temp_c=args.base_temp_c,
        max_temp_c=args.max_temp_c,
    )
    gdd_summary = build_gdd_summary(
        county_gdd,
        weather_source=args.weather_source,
        year=args.year,
        base_temp_c=args.base_temp_c,
        max_temp_c=args.max_temp_c,
    )

    gdd_path = shared_corn_gdd_table_path(args.year)
    metadata_path = (
        shared_corn_maturity_metadata_dir() / f"gdd_by_fips_{args.year}.json"
    )
    gdd_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    county_gdd.to_parquet(gdd_path, index=False)
    metadata_path.write_text(json.dumps(gdd_summary, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "year": args.year,
                "weather_source": args.weather_source,
                "gdd_path": _repo_relative(gdd_path),
                "metadata_path": _repo_relative(metadata_path),
                "county_count": int(len(county_gdd)),
                "base_temp_c": float(args.base_temp_c),
                "max_temp_c": float(args.max_temp_c),
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
