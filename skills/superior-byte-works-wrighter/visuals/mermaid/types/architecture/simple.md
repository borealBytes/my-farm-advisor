<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Architecture — Simple (2–4 components)

Basic service relationships. Use for simple system overviews.

---

## Example: Three-Tier App

```mermaid
architecture-beta
 accTitle: Three Tier Application
 accDescr: Simple three-tier architecture with frontend, backend, and database

 service frontend [🎨 Frontend] {
 }

 service backend [⚡ Backend API] {
 }

 service database [💾 Database] {
 }

 frontend --> backend: HTTP/JSON
 backend --> database: SQL
```

---

## Example: Microservices

```mermaid
architecture-beta
 accTitle: Simple Microservices
 accDescr: Basic microservices architecture with gateway and services

 service gateway [🌐 Gateway] {
 }

 service users [👤 User Service] {
 }

 service orders [📦 Order Service] {
 }

 gateway --> users: Route
 gateway --> orders: Route
```

---

## Example: Client-Server

```mermaid
architecture-beta
 accTitle: Client Server Architecture
 accDescr: Simple client-server architecture with caching layer

 service client [💻 Client] {
 }

 service cache [⚡ Cache] {
 }

 service server [🖥️ Server] {
 }

 client --> cache: Check cache
 cache --> server: Cache miss
```

---

## Copy-Paste Template

```mermaid
architecture-beta
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this architecture shows

 service component_a [📋 Component A] {
 }

 service component_b [🔧 Component B] {
 }

 service component_c [✅ Component C] {
 }

 component_a --> component_b: Connection
 component_b --> component_c: Connection
```

---

## Tips

- 2–4 components is ideal for simple diagrams
- Use emojis to distinguish component types
- Show primary data flow direction
- Keep connection labels short
