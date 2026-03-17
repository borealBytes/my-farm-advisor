<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Pie Charts

**Best for:** Proportional data, market share, budget allocation, survey results.

---

## When to Use

- Showing parts of a whole (percentages)
- Budget breakdown by category
- Market share comparison
- Survey response distribution
- Resource allocation

## When NOT to Use

- Time-series data → use [Gantt](../gantt/index.md) or [Timeline](../timeline/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- More than 8 categories (becomes unreadable)
- Values that are very similar in size (hard to distinguish)

---

## Syntax Reference

```
pie
 accTitle: Title Here
 accDescr: Description here

 "Label A" : value_a
 "Label B" : value_b
 "Label C" : value_c
```

**Show percentages:** Add `showData` after `pie` keyword

---

## Complexity Levels

| File                               | Slices | Use case                           |
| ---------------------------------- | ------ | ---------------------------------- |
| [simple.md](simple.md)             | 2–4    | Quick proportions, single metric   |
| [intermediate.md](intermediate.md) | 4–6    | Multi-category breakdown           |
| [advanced.md](advanced.md)         | 6–8    | Complex distributions with styling |

---

## Key Tips

- Maximum 8 slices — combine small values into "Other"
- Use `showData` to display percentages
- Order slices by size (largest first) for readability
- Keep labels short (1–3 words)
- Use emojis in labels for quick visual recognition

## Anti-Patterns

```
%% ❌ Too many slices
pie
 "A" : 10
 "B" : 9
 "C" : 8
 "D" : 7
 "E" : 6
 "F" : 5
 "G" : 4
 "H" : 3
 "I" : 2
 "J" : 1

%% ✅ Fix: combine small values
pie
 "A" : 10
 "B" : 9
 "C" : 8
 "D" : 7
 "Other" : 21
```

---

## Parser Gotchas

- Values must be numbers (not percentages)
- Labels must be in quotes
- Duplicate labels will overwrite each other
