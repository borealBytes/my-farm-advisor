"""Helpers for loading local skill modules and canonical data-tree scaffolding."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = REPO_ROOT / "data"
DEFAULT_GROWER = os.environ.get("AG_GROWER_SLUG", "iowa-demo-grower")
DEFAULT_FARM = os.environ.get("AG_FARM_SLUG", "iowa-demo-farm")
DEFAULT_INVENTORY = Path(
    os.environ.get("AG_INVENTORY_CSV", ".sisyphus/evidence/task-3-field-inventory.csv")
)


def ensure_skill_path(skill_name: str) -> Path:
    skill_path = REPO_ROOT / ".opencode" / "skills" / skill_name / "src"
    resolved = str(skill_path)
    if resolved not in sys.path:
        sys.path.insert(0, resolved)
    return skill_path


def farm_root(grower_slug: str = DEFAULT_GROWER, farm_slug: str = DEFAULT_FARM) -> Path:
    return DATA_ROOT / "growers" / grower_slug / "farms" / farm_slug


def fields_root(grower_slug: str = DEFAULT_GROWER, farm_slug: str = DEFAULT_FARM) -> Path:
    return farm_root(grower_slug, farm_slug) / "fields"


def field_slugs_from_inventory(inventory_path: Path | None = None) -> list[str]:
    inventory = inventory_path or DEFAULT_INVENTORY
    inventory = inventory if inventory.is_absolute() else REPO_ROOT / inventory
    if not inventory.exists():
        return []
    rows = inventory.read_text(encoding="utf-8").splitlines()
    slugs: list[str] = []
    for line in rows[1:]:
        line = line.strip()
        if not line:
            continue
        parts = line.split(",")
        if len(parts) != 2:
            continue
        slugs.append(parts[1].strip())
    return slugs


def field_slug_map_from_inventory(inventory_path: Path | None = None) -> dict[str, str]:
    inventory = inventory_path or DEFAULT_INVENTORY
    inventory = inventory if inventory.is_absolute() else REPO_ROOT / inventory
    if not inventory.exists():
        return {}
    rows = inventory.read_text(encoding="utf-8").splitlines()
    mapping: dict[str, str] = {}
    for line in rows[1:]:
        line = line.strip()
        if not line:
            continue
        parts = line.split(",")
        if len(parts) != 2:
            continue
        mapping[parts[0].strip()] = parts[1].strip()
    return mapping


def _write_json(path: Path, payload: dict, *, overwrite: bool = True) -> None:
    if path.exists() and not overwrite:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _write_text(path: Path, text: str, *, overwrite: bool = True) -> None:
    if path.exists() and not overwrite:
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def ensure_canonical_field_artifacts(
    field_slug: str, grower_slug: str = DEFAULT_GROWER, farm_slug: str = DEFAULT_FARM
) -> None:
    base = fields_root(grower_slug, farm_slug) / field_slug
    for rel in (
        "boundary",
        "soil",
        "weather",
        "satellite/landsat",
        "satellite/sentinel",
        "derived/tables",
        "derived/features",
        "derived/summaries",
        "derived/reports",
        "manifests",
        "logs",
    ):
        (base / rel).mkdir(parents=True, exist_ok=True)

    field_geojson = {
        "type": "FeatureCollection",
        "features": [],
    }
    _write_json(
        base / "field.json",
        {
            "grower_slug": grower_slug,
            "farm_slug": farm_slug,
            "field_slug": field_slug,
            "display_name": field_slug,
            "field_id": field_slug.replace("-", "_").upper(),
            "boundary_file": "boundary/field_boundary.geojson",
            "soil_file": "soil/ssurgo_soil_types.geojson",
            "weather_file": "weather/daily_weather.csv",
            "satellite_dir": "satellite/",
            "notes": "Canonical field metadata",
        },
        overwrite=False,
    )
    _write_json(base / "boundary" / "field_boundary.geojson", field_geojson, overwrite=False)
    _write_json(base / "soil" / "ssurgo_soil_types.geojson", field_geojson, overwrite=False)
    _write_text(
        base / "weather" / "daily_weather.csv",
        "field_id,date,T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN,RH2M,WS10M\n",
        overwrite=False,
    )

    _write_json(
        base / "soil" / "metadata.json",
        {
            "dataset_name": "ssurgo_soil_types",
            "source": "usda-sda",
            "spatial_scope": "field",
            "grower_slug": grower_slug,
            "farm_slug": farm_slug,
            "field_slug": field_slug,
            "format": "geojson",
            "crs": "EPSG:4326",
        },
        overwrite=False,
    )
    _write_json(
        base / "weather" / "metadata.json",
        {
            "dataset_name": "daily_weather",
            "source": "nasa-power",
            "spatial_scope": "field",
            "grower_slug": grower_slug,
            "farm_slug": farm_slug,
            "field_slug": field_slug,
            "format": "csv",
            "crs": "EPSG:4326",
        },
        overwrite=False,
    )

    _write_json(
        base / "satellite" / "landsat" / "manifest.json",
        {
            "dataset_name": "landsat",
            "field_slug": field_slug,
            "years": [],
        },
        overwrite=False,
    )
    _write_json(
        base / "satellite" / "sentinel" / "manifest.json",
        {
            "dataset_name": "sentinel",
            "field_slug": field_slug,
            "years": [],
        },
        overwrite=False,
    )
    _write_text(base / "logs" / "pipeline_runs.jsonl", "", overwrite=False)


def ensure_canonical_data_tree(
    grower_slug: str = DEFAULT_GROWER,
    farm_slug: str = DEFAULT_FARM,
    farm_name: str = "Iowa Demo Farm",
    inventory_path: Path | None = None,
) -> list[str]:
    (DATA_ROOT / "shared" / "weather").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "geoadmin" / "l0_countries" / "raw").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "geoadmin" / "l1_states" / "raw").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "geoadmin" / "l2_counties" / "raw").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "corn_maturity" / "tables").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "corn_maturity" / "reports").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "corn_maturity" / "metadata").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "corn_maturity" / "manifests").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "corn_maturity" / "logs").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "soybean_maturity" / "tables").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "soybean_maturity" / "reports").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "soybean_maturity" / "metadata").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "soybean_maturity" / "manifests").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "soybean_maturity" / "logs").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "cdl" / "metadata").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "cdl" / "rasters").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "cdl" / "derived").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "cdl" / "derived" / "tables").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "cdl" / "derived" / "reports").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "cdl" / "manifests").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "cdl" / "logs").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "reference" / "crop_codes").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "reference" / "units").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "reference" / "schemas").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "manifests").mkdir(parents=True, exist_ok=True)
    (DATA_ROOT / "shared" / "logs").mkdir(parents=True, exist_ok=True)
    _write_json(
        DATA_ROOT / "shared" / "geoadmin" / "l0_countries" / "metadata.json",
        {
            "dataset_name": "geoadmin_countries",
            "source": "natural-earth",
            "spatial_scope": "global",
            "format": "geojson-or-parquet",
            "notes": "Shared Level 0 admin root for annual maturity and geoadmin workflows",
        },
        overwrite=False,
    )
    _write_json(
        DATA_ROOT / "shared" / "geoadmin" / "l1_states" / "metadata.json",
        {
            "dataset_name": "geoadmin_states",
            "source": "census-tiger-line",
            "spatial_scope": "usa-state",
            "format": "geojson-or-parquet",
            "notes": "Shared Level 1 admin root for annual maturity and geoadmin workflows",
        },
        overwrite=False,
    )
    _write_json(
        DATA_ROOT / "shared" / "geoadmin" / "l2_counties" / "metadata.json",
        {
            "dataset_name": "geoadmin_counties",
            "source": "census-tiger-line",
            "spatial_scope": "usa-county",
            "format": "geojson-or-parquet",
            "notes": "Shared county and FIPS root for annual maturity and geoadmin workflows",
        },
        overwrite=False,
    )
    _write_json(
        DATA_ROOT / "shared" / "corn_maturity" / "metadata" / "dataset.json",
        {
            "dataset_name": "corn_maturity",
            "status": "planned",
            "notes": "Annual heuristic corn RM and GDD outputs by FIPS live here",
        },
        overwrite=False,
    )
    _write_json(
        DATA_ROOT / "shared" / "soybean_maturity" / "metadata" / "dataset.json",
        {
            "dataset_name": "soybean_maturity",
            "status": "planned",
            "notes": "Annual heuristic soybean maturity-group outputs by FIPS live here",
        },
        overwrite=False,
    )

    grower = DATA_ROOT / "growers" / grower_slug
    grower.mkdir(parents=True, exist_ok=True)
    (grower / "manifests").mkdir(parents=True, exist_ok=True)
    (grower / "logs").mkdir(parents=True, exist_ok=True)
    _write_json(
        grower / "grower.json",
        {
            "grower_slug": grower_slug,
            "display_name": grower_slug,
            "notes": "Canonical grower metadata",
        },
    )
    _write_text(grower / "logs" / "pipeline_runs.jsonl", "", overwrite=False)

    farm = farm_root(grower_slug, farm_slug)
    farm.mkdir(parents=True, exist_ok=True)
    (farm / "boundary").mkdir(parents=True, exist_ok=True)
    (farm / "manifests").mkdir(parents=True, exist_ok=True)
    (farm / "logs").mkdir(parents=True, exist_ok=True)
    (farm / "derived" / "reports").mkdir(parents=True, exist_ok=True)
    (farm / "derived" / "summaries").mkdir(parents=True, exist_ok=True)
    (farm / "derived" / "dashboards").mkdir(parents=True, exist_ok=True)
    (farm / "derived" / "tables").mkdir(parents=True, exist_ok=True)
    _write_json(
        farm / "farm.json",
        {
            "grower_slug": grower_slug,
            "farm_slug": farm_slug,
            "display_name": farm_name,
            "state": "IA",
            "country": "US",
            "default_crs": "EPSG:4326",
            "notes": "Canonical farm metadata",
        },
    )
    _write_text(farm / "logs" / "pipeline_runs.jsonl", "", overwrite=False)

    slugs = field_slugs_from_inventory(inventory_path=inventory_path)
    if not slugs:
        root = fields_root(grower_slug, farm_slug)
        if root.exists():
            slugs = sorted([p.name for p in root.iterdir() if p.is_dir()])

    for slug in slugs:
        ensure_canonical_field_artifacts(slug, grower_slug, farm_slug)

    return slugs
