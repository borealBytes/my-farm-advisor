#!/usr/bin/env python3
"""
run_farm_pipeline.py — Master pipeline entrypoint.

Usage:
    python data/moltbot/scripts/run_farm_pipeline.py \\
        --boundaries data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/boundary/field_boundaries.geojson \\
        [--farm-name "Iowa Demo Farm"] \\
        [--force]

Runs the full farm intelligence reporting pipeline from a single field
boundaries GeoJSON file.  Each step is idempotent and will be skipped if
inputs, code, and config are unchanged since the last run.

Outputs:
    data/moltbot/growers/.../fields/.../derived/reports/    — one per field
    data/moltbot/growers/.../derived/reports/               — farm poster, HTML, and Markdown
    data/moltbot/growers/.../manifests/                     — canonical per-step manifests
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from datetime import UTC, datetime
from pathlib import Path
from typing import Any, cast

from lib.paths import farm_boundary_path, farm_report_asset_path, grower_manifest_path
from reporting_bootstrap import ensure_canonical_data_tree

_REPO = Path(__file__).resolve().parents[2]
_SCRIPTS = Path(__file__).parent


def _load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def _write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def _init_grower_manifest(grower_slug: str, farm_slug: str, farm_name: str) -> Path:
    manifest_path = grower_manifest_path(grower_slug)
    payload = _load_json(manifest_path)
    raw_farms = payload.get("farms")
    farms: list[dict[str, Any]] = (
        [cast(dict[str, Any], item) for item in raw_farms if isinstance(item, dict)]
        if isinstance(raw_farms, list)
        else []
    )
    farm_exists = any(
        str(item.get("farm_slug")) == farm_slug for item in farms if isinstance(item, dict)
    )
    if not farm_exists:
        farms.append(
            {
                "farm_slug": farm_slug,
                "farm_name": farm_name,
                "last_run_started": None,
                "last_run_finished": None,
                "last_run_status": "unknown",
            }
        )
    now = datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    payload.update(
        {
            "grower_slug": grower_slug,
            "manifest_version": 1,
            "updated_at": now,
            "farms": farms,
        }
    )
    _write_json(manifest_path, payload)
    return manifest_path


def _update_grower_manifest(
    manifest_path: Path,
    *,
    farm_slug: str,
    run_status: str,
    active_step: str | None,
    step_results: list[dict[str, str]],
    started_at: str | None = None,
    finished_at: str | None = None,
) -> None:
    payload = _load_json(manifest_path)
    raw_farms = payload.get("farms")
    farms: list[dict[str, Any]] = (
        [cast(dict[str, Any], item) for item in raw_farms if isinstance(item, dict)]
        if isinstance(raw_farms, list)
        else []
    )
    for idx, item in enumerate(farms):
        if not isinstance(item, dict):
            continue
        if str(item.get("farm_slug")) != farm_slug:
            continue
        current = dict(item)
        if started_at is not None:
            current["last_run_started"] = started_at
        if finished_at is not None:
            current["last_run_finished"] = finished_at
        current["last_run_status"] = run_status
        current["active_step"] = active_step
        current["step_results"] = step_results
        farms[idx] = current
        break
    payload["farms"] = farms
    payload["updated_at"] = datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    _write_json(manifest_path, payload)


def _run(script: str, extra_env: dict | None = None) -> bool:
    cmd = [sys.executable, str(_SCRIPTS / script)]
    t0 = time.monotonic()
    env = os.environ.copy()
    if extra_env:
        env.update({str(key): str(value) for key, value in extra_env.items()})
    result = subprocess.run(cmd, cwd=str(_REPO), capture_output=False, env=env)
    elapsed = time.monotonic() - t0
    status = "ok" if result.returncode == 0 else "FAILED"
    print(f"  {status}  ({elapsed:.1f}s)  {script}")
    return result.returncode == 0


def main() -> None:
    parser = argparse.ArgumentParser(description="Farm intelligence reporting pipeline")
    parser.add_argument(
        "--boundaries",
        default=None,
        help="Path to field boundaries GeoJSON",
    )
    parser.add_argument("--farm-name", default="Iowa Demo Farm")
    parser.add_argument("--grower-slug", default="iowa-demo-grower")
    parser.add_argument("--farm-slug", default="iowa-demo-farm")
    parser.add_argument(
        "--inventory-csv",
        default=".sisyphus/evidence/task-3-field-inventory.csv",
        help="Path to field inventory CSV with field_id,field_slug",
    )
    parser.add_argument(
        "--weather-csv",
        default=None,
        help="Optional canonical weather CSV override",
    )
    parser.add_argument("--force", action="store_true", help="Force rerun all steps")
    parser.add_argument(
        "--structure-test",
        action="store_true",
        help="Create and verify canonical data tree, then exit",
    )
    args = parser.parse_args()

    field_slugs = ensure_canonical_data_tree(
        grower_slug=args.grower_slug,
        farm_slug=args.farm_slug,
        farm_name=args.farm_name,
        inventory_path=_REPO / args.inventory_csv,
    )
    if field_slugs:
        print(f"Canonical tree ensured for {len(field_slugs)} fields")
    else:
        print("Canonical tree ensured (no field inventory found)")

    if args.structure_test:
        print("Structure test complete.")
        return

    boundaries = (
        Path(args.boundaries)
        if args.boundaries
        else farm_boundary_path(args.grower_slug, args.farm_slug)
    )
    if not boundaries.exists():
        print(f"ERROR: field boundaries not found: {boundaries}")
        sys.exit(1)

    print()
    print("=" * 60)
    print("  Farm Intelligence Reporting Pipeline")
    print(f"  Farm: {args.farm_name}")
    print(f"  Boundaries: {boundaries}")
    print("=" * 60)

    run_started = datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")
    grower_manifest = _init_grower_manifest(args.grower_slug, args.farm_slug, args.farm_name)
    step_results: list[dict[str, str]] = []
    _update_grower_manifest(
        grower_manifest,
        farm_slug=args.farm_slug,
        run_status="running",
        active_step="bootstrap",
        step_results=step_results,
        started_at=run_started,
        finished_at=None,
    )

    steps = [
        ("ingest/download_fields.py", "Canonical field boundaries"),
        ("ingest/download_soil.py", "SSURGO field soil tables"),
        ("ingest/download_weather.py", "Weather history tables"),
        ("ingest/download_cdl.py", "Shared CDL history tables"),
        ("ingest/download_satellite_imagery.py", "Raw satellite TIFFs"),
        ("reporting/generate_ndvi_composites.py", "NDVI yearly composites"),
        ("reporting/generate_ndvi_cards.py", "NDVI cached cards"),
        ("reporting/generate_field_posters.py", "Field posters"),
        ("reporting/generate_aggregate_poster.py", "Farm portfolio poster"),
        ("reporting/generate_ssurgo_cards.py", "SSURGO soil profile cards"),
        ("reporting/generate_ssurgo_maps.py", "SSURGO soil maps with basemap"),
        ("reporting/generate_farm_html.py", "Self-contained HTML report"),
        ("reporting/generate_farm_markdown.py", "Markdown report"),
    ]

    all_ok = True
    extra_env = {
        "AG_GROWER_SLUG": args.grower_slug,
        "AG_FARM_SLUG": args.farm_slug,
        "AG_FARM_NAME": args.farm_name,
        "AG_INVENTORY_CSV": args.inventory_csv,
        "AG_BOUNDARIES": str(boundaries),
    }
    if args.weather_csv:
        extra_env["AG_WEATHER_CSV"] = args.weather_csv
    if args.force:
        extra_env["AG_FORCE"] = "1"
    for script, label in steps:
        _update_grower_manifest(
            grower_manifest,
            farm_slug=args.farm_slug,
            run_status="running",
            active_step=script,
            step_results=step_results,
        )
        print(f"\n[{label}]")
        ok = _run(script, extra_env=extra_env)
        step_results.append({"step": script, "status": "ok" if ok else "failed"})
        if not ok:
            all_ok = False
            _update_grower_manifest(
                grower_manifest,
                farm_slug=args.farm_slug,
                run_status="failed",
                active_step=script,
                step_results=step_results,
                finished_at=datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z"),
            )
            print(f"  Pipeline halted at: {script}")
            print("  Fix the error above and rerun.")
            sys.exit(1)

    print()
    print("=" * 60)
    if all_ok:
        _update_grower_manifest(
            grower_manifest,
            farm_slug=args.farm_slug,
            run_status="complete",
            active_step=None,
            step_results=step_results,
            finished_at=datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z"),
        )
        print("  Pipeline complete.")
        print()
        print("  Outputs:")
        for extension in ("png", "html", "md"):
            output = farm_report_asset_path(args.grower_slug, args.farm_slug, extension)
            if output.exists():
                print(f"    {output.relative_to(_REPO)}")
    print("=" * 60)
    print()


if __name__ == "__main__":
    main()
