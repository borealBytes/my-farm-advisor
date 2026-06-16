# Jefferson Farm NDVI + Soil Overlay Map - Technical Documentation

## Overview

This document describes how `Jefferson Farm NDVI + Soil.html` was created—an interactive Leaflet map showing NDVI vegetation imagery overlaid with soil type boundaries for Jefferson Farm.

## Key Features

- **Base Layer:** Esri World Imagery (satellite)
- **Soil Types Layer:** 629 soil polygons clipped to field boundaries (40% opacity, ON by default)
- **NDVI Overlay Layer:** Per-field NDVI images (55% opacity, OFF by default)
- **Layer Controls:** Independent toggles for Soil Types and NDVI Overlay
- **Hover Info:** Displays both NDVI statistics and soil data for each field

## Data Sources

### 1. NDVI Data

**Source:** `notebooks/data/ndvi_per_field/`

- `per_field_ndvi.json` - Per-field NDVI statistics (mean, std, min, max, pixel_count)
- `per_field_images.json` - Base64-encoded PNG images clipped to field boundaries

**Months Combined:** July 2025 and August 2025 data merged:
- 14 fields use July 2025 data (where August 2025 had no valid data)
- 43 fields use August 2025 data (including all western fields)

Color scheme:
| NDVI Range | Color |
|------------|-------|
| 0.0 (stressed) | #d73027 (red) |
| 0.3 | #f46d43 |
| 0.5 (moderate) | #fdae61 |
| 0.7 | #abd9e9 |
| 1.0 (healthy) | #4575b4 (blue) |

### 2. Soil Data

**Source:** `jefferson_farm_soil_detail_map.html` (extracted)

- 629 soil polygons with properties:
  - `compname` - Soil series name
  - `drainagecl` - Drainage class
  - `comppct_r` - Component percentage
  - `muname` - Map unit name
  - `field_name` - Parent field name

Color scheme (top soil types):
| Soil Type | Color | Count |
|-----------|-------|-------|
| Terreton | #e78ac3 | 19 |
| Lidy | #d95f02 | 6 |
| Matheson | #8da0cb | 5 |
| Levelton | #e5c494 | 4 |
| Water | #377eb8 | 3 |
| Harston | #ffff33 | 3 |
| Mathon | #e41a1c | 3 |
| Grassy Butte | #66c2a5 | 3 |
| Heiseton | #f781bf | 3 |

## Data Combination Strategy

### Data Availability Issue

The July 2025 NDVI raster has a data gap for western fields (all values = 0). Analysis revealed:

- **July 2025:** 16 fields with valid data (eastern fields only)
- **August 2025:** 43 fields with valid data (includes western fields)
- **Combined:** 57 fields with valid data (using best available month per field)

### Combination Logic

```python
for each field:
    if field has valid data in August 2025:
        use August 2025 data
    elif field has valid data in July 2025:
        use July 2025 data
```

## HTML Structure

### Layer Stack (bottom to top)

1. **Base:** Esri World Imagery (always on)
2. **Soil Polygons:** 629 polygons, 40% fill opacity
3. **Field Boundaries:** 57 field outline lines
4. **NDVI Overlays:** 57 field images (55% opacity)

### Interactivity

- **Layer Controls:** Top-right corner with toggles for:
  - Field Boundaries (always on)
  - Soil Types (toggle, default ON)
  - NDVI Overlay (toggle, default OFF)

- **Hover Panel:** Shows on mouseover over soil polygons
  - Field Name
  - Month (July/Aug 2025)
  - Mean NDVI score
  - Soil Type
  - Drainage class
  - Coverage percentage
  - Map Unit name

### Opacity Settings

| Layer | Opacity | Default |
|-------|---------|---------|
| NDVI Overlay | 55% | OFF (toggleable) |
| Soil Polygons | 40% | ON (toggleable) |
| Field Boundaries | N/A (lines) | Always visible |

## Files Created

| File | Description | Size |
|------|-------------|------|
| `Jefferson Farm NDVI + Soil.html` | Combined map | 1.9 MB |
| `notebooks/docs/NDVI_SOIL_OVERLAY.md` | This documentation | - |

## Usage

1. Open `Jefferson Farm NDVI + Soil.html` in a web browser
2. Use top-right layer controls to toggle:
   - Soil Types (default ON)
   - NDVI Overlay (default OFF)
3. Hover over any field to see both NDVI and soil data
4. Enable both layers simultaneously to see NDVI over soil boundaries

## Limitations

- NDVI and soil data are from different time periods:
  - NDVI: July/August 2025
  - Soil: Static (SSURGO data)
- Soil polygon hover requires mouseover on soil layer (not NDVI overlay)
- Some fields may show "No data" if no valid NDVI pixels exist

## Related Files

- `jefferson_farm_ndvi_timeline_perfield.html` - Original timeline map with month slider
- `jefferson_farm_soil_detail_map.html` - Standalone soil map
- `July 2025 NDVI Score Jefferson.html` - Simplified single-month NDVI map