

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

## Task 8: Public report route

- Route path: `GET /single-page-html/grower/:growerId/farm/:farmId`
- Canonical R2 key pattern: `growers/{growerId}/farms/{farmId}/derived/reports/report.html`
- Slug validation regex: `/^[a-zA-Z0-9-]+$/` (alphanumeric + hyphen only, prevents traversal)
- Key response headers: `Content-Type: text/html; charset=utf-8`, `X-Content-Type-Options: nosniff`, `Cache-Control: public, max-age=300`

## Task 9: Fix public.test.ts Mock for c.req.param()

**Date:** 2026-03-10
**Issue:** Tests failed because mock didn't correctly handle `c.req.param()` (no args) when URL contained path traversal patterns like `..` or `/` in IDs.

### Root Cause
The original mock extracted params from `url.pathname`, but the `URL` constructor normalizes paths:
- `..` segments get resolved (e.g., `/grower/../etc` becomes `/etc`)
- `/` in IDs would break the route matching entirely

### Solution
1. **Extract from raw URL string**: Use regex on `options.url` before normalization:
   ```typescript
   const rawPathMatch = options.url.match(/\/grower\/([^/]+)\/farm\/([^/?#]+)/);
   ```

2. **URL-decode extracted values**: Handle encoded characters like `%2F`:
   ```typescript
   params.growerId = decodeURIComponent(rawPathMatch[1]);
   params.farmId = decodeURIComponent(rawPathMatch[2]);
   ```

3. **Fix test URLs with slashes**: IDs containing `/` must be URL-encoded as `%2F` so the mock can extract them and the handler can validate:
   ```typescript
   // Before (broken): /grower/iowa/demo/farm/...
   // After (fixed):  /grower/iowa%2Fdemo/farm/...
   ```

### Key Insight
When testing path traversal protection, the mock must simulate what Hono's router would actually extract. Hono extracts path segments between `/` delimiters, so a raw `/` in an ID would never reach the handler - it would 404 at the router level. The tests need encoded slashes to properly test the handler's validation logic.

### Files Modified
- `src/routes/public.test.ts`: Updated `createMockContext` function and two test URLs


---

## Task 11: Post-Merge Deployment Runbook - Learnings

**Date:** 2026-03-10
**Purpose:** Create operator-ready deployment runbook for tonight's merge

### Key Patterns

#### 1. Deterministic Pass/Fail Structure
Runbook uses explicit pass/fail branches at every step:
- **Pass:** Clear success criteria with expected output
- **Fail:** Immediate rollback trigger with exact next action

This prevents operator confusion during high-stress deployments.

#### 2. Status Code Interpretation
Documented all expected status codes with context:
- 200/302/401 = Success (depending on route)
- 302/401 on admin = Correctly protected
- 500/502/503/522/523 = Critical failure, rollback

#### 3. Rollback Triggers Table
Centralized decision matrix for when to rollback:
- Severity classification (Critical/High)
- Detection method (curl, dig, dashboard)
- Exact rollback action per condition

#### 4. Command Snippet Reusability
All commands use variables for easy substitution:
```bash
WORKER_URL="https://my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev"
curl -s -o /dev/null -w "%{http_code}\n" "$WORKER_URL/"
```

### Integration Points

| Task | Integration |
|------|-------------|
| T4 (Telegram) | Phase 6 references Telegram runbook |
| T5 (Domain) | Phase 4 references domain checklist |
| T6 (Deploy) | Phase 2 documents workflow trigger |
| T9 (Tests) | Notes baseline test failure is expected |

### Files Created
- `.sisyphus/evidence/task-11-post-merge-runbook.md` - Complete runbook

---

*Task 11 Complete: Post-merge deployment runbook created and learnings recorded*

## Task 9: Vitest Coverage for Public Report Route

### Completed: 2025-03-10

### Files Created/Modified
- `src/routes/public.test.ts` - New test file with comprehensive coverage

### Test Coverage Summary
Created 10 test cases covering the public report route `GET /single-page-html/grower/:growerId/farm/:farmId`:

1. **Happy Path (200)**: Valid IDs with existing R2 object returns HTML with security headers
   - Content-Type: text/html; charset=utf-8
   - X-Content-Type-Options: nosniff
   - Cache-Control: public, max-age=300

2. **Invalid ID Validation (400)**: 
   - Grower ID with dot (.) → 400
   - Grower ID with slash (/) → 400
   - Farm ID with dot (.) → 400
   - Farm ID with slash (/) → 400
   - Double dots (..) → 400
   - URL-encoded dot (%2E) → 400

3. **Missing Report (404)**: Valid IDs but R2 object doesn't exist → 404

4. **R2 Error (500)**: R2 bucket throws error → 500 with error message

5. **Valid Characters**: Alphanumeric + hyphens accepted → 200

### Key Technical Learnings

#### Hono Route Parameter Mocking
- Route handler calls `c.req.param()` (no args) to get all params as object
- Mock must support both `param()` → object and `param(name)` → single value
- Used regex extraction from URL to populate params object

#### URL Normalization Gotchas
- `new URL()` constructor normalizes paths (e.g., `..` gets resolved)
- For security testing path traversal, extract params from raw URL string before normalization
- Regex pattern: `/\/grower\/([^/]+)\/farm\/([^/?#]+)/`

#### R2 Object Mocking
- Mock R2 object needs `body` as ReadableStream with encoded content
- Headers are set manually on Response (R2 object doesn't auto-apply them)

### Test Execution
```bash
npx vitest run src/routes/public.test.ts
# Result: 10 tests passed (23ms)
```

### Pattern Established
Test structure follows existing patterns in `src/gateway/*.test.ts`:
- Mock environment with `createMockEnv()`
- Mock context with `createMockContext()`
- Extract route handler from `publicRoutes.routes`
- Assert on response status, headers, and body
