# R2 Seed Pipeline Runtime Setup

This subskill ships the scripts that build the seed-pipeline reports and
posters. Each runtime host creates its own virtualenv inside the data tree on
first run; the scripts auto-bootstrap that environment before continuing.

## Quick start

```bash
cd skills/my-farm-advisor/r2-seed-pipeline
./scripts/install.sh               # optional preinstall; first script run also bootstraps automatically
source /data/workspace/data/my-farm-advisor/r2-seed-pipeline/.venv/bin/activate
python src/scripts/run_farm_pipeline.py \
  --grower-slug il-champaign-grower \
  --farm-slug champaign-demo-farm \
  --seed 77 --count 5 --force
```

`install.sh` looks for a writable data root in this order:

1. `R2_SEED_DATA_ROOT` (explicit override)
2. `/data/workspace/data/my-farm-advisor` (OpenClaw default)
3. `../../../../data/my-farm-advisor` relative to the skill (local checkout)

A matching `.venv/` directory is created under
`${DATA_ROOT}/r2-seed-pipeline/.venv` and populated with the dependencies from
`requirements.txt`.

## Running inside OpenClaw CLI

When invoking the pipeline from the control UI or `openclaw-cli`, you can still
activate the environment explicitly, but the entrypoints will install and re-exec
themselves if the runtime venv is missing.

```bash
bash -lc 'cd /data/workspace/data/my-farm-advisor/r2-seed-pipeline && \
  source .venv/bin/activate && \
  python src/scripts/run_farm_pipeline.py --grower-slug ... --farm-slug ...'
```

This ensures every pipeline step (including geopandas/rasterio operations) uses
the shared environment that lives alongside the replicated scripts.
