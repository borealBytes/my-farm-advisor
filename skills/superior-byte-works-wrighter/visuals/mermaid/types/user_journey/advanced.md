<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# User Journey — Advanced (12–20 tasks)

Complex multi-actor journey. Use for comprehensive experience mapping and service blueprints.

---

## Example: Enterprise Sales Journey

```mermaid
journey
 accTitle: Enterprise Sales Process Journey
 accDescr: Complete enterprise sales journey showing prospect and sales team interactions

 section Awareness
  Attend webinar: 4: Prospect
  Download whitepaper: 3: Prospect
  Receive nurture email: 3: Prospect

 section Qualification
  Request demo: 5: Prospect
  Discovery call: 4: Prospect
  Receive proposal: 4: Prospect
  Technical review: 3: Prospect

 section Evaluation
  Pilot setup: 4: Prospect
  Test integration: 3: Prospect
  Security review: 2: Prospect
  Legal review: 3: Prospect

 section Decision
  Present to stakeholders: 4: Prospect
  Negotiate terms: 3: Prospect
  Sign contract: 5: Prospect
  Kickoff project: 5: Prospect
```

---

## Example: Multi-Channel Experience

```mermaid
journey
 accTitle: Multi Channel Customer Experience
 accDescr: Customer journey across web, mobile, and in-store touchpoints

 section Research
  Search online: 4: Customer
  Read reviews: 4: Customer
  Compare options: 3: Customer
  Visit website: 4: Customer

 section Consideration
  Create account: 3: Customer
  Save favorites: 4: Customer
  Get email reminder: 3: Customer
  Check app: 4: Customer

 section Purchase
  Visit store: 4: Customer
  Try product: 5: Customer
  Consult staff: 4: Customer
  Complete purchase: 5: Customer

 section Post-Purchase
  Receive confirmation: 5: Customer
  Track delivery: 4: Customer
  Unbox product: 5: Customer
  Register warranty: 3: Customer
  Leave review: 4: Customer
```

---

## Example: Employee Onboarding

```mermaid
journey
 accTitle: Employee Onboarding Journey
 accDescr: New employee journey from offer acceptance through first month

 section Pre-boarding
  Accept offer: 5: Employee
  Complete paperwork: 3: Employee
  Receive welcome kit: 4: Employee
  Set up accounts: 2: Employee

 section Day 1
  Arrive at office: 4: Employee
  Meet team: 5: Employee
  IT setup: 3: Employee
  Orientation: 4: Employee

 section Week 1
  Complete training: 4: Employee
  First assignment: 3: Employee
  Check in with manager: 4: Employee
  Team lunch: 5: Employee

 section Month 1
  Complete first project: 4: Employee
  Receive feedback: 4: Employee
  Set goals: 5: Employee
  Feel integrated: 5: Employee
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
  Task 4: 2: Actor

 section Phase 2
  Task 5: 3: Actor
  Task 6: 4: Actor
  Task 7: 5: Actor

 section Phase 3
  Task 8: 4: Actor
  Task 9: 3: Actor
  Task 10: 5: Actor

 section Phase 4
  Task 11: 4: Actor
  Task 12: 5: Actor
```

---

## Tips

- At 12+ tasks, consider if multiple focused journeys would be clearer
- Use sections to clearly separate journey phases
- Include multiple actors when showing handoffs
- Highlight pain points with scores of 1–2
- Consider adding callouts for improvement opportunities
