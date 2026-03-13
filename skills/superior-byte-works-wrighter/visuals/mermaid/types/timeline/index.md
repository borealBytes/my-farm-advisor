<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Timeline Diagrams

**Best for:** Chronological events, project milestones, historical data, roadmaps.

---

## When to Use

- Project roadmaps and milestones
- Historical event sequences
- Product release timelines
- Personal/career history
- Process evolution over time
- Event planning schedules

## When NOT to Use

- Task scheduling with durations → use [Gantt](../gantt/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- State transitions → use [State](../state/index.md)
- Complex dependencies → use [Gantt](../gantt/index.md)

---

## Syntax Reference

```
timeline
 accTitle: Title Here
 accDescr: Description here

 section Section Name
 event : description
 event : description

 section Another Section
 event : description
```

**Structure:**

- `section` — groups events by category or time period
- `event : description` — event with details
- Multiple sections create parallel tracks

---

## Complexity Levels

| File                               | Events | Use case                             |
| ---------------------------------- | ------ | ------------------------------------ |
| [simple.md](simple.md)             | 3–6    | Single track, few events             |
| [intermediate.md](intermediate.md) | 6–12   | Multi-section timeline               |
| [advanced.md](advanced.md)         | 12–20  | Complex roadmap with parallel tracks |

---

## Key Tips

- Use sections to group related events
- Keep event names short (1–4 words)
- Use emojis for quick visual scanning
- Chronological order within sections
- Parallel sections for different tracks (teams, products)

## Anti-Patterns

```
%% ❌ Too many events in one section
timeline
 section 2024
 Event 1 : desc
 Event 2 : desc
 Event 3 : desc
 Event 4 : desc
 Event 5 : desc
 Event 6 : desc
 Event 7 : desc
 Event 8 : desc

%% ✅ Fix: split into sections
timeline
 section Q1
 Event 1 : desc
 Event 2 : desc
 section Q2
 Event 3 : desc
 Event 4 : desc

%% ❌ Verbose descriptions
timeline
 section Project
 Launch : This is a very long description that makes the timeline hard to read

%% ✅ Fix: concise descriptions
timeline
 section Project
 Launch : v1.0 released to production
```

---

## Parser Gotchas

- Section names cannot contain special characters
- Event and description separated by colon
- Empty sections may not render
- Order matters — events display in definition order
