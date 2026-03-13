---
name: Abstract Writing
description: Templates and guidance for writing structured and unstructured scientific abstracts
version: 1.0.0
author: Omni Unified Writing
---

# Abstract Writing

The abstract is the most-read part of any paper. Most readers decide whether to read the full paper based on the abstract alone. It must be self-contained, accurate, and compelling.

---

## ## Abstract Types

| Type         | Used by                             | Structure                                                   |
| ------------ | ----------------------------------- | ----------------------------------------------------------- |
| Structured   | Clinical, biomedical, psychology    | Labeled sections (Background, Methods, Results, Conclusion) |
| Unstructured | Physics, math, CS, humanities       | Single paragraph, no labels                                 |
| Graphical    | High-impact journals (Nature, Cell) | Visual + 150-word text                                      |
| Conference   | CS, engineering                     | Problem + approach + results + contribution                 |

---

## ## Structured Abstract Template

```
Background: [1–2 sentences. The problem and why it matters.]

Objective: [1 sentence. The specific research question or hypothesis.]

Methods: [2–3 sentences. Study design, population/sample, key measures, analysis approach.]

Results: [2–4 sentences. Primary findings with key statistics (effect size, CI, p-value).]

Conclusion: [1–2 sentences. What the findings mean and their implications.]
```

**Example (clinical trial):**

> **Background:** Sepsis-associated acute kidney injury (SA-AKI) affects 40–50% of ICU patients and carries 30-day mortality exceeding 40%. No pharmacological intervention has demonstrated benefit in randomized trials.
>
> **Objective:** To determine whether early continuous renal replacement therapy (CRRT) reduces 28-day mortality compared with standard care in SA-AKI.
>
> **Methods:** We conducted a multicenter, open-label randomized controlled trial across 14 ICUs. Adults with SA-AKI (KDIGO stage 2–3) were randomized 1:1 to early CRRT (within 6 h of diagnosis) or standard care. The primary outcome was 28-day all-cause mortality.
>
> **Results:** Of 612 enrolled patients, 306 were assigned to early CRRT and 306 to standard care. 28-day mortality was 38.2% in the early CRRT group vs. 41.5% in the standard care group (RR 0.92, 95% CI 0.76–1.11; p = 0.38).
>
> **Conclusion:** Early CRRT did not significantly reduce 28-day mortality in SA-AKI. These findings do not support routine early CRRT initiation in this population.

---

## ## Unstructured Abstract Template

```
[Opening sentence: the problem or gap — 1 sentence]
[Context: why this matters — 1–2 sentences]
[What you did: approach and methods — 2–3 sentences]
[What you found: key results with numbers — 2–3 sentences]
[What it means: conclusion and implications — 1–2 sentences]
```

**Example (machine learning):**

> Transformer language models achieve strong performance on reasoning benchmarks, yet their behavior on novel compositional tasks remains poorly understood. We investigate whether in-context learning (ICL) in large language models (LLMs) generalizes to systematic compositional structures absent from pretraining data. We construct COMPSYS, a benchmark of 12,000 compositional reasoning tasks across four domains, and evaluate 8 LLMs ranging from 7B to 70B parameters. Models achieve near-chance performance (52.3 ± 4.1%) on held-out compositional structures, even when individual components are solved correctly (91.7 ± 2.3%). Performance does not improve with chain-of-thought prompting or increased model scale. These results suggest that current LLMs do not acquire systematic compositionality through scale alone, motivating architectural or training innovations that explicitly support compositional generalization.

---

## ## Conference Abstract Template

```
[Problem: 1–2 sentences on the gap or challenge]
[Approach: 2–3 sentences on your method/system/algorithm]
[Results: 2–3 sentences on empirical findings with numbers]
[Contribution: 1 sentence on what this enables or changes]
```

**Example (systems paper):**

> Distributed key-value stores sacrifice consistency for availability under network partitions, forcing application developers to reason about stale reads. We present Tempo, a key-value store that provides causal consistency with bounded staleness guarantees using a novel hybrid logical clock protocol. Tempo achieves 98th-percentile read latency of 1.2 ms and write latency of 2.8 ms on a 5-node cluster, within 15% of eventually consistent baselines. Under simulated WAN partitions, Tempo maintains causal consistency with a maximum staleness bound of 50 ms, compared to unbounded staleness in Cassandra. Tempo enables application developers to write causally consistent code without sacrificing the performance characteristics of eventual consistency.

---

## ## Common Errors

| Error                                       | Fix                                                         |
| ------------------------------------------- | ----------------------------------------------------------- |
| Vague opening ("This paper studies...")     | State the problem directly                                  |
| No numbers in Results                       | Include effect size, CI, p-value, or accuracy               |
| Conclusions not supported by stated results | Align conclusion with the specific results reported         |
| Exceeding word limit                        | Cut background; results and conclusion are highest priority |
| Introducing abbreviations not used again    | Define only abbreviations used ≥2 times                     |
| Citing references                           | Abstracts are self-contained — no citations                 |

---

## ## Word Count by Venue

| Venue                     | Limit         |
| ------------------------- | ------------- |
| NIH grant (Specific Aims) | 1 page        |
| NEJM / Lancet             | 250 words     |
| PLOS ONE                  | 300 words     |
| NeurIPS / ICML            | 150–200 words |
| Nature / Science          | 150 words     |
| Conference poster         | 250–350 words |

---

## ## Revision Checklist

- [ ] Self-contained — no undefined abbreviations, no citations
- [ ] Objective stated explicitly (not implied)
- [ ] Results include quantitative data
- [ ] Conclusion follows from stated results
- [ ] Within word limit
- [ ] Matches the paper (no results in abstract not in paper)
- [ ] Active voice where possible

---

## ## See Also

- [manuscript-structure.md](manuscript-structure.md) — Full IMRAD structure
- [results-section.md](results-section.md) — How to report results with statistics
- [../../templates/scientific/grant_proposal.md](../../templates/scientific/grant_proposal.md) — Grant abstract (Specific Aims)
