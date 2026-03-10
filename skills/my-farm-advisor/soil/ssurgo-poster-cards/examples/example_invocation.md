# Example Invocations

## Agent Usage

```
Generate SSURGO poster cards from the farm database.
Use dominant components only, max 6 profiles.
```

## CLI Usage

```bash
# Basic usage with defaults
python scripts/build_ssurgo_poster_cards.py --db data/raw/ssurgo.sqlite

# With all options
python scripts/build_ssurgo_poster_cards.py \
  --db data/raw/ssurgo.sqlite \
  --out outputs/cards \
  --dominant-only \
  --max-profiles 6 \
  --mukeys 12345 12346 12347
```

## Expected Outputs

After running, check `outputs/cards/` for:

- `card_01_single_profile.svg` - Individual profile visualization
- `card_02_compare_profiles.svg` - Side-by-side profile comparison
- `card_03_texture_profiles.svg` - Texture-colored profiles (RGB)
- `card_04_clustered_profiles.svg` - Clustered by similarity

Each card is exported in SVG, PDF, and PNG formats.
