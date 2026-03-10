"""NASA POWER Weather — standalone functions for agricultural weather data.

Query the NASA POWER REST API for daily meteorological time-series and
compute derived agricultural metrics (GDD, accumulated precipitation).

No external config dependency — uses only requests, pandas, and stdlib.

Usage (isolated with UV)::

    uv run --with requests --with pandas python -c "
    from src import query_power
    df = query_power(47.06, -95.95, '2023-01-01', '2023-12-31')
    print(df.head())
    "
"""

from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from typing import Any

import pandas as pd
import requests

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

API_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

DEFAULT_PARAMS: list[str] = [
    "T2M",
    "T2M_MAX",
    "T2M_MIN",
    "PRECTOTCORR",
    "ALLSKY_SFC_SW_DWN",
    "RH2M",
    "WS10M",
]

AGRICULTURAL_PARAMS: dict[str, str] = {
    "T2M": "Daily mean temperature (°C)",
    "T2M_MAX": "Daily maximum temperature (°C)",
    "T2M_MIN": "Daily minimum temperature (°C)",
    "PRECTOTCORR": "Precipitation — bias-corrected (mm)",
    "ALLSKY_SFC_SW_DWN": "Solar radiation (MJ/m²/day)",
    "RH2M": "Relative humidity at 2 m (%)",
    "WS10M": "Wind speed at 10 m (m/s)",
    "WS10M_MAX": "Maximum wind speed at 10 m (m/s)",
    "PS": "Surface pressure (kPa)",
    "T2MDEW": "Dew-point temperature (°C)",
}

# ---------------------------------------------------------------------------
# API helpers
# ---------------------------------------------------------------------------


def query_power(
    lat: float,
    lon: float,
    start_date: str,
    end_date: str,
    parameters: list[str] | None = None,
    *,
    timeout: int = 60,
) -> pd.DataFrame | None:
    """Query NASA POWER daily point API for one location.

    Args:
        lat: Latitude in decimal degrees.
        lon: Longitude in decimal degrees.
        start_date: ISO start date ``YYYY-MM-DD``.
        end_date: ISO end date ``YYYY-MM-DD``.
        parameters: Weather parameter codes.  Defaults to
            :data:`DEFAULT_PARAMS`.
        timeout: HTTP timeout in seconds.

    Returns:
        DataFrame indexed by date, or ``None`` on failure.
    """
    parameters = parameters or DEFAULT_PARAMS

    resp = requests.get(
        API_URL,
        params={
            "parameters": ",".join(parameters),
            "community": "AG",
            "longitude": lon,
            "latitude": lat,
            "start": start_date.replace("-", ""),
            "end": end_date.replace("-", ""),
            "format": "JSON",
        },
        timeout=timeout,
    )
    resp.raise_for_status()
    data: dict[str, Any] = resp.json()

    if "properties" not in data or "parameter" not in data["properties"]:
        logger.warning("No data returned for (%s, %s)", lat, lon)
        return None

    param_data = data["properties"]["parameter"]
    first_key = next(iter(param_data))
    dates = list(param_data[first_key].keys())

    records: list[dict[str, Any]] = []
    for d in dates:
        row: dict[str, Any] = {"date": pd.to_datetime(d, format="%Y%m%d")}
        for p in parameters:
            val = param_data.get(p, {}).get(d, -999.0)
            row[p] = val if val != -999.0 else None
        records.append(row)

    return pd.DataFrame(records)


# ---------------------------------------------------------------------------
# Field-level download
# ---------------------------------------------------------------------------


def download_for_fields(
    geojson_path: str | Path,
    start_date: str,
    end_date: str,
    parameters: list[str] | None = None,
    output_csv: str | Path | None = None,
    *,
    delay: float = 1.0,
) -> pd.DataFrame:
    """Download daily weather for every field centroid in a GeoJSON file.

    Requires ``shapely`` for centroid calculation::

        uv run --with requests --with pandas --with shapely python …

    Args:
        geojson_path: Path to GeoJSON ``FeatureCollection``.
        start_date: ISO start date ``YYYY-MM-DD``.
        end_date: ISO end date ``YYYY-MM-DD``.
        parameters: Weather parameter codes.
        output_csv: Optional path to write combined CSV.
        delay: Seconds to sleep between API requests.

    Returns:
        Combined DataFrame with ``field_id``, ``lat``, ``lon`` columns
        prepended.

    Raises:
        RuntimeError: If no data could be retrieved for any field.
    """
    from shapely.geometry import shape  # lazy import

    with open(geojson_path) as fh:
        gj = json.load(fh)

    all_dfs: list[pd.DataFrame] = []

    for feature in gj["features"]:
        field_id = feature["properties"].get("field_id", "unknown")
        centroid = shape(feature["geometry"]).centroid

        logger.info(
            "Querying field %s at (%.4f, %.4f)…",
            field_id,
            centroid.y,
            centroid.x,
        )

        df = query_power(
            centroid.y,
            centroid.x,
            start_date,
            end_date,
            parameters,
        )

        if df is not None:
            df.insert(0, "field_id", field_id)
            df.insert(1, "lat", round(centroid.y, 4))
            df.insert(2, "lon", round(centroid.x, 4))
            all_dfs.append(df)

        time.sleep(delay)

    if not all_dfs:
        raise RuntimeError("No weather data retrieved for any field")

    combined = pd.concat(all_dfs, ignore_index=True)

    if output_csv:
        output_csv = Path(output_csv)
        output_csv.parent.mkdir(parents=True, exist_ok=True)
        combined.to_csv(output_csv, index=False)
        logger.info("Saved %d rows to %s", len(combined), output_csv)

    return combined


# ---------------------------------------------------------------------------
# Derived metrics
# ---------------------------------------------------------------------------


def calculate_gdd(
    weather: pd.DataFrame,
    base_temp: float = 10.0,
    cap_temp: float = 30.0,
) -> pd.DataFrame:
    """Calculate daily and cumulative Growing Degree Days.

    Formula::

        GDD = max(0, min((T_min + T_max) / 2, cap_temp) - base_temp)

    Args:
        weather: DataFrame with ``T2M_MIN``, ``T2M_MAX``, and ``field_id``.
        base_temp: Base temperature in °C.
        cap_temp: Upper temperature cap in °C.

    Returns:
        Copy of *weather* with ``gdd`` and ``gdd_cumulative`` columns added.
    """
    for col in ("T2M_MIN", "T2M_MAX"):
        if col not in weather.columns:
            raise ValueError(f"Weather data must contain {col}")

    df = weather.copy()
    t_avg = ((df["T2M_MIN"] + df["T2M_MAX"]) / 2).clip(upper=cap_temp)
    df["gdd"] = (t_avg - base_temp).clip(lower=0)
    df["gdd_cumulative"] = df.groupby("field_id")["gdd"].cumsum()
    return df


def calculate_accumulated_precipitation(
    weather: pd.DataFrame,
    window_days: int = 7,
) -> pd.DataFrame:
    """Add rolling accumulated precipitation column.

    Args:
        weather: DataFrame with ``PRECTOTCORR`` and ``field_id``.
        window_days: Rolling window size in days.

    Returns:
        Copy of *weather* with ``precip_accum`` column added.
    """
    if "PRECTOTCORR" not in weather.columns:
        raise ValueError("Weather data must contain PRECTOTCORR")

    df = weather.copy()
    df["precip_accum"] = (
        df.groupby("field_id")["PRECTOTCORR"]
        .rolling(window=window_days, min_periods=1)
        .sum()
        .reset_index(0, drop=True)
    )
    return df


def seasonal_summary(
    weather: pd.DataFrame,
    season: str = "growing",
) -> pd.DataFrame:
    """Aggregate weather to seasonal summary statistics per field.

    Args:
        weather: Daily weather DataFrame.
        season: One of ``growing`` (May-Sep), ``spring`` (Mar-May),
            ``summer`` (Jun-Aug), ``fall`` (Sep-Nov), ``winter`` (Dec-Feb).

    Returns:
        Summary DataFrame grouped by ``field_id``.
    """
    month_map = {
        "growing": [5, 6, 7, 8, 9],
        "spring": [3, 4, 5],
        "summer": [6, 7, 8],
        "fall": [9, 10, 11],
        "winter": [12, 1, 2],
    }
    months = month_map.get(season)
    df = weather.copy()
    df["month"] = df["date"].dt.month
    if months:
        df = df[df["month"].isin(months)]

    agg: dict[str, Any] = {}
    if "T2M_MIN" in df.columns:
        agg["T2M_MIN"] = ["min", "mean"]
    if "T2M_MAX" in df.columns:
        agg["T2M_MAX"] = ["mean", "max"]
    if "PRECTOTCORR" in df.columns:
        agg["PRECTOTCORR"] = "sum"
    if "ALLSKY_SFC_SW_DWN" in df.columns:
        agg["ALLSKY_SFC_SW_DWN"] = "mean"

    return df.groupby("field_id").agg(agg).reset_index()
