#!/usr/bin/env python3
import json
import csv
import math

# Real soil data for Levelton soils from NRCS (correcting erroneous 0-5cm horizon data)
# These values are from the 5-23cm horizon which represents actual topsoil
LEVELTON_CORRECTIONS = {
    '83899': {  # Levelton loamy sand
        'om_r': 1.5,
        'ph': 8.8,
        'cec': 7.5,
        'db': 1.6,
        'depth': 23,
        'sand': 83.5,
        'silt': 9,
        'clay': 7.5
    },
    '83900': {  # Levelton loam
        'om_r': 1.5,
        'ph': 8.8,
        'cec': 15.0,
        'db': 1.3,
        'depth': 23,
        'sand': 43,
        'silt': 39.5,
        'clay': 17.5
    },
    '83901': {  # Levelton loam, drained, moderately saline-alkali
        'om_r': 1.5,
        'ph': 8.8,
        'cec': 15.0,
        'db': 1.3,
        'depth': 23,
        'sand': 43,
        'silt': 39.5,
        'clay': 17.5
    },
    '83904': {  # Levelton silty clay loam, drained, moderately saline-alkali
        'om_r': 1.5,
        'ph': 8.8,
        'cec': 22.4,
        'db': 1.3,
        'depth': 23,
        'sand': 18,
        'silt': 54,
        'clay': 28
    },
    '83902': {  # Levelton clay loam (poorly drained)
        'om_r': 1.5,
        'ph': 8.8,
        'cec': 15.0,
        'db': 1.3,
        'depth': 23,
        'sand': 35,
        'silt': 40,
        'clay': 25
    }
}

def calculate_k_factor(sandtotal_r, silttotal_r, claytotal_r, om_r):
    if om_r is None or om_r > 20:
        om_r = 3.0
    vfs = sandtotal_r * 0.10
    silt_vfs = silttotal_r + vfs
    M = silt_vfs * (100 - claytotal_r)
    if M <= 0:
        return 0.20
    om_factor = max(0, 12 - om_r)
    K = (2.645e-4 * (M ** 1.14) * om_factor + 0.038 * math.exp(-0.0047 * (silt_vfs ** 2))) * 0.1317
    return round(max(0.01, K), 3)

def calculate_csp(om_r, dbthirdbar_r, depth_cm):
    if om_r is None or dbthirdbar_r is None or depth_cm is None:
        return None
    if om_r > 20:
        om_r = 3.0
    return round(om_r * dbthirdbar_r * depth_cm * 1.724, 2)

def calculate_erosion_risk(k_factor, om_r):
    if k_factor is None or om_r is None:
        return None
    if om_r > 20:
        om_r = 3.0
    return round(k_factor * 10 / (om_r + 2), 3)

def normalize(value, min_val, max_val):
    if max_val == min_val:
        return 0.5
    return (value - min_val) / (max_val - min_val)

csv_path = '/workspaces/my-farm-advisor/notebooks/jefferson_farm_soil_data.csv'
geojson_path = '/workspaces/my-farm-advisor/notebooks/jefferson_farm_soil_overlay.geojson'

fields_data = []

# Fields to exclude completely
EXCLUDE_FIELDS = {"69 1/2"}

def parse_numeric(val, field_type=None):
    if val is None or val == '':
        return None
    try:
        v = float(val)
        # Only filter out >20 for OM (bad data like 75%), allow higher for CEC
        if field_type == 'om' and v > 20:
            return None
        return v
    except:
        return None

print("Processing soil data...")
with open(csv_path, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        field_id = row['field_id']
        
        # Skip excluded fields
        if field_id in EXCLUDE_FIELDS:
            continue
        
        mukey = row.get('mukey', '')
        
        # Check if this is a Levelton soil that needs correction
        if mukey in LEVELTON_CORRECTIONS:
            correction = LEVELTON_CORRECTIONS[mukey]
            om_r = correction['om_r']
            ph = correction['ph']
            cec = correction['cec']
            db = correction['db']
            depth = correction['depth']
            sand = correction['sand']
            silt = correction['silt']
            clay = correction['clay']
        else:
            om_r = parse_numeric(row['om_r'], 'om')
            if om_r is None:
                continue
            ph = parse_numeric(row['ph1to1h2o_r'])
            cec = parse_numeric(row['cec7_r'])
            sand = parse_numeric(row['sandtotal_r']) or 0
            silt = parse_numeric(row['silttotal_r']) or 0
            clay = parse_numeric(row['claytotal_r']) or 0
            db = parse_numeric(row['dbthirdbar_r'])
            depth = parse_numeric(row['hzdepb_r'])
        
        compname = row['compname']
        muname = row['muname']
        
        k_factor = calculate_k_factor(sand, silt, clay, om_r)
        csp = calculate_csp(om_r, db, depth)
        erosion_risk = calculate_erosion_risk(k_factor, om_r)
        
        fields_data.append({
            'field_id': field_id,
            'compname': compname,
            'muname': muname,
            'om_r': om_r,
            'ph': ph,
            'cec': cec,
            'k_factor': k_factor,
            'csp': csp,
            'erosion_risk': erosion_risk
        })

print(f"Processed {len(fields_data)} fields with valid OM data")

with open(geojson_path, 'r') as f:
    geojson = json.load(f)

feature_map = {f['properties'].get('field_id') or f['properties'].get('Name'): f for f in geojson['features']}

# Filter out excluded fields from GeoJSON
geojson['features'] = [f for f in geojson['features'] 
                       if (f['properties'].get('field_id') or f['properties'].get('Name')) not in EXCLUDE_FIELDS]

for field in fields_data:
    fid = field['field_id']
    for feature in geojson['features']:
        prop = feature['properties']
        if (prop.get('field_id') == fid) or (prop.get('Name') == fid):
            prop['k_factor'] = field['k_factor']
            prop['csp'] = field['csp']
            prop['erosion_risk'] = field['erosion_risk']
            prop['om_pct'] = field['om_r']
            prop['ph_value'] = field['ph']
            prop['cec_value'] = field['cec']
            break

om_values = [f['om_r'] for f in fields_data if f['om_r'] is not None]
ph_values = [f['ph'] for f in fields_data if f['ph'] is not None]
cec_values = [f['cec'] for f in fields_data if f['cec'] is not None]

om_min, om_max = min(om_values), max(om_values)
ph_min, ph_max = min(ph_values), max(ph_values)
cec_min, cec_max = min(cec_values), max(cec_values)

print(f"OM range: {om_min} - {om_max}, pH range: {ph_min} - {ph_max}, CEC range: {cec_min} - {cec_max}")

for feature in geojson['features']:
    prop = feature['properties']
    om = prop.get('om_pct')
    ph = prop.get('ph_value')
    cec = prop.get('cec_value')
    
    om_norm = normalize(om, om_min, om_max) if om is not None else 0.5
    ph_dist = abs(ph - 6.0) / max(abs(ph_min - 6.0), abs(ph_max - 6.0), 0.1) if ph is not None else 0.5
    ph_score = 1 - ph_dist
    cec_norm = normalize(cec, cec_min, cec_max) if cec is not None else 0.5
    
    composite = om_norm * 0.4 + ph_score * 0.3 + cec_norm * 0.3
    prop['composite_score'] = round(composite, 3)

ranked = sorted(geojson['features'], key=lambda x: x['properties'].get('composite_score', 0), reverse=True)
top_10 = ranked[:10]
bottom_10 = ranked[-10:]

print("\n=== TOP 10 FIELDS ===")
for i, f in enumerate(top_10, 1):
    p = f['properties']
    print(f"{i}. {p.get('field_id') or p.get('Name')} | OM: {p.get('om_pct')}% | pH: {p.get('ph_value')} | CEC: {p.get('cec_value')} | K: {p.get('k_factor')} | CSP: {p.get('csp')} | Risk: {p.get('erosion_risk')} | Score: {p.get('composite_score')}")

print("\n=== BOTTOM 10 FIELDS ===")
for i, f in enumerate(bottom_10, 1):
    p = f['properties']
    print(f"{i}. {p.get('field_id') or p.get('Name')} | OM: {p.get('om_pct')}% | pH: {p.get('ph_value')} | CEC: {p.get('cec_value')} | K: {p.get('k_factor')} | CSP: {p.get('csp')} | Risk: {p.get('erosion_risk')} | Score: {p.get('composite_score')}")

output_geojson = '/workspaces/my-farm-advisor/notebooks/jefferson_soil_metrics.geojson'
with open(output_geojson, 'w') as f:
    json.dump(geojson, f)
print(f"\nEnhanced GeoJSON saved to: {output_geojson}")

table_data = []
for i, f in enumerate(ranked, 1):
    p = f['properties']
    table_data.append({
        'rank': i,
        'field': p.get('field_id') or p.get('Name'),
        'om': p.get('om_pct'),
        'ph': p.get('ph_value'),
        'cec': p.get('cec_value'),
        'k_factor': p.get('k_factor'),
        'csp': p.get('csp'),
        'erosion_risk': p.get('erosion_risk'),
        'score': p.get('composite_score')
    })

print("\n=== TABLE DATA JSON ===")
print(json.dumps(table_data[:20], indent=2))