<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# State — Intermediate (5–10 states)

Multi-path with compound states. Use for workflows with sub-states.

---

## Example: Pull Request Lifecycle

```mermaid
stateDiagram-v2
    accTitle: Pull Request Review Lifecycle
    accDescr: Pull request lifecycle with draft, review, and merge states including compound review sub-states

    [*] --> draft : PR opened as draft
    draft --> open : mark ready for review

    state open {
        [*] --> awaiting_review
        awaiting_review --> changes_requested : reviewer requests changes
        awaiting_review --> approved : reviewer approves
        changes_requested --> awaiting_review : author pushes fixes
    }

    open --> merged : all checks pass + approved
    open --> closed : author closes
    merged --> [*]
    closed --> open : reopen
    closed --> [*]
```

---

## Example: User Account Lifecycle

```mermaid
stateDiagram-v2
    accTitle: User Account Status Lifecycle
    accDescr: User account lifecycle from registration through verification, active use, suspension, and deletion

    [*] --> unverified : account created

    state active {
        [*] --> standard
        standard --> premium : upgrade
        premium --> standard : downgrade
    }

    unverified --> active : email verified
    unverified --> deleted : verification expired
    active --> suspended : policy violation
    suspended --> active : appeal approved
    suspended --> deleted : no appeal
    active --> deleted : user deletes account
    deleted --> [*]
```

---

## Copy-Paste Template

```mermaid
stateDiagram-v2
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    [*] --> initial : created

    state processing {
        [*] --> step_one
        step_one --> step_two : condition met
        step_two --> step_three : validated
    }

    initial --> processing : started
    processing --> completed : all steps done
    processing --> failed : error occurred
    failed --> processing : retry
    completed --> [*]
    failed --> [*] : max retries exceeded
```

---

## Tips

- Compound states group related sub-states visually
- Label all transitions with triggering events
- Use compound states when a state has its own internal lifecycle
- Keep compound states to 1 level of nesting
