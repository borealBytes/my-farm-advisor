<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Architecture — Intermediate (4–8 components)

Multi-service architecture. Use for typical application architectures.

---

## Example: E-commerce Platform

```mermaid
architecture-beta
 accTitle: E-commerce Platform Architecture
 accDescr: E-commerce platform with frontend, services, and data layer

 service web [🌐 Web App] {
 }

 service mobile [📱 Mobile App] {
 }

 service gateway [🌐 API Gateway] {
 }

 service catalog [📦 Catalog] {
 }

 service cart [🛒 Cart] {
 }

 service payment [💳 Payment] {
 }

 service db [💾 Database] {
 }

 web --> gateway
 mobile --> gateway
 gateway --> catalog
 gateway --> cart
 gateway --> payment
 catalog --> db
 cart --> db
 payment --> db
```

---

## Example: SaaS Platform

```mermaid
architecture-beta
 accTitle: SaaS Platform Architecture
 accDescr: SaaS platform with multi-tenant services and shared infrastructure

 service cdn [🌐 CDN] {
 }

 service lb [⚖️ Load Balancer] {
 }

 service app [⚡ App Server] {
 }

 service worker [🔧 Background Worker] {
 }

 service cache [💾 Redis] {
 }

 service db [🗄️ PostgreSQL] {
 }

 service queue [📨 Message Queue] {
 }

 cdn --> lb
 lb --> app
 app --> cache
 app --> db
 app --> queue
 queue --> worker
 worker --> db
```

---

## Example: Data Pipeline

```mermaid
architecture-beta
 accTitle: Data Pipeline Architecture
 accDescr: Data processing pipeline with ingestion, processing, and storage

 service source [📥 Data Source] {
 }

 service ingest [⚡ Ingestion] {
 }

 service stream [🌊 Stream] {
 }

 service process [🔧 Processor] {
 }

 service storage [💾 Data Lake] {
 }

 service analytics [📊 Analytics] {
 }

 service viz [📈 Visualization] {
 }

 source --> ingest
 ingest --> stream
 stream --> process
 process --> storage
 storage --> analytics
 analytics --> viz
```

---

## Copy-Paste Template

```mermaid
architecture-beta
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this architecture shows

 service client [💻 Client] {
 }

 service gateway [🌐 Gateway] {
 }

 service service_a [⚡ Service A] {
 }

 service service_b [🔧 Service B] {
 }

 service cache [💾 Cache] {
 }

 service db [🗄️ Database] {
 }

 client --> gateway
 gateway --> service_a
 gateway --> service_b
 service_a --> cache
 service_a --> db
 service_b --> db
```

---

## Tips

- Group services by layer (presentation, application, data)
- Show external services distinctly
- Include caching where relevant
- Label important connections
