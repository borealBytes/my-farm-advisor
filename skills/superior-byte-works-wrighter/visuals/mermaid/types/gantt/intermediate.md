<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Gantt — Intermediate (4–8 tasks)

Multi-phase project with sections. Use for documenting projects with distinct phases or team handoffs.

---

## Example: Quarterly Roadmap

```mermaid
gantt
    accTitle: Q1 Product Roadmap
    accDescr: Quarterly roadmap showing design, development, and launch phases across three monthly sprints

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section January
        Discovery :done, 2024-01-01, 2024-01-12
        Design :done, 2024-01-15, 2024-01-26

    section February
        Sprint 1 :active, 2024-01-29, 2024-02-09
        Sprint 2 :active, 2024-02-12, 2024-02-23

    section March
        Sprint 3 :crit, 2024-02-26, 2024-03-08
        QA & Polish :crit, 2024-03-11, 2024-03-22
        Launch :milestone, 2024-03-25, 0d
```

---

## Example: Cross-Team Project

```mermaid
gantt
    accTitle: Cross Team Feature Delivery
    accDescr: Multi-team project showing backend, frontend, and DevOps work streams with dependencies

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Backend Team
        API Design :done, 2024-03-01, 5d
        API Implementation :active, after prev, 10d
        API Documentation :active, after prev, 3d

    section Frontend Team
        UI Design :done, 2024-03-01, 7d
        Component Dev :crit, after prev, 10d
        Integration :crit, after Backend, 5d

    section DevOps
        Infrastructure :active, 2024-03-01, 8d
        Deployment Pipeline :crit, after prev, 5d
        Production Deploy :milestone, after Integration, 0d
```

---

## Copy-Paste Template

```mermaid
gantt
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase One
        Task A :done, 2024-01-01, 5d
        Task B :active, after prev, 5d

    section Phase Two
        Task C :active, after prev, 7d
        Task D :crit, after prev, 3d

    section Phase Three
        Task E :crit, after prev, 5d
        Final Milestone :milestone, after prev, 0d
```

---

## Tips

- Use sections to group by phase, team, or epic
- `after prev` chains tasks within a section
- `after TaskName` creates cross-section dependencies
- `crit` highlights tasks on the critical path
- Keep 2–4 tasks per section for readability
