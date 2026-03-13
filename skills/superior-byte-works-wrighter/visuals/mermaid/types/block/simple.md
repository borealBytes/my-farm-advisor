<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Block Diagram — Simple (2–4 blocks)

Basic component relationships. Use for simple hardware or modular designs.

---

## Example: Simple System

```mermaid
block-beta
 accTitle: Simple Hardware System
 accDescr: Basic hardware system with input, processing, and output components

columns 3

 block:input:1
  ["🎤 Input"]
 end

 block:process:1
  ["⚡ Processor"]
 end

 block:output:1
  ["🔊 Output"]
 end

 input --> process
 process --> output
```

---

## Example: Sensor System

```mermaid
block-beta
 accTitle: Sensor Monitoring System
 accDescr: Simple sensor system with data acquisition and display

columns 3

 block:sensors:1
  ["📡 Sensors"]
 end

 block:acquisition:1
  ["💾 Acquisition"]
 end

 block:display:1
  ["📊 Display"]
 end

 sensors --> acquisition
 acquisition --> display
```

---

## Example: Power System

```mermaid
block-beta
 accTitle: Power Distribution System
 accDescr: Simple power distribution with source, regulator, and loads

columns 3

 block:source:1
  ["⚡ Source"]
 end

 block:regulator:1
  ["🔧 Regulator"]
 end

 block:loads:1
  ["🔌 Loads"]
 end

 source --> regulator
 regulator --> loads
```

---

## Copy-Paste Template

```mermaid
block-beta
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows

columns 3

 block:block_a:1
  ["📋 Block A"]
 end

 block:block_b:1
  ["🔧 Block B"]
 end

 block:block_c:1
  ["✅ Block C"]
 end

 block_a --> block_b
 block_b --> block_c
```

---

## Tips

- 2–4 blocks is ideal for simple diagrams
- Use emojis to indicate block types
- Keep column count low (2–4)
- Show primary data flow
