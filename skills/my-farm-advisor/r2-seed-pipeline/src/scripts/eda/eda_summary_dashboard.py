#!/usr/bin/env python3
"""
10_eda_summary_dashboard.py - Combined summary dashboard

Creates a multi-panel dashboard combining all key visualizations.

Input:  All data and EDA outputs
Output: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_summary_dashboard.png
"""

import os

import geopandas as gpd
import matplotlib
import numpy as np
import pandas as pd

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    print("=" * 60)
    print("Step 10: Summary Dashboard")
    print("=" * 60)

    os.makedirs("data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports", exist_ok=True)

    # Load data
    fields = gpd.read_file(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/boundary/field_boundaries.geojson"
    )
    soil = pd.read_csv(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_10_fields_soil.csv"
    )
    weather = pd.read_csv(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_weather_2021_2025.csv",
        parse_dates=["date"],
    )
    cdl_2023 = pd.read_csv("data/moltbot/shared/cdl/derived/tables/iowa_2023_cdl.csv")
    cdl_2024 = pd.read_csv("data/moltbot/shared/cdl/derived/tables/iowa_2024_cdl.csv")

    weather["month"] = weather["date"].dt.month
    weather["year"] = weather["date"].dt.year

    # Create dashboard
    fig = plt.figure(figsize=(20, 16))
    fig.suptitle(
        "Iowa Corn Belt Agricultural Analysis - Summary Dashboard",
        fontsize=20,
        fontweight="bold",
        y=0.98,
    )

    gs = fig.add_gridspec(4, 4, hspace=0.4, wspace=0.3)

    # ===============================
    # Row 1: Overview stats
    # ===============================
    ax = fig.add_subplot(gs[0, :2])
    ax.axis("off")
    stats_text = f"""
    ╔═══════════════════════════════════════════════════╗
    ║  IOWA CORN BELT ANALYSIS SUMMARY                 ║
    ╠═══════════════════════════════════════════════════╣
    ║  Fields: 10 | Total Area: {fields["area_acres"].sum():.1f} acres         ║
    ║  Period: 2023-2024                                ║
    ║  Soil Records: {len(soil)} | Weather: {len(weather)} daily     ║
    ╚═══════════════════════════════════════════════════╝
    """
    ax.text(
        0.5,
        0.5,
        stats_text,
        ha="center",
        va="center",
        fontsize=12,
        family="monospace",
        transform=ax.transAxes,
        bbox=dict(boxstyle="round", facecolor="lightblue", alpha=0.3),
    )

    # Field size distribution
    ax2 = fig.add_subplot(gs[0, 2:])
    ax2.bar(
        range(len(fields)),
        fields.sort_values("area_acres", ascending=False)["area_acres"],
        color="steelblue",
        edgecolor="black",
    )
    ax2.set_title("Field Sizes (sorted)", fontweight="bold")
    ax2.set_xlabel("Field Rank")
    ax2.set_ylabel("Acres")
    ax2.axhline(
        y=fields["area_acres"].mean(),
        color="red",
        linestyle="--",
        label=f"Mean: {fields['area_acres'].mean():.0f}",
    )
    ax2.legend()

    # ===============================
    # Row 2: Weather
    # ===============================
    # Monthly precip
    ax3 = fig.add_subplot(gs[1, :2])
    monthly = weather.groupby(["year", "month"])["PRECTOTCORR"].sum().unstack(level=0)
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    x = np.arange(12)
    width = 0.35
    ax3.bar(x - width / 2, monthly[2023], width, label="2023", color="steelblue")
    ax3.bar(x + width / 2, monthly[2024], width, label="2024", color="darkgreen")
    ax3.set_xticks(x)
    ax3.set_xticklabels([m[:3] for m in months])
    ax3.set_title("Monthly Precipitation", fontweight="bold")
    ax3.set_ylabel("mm")
    ax3.legend()

    # Temperature
    ax4 = fig.add_subplot(gs[1, 2:])
    daily_avg = weather.groupby("date")["T2M"].mean().reset_index()
    daily_avg = daily_avg.sort_values("date")
    ax4.plot(daily_avg["date"], daily_avg["T2M"], color="black", linewidth=0.5)
    ax4.fill_between(
        daily_avg["date"],
        weather.groupby("date")["T2M_MIN"].mean().values,
        weather.groupby("date")["T2M_MAX"].mean().values,
        alpha=0.3,
        color="orange",
    )
    ax4.axhline(y=10, color="green", linestyle="--", alpha=0.5, label="10°C")
    ax4.axhline(y=20, color="darkgreen", linestyle="--", alpha=0.5, label="20°C")
    ax4.set_title("Daily Temperature", fontweight="bold")
    ax4.set_ylabel("°C")
    ax4.legend()

    # ===============================
    # Row 3: Soil
    # ===============================
    # Soil distributions
    ax5 = fig.add_subplot(gs[2, :2])
    ax5.hist(soil["ph1to1h2o_r"].dropna(), bins=15, alpha=0.7, label="pH", color="steelblue")
    ax5.hist(soil["om_r"].dropna(), bins=15, alpha=0.7, label="OM%", color="green")
    ax5.set_title("Soil Property Distributions", fontweight="bold")
    ax5.legend()

    # Drainage
    ax6 = fig.add_subplot(gs[2, 2:])
    drainage = soil["drainagecl"].value_counts()
    ax6.pie(
        drainage.values,
        labels=drainage.index,
        autopct="%1.0f%%",
        colors=plt.cm.Set3(range(len(drainage))),
    )
    ax6.set_title("Drainage Class Distribution", fontweight="bold")

    # ===============================
    # Row 4: CDL Crops
    # ===============================
    # Crop types
    ax7 = fig.add_subplot(gs[3, :2])
    crop_counts = cdl_2023["crop_name"].value_counts()
    ax7.barh(crop_counts.index, crop_counts.values, color="orange", edgecolor="black")
    ax7.set_title("CDL 2023 Crop Types", fontweight="bold")
    ax7.set_xlabel("Count")

    # Rotation
    ax8 = fig.add_subplot(gs[3, 2:])
    rotation = cdl_2023.merge(cdl_2024, on="field_id")
    rotation["rotation"] = rotation["crop_name_x"] + "→" + rotation["crop_name_y"]
    rot_counts = rotation["rotation"].value_counts()
    ax8.barh(rot_counts.index, rot_counts.values, color="purple", edgecolor="black")
    ax8.set_title("Crop Rotation 2023→2024", fontweight="bold")
    ax8.set_xlabel("Count")

    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_summary_dashboard.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_summary_dashboard.png"
    )

    print("\n✓ Summary dashboard complete")

    return True


if __name__ == "__main__":
    main()
