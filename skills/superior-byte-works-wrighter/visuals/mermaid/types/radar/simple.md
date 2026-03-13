<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Radar Diagrams — Simple

**3–5 axes | Single series, basic comparison**

---

## Example: Developer Skills Assessment

```mermaid
radar
  accTitle: Developer Skills Radar
  accDescr: Single developer skill assessment across five key areas

  title Developer Skills

  axis "Coding"
  axis "Testing"
  axis "DevOps"
  axis "Design"
  axis "Communication"

  data "Current Level" {
    value 85
    value 70
    value 60
    value 75
    value 80
  }
```

---

## Example: Product Features

```mermaid
radar
  accTitle: Product Feature Comparison
  accDescr: Simple 4-axis comparison of product capabilities

  title Product A Features

  axis "Speed"
  axis "Security"
  axis "Usability"
  axis "Price"

  data "Product A" {
    value 90
    value 75
    value 85
    value 60
  }
```

---

## Example: Team Capability

```mermaid
radar
  accTitle: Team Capability Assessment
  accDescr: Three-axis radar showing team strengths

  title Team Capabilities

  axis "Frontend"
  axis "Backend"
  axis "DevOps"

  data "Team Alpha" {
    value 80
    value 90
    value 70
  }
```

---

## Copy-Paste Template

```mermaid
radar
  accTitle: Radar Chart Title
  accDescr: Description of what this radar shows

  title Your Chart Title

  axis "Dimension1"
  axis "Dimension2"
  axis "Dimension3"

  data "Series Name" {
    value 70
    value 85
    value 60
  }
```

---

## Tips for Simple Radars

- Start with 3–5 axes for clarity
- Use a single data series
- Keep values in 0–100 range
- Label axes clearly and concisely
