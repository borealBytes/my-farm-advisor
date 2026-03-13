<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Sankey Diagram — Advanced (20–30 nodes)

Complex multi-stage flows with multiple inputs, transformations, and outputs. Use for comprehensive system analysis.

---

## Example: Global Carbon Flow

```mermaid
sankey-beta
  accTitle: Global Carbon Flow Analysis
  accDescr: Comprehensive carbon flow from sources through processes to sinks and atmosphere

  %% Natural sources
  Fossil_Fuels, Deforestation, Cement, Agriculture, Natural_Sources

  %% Processes
  Energy_Production, Industry, Transport, Buildings, Land_Use

  %% Sinks and outputs
  Atmosphere, Ocean_Sink, Forest_Sink, Soil_Sink, Captured

  %% Source to process
  Fossil_Fuels --> Energy_Production : 35
  Fossil_Fuels --> Transport : 15
  Fossil_Fuels --> Industry : 10
  Fossil_Fuels --> Buildings : 5

  Deforestation --> Land_Use : 10
  Agriculture --> Land_Use : 8
  Agriculture --> Industry : 2

  Cement --> Industry : 4

  Natural_Sources --> Atmosphere : 750

  %% Process to atmosphere
  Energy_Production --> Atmosphere : 35
  Transport --> Atmosphere : 15
  Industry --> Atmosphere : 14
  Buildings --> Atmosphere : 5
  Land_Use --> Atmosphere : 18

  %% Process to sinks
  Energy_Production --> Captured : 2
  Industry --> Captured : 2

  %% Natural sinks
  Atmosphere --> Ocean_Sink : 250
  Atmosphere --> Forest_Sink : 300
  Atmosphere --> Soil_Sink : 150
```

---

## Example: Supply Chain Material Flow

```mermaid
sankey-beta
  accTitle: Manufacturing Supply Chain Flow
  accDescr: Complete material flow from raw materials through manufacturing to finished products and waste

  %% Raw materials
  Iron_Ore, Coal, Limestone, Bauxite, Petroleum, Wood, Sand, Copper

  %% Processing stages
  Steel_Mill, Aluminum_Plant, Plastic_Factory, Lumber_Mill, Glass_Works, Refinery, Component_Mfg

  %% Assembly
  Auto_Assembly, Electronics_Assembly, Furniture_Assembly, Packaging

  %% Products
  Vehicles, Electronics, Furniture, Packaging_Materials

  %% Waste streams
  Industrial_Waste, Recycled, Landfill

  %% Raw to processing
  Iron_Ore --> Steel_Mill : 100
  Coal --> Steel_Mill : 50
  Limestone --> Steel_Mill : 20

  Bauxite --> Aluminum_Plant : 40

  Petroleum --> Plastic_Factory : 60
  Petroleum --> Refinery : 80

  Wood --> Lumber_Mill : 70

  Sand --> Glass_Works : 30

  Copper --> Component_Mfg : 25
  Steel_Mill --> Component_Mfg : 80
  Aluminum_Plant --> Component_Mfg : 35

  %% Processing to assembly
  Steel_Mill --> Auto_Assembly : 70
  Aluminum_Plant --> Auto_Assembly : 25
  Plastic_Factory --> Auto_Assembly : 40
  Component_Mfg --> Auto_Assembly : 60
  Component_Mfg --> Electronics_Assembly : 80

  Plastic_Factory --> Electronics_Assembly : 20
  Plastic_Factory --> Furniture_Assembly : 15
  Plastic_Factory --> Packaging : 25

  Lumber_Mill --> Furniture_Assembly : 60
  Glass_Works --> Furniture_Assembly : 20

  Refinery --> Transport : 60

  %% Assembly to products
  Auto_Assembly --> Vehicles : 195
  Electronics_Assembly --> Electronics : 100
  Furniture_Assembly --> Furniture : 95
  Packaging --> Packaging_Materials : 25

  %% Waste streams
  Steel_Mill --> Industrial_Waste : 10
  Aluminum_Plant --> Industrial_Waste : 5
  Plastic_Factory --> Industrial_Waste : 5
  Component_Mfg --> Industrial_Waste : 5
  Auto_Assembly --> Industrial_Waste : 10
  Electronics_Assembly --> Industrial_Waste : 5
  Furniture_Assembly --> Industrial_Waste : 5

  Industrial_Waste --> Recycled : 25
  Industrial_Waste --> Landfill : 20
```

---

## Copy-Paste Template

```mermaid
sankey-beta
  accTitle: REPLACE WITH 3-8 WORD TITLE
  accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows and what insight the reader gains

  %% Level 1: Raw inputs
  Input_A, Input_B, Input_C, Input_D

  %% Level 2: Processing
  Process_1, Process_2, Process_3

  %% Level 3: Manufacturing
  Manufacture_X, Manufacture_Y

  %% Level 4: Products
  Product_A, Product_B, Product_C

  %% Level 5: End of life
  Recycled, Waste, Reused

  %% Flows
  Input_A --> Process_1 : 100
  Input_B --> Process_1 : 80
  Input_B --> Process_2 : 40
  Input_C --> Process_2 : 60
  Input_D --> Process_3 : 50

  Process_1 --> Manufacture_X : 120
  Process_1 --> Manufacture_Y : 60
  Process_2 --> Manufacture_Y : 100
  Process_3 --> Manufacture_X : 50

  Manufacture_X --> Product_A : 100
  Manufacture_X --> Product_B : 70
  Manufacture_Y --> Product_B : 80
  Manufacture_Y --> Product_C : 80

  Product_A --> Recycled : 60
  Product_A --> Waste : 40
  Product_B --> Reused : 50
  Product_B --> Recycled : 100
  Product_C --> Waste : 80
```

---

## Tips

- Plan your levels before writing — sketch on paper first
- Use consistent naming with underscores for multi-word nodes
- Verify flow conservation at each intermediate node
- Consider splitting very complex diagrams into multiple views
- Use the diagram to tell a story: where do resources come from and go?
- Advanced diagrams may need explanatory text to guide the reader
- 4–5 levels of depth is the practical maximum
