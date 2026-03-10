---
name: Risk Assessment
description: Project risk register with likelihood/impact matrix, mitigation plans, and trend tracking
version: 1.0.0
author: Omni Unified Writing
---

# Risk Assessment

> [!NOTE]
> A risk is an uncertain event that, if it occurs, has a positive or negative effect on project objectives. This document tracks negative risks (threats). Review the register at least bi-weekly — risks that aren't reviewed become surprises.

**Project:** <!-- Project name -->  
**Date:** <!-- YYYY-MM-DD -->  
**Owner:** <!-- Risk owner / PM name -->  
**Review Cycle:** <!-- Weekly | Bi-weekly | Monthly -->  
**Next Review:** <!-- YYYY-MM-DD -->

**Example:**

**Project:** Checkout v2 — Saved Payment Methods  
**Date:** 2025-03-17  
**Owner:** Priya Nair  
**Review Cycle:** Weekly (every Monday standup)  
**Next Review:** 2025-03-24

---

## 📊 Risk Matrix

> _Likelihood × Impact = Risk Score. Scores 6–9 require immediate mitigation plans._

|                         | **Low Impact (1)** | **Med Impact (2)** | **High Impact (3)** |
| ----------------------- | ------------------ | ------------------ | ------------------- |
| **High Likelihood (3)** | 🟡 3 — Monitor     | 🔴 6 — Mitigate    | 🔴 9 — Escalate     |
| **Med Likelihood (2)**  | 🟢 2 — Accept      | 🟡 4 — Monitor     | 🔴 6 — Mitigate     |
| **Low Likelihood (1)**  | 🟢 1 — Accept      | 🟢 2 — Accept      | 🟡 3 — Monitor      |

**Legend:** 🟢 Accept | 🟡 Monitor | 🔴 Mitigate / Escalate

> [!TIP]
> "Accept" means you've consciously decided the risk is not worth mitigating. Document the rationale. "Monitor" means you're watching for trigger events. "Mitigate" means you're actively reducing likelihood or impact. "Escalate" means the risk is beyond the team's authority to handle alone.

---

## 📋 Risk Register

| ID   | Risk Description                              | Category   | Likelihood | Impact   | Score | Response                                   | Owner | Status |
| ---- | --------------------------------------------- | ---------- | ---------- | -------- | ----- | ------------------------------------------ | ----- | ------ |
| R-01 | <!-- e.g. Key engineer leaves mid-project --> | People     | High (3)   | High (3) | 🔴 9  | <!-- Mitigate: cross-train team -->        |       | Open   |
| R-02 | <!-- e.g. Third-party API deprecation -->     | Technical  | Med (2)    | High (3) | 🔴 6  | <!-- Mitigate: build abstraction layer --> |       | Open   |
| R-03 | <!-- e.g. Scope creep from stakeholders -->   | Scope      | High (3)   | Med (2)  | 🔴 6  | <!-- Mitigate: change control process -->  |       | Open   |
| R-04 | <!-- e.g. Budget overrun -->                  | Financial  | Med (2)    | Med (2)  | 🟡 4  | <!-- Monitor: weekly budget review -->     |       | Open   |
| R-05 | <!-- e.g. Regulatory change -->               | Compliance | Low (1)    | High (3) | 🟡 3  | <!-- Monitor: track regulatory updates --> |       | Open   |
| R-06 |                                               |            |            |          |       |                                            |       |        |

**Example register:**

| ID   | Risk Description                                            | Category   | Likelihood | Impact   | Score | Response                                             | Owner       | Status |
| ---- | ----------------------------------------------------------- | ---------- | ---------- | -------- | ----- | ---------------------------------------------------- | ----------- | ------ |
| R-01 | Stripe Vault API access delayed by DevOps                   | Technical  | Med (2)    | High (3) | 🔴 6  | Mitigate: escalate to David Park if not by Mar 17    | Priya Nair  | Open   |
| R-02 | PCI DSS scope creep — card data accidentally touches server | Compliance | Low (1)    | High (3) | 🟡 3  | Monitor: security review on every payment PR         | Marcus Webb | Open   |
| R-03 | US-149 (admin view) too large — slips sprint                | Scope      | High (3)   | Med (2)  | 🔴 6  | Mitigate: split story if > 5 pts at planning         | Jordan Lee  | Open   |
| R-04 | Budget overrun due to Stripe transaction fees               | Financial  | Med (2)    | Med (2)  | 🟡 4  | Monitor: review Stripe invoice weekly                | Priya Nair  | Open   |
| R-05 | Key engineer (Alice) unavailable mid-project                | People     | Low (1)    | High (3) | 🟡 3  | Monitor: cross-train Ravi on Stripe by Sprint 24 end | Alice Chen  | Open   |

---

## 🔴 High-Priority Risks (Score ≥ 6)

> [!IMPORTANT]
> Every risk with score ≥ 6 must have a named owner, a mitigation plan with specific actions, and a contingency plan. "We'll deal with it if it happens" is not a contingency plan.

### R-01 — Stripe Vault API Access Delayed

**Description:** DevOps has not yet provisioned Stripe Vault API credentials. US-142 (save payment method) cannot start without them. If access is delayed past Sprint 24 Day 2, the sprint goal is at risk.

**Trigger:** Stripe Vault credentials not available in AWS Secrets Manager by 2025-03-17 09:00.

**Impact if realized:** US-142, US-143, US-144 (the core sprint goal) cannot start. Sprint goal fails. 2-week delay to Sprint 25, pushing launch past Q2 target.

**Mitigation Plan:**

1. Priya Nair to confirm with DevOps lead (Sam Torres) by 2025-03-14 that credentials will be ready
2. If not confirmed by 2025-03-14, escalate to David Park (sponsor) to unblock
3. Alice Chen to prepare mock Stripe client so development can start in parallel if credentials are delayed

**Contingency Plan (if risk occurs):**

- Activate mock Stripe client for Sprint 24 development; integrate real credentials in Sprint 25
- Adjust sprint goal to "complete checkout UI changes" — defer Stripe integration to Sprint 25
- Notify David Park and update project timeline

**Owner:** Priya Nair | **Due:** 2025-03-17 | **Status:** Open

---

### R-03 — US-149 Too Large, Slips Sprint

**Description:** US-149 (admin view of customer saved payment methods) is estimated at 8 story points. Stories > 5 points frequently slip. If US-149 slips, it blocks the admin team's Q2 roadmap.

**Trigger:** US-149 not split into sub-stories before Sprint 24 planning ends.

**Impact if realized:** Admin portal feature delayed to Sprint 25. Admin team cannot demo saved payment management at Q2 review. Potential stakeholder dissatisfaction.

**Mitigation Plan:**

1. Jordan Lee to flag US-149 for splitting at Sprint 24 planning
2. Ravi Sharma to split US-149 into US-149a (list view, 3 pts) and US-149b (detail view, 5 pts) before planning
3. Commit only US-149a to Sprint 24; defer US-149b to Sprint 25

**Contingency Plan (if risk occurs):**

- If US-149 is not split and starts slipping by mid-sprint, descope to read-only list view
- Communicate to admin team lead (Chen Wei) by Sprint 24 Day 5 if US-149 is at risk

**Owner:** Jordan Lee | **Due:** 2025-03-17 | **Status:** Open

---

## 🟡 Medium-Priority Risks (Score 3–5)

| ID   | Risk                                           | Monitoring Action                                     | Frequency | Owner       |
| ---- | ---------------------------------------------- | ----------------------------------------------------- | --------- | ----------- |
| R-02 | PCI DSS scope creep — card data touches server | Security review checklist on every payment-related PR | Per PR    | Marcus Webb |
| R-04 | Budget overrun due to Stripe transaction fees  | Review Stripe invoice and burn rate in weekly standup | Weekly    | Priya Nair  |
| R-05 | Key engineer (Alice) unavailable mid-project   | Cross-training progress check; Ravi to shadow Alice   | Bi-weekly | Alice Chen  |

---

## 📈 Risk Trend

| ID   | Previous Score | Current Score | Trend        | Notes                                          |
| ---- | -------------- | ------------- | ------------ | ---------------------------------------------- |
| R-01 | 🔴 6           | 🔴 6          | → Stable     | DevOps confirmed credentials by Mar 14 — watch |
| R-02 | 🟡 3           | 🟡 3          | → Stable     | No new payment PRs this week                   |
| R-03 | 🔴 6           | 🟡 4          | ↓ Decreasing | US-149 split at planning — risk reduced        |
| R-04 | 🟡 4           | 🟡 4          | → Stable     | Stripe fees within estimate                    |
| R-05 | 🟡 3           | 🟡 3          | → Stable     | Ravi shadowing Alice on Stripe integration     |

---

## 📝 Risk Review Log

| Date       | Reviewer   | Changes Made                                           | Next Review |
| ---------- | ---------- | ------------------------------------------------------ | ----------- |
| 2025-03-17 | Priya Nair | Initial register created; R-01 through R-05 identified | 2025-03-24  |
| 2025-03-24 | Priya Nair | R-03 score reduced (4) — US-149 split at planning      | 2025-03-31  |

---

## 🔗 References

- [PMI Risk Management Guide](https://www.pmi.org/learning/library/risk-management-project-success-7229)
- [Project Charter](./project_charter.md)
- [Sprint Planning](./sprint_planning.md)
- [Resource Planning](./resource_planning.md)

---

_Template: risk_assessment.md | Updated: <!-- date -->_
