<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Block Diagrams

**Best for:** Hardware systems, component hierarchies, modular designs, system decomposition.

---

## When to Use

- Hardware system architecture
- Component hierarchies
- Modular system design
- System decomposition
- Interface definitions
- Component relationships

## When NOT to Use

- Software architecture → use [Architecture](../architecture/index.md) or [C4](../c4/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- Class hierarchies → use [Class](../class/index.md)
- Network topology → use [Network](../network/index.md)

---

## Syntax Reference

```
block-beta
 accTitle: Title Here
 accDescr: Description here

 columns 3

 block:group1:3
  element1
  element2
 end

 block:group2:2
  element3
  element4
 end

 element1 --> element3
```

**Structure:**

- `columns N` — define number of columns
- `block:name:N` — create group spanning N columns
- `element` — component within block
- `element1 --> element2` — connection

---

## Complexity Levels

| File                               | Blocks | Use case                       |
| ---------------------------------- | ------ | ------------------------------ |
| [simple.md](simple.md)             | 2–4    | Simple component relationships |
| [intermediate.md](intermediate.md) | 4–8    | Modular system design          |
| [advanced.md](advanced.md)         | 8–12   | Complex hardware systems       |

---

## Key Tips

- Use columns to control layout
- Group related components in blocks
- Show data flow with arrows
- Keep block names descriptive
- Use consistent sizing

## Anti-Patterns

```
%% ❌ Too many columns
block-beta
columns 10

%% ✅ Fix: fewer columns, better grouping
block-beta
columns 3

%% ❌ Unbalanced blocks
block:group1:1
 element1
end
block:group2:5
 element2
end

%% ✅ Fix: balanced sizing
block:group1:2
 element1
end
block:group2:2
 element2
end
```

---

## Parser Gotchas

- Column count must be defined
- Block spans cannot exceed columns
- Arrows connect elements, not blocks
- Proper end statements required
