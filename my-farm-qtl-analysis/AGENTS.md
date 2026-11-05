# Skill Instructions

## Skill purpose

This skill owns QTL, GWAS, eQTL, QC, population structure, genomic prediction, and reporting workflows for quantitative genetics analysis.

## Safe edit scope

Edits should stay inside `my-farm-qtl-analysis/` unless the user explicitly asks for repo-wide work. Do not edit sibling skill trees for local QTL fixes. Do not duplicate root-wide vendor, asset, or validation policy here, see `../AGENTS.md`.

## Start here

Always read `SKILL.md` first for routing, then `README.md` for the overview. Read `PROVENANCE.md` before import, source, or update work. Open `INDEX.md`, then the matching example README or script docs.

## Local routing notes

- Use this skill for GWAS, eQTL, classical QTL, QC, population structure, genomic prediction, and reporting workflows.
- Start with `SKILL.md`, then use `INDEX.md` to route to `examples/mapping/`, `examples/qc/`, `examples/structure/`, `examples/prediction/`, or `examples/reporting/`.
- Use `scripts/check_system.py`, `scripts/install_deps.sh`, or `scripts/verify_gpu_hpc.py` only when the task needs local environment or GPU readiness checks.
- Keep generated example `output/` artifacts untracked and reproducible from scripts.

## Local validation

Prefer the root validator from the repo root: `./scripts/validate.sh`. When changing runnable QTL examples or scripts, run the narrow local command documented in the nearby README when dependencies are available.

## Contribution default pointer

Branch work should create a new skill unless the user explicitly asks to add, extend, or modify an existing skill.
