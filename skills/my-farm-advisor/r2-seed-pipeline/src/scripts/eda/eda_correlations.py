#!/usr/bin/env python3
"""
08_eda_correlations.py - Correlation analysis

Creates correlation matrix and XY plots for soil properties.

Input:  data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/boundary/field_boundaries.geojson
data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_10_fields_soil.csv
data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_weather_2021_2025.csv
Output: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/summaries/iowa_correlation_matrix.csv
data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_correlation_heatmap.png
data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_xy_plots.png
"""

import os

import geopandas as gpd
import matplotlib
import pandas as pd

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns


def main():
    print("=" * 60)
    print("Step 8: Correlation Analysis")
    print("=" * 60)

    os.makedirs("data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports", exist_ok=True)
    os.makedirs(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/summaries", exist_ok=True
    )

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

    # Get dominant soil per field
    dominant_soil = (
        soil.sort_values(["field_id", "comppct_r"], ascending=[True, False])
        .groupby("field_id")
        .first()
        .reset_index()
    )

    # Get weather summary per field
    weather_summary = (
        weather.groupby("field_id")
        .agg({"T2M": "mean", "PRECTOTCORR": "sum", "ALLSKY_SFC_SW_DWN": "mean"})
        .reset_index()
    )
    weather_summary.columns = ["field_id", "avg_temp", "total_precip", "avg_solar"]

    # Merge all data
    merged = fields.merge(
        dominant_soil[["field_id", "om_r", "ph1to1h2o_r", "cec7_r", "claytotal_r", "awc_r"]],
        on="field_id",
    )
    merged = merged.merge(weather_summary, on="field_id")

    # Select numeric columns for correlation
    corr_cols = [
        "area_acres",
        "om_r",
        "ph1to1h2o_r",
        "cec7_r",
        "claytotal_r",
        "awc_r",
        "avg_temp",
        "total_precip",
        "avg_solar",
    ]
    corr_data = merged[corr_cols].dropna()

    # ===============================
    # Plot 1: Correlation Heatmap
    # ===============================
    corr_matrix = corr_data.corr()

    fig, ax = plt.subplots(figsize=(12, 10))
    sns.heatmap(
        corr_matrix,
        annot=True,
        cmap="RdYlBu_r",
        center=0,
        fmt=".2f",
        square=True,
        ax=ax,
        vmin=-1,
        vmax=1,
        annot_kws={"fontsize": 10},
    )
    ax.set_title(
        "Correlation Matrix: Field, Soil & Weather Properties", fontsize=14, fontweight="bold"
    )

    plt.tight_layout()
    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_correlation_heatmap.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_correlation_heatmap.png"
    )

    # Save correlation matrix
    corr_matrix.to_csv(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/summaries/iowa_correlation_matrix.csv"
    )
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/summaries/iowa_correlation_matrix.csv"
    )

    # ===============================
    # Plot 2: Key XY Plots
    # ===============================
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))

    # pH vs OM
    ax = axes[0, 0]
    ax.scatter(
        merged["ph1to1h2o_r"], merged["om_r"], s=100, alpha=0.7, c="steelblue", edgecolor="black"
    )
    ax.set_xlabel("pH")
    ax.set_ylabel("Organic Matter (%)")
    ax.set_title("pH vs Organic Matter", fontweight="bold")

    # pH vs CEC
    ax = axes[0, 1]
    ax.scatter(
        merged["ph1to1h2o_r"], merged["cec7_r"], s=100, alpha=0.7, c="brown", edgecolor="black"
    )
    ax.set_xlabel("pH")
    ax.set_ylabel("CEC (meq/100g)")
    ax.set_title("pH vs CEC", fontweight="bold")

    # OM vs CEC
    ax = axes[0, 2]
    ax.scatter(merged["om_r"], merged["cec7_r"], s=100, alpha=0.7, c="green", edgecolor="black")
    ax.set_xlabel("Organic Matter (%)")
    ax.set_ylabel("CEC (meq/100g)")
    ax.set_title("OM vs CEC", fontweight="bold")

    # Area vs OM
    ax = axes[1, 0]
    ax.scatter(
        merged["area_acres"], merged["om_r"], s=100, alpha=0.7, c="orange", edgecolor="black"
    )
    ax.set_xlabel("Field Area (acres)")
    ax.set_ylabel("Organic Matter (%)")
    ax.set_title("Field Size vs OM", fontweight="bold")

    # Clay vs AWC
    ax = axes[1, 1]
    ax.scatter(
        merged["claytotal_r"], merged["awc_r"], s=100, alpha=0.7, c="purple", edgecolor="black"
    )
    ax.set_xlabel("Clay %")
    ax.set_ylabel("Available Water Capacity")
    ax.set_title("Clay vs AWC", fontweight="bold")

    # Avg Temp vs Total Precip
    ax = axes[1, 2]
    ax.scatter(
        merged["avg_temp"], merged["total_precip"], s=100, alpha=0.7, c="teal", edgecolor="black"
    )
    ax.set_xlabel("Average Temperature (°C)")
    ax.set_ylabel("Total Precipitation (mm)")
    ax.set_title("Temperature vs Precipitation", fontweight="bold")

    plt.suptitle("XY Plots: Soil & Weather Relationships", fontsize=14, fontweight="bold", y=1.02)
    plt.tight_layout()
    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_xy_plots.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_xy_plots.png"
    )

    print("\n✓ Correlation analysis complete")
    print("\nKey Correlations:")
    print(f"  pH ↔ OM: {corr_matrix.loc['ph1to1h2o_r', 'om_r']:.2f}")
    print(f"  OM ↔ CEC: {corr_matrix.loc['om_r', 'cec7_r']:.2f}")
    print(f"  Clay ↔ AWC: {corr_matrix.loc['claytotal_r', 'awc_r']:.2f}")

    return merged


if __name__ == "__main__":
    main()
