# Local Instructions

## Purpose

This folder owns SSURGO soil workflows for obtaining and using soil survey data in farm analysis.

## Safe edit scope

Edits should stay in this folder and its children unless the user explicitly asks for a broader skill change. Do not change parent `SKILL.md`, sibling soil workflows, or root policy from a subskill task unless explicitly requested.

## Read nearby docs first

Read `GUIDE.md` first, then `examples/README.md` for examples. Review `download_example_data.py` before changing example-data behavior. If routing context is needed, read `../INDEX.md` and `../../SKILL.md`.

## Local validation

Run `python download_example_data.py` only when the task changes example-data download behavior and dependencies are available. Otherwise run `./scripts/validate.sh` from the repository root after structural changes.

## Local-delta-only reminder

This nested AGENTS.md only records instructions that differ from the parent or root files. Do not duplicate root-wide asset, vendor, or validation policy here except this pointer to `../../../AGENTS.md`.
