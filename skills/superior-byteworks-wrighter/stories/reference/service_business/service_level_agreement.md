# Service Level Agreement: {{SERVICE_NAME}}

**SLA Reference**: {{SLA_ID}}
**Service Provider**: {{PROVIDER_NAME}}
**Client**: {{CLIENT_NAME}}
**Effective Date**: {{EFFECTIVE_DATE}}
**Review Date**: {{REVIEW_DATE}}

---

## Document Control

| Field          | Value                                   |
| -------------- | --------------------------------------- |
| Version        | {{VERSION}}                             |
| Status         | Draft / Active / Under Review / Expired |
| Author         | {{AUTHOR}}                              |
| Approved By    | {{APPROVER}}                            |
| Classification | Confidential                            |
| Last Modified  | {{DATE}}                                |

### Revision History

| Version | Date     | Author       | Changes                           |
| ------- | -------- | ------------ | --------------------------------- |
| 1.0     | {{DATE}} | {{AUTHOR}}   | Initial SLA established           |
| 1.1     | {{DATE}} | {{AUTHOR}}   | Updated response time targets     |
| 2.0     | {{DATE}} | {{APPROVER}} | Annual review — revised penalties |

---

## Agreement Overview

This Service Level Agreement defines the performance standards, monitoring practices, and remedies governing the delivery of {{SERVICE_NAME}} by {{PROVIDER_NAME}} to {{CLIENT_NAME}}.

**Service Type**: {{MANAGED_SERVICE / CONSULTING / SUPPORT / OUTSOURCED_FUNCTION}}
**Contract Reference**: MSA {{MSA_ID}}, SOW {{SOW_ID}}
**Business Hours**: {{BUSINESS_HOURS}} ({{TIMEZONE}})
**Support Coverage**: {{24x7 / BUSINESS_HOURS / EXTENDED_HOURS}}

---

## Service Description

### Services Covered

| ID     | Service     | Description     | Tier                     |
| ------ | ----------- | --------------- | ------------------------ |
| SVC-01 | {{SERVICE}} | {{DESCRIPTION}} | Platinum / Gold / Silver |
| SVC-02 | {{SERVICE}} | {{DESCRIPTION}} | Platinum / Gold / Silver |
| SVC-03 | {{SERVICE}} | {{DESCRIPTION}} | Platinum / Gold / Silver |

### Services Excluded

- {{EXCLUSION_1}}
- {{EXCLUSION_2}}
- Ad hoc project work (governed by separate SOW)
- Third-party vendor outages beyond {{PROVIDER_NAME}} control

---

## Service Level Objectives

### Availability

| Metric                     | Target                            | Measurement Window | Calculation                                              |
| -------------------------- | --------------------------------- | ------------------ | -------------------------------------------------------- |
| Service Uptime             | ≥ {{UPTIME_TARGET}}%              | Monthly            | (Total Minutes − Downtime Minutes) / Total Minutes × 100 |
| Planned Maintenance Window | ≤ {{MAINTENANCE_HOURS}} hrs/month | Monthly            | Scheduled during {{MAINTENANCE_WINDOW}}                  |
| Unplanned Downtime         | ≤ {{MAX_UNPLANNED}} min/month     | Monthly            | Total unplanned outage duration                          |

**Uptime Tier Definitions**:

| Tier     | Uptime SLA | Monthly Downtime Allowance | Annual Downtime Allowance |
| -------- | ---------- | -------------------------- | ------------------------- |
| Platinum | 99.99%     | 4.3 minutes                | 52.6 minutes              |
| Gold     | 99.95%     | 21.9 minutes               | 4.4 hours                 |
| Silver   | 99.9%      | 43.8 minutes               | 8.8 hours                 |
| Bronze   | 99.5%      | 3.6 hours                  | 43.8 hours                |

### Incident Response Times

| Priority      | Definition                                | Response Time         | Resolution Target                 | Update Frequency |
| ------------- | ----------------------------------------- | --------------------- | --------------------------------- | ---------------- |
| P1 — Critical | Service down; all users impacted          | ≤ {{P1_RESPONSE}} min | ≤ {{P1_RESOLUTION}} hrs           | Every 30 min     |
| P2 — High     | Major degradation; workaround unavailable | ≤ {{P2_RESPONSE}} min | ≤ {{P2_RESOLUTION}} hrs           | Every 1 hr       |
| P3 — Medium   | Partial impact; workaround available      | ≤ {{P3_RESPONSE}} hrs | ≤ {{P3_RESOLUTION}} business days | Every 4 hrs      |
| P4 — Low      | Minor issue; cosmetic or informational    | ≤ {{P4_RESPONSE}} hrs | ≤ {{P4_RESOLUTION}} business days | Daily            |

**Response Time** = elapsed time from ticket creation to first substantive provider response.
**Resolution Target** = elapsed time from ticket creation to confirmed resolution or workaround.

### Request Fulfillment

| Request Type        | Target Fulfillment Time                 | Approval Required  |
| ------------------- | --------------------------------------- | ------------------ |
| Standard Change     | ≤ {{STANDARD_CHANGE_SLA}} business days | No                 |
| Normal Change       | ≤ {{NORMAL_CHANGE_SLA}} business days   | CAB approval       |
| Emergency Change    | ≤ {{EMERGENCY_CHANGE_SLA}} hours        | Expedited approval |
| Service Request     | ≤ {{SERVICE_REQUEST_SLA}} business days | Line manager       |
| Access Provisioning | ≤ {{ACCESS_SLA}} business hours         | Security team      |

---

## Performance Metrics & KPIs

### Monthly Scorecard

| KPI                         | Target                | Warning               | Critical                | Weight |
| --------------------------- | --------------------- | --------------------- | ----------------------- | ------ |
| Service Availability        | ≥ {{UPTIME_TARGET}}%  | < {{UPTIME_TARGET}}%  | < {{CRITICAL_UPTIME}}%  | 30%    |
| P1 Response SLA Met         | ≥ 95%                 | < 95%                 | < 85%                   | 20%    |
| P2 Response SLA Met         | ≥ 95%                 | < 95%                 | < 85%                   | 15%    |
| Mean Time to Resolve (MTTR) | ≤ {{MTTR_TARGET}} hrs | > {{MTTR_TARGET}} hrs | > {{MTTR_CRITICAL}} hrs | 15%    |
| Customer Satisfaction       | ≥ {{CSAT_TARGET}}/5   | < {{CSAT_TARGET}}/5   | < {{CSAT_CRITICAL}}/5   | 10%    |
| First Contact Resolution    | ≥ {{FCR_TARGET}}%     | < {{FCR_TARGET}}%     | < {{FCR_CRITICAL}}%     | 10%    |

### Composite SLA Score

```
Composite Score = Σ (KPI Achievement × Weight)

Rating Scale:
  ≥ 95%  = Exceeding expectations
  90–94% = Meeting expectations
  80–89% = Below expectations — improvement plan required
  < 80%  = Critical — executive escalation triggered
```

---

## Service Credits & Penalties

### Credit Schedule

| Availability Achieved              | Service Credit (% of Monthly Fee) |
| ---------------------------------- | --------------------------------- |
| ≥ {{UPTIME_TARGET}}%               | 0% (SLA met)                      |
| {{TIER_1_LOW}}% – {{TIER_1_HIGH}}% | {{TIER_1_CREDIT}}%                |
| {{TIER_2_LOW}}% – {{TIER_2_HIGH}}% | {{TIER_2_CREDIT}}%                |
| {{TIER_3_LOW}}% – {{TIER_3_HIGH}}% | {{TIER_3_CREDIT}}%                |
| < {{TIER_3_LOW}}%                  | {{MAX_CREDIT}}% (cap)             |

### Response Time Penalties

| SLA Breach              | Penalty                                         |
| ----------------------- | ----------------------------------------------- |
| P1 response missed      | ${{P1_PENALTY}} per occurrence                  |
| P1 resolution missed    | ${{P1_RESOLUTION_PENALTY}} per hour over target |
| P2 response missed      | ${{P2_PENALTY}} per occurrence                  |
| Monthly P3/P4 SLA < 90% | {{P3P4_PENALTY}}% of monthly fee                |

### Credit Cap

- Maximum monthly service credits shall not exceed **{{CREDIT_CAP}}%** of the monthly service fee.
- Service credits are applied to the next invoice cycle.
- Credits do not carry over beyond **{{CREDIT_EXPIRY}} months**.
- Credits are the **sole and exclusive remedy** for SLA failures unless otherwise specified.

---

## Monitoring & Reporting

### Monitoring

| Component            | Tool                | Frequency    | Alert Threshold                 |
| -------------------- | ------------------- | ------------ | ------------------------------- |
| Service Availability | {{MONITORING_TOOL}} | Real-time    | < {{UPTIME_TARGET}}% over 5 min |
| Response Time        | {{APM_TOOL}}        | Every 60 sec | > {{LATENCY_THRESHOLD}} ms      |
| Error Rate           | {{LOGGING_TOOL}}    | Real-time    | > {{ERROR_THRESHOLD}}%          |
| Capacity Utilization | {{CAPACITY_TOOL}}   | Every 15 min | > {{CAPACITY_THRESHOLD}}%       |

### Reporting Cadence

| Report                    | Frequency | Audience             | Delivery                         |
| ------------------------- | --------- | -------------------- | -------------------------------- |
| Incident Notification     | Real-time | Client Ops Team      | Email + {{NOTIFICATION_CHANNEL}} |
| Weekly Operations Summary | Weekly    | Service Managers     | Email                            |
| Monthly SLA Performance   | Monthly   | Steering Committee   | PDF + dashboard                  |
| Quarterly Business Review | Quarterly | Executive Leadership | In-person / virtual              |
| Annual SLA Review         | Annually  | Contract Owners      | Formal review meeting            |

### Monthly SLA Report Contents

1. Executive summary with composite SLA score
2. Availability metrics with uptime/downtime breakdown
3. Incident summary (count by priority, MTTR, root causes)
4. Response and resolution SLA compliance rates
5. Service credit calculations (if applicable)
6. Trend analysis (3-month rolling)
7. Improvement actions and status
8. Risk and capacity outlook

---

## Escalation Matrix

### Operational Escalation

| Level | Trigger                                | Contact              | Response                        |
| ----- | -------------------------------------- | -------------------- | ------------------------------- |
| L1    | Ticket opened                          | {{L1_TEAM}}          | Triage, initial response        |
| L2    | L1 unable to resolve in {{L2_TRIGGER}} | {{L2_TEAM}}          | Specialist investigation        |
| L3    | L2 unable to resolve in {{L3_TRIGGER}} | {{L3_TEAM}} / Vendor | Engineering / vendor escalation |

### Management Escalation

| Level | Trigger                                  | {{PROVIDER_NAME}}           | {{CLIENT_NAME}}        |
| ----- | ---------------------------------------- | --------------------------- | ---------------------- |
| 1     | SLA breach or P1 > {{ESCALATION_1}} hrs  | Service Delivery Manager    | Client Service Manager |
| 2     | Repeated SLA miss (2+ months)            | VP Service Operations       | VP / Director          |
| 3     | Composite score < 80% or chronic failure | Managing Director / Partner | C-Suite / SVP          |

---

## Exclusions & Force Majeure

### SLA Exclusions

The following events are excluded from SLA calculations:

1. **Planned Maintenance**: Scheduled within agreed maintenance windows with ≥ {{MAINTENANCE_NOTICE}} days notice.
2. **Client-Caused Outages**: Downtime resulting from client actions, configurations, or code.
3. **Force Majeure**: Natural disasters, acts of war, government actions, pandemic.
4. **Third-Party Failures**: Outages of third-party services outside {{PROVIDER_NAME}} control.
5. **Client Infrastructure**: Failures in client-managed networks, hardware, or software.

### Dispute Resolution

1. Either party may dispute SLA measurements within **{{DISPUTE_WINDOW}} business days** of report delivery.
2. Both parties review monitoring data collaboratively.
3. Unresolved disputes escalate to Management Escalation Level 2.
4. Final arbitration per the governing MSA terms.

---

## Continuous Improvement

### Quarterly Review Agenda

1. SLA performance trend analysis (12-month rolling)
2. Root cause analysis of recurring incidents
3. Capacity planning and growth forecasting
4. Technology and process improvement proposals
5. SLA target recalibration (if warranted)
6. Client satisfaction survey results

### Improvement Commitments

| Area                     | Current Baseline     | 6-Month Target   | 12-Month Target   |
| ------------------------ | -------------------- | ---------------- | ----------------- |
| Availability             | {{CURRENT_UPTIME}}%  | {{6MO_TARGET}}%  | {{12MO_TARGET}}%  |
| MTTR                     | {{CURRENT_MTTR}} hrs | {{6MO_MTTR}} hrs | {{12MO_MTTR}} hrs |
| First Contact Resolution | {{CURRENT_FCR}}%     | {{6MO_FCR}}%     | {{12MO_FCR}}%     |
| Customer Satisfaction    | {{CURRENT_CSAT}}/5   | {{6MO_CSAT}}/5   | {{12MO_CSAT}}/5   |

---

## Signatures

|               | {{PROVIDER_NAME}}            | {{CLIENT_NAME}}              |
| ------------- | ---------------------------- | ---------------------------- |
| **Name**      | {{PROVIDER_SIGNATORY}}       | {{CLIENT_SIGNATORY}}         |
| **Title**     | {{PROVIDER_TITLE}}           | {{CLIENT_TITLE}}             |
| **Signature** | **********\_\_\_\_********** | **********\_\_\_\_********** |
| **Date**      | **********\_\_\_\_********** | **********\_\_\_\_********** |

---

_This SLA is an addendum to the Master Services Agreement (MSA) dated {{MSA_DATE}}. It is reviewed annually and may be amended by mutual written consent. In the event of conflict between this SLA and the MSA, the MSA governs._
