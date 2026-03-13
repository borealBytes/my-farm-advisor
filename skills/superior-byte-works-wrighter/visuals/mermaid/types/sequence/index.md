<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sequence Diagrams

**Best for:** Who talks to whom, when. Service interactions, API calls, protocol flows, authentication sequences.

---

## When to Use

- API request/response flows between services
- Authentication and authorization sequences
- Message passing between actors
- Protocol documentation (OAuth, webhooks, etc.)
- Microservice interaction documentation

## When NOT to Use

- Process steps without actors → use [Flowchart](../flowchart/index.md)
- State transitions → use [State](../state/index.md)
- Class relationships → use [Class](../class/index.md)

---

## Syntax Reference

```
sequenceDiagram
    accTitle: Title Here
    accDescr: Description here

    actor User
    participant App as 🌐 App
    participant DB as 💾 Database

    User->>App: Send request
    App->>DB: Query data
    DB-->>App: Return results
    App-->>User: Send response

    Note over App,DB: Optional note spanning participants
    loop Retry logic
        App->>DB: Retry query
    end
    alt Success path
        App-->>User: 200 OK
    else Error path
        App-->>User: 500 Error
    end
```

**Arrow types:**

- `->>` — solid arrow (synchronous call)
- `-->>` — dashed arrow (response/async)
- `-x` — solid with X (failed message)
- `--x` — dashed with X (failed async)

---

## Complexity Levels

| File                               | Participants | Use case                      |
| ---------------------------------- | ------------ | ----------------------------- |
| [simple.md](simple.md)             | 2–3          | Single request/response       |
| [intermediate.md](intermediate.md) | 3–5          | Multi-service with branching  |
| [advanced.md](advanced.md)         | 5–8          | Full protocol with loops/alts |

---

## Key Tips

- Use `actor` for humans, `participant` for systems
- Alias with `as` for emoji labels: `participant App as 🌐 App`
- `-->>` for responses (dashed = return), `->>` for calls (solid = request)
- Use `loop`, `alt`, `opt`, `par` blocks for control flow
- Keep participant count ≤8 — more than that, split into multiple diagrams

## Anti-Patterns

```
%% ❌ Too many participants in one diagram
participant A
participant B
participant C
participant D
participant E
participant F
participant G
participant H
participant I  %% Split this into multiple diagrams

%% ❌ Mixing solid/dashed arrows incorrectly
App-->>DB: Send request  %% Should be ->> for requests
DB->>App: Return data    %% Should be -->> for responses
```
