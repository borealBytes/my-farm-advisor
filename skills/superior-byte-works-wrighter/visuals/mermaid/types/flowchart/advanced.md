<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Flowchart — Advanced (20–30 nodes)

Subgraphs are mandatory. 3–6 subgraphs, each with a clear title and purpose. Consider overview + detail approach.

---

## Example: Full Deployment Pipeline with Rollback

```mermaid
flowchart LR
    accTitle: Full Deployment Pipeline With Rollback
    accDescr: Complete deployment pipeline from code push through production with quality gates and rollback paths

    subgraph source ["📥 Source Control"]
        push[📥 Code push] --> pr{🔍 PR review?}
        pr -->|Approved| merge[✅ Merge to main]
        pr -->|Changes| revise[✏️ Address feedback]
        revise --> pr
    end

    subgraph build ["📦 Build"]
        merge --> checkout[📥 Checkout] --> compile[⚙️ Compile]
        compile --> artifact[📦 Create artifact]
    end

    subgraph quality ["🧪 Quality Gates"]
        artifact --> unit[🧪 Unit tests]
        unit --> integration[🔗 Integration tests]
        integration --> security[🛡️ Security scan]
        security --> gate{✅ All gates pass?}
        gate -->|No| notify_fail[❌ Notify team]
    end

    subgraph staging ["🖥️ Staging"]
        gate -->|Yes| deploy_stage[🖥️ Deploy staging]
        deploy_stage --> smoke{🔍 Smoke tests?}
        smoke -->|Fail| rollback_stage[🔄 Rollback staging]
        smoke -->|Pass| approve{👥 Manual approval?}
    end

    subgraph production ["🚀 Production"]
        approve -->|Approved| deploy_prod[🚀 Deploy production]
        deploy_prod --> health{⚙️ Health check?}
        health -->|Fail| rollback_prod[🔄 Rollback production]
        health -->|Pass| monitor[📊 Monitor metrics]
        monitor --> done([✅ Release complete])
    end

    classDef success fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef danger fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d

    class done,merge,monitor success
    class notify_fail,rollback_stage,rollback_prod danger
```

---

## Example: Microservice Request Lifecycle

```mermaid
flowchart TB
    accTitle: Microservice Request Lifecycle
    accDescr: Complete request lifecycle through API gateway, auth, rate limiting, service routing, and response

    subgraph gateway ["🌐 API Gateway"]
        recv[📥 Receive request] --> rate{⚠️ Rate limited?}
        rate -->|Yes| throttle[❌ Return 429]
        rate -->|No| auth_check{🔐 Auth valid?}
        auth_check -->|No| unauth[❌ Return 401]
        auth_check -->|Yes| route[🌐 Route request]
    end

    subgraph services ["⚙️ Services"]
        route --> svc_a[⚙️ Service A]
        route --> svc_b[⚙️ Service B]
        svc_a --> cache{💾 Cache hit?}
        cache -->|Yes| cached[💾 Return cached]
        cache -->|No| fetch[📥 Fetch from DB]
        fetch --> store[💾 Store in cache]
    end

    subgraph response ["📤 Response"]
        cached --> format[⚙️ Format response]
        store --> format
        svc_b --> format
        format --> compress[📦 Compress payload]
        compress --> send[📤 Send response]
    end

    classDef primary fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a5f
    classDef danger fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d

    class route,format,send primary
    class throttle,unauth danger
```

---

## Copy-Paste Template

```mermaid
flowchart LR
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    subgraph phase_one ["📋 Phase One"]
        step_a[⚙️ Step A] --> step_b[⚙️ Step B]
        step_b --> dec_a{❓ Decision A?}
        dec_a -->|Yes| step_c[✅ Handle yes]
        dec_a -->|No| step_d[❌ Handle no]
    end

    subgraph phase_two ["🔄 Phase Two"]
        step_e[⚙️ Step E] --> dec_b{❓ Decision B?}
        dec_b -->|Pass| step_f[✅ Continue]
        dec_b -->|Fail| step_g[🔄 Retry]
    end

    subgraph phase_three ["🚀 Phase Three"]
        step_h[⚙️ Step H] --> step_i[⚙️ Step I]
        step_i --> done([🏁 Complete])
    end

    phase_one --> phase_two
    phase_two --> phase_three

    classDef primary fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a5f
    classDef success fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    classDef danger fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d

    class done success
```

---

## Tips

- Consider splitting into overview + detail if this exceeds 30 nodes
- Use `classDef` to color-code subgraph purposes (max 3–4 classes)
- One primary flow direction — don't mix `LR` and `TB` in the same diagram
- Link to detail diagrams in prose: _"See [detail diagram] for the full X flow."_
