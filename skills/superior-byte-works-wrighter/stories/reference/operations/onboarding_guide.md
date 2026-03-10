# Onboarding Guide: {{TEAM_NAME}}

**Team**: {{TEAM_NAME}}
**Manager**: {{MANAGER_NAME}}
**Last Updated**: {{DATE}}
**Estimated Completion**: {{X}} days

---

## ## Welcome

Welcome to {{TEAM_NAME}}! This guide walks you through everything you need to get set up and productive. Complete each section in order and check off items as you go.

**Your onboarding buddy**: {{BUDDY_NAME}} ({{BUDDY_SLACK}})
**Questions?** Ask in {{TEAM_SLACK_CHANNEL}}

---

## ## Day 1: Access & Accounts

### Required Accounts

- [ ] Company email confirmed and working
- [ ] Slack workspace: {{SLACK_WORKSPACE}} — join channels: {{CHANNEL_LIST}}
- [ ] GitHub org: {{GITHUB_ORG}} — request access from {{IT_CONTACT}}
- [ ] {{CLOUD_PROVIDER}} console access — submit request: {{ACCESS_REQUEST_LINK}}
- [ ] VPN configured — setup guide: {{VPN_GUIDE_LINK}}
- [ ] Password manager: {{PASSWORD_MANAGER}} — setup: {{SETUP_LINK}}
- [ ] 2FA enabled on all accounts

### Verification

```bash
# Confirm GitHub access
git clone {{SAMPLE_REPO}}

# Confirm cloud access
{{CLOUD_CLI_TEST_COMMAND}}
```

**Check in with**: {{BUDDY_NAME}} at end of Day 1

---

## ## Day 2: Development Environment

### Install Required Tools

```bash
# Package manager
{{PACKAGE_MANAGER_INSTALL}}

# Language runtime
{{LANGUAGE_INSTALL}}

# Project dependencies
{{DEPS_INSTALL_COMMAND}}
```

### Clone Core Repositories

```bash
git clone {{REPO_1}}
git clone {{REPO_2}}
git clone {{REPO_3}}
```

### Configure Local Environment

```bash
# Copy environment template
cp .env.example .env

# Set required variables (ask buddy for values)
# {{ENV_VAR_1}}, {{ENV_VAR_2}}, {{ENV_VAR_3}}
```

### Verification

```bash
# Run local stack
{{LOCAL_RUN_COMMAND}}

# Run tests
{{TEST_COMMAND}}
# Expected: All tests pass
```

---

## ## Day 3–5: Systems & Context

### Architecture Overview

- [ ] Read: [Architecture Doc]({{ARCH_DOC_LINK}})
- [ ] Review: [System Diagram]({{DIAGRAM_LINK}})
- [ ] Watch: [Team Intro Recording]({{RECORDING_LINK}}) ({{X}} min)

### Key Systems to Learn

| System       | Purpose     | Docs                  |
| ------------ | ----------- | --------------------- |
| {{SYSTEM_1}} | {{PURPOSE}} | [Link]({{DOCS_LINK}}) |
| {{SYSTEM_2}} | {{PURPOSE}} | [Link]({{DOCS_LINK}}) |
| {{SYSTEM_3}} | {{PURPOSE}} | [Link]({{DOCS_LINK}}) |

### Meetings to Join

- [ ] Team standup: {{TIME}} in {{CHANNEL/ROOM}}
- [ ] Sprint planning: {{CADENCE}}
- [ ] 1:1 with manager: {{CADENCE}}
- [ ] Architecture review: {{CADENCE}}

---

## ## Week 2: First Contribution

### Starter Tasks

1. Pick a "good first issue" from: {{ISSUE_BOARD_LINK}}
2. Follow the [contribution guide]({{CONTRIBUTION_GUIDE_LINK}})
3. Submit your first PR — ask {{BUDDY_NAME}} for review

### Deployment Access

- [ ] Read the [Deployment Checklist](./deployment_checklist.md)
- [ ] Shadow a deploy with {{BUDDY_NAME}}
- [ ] Complete deploy certification: {{CERT_LINK}}

---

## ## Escalation & Support

| Need                | Contact          | How            |
| ------------------- | ---------------- | -------------- |
| Access issues       | {{IT_TEAM}}      | {{IT_CHANNEL}} |
| Technical questions | {{BUDDY_NAME}}   | Slack DM       |
| Team process        | {{MANAGER_NAME}} | 1:1            |
| HR / benefits       | {{HR_CONTACT}}   | {{HR_CHANNEL}} |

**Onboarding complete when**: First PR merged and all checklist items checked off.
Notify {{MANAGER_NAME}} when done for 30-day check-in scheduling.
