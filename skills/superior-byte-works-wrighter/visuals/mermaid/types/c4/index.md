<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# C4 Diagrams

**Best for:** Software architecture at multiple abstraction levels. System context, container diagrams, component diagrams, and deployment views.

---

## When to Use

- System Context (Level 1): What the system is, who uses it, external dependencies
- Container (Level 2): Applications, data stores, and their interactions
- Component (Level 3): Internal structure of a single application
- Deployment (Level 4): Infrastructure and deployment topology
- Onboarding new developers to system architecture
- Architecture review and planning sessions

## When NOT to Use

- Runtime behavior and message flows → use [Sequence](../sequence/index.md)
- Process flows and decisions → use [Flowchart](../flowchart/index.md)
- Network topology only → use [Network](../network/index.md)
- General system diagrams → use [Architecture](../architecture/index.md)

---

## Syntax Reference

```
C4Context
  accTitle: Title Here
  accDescr: Description here

  Person(user, "User", "Description")
  System(system, "System Name", "Description")
  System_Ext(external, "External System", "Description")

  Rel(user, system, "Uses")
  Rel(system, external, "Calls")

C4Container
  Person(user, "User")
  Container(web, "Web App", "React", "Frontend application")
  Container(api, "API", "Node.js", "Backend service")
  ContainerDb(db, "Database", "PostgreSQL", "Data store")

  Rel(user, web, "Uses", "HTTPS")
  Rel(web, api, "Calls", "JSON/HTTPS")
  Rel(api, db, "Reads/Writes", "SQL")

C4Component
  Container_Boundary(app, "Application") {
    Component(controller, "Controller", "Handles requests")
    Component(service, "Service", "Business logic")
    Component(repo, "Repository", "Data access")
  }
  ContainerDb(db, "Database", "PostgreSQL")

  Rel(controller, service, "Uses")
  Rel(service, repo, "Uses")
  Rel(repo, db, "Reads/Writes")
```

**Element types:**

- `Person` — User or role
- `System` — Internal system
- `System_Ext` — External system
- `Container` — Application or deployable unit
- `ContainerDb` — Database or data store
- `ContainerQueue` — Message queue
- `Component` — Internal building block

**Relationships:**

- `Rel(a, b, "label")` — Basic relationship
- `Rel(a, b, "label", "technology")` — With technology
- `Rel_Back(a, b, "label")` — Reverse direction
- `Rel_Neighbor(a, b, "label")` — Side by side

---

## Complexity Levels

| File                               | Elements | Use case                        |
| ---------------------------------- | -------- | ------------------------------- |
| [simple.md](simple.md)             | 3–6      | Single system context           |
| [intermediate.md](intermediate.md) | 6–12     | Container-level with databases  |
| [advanced.md](advanced.md)         | 12–20    | Component-level with boundaries |

---

## Key Tips

- Start with Context (Level 1), drill down only when needed
- Use consistent naming across all levels
- Label relationships with both action and technology/protocol
- Group related containers in boundaries
- Keep external systems to the right, internal to the left

## Anti-Patterns

```
%% ❌ Mixing levels in one diagram
C4Container
  Person(user, "User")
  System(legacy, "Legacy System")  %% Wrong level
  Container(api, "API")

%% ✅ Fix: use appropriate element types
C4Container
  Person(user, "User")
  Container_Boundary(legacy, "Legacy") {
    Container(service, "Service")
  }
  Container(api, "API")

%% ❌ Missing relationship labels
Rel(user, web, "")

%% ✅ Fix: describe the interaction
Rel(user, web, "Views dashboard", "HTTPS")

%% ❌ Too many elements in Context diagram
C4Context
  Person(user, "User")
  System(a, "A")
  System(b, "B")
  System(c, "C")
  System(d, "D")
  System(e, "E")
  System(f, "F")  %% Split into Container diagram
```

---

## Parser Gotchas

- Element IDs must be unique within the diagram
- Boundaries must be properly closed with `}`
- Technology parameter is optional but recommended
- Use quotes for descriptions containing commas
