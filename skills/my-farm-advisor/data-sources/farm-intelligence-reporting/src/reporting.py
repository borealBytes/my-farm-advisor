from __future__ import annotations

from dataclasses import dataclass

import geopandas as gpd
import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# Panel registry — shared by poster and HTML renderers
# ---------------------------------------------------------------------------

PANEL_REGISTRY: dict[str, dict[str, object]] = {
    "field_identity": {
        "title": "Field identity and operations",
        "audiences": ["farmer", "agronomist", "economist"],
        "required_cols": ["field_id", "area_acres"],
        "description": "Field ID, acreage, location, headlands burden, compactness",
    },
    "ssurgo_component_map": {
        "title": "Soil landscape",
        "audiences": ["agronomist", "soil_scientist"],
        "required_cols": [],
        "description": "SSURGO component/polygon map with satellite basemap",
    },
    "ssurgo_property_map": {
        "title": "Soil properties",
        "audiences": ["agronomist", "soil_scientist"],
        "required_cols": [],
        "description": "Choropleth property maps (OM, pH, AWC, clay)",
    },
    "headlands_overlay": {
        "title": "Headlands and interior",
        "audiences": ["farmer", "economist"],
        "required_cols": ["headlands_pct", "headlands_area_acres"],
        "description": "Headlands ring overlay with OM heatmap",
    },
    "soil_profile": {
        "title": "Soil profile by depth",
        "audiences": ["soil_scientist", "agronomist"],
        "required_cols": [],
        "description": "OM and pH profiles by horizon depth",
    },
    "soil_table": {
        "title": "Horizon table",
        "audiences": ["soil_scientist"],
        "required_cols": [],
        "description": "Full mukey-banded horizon detail table",
    },
    "temperature_doy": {
        "title": "Temperature by day-of-year",
        "audiences": ["agronomist", "farmer"],
        "required_cols": [],
        "description": "Multi-year temperature overlaid on DOY axis",
    },
    "gdd_doy": {
        "title": "Cumulative GDD by day-of-year",
        "audiences": ["agronomist", "farmer"],
        "required_cols": [],
        "description": "Cumulative GDD base 10C overlaid by year on DOY axis",
    },
    "precip_boxplot": {
        "title": "Monthly precipitation distribution",
        "audiences": ["agronomist", "farmer"],
        "required_cols": [],
        "description": "Monthly total precipitation across years as boxplots",
    },
    "cdl_stacked": {
        "title": "Crop composition history",
        "audiences": ["farmer", "agronomist", "economist"],
        "required_cols": [],
        "description": "100% stacked bar chart of crop composition by year",
    },
    "ndvi_summary": {
        "title": "Remote sensing NDVI",
        "audiences": ["agronomist", "economist"],
        "required_cols": [],
        "description": "Sentinel-2 and Landsat seasonal NDVI summaries",
    },
    "management_implications": {
        "title": "Management implications",
        "audiences": ["farmer", "agronomist"],
        "required_cols": [],
        "description": "Concise data-driven agronomic takeaways",
    },
    "farm_relative_standing": {
        "title": "Farm-relative standing",
        "audiences": ["farmer", "economist"],
        "required_cols": [],
        "description": "Field percentile rankings across the farm",
    },
}

# ---------------------------------------------------------------------------
# Legacy compatibility
# ---------------------------------------------------------------------------


@dataclass(slots=True)
class FieldContext:
    field_id: str
    area_acres: float
    centroid_lon: float
    centroid_lat: float
    headlands_pct: float | None = None


def build_field_context(fields: gpd.GeoDataFrame, field_id: str) -> FieldContext:
    field = fields[fields["field_id"] == field_id].iloc[0]
    centroid = field.geometry.centroid
    return FieldContext(
        field_id=str(field_id),
        area_acres=float(field.get("area_acres", 0.0)),
        centroid_lon=float(centroid.x),
        centroid_lat=float(centroid.y),
    )


# ---------------------------------------------------------------------------
# Canonical field-level reporting dataset
# ---------------------------------------------------------------------------


def build_field_reporting_dataset(
    fields: gpd.GeoDataFrame,
    headlands_summary: pd.DataFrame | None = None,
    soil_summary: pd.DataFrame | None = None,
    weather_summary: pd.DataFrame | None = None,
    cdl_summary: pd.DataFrame | None = None,
    ndvi_summary: pd.DataFrame | None = None,
) -> pd.DataFrame:
    """Merge all domain summaries into a canonical per-field reporting DataFrame."""
    df = fields[["field_id"]].copy()
    if "area_acres" in fields.columns:
        df["area_acres"] = fields["area_acres"].values

    if headlands_summary is not None and not headlands_summary.empty:
        keep = [c for c in headlands_summary.columns if c != "field_id"]
        df = df.merge(headlands_summary[["field_id"] + keep], on="field_id", how="left")

    if soil_summary is not None and not soil_summary.empty:
        keep = [c for c in soil_summary.columns if c != "field_id"]
        df = df.merge(soil_summary[["field_id"] + keep], on="field_id", how="left")

    if weather_summary is not None and not weather_summary.empty:
        keep = [c for c in weather_summary.columns if c != "field_id"]
        df = df.merge(weather_summary[["field_id"] + keep], on="field_id", how="left")

    if cdl_summary is not None and not cdl_summary.empty:
        keep = [c for c in cdl_summary.columns if c != "field_id"]
        df = df.merge(cdl_summary[["field_id"] + keep], on="field_id", how="left")

    if ndvi_summary is not None and not ndvi_summary.empty:
        keep = [c for c in ndvi_summary.columns if c != "field_id"]
        df = df.merge(ndvi_summary[["field_id"] + keep], on="field_id", how="left")

    df = compute_farm_relative_rankings(pd.DataFrame(df))
    return df.reset_index(drop=True)


# ---------------------------------------------------------------------------
# Farm-level rollups
# ---------------------------------------------------------------------------


def build_farm_reporting_dataset(field_reporting_df: pd.DataFrame) -> pd.DataFrame:
    """Compute farm-level summary and cross-field comparison metrics."""
    df = field_reporting_df
    numeric = df.select_dtypes(include=["number"])
    summary: dict = {
        "field_count": int(len(df)),
        "total_acres": float(df["area_acres"].sum()) if "area_acres" in df.columns else 0.0,
    }
    for col in numeric.columns:
        summary[f"avg_{col}"] = float(numeric[col].mean())
        summary[f"min_{col}"] = float(numeric[col].min())
        summary[f"max_{col}"] = float(numeric[col].max())
    return pd.DataFrame([summary])


def build_farm_summary(
    fields: gpd.GeoDataFrame, field_metrics: pd.DataFrame | None = None
) -> pd.DataFrame:
    total_acres = float(fields["area_acres"].sum()) if "area_acres" in fields.columns else 0.0
    summary: dict = {
        "field_count": int(len(fields)),
        "total_acres": total_acres,
        "avg_field_size_acres": float(total_acres / len(fields)) if len(fields) else 0.0,
    }
    if field_metrics is not None and not field_metrics.empty:
        for col in field_metrics.select_dtypes(include=["number"]).columns:
            summary[f"avg_{col}"] = float(field_metrics[col].mean())
    return pd.DataFrame([summary])


def rolling_year_window(end_year: int, years: int = 5) -> tuple[int, ...]:
    if years <= 0:
        return tuple()
    start_year = end_year - years + 1
    return tuple(range(start_year, end_year + 1))


def summarize_year_coverage(
    year_values: pd.Series | list[int], target_years: tuple[int, ...]
) -> dict[str, object]:
    values = pd.Series(year_values, dtype="object")
    numeric_years = pd.Series(pd.to_numeric(values, errors="coerce"), dtype="float64").dropna()
    observed_years = sorted({int(year) for year in numeric_years.tolist()})
    missing_years = [year for year in target_years if year not in observed_years]
    return {
        "target_years": list(target_years),
        "observed_years": observed_years,
        "missing_years": missing_years,
        "coverage_years": len(observed_years),
        "has_full_coverage": not missing_years,
    }


def choose_primary_ndvi_source(
    sentinel_products: pd.DataFrame | None = None,
    landsat_products: pd.DataFrame | None = None,
    target_date: str | None = None,
) -> dict[str, object]:
    candidates: list[dict[str, object]] = []
    target_ts = pd.to_datetime(target_date) if target_date is not None else None

    def _append_candidates(
        frame: pd.DataFrame | None,
        *,
        source: str,
        date_column: str,
        cloud_column: str,
        source_priority: int,
    ) -> None:
        if frame is None or frame.empty:
            return
        df = frame.copy()
        if date_column in df.columns:
            df[date_column] = pd.to_datetime(df[date_column], errors="coerce")
        else:
            df[date_column] = pd.NaT
        if cloud_column in df.columns:
            df[cloud_column] = pd.to_numeric(df[cloud_column], errors="coerce")
        else:
            df[cloud_column] = np.nan
        if target_ts is not None:
            df["target_distance_days"] = (df[date_column] - target_ts).abs().dt.days
        else:
            df["target_distance_days"] = 0
        sort_cols = [cloud_column, "target_distance_days", date_column]
        ordered = df.sort_values(sort_cols, na_position="last")
        if ordered.empty:
            return
        best = ordered.iloc[0]
        candidates.append(
            {
                "source": source,
                "source_priority": source_priority,
                "cloud_cover": float(best.get(cloud_column, np.nan)),
                "target_distance_days": float(best.get("target_distance_days", 0.0)),
                "scene_date": best.get(date_column),
                "scene": best,
            }
        )

    _append_candidates(
        sentinel_products,
        source="sentinel",
        date_column="beginposition",
        cloud_column="cloudcoverpercentage",
        source_priority=0,
    )
    _append_candidates(
        landsat_products,
        source="landsat",
        date_column="acquisition_date"
        if landsat_products is not None and "acquisition_date" in landsat_products.columns
        else "date",
        cloud_column="cloud_cover",
        source_priority=1,
    )

    if not candidates:
        return {"source": "none", "scene": None}

    def _as_float(value: object, default: float) -> float:
        if isinstance(value, (int, float, np.integer, np.floating, str)):
            try:
                return float(value)
            except ValueError:
                return default
        return default

    def _as_int(value: object, default: int) -> int:
        if isinstance(value, (int, float, np.integer, np.floating, str)):
            try:
                return int(value)
            except ValueError:
                return default
        return default

    def _candidate_sort_key(item: dict[str, object]) -> tuple[float, float, int]:
        cloud_cover_value = _as_float(item.get("cloud_cover", np.nan), np.nan)
        target_distance_value = _as_float(item.get("target_distance_days", 0.0), 0.0)
        source_priority_value = _as_int(item.get("source_priority", 99), 99)
        return (
            np.inf if np.isnan(cloud_cover_value) else cloud_cover_value,
            target_distance_value,
            source_priority_value,
        )

    best = min(
        candidates,
        key=_candidate_sort_key,
    )
    return {"source": best["source"], "scene": best["scene"]}


# ---------------------------------------------------------------------------
# Rankings
# ---------------------------------------------------------------------------

_RANK_COLS = [
    "area_acres",
    "headlands_pct",
    "total_aws_inches",
    "avg_om_pct",
    "avg_ph",
    "avg_cec",
    "avg_clay_pct",
    "ndvi_season_mean",
    "ndvi_integral",
]


def compute_farm_relative_rankings(df: pd.DataFrame) -> pd.DataFrame:
    """Add percentile rank columns for key reporting metrics."""
    result = df.copy()
    for col in _RANK_COLS:
        if col in result.columns:
            result[f"{col}_pct_rank"] = result[col].rank(pct=True, na_option="keep") * 100.0
    return result


# ---------------------------------------------------------------------------
# Management implications
# ---------------------------------------------------------------------------

_PH_LOW = 6.0
_PH_HIGH = 7.0
_OM_LOW = 1.5
_OM_HIGH = 3.0
_AWS_LOW = 4.0
_HEADLANDS_HIGH = 18.0
_CLAY_HIGH = 35.0
_CDL_LOW_DIVERSITY = 1


def compute_management_implications(field_row: pd.Series | dict) -> list[str]:
    """Return a list of concise data-driven agronomic implication strings."""
    row = field_row if isinstance(field_row, dict) else field_row.to_dict()
    implications: list[str] = []

    ph = row.get("avg_ph")
    if ph is not None and not np.isnan(float(ph)):
        ph = float(ph)
        if ph < _PH_LOW:
            implications.append(
                f"pH {ph:.1f} is below optimum for corn/soy ({_PH_LOW}–{_PH_HIGH}); consider lime application"
            )
        elif ph > _PH_HIGH:
            implications.append(f"pH {ph:.1f} is above optimum; monitor for micronutrient tie-up")
        else:
            implications.append(f"pH {ph:.1f} is within optimal range for corn/soybean production")

    om = row.get("avg_om_pct")
    if om is not None and not np.isnan(float(om)):
        om = float(om)
        if om < _OM_LOW:
            implications.append(
                f"OM {om:.1f}% is low; prioritize cover crops or reduced tillage to rebuild organic matter"
            )
        elif om >= _OM_HIGH:
            implications.append(
                f"OM {om:.1f}% is high for the region; strong water-holding and nutrient cycling capacity"
            )

    aws = row.get("total_aws_inches")
    if aws is not None and not np.isnan(float(aws)):
        aws = float(aws)
        if aws < _AWS_LOW:
            implications.append(
                f"Total available water storage {aws:.1f} in is below 4 in; elevated drought sensitivity"
            )
        else:
            implications.append(
                f"Available water storage {aws:.1f} in provides good buffer against short-term drought stress"
            )

    drainage = row.get("drainage_class", row.get("drainagecl", ""))
    if isinstance(drainage, str) and drainage:
        if any(w in drainage.lower() for w in ["poorly", "very poorly"]):
            implications.append(
                f"Drainage class '{drainage}' indicates wet soil conditions and potential trafficability constraints"
            )
        elif "somewhat poorly" in drainage.lower():
            implications.append(
                f"Drainage class '{drainage}' may benefit from tile drainage review"
            )

    headlands_pct = row.get("headlands_pct")
    if headlands_pct is not None and not np.isnan(float(headlands_pct)):
        hp = float(headlands_pct)
        if hp > _HEADLANDS_HIGH:
            implications.append(
                f"Headlands area {hp:.1f}% of field; high turning burden relative to productive acres"
            )

    clay = row.get("avg_clay_pct")
    if clay is not None and not np.isnan(float(clay)):
        clay = float(clay)
        if clay > _CLAY_HIGH:
            implications.append(
                f"Clay content {clay:.0f}% is high; monitor compaction risk and spring trafficability"
            )

    diversity = row.get("crop_diversity")
    if diversity is not None and not np.isnan(float(diversity)):
        diversity = int(diversity)
        if diversity <= _CDL_LOW_DIVERSITY:
            implications.append(
                "Crop history shows low rotation diversity; consider diversifying for disease and weed pressure management"
            )

    erosion = row.get("erosion_risk")
    if isinstance(erosion, str) and "high" in erosion.lower():
        implications.append(
            "Erosion risk is rated high; consider contour management or cover cropping on vulnerable slopes"
        )

    if not implications:
        implications.append("No major soil or agronomic constraints detected from available data")

    return implications
