---
name: Resource Planning
description: Project resource plan covering team roster, allocation, skills inventory, RACI, and capacity vs. demand
version: 1.0.0
author: Omni Unified Writing
---

# Resource Planning

> [!NOTE]
> Resource planning answers three questions: Who is working on this project? How much of their time? Do we have the skills we need? Update this document at the start of each sprint and whenever team composition changes.

**Project:** <!-- Project name -->  
**Planning Period:** <!-- YYYY-MM-DD → YYYY-MM-DD -->  
**PM / Owner:** <!-- Name -->  
**Last Updated:** <!-- YYYY-MM-DD -->

**Example:**

**Project:** Checkout v2 — Saved Payment Methods  
**Planning Period:** 2025-03-03 → 2025-04-25  
**PM / Owner:** Priya Nair  
**Last Updated:** 2025-03-17

---

## 👥 Team Roster

| Name | Role                            | Seniority              | Team | Location / TZ       | FTE % on Project         |
| ---- | ------------------------------- | ---------------------- | ---- | ------------------- | ------------------------ |
|      | <!-- Eng / Design / QA / PM --> | <!-- Sr / Mid / Jr --> |      | <!-- e.g. UTC-5 --> | <!-- e.g. 100% / 50% --> |
|      |                                 |                        |      |                     |                          |
|      |                                 |                        |      |                     |                          |

**Total FTE allocated:** <!-- e.g. 4.5 FTE -->  
**Total FTE required:** <!-- e.g. 5.0 FTE -->  
**Gap:** <!-- e.g. 0.5 FTE — need 1 part-time QA -->

**Example:**

| Name           | Role         | Seniority | Team         | Location / TZ  | FTE % on Project |
| -------------- | ------------ | --------- | ------------ | -------------- | ---------------- |
| Alice Chen     | Eng          | Senior    | Web Platform | UTC-8 (PST)    | 100%             |
| Tom Okafor     | Eng          | Mid       | Web Platform | UTC-5 (EST)    | 100%             |
| Ravi Sharma    | Eng          | Mid       | Web Platform | UTC+5:30 (IST) | 100%             |
| Mei Lin        | QA           | Senior    | Web Platform | UTC-8 (PST)    | 100%             |
| Sara Johansson | Design       | Senior    | Design       | UTC+1 (CET)    | 50%              |
| Priya Nair     | PM           | Senior    | Product      | UTC-5 (EST)    | 30%              |
| Jordan Lee     | Scrum Master | Senior    | Web Platform | UTC-8 (PST)    | 20%              |

**Total FTE allocated:** 4.0 FTE  
**Total FTE required:** 4.0 FTE  
**Gap:** None — team is fully staffed for this project

> [!TIP]
> FTE % matters more than headcount. A team of 6 people at 50% allocation is effectively 3 FTE — and context-switching costs make it feel like 2. Prefer fewer people at higher allocation over many people at low allocation.

---

## 📅 Allocation by Sprint / Month

> _Percentage of time each person is allocated to this project per period._

| Name                 | Sprint 23 | Sprint 24 | Sprint 25 | Sprint 26 |
| -------------------- | --------- | --------- | --------- | --------- |
|                      | 100%      | 100%      | 50%       | 50%       |
|                      |           |           |           |           |
| **Team Total (FTE)** |           |           |           |           |

**Example:**

| Name           | Sprint 23   | Sprint 24   | Sprint 25   | Sprint 26   | Notes                           |
| -------------- | ----------- | ----------- | ----------- | ----------- | ------------------------------- |
| Alice Chen     | 100%        | 100%        | 100%        | 50%         | Moves to EP-022 in Sprint 26    |
| Tom Okafor     | 100%        | 100%        | 100%        | 100%        | Full project duration           |
| Ravi Sharma    | 100%        | 80%         | 100%        | 100%        | Offsite Sprint 24 (2 days)      |
| Mei Lin        | 50%         | 100%        | 100%        | 50%         | QA ramp-up in Sprint 24         |
| Sara Johansson | 100%        | 50%         | 0%          | 0%          | Design complete after Sprint 24 |
| **Team Total** | **3.5 FTE** | **4.3 FTE** | **4.0 FTE** | **3.0 FTE** |                                 |

> [!WARNING]
> Alice Chen's allocation drops to 50% in Sprint 26 (she moves to EP-022). If the project is not feature-complete by end of Sprint 25, the team loses its most senior engineer. This is a hard deadline — plan accordingly.

---

## 🛠️ Skills Inventory

| Skill                     | Required Level  | Available (Name)    | Gap                         |
| ------------------------- | --------------- | ------------------- | --------------------------- |
| <!-- e.g. React -->       | <!-- Expert --> | <!-- Alice, Bob --> | None                        |
| <!-- e.g. ML Ops -->      | <!-- Mid -->    | <!-- None -->       | ⚠️ Need to hire or contract |
| <!-- e.g. UX Research --> | <!-- Any -->    |                     |                             |

**Example:**

| Skill                   | Required Level | Available (Name)     | Gap                                            |
| ----------------------- | -------------- | -------------------- | ---------------------------------------------- |
| TypeScript / Node.js    | Expert         | Alice, Tom, Ravi     | None                                           |
| Stripe API integration  | Mid            | Alice                | ⚠️ Single point of failure — cross-train Ravi  |
| React / Next.js         | Expert         | Alice, Tom           | None                                           |
| PostgreSQL              | Mid            | Alice, Ravi          | None                                           |
| QA / Test automation    | Senior         | Mei                  | ⚠️ Single QA — no backup if Mei is unavailable |
| UX / Interaction design | Senior         | Sara                 | None (Sara at 50%)                             |
| PCI DSS / Security      | Mid            | Marcus Webb (shared) | None (Marcus is shared resource)               |

---

## 💼 Roles & Responsibilities (RACI)

| Deliverable               | PM (Priya) | Tech Lead (Alice) | Dev (Tom/Ravi) | QA (Mei) | Design (Sara) | Sponsor (David) |
| ------------------------- | ---------- | ----------------- | -------------- | -------- | ------------- | --------------- |
| Requirements / PRD        | A          | C                 | I              | I        | C             | R               |
| Architecture decisions    | I          | R/A               | C              | I        | I             | I               |
| Development               | I          | A                 | R              | C        | I             | I               |
| Testing / QA sign-off     | I          | C                 | C              | R/A      | I             | I               |
| Security review           | I          | C                 | C              | I        | I             | I               |
| Deployment                | A          | R                 | C              | C        | I             | I               |
| Stakeholder communication | R/A        | I                 | I              | I        | I             | C               |

**R** = Responsible | **A** = Accountable | **C** = Consulted | **I** = Informed

> [!TIP]
> Every row must have exactly one **A** (Accountable). Multiple accountable people means no one is accountable. If you can't agree on who is accountable, that's a governance problem to solve before the project starts.

---

## 🔄 External Resources & Contractors

| Name / Vendor | Skill | Engagement Type                          | Start | End | Cost/Month | Status                            |
| ------------- | ----- | ---------------------------------------- | ----- | --- | ---------- | --------------------------------- |
|               |       | <!-- Contract / Retainer / Staff Aug --> |       |     |            | <!-- Pending / Active / Ended --> |
|               |       |                                          |       |     |            |                                   |

**Example:**

| Name / Vendor       | Skill                  | Engagement Type | Start      | End        | Cost/Month | Status |
| ------------------- | ---------------------- | --------------- | ---------- | ---------- | ---------- | ------ |
| Stripe (API vendor) | Payment infrastructure | SaaS            | 2025-03-17 | Ongoing    | ~$200      | Active |
| LaunchDarkly        | Feature flags          | SaaS            | 2025-03-17 | 2025-06-30 | $100       | Active |

---

## ⚠️ Resource Risks

| Risk                                    | Affected Person(s) | Likelihood | Impact | Mitigation                  |
| --------------------------------------- | ------------------ | ---------- | ------ | --------------------------- |
| <!-- e.g. Key dev on parental leave --> |                    | Med        | High   | <!-- Cross-train backup --> |
| <!-- e.g. Contractor contract ends -->  |                    |            |        |                             |

**Example:**

| Risk                                          | Affected Person(s) | Likelihood | Impact | Mitigation                                                               |
| --------------------------------------------- | ------------------ | ---------- | ------ | ------------------------------------------------------------------------ |
| Alice moves to EP-022 before project complete | Alice Chen         | Med        | High   | Feature-complete by Sprint 25 end; cross-train Ravi                      |
| Mei unavailable (illness / PTO)               | Mei Lin            | Low        | High   | Tom and Ravi to cover basic QA; delay release if needed                  |
| Sara's design deliverables delayed            | Sara Johansson     | Med        | Med    | Design must be handed off by Sprint 24 Day 2 or story moves to Sprint 25 |

---

## 📊 Capacity vs. Demand Summary

| Period    | Available Capacity (hrs) | Planned Demand (hrs) | Delta | Status   |
| --------- | ------------------------ | -------------------- | ----- | -------- |
| Sprint 23 | 210                      | 195                  | +15   | 🟢 OK    |
| Sprint 24 | 252                      | 216                  | +36   | 🟢 OK    |
| Sprint 25 | 240                      | 240                  | 0     | 🟡 Tight |
| Sprint 26 | 180                      | 200                  | -20   | 🔴 Over  |

> [!WARNING]
> Sprint 26 is over-capacity by 20 hours due to Alice's reduced allocation. Either reduce scope for Sprint 26 or request additional engineering support from the platform team. Do not plan to over-capacity — it leads to burnout and quality issues.

---

## 📝 Notes & Decisions

- **2025-03-17:** Confirmed Sara's 50% allocation with Design team lead. Design deliverables must be complete by Sprint 24 Day 2.
- **2025-03-17:** Ravi to shadow Alice on Stripe integration starting Sprint 24 Day 1 — reduces single-point-of-failure risk.
- **2025-03-14:** Marcus Webb (Security) confirmed as shared resource for security reviews — available within 24 hours of PR submission.

---

## 🔗 References

- [Project Charter](./project_charter.md)
- [Risk Assessment](./risk_assessment.md)
- [Sprint Planning](./sprint_planning.md)
- [RACI Matrix Guide — PMI](https://www.pmi.org/learning/library/make-raci-work-you-8786)

---

_Template: resource_planning.md | Updated: <!-- date -->_
