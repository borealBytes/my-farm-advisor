"""Landsat Imagery Helpers - NDVI computation and sensor comparison utilities.

This module provides helper functions for computing NDVI from Landsat imagery,
resampling rasters to match different resolutions, and comparing Sentinel-2
and Landsat data.
"""

import warnings
from pathlib import Path

import numpy as np

# Try to import geospatial dependencies
try:
    import geopandas as gpd
    import matplotlib.pyplot as plt
    import pandas as pd
    import rasterio
    from rasterio.mask import mask
    from rasterio.transform import Affine
    from rasterio.warp import Resampling, reproject

    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False
    warnings.warn(
        "Geospatial dependencies not installed. "
        "Run: uv pip install rasterio geopandas matplotlib pandas"
    )


def compute_ndvi_landsat(red_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
    """Compute NDVI from Landsat red and NIR bands.

    NDVI = (NIR - Red) / (NIR + Red)

    For Landsat 8/9:
    - Red = Band 4
    - NIR = Band 5

    Args:
        red_band: Red band array (B4)
        nir_band: NIR band array (B5)

    Returns:
        NDVI array with values in range [-1, 1]

    Example:
        >>> ndvi = compute_ndvi_landsat(red_data, nir_data)
        >>> print(f"Mean NDVI: {np.nanmean(ndvi):.3f}")
    """
    # Ensure float32 for computation
    red = red_band.astype("float32")
    nir = nir_band.astype("float32")

    # Compute NDVI with division by zero protection
    denominator = nir + red
    ndvi = np.where(denominator > 0, (nir - red) / denominator, np.nan).astype("float32")

    # Clip to valid range
    ndvi = np.clip(ndvi, -1.0, 1.0)

    return ndvi


def compute_ndvi_landsat_from_files(
    red_path: str | Path,
    nir_path: str | Path,
    output_path: str | Path | None = None,
) -> tuple[np.ndarray, dict]:
    """Compute NDVI from Landsat red and NIR band files.

    Args:
        red_path: Path to red band (B4) GeoTIFF
        nir_path: Path to NIR band (B5) GeoTIFF
        output_path: Optional path to save NDVI GeoTIFF

    Returns:
        Tuple of (NDVI array, raster profile)

    Raises:
        ImportError: If rasterio not installed
        FileNotFoundError: If input files not found

    Example:
        >>> ndvi, profile = compute_ndvi_landsat_from_files(
        ...     'B4.tif', 'B5.tif', 'output/ndvi.tif'
        ... )
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install rasterio numpy")

    red_path = Path(red_path)
    nir_path = Path(nir_path)

    if not red_path.exists():
        raise FileNotFoundError(f"Red band not found: {red_path}")
    if not nir_path.exists():
        raise FileNotFoundError(f"NIR band not found: {nir_path}")

    with rasterio.open(red_path) as red_src:
        red = red_src.read(1).astype("float32")
        profile = red_src.profile.copy()
        crs = red_src.crs
        transform = red_src.transform

    with rasterio.open(nir_path) as nir_src:
        nir = nir_src.read(1).astype("float32")

    ndvi = compute_ndvi_landsat(red, nir)

    # Update profile for output
    profile.update(dtype="float32", count=1, nodata=np.nan, compress="lzw")

    # Save if output path provided
    if output_path:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with rasterio.open(output_path, "w", **profile) as dst:
            dst.write(ndvi, 1)
        print(f"Saved Landsat NDVI to {output_path}")

    return ndvi, profile


def resample_to_match(
    source_path: str | Path,
    target_path: str | Path,
    output_path: str | Path,
    resampling_method: Resampling = Resampling.bilinear,
) -> Path:
    """Resample a raster to match another raster's extent and resolution.

    Args:
        source_path: Path to source raster to resample
        target_path: Path to target raster defining the output grid
        output_path: Path for resampled output
        resampling_method: Resampling algorithm (default: bilinear)

    Returns:
        Path to resampled output file

    Raises:
        ImportError: If rasterio not installed
        FileNotFoundError: If input files not found

    Example:
        >>> # Resample Landsat 30m to Sentinel-2 10m
        >>> resample_to_match(
        ...     'landsat_ndvi_30m.tif',
        ...     'sentinel_ndvi_10m.tif',
        ...     'landsat_ndvi_10m.tif'
        ... )
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install rasterio")

    source_path = Path(source_path)
    target_path = Path(target_path)

    if not source_path.exists():
        raise FileNotFoundError(f"Source raster not found: {source_path}")
    if not target_path.exists():
        raise FileNotFoundError(f"Target raster not found: {target_path}")

    # Open target to get output parameters
    with rasterio.open(target_path) as target:
        out_crs = target.crs
        out_transform = target.transform
        out_height = target.height
        out_width = target.width
        out_shape = (out_height, out_width)

    # Open source and resample
    with rasterio.open(source_path) as src:
        # Create output array
        out_data = np.empty((src.count, out_height, out_width), dtype=src.dtypes[0])

        # Reproject
        reproject(
            source=rasterio.band(src, list(range(1, src.count + 1))),
            destination=out_data,
            src_transform=src.transform,
            src_crs=src.crs,
            dst_transform=out_transform,
            dst_crs=out_crs,
            resampling=resampling_method,
        )

        # Update profile
        profile = src.profile.copy()
        profile.update(
            crs=out_crs,
            transform=out_transform,
            height=out_height,
            width=out_width,
        )

    # Write output
    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with rasterio.open(output_path, "w", **profile) as dst:
        dst.write(out_data)

    print(f"Resampled {source_path.name} to match {target_path.name}")
    print(f"  Output: {output_path}")
    print(f"  Shape: {out_shape}")

    return output_path


def compare_sensors(
    sentinel_ndvi_path: str | Path,
    landsat_ndvi_path: str | Path,
    fields_path: str | Path,
    output_dir: str | Path,
    field_id_column: str = "field_id",
) -> pd.DataFrame:
    """Compare Sentinel-2 and Landsat NDVI for the same fields.

    Args:
        sentinel_ndvi_path: Path to Sentinel-2 NDVI GeoTIFF
        landsat_ndvi_path: Path to Landsat NDVI GeoTIFF
        fields_path: Path to field boundaries GeoJSON
        output_dir: Directory to save comparison outputs
        field_id_column: Column name for field IDs

    Returns:
        DataFrame with comparison statistics per field

    Raises:
        ImportError: If required packages not installed
        FileNotFoundError: If input files not found

    Example:
        >>> comparison = compare_sensors(
        ...     'sentinel_ndvi.tif',
        ...     'landsat_ndvi.tif',
        ...     'fields.geojson',
        ...     'output/comparison'
        ... )
        >>> print(comparison[['field_id', 'correlation', 'mean_diff']])
    """
    if not HAS_DEPS:
        raise ImportError(
            "Required packages not installed. "
            "Run: uv pip install rasterio geopandas pandas matplotlib"
        )

    sentinel_ndvi_path = Path(sentinel_ndvi_path)
    landsat_ndvi_path = Path(landsat_ndvi_path)
    fields_path = Path(fields_path)
    output_dir = Path(output_dir)

    for path in [sentinel_ndvi_path, landsat_ndvi_path, fields_path]:
        if not path.exists():
            raise FileNotFoundError(f"File not found: {path}")

    output_dir.mkdir(parents=True, exist_ok=True)

    # Load fields
    fields = gpd.read_file(fields_path)

    results = []

    with rasterio.open(sentinel_ndvi_path) as sentinel_src:
        with rasterio.open(landsat_ndvi_path) as landsat_src:
            # Reproject fields to Sentinel CRS
            fields_sentinel = fields.to_crs(sentinel_src.crs)
            fields_landsat = fields.to_crs(landsat_src.crs)

            for idx, field in fields_sentinel.iterrows():
                field_id = str(field.get(field_id_column, idx))

                # Extract Sentinel NDVI
                geom_sentinel = [field.geometry.__geo_interface__]
                out_sentinel, _ = mask(sentinel_src, geom_sentinel, crop=True, nodata=np.nan)
                sentinel_data = out_sentinel[0].flatten()
                sentinel_valid = sentinel_data[~np.isnan(sentinel_data)]

                # Extract Landsat NDVI
                field_landsat = fields_landsat.iloc[idx]
                geom_landsat = [field_landsat.geometry.__geo_interface__]
                out_landsat, _ = mask(landsat_src, geom_landsat, crop=True, nodata=np.nan)
                landsat_data = out_landsat[0].flatten()
                landsat_valid = landsat_data[~np.isnan(landsat_data)]

                if len(sentinel_valid) == 0 or len(landsat_valid) == 0:
                    continue

                # Calculate statistics
                sentinel_mean = float(np.mean(sentinel_valid))
                landsat_mean = float(np.mean(landsat_valid))

                # Calculate correlation (downsample to match if needed)
                min_len = min(len(sentinel_valid), len(landsat_valid))
                if min_len > 1:
                    sentinel_sample = np.random.choice(sentinel_valid, min_len, replace=False)
                    landsat_sample = np.random.choice(landsat_valid, min_len, replace=False)
                    correlation = float(np.corrcoef(sentinel_sample, landsat_sample)[0, 1])
                else:
                    correlation = np.nan

                results.append(
                    {
                        "field_id": field_id,
                        "sentinel_mean_ndvi": sentinel_mean,
                        "landsat_mean_ndvi": landsat_mean,
                        "mean_diff": sentinel_mean - landsat_mean,
                        "mean_abs_diff": abs(sentinel_mean - landsat_mean),
                        "correlation": correlation,
                        "sentinel_pixels": len(sentinel_valid),
                        "landsat_pixels": len(landsat_valid),
                    }
                )

    df = pd.DataFrame(results)

    # Save comparison table
    df.to_csv(output_dir / "sensor_comparison.csv", index=False)

    # Create comparison plot
    if len(df) > 0:
        fig, axes = plt.subplots(1, 2, figsize=(14, 6))

        # Scatter plot
        ax = axes[0]
        ax.scatter(df["landsat_mean_ndvi"], df["sentinel_mean_ndvi"], alpha=0.6)
        ax.plot([0, 1], [0, 1], "r--", label="1:1 line")
        ax.set_xlabel("Landsat NDVI")
        ax.set_ylabel("Sentinel-2 NDVI")
        ax.set_title("Sensor Comparison")
        ax.legend()
        ax.grid(True, alpha=0.3)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)

        # Difference histogram
        ax = axes[1]
        ax.hist(df["mean_diff"], bins=20, edgecolor="black", alpha=0.7)
        ax.axvline(0, color="red", linestyle="--", label="No difference")
        ax.set_xlabel("NDVI Difference (Sentinel - Landsat)")
        ax.set_ylabel("Count")
        ax.set_title("Distribution of Differences")
        ax.legend()

        plt.tight_layout()
        plt.savefig(output_dir / "sensor_comparison.png", dpi=300, bbox_inches="tight")
        plt.close()

    return df


def plot_landsat_ndvi_map(
    ndvi_array: np.ndarray,
    title: str = "Landsat NDVI Map",
    cmap: str = "RdYlGn",
    vmin: float = -0.2,
    vmax: float = 1.0,
    save_path: str | Path | None = None,
    figsize: tuple[int, int] = (12, 10),
) -> plt.Figure:
    """Create a static Landsat NDVI map visualization.

    Args:
        ndvi_array: NDVI array to visualize
        title: Map title
        cmap: Colormap name (default: RdYlGn)
        vmin: Minimum value for colormap
        vmax: Maximum value for colormap
        save_path: Optional path to save figure
        figsize: Figure size (width, height)

    Returns:
        Matplotlib figure object

    Example:
        >>> fig = plot_landsat_ndvi_map(ndvi, title="Landsat NDVI", save_path="ndvi.png")
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install matplotlib numpy")

    fig, ax = plt.subplots(figsize=figsize)

    # Mask NaN values for display
    ndvi_display = np.ma.masked_where(np.isnan(ndvi_array), ndvi_array)

    im = ax.imshow(ndvi_display, cmap=cmap, vmin=vmin, vmax=vmax, interpolation="nearest")

    cbar = plt.colorbar(im, ax=ax, shrink=0.8)
    cbar.set_label("NDVI", fontsize=12)

    ax.set_title(title, fontsize=14, fontweight="bold")
    ax.axis("off")

    plt.tight_layout()

    if save_path:
        save_path = Path(save_path)
        save_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(save_path, dpi=300, bbox_inches="tight")
        print(f"Saved map to {save_path}")

    return fig


def extract_landsat_field_stats(
    ndvi_path: str | Path,
    fields_path: str | Path,
    field_id_column: str = "field_id",
) -> pd.DataFrame:
    """Extract per-field NDVI statistics from Landsat imagery.

    Args:
        ndvi_path: Path to Landsat NDVI GeoTIFF
        fields_path: Path to field boundaries GeoJSON
        field_id_column: Column name for field IDs

    Returns:
        DataFrame with per-field NDVI statistics

    Example:
        >>> stats = extract_landsat_field_stats('landsat_ndvi.tif', 'fields.geojson')
        >>> print(stats[['field_id', 'mean_ndvi', 'max_ndvi']])
    """
    if not HAS_DEPS:
        raise ImportError(
            "Required packages not installed. Run: uv pip install rasterio geopandas pandas"
        )

    ndvi_path = Path(ndvi_path)
    fields_path = Path(fields_path)

    # Load data
    fields = gpd.read_file(fields_path)
    results = []

    with rasterio.open(ndvi_path) as src:
        fields_proj = fields.to_crs(src.crs)

        for idx, field in fields_proj.iterrows():
            geom = [field.geometry.__geo_interface__]

            out_image, _ = mask(src, geom, crop=True, nodata=np.nan)
            data = out_image[0]
            valid = data[~np.isnan(data)]

            if valid.size == 0:
                continue

            field_id = str(field.get(field_id_column, idx))
            results.append(
                {
                    "field_id": field_id,
                    "mean_ndvi": float(np.mean(valid)),
                    "min_ndvi": float(np.min(valid)),
                    "max_ndvi": float(np.max(valid)),
                    "std_ndvi": float(np.std(valid)),
                    "median_ndvi": float(np.median(valid)),
                    "pixel_count": int(valid.size),
                }
            )

    return pd.DataFrame(results)


def get_landsat_band_info() -> dict[str, dict]:
    """Get information about Landsat 8/9 bands.

    Returns:
        Dictionary with band information
    """
    return {
        "B1": {"name": "Coastal/Aerosol", "wavelength": 440, "resolution": 30},
        "B2": {"name": "Blue", "wavelength": 480, "resolution": 30},
        "B3": {"name": "Green", "wavelength": 560, "resolution": 30},
        "B4": {"name": "Red", "wavelength": 655, "resolution": 30},
        "B5": {"name": "NIR", "wavelength": 865, "resolution": 30},
        "B6": {"name": "SWIR 1", "wavelength": 1610, "resolution": 30},
        "B7": {"name": "SWIR 2", "wavelength": 2200, "resolution": 30},
        "B8": {"name": "Panchromatic", "wavelength": 590, "resolution": 15},
        "B9": {"name": "Cirrus", "wavelength": 1370, "resolution": 30},
        "B10": {"name": "TIRS 1", "wavelength": 10895, "resolution": 100},
        "B11": {"name": "TIRS 2", "wavelength": 12005, "resolution": 100},
    }


if __name__ == "__main__":
    print("Landsat Imagery Helpers")
    print("=" * 50)
    print("\nAvailable functions:")
    print("  - compute_ndvi_landsat(red, nir)")
    print("  - compute_ndvi_landsat_from_files(red_path, nir_path)")
    print("  - resample_to_match(source_path, target_path, output_path)")
    print("  - compare_sensors(sentinel_path, landsat_path, fields_path, output_dir)")
    print("  - plot_landsat_ndvi_map(ndvi_array)")
    print("  - extract_landsat_field_stats(ndvi_path, fields_path)")
    print("  - get_landsat_band_info()")
