#!/usr/bin/env python3
"""
07_eda_distributions.py - Distribution analysis

Creates histograms, bar charts, and distribution plots for soil and crop data.

Input:  data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_10_fields_soil.csv
data/moltbot/shared/cdl/derived/tables/iowa_2023_cdl.csv, data/moltbot/shared/cdl/derived/tables/iowa_2024_cdl.csv
Output: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_soil_distributions.png
data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_cdl_distributions.png
"""

import os

import matplotlib
import pandas as pd

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def main():
    print("=" * 60)
    print("Step 7: Distribution Analysis")
    print("=" * 60)

    os.makedirs("data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports", exist_ok=True)

    soil = pd.read_csv(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/tables/iowa_10_fields_soil.csv"
    )
    cdl_2023 = pd.read_csv("data/moltbot/shared/cdl/derived/tables/iowa_2023_cdl.csv")
    cdl_2024 = pd.read_csv("data/moltbot/shared/cdl/derived/tables/iowa_2024_cdl.csv")

    # ===============================
    # Plot 1: Soil Property Distributions
    # ===============================
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))

    # pH
    ax = axes[0, 0]
    soil["ph1to1h2o_r"].dropna().hist(bins=15, ax=ax, color="steelblue", edgecolor="black")
    ax.axvline(
        soil["ph1to1h2o_r"].mean(),
        color="red",
        linestyle="--",
        label=f"Mean: {soil['ph1to1h2o_r'].mean():.1f}",
    )
    ax.set_title("Soil pH Distribution", fontweight="bold")
    ax.set_xlabel("pH")
    ax.legend(fontsize=8)

    # Organic Matter
    ax = axes[0, 1]
    soil["om_r"].dropna().hist(bins=15, ax=ax, color="darkgreen", edgecolor="black")
    ax.axvline(
        soil["om_r"].mean(), color="red", linestyle="--", label=f"Mean: {soil['om_r'].mean():.1f}%"
    )
    ax.set_title("Organic Matter %", fontweight="bold")
    ax.set_xlabel("OM %")
    ax.legend(fontsize=8)

    # CEC
    ax = axes[0, 2]
    soil["cec7_r"].dropna().hist(bins=15, ax=ax, color="brown", edgecolor="black")
    ax.axvline(
        soil["cec7_r"].mean(),
        color="red",
        linestyle="--",
        label=f"Mean: {soil['cec7_r'].mean():.1f}",
    )
    ax.set_title("CEC (meq/100g)", fontweight="bold")
    ax.set_xlabel("CEC")
    ax.legend(fontsize=8)

    # Clay
    ax = axes[1, 0]
    soil["claytotal_r"].dropna().hist(bins=15, ax=ax, color="orange", edgecolor="black")
    ax.axvline(
        soil["claytotal_r"].mean(),
        color="red",
        linestyle="--",
        label=f"Mean: {soil['claytotal_r'].mean():.1f}%",
    )
    ax.set_title("Clay %", fontweight="bold")
    ax.set_xlabel("Clay %")
    ax.legend(fontsize=8)

    # AWC
    ax = axes[1, 1]
    soil["awc_r"].dropna().hist(bins=15, ax=ax, color="purple", edgecolor="black")
    ax.axvline(
        soil["awc_r"].mean(), color="red", linestyle="--", label=f"Mean: {soil['awc_r'].mean():.2f}"
    )
    ax.set_title("Available Water Capacity", fontweight="bold")
    ax.set_xlabel("AWC (in/in)")
    ax.legend(fontsize=8)

    # Drainage Class
    ax = axes[1, 2]
    drainage_counts = soil["drainagecl"].value_counts()
    drainage_counts.plot(kind="bar", ax=ax, color="teal", edgecolor="black")
    ax.set_title("Drainage Class Distribution", fontweight="bold")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=45)

    plt.suptitle(
        "Soil Property Distributions Across All Fields", fontsize=14, fontweight="bold", y=1.02
    )
    plt.tight_layout()
    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_soil_distributions.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_soil_distributions.png"
    )

    # ===============================
    # Plot 2: CDL Crop Distributions
    # ===============================
    fig, axes = plt.subplots(1, 3, figsize=(15, 5))

    # 2023 crops
    ax = axes[0]
    cdl_2023["crop_name"].value_counts().plot(
        kind="bar", ax=ax, color="steelblue", edgecolor="black"
    )
    ax.set_title("CDL 2023 Crop Types", fontweight="bold")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=45)

    # 2024 crops
    ax = axes[1]
    cdl_2024["crop_name"].value_counts().plot(
        kind="bar", ax=ax, color="darkgreen", edgecolor="black"
    )
    ax.set_title("CDL 2024 Crop Types", fontweight="bold")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=45)

    # Rotation
    rotation = cdl_2023.merge(cdl_2024, on="field_id", suffixes=("_2023", "_2024"))
    rotation["rotation"] = rotation["crop_name_2023"] + " → " + rotation["crop_name_2024"]

    ax = axes[2]
    rotation["rotation"].value_counts().plot(kind="bar", ax=ax, color="purple", edgecolor="black")
    ax.set_title("Crop Rotation Patterns 2023→2024", fontweight="bold")
    ax.set_xlabel("")
    ax.tick_params(axis="x", rotation=45)

    plt.tight_layout()
    plt.savefig(
        "data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_cdl_distributions.png",
        dpi=150,
        bbox_inches="tight",
    )
    plt.close()
    print(
        "✓ Saved: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_cdl_distributions.png"
    )

    print("\n✓ Distribution analysis complete")


if __name__ == "__main__":
    main()
