<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Packet Diagrams — Advanced

**16–32 fields | Complex protocol with nested sections**

---

## Example: Complete TCP Header

```mermaid
packet-beta
  accTitle: Complete TCP Header with All Fields
  accDescr: Full TCP header including ports, sequence numbers, flags, window size, checksum, and options

  title TCP Header (Full)

  section "Source Port" {
    bitfield {
      bits 16 { Source Port }
    }
  }

  section "Destination Port" {
    bitfield {
      bits 16 { Destination Port }
    }
  }

  section "Sequence Number" {
    bitfield {
      bits 32 { Sequence Number }
    }
  }

  section "Acknowledgment Number" {
    bitfield {
      bits 32 { Acknowledgment Number }
    }
  }

  section "Data Offset & Reserved" {
    bitfield {
      bits 4 { Data Offset }
      bits 6 { Reserved }
      bits 6 { Flags }
    }
  }

  section "Window Size" {
    bitfield {
      bits 16 { Window Size }
    }
  }

  section "Checksum & Urgent" {
    bitfield {
      bits 16 { Checksum }
      bits 16 { Urgent Pointer }
    }
  }

  section "Options (Variable)" {
    bitfield {
      bits 32 { Options + Padding }
    }
  }
```

---

## Example: IPv6 Header

```mermaid
packet-beta
  accTitle: IPv6 Header Structure
  accDescr: IPv6 fixed 40-byte header with version, traffic class, flow label, and addresses

  title IPv6 Header

  section "Version & Traffic Class" {
    bitfield {
      bits 4 { Version }
      bits 8 { Traffic Class }
      bits 20 { Flow Label }
    }
  }

  section "Payload Length" {
    bitfield {
      bits 16 { Payload Length }
    }
  }

  section "Next Header & Hop Limit" {
    bitfield {
      bits 8 { Next Header }
      bits 8 { Hop Limit }
    }
  }

  section "Source Address (128 bits)" {
    bitfield {
      bits 128 { Source IPv6 Address }
    }
  }

  section "Destination Address (128 bits)" {
    bitfield {
      bits 128 { Destination IPv6 Address }
    }
  }
```

---

## Example: Ethernet Frame

```mermaid
packet-beta
  accTitle: Ethernet Frame Structure
  accDescr: Complete Ethernet II frame showing preamble, addresses, type, and payload

  title Ethernet Frame

  section "Preamble & SFD" {
    bitfield {
      bits 56 { Preamble }
      bits 8 { SFD }
    }
  }

  section "MAC Addresses" {
    bitfield {
      bits 48 { Destination MAC }
      bits 48 { Source MAC }
    }
  }

  section "Type/Length" {
    bitfield {
      bits 16 { EtherType }
    }
  }

  section "Payload (46-1500 bytes)" {
    bitfield {
      bits 368 { Payload (min) }
    }
  }

  section "FCS" {
    bitfield {
      bits 32 { Frame Check Sequence }
    }
  }
```

---

## Copy-Paste Template

```mermaid
packet-beta
  accTitle: Complex Packet Title Here
  accDescr: Detailed description of this complex protocol packet

  title Your Complex Packet Title

  section "Preamble" {
    bitfield {
      bits 8 { Sync }
      bits 8 { Start Delimiter }
    }
  }

  section "Header" {
    bitfield {
      bits 4 { Version }
      bits 4 { Header Length }
      bits 8 { Type of Service }
      bits 16 { Total Length }
    }
  }

  section "Identification" {
    bitfield {
      bits 16 { ID }
      bits 3 { Flags }
      bits 13 { Fragment Offset }
    }
  }

  section "Timing & Protocol" {
    bitfield {
      bits 8 { TTL }
      bits 8 { Protocol }
      bits 16 { Header Checksum }
    }
  }

  section "Addresses" {
    bitfield {
      bits 32 { Source Address }
      bits 32 { Destination Address }
    }
  }

  section "Payload" {
    bitfield {
      bits 32 { Data Words }
    }
  }

  section "Trailer" {
    bitfield {
      bits 32 { CRC / Checksum }
    }
  }
```

---

## Tips for Advanced Packets

- Use multiple sections for complex protocols
- Show variable-length fields with size ranges
- Include all standard fields even if rarely used
- Document bit ordering (MSB/LSB) in descriptions
- Group address fields together for clarity
