#!/usr/bin/env python3
# pyright: reportMissingImports=false, reportAttributeAccessIssue=false, reportGeneralTypeIssues=false, reportArgumentType=false, reportCallIssue=false
"""Download NASA POWER weather data into canonical grower paths."""

import os
import sys
from pathlib import Path

import geopandas as gpd
import pandas as pd
import requests

_SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))
sys.path.insert(0, str(_SCRIPTS_DIR))

from paths import farm_boundary_path, farm_weather_path, field_weather_path
from reporting_bootstrap import ensure_canonical_data_tree, field_slug_map_from_inventory


def main():
    print("=" * 60)
    print("Step 3: Download NASA POWER Weather Data")
    print("=" * 60)

    grower_slug = os.environ.get("AG_GROWER_SLUG", "iowa-demo-grower")
    farm_slug = os.environ.get("AG_FARM_SLUG", "iowa-demo-farm")
    inventory_path = Path(
        os.environ.get("AG_INVENTORY_CSV", ".sisyphus/evidence/task-3-field-inventory.csv")
    )
    ensure_canonical_data_tree(
        grower_slug=grower_slug, farm_slug=farm_slug, inventory_path=inventory_path
    )

    boundaries_path = farm_boundary_path(grower_slug, farm_slug)
    fields = gpd.read_file(boundaries_path)
    projected = fields.to_crs("EPSG:5070") if fields.crs else fields
    centroids = projected.geometry.centroid
    centroid_wgs84 = gpd.GeoSeries(centroids, crs=projected.crs).to_crs("EPSG:4326")
    fields["lat"] = centroid_wgs84.y.values
    fields["lon"] = centroid_wgs84.x.values
    field_slug_map = field_slug_map_from_inventory(
        inventory_path if inventory_path.exists() else None
    )
    force = os.environ.get("AG_FORCE") == "1"
    combined_output = farm_weather_path(grower_slug, farm_slug)

    if combined_output.exists() and not force:
        weather_df = pd.read_csv(combined_output, parse_dates=["date"])
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
        print(f"skip  weather API fetch (cached): {combined_output}")
        return weather_df

    print(f"Loaded {len(fields)} fields")

    params = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "ALLSKY_SFC_SW_DWN", "RH2M", "WS10M"]

    all_weather = []

    for idx, field in fields.iterrows():
        field_id = field["field_id"]
        lat, lon = field["lat"], field["lon"]

        print(f"Fetching {field_id[-6:]} @ ({lat:.4f}, {lon:.4f})...", end=" ")

        try:
            for year in [2021, 2022, 2023, 2024, 2025]:
                resp = requests.get(
                    "https://power.larc.nasa.gov/api/temporal/daily/point",
                    params={
                        "parameters": ",".join(params),
                        "community": "AG",
                        "longitude": lon,
                        "latitude": lat,
                        "start": f"{year}0101",
                        "end": f"{year}1231",
                        "format": "JSON",
                    },
                    timeout=60,
                )
                resp.raise_for_status()
                data = resp.json()

                param_data = data["properties"]["parameter"]

                for date_str in param_data["T2M"].keys():
                    record = {
                        "field_id": field_id,
                        "lat": lat,
                        "lon": lon,
                        "date": pd.to_datetime(date_str, format="%Y%m%d"),
                        "T2M": param_data["T2M"][date_str],
                        "T2M_MAX": param_data["T2M_MAX"][date_str],
                        "T2M_MIN": param_data["T2M_MIN"][date_str],
                        "PRECTOTCORR": param_data["PRECTOTCORR"][date_str],
                        "ALLSKY_SFC_SW_DWN": param_data["ALLSKY_SFC_SW_DWN"][date_str],
                        "RH2M": param_data["RH2M"][date_str],
                        "WS10M": param_data["WS10M"][date_str],
                    }
                    all_weather.append(record)

            print("OK")

        except Exception as e:
            print(f"FAILED: {e}")

    weather_df = pd.DataFrame(all_weather)
    combined_output.parent.mkdir(parents=True, exist_ok=True)
    weather_df.to_csv(combined_output, index=False)

    if field_slug_map and not weather_df.empty:
        for field_id, field_slug in field_slug_map.items():
            field_weather = weather_df[weather_df["field_id"].astype(str) == str(field_id)].copy()
            if field_weather.empty:
                continue
            target = field_weather_path(grower_slug, farm_slug, field_slug)
            target.parent.mkdir(parents=True, exist_ok=True)
            field_weather.to_csv(target, index=False)

    print(f"\n✓ Downloaded {len(weather_df)} daily weather records")
    print(f"  Date range: {weather_df['date'].min().date()} to {weather_df['date'].max().date()}")
    print(f"  Output: {combined_output}")

    return weather_df


if __name__ == "__main__":
    main()
