# Skill Instructions

## Skill purpose

This skill owns breeding operations workflows for trial design, fieldbooks, germplasm, selection, crossing plans, and field trial placement.

## Safe edit scope

Edits should stay inside `my-farm-breeding-trial-management/` unless the user explicitly asks for repo-wide work. Do not edit sibling skill trees for local breeding fixes. Do not duplicate root-wide vendor, asset, or validation policy here, see `../AGENTS.md`.

## Start here

Always read `SKILL.md` first for routing, then `README.md` for the overview. Read `PROVENANCE.md` before import, source, or update work. Open `INDEX.md`, then the matching example README, reference README, or script docs.

## Local routing notes

- Use this skill for breeding operations: trial design, fieldbooks, germplasm, selection, crossing, and field trial placement.
- Start with `SKILL.md`, then use `INDEX.md` to route into `examples/design/`, `examples/fieldbook/`, `examples/germplasm/`, `examples/select/`, `examples/cross/`, and `examples/field-trial-placement/`.
- Use `scripts/breeding_cli.py` and `scripts/check_system.py` only when the task involves runnable breeding workflows.
- Keep operational examples example-first and avoid flattening the grouped workflow layout.

## Local validation

Prefer the root validator from the repo root: `./scripts/validate.sh`. When changing runnable breeding examples or scripts, run the narrow local command documented in the nearby README when dependencies are available.

## Contribution default pointer

Branch work should create a new skill unless the user explicitly asks to add, extend, or modify an existing skill.
