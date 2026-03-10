<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Requirement Diagram — Simple (3–6 elements)

Single requirement chain. Use for demonstrating traceability on one feature or component.

---

## Example: Authentication Requirement

```mermaid
requirementDiagram
  accTitle: Authentication Requirement Traceability
  accDescr: Simple requirement chain showing authentication requirement flowing through design to verification

  requirement AUTH [User authentication shall use MFA]
  element DESIGN [Auth service design]
  verification TEST [Integration test suite]

  AUTH --> DESIGN: derives
  DESIGN ..>> TEST: verifies
```

---

## Example: Data Retention Policy

```mermaid
requirementDiagram
  accTitle: Data Retention Requirement
  accDescr: Requirement for data retention with implementation and verification elements

  requirement RETENTION [User data retained for 7 years]
  element STORAGE [Archive storage system]
  verification AUDIT [Annual compliance audit]

  RETENTION --> STORAGE: implements
  STORAGE ..>> AUDIT: validates
```

---

## Example: API Rate Limiting

```mermaid
requirementDiagram
  accTitle: API Rate Limiting Requirement
  accDescr: Performance requirement for API rate limiting with design and test coverage

  functionalRequirement RATE [API limited to 1000 req/min per user]
  element GATEWAY [Rate limiter middleware]
  verification LOAD [Load testing validates limits]

  RATE --> GATEWAY: implements
  GATEWAY ..>> LOAD: verifies
```

---

## Copy-Paste Template

```mermaid
requirementDiagram
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  requirement REQ_ID [Requirement description here]
  element ELEM_ID [Implementation element]
  verification VERIFY_ID [Verification method]

  REQ_ID --> ELEM_ID: derives
  ELEM_ID ..>> VERIFY_ID: verifies
```

---

## Tips

- Keep to one requirement chain — single flow from requirement to verification
- Use clear, testable requirement language
- Link each element to the next with appropriate relationship type
- 3–4 elements is ideal for simple diagrams
