# Task 1: Baseline Inventory Audit

**Date:** 2026-03-10
**Branch:** clawification
**Audit Scope:** Production deployment readiness assessment

---

## Executive Summary

This audit documents the current state of the repository to establish a baseline for production deployment. The project is a Cloudflare Worker running OpenClaw (Moltbot) in a Cloudflare Sandbox container, specialized for agricultural advisory workflows.

---

## DONE SO FAR

### 1. GitHub Workflows

**Existing Workflow:** `.github/workflows/test.yml`

| Aspect | Status | Details |
|--------|--------|---------|
| **Unit Tests** | ✅ Complete | Runs on push/PR to main; includes lint, format check, type check, and vitest |
| **E2E Tests** | ✅ Complete | Matrix testing (base, telegram, discord, workers-ai configs); video recording with thumbnails |
| **Secrets** | ✅ Configured | Uses `E2E_*` prefixed secrets for Cloudflare infrastructure |
| **Artifacts** | ✅ Complete | Video uploads to `e2e-artifacts-*` branches with PR comments |

**Workflow Triggers:**
- Push to `main` branch
- Pull requests to `main` branch
- Manual dispatch (`workflow_dispatch`)

**Missing:** No deployment workflow exists yet.

---

### 2. Wrangler Configuration (`wrangler.jsonc`)

| Setting | Value | Status |
|---------|-------|--------|
| **Worker Name** | `my-farm-advisor-sandbox` | ✅ Configured |
| **Main Entry** | `src/index.ts` | ✅ Correct |
| **Compatibility Date** | `2025-05-06` | ✅ Current |
| **Compatibility Flags** | `["nodejs_compat"]` | ✅ Required for containers |
| **Observability** | `enabled: true` | ✅ Enabled |

**Assets Configuration:**
- Directory: `./dist/client`
- SPA handling: `single-page-application`
- HTML handling: `auto-trailing-slash`
- Binding: `ASSETS`
- Run worker first: `true`

**Container Configuration:**
- Class: `Sandbox`
- Image: `./Dockerfile`
- Instance type: `standard-1` (1/2 vCPU, 4 GiB, 8 GB disk)
- Max instances: `1`

**Durable Objects:**
- Binding: `Sandbox` class
- Migration: `v1` with `new_sqlite_classes: ["Sandbox"]`

**R2 Buckets:**
- Binding: `MOLTBOT_BUCKET`
- Bucket name: `my-farm-advisor-sandbox-data`

**Browser Rendering:**
- Binding: `BROWSER` (for CDP shim)

**Build Command:**
- Command: `npm run build` (runs Vite build)

---

### 3. Route Exposure Analysis

#### Public Routes (No CF Access Auth Required)

Located in `src/routes/public.ts`:

| Route | Purpose | Auth |
|-------|---------|------|
| `GET /sandbox-health` | Health check endpoint | None |
| `GET /logo.png` | Logo asset serving | None |
| `GET /logo-small.png` | Small logo asset | None |
| `GET /api/status` | Gateway status check | None |
| `GET /_admin/assets/*` | Admin UI static assets | None (needed for login page) |

#### Protected Routes (CF Access Auth Required)

From `src/index.ts`:

| Route | Purpose | Middleware |
|-------|---------|------------|
| `GET /_admin/*` | Admin UI for device management | CF Access JWT validation |
| `GET /api/*` | API endpoints (devices, gateway) | CF Access JWT validation |
| `GET /debug/*` | Debug endpoints (conditional) | CF Access + DEBUG_ROUTES flag |
| `GET /cdp/*` | CDP shim endpoints | Shared secret auth (query param) |
| `GET /ws` | WebSocket proxy | Gateway token + device pairing |
| `GET /` | Control UI proxy | Gateway token + device pairing |

#### Route Split Summary

- **Public routes:** 5 endpoints (health, assets, status)
- **Protected routes:** All admin, API, debug, and main application routes
- **CDP routes:** Special auth via `?secret=` query parameter

---

### 4. Secrets Reference

#### Required Secrets (from README.md)

| Secret | Required | Purpose | Config Location |
|--------|----------|---------|-----------------|
| `MOLTBOT_GATEWAY_TOKEN` | ✅ Yes | Gateway access token | `src/types.ts`, `src/index.ts` |
| `CF_ACCESS_TEAM_DOMAIN` | ✅ Yes* | CF Access team domain | `src/types.ts`, auth middleware |
| `CF_ACCESS_AUD` | ✅ Yes* | CF Access app audience | `src/types.ts`, auth middleware |
| `ANTHROPIC_API_KEY` | ✅ Yes* | Direct Anthropic access | `src/types.ts`, container env |
| `CLOUDFLARE_AI_GATEWAY_API_KEY` | ✅ Yes* | AI Gateway provider key | `src/types.ts`, container env |
| `CF_AI_GATEWAY_ACCOUNT_ID` | ✅ Yes* | CF account ID | `src/types.ts`, container env |
| `CF_AI_GATEWAY_GATEWAY_ID` | ✅ Yes* | AI Gateway ID | `src/types.ts`, container env |

*At least one AI provider config required; CF Access required for production

#### Optional Secrets

| Secret | Purpose |
|--------|---------|
| `OPENAI_API_KEY` | Alternative AI provider |
| `AI_GATEWAY_API_KEY` | Legacy AI Gateway (deprecated) |
| `AI_GATEWAY_BASE_URL` | Legacy AI Gateway URL |
| `CF_AI_GATEWAY_MODEL` | Override default model |
| `DEV_MODE` | Skip auth (local dev only) |
| `DEBUG_ROUTES` | Enable `/debug/*` endpoints |
| `SANDBOX_SLEEP_AFTER` | Container sleep timeout |
| `R2_ACCESS_KEY_ID` | R2 storage access key |
| `R2_SECRET_ACCESS_KEY` | R2 storage secret |
| `CF_ACCOUNT_ID` | CF account for R2 |
| `TELEGRAM_BOT_TOKEN` | Telegram integration |
| `DISCORD_BOT_TOKEN` | Discord integration |
| `SLACK_BOT_TOKEN` | Slack bot token |
| `SLACK_APP_TOKEN` | Slack app token |
| `CDP_SECRET` | CDP endpoint auth |
| `WORKER_URL` | Worker public URL |

#### Secrets in `package.json` cloudflare.bindings

Only two secrets documented in package.json:
- `ANTHROPIC_API_KEY`
- `MOLTBOT_GATEWAY_TOKEN`

**Note:** This is incomplete compared to README.md.

---

### 5. Deployment Scripts (`package.json`)

| Script | Command | Purpose |
|--------|---------|---------|
| `build` | `vite build` | Build client assets |
| `deploy` | `npm run build && wrangler deploy` | Build and deploy to Cloudflare |
| `dev` | `vite dev` | Vite dev server |
| `start` | `wrangler dev` | Local worker dev |
| `types` | `wrangler types` | Generate types |
| `typecheck` | `tsc --noEmit` | TypeScript check |
| `lint` | `oxlint src/` | Linting |
| `lint:fix` | `oxlint --fix src/` | Auto-fix lint |
| `format` | `oxfmt --write src/` | Format code |
| `format:check` | `oxfmt --check src/` | Check formatting |
| `test` | `vitest run` | Run tests |
| `test:watch` | `vitest` | Watch mode tests |
| `test:coverage` | `vitest run --coverage` | Coverage report |

**Missing:** No dedicated staging/production deployment differentiation.

---

### 6. Git Status

**Current Branch:** `clawification`
**Upstream:** `origin/clawification` (up to date)

**Staged Changes:**
- `new file: .sisyphus/plans/deploy-pr-openrouter-kimi-cloudflare.md`
- `modified: wrangler.jsonc`

**Unstaged Changes:**
- `modified: .sisyphus/boulder.json`
- `deleted: .sisyphus/drafts/deploy-pr-openrouter-kimi-cloudflare.md`

**Recent Commits (last 20):**
```
65a7129 feat: Add draft for deploying PR with OpenRouter Kimi and public HTML reports
d5bf15d docs(r2-seed-pipeline): simplify to rsync seed and upgrade flows
e2f6529 Add farm intelligence reporting pipeline and maturity by FIPS scripts
007936e feat: Add reporting bootstrap and farm pipeline scripts
5729bce chore: remove compiled Python bytecode files from __pycache__ directories
9a4cc35 Refactor data paths to use 'moltbot' directory structure across various skills
ed7d513 feat(readme): update README to reflect project rebranding and enhanced features
ae9dad9 feat(breeding-simulation): add new breeding simulation module and example
bb13af4 feat(skills): add my-farm-advisor hierarchical skill collection
c3e6f4a feat(skills): add my-farm-advisor orchestration SKILL.md
aa5f75b Merge pull request #309 from sidharthachatterjee/containers-cost-note
c155747 Add note about containers cost
ee5006a Merge pull request #254 from cloudflare/plwr-e2e
4883025 fix: include run_attempt in E2E_TEST_RUN_ID to avoid R2 conflicts on re-runs
a6e62a3 fix: use same playwright install as plwr CI (npx)
1e3c01b fix: find global playwright CLI via npm root -g
38ced60 fix: use global playwright CLI to install chromium browsers
7a249da fix playwright install: use correct package name, bump plwr to 0.7.2
91cefeb Replace playwright-cli with plwr for E2E tests
6510afd Add .npmrc to .gitignore to use public npm for @cloudflare packages
```

---

## MISSING TONIGHT

### Critical Missing Items

1. **Deployment Workflow** ❌
   - No `.github/workflows/deploy.yml` exists
   - Need automated deployment on merge to main
   - Need PR preview deployments

2. **OpenRouter Integration** ❌
   - No OpenRouter API key support in types/config
   - No Kimi model configuration
   - Need to add to `MoltbotEnv` interface

3. **Public HTML Reports** ❌
   - No mechanism for generating/publicizing HTML reports
   - No artifact handling for reports

4. **PR Preview Deployments** ❌
   - No workflow for deploying PR branches
   - No cleanup workflow for PR previews

### Configuration Gaps

5. **wrangler.jsonc Secrets Documentation** ⚠️
   - Comments list secrets but not all are in `package.json` bindings
   - Should sync README secrets with package.json

6. **Environment Validation** ✅
   - `src/index.ts` has `validateRequiredEnv()` function
   - Checks for AI provider and CF Access config
   - **Missing:** OpenRouter validation

### Testing Gaps

7. **Deployment Testing** ❌
   - No smoke tests post-deployment
   - No health check validation in CI

---

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Worker                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Public      │  │ Protected    │  │ CDP              │   │
│  │ Routes      │  │ Routes       │  │ Routes           │   │
│  │ (no auth)   │  │ (CF Access)  │  │ (secret auth)    │   │
│  └──────┬──────┘  └──────┬───────┘  └────────┬─────────┘   │
│         │                │                   │             │
│         └────────────────┴───────────────────┘             │
│                          │                                 │
│                    ┌─────┴─────┐                           │
│                    │  Sandbox  │                           │
│                    │  (Durable │                           │
│                    │   Object) │                           │
│                    └─────┬─────┘                           │
└──────────────────────────┼─────────────────────────────────┘
                           │
┌──────────────────────────┼─────────────────────────────────┐
│              Cloudflare Sandbox Container                │
│  ┌───────────────────────┴─────────────────────────────┐  │
│  │              OpenClaw Gateway                       │  │
│  │  - Control UI (port 18789)                         │  │
│  │  - WebSocket RPC                                   │  │
│  │  - Agent runtime                                   │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Recommendations

### Immediate (Tonight)

1. Create `.github/workflows/deploy.yml` for production deployments
2. Add OpenRouter/Kimi support to `src/types.ts`
3. Create PR preview deployment workflow
4. Add HTML report generation and artifact upload

### Short-term

1. Sync secrets documentation between README.md and package.json
2. Add deployment smoke tests to workflow
3. Document PR preview URL format
4. Add OpenRouter to environment validation

### Long-term

1. Consider staging environment separate from production
2. Add automated rollback on deployment failure
3. Implement canary deployments
4. Add cost monitoring alerts

---

## Files Referenced

- `.github/workflows/test.yml` - Existing CI workflow
- `wrangler.jsonc` - Worker configuration
- `src/index.ts` - Main application entry
- `src/routes/public.ts` - Public route definitions
- `src/types.ts` - TypeScript type definitions
- `README.md` - Documentation and secrets reference
- `package.json` - Scripts and dependencies

---

*Audit completed: 2026-03-10*
*Auditor: Sisyphus*
