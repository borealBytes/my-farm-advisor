---
name: Sprint Retrospective
description: Agile retrospective template with multiple formats (4Ls, Sailboat, Start-Stop-Continue), metrics, and action tracking
version: 1.0.0
author: Omni Unified Writing
---

# Sprint Retrospective

> [!NOTE]
> The retrospective is the team's dedicated time to inspect how they work — not what they built. The goal is 1–3 concrete, actionable improvements for the next sprint. More than 3 action items rarely get done. Focus on the highest-leverage change.

**Sprint:** <!-- e.g. Sprint 24 -->  
**Date:** <!-- YYYY-MM-DD -->  
**Facilitator:** <!-- Scrum Master name -->  
**Attendees:** <!-- List names -->  
**Format:** <!-- 4Ls | Sailboat | Start-Stop-Continue -->

---

## 📊 Sprint Metrics Snapshot

| Metric                 | Target | Actual | Trend |
| ---------------------- | ------ | ------ | ----- |
| Story Points Committed |        |        |       |
| Story Points Completed |        |        | ↑ ↓ → |
| Bugs Introduced        |        |        |       |
| Bugs Resolved          |        |        |       |
| Team Happiness (1–5)   |        |        |       |

**Example:**

| Metric                 | Target | Actual | Trend |
| ---------------------- | ------ | ------ | ----- |
| Story Points Committed | 40     | 40     | →     |
| Story Points Completed | 40     | 36     | ↓     |
| Bugs Introduced        | 0      | 2      | ↑     |
| Bugs Resolved          | 3      | 3      | →     |
| Team Happiness (1–5)   | 4      | 3.5    | ↓     |

> [!TIP]
> Metrics set the context for the conversation — they don't drive it. A team that completed 36/40 points but shipped a critical bug has a different conversation than one that completed 36/40 points because of a well-managed scope reduction.

---

## 🔵 Format A — 4Ls

> _Use when the team needs structured reflection across four dimensions. Best for teams new to retrospectives or when the sprint had mixed results._

### 💡 Liked

_What went well? What should we keep doing?_

-
-
- **Example:**

- Daily standups were focused and under 15 minutes — the new "one blocker per person" rule worked well
- Pair programming on US-142 caught the CSRF bug before code review — saved a security review cycle
- Design handoff from Sara was early enough that Tom could start implementation without waiting

### 📚 Learned

_What new insights or knowledge did we gain?_

-
-
- **Example:**

- Stripe SDK v14 has breaking changes in the webhook signature validation — need to read changelogs before upgrading
- Our staging environment doesn't mirror production's Redis config — caused a false pass on session tests
- Story US-149 was too large (8 pts) — should have been split at planning

### 🚫 Lacked

_What was missing? What slowed us down?_

-
-
- **Example:**

- Clear definition of "done" for TECH-22 — the Stripe upgrade was "done" but integration tests weren't updated
- Ravi's offsite wasn't accounted for in the dependency chain — US-149 started 2 days late
- QA involvement in story refinement — Mei found edge cases during testing that should have been ACs

### 🌟 Longed For

_What do we wish we had? What would make the next sprint better?_

-
-
- **Example:**

- A staging environment that mirrors production Redis configuration
- QA present at story refinement sessions (not just sprint planning)
- A team agreement on what "upgrade complete" means for tech debt stories

---

## ⛵ Format B — Sailboat

> _Use when the team needs to visualize forces helping and hindering progress. Best for teams that are stuck in a rut or need a fresh perspective._

```mermaid
quadrantChart
    title Sailboat Retrospective - Forces Acting on the Team
    x-axis Hindering ← → Helping
    y-axis Low Impact ← → High Impact
    quadrant-1 Wind (High Impact, Helping)
    quadrant-2 Anchors (High Impact, Hindering)
    quadrant-3 Rocks (Low Impact, Hindering)
    quadrant-4 Island (Goal - Destination)
```

**Categories:**
- 🌬️ **Wind** — Top Right: What helps us move faster? (accelerators)
- ⚓ **Anchors** — Top Left: What slows us down? (blockers)
- 🪨 **Rocks** — Bottom Left: What risks lie ahead? (risks)
- 🏝️ **Island** — Center: Our goal/destination

| Category                 | Items |
| ------------------------ | ----- |
| 🌬️ Wind (accelerators)   |       |
| ⚓ Anchors (blockers)    |       |
| 🪨 Rocks (risks)         |       |
| 🏝️ Island (goal clarity) |       |

**Example:**

| Category                 | Items                                                                            |
| ------------------------ | -------------------------------------------------------------------------------- |
| 🌬️ Wind (accelerators)   | Early design handoff; pair programming on complex stories; focused standups      |
| ⚓ Anchors (blockers)    | Staging/prod environment mismatch; QA not in refinement; large stories not split |
| 🪨 Rocks (risks)         | Ravi leaving for 3 weeks in Sprint 26; Stripe API deprecation in Q3              |
| 🏝️ Island (goal clarity) | Ship saved payment methods to 100% of users by end of Q2                         |

---

## 🔄 Format C — Start / Stop / Continue

> _Use when the team needs direct, actionable feedback. Best for experienced teams or when the team has specific process pain points._

| Category    | Items |
| ----------- | ----- |
| ▶️ Start    |       |
| ⏹️ Stop     |       |
| 🔁 Continue |       |

**Example:**

| Category    | Items                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| ▶️ Start    | Inviting QA to story refinement; splitting stories > 5 pts before sprint planning; reading SDK changelogs before upgrading |
| ⏹️ Stop     | Carrying over stories without re-estimating; starting dependent stories before blockers are resolved                       |
| 🔁 Continue | Pair programming on security-sensitive stories; focused standups with the "one blocker" rule; early design handoffs        |

---

## ✅ Action Items

> [!IMPORTANT]
> Limit to 3 action items maximum. Each must have a named owner and a due date. Action items without owners don't get done. Review these at the start of the next retrospective.

| #   | Action | Owner | Due Date | Priority | Status |
| --- | ------ | ----- | -------- | -------- | ------ |
| 1   |        |       |          | 🔴 High  | Open   |
| 2   |        |       |          | 🟡 Med   | Open   |
| 3   |        |       |          | 🟢 Low   | Open   |

**Example:**

| #   | Action                                                                 | Owner       | Due Date   | Priority | Status |
| --- | ---------------------------------------------------------------------- | ----------- | ---------- | -------- | ------ |
| 1   | Invite Mei (QA) to all story refinement sessions starting Sprint 25    | Jordan Lee  | 2025-03-31 | 🔴 High  | Open   |
| 2   | Add "staging Redis config matches prod" to deployment checklist        | Alice Chen  | 2025-04-04 | 🟡 Med   | Open   |
| 3   | Add team agreement on "tech debt story done" to team working agreement | Ravi Sharma | 2025-04-04 | 🟢 Low   | Open   |

---

## 🔄 Previous Action Items Review

| Action (from last retro) | Owner | Status                                 | Notes |
| ------------------------ | ----- | -------------------------------------- | ----- |
|                          |       | ✅ Done / ❌ Not Done / 🔄 In Progress |       |
|                          |       |                                        |       |

**Example:**

| Action (from last retro)                     | Owner      | Status         | Notes                                                  |
| -------------------------------------------- | ---------- | -------------- | ------------------------------------------------------ |
| Add mid-sprint check to calendar             | Jordan Lee | ✅ Done        | Added to recurring calendar invite                     |
| Split stories > 8 pts before sprint planning | Priya Nair | 🔄 In Progress | Happened for 2/3 large stories; US-149 slipped through |
| Document Stripe integration in runbook       | Tom Okafor | ❌ Not Done    | Deprioritized — carry to Sprint 25                     |

---

## 📝 Facilitator Notes

<!-- Key themes, energy level, participation quality -->

-
- **Example:**

- Energy was lower than usual — team felt the sprint was "almost good" but the 2 bugs and missed US-149 were demoralizing
- Strong consensus on QA-in-refinement action item — this came up independently from 4 team members
- Ravi raised the staging/prod mismatch — worth a deeper investigation before Sprint 26

---

## 🔗 References

- [Agile Retrospectives — Atlassian](https://www.atlassian.com/agile/scrum/retrospectives)
- [4Ls Retrospective format](https://www.teamretro.com/retrospective-templates/4ls-retrospective)
- [Sailboat Retrospective format](https://www.teamretro.com/retrospective-templates/sailboat-retrospective)
- [Sprint Planning template](./sprint_planning.md)

---

## See Also

- [Sprint Planning](./sprint_planning.md) — For planning the next iteration based on retro learnings
- [Project Charter](./project_charter.md) — For project context and success criteria
- [Incident Report](./../software/incident_report.md) — For reviewing incidents that affected the sprint
- [Post-Mortem](./../software/post_mortem.md) — For deep-dive analysis of significant incidents
- [Risk Assessment](./risk_assessment.md) — For tracking risks identified during retrospectives

---

_Template: retrospective.md | Updated: <!-- date -->_
