---
name: Runbook
description: Step-by-step operational procedure for a specific service task, with verification, rollback, and escalation
version: 1.0.0
author: Omni Unified Writing
---

# Runbook: [Procedure Name]

> [!NOTE]
> A runbook is a step-by-step procedure for a specific, repeatable operational task. It is not an incident playbook (which covers diagnosis and response). Use this template for scheduled maintenance, scaling operations, certificate rotation, database migrations, and similar planned procedures.

**Service:** [Service name — e.g., checkout-service]  
**Owner:** [Team name — e.g., Web Platform Team]  
**Last Updated:** [YYYY-MM-DD]  
**Version:** [1.0]  
**Severity:** [P1 | P2 | P3 | P4 — severity if this procedure goes wrong]

**Example:**

**Service:** checkout-service  
**Owner:** Web Platform Team  
**Last Updated:** 2025-03-15  
**Version:** 1.2  
**Severity:** P2 — payment processing affected if procedure fails

---

## 📋 Overview

[Brief description of what this runbook covers and when to use it.]

**Example:** This runbook covers the procedure for rotating the Stripe API keys used by the checkout-service. Keys must be rotated every 90 days per PCI DSS requirements, or immediately if a key is suspected to be compromised.

**Trigger:** [What condition or event initiates this procedure]  
**Estimated Duration:** [X] minutes  
**Impact:** [Describe user/system impact during procedure]

**Example:**

**Trigger:** 90-day rotation schedule (automated reminder in PagerDuty) or security incident requiring immediate rotation  
**Estimated Duration:** 20 minutes  
**Impact:** Zero downtime if procedure is followed correctly. If the old key is revoked before the new key is deployed, checkout will fail for all users (P1 incident).

> [!WARNING]
> This procedure has a critical ordering requirement: **deploy the new key before revoking the old key**. Reversing this order causes a P1 outage. Do not skip Step 3 verification before proceeding to Step 4.

---

## ✅ Prerequisites

- [ ] Access to AWS Secrets Manager with `secrets-manager:PutSecretValue` permission
- [ ] Access to Stripe Dashboard with API key management permissions
- [ ] `aws` CLI installed and configured (`aws sts get-caller-identity` returns your identity)
- [ ] Notify `#web-platform` Slack channel before starting: "Starting Stripe key rotation — ETA 20 min"
- [ ] Confirm no active deployments in progress (`kubectl get deployments -n checkout`)
- [ ] Confirm error rate is baseline before starting (check Datadog dashboard)

> [!IMPORTANT]
> Do not start this procedure during peak traffic hours (09:00–21:00 UTC). Schedule for off-peak (21:00–06:00 UTC). If an emergency rotation is required during peak hours, page the on-call engineer and proceed with two people.

---

## 🔧 Procedure

### Step 1: Verify Current State

```bash
# Check service status
kubectl get pods -n checkout -l app=checkout-service

# Expected output:
# NAME                                READY   STATUS    RESTARTS   AGE
# checkout-service-7d9f8b6c4-abc12    1/1     Running   0          2d
# checkout-service-7d9f8b6c4-def34    1/1     Running   0          2d

# Check current error rate (should be < 0.1%)
curl -s "https://api.datadoghq.com/api/v1/query?query=avg:checkout.payment.error_rate{*}" \
  -H "DD-API-KEY: $DATADOG_API_KEY" | jq '.series[0].pointlist[-1][1]'
```

**Verification:** Confirm all pods are `Running` and error rate is < 0.1% before proceeding.

---

### Step 2: Generate New Stripe API Key

```bash
# Log into Stripe Dashboard and generate a new restricted key
# Navigate to: Developers → API keys → Create restricted key
# Permissions required: Charges (write), PaymentIntents (write), Customers (write)
# Name the key: checkout-service-YYYY-MM-DD

# Copy the new key — it will only be shown once
# Store it temporarily in a local variable (do NOT log it)
NEW_STRIPE_KEY="sk_live_..."  # paste from Stripe Dashboard
```

> [!WARNING]
> The new key is shown only once in the Stripe Dashboard. If you close the page before storing it, you must generate a new key. Do not paste the key into Slack, email, or any logging system.

**Verification:** Confirm the new key appears in Stripe Dashboard under "Restricted keys" with status "Active."

---

### Step 3: Deploy New Key to AWS Secrets Manager

```bash
# Update the secret in AWS Secrets Manager
aws secretsmanager put-secret-value \
  --secret-id "checkout-service/stripe-api-key" \
  --secret-string "{\"key\": \"$NEW_STRIPE_KEY\"}" \
  --region us-east-1

# Verify the secret was updated
aws secretsmanager describe-secret \
  --secret-id "checkout-service/stripe-api-key" \
  --region us-east-1 | jq '.LastChangedDate'
# Expected: today's date
```

**Verification:** Confirm `LastChangedDate` is today's date.

---

### Step 4: Trigger Rolling Restart to Pick Up New Key

```bash
# Trigger a rolling restart — pods will pick up the new secret on startup
kubectl rollout restart deployment/checkout-service -n checkout

# Watch the rollout progress
kubectl rollout status deployment/checkout-service -n checkout --timeout=5m
# Expected: "deployment "checkout-service" successfully rolled out"
```

**Verification:**

```bash
# Confirm all pods are running with the new key
kubectl get pods -n checkout -l app=checkout-service
# All pods should show AGE < 5 minutes

# Run a test payment (use Stripe test mode key for this check)
curl -X POST https://api.checkout-service.internal/health/stripe \
  -H "Authorization: Bearer $INTERNAL_TOKEN"
# Expected: {"status": "ok", "stripe": "connected"}
```

---

### Step 5: Revoke Old Stripe API Key

> [!IMPORTANT]
> Only revoke the old key **after** confirming the new key is working in Step 4. Revoking before confirming causes a P1 outage.

```bash
# In Stripe Dashboard: Developers → API keys → find the old key → Roll key → Revoke
# The old key name will be the previous date: checkout-service-YYYY-MM-DD (old date)
```

**Verification:** Confirm the old key shows "Revoked" status in Stripe Dashboard.

---

### Step 6: Post-Procedure Validation

```bash
# Run health check
curl https://api.checkout-service.internal/health
# Expected: {"status": "healthy", "version": "..."}

# Verify error rate is still baseline
curl -s "https://api.datadoghq.com/api/v1/query?query=avg:checkout.payment.error_rate{*}" \
  -H "DD-API-KEY: $DATADOG_API_KEY" | jq '.series[0].pointlist[-1][1]'
# Expected: < 0.1%

# Check for any Stripe webhook failures
kubectl logs -n checkout -l app=checkout-service --since=5m | grep -i "stripe error"
# Expected: no output
```

- [ ] Service responding normally
- [ ] Error rate within acceptable threshold (< 0.1%)
- [ ] Latency within SLA (< 500ms p99)
- [ ] No Stripe-related errors in logs
- [ ] No alerts firing in PagerDuty

Post in `#web-platform`: "Stripe key rotation complete. New key active, old key revoked. Error rate: [X]%."

---

## 🔄 Rollback

If the procedure fails or causes unexpected issues:

1. Stop current procedure immediately
2. If new key is deployed but not working: re-deploy the old key from the previous secret version:
   ```bash
   aws secretsmanager get-secret-value \
     --secret-id "checkout-service/stripe-api-key" \
     --version-stage AWSPREVIOUS \
     --region us-east-1 | jq '.SecretString'
   # Copy the old key value, then put-secret-value with it
   ```
3. Trigger rolling restart: `kubectl rollout restart deployment/checkout-service -n checkout`
4. Verify service recovers: `kubectl rollout status deployment/checkout-service -n checkout`
5. Escalate to Alice Chen (Tech Lead) if rollback fails

> [!WARNING]
> If the old key was already revoked in Stripe before the rollback, you cannot restore it. In this case, generate a new key in Stripe and deploy it immediately. Page the on-call engineer.

---

## 📞 Escalation

| Condition                  | Action              | Contact                               |
| -------------------------- | ------------------- | ------------------------------------- |
| Step fails after 2 retries | Page on-call        | PagerDuty: web-platform-oncall        |
| Rollback fails             | Escalate to lead    | Alice Chen — alice@company.com        |
| Data loss suspected        | Incident bridge     | #incident-bridge (Slack)              |
| SLA breach imminent        | Notify stakeholders | Priya Nair (PM), David Park (Sponsor) |

**On-call:** [PagerDuty — Web Platform](https://company.pagerduty.com/schedules/web-platform)  
**Incident channel:** `#incidents` (Slack)

---

## 📝 Notes

- Stripe restricted keys are preferred over full API keys — they limit blast radius if compromised
- The `checkout-service/stripe-api-key` secret has versioning enabled — previous 3 versions are retained
- If rotating due to a suspected compromise, also rotate the Stripe webhook signing secret (separate runbook: `rotate-stripe-webhook-secret.md`)
- PCI DSS requires key rotation every 90 days — the rotation schedule is tracked in the security calendar

**Related Runbooks:**

- [Rotate Stripe Webhook Secret](./rotate-stripe-webhook-secret.md)
- [Checkout Service Rollback](./rollback_procedure.md)
- [Incident Playbook — High Error Rate](./playbook.md)

---

## 🔗 References

- [Stripe API Key Management](https://stripe.com/docs/keys)
- [AWS Secrets Manager — Rotating Secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html)
- [PCI DSS Requirement 8.6 — Key Management](https://www.pcisecuritystandards.org/)

---

## See Also

- [Incident Playbook](./playbook.md) — For incident response procedures and escalation
- [Incident Report](./../software/incident_report.md) — For documenting production incidents
- [Post-Mortem](./../software/post_mortem.md) — For analyzing incidents after resolution
- [Troubleshooting Guide](./troubleshooting_guide.md) — For diagnostic procedures and debugging
- [Rollback Procedure](./rollback_procedure.md) — For reverting failed deployments

---

_Template: runbook.md | Updated: 2025-03-15_
