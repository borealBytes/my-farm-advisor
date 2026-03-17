# Deployment Checklist: {{SERVICE_NAME}}

**Service**: {{SERVICE_NAME}}
**Version**: {{VERSION}}
**Release Date**: {{DATE}}
**Deployer**: {{YOUR_NAME}}
**Approver**: {{APPROVER_NAME}}

---

## ## Pre-Deployment (T-24h)

### Code Readiness

- [ ] All PRs merged to release branch
- [ ] Code review approved by ≥ {{X}} reviewers
- [ ] No open P1/P2 bugs in this release
- [ ] CHANGELOG updated with all changes
- [ ] Version bumped in `{{VERSION_FILE}}`

### Testing

- [ ] Unit tests passing: `{{UNIT_TEST_COMMAND}}`
- [ ] Integration tests passing: `{{INTEGRATION_TEST_COMMAND}}`
- [ ] E2E tests passing in staging: `{{E2E_TEST_COMMAND}}`
- [ ] Performance benchmarks within baseline (< {{X}}% regression)
- [ ] Security scan clean: `{{SECURITY_SCAN_COMMAND}}`

### Staging Validation

- [ ] Deployed to staging: `{{STAGING_DEPLOY_COMMAND}}`
- [ ] Smoke tests passed on staging
- [ ] QA sign-off obtained from {{QA_CONTACT}}
- [ ] Product sign-off obtained from {{PM_CONTACT}}

---

## ## Pre-Deployment (T-1h)

### Communication

- [ ] Deployment window confirmed with {{STAKEHOLDERS}}
- [ ] Maintenance window posted on status page (if applicable)
- [ ] Notify {{CUSTOMER_SUCCESS}} of any user-facing changes
- [ ] On-call engineer aware and available: {{ONCALL_NAME}}

### Infrastructure

- [ ] Database migrations reviewed and tested
- [ ] Feature flags configured correctly
- [ ] Rollback plan documented (see [Rollback Procedure](./rollback_procedure.md))
- [ ] Monitoring dashboards open: {{DASHBOARD_LINK}}
- [ ] Alerts muted for expected noise during deploy (max {{X}} min)

---

## ## Deployment

### Execute

```bash
# Tag release
git tag -a v{{VERSION}} -m "Release v{{VERSION}}"
git push origin v{{VERSION}}

# Deploy to production
{{DEPLOY_COMMAND}}
```

### Monitor During Deploy

- [ ] Deployment pipeline green: {{CI_CD_LINK}}
- [ ] No spike in error rate during rollout
- [ ] No spike in latency during rollout
- [ ] Health checks passing on new instances

**Deployment strategy**: {{Blue-Green | Canary | Rolling | All-at-once}}
**Rollout duration**: ~{{X}} minutes

---

## ## Post-Deployment Verification (T+15min)

### Smoke Tests

```bash
# Run post-deploy smoke tests
{{SMOKE_TEST_COMMAND}}
```

- [ ] All smoke tests passing
- [ ] Key user flows working (manual spot check)
- [ ] API endpoints responding: `{{API_HEALTH_CHECK}}`

### Metrics Baseline (compare to pre-deploy)

| Metric      | Pre-Deploy | Post-Deploy | Acceptable?         |
| ----------- | ---------- | ----------- | ------------------- |
| Error rate  | {{X}}%     | \_\_\_%     | < {{THRESHOLD}}%    |
| p99 latency | {{X}}ms    | \_\_\_ms    | < {{THRESHOLD}}ms   |
| Throughput  | {{X}} rps  | \_\_\_ rps  | > {{THRESHOLD}} rps |

- [ ] All metrics within acceptable thresholds
- [ ] No new alerts firing

---

## ## Post-Deployment (T+1h)

- [ ] Unmute any muted alerts
- [ ] Update status page: deployment complete
- [ ] Notify {{STAKEHOLDERS}}: deployment successful
- [ ] Close deployment ticket: {{TICKET_LINK}}
- [ ] Archive deployment notes in {{DEPLOYMENT_LOG}}

---

## ## Escalation

| Issue                      | Action            | Contact                                       |
| -------------------------- | ----------------- | --------------------------------------------- |
| Deploy pipeline fails      | Stop, investigate | {{DEVOPS_CONTACT}}                            |
| Error rate spikes > {{X}}% | Initiate rollback | [Rollback Procedure](./rollback_procedure.md) |
| Latency spikes > {{X}}ms   | Initiate rollback | [Rollback Procedure](./rollback_procedure.md) |
| Data corruption suspected  | Halt all traffic  | Page {{ONCALL}} immediately                   |

**Rollback decision owner**: {{DEPLOYER}} or {{ONCALL_ENGINEER}}
**Rollback authorization**: Not required for P1 — act immediately
