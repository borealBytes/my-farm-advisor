# Capacity Planning Report: {{BUSINESS_UNIT}}

**Report Period**: {{REPORT_PERIOD}}
**Prepared By**: {{AUTHOR}}
**Business Unit**: {{BUSINESS_UNIT}}
**Date**: {{DATE}}

---

## Document Control

| Field         | Value                        |
| ------------- | ---------------------------- |
| Version       | {{VERSION}}                  |
| Status        | Draft / In Review / Approved |
| Owner         | {{RESOURCE_MANAGER}}         |
| Approved By   | {{APPROVER}}                 |
| Review Cycle  | Monthly / Quarterly          |
| Last Modified | {{DATE}}                     |

---

## Executive Summary

This capacity planning report assesses current resource utilization for {{BUSINESS_UNIT}}, forecasts demand over the next {{FORECAST_HORIZON}}, and recommends hiring, reallocation, and skill development actions to maintain delivery quality and revenue targets.

**Current Headcount**: {{CURRENT_HEADCOUNT}} FTEs
**Billable Utilization (Actual)**: {{ACTUAL_UTILIZATION}}%
**Billable Utilization (Target)**: {{TARGET_UTILIZATION}}%
**Forecasted Demand Gap**: {{DEMAND_GAP}} FTEs over next {{FORECAST_PERIOD}}
**Revenue at Risk**: ${{REVENUE_AT_RISK}} (unmet demand)

---

## Current Capacity Snapshot

### Headcount by Role

| Role               | Headcount     | Billable               | Bench               | On Leave            | Utilization       |
| ------------------ | ------------- | ---------------------- | ------------------- | ------------------- | ----------------- |
| Partner / Director | {{COUNT}}     | {{BILLABLE}}           | {{BENCH}}           | {{LEAVE}}           | {{UTIL}}%         |
| Senior Manager     | {{COUNT}}     | {{BILLABLE}}           | {{BENCH}}           | {{LEAVE}}           | {{UTIL}}%         |
| Manager            | {{COUNT}}     | {{BILLABLE}}           | {{BENCH}}           | {{LEAVE}}           | {{UTIL}}%         |
| Senior Consultant  | {{COUNT}}     | {{BILLABLE}}           | {{BENCH}}           | {{LEAVE}}           | {{UTIL}}%         |
| Consultant         | {{COUNT}}     | {{BILLABLE}}           | {{BENCH}}           | {{LEAVE}}           | {{UTIL}}%         |
| Analyst            | {{COUNT}}     | {{BILLABLE}}           | {{BENCH}}           | {{LEAVE}}           | {{UTIL}}%         |
| **Total**          | **{{TOTAL}}** | **{{TOTAL_BILLABLE}}** | **{{TOTAL_BENCH}}** | **{{TOTAL_LEAVE}}** | **{{AVG_UTIL}}%** |

### Utilization Metrics

| Metric                             | Target                  | Actual                  | Variance         | Status                        |
| ---------------------------------- | ----------------------- | ----------------------- | ---------------- | ----------------------------- |
| Billable Utilization               | {{TARGET_UTILIZATION}}% | {{ACTUAL_UTILIZATION}}% | {{VARIANCE}}%    | On Track / At Risk / Critical |
| Total Utilization (incl. internal) | {{TOTAL_TARGET}}%       | {{TOTAL_ACTUAL}}%       | {{VARIANCE}}%    | On Track / At Risk / Critical |
| Bench Rate                         | ≤ {{BENCH_TARGET}}%     | {{BENCH_ACTUAL}}%       | {{VARIANCE}}%    | On Track / At Risk / Critical |
| Voluntary Attrition (Annualized)   | ≤ {{ATTRITION_TARGET}}% | {{ATTRITION_ACTUAL}}%   | {{VARIANCE}}%    | On Track / At Risk / Critical |
| Average Billing Rate               | ${{TARGET_RATE}}/hr     | ${{ACTUAL_RATE}}/hr     | ${{VARIANCE}}/hr | On Track / At Risk / Critical |

### Capacity by Skill / Practice Area

| Practice Area  | Headcount | Allocated     | Available     | Demand Pipeline | Gap     |
| -------------- | --------- | ------------- | ------------- | --------------- | ------- |
| {{PRACTICE_1}} | {{COUNT}} | {{ALLOCATED}} | {{AVAILABLE}} | {{DEMAND}}      | {{GAP}} |
| {{PRACTICE_2}} | {{COUNT}} | {{ALLOCATED}} | {{AVAILABLE}} | {{DEMAND}}      | {{GAP}} |
| {{PRACTICE_3}} | {{COUNT}} | {{ALLOCATED}} | {{AVAILABLE}} | {{DEMAND}}      | {{GAP}} |
| {{PRACTICE_4}} | {{COUNT}} | {{ALLOCATED}} | {{AVAILABLE}} | {{DEMAND}}      | {{GAP}} |
| {{PRACTICE_5}} | {{COUNT}} | {{ALLOCATED}} | {{AVAILABLE}} | {{DEMAND}}      | {{GAP}} |

---

## Demand Forecast

### Pipeline Summary

| Quarter       | Confirmed Revenue | Probable (>70%) | Possible (30–70%) | Total Weighted |
| ------------- | ----------------- | --------------- | ----------------- | -------------- |
| {{Q_CURRENT}} | ${{CONFIRMED}}    | ${{PROBABLE}}   | ${{POSSIBLE}}     | ${{WEIGHTED}}  |
| {{Q_NEXT_1}}  | ${{CONFIRMED}}    | ${{PROBABLE}}   | ${{POSSIBLE}}     | ${{WEIGHTED}}  |
| {{Q_NEXT_2}}  | ${{CONFIRMED}}    | ${{PROBABLE}}   | ${{POSSIBLE}}     | ${{WEIGHTED}}  |
| {{Q_NEXT_3}}  | ${{CONFIRMED}}    | ${{PROBABLE}}   | ${{POSSIBLE}}     | ${{WEIGHTED}}  |

### Demand by Role (FTEs Required)

| Role              | {{Q_CURRENT}} | {{Q_NEXT_1}} | {{Q_NEXT_2}} | {{Q_NEXT_3}} | Trend     |
| ----------------- | ------------- | ------------ | ------------ | ------------ | --------- |
| Senior Manager    | {{FTE}}       | {{FTE}}      | {{FTE}}      | {{FTE}}      | ↑ / → / ↓ |
| Manager           | {{FTE}}       | {{FTE}}      | {{FTE}}      | {{FTE}}      | ↑ / → / ↓ |
| Senior Consultant | {{FTE}}       | {{FTE}}      | {{FTE}}      | {{FTE}}      | ↑ / → / ↓ |
| Consultant        | {{FTE}}       | {{FTE}}      | {{FTE}}      | {{FTE}}      | ↑ / → / ↓ |
| Analyst           | {{FTE}}       | {{FTE}}      | {{FTE}}      | {{FTE}}      | ↑ / → / ↓ |

### Supply vs. Demand (Quarterly)

```mermaid
xychart-beta
    title "Supply vs Demand by Quarter"
    x-axis [{{Q_CURRENT}}, {{Q_NEXT_1}}, {{Q_NEXT_2}}, {{Q_NEXT_3}}]
    y-axis "FTEs" 0 --> 100
    bar [Supply] data [{{Q1_SUPPLY}}, {{Q2_SUPPLY}}, {{Q3_SUPPLY}}, {{Q4_SUPPLY}}]
    bar [Demand] data [{{Q1_DEMAND}}, {{Q2_DEMAND}}, {{Q3_DEMAND}}, {{Q4_DEMAND}}]
```

**Legend:** Solid bars = Supply (Available FTEs), Striped bars = Demand (Weighted Pipeline)

---

## Gap Analysis

### Capacity Gaps by Practice

| Practice Area  | Supply (FTE) | Demand (FTE) | Gap (FTE) | Revenue Impact | Priority |
| -------------- | ------------ | ------------ | --------- | -------------- | -------- |
| {{PRACTICE_1}} | {{SUPPLY}}   | {{DEMAND}}   | {{GAP}}   | ${{IMPACT}}    | Critical |
| {{PRACTICE_2}} | {{SUPPLY}}   | {{DEMAND}}   | {{GAP}}   | ${{IMPACT}}    | High     |
| {{PRACTICE_3}} | {{SUPPLY}}   | {{DEMAND}}   | {{GAP}}   | ${{IMPACT}}    | Medium   |
| {{PRACTICE_4}} | {{SUPPLY}}   | {{DEMAND}}   | {{GAP}}   | ${{IMPACT}}    | Low      |

### Skill Gaps

| Skill       | Current Proficient | Required     | Gap     | Remediation             |
| ----------- | ------------------ | ------------ | ------- | ----------------------- |
| {{SKILL_1}} | {{COUNT}}          | {{REQUIRED}} | {{GAP}} | Hire / Train / Contract |
| {{SKILL_2}} | {{COUNT}}          | {{REQUIRED}} | {{GAP}} | Hire / Train / Contract |
| {{SKILL_3}} | {{COUNT}}          | {{REQUIRED}} | {{GAP}} | Hire / Train / Contract |
| {{SKILL_4}} | {{COUNT}}          | {{REQUIRED}} | {{GAP}} | Hire / Train / Contract |

---

## Hiring Plan

### Approved Requisitions

| Req ID     | Role     | Practice     | Target Start | Status                   | Recruiter     |
| ---------- | -------- | ------------ | ------------ | ------------------------ | ------------- |
| REQ-{{ID}} | {{ROLE}} | {{PRACTICE}} | {{DATE}}     | Open / Screening / Offer | {{RECRUITER}} |
| REQ-{{ID}} | {{ROLE}} | {{PRACTICE}} | {{DATE}}     | Open / Screening / Offer | {{RECRUITER}} |
| REQ-{{ID}} | {{ROLE}} | {{PRACTICE}} | {{DATE}}     | Open / Screening / Offer | {{RECRUITER}} |

### Proposed Hires (Pending Approval)

| Role     | Practice     | Justification     | Projected Revenue | Payback Period    | Priority |
| -------- | ------------ | ----------------- | ----------------- | ----------------- | -------- |
| {{ROLE}} | {{PRACTICE}} | {{JUSTIFICATION}} | ${{REVENUE}}/yr   | {{MONTHS}} months | Critical |
| {{ROLE}} | {{PRACTICE}} | {{JUSTIFICATION}} | ${{REVENUE}}/yr   | {{MONTHS}} months | High     |
| {{ROLE}} | {{PRACTICE}} | {{JUSTIFICATION}} | ${{REVENUE}}/yr   | {{MONTHS}} months | Medium   |

### Hiring Timeline

```
Role                   | M1  | M2  | M3  | M4  | M5  | M6  |
-----------------------|-----|-----|-----|-----|-----|-----|
Sr. Consultant (Req-X) | ██▓ |  ●  |     |     |     |     |
Consultant (Req-Y)     |     | ██▓ |  ●  |     |     |     |
Analyst (Req-Z)        |     |     | ██▓ |  ●  |     |     |
Manager (Proposed)     |     |     |     | ██▓ | ██▓ |  ●  |

██▓ = Recruiting active     ● = Target start date
```

### Contingent Workforce

| Vendor     | Role     | Rate         | Duration     | Project     | Status                    |
| ---------- | -------- | ------------ | ------------ | ----------- | ------------------------- |
| {{VENDOR}} | {{ROLE}} | ${{RATE}}/hr | {{DURATION}} | {{PROJECT}} | Active / Ending / Planned |
| {{VENDOR}} | {{ROLE}} | ${{RATE}}/hr | {{DURATION}} | {{PROJECT}} | Active / Ending / Planned |

---

## Utilization Optimization

### Bench Management Actions

| Resource | Current Status | Days on Bench | Action                   | Target Placement |
| -------- | -------------- | ------------- | ------------------------ | ---------------- |
| {{NAME}} | Bench          | {{DAYS}}      | Upskill → {{SKILL}}      | {{PROJECT}}      |
| {{NAME}} | Bench          | {{DAYS}}      | Internal project         | {{INITIATIVE}}   |
| {{NAME}} | Bench          | {{DAYS}}      | Cross-sell to {{CLIENT}} | {{ENGAGEMENT}}   |
| {{NAME}} | Bench          | {{DAYS}}      | Shadowing on {{PROJECT}} | {{PROJECT}}      |

### Utilization Improvement Initiatives

| Initiative                   | Owner     | Target Impact              | Timeline | Status      |
| ---------------------------- | --------- | -------------------------- | -------- | ----------- |
| Reduce unbilled admin time   | {{OWNER}} | +{{IMPACT}}% utilization   | {{DATE}} | In Progress |
| Cross-practice staffing      | {{OWNER}} | +{{IMPACT}}% utilization   | {{DATE}} | Planning    |
| Bench-to-internal pipeline   | {{OWNER}} | {{HOURS}} hrs recovered/mo | {{DATE}} | Active      |
| Contractor-to-FTE conversion | {{OWNER}} | ${{SAVINGS}}/yr savings    | {{DATE}} | Evaluating  |

---

## Financial Impact

### Revenue Projections

| Scenario                       | Headcount | Utilization | Avg Rate  | Quarterly Revenue | Annual Revenue |
| ------------------------------ | --------- | ----------- | --------- | ----------------- | -------------- |
| Current State                  | {{HC}}    | {{UTIL}}%   | ${{RATE}} | ${{Q_REV}}        | ${{ANN_REV}}   |
| With Approved Hires            | {{HC}}    | {{UTIL}}%   | ${{RATE}} | ${{Q_REV}}        | ${{ANN_REV}}   |
| With All Proposed Hires        | {{HC}}    | {{UTIL}}%   | ${{RATE}} | ${{Q_REV}}        | ${{ANN_REV}}   |
| Optimistic (Pipeline Converts) | {{HC}}    | {{UTIL}}%   | ${{RATE}} | ${{Q_REV}}        | ${{ANN_REV}}   |

### Cost of Inaction

| Risk                                   | Probability | Revenue Impact | Margin Impact |
| -------------------------------------- | ----------- | -------------- | ------------- |
| Lost deals (insufficient capacity)     | {{PROB}}    | ${{IMPACT}}    | -{{MARGIN}}%  |
| Burnout-driven attrition               | {{PROB}}    | ${{IMPACT}}    | -{{MARGIN}}%  |
| Quality degradation (over-utilization) | {{PROB}}    | ${{IMPACT}}    | -{{MARGIN}}%  |
| Contractor premium vs. FTE             | Certain     | ${{IMPACT}}/yr | -{{MARGIN}}%  |

---

## Recommendations

### Immediate (0–30 Days)

1. **Approve REQ-{{ID}}**: {{ROLE}} for {{PRACTICE}} — ${{REVENUE}} pipeline at risk.
2. **Extend {{CONTRACTOR}}**: Bridge capacity gap until FTE hire completes.
3. **Reassign {{NAME}}**: Move from bench to {{PROJECT}} starting {{DATE}}.

### Short-Term (30–90 Days)

1. **Launch upskilling program**: Train {{COUNT}} consultants in {{SKILL}} to address gap.
2. **Activate cross-practice staffing**: Share {{PRACTICE_1}} bench with {{PRACTICE_2}} demand.
3. **Engage {{VENDOR}}**: Secure {{COUNT}} contractors for {{PROJECT}} surge.

### Medium-Term (90–180 Days)

1. **Open {{COUNT}} additional requisitions**: Net new roles for {{PRACTICE}} growth.
2. **Establish university recruiting pipeline**: Target {{COUNT}} campus hires for {{QUARTER}}.
3. **Implement demand-shaping**: Adjust sales incentives to balance practice utilization.

---

## Appendices

### A. Utilization Calculation Methodology

```
Billable Utilization = Billable Hours / Available Hours × 100

Available Hours = Working Days × 8 hrs − PTO − Holidays − Training
Billable Hours = Client-facing hours billed to engagement codes
Internal Hours = Non-billable work (proposals, training, admin)
Total Utilization = (Billable + Internal) / Available Hours × 100
```

### B. Demand Weighting Methodology

| Stage                 | Weight | Definition                               |
| --------------------- | ------ | ---------------------------------------- |
| Contracted            | 100%   | Signed SOW, active engagement            |
| Verbal Commit         | 90%    | Client confirmed, pending paperwork      |
| Proposal Submitted    | 70%    | Formal proposal delivered                |
| Qualified Opportunity | 40%    | Discovery complete, proposal pending     |
| Early Pipeline        | 15%    | Initial conversations, not yet qualified |

---

_Next review scheduled for {{NEXT_REVIEW_DATE}}. Report owner: {{RESOURCE_MANAGER}}._
