<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Flowchart Diagrams

**Best for:** Steps in a process, decision trees, conditional logic, pipelines.

---

## When to Use

- Sequential steps with decisions
- CI/CD pipelines and deployment flows
- Business process documentation
- Algorithm visualization
- User onboarding flows

## When NOT to Use

- Time-ordered messages between actors → use [Sequence](../sequence/index.md)
- Status transitions → use [State](../state/index.md)
- Data relationships → use [ER](../er/index.md)

---

## Syntax Reference

```
flowchart [direction]
    accTitle: Title Here
    accDescr: Description here

    node_id[Label text]
    node_id --> other_node
    node_id -->|Edge label| other_node
    node_id{Decision?} -->|Yes| yes_node
    node_id{Decision?} -->|No| no_node
```

**Directions:** `LR` (left→right), `TB` (top→bottom), `RL`, `BT`

**Node shapes:**

- `[text]` — rectangle (process/action)
- `{text}` — diamond (decision)
- `([text])` — rounded rectangle (start/end)
- `[(text)]` — cylinder (database)
- `[[text]]` — subroutine
- `{{text}}` — hexagon (preparation)
- `>text]` — asymmetric (event/trigger)

---

## Complexity Levels

| File                               | Nodes | Use case                        |
| ---------------------------------- | ----- | ------------------------------- |
| [simple.md](simple.md)             | 1–10  | Single process, quick reference |
| [intermediate.md](intermediate.md) | 10–20 | Multi-step with decisions       |
| [advanced.md](advanced.md)         | 20–30 | Full pipeline with subgraphs    |

---

## Key Tips

- Use `LR` for pipelines and timelines; `TB` for hierarchies and decision trees
- Wrap `end` in quotes: `["End"]` — the word `end` breaks the parser
- Keep edge labels to 1–4 words
- Use subgraphs to group related steps when node count exceeds 10
- Diamond `{text}` for decisions, rectangle `[text]` for actions — be consistent

## Anti-Patterns

```
%% ❌ Using 'end' as a node ID
end --> done

%% ✅ Fix: quote it or rename
["End"] --> done
end_state --> done

%% ❌ Verbose edge labels
A -->|This is a very long edge label that is hard to read| B

%% ✅ Fix: concise labels
A -->|All tests pass| B
```

---

## Parser Gotchas

- The word `end` as a node ID breaks parsing — use `["End"]` or `end_node`
- Avoid special characters in node IDs — use `snake_case`
- Subgraph IDs must be unique across the diagram
