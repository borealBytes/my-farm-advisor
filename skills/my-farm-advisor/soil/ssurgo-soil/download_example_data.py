#!/usr/bin/env python3
"""Download real SSURGO soil data for the 2 example fields.

Uses the NRCS Soil Data Access (SDA) REST API to query soil properties
at field centroids. This script generates the example data files.
"""

import csv
import json
import sys
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: requests is required. Install with: pip install requests")
    sys.exit(1)


SDA_URL = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest"

COLUMNS = [
    "mukey",
    "muname",
    "compname",
    "comppct_r",
    "drainagecl",
    "hzdept_r",
    "hzdepb_r",
    "om_r",
    "ph1to1h2o_r",
    "awc_r",
    "claytotal_r",
    "sandtotal_r",
    "silttotal_r",
    "dbthirdbar_r",
    "cec7_r",
]


def query_sda(sql: str) -> list[dict]:
    """Execute a SQL query against the NRCS SDA REST API.

    SDA returns {"Table": [[val, ...], ...]} — lists of lists.
    We convert to dicts using the COLUMNS mapping.

    Args:
        sql: SQL query string.

    Returns:
        List of dictionaries, one per row.
    """
    response = requests.post(
        SDA_URL,
        data={"query": sql, "format": "JSON"},
        timeout=60,
    )
    response.raise_for_status()
    result = response.json()

    if "Table" not in result:
        return []

    rows = []
    for raw_row in result["Table"]:
        row = dict(zip(COLUMNS, raw_row))
        rows.append(row)
    return rows


def get_soil_for_point(lon: float, lat: float) -> list[dict]:
    """Get SSURGO soil properties at a geographic point.

    Queries the dominant component's top horizon (0-30cm) properties.

    Args:
        lon: Longitude (WGS84).
        lat: Latitude (WGS84).

    Returns:
        List of dicts with soil properties per horizon.
    """
    sql = f"""
    SELECT
        mu.mukey,
        mu.muname,
        c.compname,
        c.comppct_r,
        c.drainagecl,
        ch.hzdept_r,
        ch.hzdepb_r,
        ch.om_r,
        ch.ph1to1h2o_r,
        ch.awc_r,
        ch.claytotal_r,
        ch.sandtotal_r,
        ch.silttotal_r,
        ch.dbthirdbar_r,
        ch.cec7_r
    FROM mapunit mu
    INNER JOIN component c ON mu.mukey = c.mukey
    INNER JOIN chorizon ch ON c.cokey = ch.cokey
    WHERE mu.mukey IN (
        SELECT * FROM SDA_Get_Mukey_from_intersection_with_WktWgs84(
            'POINT({lon} {lat})'
        )
    )
    AND c.majcompflag = 'Yes'
    AND ch.hzdept_r < 30
    ORDER BY c.comppct_r DESC, ch.hzdept_r ASC
    """
    return query_sda(sql)


def get_soil_for_polygon(wkt: str) -> list[dict]:
    """Get SSURGO soil properties for a polygon geometry.

    Queries all map units that intersect the polygon, returning
    the dominant component's top horizon properties.

    Args:
        wkt: WKT polygon string (WGS84).

    Returns:
        List of dicts with soil properties per map unit/horizon.
    """
    sql = f"""
    SELECT
        mu.mukey,
        mu.muname,
        c.compname,
        c.comppct_r,
        c.drainagecl,
        ch.hzdept_r,
        ch.hzdepb_r,
        ch.om_r,
        ch.ph1to1h2o_r,
        ch.awc_r,
        ch.claytotal_r,
        ch.sandtotal_r,
        ch.silttotal_r,
        ch.dbthirdbar_r,
        ch.cec7_r
    FROM mapunit mu
    INNER JOIN component c ON mu.mukey = c.mukey
    INNER JOIN chorizon ch ON c.cokey = ch.cokey
    WHERE mu.mukey IN (
        SELECT * FROM SDA_Get_Mukey_from_intersection_with_WktWgs84(
            '{wkt}'
        )
    )
    AND c.majcompflag = 'Yes'
    AND ch.hzdept_r < 30
    ORDER BY c.comppct_r DESC, ch.hzdept_r ASC
    """
    return query_sda(sql)


def main():
    # Load the 2 example fields
    geojson_path = (
        Path(__file__).parent.parent / "field-boundaries" / "examples" / "sample_2_fields.geojson"
    )
    if not geojson_path.exists():
        print(f"ERROR: Field boundaries not found at {geojson_path}")
        sys.exit(1)

    with open(geojson_path) as f:
        geojson = json.load(f)

    fields = geojson["features"]
    print(f"Loaded {len(fields)} fields from {geojson_path.name}")

    all_rows = []

    for field in fields:
        field_id = field["properties"]["field_id"]
        coords = field["geometry"]["coordinates"][0]

        # Calculate centroid
        lons = [c[0] for c in coords]
        lats = [c[1] for c in coords]
        centroid_lon = sum(lons) / len(lons)
        centroid_lat = sum(lats) / len(lats)

        print(f"\nField {field_id}:")
        print(f"  Centroid: ({centroid_lon:.6f}, {centroid_lat:.6f})")

        # Try polygon intersection first
        wkt_coords = ", ".join(f"{c[0]} {c[1]}" for c in coords)
        wkt = f"POLYGON(({wkt_coords}))"

        print("  Querying SDA with polygon intersection...")
        rows = get_soil_for_polygon(wkt)

        if not rows:
            print("  Polygon query returned no data, trying centroid...")
            rows = get_soil_for_point(centroid_lon, centroid_lat)

        if rows:
            print(f"  Got {len(rows)} horizon records")
            for row in rows:
                row["field_id"] = field_id
                all_rows.append(row)
                print(
                    f"    {row.get('compname', 'N/A')}: "
                    f"depth {row.get('hzdept_r', '?')}-{row.get('hzdepb_r', '?')}cm, "
                    f"OM={row.get('om_r', '?')}%, "
                    f"pH={row.get('ph1to1h2o_r', '?')}, "
                    f"drainage={row.get('drainagecl', '?')}"
                )
        else:
            print("  WARNING: No soil data found for this field")

    if not all_rows:
        print("\nERROR: No soil data retrieved for any field")
        sys.exit(1)

    # Save to CSV
    examples_dir = Path(__file__).parent / "examples"
    examples_dir.mkdir(exist_ok=True)

    csv_path = examples_dir / "soil_data_2_fields.csv"

    # Reorder columns for readability
    column_order = [
        "field_id",
        "mukey",
        "muname",
        "compname",
        "comppct_r",
        "drainagecl",
        "hzdept_r",
        "hzdepb_r",
        "om_r",
        "ph1to1h2o_r",
        "awc_r",
        "claytotal_r",
        "sandtotal_r",
        "silttotal_r",
        "dbthirdbar_r",
        "cec7_r",
    ]

    with open(csv_path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=column_order)
        writer.writeheader()
        for row in all_rows:
            writer.writerow({k: row.get(k, "") for k in column_order})

    print(f"\nSaved {len(all_rows)} records to {csv_path}")

    # Also save as JSON for reference
    json_path = examples_dir / "soil_data_2_fields.json"
    with open(json_path, "w") as f:
        json.dump(all_rows, f, indent=2)

    print(f"Saved JSON to {json_path}")


if __name__ == "__main__":
    main()
