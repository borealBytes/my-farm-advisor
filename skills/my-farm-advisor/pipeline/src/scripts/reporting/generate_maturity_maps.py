#!/usr/bin/env python3
"""Render static county maturity maps from canonical corn and soybean tables."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

_SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_SCRIPTS_DIR))
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--year", type=int, required=True)
    return parser.parse_args()


def _render_map(
    counties: gpd.GeoDataFrame,
    *,
    value_column: str,
    title: str,
    subtitle: str,
    output_path: Path,
    cmap: str,
) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    fig, ax = plt.subplots(figsize=(14, 9))
    counties.boundary.plot(ax=ax, linewidth=0.15, color="#d1d5db")
    counties.plot(
        ax=ax,
        column=value_column,
        cmap=cmap,
        linewidth=0.2,
        edgecolor="#f9fafb",
        legend=True,
        legend_kwds={"shrink": 0.7, "label": value_column},
        missing_kwds={"color": "#e5e7eb", "label": "No county output"},
    )
    ax.set_title(f"{title}\n{subtitle}", fontsize=14, fontweight="bold")
    ax.axis("off")
    fig.tight_layout()
    fig.savefig(output_path, dpi=180, bbox_inches="tight")
    plt.close(fig)


def main() -> int:
    from paths import (
        shared_corn_maturity_reports_dir,
        shared_corn_rm_table_path,
        shared_geoadmin_counties_dir,
        shared_soybean_maturity_reports_dir,
        shared_soybean_mg_table_path,
    )
    from reporting_bootstrap import ensure_canonical_data_tree, ensure_skill_path

    args = parse_args()
    ensure_canonical_data_tree()
    ensure_skill_path("maturity-by-fips")

    from maturity_by_fips import contiguous_us_counties

    counties = gpd.read_file(shared_geoadmin_counties_dir() / "counties_usa.geojson")
    counties = contiguous_us_counties(counties)
    counties["fips"] = counties["fips"].astype(str)

    corn = pd.read_parquet(shared_corn_rm_table_path(args.year))
    soy = pd.read_parquet(shared_soybean_mg_table_path(args.year))
    corn["fips"] = corn["fips"].astype(str)
    soy["fips"] = soy["fips"].astype(str)

    corn_map = counties.merge(corn[["fips", "rm_relative_maturity"]], on="fips", how="left")
    soy_map = counties.merge(soy[["fips", "mg_optimal"]], on="fips", how="left")

    _render_map(
        corn_map,
        value_column="rm_relative_maturity",
        title=f"Heuristic Corn RM by FIPS - Contiguous U.S. ({args.year})",
        subtitle="Planning layer only - derived from county GDD, not recommendation-grade guidance",
        output_path=shared_corn_maturity_reports_dir() / f"rm_by_fips_{args.year}.png",
        cmap="YlGn",
    )
    _render_map(
        soy_map,
        value_column="mg_optimal",
        title=f"Heuristic Soybean MG by FIPS - Contiguous U.S. ({args.year})",
        subtitle="Planning layer only - latitude-based maturity heuristic, not a planting prescription",
        output_path=shared_soybean_maturity_reports_dir() / f"mg_by_fips_{args.year}.png",
        cmap="YlOrBr",
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
