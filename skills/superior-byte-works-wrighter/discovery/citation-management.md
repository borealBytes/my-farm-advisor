---
name: Citation Management
description: Guide for managing references, citation styles, and avoiding common citation errors
version: 1.0.0
author: Omni Unified Writing
---

# Citation Management

Accurate citations are a professional obligation. Incorrect citations — wrong authors, wrong years, wrong findings — undermine the credibility of your work and waste readers' time.

---

## ## Reference Manager Comparison

| Tool          | Cost | Best for                 | Key features                                                     |
| ------------- | ---- | ------------------------ | ---------------------------------------------------------------- |
| **Zotero**    | Free | Most users               | Browser extension, Word/Google Docs integration, group libraries |
| **Endnote**   | Paid | Large systematic reviews | Deduplication, advanced search, institutional license common     |
| **Mendeley**  | Free | PDF annotation           | PDF reader, annotation sync                                      |
| **Paperpile** | Paid | Google Docs users        | Seamless Google Docs integration                                 |
| **JabRef**    | Free | LaTeX users              | BibTeX native, open source                                       |

**Recommendation:** Zotero for most use cases. JabRef for LaTeX-heavy workflows.

---

## ## Citation Styles

### APA 7th Edition

**Journal article:**

```
Author, A. A., & Author, B. B. (Year). Title of article. Journal Name, Volume(Issue), pages. https://doi.org/xxxxx
```

**Example:**

```
Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is all you need. Advances in Neural Information Processing Systems, 30, 5998–6008.
```

### Vancouver (numbered)

**Journal article:**

```
[N] Author AA, Author BB. Title of article. Journal Abbrev. Year;Volume(Issue):pages. doi:xxxxx
```

**Example:**

```
[1] Vaswani A, Shazeer N, Parmar N, et al. Attention is all you need. Adv Neural Inf Process Syst. 2017;30:5998-6008.
```

### Nature style

**Journal article:**

```
Author, A. A. et al. Title of article. Journal Name Vol, pages (Year).
```

**Example:**

```
Vaswani, A. et al. Attention is all you need. Adv. Neural Inf. Process. Syst. 30, 5998–6008 (2017).
```

### IEEE

**Journal article:**

```
[N] A. A. Author and B. B. Author, "Title of article," Journal Name, vol. X, no. Y, pp. Z–Z, Month Year, doi: xxxxx.
```

---

## ## In-Text Citation Formats

| Style               | Format         | Example                |
| ------------------- | -------------- | ---------------------- |
| APA                 | (Author, Year) | (Vaswani et al., 2017) |
| Vancouver           | [N]            | [1]                    |
| Nature              | Superscript    | ...as shown¹           |
| Chicago author-date | (Author Year)  | (Vaswani et al. 2017)  |
| MLA                 | (Author page)  | (Vaswani et al. 5998)  |

---

## ## DOI and URL Best Practices

- Always include DOI when available: `https://doi.org/10.xxxx/xxxxx`
- For URLs without DOI, include access date: "Accessed January 15, 2024"
- Use persistent URLs (DOI, PubMed ID) not journal website URLs that may change
- Verify DOIs resolve before submission

---

## ## Common Citation Errors

| Error                                  | Example                                            | Fix                        |
| -------------------------------------- | -------------------------------------------------- | -------------------------- |
| **Citing the abstract, not the paper** | Citing a finding that appears only in the abstract | Read the full paper        |
| **Misattributing findings**            | "Smith (2020) found X" when Smith found Y          | Re-read the cited paper    |
| **Citing secondary sources**           | Citing a review that cites the original            | Find and cite the original |
| **Wrong year**                         | Citing 2019 paper as 2020                          | Check the publication date |
| **Missing authors**                    | "et al." when there are only 2 authors             | List all authors when ≤ 6  |
| **Citing retracted papers**            | Citing a paper that has been retracted             | Check Retraction Watch     |
| **Self-plagiarism**                    | Copying your own previous text without citation    | Cite your own prior work   |

---

## ## Checking for Retractions

Before citing a paper, verify it has not been retracted:

1. **Retraction Watch Database:** [retractionwatch.com](https://retractionwatch.com)
2. **PubMed:** Look for "Retraction of Publication" notice
3. **CrossRef:** Check DOI metadata
4. **Publisher website:** Look for retraction notice on article page

---

## ## BibTeX Format (LaTeX)

```bibtex
@article{vaswani2017attention,
  title     = {Attention is all you need},
  author    = {Vaswani, Ashish and Shazeer, Noam and Parmar, Niki
               and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N
               and Kaiser, {\L}ukasz and Polosukhin, Illia},
  journal   = {Advances in Neural Information Processing Systems},
  volume    = {30},
  pages     = {5998--6008},
  year      = {2017}
}
```

**Key fields:**

- `title` — Use sentence case (capitalize only first word and proper nouns)
- `author` — Separate authors with `and`; use `{...}` for special characters
- `journal` — Full journal name (abbreviate only if required by style)
- `doi` — Include when available

---

## ## Citation Checklist

Before submitting:

- [ ] Every factual claim has a citation
- [ ] All citations verified against the original source
- [ ] No retracted papers cited
- [ ] DOIs included for all journal articles
- [ ] Citation style consistent throughout
- [ ] Reference list matches in-text citations (no orphans, no missing)
- [ ] Author names spelled correctly
- [ ] Years verified

---

## ## Zotero Quick Reference

| Action                 | Shortcut                  |
| ---------------------- | ------------------------- |
| Add item by DOI        | Ctrl+Shift+I (magic wand) |
| Add item from browser  | Click browser extension   |
| Insert citation (Word) | Ctrl+Alt+A                |
| Insert bibliography    | Ctrl+Alt+B                |
| Change citation style  | Document preferences      |
| Sync library           | Ctrl+Shift+S              |

---

## ## See Also

- [search-strategy.md](search-strategy.md) — Finding papers to cite
- [systematic-review.md](systematic-review.md) — Managing citations in systematic reviews
- [../../prose/scientific/manuscript-structure.md](../../prose/scientific/manuscript-structure.md) — Where citations go in manuscripts
- [../../references/](../../references/) — Reference materials
