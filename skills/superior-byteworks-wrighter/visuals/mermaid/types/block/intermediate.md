<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Block Diagram — Intermediate (4–8 blocks)

Modular system design. Use for typical hardware or component systems.

---

## Example: Embedded System

```mermaid
block-beta
 accTitle: Embedded System Architecture
 accDescr: Embedded system with microcontroller, peripherals, and interfaces

columns 4

 block:inputs:2
  ["🎤 Audio In"]
  ["📷 Camera"]
 end

 block:mcu:2
  ["⚡ Microcontroller"]
  ["💾 Memory"]
 end

 block:outputs:2
  ["🔊 Audio Out"]
  ["📺 Display"]
 end

 block:comm:2
  ["📡 WiFi"]
  ["🔌 USB"]
 end

 inputs --> mcu
 mcu --> outputs
 mcu --> comm
```

---

## Example: Robotics System

```mermaid
block-beta
 accTitle: Robotics Control System
 accDescr: Robot control system with sensors, controller, and actuators

columns 4

 block:sensors:2
  ["📹 Vision"]
  ["📡 Lidar"]
 end

 block:controller:2
  ["🧠 Controller"]
  ["💾 Storage"]
 end

 block:actuators:2
  ["⚙️ Motors"]
  ["🔧 Arms"]
 end

 block:power:2
  ["🔋 Battery"]
  ["⚡ Regulator"]
 end

 sensors --> controller
 controller --> actuators
 power --> controller
 power --> actuators
```

---

## Example: IoT Device

```mermaid
block-beta
 accTitle: IoT Device Architecture
 accDescr: IoT device with sensors, processing, connectivity, and power

columns 4

 block:sensing:2
  ["🌡️ Temp"]
  ["💧 Humidity"]
 end

 block:processing:2
  ["⚡ MCU"]
  ["💾 Flash"]
 end

 block:connectivity:2
  ["📡 LoRa"]
  ["📶 BLE"]
 end

 block:power:2
  ["🔋 Battery"]
  ["⚡ PMIC"]
 end

 sensing --> processing
 processing --> connectivity
 power --> sensing
 power --> processing
 power --> connectivity
```

---

## Copy-Paste Template

```mermaid
block-beta
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows

columns 4

 block:group_a:2
  ["📋 Component A1"]
  ["📋 Component A2"]
 end

 block:group_b:2
  ["⚡ Component B1"]
  ["⚡ Component B2"]
 end

 block:group_c:2
  ["🔧 Component C1"]
  ["🔧 Component C2"]
 end

 group_a --> group_b
 group_b --> group_c
```

---

## Tips

- Group related components in blocks
- Use consistent column spans
- Show power/data flow separately
- Label important connections
