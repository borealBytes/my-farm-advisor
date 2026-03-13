<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Quadrant Chart — Advanced (8–12 points)

Complex strategic analysis. Use for comprehensive planning and multi-dimensional analysis.

---

## Example: Product Portfolio

```mermaid
quadrantChart
 accTitle: Product Portfolio Analysis
 accDescr: Complete product portfolio mapped by market growth and competitive position

 x-axis Low Growth --> High Growth
 y-axis Weak Position --> Strong Position

 quadrant-1 Stars
 quadrant-2 Question Marks
 quadrant-3 Dogs
 quadrant-4 Cash Cows

 Product A: [0.8, 0.9]
 Product B: [0.7, 0.8]
 Product C: [0.9, 0.7]
 New Feature X: [0.8, 0.4]
 Experiment Y: [0.7, 0.3]
 Beta Z: [0.6, 0.4]
 Legacy 1: [0.2, 0.8]
 Legacy 2: [0.3, 0.7]
 Legacy 3: [0.2, 0.2]
 Deprecated: [0.3, 0.1]
 Maintenance: [0.1, 0.6]
```

---

## Example: Initiative Planning

```mermaid
quadrantChart
 accTitle: Strategic Initiative Planning
 accDescr: Strategic initiatives mapped by resource requirements and strategic value

 x-axis Low Resources --> High Resources
 y-axis Low Value --> High Value

 quadrant-1 Quick Wins
 quadrant-2 Strategic
 quadrant-3 Low Priority
 quadrant-4 Major Bets

 Auth improvements: [0.2, 0.8]
 UI polish: [0.3, 0.7]
 Performance: [0.4, 0.8]
 Mobile app: [0.9, 0.9]
 AI features: [0.8, 0.8]
 Platform rewrite: [0.9, 0.7]
 Bug backlog: [0.2, 0.3]
 Documentation: [0.3, 0.2]
 Refactoring: [0.4, 0.3]
 New market: [0.8, 0.5]
 Acquisition: [0.9, 0.6]
 Partnership: [0.7, 0.4]
```

---

## Example: Team Skills

```mermaid
quadrantChart
 accTitle: Team Skills Assessment
 accDescr: Team skills mapped by current level vs business importance

 x-axis Low Importance --> High Importance
 y-axis Low Skill --> High Skill

 quadrant-1 Strengths
 quadrant-2 Opportunities
 quadrant-3 Low Priority
 quadrant-4 Gaps

 React: [0.9, 0.9]
 TypeScript: [0.8, 0.9]
 Testing: [0.8, 0.8]
 DevOps: [0.9, 0.7]
 GraphQL: [0.7, 0.8]
 Design: [0.6, 0.7]
 AI/ML: [0.8, 0.4]
 Mobile: [0.7, 0.3]
 Security: [0.9, 0.5]
 Performance: [0.7, 0.6]
 Legacy: [0.3, 0.8]
 Documentation: [0.4, 0.7]
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
 Item 3: [0.4, 0.9]
 Item 4: [0.8, 0.9]
 Item 5: [0.9, 0.8]
 Item 6: [0.9, 0.7]
 Item 7: [0.2, 0.2]
 Item 8: [0.3, 0.3]
 Item 9: [0.7, 0.4]
 Item 10: [0.8, 0.3]
 Item 11: [0.9, 0.2]
```

---

## Tips

- At 8+ points, consider grouping by category
- Use consistent positioning logic
- Review positions with stakeholders
- Consider creating multiple focused charts instead
- Document the rationale for each position
