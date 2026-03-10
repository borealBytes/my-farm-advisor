#!/usr/bin/env python3
"""Compute heuristic annual corn RM outputs from county GDD tables."""

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
    parser.add_argument("--gdd-per-rm-c", type=float, default=20.0)
    return parser.parse_args()


def _repo_relative(path: Path) -> str:
    return str(path.resolve().relative_to(_REPO_ROOT))


def main() -> int:
    from paths import (
        shared_corn_gdd_table_path,
        shared_corn_maturity_metadata_dir,
        shared_corn_rm_csv_path,
        shared_corn_rm_table_path,
    )
    from reporting_bootstrap import ensure_canonical_data_tree, ensure_skill_path

    args = parse_args()
    ensure_canonical_data_tree()
    ensure_skill_path("maturity-by-fips")

    from maturity_by_fips import build_corn_rm_summary, compute_corn_rm

    county_gdd = pd.read_parquet(shared_corn_gdd_table_path(args.year))
    county_rm = compute_corn_rm(county_gdd, gdd_per_rm_c=args.gdd_per_rm_c)
    metadata = build_corn_rm_summary(
        county_rm,
        year=args.year,
        gdd_per_rm_c=args.gdd_per_rm_c,
    )

    rm_path = shared_corn_rm_table_path(args.year)
    rm_csv_path = shared_corn_rm_csv_path(args.year)
    metadata_path = shared_corn_maturity_metadata_dir() / f"rm_by_fips_{args.year}.json"
    rm_path.parent.mkdir(parents=True, exist_ok=True)
    rm_csv_path.parent.mkdir(parents=True, exist_ok=True)
    metadata_path.parent.mkdir(parents=True, exist_ok=True)
    county_rm.to_parquet(rm_path, index=False)
    county_rm.to_csv(rm_csv_path, index=False)
    metadata_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "year": args.year,
                "rm_path": _repo_relative(rm_path),
                "metadata_path": _repo_relative(metadata_path),
                "county_count": int(len(county_rm)),
                "gdd_per_rm_c": float(args.gdd_per_rm_c),
                "rm_csv_path": _repo_relative(rm_csv_path),
            },
            indent=2,
            sort_keys=True,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
