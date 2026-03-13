<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# ZenUML Diagrams

**Best for:** Alternative sequence diagrams with a more code-like syntax.

---

## When to Use

- Sequence flows
- API interactions
- Method call chains
- Alternative to standard sequence diagrams
- Code-like diagram syntax

## When NOT to Use

- Standard sequence diagrams → use [Sequence](../sequence/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- State transitions → use [State](../state/index.md)
- Class hierarchies → use [Class](../class/index.md)

---

## Syntax Reference

```
zenuml
 accTitle: Title Here
 accDescr: Description here

 @Actor User
 @Database DB

 User -> App: request
 App -> DB: query
 DB --> App: result
 App --> User: response
```

**Structure:**

- `@Type Name` — participant declaration
- `->` — synchronous call
- `-->` — return
- `->>` — asynchronous call

---

## Complexity Levels

| File                               | Messages | Use case           |
| ---------------------------------- | -------- | ------------------ |
| [simple.md](simple.md)             | 3–6      | Simple interaction |
| [intermediate.md](intermediate.md) | 6–12     | API flow           |
| [advanced.md](advanced.md)         | 12–20    | Complex workflow   |

---

## Key Tips

- Use @Type for participant types
- Keep messages concise
- Group related calls
- Show return values
- Use async for events

## Anti-Patterns

```
%% ❌ Unclear participant types
zenuml
 A -> B: msg

%% ✅ Fix: declare types
zenuml
 @Actor User
 @Service API
 User -> API: request

%% ❌ Too many messages
zenuml
 A -> B: 1
 B -> C: 2
 C -> D: 3
 ...
 Y -> Z: 25

%% ✅ Fix: group or split
zenuml
 @Actor User
 @Service API
 @Database DB
 User -> API: request
 API -> DB: query
 DB --> API: data
 API --> User: response
```

---

## Parser Gotchas

- Participants must be declared
- Arrow types matter (-> vs -->)
- Types: Actor, Service, Database, etc.
- Messages are strings
