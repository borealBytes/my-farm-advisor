<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Mindmap — Advanced (20–30 nodes)

Complex system overview with multiple branches and depth. Use for comprehensive documentation.

---

## Example: Platform Architecture

```mermaid
mindmap
 accTitle: Full Platform Architecture
 accDescr: Comprehensive mindmap of platform architecture including all services and infrastructure

 root((☁️ Platform))
  🌐 Gateway
   Load balancer
   Rate limiting
   SSL termination
   Request routing
  🔐 Security
   Auth service
   JWT validation
   API keys
   Rate limits
  ⚡ Services
   User service
   Order service
   Payment service
   Notification service
   Analytics service
  💾 Storage
   Primary DB
   Read replicas
   Cache layer
   Object storage
   Search index
  📊 Observability
   Logging
   Metrics
   Tracing
   Alerting
   Dashboards
  🚀 Deployment
   Container registry
   Orchestration
   Auto-scaling
   Health checks
```

---

## Example: Company Organization

```mermaid
mindmap
 accTitle: Company Organization Structure
 accDescr: Mindmap showing company departments, teams, and key functions

 root((🏢 Company))
  👔 Leadership
   CEO
   CTO
   CFO
   VP Engineering
   VP Product
  💻 Engineering
   Platform team
   Product teams
   QA team
   DevOps team
   Security team
  🎨 Product
   Product managers
   UX designers
   UX researchers
   Data analysts
  📈 Growth
   Marketing
   Sales
   Customer success
   Partnerships
  🛠️ Operations
   HR
   Finance
   Legal
   IT support
```

---

## Example: Technology Stack

```mermaid
mindmap
 accTitle: Full Technology Stack
 accDescr: Complete technology stack mindmap covering all layers of the application

 root((🛠️ Stack))
  🎨 Presentation
   React
   TypeScript
   Tailwind CSS
   Storybook
   Jest
  ⚡ Application
   Node.js
   Express
   GraphQL
   REST APIs
   WebSocket
  💾 Data
   PostgreSQL
   Redis
   Elasticsearch
   S3
   Kafka
  🔧 Infrastructure
   Docker
   Kubernetes
   Terraform
   AWS
   Cloudflare
  📊 Monitoring
   Datadog
   PagerDuty
   Grafana
   ELK Stack
   Jaeger
```

---

## Copy-Paste Template

```mermaid
mindmap
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this mindmap shows

 root((🎯 Root))
  📋 Category A
   Sub A1
    Detail 1
    Detail 2
   Sub A2
    Detail 3
  🔧 Category B
   Sub B1
    Detail 4
    Detail 5
   Sub B2
  ✅ Category C
   Sub C1
   Sub C2
   Sub C3
  🚀 Category D
   Sub D1
    Detail 6
   Sub D2
```

---

## Tips

- At 20+ nodes, consider if multiple smaller mindmaps would be clearer
- Maximum 4 levels deep (root + 3)
- Use consistent indentation (2 spaces per level)
- Group related items under clear category names
- Consider splitting into multiple diagrams if exceeding 30 nodes
