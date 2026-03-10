# Cloud Architecture Review

---

## Document Control

| Field | Value |
|-------|-------|
| **Cloud Provider** | [AWS/Azure/GCP] |
| **Architecture** | [Microservices/Serverless/etc.] |

## Architecture Diagram

```mermaid
C4Context
    title Cloud Architecture
    Person(user, "User")
    System_Boundary(app, "Application") {
        Container(web, "Web Tier")
        Container(api, "API Tier")
        Container(db, "Database")
    }
    System_Ext(cdn, "CDN")
    Rel(user, web, "Uses")
    Rel(web, api, "Calls")
    Rel(api, db, "Reads/Writes")
