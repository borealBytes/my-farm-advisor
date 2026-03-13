<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Quadrant Chart — Simple (2–4 points)

Basic 2x2 positioning. Use for simple prioritization and strategic positioning.

---

## Example: Effort vs Impact

```mermaid
quadrantChart
 accTitle: Feature Prioritization Matrix
 accDescr: Simple effort vs impact matrix for feature prioritization

 x-axis Low Effort --> High Effort
 y-axis Low Impact --> High Impact

 quadrant-1 Quick Wins
 quadrant-2 High Impact
 quadrant-3 Low Priority
 quadrant-4 Major Projects

 Dark mode: [0.2, 0.8]
 API v2: [0.8, 0.9]
 Bug fixes: [0.3, 0.3]
 Rewrite: [0.9, 0.4]
```

---

## Example: Risk Assessment

```mermaid
quadrantChart
 accTitle: Risk Assessment Matrix
 accDescr: Risk assessment showing probability vs impact of various risks

 x-axis Low Probability --> High Probability
 y-axis Low Impact --> High Impact

 quadrant-1 Critical Risks
 quadrant-2 Monitor
 quadrant-3 Acceptable
 quadrant-4 Prepare

 Data breach: [0.3, 0.9]
 Vendor outage: [0.7, 0.6]
 Staff turnover: [0.5, 0.4]
 Minor bugs: [0.8, 0.2]
```

---

## Example: Price vs Quality

```mermaid
quadrantChart
 accTitle: Market Positioning
 accDescr: Competitive positioning based on price and quality

 x-axis Low Price --> High Price
 y-axis Low Quality --> High Quality

 quadrant-1 Premium
 quadrant-2 Value
 quadrant-3 Budget
 quadrant-4 Overpriced

 Our Product: [0.6, 0.8]
 Competitor A: [0.3, 0.4]
 Competitor B: [0.8, 0.7]
 Competitor C: [0.2, 0.2]
```

---

## Copy-Paste Template

```mermaid
quadrantChart
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this chart shows

 x-axis Low X --> High X
 y-axis Low Y --> High Y

 quadrant-1 Top Right
 quadrant-2 Top Left
 quadrant-3 Bottom Left
 quadrant-4 Bottom Right

 Item A: [0.2, 0.8]
 Item B: [0.8, 0.9]
 Item C: [0.3, 0.3]
 Item D: [0.9, 0.2]
```

---

## Tips

- 2–4 points is ideal for simple charts
- Use descriptive point names
- Label axes with what they measure
- Give quadrants meaningful names
- Keep coordinates between 0 and 1
