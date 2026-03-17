---
title: Adverse Event Report
description: ICH E2A/E6 compliant serious adverse event reporting template
version: "1.0.0"
compliance: ["ICH E2A", "ICH E6(R2)", "FDA 21 CFR 312", "MedDRA", "CTCAE v5.0"]
author: Clinical Research Team
---

# Adverse Event Report Template

<!-- ICH E2A and ICH E6(R2) GCP Compliant -->
<!-- Follows FDA 21 CFR 312.32 IND Safety Reporting Requirements -->

---

## Report Metadata

| Field                     | Value                               |
| ------------------------- | ----------------------------------- |
| **Report Type**           | [ ] Initial [ ] Follow-up [ ] Final |
| **Report Number**         | [Sponsor-AE-XXXX]                   |
| **Report Date**           | [DD-MMM-YYYY]                       |
| **Reporter**              | [Name, Role]                        |
| **Reporter Contact**      | [Phone / Email]                     |
| **Study Protocol Number** | [Protocol ID]                       |
| **Study Title**           | [Study title]                       |
| **Sponsor**               | [Sponsor name]                      |
| **IND/IDE Number**        | [If applicable]                     |
| **NCT Number**            | [ClinicalTrials.gov ID]             |

> [!IMPORTANT]
> SAE reports must be submitted within regulatory timelines: 7 days for fatal/life-threatening, 15 days for other SAEs.

---

## Patient Information

| Field                 | Value                           |
| --------------------- | ------------------------------- |
| **Study ID**          | [Study-specific participant ID] |
| **Age**               | [X years]                       |
| **Sex**               | [Male / Female]                 |
| **Weight**            | [X kg]                          |
| **Height**            | [X cm]                          |
| **Race/Ethnicity**    | [If relevant to event]          |
| **Enrollment Date**   | [Date]                          |
| **Randomization Arm** | [Arm A / B / C]                 |

> [!WARNING]
> Do NOT include patient initials, names, or other HIPAA identifiers in this report.

---

## Study Treatment Information

### Investigational Product

| Field                      | Value                         |
| -------------------------- | ----------------------------- |
| **Product Name**           | [Generic name]                |
| **Dose**                   | [X mg]                        |
| **Route**                  | [Oral / IV / SC / IM / Other] |
| **Frequency**              | [Once daily / BID / etc.]     |
| **Start Date**             | [Date]                        |
| **Stop Date**              | [Date or "Ongoing"]           |
| **Total Doses Received**   | [X doses]                     |
| **Last Dose Before Event** | [Date and time]               |

### Concomitant Medications

| Medication | Dose   | Start Date | Stop Date | Indication   |
| ---------- | ------ | ---------- | --------- | ------------ |
| [Drug 1]   | [X mg] | [Date]     | [Date]    | [Indication] |
| [Drug 2]   | [X mg] | [Date]     | [Ongoing] | [Indication] |

### Medical History

| Condition     | Onset Date | Status            | Relevance to Event |
| ------------- | ---------- | ----------------- | ------------------ |
| [Condition 1] | [Date]     | [Active/Resolved] | [Relevance]        |
| [Condition 2] | [Date]     | [Active/Resolved] | [Relevance]        |

---

## Adverse Event Details

### Event Description

| Field                      | Value                        |
| -------------------------- | ---------------------------- |
| **Event Term (MedDRA PT)** | [Preferred Term]             |
| **Event Term (Verbatim)**  | [Investigator's description] |
| **MedDRA LLT**             | [Lowest Level Term]          |
| **MedDRA SOC**             | [System Organ Class]         |
| **Onset Date**             | [Date]                       |
| **Onset Time**             | [Time]                       |
| **Onset Relative to Dose** | [X hours after last dose]    |
| **Severity (CTCAE Grade)** | [Grade 1–5]                  |
| **Seriousness**            | [Yes / No]                   |

### Seriousness Criteria (if applicable)

**Check all that apply:**

- [ ] Results in death
- [ ] Is life-threatening
- [ ] Requires inpatient hospitalization or prolongs existing hospitalization
- [ ] Results in persistent or significant disability/incapacity
- [ ] Is a congenital anomaly/birth defect
- [ ] Is an important medical event requiring intervention

### Event Narrative

[Provide a detailed chronological description of the event:

- What happened (symptoms, signs)
- When it started and how it progressed
- Clinical course and treatment
- Current status at time of report
- Relevant diagnostic tests and results]

> [!TIP]
> Include all clinically relevant details. The narrative should allow a reader to understand what happened without needing additional information.

**Example narrative structure:**

On [Date], approximately [X hours] after receiving [dose] of [study drug], the participant experienced [initial symptoms]. The participant [actions taken]. On [Date], [medical evaluation occurred]. Vital signs showed [values]. Physical examination revealed [findings]. Laboratory tests showed [results]. Imaging [if applicable] showed [findings]. The participant was [treatment given]. The event [resolved/ongoing] on [Date].

---

## Causality Assessment

### Investigator Assessment

| Field            | Value                                                                   |
| ---------------- | ----------------------------------------------------------------------- |
| **Causality**    | [Unrelated / Unlikely / Possible / Probable / Definite]                 |
| **Rationale**    | [Investigator's reasoning]                                              |
| **Expectedness** | [Expected / Unexpected]                                                 |
| **Expected per** | [Investigator Brochure / Package Insert / Reference Safety Information] |

### Causality Justification

[Provide detailed rationale for the causality assessment, including:

- Temporal relationship
- Known pharmacology of the drug
- Dechallenge (improvement after stopping drug)
- Rechallenge (recurrence if drug restarted)
- Alternative explanations
- Concomitant medications
- Underlying conditions]

---

## Outcome

| Field                         | Value                                              |
| ----------------------------- | -------------------------------------------------- |
| **Outcome at Time of Report** | [Resolved / Resolving / Ongoing / Fatal / Unknown] |
| **Date of Resolution**        | [Date or "Not resolved"]                           |
| **Sequelae**                  | [None / Describe any lasting effects]              |

### Action Taken

**Study Drug:**

- [ ] Dose not changed
- [ ] Dose reduced
- [ ] Dose increased
- [ ] Drug interrupted
- [ ] Drug permanently discontinued
- [ ] Unknown

**Other Action:**

- [ ] None
- [ ] Hospitalization required
- [ ] Medical treatment required
- [ ] Surgery required
- [ ] Other: [Specify]

---

## Regulatory Reporting

### Reporting Timeline

| Recipient               | Report Type      | Due Date                 | Sent Date | Method           |
| ----------------------- | ---------------- | ------------------------ | --------- | ---------------- |
| FDA (IND Safety Report) | [15-day / 7-day] | [Date]                   | [Date]    | [Gateway / Fax]  |
| IRB/IEC                 | SAE Report       | [Per local requirements] | [Date]    | [Email / Portal] |
| Sponsor                 | SAE Report       | [Per protocol]           | [Date]    | [System]         |
| DSMB                    | SAE Summary      | [Per charter]            | [Date]    | [Method]         |

> [!WARNING]
> Failure to report SAEs within regulatory timelines can result in regulatory sanctions and study suspension.

### SUSAR Assessment

**Suspected Unexpected Serious Adverse Reaction (SUSAR):**

- [ ] Yes — meets criteria for expedited reporting
- [ ] No — not unexpected per RSI
- [ ] No — not suspected related

**Expedited report submitted:** [Date]

---

## Follow-up Information

### Follow-up Reports

| Report Number | Date   | Key New Information |
| ------------- | ------ | ------------------- |
| [Initial]     | [Date] | [Initial report]    |
| [Follow-up 1] | [Date] | [New information]   |
| [Follow-up 2] | [Date] | [New information]   |

### Outstanding Information

[Information pending that may affect causality or outcome assessment:]

- [ ] Final diagnosis
- [ ] Autopsy results
- [ ] Laboratory results
- [ ] Imaging results
- [ ] Other: [Specify]

---

## Safety Analysis

### Similar Events in Study

| Event     | Number of Cases | Severity | Outcome   |
| --------- | --------------- | -------- | --------- |
| [Event 1] | [X]             | [Grade]  | [Outcome] |
| [Event 2] | [X]             | [Grade]  | [Outcome] |

### Cumulative Safety Summary

**Total participants enrolled:** [N]

**Total SAEs reported:** [X] ([Y]%)

**SAEs by preferred term:**

- [PT 1]: [X] cases
- [PT 2]: [X] cases

**Fatal SAEs:** [X] ([Y]%)

**Related SAEs:** [X] ([Y]%)

---

## Medical Review

### Medical Monitor Assessment

| Field                           | Value                                |
| ------------------------------- | ------------------------------------ |
| **Reviewer**                    | [Name, MD]                           |
| **Review Date**                 | [Date]                               |
| **Causality Agreement**         | [Agree / Disagree with investigator] |
| **Causality (if different)**    | [Assessment]                         |
| **Expectedness Agreement**      | [Agree / Disagree]                   |
| **Expectedness (if different)** | [Assessment]                         |
| **Additional Comments**         | [Review comments]                    |

---

## Attachments

- [ ] Hospital discharge summary
- [ ] Laboratory reports
- [ ] Imaging reports
- [ ] ECG/EKG tracings
- [ ] Autopsy report (if applicable)
- [ ] Other relevant medical records

---

## Signatures

| Role                   | Name | Signature | Date |
| ---------------------- | ---- | --------- | ---- |
| Reporter               |      |           |      |
| Principal Investigator |      |           |      |
| Medical Monitor        |      |           |      |

---

_Template follows ICH E2A, ICH E6(R2), FDA 21 CFR 312.32, and MedDRA coding guidelines._

---

## See Also

- [Clinical Protocol](./clinical_protocol.md) — For study methodology and safety monitoring plans
- [IRB Application](./irb_application.md) — For ethics review and reporting requirements
- [Informed Consent](./informed_consent.md) — For patient safety disclosure requirements
- [Case Report](./case_report.md) — For detailed patient documentation
- [Clinical Reports](./../../../clinical-reports.md) — For comprehensive clinical documentation
