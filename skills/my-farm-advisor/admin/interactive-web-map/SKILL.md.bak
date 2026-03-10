---
name: interactive-web-map
description: Create interactive HTML web maps for visualizing agricultural field boundaries, soil data, and crop information using folium and geopandas. Use when the user needs a zoomable, clickable map with layer controls, popups, and choropleth styling.
version: 1.0.0
author: Boreal Bytes
tags: [folium, geopandas, geospatial, visualization, html-map, leaflet]
---

# Skill: interactive-web-map

## Description

Create interactive web maps from GeoJSON field boundary data using **folium** (Python Leaflet wrapper) and **geopandas**. Produces self-contained HTML files you can open in any browser — no server required.

This skill teaches the standard Python geospatial visualization stack rather than custom code. Every example uses real USDA field boundary data from the `field-boundaries` skill.

## When to Use This Skill

- **Visualizing field boundaries**: Render GeoJSON polygons on an interactive map
- **Choropleth maps**: Color fields by crop type, soil pH, area, or any attribute
- **Multi-layer maps**: Combine field boundaries with satellite basemaps and markers
- **Sharing results**: Generate portable HTML files for stakeholders
- **Quick exploration**: Inspect field geometry and attributes interactively

## Prerequisites

```bash
# Install UV if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Example Data

This skill uses sample data from the `field-boundaries` skill:

- `../field-boundaries/examples/sample_2_fields.geojson` — 2 real corn fields from Minnesota

```python
import geopandas as gpd

# Load the example fields
fields = gpd.read_file('../field-boundaries/examples/sample_2_fields.geojson')
print(fields[['field_id', 'area_acres', 'crop_name']])

# Output:
#           field_id  area_acres crop_name
# 0  271623002471299    3.704844      Corn
# 1  271623001561551    6.408551      Corn
```

Sample output is included in the `examples/` directory:

- `examples/field_boundaries_map.html` — interactive map of the 2 sample fields

## Quick Start

```bash
# Create an interactive map in one command
uv run --with folium --with geopandas --with shapely python << 'EOF'
import folium
import geopandas as gpd

# Load field boundaries from the field-boundaries skill examples
fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson')

# Create map centered on the fields
center = [fields.geometry.centroid.y.mean(), fields.geometry.centroid.x.mean()]
m = folium.Map(location=center, zoom_start=8, tiles='OpenStreetMap')

# Add field polygons with popups
for _, row in fields.iterrows():
    geo = folium.GeoJson(
        row.geometry.__geo_interface__,
        style_function=lambda x: {
            'fillColor': '#3498db',
            'color': '#2c3e50',
            'weight': 2,
            'fillOpacity': 0.4,
        },
    )
    popup_html = f"""
    <b>Field:</b> {row['field_id']}<br>
    <b>Crop:</b> {row['crop_name']}<br>
    <b>Area:</b> {row['area_acres']:.1f} acres
    """
    geo.add_child(folium.Popup(popup_html, max_width=250))
    geo.add_to(m)

# Save as self-contained HTML
m.save('data/field_map.html')
print('Map saved to data/field_map.html')
EOF
```

## Installation (Isolated Environment)

```bash
# Create dedicated environment for this skill
cd .skills/interactive-web-map
uv venv .venv
source .venv/bin/activate

# Install dependencies
uv pip install folium geopandas shapely
```

## Usage Examples

### Example 1: Basic Field Boundary Map

Load GeoJSON and render all fields with popups showing attributes.

```python
import folium
import geopandas as gpd

# Load field boundaries
fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson')

# Center map on data extent
bounds = fields.total_bounds  # [minx, miny, maxx, maxy]
center_lat = (bounds[1] + bounds[3]) / 2
center_lon = (bounds[0] + bounds[2]) / 2

m = folium.Map(location=[center_lat, center_lon], zoom_start=6)

# Add all fields as a single GeoJson layer with tooltips
folium.GeoJson(
    fields,
    name='Field Boundaries',
    style_function=lambda x: {
        'fillColor': '#27ae60',
        'color': '#1e8449',
        'weight': 2,
        'fillOpacity': 0.35,
    },
    tooltip=folium.GeoJsonTooltip(
        fields=['field_id', 'crop_name', 'area_acres'],
        aliases=['Field ID:', 'Crop:', 'Acres:'],
        sticky=True,
    ),
    popup=folium.GeoJsonPopup(
        fields=['field_id', 'crop_name', 'area_acres', 'region'],
        aliases=['Field ID:', 'Crop:', 'Acres:', 'Region:'],
    ),
).add_to(m)

# Fit map to data bounds
m.fit_bounds([[bounds[1], bounds[0]], [bounds[3], bounds[2]]])

# Add layer control
folium.LayerControl().add_to(m)

m.save('data/field_boundaries_map.html')
```

### Example 2: Choropleth by Field Area

Color fields by size using a continuous color scale.

```python
import folium
import geopandas as gpd
import branca.colormap as cm

fields = gpd.read_file('data/fields_EPSG4326.geojson')

# Create a color scale based on area
colormap = cm.LinearColormap(
    colors=['#ffffb2', '#fecc5c', '#fd8d3c', '#e31a1c'],
    vmin=fields['area_acres'].min(),
    vmax=fields['area_acres'].max(),
    caption='Field Area (acres)',
)

center = [fields.geometry.centroid.y.mean(), fields.geometry.centroid.x.mean()]
m = folium.Map(location=center, zoom_start=8)

# Style each field by its area
folium.GeoJson(
    fields,
    name='Fields by Area',
    style_function=lambda x: {
        'fillColor': colormap(x['properties']['area_acres']),
        'color': '#333',
        'weight': 1,
        'fillOpacity': 0.6,
    },
    tooltip=folium.GeoJsonTooltip(
        fields=['field_id', 'area_acres', 'crop_name'],
        aliases=['Field:', 'Acres:', 'Crop:'],
    ),
).add_to(m)

# Add colormap legend to map
colormap.add_to(m)
folium.LayerControl().add_to(m)

m.save('data/fields_by_area.html')
```

### Example 3: Multiple Basemaps with Satellite Imagery

Add satellite and terrain tile layers alongside fields.

```python
import folium
import geopandas as gpd

fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson')

center = [fields.geometry.centroid.y.mean(), fields.geometry.centroid.x.mean()]
m = folium.Map(location=center, zoom_start=8)

# Add multiple basemap options
folium.TileLayer('OpenStreetMap', name='Street Map').add_to(m)
folium.TileLayer(
    tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr='Esri',
    name='Satellite',
).add_to(m)
folium.TileLayer(
    tiles='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attr='OpenTopoMap',
    name='Terrain',
).add_to(m)

# Add fields on top
folium.GeoJson(
    fields,
    name='Fields',
    style_function=lambda x: {
        'fillColor': '#e74c3c',
        'color': '#c0392b',
        'weight': 2,
        'fillOpacity': 0.3,
    },
    tooltip=folium.GeoJsonTooltip(
        fields=['field_id', 'crop_name', 'area_acres'],
        aliases=['Field:', 'Crop:', 'Acres:'],
    ),
).add_to(m)

m.fit_bounds(fields.total_bounds[[1, 0, 3, 2]].reshape(2, 2).tolist())
folium.LayerControl(collapsed=False).add_to(m)

m.save('data/fields_satellite.html')
```

### Example 4: Marker Cluster for Many Fields

When you have dozens or hundreds of fields, use marker clusters for performance.

```python
import folium
from folium.plugins import MarkerCluster
import geopandas as gpd

fields = gpd.read_file('data/fields_EPSG4326.geojson')

center = [fields.geometry.centroid.y.mean(), fields.geometry.centroid.x.mean()]
m = folium.Map(location=center, zoom_start=5)

# Add field polygons
folium.GeoJson(
    fields,
    name='Boundaries',
    style_function=lambda x: {
        'fillColor': '#3498db',
        'color': '#2980b9',
        'weight': 1,
        'fillOpacity': 0.2,
    },
).add_to(m)

# Add centroids as clustered markers
marker_cluster = MarkerCluster(name='Field Markers').add_to(m)

for _, row in fields.iterrows():
    centroid = row.geometry.centroid
    folium.Marker(
        location=[centroid.y, centroid.x],
        popup=f"<b>{row['field_id']}</b><br>{row['crop_name']}<br>{row['area_acres']:.1f} ac",
        icon=folium.Icon(color='green', icon='leaf', prefix='fa'),
    ).add_to(marker_cluster)

folium.LayerControl().add_to(m)

m.save('data/fields_clustered.html')
```

### Example 5: Complete Script — Field Boundaries to HTML

End-to-end script that loads, processes, and maps field data.

```bash
uv run --with folium --with geopandas --with shapely python << 'EOF'
import folium
import geopandas as gpd

# --- Configuration ---
INPUT_GEOJSON = '.skills/field-boundaries/examples/sample_2_fields.geojson'
OUTPUT_HTML = 'data/interactive_map.html'
MAP_TITLE = 'Agricultural Fields — Minnesota'

# --- Load data ---
fields = gpd.read_file(INPUT_GEOJSON)
print(f'Loaded {len(fields)} fields')
print(fields[['field_id', 'crop_name', 'area_acres']])

# --- Build map ---
center = [fields.geometry.centroid.y.mean(), fields.geometry.centroid.x.mean()]
m = folium.Map(location=center, zoom_start=7, tiles='OpenStreetMap')

# Street + satellite basemaps
folium.TileLayer(
    tiles='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attr='Esri',
    name='Satellite',
).add_to(m)

# Crop color palette
CROP_COLORS = {
    'Corn': '#f1c40f',
    'Soybeans': '#27ae60',
    'Wheat': '#e67e22',
    'Cotton': '#ecf0f1',
}

def field_style(feature):
    crop = feature['properties'].get('crop_name', '')
    return {
        'fillColor': CROP_COLORS.get(crop, '#3498db'),
        'color': '#2c3e50',
        'weight': 2,
        'fillOpacity': 0.5,
    }

# Add fields layer
folium.GeoJson(
    fields,
    name='Fields',
    style_function=field_style,
    tooltip=folium.GeoJsonTooltip(
        fields=['field_id', 'crop_name', 'area_acres'],
        aliases=['Field ID:', 'Crop:', 'Area (ac):'],
        sticky=True,
    ),
    popup=folium.GeoJsonPopup(
        fields=['field_id', 'crop_name', 'area_acres', 'region', 'state_fips'],
        aliases=['Field ID:', 'Crop:', 'Area (ac):', 'Region:', 'State FIPS:'],
    ),
).add_to(m)

# Fit bounds and add layer control
bounds = fields.total_bounds
m.fit_bounds([[bounds[1], bounds[0]], [bounds[3], bounds[2]]], padding=[20, 20])
folium.LayerControl(collapsed=False).add_to(m)

# Add title
title_html = f'''
<div style="position:fixed;top:10px;left:60px;z-index:9999;
     background:white;padding:8px 16px;border-radius:4px;
     box-shadow:0 2px 6px rgba(0,0,0,0.3);font-family:sans-serif;">
  <b>🌾 {MAP_TITLE}</b>
</div>
'''
m.get_root().html.add_child(folium.Element(title_html))

# --- Save ---
m.save(OUTPUT_HTML)
print(f'Map saved to {OUTPUT_HTML}')
EOF
```

## Python API Reference

This skill teaches standard library usage rather than wrapping a custom class. The core libraries are:

### folium

| Function                                               | Purpose              |
| ------------------------------------------------------ | -------------------- |
| `folium.Map(location, zoom_start, tiles)`              | Create base map      |
| `folium.GeoJson(data, style_function, tooltip, popup)` | Add GeoJSON layer    |
| `folium.TileLayer(tiles, attr, name)`                  | Add basemap tiles    |
| `folium.GeoJsonTooltip(fields, aliases)`               | Hover tooltip        |
| `folium.GeoJsonPopup(fields, aliases)`                 | Click popup          |
| `folium.LayerControl()`                                | Layer toggle UI      |
| `folium.Marker(location, popup, icon)`                 | Point marker         |
| `folium.plugins.MarkerCluster()`                       | Cluster many markers |
| `branca.colormap.LinearColormap(colors, vmin, vmax)`   | Color legend         |
| `m.save(path)`                                         | Export to HTML       |
| `m.fit_bounds(bounds)`                                 | Zoom to data extent  |

### geopandas (for data loading)

| Function                | Purpose                           |
| ----------------------- | --------------------------------- |
| `gpd.read_file(path)`   | Load GeoJSON/Shapefile/GeoParquet |
| `gdf.to_json()`         | Convert to GeoJSON string         |
| `gdf.total_bounds`      | Get `[minx, miny, maxx, maxy]`    |
| `gdf.geometry.centroid` | Get polygon centroids             |
| `gdf.explore()`         | Quick interactive map (built-in)  |

## Data Source

- **Input**: GeoJSON field boundaries from the `field-boundaries` skill
- **Format**: GeoJSON polygons with `field_id`, `crop_name`, `area_acres` attributes
- **CRS**: EPSG:4326 (WGS84)
- **Example**: `.skills/field-boundaries/examples/sample_2_fields.geojson`

## Output Files

- `*.html` — Self-contained interactive map (open in any browser)
- Typical size: 50 KB – 5 MB depending on field count and embedded data

## Environment Variables

No special environment variables required. All tile providers used are public and free.

## Resources

- [Folium Documentation](https://python-visualization.github.io/folium/latest/)
- [GeoPandas Documentation](https://geopandas.org/)
- [Leaflet.js](https://leafletjs.com/) (underlying JS library)
- [Folium Quickstart](https://python-visualization.github.io/folium/latest/getting_started.html)
- [Branca Colormaps](https://python-visualization.github.io/branca/)
