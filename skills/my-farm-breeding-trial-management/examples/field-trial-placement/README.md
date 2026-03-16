# Field Trial Placement

**Maximum or custom placement of RCBD trial blocks within field boundaries.**

## Purpose

Places breeding trial blocks within a field's interior area (minus headlands), with options to:

- **Maximize** trial size to fill as much of the field as possible
- Set **exact trial size** in acres
- Set **exact plot dimensions** in meters
- Set **min/max constraints** on plot size
- Rotate trial to find optimal fit using binary search

All placements pass three binary validation tests:

1. Trial centroid inside field boundary
2. Dissolved trial block fully contained in field boundary
3. Zero intersection with headlands

## Quick Start

### Maximize trial size

```bash
python run_placement.py \
  --field-boundaries path/to/fields.geojson \
  --field-id osm-1396477761 \
  --grower-slug il-dekalb-grower \
  --farm-slug dekalb-demo-farm \
  --varieties P1185AM,DKC64-69,P1366AM,DKC68-26,P1197AM,DKC62-53 \
  --blocks 4 \
  --maximize
```

### Fixed trial size

```bash
python run_placement.py \
  --field-boundaries path/to/fields.geojson \
  --field-id osm-1396477761 \
  --grower-slug il-dekalb-grower \
  --farm-slug dekalb-demo-farm \
  --varieties A,B,C,D,E,F \
  --blocks 4 \
  --trial-acres 5.0
```

### Fixed plot dimensions

```bash
python run_placement.py \
  --field-boundaries path/to/fields.geojson \
  --field-id osm-1396477761 \
  --grower-slug il-dekalb-grower \
  --farm-slug dekalb-demo-farm \
  --varieties A,B,C,D,E,F \
  --blocks 4 \
  --plot-width-m 15 \
  --plot-height-m 50
```

### Maximize with constraints

```bash
python run_placement.py \
  --field-boundaries path/to/fields.geojson \
  --field-id osm-1396477761 \
  --grower-slug il-dekalb-grower \
  --farm-slug dekalb-demo-farm \
  --varieties A,B,C,D,E,F \
  --blocks 4 \
  --maximize \
  --min-plot-acres 0.1 \
  --max-plot-acres 0.5
```

## CLI Options

### Required

| Option               | Description                           |
| -------------------- | ------------------------------------- |
| `--field-boundaries` | Path to field boundaries GeoJSON      |
| `--field-id`         | Field ID to use                       |
| `--grower-slug`      | Grower slug                           |
| `--farm-slug`        | Farm slug                             |
| `--varieties`        | Comma-separated list of variety names |

### Size (mutually exclusive)

| Option                               | Description                     |
| ------------------------------------ | ------------------------------- |
| `--maximize`                         | Find the largest possible trial |
| `--trial-acres`                      | Fixed trial size in acres       |
| `--plot-width-m` + `--plot-height-m` | Fixed plot dimensions           |

### Constraints

| Option                | Description                        |
| --------------------- | ---------------------------------- |
| `--blocks`            | Number of RCBD blocks (default: 4) |
| `--min-plot-acres`    | Minimum plot size in acres         |
| `--max-plot-acres`    | Maximum plot size in acres         |
| `--min-plot-width-m`  | Minimum plot width in meters       |
| `--max-plot-width-m`  | Maximum plot width in meters       |
| `--min-plot-height-m` | Minimum plot height in meters      |
| `--max-plot-height-m` | Maximum plot height in meters      |

### Other

| Option          | Description                                  |
| --------------- | -------------------------------------------- |
| `--headlands-m` | Headlands width in meters (default: 9)       |
| `--angle-step`  | Rotation angle step in degrees (default: 15) |
| `--seed`        | Random seed for RCBD (default: 42)           |
| `--output-dir`  | Custom output directory                      |

## Output

- `rcbd_fieldbook.csv` - Plot-by-plot planting sheet
- `trial_metadata.json` - Trial config, placement, and validation results
- `trial_map_maximized.png` - Satellite imagery map with trial overlay

## Validation (Binary Tests)

Every placement is validated:

1. **Centroid inside field?** - Dissolved trial centroid must be inside field boundary
2. **Trial contained?** - Entire dissolved trial block must be inside field boundary
3. **No headlands intersection?** - Trial must not intersect headlands at all

## Integration with R2 Pipeline

```bash
# 1. Run R2 pipeline
python run_farm_pipeline.py --grower-slug il-dekalb-grower --farm-slug dekalb-demo-farm

# 2. Run trial placement (maximize)
python run_placement.py \
  --field-boundaries data/my-farm-advisor/growers/il-dekalb-grower/farms/dekalb-demo-farm/boundary/field_boundaries.geojson \
  --field-id osm-1396477761 \
  --grower-slug il-dekalb-grower \
  --farm-slug dekalb-demo-farm \
  --varieties P1185AM,DKC64-69,P1366AM,DKC68-26,P1197AM,DKC62-53 \
  --blocks 4 \
  --maximize
```

## Algorithm

Binary search for maximum rectangle:

1. For each rotation angle (0° to 180° in steps)
2. Binary search for max trial area
3. Grid search for position where all plots pass validation
4. Track best across all angles
5. Return optimal configuration

## Dependencies

- geopandas
- matplotlib
- contextily (satellite basemap)
- numpy
- shapely

## License

Apache-2.0
