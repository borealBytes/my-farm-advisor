<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Gantt — Simple (2–4 tasks)

Single sprint or quick timeline. Use for documenting a brief iteration or simple schedule.

---

## Example: Two-Week Sprint

```mermaid
gantt
    accTitle: Two Week Sprint Timeline
    accDescr: Simple two-week sprint showing planning, development, and review phases with milestone

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Sprint 24
        Planning :done, 2024-01-15, 2024-01-16
        Development :active, 2024-01-17, 2024-01-26
        Review :crit, 2024-01-29, 2024-01-30
        Sprint Review :milestone, 2024-01-30, 0d
```

---

## Example: Feature Release

```mermaid
gantt
    accTitle: Feature Release Schedule
    accDescr: Simple feature release timeline showing development, QA, and deployment phases

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Release v2.1
        Development :done, 2024-02-01, 5d
        QA Testing :active, after prev, 3d
        Deploy to Prod :crit, after prev, 1d
        Release Complete :milestone, after prev, 0d
```

---

## Copy-Paste Template

```mermaid
gantt
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase Name
        Task One :done, 2024-01-01, 2024-01-05
        Task Two :active, 2024-01-06, 2024-01-10
        Task Three :crit, after prev, 3d
        Milestone :milestone, after prev, 0d
```

---

## Tips

- Keep it flat — no need for multiple sections at this scale
- Use `after prev` to chain tasks with dependencies
- `crit` marks tasks on the critical path
- Milestones show as diamonds with zero duration
