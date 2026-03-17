<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sankey Diagrams

**Best for:** Flow visualization, energy/material flow, budget allocation, process flows with quantities.

---

## When to Use

- Energy flow diagrams
- Material flow analysis
- Budget allocation flows
- User flow visualization
- Resource distribution
- Process flow with quantities

## When NOT to Use

- Simple proportions → use [Pie](../pie/index.md)
- Hierarchical data → use [Treemap](../treemap/index.md)
- Time-series → use [Gantt](../gantt/index.md) or [XY Chart](../xy_chart/index.md)
- Process steps → use [Flowchart](../flowchart/index.md)

---

## Syntax Reference

```
sankey-beta
 accTitle: Title Here
 accDescr: Description here

 A, B, C
 B, D, 50
 B, E, 30
 C, E, 20
```

**Structure:**

- `Source, Target, Value` — flow from source to target
- Nodes defined implicitly
- Values determine flow width

---

## Complexity Levels

| File                               | Flows | Use case             |
| ---------------------------------- | ----- | -------------------- |
| [simple.md](simple.md)             | 2–4   | Simple flow          |
| [intermediate.md](intermediate.md) | 4–8   | Multi-stage flow     |
| [advanced.md](advanced.md)         | 8–12  | Complex distribution |

---

## Key Tips

- Keep node names short
- Show meaningful quantities
- Minimize crossing flows
- Group related nodes
- Use consistent units

## Anti-Patterns

```
%% ❌ Too many flows
sankey-beta
 A, B, 10
 A, C, 10
 A, D, 10
 ...
 Z, Y, 10

%% ✅ Fix: aggregate where possible
sankey-beta
 Source, Process, 100
 Process, Output A, 60
 Process, Output B, 40

%% ❌ Inconsistent units
sankey-beta
 A, B, 100
 B, C, 0.5

%% ✅ Fix: consistent scale
sankey-beta
 A, B, 100
 B, C, 50
```

---

## Parser Gotchas

- Values must be numeric
- Node names case-sensitive
- Flows are directional
- Totals should balance
