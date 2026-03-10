# Statement of Work: {{PROJECT_NAME}}

**SOW Reference**: {{SOW_ID}}
**Client**: {{CLIENT_NAME}}
**Engagement Manager**: {{ENGAGEMENT_MANAGER}}
**Effective Date**: {{EFFECTIVE_DATE}}
**Expiration Date**: {{EXPIRATION_DATE}}

---

## Document Control

| Field         | Value                                   |
| ------------- | --------------------------------------- |
| Version       | {{VERSION}}                             |
| Status        | Draft / In Review / Approved / Executed |
| Author        | {{AUTHOR}}                              |
| Reviewer      | {{REVIEWER}}                            |
| Approved By   | {{APPROVER}}                            |
| Last Modified | {{DATE}}                                |

### Revision History

| Version | Date     | Author       | Changes                      |
| ------- | -------- | ------------ | ---------------------------- |
| 0.1     | {{DATE}} | {{AUTHOR}}   | Initial draft                |
| 0.2     | {{DATE}} | {{AUTHOR}}   | Client feedback incorporated |
| 1.0     | {{DATE}} | {{APPROVER}} | Final approved version       |

---

## Executive Summary

{{PROJECT_NAME}} engages {{FIRM_NAME}} to deliver {{SERVICE_DESCRIPTION}} for {{CLIENT_NAME}}. This Statement of Work defines the scope, deliverables, timeline, and commercial terms governing the engagement.

**Engagement Type**: {{TIME_AND_MATERIALS / FIXED_PRICE / RETAINER / MANAGED_SERVICE}}
**Estimated Effort**: {{TOTAL_HOURS}} hours over {{DURATION}} {{WEEKS/MONTHS}}
**Total Contract Value**: ${{CONTRACT_VALUE}}

---

## Scope of Services

### In Scope

| ID   | Service Area     | Description     | Priority |
| ---- | ---------------- | --------------- | -------- |
| S-01 | {{SERVICE_AREA}} | {{DESCRIPTION}} | Critical |
| S-02 | {{SERVICE_AREA}} | {{DESCRIPTION}} | High     |
| S-03 | {{SERVICE_AREA}} | {{DESCRIPTION}} | Medium   |
| S-04 | {{SERVICE_AREA}} | {{DESCRIPTION}} | Low      |

### Out of Scope

The following items are explicitly excluded from this engagement:

- {{EXCLUSION_1}}
- {{EXCLUSION_2}}
- {{EXCLUSION_3}}

Any out-of-scope work requested during the engagement will be handled via a Change Request (CR) process.

### Assumptions

1. {{CLIENT_NAME}} will provide timely access to systems, data, and stakeholders.
2. {{CLIENT_NAME}} will designate a single point of contact with decision-making authority.
3. All environments (development, staging, production) are provisioned before engagement start.
4. Third-party vendor dependencies are resolved prior to milestone deadlines.
5. {{ADDITIONAL_ASSUMPTION}}

### Dependencies

| ID   | Dependency     | Owner     | Required By | Status          |
| ---- | -------------- | --------- | ----------- | --------------- |
| D-01 | {{DEPENDENCY}} | {{OWNER}} | {{DATE}}    | Open / Resolved |
| D-02 | {{DEPENDENCY}} | {{OWNER}} | {{DATE}}    | Open / Resolved |

---

## Deliverables

| ID     | Deliverable          | Description     | Format     | Due Date | Acceptance Owner   |
| ------ | -------------------- | --------------- | ---------- | -------- | ------------------ |
| DEL-01 | {{DELIVERABLE_NAME}} | {{DESCRIPTION}} | {{FORMAT}} | {{DATE}} | {{CLIENT_CONTACT}} |
| DEL-02 | {{DELIVERABLE_NAME}} | {{DESCRIPTION}} | {{FORMAT}} | {{DATE}} | {{CLIENT_CONTACT}} |
| DEL-03 | {{DELIVERABLE_NAME}} | {{DESCRIPTION}} | {{FORMAT}} | {{DATE}} | {{CLIENT_CONTACT}} |
| DEL-04 | {{DELIVERABLE_NAME}} | {{DESCRIPTION}} | {{FORMAT}} | {{DATE}} | {{CLIENT_CONTACT}} |
| DEL-05 | {{DELIVERABLE_NAME}} | {{DESCRIPTION}} | {{FORMAT}} | {{DATE}} | {{CLIENT_CONTACT}} |

---

## Project Timeline

### Milestones

| ID   | Milestone               | Target Date | Payment Trigger        | Amount      |
| ---- | ----------------------- | ----------- | ---------------------- | ----------- |
| M-01 | Project Kickoff         | {{DATE}}    | Upon execution         | ${{AMOUNT}} |
| M-02 | Discovery Complete      | {{DATE}}    | Deliverable acceptance | ${{AMOUNT}} |
| M-03 | Design Approval         | {{DATE}}    | Deliverable acceptance | ${{AMOUNT}} |
| M-04 | Implementation Complete | {{DATE}}    | Deliverable acceptance | ${{AMOUNT}} |
| M-05 | UAT Sign-Off            | {{DATE}}    | Deliverable acceptance | ${{AMOUNT}} |
| M-06 | Go-Live / Handover      | {{DATE}}    | Deliverable acceptance | ${{AMOUNT}} |

### Phase Schedule (Gantt Overview)

```mermaid
gantt
    title Project Timeline - {{PROJECT_NAME}}
    dateFormat YYYY-MM-DD
    
    section Discovery
    Analysis & Discovery     :a1, {{START_DATE}}, 14d
    
    section Design
    Solution Design          :a2, after a1, 14d
    Design Approval          :milestone, after a2, 0d
    
    section Build
    Implementation           :a3, after a2, 21d
    
    section Testing
    Testing & QA             :a4, after a3, 14d
    UAT & Remediation        :a5, after a4, 14d
    
    section Deploy
    Go-Live & Handover       :a6, after a5, 7d
    Project Complete         :milestone, after a6, 0d
```

```
Phase                  | Wk1 | Wk2 | Wk3 | Wk4 | Wk5 | Wk6 | Wk7 | Wk8 |
-----------------------|-----|-----|-----|-----|-----|-----|-----|-----|
Discovery & Analysis   | ███ | ███ |     |     |     |     |     |     |
Solution Design        |     | ███ | ███ |     |     |     |     |     |
Build / Implementation |     |     |     | ███ | ███ | ███ |     |     |
Testing & QA           |     |     |     |     |     | ███ | ███ |     |
UAT & Remediation      |     |     |     |     |     |     | ███ | ███ |
Go-Live & Handover     |     |     |     |     |     |     |     | ███ |
```

---

## Team Structure

### {{FIRM_NAME}} Team

| Role               | Name     | Allocation | Rate         | Responsibility                  |
| ------------------ | -------- | ---------- | ------------ | ------------------------------- |
| Engagement Partner | {{NAME}} | 10%        | ${{RATE}}/hr | Executive oversight, escalation |
| Engagement Manager | {{NAME}} | 50%        | ${{RATE}}/hr | Day-to-day delivery management  |
| Senior Consultant  | {{NAME}} | 100%       | ${{RATE}}/hr | {{RESPONSIBILITY}}              |
| Consultant         | {{NAME}} | 100%       | ${{RATE}}/hr | {{RESPONSIBILITY}}              |
| Analyst            | {{NAME}} | 100%       | ${{RATE}}/hr | {{RESPONSIBILITY}}              |

### {{CLIENT_NAME}} Team

| Role                  | Name     | Responsibility                  | Availability   |
| --------------------- | -------- | ------------------------------- | -------------- |
| Executive Sponsor     | {{NAME}} | Strategic decisions, escalation | As needed      |
| Project Lead          | {{NAME}} | Day-to-day coordination         | {{HOURS}}/week |
| Subject Matter Expert | {{NAME}} | Domain knowledge, validation    | {{HOURS}}/week |
| Technical Lead        | {{NAME}} | System access, technical review | {{HOURS}}/week |

---

## Acceptance Criteria

### Acceptance Process

1. {{FIRM_NAME}} submits deliverable with completion notification.
2. {{CLIENT_NAME}} reviews deliverable within **{{REVIEW_PERIOD}} business days**.
3. {{CLIENT_NAME}} provides written acceptance or itemized rejection with deficiencies.
4. {{FIRM_NAME}} remediates deficiencies within **{{REMEDIATION_PERIOD}} business days**.
5. Cycle repeats until acceptance or escalation is triggered.
6. Silence beyond the review period constitutes **deemed acceptance**.

### Acceptance Criteria per Deliverable

| Deliverable | Criterion     | Measurement     | Threshold     |
| ----------- | ------------- | --------------- | ------------- |
| DEL-01      | {{CRITERION}} | {{MEASUREMENT}} | {{THRESHOLD}} |
| DEL-02      | {{CRITERION}} | {{MEASUREMENT}} | {{THRESHOLD}} |
| DEL-03      | {{CRITERION}} | {{MEASUREMENT}} | {{THRESHOLD}} |

---

## Commercial Terms

### Pricing Summary

| Component                | Quantity      | Unit Rate    | Total                   |
| ------------------------ | ------------- | ------------ | ----------------------- |
| {{ROLE}} hours           | {{HOURS}} hrs | ${{RATE}}/hr | ${{TOTAL}}              |
| {{ROLE}} hours           | {{HOURS}} hrs | ${{RATE}}/hr | ${{TOTAL}}              |
| Travel & Expenses        | Estimate      | Pass-through | ${{TOTAL}}              |
| **Total Contract Value** |               |              | **${{CONTRACT_VALUE}}** |

### Payment Schedule

| Milestone | Trigger                 | Amount      | Due    |
| --------- | ----------------------- | ----------- | ------ |
| M-01      | SOW Execution           | ${{AMOUNT}} | Net 30 |
| M-02      | Discovery Complete      | ${{AMOUNT}} | Net 30 |
| M-03      | Implementation Complete | ${{AMOUNT}} | Net 30 |
| M-04      | Go-Live                 | ${{AMOUNT}} | Net 30 |

### Expense Policy

- Pre-approved travel expenses reimbursed at cost with receipts.
- Air travel: economy class for flights under 4 hours; business class permitted for longer.
- Per diem: ${{PER_DIEM}} per day for meals and incidentals.
- Expenses exceeding ${{EXPENSE_THRESHOLD}} require prior written approval.

---

## Governance

### Communication Cadence

| Meeting                 | Frequency | Attendees           | Purpose              |
| ----------------------- | --------- | ------------------- | -------------------- |
| Daily Standup           | Daily     | Delivery team       | Progress, blockers   |
| Weekly Status           | Weekly    | PM + Client Lead    | Status report, risks |
| Steering Committee      | Bi-weekly | Partners + Sponsors | Strategic decisions  |
| Monthly Business Review | Monthly   | Full leadership     | Financial, timeline  |

### Status Reporting

- Weekly status reports delivered every **{{DAY_OF_WEEK}}** by **{{TIME}}**.
- Reports include: progress vs. plan, risks, issues, upcoming milestones, budget burn.
- RAG status (Red/Amber/Green) for each workstream.

### Change Control

| CR Severity                        | Approval Required  | Response Time    |
| ---------------------------------- | ------------------ | ---------------- |
| Minor (< {{HOURS}} hrs)            | Engagement Manager | 2 business days  |
| Moderate ({{HOURS}}–{{HOURS}} hrs) | Steering Committee | 5 business days  |
| Major (> {{HOURS}} hrs)            | Executive Sponsor  | 10 business days |

All approved Change Requests are appended to this SOW as amendments.

---

## Risk Register

| ID   | Risk                         | Probability | Impact     | Mitigation                    | Owner                  |
| ---- | ---------------------------- | ----------- | ---------- | ----------------------------- | ---------------------- |
| R-01 | Client resource availability | Medium      | High       | Secure commitments at kickoff | {{CLIENT_LEAD}}        |
| R-02 | Scope creep                  | High        | High       | Strict CR process             | {{ENGAGEMENT_MANAGER}} |
| R-03 | Third-party delays           | Medium      | Medium     | Early vendor engagement       | {{FIRM_LEAD}}          |
| R-04 | {{RISK}}                     | {{PROB}}    | {{IMPACT}} | {{MITIGATION}}                | {{OWNER}}              |

---

## Key Performance Indicators

| KPI                               | Target    | Measurement Frequency | Owner                  |
| --------------------------------- | --------- | --------------------- | ---------------------- |
| Milestone delivery on-time        | ≥ 90%     | Per milestone         | {{ENGAGEMENT_MANAGER}} |
| Budget variance                   | ≤ ±10%    | Monthly               | {{ENGAGEMENT_MANAGER}} |
| Client satisfaction (CSAT)        | ≥ 4.0/5.0 | End of engagement     | {{ENGAGEMENT_PARTNER}} |
| Deliverable first-pass acceptance | ≥ 80%     | Per deliverable       | {{DELIVERY_LEAD}}      |
| Defect rate post-delivery         | ≤ 5%      | 30 days post go-live  | {{QA_LEAD}}            |

---

## Termination & Warranty

### Termination

- Either party may terminate with **{{NOTICE_PERIOD}} days** written notice.
- Upon termination, {{FIRM_NAME}} delivers all work product completed to date.
- Client pays for all work performed through the termination effective date.

### Warranty

- {{FIRM_NAME}} warrants deliverables for **{{WARRANTY_PERIOD}} days** post-acceptance.
- Warranty covers defects in deliverables against documented acceptance criteria.
- Warranty excludes issues arising from client modifications or third-party changes.

---

## Signatures

|               | {{FIRM_NAME}}                | {{CLIENT_NAME}}              |
| ------------- | ---------------------------- | ---------------------------- |
| **Name**      | {{FIRM_SIGNATORY}}           | {{CLIENT_SIGNATORY}}         |
| **Title**     | {{FIRM_TITLE}}               | {{CLIENT_TITLE}}             |
| **Signature** | **********\_\_\_\_********** | **********\_\_\_\_********** |
| **Date**      | **********\_\_\_\_********** | **********\_\_\_\_********** |

---

_This Statement of Work is governed by the terms of the Master Services Agreement (MSA) dated {{MSA_DATE}} between {{FIRM_NAME}} and {{CLIENT_NAME}}. In the event of conflict, the MSA prevails._
