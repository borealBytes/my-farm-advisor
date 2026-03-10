# Incident Response Plan

---

## Document Control

| Field | Value |
| ------------------- | ----------------------------------------------------- |
| **Plan Version** | [X.X] |
| **Effective Date** | [DD-MMM-YYYY] |
| **Owner** | [CISO/Security Manager] |
| **Review Cycle** | [Annual] |

---

## Purpose

This plan defines procedures for responding to security incidents.

---

## Incident Classification

| Severity | Description | Examples | Response Time |
|----------|-------------|----------|---------------|
| Critical | Active breach, data loss | Ransomware, active exploitation | 15 min |
| High | Confirmed compromise | Unauthorized access, malware | 1 hour |
| Medium | Suspicious activity | Failed login spikes, phishing | 4 hours |
| Low | Policy violation | Policy breach, minor incident | 24 hours |

---

## Incident Response Team

| Role | Name | Contact | Responsibility |
|------|------|---------|----------------|
| Incident Commander | [Name] | [Phone] | Overall coordination |
| Security Lead | [Name] | [Phone] | Technical response |
| Communications | [Name] | [Phone] | External communications |
| Legal | [Name] | [Phone] | Legal guidance |
| HR | [Name] | [Phone] | Personnel issues |

---

## Response Phases

### Phase 1: Detection & Analysis (0-1 hour)

| Action | Owner | Complete |
|--------|-------|----------|
| Incident reported | Reporter | [ ] |
| Initial triage | Security | [ ] |
| Severity assigned | Incident Commander | [ ] |
| Team activated | Incident Commander | [ ] |
| Log preservation | Security | [ ] |

### Phase 2: Containment (1-4 hours)

| Action | Owner | Complete |
|--------|-------|----------|
| Isolate affected systems | Security | [ ] |
| Block malicious IPs | Security | [ ] |
| Disable compromised accounts | IT | [ ] |
| Backup evidence | Security | [ ] |
| Document timeline | Security | [ ] |

### Phase 3: Eradication (4-24 hours)

| Action | Owner | Complete |
|--------|-------|----------|
| Remove malware | Security | [ ] |
| Patch vulnerabilities | Security | [ ] |
| Change credentials | IT | [ ] |
| Verify clean systems | Security | [ ] |

### Phase 4: Recovery (24-72 hours)

| Action | Owner | Complete |
|--------|-------|----------|
| Restore systems | IT | [ ] |
| Monitor for recurrence | Security | [ ] |
| Verify normal operations | IT | [ ] |

### Phase 5: Post-Incident (72+ hours)

| Action | Owner | Complete |
|--------|-------|----------|
| Root cause analysis | Security | [ ] |
| Lessons learned | Incident Commander | [ ] |
| Update procedures | Security | [ ] |
| Report to management | Incident Commander | [ ] |

---

## Communication Plan

| Stakeholder | When | Method | Message |
|-------------|------|--------|---------|
| Internal team | Immediately | Call/Slack | Alert |
| Executive team | Within 1 hour | Email/Call | Status |
| Customers | If data involved | Email | Notification |
| Regulators | Per requirements | Formal notice | Breach notification |
| Media | If public impact | Statement | PR response |

---

## Escalation

| Condition | Escalate To |
|-----------|-------------|
| Multiple systems affected | Executive team |
| Customer data involved | Legal + Executive |
| Public safety risk | CEO + Board |
| Media inquiry | CEO + PR |

---

## Evidence Preservation

- Preserve logs for [X] days
- Chain of custody documentation
- Forensic images where needed
- Legal hold if applicable

---

## Testing

| Test Type | Frequency | Last Test | Next Test |
|-----------|-----------|-----------|-----------|
| Tabletop | Quarterly | [Date] | [Date] |
| Live drill | Annually | [Date] | [Date] |
| Review | Annually | [Date] | [Date] |

---

**Approved:** _________________ Date: _________
