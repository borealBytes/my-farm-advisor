#!/usr/bin/env python3
# pyright: reportCallIssue=false
"""
05_eda_overview.py - Combined data overview

Creates an overview of all downloaded data and saves summary statistics.

Input:  All downloaded data (fields, soil, weather, CDL)
Output: growers/default-grower/farms/default-farm/derived/summaries/iowa_field_summary.csv under the runtime root, summary stats
"""

import sys
from pathlib import Path

import geopandas as gpd
import pandas as pd

_SCRIPTS_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))

from lib.paths import (  # noqa: E402
    farm_boundary_path,
    farm_summaries_dir,
    farm_table_path,
    farm_weather_path,
    shared_cdl_year_table_path,
)

_DEFAULT_GROWER = "default-grower"
_DEFAULT_FARM = "default-farm"


def main():
    print("=" * 60)
    print("Step 5: Data Overview")
    print("=" * 60)

    summaries_dir = farm_summaries_dir(_DEFAULT_GROWER, _DEFAULT_FARM)
    summaries_dir.mkdir(parents=True, exist_ok=True)

    # Load all data
    fields = gpd.read_file(farm_boundary_path(_DEFAULT_GROWER, _DEFAULT_FARM))
    soil = pd.read_csv(farm_table_path(_DEFAULT_GROWER, _DEFAULT_FARM, "iowa_10_fields_soil.csv"))
    weather = pd.read_csv(
        farm_weather_path(_DEFAULT_GROWER, _DEFAULT_FARM),
        parse_dates=["date"],
    )
    cdl_2023 = pd.read_csv(shared_cdl_year_table_path(2023))
    cdl_2024 = pd.read_csv(shared_cdl_year_table_path(2024))

    print("\n=== Data Summary ===")
    print(f"Fields: {len(fields)} Iowa corn belt fields")
    print(f"  Total area: {fields['area_acres'].sum():.1f} acres")
    print(f"  Crops (OSM): {fields['crop_name'].value_counts().to_dict()}")

    print(f"\nSoil: {len(soil)} records for {soil['field_id'].nunique()} fields")
    print(f"  Dominant soil types: {soil.groupby('field_id').first()['muname'].to_dict()}")

    print(f"\nWeather: {len(weather)} daily records")
    print(f"  Date range: {weather['date'].min().date()} to {weather['date'].max().date()}")
    print(f"  Mean temp: {weather['T2M'].mean():.1f}C")
    print(f"  Total precip: {weather['PRECTOTCORR'].sum():.1f} mm")

    print(f"\nCDL 2023: {len(cdl_2023)} fields")
    print(f"  Crop types: {cdl_2023['crop_name'].value_counts().to_dict()}")

    # Create merged summary
    dominant_soil = (
        soil.sort_values(["field_id", "comppct_r"], ascending=[True, False])
        .groupby("field_id")
        .first()
        .reset_index()
    )

    summary = fields.merge(
        dominant_soil[
            ["field_id", "muname", "compname", "om_r", "ph1to1h2o_r", "cec7_r", "drainagecl"]
        ],
        on="field_id",
    )
    summary = summary.merge(
        cdl_2023[["field_id", "crop_name", "dominant_pct"]].rename(
            columns={"crop_name": "cdl_2023", "dominant_pct": "cdl_2023_pct"}
        ),
        on="field_id",
    )
    summary = summary.merge(
        cdl_2024[["field_id", "crop_name", "dominant_pct"]].rename(
            columns={"crop_name": "cdl_2024", "dominant_pct": "cdl_2024_pct"}
        ),
        on="field_id",
    )

    output_path = summaries_dir / "iowa_field_summary.csv"
    summary.to_csv(output_path, index=False)
    print(f"\n✓ Saved: {output_path}")

    return summary


if __name__ == "__main__":
    main()
