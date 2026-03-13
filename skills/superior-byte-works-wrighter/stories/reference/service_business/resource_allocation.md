# Resource Allocation Plan: {{PERIOD}}

**Business Unit**: {{BUSINESS_UNIT}}
**Resource Manager**: {{RESOURCE_MANAGER}}
**Period**: {{START_DATE}} — {{END_DATE}}
**Date Prepared**: {{DATE}}

---

## Document Control

| Field         | Value                   |
| ------------- | ----------------------- |
| Version       | {{VERSION}}             |
| Status        | Draft / Active / Locked |
| Owner         | {{RESOURCE_MANAGER}}    |
| Approved By   | {{APPROVER}}            |
| Refresh Cycle | Weekly                  |
| Last Modified | {{DATE}}                |

---

## Allocation Overview

This resource allocation plan governs the assignment of {{BUSINESS_UNIT}} personnel to active engagements, internal initiatives, and bench activities for the period {{START_DATE}} through {{END_DATE}}.

**Total Available FTEs**: {{TOTAL_FTES}}
**Allocated to Engagements**: {{ALLOCATED_FTES}} ({{ALLOCATED_PCT}}%)
**Internal Initiatives**: {{INTERNAL_FTES}} ({{INTERNAL_PCT}}%)
**Bench / Available**: {{BENCH_FTES}} ({{BENCH_PCT}}%)

---

## Active Engagements

### Engagement Portfolio

| Eng. ID    | Client     | Project     | Start     | End     | Status                          | Revenue      |
| ---------- | ---------- | ----------- | --------- | ------- | ------------------------------- | ------------ |
| ENG-{{ID}} | {{CLIENT}} | {{PROJECT}} | {{START}} | {{END}} | Active / Ramping / Winding Down | ${{REVENUE}} |
| ENG-{{ID}} | {{CLIENT}} | {{PROJECT}} | {{START}} | {{END}} | Active / Ramping / Winding Down | ${{REVENUE}} |
| ENG-{{ID}} | {{CLIENT}} | {{PROJECT}} | {{START}} | {{END}} | Active / Ramping / Winding Down | ${{REVENUE}} |
| ENG-{{ID}} | {{CLIENT}} | {{PROJECT}} | {{START}} | {{END}} | Active / Ramping / Winding Down | ${{REVENUE}} |
| ENG-{{ID}} | {{CLIENT}} | {{PROJECT}} | {{START}} | {{END}} | Active / Ramping / Winding Down | ${{REVENUE}} |

---

## Staffing Matrix

### Resource-to-Engagement Map

| Resource | Role           | ENG-{{ID}} | ENG-{{ID}} | ENG-{{ID}} | Internal | Total Alloc. |
| -------- | -------------- | ---------- | ---------- | ---------- | -------- | ------------ |
| {{NAME}} | Partner        | 10%        | 10%        | —          | 20%      | 40%          |
| {{NAME}} | Sr. Manager    | 50%        | —          | 50%        | —        | 100%         |
| {{NAME}} | Manager        | —          | 100%       | —          | —        | 100%         |
| {{NAME}} | Sr. Consultant | 100%       | —          | —          | —        | 100%         |
| {{NAME}} | Sr. Consultant | —          | 50%        | 50%        | —        | 100%         |
| {{NAME}} | Consultant     | 100%       | —          | —          | —        | 100%         |
| {{NAME}} | Consultant     | —          | —          | 100%       | —        | 100%         |
| {{NAME}} | Analyst        | 50%        | 50%        | —          | —        | 100%         |
| {{NAME}} | Analyst        | —          | —          | —          | 40%      | 40%          |

### Allocation Rules

- **Maximum individual allocation**: 100% across all engagements.
- **Split assignments**: No more than 2 concurrent engagements per resource (exceptions require RM approval).
- **Partner / Director**: Target 40–60% billable; remainder for business development, oversight.
- **Consultants / Analysts**: Target 80–90% billable; remainder for training, admin.
- **Minimum engagement tenure**: {{MIN_TENURE}} weeks to prevent context-switching overhead.

---

## Skill Matching

### Engagement Skill Requirements

| Engagement | Required Skills          | Priority Skills | Nice-to-Have |
| ---------- | ------------------------ | --------------- | ------------ |
| ENG-{{ID}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}     | {{SKILL_4}}  |
| ENG-{{ID}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}     | {{SKILL_4}}  |
| ENG-{{ID}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}     | {{SKILL_4}}  |

### Resource Skill Inventory

| Resource | Primary Skills           | Secondary Skills | Certifications | Proficiency                      |
| -------- | ------------------------ | ---------------- | -------------- | -------------------------------- |
| {{NAME}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}      | {{CERT}}       | Expert / Advanced / Intermediate |
| {{NAME}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}      | {{CERT}}       | Expert / Advanced / Intermediate |
| {{NAME}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}      | {{CERT}}       | Expert / Advanced / Intermediate |
| {{NAME}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}      | {{CERT}}       | Expert / Advanced / Intermediate |
| {{NAME}} | {{SKILL_1}}, {{SKILL_2}} | {{SKILL_3}}      | {{CERT}}       | Expert / Advanced / Intermediate |

### Skill-Fit Scoring

| Resource | ENG-{{ID}} Fit | ENG-{{ID}} Fit | ENG-{{ID}} Fit | Best Match              |
| -------- | -------------- | -------------- | -------------- | ----------------------- |
| {{NAME}} | 95%            | 60%            | 80%            | ENG-{{ID}}              |
| {{NAME}} | 70%            | 90%            | 55%            | ENG-{{ID}}              |
| {{NAME}} | 85%            | 85%            | 75%            | ENG-{{ID}} / ENG-{{ID}} |
| {{NAME}} | 40%            | 75%            | 95%            | ENG-{{ID}}              |

**Scoring Methodology**: Weighted match against required (60%), priority (25%), and nice-to-have (15%) skills, adjusted for proficiency level and prior client experience.

---

## Scheduling

### Weekly Allocation Timeline

```
Resource         | Wk1 | Wk2 | Wk3 | Wk4 | Wk5 | Wk6 | Wk7 | Wk8 |
-----------------|-----|-----|-----|-----|-----|-----|-----|-----|
{{NAME}} (SM)    | A01 | A01 | A01 | A01 | A03 | A03 | A03 | A03 |
{{NAME}} (MGR)   | A02 | A02 | A02 | A02 | A02 | A02 | A02 | A02 |
{{NAME}} (SC)    | A01 | A01 | A01 | ──► | A02 | A02 | A02 | A02 |
{{NAME}} (CON)   | A01 | A01 | A01 | A01 | A01 | A01 | ──► | BEN |
{{NAME}} (CON)   | A03 | A03 | A03 | A03 | A03 | A03 | A03 | A03 |
{{NAME}} (ANL)   | A01 | A01 | ──► | INT | INT | ──► | A03 | A03 |

A01–A03 = Engagement codes    INT = Internal    BEN = Bench
──► = Transition / handover
```

### Upcoming Transitions

| Resource | From       | To         | Transition Date | Handover Plan                  | Risk                |
| -------- | ---------- | ---------- | --------------- | ------------------------------ | ------------------- |
| {{NAME}} | ENG-{{ID}} | ENG-{{ID}} | {{DATE}}        | {{PLAN}}                       | Low / Medium / High |
| {{NAME}} | ENG-{{ID}} | Bench      | {{DATE}}        | Knowledge transfer to {{NAME}} | Low / Medium / High |
| {{NAME}} | Bench      | ENG-{{ID}} | {{DATE}}        | Onboarding with {{LEAD}}       | Low / Medium / High |

### Known Constraints

| Resource | Constraint                | Period    | Impact                     |
| -------- | ------------------------- | --------- | -------------------------- |
| {{NAME}} | Planned PTO               | {{DATES}} | {{IMPACT}}                 |
| {{NAME}} | Training: {{COURSE}}      | {{DATES}} | {{IMPACT}}                 |
| {{NAME}} | Client site restriction   | Ongoing   | Cannot staff to {{CLIENT}} |
| {{NAME}} | Notice period (departing) | {{DATE}}  | Replacement required       |
| {{NAME}} | Part-time ({{HOURS}}/wk)  | Ongoing   | Max {{PCT}}% allocation    |

---

## Bench Management

### Current Bench

| Resource | Role     | Days on Bench | Skills     | Proposed Action       | Target Date |
| -------- | -------- | ------------- | ---------- | --------------------- | ----------- |
| {{NAME}} | {{ROLE}} | {{DAYS}}      | {{SKILLS}} | Staff to ENG-{{ID}}   | {{DATE}}    |
| {{NAME}} | {{ROLE}} | {{DAYS}}      | {{SKILLS}} | Upskill: {{TRAINING}} | {{DATE}}    |
| {{NAME}} | {{ROLE}} | {{DAYS}}      | {{SKILLS}} | Internal initiative   | {{DATE}}    |
| {{NAME}} | {{ROLE}} | {{DAYS}}      | {{SKILLS}} | Cross-practice loan   | {{DATE}}    |

### Bench Escalation Protocol

| Days on Bench | Action                                         | Owner             |
| ------------- | ---------------------------------------------- | ----------------- |
| 0–5           | Active matching to pipeline opportunities      | Resource Manager  |
| 5–15          | Assign to internal project or proposal support | Practice Lead     |
| 15–30         | Cross-practice / cross-geography opportunities | Regional RM       |
| 30+           | Executive review; consider role restructuring  | Managing Director |

---

## Utilization Tracking

### Weekly Utilization Report

| Resource       | Available Hrs | Billable Hrs | Internal Hrs | Idle Hrs     | Utilization   |
| -------------- | ------------- | ------------ | ------------ | ------------ | ------------- |
| {{NAME}}       | {{AVAIL}}     | {{BILL}}     | {{INT}}      | {{IDLE}}     | {{UTIL}}%     |
| {{NAME}}       | {{AVAIL}}     | {{BILL}}     | {{INT}}      | {{IDLE}}     | {{UTIL}}%     |
| {{NAME}}       | {{AVAIL}}     | {{BILL}}     | {{INT}}      | {{IDLE}}     | {{UTIL}}%     |
| **Team Total** | **{{AVAIL}}** | **{{BILL}}** | **{{INT}}**  | **{{IDLE}}** | **{{UTIL}}%** |

### Utilization Targets by Level

| Level              | Billable Target | Acceptable Range | Red Flag       |
| ------------------ | --------------- | ---------------- | -------------- |
| Partner / Director | 40%             | 30–50%           | < 25% or > 60% |
| Senior Manager     | 65%             | 55–75%           | < 50% or > 80% |
| Manager            | 75%             | 65–85%           | < 60% or > 90% |
| Senior Consultant  | 85%             | 75–90%           | < 70% or > 95% |
| Consultant         | 85%             | 80–90%           | < 75% or > 95% |
| Analyst            | 80%             | 75–90%           | < 70% or > 95% |

---

## Allocation Change Process

### Request Types

| Change Type                          | Approval           | Lead Time          | Process                            |
| ------------------------------------ | ------------------ | ------------------ | ---------------------------------- |
| Minor reallocation (same engagement) | Engagement Manager | 1 business day     | Email notification                 |
| Cross-engagement transfer            | Resource Manager   | 5 business days    | Formal request + impact assessment |
| New engagement staffing              | Practice Lead + RM | 5–10 business days | Skill match + availability check   |
| Emergency staffing (P1 client)       | VP / MD            | 24 hours           | Escalation protocol                |
| Bench-to-engagement                  | Resource Manager   | 2 business days    | Skill match + client approval      |

### Change Request Log

| CR ID     | Date     | Requester | Type      | Resource     | From       | To         | Status                      |
| --------- | -------- | --------- | --------- | ------------ | ---------- | ---------- | --------------------------- |
| CR-{{ID}} | {{DATE}} | {{NAME}}  | Transfer  | {{RESOURCE}} | ENG-{{ID}} | ENG-{{ID}} | Approved / Pending / Denied |
| CR-{{ID}} | {{DATE}} | {{NAME}}  | New Staff | {{RESOURCE}} | Bench      | ENG-{{ID}} | Approved / Pending / Denied |

---

## Risk Register

| ID   | Risk                                     | Probability | Impact     | Mitigation                   | Owner             |
| ---- | ---------------------------------------- | ----------- | ---------- | ---------------------------- | ----------------- |
| R-01 | Key person dependency on {{NAME}}        | Medium      | High       | Cross-train {{BACKUP}}       | {{RM}}            |
| R-02 | Multiple engagements ending {{DATE}}     | High        | Medium     | Pipeline acceleration        | {{PRACTICE_LEAD}} |
| R-03 | Attrition of {{SKILL}} specialists       | Medium      | Critical   | Retention package + hiring   | {{HR}}            |
| R-04 | Client {{CLIENT}} extending unexpectedly | Medium      | Medium     | Maintain 10% buffer capacity | {{RM}}            |
| R-05 | {{RISK}}                                 | {{PROB}}    | {{IMPACT}} | {{MITIGATION}}               | {{OWNER}}         |

---

## Key Metrics Dashboard

| KPI                     | Target            | Actual          | Trend     | Status              |
| ----------------------- | ----------------- | --------------- | --------- | ------------------- |
| Team Utilization        | {{TARGET}}%       | {{ACTUAL}}%     | ↑ / → / ↓ | Green / Amber / Red |
| Bench Rate              | ≤ {{TARGET}}%     | {{ACTUAL}}%     | ↑ / → / ↓ | Green / Amber / Red |
| Avg. Time to Staff      | ≤ {{TARGET}} days | {{ACTUAL}} days | ↑ / → / ↓ | Green / Amber / Red |
| Skill Match Score       | ≥ {{TARGET}}%     | {{ACTUAL}}%     | ↑ / → / ↓ | Green / Amber / Red |
| Resource Satisfaction   | ≥ {{TARGET}}/5    | {{ACTUAL}}/5    | ↑ / → / ↓ | Green / Amber / Red |
| Transition Success Rate | ≥ {{TARGET}}%     | {{ACTUAL}}%     | ↑ / → / ↓ | Green / Amber / Red |

---

_This allocation plan is refreshed weekly. All changes require adherence to the Allocation Change Process defined above. Next full review: {{NEXT_REVIEW_DATE}}._
