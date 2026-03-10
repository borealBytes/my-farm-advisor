# Task 5: Custom Domain Rollout Checklist

**Target Domain:** `my-farm-advisor.superiorbyteworks.com`  
**Worker Name:** `my-farm-advisor-sandbox` (from `wrangler.jsonc`)  
**Date:** 2026-03-10  
**Status:** Ready for Execution

---

## Pre-Flight Requirements

Before starting domain attachment, verify:

| Requirement | Verification Command | Expected Result |
|-------------|---------------------|-----------------|
| Worker deployed and healthy | `curl -s https://my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev/` | HTTP 200 or redirect |
| DNS zone exists in Cloudflare | Check Cloudflare Dashboard > Domain > `superiorbyteworks.com` | Zone active |
| Domain DNS is managed by Cloudflare | `dig NS superiorbyteworks.com` | Returns Cloudflare nameservers |

---

## Phase 1: Attach Custom Domain to Worker

### Step 1.1: Open Cloudflare Dashboard

1. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your account
3. Go to **Workers & Pages** in the left sidebar
4. Click on the worker: `my-farm-advisor-sandbox`

### Step 1.2: Add Custom Domain

1. In the worker detail page, click **Settings** tab
2. Under **Domains & Routes**, click **Add Custom Domain**
3. Enter the domain: `my-farm-advisor.superiorbyteworks.com`
4. Click **Add Custom Domain**

**Expected Result:** Domain appears in the list with status "Active" or "Certificate Pending"

### Step 1.3: Verify Domain Attachment

**Dashboard Verification:**
- Domain `my-farm-advisor.superiorbyteworks.com` appears in the Domains list
- Status shows either "Active" or "Certificate Pending"

**CLI Verification:**
```bash
# List custom domains for the worker
npx wrangler domain list --name my-farm-advisor-sandbox
```

**Expected Output:**
```
┌─────────────────────────────────────────────┬─────────┬──────────────────────────────┐
│ Domain                                      │ Status  │ Created                      │
├─────────────────────────────────────────────┼─────────┼──────────────────────────────┤
│ my-farm-advisor.superiorbyteworks.com       │ active  │ 2026-03-10TXX:XX:XX.XXXZ     │
└─────────────────────────────────────────────┴─────────┴──────────────────────────────┘
```

---

## Phase 2: DNS Verification

### Step 2.1: Verify DNS Record Created

Cloudflare automatically creates a DNS record when you add a custom domain.

**Dashboard Verification:**
1. Go to **DNS** > **Records** for zone `superiorbyteworks.com`
2. Look for record: `my-farm-advisor` (type: CNAME or A/AAAA)

**CLI Verification:**
```bash
# Query the specific subdomain
dig my-farm-advisor.superiorbyteworks.com

# Or using nslookup
nslookup my-farm-advisor.superiorbyteworks.com
```

**Expected Result:**
- Record type: CNAME pointing to `my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev`
- OR A/AAAA records pointing to Cloudflare edge IPs

**Example Output:**
```
;; ANSWER SECTION:
my-farm-advisor.superiorbyteworks.com. 300 IN CNAME my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev.
```

### Step 2.2: Verify Global Propagation

```bash
# Check from multiple locations using different DNS resolvers
# Cloudflare DNS
dig @1.1.1.1 my-farm-advisor.superiorbyteworks.com

# Google DNS
dig @8.8.8.8 my-farm-advisor.superiorbyteworks.com

# Quad9
dig @9.9.9.9 my-farm-advisor.superiorbyteworks.com
```

**Expected Result:** All resolvers return the same CNAME or IP addresses

---

## Phase 3: SSL/TLS Certificate Verification

### Step 3.1: Check Certificate Status

**Dashboard Verification:**
1. In the worker's **Settings** > **Domains & Routes**
2. Find `my-farm-advisor.superiorbyteworks.com`
3. Status should show "Active" (not "Certificate Pending")

**Certificate States:**
| Status | Meaning | Action Required |
|--------|---------|-----------------|
| Active | Certificate issued and valid | None - proceed to smoke tests |
| Certificate Pending | Certificate being provisioned | Wait 1-5 minutes, refresh |
| Error | Certificate issuance failed | Check DNS, retry attachment |

### Step 3.2: Verify SSL Certificate Chain

```bash
# Check certificate details
openssl s_client -connect my-farm-advisor.superiorbyteworks.com:443 -servername my-farm-advisor.superiorbyteworks.com </dev/null 2>/dev/null | openssl x509 -noout -text | grep -A2 "Subject:"
```

**Expected Result:**
```
Subject: CN = my-farm-advisor.superiorbyteworks.com
Issuer: C = US, O = Cloudflare, Inc.
```

### Step 3.3: Verify HTTPS Response

```bash
# Test HTTPS with certificate validation
curl -v --head https://my-farm-advisor.superiorbyteworks.com/ 2>&1 | grep -E "(HTTP|SSL|TLS|certificate)"
```

**Expected Result:**
```
* SSL connection using TLSv1.3
* Server certificate: my-farm-advisor.superiorbyteworks.com
HTTP/2 200
```

---

## Phase 4: Smoke Tests

### Step 4.1: Basic Connectivity

```bash
# Test HTTP 200 on root
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/
```

**Expected Result:** `200` or `302` (redirect)

### Step 4.2: Admin Route Protection

```bash
# Test that admin routes require authentication
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/_admin/
```

**Expected Result:** `302` (redirect to Cloudflare Access login) or `401`

### Step 4.3: Public Report Endpoint (Future)

```bash
# Test public report endpoint (when implemented)
# This will return 404 until Task 8 is complete
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/single-page-html/grower/test/farm/test
```

**Expected Result (pre-Task 8):** `404`  
**Expected Result (post-Task 8):** `200` with HTML content

### Step 4.4: Response Headers Verification

```bash
# Verify security headers
curl -s -I https://my-farm-advisor.superiorbyteworks.com/ | grep -E "(cf-ray|server|content-type)"
```

**Expected Result:**
```
server: cloudflare
cf-ray: XXXXXXXXXXXXXXX-XXX
content-type: text/html; charset=utf-8
```

### Step 4.5: Full Response Body Check

```bash
# Verify the worker is responding with expected content
curl -s https://my-farm-advisor.superiorbyteworks.com/ | head -20
```

**Expected Result:** HTML content containing OpenClaw gateway UI or redirect

---

## Phase 5: Workers.dev Fallback Verification

Ensure the original workers.dev URL still works:

```bash
# Test workers.dev URL
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev/
```

**Expected Result:** `200` or `302`

**Note:** Replace `YOUR_SUBDOMAIN` with your actual Cloudflare account subdomain.

---

## Rollback Procedure

### Trigger Conditions

Rollback to workers.dev if ANY of the following occur:

| Condition | Severity | Detection Method |
|-----------|----------|------------------|
| Custom domain returns 5xx errors | Critical | Smoke test shows HTTP >= 500 |
| Certificate stuck "Pending" > 30 min | High | Dashboard status check |
| DNS resolution fails globally | Critical | `dig` from multiple resolvers |
| SSL certificate validation fails | Critical | `openssl s_client` error |
| Admin routes accessible without auth | Critical | Unauthorized access possible |
| Public reports not serving | Medium | Task 8 specific endpoint fails |

### Rollback Steps

#### Step R1: Remove Custom Domain

**Dashboard Method:**
1. Go to Workers & Pages > `my-farm-advisor-sandbox` > Settings > Domains & Routes
2. Find `my-farm-advisor.superiorbyteworks.com`
3. Click the three dots menu > **Remove**
4. Confirm removal

**CLI Method:**
```bash
# Remove custom domain
npx wrangler domain delete --name my-farm-advisor-sandbox --domain my-farm-advisor.superiorbyteworks.com
```

**Expected Result:** Domain no longer appears in the list

#### Step R2: Verify Fallback

```bash
# Confirm workers.dev still works
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev/
```

**Expected Result:** `200` or `302`

#### Step R3: Verify Custom Domain No Longer Resolves

```bash
# DNS should no longer resolve (or return NXDOMAIN)
dig my-farm-advisor.superiorbyteworks.com
```

**Expected Result:** No A/AAAA/CNAME records, or SERVFAIL/NXDOMAIN

#### Step R4: Update Documentation

1. Document rollback reason in incident log
2. Update deployment runbook with lessons learned
3. Re-attempt domain attachment after root cause resolved

---

## Troubleshooting Guide

### Issue: Certificate Stuck in "Pending"

**Symptoms:**
- Domain status shows "Certificate Pending" for > 10 minutes
- HTTPS requests timeout or fail

**Diagnosis:**
```bash
# Check DNS propagation
dig my-farm-advisor.superiorbyteworks.com +trace

# Verify domain ownership
dig TXT superiorbyteworks.com | grep -i cloudflare
```

**Resolution:**
1. Ensure DNS zone is active in Cloudflare (not just registered)
2. Check that no conflicting CNAME records exist
3. Remove and re-add the custom domain
4. Wait up to 24 hours for certificate issuance (rare)

### Issue: DNS Not Propagating

**Symptoms:**
- `dig` returns NXDOMAIN or wrong records
- Different resolvers return different results

**Diagnosis:**
```bash
# Check authoritative nameservers
dig NS superiorbyteworks.com

# Check TTL on existing records
dig my-farm-advisor.superiorbyteworks.com | grep "IN\s\+CNAME"
```

**Resolution:**
1. Verify domain uses Cloudflare nameservers
2. Check for conflicting DNS records in Cloudflare DNS tab
3. Wait for TTL expiration (default 300s = 5 minutes)
4. Flush DNS caches: `sudo systemd-resolve --flush-caches` (Linux)

### Issue: Route Conflicts

**Symptoms:**
- Some paths work, others return 404
- Admin routes accessible when they should be protected

**Diagnosis:**
```bash
# Check specific routes
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/_admin/
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/api/devices
curl -s -o /dev/null -w "%{http_code}" https://my-farm-advisor.superiorbyteworks.com/debug/processes
```

**Resolution:**
1. Verify Cloudflare Access application covers the custom domain
2. Check Access policy includes the new domain
3. Ensure no Page Rules conflict with worker routes
4. Review `wrangler.jsonc` route configuration

### Issue: SSL Certificate Errors

**Symptoms:**
- Browser shows certificate warning
- `curl` fails with SSL verification error

**Diagnosis:**
```bash
# Detailed certificate check
openssl s_client -connect my-farm-advisor.superiorbyteworks.com:443 -servername my-farm-advisor.superiorbyteworks.com </dev/null 2>&1 | grep -E "(Verify|Subject:|Issuer:)"
```

**Resolution:**
1. Verify certificate covers the exact domain (not just wildcard)
2. Check system time is correct
3. Remove and re-add custom domain to force re-issuance
4. Contact Cloudflare support if certificate fails to issue

### Issue: Workers.dev Works, Custom Domain Fails

**Symptoms:**
- workers.dev URL returns 200
- Custom domain returns 404 or 522/523 error

**Diagnosis:**
```bash
# Compare responses
curl -s -o /dev/null -w "%{http_code}\n" https://my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev/
curl -s -o /dev/null -w "%{http_code}\n" https://my-farm-advisor.superiorbyteworks.com/

# Check Cloudflare error codes
curl -s -I https://my-farm-advisor.superiorbyteworks.com/ 2>&1 | grep "HTTP"
```

**Resolution:**
1. Error 522: Origin connection timeout - check worker is deployed
2. Error 523: Origin unreachable - verify worker name matches
3. Error 404: Route not found - check domain attached to correct worker
4. Check SSL/TLS encryption mode is "Full" or "Full (Strict)"

---

## Quick Reference Commands

### Status Checks

```bash
# Full smoke test suite
echo "=== DNS Check ==="
dig +short my-farm-advisor.superiorbyteworks.com

echo "=== HTTP Status ==="
curl -s -o /dev/null -w "%{http_code}\n" https://my-farm-advisor.superiorbyteworks.com/

echo "=== SSL Certificate ==="
echo | openssl s_client -connect my-farm-advisor.superiorbyteworks.com:443 -servername my-farm-advisor.superiorbyteworks.com 2>/dev/null | openssl x509 -noout -dates

echo "=== Response Headers ==="
curl -s -I https://my-farm-advisor.superiorbyteworks.com/ | head -10
```

### Rollback Commands

```bash
# Remove custom domain
npx wrangler domain delete --name my-farm-advisor-sandbox --domain my-farm-advisor.superiorbyteworks.com

# Verify removal
dig my-farm-advisor.superiorbyteworks.com

# Test fallback
curl -s https://my-farm-advisor-sandbox.YOUR_SUBDOMAIN.workers.dev/ | head -5
```

---

## Verification Checklist

Before marking this task complete, verify:

- [ ] Domain `my-farm-advisor.superiorbyteworks.com` attached to worker
- [ ] DNS record exists and resolves globally
- [ ] SSL certificate issued and valid
- [ ] HTTPS requests return HTTP 200
- [ ] Admin routes protected (return 302/401, not 200)
- [ ] Workers.dev fallback URL still functional
- [ ] Rollback procedure documented and tested
- [ ] Troubleshooting guide covers common issues

---

## References

| Resource | URL |
|----------|-----|
| Cloudflare Workers Custom Domains | https://developers.cloudflare.com/workers/configuration/routing/custom-domains/ |
| Cloudflare SSL/TLS Docs | https://developers.cloudflare.com/ssl/ |
| Wrangler Domain Commands | https://developers.cloudflare.com/workers/wrangler/commands/#domain |
| Worker Configuration | `wrangler.jsonc` (worker name: `my-farm-advisor-sandbox`) |

---

*Task 5 Complete: Domain rollout checklist created for my-farm-advisor.superiorbyteworks.com*
