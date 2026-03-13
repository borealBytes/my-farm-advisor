<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Packet Diagrams — Intermediate

**8–16 fields | Multi-section packet with flags**

---

## Example: IPv4 Header

```mermaid
packet-beta
  accTitle: IPv4 Header Structure
  accDescr: Complete IPv4 header showing version, IHL, TOS, length, and fragment fields

  title IPv4 Header

  section "Version & IHL" {
    bitfield {
      bits 4 { Version }
      bits 4 { IHL }
    }
  }

  section "TOS & Length" {
    bitfield {
      bits 8 { TOS }
      bits 16 { Total Length }
    }
  }

  section "Identification" {
    bitfield {
      bits 16 { Identification }
    }
  }

  section "Flags & Fragment" {
    bitfield {
      bits 3 { Flags }
      bits 13 { Fragment Offset }
    }
  }
```

---

## Example: TCP Header (Simplified)

```mermaid
packet-beta
  accTitle: TCP Header Structure
  accDescr: TCP header showing ports, sequence numbers, and control fields

  title TCP Header

  section "Ports" {
    bitfield {
      bits 16 { Source Port }
      bits 16 { Dest Port }
    }
  }

  section "Sequence Numbers" {
    bitfield {
      bits 32 { Sequence Number }
    }
  }

  section "Acknowledgment" {
    bitfield {
      bits 32 { Ack Number }
    }
  }

  section "Data Offset & Flags" {
    bitfield {
      bits 4 { Data Offset }
      bits 6 { Reserved }
      bits 6 { Flags }
    }
  }
```

---

## Example: UDP Header

```mermaid
packet-beta
  accTitle: UDP Header Structure
  accDescr: Simple UDP header with source port, dest port, length, and checksum

  title UDP Header

  section "Ports" {
    bitfield {
      bits 16 { Source Port }
      bits 16 { Dest Port }
    }
  }

  section "Length & Checksum" {
    bitfield {
      bits 16 { Length }
      bits 16 { Checksum }
    }
  }
```

---

## Copy-Paste Template

```mermaid
packet-beta
  accTitle: Packet Title Here
  accDescr: Description of what this packet shows

  title Your Packet Title

  section "Header" {
    bitfield {
      bits 8 { Field1 }
      bits 8 { Field2 }
      bits 16 { Field3 }
    }
  }

  section "Control" {
    bitfield {
      bits 4 { Flags }
      bits 12 { Offset }
    }
  }

  section "Payload Info" {
    bitfield {
      bits 16 { Length }
      bits 16 { Checksum }
    }
  }
```

---

## Tips for Intermediate Packets

- Group fields by function (header, control, payload)
- Show flag fields with individual bit labels
- Include reserved fields explicitly
- Use sections to separate logical groups
