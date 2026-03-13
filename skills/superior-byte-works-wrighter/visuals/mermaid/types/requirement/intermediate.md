<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Requirement Diagram — Intermediate (6–12 elements)

Multiple requirement chains with cross-cutting concerns. Use for feature-level traceability.

---

## Example: Payment Processing Requirements

```mermaid
requirementDiagram
  accTitle: Payment Processing Requirements
  accDescr: Multiple requirement chains for payment processing including security, performance, and compliance

  requirement SEC [Payment data shall be encrypted]
  requirement PERF [Transaction processing under 2 seconds]
  requirement COMP [PCI DSS compliance required]

  element GATEWAY [Payment gateway service]
  element VAULT [Secure token vault]
  element PROCESSOR [Transaction processor]

  verification PEN [Penetration testing]
  verification LOAD [Load testing]
  verification AUDIT [Compliance audit]

  SEC --> GATEWAY: derives
  SEC --> VAULT: derives
  PERF --> PROCESSOR: derives
  COMP --> GATEWAY: derives
  COMP --> VAULT: derives

  GATEWAY ..>> PEN: verifies
  VAULT ..>> PEN: verifies
  PROCESSOR ..>> LOAD: verifies
  GATEWAY ..>> AUDIT: validates
  VAULT ..>> AUDIT: validates
```

---

## Example: User Management System

```mermaid
requirementDiagram
  accTitle: User Management Requirements
  accDescr: Requirements traceability for user management including authentication, authorization, and audit

  functionalRequirement AUTH [Role-based access control]
  functionalRequirement AUDIT [All actions logged]
  interfaceRequirement API [REST API for user ops]

  element SERVICE [User service]
  element LOGGER [Audit logging module]
  element ENDPOINT [API endpoints]

  verification UAT [User acceptance testing]
  verification REVIEW [Code review]
  verification TEST [API integration tests]

  AUTH --> SERVICE: implements
  AUDIT --> LOGGER: implements
  API --> ENDPOINT: implements

  SERVICE ..>> UAT: validates
  LOGGER ..>> REVIEW: verifies
  ENDPOINT ..>> TEST: verifies
  SERVICE ..>> AUDIT: satisfies
```

---

## Copy-Paste Template

```mermaid
requirementDiagram
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  requirement REQ_A [First requirement]
  requirement REQ_B [Second requirement]
  functionalRequirement FUNC_C [Functional requirement]

  element ELEM_1 [First implementation]
  element ELEM_2 [Second implementation]

  verification VERIFY_1 [First verification]
  verification VERIFY_2 [Second verification]

  REQ_A --> ELEM_1: derives
  REQ_B --> ELEM_2: derives
  FUNC_C --> ELEM_1: implements

  ELEM_1 ..>> VERIFY_1: verifies
  ELEM_2 ..>> VERIFY_2: verifies
```

---

## Tips

- Group related requirements that share implementation elements
- Show cross-cutting concerns (security, logging) affecting multiple components
- Use different requirement types to distinguish categories
- Keep verification methods specific to each requirement chain
- 6–8 elements per diagram is the sweet spot
