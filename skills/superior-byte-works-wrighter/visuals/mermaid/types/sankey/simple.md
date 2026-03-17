<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sankey Diagram — Simple (3–6 nodes)

Single-stage flow. Use for showing distribution from sources to destinations.

---

## Example: Energy Sources

```mermaid
sankey-beta
  accTitle: Energy Source Distribution
  accDescr: Simple energy flow from sources to consumption categories

  Solar, Wind, Coal, Grid, Homes, Industry

  Solar --> Grid : 30
  Wind --> Grid : 25
  Coal --> Grid : 45
  Grid --> Homes : 60
  Grid --> Industry : 40
```

---

## Example: Budget Allocation

```mermaid
sankey-beta
  accTitle: Budget Allocation Flow
  accDescr: Simple budget flow from revenue to expense categories

  Revenue, Engineering, Marketing, Operations, Salaries, Infrastructure, Ads, Events, Office, Tools

  Revenue --> Engineering : 50
  Revenue --> Marketing : 30
  Revenue --> Operations : 20

  Engineering --> Salaries : 35
  Engineering --> Infrastructure : 15

  Marketing --> Ads : 20
  Marketing --> Events : 10

  Operations --> Office : 12
  Operations --> Tools : 8
```

---

## Example: User Journey Flow

```mermaid
sankey-beta
  accTitle: User Conversion Funnel
  accDescr: Simple flow showing user drop-off through conversion funnel

  Visitors, Signups, Active, Premium, Churned

  Visitors --> Signups : 1000
  Visitors --> Churned : 4000
  Signups --> Active : 700
  Signups --> Churned : 300
  Active --> Premium : 200
  Active --> Churned : 500
```

---

## Copy-Paste Template

```mermaid
sankey-beta
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  Source_A, Source_B, Intermediate, Destination_X, Destination_Y

  Source_A --> Intermediate : 50
  Source_B --> Intermediate : 30
  Intermediate --> Destination_X : 45
  Intermediate --> Destination_Y : 35
```

---

## Tips

- Keep it simple — single stage flows work best
- Use meaningful node names that describe what they represent
- Quantities determine link width — ensure they make visual sense
- Total input should equal total output for balance
- Simple diagrams work best for single-stage flows
- 3–6 nodes is the sweet spot
