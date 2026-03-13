# NASA POWER Weather Example Data

This directory contains sample weather data and a generation script for testing.

## Files

- **sample_weather_2fields_2020_2024.csv** — 3,654 rows of daily weather for 2 Minnesota corn fields (2020-01-01 to 2024-12-31)
- **generate_sample_data.py** — Stdlib-only script that regenerates the CSV with reproducible synthetic data (seed 42)

## Data Source

- **Provider**: Synthetic data modeled on NASA POWER climatology for Minnesota
- **Parameters**: T2M, T2M_MAX, T2M_MIN, PRECTOTCORR, ALLSKY_SFC_SW_DWN, RH2M, WS10M
- **Format**: CSV
- **CRS**: WGS84 decimal degrees (lat/lon columns)

## Fields Included

| Field ID        | Latitude | Longitude | Location           | Area (acres) | Crop |
| --------------- | -------- | --------- | ------------------ | ------------ | ---- |
| 271623002471299 | 47.0643  | -95.9458  | Norman County, MN  | 3.70         | Corn |
| 271623001561551 | 44.5557  | -92.8846  | Goodhue County, MN | 6.41         | Corn |

These fields match the `field-boundaries` skill sample data (`sample_2_fields.geojson`).

## CSV Columns

| Column              | Description                     | Units      |
| ------------------- | ------------------------------- | ---------- |
| `field_id`          | Unique field identifier         | —          |
| `lat`               | Field centroid latitude         | degrees    |
| `lon`               | Field centroid longitude        | degrees    |
| `date`              | Date (ISO 8601)                 | YYYY-MM-DD |
| `T2M`               | Daily mean temperature at 2m    | °C         |
| `T2M_MAX`           | Daily maximum temperature at 2m | °C         |
| `T2M_MIN`           | Daily minimum temperature at 2m | °C         |
| `PRECTOTCORR`       | Precipitation (bias-corrected)  | mm/day     |
| `ALLSKY_SFC_SW_DWN` | Surface shortwave irradiance    | MJ/m²/day  |
| `RH2M`              | Relative humidity at 2m         | %          |
| `WS10M`             | Wind speed at 10m               | m/s        |

## Usage

```python
import pandas as pd

weather = pd.read_csv('sample_weather_2fields_2020_2024.csv', parse_dates=['date'])
print(weather.groupby('field_id')['T2M'].describe())
```

## Regenerating the Data

```bash
python generate_sample_data.py
```

The script uses `random.Random(42)` for reproducibility and requires only Python stdlib.

## Notes

- This is **synthetic data** with realistic seasonal patterns for Minnesota
- Use it for testing pipelines, not for real agricultural decisions
- To download real NASA POWER data, see the `SKILL.md` examples
