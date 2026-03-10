#!/usr/bin/env python3
"""
06_eda_time_series.py - Time series analysis

Creates time series visualizations for weather data (temperature, precipitation).

Input:  data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_weather_2021_2025.csv
Output: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_weather_timeseries.png
data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_monthly_precip.png
data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_gdd_analysis.png
"""

import os

import matplotlib
import numpy as np
import pandas as pd

matplotlib.use("Agg")
import matplotlib.dates as mdates
import matplotlib.pyplot as plt


def main():
    print("=" * 60)
    print("Step 6: Time Series Analysis")
    print("=" * 60)

    os.makedirs("data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports", exist_ok=True)

    weather = pd.read_csv(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_weather_2021_2025.csv",
        parse_dates=["date"],
    )
    weather = weather.sort_values("date")

    # Aggregate by date (mean across all fields)
    daily = (
        weather.groupby("date")
        .agg(
            {
                "T2M": "mean",
                "T2M_MAX": "mean",
                "T2M_MIN": "mean",
                "PRECTOTCORR": "sum",
                "ALLSKY_SFC_SW_DWN": "mean",
            }
        )
        .reset_index()
    )

    # ===============================
    # Plot 1: Temperature Time Series
    # ===============================
    fig, ax = plt.subplots(figsize=(14, 5))

    ax.fill_between(
        daily["date"],
        daily["T2M_MIN"],
        daily["T2M_MAX"],
        alpha=0.3,
        color="orange",
        label="Temperature Range",
    )
    ax.plot(daily["date"], daily["T2M"], color="black", linewidth=1, label="Mean Temp")
    ax.plot(
        daily["date"], daily["T2M_MAX"], color="red", alpha=0.5, linewidth=0.5, label="Max Temp"
    )
    ax.plot(
        daily["date"], daily["T2M_MIN"], color="blue", alpha=0.5, linewidth=0.5, label="Min Temp"
    )

    ax.axhline(y=10, color="green", linestyle="--", alpha=0.5, label="10°C")
    ax.axhline(y=20, color="darkgreen", linestyle="--", alpha=0.5, label="20°C")

    ax.set_title("Iowa Fields: Daily Temperature (2023-2024)", fontsize=14, fontweight="bold")
    ax.set_xlabel("Date")
    ax.set_ylabel("Temperature (°C)")
    ax.legend(loc="upper right")
    ax.grid(True, alpha=0.3)
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    plt.xticks(rotation=45)

    plt.tight_layout()
    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_weather_timeseries.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_weather_timeseries.png"
    )

    # ===============================
    # Plot 2: Monthly Precipitation
    # ===============================
    weather["month"] = weather["date"].dt.month
    weather["year"] = weather["date"].dt.year

    monthly = weather.groupby(["year", "month"])["PRECTOTCORR"].sum().unstack(level=0)

    fig, ax = plt.subplots(figsize=(10, 6))
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    x = np.arange(len(months))
    width = 0.35

    bars1 = ax.bar(x - width / 2, monthly[2023], width, label="2023", color="steelblue")
    bars2 = ax.bar(x + width / 2, monthly[2024], width, label="2024", color="darkgreen")

    ax.set_title("Monthly Precipitation Comparison: 2023 vs 2024", fontsize=14, fontweight="bold")
    ax.set_xlabel("Month")
    ax.set_ylabel("Precipitation (mm)")
    ax.set_xticks(x)
    ax.set_xticklabels(months)
    ax.legend()
    ax.grid(True, alpha=0.3, axis="y")

    # Add value labels
    for bar in bars1:
        height = bar.get_height()
        if height > 10:
            ax.annotate(
                f"{int(height)}",
                xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 3),
                textcoords="offset points",
                ha="center",
                va="bottom",
                fontsize=8,
            )

    plt.tight_layout()
    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_monthly_precip.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_monthly_precip.png"
    )

    # ===============================
    # Plot 3: GDD Analysis
    # ===============================
    def calc_gdd(temp_min, temp_max, base=10):
        """Calculate Growing Degree Days."""
        t_avg = (temp_min + temp_max) / 2
        gdd = max(0, t_avg - base)
        return gdd

    daily["GDD"] = daily.apply(lambda row: calc_gdd(row["T2M_MIN"], row["T2M_MAX"]), axis=1)
    daily["GDD_cumsum"] = daily["GDD"].cumsum()

    # Get GDD for growing season (April-October)
    growing_season = daily[(daily["date"].dt.month >= 4) & (daily["date"].dt.month <= 10)]
    gdd_2023 = growing_season[growing_season["date"].dt.year == 2023]["GDD"].sum()
    gdd_2024 = growing_season[growing_season["date"].dt.year == 2024]["GDD"].sum()

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    # GDD time series
    ax1 = axes[0]
    ax1.plot(daily["date"], daily["GDD_cumsum"], color="green", linewidth=2)
    ax1.set_title("Cumulative Growing Degree Days", fontsize=12, fontweight="bold")
    ax1.set_xlabel("Date")
    ax1.set_ylabel("GDD (base 10°C)")
    ax1.grid(True, alpha=0.3)
    ax1.xaxis.set_major_locator(mdates.MonthLocator(interval=3))
    ax1.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
    plt.setp(ax1.xaxis.get_majorticklabels(), rotation=45)

    # GDD by year comparison
    ax2 = axes[1]
    years = ["2023", "2024"]
    gdd_values = [gdd_2023, gdd_2024]
    colors = ["steelblue", "darkgreen"]
    bars = ax2.bar(years, gdd_values, color=colors, edgecolor="black")
    ax2.set_title("Total Growing Season GDD", fontsize=12, fontweight="bold")
    ax2.set_ylabel("GDD")
    for bar, val in zip(bars, gdd_values):
        ax2.annotate(
            f"{int(val)}",
            xy=(bar.get_x() + bar.get_width() / 2, val),
            xytext=(0, 5),
            textcoords="offset points",
            ha="center",
            fontsize=12,
            fontweight="bold",
        )
    ax2.grid(True, alpha=0.3, axis="y")

    plt.tight_layout()
    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_gdd_analysis.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_gdd_analysis.png"
    )

    print("\n✓ Time series analysis complete")
    print(f"  2023 Growing Season GDD: {gdd_2023:.0f}")
    print(f"  2024 Growing Season GDD: {gdd_2024:.0f}")

    return daily


if __name__ == "__main__":
    main()
