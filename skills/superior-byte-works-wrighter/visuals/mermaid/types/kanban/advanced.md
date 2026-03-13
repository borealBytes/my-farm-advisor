<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Kanban — Advanced (12–20 cards)

Complex workflow board. Use for comprehensive project tracking.

---

## Example: Full Project Board

```mermaid
kanban
 accTitle: Project Management Board
 accDescr: Comprehensive project board with multiple stages and swimlanes

 Icebox
  [Future feature A]
  [Future feature B]
  [Tech debt item]

 Backlog
  [Sprint 25 planning]
  [API v2 design]
  [Mobile redesign]
  [Analytics dashboard]

 Ready
  [Auth refactor]{assigned: 'Alice'}
  [Database migration]{assigned: 'Bob'}
  [Cache layer]{assigned: 'Carol'}

 In Progress
  [Payment integration]{assigned: 'Dave'}
  [Email service]{assigned: 'Alice'}
  [Search feature]{assigned: 'Bob'}

 Code Review
  [User profiles]{assigned: 'Carol'}
  [Settings page]{assigned: 'Dave'}

 QA
  [Export feature]
  [Import feature]

 Staging
  [Dark mode]
  [Mobile responsive]

 Production
  [v1.5 released]
  [v1.4.2 hotfix]
```

---

## Example: Multi-Team Board

```mermaid
kanban
 accTitle: Cross Team Initiative Board
 accDescr: Multi-team kanban showing work across different teams

 Product Backlog
  [Feature A]
  [Feature B]
  [Feature C]

 Design
  [Mockups v2]{assigned: 'Design'}
  [Design system]{assigned: 'Design'}

 Frontend
  [Component library]{assigned: 'Frontend'}
  [Page layouts]{assigned: 'Frontend'}
  [State management]{assigned: 'Frontend'}

 Backend
  [API endpoints]{assigned: 'Backend'}
  [Database schema]{assigned: 'Backend'}
  [Auth service]{assigned: 'Backend'}

 DevOps
  [CI/CD pipeline]{assigned: 'DevOps'}
  [Monitoring setup]{assigned: 'DevOps'}
  [Security scan]{assigned: 'DevOps'}

 Integration
  [End-to-end tests]
  [Performance tests]

 Released
  [v2.0 launched]
  [v2.1 patch]
```

---

## Example: Release Board

```mermaid
kanban
 accTitle: Release Management Board
 accDescr: Release tracking with multiple environments and gates

 Planned
  [Q1 features]
  [Q2 roadmap]

 Development
  [Auth improvements]{assigned: 'Team A'}
  [UI refresh]{assigned: 'Team B'}
  [API v3]{assigned: 'Team C'}
  [Mobile app]{assigned: 'Team D'}

 Testing
  [Integration tests]
  [Security audit]
  [Performance tests]
  [Accessibility review]

 Staging
  [Release candidate 1]
  [Release candidate 2]

 Approval
  [Product signoff]
  [Security approval]
  [Executive review]

 Production
  [v3.0 deployed]
  [v3.0.1 hotfix]

 Post-Release
  [Monitoring]
  [Feedback collection]
```

---

## Copy-Paste Template

```mermaid
kanban
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this board shows

 Backlog
  [Task 1]
  [Task 2]
  [Task 3]

 Ready
  [Task 4]{assigned: 'Name'}
  [Task 5]{assigned: 'Name'}

 In Progress
  [Task 6]{assigned: 'Name'}
  [Task 7]{assigned: 'Name'}
  [Task 8]{assigned: 'Name'}

 Review
  [Task 9]{assigned: 'Name'}
  [Task 10]{assigned: 'Name'}

 Done
  [Task 11]{assigned: 'Name'}
  [Task 12]{assigned: 'Name'}
```

---

## Tips

- At 12+ cards, consider swimlanes or multiple boards
- Use WIP limits in column names
- Include environment stages
- Track releases separately
