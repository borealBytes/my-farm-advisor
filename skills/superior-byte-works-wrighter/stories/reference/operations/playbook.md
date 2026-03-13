---
name: Incident Playbook
description: Structured incident response playbook with diagnosis scenarios, communications templates, and escalation paths
version: 1.0.0
author: Omni Unified Writing
---

# Incident Playbook: [Incident Type]

> [!NOTE]
> An incident playbook is a pre-written response guide for a known failure mode. It is not a runbook (which covers planned procedures). Use this template for recurring incident types — high error rate, database connection exhaustion, memory leak, third-party API outage, etc. The goal is to reduce mean time to resolution (MTTR) by eliminating diagnosis time.

**Service:** [Service name — e.g., checkout-service]  
**Owner:** [Team name — e.g., Web Platform Team]  
**Last Updated:** [YYYY-MM-DD]  
**Severity:** [P1 | P2 | P3]  
**SLA:** Acknowledge within [X] min | Resolve within [X] min

**Example:**

**Service:** checkout-service  
**Owner:** Web Platform Team  
**Last Updated:** 2025-03-15  
**Severity:** P1  
**SLA:** Acknowledge within 5 min | Resolve within 60 min

---

## 📋 Incident Summary

**What broke:** [Brief description of the failure mode]  
**User impact:** [Who is affected and how]  
**Detection:** [How this incident is typically detected — alert, customer report, etc.]

**Example:**

**What broke:** checkout-service payment processing error rate exceeds 5% — Stripe API calls are failing  
**User impact:** Customers cannot complete purchases. Checkout page shows "Payment failed — please try again." Revenue impact: ~$3,000/minute at peak traffic.  
**Detection:** PagerDuty alert `checkout.payment.error_rate > 5%` (fires after 2 consecutive minutes above threshold)

---

## 🚨 Immediate Response (First 5 Minutes)

> [!IMPORTANT]
> The first 5 minutes determine MTTR. Acknowledge, communicate, and assign roles before diagnosing. A team without an Incident Commander wastes time on coordination instead of resolution.

- [ ] Acknowledge the alert in PagerDuty (stops escalation timer)
- [ ] Join incident bridge: `#incident-bridge` (Slack) or [Zoom bridge](https://company.zoom.us/j/incident)
- [ ] Post in `#incidents`: "Investigating checkout payment errors — IC: @[YOUR_NAME]"
- [ ] Assign roles:
  - **Incident Commander (IC):** [Name] — owns the incident, makes decisions
  - **Communications Lead:** [Name] — updates status page and stakeholders
  - **Technical Lead:** [Name] — drives diagnosis and mitigation

**Example post:**

```
[14:32 UTC] Investigating: checkout-service payment error rate at 8.3% (threshold: 5%)
IC: @alice | Tech: @tom | Comms: @priya
Status: INVESTIGATING
Next update: 14:47 UTC
```

---

## 🔍 Diagnosis

### Check 1: Service Health

```bash
# Check pod status
kubectl get pods -n checkout -l app=checkout-service
# Healthy: all pods Running, 0 restarts
# Unhealthy: CrashLoopBackOff, high restart count, or pods Pending

# Check recent error logs
kubectl logs -n checkout -l app=checkout-service --since=10m | grep -i "error\|stripe\|timeout" | tail -50

# Check error rate in Datadog
# Dashboard: https://app.datadoghq.com/dashboard/checkout-service
# Metric: checkout.payment.error_rate — look for spike onset time
```

### Check 2: Recent Changes

```bash
# Review recent deployments (last 2 hours)
kubectl rollout history deployment/checkout-service -n checkout

# Check if a deployment coincides with the error spike
# If yes → likely a bad deploy → go to Scenario A

# Review config changes
kubectl get configmap checkout-config -n checkout -o yaml | grep -A5 "stripe"
# Look for any recent changes to Stripe API endpoint or timeout settings
```

### Check 3: Stripe API Status

```bash
# Check Stripe's status page
curl -s https://status.stripe.com/api/v2/status.json | jq '.status.description'
# "All Systems Operational" → Stripe is fine → look elsewhere
# "Degraded Performance" or "Partial Outage" → go to Scenario B

# Check Stripe API latency from our service
kubectl logs -n checkout -l app=checkout-service --since=10m | grep "stripe_latency" | tail -20
# Normal: < 500ms
# Elevated: > 2000ms → Stripe degradation or our timeout is too low
```

### Check 4: Database Connection Pool

```bash
# Check PostgreSQL connection pool exhaustion
kubectl exec -n checkout deployment/checkout-service -- \
  psql $DATABASE_URL -c "SELECT count(*), state FROM pg_stat_activity GROUP BY state;"
# Normal: < 80 active connections
# Exhausted: "remaining connection slots are reserved" error in logs

# Check Redis (session store)
kubectl exec -n checkout deployment/checkout-service -- \
  redis-cli -u $REDIS_URL ping
# Expected: PONG
```

**Decision point:** Based on findings, proceed to the matching scenario below.

---

## 🛠️ Response Scenarios

### Scenario A: Bad Deployment (Error spike coincides with deploy)

**Symptoms:**

- Error spike starts immediately after a deployment
- `kubectl rollout history` shows a recent rollout
- Errors are consistent (not intermittent)

```bash
# Rollback to previous version
kubectl rollout undo deployment/checkout-service -n checkout

# Watch rollback progress
kubectl rollout status deployment/checkout-service -n checkout --timeout=5m
```

**Verification:**

```bash
# Check error rate drops
watch -n 10 'kubectl logs -n checkout -l app=checkout-service --since=1m | grep -c "stripe error"'
# Expected: count drops to 0 within 2 minutes of rollback completing
```

**ETA to resolve:** ~5 minutes  
**Follow-up:** File a bug for the bad deploy; do not re-deploy until root cause is identified.

---

### Scenario B: Stripe API Degradation

**Symptoms:**

- Stripe status page shows degraded performance or partial outage
- Stripe API latency > 2000ms in logs
- Errors are intermittent (not 100% failure rate)

```bash
# Increase Stripe API timeout to 10s (default: 5s) to reduce false failures
kubectl set env deployment/checkout-service -n checkout STRIPE_TIMEOUT_MS=10000

# Enable retry logic (if not already enabled)
kubectl set env deployment/checkout-service -n checkout STRIPE_MAX_RETRIES=3

# Watch error rate
kubectl logs -n checkout -l app=checkout-service --since=2m | grep -c "stripe error"
```

**Verification:** `curl https://status.stripe.com/api/v2/status.json | jq '.status.description'`  
**ETA to resolve:** Depends on Stripe — monitor their status page. Typically resolves in 15–60 minutes.  
**Follow-up:** Revert timeout/retry changes after Stripe recovers. File a ticket to make retry logic permanent.

---

### Scenario C: Database Connection Pool Exhaustion

**Symptoms:**

- Logs show "remaining connection slots are reserved" or "connection pool timeout"
- `pg_stat_activity` shows > 80 active connections
- Errors affect all endpoints, not just payment

```bash
# Identify long-running queries holding connections
kubectl exec -n checkout deployment/checkout-service -- \
  psql $DATABASE_URL -c "SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC LIMIT 10;"

# Kill long-running queries (> 30 seconds)
kubectl exec -n checkout deployment/checkout-service -- \
  psql $DATABASE_URL -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE now() - pg_stat_activity.query_start > interval '30 seconds' AND state != 'idle';"

# Restart the service to reset connection pool
kubectl rollout restart deployment/checkout-service -n checkout
```

**Verification:** `pg_stat_activity` count drops below 80; error rate returns to baseline.  
**ETA to resolve:** ~5 minutes  
**Follow-up:** Investigate what caused connection pool exhaustion — likely a slow query or missing index.

---

### Scenario D: Unknown Root Cause

1. Preserve state for post-mortem:
   ```bash
   kubectl logs -n checkout -l app=checkout-service --since=30m > /tmp/checkout-incident-$(date +%Y%m%d-%H%M).log
   kubectl describe pods -n checkout -l app=checkout-service >> /tmp/checkout-incident-$(date +%Y%m%d-%H%M).log
   ```
2. Escalate to Alice Chen (Tech Lead) — page via PagerDuty
3. Consider failover: enable maintenance mode on checkout page to stop user-facing errors while diagnosing
   ```bash
   kubectl set env deployment/checkout-service -n checkout MAINTENANCE_MODE=true
   ```
4. Do not restore service until root cause is identified

---

## 📢 Communications

> [!TIP]
> Communicate early and often. Stakeholders who don't hear from you will assume the worst. A brief "still investigating" update is better than silence.

### Internal Update Template (every 30 min)

```
[HH:MM UTC] Status: INVESTIGATING | IDENTIFIED | MITIGATING | RESOLVED
Impact: [X]% of checkout payments failing | [X] customers affected
Root cause: [Known / Under investigation]
Next update: [HH:MM UTC]
IC: @[NAME]
```

### External Status Page Update

**During incident:**

```
We are investigating reports of payment failures during checkout.
Our team is actively working on a resolution.
Affected: Customers attempting to complete purchases.
Next update: [TIME].
```

**On resolution:**

```
This incident has been resolved. Payment processing is operating normally.
We apologize for the disruption. A post-mortem will be published within 5 business days.
Duration: [START TIME] – [END TIME] ([X] minutes)
```

---

## ✅ Resolution

- [ ] Confirm error rate < 0.1% for 10 consecutive minutes
- [ ] Confirm payment success rate returned to baseline (> 99.5%)
- [ ] Post resolution in `#incidents`: "[TIME UTC] RESOLVED — checkout payment errors. Duration: [X] min. Root cause: [brief]."
- [ ] Update status page: "Resolved"
- [ ] Notify Customer Success if any customers reported issues directly
- [ ] Schedule post-mortem within 48 hours (required for P1/P2)

---

## 📞 Escalation

| Trigger                  | Escalate To            | Method           |
| ------------------------ | ---------------------- | ---------------- |
| No progress after 30 min | Alice Chen (Tech Lead) | Page (PagerDuty) |
| Data loss confirmed      | David Park (VP Eng)    | Call             |
| Customer SLA breach      | Priya Nair (PM)        | Slack + Call     |
| Regulatory impact        | Legal Team             | Email + Call     |
| Stripe account suspended | Marcus Webb (Security) | Call             |

---

## 📄 Post-Mortem

**Template:** [Post-Mortem Doc](../software/post_mortem.md)  
**Owner:** Incident Commander  
**Due:** Within 5 business days of resolution

> [!IMPORTANT]
> Post-mortems are blameless. The goal is to understand what happened and prevent recurrence — not to assign fault. Every P1 and P2 incident requires a post-mortem. P3 incidents require one if the same issue has occurred more than twice.

---

## 🔗 References

- [Checkout Service Architecture](https://wiki.company.com/checkout-architecture)
- [Stripe API Status](https://status.stripe.com)
- [Datadog Dashboard — Checkout Service](https://app.datadoghq.com/dashboard/checkout-service)
- [PagerDuty — Web Platform On-Call](https://company.pagerduty.com/schedules/web-platform)

---

## See Also

- [Runbook](./runbook.md) — For operational procedures and routine maintenance
- [Incident Report](./../software/incident_report.md) — For documenting incident details and timeline
- [Post-Mortem](./../software/post_mortem.md) — For comprehensive incident analysis and follow-up
- [Troubleshooting Guide](./troubleshooting_guide.md) — For diagnostic and debugging procedures
- [Monitoring Alert](./monitoring_alert.md) — For alert configuration and response

---

_Template: playbook.md | Updated: 2025-03-15_
