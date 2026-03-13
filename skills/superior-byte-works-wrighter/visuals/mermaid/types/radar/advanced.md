<!-- Source: https://github.com/SuperiorByteWorks-LLC/agent-project | License: Apache-2.0 | Author: Clayton Young / Superior Byte Works, LLC (Boreal Bytes) -->

# Radar Diagrams — Advanced

**8–12 axes | Complex multi-layer assessments**

---

## Example: Enterprise Architecture Review

```mermaid
radar
  accTitle: Enterprise Architecture Assessment
  accDescr: Comprehensive evaluation across 10 architectural dimensions

  title Architecture Review

  axis "Scalability"
  axis "Reliability"
  axis "Security"
  axis "Performance"
  axis "Maintainability"
  axis "Observability"
  axis "Cost Efficiency"
  axis "Compliance"
  axis "Integration"
  axis "Innovation"

  data "Current System" {
    value 70
    value 75
    value 65
    value 80
    value 60
    value 70
    value 75
    value 80
    value 85
    value 55
  }

  data "Industry Best" {
    value 95
    value 95
    value 95
    value 90
    value 90
    value 95
    value 85
    value 95
    value 90
    value 90
  }

  data "Target State" {
    value 85
    value 90
    value 85
    value 85
    value 80
    value 85
    value 80
    value 90
    value 90
    value 75
  }
```

---

## Example: Technology Stack Evaluation

```mermaid
radar
  accTitle: Technology Stack Comparison
  accDescr: Detailed comparison of three tech stacks across 8 criteria

  title Tech Stack Evaluation

  axis "Development Speed"
  axis "Runtime Performance"
  axis "Ecosystem Maturity"
  axis "Hiring Availability"
  axis "Learning Curve"
  axis "Tooling Quality"
  axis "Community Support"
  axis "Long-term Viability"

  data "Stack A: Modern JS" {
    value 90
    value 75
    value 95
    value 90
    value 70
    value 95
    value 95
    value 85
  }

  data "Stack B: Enterprise Java" {
    value 70
    value 85
    value 90
    value 85
    value 60
    value 90
    value 90
    value 95
  }

  data "Stack C: Python/Data" {
    value 85
    value 70
    value 85
    value 80
    value 85
    value 80
    value 85
    value 80
  }

  data "Stack D: Go/Cloud" {
    value 80
    value 95
    value 75
    value 70
    value 75
    value 85
    value 80
    value 90
  }
```

---

## Example: Organizational Maturity

```mermaid
radar
  accTitle: Organizational Maturity Model
  accDescr: Comprehensive maturity assessment across 9 organizational dimensions

  title Org Maturity Assessment

  axis "Strategy"
  axis "Culture"
  axis "Processes"
  axis "Technology"
  axis "Data Management"
  axis "Security"
  axis "Talent"
  axis "Innovation"
  axis "Governance"

  data "Level 1: Initial" {
    value 30
    value 40
    value 25
    value 35
    value 20
    value 30
    value 35
    value 25
    value 20
  }

  data "Level 3: Defined" {
    value 60
    value 65
    value 70
    value 65
    value 60
    value 65
    value 70
    value 55
    value 60
  }

  data "Level 5: Optimizing" {
    value 95
    value 90
    value 95
    value 90
    value 90
    value 95
    value 95
    value 90
    value 95
  }
```

---

## Copy-Paste Template

```mermaid
radar
  accTitle: Complex Multi-Series Radar
  accDescr: Detailed assessment with multiple benchmarks

  title Comprehensive Assessment

  axis "Dimension1"
  axis "Dimension2"
  axis "Dimension3"
  axis "Dimension4"
  axis "Dimension5"
  axis "Dimension6"
  axis "Dimension7"
  axis "Dimension8"
  axis "Dimension9"
  axis "Dimension10"

  data "Current" {
    value 70
    value 75
    value 65
    value 80
    value 60
    value 70
    value 75
    value 80
    value 85
    value 55
  }

  data "Target" {
    value 90
    value 90
    value 85
    value 90
    value 85
    value 90
    value 85
    value 90
    value 90
    value 85
  }

  data "Benchmark" {
    value 85
    value 85
    value 90
    value 85
    value 80
    value 85
    value 90
    value 85
    value 85
    value 90
  }
```

---

## Tips for Advanced Radars

- Use 8–12 axes for comprehensive coverage
- Include benchmark or target series
- Group related dimensions together
- Consider using multiple radar charts for very complex data
- Add annotations for significant findings
- Use consistent scaling across all series
