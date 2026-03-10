<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Architecture Diagrams

**Best for:** System architecture, component relationships, deployment diagrams, infrastructure views.

---

## When to Use

- High-level system architecture
- Component relationships
- Service dependencies
- Deployment topology
- Infrastructure overview
- Technology stack visualization

## When NOT to Use

- Detailed class design → use [Class](../class/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- State transitions → use [State](../state/index.md)
- Network topology → use [Network](../network/index.md)
- C4 modeling → use [C4](../c4/index.md)

---

## Syntax Reference

```
architecture-beta
 accTitle: Title Here
 accDescr: Description here

 service service_id [Service Name] {
 }

 service db_id [Database] {
 }

 service_id --> db_id: Label
```

**Elements:**

- `service id [Label] { }` — service/component
- `id --> id: label` — connection between components
- Supports grouping with `{ }`

---

## Complexity Levels

| File                               | Components | Use case                     |
| ---------------------------------- | ---------- | ---------------------------- |
| [simple.md](simple.md)             | 2–4        | Simple service relationships |
| [intermediate.md](intermediate.md) | 4–8        | Multi-service architecture   |
| [advanced.md](advanced.md)         | 8–12       | Complex distributed systems  |

---

## Key Tips

- Use descriptive IDs and labels
- Group related services together
- Show data flow direction with arrows
- Keep labels concise
- Use consistent naming conventions

## Anti-Patterns

```
%% ❌ Too many connections
service a [A]
service b [B]
service c [C]
service d [D]
a --> b
a --> c
a --> d
b --> c
b --> d
c --> d

%% ✅ Fix: focus on key relationships
service frontend [Frontend]
service api [API]
service db [Database]
frontend --> api
api --> db

%% ❌ Unclear service names
service s1 [S1]
service s2 [S2]

%% ✅ Fix: descriptive names
service gateway [API Gateway]
service auth [Auth Service]
```

---

## Parser Gotchas

- Service IDs must be unique
- Arrow syntax uses `-->`
- Labels on arrows are optional
- Grouping requires proper bracket matching
