from __future__ import annotations

from pathlib import Path

import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

ACRES_PER_SQM = 0.0002471053814671653


def _validate_projected(gdf: gpd.GeoDataFrame) -> None:
    if gdf.crs is None:
        raise ValueError("GeoDataFrame must have a CRS before headlands operations")
    if gdf.crs.is_geographic:
        raise ValueError("Headlands operations require a projected CRS with meter units")


def create_field_interior(field_gdf: gpd.GeoDataFrame, width_m: float = 9.0) -> gpd.GeoDataFrame:
    _validate_projected(field_gdf)
    interiors = []
    for geom in field_gdf.geometry:
        inner = geom.buffer(-width_m)
        if not inner.is_empty:
            interiors.append(inner)
    return gpd.GeoDataFrame(geometry=interiors, crs=field_gdf.crs)


def create_headlands_ring(field_gdf: gpd.GeoDataFrame, width_m: float = 9.0) -> gpd.GeoDataFrame:
    _validate_projected(field_gdf)
    rings = []
    for geom in field_gdf.geometry:
        inner = geom.buffer(-width_m)
        rings.append(geom if inner.is_empty else geom.difference(inner))
    valid = [geom for geom in rings if not geom.is_empty]
    return gpd.GeoDataFrame(geometry=valid, crs=field_gdf.crs)


def split_headlands_and_interior(
    field_gdf: gpd.GeoDataFrame, width_m: float = 9.0
) -> tuple[gpd.GeoDataFrame, gpd.GeoDataFrame]:
    ring = create_headlands_ring(field_gdf, width_m=width_m)
    interior = create_field_interior(field_gdf, width_m=width_m)
    return ring, interior


def summarize_headlands(field_gdf: gpd.GeoDataFrame, ring_gdf: gpd.GeoDataFrame) -> pd.DataFrame:
    _validate_projected(field_gdf)
    field_area_sqm = float(field_gdf.geometry.area.sum())
    ring_area_sqm = float(ring_gdf.geometry.area.sum()) if not ring_gdf.empty else 0.0
    pct = (ring_area_sqm / field_area_sqm * 100.0) if field_area_sqm else 0.0
    return pd.DataFrame(
        [
            {
                "field_area_sqm": field_area_sqm,
                "field_area_acres": field_area_sqm * ACRES_PER_SQM,
                "headlands_area_sqm": ring_area_sqm,
                "headlands_area_acres": ring_area_sqm * ACRES_PER_SQM,
                "headlands_pct": pct,
            }
        ]
    )


def flag_points_in_headlands(
    points_gdf: gpd.GeoDataFrame, ring_gdf: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    if points_gdf.crs != ring_gdf.crs:
        points_gdf = points_gdf.to_crs(ring_gdf.crs)
    result = points_gdf.copy()
    union = ring_gdf.unary_union if not ring_gdf.empty else None
    result["in_headlands"] = result.geometry.intersects(union) if union is not None else False
    return result


def clip_polygons_to_headlands(
    polygons_gdf: gpd.GeoDataFrame, ring_gdf: gpd.GeoDataFrame
) -> gpd.GeoDataFrame:
    if polygons_gdf.empty or ring_gdf.empty:
        return gpd.GeoDataFrame(columns=polygons_gdf.columns, geometry=[], crs=polygons_gdf.crs)
    if polygons_gdf.crs != ring_gdf.crs:
        polygons_gdf = polygons_gdf.to_crs(ring_gdf.crs)
    return gpd.overlay(polygons_gdf, ring_gdf, how="intersection")


def plot_headlands_map(
    field_gdf: gpd.GeoDataFrame,
    ring_gdf: gpd.GeoDataFrame,
    interior_gdf: gpd.GeoDataFrame | None = None,
    title: str = "Headlands ring overview",
    save_path: str | Path | None = None,
) -> plt.Figure:
    fig, ax = plt.subplots(figsize=(8, 8))
    field_gdf.boundary.plot(ax=ax, color="darkgreen", linewidth=2, label="Field boundary")
    if interior_gdf is not None and not interior_gdf.empty:
        interior_gdf.plot(ax=ax, color="#d9f99d", alpha=0.6, edgecolor="none", label="Interior")
    if not ring_gdf.empty:
        ring_gdf.plot(ax=ax, color="#fdba74", alpha=0.7, edgecolor="#c2410c", label="Headlands")
    ax.set_title(title, fontsize=13, fontweight="bold")
    ax.set_axis_off()
    ax.legend(loc="lower right")
    plt.tight_layout()
    if save_path is not None:
        save_path = Path(save_path)
        save_path.parent.mkdir(parents=True, exist_ok=True)
        plt.savefig(save_path, dpi=200, bbox_inches="tight")
    return fig
