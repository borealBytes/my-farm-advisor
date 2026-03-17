<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Flowchart — Intermediate (10–20 nodes)

Use subgraphs to group related nodes into 2–4 logical clusters.

---

## Example: CI/CD Pipeline

```mermaid
flowchart LR
    accTitle: CI CD Pipeline Intermediate
    accDescr: Full CI/CD pipeline with build, test, and deploy phases grouped into logical subgraphs

    subgraph build ["📦 Build"]
        checkout[📥 Checkout code] --> compile[⚙️ Compile] --> package[📦 Package artifact]
    end

    subgraph test ["🧪 Test"]
        unit[🧪 Unit tests] --> lint[🔍 Lint check] --> security[🛡️ Security scan]
    end

    subgraph deploy ["🚀 Deploy"]
        stage[🖥️ Deploy staging] --> smoke{🔍 Smoke tests?}
        smoke -->|Pass| prod[🚀 Deploy production]
        smoke -->|Fail| rollback[🔄 Rollback]
    end

    build --> test
    test --> deploy
```

---

## Example: User Registration Flow

```mermaid
flowchart TB
    accTitle: User Registration Validation Flow
    accDescr: User registration process with email validation, password strength check, and account creation steps

    subgraph input ["📥 Input Validation"]
        email_check{📧 Valid email?} -->|No| email_err[❌ Email error]
        email_check -->|Yes| pass_check{🔐 Strong password?}
        pass_check -->|No| pass_err[❌ Password error]
        pass_check -->|Yes| dup_check{👤 User exists?}
    end

    subgraph creation ["✅ Account Creation"]
        dup_check -->|Yes| dup_err[❌ Duplicate error]
        dup_check -->|No| create[👤 Create account]
        create --> verify[📧 Send verification]
        verify --> done([✅ Registration complete])
    end

    start([👤 Submit form]) --> email_check
```

---

## Copy-Paste Template

```mermaid
flowchart LR
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    subgraph phase_one ["📋 Phase One"]
        step_a[⚙️ First step] --> step_b[⚙️ Second step]
        step_b --> decision_a{❓ Check condition?}
        decision_a -->|Yes| step_c[✅ Handle yes]
        decision_a -->|No| step_d[❌ Handle no]
    end

    subgraph phase_two ["🚀 Phase Two"]
        step_e[⚙️ Next step] --> step_f[⚙️ Final step]
        step_f --> done([🏁 Complete])
    end

    phase_one --> phase_two
```

---

## Tips

- Group by stage, domain, team, or layer — whatever creates the clearest mental model
- 2–6 nodes per subgraph is ideal
- Connect subgraphs at the subgraph level for leadership view, or at internal nodes for engineering view
- Keep ≤3 decision points per subgraph
