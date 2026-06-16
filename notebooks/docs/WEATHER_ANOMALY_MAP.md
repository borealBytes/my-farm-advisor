# Jefferson Farm Weather Anomaly Map

Interactive HTML map showing weather anomalies for Jefferson Farm fields, comparing the 2024 and 2025 growing seasons (April 1 - September 30).

## Access

**PIN Code**: `2425`

Enter the 4-digit code when prompted to view the map.

## Files

| File | Description |
|------|-------------|
| `jefferson_farm_weather_anomaly.html` | Interactive Leaflet map with weather data |
| `build_weather_anomaly_html.py` | Python script that generates the HTML map |
| `download_jefferson_weather.py` | Python script that downloads weather data from Open-Meteo API |
| `data/weather/jefferson_farm_weather_2024_2025.csv` | Weather data for all fields |

## Usage

Open `jefferson_farm_weather_anomaly.html` in any modern web browser. No server required - it's a standalone HTML file.

### Map Features

- **Base Layer**: Esri World Imagery (satellite)
- **Field Polygons**: Color-coded by temperature anomaly
  - 🔴 Red = 2025 significantly warmer (+10%+ GDD)
  - 🟢 Green = Similar conditions
  - 🔵 Blue = 2025 cooler (-10%+ GDD)
- **Hover Tooltips**: Shows per-field GDD and precipitation for both years
- **Line Chart**: Accumulated precipitation over time (2024 vs 2025)
- **Table**: Sortable list of all fields with detailed statistics

### Info Box

The top info box shows aggregate statistics across all fields:

| Metric | 2024 | 2025 |
|--------|------|------|
| Total GDD | ~176,000 | ~176,000 |
| Total Precipitation | ~200 in | ~292 in |

### Data Source

Weather data is sourced from the **Open-Meteo Archive API**:
- Resolution: ~1km grid
- Parameters: `temperature_2m_max`, `temperature_2m_min`, `precipitation_sum`
- Timezone: America/Denver

### GDD Calculation

Growing Degree Days (GDD) calculated using potato base temperature:

```
GDD = max(0, min(avg_temp_F, 86) - 45)
```

Where:
- Base temperature: 45°F
- Cap temperature: 86°F
- Daily avg = (T_max_F + T_min_F) / 2
- Temperatures converted from Celsius: F = C × 9/5 + 32

### Regenerating the Map

If you need to update the weather data or regenerate the HTML:

```bash
# Download fresh weather data
python notebooks/download_jefferson_weather.py

# Rebuild the HTML map
python notebooks/build_weather_anomaly_html.py
```

## Field Coverage

- **Total Fields**: 53 fields with weather data
- **Time Period**: April 1 - September 30 for both 2024 and 2025
- **Location**: Jefferson Farm, Idaho (various parcels around coordinates 43.8°N, 112.3°W)

## Notes

- 4 fields failed to download due to API timeouts and aren't included
- Precipitation values are in inches (Open-Meteo `precipitation_unit=inch`)
- GDD values are in Fahrenheit degree-days
- Data represents grid-point estimates at field centroids, not field-specific measurements
