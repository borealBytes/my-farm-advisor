<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# State Diagrams

**Best for:** Status transitions, lifecycle documentation, finite state machines, workflow states.

---

## When to Use

- Order/ticket/request lifecycle states
- User account status transitions
- Feature flag state machines
- Connection/session lifecycle
- Approval workflow states

## When NOT to Use

- Process steps with decisions → use [Flowchart](../flowchart/index.md)
- Service interactions → use [Sequence](../sequence/index.md)
- Time-based events → use [Timeline](../timeline/index.md)

---

## Syntax Reference

```
stateDiagram-v2
    accTitle: Title Here
    accDescr: Description here

    [*] --> InitialState
    InitialState --> NextState : trigger event
    NextState --> [*] : terminal

    state "Descriptive Label" as state_id

    state CompoundState {
        [*] --> SubState1
        SubState1 --> SubState2
    }

    state fork_state <<fork>>
    state join_state <<join>>
```

**Special states:**

- `[*]` — initial/terminal state
- `<<fork>>` — parallel split
- `<<join>>` — parallel merge
- `<<choice>>` — conditional branch

---

## Complexity Levels

| File                               | States | Use case                        |
| ---------------------------------- | ------ | ------------------------------- |
| [simple.md](simple.md)             | 2–5    | Simple lifecycle                |
| [intermediate.md](intermediate.md) | 5–10   | Multi-path with compound states |
| [advanced.md](advanced.md)         | 10–20  | Full state machine with forks   |

---

## Key Tips

- Use `stateDiagram-v2` (not `stateDiagram`) — v2 has better rendering
- `[*]` is both the initial state (at start) and terminal state (at end)
- Use compound states to group related sub-states
- Label transitions with the triggering event
- Keep ≤3 outgoing transitions per state for readability

## Anti-Patterns

```
%% ❌ Unlabeled transitions
StateA --> StateB
StateB --> StateC

%% ✅ Label with triggering event
StateA --> StateB : user submits
StateB --> StateC : payment confirmed

%% ❌ Too many states in one diagram
%% Split into compound states or multiple diagrams
```
