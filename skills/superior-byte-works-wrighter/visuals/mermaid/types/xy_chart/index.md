<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# XY Charts

**Best for:** Scatter plots, line charts, bar charts. Visualizing relationships between two variables, trends over time, distributions.

---

## When to Use

- Correlation between two variables (scatter plots)
- Trends over time (line charts)
- Comparisons across categories (bar charts)
- Performance metrics and KPIs
- Experimental results and measurements
- Statistical distributions

## When NOT to Use

- Hierarchical data → use [Mindmap](../mindmap/index.md)
- Proportions of a whole → use [Pie](../pie/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- Time-based project schedules → use [Gantt](../gantt/index.md)

---

## Syntax Reference

```
xychart-beta
  accTitle: Title Here
  accDescr: Description here

  %% Axes
  x-axis [label1, label2, label3]
  y-axis "Y Label" 0 --> 100

  %% Data series
  bar [10, 20, 30]
  line [15, 25, 35]

  %% Or with scatter
  x-axis 0 --> 100
  y-axis 0 --> 100
  scatter [10, 20, 30], [15, 25, 35]
```

**Chart types:**

- `bar` — Vertical bar chart
- `line` — Line chart with points
- `scatter` — Scatter plot (requires x,y pairs)

**Axis options:**

- `x-axis [cat1, cat2, cat3]` — Categorical labels
- `x-axis 0 --> 100` — Numeric range
- `y-axis "Label" 0 --> 100` — With label

**Multiple series:**

- Add multiple `bar` or `line` declarations
- Each creates a new series with different colors

---

## Complexity Levels

| File                               | Series | Use case                      |
| ---------------------------------- | ------ | ----------------------------- |
| [simple.md](simple.md)             | 1      | Single metric, quick view     |
| [intermediate.md](intermediate.md) | 2–3    | Comparison across categories  |
| [advanced.md](advanced.md)         | 3–5    | Multi-series with annotations |

---

## Key Tips

- Choose the right chart type for your data story
- Use bar charts for categorical comparison
- Use line charts for trends over time
- Use scatter plots for correlations
- Label axes clearly with units
- Keep series count to 3–5 for readability

## Anti-Patterns

```
%% ❌ Too many series
xychart-beta
  bar [10, 20]
  bar [15, 25]
  bar [20, 30]
  bar [25, 35]
  bar [30, 40]
  bar [35, 45]  %% Too many — hard to distinguish

%% ✅ Fix: limit to 2–3 key series
xychart-beta
  bar [10, 20]
  line [15, 25]

%% ❌ Mismatched data lengths
xychart-beta
  x-axis [A, B, C]
  bar [10, 20]  %% Missing data point

%% ✅ Fix: match data points to labels
xychart-beta
  x-axis [A, B, C]
  bar [10, 20, 30]

%% ❌ Unclear axis labels
xychart-beta
  x-axis [Q1, Q2, Q3, Q4]
  y-axis 0 --> 1000  %% What units? What metric?

%% ✅ Fix: descriptive labels
xychart-beta
  x-axis [Q1, Q2, Q3, Q4]
  y-axis "Revenue ($K)" 0 --> 1000
```

---

## Parser Gotchas

- Data arrays must match the number of x-axis categories
- Scatter plots require two arrays: x values and y values
- Axis ranges use `-->` not `->`
- Quote axis labels containing spaces or special characters
