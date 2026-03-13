#!/usr/bin/env python3
# ruff: noqa: E402
# pyright: reportMissingImports=false, reportAttributeAccessIssue=false, reportArgumentType=false, reportCallIssue=false, reportReturnType=false, reportGeneralTypeIssues=false
"""Download and summarize CDL crop composition for the active farm."""

import os
import sys
from pathlib import Path

import geopandas as gpd
import pandas as pd
import requests
from requests import HTTPError

_SCRIPTS_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_SCRIPTS_DIR))
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))

from paths import (
    ensure_parent,
    farm_boundary_path,
    farm_cdl_full_composition_path,
    farm_cdl_rotation_path,
    farm_cdl_year_table_path,
    shared_cdl_raster_dir,
)
from reporting_bootstrap import ensure_skill_path

ensure_skill_path("cdl-cropland")

from cdl_reporting import extract_crop_composition, summarize_crop_history


def download_cdl(year, state_fips="19"):
    """Download CDL raster for given year."""
    cdl_path = shared_cdl_raster_dir() / f"CDL_{year}_{state_fips}.tif"

    if not cdl_path.exists():
        print(f"  Downloading CDL {year}...")
        cdl_path.parent.mkdir(parents=True, exist_ok=True)
        url = f"https://nassgeodata.gmu.edu/nass_data_cache/byfips/CDL_{year}_{state_fips}.tif"

        resp = requests.get(url, timeout=120)
        resp.raise_for_status()

        with open(cdl_path, "wb") as f:
            f.write(resp.content)
        print(f"  Downloaded CDL {year}")

    return cdl_path


def _target_cdl_years(window_years: int = 5, latest_year: int = 2025) -> list[int]:
    years: list[int] = []
    candidate_year = latest_year
    while candidate_year >= max(2010, latest_year - window_years - 5):
        years.append(candidate_year)
        candidate_year -= 1
    return years


def _state_fips_values(fields: gpd.GeoDataFrame) -> list[str]:
    if "state_fips" not in fields.columns:
        return ["19"]
    values = (
        pd.Series(fields["state_fips"], dtype="object").fillna("").astype(str).str.strip().tolist()
    )
    unique_values = sorted({value.zfill(2) for value in values if value})
    return unique_values or ["19"]


def _table_field_ids(csv_path: Path) -> set[str]:
    if not csv_path.exists():
        return set()
    frame = pd.read_csv(csv_path, usecols=["field_id"])
    if "field_id" not in frame.columns:
        return set()
    return set(frame["field_id"].astype(str).tolist())


def main():
    print("=" * 60)
    print("Step 4: Download CDL Crop Type Data")
    print("=" * 60)

    grower_slug = os.environ.get("AG_GROWER_SLUG", "iowa-demo-grower")
    farm_slug = os.environ.get("AG_FARM_SLUG", "iowa-demo-farm")
    force = os.environ.get("AG_FORCE") == "1"
    fields = gpd.read_file(farm_boundary_path(grower_slug, farm_slug))
    print(f"Loaded {len(fields)} fields")
    state_fips_values = _state_fips_values(fields)
    print("State CDL coverage:", ", ".join(state_fips_values))

    target_years = _target_cdl_years(window_years=5, latest_year=2025)
    cached_years = [
        year
        for year in target_years
        if farm_cdl_year_table_path(grower_slug, farm_slug, year).exists()
    ]
    if (
        not force
        and len(cached_years) >= 5
        and farm_cdl_rotation_path(grower_slug, farm_slug).exists()
    ):
        selected_years = sorted(cached_years[:5], reverse=True)
        composition_path = farm_cdl_full_composition_path(
            grower_slug,
            farm_slug,
            min(selected_years),
            max(selected_years),
        )
        if composition_path.exists():
            expected_field_ids = set(fields["field_id"].astype(str).tolist())
            missing_by_year: dict[int, list[str]] = {}
            for year in selected_years:
                table_ids = _table_field_ids(farm_cdl_year_table_path(grower_slug, farm_slug, year))
                missing_ids = sorted(expected_field_ids - table_ids)
                if missing_ids:
                    missing_by_year[year] = missing_ids
            if missing_by_year:
                preview = "; ".join(
                    f"{year}: {', '.join(ids[:4])}" for year, ids in missing_by_year.items()
                )
                print(f"  Cached CDL tables missing field IDs; refreshing: {preview}")
            else:
                frames = [
                    pd.read_csv(farm_cdl_year_table_path(grower_slug, farm_slug, year))
                    for year in selected_years
                ]
                rotation = pd.read_csv(farm_cdl_rotation_path(grower_slug, farm_slug))
                print(
                    "skip  CDL API fetch (cached years): "
                    + ", ".join(str(year) for year in sorted(selected_years))
                )
                return (*frames, rotation)

    crop_mix_frames = []
    completed_years: list[int] = []
    for year in target_years:
        print(f"\n--- {year} CDL ---")
        state_frames: list[pd.DataFrame] = []
        for state_fips in state_fips_values:
            if "state_fips" in fields.columns:
                state_mask = fields["state_fips"].astype(str).str.zfill(2) == state_fips
            else:
                state_mask = pd.Series([True] * len(fields), index=fields.index)
            state_fields = fields.loc[state_mask].copy()
            if state_fields.empty:
                continue
            try:
                cdl_year_path = download_cdl(year, state_fips=state_fips)
            except HTTPError as exc:
                response = getattr(exc, "response", None)
                if response is not None and response.status_code == 404:
                    print(
                        f"  Warning: CDL {year} is not available yet for state {state_fips}; skipping"
                    )
                    continue
                raise
            state_frames.append(extract_crop_composition(state_fields, cdl_year_path, year=year))
        if not state_frames:
            print(f"  Warning: no CDL composition rows were available for {year}; skipping")
            continue
        cdl_year = pd.concat(state_frames, ignore_index=True)
        year_output = ensure_parent(farm_cdl_year_table_path(grower_slug, farm_slug, year))
        cdl_year.to_csv(year_output, index=False)
        print(f"  Saved: {year_output}")
        crop_mix_frames.append(cdl_year)
        completed_years.append(year)
        if len(completed_years) >= 5:
            break

    if not crop_mix_frames:
        raise RuntimeError("No CDL years were available for download")

    # Create rotation analysis
    print("\n--- Crop Rotation ---")
    crop_mix = pd.concat(crop_mix_frames, ignore_index=True)
    rotation = summarize_crop_history(crop_mix)
    rotation_output = ensure_parent(farm_cdl_rotation_path(grower_slug, farm_slug))
    rotation.to_csv(rotation_output, index=False)
    print(f"  Saved: {rotation_output}")
    composition_output = ensure_parent(
        farm_cdl_full_composition_path(
            grower_slug,
            farm_slug,
            min(completed_years),
            max(completed_years),
        )
    )
    crop_mix.to_csv(composition_output, index=False)
    print(f"  Saved: {composition_output}")

    print("\n✓ CDL analysis complete")
    for year, frame in zip(completed_years, crop_mix_frames):
        print(
            f"  {year} crops: {frame.sort_values('pct', ascending=False).groupby('field_id').first()['crop_name'].value_counts().to_dict()}"
        )

    return (*crop_mix_frames, rotation)


if __name__ == "__main__":
    main()
