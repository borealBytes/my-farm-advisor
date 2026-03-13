<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# State — Simple (2–5 states)

Simple lifecycle. Use for basic status transitions.

---

## Example: Order Status

```mermaid
stateDiagram-v2
    accTitle: Order Status Lifecycle
    accDescr: Simple order lifecycle showing transitions from pending through confirmed to shipped or cancelled

    [*] --> pending : order placed
    pending --> confirmed : payment received
    confirmed --> shipped : items dispatched
    shipped --> [*] : delivered
    pending --> cancelled : user cancels
    confirmed --> cancelled : payment failed
    cancelled --> [*]
```

---

## Example: Feature Flag States

```mermaid
stateDiagram-v2
    accTitle: Feature Flag State Machine
    accDescr: Feature flag lifecycle showing transitions between disabled, enabled, and deprecated states

    [*] --> disabled : flag created
    disabled --> enabled : toggle on
    enabled --> disabled : toggle off
    enabled --> deprecated : feature removed
    deprecated --> [*] : flag deleted
```

---

## Copy-Paste Template

```mermaid
stateDiagram-v2
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    [*] --> initial_state : created
    initial_state --> active_state : activated
    active_state --> completed_state : finished
    completed_state --> [*]
    active_state --> cancelled_state : cancelled
    cancelled_state --> [*]
```

---

## Tips

- Use `stateDiagram-v2` for better rendering
- Label every transition with the triggering event
- `[*]` at start = initial state, `[*]` at end = terminal state
- Keep it flat — no compound states needed at this scale
