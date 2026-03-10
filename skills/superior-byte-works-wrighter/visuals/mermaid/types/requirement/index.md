<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Requirement Diagrams

**Best for:** Tracing requirements through design, implementation, and verification. Compliance documentation, safety-critical systems, regulatory submissions.

---

## When to Use

- Regulatory compliance (FDA, FAA, ISO)
- Safety-critical system documentation
- Requirements traceability matrices
- Design verification and validation
- Risk management (FMEA, hazard analysis)
- Contract deliverables with strict traceability

## When NOT to Use

- General process flows → use [Flowchart](../flowchart/index.md)
- System architecture → use [C4](../c4/index.md) or [Architecture](../architecture/index.md)
- Data relationships → use [ER](../er/index.md)

---

## Syntax Reference

```
requirementDiagram
  accTitle: Title Here
  accDescr: Description here

  requirement req_id [Requirement text]
  element elem_id [Element description]
  design design_id [Design spec]
  function func_id [Function spec]
  verification verify_id [Verification method]

  req_id --> elem_id: derives
  elem_id --> design_id: refines
  design_id --> func_id: implements
  func_id --> verify_id: verifies
```

**Requirement types:**

- `requirement` — high-level requirement
- `functionalRequirement` — functional spec
- `interfaceRequirement` — interface spec
- `performanceRequirement` — performance criteria
- `physicalRequirement` — physical constraints
- `designConstraint` — design limitation

**Relationships:**

- `-->` — derives/refines
- `..>` — copies/depends
- `-->>` — satisfies/implements
- `..>>` — verifies/validates

---

## Complexity Levels

| File                               | Elements | Use case                            |
| ---------------------------------- | -------- | ----------------------------------- |
| [simple.md](simple.md)             | 3–6      | Single requirement chain            |
| [intermediate.md](intermediate.md) | 6–12     | Multi-requirement with verification |
| [advanced.md](advanced.md)         | 12–20    | Full traceability matrix            |

---

## Key Tips

- Use unique, meaningful IDs (e.g., `REQ-001`, `FUNC-AUTH`)
- Keep requirement text concise but complete
- Link verification methods to each requirement
- Use consistent naming conventions across documents
- Include risk level or priority where relevant

## Anti-Patterns

```
%% ❌ Vague requirement text
requirement R1 [The system should be fast]

%% ✅ Fix: specific, measurable requirement
requirement R1 [System response time shall be under 200ms for 95% of requests]

%% ❌ Missing verification
requirement R2 [User data shall be encrypted]
%% No verification element linked

%% ✅ Fix: link to verification
requirement R2 [User data shall be encrypted]
verification V2 [Penetration test validates encryption]
R2 ..>> V2: verifies
```

---

## Parser Gotchas

- Requirement IDs must be unique across the diagram
- Avoid special characters in IDs — use `snake_case` or `kebab-case`
- Relationship arrows must point to existing elements
