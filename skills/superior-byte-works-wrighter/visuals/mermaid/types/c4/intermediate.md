<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# C4 Diagram — Intermediate (6–12 elements)

Container level (C4 Level 2). Shows applications, databases, and how they communicate. Use when you need to explain the technology stack.

---

## Example: Web Application Containers

```mermaid
C4Container
  accTitle: E-Commerce Container Diagram
  accDescr: Level 2 container diagram showing web app, API, database, and cache with their interactions

  Person(customer, "Customer", "Online shopper")

  Container_Boundary(browser, "Browser") {
    Container(spa, "Single Page App", "React", "Customer-facing UI")
  }

  Container_Boundary(backend, "Backend Services") {
    Container(api, "API Gateway", "Node.js/Express", "Routes requests")
    Container(catalog, "Catalog Service", "Python/FastAPI", "Product catalog")
    Container(cart, "Cart Service", "Go", "Shopping cart logic")
  }

  ContainerDb(db, "Database", "PostgreSQL", "Product and order data")
  ContainerDb(cache, "Cache", "Redis", "Session and cart cache")
  ContainerQueue(queue, "Message Queue", "RabbitMQ", "Order events")

  Rel(customer, spa, "Uses", "HTTPS")
  Rel(spa, api, "Calls", "JSON/HTTPS")
  Rel(api, catalog, "Routes to", "gRPC")
  Rel(api, cart, "Routes to", "gRPC")
  Rel(catalog, db, "Reads", "SQL")
  Rel(cart, cache, "Reads/Writes", "Redis protocol")
  Rel(cart, queue, "Publishes", "AMQP")
```

---

## Example: Microservices Architecture

```mermaid
C4Container
  accTitle: Order Processing Microservices
  accDescr: Container diagram showing microservices for order processing with event-driven communication

  Person(agent, "Support Agent", "Customer service representative")

  Container_Boundary(web, "Web Layer") {
    Container(admin, "Admin Portal", "Vue.js", "Support interface")
  }

  Container_Boundary(services, "Service Layer") {
    Container(orders, "Order Service", "Java/Spring", "Order management")
    Container(inventory, "Inventory Service", "Java/Spring", "Stock management")
    Container(notification, "Notification Service", "Node.js", "Email/SMS")
  }

  ContainerDb(order_db, "Order DB", "PostgreSQL", "Order data")
  ContainerDb(inventory_db, "Inventory DB", "PostgreSQL", "Stock levels")
  ContainerQueue(events, "Event Bus", "Kafka", "Domain events")

  Rel(agent, admin, "Manages orders", "HTTPS")
  Rel(admin, orders, "Calls", "REST/HTTPS")
  Rel(orders, order_db, "Stores", "SQL")
  Rel(orders, events, "Publishes", "Avro/Kafka")
  Rel(inventory, events, "Subscribes", "Avro/Kafka")
  Rel(inventory, inventory_db, "Updates", "SQL")
  Rel(events, notification, "Triggers", "Avro/Kafka")
```

---

## Copy-Paste Template

```mermaid
C4Container
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  Person(user, "User", "Description")

  Container_Boundary(frontend, "Frontend") {
    Container(web, "Web App", "Technology", "Description")
  }

  Container_Boundary(backend, "Backend") {
    Container(api, "API Service", "Technology", "Description")
    Container(worker, "Background Worker", "Technology", "Description")
  }

  ContainerDb(db, "Database", "Technology", "Description")
  ContainerDb(cache, "Cache", "Technology", "Description")

  Rel(user, web, "Uses", "Protocol")
  Rel(web, api, "Calls", "Protocol")
  Rel(api, db, "Reads/Writes", "Protocol")
  Rel(api, cache, "Caches", "Protocol")
  Rel(api, worker, "Queues", "Protocol")
```

---

## Tips

- Group containers into logical boundaries (frontend, backend, data)
- Include technology in container definitions
- Label relationships with protocol (HTTPS, gRPC, SQL, etc.)
- Show data flow direction clearly
- Databases and queues are containers too — include them
- 6–10 containers is the sweet spot
