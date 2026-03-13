<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Treemap Diagrams

**Best for:** Hierarchical data, file system visualization, budget breakdowns, proportional data with hierarchy.

---

## When to Use

- Hierarchical data visualization
- File system layouts
- Budget breakdowns by category
- Disk usage analysis
- Market share by segment
- Resource allocation

## When NOT to Use

- Simple proportions → use [Pie](../pie/index.md)
- Time-series → use [Gantt](../gantt/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- Flat categories → use [Bar Chart](../xy_chart/index.md)

---

## Syntax Reference

```
treemap
 accTitle: Title Here
 accDescr: Description here

 root["Root"]
  branch1["Branch 1"]
   leaf1["Leaf 1"]
   leaf2["Leaf 2"]
  branch2["Branch 2"]
   leaf3["Leaf 3"]
```

**Structure:**

- `root["Label"]` — root node
- Indentation shows hierarchy
- Values can be included in labels

---

## Complexity Levels

| File                               | Nodes | Use case          |
| ---------------------------------- | ----- | ----------------- |
| [simple.md](simple.md)             | 3–6   | Simple hierarchy  |
| [intermediate.md](intermediate.md) | 6–12  | Multi-level data  |
| [advanced.md](advanced.md)         | 12–20 | Complex hierarchy |

---

## Key Tips

- Keep hierarchy depth ≤ 4
- Use meaningful node names
- Include values where relevant
- Group related items
- Balance tree structure

## Anti-Patterns

```
%% ❌ Too deep
treemap
 root
  a
   b
    c
     d
      e

%% ✅ Fix: flatten
treemap
 root
  category_a
   item_1
   item_2
  category_b

%% ❌ Unbalanced tree
treemap
 root
  a
   a1
    a2
     a3
  b

%% ✅ Fix: balance branches
treemap
 root
  a
   a1
   a2
  b
   b1
   b2
```

---

## Parser Gotchas

- Indentation defines hierarchy
- Node names in brackets
- Values in labels
- Depth affects rendering
