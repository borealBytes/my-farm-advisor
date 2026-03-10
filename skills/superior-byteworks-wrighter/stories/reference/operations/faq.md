# FAQ: {{SYSTEM_OR_TOPIC_NAME}}

**Service**: {{SERVICE_NAME}}
**Owner**: {{TEAM_NAME}}
**Last Updated**: {{DATE}}
**Audience**: {{Engineers | Support | End Users | All}}

---

## ## Overview

Answers to the most common questions about {{SYSTEM_OR_TOPIC_NAME}}.

**Can't find your answer?** Ask in {{SLACK_CHANNEL}} or open a ticket at {{TICKET_LINK}}.

---

## ## General

### What is {{SYSTEM_NAME}}?

{{Clear, one-paragraph description of what the system does and why it exists.}}

### Who owns {{SYSTEM_NAME}}?

{{TEAM_NAME}} owns and maintains this system. For questions, reach out in {{SLACK_CHANNEL}}.

### Where is the documentation?

- **Runbook**: [{{RUNBOOK_LINK}}](./runbook.md)
- **Architecture**: [{{ARCH_LINK}}]({{ARCH_LINK}})
- **API Docs**: [{{API_DOCS_LINK}}]({{API_DOCS_LINK}})
- **Dashboard**: [{{DASHBOARD_LINK}}]({{DASHBOARD_LINK}})

---

## ## Access & Permissions

### How do I get access to {{SYSTEM_NAME}}?

1. Submit an access request via {{ACCESS_REQUEST_LINK}}
2. Get approval from your manager and {{SYSTEM_OWNER}}
3. Access is provisioned within {{X}} business days

**Required role**: {{ROLE_NAME}}
**Approval chain**: Manager → {{SYSTEM_OWNER}}

### Why am I getting a permission denied error?

Common causes:

- Your role doesn't include {{REQUIRED_PERMISSION}}
- Your session has expired — try re-authenticating: `{{AUTH_COMMAND}}`
- You're accessing the wrong environment (prod vs staging)

If the issue persists, contact {{SUPPORT_CHANNEL}}.

### How do I rotate my credentials?

```bash
{{CREDENTIAL_ROTATION_COMMAND}}
```

Credentials expire every {{X}} days. You'll receive a reminder {{X}} days before expiry.

---

## ## Usage

### How do I {{COMMON_TASK_1}}?

```bash
{{COMMAND_FOR_TASK_1}}
```

See the full guide: [{{TASK_1_GUIDE_LINK}}]({{TASK_1_GUIDE_LINK}})

### How do I {{COMMON_TASK_2}}?

{{Step-by-step answer or link to detailed guide.}}

1. {{Step 1}}
2. {{Step 2}}
3. Verify with: `{{VERIFY_COMMAND}}`

### What are the rate limits?

| Operation       | Limit          | Window     |
| --------------- | -------------- | ---------- |
| {{OPERATION_1}} | {{X}} requests | per minute |
| {{OPERATION_2}} | {{X}} requests | per hour   |
| {{OPERATION_3}} | {{X}} GB       | per day    |

To request a limit increase, open a ticket at {{TICKET_LINK}}.

---

## ## Errors & Issues

### I'm seeing error: "{{COMMON_ERROR_MESSAGE}}"

**Cause**: {{Why this error occurs}}

**Fix**:

```bash
{{FIX_COMMAND}}
```

If this doesn't resolve it, see the [Troubleshooting Guide](./troubleshooting_guide.md).

### The system is slow / timing out

1. Check the [status page]({{STATUS_PAGE_LINK}}) for active incidents
2. Check your request size — limit is {{X}}
3. Try during off-peak hours ({{OFF_PEAK_HOURS}})
4. If persistent, report in {{SLACK_CHANNEL}}

### How do I report a bug?

1. Check [known issues]({{KNOWN_ISSUES_LINK}}) first
2. File a bug report: {{BUG_REPORT_LINK}}
3. Include: steps to reproduce, expected vs actual behavior, logs

---

## ## Escalation

| Issue Type      | Contact          | Channel                     |
| --------------- | ---------------- | --------------------------- |
| Outage / P1     | On-call engineer | Page via {{PAGERDUTY_LINK}} |
| Bug / degraded  | {{TEAM_NAME}}    | {{SLACK_CHANNEL}}           |
| Access request  | {{IT_TEAM}}      | {{IT_CHANNEL}}              |
| Feature request | Product team     | {{PRODUCT_CHANNEL}}         |

**SLA**: P1 — 15 min response | P2 — 2 hours | P3 — next business day
