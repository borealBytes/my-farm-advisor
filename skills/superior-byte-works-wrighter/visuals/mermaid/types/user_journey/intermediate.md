<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# User Journey — Intermediate (6–12 tasks)

Multi-section journey. Use for complete user experiences across multiple stages.

---

## Example: SaaS Trial Journey

```mermaid
journey
 accTitle: SaaS Trial User Journey
 accDescr: Complete trial journey from discovery through conversion or churn

 section Discovery
  See ad: 3: Prospect
  Visit website: 4: Prospect
  Watch demo: 5: Prospect

 section Evaluation
  Sign up for trial: 4: Prospect
  Receive welcome email: 3: Prospect
  Explore features: 4: Prospect

 section Decision
  Hit usage limit: 2: Prospect
  View pricing: 3: Prospect
  Talk to sales: 4: Prospect
  Subscribe: 5: Customer
```

---

## Example: Product Return

```mermaid
journey
 accTitle: Product Return Journey
 accDescr: Customer journey through product return process

 section Initiate
  Discover issue: 2: Customer
  Find return policy: 3: Customer
  Request return: 4: Customer

 section Process
  Receive label: 5: Customer
  Package item: 3: Customer
  Drop off: 4: Customer

 section Resolution
  Track return: 4: Customer
  Receive refund: 5: Customer
  Get confirmation: 5: Customer
```

---

## Example: Feature Adoption

```mermaid
journey
 accTitle: New Feature Adoption Journey
 accDescr: User journey from feature announcement through regular usage

 section Awareness
  See announcement: 3: User
  Read documentation: 4: User
  Watch tutorial: 5: User

 section Trial
  Enable feature: 4: User
  First use: 3: User
  Encounter issue: 2: User
  Find workaround: 3: User

 section Adoption
  Daily use: 4: User
  Recommend to team: 5: User
  Become advocate: 5: User
```

---

## Copy-Paste Template

```mermaid
journey
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this journey shows

 section Phase 1
  Task 1: 4: Actor
  Task 2: 3: Actor
  Task 3: 5: Actor

 section Phase 2
  Task 4: 3: Actor
  Task 5: 2: Actor
  Task 6: 4: Actor

 section Phase 3
  Task 7: 5: Actor
  Task 8: 4: Actor
```

---

## Tips

- Use sections to group by journey phase
- 2–4 tasks per section is ideal
- Vary scores to show experience highs and lows
- Consider adding a second actor for system interactions
