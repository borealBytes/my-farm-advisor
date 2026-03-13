# Interactive Web Map Examples

Sample output from the `interactive-web-map` skill.

## Files

- **field_boundaries_map.html** — Interactive map of 2 corn fields from Minnesota

## How This Was Generated

```bash
uv run --no-project --with folium --with geopandas --with shapely python << 'EOF'
import folium
import geopandas as gpd

fields = gpd.read_file('.skills/field-boundaries/examples/sample_2_fields.geojson')

center = [fields.geometry.centroid.y.mean(), fields.geometry.centroid.x.mean()]
m = folium.Map(location=center, zoom_start=7)

folium.GeoJson(
    fields,
    name='Fields',
    style_function=lambda x: {
        'fillColor': '#f1c40f',
        'color': '#2c3e50',
        'weight': 2,
        'fillOpacity': 0.5,
    },
    tooltip=folium.GeoJsonTooltip(
        fields=['field_id', 'crop_name', 'area_acres'],
        aliases=['Field ID:', 'Crop:', 'Area (ac):'],
    ),
).add_to(m)

bounds = fields.total_bounds
m.fit_bounds([[bounds[1], bounds[0]], [bounds[3], bounds[2]]])
folium.LayerControl().add_to(m)

m.save('.skills/interactive-web-map/examples/field_boundaries_map.html')
EOF
```

## Data Source

- **Input**: `field-boundaries/examples/sample_2_fields.geojson`
- **Fields**: 2 USDA NASS Crop Sequence Boundary polygons (Minnesota corn fields)
- **Libraries**: folium, geopandas

## Usage

Open `field_boundaries_map.html` in any browser. Features:

- Zoom and pan
- Hover tooltips with field ID, crop, and area
- Click popups with full attribute details
- Layer control (Street Map / Satellite toggle)
