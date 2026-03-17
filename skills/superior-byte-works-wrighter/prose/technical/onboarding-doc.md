---
name: Onboarding Documentation
description: Guide for writing developer and user onboarding documents that reduce time-to-productivity
version: 1.0.0
author: Omni Unified Writing
---

# Onboarding Documentation

Onboarding documentation reduces time-to-productivity for new users or developers. The goal is a successful first experience — not comprehensive coverage. Save depth for reference docs.

---

## ## Onboarding Document Types

| Type                     | Audience           | Goal                              | Length    |
| ------------------------ | ------------------ | --------------------------------- | --------- |
| **Developer quickstart** | New engineers      | First working build in < 30 min   | 1–2 pages |
| **User onboarding**      | New end users      | First successful task in < 10 min | 1 page    |
| **Team onboarding**      | New team members   | Productive in first week          | 3–5 pages |
| **Integration guide**    | Partner developers | First integration in < 1 hour     | 2–4 pages |

---

## ## Developer Quickstart Template

````markdown
# Quickstart: [Project Name]

Get [project name] running locally in under 30 minutes.

## Prerequisites

| Requirement | Version | Install                                  |
| ----------- | ------- | ---------------------------------------- |
| Node.js     | ≥ 18.0  | [nodejs.org](https://nodejs.org)         |
| PostgreSQL  | ≥ 14    | [postgresql.org](https://postgresql.org) |
| Git         | Any     | [git-scm.com](https://git-scm.com)       |

## 1. Clone and install

```bash
git clone https://github.com/org/repo.git
cd repo
npm install
```
````

## 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

| Variable       | Description                                               | Example                                      |
| -------------- | --------------------------------------------------------- | -------------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string                              | `postgresql://user:pass@localhost:5432/mydb` |
| `SECRET_KEY`   | JWT signing secret (generate with `openssl rand -hex 32`) | `abc123...`                                  |
| `PORT`         | Server port                                               | `3000`                                       |

## 3. Set up the database

```bash
npm run db:migrate
npm run db:seed  # Optional: load sample data
```

## 4. Start the server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the dashboard.

## 5. Run the tests

```bash
npm test
```

All tests should pass. If any fail, see [Troubleshooting](#troubleshooting).

## Next steps

- [Architecture overview](./architecture.md) — How the system is structured
- [Contributing guide](./CONTRIBUTING.md) — How to submit changes
- [API reference](./api/README.md) — Endpoint documentation

## Troubleshooting

| Problem                    | Solution                                                                   |
| -------------------------- | -------------------------------------------------------------------------- |
| `ECONNREFUSED` on database | Ensure PostgreSQL is running: `pg_ctl status`                              |
| `MODULE_NOT_FOUND`         | Run `npm install` again                                                    |
| Port 3000 in use           | Change `PORT` in `.env` or kill the process: `lsof -ti:3000 \| xargs kill` |

````

---

## ## User Onboarding Template

```markdown
# Welcome to [Product Name]

[Product name] helps you [core value proposition in one sentence].

## Your first 5 minutes

### 1. Create your account

Go to [app.example.com/signup](https://app.example.com/signup) and enter your email.
Check your inbox for a verification link.

### 2. Set up your workspace

A workspace is where your team's work lives.

1. Click **Create workspace**.
2. Enter a name (e.g., your company name).
3. Click **Create**.

### 3. Invite your team

1. Go to **Settings > Members**.
2. Click **Invite member**.
3. Enter email addresses, one per line.
4. Click **Send invitations**.

### 4. Create your first project

1. Click **+ New project** in the sidebar.
2. Choose a template or start blank.
3. Click **Create project**.

**You're ready.** Explore what you can do:

- [Import existing data](./import.md)
- [Connect integrations](./integrations.md)
- [Set up notifications](./notifications.md)
````

---

## ## Team Onboarding Template

```markdown
# [Team Name] Onboarding Guide

Welcome to the team. This guide covers everything you need to be productive in your first week.

## Day 1: Access and setup

- [ ] Get access to [list systems with links]
- [ ] Complete security training at [link]
- [ ] Set up your development environment: [link to dev quickstart]
- [ ] Join Slack channels: #general, #[team-channel], #incidents

## Day 2–3: Learn the system

- [ ] Read the [architecture overview](./architecture.md)
- [ ] Complete the [codebase tour](./codebase-tour.md)
- [ ] Shadow a team member on their current task
- [ ] Make your first small contribution (see [good first issues](https://github.com/org/repo/labels/good%20first%20issue))

## Day 4–5: First contribution

- [ ] Pick up a task from the backlog
- [ ] Submit your first pull request
- [ ] Attend team standup and sprint planning

## Key contacts

| Role                | Name   | Contact              |
| ------------------- | ------ | -------------------- |
| Engineering manager | [Name] | @slack-handle        |
| On-call lead        | [Name] | PagerDuty            |
| Security            | [Name] | security@example.com |

## Essential reading

- [Team norms](./team-norms.md) — How we work
- [Incident response](./incident-response.md) — What to do when things break
- [Deployment process](./deployment.md) — How to ship code
```

---

## ## Onboarding Design Principles

### Time-box the goal

State the time commitment upfront: "Get running in 30 minutes." This sets expectations and creates urgency.

### Minimize prerequisites

Every prerequisite is a potential dropout point. Reduce them:

- Use Docker to eliminate environment setup
- Provide a hosted sandbox for users who can't install locally
- Use sensible defaults so users don't need to configure everything

### Verify each step

Every step should have a verifiable outcome:

| Step                  | Verification                                                |
| --------------------- | ----------------------------------------------------------- |
| "Run `npm install`"   | "You should see `added N packages`"                         |
| "Start the server"    | "Open http://localhost:3000 — you should see the dashboard" |
| "Create your account" | "Check your inbox for a verification email"                 |

### Fail gracefully

Include a troubleshooting section for the 3–5 most common failure modes. Users who hit an error and find it in the troubleshooting guide stay; users who don't find it leave.

---

## ## Metrics for Onboarding Quality

| Metric                         | Target                          | How to measure               |
| ------------------------------ | ------------------------------- | ---------------------------- |
| Time to first success          | < 30 min (dev), < 10 min (user) | Session recording, analytics |
| Completion rate                | > 70%                           | Funnel analytics             |
| Support tickets from new users | Decreasing                      | Ticket tagging               |
| Drop-off step                  | Identify top 1–2                | Funnel analytics             |

---

## ## See Also

- [user-guide.md](user-guide.md) — Task-oriented user documentation
- [api-documentation.md](api-documentation.md) — API reference
- [../../templates/operations/onboarding_guide.md](../../templates/operations/onboarding_guide.md) — Operations onboarding template
- [../../integration/](../../integration/) — Integration guides
