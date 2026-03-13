# farm-data-rebuild

Single high-level skill that rebuilds the canonical `data/moltbot/` tree from a boundary input using existing repository skills.

## Run

```bash
python scripts/rebuild_data_folder.py \
  --boundaries data/moltbot/input/fields.geojson \
  --grower-slug demo-grower \
  --farm-slug demo-farm \
  --farm-name "Demo Farm"
```

## Deterministic behavior

- Sorts input boundaries by `field_id`.
- Writes stable slug mapping to `data/moltbot/growers/iowa-demo-grower/farms/iowa-demo-farm/manifests/field-inventory.csv`.
- Uses fixed canonical output locations.
- Verifies required files per field before reporting success.

## Notes

- By default, temporary legacy work directories are removed after canonical sync.
- Use `--keep-legacy-workdirs` for debugging.
- Use `--skip-downloads` if upstream datasets are already present.
