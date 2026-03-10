<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Packet Diagrams

**Best for:** Network protocol visualization, packet structure, data frame layouts, TCP/IP headers, Ethernet frames.

---

## When to Use

- Network protocol documentation
- Packet header field visualization
- Data frame structure diagrams
- TCP/IP stack illustrations
- Ethernet frame breakdowns
- Protocol analysis and debugging

## When NOT to Use

- General network topology → use [Network](../network/index.md)
- System architecture → use [Architecture](../architecture/index.md)
- Data flow between systems → use [Sequence](../sequence/index.md)

---

## Syntax Reference

```
packet-beta
  accTitle: Title Here
  accDescr: Description here

  title Packet Title

  section "Section Name" {
    bitfield {
      bits 8 { Label }
      bits 16 { AnotherLabel }
      bits 32 { LongerLabel }
    }
  }
```

**Key Elements:**

- `title` — diagram title
- `section` — groups related fields
- `bitfield` — defines the packet structure
- `bits N { Label }` — defines N bits with a label

---

## Complexity Levels

| File                               | Fields | Use case                              |
| ---------------------------------- | ------ | ------------------------------------- |
| [simple.md](simple.md)             | 4–8    | Single header, basic protocol         |
| [intermediate.md](intermediate.md) | 8–16   | Multi-section packet with flags       |
| [advanced.md](advanced.md)         | 16–32  | Complex protocol with nested sections |

---

## Key Tips

- Group related fields into logical sections
- Use consistent bit widths within sections
- Label flags clearly (e.g., `SYN`, `ACK`, `FIN`)
- Reserve fields show as empty or labeled "Reserved"
- Keep bit ordering consistent (MSB or LSB first)

## Anti-Patterns

```
%% ❌ Inconsistent bit widths without grouping
packet-beta
  bits 3 { A }
  bits 13 { B }
  bits 16 { C }

%% ✅ Fix: Group into sections
packet-beta
  section "Header" {
    bitfield {
      bits 8 { Type }
      bits 8 { Flags }
    }
  }
  section "Payload" {
    bitfield {
      bits 16 { Length }
    }
  }
```

---

## Parser Gotchas

- Bit widths must be positive integers
- Section names should be quoted if they contain spaces
- Nested bitfields are not supported
- Maximum bit width per field is implementation-dependent
