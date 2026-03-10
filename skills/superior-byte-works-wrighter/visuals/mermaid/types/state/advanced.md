<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# State — Advanced (10–20 states)

Full state machine with forks, joins, and parallel states.

---

## Example: Order Fulfillment State Machine

```mermaid
stateDiagram-v2
    accTitle: Order Fulfillment State Machine
    accDescr: Complete order fulfillment state machine with parallel payment and inventory processing paths

    [*] --> received : order submitted

    state received {
        [*] --> validating
        validating --> valid : passes validation
        validating --> invalid : fails validation
        invalid --> [*]
    }

    received --> processing : order valid

    state processing {
        [*] --> fork_state
        fork_state <<fork>>

        state payment_flow {
            [*] --> charging
            charging --> payment_success : charged
            charging --> payment_failed : declined
        }

        state inventory_flow {
            [*] --> reserving
            reserving --> reserved : items available
            reserving --> backordered : out of stock
        }

        fork_state --> payment_flow
        fork_state --> inventory_flow

        join_state <<join>>
        payment_success --> join_state
        reserved --> join_state
    }

    processing --> fulfillment : payment + inventory ready
    processing --> cancelled : payment failed or backordered

    state fulfillment {
        [*] --> picking
        picking --> packing : items picked
        packing --> shipping : packed
        shipping --> in_transit : shipped
    }

    fulfillment --> delivered : carrier confirms delivery
    delivered --> [*]
    cancelled --> [*]
```

---

## Copy-Paste Template

```mermaid
stateDiagram-v2
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    [*] --> initial

    state initial {
        [*] --> validating
        validating --> valid
        validating --> invalid
    }

    initial --> parallel_phase : valid

    state parallel_phase {
        [*] --> fork_point
        fork_point <<fork>>

        state branch_a {
            [*] --> a_step1
            a_step1 --> a_done
        }

        state branch_b {
            [*] --> b_step1
            b_step1 --> b_done
        }

        fork_point --> branch_a
        fork_point --> branch_b

        join_point <<join>>
        a_done --> join_point
        b_done --> join_point
    }

    parallel_phase --> completed : both branches done
    parallel_phase --> failed : any branch fails
    completed --> [*]
    failed --> [*]
```

---

## Tips

- `<<fork>>` and `<<join>>` for parallel execution paths
- `<<choice>>` for conditional branching
- Consider splitting into multiple diagrams if exceeding 20 states
- Link to simpler overview diagram in prose
- Use compound states to hide complexity at the top level
