<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# C4 Diagram — Simple (3–6 elements)

System Context level (C4 Level 1). Shows the big picture: what the system is, who uses it, and external dependencies.

---

## Example: E-Commerce System Context

```mermaid
C4Context
  accTitle: E-Commerce System Context
  accDescr: Level 1 context diagram showing users, the e-commerce system, and external payment provider

  Person(customer, "Customer", "Online shopper")
  System(shop, "E-Commerce Platform", "Allows customers to browse and purchase products")
  System_Ext(payment, "Payment Gateway", "External payment processing")
  System_Ext(shipping, "Shipping Provider", "External logistics service")

  Rel(customer, shop, "Browses and purchases")
  Rel(shop, payment, "Processes payments")
  Rel(shop, shipping, "Fulfills orders")
```

---

## Example: Internal Tool Context

```mermaid
C4Context
  accTitle: Analytics Dashboard Context
  accDescr: Context diagram for internal analytics tool showing users and data sources

  Person(analyst, "Data Analyst", "Business intelligence team")
  Person(manager, "Manager", "Reviews reports")
  System(dashboard, "Analytics Dashboard", "Visualizes business metrics")
  System_Ext(warehouse, "Data Warehouse", "Source of truth for metrics")

  Rel(analyst, dashboard, "Creates reports")
  Rel(manager, dashboard, "Views dashboards")
  Rel(dashboard, warehouse, "Queries data")
```

---

## Example: API Platform Context

```mermaid
C4Context
  accTitle: API Platform Context
  accDescr: Context diagram showing API platform with consumers and external identity provider

  Person(developer, "API Consumer", "Third-party developer")
  System(platform, "API Platform", "Provides REST APIs for integration")
  System_Ext(auth, "Identity Provider", "OAuth 2.0 authentication")
  System_Ext(billing, "Billing System", "Usage-based billing")

  Rel(developer, platform, "Integrates with APIs")
  Rel(platform, auth, "Authenticates users")
  Rel(platform, billing, "Reports usage")
```

---

## Copy-Paste Template

```mermaid
C4Context
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  Person(user, "User Role", "Description of user")
  System(system, "System Name", "What the system does")
  System_Ext(external, "External System", "External dependency")

  Rel(user, system, "Interaction description")
  Rel(system, external, "Integration description")
```

---

## Tips

- Focus on "what" not "how" — no implementation details at this level
- Keep to 3–5 elements for clarity
- External systems go on the right, users on the left
- Describe the value exchange in relationship labels
- This is your "elevator pitch" architecture view
