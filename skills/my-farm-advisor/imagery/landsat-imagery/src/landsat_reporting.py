from __future__ import annotations

import numpy as np
import pandas as pd


def choose_best_landsat_scene(
    scenes: pd.DataFrame, target_date: str | None = None
) -> pd.Series | None:
    if scenes.empty:
        return None
    df = scenes.copy()
    date_col = None
    for candidate in ["acquisition_date", "date", "display_id"]:
        if candidate in df.columns:
            date_col = candidate
            break
    if date_col and date_col != "display_id":
        df[date_col] = pd.to_datetime(df[date_col])
    if target_date is not None and date_col and date_col != "display_id":
        target = pd.to_datetime(target_date)
        df["target_distance_days"] = (df[date_col] - target).abs().dt.days
    else:
        df["target_distance_days"] = 0
    sort_cols = [c for c in ["cloud_cover", "target_distance_days", date_col] if c in df.columns]
    return df.sort_values(sort_cols).iloc[0]


def summarize_landsat_ndvi(stats: pd.DataFrame, date_column: str = "date") -> pd.DataFrame:
    if stats.empty:
        return pd.DataFrame()
    df = stats.copy()
    df[date_column] = pd.to_datetime(df[date_column])
    df = df.sort_values(["field_id", date_column])
    rows = []
    for field_id, group in df.groupby("field_id"):
        x = group[date_column].map(pd.Timestamp.toordinal).to_numpy(dtype=float)
        y = group["mean_ndvi"].to_numpy(dtype=float)
        integral = float(np.trapz(y, x)) if len(group) > 1 else float(y[0]) if len(y) else np.nan
        rows.append(
            {
                "field_id": field_id,
                "scene_count": int(len(group)),
                "ndvi_latest_mean": float(group.iloc[-1]["mean_ndvi"]),
                "ndvi_season_mean": float(group["mean_ndvi"].mean()),
                "ndvi_season_max": float(group["mean_ndvi"].max()),
                "ndvi_integral": integral,
            }
        )
    return pd.DataFrame(rows)


def plot_landsat_ndvi_timeseries(ax, stats: pd.DataFrame, title: str = "Landsat NDVI over time"):
    if stats.empty:
        ax.text(0.5, 0.5, "No Landsat NDVI scene statistics", ha="center", va="center")
        ax.set_axis_off()
        return ax
    df = stats.copy()
    df["date"] = pd.to_datetime(df["date"])
    for field_id, group in df.groupby("field_id"):
        ax.plot(
            group["date"], group["mean_ndvi"], marker="o", linewidth=1.3, label=str(field_id)[-6:]
        )
    ax.set_title(title, fontsize=12, fontweight="bold")
    ax.set_ylabel("Mean NDVI")
    ax.grid(True, alpha=0.3)
    ax.legend(fontsize=7, ncol=2)
    return ax
