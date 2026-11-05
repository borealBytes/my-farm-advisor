# Local Instructions

## Purpose

This folder owns SSURGO poster-card workflows for turning soil survey context into concise field-ready visual summaries.

## Safe edit scope

Edits should stay in this folder and its children unless the user explicitly asks for a broader skill change. Do not change parent `SKILL.md`, sibling soil workflows, or root policy from a subskill task unless explicitly requested.

## Read nearby docs first

Read `README.md` and `GUIDE.md` first. If routing context is needed, read `../INDEX.md` and `../../SKILL.md`.

## Local validation

Run `./scripts/validate.sh` from the repository root after structural changes. If the README or guide names a local poster-card command, run it against the smallest available sample when dependencies are available.

## Local-delta-only reminder

This nested AGENTS.md only records instructions that differ from the parent or root files. Do not duplicate root-wide asset, vendor, or validation policy here except this pointer to `../../../AGENTS.md`.
