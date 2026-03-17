# Troubleshooting Guide: {{SYSTEM_OR_FEATURE_NAME}}

**Service**: {{SERVICE_NAME}}
**Owner**: {{TEAM_NAME}}
**Last Updated**: {{DATE}}
**Audience**: {{Engineers | Support | All}}

---

## ## Overview

This guide covers common problems with {{SYSTEM_OR_FEATURE_NAME}} and their resolutions. Use the symptom index to jump to the relevant section.

**Support channel**: {{SLACK_CHANNEL}}
**Escalation**: {{ESCALATION_PATH}}

---

## ## Symptom Index

| Symptom           | Section                             |
| ----------------- | ----------------------------------- |
| {{SYMPTOM_1}}     | [→ Problem 1](#problem-1-symptom_1) |
| {{SYMPTOM_2}}     | [→ Problem 2](#problem-2-symptom_2) |
| {{SYMPTOM_3}}     | [→ Problem 3](#problem-3-symptom_3) |
| {{SYMPTOM_4}}     | [→ Problem 4](#problem-4-symptom_4) |
| None of the above | [→ Escalation](#escalation)         |

---

## ## Diagnostic Baseline

Run these before investigating any specific problem:

```bash
# System health
{{HEALTH_CHECK_COMMAND}}

# Recent errors
{{ERROR_LOG_COMMAND}}

# Resource utilization
{{RESOURCE_CHECK_COMMAND}}
```

Save this output — you'll need it for escalation if the issue persists.

---

## ## Problem 1: {{SYMPTOM_1}}

**Symptoms**:

- {{Specific observable behavior}}
- {{Error message or log pattern}}

**Likely causes**:

1. {{CAUSE_A}} — most common (~{{X}}% of cases)
2. {{CAUSE_B}}
3. {{CAUSE_C}}

### Resolution A: {{CAUSE_A}}

```bash
# Diagnose
{{DIAGNOSE_COMMAND}}

# Fix
{{FIX_COMMAND}}
```

**Verification**: `{{VERIFY_COMMAND}}`
**Expected result**: {{EXPECTED_OUTPUT}}

### Resolution B: {{CAUSE_B}}

```bash
{{FIX_COMMAND_B}}
```

**Verification**: {{How to confirm fix worked}}

> ℹ️ **Note**: {{Any caveats or side effects}}

---

## ## Problem 2: {{SYMPTOM_2}}

**Symptoms**:

- {{Specific observable behavior}}
- {{Error message or log pattern}}

**Likely causes**:

1. {{CAUSE_A}}
2. {{CAUSE_B}}

### Resolution

```bash
# Step 1: Identify root cause
{{DIAGNOSE_COMMAND}}

# Step 2: Apply fix
{{FIX_COMMAND}}

# Step 3: Verify
{{VERIFY_COMMAND}}
```

> ⚠️ **Warning**: {{Risk or caution}}

---

## ## Problem 3: {{SYMPTOM_3}}

**Symptoms**:

- {{Specific observable behavior}}

**Resolution**:

1. Check {{COMPONENT}}: `{{CHECK_COMMAND}}`
2. If {{CONDITION}}, run: `{{FIX_COMMAND}}`
3. Otherwise, check {{OTHER_COMPONENT}}: `{{OTHER_CHECK}}`

**Verification**: `{{VERIFY_COMMAND}}`

---

## ## Problem 4: {{SYMPTOM_4}}

**Symptoms**:

- {{Specific observable behavior}}

**Resolution**:

```bash
{{FIX_COMMAND}}
```

**Verification**: {{How to confirm fix worked}}

---

## ## Escalation

If none of the above resolved the issue:

1. Collect diagnostic output from the [Diagnostic Baseline](#diagnostic-baseline)
2. Note exact error messages and timestamps
3. Check if issue is in [Known Issues]({{KNOWN_ISSUES_LINK}})
4. Open a ticket: {{TICKET_SYSTEM_LINK}}

| Severity     | Contact             | Response Time     |
| ------------ | ------------------- | ----------------- |
| Service down | Page {{ONCALL}}     | 15 min            |
| Degraded     | Post in {{CHANNEL}} | 2 hours           |
| Non-urgent   | File ticket         | Next business day |

---

## ## Related Resources

- [Architecture Diagram]({{ARCH_LINK}})
- [Runbook: {{RELATED_RUNBOOK}}](./runbook.md)
- [Monitoring Dashboard]({{DASHBOARD_LINK}})
- [Log Query Examples]({{LOGS_LINK}})
