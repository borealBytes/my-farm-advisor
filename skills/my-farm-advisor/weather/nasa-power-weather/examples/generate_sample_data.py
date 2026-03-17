#!/usr/bin/env python3
"""Generate realistic synthetic NASA POWER weather data for 2 sample fields.

Uses only stdlib so it runs without any dependencies.
The two fields come from the field-boundaries skill:
  - 271623002471299  centroid ≈ (-95.9458, 47.0643)  Norman County, MN
  - 271623001561551  centroid ≈ (-92.8846, 44.5557)  Goodhue County, MN

Output: sample_weather_2fields_2020_2024.csv
"""

import csv
import math
import random
from datetime import date, timedelta
from pathlib import Path

# --- field metadata --------------------------------------------------------
FIELDS = [
    {
        "field_id": "271623002471299",
        "lat": 47.0643,
        "lon": -95.9458,
        # northern MN → colder winters, shorter season
        "t_mean_annual": 4.5,
        "t_amplitude": 22.0,
    },
    {
        "field_id": "271623001561551",
        "lat": 44.5557,
        "lon": -92.8846,
        # southern MN → milder
        "t_mean_annual": 7.0,
        "t_amplitude": 20.0,
    },
]

PARAMS = ["T2M", "T2M_MAX", "T2M_MIN", "PRECTOTCORR", "ALLSKY_SFC_SW_DWN", "RH2M", "WS10M"]

START = date(2020, 1, 1)
END = date(2024, 12, 31)


def day_of_year_frac(d: date) -> float:
    """Return fractional day-of-year (0-1)."""
    return d.timetuple().tm_yday / 365.25


def seasonal(d: date, mean: float, amplitude: float, phase: float = 0.298) -> float:
    """Sinusoidal seasonal cycle. Default phase peaks late July (day ~200)."""
    return mean + amplitude * math.sin(2 * math.pi * (day_of_year_frac(d) - phase))


def generate_field_weather(field: dict, rng: random.Random) -> list[dict]:
    """Generate daily weather rows for one field."""
    rows = []
    d = START
    while d <= END:
        # --- temperature ---
        t_mean_day = seasonal(d, field["t_mean_annual"], field["t_amplitude"])
        noise = rng.gauss(0, 2.5)
        t_mean = round(t_mean_day + noise, 2)
        diurnal = rng.uniform(4, 12)
        t_max = round(t_mean + diurnal / 2, 2)
        t_min = round(t_mean - diurnal / 2, 2)

        # --- precipitation (mm) ---
        # higher in summer, occasional zero days
        precip_base = 1.5 + 2.0 * max(0, math.sin(2 * math.pi * (day_of_year_frac(d) - 0.298)))
        if rng.random() < 0.55:
            precip = 0.0
        else:
            precip = round(rng.expovariate(1.0 / precip_base), 2)

        # --- solar radiation (MJ/m²/day) ---
        solar_mean = seasonal(d, 14.0, 10.0, phase=0.221)
        solar = round(max(1.0, solar_mean + rng.gauss(0, 2.5)), 2)

        # --- relative humidity (%) ---
        rh_mean = seasonal(d, 70.0, -10.0, phase=0.298)  # drier in summer
        rh = round(min(100, max(20, rh_mean + rng.gauss(0, 8))), 2)

        # --- wind speed (m/s) ---
        ws = round(max(0.3, rng.gauss(4.0, 1.5)), 2)

        rows.append(
            {
                "field_id": field["field_id"],
                "lat": field["lat"],
                "lon": field["lon"],
                "date": d.isoformat(),
                "T2M": t_mean,
                "T2M_MAX": t_max,
                "T2M_MIN": t_min,
                "PRECTOTCORR": precip,
                "ALLSKY_SFC_SW_DWN": solar,
                "RH2M": rh,
                "WS10M": ws,
            }
        )
        d += timedelta(days=1)
    return rows


def main() -> None:
    rng = random.Random(42)  # reproducible
    out_path = Path(__file__).parent / "sample_weather_2fields_2020_2024.csv"

    all_rows: list[dict] = []
    for field in FIELDS:
        all_rows.extend(generate_field_weather(field, rng))

    fieldnames = ["field_id", "lat", "lon", "date"] + PARAMS
    with open(out_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(all_rows)

    print(f"Wrote {len(all_rows)} rows to {out_path}")


if __name__ == "__main__":
    main()
