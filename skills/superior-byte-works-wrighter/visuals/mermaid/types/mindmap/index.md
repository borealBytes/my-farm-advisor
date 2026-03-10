<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Mindmaps

**Best for:** Brainstorming, hierarchical information, concept mapping, knowledge organization.

---

## When to Use

- Brainstorming sessions and idea generation
- Organizing hierarchical information
- Documenting system architecture overview
- Knowledge base structure
- Feature breakdown and categorization
- Learning path visualization

## When NOT to Use

- Sequential processes → use [Flowchart](../flowchart/index.md)
- Time-based events → use [Timeline](../timeline/index.md)
- Actor interactions → use [Sequence](../sequence/index.md)
- State transitions → use [State](../state/index.md)
- Deeply nested data (>4 levels becomes unreadable)

---

## Syntax Reference

```
mindmap
 accTitle: Title Here
 accDescr: Description here

 root((Root Node))
  Child1
   Grandchild1
   Grandchild2
  Child2
   Grandchild3
  Child3
```

**Node types:**

- `root((text))` — root node (double parentheses)
- `  Child` — regular node (2 spaces indent)
- `   Grandchild` — deeper level (4 spaces indent)
- `id[text]` — node with custom ID
- `(text)` — rounded node
- `((text))` — double circle node

---

## Complexity Levels

| File                               | Nodes | Use case                         |
| ---------------------------------- | ----- | -------------------------------- |
| [simple.md](simple.md)             | 5–10  | Single concept, quick brainstorm |
| [intermediate.md](intermediate.md) | 10–20 | Multi-category breakdown         |
| [advanced.md](advanced.md)         | 20–30 | Complex system overview          |

---

## Key Tips

- Maximum 4 levels deep (root + 3 children)
- Use emojis on root and first-level nodes
- Keep sibling nodes balanced (similar depth)
- 3–5 children per node is ideal
- Use verbs for processes, nouns for concepts

## Anti-Patterns

```
%% ❌ Too many levels deep
mindmap
 root((Start))
  A
   B
    C
     D
      E
       F  %% Too deep!

%% ✅ Fix: flatten or split
mindmap
 root((Start))
  Category A
   Item 1
   Item 2
  Category B
   Item 3
   Item 4

%% ❌ Unbalanced tree
mindmap
 root((Start))
  A
   A1
    A2
     A3
  B
  C

%% ✅ Fix: balance the structure
mindmap
 root((Start))
  A
   A1
   A2
  B
   B1
   B2
  C
   C1
```

---

## Parser Gotchas

- Indentation must be exact multiples of 2 spaces
- Root node must use double parentheses `((text))`
- No empty lines between nodes (breaks parsing)
- Special characters in nodes may need escaping
