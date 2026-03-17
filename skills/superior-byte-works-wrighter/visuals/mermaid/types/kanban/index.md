<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Kanban Diagrams

**Best for:** Task boards, workflow visualization, sprint planning, status tracking.

---

## When to Use

- Sprint/task boards
- Workflow visualization
- Status tracking
- Team coordination
- Process flow documentation
- Work in progress limits

## When NOT to Use

- Project timelines → use [Gantt](../gantt/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- State machines → use [State](../state/index.md)
- Time-based schedules → use [Timeline](../timeline/index.md)

---

## Syntax Reference

```
kanban
 accTitle: Title Here
 accDescr: Description here

 Todo
  [Task 1]
  [Task 2]

 In Progress
  [Task 3]

 Done
  [Task 4]
```

**Structure:**

- Column names define sections
- `[Task]` — task card
- `id[Task]` — task with ID
- `[Task]{assigned: Name}` — task with assignment

---

## Complexity Levels

| File                               | Cards | Use case          |
| ---------------------------------- | ----- | ----------------- |
| [simple.md](simple.md)             | 3–6   | Simple task board |
| [intermediate.md](intermediate.md) | 6–12  | Sprint board      |
| [advanced.md](advanced.md)         | 12–20 | Complex workflow  |

---

## Key Tips

- Use standard column names (Todo, In Progress, Done)
- Keep task names concise
- Use IDs for task references
- Show assignments where relevant
- Limit work in progress per column

## Anti-Patterns

```
%% ❌ Too many columns
kanban
 Col1
 Col2
 Col3
 Col4
 Col5
 Col6

%% ✅ Fix: standard columns
kanban
 Todo
 In Progress
 Done

%% ❌ Verbose task names
kanban
 Todo
  [This is a very long task name that is hard to read]

%% ✅ Fix: concise names
kanban
 Todo
  [Implement auth]
  [Add tests]
```

---

## Parser Gotchas

- Column names are case-sensitive
- Task names in brackets
- IDs optional but useful
- Empty columns render fine
