<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Gantt Diagrams

**Best for:** Project timelines, roadmaps, sprint planning, release schedules, dependency tracking.

---

## When to Use

- Project roadmaps and milestones
- Sprint planning and iteration schedules
- Release planning with dependencies
- Resource allocation timelines
- Feature rollout schedules

---

## When NOT to Use

- Process steps with decisions → use [Flowchart](../flowchart/index.md)
- Service interactions over time → use [Sequence](../sequence/index.md)
- Status transitions → use [State](../state/index.md)

---

## Syntax Reference

```
gantt
    accTitle: Title Here
    accDescr: Description here

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Section Name
        Task name :status, start_date, end_date
        Task with duration :status, start_date, duration_days
        Task with dependency :status, after prev, duration_days
        Milestone :milestone, date, 0d
```

**Date formats:**

- `YYYY-MM-DD` — explicit dates
- `after task_name` — dependency-based
- `duration` — number of days

**Status tags:**

- `active` — currently in progress
- `done` — completed
- `crit` — critical path
- `milestone` — milestone marker

---

## Complexity Levels

| File                               | Tasks | Use case                          |
| ---------------------------------- | ----- | --------------------------------- |
| [simple.md](simple.md)             | 2–4   | Single sprint, quick timeline     |
| [intermediate.md](intermediate.md) | 4–8   | Multi-phase project with sections |
| [advanced.md](advanced.md)         | 8–15  | Full roadmap with dependencies    |

---

## Key Tips

- Use `section` to group related tasks (phases, teams, epics)
- `after prev` creates dependencies between sequential tasks
- `crit` marks tasks on the critical path
- Keep task names to 3–6 words
- Use `axisFormat` to control date display

---

## Anti-Patterns

```
%% ❌ Too many tasks without sections
gantt
    task1 :done, 2024-01-01, 2024-01-05
    task2 :done, 2024-01-06, 2024-01-10
    task3 :active, 2024-01-11, 2024-01-15
    task4 :active, 2024-01-16, 2024-01-20
    task5 :crit, 2024-01-21, 2024-01-25

%% ✅ Fix: use sections to group
gantt
    section Phase 1
        task1 :done, 2024-01-01, 2024-01-05
        task2 :done, 2024-01-06, 2024-01-10
    section Phase 2
        task3 :active, 2024-01-11, 2024-01-15
        task4 :active, 2024-01-16, 2024-01-20
    section Phase 3
        task5 :crit, 2024-01-21, 2024-01-25
```

---

## Parser Gotchas

- Date format must be consistent throughout the diagram
- Task names must be unique (or use `after prev` syntax)
- Milestones have zero duration: `milestone_name :milestone, date, 0d`
- Use `axisFormat` to customize date display (see [date format reference](https://github.com/moment/momentjs.com/blob/master/docs/moment/04-displaying/01-format.md))
