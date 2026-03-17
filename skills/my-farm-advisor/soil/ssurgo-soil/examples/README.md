# SSURGO Soil Example Data

This directory contains real SSURGO soil data downloaded from the NRCS Soil Data Access (SDA) API.

## Files

- **soil_data_2_fields.csv** - Soil properties for 2 Minnesota agricultural fields
- **soil_data_2_fields.json** - Same data in JSON format

## Data Source

- **Provider**: USDA Natural Resources Conservation Service (NRCS)
- **Database**: SSURGO (Soil Survey Geographic Database)
- **API**: Soil Data Access REST API (<https://sdmdataaccess.sc.egov.usda.gov/>)
- **Format**: CSV / JSON
- **CRS**: WGS84 (point queries from EPSG:4326 field boundaries)

## Fields Included

Data was downloaded for the 2 fields in `field-boundaries/examples/sample_2_fields.geojson`:

| Field ID        | State | Soil Components                     | Drainage            |
| --------------- | ----- | ----------------------------------- | ------------------- |
| 271623002471299 | MN    | Winger, Wyndmere, Balaton, Hamerly  | Poorly to mod. well |
| 271623001561551 | MN    | Carmi, Dickinson, Ostrander, Wadena | Well drained        |

## Column Descriptions

| Column         | Description                      | Units       |
| -------------- | -------------------------------- | ----------- |
| `field_id`     | Field boundary identifier        | -           |
| `mukey`        | SSURGO map unit key              | -           |
| `muname`       | Map unit name                    | -           |
| `compname`     | Soil component name              | -           |
| `comppct_r`    | Component percentage of map unit | %           |
| `drainagecl`   | Drainage class                   | categorical |
| `hzdept_r`     | Horizon top depth                | cm          |
| `hzdepb_r`     | Horizon bottom depth             | cm          |
| `om_r`         | Organic matter                   | %           |
| `ph1to1h2o_r`  | pH in water                      | pH units    |
| `awc_r`        | Available water capacity         | in/in       |
| `claytotal_r`  | Clay content                     | %           |
| `sandtotal_r`  | Sand content                     | %           |
| `silttotal_r`  | Silt content                     | %           |
| `dbthirdbar_r` | Bulk density at 1/3 bar          | g/cm3       |
| `cec7_r`       | Cation exchange capacity at pH 7 | meq/100g    |

## Usage

```python
import pandas as pd

# Load soil data
soil = pd.read_csv('soil_data_2_fields.csv')

# View summary per field
for fid, group in soil.groupby('field_id'):
    print(f"\nField {fid}:")
    print(f"  Soil types: {', '.join(group['compname'].unique())}")
    print(f"  Avg OM: {group['om_r'].mean():.1f}%")
    print(f"  Avg pH: {group['ph1to1h2o_r'].mean():.1f}")
    print(f"  Drainage: {', '.join(group['drainagecl'].unique())}")
```

## Notes

- Multiple soil components may exist per field (different map units intersect)
- Each component may have multiple horizons (depth layers)
- `comppct_r` indicates what percentage of the map unit each component covers
- Top 30cm (topsoil) data only; deeper horizons available by adjusting query depth
- Downloaded using the `ssurgo-soil` skill's `download_example_data.py` script
