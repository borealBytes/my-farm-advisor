<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sequence — Intermediate (3–5 participants)

Multi-service flows with branching. Use `alt`/`opt` blocks for conditional paths.

---

## Example: OAuth Authorization Code Flow

```mermaid
sequenceDiagram
    accTitle: OAuth Authorization Code Flow
    accDescr: Complete OAuth 2.0 authorization code flow showing all messages between user, app, and provider

    actor User as 👤 User
    participant App as 🌐 App
    participant Provider as 🔐 OAuth Provider
    participant DB as 💾 Session Store

    User->>App: Click "Login with GitHub"
    App->>Provider: Redirect with client_id + scope
    Provider->>User: Show authorization page
    User->>Provider: Grant permission
    Provider->>App: Return auth code
    App->>Provider: Exchange code for token
    Provider-->>App: Return access token
    App->>DB: Store session
    DB-->>App: Session ID
    App-->>User: Set cookie, redirect home
```

---

## Example: Payment Processing

```mermaid
sequenceDiagram
    accTitle: Payment Processing With Retry
    accDescr: Payment flow with fraud check, processor call, and retry logic on failure

    actor Customer as 👤 Customer
    participant Store as 🌐 Store
    participant Fraud as 🛡️ Fraud check
    participant Processor as 💰 Payment processor

    Customer->>Store: Submit payment
    Store->>Fraud: Check transaction
    alt Fraud detected
        Fraud-->>Store: Block transaction
        Store-->>Customer: ❌ Payment declined
    else Clean transaction
        Fraud-->>Store: Approved
        Store->>Processor: Charge card
        alt Payment success
            Processor-->>Store: ✅ Charged
            Store-->>Customer: ✅ Order confirmed
        else Payment failed
            Processor-->>Store: ❌ Declined
            Store-->>Customer: ❌ Try another card
        end
    end
```

---

## Copy-Paste Template

```mermaid
sequenceDiagram
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    actor User as 👤 User
    participant App as 🌐 App
    participant Service as ⚙️ Service
    participant DB as 💾 Database

    User->>App: Initiate action
    App->>Service: Call service
    alt Success path
        Service-->>App: Return data
        App->>DB: Persist result
        DB-->>App: Confirmed
        App-->>User: ✅ Success response
    else Error path
        Service-->>App: Return error
        App-->>User: ❌ Error response
    end
```

---

## Tips

- `alt`/`else` for mutually exclusive paths
- `opt` for optional steps (single branch)
- `loop` for retry logic
- `par` for parallel operations
- Keep ≤5 participants — split into multiple diagrams if more needed
