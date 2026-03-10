---
name: Methods Section Writing
description: Guide for writing reproducible, complete Methods sections in scientific manuscripts
version: 1.0.0
author: Omni Unified Writing
---

# Methods Section Writing

The Methods section is the reproducibility contract of your paper. A reader with domain expertise must be able to replicate your study from the Methods alone. Every decision that could affect the results must be documented.

---

## ## Reproducibility Standard

> "If a reader cannot reproduce your study from the Methods, the Methods are incomplete."

This applies to:

- Sample selection and exclusion criteria
- Instrument settings and calibration
- Software versions and random seeds
- Statistical analysis decisions made before seeing results

---

## ## Standard Subsections

### 1. Study Design and Setting

State the design type first, then the setting.

**Template:**

```
We conducted a [design type] at/in [setting] between [dates].
```

**Design types:**

- Randomized controlled trial (RCT)
- Prospective cohort study
- Case-control study
- Cross-sectional survey
- Systematic review and meta-analysis
- In vitro / in vivo experiment
- Computational study

**Example:**

> We conducted a double-blind, placebo-controlled randomized trial at three academic medical centers in the United States between January 2022 and December 2023.

---

### 2. Participants / Subjects / Materials

**For human studies:**

```
Inclusion criteria:
- [Criterion 1]
- [Criterion 2]

Exclusion criteria:
- [Criterion 1]
- [Criterion 2]

Recruitment: [How participants were identified and approached]
Consent: [IRB approval number; consent process]
```

**For animal studies (ARRIVE guidelines):**

- Species, strain, sex, age, weight
- Housing conditions (temperature, light cycle, group size)
- Ethical approval statement

**For computational studies:**

- Dataset name, version, source, access date
- Train/validation/test split
- Preprocessing steps

---

### 3. Procedures / Interventions

Describe in chronological order. Use past tense. Be specific about:

- Doses, concentrations, volumes
- Timing and duration
- Equipment (manufacturer, model, settings)
- Blinding procedures

**Example (clinical):**

> Participants received either intravenous remdesivir 200 mg on day 1 followed by 100 mg on days 2–5, or an identical-appearing placebo. Study drug was prepared by an unblinded pharmacist; all clinical staff and participants were blinded to assignment. Infusions were administered over 30–60 minutes.

**Example (computational):**

> We fine-tuned LLaMA-3-8B (Meta AI, 2024) using LoRA (rank 16, alpha 32) on the training split for 3 epochs with a learning rate of 2×10⁻⁴, cosine schedule, and batch size 32. Training used 4× A100 80 GB GPUs with mixed precision (bfloat16). Random seed was fixed at 42 for all experiments.

---

### 4. Outcome Measures

**Primary outcome:** State exactly one primary outcome, defined prospectively.

**Secondary outcomes:** List in order of priority.

For each outcome, specify:

- Definition (operational, not conceptual)
- Measurement instrument and its validity
- Timing of measurement
- Who assessed it (blinded?)

**Example:**

> The primary outcome was 28-day all-cause mortality, ascertained by medical record review and vital status registry linkage. Secondary outcomes were ICU-free days at day 28, ventilator-free days at day 28, and serious adverse events (SAEs) as defined by ICH E6(R2).

---

### 5. Statistical Analysis

**Pre-registration:** State whether the analysis plan was pre-registered and where.

**Template:**

```
Primary analysis: [Test/model] comparing [outcome] between [groups].
We used [software, version] for all analyses. Statistical significance was defined as two-sided p < 0.05.
Sample size: We calculated that [N] participants per group would provide [power]% power to detect [effect size] with α = [alpha].
Missing data: [Complete case / multiple imputation / other approach].
```

**Reporting standards:**

- Report effect sizes with 95% confidence intervals, not just p-values
- For regression: report coefficients, standard errors, and model fit statistics
- For machine learning: report mean ± SD across cross-validation folds

**Example:**

> The primary analysis used a log-rank test comparing 28-day survival between groups, with hazard ratio estimated by Cox proportional hazards regression adjusted for age, sex, and APACHE II score. We used R 4.3.1 (R Core Team, 2023) with the `survival` package. Statistical significance was defined as two-sided p < 0.05. We calculated that 300 participants per group would provide 80% power to detect a hazard ratio of 0.75 (α = 0.05, assuming 40% event rate in the control group). Missing data were handled by multiple imputation (m = 20 imputations) using the `mice` package.

---

## ## Tense and Voice

| Element                        | Convention                                                        |
| ------------------------------ | ----------------------------------------------------------------- |
| Describing what you did        | Past tense ("We measured...")                                     |
| Describing established methods | Present tense ("The assay detects...")                            |
| Voice                          | Active preferred ("We randomized" not "Patients were randomized") |

---

## ## Common Errors

| Error                                | Fix                                                             |
| ------------------------------------ | --------------------------------------------------------------- |
| "Standard methods were used"         | Cite the specific method and reference                          |
| Missing software versions            | Include version number for all software                         |
| Outcome defined after seeing results | State outcomes were pre-specified; cite registration            |
| No sample size justification         | Include power calculation                                       |
| Vague exclusion criteria             | Be specific ("eGFR < 30 mL/min/1.73 m²" not "renal impairment") |
| Missing IRB/ethics statement         | Required for human and animal studies                           |

---

## ## Methods Checklist

- [ ] Study design stated in first sentence
- [ ] Inclusion and exclusion criteria complete
- [ ] Ethics approval and consent documented
- [ ] All instruments identified (manufacturer, model, version)
- [ ] Primary outcome defined prospectively
- [ ] Statistical analysis plan complete (test, software, sample size)
- [ ] Blinding procedures described
- [ ] Random seed or randomization method stated

---

## ## See Also

- [manuscript-structure.md](manuscript-structure.md) — Full IMRAD structure
- [results-section.md](results-section.md) — Reporting results
- [../../templates/scientific/study_protocol.md](../../templates/scientific/study_protocol.md) — Study protocol template
- [../../research/](../../research/) — Literature review for background
