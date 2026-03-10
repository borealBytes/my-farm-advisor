<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Packet Diagrams — Simple

**4–8 fields | Single header, basic protocol**

---

## Example: TCP Flags Byte

```mermaid
packet-beta
  accTitle: TCP Flags Byte Structure
  accDescr: Shows the 8-bit flags field in TCP header with individual flag bits

  title TCP Flags Byte

  section "Flags" {
    bitfield {
      bits 1 { CWR }
      bits 1 { ECE }
      bits 1 { URG }
      bits 1 { ACK }
      bits 1 { PSH }
      bits 1 { RST }
      bits 1 { SYN }
      bits 1 { FIN }
    }
  }
```

---

## Example: IPv4 Version and IHL

```mermaid
packet-beta
  accTitle: IPv4 Version and IHL Fields
  accDescr: First byte of IPv4 header showing version (4 bits) and IHL (4 bits)

  title IPv4 Header Start

  section "First Byte" {
    bitfield {
      bits 4 { Version }
      bits 4 { IHL }
    }
  }
```

---

## Example: Simple Ethernet Type Field

```mermaid
packet-beta
  accTitle: Ethernet Frame Type Field
  accDescr: 16-bit type field indicating the protocol in the payload

  title Ethernet Type

  section "Type Field" {
    bitfield {
      bits 16 { EtherType }
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

  section "Section Name" {
    bitfield {
      bits 8 { Field1 }
      bits 8 { Field2 }
    }
  }
```

---

## Tips for Simple Packets

- Start with the most common protocol fields
- Use single sections for simple structures
- Label each bit or byte clearly
- Keep bit widths as multiples of 8 when possible
