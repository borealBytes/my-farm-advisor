---
title: Clinical Protocol
description: ICH E6(R2) GCP-compliant clinical study protocol template
version: "1.0.0"
compliance:
  ["ICH E6(R2)", "ICH E8(R1)", "FDA 21 CFR 50/54/56/312", "SPIRIT 2013"]
author: Clinical Research Team
---

# Clinical Study Protocol Template

<!-- ICH E6(R2) Good Clinical Practice Compliant -->
<!-- Follows ICH E6(R2), ICH E8(R1), FDA 21 CFR Parts 50, 54, 56, 312 -->

---

## Protocol Identification

| Field                               | Value                            |
| ----------------------------------- | -------------------------------- |
| **Protocol Title**                  | [Full descriptive title]         |
| **Short Title / Acronym**           | [ACRONYM]                        |
| **Protocol Number**                 | [Sponsor Protocol ID]            |
| **Version Number**                  | [X.X]                            |
| **Version Date**                    | [DD-MMM-YYYY]                    |
| **EudraCT / ClinicalTrials.gov ID** | [NCT/EudraCT number]             |
| **IND/CTA Number**                  | [If applicable]                  |
| **Phase**                           | Phase [I / II / III / IV]        |
| **Study Type**                      | [Interventional / Observational] |
| **Sponsor**                         | [Organization name and address]  |
| **Principal Investigator**          | [Name, MD/PhD, Institution]      |
| **Medical Monitor**                 | [Name, contact]                  |

---

## Signature Page

By signing below, the parties confirm they have read and agree to conduct the study in accordance with this protocol, ICH E6(R2) GCP, and applicable regulatory requirements.

| Role                   | Name | Signature | Date |
| ---------------------- | ---- | --------- | ---- |
| Principal Investigator |      |           |      |
| Sponsor Representative |      |           |      |
| Medical Monitor        |      |           |      |

> [!IMPORTANT]
> Only approved protocol versions may be used. Ensure all site personnel sign the current version before study initiation.

---

## Table of Contents

1. [Background and Rationale](#1-background-and-rationale)
2. [Study Objectives](#2-study-objectives)
3. [Study Design](#3-study-design)
4. [Study Population](#4-study-population)
5. [Study Interventions](#5-study-interventions)
6. [Outcome Measures](#6-outcome-measures)
7. [Participant Timeline](#7-participant-timeline)
8. [Sample Size](#8-sample-size)
9. [Data Management](#9-data-management)
10. [Safety Monitoring](#10-safety-monitoring)
11. [Ethics and Dissemination](#11-ethics-and-dissemination)

---

## 1. Background and Rationale

### 1.1 Disease Background

[Describe the disease or condition under study. Include: epidemiology, pathophysiology, current standard of care, and unmet medical need.]

> [!TIP]
> Cite key references to support the scientific premise. Include recent systematic reviews or meta-analyses.

### 1.2 Investigational Product Background

[Describe the investigational product: mechanism of action, preclinical data, prior clinical experience.]

**Preclinical Summary:**

| Study Type   | Species   | Dose   | Key Finding |
| ------------ | --------- | ------ | ----------- |
| [Toxicology] | [Species] | [Dose] | [Finding]   |
| [Efficacy]   | [Species] | [Dose] | [Finding]   |

### 1.3 Benefit-Risk Assessment

**Anticipated Benefits:**

- [Benefit 1]
- [Benefit 2]

**Known and Anticipated Risks:**

- [Risk 1]: [Mitigation strategy]
- [Risk 2]: [Mitigation strategy]

> [!WARNING]
> The benefit-risk assessment must justify exposing participants to potential risks. Document the rationale clearly.

---

## 2. Study Objectives

### 2.1 Primary Objective

[State the primary objective in one sentence. Format: "To evaluate the [efficacy/safety] of [intervention] in [population] as measured by [endpoint]."]

**Primary Endpoint:** [Specific, measurable endpoint]

### 2.2 Secondary Objectives

| Objective     | Endpoint     | Measurement | Timing      |
| ------------- | ------------ | ----------- | ----------- |
| [Objective 1] | [Endpoint 1] | [Method]    | [Timepoint] |
| [Objective 2] | [Endpoint 2] | [Method]    | [Timepoint] |

---

## 3. Study Design

### 3.1 Overview

**Design:** [Randomized / Non-randomized] [Controlled / Uncontrolled] [Open-label / Blinded] [Parallel / Crossover] trial

**Duration:** [Total study duration per participant]

**Number of Sites:** [X sites in X countries]

**Estimated Enrollment:** [N participants]

### 3.2 Study Schema

```
Screening    Randomization    Treatment Period    Follow-up
(Days -28    (Day 1)          (Weeks 1–[X])       (Weeks [X+1]–[Y])
 to -1)
    │              │                  │                  │
    ▼              ▼                  ▼                  ▼
Eligibility   Arm A: [Drug]    Assessments       Safety follow-up
assessment    Arm B: [Control] per schedule      Primary endpoint
Baseline      Arm C: [Placebo] (see Section 7)   assessment
```

### 3.3 Study Arms

| Arm | Treatment      | Dose   | Route   | Frequency | Duration   | N   |
| --- | -------------- | ------ | ------- | --------- | ---------- | --- |
| A   | [Intervention] | [Dose] | [Route] | [Freq]    | [Duration] | [N] |
| B   | [Comparator]   | [Dose] | [Route] | [Freq]    | [Duration] | [N] |
| C   | [Placebo]      | N/A    | [Route] | [Freq]    | [Duration] | [N] |

---

## 4. Study Population

### 4.1 Inclusion Criteria

Participants must meet ALL of the following criteria:

1. Age ≥ [X] and ≤ [Y] years at time of consent
2. Diagnosis of [condition] confirmed by [diagnostic criteria]
3. [Disease severity criterion]
4. [Laboratory criterion]
5. Willing and able to provide written informed consent

### 4.2 Exclusion Criteria

Participants must NOT meet ANY of the following criteria:

1. [Contraindicated condition]
2. [Competing treatment]
3. [Comorbidity that would increase risk]
4. Pregnant or breastfeeding
5. [Any condition that would compromise safety or data integrity]

> [!NOTE]
> Document the rationale for each inclusion/exclusion criterion. Arbitrary criteria may raise regulatory questions.

---

## 5. Study Interventions

### 5.1 Investigational Product

| Attribute                   | Details                           |
| --------------------------- | --------------------------------- |
| **Generic Name**            | [INN name]                        |
| **Dosage Form**             | [Tablet / Capsule / Injection]    |
| **Strength**                | [X mg/mL or X mg]                 |
| **Route of Administration** | [Oral / IV / SC / IM]             |
| **Dose**                    | [X mg]                            |
| **Dosing Frequency**        | [Once daily / BID]                |
| **Storage**                 | [Temperature, light requirements] |

### 5.2 Dose Modifications

| Level       | Dose   | Indication                |
| ----------- | ------ | ------------------------- |
| Full dose   | [X mg] | Starting dose             |
| Level -1    | [Y mg] | First reduction           |
| Level -2    | [Z mg] | Second reduction          |
| Discontinue | —      | If Level -2 not tolerated |

### 5.3 Concomitant Medications

**Permitted:** [List permitted medications]

**Prohibited:** [List prohibited medications with washout periods]

---

## 6. Outcome Measures

### 6.1 Primary Outcome

**Measure:** [Name of outcome measure]

**Definition:** [Precise operational definition]

**Measurement Method:** [Validated instrument or assay]

**Timing:** [When measured relative to randomization]

### 6.2 Secondary Outcomes

| Outcome     | Definition   | Method   | Timing   | Validation  |
| ----------- | ------------ | -------- | -------- | ----------- |
| [Outcome 1] | [Definition] | [Method] | [Timing] | [Reference] |
| [Outcome 2] | [Definition] | [Method] | [Timing] | [Reference] |

### 6.3 Safety Outcomes

- **Adverse Events (AEs):** Graded per CTCAE v5.0
- **Serious Adverse Events (SAEs):** Per ICH E2A definition
- **Laboratory parameters:** [List specific labs]
- **Vital signs:** [Specify parameters]

---

## 7. Participant Timeline

### 7.1 Schedule of Assessments

| Assessment         | Screening | Day 1 | Week 4 | Week 8 | Week 12 | EOT |
| ------------------ | --------- | ----- | ------ | ------ | ------- | --- |
| Informed consent   | X         |       |        |        |         |     |
| Eligibility review | X         | X     |        |        |         |     |
| Physical exam      | X         | X     |        | X      |         | X   |
| Vital signs        | X         | X     | X      | X      | X       | X   |
| [Primary endpoint] | X         |       |        |        |         | X   |
| AE/conmed review   |           | X     | X      | X      | X       | X   |

### 7.2 Visit Windows

| Visit            | Target Day    | Acceptable Window |
| ---------------- | ------------- | ----------------- |
| Screening        | Day -28 to -1 | —                 |
| Day 1 (Baseline) | Day 1         | ±0 days           |
| Week 4           | Day 28        | ±5 days           |
| Week 12          | Day 84        | ±7 days           |

---

## 8. Sample Size

### 8.1 Statistical Assumptions

| Parameter                             | Value            | Source      |
| ------------------------------------- | ---------------- | ----------- |
| Primary endpoint                      | [Endpoint name]  | —           |
| Expected response rate (intervention) | [X]%             | [Reference] |
| Expected response rate (control)      | [Y]%             | [Reference] |
| Type I error (α)                      | 0.05 (two-sided) | —           |
| Power (1-β)                           | 80% / 90%        | —           |

### 8.2 Sample Size Calculation

Using [method], with α = 0.05 (two-sided), power = [X]%, expected difference of [Y]%, the required sample size is **[N] participants per arm** ([Total N] total).

---

## 9. Data Management

### 9.1 Data Collection

**Case Report Form (CRF):** [Paper / Electronic (eCRF)]

**eCRF System:** [System name, validation status]

### 9.2 Confidentiality

- Participants identified by unique study ID only
- No personal identifiers in study database
- Data stored on encrypted servers
- Access restricted to authorized personnel

> [!IMPORTANT]
> HIPAA compliance is mandatory for US studies. Ensure all data handling procedures meet regulatory requirements.

---

## 10. Safety Monitoring

### 10.1 Adverse Event Definitions

**Adverse Event (AE):** Any untoward medical occurrence in a participant administered a study intervention.

**Serious Adverse Event (SAE):** Any AE that results in death, life-threatening condition, hospitalization, disability, or congenital anomaly.

### 10.2 Reporting Timelines

| Event Type                   | Reporting Timeline | Recipient                          |
| ---------------------------- | ------------------ | ---------------------------------- |
| Fatal/Life-threatening SUSAR | 7 calendar days    | Regulatory authority, IRB, Sponsor |
| Non-fatal SUSAR              | 15 calendar days   | Regulatory authority, IRB, Sponsor |
| SAE (non-SUSAR)              | 24 hours (initial) | Sponsor                            |

### 10.3 Stopping Rules

**Individual Stopping Rules:**

- [Criterion 1: e.g., Grade 3 or higher drug-related AE]
- [Criterion 2: e.g., Participant request]

**Study-Wide Stopping Rules:**

- [Criterion 1: e.g., DSMB recommendation]
- [Criterion 2: e.g., Regulatory action]

---

## 11. Ethics and Dissemination

### 11.1 Research Ethics Approval

- IRB/IEC approval required before any study procedures
- Protocol version and date must match approved version
- Any protocol amendments require re-approval before implementation

### 11.2 Informed Consent

**Process:**

1. Investigator explains study to potential participant
2. Participant given adequate time to consider
3. Questions answered
4. Written consent obtained before any study procedures
5. Copy provided to participant

### 11.3 Dissemination Policy

- Results will be published regardless of outcome
- Authorship per ICMJE criteria
- Results registered on ClinicalTrials.gov within 12 months

---

_Template follows ICH E6(R2) GCP, ICH E8(R1), FDA 21 CFR Parts 50/54/56/312, and SPIRIT 2013 checklist._

---

## See Also

- [IRB Application](./irb_application.md) — For ethics review submission requirements
- [Informed Consent](./informed_consent.md) — For patient consent form templates
- [Adverse Event Report](./adverse_event_report.md) — For safety reporting procedures
- [Case Report](./case_report.md) — For individual patient documentation
- [Device 510(k)](./device_510k.md) — For medical device submission requirements
