<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Quadrant Charts

**Best for:** Prioritization matrices, SWOT analysis, strategic positioning, 2x2 frameworks.

---

## When to Use

- Prioritization (effort vs impact)
- Risk assessment (probability vs impact)
- Strategic positioning (price vs quality)
- SWOT analysis mapping
- Feature prioritization (value vs complexity)
- Stakeholder mapping (power vs interest)

## When NOT to Use

- Time-series data → use [Gantt](../gantt/index.md) or [Timeline](../timeline/index.md)
- Hierarchical data → use [Mindmap](../mindmap/index.md) or [Treemap](../treemap/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- Proportional data → use [Pie](../pie/index.md)

---

## Syntax Reference

```
quadrantChart
 accTitle: Title Here
 accDescr: Description here

 x-axis Low --> High
 y-axis Low --> High

 quadrant-1 Label for top-right
 quadrant-2 Label for top-left
 quadrant-3 Label for bottom-left
 quadrant-4 Label for bottom-right

 Point A: [0.3, 0.8]
 Point B: [0.7, 0.6]
 Point C: [0.5, 0.4]
```

**Structure:**

- `x-axis` — horizontal axis label with direction
- `y-axis` — vertical axis label with direction
- `quadrant-N` — label for each quadrant (1–4)
- `Name: [x, y]` — data point with coordinates (0–1)

---

## Complexity Levels

| File                               | Points | Use case                   |
| ---------------------------------- | ------ | -------------------------- |
| [simple.md](simple.md)             | 2–4    | Basic 2x2 positioning      |
| [intermediate.md](intermediate.md) | 4–8    | Multi-item prioritization  |
| [advanced.md](advanced.md)         | 8–12   | Complex strategic analysis |

---

## Key Tips

- Use consistent scales (0–1 for both axes)
- Label axes clearly with what they represent
- Give quadrants meaningful names
- Use point names that indicate what they represent
- Group related points in the same quadrant

## Anti-Patterns

```
%% ❌ Unclear axis labels
quadrantChart
 x-axis Low --> High
 y-axis Low --> High

%% ✅ Fix: descriptive labels
quadrantChart
 x-axis Low Effort --> High Effort
 y-axis Low Impact --> High Impact

%% ❌ Too many points
quadrantChart
 Item 1: [0.1, 0.1]
 Item 2: [0.2, 0.2]
 ...
 Item 20: [0.9, 0.9]

%% ✅ Fix: focus on key items
quadrantChart
 Quick wins: [0.2, 0.9]
 Major projects: [0.8, 0.9]
 Fill-ins: [0.2, 0.3]
 Thankless: [0.8, 0.2]

%% ❌ Points outside 0–1 range
quadrantChart
 Point: [1.5, 0.8]

%% ✅ Fix: normalize to 0–1
quadrantChart
 Point: [0.9, 0.8]
```

---

## Parser Gotchas

- Coordinates must be between 0 and 1
- Points outside this range may not render
- Axis labels support --> for direction
- Quadrant labels are optional but recommended
