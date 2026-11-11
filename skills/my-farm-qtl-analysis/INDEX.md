# My Farm QTL Analysis Index

Use this index to route quantitative genetics work into the right example family. Open the linked README before running or editing an example.

## Mapping

- [GWAS LMM](examples/mapping/gwas-lmm/README.md) - mixed-model GWAS
- [GWAS GLM](examples/mapping/gwas-glm/README.md) - fixed-effect association tests
- [eQTL CIS](examples/mapping/eqtl-cis/README.md) - cis-eQTL mapping
- [Classical QTL](examples/mapping/classical-qtl/README.md) - experimental-cross QTL workflows
- [Multi-Trait GWAS](examples/mapping/multi-trait-gwas/README.md) - multi-trait association scans
- [GxE GWAS](examples/mapping/gxe-gwas/README.md) - genotype-by-environment scans
- [Covariate GWAS](examples/mapping/covariate-gwas/README.md) - covariate-adjusted association
- [Threshold Correction](examples/mapping/threshold-correction/README.md) - multiple-testing thresholds
- [Genomic Control](examples/mapping/genomic-control/README.md) - inflation correction
- [Rare Variant Tests](examples/mapping/rare-variant-tests/README.md) - rare-variant association patterns
- [Epistasis Scan](examples/mapping/epistasis-scan/README.md) - interaction scans
- [CNV Integration](examples/mapping/cnv-integration/README.md) - copy-number variant integration

## QC

- [VCF Validation](examples/qc/vcf-validation/README.md) - genotype file validation
- [SNP Filtering](examples/qc/snp-filtering/README.md) - marker filtering
- [Phenotype Plots](examples/qc/phenotype-plots/README.md) - phenotype distribution checks
- [Sample QC](examples/qc/sample-qc/README.md) - sample-level quality checks
- [SNP Annotation](examples/qc/snp-annotation/README.md) - marker annotation workflows
- [Imputation](examples/qc/imputation/README.md) - missing genotype handling

## Structure

- [Population Structure](examples/structure/population-structure/README.md) - PCA and structure summaries
- [Admixture](examples/structure/admixture/README.md) - ancestry proportions
- [K-Means Clustering](examples/structure/kmeans-clustering/README.md) - cluster assignment
- [LD Decay](examples/structure/ld-decay/README.md) - linkage disequilibrium decay
- [Haplotype Analysis](examples/structure/haplotype-analysis/README.md) - haplotype patterns
- [Pedigree Kinship](examples/structure/pedigree-kinship/README.md) - pedigree relationship matrices
- [Genomic NRM](examples/structure/genomic-nrm/README.md) - genomic relationship matrix
- [Genetic Similarity](examples/structure/genetic-similarity/README.md) - relatedness summaries
- [Deep Clustering](examples/structure/deep-clustering/README.md) - learned clustering examples

## Prediction

- [Genomic Prediction](examples/prediction/genomic-prediction/README.md) - prediction baselines
- [Marker Selection](examples/prediction/marker-selection/README.md) - marker subset workflows
- [BLUP](examples/prediction/blup/README.md) - BLUP-style prediction
- [Bayesian GP](examples/prediction/bayesian-gp/README.md) - Bayesian genomic prediction
- [Elastic Net CV](examples/prediction/elastic-net-cv/README.md) - regularized models
- [Cross Validation](examples/prediction/cross-validation/README.md) - prediction evaluation
- [GxE Prediction](examples/prediction/gxe-prediction/README.md) - genotype-by-environment prediction
- [Backcross Selection](examples/prediction/backcross-selection/README.md) - selection support

## Reporting

- [QMapper Ideogram](examples/reporting/qmapper-ideogram/README.md) - ideogram reports
- [Analysis Report](examples/reporting/analysis-report/README.md) - analysis report packaging
- [Real Dataset](examples/reporting/real-dataset/README.md) - real-data reporting pattern

## Support

- [Visualization Summary](VISUALIZATION_SUMMARY.md) - local visualization research notes
- `scripts/check_system.py` - environment check
- `scripts/install_deps.sh` - dependency installer
- `scripts/qtl_cli.py` - optional helper CLI
- `scripts/verify_gpu_hpc.py` - GPU/HPC readiness check
