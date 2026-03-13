# Alert Runbook: {{ALERT_NAME}}

**Alert**: {{ALERT_NAME}}
**Service**: {{SERVICE_NAME}}
**Owner**: {{TEAM_NAME}}
**Severity**: {{P1 | P2 | P3 | P4}}
**Last Updated**: {{DATE}}

---

## ## Alert Summary

**What this alert means**: {{Plain-language description of what condition triggered this alert}}

**Why it matters**: {{Business or user impact when this fires}}

**False positive rate**: {{Low | Medium | High}} — {{Brief note on known false positive conditions}}

---

## ## Alert Details

| Field     | Value                                    |
| --------- | ---------------------------------------- |
| Metric    | `{{METRIC_NAME}}`                        |
| Threshold | {{CONDITION}} (e.g., > 5% for 5 min)     |
| Query     | `{{ALERT_QUERY}}`                        |
| Dashboard | [{{DASHBOARD_NAME}}]({{DASHBOARD_LINK}}) |
| Runbook   | This document                            |

---

## ## Immediate Triage (First 2 Minutes)

1. Open the dashboard: {{DASHBOARD_LINK}}
2. Check alert context:

```bash
# Current metric value
{{METRIC_QUERY_COMMAND}}

# Recent trend (last 1 hour)
{{TREND_QUERY_COMMAND}}
```

3. Determine: Is this a real issue or a false positive?

**False positive indicators**:

- {{FALSE_POSITIVE_CONDITION_1}} (e.g., scheduled maintenance window)
- {{FALSE_POSITIVE_CONDITION_2}} (e.g., known spike during batch job)

If false positive → acknowledge alert, add note, no further action needed.

---

## ## Diagnosis

### Step 1: Check Service Health

```bash
{{HEALTH_CHECK_COMMAND}}
# Healthy: {{EXPECTED_OUTPUT}}
# Unhealthy: {{FAILURE_INDICATOR}}
```

### Step 2: Identify Scope

```bash
# Is this affecting all instances or a subset?
{{SCOPE_CHECK_COMMAND}}

# Which region / AZ / shard?
{{REGION_CHECK_COMMAND}}
```

### Step 3: Find Root Cause

```bash
# Check error logs
{{ERROR_LOG_COMMAND}}

# Check recent deployments
{{DEPLOYMENT_LOG_COMMAND}}

# Check upstream dependencies
{{UPSTREAM_CHECK_COMMAND}}
```

**Common root causes**:

| Cause       | Frequency | Indicator                 |
| ----------- | --------- | ------------------------- |
| {{CAUSE_1}} | {{X}}%    | {{LOG_PATTERN_OR_METRIC}} |
| {{CAUSE_2}} | {{X}}%    | {{LOG_PATTERN_OR_METRIC}} |
| {{CAUSE_3}} | {{X}}%    | {{LOG_PATTERN_OR_METRIC}} |

---

## ## Remediation

### For {{CAUSE_1}}

```bash
{{REMEDIATION_COMMAND_1}}
```

**Verification**: `{{VERIFY_COMMAND_1}}`
**Recovery time**: ~{{X}} minutes

### For {{CAUSE_2}}

```bash
{{REMEDIATION_COMMAND_2}}
```

**Verification**: `{{VERIFY_COMMAND_2}}`

### If cause is unknown

1. Preserve state: `{{SNAPSHOT_COMMAND}}`
2. Escalate immediately (see below)
3. Consider rollback: [Rollback Procedure](./rollback_procedure.md)

---

## ## Recovery Verification

Alert should auto-resolve when metric returns to normal. Confirm:

- [ ] Alert status: resolved in {{ALERTING_TOOL}}
- [ ] Metric back below threshold for {{X}} consecutive minutes
- [ ] No related alerts still firing
- [ ] User-facing functionality confirmed working

```bash
# Final health check
{{FINAL_HEALTH_CHECK}}
```

---

## ## Escalation

| Condition                   | Escalate To            | Method | SLA       |
| --------------------------- | ---------------------- | ------ | --------- |
| No resolution in 15 min     | {{SENIOR_ENGINEER}}    | Page   | Immediate |
| Multiple services affected  | {{INCIDENT_COMMANDER}} | Bridge | Immediate |
| Data loss suspected         | {{VP_ENGINEERING}}     | Call   | Immediate |
| Recurring alert (3x in 24h) | {{TEAM_LEAD}}          | Slack  | 1 hour    |

**On-call rotation**: {{PAGERDUTY_LINK}}
**Incident channel**: {{SLACK_CHANNEL}}

---

## ## Alert Tuning

If this alert fires frequently as a false positive, consider:

- Adjusting threshold: current = {{THRESHOLD}}, suggested = {{SUGGESTED_THRESHOLD}}
- Adding exception for: {{KNOWN_EXCEPTION}}
- Contact {{OBSERVABILITY_TEAM}} to update alert config

**Alert config location**: {{ALERT_CONFIG_FILE_OR_LINK}}
