<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# User Journey Diagrams

**Best for:** User experience flows, customer touchpoints, service blueprints, experience mapping.

---

## When to Use

- Documenting user experience across touchpoints
- Customer journey mapping
- Service blueprinting
- Identifying pain points in user flows
- Cross-channel experience visualization
- Stakeholder alignment on user experience

## When NOT to Use

- System architecture → use [Architecture](../architecture/index.md) or [C4](../c4/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- State transitions → use [State](../state/index.md)
- Time-based schedules → use [Gantt](../gantt/index.md)

---

## Syntax Reference

```
journey
 accTitle: Title Here
 accDescr: Description here

 section Section Name
  Task name: 5: Actor
  Task name: 3: Actor

 section Another Section
  Task name: 4: Actor
```

**Structure:**

- `section` — groups tasks by phase or stage
- `Task name: score: Actor` — task with satisfaction score (1–5) and actor
- Score indicates satisfaction level (5 = high, 1 = low)

---

## Complexity Levels

| File                               | Tasks | Use case                        |
| ---------------------------------- | ----- | ------------------------------- |
| [simple.md](simple.md)             | 3–6   | Single journey, few touchpoints |
| [intermediate.md](intermediate.md) | 6–12  | Multi-stage journey             |
| [advanced.md](advanced.md)         | 12–20 | Complex multi-actor journey     |

---

## Key Tips

- Use scores to indicate satisfaction (5 = excellent, 1 = poor)
- Group tasks into logical sections (discover, evaluate, purchase, etc.)
- Use consistent actor names across tasks
- Show pain points with low scores (1–2)
- Highlight positive moments with high scores (4–5)

## Anti-Patterns

```
%% ❌ All same scores (no insight)
journey
 section Onboarding
  Sign up: 3: User
  Verify email: 3: User
  Complete profile: 3: User

%% ✅ Fix: vary scores to show experience
journey
 section Onboarding
  Sign up: 4: User
  Verify email: 2: User
  Complete profile: 3: User

%% ❌ Too many actors
 section Purchase
  Browse: 4: User
  Add to cart: 4: User
  Checkout: 3: User
  Process: 5: System
  Notify: 5: Email service
  Ship: 4: Warehouse
  Deliver: 5: Carrier

%% ✅ Fix: focus on user experience
 section Purchase
  Browse products: 4: User
  Add to cart: 4: User
  Enter details: 2: User
  Complete purchase: 5: User
```

---

## Parser Gotchas

- Scores must be 1–5
- Actor names are case-sensitive
- Section names help organize the journey
- Tasks within a section display together
