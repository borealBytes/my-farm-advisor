---
name: breeding-trial-management
description: >
  Breeding trial management toolkit for design, fieldbook generation, germplasm workflows,
  selection, and crossing decisions. Complements qtl-analysis for end-to-end breeding genomics.
allowed-tools: Read Write Edit Bash
license: Apache-2.0
metadata:
  skill-author: Clayton Young / Superior Byte Works, LLC (@borealBytes)
  skill-version: "1.0.0"
---

# Breeding Trial Management

## Overview

This skill handles breeding operations around trial execution and decision support:

- Trial design planning
- Fieldbook preparation
- Germplasm tracking
- Selection and crossing workflows

## Installation

```bash
python scripts/check_system.py
```

## Unified CLI

```bash
python scripts/breeding_cli.py design --help
python scripts/breeding_cli.py fieldbook --help
python scripts/breeding_cli.py germplasm --help
python scripts/breeding_cli.py select --help
python scripts/breeding_cli.py cross --help
```

## Tool Selection Guide

- Use `design` for RCBD/alpha-lattice/augmented planning tasks.
- Use `fieldbook` to generate plot sheets and labels.
- Use `germplasm` for accession list and inventory operations.
- Use `select` for ranking and shortlist generation.
- Use `cross` for mate pairing and crossing plan scaffolds.

## Example Modules

- Trial design: `examples/rcbd-design/`, `examples/alpha-lattice/`, `examples/augmented-design/`, `examples/field-book/`
- Germplasm and pedigree: `examples/breedbase-client/`, `examples/pedigree-management/`, `examples/bms-client/`
- Selection and crossing: `examples/selection-index/`, `examples/breeding-value-ranking/`, `examples/crossing-plan/`, `examples/data-import/`
- Field systems integration: `examples/iot-field-sync/`

## Examples and Support Docs

- `examples/breeding-simulation/README.md`: AlphaSimR-style forward breeding simulation workflow notes
