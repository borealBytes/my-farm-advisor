#!/usr/bin/env python3
"""Download Open-Meteo weather data for Jefferson Farm fields using curl."""

import json
import subprocess
import time
from pathlib import Path

import pandas as pd
from shapely.geometry import shape

FIELDS_FILE = Path("notebooks/data/field_boundaries/jefferson_farm_fields.geojson")
OUTPUT_CSV = Path("notebooks/data/weather/jefferson_farm_weather_2024_2025.csv")

START_2024 = "2024-04-01"
END_2024 = "2024-09-30"
START_2025 = "2025-04-01"
END_2025 = "2025-09-30"


def query_open_meteo(lat: float, lon: float, start: str, end: str) -> pd.DataFrame | None:
    """Query Open-Meteo Archive API using curl."""
    try:
        url = (
            f"https://archive-api.open-meteo.com/v1/archive?"
            f"latitude={lat}&longitude={lon}&start_date={start}&end_date={end}&"
            f"daily=temperature_2m_max,temperature_2m_min,precipitation_sum&"
            f"temperature_unit=celsius&precipitation_unit=inch&timezone=America/Denver"
        )
        
        result = subprocess.run(
            ["curl", "-s", "--max-time", "30", url],
            capture_output=True,
            text=True,
            timeout=35
        )
        
        if result.returncode != 0:
            print(f"  curl error: {result.stderr}")
            return None
            
        data = json.loads(result.stdout)
        daily = data.get("daily", {})
        dates = daily.get("time", [])
        
        records = []
        for i, d in enumerate(dates):
            row = {
                "date": pd.to_datetime(d),
                "T2M_MAX": daily.get("temperature_2m_max", [None])[i],
                "T2M_MIN": daily.get("temperature_2m_min", [None])[i],
                "PRECTOTCORR": daily.get("precipitation_sum", [None])[i],
            }
            records.append(row)

        return pd.DataFrame(records)
    except Exception as e:
        print(f"  Error: {e}")
        return None


def calculate_gdd_fahrenheit(t_max_c, t_min_c, base_f=45.0, cap_f=86.0):
    """Calculate daily GDD in Fahrenheit."""
    if t_max_c is None or t_min_c is None:
        return 0.0
    t_max_f = t_max_c * 9 / 5 + 32
    t_min_f = t_min_c * 9 / 5 + 32
    t_avg_f = (t_max_f + t_min_f) / 2
    gdd = max(0, min(t_avg_f, cap_f) - base_f)
    return round(gdd, 2)


def extract_field_centroids(geojson_path: Path) -> list[dict]:
    """Extract field names and centroids from GeoJSON."""
    with open(geojson_path) as f:
        gj = json.load(f)

    fields = []
    for feature in gj["features"]:
        name = feature["properties"].get("Name", "Unknown")
        geom = feature["geometry"]
        if geom["type"] == "Polygon":
            coords = geom["coordinates"][0]
            lons = [c[0] for c in coords]
            lats = [c[1] for c in coords]
            centroid_lon = sum(lons) / len(lons)
            centroid_lat = sum(lats) / len(lats)
        elif geom["type"] == "MultiPolygon":
            all_coords = []
            for poly in geom["coordinates"]:
                for ring in poly:
                    all_coords.extend(ring)
            lons = [c[0] for c in all_coords]
            lats = [c[1] for c in all_coords]
            centroid_lon = sum(lons) / len(lons)
            centroid_lat = sum(lats) / len(lats)
        else:
            continue
        fields.append({
            "field_name": name,
            "lat": round(centroid_lat, 4),
            "lon": round(centroid_lon, 4),
        })
    return fields


def main():
    print("Extracting field centroids...")
    fields = extract_field_centroids(FIELDS_FILE)
    print(f"Found {len(fields)} fields")

    all_dfs = []
    coord_cache = {}

    for i, field in enumerate(fields):
        coord_key = f"{field['lat']},{field['lon']}"
        
        if coord_key in coord_cache:
            print(f"[{i+1}/{len(fields)}] {field['field_name']} - cached")
            df_2024 = coord_cache[coord_key]['2024'].copy()
            df_2025 = coord_cache[coord_key]['2025'].copy()
        else:
            print(f"[{i+1}/{len(fields)}] {field['field_name']} at ({field['lat']}, {field['lon']})...")
            
            df_2024 = query_open_meteo(field['lat'], field['lon'], START_2024, END_2024)
            time.sleep(0.2)
            df_2025 = query_open_meteo(field['lat'], field['lon'], START_2025, END_2025)
            time.sleep(0.2)
            
            if df_2024 is not None and df_2025 is not None:
                coord_cache[coord_key] = {'2024': df_2024, '2025': df_2025}
                print(f"  Got {len(df_2024)} + {len(df_2025)} days")
            else:
                print(f"  FAILED")
                continue

        if df_2024 is not None:
            df_2024["year"] = 2024
            df_2024["field_name"] = field["field_name"]
            df_2024["lat"] = field["lat"]
            df_2024["lon"] = field["lon"]
            all_dfs.append(df_2024)

        if df_2025 is not None:
            df_2025["year"] = 2025
            df_2025["field_name"] = field["field_name"]
            df_2025["lat"] = field["lat"]
            df_2025["lon"] = field["lon"]
            all_dfs.append(df_2025)

        if (i + 1) % 10 == 0:
            temp_df = pd.concat(all_dfs, ignore_index=True)
            temp_df["gdd_daily"] = temp_df.apply(
                lambda r: calculate_gdd_fahrenheit(r["T2M_MAX"], r["T2M_MIN"], 45.0, 86.0),
                axis=1
            )
            temp_df.to_csv(OUTPUT_CSV, index=False)
            print(f"  [Checkpoint] Saved {len(temp_df)} rows")

    if not all_dfs:
        print("No data retrieved!")
        return

    result = pd.concat(all_dfs, ignore_index=True)
    result["gdd_daily"] = result.apply(
        lambda r: calculate_gdd_fahrenheit(r["T2M_MAX"], r["T2M_MIN"], 45.0, 86.0),
        axis=1
    )

    result.to_csv(OUTPUT_CSV, index=False)
    print(f"\nSaved {len(result)} rows to {OUTPUT_CSV}")

    print("\n=== Summary by Field ===")
    summary = result.groupby(["field_name", "year"]).agg({
        "gdd_daily": "sum",
        "PRECTOTCORR": "sum"
    }).reset_index()
    summary.columns = ["field_name", "year", "total_gdd", "total_precip_in"]
    print(summary.head(20).to_string(index=False))
    
    # Print range
    print(f"\n=== GDD Range ===")
    print(f"Min GDD: {summary['total_gdd'].min():.0f}")
    print(f"Max GDD: {summary['total_gdd'].max():.0f}")
    print(f"Min Precip: {summary['total_precip_in'].min():.1f} in")
    print(f"Max Precip: {summary['total_precip_in'].max():.1f} in")


if __name__ == "__main__":
    main()
