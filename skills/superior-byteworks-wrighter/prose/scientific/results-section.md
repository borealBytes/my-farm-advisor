---
name: Results Section Writing
description: Guide for presenting scientific results clearly, with correct statistical reporting and figure integration
version: 1.0.0
author: Omni Unified Writing
---

# Results Section Writing

The Results section reports what you found — nothing more. Interpretation belongs in the Discussion. Every claim must be supported by a statistic, figure, or table in this section.

---

## ## Core Rules

1. **Report in Methods order** — present outcomes in the same sequence as the Methods
2. **State the result, then cite the figure** — "Accuracy improved by 4.2 pp (Figure 2)" not "Figure 2 shows accuracy"
3. **Include effect sizes and CIs** — p-values alone are insufficient
4. **No interpretation** — "X was higher than Y" not "X was better than Y"
5. **Describe figures in text** — do not rely on captions alone

---

## ## Structure

### Opening: Participant / Sample Flow

For human studies, begin with a CONSORT-style flow:

```
Of [N] screened, [n] were enrolled and [n] completed the study.
[n] were excluded for [reasons]. [n] were randomized to [group A] and [n] to [group B].
Baseline characteristics were similar between groups (Table 1).
```

For computational studies:

```
The dataset comprised [N] examples: [n] training, [n] validation, [n] test.
After preprocessing, [n] examples were retained ([n] excluded for [reason]).
```

---

### Primary Outcome

State the primary outcome result in the first paragraph of Results.

**Template:**

```
[Primary outcome] was [value] in the [intervention] group and [value] in the [control] group
([effect measure] [value], 95% CI [lower]–[upper]; p = [value]).
```

**Example (clinical):**

> 28-day mortality was 38.2% (117/306) in the early CRRT group and 41.5% (127/306) in the standard care group (risk ratio 0.92, 95% CI 0.76–1.11; p = 0.38).

**Example (ML):**

> On the held-out test set, our model achieved 87.3% accuracy (95% CI 85.1–89.5%), compared to 83.1% (95% CI 80.7–85.5%) for the baseline (difference 4.2 pp, p < 0.001).

---

### Secondary Outcomes

Report in a table where possible. Describe the most important findings in text.

**Table format:**

| Outcome              | Intervention (n=306) | Control (n=306) | Effect (95% CI)      | p    |
| -------------------- | -------------------- | --------------- | -------------------- | ---- |
| 28-day mortality     | 38.2%                | 41.5%           | RR 0.92 (0.76–1.11)  | 0.38 |
| ICU-free days        | 14.2 ± 8.1           | 13.8 ± 8.4      | MD 0.4 (−1.1 to 1.9) | 0.60 |
| Ventilator-free days | 18.3 ± 9.2           | 17.9 ± 9.5      | MD 0.4 (−1.3 to 2.1) | 0.65 |

---

### Figures and Tables

**Caption structure:**

```
Figure [N]: [Conclusion stated as a sentence]. [Brief description of what is shown.] [Statistical details if not in text.]
```

**Example:**

> Figure 2: Early CRRT did not reduce 28-day mortality compared with standard care. Kaplan-Meier survival curves for the two groups. Shaded regions indicate 95% confidence intervals. Log-rank p = 0.38.

**Anti-pattern:** "Figure 2: Kaplan-Meier curves." (Describes the figure, not the finding.)

---

### Subgroup Analyses

Report subgroup analyses as exploratory unless pre-specified. Use a forest plot for multiple subgroups.

```
Pre-specified subgroup analyses showed no significant interaction between treatment effect
and [subgroup variable] (p for interaction = [value]; Figure [N]).
```

---

## ## Statistical Reporting Standards

### Continuous outcomes

| Statistic       | Format                    |
| --------------- | ------------------------- |
| Mean ± SD       | "14.2 ± 3.1 days"         |
| Median (IQR)    | "12.0 (8.5–17.3) days"    |
| Mean difference | "MD 2.1 (95% CI 0.8–3.4)" |

### Binary outcomes

| Statistic              | Format                       |
| ---------------------- | ---------------------------- |
| Risk ratio             | "RR 0.92 (95% CI 0.76–1.11)" |
| Odds ratio             | "OR 0.85 (95% CI 0.68–1.06)" |
| Hazard ratio           | "HR 0.88 (95% CI 0.72–1.07)" |
| Number needed to treat | "NNT 31 (95% CI 14–∞)"       |

### Machine learning / AI

| Statistic  | Format                                      |
| ---------- | ------------------------------------------- |
| Accuracy   | "87.3% (95% CI 85.1–89.5%)"                 |
| F1 score   | "F1 = 0.841 ± 0.023 (mean ± SD, 5-fold CV)" |
| AUC-ROC    | "AUC = 0.923 (95% CI 0.901–0.945)"          |
| Perplexity | "PPL = 12.4 ± 0.3"                          |

---

## ## Tense and Voice

| Element            | Convention                          |
| ------------------ | ----------------------------------- |
| Reporting findings | Past tense ("Accuracy was 87.3%")   |
| Describing figures | Present tense ("Figure 2 shows...") |
| Voice              | Active preferred                    |

---

## ## Common Errors

| Error                                   | Fix                                                          |
| --------------------------------------- | ------------------------------------------------------------ |
| "Results were significant"              | Report the actual statistic: "p = 0.03, RR 0.85 (0.73–0.98)" |
| Interpreting in Results                 | Move interpretation to Discussion                            |
| Reporting only p-values                 | Add effect size and confidence interval                      |
| Figure before text description          | Describe in text first, then cite figure                     |
| Reporting unplanned analyses as primary | Label post-hoc analyses explicitly                           |
| Inconsistent decimal places             | Use consistent precision throughout                          |

---

## ## Results Checklist

- [ ] Primary outcome reported first with full statistics
- [ ] Effect sizes and 95% CIs reported for all outcomes
- [ ] Figures cited in text before or alongside description
- [ ] Figure captions state the conclusion, not just the content
- [ ] Subgroup analyses labeled as pre-specified or exploratory
- [ ] No interpretation in Results section
- [ ] Consistent statistical reporting format throughout

---

## ## See Also

- [manuscript-structure.md](manuscript-structure.md) — Full IMRAD structure
- [methods-section.md](methods-section.md) — Methods writing
- [discussion-section.md](discussion-section.md) — Interpreting results
- [../../math/notation/](../../math/notation/) — Statistical notation reference
