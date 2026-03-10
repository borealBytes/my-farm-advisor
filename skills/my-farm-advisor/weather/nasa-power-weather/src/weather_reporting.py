from __future__ import annotations

import numpy as np
import pandas as pd


def prepare_weather_reporting(weather: pd.DataFrame, base_temp_c: float = 10.0) -> pd.DataFrame:
    df = weather.copy()
    df["date"] = pd.to_datetime(df["date"])
    df["year"] = df["date"].dt.year
    df["doy"] = df["date"].dt.dayofyear
    df["month"] = df["date"].dt.month
    t_avg = (df["T2M_MAX"] + df["T2M_MIN"]) / 2.0
    df["gdd"] = np.maximum(0.0, t_avg - base_temp_c)
    df["gdd_cumulative"] = df.sort_values("date").groupby(["field_id", "year"])["gdd"].cumsum()
    return df


def summarize_weather_variability(weather: pd.DataFrame) -> pd.DataFrame:
    df = prepare_weather_reporting(weather)
    grouped = df.groupby("field_id")
    return grouped.agg(
        avg_temp_c=("T2M", "mean"),
        avg_precip_mm=("PRECTOTCORR", "mean"),
        annual_precip_mm=("PRECTOTCORR", "sum"),
        avg_gdd=("gdd", "mean"),
        max_gdd_cumulative=("gdd_cumulative", "max"),
        years=("year", "nunique"),
    ).reset_index()


def _frost_markers(df: pd.DataFrame) -> tuple[float | None, float | None]:
    last_spring = []
    first_fall = []
    for _, group in df.groupby("year"):
        cold = group[group["T2M_MIN"] <= 0].sort_values("date")
        spring = cold[cold["doy"] <= 213]
        fall = cold[cold["doy"] >= 214]
        if not spring.empty:
            last_spring.append(float(spring["doy"].max()))
        if not fall.empty:
            first_fall.append(float(fall["doy"].min()))
    spring_doy = float(np.median(last_spring)) if last_spring else None
    fall_doy = float(np.median(first_fall)) if first_fall else None
    return spring_doy, fall_doy


def _annotate_frost_lines(ax, spring_doy: float | None, fall_doy: float | None) -> None:
    ymax = ax.get_ylim()[1]
    if spring_doy is not None:
        ax.axvline(spring_doy, color="#2563eb", linestyle="--", linewidth=1.2, alpha=0.8)
        ax.text(
            spring_doy + 2,
            ymax * 0.96,
            f"Last frost\nDOY {spring_doy:.0f}",
            color="#1d4ed8",
            fontsize=7,
            va="top",
        )
    if fall_doy is not None:
        ax.axvline(fall_doy, color="#b45309", linestyle="--", linewidth=1.2, alpha=0.8)
        ax.text(
            fall_doy + 2,
            ymax * 0.82,
            f"First fall frost\nDOY {fall_doy:.0f}",
            color="#92400e",
            fontsize=7,
            va="top",
        )


def plot_temperature_doy_overlay(
    ax, weather: pd.DataFrame, title: str = "Temperature by day-of-year"
):
    df = prepare_weather_reporting(weather)
    for year, group in df.groupby("year"):
        ax.plot(group["doy"], group["T2M"], label=str(year), linewidth=1.3, alpha=0.85)
    spring_doy, fall_doy = _frost_markers(df)
    ax.set_title(title, fontsize=12, fontweight="bold")
    ax.set_xlabel("Day of year")
    ax.set_ylabel("Temperature (C)")
    ax.grid(True, alpha=0.3)
    ax.legend(fontsize=7, ncol=3)
    _annotate_frost_lines(ax, spring_doy, fall_doy)
    return ax


def plot_gdd_doy_overlay(ax, weather: pd.DataFrame, title: str = "Cumulative GDD by day-of-year"):
    df = prepare_weather_reporting(weather)
    for year, group in df.groupby("year"):
        ax.plot(group["doy"], group["gdd_cumulative"], label=str(year), linewidth=1.6, alpha=0.9)
    spring_doy, fall_doy = _frost_markers(df)
    ax.set_title(title, fontsize=12, fontweight="bold")
    ax.set_xlabel("Day of year")
    ax.set_ylabel("GDD base 10 C")
    ax.grid(True, alpha=0.3)
    ax.legend(fontsize=7, ncol=3)
    _annotate_frost_lines(ax, spring_doy, fall_doy)
    return ax


def plot_precip_boxplot(
    ax, weather: pd.DataFrame, title: str = "Cumulative precipitation by day-of-year"
):
    df = prepare_weather_reporting(weather)
    for year, group in df.groupby("year"):
        ordered = group.sort_values("date").copy()
        ordered["precip_cumulative"] = ordered["PRECTOTCORR"].cumsum()
        ax.plot(
            ordered["doy"], ordered["precip_cumulative"], label=str(year), linewidth=1.6, alpha=0.9
        )
    spring_doy, fall_doy = _frost_markers(df)
    ax.set_title(title, fontsize=12, fontweight="bold")
    ax.set_xlabel("Day of year")
    ax.set_ylabel("Cumulative precipitation (mm)")
    ax.grid(True, axis="y", alpha=0.3)
    ax.legend(fontsize=7, ncol=3)
    _annotate_frost_lines(ax, spring_doy, fall_doy)
    return ax
