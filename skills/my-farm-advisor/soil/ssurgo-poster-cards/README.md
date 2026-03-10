# ssurgo-poster-cards

This skill builds poster-ready soil profile cards from SSURGO horizon data stored in SQLite.

## Generates

- Single profile card
- Multi-profile comparison card
- Texture RGB card
- Clustered profile card

## Run

```bash
python scripts/build_ssurgo_poster_cards.py \
  --db data/raw/ssurgo.sqlite \
  --out outputs/cards \
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
