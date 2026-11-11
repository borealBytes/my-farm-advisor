# Local Instructions

## Purpose

This folder owns field-boundary workflows for creating, downloading, validating, and preparing boundary geometries for farm data pipelines.

## Safe edit scope

Edits should stay in this folder and its children unless the user explicitly asks for a broader skill change. Do not change parent `SKILL.md`, sibling field-management workflows, or root policy from a subskill task unless explicitly requested.

## Read nearby docs first

Read `GUIDE.md` first, then `examples/README.md` for examples. Review `scripts/download_fields_template.py` before changing download or template behavior. If routing context is needed, read `../INDEX.md` and `../../SKILL.md`.

## Local validation

Run `python scripts/download_fields_template.py` only when the task changes the template script and required inputs are available. Otherwise run `./scripts/validate.sh` from the repository root after structural changes.

## Local-delta-only reminder

This nested AGENTS.md only records instructions that differ from the parent or root files. Do not duplicate root-wide asset, vendor, or validation policy here except this pointer to `../../../AGENTS.md`.
