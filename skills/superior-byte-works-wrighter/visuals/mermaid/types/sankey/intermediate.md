<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sankey Diagram — Intermediate (10–20 nodes)

Multi-stage flows with branching. Use for showing how inputs split and merge across categories.

---

## Example: Energy Distribution System

```mermaid
sankey-beta
  accTitle: Energy Distribution Network
  accDescr: Multi-stage energy flow from generation sources through grid to end consumers

  %% Generation sources
  Solar, Wind, Natural_Gas, Coal, Nuclear, Hydro

  %% Grid nodes
  Renewable_Grid, Fossil_Grid, Nuclear_Grid, Main_Grid

  %% Consumption
  Residential, Commercial, Industrial, Transportation, Losses

  %% Generation to grid
  Solar --> Renewable_Grid : 150
  Wind --> Renewable_Grid : 200
  Hydro --> Renewable_Grid : 100
  Natural_Gas --> Fossil_Grid : 300
  Coal --> Fossil_Grid : 250
  Nuclear --> Nuclear_Grid : 400

  %% Grid consolidation
  Renewable_Grid --> Main_Grid : 450
  Fossil_Grid --> Main_Grid : 550
  Nuclear_Grid --> Main_Grid : 400

  %% Distribution to consumers
  Main_Grid --> Residential : 450
  Main_Grid --> Commercial : 350
  Main_Grid --> Industrial : 400
  Main_Grid --> Transportation : 150
  Main_Grid --> Losses : 50
```

---

## Example: Financial Flow Analysis

```mermaid
sankey-beta
  accTitle: Company Financial Flows
  accDescr: Financial flow from revenue through departments to expenses and investments

  %% Revenue sources
  Product_Sales, Services, Subscriptions, Licensing

  %% Department allocation
  Engineering, Sales, Marketing, G_A, Support

  %% Expense categories
  Salaries, Infrastructure, Advertising, Events, Software, Facilities, Training, R_D

  %% Investments
  Savings, Equipment, Acquisitions

  %% Revenue to departments
  Product_Sales --> Engineering : 200
  Product_Sales --> Sales : 150
  Services --> Support : 100
  Services --> Engineering : 80
  Subscriptions --> Engineering : 120
  Subscriptions --> Support : 60
  Licensing --> Sales : 90
  Licensing --> G_A : 50

  %% Department to expenses
  Engineering --> Salaries : 280
  Engineering --> Infrastructure : 70
  Engineering --> R_D : 50

  Sales --> Salaries : 150
  Sales --> Software : 40
  Sales --> Training : 50

  Marketing --> Advertising : 80
  Marketing --> Events : 50
  Marketing --> Salaries : 40

  G_A --> Salaries : 30
  G_A --> Facilities : 20

  Support --> Salaries : 100
  Support --> Software : 40
  Support --> Training : 20

  %% Remaining to investments
  Engineering --> Savings : 100
  Sales --> Equipment : 50
  Marketing --> Savings : 40
  G_A --> Savings : 30
  Support --> Savings : 40
```

---

## Copy-Paste Template

```mermaid
sankey-beta
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  %% Level 1: Sources
  Source_A, Source_B, Source_C

  %% Level 2: Processing/Intermediate
  Process_X, Process_Y

  %% Level 3: Destinations
  Dest_1, Dest_2, Dest_3, Dest_4

  %% Source to process
  Source_A --> Process_X : 100
  Source_B --> Process_X : 80
  Source_B --> Process_Y : 40
  Source_C --> Process_Y : 60

  %% Process to destination
  Process_X --> Dest_1 : 90
  Process_X --> Dest_2 : 90
  Process_Y --> Dest_3 : 70
  Process_Y --> Dest_4 : 30
```

---

## Tips

- Use intermediate nodes to show consolidation or distribution points
- Ensure flow conservation (inputs = outputs) at each node
- Group related nodes visually by naming convention
- Consider the story: what insight should the reader gain?
- 3–4 levels of depth is usually sufficient
- Label nodes clearly — the diagram tells the quantitative story
