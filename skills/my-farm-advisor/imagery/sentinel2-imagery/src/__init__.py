"""Sentinel-2 Imagery Skill.

Functions for downloading and processing Sentinel-2 satellite imagery
using standard Python libraries (sentinelsat, rasterio).

This module provides helper functions for:
- Searching and downloading Sentinel-2 data from Copernicus Data Space
- Calculating NDVI and other vegetation indices
- Clipping rasters to field boundaries
- Extracting field-level statistics

Example:
    >>> from sentinelsat import SentinelAPI, read_geojson, geojson_to_wkt
    >>> import rasterio
    >>> from rasterio.mask import mask
    >>>
    >>> # Connect to Copernicus Data Space
    >>> api = SentinelAPI('user', 'pass', 'https://dataspace.copernicus.eu')
    >>>
    >>> # Search for imagery
    >>> footprint = geojson_to_wkt(read_geojson('fields.geojson'))
    >>> products = api.query(
    ...     footprint,
    ...     date=('20240601', '20240831'),
    ...     platformname='Sentinel-2',
    ...     producttype='S2MSI2A',
    ...     cloudcoverpercentage=(0, 20)
    ... )
"""

from pathlib import Path
from typing import Any

import numpy as np
import pandas as pd
import rasterio
from rasterio.mask import mask
from rasterio.plot import show
from sentinelsat import SentinelAPI, geojson_to_wkt, read_geojson


def search_imagery(
    geojson_path: str,
    start_date: str,
    end_date: str,
    username: str,
    password: str,
    cloud_cover_max: float = 20.0,
    api_url: str = "https://dataspace.copernicus.eu",
) -> pd.DataFrame:
    """Search for Sentinel-2 imagery covering field boundaries.

    Uses sentinelsat to query the Copernicus Data Space catalog.

    Args:
        geojson_path: Path to GeoJSON file with field boundaries.
        start_date: Start date in 'YYYYMMDD' format.
        end_date: End date in 'YYYYMMDD' format.
        username: Copernicus Data Space username.
        password: Copernicus Data Space password.
        cloud_cover_max: Maximum cloud cover percentage (default: 20).
        api_url: Copernicus Data Space API URL.

    Returns:
        DataFrame with available products.

    Example:
        >>> products = search_imagery(
        ...     'fields.geojson',
        ...     '20240601',
        ...     '20240831',
        ...     'my_user',
        ...     'my_pass',
        ...     cloud_cover_max=20
        ... )
        >>> print(products[['title', 'cloudcoverpercentage']])
    """
    # Initialize API connection
    api = SentinelAPI(username, password, api_url)

    # Convert GeoJSON to WKT for search
    footprint = geojson_to_wkt(read_geojson(geojson_path))

    # Search for products
    products = api.query(
        footprint,
        date=(start_date, end_date),
        platformname="Sentinel-2",
        producttype="S2MSI2A",  # Level-2A (atmospherically corrected)
        cloudcoverpercentage=(0, cloud_cover_max),
    )

    # Convert to DataFrame
    products_df = api.to_dataframe(products)

    return products_df


def download_product(
    product_id: str,
    username: str,
    password: str,
    output_dir: str = "data/sentinel2",
    api_url: str = "https://dataspace.copernicus.eu",
) -> Path:
    """Download a Sentinel-2 product.

    Args:
        product_id: Product UUID from search results.
        username: Copernicus Data Space username.
        password: Copernicus Data Space password.
        output_dir: Directory to save downloaded files.
        api_url: Copernicus Data Space API URL.

    Returns:
        Path to downloaded file.

    Example:
        >>> path = download_product(
        ...     'S2A_T33UUV_20240615T105031',
        ...     'my_user',
        ...     'my_pass',
        ...     output_dir='data/sentinel2'
        ... )
    """
    api = SentinelAPI(username, password, api_url)

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    downloaded = api.download(product_id, directory_path=str(output_path))

    return Path(downloaded["path"])


def calculate_ndvi(
    red_band_path: str,
    nir_band_path: str,
    output_path: str | None = None,
) -> str:
    """Calculate NDVI from Red and NIR bands using rasterio.

    NDVI = (NIR - Red) / (NIR + Red)

    Args:
        red_band_path: Path to Red band (B04) raster.
        nir_band_path: Path to NIR band (B08) raster.
        output_path: Output path. If None, auto-generates.

    Returns:
        Path to output NDVI raster.

    Example:
        >>> ndvi_path = calculate_ndvi(
        ...     'data/B04_10m.jp2',
        ...     'data/B08_10m.jp2',
        ...     'output/ndvi.tif'
        ... )
    """
    # Read Red band
    with rasterio.open(red_band_path) as red_src:
        red = red_src.read(1).astype(float)
        profile = red_src.profile
        crs = red_src.crs

    # Read NIR band
    with rasterio.open(nir_band_path) as nir_src:
        nir = nir_src.read(1).astype(float)

    # Calculate NDVI
    ndvi = np.divide(
        nir - red,
        nir + red,
        out=np.zeros_like(nir, dtype=float),
        where=(nir + red) != 0,
    )

    # Update profile for output
    profile.update(
        dtype=rasterio.float32,
        count=1,
        compress="lzw",
    )

    # Auto-generate output path if not provided
    if output_path is None:
        epsg_code = crs.to_epsg() if crs else "4326"
        output_path = (
            red_band_path.replace("_B04_", "_NDVI_")
            .replace(".jp2", f"_EPSG{epsg_code}.tif")
            .replace(".tif", f"_EPSG{epsg_code}.tif")
        )

    # Write output
    with rasterio.open(output_path, "w", **profile) as dst:
        dst.write(ndvi.astype(rasterio.float32), 1)

    return output_path


def clip_to_field(
    raster_path: str,
    field_geometry: dict,
    output_path: str,
) -> str:
    """Clip raster to field boundary using rasterio.mask.

    Args:
        raster_path: Path to input raster.
        field_geometry: GeoJSON-like geometry dict.
        output_path: Path for output clipped raster.

    Returns:
        Path to output raster.

    Example:
        >>> from field_boundaries import download_fields
        >>> fields = download_fields(count=1)
        >>> geom = fields.iloc[0].geometry.__geo_interface__
        >>> clip_to_field('ndvi.tif', geom, 'field_ndvi.tif')
    """
    with rasterio.open(raster_path) as src:
        # Clip to field geometry
        out_image, out_transform = mask(src, [field_geometry], crop=True)
        out_meta = src.meta.copy()

    # Update metadata
    out_meta.update(
        {
            "driver": "GTiff",
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform,
        }
    )

    # Write output
    with rasterio.open(output_path, "w", **out_meta) as dst:
        dst.write(out_image)

    return output_path


def extract_field_stats(
    raster_path: str,
    fields_geojson: str,
) -> pd.DataFrame:
    """Extract zonal statistics for each field.

    Args:
        raster_path: Path to raster (e.g., NDVI).
        fields_geojson: Path to field boundaries GeoJSON.

    Returns:
        DataFrame with statistics per field.

    Example:
        >>> stats = extract_field_stats('ndvi.tif', 'fields.geojson')
        >>> print(stats[['field_id', 'mean', 'std']])
    """
    import geopandas as gpd
    from shapely.geometry import mapping

    # Load fields
    fields = gpd.read_file(fields_geojson)

    results = []

    with rasterio.open(raster_path) as src:
        for idx, field in fields.iterrows():
            field_id = field.get("field_id", f"field_{idx}")

            # Clip to field
            geom = [mapping(field.geometry)]
            out_image, _ = mask(src, geom, crop=True, nodata=np.nan)

            # Calculate statistics
            data = out_image[0]
            valid_data = data[~np.isnan(data)]

            if len(valid_data) > 0:
                results.append(
                    {
                        "field_id": field_id,
                        "mean": float(np.mean(valid_data)),
                        "std": float(np.std(valid_data)),
                        "min": float(np.min(valid_data)),
                        "max": float(np.max(valid_data)),
                        "median": float(np.median(valid_data)),
                        "pixel_count": int(len(valid_data)),
                    }
                )

    return pd.DataFrame(results)


def get_band_path(product_dir: Path, band: str, resolution: str = "10m") -> Path | None:
    """Get path to specific band file in Sentinel-2 product.

    Args:
        product_dir: Path to extracted Sentinel-2 product directory.
        band: Band name (e.g., 'B04', 'B08').
        resolution: Resolution string (e.g., '10m', '20m', '60m').

    Returns:
        Path to band file or None if not found.

    Example:
        >>> red_path = get_band_path(Path('data/S2A_...'), 'B04', '10m')
        >>> nir_path = get_band_path(Path('data/S2A_...'), 'B08', '10m')
    """
    # Sentinel-2 SAFE format: GRANULE/*/IMG_DATA/*_B04_10m.jp2
    img_data = product_dir / "GRANULE"
    if not img_data.exists():
        return None

    # Find granule directory
    granules = list(img_data.glob("*"))
    if not granules:
        return None

    img_data = granules[0] / "IMG_DATA"
    if not img_data.exists():
        return None

    # Find band file
    pattern = f"*_{band}_{resolution}.jp2"
    band_files = list(img_data.glob(pattern))

    return band_files[0] if band_files else None


# Sentinel-2 band information
BAND_INFO = {
    "B01": {"name": "Coastal aerosol", "wavelength": 443, "resolution": 60},
    "B02": {"name": "Blue", "wavelength": 490, "resolution": 10},
    "B03": {"name": "Green", "wavelength": 560, "resolution": 10},
    "B04": {"name": "Red", "wavelength": 665, "resolution": 10},
    "B05": {"name": "Red Edge 1", "wavelength": 705, "resolution": 20},
    "B06": {"name": "Red Edge 2", "wavelength": 740, "resolution": 20},
    "B07": {"name": "Red Edge 3", "wavelength": 783, "resolution": 20},
    "B08": {"name": "NIR", "wavelength": 842, "resolution": 10},
    "B8A": {"name": "Narrow NIR", "wavelength": 865, "resolution": 20},
    "B09": {"name": "Water vapor", "wavelength": 945, "resolution": 60},
    "B11": {"name": "SWIR 1", "wavelength": 1610, "resolution": 20},
    "B12": {"name": "SWIR 2", "wavelength": 2190, "resolution": 20},
}


def get_band_info(band: str) -> dict:
    """Get information about a Sentinel-2 band.

    Args:
        band: Band name (e.g., 'B04', 'B08').

    Returns:
        Dictionary with band information.

    Example:
        >>> info = get_band_info('B04')
        >>> print(f"{info['name']}: {info['wavelength']}nm, {info['resolution']}m")
        Red: 665nm, 10m
    """
    return BAND_INFO.get(band, {"name": "Unknown", "wavelength": 0, "resolution": 0})


# Import helper functions from sentinel_helpers
try:
    from .sentinel_helpers import (
        classify_ndvi,
        compute_ndvi,
        compute_ndvi_from_files,
        create_ndvi_timeseries,
        extract_field_ndvi,
        get_ndvi_summary,
        plot_ndvi_map,
        plot_ndvi_with_fields,
    )

    # Add to __all__
    __all__ = [
        "search_imagery",
        "download_product",
        "calculate_ndvi",
        "clip_to_field",
        "extract_field_stats",
        "get_band_path",
        "get_band_info",
        "BAND_INFO",
        # Helper functions
        "compute_ndvi",
        "compute_ndvi_from_files",
        "plot_ndvi_map",
        "plot_ndvi_with_fields",
        "extract_field_ndvi",
        "create_ndvi_timeseries",
        "classify_ndvi",
        "get_ndvi_summary",
    ]
except ImportError:
    # sentinel_helpers.py not available, use existing functions only
    __all__ = [
        "search_imagery",
        "download_product",
        "calculate_ndvi",
        "clip_to_field",
        "extract_field_stats",
        "get_band_path",
        "get_band_info",
        "BAND_INFO",
    ]
