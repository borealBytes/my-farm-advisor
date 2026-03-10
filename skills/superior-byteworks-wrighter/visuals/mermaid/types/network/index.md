<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Network Diagrams

**Best for:** Network topology, infrastructure diagrams, connectivity maps, data center layouts.

---

## When to Use

- Network topology documentation
- Infrastructure diagrams
- Connectivity visualization
- Data center architecture
- Cloud network design
- Security zone mapping

## When NOT to Use

- Software architecture → use [Architecture](../architecture/index.md) or [C4](../c4/index.md)
- Process flows → use [Flowchart](../flowchart/index.md)
- Class hierarchies → use [Class](../class/index.md)
- General diagrams → use [Block](../block/index.md)

---

## Syntax Reference

```
network
 accTitle: Title Here
 accDescr: Description here

 device1 ["Device 1"]
 device2 ["Device 2"]

 device1 --- device2
```

**Elements:**

- `device ["Label"]` — network device
- `device --- device` — connection
- `device -- protocol -- device` — labeled connection

---

## Complexity Levels

| File                               | Devices | Use case       |
| ---------------------------------- | ------- | -------------- |
| [simple.md](simple.md)             | 2–4     | Simple network |
| [intermediate.md](intermediate.md) | 4–8     | Office network |
| [advanced.md](advanced.md)         | 8–12    | Data center    |

---

## Key Tips

- Use descriptive device names
- Label connections with protocols
- Group by network zones
- Show security boundaries
- Use consistent naming

## Anti-Patterns

```
%% ❌ Too many connections
network
 a --- b
 a --- c
 a --- d
 a --- e
 b --- c
 b --- d
 ...

%% ✅ Fix: hierarchical layout
network
 router --- switch
 switch --- device1
 switch --- device2

%% ❌ Unclear device names
network
 d1 ["D1"]
 d2 ["D2"]

%% ✅ Fix: descriptive names
network
 router ["Core Router"]
 switch ["Access Switch"]
```

---

## Parser Gotchas

- Device IDs must be unique
- Connections use `---`
- Protocol labels optional
- Layout is automatic
