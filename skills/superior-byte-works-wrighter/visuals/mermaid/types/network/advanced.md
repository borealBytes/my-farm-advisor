<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Network — Advanced (8–12 devices)

Data center topology. Use for complex network designs.

---

## Example: Data Center

```mermaid
network
 accTitle: Data Center Network
 accDescr: Data center network with core, distribution, and access layers

 internet["🌐 Internet"]
 firewall["🛡️ Firewall"]
 core1["⚡ Core 1"]
 core2["⚡ Core 2"]
 dist1["📶 Distribution 1"]
 dist2["📶 Distribution 2"]
 access1["🔌 Access 1"]
 access2["🔌 Access 2"]
 server1["🖥️ Server 1"]
 server2["🖥️ Server 2"]
 storage["💾 Storage"]
 mgmt["🔧 Management"]

 internet --- firewall
 firewall --- core1
 firewall --- core2
 core1 --- dist1
 core1 --- dist2
 core2 --- dist1
 core2 --- dist2
 dist1 --- access1
 dist2 --- access2
 access1 --- server1
 access1 --- server2
 access2 --- storage
 access2 --- mgmt
```

---

## Example: Multi-Site Network

```mermaid
network
 accTitle: Multi Site Enterprise Network
 accDescr: Enterprise network with HQ, branch offices, and cloud

 hq["🏢 HQ"]
 branch1["🏢 Branch 1"]
 branch2["🏢 Branch 2"]
 cloud["☁️ Cloud"]
 internet["🌐 Internet"]
 vpn["🔒 VPN"]
 wan["🌐 WAN"]
 hq_core["⚡ HQ Core"]
 hq_server["🖥️ HQ Server"]
 branch1_sw["⚡ Branch 1 SW"]
 branch2_sw["⚡ Branch 2 SW"]

 internet --- vpn
 vpn --- hq
 vpn --- branch1
 vpn --- branch2
 hq --- wan
 wan --- branch1
 wan --- branch2
 hq --- hq_core
 hq_core --- hq_server
 branch1 --- branch1_sw
 branch2 --- branch2_sw
 cloud --- vpn
```

---

## Example: Cloud Network

```mermaid
network
 accTitle: Cloud Network Architecture
 accDescr: Cloud network with VPCs, subnets, and services

 internet["🌐 Internet"]
 cdn["📦 CDN"]
 lb["⚖️ Load Balancer"]
 web1["🌐 Web 1"]
 web2["🌐 Web 2"]
 app1["⚡ App 1"]
 app2["⚡ App 2"]
 db["💾 Database"]
 cache["💨 Cache"]
 storage["📦 Object Storage"]
 monitor["📊 Monitoring"]

 internet --- cdn
 cdn --- lb
 lb --- web1
 lb --- web2
 web1 --- app1
 web2 --- app2
 app1 --- db
 app2 --- db
 app1 --- cache
 app2 --- cache
 app1 --- storage
 app2 --- storage
 web1 --- monitor
 web2 --- monitor
 app1 --- monitor
 app2 --- monitor
```

---

## Copy-Paste Template

```mermaid
network
 accTitle: REPLACE WITH 3-8 WORD TITLE
 accDescr: REPLACE WITH 1-2 sentences describing what this network shows

 internet["🌐 Internet"]
 firewall["🛡️ Firewall"]
 core["⚡ Core"]
 distribution["📶 Distribution"]
 access["🔌 Access"]
 server1["🖥️ Server 1"]
 server2["🖥️ Server 2"]
 storage["💾 Storage"]
 wifi["📶 WiFi"]
 mgmt["🔧 Management"]

 internet --- firewall
 firewall --- core
 core --- distribution
 distribution --- access
 access --- server1
 access --- server2
 access --- storage
 access --- wifi
 access --- mgmt
```

---

## Tips

- At 8+ devices, use hierarchical layout
- Show redundancy where present
- Label security zones
- Include management network
