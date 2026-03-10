<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Network — Simple (2–4 devices)

Basic network topology. Use for simple connectivity.

---

## Example: Home Network

```mermaid
network
 accTitle: Home Network Setup
 accDescr: Simple home network with router and devices

 router["🌐 Router"]
 laptop["💻 Laptop"]
 phone["📱 Phone"]
 tv["📺 Smart TV"]

 router --- laptop
 router --- phone
 router --- tv
```

---

## Example: Office Network

```mermaid
network
 accTitle: Small Office Network
 accDescr: Office network with switch and workstations

 switch["⚡ Switch"]
 pc1["💻 Workstation 1"]
 pc2["💻 Workstation 2"]
 printer["🖨️ Printer"]

 switch --- pc1
 switch --- pc2
 switch --- printer
```

---

## Example: Cloud Connection

```mermaid
network
 accTitle: Cloud Connection
 accDescr: Simple cloud connectivity setup

 office["🏢 Office"]
 internet["🌐 Internet"]
 cloud["☁️ Cloud"]

 office --- internet
 internet --- cloud
```

---

## Copy-Paste Template

```mermaid
network
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this network shows

 device_a["📋 Device A"]
 device_b["🔧 Device B"]
 device_c["✅ Device C"]

 device_a --- device_b
 device_b --- device_c
```

---

## Tips

- 2–4 devices is ideal for simple networks
- Use emojis to indicate device types
- Show primary connections
- Keep layout clear
