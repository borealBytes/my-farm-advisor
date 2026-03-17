# Rollback Procedure: {{SERVICE_NAME}}

**Service**: {{SERVICE_NAME}}
**Owner**: {{TEAM_NAME}}
**Last Updated**: {{DATE}}
**Estimated Duration**: {{X}}–{{Y}} minutes

> 🚨 **This is an emergency procedure.** Speed matters. Do not wait for approval — rollback first, communicate after.

---

## ## Decision Criteria

Initiate rollback immediately if ANY of the following are true:

- [ ] Error rate > {{X}}% for more than {{Y}} minutes
- [ ] p99 latency > {{X}}ms for more than {{Y}} minutes
- [ ] Critical user flow broken (checkout, login, {{KEY_FLOW}})
- [ ] Data corruption or loss detected
- [ ] Security vulnerability introduced

**Decision owner**: Deployer or on-call engineer. No approval required for P1.

---

## ## Pre-Rollback: Preserve State

Before rolling back, capture current state for post-mortem:

```bash
# Capture current logs
{{LOG_CAPTURE_COMMAND}}

# Capture metrics snapshot
{{METRICS_SNAPSHOT_COMMAND}}

# Note current version
{{VERSION_CHECK_COMMAND}}
```

**Notify**: Post in {{INCIDENT_CHANNEL}}: "Initiating rollback of {{SERVICE_NAME}} v{{VERSION}} — IC: @{{YOUR_NAME}}"

---

## ## Rollback Procedure

### Option A: Automated Rollback (Preferred)

```bash
# Trigger automated rollback to previous stable version
{{AUTOMATED_ROLLBACK_COMMAND}}
```

**Monitor**: Watch {{DASHBOARD_LINK}} during rollback.
**Duration**: ~{{X}} minutes

### Option B: Manual Version Rollback

```bash
# Step 1: Identify last stable version
{{LIST_VERSIONS_COMMAND}}
# Note the version tagged as stable: v{{PREVIOUS_VERSION}}

# Step 2: Deploy previous version
{{DEPLOY_COMMAND}} --version={{PREVIOUS_VERSION}}

# Step 3: Verify deployment started
{{DEPLOYMENT_STATUS_COMMAND}}
```

### Option C: Feature Flag Disable (for feature-flagged changes)

```bash
# Disable the feature flag immediately
{{FEATURE_FLAG_DISABLE_COMMAND}}
```

**Verification**: `{{FEATURE_FLAG_STATUS_COMMAND}}`

### Option D: Database Rollback (use with extreme caution)

> ⚠️ **WARNING**: Database rollbacks can cause data loss. Consult {{DBA_CONTACT}} before proceeding.

```bash
# Step 1: Stop writes to affected tables
{{STOP_WRITES_COMMAND}}

# Step 2: Run migration rollback
{{DB_ROLLBACK_COMMAND}}

# Step 3: Verify schema
{{SCHEMA_VERIFY_COMMAND}}
```

---

## ## Post-Rollback Verification

Run within 5 minutes of rollback completing:

```bash
# Health check
{{HEALTH_CHECK_COMMAND}}

# Smoke tests
{{SMOKE_TEST_COMMAND}}
```

### Metrics Recovery Checklist

- [ ] Error rate returned to baseline (< {{X}}%)
- [ ] Latency returned to baseline (< {{X}}ms p99)
- [ ] No new alerts firing
- [ ] Key user flows working
- [ ] Version confirmed: `{{VERSION_CHECK_COMMAND}}`

**Expected recovery time**: {{X}} minutes after rollback completes

---

## ## Post-Rollback Actions

- [ ] Update {{INCIDENT_CHANNEL}}: "Rollback complete — service restored"
- [ ] Update status page if applicable
- [ ] Unmute any muted alerts
- [ ] Notify {{STAKEHOLDERS}} of rollback
- [ ] File incident ticket: {{TICKET_LINK}}
- [ ] Schedule post-mortem within 24 hours

---

## ## Escalation

| Situation                        | Action                | Contact            |
| -------------------------------- | --------------------- | ------------------ |
| Automated rollback fails         | Try Option B manually | {{DEVOPS_CONTACT}} |
| Manual rollback fails            | Emergency bridge      | Page {{ONCALL}}    |
| DB rollback needed               | Stop — consult DBA    | {{DBA_CONTACT}}    |
| Rollback doesn't restore service | Escalate to lead      | {{TEAM_LEAD}}      |
| Data loss confirmed              | Executive escalation  | {{VP_ENGINEERING}} |

**Emergency bridge**: {{BRIDGE_LINK}}
**On-call**: {{PAGERDUTY_LINK}}

---

## ## Related

- [Deployment Checklist](./deployment_checklist.md)
- [Incident Playbook](./playbook.md)
- [Monitoring Dashboard]({{DASHBOARD_LINK}})
