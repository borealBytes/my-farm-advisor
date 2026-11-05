# farm-data-rebuild

Document-routed workflow that rebuilds the canonical `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/` tree from a boundary input using the installed data-pipeline runtime scripts.

## Run

Initialize the runtime, prepare shared data, seed fields from a requested state, and run the farm pipeline:

```bash
export DATA_PIPELINE_DATA_ROOT=/absolute/path/to/my-farm-advisor-runtime
cd my-farm-advisor/data-pipeline
./scripts/install.sh \
  --prepare-shared-data \
  --seed-grower-slug demo-grower \
  --seed-state Illinois \
  --seed-field-count 12 \
  --seed-farm-name "Demo Illinois Farm"
```

Use that form when no boundary file already exists. It prepares geoadmin, county weather, annual maturity, five-year FIPS-average maturity, and CONUS CDL shared assets before selecting a top-crop county in the requested state and sampling OSM field polygons. It then runs the full farm pipeline, so farm-derived tables, field weather, soil outputs, CDL crop history, satellite/NDVI products, reports, cards, posters, and HTML/Markdown reports are generated automatically.

Run against an existing boundary file:

```bash
export DATA_PIPELINE_DATA_ROOT=/absolute/path/to/my-farm-advisor-runtime
cd my-farm-advisor/data-pipeline
./scripts/install.sh
cd "${DATA_PIPELINE_DATA_ROOT}/data-pipeline/src"
"${DATA_PIPELINE_DATA_ROOT}/data-pipeline/.venv/bin/python" \
  scripts/run_farm_pipeline.py \
  --boundaries "${DATA_PIPELINE_DATA_ROOT}/data-pipeline/input/fields.geojson" \
  --grower-slug demo-grower \
  --farm-slug demo-farm \
  --farm-name "Demo Farm" \
  --weather-backend zarr \
  --weather-start-year 2021 \
  --weather-end-year 2025 \
  --weather-time-standard lst
```

## Deterministic behavior

- Sorts input boundaries by `field_id`.
- Writes stable slug mapping to `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/growers/<grower_slug>/farms/<farm_slug>/manifests/field-inventory.csv`.
- Uses fixed canonical output locations.
- Verifies required files per field before reporting success.

## Notes

- Run from `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/src` after `data-pipeline/scripts/install.sh` has copied the committed source into the runtime tree.
- Use `scripts/ingest/bootstrap_farm_from_county.py` from the same runtime source tree when a county bootstrap should create or append field boundaries and inventory mappings.
- Use `scripts/farm_dashboard.py create --prepare-shared-data --state <state> --field-count <n> --grower-slug <slug>` when the request is state-based seeding rather than boundary-file rebuild.
- Use `scripts/run_farm_pipeline.py --structure-test` for a no-download smoke check of the canonical directory layout.
- Use `--weather-backend api` only for small legacy NASA POWER REST API debug pulls; normal farm rebuilds sample NASA POWER S3 Zarr at field centroids.
