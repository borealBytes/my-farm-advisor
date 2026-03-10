#!/usr/bin/env python3
"""
09_eda_field_cards.py - Per-field poster cards

Creates individual poster cards for each field showing comprehensive agronomic data.

Input:  All downloaded data
Output: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/fields/.../derived/reports/iowa_field_card_01.png through iowa_field_card_10.png
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
    print("Step 9: Per-Field Poster Cards")
    print("=" * 60)

    os.makedirs("data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports", exist_ok=True)

    # Load all data
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
        .agg({"T2M": "mean", "PRECTOTCORR": "sum", "ALLSKY_SFC_SW_DWN": "mean", "RH2M": "mean"})
        .reset_index()
    )
    weather_summary.columns = ["field_id", "avg_temp", "total_precip", "avg_solar", "avg_humidity"]

    # Calculate GDD for each field
    def calc_gdd(row):
        t_avg = row["T2M"]
        return max(0, t_avg - 10)

    weather["GDD"] = weather.apply(calc_gdd, axis=1)
    weather["month"] = weather["date"].dt.month
    growing_season = weather[(weather["month"] >= 4) & (weather["month"] <= 10)]
    gdd_summary = growing_season.groupby("field_id")["GDD"].sum().reset_index()
    gdd_summary.columns = ["field_id", "gdd_growing_season"]

    weather_summary = weather_summary.merge(gdd_summary, on="field_id")

    # Merge all data
    field_data = fields.merge(
        dominant_soil[
            [
                "field_id",
                "muname",
                "compname",
                "om_r",
                "ph1to1h2o_r",
                "cec7_r",
                "claytotal_r",
                "awc_r",
                "drainagecl",
            ]
        ],
        on="field_id",
    )
    field_data = field_data.merge(weather_summary, on="field_id")
    field_data = field_data.merge(
        cdl_2023[["field_id", "crop_name", "dominant_pct"]].rename(
            columns={"crop_name": "cdl_2023", "dominant_pct": "cdl_2023_pct"}
        ),
        on="field_id",
    )
    field_data = field_data.merge(
        cdl_2024[["field_id", "crop_name", "dominant_pct"]].rename(
            columns={"crop_name": "cdl_2024", "dominant_pct": "cdl_2024_pct"}
        ),
        on="field_id",
    )

    field_data["rotation"] = field_data["cdl_2023"] + " → " + field_data["cdl_2024"]

    # Get centroids
    field_data["centroid"] = field_data.geometry.centroid
    field_data["lon"] = field_data.centroid.x
    field_data["lat"] = field_data.centroid.y

    # Create card for each field
    for idx, field in field_data.iterrows():
        fig = plt.figure(figsize=(10, 14))

        # Title
        fig.suptitle(
            f"Field Analysis Card: {field['field_id'][-6:]}", fontsize=18, fontweight="bold", y=0.98
        )

        # Create grid
        gs = fig.add_gridspec(4, 2, height_ratios=[0.8, 1.2, 1.2, 1], hspace=0.35, wspace=0.25)

        # ===============================
        # Row 1: Field Info
        # ===============================
        ax_info = fig.add_subplot(gs[0, :])
        ax_info.axis("off")

        info_text = f"""
        📍 ID: {field["field_id"]} | Area: {field["area_acres"]:.1f} acres | Lat: {field["lat"]:.4f}, Lon: {field["lon"]:.4f}
        🌾 OSM: {field["crop_name"]} | Region: {field["region"]}
        """
        ax_info.text(
            0.5,
            0.5,
            info_text,
            ha="center",
            va="center",
            fontsize=12,
            transform=ax_info.transAxes,
            bbox=dict(boxstyle="round", facecolor="lightblue", alpha=0.3),
        )

        # ===============================
        # Row 2: Soil Properties
        # ===============================
        ax_soil = fig.add_subplot(gs[1, :])
        ax_soil.axis("off")
        ax_soil.set_title("🪨 Soil Properties", fontsize=14, fontweight="bold", loc="left")

        # Soil metrics
        soil_metrics = [
            f"Series: {field['compname']}",
            f"Map Unit: {field['muname'][:40]}...",
            f"pH: {field['ph1to1h2o_r']:.1f} {'✓' if 6.0 <= field['ph1to1h2o_r'] <= 7.0 else '⚠'}",
            f"Organic Matter: {field['om_r']:.1f}%",
            f"CEC: {field['cec7_r']:.1f} meq/100g",
            f"Clay: {field['claytotal_r']:.0f}%",
            f"AWC: {field['awc_r']:.2f} in/in",
            f"Drainage: {field['drainagecl']}",
        ]

        for i, metric in enumerate(soil_metrics):
            ax_soil.text(0.05, 0.85 - i * 0.12, metric, fontsize=11, transform=ax_soil.transAxes)

        # Soil bar chart
        ax_soil_bar = fig.add_subplot(gs[1, 1])
        soil_vals = [
            field["om_r"],
            field["ph1to1h2o_r"] / 2,
            field["cec7_r"] / 10,
            field["claytotal_r"] / 10,
        ]
        soil_labels = ["OM%", "pH/2", "CEC/10", "Clay/10"]
        colors = ["darkgreen", "steelblue", "brown", "orange"]
        ax_soil_bar.barh(soil_labels, soil_vals, color=colors, edgecolor="black")
        ax_soil_bar.set_title("Soil Metrics", fontsize=10, fontweight="bold")
        ax_soil_bar.set_xlim(0, 6)

        # ===============================
        # Row 3: Crop & Weather
        # ===============================
        # Crop panel
        ax_crop = fig.add_subplot(gs[2, 0])
        ax_crop.axis("off")
        ax_crop.set_title("🌽 Crop Types (CDL)", fontsize=14, fontweight="bold", loc="left")

        crop_text = f"""
        2023: {field["cdl_2023"]} ({field["cdl_2023_pct"]:.0f}%)
        2024: {field["cdl_2024"]} ({field["cdl_2024_pct"]:.0f}%)
        
        Rotation: {field["rotation"]}
        """
        ax_crop.text(0.05, 0.7, crop_text, fontsize=11, transform=ax_crop.transAxes)

        # Crop bar
        ax_crop_bar = fig.add_subplot(gs[2, 0])
        ax_crop_bar.axis("off")

        # Weather panel
        ax_weather = fig.add_subplot(gs[2, 1])
        ax_weather.axis("off")
        ax_weather.set_title("🌤️ Weather (2023-2024)", fontsize=14, fontweight="bold", loc="left")

        weather_text = f"""
        Avg Temp: {field["avg_temp"]:.1f}°C
        Total Precip: {field["total_precip"]:.0f} mm
        Avg Solar: {field["avg_solar"]:.0f} W/m²
        Avg Humidity: {field["avg_humidity"]:.0f}%
        Growing Season GDD: {field["gdd_growing_season"]:.0f}
        """
        ax_weather.text(0.05, 0.7, weather_text, fontsize=11, transform=ax_weather.transAxes)

        # ===============================
        # Row 4: Weather Charts
        # ===============================
        # Monthly precip for this field
        field_weather = weather[weather["field_id"] == field["field_id"]]
        field_weather = field_weather.copy()
        field_weather["month"] = field_weather["date"].dt.month
        field_weather["year"] = field_weather["date"].dt.year

        monthly_precip = (
            field_weather.groupby(["year", "month"])["PRECTOTCORR"].sum().unstack(level=0)
        )

        ax_precip = fig.add_subplot(gs[3, 0])
        months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ]
        x = np.arange(12)
        width = 0.35

        if 2023 in monthly_precip.columns and 2024 in monthly_precip.columns:
            ax_precip.bar(
                x - width / 2, monthly_precip[2023], width, label="2023", color="steelblue"
            )
            ax_precip.bar(
                x + width / 2, monthly_precip[2024], width, label="2024", color="darkgreen"
            )

        ax_precip.set_xticks(x)
        ax_precip.set_xticklabels([m[:3] for m in months], rotation=45, fontsize=8)
        ax_precip.set_ylabel("Precipitation (mm)")
        ax_precip.set_title("Monthly Precipitation", fontsize=12, fontweight="bold")
        ax_precip.legend(fontsize=8)

        # Temperature time series for this field
        ax_temp = fig.add_subplot(gs[3, 1])
        field_weather = field_weather.sort_values("date")
        ax_temp.plot(
            field_weather["date"], field_weather["T2M"], color="black", linewidth=1, label="Mean"
        )
        ax_temp.fill_between(
            field_weather["date"],
            field_weather["T2M_MIN"],
            field_weather["T2M_MAX"],
            alpha=0.3,
            color="orange",
            label="Range",
        )
        ax_temp.axhline(y=10, color="green", linestyle="--", alpha=0.5, label="Base 10°C")
        ax_temp.set_title("Daily Temperature", fontsize=12, fontweight="bold")
        ax_temp.tick_params(axis="x", rotation=45, labelsize=7)
        ax_temp.legend(fontsize=8)

        # Save card
        card_num = idx + 1
        plt.savefig(
            f"data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/iowa_field_card_{card_num:02d}.png",
            dpi=150,
            bbox_inches="tight",
        )
        plt.close()

        print(f"✓ Card {card_num}/10: {field['field_id'][-6:]}")

    print(
        "\n✓ All 10 field cards saved to: data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/derived/reports/"
    )

    return field_data


if __name__ == "__main__":
    main()
