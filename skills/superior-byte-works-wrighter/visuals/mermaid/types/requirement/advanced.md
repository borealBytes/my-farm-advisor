<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Requirement Diagram — Advanced (12–20 elements)

Full traceability matrix with multiple requirement types, design elements, and verification methods. Use for system-level compliance documentation.

---

## Example: Healthcare System Compliance

```mermaid
requirementDiagram
  accTitle: Healthcare System Requirements Traceability
  accDescr: Complete traceability matrix for HIPAA-compliant healthcare system with security, audit, and data retention requirements

  requirement HIPAA [HIPAA compliance required]
  requirement ENCRYPT [PHI shall be encrypted at rest]
  requirement ACCESS [Role-based access to PHI]
  requirement AUDIT [Access to PHI logged]
  requirement RETENTION [PHI retained per regulation]

  element DB [Encrypted database]
  element API [API gateway with auth]
  element AUDIT_SVC [Audit service]
  element STORAGE [Archive storage]
  element UI [Web application]

  design ARCH [System architecture]
  function AUTH_FUNC [Authentication module]

  verification PEN_TEST [Security penetration test]
  verification AUDIT_REVIEW [Audit log review]
  verification UAT [User acceptance testing]
  verification COMPLIANCE [Compliance assessment]

  HIPAA --> ENCRYPT: decomposes
  HIPAA --> ACCESS: decomposes
  HIPAA --> AUDIT: decomposes
  HIPAA --> RETENTION: decomposes

  ENCRYPT --> DB: implements
  ENCRYPT --> STORAGE: implements
  ACCESS --> API: implements
  ACCESS --> UI: implements
  AUDIT --> AUDIT_SVC: implements
  RETENTION --> STORAGE: implements

  ARCH --> API: refines
  ARCH --> DB: refines
  AUTH_FUNC --> API: refines

  DB ..>> PEN_TEST: verifies
  STORAGE ..>> PEN_TEST: verifies
  API ..>> PEN_TEST: verifies
  AUDIT_SVC ..>> AUDIT_REVIEW: verifies
  UI ..>> UAT: validates
  API ..>> COMPLIANCE: validates
  AUDIT_SVC ..>> COMPLIANCE: validates
```

---

## Example: Safety-Critical Aviation System

```mermaid
requirementDiagram
  accTitle: Aviation System Safety Requirements
  accDescr: DO-178C compliant requirements traceability for flight control system with safety, performance, and reliability requirements

  requirement SAFETY [Fail-safe operation required]
  requirement REDUNDANCY [Triple modular redundancy]
  requirement RESPONSE [Control response under 50ms]
  requirement RELIABILITY [MTBF greater than 10000 hours]

  functionalRequirement FLT_CTRL [Flight control algorithm]
  functionalRequirement MONITOR [Health monitoring]
  performanceRequirement LATENCY [Sensor to actuator latency]

  element FCU [Flight control unit]
  element SENSOR [Sensor array]
  element ACTUATOR [Actuator system]
  element VOTER [Voting logic]
  element DIAG [Diagnostic system]

  design SW_ARCH [Software architecture]
  design HW_ARCH [Hardware architecture]

  verification HIL [Hardware-in-loop testing]
  verification SIL [Software-in-loop testing]
  verification CERT [Certification testing]
  verification FMEA [Failure mode analysis]

  SAFETY --> REDUNDANCY: requires
  SAFETY --> FLT_CTRL: requires
  REDUNDANCY --> VOTER: implements
  RESPONSE --> LATENCY: constrains
  RELIABILITY --> MONITOR: requires

  FLT_CTRL --> FCU: allocates
  MONITOR --> DIAG: allocates
  LATENCY --> SENSOR: constrains
  LATENCY --> ACTUATOR: constrains

  SW_ARCH --> FCU: refines
  SW_ARCH --> VOTER: refines
  HW_ARCH --> SENSOR: refines
  HW_ARCH --> ACTUATOR: refines

  FCU ..>> HIL: verifies
  FCU ..>> SIL: verifies
  VOTER ..>> FMEA: validates
  DIAG ..>> CERT: validates
  SENSOR ..>> HIL: verifies
  ACTUATOR ..>> HIL: verifies
```

---

## Copy-Paste Template

```mermaid
requirementDiagram
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  requirement REQ_1 [High-level requirement]
  requirement REQ_2 [Derived requirement]
  functionalRequirement FUNC_1 [Functional spec]
  performanceRequirement PERF_1 [Performance criteria]

  element ELEM_1 [Implementation component]
  element ELEM_2 [Implementation component]
  element ELEM_3 [Implementation component]

  design DESIGN_1 [Design specification]
  function FUNC_SPEC [Function specification]

  verification VERIFY_1 [Verification method]
  verification VERIFY_2 [Verification method]
  verification VERIFY_3 [Verification method]

  REQ_1 --> REQ_2: decomposes
  REQ_2 --> FUNC_1: derives
  REQ_2 --> PERF_1: constrains

  FUNC_1 --> ELEM_1: implements
  FUNC_1 --> ELEM_2: implements
  PERF_1 --> ELEM_3: constrains

  DESIGN_1 --> ELEM_1: refines
  FUNC_SPEC --> ELEM_2: refines

  ELEM_1 ..>> VERIFY_1: verifies
  ELEM_2 ..>> VERIFY_2: verifies
  ELEM_3 ..>> VERIFY_3: verifies
```

---

## Tips

- Organize by requirement hierarchy (high-level → derived → implementation)
- Use all requirement types to distinguish categories (functional, performance, interface, etc.)
- Include both design and function specifications for complex systems
- Link multiple verification methods to critical requirements
- Consider splitting into multiple diagrams if exceeding 20 elements
- Use consistent ID prefixes (REQ-, FUNC-, PERF-, etc.) for clarity
