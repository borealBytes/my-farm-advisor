<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Quadrant Chart — Intermediate (4–8 points)

Multi-item prioritization. Use for team planning and strategic analysis.

---

## Example: Feature Roadmap

```mermaid
quadrantChart
 accTitle: Feature Roadmap Prioritization
 accDescr: Comprehensive feature prioritization across effort and impact dimensions

 x-axis Low Effort --> High Effort
 y-axis Low Impact --> High Impact

 quadrant-1 Quick Wins
 quadrant-2 Strategic
 quadrant-3 Low Priority
 quadrant-4 Major Initiatives

 Dark mode: [0.2, 0.8]
 Export PDF: [0.3, 0.7]
 Mobile app: [0.8, 0.9]
 API rewrite: [0.9, 0.8]
 Bug fixes: [0.2, 0.3]
 Tech debt: [0.4, 0.2]
 Analytics: [0.7, 0.6]
 Integrations: [0.8, 0.5]
```

---

## Example: Stakeholder Mapping

```mermaid
quadrantChart
 accTitle: Stakeholder Power Interest Matrix
 accDescr: Stakeholder mapping based on power and interest levels

 x-axis Low Interest --> High Interest
 y-axis Low Power --> High Power

 quadrant-1 Keep Satisfied
 quadrant-2 Manage Closely
 quadrant-3 Monitor
 quadrant-4 Keep Informed

 CEO: [0.8, 0.9]
 CTO: [0.9, 0.8]
 Users: [0.9, 0.3]
 Investors: [0.6, 0.9]
 Team leads: [0.7, 0.6]
 Regulators: [0.3, 0.8]
 Partners: [0.5, 0.5]
```

---

## Example: Technical Debt

```mermaid
quadrantChart
 accTitle: Technical Debt Assessment
 accDescr: Technical debt items mapped by effort to fix vs impact on system

 x-axis Low Effort --> High Effort
 y-axis Low Impact --> High Impact

 quadrant-1 Fix Now
 quadrant-2 Critical
 quadrant-3 Ignore
 quadrant-4 Plan

 Test coverage: [0.3, 0.8]
 Dependencies: [0.4, 0.7]
 Architecture: [0.9, 0.9]
 Database: [0.8, 0.8]
 Documentation: [0.2, 0.3]
 Legacy code: [0.7, 0.4]
 Security: [0.5, 0.9]
 Performance: [0.6, 0.6]
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

 Item 1: [0.2, 0.9]
 Item 2: [0.3, 0.8]
 Item 3: [0.8, 0.9]
 Item 4: [0.9, 0.8]
 Item 5: [0.2, 0.2]
 Item 6: [0.3, 0.3]
 Item 7: [0.7, 0.4]
 Item 8: [0.9, 0.2]
```

---

## Tips

- Group related items in the same quadrant
- Use consistent naming conventions
- 4–8 points provides good coverage
- Consider color coding by category if supported
- Review and adjust positions based on team input
