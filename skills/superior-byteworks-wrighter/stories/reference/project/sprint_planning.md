---
name: Sprint Planning
description: Agile sprint planning document covering goal, capacity, backlog, dependencies, and key events
version: 1.0.0
author: Omni Unified Writing
---

# Sprint Planning

> [!NOTE]
> Sprint planning produces two outputs: (1) a sprint goal — one sentence describing what the team will achieve and why it matters, and (2) a sprint backlog — the set of stories the team commits to completing. Both must be agreed upon by the whole team before the meeting ends.

**Sprint:** <!-- e.g. Sprint 24 -->  
**Dates:** <!-- YYYY-MM-DD → YYYY-MM-DD -->  
**Facilitator:** <!-- Scrum Master name -->  
**Team:** <!-- Team name -->

---

## 🎯 Sprint Goal

> _One sentence describing what the team will achieve and why it matters._

**Example:** Enable returning customers to save and reuse payment methods at checkout, reducing cart abandonment at the payment step.

**Definition of Done for this Sprint:**

- [ ] All acceptance criteria met for committed stories
- [ ] Code reviewed and merged to `main`
- [ ] Tests passing (unit + integration)
- [ ] Deployed to staging environment
- [ ] Documentation updated (API docs, runbooks if applicable)
- [ ] No P1/P2 bugs introduced

> [!TIP]
> A good sprint goal is outcome-oriented, not task-oriented. "Enable saved payment methods" is better than "Complete US-142, US-143, US-144." The goal survives scope changes; the backlog doesn't.

---

## 📊 Capacity Planning

| Team Member   | Role                       | Available Days  | Capacity (hrs)   | Notes                  |
| ------------- | -------------------------- | --------------- | ---------------- | ---------------------- |
| <!-- Name --> | <!-- Dev / QA / Design --> | <!-- e.g. 8 --> | <!-- e.g. 48 --> | <!-- PTO, meetings --> |
|               |                            |                 |                  |                        |
|               |                            |                 |                  |                        |
| **Total**     |                            |                 |                  |                        |

**Sprint velocity (last 3 sprints):** <!-- e.g. 42 / 38 / 45 → avg 42 pts -->  
**Committed capacity this sprint:** <!-- e.g. 40 pts -->

**Example:**

| Team Member    | Role   | Available Days | Capacity (hrs) | Notes                           |
| -------------- | ------ | -------------- | -------------- | ------------------------------- |
| Tom Okafor     | Dev    | 9              | 54             | 1 day PTO (Mar 21)              |
| Alice Chen     | Dev    | 10             | 60             | Full sprint                     |
| Ravi Sharma    | Dev    | 8              | 48             | 2 days at company offsite       |
| Mei Lin        | QA     | 10             | 60             | Full sprint                     |
| Sara Johansson | Design | 5              | 30             | 50% allocation — also on EP-019 |
| **Total**      |        | **42**         | **252 hrs**    |                                 |

**Sprint velocity (last 3 sprints):** 45 / 42 / 48 → avg **45 pts**  
**Committed capacity this sprint:** **40 pts** (conservative — offsite reduces Ravi's availability)

> [!IMPORTANT]
> Capacity is not the same as velocity. Velocity is a historical average; capacity is what's actually available this sprint. Always plan to capacity, not to velocity — then use velocity as a sanity check.

---

## 📋 Sprint Backlog

| #         | Story / Task                 | Epic | Assignee | Story Points | Priority | Status |
| --------- | ---------------------------- | ---- | -------- | ------------ | -------- | ------ |
| 1         | <!-- As a user I want... --> |      |          |              | 🔴 High  | To Do  |
| 2         |                              |      |          |              | 🟡 Med   | To Do  |
| 3         |                              |      |          |              | 🟢 Low   | To Do  |
| 4         |                              |      |          |              |          |        |
| 5         |                              |      |          |              |          |        |
| **Total** |                              |      |          | **0 pts**    |          |        |

**Example:**

| #         | Story / Task                                     | Epic              | Assignee | Story Points | Priority | Status |
| --------- | ------------------------------------------------ | ----------------- | -------- | ------------ | -------- | ------ |
| US-142    | Save payment method after checkout               | Checkout Redesign | Tom      | 5            | 🔴 High  | To Do  |
| US-143    | Pre-select saved card on return visit            | Checkout Redesign | Alice    | 3            | 🔴 High  | To Do  |
| US-144    | Expired card badge + prompt to add new card      | Checkout Redesign | Tom      | 2            | 🔴 High  | To Do  |
| US-147    | Order confirmation email — redesigned template   | Notifications     | Alice    | 5            | 🟡 Med   | To Do  |
| US-149    | Admin: view customer saved payment methods       | Admin Portal      | Ravi     | 8            | 🟡 Med   | To Do  |
| US-151    | Fix: checkout total not updating on coupon apply | Bug Fixes         | Ravi     | 3            | 🔴 High  | To Do  |
| TECH-22   | Upgrade Stripe SDK to v14                        | Tech Debt         | Alice    | 5            | 🟡 Med   | To Do  |
| TECH-23   | Add integration tests for payment flow           | Tech Debt         | Mei      | 5            | 🟡 Med   | To Do  |
| **Total** |                                                  |                   |          | **36 pts**   |          |        |

> [!TIP]
> Leave 10–15% buffer (here: 40 pt capacity, 36 pt committed). Buffer absorbs unplanned work, meetings, and estimation error. A team that consistently hits 100% of committed points is under-committing; a team that consistently misses is over-committing.

---

## 🚧 Dependencies & Blockers

| Item                | Depends On             | Owner | Due Date | Status     |
| ------------------- | ---------------------- | ----- | -------- | ---------- |
| <!-- Task/Story --> | <!-- Team / System --> |       |          | ⏳ Pending |
|                     |                        |       |          |            |

**Example:**

| Item                            | Depends On                       | Owner  | Due Date   | Status     |
| ------------------------------- | -------------------------------- | ------ | ---------- | ---------- |
| US-142 (save payment method)    | Stripe Vault API access (DevOps) | DevOps | 2025-03-17 | ✅ Ready   |
| US-149 (admin view saved cards) | US-142 data model finalized      | Tom    | 2025-03-19 | ⏳ Pending |
| TECH-22 (Stripe SDK upgrade)    | Stripe v14 changelog review      | Alice  | 2025-03-17 | ✅ Ready   |

> [!WARNING]
> Unresolved dependencies at sprint start are the #1 cause of sprint failure. If a dependency is not resolved by Day 2, escalate immediately — don't wait for the mid-sprint check.

---

## 🔁 Carry-Over from Previous Sprint

| Story                | Reason Not Completed  | Points | Action                     |
| -------------------- | --------------------- | ------ | -------------------------- |
| <!-- Story title --> | <!-- Brief reason --> |        | Re-estimate / Drop / Carry |
|                      |                       |        |                            |

**Example:**

| Story  | Reason Not Completed                          | Points | Action                 |
| ------ | --------------------------------------------- | ------ | ---------------------- |
| US-138 | Stripe tokenization — blocked on legal review | 5      | Carry — legal approved |
| US-139 | Scope grew during implementation              | 3      | Re-estimate → split    |

---

## 📅 Key Events This Sprint

| Event            | Date  | Time                | Owner         |
| ---------------- | ----- | ------------------- | ------------- |
| Sprint Planning  |       |                     | Scrum Master  |
| Daily Standup    | Daily | <!-- e.g. 09:00 --> | Team          |
| Mid-Sprint Check |       |                     |               |
| Sprint Review    |       |                     | Product Owner |
| Retrospective    |       |                     | Scrum Master  |

---

## 📝 Notes & Decisions

<!-- Record any important decisions made during planning -->

-
- ***

## 🔗 References

- [Agile Sprint Planning Guide — Atlassian](https://www.atlassian.com/agile/scrum/sprint-planning)
- [Sprint Retrospective template](./retrospective.md)
- [User Story template](../product/user_story.md)
- [Risk Assessment template](./risk_assessment.md)

---

## See Also

- [Sprint Retrospective](./retrospective.md) — For reflecting on sprint outcomes and process improvement
- [Project Charter](./project_charter.md) — For project-level context and objectives
- [User Story](./../product/user_story.md) — For sprint backlog item format
- [Risk Assessment](./risk_assessment.md) — For identifying and mitigating sprint risks

---

_Template: sprint_planning.md | Updated: <!-- date -->_
