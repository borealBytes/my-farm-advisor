---
title: Data Lineage Documentation
description: End-to-end traceability of data from source to consumption
version: "1.0.0"
compliance:
  - DAMA-DMBOK
  - GDPR Article 30
author: Data Governance Team
---

# Data Lineage Documentation

<!-- Data flow tracking and impact analysis -->

---

## Document Control

| Field            | Value                     |
| ---------------- | ------------------------- |
| **Document ID**  | DL-[YYYY]-[NNN]           |
| **Version**      | [X.Y.Z]                   |
| **Date**         | [YYYY-MM-DD]              |
| **Author**       | [Name, Role]              |
| **Data Steward** | [Name, Role]              |
| **Status**       | Draft / Review / Approved |
| **Review Cycle** | Quarterly                 |

> [!IMPORTANT]
> Data lineage is required for GDPR compliance, impact analysis, and data governance.

---

## Executive Summary

### Scope

This document traces data flow for:

- **Data Assets:** [N] tables, [N] reports, [N] APIs
- **Source Systems:** [N] systems
- **Downstream Consumers:** [N] applications, [N] teams

### Key Lineage Paths

| Path     | Complexity | Criticality |
| -------- | ---------- | ----------- |
| [Path 1] | High       | Critical    |
| [Path 2] | Medium     | High        |
| [Path 3] | Low        | Medium      |

---

## High-Level Lineage

### Enterprise Data Flow

```mermaid
flowchart TB
    accTitle: Enterprise Data Lineage
    accDescr: High-level data flow across systems

    subgraph Sources["Source Systems"]
        S1[CRM]
        S2[ERP]
        S3[Web Analytics]
        S4[Mobile App]
    end

    subgraph Ingestion["Data Ingestion"]
        I1[Batch ETL]
        I2[Streaming]
        I3[API Sync]
    end

    subgraph Storage["Data Storage"]
        D1[(Data Lake)]
        D2[(Data Warehouse)]
        D3[(Data Mart)]
    end

    subgraph Consumption["Consumption"]
        C1[BI Reports]
        C2[ML Models]
        C3[Operational Apps]
        C4[Data Science]
    end

    S1 --> I1 --> D1
    S2 --> I1 --> D1
    S3 --> I2 --> D1
    S4 --> I3 --> D1
    D1 --> D2
    D2 --> D3
    D2 --> C1
    D2 --> C2
    D3 --> C3
    D1 --> C4
```

---

## Detailed Lineage

### Lineage Path: [Data Asset Name]

#### Overview

| Attribute               | Value                                         |
| ----------------------- | --------------------------------------------- |
| **Asset Type**          | Table / View / Report / API                   |
| **Owner**               | [Team/Individual]                             |
| **Update Frequency**    | Real-time / Hourly / Daily / Weekly           |
| **Record Count**        | [N]                                           |
| **Data Classification** | Public / Internal / Confidential / Restricted |

#### Lineage Diagram

```mermaid
flowchart LR
    accTitle: Detailed Data Lineage
    accDescr: Field-level lineage for [Asset]

    subgraph Level0["Level 0: Sources"]
        SRC1[(Source Table A)]
        SRC2[(Source Table B)]
        SRC3[External API]
    end

    subgraph Level1["Level 1: Staging"]
        STG1[Staging Table 1]
        STG2[Staging Table 2]
    end

    subgraph Level2["Level 2: Integration"]
        INT1[Integrated Table]
    end

    subgraph Level3["Level 3: Consumption"]
        CON1[BI Report]
        CON2[ML Feature]
        CON3[API Endpoint]
    end

    SRC1 -->|field_a, field_b| STG1
    SRC2 -->|field_c, field_d| STG1
    SRC3 -->|field_e| STG2
    STG1 -->|transform| INT1
    STG2 -->|enrich| INT1
    INT1 -->|aggregate| CON1
    INT1 -->|feature| CON2
    INT1 -->|filter| CON3
```

#### Field-Level Lineage

| Target Field  | Source System | Source Field          | Transformation                     |
| ------------- | ------------- | --------------------- | ---------------------------------- |
| customer_id   | CRM           | id                    | Direct mapping                     |
| customer_name | CRM           | first_name, last_name | CONCAT(first_name, ' ', last_name) |
| total_revenue | ERP           | amount                | SUM(amount) GROUP BY customer      |
| last_purchase | ERP           | order_date            | MAX(order_date)                    |

---

## Source Systems

### System: [Source Name]

| Attribute            | Value                     |
| -------------------- | ------------------------- |
| **System Type**      | OLTP / OLAP / SaaS / File |
| **Owner**            | [Team]                    |
| **Contact**          | [Name]                    |
| **Refresh Schedule** | [Frequency]               |

#### Data Elements

| Element   | Type   | PII    | Description   |
| --------- | ------ | ------ | ------------- |
| [Field 1] | [Type] | Yes/No | [Description] |
| [Field 2] | [Type] | Yes/No | [Description] |

---

## Transformations

### Transformation Logic

#### Transformation: [Name]

```mermaid
flowchart TB
    accTitle: Transformation Logic
    accDescr: Step-by-step transformation process

    subgraph Input["Input"]
        I1[Raw Data]
    end

    subgraph Process["Transformation"]
        P1[Cleanse]
        P2[Validate]
        P3[Enrich]
        P4[Aggregate]
    end

    subgraph Output["Output"]
        O1[Transformed Data]
    end

    I1 --> P1 --> P2 --> P3 --> P4 --> O1
```

| Step      | Description            | Logic        | Owner  |
| --------- | ---------------------- | ------------ | ------ |
| Cleanse   | Remove invalid records | [SQL/Logic]  | [Team] |
| Validate  | Check data quality     | [Rules]      | [Team] |
| Enrich    | Add reference data     | [Join logic] | [Team] |
| Aggregate | Summarize              | [Group by]   | [Team] |

---

## Downstream Impact

### Impact Analysis

```mermaid
flowchart TB
    accTitle: Downstream Impact Analysis
    accDescr: What depends on this data asset

    subgraph Asset["Data Asset"]
        A[Table: customers]
    end

    subgraph Direct["Direct Consumers"]
        D1[Report: Customer Summary]
        D2[Model: Churn Prediction]
        D3[App: Customer Portal]
    end

    subgraph Indirect["Indirect Consumers"]
        I1[Dashboard: Executive KPIs]
        I2[Report: Revenue Forecast]
        I3[API: Customer Lookup]
    end

    A --> D1
    A --> D2
    A --> D3
    D1 --> I1
    D2 --> I2
    D3 --> I3
```

### Consumer Registry

| Consumer     | Type        | Contact | Criticality | SLA      |
| ------------ | ----------- | ------- | ----------- | -------- |
| [Consumer 1] | Report      | [Name]  | High        | 4 hours  |
| [Consumer 2] | ML Model    | [Name]  | Medium      | 24 hours |
| [Consumer 3] | Application | [Name]  | Critical    | 1 hour   |

---

## Data Quality Lineage

### Quality Rules by Source

| Source     | Quality Rule | Severity | Downstream Impact |
| ---------- | ------------ | -------- | ----------------- |
| [Source 1] | [Rule]       | High     | [Assets affected] |
| [Source 2] | [Rule]       | Medium   | [Assets affected] |

---

## Metadata

### Technical Metadata

| Attribute          | Value                      |
| ------------------ | -------------------------- |
| **Storage Format** | Parquet / ORC / CSV / JSON |
| **Compression**    | Snappy / Gzip / None       |
| **Partitioning**   | [Strategy]                 |
| **Location**       | [Path/URL]                 |

### Business Metadata

| Attribute               | Value      |
| ----------------------- | ---------- |
| **Business Owner**      | [Name]     |
| **Data Steward**        | [Name]     |
| **Data Classification** | [Level]    |
| **Retention Period**    | [Duration] |
| **Source of Truth**     | Yes / No   |

---

## Change Impact Process

### Change Request Workflow

```mermaid
flowchart LR
    accTitle: Change Impact Process
    accDescr: Steps for assessing data changes

    A[Change Request] --> B[Identify Impact]
    B --> C[Notify Consumers]
    C --> D[Plan Migration]
    D --> E[Execute Change]
    E --> F[Validate]
    F --> G[Update Lineage]
```

### Impact Assessment Template

| Question                      | Response      |
| ----------------------------- | ------------- |
| What is changing?             | [Description] |
| Which sources are affected?   | [List]        |
| Which transformations change? | [List]        |
| Which consumers are impacted? | [List]        |
| What is the rollback plan?    | [Description] |

---

## Compliance

### GDPR Requirements

| Requirement          | Implementation          | Evidence      |
| -------------------- | ----------------------- | ------------- |
| Article 30 (Records) | Documented lineage      | This document |
| Right to deletion    | Impact analysis process | [Process doc] |
| Data portability     | Export capability       | [Feature]     |

### Data Classification

| Classification | Assets | Handling          |
| -------------- | ------ | ----------------- |
| Public         | [List] | Standard          |
| Internal       | [List] | Internal only     |
| Confidential   | [List] | Need-to-know      |
| Restricted     | [List] | Encrypted, logged |

---

## Appendices

### A. Complete Lineage Queries

[SQL queries for lineage extraction]

### B. Data Dictionary

[Field definitions and mappings]

### C. Change Log

| Date   | Change        | Author | Impact   |
| ------ | ------------- | ------ | -------- |
| [Date] | [Description] | [Name] | [Assets] |

---

_Last updated: [Date]_

---

## See Also

- [Data Quality Report](./data_quality_report.md) — Quality metrics
- [ETL Specification](./etl_spec.md) — Pipeline details
- [Data Governance Framework](./data_governance_framework.md) — Policies
