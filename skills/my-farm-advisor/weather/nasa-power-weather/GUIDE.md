---
name: nasa-power-weather
description: Download NASA POWER daily weather data for agricultural field locations. Queries the free REST API for temperature, precipitation, solar radiation, humidity, and wind. Calculates Growing Degree Days (GDD). Use when the user needs historical weather for crop modeling, irrigation planning, or climate analysis.
version: 1.0.0
author: Boreal Bytes
tags: [nasa, power, weather, climate, agriculture, api, gdd]
---

# Skill: nasa-power-weather

## Description

Download and analyze daily weather data from the NASA POWER (Prediction of Worldwide Energy Resources) API for agricultural field locations. The API is free, requires no authentication, and covers the entire globe at 0.5° resolution from 1981 to near-present.

This skill teaches agents to:

- Query the NASA POWER REST API directly with `requests`
- Parse the JSON response into `pandas` DataFrames
- Calculate Growing Degree Days (GDD) for crop development tracking
- Optionally use `xarray` for multi-dimensional weather analysis
- Work with coordinates from the `field-boundaries` skill
- Prepare reporting-ready day-of-year, cumulative GDD, and precipitation-distribution summaries for posters and self-contained HTML reports

## When to Use This Skill

- **Historical weather retrieval**: Get daily temperature, precipitation, solar radiation for specific coordinates
- **Crop modeling inputs**: Obtain GDD, accumulated precipitation, solar radiation totals
- **Multi-year climate analysis**: Compare growing seasons across 2020-2024
- **Field-level weather**: Extract weather at field centroids from boundary GeoJSON files
- **Irrigation planning**: Analyze precipitation deficits and evapotranspiration drivers

## Prerequisites

```bash
# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Example Data

Sample data is included in the `examples/` directory:

- `examples/sample_weather_2fields_2020_2024.csv` — 3,654 rows of daily weather for 2 Minnesota corn fields (2020-2024)

The two fields match the `field-boundaries` skill sample data (`sample_2_fields.geojson`):

| Field ID        | Latitude | Longitude | Location           |
| --------------- | -------- | --------- | ------------------ |
| 271623002471299 | 47.0643  | -95.9458  | Norman County, MN  |
| 271623001561551 | 44.5557  | -92.8846  | Goodhue County, MN |

Load the sample data for testing:

```python
import pandas as pd

weather = pd.read_csv('examples/sample_weather_2fields_2020_2024.csv', parse_dates=['date'])
print(weather.shape)          # (3654, 11)
print(weather.columns.tolist())
# ['field_id', 'lat', 'lon', 'date', 'T2M', 'T2M_MAX', 'T2M_MIN',
#  'PRECTOTCORR', 'ALLSKY_SFC_SW_DWN', 'RH2M', 'WS10M']
```

## Quick Start

```bash
# Download weather for a single coordinate (no dependencies beyond requests/pandas)
uv run --with requests --with pandas python << 'PYEOF'
import requests
import pandas as pd

# Norman County, MN field centroid (from field-boundaries sample data)
lat, lon = 47.0643, -95.9458

resp = requests.get(
    "https://power.larc.nasa.gov/api/temporal/daily/point",
    params={
        "parameters": "T2M,T2M_MAX,T2M_MIN,PRECTOTCORR",
        "community": "AG",
        "longitude": lon,
        "latitude": lat,
        "start": "20230101",
        "end": "20231231",
        "format": "JSON",
    },
    timeout=60,
)
resp.raise_for_status()
data = resp.json()

# Parse into DataFrame
param_data = data["properties"]["parameter"]
records = []
for date_str in list(param_data["T2M"].keys()):
    row = {"date": pd.to_datetime(date_str, format="%Y%m%d")}
    for p in param_data:
        row[p] = param_data[p][date_str]
    records.append(row)

df = pd.DataFrame(records)
print(df.head())
print(f"\n{len(df)} days retrieved")
PYEOF
```

## NASA POWER API Reference

### Endpoint

```
GET https://power.larc.nasa.gov/api/temporal/daily/point
```

### Required Query Parameters

| Parameter    | Description                                | Example                   |
| ------------ | ------------------------------------------ | ------------------------- |
| `parameters` | Comma-separated NASA POWER parameter codes | `T2M,T2M_MAX,PRECTOTCORR` |
| `community`  | Data community (`AG` for agriculture)      | `AG`                      |
| `longitude`  | Decimal degrees (-180 to 180)              | `-95.9458`                |
| `latitude`   | Decimal degrees (-90 to 90)                | `47.0643`                 |
| `start`      | Start date `YYYYMMDD`                      | `20200101`                |
| `end`        | End date `YYYYMMDD`                        | `20241231`                |
| `format`     | Response format                            | `JSON`                    |

### Key Agricultural Parameters

| Parameter           | Description                                   | Units     |
| ------------------- | --------------------------------------------- | --------- |
| `T2M`               | Daily mean temperature at 2m                  | °C        |
| `T2M_MAX`           | Daily maximum temperature at 2m               | °C        |
| `T2M_MIN`           | Daily minimum temperature at 2m               | °C        |
| `PRECTOTCORR`       | Precipitation (bias-corrected)                | mm/day    |
| `ALLSKY_SFC_SW_DWN` | All-sky surface shortwave downward irradiance | MJ/m²/day |
| `RH2M`              | Relative humidity at 2m                       | %         |
| `WS10M`             | Wind speed at 10m                             | m/s       |
| `T2MDEW`            | Dew point temperature at 2m                   | °C        |
| `PS`                | Surface pressure                              | kPa       |

### Response Structure

```json
{
  "properties": {
    "parameter": {
      "T2M": { "20230101": -12.45, "20230102": -15.01, "...": "..." },
      "T2M_MAX": { "20230101": -8.12, "20230102": -10.33, "...": "..." },
      "PRECTOTCORR": { "20230101": 0.0, "20230102": 2.31, "...": "..." }
    }
  },
  "geometry": { "type": "Point", "coordinates": [-95.95, 47.06] }
}
```

Missing values are encoded as `-999.0`.

### Rate Limits

The API is free and requires no key. NASA asks that users:

- Limit requests to avoid overloading (add a small delay between calls)
- Cache results locally — the data does not change retroactively
- Use the `AG` community for agricultural parameters

## Usage Examples

### Example 1: Download Weather for Field Boundaries

Read field centroids from GeoJSON (from `field-boundaries` skill) and query weather for each:

```python
"""Download NASA POWER weather for fields from a GeoJSON file."""
import json
import time

import pandas as pd
import requests
from shapely.geometry import shape

API_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
PARAMS = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "ALLSKY_SFC_SW_DWN", "RH2M"]


def query_power(lat: float, lon: float, start: str, end: str,
                parameters: list[str] | None = None) -> pd.DataFrame | None:
    """Query NASA POWER API for one point. Returns DataFrame or None."""
    parameters = parameters or PARAMS
    resp = requests.get(
        API_URL,
        params={
            "parameters": ",".join(parameters),
            "community": "AG",
            "longitude": lon,
            "latitude": lat,
            "start": start.replace("-", ""),
            "end": end.replace("-", ""),
            "format": "JSON",
        },
        timeout=60,
    )
    resp.raise_for_status()
    data = resp.json()

    param_data = data["properties"]["parameter"]
    first_param = list(param_data.keys())[0]
    dates = list(param_data[first_param].keys())

    records = []
    for d in dates:
        row = {"date": pd.to_datetime(d, format="%Y%m%d")}
        for p in parameters:
            val = param_data.get(p, {}).get(d, -999.0)
            row[p] = val if val != -999.0 else None
        records.append(row)

    return pd.DataFrame(records)


def download_for_fields(geojson_path: str, start: str, end: str,
                        output_csv: str | None = None) -> pd.DataFrame:
    """Download weather for all fields in a GeoJSON file."""
    with open(geojson_path) as f:
        gj = json.load(f)

    all_dfs = []
    for feature in gj["features"]:
        field_id = feature["properties"].get("field_id", "unknown")
        centroid = shape(feature["geometry"]).centroid

        print(f"Querying {field_id} at ({centroid.y:.4f}, {centroid.x:.4f})...")
        df = query_power(centroid.y, centroid.x, start, end)
        if df is not None:
            df.insert(0, "field_id", field_id)
            df.insert(1, "lat", round(centroid.y, 4))
            df.insert(2, "lon", round(centroid.x, 4))
            all_dfs.append(df)

        time.sleep(1)  # courtesy delay

    result = pd.concat(all_dfs, ignore_index=True)
    if output_csv:
        result.to_csv(output_csv, index=False)
        print(f"Saved {len(result)} rows to {output_csv}")
    return result


# Usage with field-boundaries sample data:
# weather = download_for_fields(
#     '../field-boundaries/examples/sample_2_fields.geojson',
#     '2020-01-01', '2024-12-31',
#     output_csv='weather_2fields.csv'
# )
```

### Example 2: Calculate Growing Degree Days (GDD)

```python
import pandas as pd

# Load sample data (or use real API data)
weather = pd.read_csv(
    'examples/sample_weather_2fields_2020_2024.csv',
    parse_dates=['date'],
)


def calculate_gdd(df: pd.DataFrame, base_temp: float = 10.0,
                  cap_temp: float = 30.0) -> pd.DataFrame:
    """Calculate daily and cumulative GDD per field.

    Formula: GDD = max(0, min(T_avg, cap_temp) - base_temp)
    where T_avg = (T2M_MIN + T2M_MAX) / 2
    """
    out = df.copy()
    t_avg = ((out["T2M_MIN"] + out["T2M_MAX"]) / 2).clip(upper=cap_temp)
    out["gdd"] = (t_avg - base_temp).clip(lower=0)
    out["gdd_cumulative"] = out.groupby("field_id")["gdd"].cumsum()
    return out


weather_gdd = calculate_gdd(weather, base_temp=10.0)

# Show end-of-year cumulative GDD per field per year
weather_gdd["year"] = weather_gdd["date"].dt.year
yearly = weather_gdd.groupby(["field_id", "year"])["gdd"].sum().reset_index()
yearly.columns = ["field_id", "year", "total_gdd"]
print(yearly)
```

### Example 3: Seasonal Weather Summary with xarray

```bash
uv run --with requests --with pandas --with xarray --with netcdf4 python << 'PYEOF'
import pandas as pd
import xarray as xr

# Load weather data
weather = pd.read_csv(
    'examples/sample_weather_2fields_2020_2024.csv',
    parse_dates=['date'],
)

# Convert to xarray Dataset — one variable per parameter
ds = weather.set_index(['field_id', 'date']).to_xarray()
print(ds)

# Monthly mean temperature per field
monthly = ds['T2M'].resample(date='ME').mean()
print("\nMonthly mean T2M:")
print(monthly.to_dataframe().head(12))

# Growing season (May-Sep) precipitation totals by year
growing = ds['PRECTOTCORR'].sel(date=ds.date.dt.month.isin([5, 6, 7, 8, 9]))
annual_precip = growing.resample(date='YE').sum()
print("\nGrowing season precipitation (mm):")
print(annual_precip.to_dataframe())
PYEOF
```

### Example 4: Plot Temperature Range

```python
import pandas as pd
import matplotlib.pyplot as plt
from matplotlib.dates import DateFormatter

weather = pd.read_csv(
    'examples/sample_weather_2fields_2020_2024.csv',
    parse_dates=['date'],
)

# Plot one year for field 1
field_id = "271623002471299"
mask = (weather["field_id"] == field_id) & (weather["date"].dt.year == 2023)
yr = weather.loc[mask].sort_values("date")

fig, ax = plt.subplots(figsize=(14, 5))
ax.fill_between(yr["date"], yr["T2M_MIN"], yr["T2M_MAX"], alpha=0.3, label="Min/Max range")
ax.plot(yr["date"], yr["T2M"], linewidth=0.8, label="Mean")
ax.axhline(0, color="grey", linewidth=0.5, linestyle="--")
ax.set_ylabel("Temperature (°C)")
ax.set_title(f"Daily Temperature — Field {field_id} (2023)")
ax.legend()
ax.xaxis.set_major_formatter(DateFormatter("%b"))
plt.tight_layout()
plt.savefig("temperature_2023.png", dpi=150)
print("Saved temperature_2023.png")
```

## GDD Calculation

Growing Degree Days track heat accumulation for crop development:

```
GDD_daily = max(0, min((T_min + T_max) / 2, T_cap) - T_base)
GDD_cumulative = sum(GDD_daily) from planting date onward
```

Common base temperatures:

| Crop           | T_base (°C) | T_cap (°C) |
| -------------- | ----------- | ---------- |
| Corn           | 10          | 30         |
| Soybeans       | 10          | 30         |
| Wheat (spring) | 0           | 25         |
| Cotton         | 15.6        | 37.8       |

## Notes

- Weather is queried at field **centroids** — for large fields the 0.5° grid may span multiple cells
- Missing values from the API are encoded as `-999.0`; replace with `None`/`NaN`
- Data availability is typically 1981-present with ~2-month lag
- The `AG` community includes bias-corrected precipitation (`PRECTOTCORR`)
- For sub-daily data, use the `temporal/hourly` endpoint instead

## Output File Format

The standard CSV output has these columns:

```
field_id, lat, lon, date, T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, ALLSKY_SFC_SW_DWN, RH2M, WS10M
```

## Resources

- [NASA POWER API Documentation](https://power.larc.nasa.gov/docs/)
- [NASA POWER Data Access Viewer](https://power.larc.nasa.gov/data-access-viewer/)
- [API Parameter Dictionary](https://power.larc.nasa.gov/docs/methodology/communities/ag/)
- [Growing Degree Days (UMN Extension)](https://www.extension.umn.edu/agriculture/climate/growing-degree-days/)
- [field-boundaries skill](../.skills/field-boundaries/) — source of sample field coordinates
