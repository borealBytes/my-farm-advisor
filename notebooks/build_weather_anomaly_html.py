#!/usr/bin/env python3
"""Build interactive weather anomaly HTML map."""

import json
from pathlib import Path

import pandas as pd
from shapely.geometry import shape

WEATHER_CSV = Path("notebooks/data/weather/jefferson_farm_weather_2024_2025.csv")
FIELDS_GEOJSON = Path("notebooks/data/field_boundaries/jefferson_farm_fields.geojson")
OUTPUT_HTML = Path("notebooks/jefferson_farm_weather_anomaly.html")

BASE_TEMP_F = 45.0
CAP_TEMP_F = 86.0


def calculate_gdd_fahrenheit(t_max_c, t_min_c, base_f=45.0, cap_f=86.0):
    """Calculate daily GDD in Fahrenheit."""
    t_max_f = t_max_c * 9 / 5 + 32
    t_min_f = t_min_c * 9 / 5 + 32
    t_avg_f = (t_max_f + t_min_f) / 2
    gdd = max(0, min(t_avg_f, cap_f) - base_f)
    return round(gdd, 2)


def main():
    # Load weather data
    df = pd.read_csv(WEATHER_CSV)
    df["date"] = pd.to_datetime(df["date"])

    # Calculate daily GDD from raw temps (using the formula)
    df["gdd_daily"] = df.apply(
        lambda r: calculate_gdd_fahrenheit(r["T2M_MAX"], r["T2M_MIN"], BASE_TEMP_F, CAP_TEMP_F),
        axis=1
    )

    # Aggregate per field per year - use gdd_daily and PRECTOTCORR already in file
    summary = df.groupby(["field_name", "year"]).agg({
        "gdd_daily": "sum",
        "PRECTOTCORR": "sum"
    }).reset_index()
    summary.columns = ["field_name", "year", "total_gdd", "total_precip_in"]  # Already in inches from Open-Meteo

    # Pivot for comparison
    gdd_pivot = summary.pivot(index="field_name", columns="year", values="total_gdd")
    gdd_pivot.columns = [f"gdd_{y}" for y in gdd_pivot.columns]
    gdd_pivot = gdd_pivot.reset_index()

    precip_pivot = summary.pivot(index="field_name", columns="year", values="total_precip_in")
    precip_pivot.columns = [f"precip_{y}_in" for y in precip_pivot.columns]
    precip_pivot = precip_pivot.reset_index()
    
    field_stats = gdd_pivot.merge(precip_pivot, on="field_name")
    field_stats = field_stats.fillna(0)

    # Calculate anomalies (% diff in GDD) - handle per-row
    field_stats["gdd_2024"] = field_stats["gdd_2024"].fillna(0)
    field_stats["gdd_2025"] = field_stats["gdd_2025"].fillna(0)
    field_stats["precip_2024_in"] = field_stats["precip_2024_in"].fillna(0)
    field_stats["precip_2025_in"] = field_stats["precip_2025_in"].fillna(0)
    
    # Calculate % difference
    gdd_diff = field_stats["gdd_2025"] - field_stats["gdd_2024"]
    gdd_diff = gdd_diff / field_stats["gdd_2024"].replace(0, 1) * 100
    field_stats["gdd_diff_pct"] = gdd_diff.round(1)

    print(f"Field stats shape: {field_stats.shape}")
    print(field_stats.head())

    # Load GeoJSON
    with open(FIELDS_GEOJSON) as f:
        gj = json.load(f)

    # Build field data for JS
    field_data = {}
    stats_dict = field_stats.set_index("field_name").to_dict("index")

    for feature in gj["features"]:
        name = feature["properties"].get("Name", "Unknown")
        stats = stats_dict.get(name, {})

        geom = feature["geometry"]
        if geom["type"] == "Polygon":
            coords = geom["coordinates"][0]
        elif geom["type"] == "MultiPolygon":
            coords = geom["coordinates"][0][0]
        else:
            continue

        # Convert to leaflet format [lat, lon]
        leaflet_coords = [[c[1], c[0]] for c in coords]

        gdd_2024 = stats.get("gdd_2024", 0)
        gdd_2025 = stats.get("gdd_2025", 0)
        precip_2024 = stats.get("precip_2024_in", 0)
        precip_2025 = stats.get("precip_2025_in", 0)
        diff_pct = stats.get("gdd_diff_pct", 0)

        # Color based on GDD difference
        if diff_pct > 10:
            color = "#e74c3c"  # red - significantly warmer
        elif diff_pct < -10:
            color = "#3498db"  # blue - significantly cooler
        else:
            color = "#2ecc71"  # green - similar

        field_data[name] = {
            "coords": leaflet_coords,
            "gdd_2024": round(gdd_2024, 0),
            "gdd_2025": round(gdd_2025, 0),
            "precip_2024": round(precip_2024, 2),
            "precip_2025": round(precip_2025, 2),
            "diff_pct": diff_pct,
            "color": color
        }

    # Calculate aggregate stats for chart
    daily_agg = df.groupby(["date", "year"]).agg({
        "PRECTOTCORR": "sum",
        "gdd_daily": "sum"
    }).reset_index()
    daily_agg["precip_cumsum"] = daily_agg.groupby("year")["PRECTOTCORR"].cumsum() / 25.4
    daily_agg["gdd_cumsum"] = daily_agg.groupby("year")["gdd_daily"].cumsum()

    # Prepare chart data
    daily_2024 = daily_agg[daily_agg["year"] == 2024].sort_values("date")
    daily_2025 = daily_agg[daily_agg["year"] == 2025].sort_values("date")

    precip_dates = [d.strftime("%Y-%m-%d") for d in daily_2024["date"]]
    precip_2024_vals = daily_2024["precip_cumsum"].round(2).tolist()
    precip_2025_vals = daily_2025["precip_cumsum"].round(2).tolist()

    # Totals for info box
    total_gdd_2024 = field_stats.get("gdd_2024", 0)
    total_gdd_2025 = field_stats.get("gdd_2025", 0)
    
    # Sum all fields for total
    total_gdd_2024 = df[df["year"]==2024].groupby("date")["gdd_daily"].sum().sum()
    total_gdd_2025 = df[df["year"]==2025].groupby("date")["gdd_daily"].sum().sum()
    
    total_precip_2024 = df[df["year"]==2024].groupby("date")["PRECTOTCORR"].sum().sum() / 25.4
    total_precip_2025 = df[df["year"]==2025].groupby("date")["PRECTOTCORR"].sum().sum() / 25.4

    html = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jefferson Farm Weather Anomaly Analysis</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; }}
        
        #map {{ height: 65vh; width: 100%; }}
        
        .info-box {{
            background: white;
            padding: 20px;
            margin: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        
        .info-box h2 {{ margin-bottom: 15px; color: #333; }}
        
        .stats-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }}
        
        .stat-card {{
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        }}
        
        .stat-card .label {{ font-size: 12px; color: #666; text-transform: uppercase; }}
        .stat-card .value {{ font-size: 28px; font-weight: bold; color: #333; margin: 5px 0; }}
        .stat-card .value.positive {{ color: #e74c3c; }}
        .stat-card .value.negative {{ color: #3498db; }}
        
        .chart-container {{
            position: relative;
            height: 300px;
            margin-top: 20px;
        }}
        
        .legend {{
            display: flex;
            gap: 20px;
            justify-content: center;
            margin-top: 15px;
        }}
        
        .legend-item {{
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
        }}
        
        .legend-color {{
            width: 20px;
            height: 20px;
            border-radius: 4px;
        }}
        
        .field-list {{
            max-height: 300px;
            overflow-y: auto;
            margin-top: 15px;
        }}
        
        .field-list table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }}
        
        .field-list th, .field-list td {{
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }}
        
        .field-list th {{
            background: #f8f9fa;
            position: sticky;
            top: 0;
        }}
        
        .leaflet-tooltip {{
            background: white;
            border: none;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            padding: 10px;
            font-size: 13px;
        }}
        
        .leaflet-tooltip::before {{ display: none; }}
        
        .tooltip-title {{ font-weight: bold; margin-bottom: 5px; color: #333; }}
        .tooltip-row {{ display: flex; justify-content: space-between; gap: 15px; margin: 3px 0; }}
        .tooltip-label {{ color: #666; }}
        .tooltip-value {{ font-weight: 500; }}
    </style>
</head>
<body>
    <div id="map"></div>
    
    <div class="info-box">
        <h2>Jefferson Farm Weather Analysis (Apr 1 - Sep 30)</h2>
        
        <div class="stats-grid">
            <div class="stat-card">
                <div class="label">Total GDD 2024</div>
                <div class="value">{int(total_gdd_2024):,}</div>
            </div>
            <div class="stat-card">
                <div class="label">Total GDD 2025</div>
                <div class="value { "positive" if total_gdd_2025 > total_gdd_2024 else "negative" }">{int(total_gdd_2025):,}</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Precip 2024 (in)</div>
                <div class="value">{total_precip_2024:.1f}"</div>
            </div>
            <div class="stat-card">
                <div class="label">Total Precip 2025 (in)</div>
                <div class="value">{total_precip_2025:.1f}"</div>
            </div>
        </div>
        
        <div class="legend">
            <div class="legend-item">
                <div class="legend-color" style="background: #e74c3c;"></div>
                <span>2025 warmer (+10%+ GDD)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #2ecc71;"></div>
                <span>Similar conditions</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #3498db;"></div>
                <span>2025 cooler (-10%+ GDD)</span>
            </div>
        </div>
        
        <h3>Accumulated Precipitation (Apr 1 - Sep 30)</h3>
        <div class="chart-container">
            <canvas id="precipChart"></canvas>
        </div>
    </div>
    
    <div class="info-box">
        <h3>Field Details (Hover map for info)</h3>
        <div class="field-list">
            <table>
                <thead>
                    <tr>
                        <th>Field Name</th>
                        <th>GDD 2024</th>
                        <th>GDD 2025</th>
                        <th>Precip 2024 (in)</th>
                        <th>Precip 2025 (in)</th>
                        <th>Diff %</th>
                    </tr>
                </thead>
                <tbody>
'''

    # Add field rows
    for name, data in sorted(field_data.items()):
        diff_class = "positive" if data["diff_pct"] > 10 else "negative" if data["diff_pct"] < -10 else ""
        html += f'''                    <tr>
                        <td>{name}</td>
                        <td>{int(data["gdd_2024"])}</td>
                        <td>{int(data["gdd_2025"])}</td>
                        <td>{data["precip_2024"]:.2f}</td>
                        <td>{data["precip_2025"]:.2f}</td>
                        <td class="{diff_class}">{data["diff_pct"]:+.1f}%</td>
                    </tr>
'''

    html += f'''                </tbody>
            </table>
        </div>
    </div>

    <script>
        // Field data from Python
        const fieldData = {json.dumps(field_data)};
        
        // Initialize map
        const map = L.map('map').setView([43.88, -112.35], 10);
        
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{{z}}/{{y}}/{{x}}', {{
            attribution: '&copy; Esri'
        }}).addTo(map);
        
        // Add field polygons
        Object.entries(fieldData).forEach(([name, data]) => {{
            const polygon = L.polygon(data.coords, {{
                color: data.color,
                fillColor: data.color,
                fillOpacity: 0.4,
                weight: 2
            }}).addTo(map);
            
            const tooltipContent = `
                <div class="tooltip-title">${{name}}</div>
                <div class="tooltip-row">
                    <span class="tooltip-label">GDD 2024:</span>
                    <span class="tooltip-value">${{Math.round(data.gdd_2024)}}</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">GDD 2025:</span>
                    <span class="tooltip-value">${{Math.round(data.gdd_2025)}}</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Precip 2024:</span>
                    <span class="tooltip-value">${{data.precip_2024.toFixed(2)}}"</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Precip 2025:</span>
                    <span class="tooltip-value">${{data.precip_2025.toFixed(2)}}"</span>
                </div>
                <div class="tooltip-row">
                    <span class="tooltip-label">Diff:</span>
                    <span class="tooltip-value">${{data.diff_pct >= 0 ? '+' : ''}}${{data.diff_pct.toFixed(1)}}%</span>
                </div>
            `;
            
            polygon.bindTooltip(tooltipContent, {{ direction: 'top' }});
        }});
        
        // Fit bounds
        const allCoords = Object.values(fieldData).flatMap(d => d.coords);
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, {{ padding: [20, 20] }});
        
        // Precipitation chart
        const ctx = document.getElementById('precipChart').getContext('2d');
        new Chart(ctx, {{
            type: 'line',
            data: {{
                labels: {json.dumps(precip_dates)},
                datasets: [{{
                    label: '2024 Precipitation (in)',
                    data: {json.dumps(precip_2024_vals)},
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    fill: true,
                    tension: 0.3
                }}, {{
                    label: '2025 Precipitation (in)',
                    data: {json.dumps(precip_2025_vals)},
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    fill: true,
                    tension: 0.3
                }}]
            }},
            options: {{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {{
                    intersect: false,
                    mode: 'index'
                }},
                plugins: {{
                    legend: {{
                        position: 'top'
                    }},
                    tooltip: {{
                        callbacks: {{
                            label: function(context) {{
                                return context.dataset.label + ': ' + context.parsed.y.toFixed(2) + ' in';
                            }}
                        }}
                    }}
                }},
                scales: {{
                    x: {{
                        ticks: {{
                            maxTicksLimit: 12
                        }}
                    }},
                    y: {{
                        beginAtZero: true,
                        title: {{
                            display: true,
                            text: 'Inches'
                        }}
                    }}
                }}
            }}
        }});
    </script>
</body>
</html>
'''

    with open(OUTPUT_HTML, "w") as f:
        f.write(html)

    print(f"Saved interactive HTML to {OUTPUT_HTML}")


if __name__ == "__main__":
    main()
