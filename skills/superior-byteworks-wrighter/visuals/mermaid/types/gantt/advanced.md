<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Gantt — Advanced (8–15 tasks)

Full roadmap with dependencies and critical path. Use for documenting complex projects with multiple work streams and interdependencies.

---

## Example: Product Launch Roadmap

```mermaid
gantt
    accTitle: Product Launch Roadmap
    accDescr: Complete product launch timeline showing research, design, development, marketing, and launch phases with critical path

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Research
        Market Analysis :done, 2024-01-02, 5d
        Competitor Review :done, after prev, 3d
        User Interviews :done, after prev, 5d

    section Design
        Wireframes :done, after Research, 5d
        Visual Design :active, after prev, 7d
        Design Review :milestone, after prev, 0d

    section Development
        Architecture :active, after Design, 5d
        Backend API :crit, after prev, 10d
        Frontend UI :crit, after Backend, 10d
        Integration :crit, after prev, 5d

    section QA
        Unit Testing :active, after Backend, 8d
        E2E Testing :crit, after Integration, 5d
        Bug Fixes :crit, after prev, 5d

    section Launch
        Marketing Prep :active, after Design Review, 15d
        Documentation :active, after Integration, 7d
        Production Deploy :crit, after E2E, 2d
        Public Launch :milestone, after prev, 0d
```

---

## Example: Multi-Quarter Initiative

```mermaid
gantt
    accTitle: Platform Migration Timeline
    accDescr: Six-month platform migration showing parallel work streams for data, services, frontend, and cutover

    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Q1 Planning
        Discovery :done, 2024-01-01, 10d
        Architecture Design :done, after prev, 10d
        Team Onboarding :done, after prev, 5d

    section Data Layer
        Schema Design :done, after Architecture, 7d
        Migration Scripts :active, after prev, 10d
        Data Validation :crit, after prev, 7d
        Cutover :crit, after Services, 3d

    section Services
        Core Services :active, after Architecture, 15d
        API Gateway :active, after Core, 10d
        Service Integration :crit, after Data, 10d

    section Frontend
        Component Audit :done, after Architecture, 5d
        New UI Build :active, after prev, 20d
        Integration Testing :crit, after Service, 7d

    section Go Live
        Staging Deploy :active, after Integration, 5d
        UAT :crit, after prev, 10d
        Production Rollout :crit, after prev, 5d
        Legacy Shutdown :milestone, after prev, 0d
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
        Task B :done, after prev, 5d
        Task C :active, after prev, 5d

    section Phase Two
        Task D :active, after Phase One, 7d
        Task E :crit, after prev, 5d
        Task F :crit, after prev, 5d

    section Phase Three
        Task G :active, after Phase Two, 7d
        Task H :crit, after prev, 5d
        Task I :crit, after prev, 3d

    section Launch
        Final QA :crit, after Phase Three, 5d
        Deploy :crit, after prev, 2d
        Launch :milestone, after prev, 0d
```

---

## Tips

- Use `crit` liberally to show the critical path through the project
- Cross-section dependencies: `after SectionName` references last task in that section
- Consider splitting into multiple diagrams if exceeding 15 tasks
- Use milestones (0d duration) for key decision points
- Link to detailed breakdowns in prose for complex phases
