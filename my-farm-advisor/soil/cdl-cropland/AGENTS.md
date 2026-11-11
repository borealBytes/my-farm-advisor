# Local Instructions

## Purpose

This folder owns CDL cropland workflows for crop-history and cropland-layer context in farm analysis.

## Safe edit scope

Edits should stay in this folder and its children unless the user explicitly asks for a broader skill change. Do not change parent `SKILL.md`, sibling soil workflows, or root policy from a subskill task unless explicitly requested.

## Read nearby docs first

Read `GUIDE.md` first. If routing context is needed, read `../INDEX.md` and `../../SKILL.md`.

## Local validation

Run `./scripts/validate.sh` from the repository root after structural changes. If the guide names a local CDL command, run it against the smallest available sample when dependencies are available.

## Local-delta-only reminder

This nested AGENTS.md only records instructions that differ from the parent or root files. Do not duplicate root-wide asset, vendor, or validation policy here except this pointer to `../../../AGENTS.md`.
