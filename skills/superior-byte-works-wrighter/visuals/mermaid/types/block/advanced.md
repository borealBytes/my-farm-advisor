<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Block Diagram — Advanced (8–12 blocks)

Complex hardware systems. Use for detailed system designs.

---

## Example: Automotive System

```mermaid
block-beta
 accTitle: Automotive ECU System
 accDescr: Automotive electronic control unit with multiple subsystems

columns 6

 block:sensors:2
  ["📹 Camera"]
  ["📡 Radar"]
 end

 block:ecu:2
  ["🧠 Main ECU"]
  ["💾 Flash"]
 end

 block:actuators:2
  ["⚙️ Steering"]
  ["🛑 Braking"]
 end

 block:comm:2
  ["📡 CAN Bus"]
  ["📶 V2X"]
 end

 block:power:2
  ["🔋 12V"]
  ["⚡ DC-DC"]
 end

 block:diagnostics:2
  ["🔧 OBD"]
  ["📊 Logger"]
 end

 sensors --> ecu
 ecu --> actuators
 ecu --> comm
 power --> ecu
 power --> sensors
 power --> actuators
 ecu --> diagnostics
```

---

## Example: Aircraft Avionics

```mermaid
block-beta
 accTitle: Aircraft Avionics System
 accDescr: Aircraft avionics with flight control, navigation, and communication

columns 6

 block:flight:2
  ["✈️ Flight Control"]
  ["📐 Autopilot"]
 end

 block:navigation:2
  ["🧭 GPS"]
  ["📡 Transponder"]
 end

 block:communication:2
  ["📻 VHF"]
  ["📡 SATCOM"]
 end

 block:displays:2
  ["📺 PFD"]
  ["📺 MFD"]
 end

 block:sensors:2
  ["🌡️ ADS"]
  ["💨 Pitot"]
 end

 block:recording:2
  ["📹 CVR"]
  ["📊 FDR"]
 end

 sensors --> flight
 sensors --> navigation
 flight --> displays
 navigation --> displays
 communication --> displays
 flight --> recording
 navigation --> recording
```

---

## Example: Medical Device

```mermaid
block-beta
 accTitle: Medical Monitoring System
 accDescr: Patient monitoring system with multiple sensors and displays

columns 6

 block:patient:2
  ["💓 ECG"]
  ["🫁 SpO2"]
 end

 block:acquisition:2
  ["⚡ Signal Proc"]
  ["💾 Buffer"]
 end

 block:processing:2
  ["🧠 Analysis"]
  ["📊 Trends"]
 end

 block:display:2
  ["📺 Monitor"]
  ["📱 Remote"]
 end

 block:alarms:2
  ["🔊 Audio"]
  ["💡 Visual"]
 end

 block:recording:2
  ["💾 Storage"]
  ["☁️ Cloud"]
 end

 patient --> acquisition
 acquisition --> processing
 processing --> display
 processing --> alarms
 processing --> recording
```

---

## Copy-Paste Template

```mermaid
block-beta
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this diagram shows

columns 6

 block:group_a:2
  ["📋 A1"]
  ["📋 A2"]
 end

 block:group_b:2
  ["⚡ B1"]
  ["⚡ B2"]
 end

 block:group_c:2
  ["🔧 C1"]
  ["🔧 C2"]
 end

 block:group_d:2
  ["✅ D1"]
  ["✅ D2"]
 end

 block:group_e:2
  ["📊 E1"]
  ["📊 E2"]
 end

 block:group_f:2
  ["🚀 F1"]
  ["🚀 F2"]
 end

 group_a --> group_b
 group_b --> group_c
 group_c --> group_d
 group_d --> group_e
 group_e --> group_f
```

---

## Tips

- At 8+ blocks, consider hierarchical diagrams
- Use consistent grouping logic
- Show multiple connection types if needed
- Consider color coding by function
