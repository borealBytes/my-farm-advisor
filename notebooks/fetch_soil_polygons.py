#!/usr/bin/env python3
import geopandas as gpd
import requests
import json
import time
import sys

# Load fields
print("Loading fields...")
fields = gpd.read_file('jefferson_farm_soil_overlay.geojson')
print(f"Loaded {len(fields)} fields")

url = 'https://gis.itd.idaho.gov/arcgisprod/rest/services/ArcGISOnline/IdahoSoils/MapServer/0/query'

all_features = []

# Process each field
for i in range(len(fields)):
    row = fields.iloc[i]
    name = row['Name']
    geom = row.geometry
    
    # Get bounds
    minx, miny, maxx, maxy = geom.bounds
    
    # Use literal string that works - extract each coordinate explicitly
    minx_str = str(round(minx, 6))
    miny_str = str(round(miny, 6))
    maxx_str = str(round(maxx, 6))
    maxy_str = str(round(maxy, 6))
    bounds_str = minx_str + ',' + miny_str + ',' + maxx_str + ',' + maxy_str
    
    # Debug first field
    if i == 0:
        print(f"DEBUG - bounds_str: {bounds_str}")
    
    # Make request - with fewer fields to avoid errors
    data = {
        'geometry': bounds_str,
        'geometryType': 'esriGeometryEnvelope',
        'spatialRel': 'esriSpatialRelIntersects',
        'outFields': 'MUKEY,musym,muname,compname,comppct_r,drainagecl,om_r',
        'returnGeometry': 'true',
        'f': 'geojson',
        'inSR': '4326',
        'outSR': '4326'
    }
    
    # Debug first request
    if i == 0:
        print(f"DEBUG - full data: {data}")
    
    resp = requests.post(url, data=data, timeout=30)
    result = resp.json()
    
    # Debug first response
    if i == 0:
        print(f"DEBUG - result keys: {result.keys()}")
        if 'features' in result:
            print(f"DEBUG - features count: {len(result['features'])}")
        else:
            print(f"DEBUG - error: {result.get('error')}")
    
    feats = result.get('features', [])
    
    feats = result.get('features', [])
    
    # Add field name to each feature
    for f in feats:
        f['properties']['field_name'] = name
    
    all_features.extend(feats)
    print(f"  Field {i+1}/{len(fields)} ({name}): {len(feats)} soil polygons")
    
    # Small delay to be nice to the server
    time.sleep(0.1)

print(f"\nTotal soil polygons: {len(all_features)}")

# Save raw GeoJSON
soil_geojson = {"type": "FeatureCollection", "features": all_features}
with open('jefferson_soil_polygons.geojson', 'w') as f:
    json.dump(soil_geojson, f)
print("Saved: jefferson_soil_polygons.geojson")

if all_features:
    # Create GeoDataFrame
    soil_gdf = gpd.GeoDataFrame.from_features(all_features)
    soil_gdf = soil_gdf.set_geometry('geometry')
    soil_gdf.set_crs('EPSG:4326', inplace=True)
    
    print(f"\nUnique soil types: {soil_gdf['compname'].nunique()}")
    print("\nTop 15 soil types:")
    print(soil_gdf['compname'].value_counts().head(15))
    
    # Save as GeoDataFrame
    soil_gdf.to_file('jefferson_soil_polygons.geojson', driver='GeoJSON')
    print("\nSaved: jefferson_soil_polygons.geojson")
else:
    print("\nNo features collected!")