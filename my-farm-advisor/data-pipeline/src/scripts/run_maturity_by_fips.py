from __future__ import annotations
# pyright: reportMissingImports=false

import argparse
import importlib
import json
import subprocess
import sys
from datetime import UTC, datetime
from pathlib import Path

from bootstrap_runtime import ensure_runtime_environment

ensure_runtime_environment()

_SCRIPTS_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(_SCRIPTS_DIR))
sys.path.insert(0, str(_SCRIPTS_DIR / "lib"))

from paths import DATA_ROOT, SCRIPTS_ROOT


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare repo-native annual maturity-by-FIPS pipeline scaffolding"
    )
    parser.add_argument(
        "--year", type=int, required=True, help="Annual maturity output year"
    )
    parser.add_argument(
        "--weather-source",
        default="nasa-power",
        help="Canonical shared weather source slug for annual maturity outputs",
    )
    parser.add_argument(
        "--weather-backend",
        choices=["zarr", "api"],
        default="zarr",
        help="County weather backend for shared scopes; zarr avoids POWER point API rate limits",
    )
    parser.add_argument(
        "--weather-time-standard",
        choices=["lst", "utc"],
        default="lst",
        help="NASA POWER time standard for Zarr/API county weather outputs",
    )
    parser.add_argument(
        "--list-steps",
        action="store_true",
        help="Print the planned annual maturity output roots and exit",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Rebuild all annual maturity outputs even when target files already exist",
    )
    parser.add_argument(
        "--coverage",
        choices=["traditional-corn-belt", "lower48", "field-mapped"],
        default="traditional-corn-belt",
        help="County weather sourcing scope for annual maturity outputs",
    )
    parser.add_argument(
        "--weather-workers",
        type=int,
        default=5,
        help="Concurrent NASA POWER API grid requests when --weather-backend api",
    )
    parser.add_argument(
        "--weather-request-delay",
        type=float,
        default=0.5,
        help="Delay in seconds after each NASA POWER API county-weather request",
    )
    parser.add_argument(
        "--grower-slug",
        default=None,
        help="Required only when --coverage field-mapped",
    )
    parser.add_argument(
        "--farm-slug",
        default=None,
        help="Required only when --coverage field-mapped",
    )
    return parser.parse_args()


def _run_step(command: list[str]) -> None:
    result = subprocess.run(command, cwd=str(DATA_ROOT), check=False)
    if result.returncode != 0:
        raise SystemExit(result.returncode)


def _iso_now() -> str:
    return datetime.now(UTC).isoformat(timespec="seconds").replace("+00:00", "Z")


def _runtime_relative(path: Path) -> str:
    try:
        return str(path.resolve(strict=False).relative_to(DATA_ROOT))
    except ValueError:
        return str(path)


def _module(name: str):
    return importlib.import_module(name)


def main() -> int:
    from reporting_bootstrap import ensure_canonical_data_tree, ensure_skill_path

    args = parse_args()
    if args.coverage == "field-mapped" and (not args.grower_slug or not args.farm_slug):
        raise SystemExit("--grower-slug and --farm-slug are required for --coverage field-mapped")
    ensure_canonical_data_tree(include_farm=False)
    ensure_skill_path("maturity-by-fips")

    manifest_module = _module("manifest")
    maturity_module = _module("maturity_by_fips")
    paths_module = _module("paths")

    read_json = manifest_module.read_json
    write_json = manifest_module.write_json
    annual_maturity_config_cls = maturity_module.AnnualMaturityConfig
    build_year_output_index = maturity_module.build_year_output_index
    shared_manifest_dir = paths_module.shared_manifest_dir
    shared_corn_maturity_metadata_dir = paths_module.shared_corn_maturity_metadata_dir
    shared_soybean_maturity_metadata_dir = paths_module.shared_soybean_maturity_metadata_dir

    config_kwargs = {"year": args.year, "weather_source": args.weather_source}
    if args.grower_slug:
        config_kwargs["grower_slug"] = args.grower_slug
    if args.farm_slug:
        config_kwargs["farm_slug"] = args.farm_slug
    config = annual_maturity_config_cls(**config_kwargs)
    output_index = build_year_output_index(config)
    if args.list_steps:
        print(json.dumps(output_index, indent=2, sort_keys=True))
        return 0

    geoadmin_root = Path(output_index["geoadmin_root"])
    geoadmin_outputs = [
        geoadmin_root / "l0_countries" / "countries.geojson",
        geoadmin_root / "l1_states" / "states_usa.geojson",
        geoadmin_root / "l2_counties" / "counties_usa.geojson",
        geoadmin_root / "l2_counties" / "fips_lookup.parquet",
    ]
    field_fips_output = Path(output_index["field_fips_summary"])
    manifest_path = shared_manifest_dir() / f"maturity_by_fips_{args.year}.json"
    manifest = read_json(manifest_path, default={}) or {}
    manifest.update(
        {
            "year": args.year,
            "weather_source": args.weather_source,
            "weather_backend": args.weather_backend,
            "weather_time_standard": args.weather_time_standard,
            "coverage": args.coverage,
            "updated_at": _iso_now(),
            "steps": manifest.get("steps", {}),
        }
    )

    aggregate_weather_command = [
        sys.executable,
        str(SCRIPTS_ROOT / "ingest" / "aggregate_weather_by_fips.py"),
        "--year",
        str(args.year),
        "--weather-source",
        args.weather_source,
        "--weather-backend",
        args.weather_backend,
        "--time-standard",
        args.weather_time_standard,
        "--coverage",
        args.coverage,
        "--workers",
        str(args.weather_workers),
        "--request-delay",
        str(args.weather_request_delay),
    ]
    if args.coverage == "field-mapped":
        aggregate_weather_command.extend(
            ["--grower-slug", args.grower_slug, "--farm-slug", args.farm_slug]
        )

    steps: list[tuple[str, list[Path], list[str]]] = [
        (
            "geoadmin",
            geoadmin_outputs,
            [
                sys.executable,
                str(SCRIPTS_ROOT / "ingest" / "download_geoadmin.py"),
                "--levels",
                "l0_countries",
                "l1_states",
                "l2_counties",
            ],
        ),
        (
            "county-weather",
            [
                Path(output_index["county_weather"]),
                Path(output_index["county_weather_summary"]),
            ],
            aggregate_weather_command,
        ),
        (
            "county-gdd",
            [
                Path(output_index["corn_gdd"]),
                shared_corn_maturity_metadata_dir()
                / "my-farm-advisor"
                / f"gdd_by_fips_{args.year}.json",
            ],
            [
                sys.executable,
                str(SCRIPTS_ROOT / "ingest" / "calculate_gdd_by_fips.py"),
                "--year",
                str(args.year),
                "--weather-source",
                args.weather_source,
            ],
        ),
        (
            "corn-rm",
            [
                Path(output_index["corn_rm"]),
                Path(output_index["corn_rm_csv"]),
                shared_corn_maturity_metadata_dir()
                / "my-farm-advisor"
                / f"rm_by_fips_{args.year}.json",
            ],
            [
                sys.executable,
                str(SCRIPTS_ROOT / "ingest" / "calculate_corn_rm_by_fips.py"),
                "--year",
                str(args.year),
            ],
        ),
        (
            "soybean-mg",
            [
                Path(output_index["soybean_mg"]),
                Path(output_index["soybean_mg_csv"]),
                shared_soybean_maturity_metadata_dir()
                / "my-farm-advisor"
                / f"mg_by_fips_{args.year}.json",
            ],
            [
                sys.executable,
                str(SCRIPTS_ROOT / "ingest" / "calculate_soybean_mg_by_fips.py"),
                "--year",
                str(args.year),
            ],
        ),
        (
            "maps",
            [
                Path(output_index["corn_map"]),
                Path(output_index["soybean_map"]),
            ],
            [
                sys.executable,
                str(SCRIPTS_ROOT / "reporting" / "generate_maturity_maps.py"),
                "--year",
                str(args.year),
            ],
        ),
    ]
    if args.coverage == "field-mapped":
        steps.insert(
            1,
            (
                "field-fips",
                [field_fips_output],
                [
                    sys.executable,
                    str(SCRIPTS_ROOT / "ingest" / "assign_field_fips.py"),
                    "--grower-slug",
                    args.grower_slug,
                    "--farm-slug",
                    args.farm_slug,
                ],
            ),
        )

    for step_name, output_paths, command in steps:
        step_record = dict(manifest["steps"].get(step_name, {}))
        primary_output = output_paths[0] if output_paths else None
        outputs_exist = bool(output_paths) and all(
            path.exists() for path in output_paths
        )
        if outputs_exist and not args.force:
            print(f"skip {step_name}: {primary_output}")
            step_record.update(
                {
                    "status": "skipped",
                    "output_path": _runtime_relative(primary_output)
                    if primary_output is not None
                    else None,
                    "output_paths": [_runtime_relative(path) for path in output_paths],
                    "updated_at": _iso_now(),
                }
            )
            manifest["steps"][step_name] = step_record
            continue
        print(f"run  {step_name}: {' '.join(command)}")
        _run_step(command)
        step_record.update(
            {
                "status": "complete",
                "output_path": _runtime_relative(primary_output)
                if primary_output is not None
                else None,
                "output_paths": [_runtime_relative(path) for path in output_paths],
                "updated_at": _iso_now(),
            }
        )
        manifest["steps"][step_name] = step_record

    write_json(manifest_path, manifest)

    print(json.dumps(output_index, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
