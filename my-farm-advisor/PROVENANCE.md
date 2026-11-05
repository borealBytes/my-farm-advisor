# Import Provenance

## my-farm-advisor
- source_repo: https://github.com/borealBytes/my-farm-advisor.git
- source_local_path: N/A
- source_ref: main
- source_commit: 4a82ab779e8374035ca5e15f1cb1c0571395dc3d
- source_status: clean remote ref
- source_path: skills/my-farm-advisor/
- destination_path: my-farm-advisor/
- import_date: 2026-04-28
- exclusions: `.git/`; generated geoadmin runtime payloads such as `countries.geojson`, `states_usa.geojson`, `counties_usa.geojson`, and related Parquet files rebuilt under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/geoadmin/{l0_countries,l1_states,l2_counties}/`; generated maturity report/table artifacts rebuilt under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/{corn_maturity,soybean_maturity}/`; any repo-local CI or deployment files outside `skills/my-farm-advisor/`
- local_modifications: Imported `skills/my-farm-advisor/` into `my-farm-advisor/` and intentionally kept geoadmin source metadata JSON files while excluding generated geoadmin payloads. The committed metadata records the upstream `source_url`, `archive_name`, `output_geojson`, and `output_parquet` values used by `data-pipeline/src/scripts/ingest/download_geoadmin.py` to rebuild runtime outputs under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/geoadmin/{l0_countries,l1_states,l2_counties}/`. Generated maturity report/table artifacts were also omitted while preserving `farm_dashboard.py`, `run_farm_pipeline.py`, `run_maturity_by_fips.py`, and the deterministic runtime bootstrap layout.
- update_procedure: Run `git ls-remote https://github.com/borealBytes/my-farm-advisor.git refs/heads/main`, confirm the SHA, clone or fetch the repo, copy only `skills/my-farm-advisor/` into `my-farm-advisor/`, preserve the geoadmin metadata JSON files, exclude generated geoadmin payloads and runtime copies that belong under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/geoadmin/{l0_countries,l1_states,l2_counties}/`, exclude generated maturity report/table artifacts under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/{corn_maturity,soybean_maturity}/`, rerun `./scripts/validate.sh`, and refresh the QA evidence plus provenance fields in the same commit.
