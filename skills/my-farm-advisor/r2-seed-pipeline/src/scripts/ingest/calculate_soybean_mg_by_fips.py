#!/usr/bin/env python3
"""Compute heuristic annual soybean MG outputs from county lookup and GDD tables."""

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
    parser.add_argument("--latitude-intercept", type=float, default=7.5)
    parser.add_argument("--latitude-slope", type=float, default=-0.11)
    return parser.parse_args()


def _repo_relative(path: Path) -> str:
    return str(path.resolve().relative_to(_REPO_ROOT))


def main() -> int:
    from paths import (
        shared_corn_gdd_table_path,
        shared_geoadmin_counties_dir,
        shared_soybean_maturity_metadata_dir,
        shared_soybean_mg_csv_path,
        shared_soybean_mg_table_path,
    )
    from reporting_bootstrap import ensure_canonical_data_tree, ensure_skill_path

    args = parse_args()
    ensure_canonical_data_tree()
    ensure_skill_path("maturity-by-fips")

    from maturity_by_fips import build_soybean_mg_summary, compute_soybean_mg

    county_gdd = pd.read_parquet(shared_corn_gdd_table_path(args.year))
    county_lookup = pd.read_parquet(
        shared_geoadmin_counties_dir() / "fips_lookup.parquet"
    )
    county_mg = compute_soybean_mg(
        county_lookup,
        county_gdd,
        intercept=args.latitude_intercept,
        latitude_slope=args.latitude_slope,
    )
    metadata = build_soybean_mg_summary(
        county_mg,
        year=args.year,
        intercept=args.latitude_intercept,
        latitude_slope=args.latitude_slope,
    )

    mg_path = shared_soybean_mg_table_path(args.year)
    mg_csv_path = shared_soybean_mg_csv_path(args.year)
    metadata_path = (
        shared_soybean_maturity_metadata_dir() / f"mg_by_fips_{args.year}.json"
    )
    mg_path.parent.mkdir(parents=True, exist_ok=True)
    mg_csv_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    county_mg.to_parquet(mg_path, index=False)
    county_mg.to_csv(mg_csv_path, index=False)
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "year": args.year,
                "mg_path": _repo_relative(mg_path),
                "metadata_path": _repo_relative(metadata_path),
                "county_count": int(len(county_mg)),
                "latitude_intercept": float(args.latitude_intercept),
                "latitude_slope": float(args.latitude_slope),
                "mg_csv_path": _repo_relative(mg_csv_path),
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
