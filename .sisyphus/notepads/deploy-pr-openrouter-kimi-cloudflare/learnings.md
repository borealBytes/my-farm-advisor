

---

## Task 5: Custom Domain Rollout Checklist - Learnings

**Date:** 2026-03-10  
**Domain:** `my-farm-advisor.superiorbyteworks.com`  
**Worker:** `my-farm-advisor-sandbox`

### Summary
Created comprehensive domain rollout checklist at `.sisyphus/evidence/task-5-domain-checklist.md` covering Cloudflare dashboard steps, DNS verification, SSL certificate checks, smoke tests, rollback procedures, and troubleshooting.

### Key Patterns Discovered

#### 1. Worker Name Convention
From `wrangler.jsonc`:
```json
"name": "my-farm-advisor-sandbox"
```

This is the internal worker name used for:
- Custom domain attachment
- Wrangler CLI commands
- Workers.dev URL: `my-farm-advisor-sandbox.{account}.workers.dev`

#### 2. Domain Attachment Process
Cloudflare Workers custom domain attachment is a **two-phase process**:

**Phase 1: Dashboard Attachment**
- Workers & Pages > Worker > Settings > Domains & Routes
- Add Custom Domain button
- Automatic DNS record creation

**Phase 2: Certificate Provisioning**
- Cloudflare automatically provisions SSL certificate
- Status transitions: "Certificate Pending" → "Active"
- Typical time: 1-5 minutes

#### 3. DNS Record Types
Cloudflare may create either:
- **CNAME record**: Points to workers.dev subdomain
- **A/AAAA records**: Points to Cloudflare edge IPs

Both are valid; CNAME is more common for Workers.

#### 4. SSL/TLS States
| Status | Duration | Action |
|--------|----------|--------|
| Active | - | Domain ready for traffic |
| Certificate Pending | 1-30 min | Wait for auto-provisioning |
| Error | - | Remove and re-add domain |

#### 5. Smoke Test Sequence
Proper verification order:
1. DNS resolution (`dig`)
2. Certificate validation (`openssl s_client`)
3. HTTP status (`curl -I`)
4. Response body (`curl`)
5. Admin protection (verify 302/401, not 200)
6. Workers.dev fallback (ensure still works)

### Security Requirements

#### Admin Route Protection
Custom domains inherit the same Access policies as workers.dev:
- `/_admin/*` requires Cloudflare Access authentication
- `/api/*` requires Cloudflare Access authentication
- `/debug/*` requires Cloudflare Access + DEBUG_ROUTES=true

**Verification:**
```bash
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/_admin/
# Expected: 302 (redirect to login) or 401
```

#### Public Report Endpoint (Future)
When Task 8 is complete, the public report endpoint will be:
```
https://my-farm-advisor.superiorbyteworks.com/single-page-html/grower/:growerId/farm/:farmId
```

This endpoint is intentionally **open** (no auth) but constrained to canonical paths only.

### Rollback Triggers

Explicit conditions requiring rollback:

| Condition | Detection | Severity |
|-----------|-----------|----------|
| HTTP 5xx errors | `curl` returns >= 500 | Critical |
| Certificate pending > 30 min | Dashboard status | High |
| DNS resolution failure | `dig` returns NXDOMAIN | Critical |
| SSL validation failure | `openssl` error | Critical |
| Admin routes unprotected | `curl` returns 200 | Critical |

### Troubleshooting Patterns

#### Certificate Pending
**Cause:** DNS not propagated, conflicting records, or zone not active  
**Fix:**
1. Verify DNS zone is active in Cloudflare
2. Check for conflicting CNAME records
3. Remove and re-add custom domain
4. Wait up to 24 hours (rare)

#### DNS Not Propagating
**Cause:** TTL caching, wrong nameservers, conflicting records  
**Fix:**
1. Verify Cloudflare nameservers: `dig NS superiorbyteworks.com`
2. Wait for TTL expiration (default 300s)
3. Flush local DNS cache

#### Route Conflicts
**Cause:** Page Rules, Access policies, or worker route conflicts  
**Fix:**
1. Check Cloudflare Access application includes new domain
2. Review Page Rules for conflicting redirects
3. Verify SSL/TLS encryption mode

### Command Reference

#### Essential Commands
```bash
# DNS resolution
dig my-farm-advisor.superiorbyteworks.com

# Certificate check
openssl s_client -connect my-farm-advisor.superiorbyteworks.com:443 -servername my-farm-advisor.superiorbyteworks.com </dev/null

# HTTP smoke test
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/

# List custom domains
npx wrangler domain list --name my-farm-advisor-sandbox

# Remove custom domain (rollback)
npx wrangler domain delete --name my-farm-advisor-sandbox --domain my-farm-advisor.superiorbyteworks.com
```

### Files Referenced

| File | Purpose | Key Finding |
|------|---------|-------------|
| `wrangler.jsonc` | Worker configuration | Worker name: `my-farm-advisor-sandbox` |
| `README.md` | Deployment docs | Custom domain section not yet present (to be added in T7) |

### Integration with Other Tasks

| Task | Dependency | Integration Point |
|------|------------|-------------------|
| T6 (Deploy Workflow) | Uses domain for smoke tests | Post-deploy curl checks |
| T7 (README Updates) | Documents this checklist | Domain setup section |
| T8 (Public Report Route) | Domain serves public reports | `/single-page-html/*` endpoint |
| T11 (Post-Merge Runbook) | References rollback steps | Rollback procedure |
| T12 (Staging Verification) | Executes smoke tests | Phase 4 commands |

### Next Steps

1. Execute this checklist after T6 (deploy workflow) is complete
2. Update T7 (README) to reference this checklist
3. Use in T12 (staging verification) for smoke test execution
4. Reference in T11 (post-merge runbook) for rollback procedures

---

*Task 5 Complete: Domain rollout checklist created and learnings recorded*
