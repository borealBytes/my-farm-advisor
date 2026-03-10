<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sequence — Advanced (5–8 participants)

Full protocol documentation with loops, parallel operations, and complex branching.

---

## Example: Microservice Request with Circuit Breaker

```mermaid
sequenceDiagram
    accTitle: Microservice Circuit Breaker Pattern
    accDescr: Full microservice request flow with circuit breaker, retry logic, and fallback cache response

    actor Client as 👤 Client
    participant Gateway as 🌐 API Gateway
    participant Auth as 🔐 Auth Service
    participant Breaker as 🛡️ Circuit Breaker
    participant Service as ⚙️ Target Service
    participant Cache as 💾 Cache
    participant Monitor as 📊 Monitoring

    Client->>Gateway: Request with JWT
    Gateway->>Auth: Validate token
    Auth-->>Gateway: Token valid

    Gateway->>Breaker: Forward request
    alt Circuit open (service down)
        Breaker->>Cache: Get cached response
        Cache-->>Breaker: Cached data
        Breaker-->>Gateway: ⚠️ Cached response
        Gateway-->>Client: ⚠️ Degraded response
        Breaker->>Monitor: Log circuit open
    else Circuit closed (service up)
        loop Retry up to 3 times
            Breaker->>Service: Forward request
            alt Service responds
                Service-->>Breaker: ✅ Response
                Breaker->>Cache: Update cache
                Breaker-->>Gateway: ✅ Fresh response
                Gateway-->>Client: ✅ Response
            else Service timeout
                Note over Breaker,Service: Retry after 500ms
            end
        end
        opt All retries failed
            Breaker->>Monitor: Log failure
            Breaker-->>Gateway: ❌ Service unavailable
            Gateway-->>Client: ❌ 503 error
        end
    end
```

---

## Example: Distributed Transaction (Saga Pattern)

```mermaid
sequenceDiagram
    accTitle: Distributed Saga Transaction Pattern
    accDescr: Saga pattern for distributed transactions with compensating transactions on failure

    participant Orchestrator as 🤖 Saga Orchestrator
    participant Order as 📋 Order Service
    participant Inventory as 📦 Inventory Service
    participant Payment as 💰 Payment Service
    participant Notify as 📤 Notification Service

    Orchestrator->>Order: Create order
    Order-->>Orchestrator: Order created

    Orchestrator->>Inventory: Reserve items
    alt Items available
        Inventory-->>Orchestrator: Items reserved
        Orchestrator->>Payment: Charge customer
        alt Payment success
            Payment-->>Orchestrator: Payment confirmed
            Orchestrator->>Notify: Send confirmation
            Notify-->>Orchestrator: ✅ Notified
        else Payment failed
            Payment-->>Orchestrator: ❌ Payment failed
            Orchestrator->>Inventory: Release reservation
            Orchestrator->>Order: Cancel order
            Orchestrator->>Notify: Send failure notice
        end
    else Items unavailable
        Inventory-->>Orchestrator: ❌ Out of stock
        Orchestrator->>Order: Cancel order
        Orchestrator->>Notify: Send out-of-stock notice
    end
```

---

## Copy-Paste Template

```mermaid
sequenceDiagram
    accTitle: REPLACE WITH 3-8 WORD TITLE
    accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

    actor User as 👤 User
    participant Gateway as 🌐 Gateway
    participant Auth as 🔐 Auth
    participant Service as ⚙️ Service
    participant DB as 💾 Database
    participant Monitor as 📊 Monitor

    User->>Gateway: Initiate request
    Gateway->>Auth: Validate credentials
    Auth-->>Gateway: Credentials valid

    loop Retry logic
        Gateway->>Service: Forward request
        alt Success
            Service->>DB: Persist data
            DB-->>Service: Confirmed
            Service-->>Gateway: ✅ Response
            Gateway-->>User: ✅ Success
        else Failure
            Service-->>Gateway: ❌ Error
            Gateway->>Monitor: Log error
        end
    end
```

---

## Tips

- Consider splitting into multiple diagrams if this exceeds 8 participants
- Use `Note over A,B:` for annotations spanning multiple participants
- `par`/`and` blocks for truly parallel operations
- `critical`/`option` blocks for critical sections
- Link to simpler overview diagram in prose
