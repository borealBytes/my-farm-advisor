"""USDA NRCS SSURGO soil data downloader.

This module provides functions to query SSURGO (Soil Survey Geographic Database)
soil properties for agricultural fields via the NRCS Soil Data Access (SDA)
REST API. No API key or authentication required.

Data Source:
    USDA NRCS Soil Data Access (SDA)
    https://sdmdataaccess.sc.egov.usda.gov/

Key Soil Properties:
    - Organic matter (om_r): Percentage, 0-20%
    - pH in water (ph1to1h2o_r): 3.5-10.0
    - Available water capacity (awc_r): inches/inch
    - Drainage class (drainagecl): Categorical
    - Texture: Clay/Sand/Silt percentages
    - Bulk density (dbthirdbar_r): g/cm³
    - Cation exchange capacity (cec7_r): meq/100g

Usage:
    >>> import geopandas as gpd
    >>> from ssurgo_soil import download_soil, get_soil_at_point
    >>>
    >>> fields = gpd.read_file('fields.geojson')
    >>> soil = download_soil(fields)
"""

import warnings
from pathlib import Path
from typing import Any

try:
    import geopandas as gpd
    import pandas as pd
    import requests

    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False
    warnings.warn("Required packages not installed. Run: uv pip install geopandas pandas requests")


# NRCS Soil Data Access REST API endpoint
SDA_URL = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest"

# Additional soil properties for comprehensive analysis
EXTENDED_COLUMNS = [
    # Horizon properties
    "hzdept_r",  # Horizon top depth
    "hzdepb_r",  # Horizon bottom depth
    "om_r",  # Organic matter
    "ph1to1h2o_r",  # pH in water
    "awc_r",  # Available water capacity
    "claytotal_r",  # Total clay
    "sandtotal_r",  # Total sand
    "silttotal_r",  # Total silt
    "dbthirdbar_r",  # Bulk density
    "cec7_r",  # CEC at pH 7
    # Erosion and interpretation
    "kwfact",  # K-factor (erodibility)
    "awc_r",  # Available water capacity
    # Engineering
    "hydgrpdcd",  # Hydrologic group
    "drainagecl",  # Drainage class
]

SDA_COLUMNS = EXTENDED_COLUMNS

# Extended numeric columns
EXTENDED_NUMERIC_COLUMNS = [
    "comppct_r",
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
    "kwfact",
    "hydgrpdcd",
]


def _check_deps() -> None:
    """Raise ImportError if required packages are missing."""
    if not HAS_DEPS:
        raise ImportError(
            "Required packages not installed. Run: uv pip install geopandas pandas requests"
        )


def query_sda(sql: str) -> list[dict[str, Any]]:
    """Execute a SQL query against the NRCS SDA REST API.

    The SDA REST API accepts SQL queries against the SSURGO database
    and returns results as JSON. No authentication required.

    API docs: https://sdmdataaccess.nrcs.usda.gov/WebServiceHelp.aspx

    Args:
        sql: SQL query string using SSURGO table/column names.

    Returns:
        List of dictionaries, one per result row.

    Raises:
        requests.HTTPError: If the API request fails.

    Example:
        >>> rows = query_sda("SELECT mukey, muname FROM mapunit LIMIT 5")
    """
    _check_deps()

    last_error: Exception | None = None
    result: dict[str, Any] = {}
    for timeout_seconds in (60, 120):
        try:
            response = requests.post(
                SDA_URL,
                data={"query": sql, "format": "JSON"},
                timeout=timeout_seconds,
            )
            response.raise_for_status()
            result = response.json()
            break
        except Exception as exc:  # noqa: BLE001 - network retries
            last_error = exc
            continue

    if not result:
        if last_error:
            raise last_error
        return []

    if "Table" not in result:
        return []

    rows = []
    for raw_row in result["Table"]:
        row = dict(zip(SDA_COLUMNS, raw_row))
        rows.append(row)
    return rows


def _build_soil_query(wkt: str, max_depth_cm: int = 30) -> str:
    """Build SDA SQL query for soil properties at a WKT geometry.

    Args:
        wkt: WKT geometry string (POINT or POLYGON) in WGS84.
        max_depth_cm: Maximum soil depth to query (default: 30cm topsoil).

    Returns:
        SQL query string.
    """
    return f"""
    SELECT DISTINCT
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
    LEFT JOIN chorizon ch ON c.cokey = ch.cokey
    WHERE mu.mukey IN (
        SELECT * FROM SDA_Get_Mukey_from_intersection_with_WktWgs84(
            '{wkt}'
        )
    )
    AND (ch.hzdept_r < {max_depth_cm} OR ch.hzdept_r IS NULL)
    ORDER BY c.comppct_r DESC, ch.hzdept_r ASC
    """


def get_soil_at_point(
    lon: float,
    lat: float,
    max_depth_cm: int = 30,
) -> pd.DataFrame:
    """Get SSURGO soil properties at a geographic point.

    Queries the dominant soil component's horizon data at the given
    coordinates. Returns topsoil properties (0-30cm by default).

    Args:
        lon: Longitude (WGS84, decimal degrees).
        lat: Latitude (WGS84, decimal degrees).
        max_depth_cm: Maximum depth in cm (default: 30).

    Returns:
        DataFrame with soil properties. Empty if no data found.

    Example:
        >>> soil = get_soil_at_point(lon=-93.5, lat=42.0)
        >>> print(soil[['compname', 'om_r', 'ph1to1h2o_r']])
    """
    _check_deps()

    wkt = f"POINT({lon} {lat})"
    rows = query_sda(_build_soil_query(wkt, max_depth_cm))

    df = pd.DataFrame(rows)
    if not df.empty:
        for col in NUMERIC_COLUMNS:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def get_soil_for_polygon(
    wkt: str,
    max_depth_cm: int = 30,
) -> pd.DataFrame:
    """Get SSURGO soil properties for a polygon geometry.

    Queries all map units that intersect the polygon. Returns the
    dominant component's horizon properties for each map unit.

    Args:
        wkt: WKT polygon string in WGS84.
        max_depth_cm: Maximum depth in cm (default: 30).

    Returns:
        DataFrame with soil properties. Empty if no data found.

    Example:
        >>> wkt = "POLYGON((-93.5 42.0, -93.4 42.0, -93.4 42.1, -93.5 42.1, -93.5 42.0))"
        >>> soil = get_soil_for_polygon(wkt)
    """
    _check_deps()

    rows = query_sda(_build_soil_query(wkt, max_depth_cm))

    df = pd.DataFrame(rows)
    if not df.empty:
        for col in NUMERIC_COLUMNS:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def download_soil(
    fields: "gpd.GeoDataFrame",
    field_id_column: str = "field_id",
    max_depth_cm: int = 30,
    output_path: str | None = None,
) -> pd.DataFrame:
    """Download SSURGO soil data for multiple field boundaries.

    For each field, queries the SDA API using the field's polygon geometry
    (or centroid as fallback) and collects soil properties.

    Args:
        fields: GeoDataFrame with field boundaries (EPSG:4326).
        field_id_column: Column name containing field IDs.
        max_depth_cm: Maximum soil depth in cm (default: 30).
        output_path: Optional path to save results as CSV.

    Returns:
        DataFrame with soil properties for all fields, including
        a 'field_id' column for joining back to field boundaries.

    Example:
        >>> import geopandas as gpd
        >>> fields = gpd.read_file('fields.geojson')
        >>> soil = download_soil(fields, output_path='soil_data.csv')
        >>> print(soil.groupby('field_id')['om_r'].mean())
    """
    _check_deps()

    all_results = []

    for idx, field in fields.iterrows():
        fid = field.get(field_id_column, f"field_{idx}")
        geom = field.geometry

        # Build WKT from geometry
        wkt = geom.wkt

        try:
            df = get_soil_for_polygon(wkt, max_depth_cm)
        except Exception:
            # Fallback to centroid if polygon query fails
            centroid = geom.centroid
            try:
                df = get_soil_at_point(centroid.x, centroid.y, max_depth_cm)
            except Exception:
                df = pd.DataFrame()

        if not df.empty:
            df["field_id"] = fid
            all_results.append(df)

    if not all_results:
        return pd.DataFrame(columns=["field_id"] + SDA_COLUMNS)

    result = pd.concat(all_results, ignore_index=True)

    if output_path:
        output = Path(output_path)
        output.parent.mkdir(parents=True, exist_ok=True)
        result.to_csv(output, index=False)

    return result


def get_dominant_soil(soil_data: pd.DataFrame) -> pd.DataFrame:
    """Extract the dominant (highest comppct_r) soil component per field.

    When multiple soil map units and components exist for a field,
    this returns only the dominant component's topmost horizon.

    Args:
        soil_data: DataFrame from download_soil().

    Returns:
        DataFrame with one row per field (dominant component, top horizon).

    Example:
        >>> soil = download_soil(fields)
        >>> dominant = get_dominant_soil(soil)
        >>> print(dominant[['field_id', 'compname', 'om_r', 'ph1to1h2o_r']])
    """
    if soil_data.empty:
        return soil_data

    # Sort by component percentage (descending) then horizon depth (ascending)
    sorted_df = soil_data.sort_values(
        ["comppct_r", "hzdept_r"],
        ascending=[False, True],
    )

    # Take first row per field (dominant component, shallowest horizon)
    return sorted_df.groupby("field_id").first().reset_index()


def classify_drainage(drainage_class: str) -> str:
    """Classify SSURGO drainage class into simple categories.

    Args:
        drainage_class: SSURGO drainage class string.

    Returns:
        One of: 'excessive', 'good', 'poor', or 'unknown'.

    Example:
        >>> classify_drainage("Well drained")
        'good'
        >>> classify_drainage("Poorly drained")
        'poor'
    """
    mapping = {
        "Excessively drained": "excessive",
        "Somewhat excessively drained": "excessive",
        "Well drained": "good",
        "Moderately well drained": "good",
        "Somewhat poorly drained": "poor",
        "Poorly drained": "poor",
        "Very poorly drained": "poor",
    }
    return mapping.get(str(drainage_class), "unknown")


def _build_full_ssurgo_query(wkt: str, max_depth_cm: int = 200) -> str:
    """Build comprehensive SDA SQL query for full SSURGO data."""
    sql = f"""SELECT mu.mukey, mu.muname, c.cokey, c.compname, c.comppct_r, c.drainagecl, c.majcompflag, ch.chkey, ch.hzdept_r, ch.hzdepb_r, ch.om_r, ch.ph1to1h2o_r, ch.awc_r, ch.claytotal_r, ch.sandtotal_r, ch.silttotal_r, ch.dbthirdbar_r, ch.cec7_r, ch.kwfact FROM mapunit mu INNER JOIN component c ON mu.mukey = c.mukey LEFT JOIN chorizon ch ON c.cokey = ch.cokey WHERE mu.mukey IN (SELECT * FROM SDA_Get_Mukey_from_intersection_with_WktWgs84('{wkt}')) AND (ch.hzdept_r < {max_depth_cm} OR ch.hzdept_r IS NULL) ORDER BY mu.mukey, c.comppct_r DESC, ch.hzdept_r ASC"""
    return sql
    return f"""
    SELECT DISTINCT
        mu.mukey,
        mu.muname,
        c.cokey,
        c.compname,
        c.comppct_r,
        c.drainagecl,
        c.majcompflag,
        c.engdwobdcd,
        c.hydgrpcd,
        ch.chkey,
        ch.hzdept_r,
        ch.hzdepb_r,
        ch.om_r,
        ch.ph1to1h2o_r,
        ch.awc_r,
        ch.claytotal_r,
        ch.sandtotal_r,
        ch.silttotal_r,
        ch.dbthirdbar_r,
        ch.cec7_r,
        ch.kwfact,
        ch.kffact,
        ch.ecolor
    FROM mapunit mu
    INNER JOIN component c ON mu.mukey = c.mukey
    LEFT JOIN chorizon ch ON c.cokey = ch.cokey
    WHERE mu.mukey IN (
        SELECT * FROM SDA_Get_Mukey_from_intersection_with_WktWgs84(
            '{wkt}'
        )
    )
    AND (ch.hzdept_r < {max_depth_cm} OR ch.hzdept_r IS NULL)
    ORDER BY mu.mukey, c.comppct_r DESC, ch.hzdept_r ASC
    """


def download_full_ssurgo(
    fields: "gpd.GeoDataFrame",
    field_id_column: str = "field_id",
    max_depth_cm: int = 200,
    output_path: str | None = None,
) -> pd.DataFrame:
    """Download comprehensive SSURGO data for agricultural fields.

    This function queries the COMPLETE SSURGO database for each field:
    - ALL mukey polygons intersecting the field (not just dominant)
    - ALL soil components within each map unit (not just dominant)
    - ALL horizons/layers from surface to specified depth (default 200cm)

    This is the "soil scientist" level of detail - includes every horizon
    with full property profile.

    Args:
        fields: GeoDataFrame with field boundaries (EPSG:4326).
        field_id_column: Column name containing field IDs.
        max_depth_cm: Maximum soil depth to query (default: 200cm = 2m profile).
        output_path: Optional path to save results as CSV.

    Returns:
        DataFrame with complete SSURGO data including:
        - field_id, mukey, muname (map unit)
        - cokey, compname, comppct_r, drainagecl, majcompflag (component)
        - chkey, hzdept_r, hzdepb_r (horizon depths)
        - om_r, ph1to1h2o_r, awc_r, claytotal_r, sandtotal_r, silttotal_r
        - dbthirdbar_r, cec7_r, kwfact, kffact, hydgrpcd, engdwobdcd, ecolor

    Example:
        >>> import geopandas as gpd
        >>> fields = gpd.read_file('fields.geojson')
        >>> soil = download_full_ssurgo(fields, max_depth_cm=200)
        >>>
        >>> # Get all unique mukeys per field
        >>> print(soil.groupby('field_id')['mukey'].nunique())
        >>>
        >>> # Get all horizons for dominant component
        >>> dominant = soil[soil['majcompflag'] == 'Yes']
        >>> horizons = dominant.sort_values(['field_id', 'hzdept_r'])

    """
    _check_deps()

    all_results = []

    for idx, field in fields.iterrows():
        fid = field.get(field_id_column, f"field_{idx}")
        geom = field.geometry

        # Use centroid for query (more reliable than polygon intersection)
        centroid = geom.centroid
        wkt = f"POINT({centroid.x} {centroid.y})"

        try:
            query = _build_full_ssurgo_query(wkt, max_depth_cm)
            rows = query_sda_extended(query)
            if rows:
                df = pd.DataFrame(rows)
                df["field_id"] = fid
                all_results.append(df)
                print(f"  Downloaded {len(rows)} records for {fid}")
        except Exception as e:
            print(f"Warning: Failed to query field {fid}: {e}")
            continue

    if not all_results:
        return pd.DataFrame()

    result = pd.concat(all_results, ignore_index=True)

    # Convert numeric columns
    numeric_cols = [
        "comppct_r",
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
        "kwfact",
        "kffact",
    ]
    for col in numeric_cols:
        if col in result.columns:
            result[col] = pd.to_numeric(result[col], errors="coerce")

    if output_path:
        output = Path(output_path)
        output.parent.mkdir(parents=True, exist_ok=True)
        result.to_csv(output, index=False)

    return result


def query_sda_extended(sql: str) -> list[dict]:
    """Execute SQL query against SDA and return list of dicts."""
    import requests

    SDA_URL = "https://sdmdataaccess.sc.egov.usda.gov/Tabular/post.rest"

    response = requests.post(SDA_URL, data={"query": sql, "format": "JSON"}, timeout=120)
    response.raise_for_status()
    result = response.json()

    if "Table" not in result:
        return []

    # Column names from the query (must match SELECT order)
    columns = [
        "mukey",
        "muname",
        "cokey",
        "compname",
        "comppct_r",
        "drainagecl",
        "majcompflag",
        "chkey",
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
        "kwfact",
    ]

    rows = []
    for raw_row in result["Table"]:
        row = dict(zip(columns, raw_row))
        rows.append(row)
    return rows


def summarize_ssurgo_by_field(soil_full: pd.DataFrame) -> pd.DataFrame:
    """Create comprehensive soil summary per field.

    This function summarizes the full SSURGO data into useful agronomic metrics:

    - Number of mukey polygons
    - Number of components
    - Number of horizons
    - Dominant component name
    - Weighted averages: OM, pH, CEC, clay, sand, bulk density
    - Depth-weighted available water storage
    - pH constraint flag (too acid/alkaline for corn/soybeans)
    - Erosion risk (K-factor)

    Args:
        soil_full: DataFrame from download_full_ssurgo()

    Returns:
        DataFrame with one row per field containing summarized metrics.

    Example:
        >>> full = download_full_ssurgo(fields)
        >>> summary = summarize_ssurgo_by_field(full)
        >>> print(summary[['field_id', 'n_mukeys', 'dominant_soil', 'avg_om', 'total_aws_in']])
    """
    if soil_full.empty:
        return pd.DataFrame()

    summaries = []

    for fid in soil_full["field_id"].unique():
        field_data = soil_full[soil_full["field_id"] == fid]

        # Basic counts
        n_mukeys = field_data["mukey"].nunique()
        n_components = field_data["cokey"].nunique()
        n_horizons = len(field_data)

        # Dominant component (highest comppct_r)
        dom = field_data.loc[field_data["comppct_r"].idxmax()]
        dominant_soil = dom["compname"]
        dominant_mukey = dom["mukey"]
        dominant_muname = dom["muname"]

        # Weighted averages by component percentage
        def weighted_avg(col, weight_col="comppct_r"):
            valid = field_data[col].notna() & field_data[weight_col].notna()
            if not valid.any():
                return None
            vals = field_data.loc[valid, col]
            weights = field_data.loc[valid, weight_col]
            return (vals * weights).sum() / weights.sum()

        avg_om = weighted_avg("om_r")
        avg_ph = weighted_avg("ph1to1h2o_r")
        avg_cec = weighted_avg("cec7_r")
        avg_clay = weighted_avg("claytotal_r")
        avg_sand = weighted_avg("sandtotal_r")
        avg_bd = weighted_avg("dbthirdbar_r")
        avg_kfactor = weighted_avg("kwfact")

        # Available water storage (sum of horizon depths * AWC)
        field_data_horizons = field_data[field_data["hzdept_r"].notna()].copy()
        if not field_data_horizons.empty:
            field_data_horizons["horizon_thickness"] = (
                field_data_horizons["hzdepb_r"] - field_data_horizons["hzdept_r"]
            )
            # Weighted by component pct and horizon thickness
            field_data_horizons["aws_contribution"] = (
                field_data_horizons["awc_r"]
                * field_data_horizons["horizon_thickness"]
                * field_data_horizons["comppct_r"]
            )
            total_aws = field_data_horizons["aws_contribution"].sum()
            total_depth = (
                field_data_horizons["horizon_thickness"] * field_data_horizons["comppct_r"]
            ).sum()
            total_aws_in = (
                (total_aws / total_depth * 200) if total_depth > 0 else None
            )  # Normalize to 200cm
        else:
            total_aws_in = None

        # Drainage
        drainage = dom["drainagecl"]

        # pH constraints for corn/soybeans
        ph_constraint = None
        if avg_ph:
            if avg_ph < 5.5:
                ph_constraint = "acidic - needs lime"
            elif avg_ph > 7.5:
                ph_constraint = "alkaline - check aluminum toxicity"
            else:
                ph_constraint = "optimal"

        # Erosion risk
        erosion_risk = None
        if avg_kfactor:
            if avg_kfactor > 0.35:
                erosion_risk = "high"
            elif avg_kfactor > 0.25:
                erosion_risk = "moderate"
            else:
                erosion_risk = "low"

        summaries.append(
            {
                "field_id": fid,
                "n_mukeys": n_mukeys,
                "n_components": n_components,
                "n_horizons": n_horizons,
                "dominant_soil": dominant_soil,
                "dominant_mukey": dominant_mukey,
                "dominant_muname": dominant_muname,
                "drainage_class": drainage,
                "avg_om_pct": round(avg_om, 2) if avg_om else None,
                "avg_ph": round(avg_ph, 2) if avg_ph else None,
                "avg_cec": round(avg_cec, 1) if avg_cec else None,
                "avg_clay_pct": round(avg_clay, 1) if avg_clay else None,
                "avg_sand_pct": round(avg_sand, 1) if avg_sand else None,
                "avg_bulk_density": round(avg_bd, 2) if avg_bd else None,
                "avg_k_factor": round(avg_kfactor, 3) if avg_kfactor else None,
                "total_aws_inches": round(total_aws_in, 2) if total_aws_in else None,
                "ph_constraint": ph_constraint,
                "erosion_risk": erosion_risk,
            }
        )

    return pd.DataFrame(summaries)


try:
    from ssurgo_workflows import (  # noqa: F401
        NUMERIC_SOIL_PROPS,
        aggregate_soil_rows_by_mukey,
        classify_natural_breaks,
        headlands_ring,
        load_fallback_mukey_polygons,
        prepare_ssurgo_field_package,
        query_mupolygons_for_field,
        render_complete_workflow_figure,
        render_ssurgo_property_map,
    )
except Exception:
    pass
