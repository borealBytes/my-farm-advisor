---
name: interactive-web-map
description: Create professional, self-contained interactive web maps for agricultural data visualization. Generate single HTML files with embedded data, layer controls, choropleth styling, and customizable dashboards using Leaflet.js. Handles 200+ fields smoothly.
version: 2.0.0
author: Boreal Bytes
tags: [web-map, visualization, leaflet, geospatial, interactive, dashboard, choropleth]
---

# Skill: interactive-web-map

## Description

Create professional, self-contained interactive web maps for agricultural data analysis. This skill teaches you to create **standalone HTML files** that can be opened directly in any web browser, shared via email, or deployed to any web server.

**Key Features:**

- **Self-contained**: Single HTML file with all data embedded
- **Layer control**: Toggle between field boundaries, soil data, weather stations, crop classifications
- **Choropleth styling**: Color-code fields by any data attribute (yield, soil pH, NDVI, etc.)
- **Professional sidebar**: Collapsible control panel with filters, legends, and data table
- **Multiple basemaps**: OpenStreetMap, Satellite, Terrain, Dark mode
- **Data table**: View and filter attribute data in a sortable table
- **Performance optimized**: Handles 200+ fields smoothly using Canvas rendering
- **Responsive design**: Works on desktop, tablet, and mobile

## When to Use This Skill

- **Sharing results**: Send a complete interactive dashboard to collaborators
- **Field work**: Load maps on tablets for offline field reference
- **Reports**: Include interactive maps in presentations or documents
- **Monitoring**: Create dashboards for tracking crop conditions over time
- **Publishing**: Deploy to GitHub Pages or any static web host

## Output Example

A single `agricultural_dashboard.html` file (typically 200-800 KB for 200 fields) that:

- Opens in any modern web browser
- Requires no installation or server
- Can be emailed as an attachment
- Can be hosted on any static web server

## Prerequisites

To generate maps with data:

```bash
pip install pandas geopandas
```

To view maps: **Any modern web browser** (Chrome, Firefox, Safari, Edge)

## Quick Start: Create a Field Map

```python
import json
import pandas as pd
import geopandas as gpd

# Load field boundaries
fields = gpd.read_file('data/fields.geojson')

# Convert to GeoJSON for embedding
geojson_data = json.loads(fields.to_json())

# Create self-contained HTML
html_content = '''<!DOCTYPE html>
<html>
<head>
    <title>Agricultural Fields Map</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        #map { height: 100vh; width: 100%; }
        .legend {
            background: white; padding: 10px; border-radius: 5px;
            box-shadow: 0 0 15px rgba(0,0,0,0.2); line-height: 1.5;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        var map = L.map('map').setView([44.5, -93.5], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        var fieldData = ''' + json.dumps(geojson_data) + ''';

        L.geoJSON(fieldData, {
            style: {
                color: '#2E7D32',
                weight: 2,
                fillOpacity: 0.3
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(
                    '<b>Field:</b> ' + feature.properties.field_id + '<br>' +
                    '<b>Area:</b> ' + feature.properties.area_acres.toFixed(1) + ' acres<br>' +
                    '<b>Crop:</b> ' + feature.properties.crop_name
                );
            }
        }).addTo(map);
    </script>
</body>
</html>'''

with open('field_map.html', 'w') as f:
    f.write(html_content)

print("✓ Created: field_map.html")
print("Open this file in any web browser")
```

## Complete Multi-Layer Dashboard

Create a professional agricultural dashboard with all data layers:

```python
import json
import pandas as pd
import geopandas as gpd

# Load field boundaries
fields = gpd.read_file('field-boundaries/examples/sample_2_fields.geojson')

# Calculate center
bounds = fields.total_bounds
center_lat = (bounds[1] + bounds[3]) / 2
center_lon = (bounds[0] + bounds[2]) / 2

# Convert to GeoJSON
geojson_data = json.loads(fields.to_json())

html = f'''<!DOCTYPE html>
<html>
<head>
    <title>Agricultural Dashboard</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }}
        #container {{ display: flex; height: 100vh; }}

        #sidebar {{
            width: 320px;
            background: #ffffff;
            border-right: 1px solid #ddd;
            padding: 20px;
            overflow-y: auto;
        }}

        #sidebar h1 {{
            font-size: 1.4em;
            margin-bottom: 5px;
            color: #1B5E20;
        }}

        .panel {{
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }}

        .panel h3 {{
            font-size: 0.9em;
            color: #333;
            margin-bottom: 12px;
            text-transform: uppercase;
        }}

        .layer-item {{
            display: flex;
            align-items: center;
            padding: 8px 0;
            cursor: pointer;
        }}

        .layer-color {{
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 10px;
            margin-left: 10px;
        }}

        #map {{ flex: 1; }}

        .legend-item {{
            display: flex;
            align-items: center;
            margin: 6px 0;
            font-size: 0.85em;
        }}

        .legend-color {{
            width: 20px;
            height: 20px;
            border-radius: 4px;
            margin-right: 8px;
        }}
    </style>
</head>
<body>
    <div id="container">
        <div id="sidebar">
            <h1>🌾 Ag Dashboard</h1>

            <div class="panel">
                <h3>Data Layers</h3>
                <div class="layer-item">
                    <input type="checkbox" id="layer-fields" checked onchange="toggleLayer('fields')">
                    <div class="layer-color" style="background: #2E7D32;"></div>
                    <span>Field Boundaries</span>
                </div>
                <div class="layer-item">
                    <input type="checkbox" id="layer-soil" onchange="toggleLayer('soil')">
                    <div class="layer-color" style="background: #8B4513;"></div>
                    <span>Soil Properties</span>
                </div>
            </div>

            <div class="panel">
                <h3>Legend</h3>
                <div class="legend-item">
                    <div class="legend-color" style="background: #2E7D32;"></div>
                    <span>Corn Fields</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #F9A825;"></div>
                    <span>Soybean Fields</span>
                </div>
            </div>
        </div>

        <div id="map"></div>
    </div>

    <script>
        var map = L.map('map').setView([{center_lat}, {center_lon}], 10);

        L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
            attribution: '&copy; OpenStreetMap contributors'
        }}).addTo(map);

        var fieldData = {json.dumps(geojson_data)};

        var layers = {{}};

        layers.fields = L.geoJSON(fieldData, {{
            style: {{
                color: '#1B5E20',
                weight: 2,
                fillOpacity: 0.6
            }},
            onEachFeature: function(feature, layer) {{
                layer.bindPopup(
                    '<b>Field:</b> ' + feature.properties.field_id + '<br>' +
                    '<b>Area:</b> ' + feature.properties.area_acres.toFixed(1) + ' acres<br>' +
                    '<b>Crop:</b> ' + feature.properties.crop_name
                );
            }}
        }}).addTo(map);

        function toggleLayer(name) {{
            var checkbox = document.getElementById('layer-' + name);
            if (checkbox.checked) {{
                map.addLayer(layers[name]);
            }} else {{
                map.removeLayer(layers[name]);
            }}
        }}
    </script>
</body>
</html>'''

with open('dashboard.html', 'w') as f:
    f.write(html)

print("✓ Created: dashboard.html")
```

## Styling Guidelines

### Professional Color Palettes

**Crop Types:**

```javascript
const cropColors = {
  Corn: '#2E7D32',
  Soybeans: '#F9A825',
  Wheat: '#E65100',
  Cotton: '#1565C0',
  Rice: '#00ACC1',
  Default: '#757575',
};
```

**Soil pH (Acid → Neutral → Alkaline):**

```javascript
function getPHColor(ph) {
  if (ph < 6.0) return '#1565C0'; // Blue (acidic)
  if (ph < 6.5) return '#43A047'; // Light green
  if (ph < 7.5) return '#2E7D32'; // Green (neutral)
  return '#C62828'; // Red (alkaline)
}
```

**NDVI Vegetation Index:**

```javascript
function getNDVIColor(ndvi) {
  if (ndvi < 0.2) return '#8B4513'; // Brown (bare soil)
  if (ndvi < 0.4) return '#FFD700'; // Yellow (sparse)
  if (ndvi < 0.6) return '#9ACD32'; // Yellow-green
  if (ndvi < 0.8) return '#228B22'; // Green
  return '#006400'; // Dark green (dense)
}
```

## Performance Tips for 200+ Fields

### Use Canvas Rendering

```javascript
L.geoJSON(data, {
    renderer: L.canvas(),  // Use Canvas instead of SVG
    style: {...},
    onEachFeature: {...}
}).addTo(map);
```

### Simplify Geometry

```python
# Reduce complexity before embedding
fields['geometry'] = fields['geometry'].simplify(tolerance=0.001)
```

## Resources

- [Leaflet Documentation](https://leafletjs.com/)
- [Leaflet Plugins](https://leafletjs.com/plugins.html)
- [ColorBrewer](https://colorbrewer2.org/) (color ramps)
- [CARTO Colors](https://carto.com/carto-colors/)
