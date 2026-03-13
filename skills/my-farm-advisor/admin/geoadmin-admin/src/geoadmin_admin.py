from __future__ import annotations

import json
import sys
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import cast

import geopandas as gpd
import pandas as pd
import requests

REPO_ROOT = Path(__file__).resolve().parents[4]
DATA_SCRIPTS_ROOT = REPO_ROOT / "data" / "scripts"
if str(DATA_SCRIPTS_ROOT) not in sys.path:
    sys.path.insert(0, str(DATA_SCRIPTS_ROOT))

GEOADMIN_LEVELS = ("l0_countries", "l1_states", "l2_counties")


def _shared_root() -> Path:
    return REPO_ROOT / "data" / "shared"


def _geoadmin_root() -> Path:
    return _shared_root() / "geoadmin"


def _geoadmin_level_root(level_slug: str) -> Path:
    return _geoadmin_root() / level_slug


def _repo_relative(path: Path) -> str:
    return str(path.resolve().relative_to(REPO_ROOT))


@dataclass(frozen=True, slots=True)
class GeoadminSource:
    level_slug: str
    source_name: str
    source_url: str
    archive_name: str
    output_geojson: str
    output_parquet: str
    vintage: str


def geoadmin_level_roots() -> dict[str, Path]:
    return {
        "l0_countries": _geoadmin_level_root("l0_countries"),
        "l1_states": _geoadmin_level_root("l1_states"),
        "l2_counties": _geoadmin_level_root("l2_counties"),
    }


def build_source_catalog(census_year: int) -> dict[str, GeoadminSource]:
    return {
        "l0_countries": GeoadminSource(
            level_slug="l0_countries",
            source_name="natural-earth",
            source_url="https://naciscdn.org/naturalearth/10m/cultural/ne_10m_admin_0_countries.zip",
            archive_name="ne_10m_admin_0_countries.zip",
            output_geojson="countries.geojson",
            output_parquet="countries.parquet",
            vintage="natural-earth-10m",
        ),
        "l1_states": GeoadminSource(
            level_slug="l1_states",
            source_name="census-tiger-line",
            source_url=f"https://www2.census.gov/geo/tiger/TIGER{census_year}/STATE/tl_{census_year}_us_state.zip",
            archive_name=f"tl_{census_year}_us_state.zip",
            output_geojson="states_usa.geojson",
            output_parquet="states_usa.parquet",
            vintage=str(census_year),
        ),
        "l2_counties": GeoadminSource(
            level_slug="l2_counties",
            source_name="census-tiger-line",
            source_url=f"https://www2.census.gov/geo/tiger/TIGER{census_year}/COUNTY/tl_{census_year}_us_county.zip",
            archive_name=f"tl_{census_year}_us_county.zip",
            output_geojson="counties_usa.geojson",
            output_parquet="counties_usa.parquet",
            vintage=str(census_year),
        ),
    }


def download_source_archive(source: GeoadminSource, *, force: bool = False) -> Path:
    target = _geoadmin_level_root(source.level_slug) / "raw" / source.archive_name
    if target.exists() and not force:
        return target
    target.parent.mkdir(parents=True, exist_ok=True)
    response = requests.get(source.source_url, timeout=180)
    response.raise_for_status()
    target.write_bytes(response.content)
    return target


def _keep_columns(frame: gpd.GeoDataFrame, columns: list[str]) -> gpd.GeoDataFrame:
    keep = [column for column in columns if column in frame.columns]
    keep.append("geometry")
    filtered = gpd.GeoDataFrame(frame.loc[:, keep].copy(), geometry="geometry", crs=frame.crs)
    return cast(gpd.GeoDataFrame, filtered)


def standardize_geoadmin_layer(source: GeoadminSource, archive_path: Path) -> gpd.GeoDataFrame:
    frame = gpd.read_file(archive_path)
    frame = frame.to_crs("EPSG:4326")
    if source.level_slug == "l0_countries":
        frame = _keep_columns(frame, ["ADM0_A3", "ISO_A3", "NAME", "CONTINENT", "REGION_UN"])
        frame = gpd.GeoDataFrame(
            frame.rename(
                columns={
                    "ADM0_A3": "adm0_a3",
                    "ISO_A3": "iso_a3",
                    "NAME": "name",
                    "CONTINENT": "continent",
                    "REGION_UN": "region_un",
                }
            ),
            geometry="geometry",
            crs="EPSG:4326",
        )
    elif source.level_slug == "l1_states":
        frame = _keep_columns(frame, ["STATEFP", "STUSPS", "NAME", "REGION", "DIVISION"])
        frame = gpd.GeoDataFrame(
            frame.rename(
                columns={
                    "STATEFP": "state_fips",
                    "STUSPS": "state_code",
                    "NAME": "state_name",
                    "REGION": "region_code",
                    "DIVISION": "division_code",
                }
            ),
            geometry="geometry",
            crs="EPSG:4326",
        )
    else:
        frame = _keep_columns(frame, ["GEOID", "STATEFP", "COUNTYFP", "NAME", "NAMELSAD"])
        frame = gpd.GeoDataFrame(
            frame.rename(
                columns={
                    "GEOID": "fips",
                    "STATEFP": "state_fips",
                    "COUNTYFP": "county_fips",
                    "NAME": "county_name",
                    "NAMELSAD": "county_name_full",
                }
            ),
            geometry="geometry",
            crs="EPSG:4326",
        )
    frame["source_name"] = source.source_name
    frame["source_vintage"] = source.vintage
    return cast(gpd.GeoDataFrame, frame)


def _county_lookup(frame: gpd.GeoDataFrame) -> pd.DataFrame:
    projected = frame.to_crs("EPSG:5070")
    centroids = gpd.GeoSeries(projected.geometry.centroid, crs="EPSG:5070").to_crs("EPSG:4326")
    return pd.DataFrame(
        {
            "fips": frame["fips"],
            "state_fips": frame["state_fips"],
            "county_fips": frame["county_fips"],
            "county_name": frame["county_name"],
            "county_name_full": frame["county_name_full"],
            "centroid_lon": centroids.x,
            "centroid_lat": centroids.y,
        }
    )


def assign_fields_to_counties(
    fields: gpd.GeoDataFrame,
    counties: gpd.GeoDataFrame,
    *,
    field_slug_map: dict[str, str] | None = None,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    field_slug_map = field_slug_map or {}
    fields_proj = fields.to_crs("EPSG:5070")
    counties_proj = counties.to_crs("EPSG:5070")
    mapping_rows: list[dict[str, object]] = []
    ambiguity_rows: list[dict[str, object]] = []

    for _, field_row in fields_proj.iterrows():
        field_id = str(field_row.get("field_id", ""))
        field_slug = field_slug_map.get(field_id, "")
        geometry = field_row.geometry
        centroid = geometry.centroid

        containing = counties_proj[counties_proj.contains(centroid)].copy()
        intersecting = counties_proj[counties_proj.intersects(geometry)].copy()
        assigned = containing.iloc[0] if len(containing) == 1 else None
        assignment_method = "centroid"
        ambiguity_reason = ""

        if assigned is None and not intersecting.empty:
            intersecting["overlap_area_m2"] = intersecting.geometry.intersection(geometry).area
            overlap_areas = pd.Series(intersecting["overlap_area_m2"], dtype="float64")
            overlap_index = overlap_areas.index[int(overlap_areas.to_numpy().argmax())]
            assigned = intersecting.loc[overlap_index]
            assignment_method = "largest_overlap"
        elif assigned is None:
            ambiguity_reason = "no_county_match"

        overlap_count = int(len(intersecting))
        ambiguity_flag = overlap_count > 1 or assigned is None
        if overlap_count > 1 and not ambiguity_reason:
            ambiguity_reason = "multi_county_intersection"

        mapping_row = {
            "field_id": field_id,
            "field_slug": field_slug,
            "assignment_method": assignment_method,
            "ambiguity_flag": ambiguity_flag,
            "ambiguity_reason": ambiguity_reason,
            "county_overlap_count": overlap_count,
        }
        if assigned is not None:
            mapping_row.update(
                {
                    "fips": str(assigned.get("fips", "")),
                    "state_fips": str(assigned.get("state_fips", "")),
                    "county_fips": str(assigned.get("county_fips", "")),
                    "county_name": str(assigned.get("county_name", "")),
                    "county_name_full": str(assigned.get("county_name_full", "")),
                }
            )
        else:
            mapping_row.update(
                {
                    "fips": "",
                    "state_fips": "",
                    "county_fips": "",
                    "county_name": "",
                    "county_name_full": "",
                }
            )
        mapping_rows.append(mapping_row)

        if ambiguity_flag:
            ambiguity_rows.append(mapping_row.copy())

    return pd.DataFrame(mapping_rows), pd.DataFrame(ambiguity_rows)


def write_standardized_outputs(
    source: GeoadminSource,
    frame: gpd.GeoDataFrame,
    *,
    write_lookup: bool = True,
) -> dict[str, Path]:
    level_root = geoadmin_level_roots()[source.level_slug]
    level_root.mkdir(parents=True, exist_ok=True)
    geojson_path = level_root / source.output_geojson
    parquet_path = level_root / source.output_parquet
    frame.to_file(geojson_path, driver="GeoJSON")
    frame.to_parquet(parquet_path, index=False)
    metadata_path = _geoadmin_level_root(source.level_slug) / "metadata.json"
    metadata_path.write_text(
        json.dumps(
            {
                **asdict(source),
                "feature_count": int(len(frame)),
                "columns": [column for column in frame.columns if column != "geometry"],
                "output_geojson": _repo_relative(geojson_path),
                "output_parquet": _repo_relative(parquet_path),
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    outputs = {"geojson": geojson_path, "parquet": parquet_path, "metadata": metadata_path}
    if source.level_slug == "l2_counties" and write_lookup:
        lookup_path = level_root / "fips_lookup.parquet"
        _county_lookup(frame).to_parquet(lookup_path, index=False)
        outputs["lookup"] = lookup_path
        metadata = json.loads(metadata_path.read_text(encoding="utf-8"))
        metadata["lookup_parquet"] = _repo_relative(lookup_path)
        metadata_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
    return outputs
