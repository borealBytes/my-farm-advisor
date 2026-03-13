<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Architecture — Advanced (8–12 components)

Complex distributed systems. Use for enterprise architectures.

---

## Example: Enterprise Platform

```mermaid
architecture-beta
 accTitle: Enterprise Platform Architecture
 accDescr: Full enterprise platform with microservices, event-driven components, and data stores

 service web [🌐 Web App] {
 }

 service mobile [📱 Mobile] {
 }

 service gateway [🌐 Gateway] {
 }

 service auth [🔐 Auth] {
 }

 service users [👤 Users] {
 }

 service orders [📦 Orders] {
 }

 service inventory [📊 Inventory] {
 }

 service payments [💳 Payments] {
 }

 service notifications [📧 Notifications] {
 }

 service cache [💾 Redis] {
 }

 service db [🗄️ PostgreSQL] {
 }

 service events [📨 Event Bus] {
 }

 web --> gateway
 mobile --> gateway
 gateway --> auth
 gateway --> users
 gateway --> orders
 users --> cache
 users --> db
 orders --> db
 orders --> events
 events --> inventory
 events --> payments
 events --> notifications
 inventory --> db
 payments --> db
```

---

## Example: Multi-Region System

```mermaid
architecture-beta
 accTitle: Multi Region Distributed System
 accDescr: Distributed system with regional deployments and global services

 service dns [🌐 DNS] {
 }

 service cdn [📦 CDN] {
 }

 service region1 [🏢 Region 1] {
 }

 service region2 [🏢 Region 2] {
 }

 service global [🌍 Global Services] {
 }

 service replication [🔄 Replication] {
 }

 service analytics [📊 Analytics] {
 }

 service storage [💾 Object Store] {
 }

 dns --> cdn
cdn --> region1
cdn --> region2
 region1 --> global
 region2 --> global
 region1 --> replication
 region2 --> replication
 replication --> storage
 global --> analytics
```

---

## Example: ML Platform

```mermaid
architecture-beta
 accTitle: Machine Learning Platform
 accDescr: ML platform with training, serving, and monitoring components

 service ui [🎨 ML UI] {
 }

 service api [⚡ ML API] {
 }

 service feature [🔧 Feature Store] {
 }

 service training [🎓 Training] {
 }

 service registry [📋 Model Registry] {
 }

 service serving [🚀 Serving] {
 }

 service monitoring [📊 Monitoring] {
 }

 service data [💾 Data Lake] {
 }

 service experiments [🧪 Experiments] {
 }

 ui --> api
 ui --> experiments
 api --> serving
 api --> feature
 feature --> data
 training --> data
 training --> feature
 training --> registry
 registry --> serving
 serving --> monitoring
 experiments --> data
 experiments --> training
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

 service service_c [📊 Service C] {
 }

 service events [📨 Events] {
 }

 service cache [💾 Cache] {
 }

 service db [🗄️ Database] {
 }

 service analytics [📈 Analytics] {
 }

 client --> gateway
 gateway --> service_a
 gateway --> service_b
 service_a --> cache
 service_a --> db
 service_a --> events
 service_b --> db
 service_b --> events
 events --> service_c
 service_c --> analytics
```

---

## Tips

- At 8+ components, consider grouping or using C4 diagrams
- Show event-driven flows with event bus
- Include monitoring and observability
- Document external dependencies
