---
name: farm-intelligence-reporting
description: Build composable, idempotent field-level and farm-level reports from agricultural domain skills, including static posters and self-contained HTML outputs.
version: 1.0.0
author: Boreal Bytes
tags: [reporting, agriculture, posters, html, pipeline, manifests, ndvi]
---

# Skill: farm-intelligence-reporting

## Description

Compose field boundaries, headlands, soils, weather, crop history, and remote sensing into canonical reporting datasets and render field-level and farm-level outputs. This skill is the reporting layer for Phase 1. It builds static posters and self-contained HTML outputs while preserving manifest-driven, idempotent rerun behavior for future monitoring workflows.

## When to Use This Skill

- **Field posters**: Generate academic-style field analysis posters
- **Farm reporting**: Generate a farm/group overview poster and HTML summary
- **Idempotent refreshes**: Rebuild only the reporting steps that are stale
- **Composable reporting**: Reuse panel-level plot functions and summary builders across outputs

## Design Principles

- Business logic lives in modules, not scripts
- Domain skills provide reusable data, metrics, and panel-level plot helpers
- Static poster and HTML outputs share one reporting model and one panel inventory
- Manifest-driven pipeline checks inputs, code fingerprints, and config fingerprints before rerunning

## Public API

- `FieldReportingConfig`
- `StepManifest`
- `build_step_manifest(...)`
- `step_is_stale(...)`
- `build_field_context(...)`
- `build_farm_summary(...)`

## Output Conventions

- Canonical reporting datasets live under `data/growers/<grower>/farms/<farm>/derived/` and `data/shared/`
- Static posters and report outputs live under `data/growers/<grower>/farms/<farm>/derived/reports/`
- Self-contained HTML should embed report data so it can be opened without a backing server
