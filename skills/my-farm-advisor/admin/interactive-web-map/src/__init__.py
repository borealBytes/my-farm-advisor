"""Interactive Web Map Skill.

Creates single-file HTML interactive maps for visualizing agricultural data.
"""

import base64
import json
from pathlib import Path
from typing import Any

import geopandas as gpd
import pandas as pd


class InteractiveWebMapSkill:
    """Skill for creating interactive web maps.

    Creates a fully self-contained, single-file HTML interactive web map
    for visualizing agricultural data. Everything is embedded in the HTML
    file - no external dependencies required.

    Example:
        >>> skill = InteractiveWebMapSkill()
        >>> map_path = skill.create_map(
        ...     fields_geojson='data/fields_EPSG4326.geojson',
        ...     soil_csv='data/soil_EPSG4326.csv',
        ...     output_path='data/map.html'
        ... )
    """

    def __init__(self) -> None:
        """Initialize the interactive web map skill."""
        pass

    def create_map(
        self,
        fields_geojson: str,
        soil_csv: str | None = None,
        weather_csv: str | None = None,
        cdl_csv: str | None = None,
        sentinel2_dir: str | None = None,
        landsat_dir: str | None = None,
        output_path: str = "interactive_map.html",
        title: str = "Agricultural Data Map",
    ) -> Path:
        """Create an interactive web map from multiple data sources.

        Args:
            fields_geojson: Path to field boundaries GeoJSON
            soil_csv: Optional path to soil data CSV
            weather_csv: Optional path to weather data CSV
            cdl_csv: Optional path to crop data CSV
            sentinel2_dir: Optional directory with Sentinel-2 imagery
            landsat_dir: Optional directory with Landsat imagery
            output_path: Output HTML file path
            title: Map title

        Returns:
            Path to generated HTML file
        """
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Load field boundaries
        fields = gpd.read_file(fields_geojson)

        # Convert to GeoJSON string
        geojson_data = fields.to_json()

        # Load optional data
        soil_data = None
        weather_data = None
        cdl_data = None

        if soil_csv and Path(soil_csv).exists():
            soil_df = pd.read_csv(soil_csv)
            soil_data = soil_df.to_dict("records")

        if weather_csv and Path(weather_csv).exists():
            weather_df = pd.read_csv(weather_csv)
            weather_data = weather_df.to_dict("records")

        if cdl_csv and Path(cdl_csv).exists():
            cdl_df = pd.read_csv(cdl_csv)
            cdl_data = cdl_df.to_dict("records")

        # Generate HTML
        html_content = self._generate_html(
            geojson_data=geojson_data,
            soil_data=soil_data,
            weather_data=weather_data,
            cdl_data=cdl_data,
            title=title,
        )

        # Write to file
        output_path.write_text(html_content, encoding="utf-8")

        return output_path

    def create_simple_map(
        self,
        fields_geojson: str,
        output_path: str = "simple_map.html",
        title: str = "Field Boundaries Map",
    ) -> Path:
        """Create a simple map with just field boundaries.

        Args:
            fields_geojson: Path to field boundaries
            output_path: Output HTML file path
            title: Map title

        Returns:
            Path to generated HTML file
        """
        return self.create_map(
            fields_geojson=fields_geojson,
            output_path=output_path,
            title=title,
        )

    def _generate_html(
        self,
        geojson_data: str,
        soil_data: list[dict] | None = None,
        weather_data: list[dict] | None = None,
        cdl_data: list[dict] | None = None,
        title: str = "Agricultural Data Map",
    ) -> str:
        """Generate the HTML content for the interactive map."""

        # Determine which layers to show
        has_soil = soil_data is not None and len(soil_data) > 0
        has_weather = weather_data is not None and len(weather_data) > 0
        has_cdl = cdl_data is not None and len(cdl_data) > 0

        # Build JavaScript data objects
        soil_js = json.dumps(soil_data) if has_soil else "null"
        weather_js = json.dumps(weather_data) if has_weather else "null"
        cdl_js = json.dumps(cdl_data) if has_cdl else "null"

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
        #map {{ height: 60vh; width: 100%; }}
        #data-panel {{ 
            height: 40vh; 
            width: 100%; 
            overflow: auto; 
            padding: 15px;
            background: #f5f5f5;
            border-top: 2px solid #ddd;
        }}
        h1 {{ 
            font-size: 18px; 
            padding: 10px 15px; 
            background: #2c3e50; 
            color: white;
            margin: 0;
        }}
        h2 {{ font-size: 16px; margin-bottom: 10px; color: #2c3e50; }}
        .layer-controls {{
            position: absolute;
            top: 50px;
            right: 10px;
            z-index: 1000;
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }}
        .layer-controls label {{
            display: block;
            margin: 5px 0;
            cursor: pointer;
        }}
        .layer-controls input {{
            margin-right: 8px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
            background: white;
            margin-top: 10px;
        }}
        th, td {{
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }}
        th {{
            background: #34495e;
            color: white;
            font-weight: 500;
        }}
        tr:hover {{ background: #ecf0f1; }}
        .no-data {{
            padding: 20px;
            color: #7f8c8d;
            font-style: italic;
        }}
        .field-info {{
            background: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }}
        .field-info h3 {{
            margin: 0 0 10px 0;
            color: #2c3e50;
        }}
        .tabs {{
            display: flex;
            border-bottom: 2px solid #ddd;
            margin-bottom: 15px;
        }}
        .tab {{
            padding: 10px 20px;
            cursor: pointer;
            background: #ecf0f1;
            border: none;
            border-bottom: 3px solid transparent;
            transition: all 0.3s;
        }}
        .tab:hover {{ background: #d5dbdb; }}
        .tab.active {{
            background: white;
            border-bottom-color: #3498db;
            color: #2c3e50;
        }}
        .tab-content {{
            display: none;
        }}
        .tab-content.active {{
            display: block;
        }}
    </style>
</head>
<body>
    <h1>🌾 {title}</h1>
    <div id="map"></div>
    <div class="layer-controls">
        <strong>Layers</strong><br>
        <label><input type="checkbox" id="fields-toggle" checked> Fields</label>
        <label><input type="checkbox" id="soil-toggle" {"checked" if has_soil else "disabled"}> Soil</label>
        <label><input type="checkbox" id="weather-toggle" {"checked" if has_weather else "disabled"}> Weather</label>
        <label><input type="checkbox" id="crops-toggle" {"checked" if has_cdl else "disabled"}> Crops</label>
    </div>
    <div id="data-panel">
        <div class="tabs">
            <button class="tab active" onclick="showTab('overview')">Overview</button>
            {'<button class="tab" onclick="showTab(\'soil\')">Soil</button>' if has_soil else ""}
            {'<button class="tab" onclick="showTab(\'weather\')">Weather</button>' if has_weather else ""}
            {'<button class="tab" onclick="showTab(\'crops\')">Crops</button>' if has_cdl else ""}
        </div>
        
        <div id="overview" class="tab-content active">
            <p>Click on a field to view its data. Toggle layers using the controls in the top right.</p>
            <div id="field-details"></div>
        </div>
        
        {'<div id="soil" class="tab-content"><div id="soil-table"></div></div>' if has_soil else ""}
        {'<div id="weather" class="tab-content"><div id="weather-table"></div></div>' if has_weather else ""}
        {'<div id="crops" class="tab-content"><div id="crops-table"></div></div>' if has_cdl else ""}
    </div>

    <script>
        // Field boundaries GeoJSON
        const fieldData = {geojson_data};
        
        // Additional data
        const soilData = {soil_js};
        const weatherData = {weather_js};
        const cdlData = {cdl_js};
        
        // Initialize map
        const map = L.map('map').setView([40, -95], 5);
        
        // Add base layer
        L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
            attribution: '© OpenStreetMap contributors'
        }}).addTo(map);
        
        // Add field boundaries layer
        const fieldsLayer = L.geoJSON(fieldData, {{
            style: {{
                color: '#2c3e50',
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.2,
                fillColor: '#3498db'
            }},
            onEachFeature: function(feature, layer) {{
                layer.on('click', function() {{
                    showFieldData(feature.properties);
                }});
                layer.bindPopup(`<b>${{feature.properties.field_id || 'Field'}}</b>`);
            }}
        }}).addTo(map);
        
        // Fit map to field bounds
        map.fitBounds(fieldsLayer.getBounds().pad(0.1));
        
        // Layer toggle controls
        document.getElementById('fields-toggle').addEventListener('change', function(e) {{
            if (e.target.checked) {{
                map.addLayer(fieldsLayer);
            }} else {{
                map.removeLayer(fieldsLayer);
            }}
        }});
        
        // Show field data
        function showFieldData(properties) {{
            const fieldId = properties.field_id;
            let html = `<div class="field-info"><h3>Field: ${{fieldId}}</h3>`;
            
            // Add basic properties
            for (const [key, value] of Object.entries(properties)) {{
                if (key !== 'field_id' && value) {{
                    html += `<p><strong>${{key}}:</strong> ${{value}}</p>`;
                }}
            }}
            
            // Add soil data
            if (soilData) {{
                const soil = soilData.find(s => s.field_id === fieldId);
                if (soil) {{
                    html += '<h4>Soil Data</h4>';
                    html += `<p>OM: ${{soil.om_pct || 'N/A'}}% | pH: ${{soil.ph_water || 'N/A'}}</p>`;
                }}
            }}
            
            html += '</div>';
            document.getElementById('field-details').innerHTML = html;
        }}
        
        // Tab switching
        function showTab(tabName) {{
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
            
            event.target.classList.add('active');
            document.getElementById(tabName).classList.add('active');
        }}
        
        // Populate data tables
        function createTable(data, containerId) {{
            if (!data || data.length === 0) return;
            
            const columns = Object.keys(data[0]).filter(k => k !== 'geometry');
            let html = '<table><thead><tr>';
            columns.forEach(col => {{
                html += `<th>${{col}}</th>`;
            }});
            html += '</tr></thead><tbody>';
            
            data.slice(0, 100).forEach(row => {{
                html += '<tr>';
                columns.forEach(col => {{
                    html += `<td>${{row[col] || ''}}</td>`;
                }});
                html += '</tr>';
            }});
            
            html += '</tbody></table>';
            document.getElementById(containerId).innerHTML = html;
        }}
        
        // Initialize tables
        if (soilData) createTable(soilData, 'soil-table');
        if (weatherData) createTable(weatherData, 'weather-table');
        if (cdlData) createTable(cdlData, 'crops-table');
    </script>
</body>
</html>"""

        return html
