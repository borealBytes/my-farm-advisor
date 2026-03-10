<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Radar Diagrams — Intermediate

**5–8 axes | Multiple series, competitive analysis**

---

## Example: Framework Comparison

```mermaid
radar
  accTitle: JavaScript Framework Comparison
  accDescr: Comparing React, Vue, and Angular across six dimensions

  title Framework Comparison

  axis "Performance"
  axis "Learning Curve"
  axis "Ecosystem"
  axis "Community"
  axis "Flexibility"
  axis "Documentation"

  data "React" {
    value 85
    value 70
    value 95
    value 95
    value 90
    value 85
  }

  data "Vue" {
    value 80
    value 90
    value 75
    value 80
    value 85
    value 90
  }

  data "Angular" {
    value 75
    value 60
    value 85
    value 85
    value 70
    value 95
  }
```

---

## Example: Security Assessment

```mermaid
radar
  accTitle: Security Posture Assessment
  accDescr: Comparing current vs target security across multiple domains

  title Security Assessment

  axis "Authentication"
  axis "Authorization"
  axis "Encryption"
  axis "Auditing"
  axis "Monitoring"
  axis "Compliance"

  data "Current State" {
    value 70
    value 65
    value 80
    value 60
    value 75
    value 55
  }

  data "Target State" {
    value 95
    value 90
    value 95
    value 85
    value 90
    value 90
  }
```

---

## Example: Employee Performance

```mermaid
radar
  accTitle: Employee Performance Review
  accDescr: Multi-dimensional performance evaluation with peer comparison

  title Performance Review

  axis "Technical Skills"
  axis "Communication"
  axis "Leadership"
  axis "Collaboration"
  axis "Problem Solving"
  axis "Initiative"

  data "Self Assessment" {
    value 80
    value 75
    value 70
    value 85
    value 80
    value 75
  }

  data "Manager Review" {
    value 85
    value 80
    value 75
    value 80
    value 85
    value 80
  }

  data "Peer Average" {
    value 75
    value 85
    value 80
    value 75
    value 80
    value 85
  }
```

---

## Copy-Paste Template

```mermaid
radar
  accTitle: Multi-Series Radar Chart
  accDescr: Comparison of multiple entities across dimensions

  title Comparison Chart

  axis "Dimension1"
  axis "Dimension2"
  axis "Dimension3"
  axis "Dimension4"
  axis "Dimension5"
  axis "Dimension6"

  data "Series A" {
    value 80
    value 70
    value 90
    value 85
    value 75
    value 80
  }

  data "Series B" {
    value 70
    value 85
    value 75
    value 80
    value 90
    value 85
  }

  data "Series C" {
    value 90
    value 75
    value 80
    value 70
    value 85
    value 90
  }
```

---

## Tips for Intermediate Radars

- Compare 2–3 entities for clarity
- Use consistent color coding
- Add legend if space permits
- Highlight significant gaps between series
- Consider target/benchmark lines
