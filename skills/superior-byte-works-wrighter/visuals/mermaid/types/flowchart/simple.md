<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Flowchart — Simple (1–10 nodes)

Flat diagram, no subgraphs needed. Use for single concepts and quick illustrations.

---

## Example: API Request Flow

```mermaid
flowchart LR
    accTitle: Secure API Request Flow
    accDescr: Three-step API request from authentication through processing to response

    auth[🔐 Authenticate] --> process[⚙️ Process request] --> respond[📤 Return response]
```

---

## Example: Feature Flag Decision

```mermaid
flowchart TB
    accTitle: Feature Flag Evaluation
    accDescr: Decision flow for evaluating a feature flag and routing users to new or legacy experience

    start([👤 User request]) --> check{🔍 Flag enabled?}
    check -->|Yes| new_exp[🚀 New experience]
    check -->|No| old_exp[🖥️ Legacy experience]
    new_exp --> done([✅ Serve response])
    old_exp --> done
```

---

## Example: Build Pass/Fail

```mermaid
flowchart LR
    accTitle: CI Build Pass Fail Flow
    accDescr: Simple CI pipeline showing build, test, and deploy steps with failure handling

    push[📥 Code push] --> build[⚙️ Build] --> test{🧪 Tests pass?}
    test -->|Yes| deploy[🚀 Deploy]
    test -->|No| fail[❌ Notify team]
```

---

## Copy-Paste Template

```mermaid
flowchart LR
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    start([🏁 Start]) --> step_one[⚙️ First step]
    step_one --> decision{❓ Decision point?}
    decision -->|Yes| yes_path[✅ Yes path]
    decision -->|No| no_path[❌ No path]
    yes_path --> done([🏁 Done])
    no_path --> done
```

---

## Tips

- Keep it flat — no subgraphs needed at this scale
- Use `LR` for left-to-right pipelines, `TB` for top-down decision trees
- Diamond `{text}` for decisions only — don't use for regular steps
- Start/end nodes use rounded rectangle `([text])`
