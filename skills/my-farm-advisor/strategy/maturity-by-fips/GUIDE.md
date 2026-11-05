# maturity-by-fips

_Repo-native skill scaffold for annual county/FIPS maturity products._

---

## 📋 Purpose

This workflow owns annual maturity-by-FIPS logic for the repository, including heuristic corn RM and soybean MG outputs that reuse canonical shared data assets.

## 📦 Scope

- Annual maturity configuration and output indexing
- Shared integration points for county weather, GDD, corn RM, and soybean MG artifacts
- Future orchestration support for the annual maturity pipeline

## 🔗 Integration

- Code lives under `my-farm-advisor/strategy/maturity-by-fips/src/`
- Shared outputs live under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/corn_maturity/` and `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/shared/soybean_maturity/`
- Annual entrypoints live under `${DATA_PIPELINE_DATA_ROOT}/data-pipeline/src/scripts/`
- Multi-year runs write annual files such as `rm_by_fips_2025.parquet` and `mg_by_fips_2025.parquet`, plus final five-year FIPS-average files such as `rm_by_fips_2021_2025_average.parquet` and `mg_by_fips_2021_2025_average.parquet`.

Initialize the default 2021-2025 lower48 shared maturity baseline through the data-pipeline installer:

```bash
export DATA_PIPELINE_DATA_ROOT=/absolute/path/to/my-farm-advisor-runtime
cd my-farm-advisor/data-pipeline
./scripts/install.sh --prepare-shared-data
```

For maturity-only rebuilds, use `./scripts/install.sh --prepare-shared-maturity` or run `scripts/run_maturity_years_by_fips.py` from the installed runtime source.
