# ssurgo-poster-cards

This workflow builds poster-ready soil profile cards from SSURGO horizon data stored in SQLite.

## Generates

- Single profile card
- Multi-profile comparison card
- Texture RGB card
- Clustered profile card

## Run

```bash
export DATA_PIPELINE_DATA_ROOT=/absolute/path/to/my-farm-advisor-runtime
python scripts/build_ssurgo_poster_cards.py \
  --db "${DATA_PIPELINE_DATA_ROOT}/data-pipeline/raw/ssurgo.sqlite" \
  --out "${DATA_PIPELINE_DATA_ROOT}/data-pipeline/derived/cards" \
  --dominant-only \
  --max-profiles 6
```

## Typical use

Use this when you need publication-quality soil profile visuals for posters, reports, or side-by-side map unit comparison.

## Dependencies

See `requirements.txt` for the full list. Key packages:

- pandas - data manipulation
- matplotlib - plotting
- sqlite3 - database access (stdlib)

## Data expectations

The script expects a SQLite database with standard SSURGO schema including:

- `mapunit` table with MUKEY and map unit names
- `component` table with component keys and percentages
- `chorizon` table with horizon depths and properties
