---
name: my-farm-qtl-analysis
description: >
  Example-first QTL analysis toolkit for GWAS, eQTL mapping, classical QTL, structure,
  prediction, and reporting workflows. Uses open-source tools such as tensorQTL, GEMMA,
  PLINK, and R/qtl2 through runnable examples rather than a single command wrapper.
license: Apache-2.0
metadata:
  author: Clayton Young (borealBytes / Superior Byte Works, LLC)
  skill-author: Clayton Young / Superior Byte Works, LLC (@borealBytes)
  contact: Clayton@SuperiorByteWorks.com
  linkedin: https://linkedin.com/in/claytoneyoung/
  version: "1.0.0"
  skill-version: "1.0.0"
  category: genomics
  tools: [tensorQTL, GEMMA, PLINK, R/qtl2, pyQTL]
---

<!-- Copyright 2026 Clayton Young (borealBytes / Superior Byte Works, LLC) -->
<!-- Licensed under the Apache License, Version 2.0. -->

# My Farm QTL Analysis

## Purpose

Use this skill for quantitative genetics work: GWAS, eQTL mapping, classical QTL, input QC, population structure, genomic prediction, and reporting.

## Start Here

- Read [README.md](README.md) for the human overview.
- Open [INDEX.md](INDEX.md) to route into mapping, QC, structure, prediction, or reporting examples.
- Read [AGENTS.md](AGENTS.md) before editing examples, scripts, research notes, or provenance.

## Routing Guidance

- Use **Mapping** for GWAS, eQTL, classical QTL, and association variants.
- Use **QC** before modeling to validate genotypes, samples, phenotypes, imputation, and annotations.
- Use **Structure** for PCA, admixture, LD, haplotypes, kinship, and clustering.
- Use **Prediction** for genomic prediction, marker selection, BLUP-style baselines, and breeding decisions.
- Use **Reporting** for ideograms, analysis reports, and real-dataset packaging.

## Runtime Notes

The examples are document-routed workflows, not separate runtime-discoverable skills. Load the matching example README from [INDEX.md](INDEX.md), then run the narrow command documented there when dependencies are available.
