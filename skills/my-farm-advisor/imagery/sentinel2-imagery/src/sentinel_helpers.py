"""Sentinel-2 Imagery Helpers - NDVI computation and visualization utilities.

This module provides helper functions for computing NDVI, creating static maps,
and extracting per-field statistics from Sentinel-2 imagery.
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
    from rasterio.plot import show

    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False
    warnings.warn(
        "Geospatial dependencies not installed. "
        "Run: uv pip install rasterio geopandas matplotlib pandas"
    )


def compute_ndvi(red_band: np.ndarray, nir_band: np.ndarray) -> np.ndarray:
    """Compute NDVI from red and NIR bands.

    NDVI = (NIR - Red) / (NIR + Red)

    Args:
        red_band: Red band array (B04)
        nir_band: NIR band array (B08)

    Returns:
        NDVI array with values in range [-1, 1]

    Example:
        >>> ndvi = compute_ndvi(red_data, nir_data)
        >>> print(f"Mean NDVI: {np.nanmean(ndvi):.3f}")
    """
    # Ensure float32 for computation
    red = red_band.astype("float32")
    nir = nir_band.astype("float32")

    # Compute NDVI with division by zero protection
    denominator = nir + red
    ndvi = np.where(denominator != 0, (nir - red) / denominator, np.nan).astype("float32")

    # Clip to valid range
    ndvi = np.clip(ndvi, -1.0, 1.0)

    return ndvi


def compute_ndvi_from_files(
    red_path: str | Path,
    nir_path: str | Path,
    output_path: str | Path | None = None,
) -> tuple[np.ndarray, dict]:
    """Compute NDVI from red and NIR band files.

    Args:
        red_path: Path to red band (B04) GeoTIFF
        nir_path: Path to NIR band (B08) GeoTIFF
        output_path: Optional path to save NDVI GeoTIFF

    Returns:
        Tuple of (NDVI array, raster profile)

    Raises:
        ImportError: If rasterio not installed
        FileNotFoundError: If input files not found

    Example:
        >>> ndvi, profile = compute_ndvi_from_files(
        ...     'B04.tif', 'B08.tif', 'output/ndvi.tif'
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

    with rasterio.open(nir_path) as nir_src:
        nir = nir_src.read(1).astype("float32")

    ndvi = compute_ndvi(red, nir)

    # Update profile for output
    profile.update(dtype="float32", count=1, nodata=np.nan, compress="lzw")

    # Save if output path provided
    if output_path:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

        with rasterio.open(output_path, "w", **profile) as dst:
            dst.write(ndvi, 1)
        print(f"Saved NDVI to {output_path}")

    return ndvi, profile


def plot_ndvi_map(
    ndvi_array: np.ndarray,
    title: str = "NDVI Map",
    cmap: str = "RdYlGn",
    vmin: float = -0.2,
    vmax: float = 1.0,
    save_path: str | Path | None = None,
    figsize: tuple[int, int] = (12, 10),
    add_colorbar: bool = True,
) -> plt.Figure:
    """Create a static NDVI map visualization.

    Args:
        ndvi_array: NDVI array to visualize
        title: Map title
        cmap: Colormap name (default: RdYlGn)
        vmin: Minimum value for colormap
        vmax: Maximum value for colormap
        save_path: Optional path to save figure
        figsize: Figure size (width, height)
        add_colorbar: Whether to add colorbar

    Returns:
        Matplotlib figure object

    Example:
        >>> fig = plot_ndvi_map(ndvi, title="Field NDVI", save_path="ndvi.png")
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install matplotlib numpy")

    fig, ax = plt.subplots(figsize=figsize)

    # Mask NaN values for display
    ndvi_display = np.ma.masked_where(np.isnan(ndvi_array), ndvi_array)

    im = ax.imshow(ndvi_display, cmap=cmap, vmin=vmin, vmax=vmax, interpolation="nearest")

    if add_colorbar:
        cbar = plt.colorbar(im, ax=ax, shrink=0.8)
        cbar.set_label("NDVI", fontsize=12)
        cbar.ax.tick_params(labelsize=10)

    ax.set_title(title, fontsize=14, fontweight="bold")
    ax.axis("off")

    plt.tight_layout()

    if save_path:
        save_path = Path(save_path)
        save_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(save_path, dpi=300, bbox_inches="tight")
        print(f"Saved map to {save_path}")

    return fig


def plot_ndvi_with_fields(
    ndvi_path: str | Path,
    fields_path: str | Path,
    title: str = "NDVI with Field Boundaries",
    save_path: str | Path | None = None,
    figsize: tuple[int, int] = (14, 12),
) -> plt.Figure:
    """Plot NDVI raster with field boundaries overlaid.

    Args:
        ndvi_path: Path to NDVI GeoTIFF
        fields_path: Path to field boundaries GeoJSON
        title: Map title
        save_path: Optional path to save figure
        figsize: Figure size

    Returns:
        Matplotlib figure object

    Example:
        >>> fig = plot_ndvi_with_fields(
        ...     'ndvi.tif', 'fields.geojson', save_path='ndvi_fields.png'
        ... )
    """
    if not HAS_DEPS:
        raise ImportError(
            "Required packages not installed. Run: uv pip install rasterio geopandas matplotlib"
        )

    # Load NDVI
    with rasterio.open(ndvi_path) as src:
        ndvi = src.read(1)
        ndvi_meta = src.meta

    # Load fields
    fields = gpd.read_file(fields_path)

    # Reproject fields to NDVI CRS if needed
    if fields.crs != ndvi_meta["crs"]:
        fields = fields.to_crs(ndvi_meta["crs"])

    # Create figure
    fig, ax = plt.subplots(figsize=figsize)

    # Plot NDVI
    ndvi_display = np.ma.masked_where(np.isnan(ndvi), ndvi)
    im = ax.imshow(ndvi_display, cmap="RdYlGn", vmin=-0.2, vmax=1.0, interpolation="nearest")

    # Plot field boundaries
    fields.boundary.plot(ax=ax, color="darkblue", linewidth=2, alpha=0.8)

    # Add field labels
    for idx, row in fields.iterrows():
        centroid = row.geometry.centroid
        field_id = str(row.get("field_id", idx))[-6:]  # Last 6 chars
        ax.annotate(
            field_id,
            (centroid.x, centroid.y),
            fontsize=8,
            ha="center",
            color="darkblue",
            fontweight="bold",
        )

    # Colorbar
    cbar = plt.colorbar(im, ax=ax, shrink=0.6)
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


def extract_field_ndvi(
    ndvi_path: str | Path,
    fields_path: str | Path,
    field_id_column: str = "field_id",
) -> pd.DataFrame:
    """Extract per-field NDVI statistics.

    Args:
        ndvi_path: Path to NDVI GeoTIFF
        fields_path: Path to field boundaries GeoJSON
        field_id_column: Column name for field IDs

    Returns:
        DataFrame with per-field NDVI statistics

    Raises:
        ImportError: If required packages not installed
        FileNotFoundError: If input files not found

    Example:
        >>> stats = extract_field_ndvi('ndvi.tif', 'fields.geojson')
        >>> print(stats[['field_id', 'mean_ndvi', 'max_ndvi']])
    """
    if not HAS_DEPS:
        raise ImportError(
            "Required packages not installed. Run: uv pip install rasterio geopandas pandas"
        )

    ndvi_path = Path(ndvi_path)
    fields_path = Path(fields_path)

    if not ndvi_path.exists():
        raise FileNotFoundError(f"NDVI file not found: {ndvi_path}")
    if not fields_path.exists():
        raise FileNotFoundError(f"Fields file not found: {fields_path}")

    # Load data
    fields = gpd.read_file(fields_path)

    results = []

    with rasterio.open(ndvi_path) as src:
        # Reproject fields to raster CRS
        fields_proj = fields.to_crs(src.crs)

        for idx, field in fields_proj.iterrows():
            geom = [field.geometry.__geo_interface__]

            # Mask raster to field
            out_image, _ = mask(src, geom, crop=True, nodata=np.nan)
            data = out_image[0]

            # Get valid pixels
            valid = data[~np.isnan(data)]

            if valid.size == 0:
                continue

            # Calculate statistics
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


def create_ndvi_timeseries(
    ndvi_paths: list[str | Path],
    dates: list[str],
    fields_path: str | Path,
    field_id: str | None = None,
    save_path: str | Path | None = None,
) -> pd.DataFrame:
    """Create NDVI time series for one or all fields.

    Args:
        ndvi_paths: List of NDVI file paths
        dates: List of dates corresponding to files
        fields_path: Path to field boundaries
        field_id: Specific field ID (None for all fields)
        save_path: Optional path to save plot

    Returns:
        DataFrame with time series data

    Example:
        >>> df = create_ndvi_timeseries(
        ...     ['ndvi_jun.tif', 'ndvi_jul.tif'],
        ...     ['2024-06-15', '2024-07-15'],
        ...     'fields.geojson'
        ... )
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install pandas matplotlib")

    all_stats = []

    for ndvi_path, date in zip(ndvi_paths, dates):
        stats = extract_field_ndvi(ndvi_path, fields_path)
        stats["date"] = date
        all_stats.append(stats)

    df = pd.concat(all_stats, ignore_index=True)

    # Filter to specific field if requested
    if field_id:
        df = df[df["field_id"] == field_id]

    # Plot if save path provided
    if save_path:
        fig, ax = plt.subplots(figsize=(12, 6))

        for fid in df["field_id"].unique():
            field_data = df[df["field_id"] == fid]
            ax.plot(
                field_data["date"], field_data["mean_ndvi"], marker="o", label=f"Field {fid[-6:]}"
            )

        ax.set_xlabel("Date", fontsize=12)
        ax.set_ylabel("Mean NDVI", fontsize=12)
        ax.set_title("NDVI Time Series", fontsize=14, fontweight="bold")
        ax.legend()
        ax.grid(True, alpha=0.3)
        ax.set_ylim(0, 1)

        plt.tight_layout()
        plt.savefig(save_path, dpi=300, bbox_inches="tight")
        print(f"Saved time series to {save_path}")

    return df


def classify_ndvi(ndvi_array: np.ndarray) -> np.ndarray:
    """Classify NDVI values into vegetation categories.

    Categories:
    - Water/Shadow: < 0
    - Bare Soil: 0 - 0.2
    - Sparse Vegetation: 0.2 - 0.4
    - Moderate Vegetation: 0.4 - 0.6
    - Healthy Vegetation: 0.6 - 0.8
    - Very Healthy: > 0.8

    Args:
        ndvi_array: NDVI array

    Returns:
        Classified array with category indices
    """
    classified = np.zeros_like(ndvi_array, dtype=np.int32)

    classified[(ndvi_array >= 0) & (ndvi_array < 0.2)] = 1  # Bare Soil
    classified[(ndvi_array >= 0.2) & (ndvi_array < 0.4)] = 2  # Sparse
    classified[(ndvi_array >= 0.4) & (ndvi_array < 0.6)] = 3  # Moderate
    classified[(ndvi_array >= 0.6) & (ndvi_array < 0.8)] = 4  # Healthy
    classified[ndvi_array >= 0.8] = 5  # Very Healthy

    return classified


def get_ndvi_summary(ndvi_array: np.ndarray) -> dict[str, float]:
    """Get summary statistics for NDVI array.

    Args:
        ndvi_array: NDVI array

    Returns:
        Dictionary with summary statistics
    """
    valid = ndvi_array[~np.isnan(ndvi_array)]

    if valid.size == 0:
        return {
            "mean": np.nan,
            "min": np.nan,
            "max": np.nan,
            "std": np.nan,
            "median": np.nan,
            "valid_pixels": 0,
        }

    return {
        "mean": float(np.mean(valid)),
        "min": float(np.min(valid)),
        "max": float(np.max(valid)),
        "std": float(np.std(valid)),
        "median": float(np.median(valid)),
        "valid_pixels": int(valid.size),
    }


if __name__ == "__main__":
    print("Sentinel-2 Imagery Helpers")
    print("=" * 50)
    print("\nAvailable functions:")
    print("  - compute_ndvi(red, nir)")
    print("  - compute_ndvi_from_files(red_path, nir_path)")
    print("  - plot_ndvi_map(ndvi_array)")
    print("  - plot_ndvi_with_fields(ndvi_path, fields_path)")
    print("  - extract_field_ndvi(ndvi_path, fields_path)")
    print("  - create_ndvi_timeseries(ndvi_paths, dates, fields_path)")
    print("  - classify_ndvi(ndvi_array)")
    print("  - get_ndvi_summary(ndvi_array)")
