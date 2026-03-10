<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# C4 Diagram — Advanced (12–20 elements)

Component level (C4 Level 3) with detailed boundaries. Shows internal structure of applications. Use for deep dives into specific services.

---

## Example: API Service Components

```mermaid
C4Container
  accTitle: Order Service Component Diagram
  accDescr: Level 3 component diagram showing internal structure of order service with controllers, services, and repositories

  Person(customer, "Customer", "Online shopper")
  Container(spa, "Web App", "React", "Frontend")

  Container_Boundary(api, "Order Service API") {
    Component(controller, "Order Controller", "Spring REST", "Handles HTTP requests")
    Component(validator, "Order Validator", "Java", "Validates order data")
    Component(service, "Order Service", "Java", "Business logic")
    Component(pricing, "Pricing Engine", "Java", "Calculates totals")
    Component(repo, "Order Repository", "Spring Data", "Data access layer")
    Component(events, "Event Publisher", "Spring Events", "Publishes domain events")
  }

  ContainerDb(db, "Order Database", "PostgreSQL", "Order storage")
  ContainerQueue(queue, "Event Bus", "Kafka", "Order events")
  Container(payment, "Payment Service", "Go", "Payment processing")
  Container(inventory, "Inventory Service", "Java", "Stock management")

  Rel(customer, spa, "Places order", "HTTPS")
  Rel(spa, controller, "POST /orders", "JSON/HTTPS")
  Rel(controller, validator, "Validates")
  Rel(controller, service, "Processes")
  Rel(service, pricing, "Calculates price")
  Rel(service, repo, "Persists")
  Rel(service, events, "Publishes")
  Rel(repo, db, "Reads/Writes", "SQL")
  Rel(events, queue, "Publishes", "Avro/Kafka")
  Rel(service, payment, "Charges", "gRPC")
  Rel(service, inventory, "Reserves", "gRPC")
```

---

## Example: Full System with Multiple Boundaries

```mermaid
C4Container
  accTitle: SaaS Platform Architecture
  accDescr: Complete container diagram showing multi-tenant SaaS platform with web, API, worker, and data layers

  Person(admin, "Admin User", "Platform administrator")
  Person(end_user, "End User", "Customer using the platform")

  Container_Boundary(web_tier, "Web Tier") {
    Container(admin_portal, "Admin Portal", "React", "Management interface")
    Container(customer_app, "Customer App", "React", "End user interface")
    Container(cdn, "CDN", "CloudFront", "Static assets")
  }

  Container_Boundary(api_tier, "API Tier") {
    Container(gateway, "API Gateway", "Kong", "Routing and rate limiting")
    Container(auth, "Auth Service", "Node.js", "Authentication/authorization")
    Container(core_api, "Core API", "Python/FastAPI", "Business logic")
    Container(webhook, "Webhook Service", "Node.js", "Webhook delivery")
  }

  Container_Boundary(worker_tier, "Worker Tier") {
    Container(scheduler, "Job Scheduler", "Python", "Cron jobs")
    Container(processor, "Data Processor", "Python", "Background processing")
    Container(exporter, "Report Exporter", "Node.js", "PDF/CSV generation")
  }

  ContainerDb(primary, "Primary DB", "PostgreSQL", "Application data")
  ContainerDb(analytics, "Analytics DB", "ClickHouse", "Time-series data")
  ContainerDb(cache, "Cache", "Redis", "Sessions and rate limits")
  ContainerQueue(queue, "Task Queue", "Redis/RQ", "Background jobs")

  System_Ext(stripe, "Stripe", "Payment processing")
  System_Ext(sendgrid, "SendGrid", "Email delivery")
  System_Ext(s3, "S3", "File storage")

  Rel(admin, admin_portal, "Manages", "HTTPS")
  Rel(end_user, customer_app, "Uses", "HTTPS")
  Rel(admin_portal, cdn, "Loads assets", "HTTPS")
  Rel(customer_app, cdn, "Loads assets", "HTTPS")
  Rel(admin_portal, gateway, "Calls APIs", "JSON/HTTPS")
  Rel(customer_app, gateway, "Calls APIs", "JSON/HTTPS")
  Rel(gateway, auth, "Authenticates", "JWT/HTTPS")
  Rel(gateway, core_api, "Routes", "JSON/HTTPS")
  Rel(core_api, primary, "Reads/Writes", "SQL")
  Rel(core_api, cache, "Caches", "Redis")
  Rel(core_api, analytics, "Writes", "SQL")
  Rel(core_api, stripe, "Charges", "REST/HTTPS")
  Rel(core_api, sendgrid, "Sends emails", "REST/HTTPS")
  Rel(core_api, s3, "Stores files", "S3/HTTPS")
  Rel(core_api, queue, "Enqueues", "Redis")
  Rel(scheduler, queue, "Schedules", "Redis")
  Rel(processor, queue, "Consumes", "Redis")
  Rel(exporter, queue, "Consumes", "Redis")
  Rel(processor, primary, "Updates", "SQL")
  Rel(webhook, queue, "Consumes", "Redis")
  Rel(webhook, end_user, "Calls webhooks", "HTTPS")
```

---

## Copy-Paste Template

```mermaid
C4Container
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  Person(user, "User", "Description")
  Container(frontend, "Frontend App", "Tech", "Description")

  Container_Boundary(service, "Service Name") {
    Component(controller, "Controller", "Tech", "Description")
    Component(service_layer, "Service", "Tech", "Description")
    Component(repository, "Repository", "Tech", "Description")
    Component(helper, "Helper", "Tech", "Description")
  }

  ContainerDb(db, "Database", "Tech", "Description")
  ContainerQueue(queue, "Queue", "Tech", "Description")
  Container(other, "Other Service", "Tech", "Description")

  Rel(user, frontend, "Action", "Protocol")
  Rel(frontend, controller, "Calls", "Protocol")
  Rel(controller, service_layer, "Uses")
  Rel(service_layer, repository, "Uses")
  Rel(service_layer, helper, "Uses")
  Rel(repository, db, "Reads/Writes", "Protocol")
  Rel(service_layer, queue, "Publishes", "Protocol")
  Rel(service_layer, other, "Calls", "Protocol")
```

---

## Tips

- Use Container_Boundary to group related components
- Show the full data flow from user to database
- Include external service calls at this level
- Component diagrams can get large — consider splitting by service
- Label internal relationships even without protocols
- Keep component names descriptive but concise
