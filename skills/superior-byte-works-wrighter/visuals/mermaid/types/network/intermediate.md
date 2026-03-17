<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Network — Intermediate (4–8 devices)

Office network topology. Use for typical office setups.

---

## Example: Office LAN

```mermaid
network
 accTitle: Office LAN Topology
 accDescr: Office network with router, switch, and multiple device types

 router["🌐 Router"]
 switch["⚡ Switch"]
 server["🖥️ Server"]
 pc1["💻 PC 1"]
 pc2["💻 PC 2"]
 printer["🖨️ Printer"]
 wifi["📶 Access Point"]
 phone["📱 Phone"]

 router --- switch
 switch --- server
 switch --- pc1
 switch --- pc2
 switch --- printer
 switch --- wifi
 wifi --- phone
```

---

## Example: Branch Office

```mermaid
network
 accTitle: Branch Office Network
 accDescr: Branch office with firewall, switches, and VLANs

 firewall["🛡️ Firewall"]
 core["⚡ Core Switch"]
 vlan1["📶 VLAN 1"]
 vlan2["📶 VLAN 2"]
 server["🖥️ Server"]
 nas["💾 NAS"]
 printer["🖨️ Printer"]

 firewall --- core
 core --- vlan1
 core --- vlan2
 core --- server
 core --- nas
 vlan1 --- printer
```

---

## Example: Remote Office

```mermaid
network
 accTitle: Remote Office Setup
 accDescr: Remote office with VPN and cloud connectivity

 router["🌐 Router"]
 vpn["🔒 VPN Gateway"]
 switch["⚡ Switch"]
 server["🖥️ Server"]
 pc1["💻 Workstation"]
 wifi["📶 WiFi"]
 cloud["☁️ Cloud"]
 hq["🏢 HQ"]

 router --- vpn
 router --- switch
 switch --- server
 switch --- pc1
 switch --- wifi
 vpn --- cloud
 vpn --- hq
```

---

## Copy-Paste Template

```mermaid
network
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this network shows

 router["🌐 Router"]
 switch["⚡ Switch"]
 server["🖥️ Server"]
 device1["💻 Device 1"]
 device2["💻 Device 2"]
 wifi["📶 WiFi"]

 router --- switch
 switch --- server
 switch --- device1
 switch --- device2
 switch --- wifi
```

---

## Tips

- Show hierarchical structure
- Label connection types if needed
- Group by function
- Include wireless access points
