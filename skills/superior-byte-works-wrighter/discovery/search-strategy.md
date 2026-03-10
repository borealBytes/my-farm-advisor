---
name: Literature Search Strategy
description: Systematic approach to searching academic databases for literature reviews
version: 1.0.0
author: Omni Unified Writing
---

# Literature Search Strategy

A systematic search strategy ensures comprehensive, reproducible literature retrieval. Ad hoc searching misses key papers and introduces selection bias.

---

## ## Search Planning

Before searching, define:

1. **Research question** — Use PICO or SPIDER framework
2. **Databases** — Select based on domain
3. **Date range** — Justify any restrictions
4. **Language** — Justify any restrictions
5. **Study types** — What designs are eligible?

### PICO Framework (clinical/health)

| Element          | Question     | Example                        |
| ---------------- | ------------ | ------------------------------ |
| **P**opulation   | Who?         | Adults with type 2 diabetes    |
| **I**ntervention | What?        | SGLT2 inhibitors               |
| **C**omparison   | Compared to? | Placebo or other antidiabetics |
| **O**utcome      | What result? | Cardiovascular mortality       |

### SPIDER Framework (qualitative)

| Element                        | Question                        |
| ------------------------------ | ------------------------------- |
| **S**ample                     | Who are the participants?       |
| **P**henomenon of **I**nterest | What is being studied?          |
| **D**esign                     | What study design?              |
| **E**valuation                 | What outcomes/measures?         |
| **R**esearch type              | Qualitative/quantitative/mixed? |

---

## ## Database Selection by Domain

| Domain                | Primary databases          | Secondary        |
| --------------------- | -------------------------- | ---------------- |
| Biomedical / clinical | PubMed/MEDLINE, Embase     | Cochrane, CINAHL |
| Psychology            | PsycINFO, PubMed           | Web of Science   |
| Computer science      | ACM DL, IEEE Xplore, arXiv | Semantic Scholar |
| Engineering           | IEEE Xplore, Scopus        | Web of Science   |
| Social sciences       | Scopus, Web of Science     | JSTOR            |
| Economics             | EconLit, SSRN              | Scopus           |
| Multidisciplinary     | Web of Science, Scopus     | Google Scholar   |

**Minimum for systematic review:** 2–3 databases. Single-database searches are not acceptable for systematic reviews.

---

## ## Boolean Search Construction

### Building a search string

1. **Identify concepts** from your PICO/SPIDER
2. **Generate synonyms** for each concept (MeSH terms + free text)
3. **Combine within concepts** using OR
4. **Combine across concepts** using AND

**Template:**

```
(concept_1_term1 OR concept_1_term2 OR concept_1_term3)
AND
(concept_2_term1 OR concept_2_term2)
AND
(concept_3_term1 OR concept_3_term2)
```

**Example (SGLT2 inhibitors and cardiovascular outcomes):**

```
("SGLT2 inhibitor*" OR "sodium-glucose cotransporter 2" OR empagliflozin
 OR dapagliflozin OR canagliflozin OR ertugliflozin)
AND
("type 2 diabetes" OR "T2DM" OR "type II diabetes")
AND
("cardiovascular" OR "heart failure" OR "myocardial infarction"
 OR "stroke" OR "MACE" OR "mortality")
```

### Wildcard and truncation

| Symbol  | Function                  | Example                                          |
| ------- | ------------------------- | ------------------------------------------------ |
| `*`     | Truncation (0+ chars)     | `random*` → randomize, randomized, randomization |
| `?`     | Single character wildcard | `wom?n` → woman, women                           |
| `"..."` | Exact phrase              | `"machine learning"`                             |

### Field tags (PubMed)

| Tag      | Field                      |
| -------- | -------------------------- |
| `[MeSH]` | MeSH controlled vocabulary |
| `[tiab]` | Title and abstract         |
| `[au]`   | Author                     |
| `[dp]`   | Publication date           |
| `[pt]`   | Publication type           |

**Example PubMed search:**

```
("SGLT2 inhibitor"[tiab] OR "sodium-glucose cotransporter 2 inhibitor"[MeSH]
 OR empagliflozin[tiab] OR dapagliflozin[tiab])
AND
("type 2 diabetes mellitus"[MeSH] OR "type 2 diabetes"[tiab])
AND
("cardiovascular diseases"[MeSH] OR "heart failure"[tiab] OR "mortality"[tiab])
AND
("randomized controlled trial"[pt] OR "clinical trial"[pt])
```

---

## ## Search Documentation

Document every search for reproducibility:

```markdown
## Search Log

| Database                | Date       | Search string | Filters                 | Results   |
| ----------------------- | ---------- | ------------- | ----------------------- | --------- |
| PubMed                  | 2024-01-15 | [string]      | RCT, 2010–2024, English | 847       |
| Embase                  | 2024-01-15 | [string]      | RCT, 2010–2024, English | 1,203     |
| Cochrane                | 2024-01-15 | [string]      | None                    | 124       |
| **Total**               |            |               |                         | **2,174** |
| **After deduplication** |            |               |                         | **1,891** |
```

---

## ## Supplementary Search Methods

Beyond database searching:

| Method                       | When to use                                               |
| ---------------------------- | --------------------------------------------------------- |
| **Reference list screening** | Screen references of included studies                     |
| **Citation tracking**        | Find papers that cite included studies (forward citation) |
| **Grey literature**          | ClinicalTrials.gov, WHO ICTRP, conference abstracts       |
| **Expert consultation**      | Ask domain experts for key papers                         |
| **Journal hand-searching**   | High-yield journals for narrow topics                     |

---

## ## Search Filters

### Study design filters (validated)

| Design            | PubMed filter                       |
| ----------------- | ----------------------------------- |
| RCT               | `"randomized controlled trial"[pt]` |
| Systematic review | `"systematic review"[pt]`           |
| Meta-analysis     | `"meta-analysis"[pt]`               |
| Cohort study      | `"cohort studies"[MeSH]`            |

Use validated filters from [InterTASC Information Specialists' Sub-Group](https://sites.google.com/a/york.ac.uk/issg-search-filters-resource/).

---

## ## Deduplication

After searching multiple databases, deduplicate using:

- **Endnote** — built-in deduplication
- **Rayyan** — free, web-based, designed for systematic reviews
- **Covidence** — paid, full systematic review workflow

---

## ## See Also

- [systematic-review.md](systematic-review.md) — Full systematic review workflow
- [prisma-template.md](prisma-template.md) — PRISMA flow diagram
- [citation-management.md](citation-management.md) — Managing references
- [synthesis-methods.md](synthesis-methods.md) — Synthesizing evidence
