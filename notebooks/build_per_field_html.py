#!/usr/bin/env python3
"""Build interactive HTML map with per-field NDVI overlays."""

import json
from pathlib import Path

FIELDS_FILE = Path("notebooks/data/field_boundaries/jefferson_farm_fields.geojson")
NDVI_STATS_FILE = Path("notebooks/data/ndvi_per_field/per_field_ndvi.json")
IMAGES_FILE = Path("notebooks/data/ndvi_per_field/per_field_images.json")
OUTPUT_HTML = Path("notebooks/jefferson_farm_ndvi_timeline_perfield.html")

MONTHS = [
    ("ndvi_2024_04", "April 2024"),
    ("ndvi_2024_05", "May 2024"),
    ("ndvi_2024_06", "June 2024"),
    ("ndvi_2024_07", "July 2024"),
    ("ndvi_2024_08", "August 2024"),
    ("ndvi_2024_09", "September 2024"),
    ("ndvi_2024_10", "October 2024"),
    ("ndvi_2025_04", "April 2025"),
    ("ndvi_2025_05", "May 2025"),
    ("ndvi_2025_06", "June 2025"),
    ("ndvi_2025_07", "July 2025"),
    ("ndvi_2025_08", "August 2025"),
    ("ndvi_2025_09", "September 2025"),
]

html_template = '''<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Jefferson Farm NDVI Timeline</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        #map { height: 100vh; width: 100%; }
        
        .controls {
            position: absolute;
            top: 10px;
            left: 50px;
            z-index: 1000;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            min-width: 280px;
        }
        
        .controls h2 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #333;
        }
        
        .slider-container {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .slider-container button {
            padding: 8px 12px;
            background: #4a90a4;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        
        .slider-container button:hover {
            background: #357585;
        }
        
        .slider-container button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        #monthSlider {
            flex: 1;
            cursor: pointer;
        }
        
        #currentMonth {
            font-weight: bold;
            color: #333;
            min-width: 120px;
            text-align: center;
        }
        
        .legend {
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #eee;
        }
        
        .legend h3 {
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .legend-gradient {
            height: 20px;
            background: linear-gradient(to right, #d73027, #f46d43, #fdae61, #fee090, #ffffbf, #e0f3f8, #abd9e9, #74add1, #4575b4);
            border-radius: 3px;
            margin-bottom: 5px;
        }
        
        .legend-labels {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
        }
        
        .field-info {
            position: absolute;
            bottom: 30px;
            right: 10px;
            z-index: 1000;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            min-width: 250px;
            display: none;
        }
        
        .field-info.visible {
            display: block;
        }
        
        .field-info h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #333;
        }
        
        .field-info .stat {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid #eee;
        }
        
        .field-info .stat:last-child {
            border-bottom: none;
        }
        
        .field-info .label {
            color: #666;
        }
        
        .field-info .value {
            font-weight: bold;
            color: #333;
        }
        
        .field-info .ndvi-value {
            color: #4a90a4;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <div class="controls">
        <h2>Jefferson Farm NDVI Timeline</h2>
        <div class="slider-container">
            <button id="prevBtn">Previous</button>
            <input type="range" id="monthSlider" min="0" max="12" value="0">
            <button id="nextBtn">Next</button>
        </div>
        <div id="currentMonth">April 2024</div>
        
        <div class="legend">
            <h3>NDVI Legend</h3>
            <div class="legend-gradient"></div>
            <div class="legend-labels">
                <span>Stressed (0.0)</span>
                <span>Moderate (0.5)</span>
                <span>Healthy (1.0)</span>
            </div>
        </div>
    </div>
    
    <div class="field-info" id="fieldInfo">
        <h3 id="fieldName">Field Name</h3>
        <div class="stat">
            <span class="label">Mean NDVI</span>
            <span class="value ndvi-value" id="fieldMean">-</span>
        </div>
        <div class="stat">
            <span class="label">Min NDVI</span>
            <span class="value" id="fieldMin">-</span>
        </div>
        <div class="stat">
            <span class="label">Max NDVI</span>
            <span class="value" id="fieldMax">-</span>
        </div>
        <div class="stat">
            <span class="label">Std Dev</span>
            <span class="value" id="fieldStd">-</span>
        </div>
        <div class="stat">
            <span class="label">Pixels</span>
            <span class="value" id="fieldPixels">-</span>
        </div>
    </div>

    <script>
        // Bounds for Jefferson Farm
        const bounds = [[43.797088, -112.586407], [44.008001, -111.678382]];
        
        // Initialize map
        const map = L.map('map', { maxBounds: bounds }).setView([43.902, -112.132], 13);
        
        // Add Esri World Imagery
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Esri World Imagery'
        }).addTo(map);
        
        // Field boundaries GeoJSON
        const fieldBoundaries = FIELDS_GEOJSON;
        
        // NDVI stats data
        const ndviStats = NDVI_STATS;
        
        // NDVI images (base64)
        const ndviImages = NDVI_IMAGES;
        
        // Month list
        const months = MONTHS_LIST;
        let currentIndex = 0;
        
        // Field overlays
        const fieldOverlays = {};
        const fieldLayers = {};
        
        // Create overlay for each field
        function createFieldOverlay(fieldName, monthKey) {
            const imageData = ndviImages[monthKey]?.[fieldName];
            if (!imageData) return null;
            
            const fieldData = fieldBoundaries.features.find(f => f.properties.Name === fieldName);
            if (!fieldData) return null;
            
            const coords = fieldData.geometry.coordinates[0];
            const latlngs = coords.map(c => [c[1], c[0]]);
            const bounds = L.latLngBounds(latlngs);
            
            const img = L.imageOverlay('data:image/png;base64,' + imageData, bounds, {
                opacity: 0.7,
                crossOrigin: 'anonymous'
            });
            
            return img;
        }
        
        // Show current month
        function showMonth(index) {
            currentIndex = index;
            
            document.getElementById('monthSlider').value = index;
            document.getElementById('currentMonth').textContent = months[index][1];
            document.getElementById('prevBtn').disabled = index === 0;
            document.getElementById('nextBtn').disabled = index === months.length - 1;
            
            // Remove old overlays
            Object.values(fieldOverlays).forEach(overlay => {
                if (overlay && map.hasLayer(overlay)) {
                    map.removeLayer(overlay);
                }
            });
            
            // Add new overlays
            const monthKey = months[index][0];
            fieldBoundaries.features.forEach(feature => {
                const fieldName = feature.properties.Name;
                const overlay = createFieldOverlay(fieldName, monthKey);
                fieldOverlays[fieldName] = overlay;
                if (overlay) {
                    overlay.addTo(map);
                }
            });
        }
        
        // Add field boundary lines
        L.geoJSON(fieldBoundaries, {
            style: {
                color: '#333',
                weight: 1,
                fillOpacity: 0
            },
            onEachFeature: function(feature, layer) {
                fieldLayers[feature.properties.Name] = layer;
                layer.on('click', function(e) {
                    showFieldInfo(feature.properties.Name);
                });
                layer.on('mouseover', function() {
                    this.setStyle({ weight: 3, color: '#4a90a4' });
                });
                layer.on('mouseout', function() {
                    this.setStyle({ weight: 1, color: '#333' });
                });
            }
        }).addTo(map);
        
        // Show field info
        function showFieldInfo(fieldName) {
            const monthKey = months[currentIndex][0];
            const stats = ndviStats[monthKey]?.[fieldName];
            
            if (!stats) {
                document.getElementById('fieldInfo').classList.remove('visible');
                return;
            }
            
            document.getElementById('fieldName').textContent = fieldName;
            document.getElementById('fieldMean').textContent = stats.mean ? stats.mean.toFixed(3) : '-';
            document.getElementById('fieldMin').textContent = stats.min ? stats.min.toFixed(3) : '-';
            document.getElementById('fieldMax').textContent = stats.max ? stats.max.toFixed(3) : '-';
            document.getElementById('fieldStd').textContent = stats.std ? stats.std.toFixed(3) : '-';
            document.getElementById('fieldPixels').textContent = stats.pixel_count || '-';
            
            document.getElementById('fieldInfo').classList.add('visible');
        }
        
        // Slider controls
        document.getElementById('monthSlider').addEventListener('input', function() {
            showMonth(parseInt(this.value));
        });
        
        document.getElementById('prevBtn').addEventListener('click', function() {
            if (currentIndex > 0) showMonth(currentIndex - 1);
        });
        
        document.getElementById('nextBtn').addEventListener('click', function() {
            if (currentIndex < months.length - 1) showMonth(currentIndex + 1);
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && currentIndex > 0) showMonth(currentIndex - 1);
            if (e.key === 'ArrowRight' && currentIndex < months.length - 1) showMonth(currentIndex + 1);
        });
        
        // Initial display
        showMonth(0);
        
        // Fit bounds
        map.fitBounds(bounds);
    </script>
</body>
</html>
'''

# Load data
fields_geojson = json.loads(FIELDS_FILE.read_text())
ndvi_stats = json.loads(NDVI_STATS_FILE.read_text())
ndvi_images = json.loads(IMAGES_FILE.read_text())

# Build month list
months_list = [[m[0], m[1]] for m in MONTHS]

# Replace placeholders
html = html_template.replace('FIELDS_GEOJSON', json.dumps(fields_geojson))
html = html.replace('NDVI_STATS', json.dumps(ndvi_stats))
html = html.replace('NDVI_IMAGES', json.dumps(ndvi_images))
html = html.replace('MONTHS_LIST', json.dumps(months_list))

# Write output
OUTPUT_HTML.write_text(html)
print(f"Written to {OUTPUT_HTML}")
print(f"File size: {OUTPUT_HTML.stat().st_size / 1024 / 1024:.1f} MB")
