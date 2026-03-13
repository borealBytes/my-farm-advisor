<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Radar Diagrams

**Best for:** Multi-dimensional comparisons, skill assessments, capability matrices, performance profiles, feature comparisons.

---

## When to Use

- Skill or competency assessments
- Product feature comparisons
- Performance benchmarking
- Multi-dimensional data visualization
- Team capability mapping
- Technology stack evaluations

## When NOT to Use

- Single-dimensional data → use [Pie](../pie/index.md) or [XY Chart](../xy_chart/index.md)
- Time-series data → use [Timeline](../timeline/index.md) or [Gantt](../gantt/index.md)
- Hierarchical data → use [Mindmap](../mindmap/index.md) or [Treemap](../treemap/index.md)
- Network relationships → use [Network](../network/index.md)

---

## Syntax Reference

```
radar
  accTitle: Title Here
  accDescr: Description here

  title Radar Chart Title

  axis "Dimension1"
  axis "Dimension2"
  axis "Dimension3"

  data "Series1" {
    value 80
    value 60
    value 90
  }

  data "Series2" {
    value 70
    value 85
    value 75
  }
```

**Key Elements:**

- `title` — chart title
- `axis "Name"` — defines a dimension/category
- `data "SeriesName"` — defines a data series
- `value N` — value for the corresponding axis (0–100)

---

## Complexity Levels

| File                               | Axes | Use case                              |
| ---------------------------------- | ---- | ------------------------------------- |
| [simple.md](simple.md)             | 3–5  | Single series, basic comparison       |
| [intermediate.md](intermediate.md) | 5–8  | Multiple series, competitive analysis |
| [advanced.md](advanced.md)         | 8–12 | Complex multi-layer assessments       |

---

## Key Tips

- Keep axis labels short (1–3 words)
- Use consistent scales (0–100 recommended)
- Limit to 3–4 series for readability
- Order axes logically (clockwise from top)
- Use contrasting colors for different series

## Anti-Patterns

```
%% ❌ Too many axes
radar
  axis "A"
  axis "B"
  ...
  axis "Z"

%% ✅ Fix: Group related dimensions
radr
  axis "Performance"
  axis "Security"
  axis "Usability"
  axis "Scalability"

%% ❌ Inconsistent value ranges
data "A" { value 5 }
data "B" { value 500 }

%% ✅ Fix: Normalize to 0–100
data "A" { value 50 }
data "B" { value 75 }
```

---

## Parser Gotchas

- Axis count must match value count in each series
- Values should be numeric (decimals okay)
- Axis names must be quoted if they contain spaces
- Maximum practical axes is around 12
