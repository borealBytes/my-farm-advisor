---
name: Architecture Specification
description: System architecture specification with component diagrams, data flow, and deployment topology
version: 1.0.0
author: Omni Unified Writing
---

# Architecture Spec: [System Name]

> [!NOTE]
> This document describes the complete architecture of the system. It serves as the authoritative reference for developers, operators, and stakeholders. Keep it current as the system evolves.

| Field             | Value                         |
| ----------------- | ----------------------------- |
| **System**        | [System name]                 |
| **Version**       | [vN.N]                        |
| **Status**        | Draft / Approved / Deprecated |
| **Owner**         | [Team name]                   |
| **Last reviewed** | [YYYY-MM-DD]                  |

---

## System Overview

> [!IMPORTANT]
> Describe what the system does in 2-3 sentences. Focus on capabilities, not implementation details. Include scale metrics if relevant.

**Example:** The Order Processing Service handles checkout flows for the e-commerce platform. It orchestrates payment, inventory, and fulfillment services to complete customer orders. Currently processes 50,000 orders daily with peaks of 2,000 orders per minute.

---

## Component Diagram

```mermaid
flowchart TB
    accTitle: System Components
    accDescr: High-level component architecture showing service boundaries

    subgraph Clients["Client Layer"]
        web[Web App]
        mobile[Mobile App]
        api[API Clients]
    end

    subgraph Gateway["Gateway Layer"]
        lb[Load Balancer]
        auth[Auth Gateway]
    end

    subgraph Services["Service Layer"]
        api[API Service]
        worker[Worker Service]
        notify[Notification Service]
    end

    subgraph Data["Data Layer"]
        db[(Primary DB)]
        cache[(Redis Cache)]
        queue[Message Queue]
    end

    web --> lb
    mobile --> lb
    lb --> auth
    auth --> api
    api --> db
    api --> cache
    api --> queue
    queue --> worker
    worker --> notify
```

---

## Data Flow

> [!TIP]
> Show the end-to-end flow for the primary use case. This helps identify coupling points and failure modes.

### Primary Flow: [Use Case Name]

```mermaid
sequenceDiagram
    accTitle: Order Processing Flow
    accDescr: Sequence of calls for a typical order completion

    participant C as Client
    participant G as API Gateway
    participant O as Order Service
    participant P as Payment Service
    participant I as Inventory Service
    participant D as Database

    C->>G: POST /orders
    G->>O: Forward request
    O->>I: Check stock
    I-->>O: Stock available
    O->>P: Process payment
    P-->>O: Payment confirmed
    O->>D: Save order
    O-->>G: Order created
    G-->>C: 201 Created
```

---

## Component Details

| Component      | Technology        | Purpose                   | Scaling                     |
| -------------- | ----------------- | ------------------------- | --------------------------- |
| API Service    | Node.js / Express | HTTP request handling     | Horizontal (3-10 instances) |
| Worker Service | Python / Celery   | Background job processing | Horizontal (2-8 workers)    |
| Primary DB     | PostgreSQL 15     | Transactional data        | Vertical + Read replicas    |
| Cache          | Redis 7           | Session + query caching   | Cluster mode                |
| Message Queue  | RabbitMQ          | Async job distribution    | 3-node cluster              |

---

## Deployment Topology

```mermaid
flowchart TB
    accTitle: Deployment Architecture
    accDescr: Production deployment across availability zones

    subgraph AZ1["Availability Zone 1"]
        api1[API Instance 1]
        worker1[Worker 1]
        db1[(DB Primary)]
    end

    subgraph AZ2["Availability Zone 2"]
        api2[API Instance 2]
        worker2[Worker 2]
        db2[(DB Replica)]
    end

    subgraph AZ3["Availability Zone 3"]
        api3[API Instance 3]
        worker3[Worker 3]
    end

    lb[Global Load Balancer] --> api1
    lb --> api2
    lb --> api3
```

---

## Security Boundaries

> [!WARNING]
> Document trust boundaries and authentication requirements. This is critical for security reviews.

| Boundary            | Authentication | Authorization           |
| ------------------- | -------------- | ----------------------- |
| Client to Gateway   | JWT (Bearer)   | N/A                     |
| Gateway to Services | mTLS           | Role-based              |
| Service to Database | IAM / Password | Row-level security      |
| Service to Cache    | Password       | None (isolated per env) |

---

## Performance Characteristics

| Metric       | Target      | Current     |
| ------------ | ----------- | ----------- |
| p99 Latency  | < 200ms     | 180ms       |
| Throughput   | 2,000 req/s | 1,800 req/s |
| Availability | 99.99%      | 99.97%      |
| Error rate   | < 0.1%      | 0.05%       |

---

## Failure Modes

| Component | Failure Scenario  | Mitigation                                   |
| --------- | ----------------- | -------------------------------------------- |
| Database  | Primary outage    | Automatic failover to replica (< 30s)        |
| Cache     | Redis unavailable | Fallback to database (slower but functional) |
| Queue     | Message backlog   | Alert at 10k messages; scale workers         |
| Service   | Instance crash    | Health checks remove from LB; auto-restart   |

---

## References

- [ADR-012 — Database Selection](../adr/ADR-012.md)
- [API Specification](../software/api_spec.md)
- [Runbook: Database Failover](../../runbooks/db-failover.md)
- [Monitoring Dashboard](https://grafana.example.com/d/system)

---

_Last updated: [Date]_

---

## See Also

- [Request for Comments (RFC)](./rfc_template.md) — For proposing architectural changes
- [Database Schema](./database_schema.md) — For detailed data model documentation
- [API Design](./api_design.md) — For service interface specifications
- [ADR Template](../software/adr.md) — For documenting architectural decisions
