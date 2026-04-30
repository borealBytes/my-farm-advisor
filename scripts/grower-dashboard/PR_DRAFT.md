# PR Draft — KS Grower 02 Offline Dashboard Vertical Slice

## Summary

- add the grower dashboard contract, local data adapter, and single-file generator flow for `ks-grower-02`
- build the standalone offline dashboard in `scripts/grower-dashboard/` with overview, map-driven field selection, weather, soil, crop, imagery, and secondary diagnostics/lineage panels
- document how reviewers can generate and inspect the local dashboard artifact without treating that generated HTML as committed source

## Committed source changes

- `scripts/grower-dashboard/contracts.ts`: dashboard payload contract and canonical output path/runtime rules
- `scripts/grower-dashboard/data-adapter.ts`: local source loading, normalization, reconciliation, and diagnostics population
- `scripts/grower-dashboard/build-ks-grower-02.ts`: single-file dashboard generation entrypoint
- `scripts/grower-dashboard/render-html.ts`: offline single-page dashboard renderer with map-coordinated detail panels and secondary diagnostics/lineage view
- `scripts/grower-dashboard/README.md`: local generation/review workflow

## Local generated artifact

The generated dashboard HTML is **local-only review output** and is **not part of the committed source changes**.

- Local output path: `data/my-farm-advisor/growers/ks-grower-02/ks-grower-02-dashboard.html`
- Generation command: `node --import tsx scripts/grower-dashboard/build-ks-grower-02.ts`
- Reviewers should inspect the local generated file directly in a browser after running the command above.
- The generated HTML should remain local and should not be added to git.

## Reviewer notes

1. Run `node --import tsx scripts/grower-dashboard/build-ks-grower-02.ts` from the repo root.
2. Open `data/my-farm-advisor/growers/ks-grower-02/ks-grower-02-dashboard.html` locally in a browser.
3. Verify the field map changes the selected field and keeps weather, soil, crop, imagery, and diagnostics/lineage views in sync.
