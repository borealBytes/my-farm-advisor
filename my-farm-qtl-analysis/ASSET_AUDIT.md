# Asset Audit

Audit date: 2026-04-28

## Scope

- imported local structural base from the local qtl-analysis subtree snapshot
- remote completeness backfill from `borealBytes/my-farm-advisor@main:skills/my-farm-qtl-analysis`
- binary/large-file review before tracking

## Pre-prune findings

All candidate binary or >5 MB files were generated example outputs:

- `examples/mapping/classical-qtl/output/data/cross_data.npz` — generated output
- `examples/mapping/gwas-lmm/output/data/synthetic_data.npz` — generated output
- `examples/mapping/gwas-lmm/output/data/genotypes.raw` — generated output
- `examples/mapping/gwas-lmm/output/results/kinship.sXX.txt` — generated output > 5 MB
- `examples/structure/population-structure/output/data/genotypes.npy` — generated output

No required sample assets outside generated `output/` trees needed Git LFS.

## Action taken

- removed 38 generated `examples/**/output/` directories from the imported skill tree
- added `.gitignore` rules for `examples/**/output/` and `scripts/output/`
- preserved text sample assets under `assets/sample_data/`

## Post-prune state

- no `.npy`, `.npz`, or `.raw` files remain in the tracked skill tree
- no files larger than 5 MB remain in the tracked skill tree
- no new Git LFS additions required for this import

## Result

The imported skill is safe to track under the repository asset policy without adding LFS-backed binary files.
