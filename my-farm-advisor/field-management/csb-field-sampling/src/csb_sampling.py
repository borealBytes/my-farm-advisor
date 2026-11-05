"""CSB Field Sampling - Deterministic sampling from USDA NASS Crop Sequence Boundaries.

This module provides functions to sample agricultural field boundaries
deterministically using random seeds, with support for region and crop filtering.
"""

import warnings
from pathlib import Path
from typing import Union

import numpy as np

# Try to import geospatial dependencies
try:
    import geopandas as gpd
    from shapely.geometry import box, shape
    from shapely.ops import unary_union

    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False
    warnings.warn("Geospatial dependencies not installed. Run: uv pip install geopandas shapely")


# Default paths
DEFAULT_FIELDS_PATH = (
    Path(__file__).parent.parent.parent
    / "field-boundaries"
    / "examples"
    / "sample_2_fields.geojson"
)

# Region and crop definitions
REGIONS = {
    "corn_belt": {"states": ["IA", "IL", "IN", "OH", "MO"]},
    "great_plains": {"states": ["NE", "KS", "SD", "ND"]},
    "southeast": {"states": ["GA", "AL", "SC", "NC"]},
}

CROPS = ["corn", "soybeans", "wheat", "cotton"]


def _load_source_fields(path: Path | None = None) -> "gpd.GeoDataFrame":
    """Load source field boundaries from GeoJSON.

    Args:
        path: Path to source GeoJSON. Uses default if None.

    Returns:
        GeoDataFrame with field boundaries

    Raises:
        FileNotFoundError: If source file not found
        ImportError: If geospatial dependencies not installed
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install geopandas shapely")

    source_path = path or DEFAULT_FIELDS_PATH

    if not source_path.exists():
        raise FileNotFoundError(
            f"Source fields not found at {source_path}. Ensure field-boundaries skill is available."
        )

    return gpd.read_file(source_path)


def sample_fields(
    n_fields: int = 5,
    seed: int | None = None,
    regions: list[str] | None = None,
    crops: list[str] | None = None,
    source_path: Path | None = None,
) -> "gpd.GeoDataFrame":
    """Sample field boundaries deterministically.

    This function samples agricultural field boundaries from the
    USDA NASS Crop Sequence Boundaries dataset with deterministic
    random selection using an optional seed.

    Args:
        n_fields: Number of fields to sample (1-100 recommended)
        seed: Random seed for reproducibility
        regions: List of regions to filter ('corn_belt', 'great_plains', 'southeast')
        crops: List of crop types to include ('corn', 'soybeans', 'wheat', 'cotton')
        source_path: Path to source GeoJSON. Uses default if None.

    Returns:
        GeoDataFrame with sampled fields

    Raises:
        ValueError: If n_fields is invalid or filters don't match any fields
        ImportError: If geospatial dependencies not installed

    Example:
        >>> fields = sample_fields(n_fields=10, seed=42, regions=['corn_belt'])
        >>> fields.to_file('output/sampled.geojson')
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install geopandas shapely")

    # Validate inputs
    if n_fields < 1 or n_fields > 1000:
        raise ValueError("n_fields must be between 1 and 1000")

    # Load source fields
    gdf = _load_source_fields(source_path)

    if gdf.empty:
        raise ValueError("No source fields available")

    # Apply region filter
    if regions:
        invalid_regions = set(regions) - set(REGIONS.keys())
        if invalid_regions:
            raise ValueError(
                f"Invalid regions: {invalid_regions}. Valid options: {list(REGIONS.keys())}"
            )
        gdf = gdf[gdf["region"].isin(regions)]

    # Apply crop filter
    if crops:
        invalid_crops = set(crops) - set(CROPS)
        if invalid_crops:
            raise ValueError(f"Invalid crops: {invalid_crops}. Valid options: {CROPS}")
        gdf = gdf[gdf["crop_name"].isin(crops)]

    if gdf.empty:
        raise ValueError("No fields match the specified filters")

    # Deterministic sampling
    if seed is not None:
        np.random.seed(seed)

    n_available = len(gdf)
    n_select = min(n_fields, n_available)

    # Random selection without replacement
    indices = np.random.choice(n_available, size=n_select, replace=False)
    sampled = gdf.iloc[indices].copy()

    # Reset random seed if one was set
    if seed is not None:
        np.random.seed(None)

    return sampled.reset_index(drop=True)


def get_random_fields(
    count: int = 5,
    seed: int | None = None,
    source_path: Path | None = None,
) -> "gpd.GeoDataFrame":
    """Get random fields with optional seed for reproducibility.

    This is a convenience wrapper around sample_fields() for
    simple random selection without filtering.

    Args:
        count: Number of fields to select
        seed: Random seed for reproducibility
        source_path: Path to source GeoJSON. Uses default if None.

    Returns:
        GeoDataFrame with randomly selected fields

    Example:
        >>> fields = get_random_fields(count=5, seed=123)
        >>> print(fields[['field_id', 'crop_name']])
    """
    return sample_fields(n_fields=count, seed=seed, source_path=source_path)


def get_fields_by_aoi(
    aoi_geometry: Union["box", "shape"],
    buffer_km: float = 0,
    source_path: Path | None = None,
) -> "gpd.GeoDataFrame":
    """Get fields within an area of interest.

    Args:
        aoi_geometry: AOI polygon (shapely geometry)
        buffer_km: Optional buffer in kilometers around AOI
        source_path: Path to source GeoJSON. Uses default if None.

    Returns:
        GeoDataFrame with fields intersecting the AOI

    Raises:
        ValueError: If no fields intersect the AOI
        ImportError: If geospatial dependencies not installed

    Example:
        >>> from shapely.geometry import box
        >>> aoi = box(-93.5, 41.5, -93.0, 42.0)
        >>> fields = get_fields_by_aoi(aoi, buffer_km=5)
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install geopandas shapely")

    # Load source fields
    gdf = _load_source_fields(source_path)

    # Apply buffer if specified
    if buffer_km > 0:
        buffer_deg = buffer_km / 111.0  # Approximate conversion
        aoi_geometry = aoi_geometry.buffer(buffer_deg)

    # Spatial intersection
    intersects = gdf.geometry.intersects(aoi_geometry)
    selected = gdf[intersects].copy()

    if selected.empty:
        raise ValueError("No fields intersect the specified AOI")

    return selected.reset_index(drop=True)


def get_fields_by_bbox(
    minx: float,
    miny: float,
    maxx: float,
    maxy: float,
    source_path: Path | None = None,
) -> "gpd.GeoDataFrame":
    """Get fields within a bounding box.

    Args:
        minx: Minimum longitude
        miny: Minimum latitude
        maxx: Maximum longitude
        maxy: Maximum latitude
        source_path: Path to source GeoJSON. Uses default if None.

    Returns:
        GeoDataFrame with fields within the bounding box

    Example:
        >>> fields = get_fields_by_bbox(-93.5, 41.5, -93.0, 42.0)
    """
    aoi = box(minx, miny, maxx, maxy)
    return get_fields_by_aoi(aoi, buffer_km=0, source_path=source_path)


def export_sample(
    fields: "gpd.GeoDataFrame",
    output_path: str | Path,
    include_metadata: bool = True,
) -> Path:
    """Export sampled fields to GeoJSON with optional metadata.

    Args:
        fields: GeoDataFrame with sampled fields
        output_path: Path for output GeoJSON
        include_metadata: Whether to include sampling metadata

    Returns:
        Path to exported file
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install geopandas shapely")

    output_path = Path(output_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Add metadata if requested
    if include_metadata:
        fields = fields.copy()
        fields["sampled_at"] = str(pd.Timestamp.now())
        fields["sample_count"] = len(fields)

    fields.to_file(output_path, driver="GeoJSON")
    print(f"Exported {len(fields)} fields to {output_path}")

    return output_path


def get_sampling_summary(fields: "gpd.GeoDataFrame") -> dict:
    """Get summary statistics for sampled fields.

    Args:
        fields: GeoDataFrame with sampled fields

    Returns:
        Dictionary with summary statistics
    """
    if not HAS_DEPS:
        raise ImportError("Required packages not installed. Run: uv pip install geopandas shapely")

    summary = {
        "total_fields": len(fields),
        "crops": fields["crop_name"].unique().tolist() if "crop_name" in fields.columns else [],
        "regions": fields["region"].unique().tolist() if "region" in fields.columns else [],
    }

    if "area_acres" in fields.columns:
        summary["total_area_acres"] = float(fields["area_acres"].sum())
        summary["avg_area_acres"] = float(fields["area_acres"].mean())
        summary["min_area_acres"] = float(fields["area_acres"].min())
        summary["max_area_acres"] = float(fields["area_acres"].max())

    return summary


# Import pandas for timestamp
import pandas as pd

if __name__ == "__main__":
    # Example usage
    print("CSB Field Sampling - Example Usage")
    print("=" * 50)

    # Sample 5 fields deterministically
    print("\n1. Sampling 5 fields with seed=42:")
    try:
        fields = sample_fields(n_fields=5, seed=42)
        print(f"   Sampled {len(fields)} fields")
        print(fields[["field_id", "crop_name", "area_acres"]])
    except Exception as e:
        print(f"   Error: {e}")

    # Get random fields
    print("\n2. Getting 3 random fields:")
    try:
        random_fields = get_random_fields(count=3, seed=123)
        print(f"   Selected {len(random_fields)} fields")
    except Exception as e:
        print(f"   Error: {e}")

    # Get fields by AOI
    print("\n3. Getting fields by bounding box:")
    try:
        bbox_fields = get_fields_by_bbox(-94.0, 41.0, -92.0, 43.0)
        print(f"   Found {len(bbox_fields)} fields in AOI")
    except Exception as e:
        print(f"   Error: {e}")

    print("\nDone!")
