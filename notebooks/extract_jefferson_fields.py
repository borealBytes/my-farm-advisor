#!/usr/bin/env python3
"""Extract field boundaries from KMZ and get bounding box."""

import zipfile
import tempfile
import json
from pathlib import Path

import geopandas as gpd
import xmltodict

KMZ_PATH = "skills/my-farm-advisor/field-management/field-boundaries/2026 Jefferson Farm Fields.kmz"
OUTPUT_DIR = Path("notebooks/data/field_boundaries")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def extract_kmz(kmz_path: str) -> Path:
    """Extract KMZ to temp directory and return KML path."""
    with tempfile.TemporaryDirectory() as tmpdir:
        tmppath = Path(tmpdir)
        with zipfile.ZipFile(kmz_path, 'r') as z:
            z.extractall(tmppath)
        
        kml_files = list(tmppath.glob("*.kml"))
        if not kml_files:
            raise FileNotFoundError("No KML file found in KMZ")
        
        kml_path = tmppath / kml_files[0].name
        content = kml_path.read_text()
        
        doc = xmltodict.parse(content)
        
        if 'kml' in doc and 'Document' in doc['kml']:
            doc = doc['kml']['Document']
        elif 'kml' in doc and 'FeatureCollection' in doc['kml']:
            doc = doc['kml']['FeatureCollection']
        
        print("Top-level keys:", list(doc.keys()))
        
        folders = doc.get('Folder', [])
        if not isinstance(folders, list):
            folders = [folders]
        
        print(f"Found {len(folders)} folders")
        
        for folder in folders:
            name = folder.get('name', '')
            print(f"  Folder: {name}")
            placemarks = folder.get('Placemark', [])
            if not isinstance(placemarks, list):
                placemarks = [placemarks]
            print(f"    {len(placemarks)} placemarks")
        
        return doc

with tempfile.TemporaryDirectory() as tmpdir:
    tmppath = Path(tmpdir)
    
    print(f"Extracting {KMZ_PATH}...")
    with zipfile.ZipFile(KMZ_PATH, 'r') as z:
        z.extractall(tmppath)
    
    kml_files = list(tmppath.glob("*.kml"))
    if not kml_files:
        raise FileNotFoundError("No KML file found in KMZ")
    
    kml_path = tmppath / kml_files[0].name
    print(f"Reading KML: {kml_path.name}")
    
    try:
        fields = gpd.read_file(str(kml_path))
        print(f"Loaded with geopandas: {len(fields)} features")
    except Exception as e:
        print(f"GeoPandas failed: {e}")
        content = kml_path.read_text()
        
        if '<?xml' in content[:100]:
            content = content[content.find('<?xml'):]
        
        doc = xmltodict.parse(content)
        
        features = []
        
        def parse_kml_recursive(obj, name_prefix=""):
            if isinstance(obj, dict):
                if 'Placemark' in obj:
                    pm = obj['Placemark']
                    if not isinstance(pm, list):
                        pm = [pm]
                    for p in pm:
                        parse_placemark(p, name_prefix)
                elif 'Folder' in obj:
                    folder = obj['Folder']
                    if not isinstance(folder, list):
                        folder = [folder]
                    for f in folder:
                        fname = f.get('name', name_prefix)
                        parse_kml_recursive(f, fname)
        
        def parse_placemark(pm, folder_name):
            name = pm.get('name', folder_name)
            geom = pm.get('Polygon') or pm.get('Point') or pm.get('LineString')
            
            if geom and 'outerBoundaryIs' in geom:
                coords = geom['outerBoundaryIs']['LinearRing']['coordinates']
                if coords:
                    pairs = coords.strip().split()
                    import numpy as np
                    points = []
                    for pair in pairs:
                        if pair:
                            parts = pair.split(',')
                            if len(parts) >= 2:
                                lng = float(parts[0])
                                lat = float(parts[1])
                                points.append((lng, lat))
                    
                    if len(points) > 2:
                        from shapely.geometry import Polygon
                        poly = Polygon(points)
                        features.append({
                            'name': name,
                            'geometry': poly
                        })
        
        parse_kml_recursive(doc)
        
        if features:
            fields = gpd.GeoDataFrame(features, crs="EPSG:4326")
            print(f"Parsed manually: {len(fields)} features")
        else:
            raise ValueError("Could not parse any features")

print(f"\nCRS: {fields.crs}")
print(f"Columns: {list(fields.columns)}")

bounds = fields.total_bounds
print(f"\nBounding box:")
print(f"  West:  {bounds[0]:.4f}")
print(f"  South: {bounds[1]:.4f}")
print(f"  East:  {bounds[2]:.4f}")
print(f"  North: {bounds[3]:.4f}")

fields.to_file(OUTPUT_DIR / "jefferson_farm_fields.geojson", driver="GeoJSON")
print(f"\nSaved to {OUTPUT_DIR / 'jefferson_farm_fields.geojson'}")

geojson_path = OUTPUT_DIR / "bounds.json"
bounds_data = {
    "west": bounds[0],
    "south": bounds[1],
    "east": bounds[2],
    "north": bounds[3],
    "bbox": list(bounds)
}
geojson_path.write_text(json.dumps(bounds_data, indent=2))
print(f"Saved bounds to {geojson_path}")
