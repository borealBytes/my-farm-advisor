# Jefferson Farm NDVI Timeline - Technical Documentation

## Overview

This document describes how `jefferson_farm_ndvi_timeline_perfield.html` was created—an interactive Leaflet map showing per-field NDVI vegetation patterns for Jefferson Farm with a time slider for monthly animation (2024-2025).

## Data Pipeline

### 1. Field Boundaries

**Source:** KMZ file from Jefferson Farm
**Script:** `extract_jefferson_fields.py`
**Output:** `notebooks/data/field_boundaries/jefferson_farm_fields.geojson`

- 57 individual field polygons extracted from KMZ
- Coordinate reference system: EPSG:4326
- Location: Western Idaho (bounds: [-112.59, 43.80, -111.68, 44.01])

### 2. NDVI Rasters

**Script:** `download_ndvi.py`
**Source:** Microsoft Planetary Computer (Sentinel-2 L2A)
**Output:** 13 monthly TIFF files in `notebooks/data/ndvi/`

Monthly NDVI files downloaded:
- 2024: April, May, June, July, August, September, October
- 2025: April, May, June, July, August, September

Each raster is reprojected to EPSG:4326 to match field boundaries.

### 3. Per-Field NDVI Statistics

**Script:** `extract_per_field_ndvi.py`
**Output:** `notebooks/data/ndvi_per_field/per_field_ndvi.json`

For each field and month:
- `mean`: Average NDVI value
- `std`: Standard deviation
- `min`/`max`: Range of values
- `pixel_count`: Number of valid pixels

### 4. Per-Field Clipped Images

**Script:** `extract_per_field_images.py`
**Output:** `notebooks/data/ndvi_per_field/per_field_images.json`

Generates base64-encoded PNG images clipped to each field boundary with color mapping:

| NDVI Range | Color |
|------------|-------|
| 0.0 (stressed) | #8B0000 (dark red) |
| 0.3 | #FF6600 (orange) |
| 0.5 (moderate) | #FFD700 (bright gold) |
| 0.7 | #90EE90 (light green) |
| 1.0 (healthy) | #006400 (dark green) |

### 5. HTML Assembly

**Script:** `build_per_field_html.py`
**Output:** `notebooks/jefferson_farm_ndvi_timeline_perfield.html` (3.4MB)

Combines all data into a self-contained HTML file with:
- Embedded GeoJSON (field boundaries)
- Embedded NDVI statistics
- Embedded base64 PNG images
- Leaflet.js map with Esri World Imagery base layer

## Key Scripts

| Script | Purpose |
|--------|---------|
| `extract_jefferson_fields.py` | Parse KMZ → GeoJSON field boundaries |
| `download_ndvi.py` | Download Sentinel-2, compute NDVI |
| `extract_per_field_ndvi.py` | Extract statistics per field per month |
| `extract_per_field_images.py` | Generate clipped colored PNGs |
| `build_per_field_html.py` | Assemble all data into HTML |

## HTML Features

- **Base Layer:** Esri World Imagery
- **Overlays:** Per-field NDVI images clipped to boundaries (70% opacity)
- **Time Slider:** Manual only—Previous/Next buttons + slider (no auto-play)
- **Interactivity:** Click any field to see NDVI statistics
- **Keyboard Navigation:** Arrow keys for month control

## Color Scheme

The vegetative color scheme transitions:
- **Red (0.0):** Stressed/dormant vegetation
- **Orange → Gold (0.3-0.5):** Moderate vegetation
- **Light Green → Dark Green (0.7-1.0):** Healthy/peak vegetation

## Usage

Open `jefferson_farm_ndvi_timeline_perfield.html` in a web browser. Use the slider or Previous/Next buttons to navigate through months. Click on any field to view its NDVI statistics.
