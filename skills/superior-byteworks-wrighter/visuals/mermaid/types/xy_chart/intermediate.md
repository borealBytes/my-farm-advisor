<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# XY Chart — Intermediate (2–3 series)

Multiple data series for comparison. Use for showing relationships between different metrics.

---

## Example: Revenue vs Target

```mermaid
xychart-beta
  accTitle: Quarterly Performance vs Target
  accDescr: Comparison of actual revenue against targets by quarter

  x-axis [Q1, Q2, Q3, Q4]
  y-axis "Amount ($M)" 0 --> 10
  bar [4.2, 5.8, 7.1, 8.5]
  line [5.0, 6.0, 7.5, 9.0]
```

---

## Example: Multi-Region Sales

```mermaid
xychart-beta
  accTitle: Sales by Region and Quarter
  accDescr: Comparison of sales performance across three regions over four quarters

  x-axis [Q1, Q2, Q3, Q4]
  y-axis "Sales ($M)" 0 --> 8
  bar [3.2, 4.1, 5.3, 6.2]
  bar [2.8, 3.5, 4.2, 5.1]
  bar [1.9, 2.4, 3.1, 3.8]
```

---

## Example: Performance Metrics Over Time

```mermaid
xychart-beta
  accTitle: System Performance Metrics
  accDescr: Comparison of throughput, latency, and error rate over time

  x-axis [Week_1, Week_2, Week_3, Week_4, Week_5, Week_6]
  y-axis "Throughput (req/s)" 0 --> 1000
  line [450, 520, 580, 640, 720, 850]
  line [400, 480, 550, 600, 680, 780]
```

---

## Example: Correlation Analysis

```mermaid
xychart-beta
  accTitle: Marketing Spend vs Revenue
  accDescr: Scatter plot showing relationship between marketing spend and revenue

  x-axis "Marketing Spend ($K)" 0 --> 100
  y-axis "Revenue ($K)" 0 --> 500
  scatter [10, 20, 30, 40, 50, 60, 70, 80, 90, 100], [45, 85, 120, 165, 210, 245, 290, 340, 385, 450]
```

---

## Copy-Paste Template

```mermaid
xychart-beta
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  x-axis [Period_1, Period_2, Period_3, Period_4, Period_5]
  y-axis "Metric Name (Units)" 0 --> 100

  %% Series 1: Actual values
  bar [20, 35, 50, 65, 80]

  %% Series 2: Target or comparison
  line [25, 40, 55, 70, 85]
```

---

## Tips

- Use different chart types (bar + line) to distinguish series
- Keep to 2–3 series for readability
- Ensure series are comparable (same units, similar scales)
- Use consistent colors by keeping the same order
- Consider using line charts for targets/benchmarks
- Bar charts work well for actuals, lines for trends
