from __future__ import annotations

from collections import Counter
from pathlib import Path

import geopandas as gpd
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import rasterio
from rasterstats import zonal_stats

CDL_CODES = {
    0: "No Data",
    1: "Corn",
    5: "Soybeans",
    24: "Winter Wheat",
    28: "Alfalfa",
    36: "Forest",
    38: "Grassland",
    43: "Open Water",
    61: "Fallow/Idle",
    63: "Other",
    176: "Grass/Pasture",
}


def filter_cdl_categories(crop_mix: pd.DataFrame) -> pd.DataFrame:
    if crop_mix.empty:
        return crop_mix.copy()
    df = crop_mix.copy()
    if "crop_name" not in df.columns:
        return df
    crop_names = pd.Series(df["crop_name"], dtype="object").fillna("").astype(str).str.strip()
    valid_mask = ~crop_names.eq("No Data") & ~crop_names.str.startswith("Code_")
    return df.loc[valid_mask].copy()


def filter_crop_history_window(crop_mix: pd.DataFrame, window_years: int = 5) -> pd.DataFrame:
    if crop_mix.empty or window_years <= 0 or "year" not in crop_mix.columns:
        return crop_mix.copy()
    df = crop_mix.copy()
    years = pd.Series(pd.to_numeric(df["year"], errors="coerce"), dtype="float64")
    if years.isna().all():
        return df
    max_year = int(years.dropna().max())
    min_year = max_year - window_years + 1
    return df.loc[years >= min_year].copy()


def _predict_next_crop(crop_names: list[str], current_crop: str) -> tuple[str | None, str]:
    if not crop_names:
        return None, "none"
    followers = [
        crop_names[idx + 1]
        for idx, crop_name in enumerate(crop_names[:-1])
        if crop_name == current_crop and idx + 1 < len(crop_names)
    ]
    if not followers:
        if len(crop_names) >= 2 and crop_names[-1] != crop_names[-2]:
            return crop_names[-2], "low"
        return current_crop, "low"
    counts = Counter(followers)
    best_count = max(counts.values())
    best_choices = sorted(name for name, count in counts.items() if count == best_count)
    choice = best_choices[0]
    confidence = "high" if best_count >= 2 else "medium"
    return choice, confidence


def build_crop_rotation_outlook(crop_names: list[str]) -> dict[str, str]:
    if not crop_names:
        return {
            "predicted_next_crop": "Unknown",
            "predicted_following_crop": "Unknown",
            "rotation_confidence": "none",
            "rotation_outlook": "Insufficient crop history for a heuristic rotation outlook.",
        }

    current_crop = crop_names[-1]
    next_crop, next_confidence = _predict_next_crop(crop_names, current_crop)
    following_crop, following_confidence = _predict_next_crop(
        crop_names + ([next_crop] if next_crop else []), next_crop or current_crop
    )
    confidence_rank = {"none": 0, "low": 1, "medium": 2, "high": 3}
    combined_confidence = min(
        confidence_rank[next_confidence], confidence_rank[following_confidence]
    )
    confidence_label = next(
        label for label, rank in confidence_rank.items() if rank == combined_confidence
    )

    next_label = next_crop or "Unknown"
    following_label = following_crop or next_label
    if confidence_label == "none":
        outlook = "Insufficient crop history for a heuristic rotation outlook."
    elif confidence_label == "low":
        outlook = f"Heuristic outlook: {next_label} next, then {following_label}; confidence is low because the recent sequence is short or noisy."
    else:
        outlook = f"Heuristic outlook: {next_label} next, then {following_label}, based on the recent rotation pattern."

    return {
        "predicted_next_crop": next_label,
        "predicted_following_crop": following_label,
        "rotation_confidence": confidence_label,
        "rotation_outlook": outlook,
    }


def extract_crop_composition(
    fields: gpd.GeoDataFrame, cdl_path: str | Path, year: int
) -> pd.DataFrame:
    rows: list[dict[str, object]] = []
    with rasterio.open(cdl_path) as src:
        fields_proj = fields.to_crs(src.crs)
        for _, field in fields_proj.iterrows():
            stats = zonal_stats(field.geometry, cdl_path, categorical=True)
            counts = stats[0] if stats else {}
            total = int(sum(counts.values()))
            if total <= 0:
                rows.append(
                    {
                        "field_id": field["field_id"],
                        "year": year,
                        "crop_code": 0,
                        "crop_name": "No Data",
                        "pixel_count": 0,
                        "pct": 0.0,
                    }
                )
                continue
            for crop_code, pixel_count in sorted(
                counts.items(), key=lambda item: item[1], reverse=True
            ):
                rows.append(
                    {
                        "field_id": field["field_id"],
                        "year": year,
                        "crop_code": int(crop_code),
                        "crop_name": CDL_CODES.get(int(crop_code), f"Code_{crop_code}"),
                        "pixel_count": int(pixel_count),
                        "pct": round(float(pixel_count) / total * 100.0, 2),
                    }
                )
    return filter_cdl_categories(pd.DataFrame(rows))


def _pct_col(df: pd.DataFrame) -> str:
    if "pct" in df.columns:
        return "pct"
    if "dominant_pct" in df.columns:
        return "dominant_pct"
    return "pct"


def summarize_crop_history(crop_mix: pd.DataFrame, window_years: int = 5) -> pd.DataFrame:
    if crop_mix.empty:
        return pd.DataFrame()
    crop_mix = filter_cdl_categories(crop_mix)
    if crop_mix.empty:
        return pd.DataFrame()
    crop_mix = filter_crop_history_window(crop_mix, window_years=window_years)
    pct = _pct_col(crop_mix)
    dominant = crop_mix.sort_values(["field_id", "year", pct], ascending=[True, True, False])
    dominant = dominant.groupby(["field_id", "year"], as_index=False).first()
    sequences = []
    for field_id, group in dominant.groupby("field_id"):
        ordered = group.sort_values("year")
        crop_names = ordered["crop_name"].tolist()
        transitions = [f"{crop_names[i]} → {crop_names[i + 1]}" for i in range(len(crop_names) - 1)]
        outlook = build_crop_rotation_outlook(crop_names)
        sequences.append(
            {
                "field_id": field_id,
                "rotation_sequence": " -> ".join(crop_names),
                "rotation_count": len(transitions),
                "rotation_patterns": "; ".join(sorted(set(transitions))),
                "history_years": int(len(ordered)),
                "history_start_year": int(ordered["year"].min()),
                "history_end_year": int(ordered["year"].max()),
                "crop_diversity": int(ordered["crop_name"].nunique()),
                "corn_years": int((ordered["crop_name"] == "Corn").sum()),
                "soybean_years": int((ordered["crop_name"] == "Soybeans").sum()),
                **outlook,
            }
        )
    return pd.DataFrame(sequences)


def plot_crop_mix_stacked_100(ax, crop_mix: pd.DataFrame, title: str = "Crop composition by year"):
    if crop_mix.empty:
        ax.text(0.5, 0.5, "No CDL data", ha="center", va="center")
        ax.set_axis_off()
        return ax
    crop_mix = filter_cdl_categories(crop_mix)
    if crop_mix.empty:
        ax.text(0.5, 0.5, "No CDL data", ha="center", va="center")
        ax.set_axis_off()
        return ax
    pct = _pct_col(crop_mix)
    pivot = crop_mix.pivot_table(
        index="year", columns="crop_name", values=pct, aggfunc="sum"
    ).fillna(0)
    colors = plt.get_cmap("tab20")(np.linspace(0, 1, max(1, len(pivot.columns))))
    bottom = np.zeros(len(pivot))
    for idx, crop_name in enumerate(pivot.columns):
        values = pivot[crop_name].to_numpy(dtype=float)
        ax.bar(pivot.index.astype(str), values, bottom=bottom, label=crop_name, color=colors[idx])
        bottom += values
    ax.set_ylim(0, 100)
    ax.set_ylabel("Percent of field")
    ax.set_title(title, fontsize=12, fontweight="bold")
    ax.legend(loc="upper left", fontsize=7)
    return ax
