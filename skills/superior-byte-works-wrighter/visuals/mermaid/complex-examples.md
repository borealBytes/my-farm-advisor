<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Composing Complex Diagram Sets

When a single diagram isn't enough — multiple audiences, overview + detail needs, or before/after migration docs — use these patterns to combine multiple Mermaid diagram types into cohesive documentation.

---

## Pattern 1: Overview + Detail

Use when you need both the big picture AND the details. The overview shows subgraph-level blocks; detail diagrams zoom into each subgraph.

### Overview Diagram

```mermaid
flowchart LR
    accTitle: System Architecture Overview
    accDescr: High-level overview showing three main system layers and their connections for leadership audience

    subgraph ingestion ["📥 Data Ingestion"]
        ingest_api[🌐 API gateway]
        ingest_queue[📦 Message queue]
    end

    subgraph processing ["⚙️ Processing Layer"]
        proc_worker[🤖 Worker pool]
        proc_cache[💾 Cache layer]
    end

    subgraph delivery ["📤 Delivery Layer"]
        del_api[🌐 Delivery API]
        del_notify[⚡ Notifications]
    end

    ingestion --> processing
    processing --> delivery
```

### Detail Diagram — Ingestion Layer

```mermaid
flowchart TB
    accTitle: Data Ingestion Layer Detail
    accDescr: Detailed view of the ingestion layer showing validation, routing, and queue management steps

    start([📥 Request arrives]) --> validate{⚠️ Valid payload?}
    validate -->|No| reject[❌ Return 400]
    validate -->|Yes| auth{🔐 Authenticated?}
    auth -->|No| deny[🔒 Return 401]
    auth -->|Yes| route[🌐 Route to queue]
    route --> enqueue[📦 Enqueue message]
    enqueue --> ack[✅ Return 202]
```

---

## Pattern 2: Multi-Audience Documentation

Create separate diagrams for different audiences from the same system.

### Leadership View (Flowchart — phases only)

```mermaid
flowchart LR
    accTitle: Deployment Pipeline Leadership View
    accDescr: High-level three-phase deployment pipeline for leadership showing build, test, and release phases

    build["📦 Build"] --> test["🧪 Test"] --> release["🚀 Release"]

    classDef phase fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a5f
    class build,test,release phase
```

### Engineering View (Flowchart — full detail)

```mermaid
flowchart LR
    accTitle: Deployment Pipeline Engineering Detail
    accDescr: Detailed deployment pipeline for engineers showing all steps from code push through production release

    subgraph build ["📦 Build"]
        checkout[📥 Checkout code] --> compile[⚙️ Compile] --> package[📦 Package artifact]
    end

    subgraph test ["🧪 Test"]
        unit[🧪 Unit tests] --> integration[🔗 Integration tests] --> security[🛡️ Security scan]
    end

    subgraph release ["🚀 Release"]
        stage[🖥️ Deploy staging] --> smoke[🔍 Smoke tests] --> prod[🚀 Deploy production]
    end

    build --> test
    test --> release
```

---

## Pattern 3: Before/After Migration

Document system changes with paired diagrams.

### Before: Monolithic Architecture

```mermaid
flowchart TB
    accTitle: Monolithic Architecture Before Migration
    accDescr: Legacy monolithic system showing all components tightly coupled in a single deployment unit

    client[👤 Client] --> monolith["🖥️ Monolith<br/>(Auth + API + DB)"]
    monolith --> db[(💾 Single database)]
```

### After: Microservices Architecture

```mermaid
flowchart TB
    accTitle: Microservices Architecture After Migration
    accDescr: New microservices system showing auth, API, and data services as independent deployable units

    client[👤 Client] --> gateway[🌐 API gateway]

    subgraph services ["⚙️ Services"]
        auth_svc[🔐 Auth service]
        api_svc[🌐 API service]
        data_svc[💾 Data service]
    end

    gateway --> auth_svc
    gateway --> api_svc
    api_svc --> data_svc

    auth_svc --> auth_db[(💾 Auth DB)]
    data_svc --> data_db[(💾 Data DB)]
```

---

## Pattern 4: Flowchart + Sequence Combo

Use a flowchart for the overall process, then a sequence diagram for the critical interaction.

### Process Overview (Flowchart)

```mermaid
flowchart LR
    accTitle: OAuth Login Process Overview
    accDescr: Overview of OAuth login flow showing three main phases from user initiation to session creation

    initiate["👤 User initiates login"] --> oauth["🔐 OAuth handshake"] --> session["✅ Session created"]
```

### OAuth Handshake Detail (Sequence)

```mermaid
sequenceDiagram
    accTitle: OAuth Handshake Sequence Detail
    accDescr: Detailed OAuth 2.0 authorization code flow showing all messages between user, app, and provider

    actor User
    participant App as 🌐 App
    participant Provider as 🔐 OAuth Provider

    User->>App: Click "Login with GitHub"
    App->>Provider: Redirect with client_id + scope
    Provider->>User: Show authorization page
    User->>Provider: Grant permission
    Provider->>App: Return auth code
    App->>Provider: Exchange code for token
    Provider->>App: Return access token
    App->>User: Create session, redirect home
```

---

## Pattern 5: ER + Flowchart Combo

Use an ER diagram for the data model, then a flowchart for the business process that operates on it.

### Data Model (ER)

```mermaid
erDiagram
    accTitle: Order Management Data Model
    accDescr: Entity relationship diagram showing orders, customers, products, and line items with their relationships

    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "included in"

    CUSTOMER {
        int id PK
        string email
        string name
    }
    ORDER {
        int id PK
        int customer_id FK
        string status
        date created_at
    }
    LINE_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
    }
    PRODUCT {
        int id PK
        string name
        decimal price
    }
```

### Order Fulfillment Process (Flowchart)

```mermaid
flowchart TB
    accTitle: Order Fulfillment Business Process
    accDescr: Business process for fulfilling orders from placement through shipping with inventory and payment checks

    place([📥 Order placed]) --> check_inv{💾 In stock?}
    check_inv -->|No| backorder[⏰ Add to backorder]
    check_inv -->|Yes| charge{💰 Payment OK?}
    charge -->|No| cancel[❌ Cancel order]
    charge -->|Yes| pick[📦 Pick items]
    pick --> ship[🚀 Ship order]
    ship --> notify[📤 Notify customer]
    notify --> done([✅ Order complete])
```

---

## Linking Diagrams in Prose

When using multiple diagrams, link them explicitly in your prose:

```markdown
The system has three main layers (see [Overview](#overview-diagram) above).
For the ingestion layer internals, see [Ingestion Detail](#detail-diagram--ingestion-layer).
The OAuth handshake is detailed in the [sequence diagram](#oauth-handshake-detail-sequence) below.
```

---

## Complexity Management Summary

| Situation                           | Pattern                    | Diagrams needed |
| ----------------------------------- | -------------------------- | --------------- |
| Simple process, one audience        | Single flat diagram        | 1               |
| Complex process, one audience       | Subgraphs in one diagram   | 1               |
| Complex process, multiple audiences | Multi-audience             | 2–3             |
| System with data model + process    | ER + Flowchart combo       | 2               |
| System with interactions + flow     | Flowchart + Sequence combo | 2               |
| Very large system (30+ nodes)       | Overview + Detail          | 3–6             |
| Before/after documentation          | Migration pair             | 2               |
