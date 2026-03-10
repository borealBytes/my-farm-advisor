# Secrets Matrix: GitHub Actions + Cloudflare Runtime

**Document Version:** 1.0  
**Last Updated:** 2026-03-10  
**Purpose:** Definitive reference for all secrets required for CI/CD deployment and runtime operation

---

## Overview

This document lists all secrets required for:
1. **CI/CD Deployment** - GitHub Actions workflows that deploy to Cloudflare
2. **Runtime Operation** - Cloudflare Worker and Sandbox container operation

---

## Part 1: CI/CD Deployment Secrets (GitHub Actions)

These secrets are required for GitHub Actions to authenticate with Cloudflare and deploy the Worker.

| Secret | Required | Purpose | How to Obtain | Set Order |
|--------|----------|---------|---------------|-----------|
| `CLOUDFLARE_API_TOKEN` | **Yes** | Authenticate with Cloudflare API for deployments | [Create API Token](https://dash.cloudflare.com/profile/api-tokens) with `Cloudflare Workers:Edit` and `Account:Read` permissions | 1st |
| `CLOUDFLARE_ACCOUNT_ID` | **Yes** | Identify your Cloudflare account | [Cloudflare Dashboard](https://dash.cloudflare.com/) → right sidebar "Account ID" | 2nd |

### Setup Instructions for CI/CD Secrets

#### Step 1: Create Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use the **Custom token** template
4. Configure permissions:
   - **Account**: `Account:Read`
   - **Zone**: (none needed)
   - **Workers Scripts**: `Cloudflare Workers:Edit`
   - **R2**: `R2:Edit` (if using R2 storage)
5. Set **Account Resources** to include your account
6. Click **Continue to summary** → **Create Token**
7. **Copy the token immediately** (shown only once)

#### Step 2: Get Cloudflare Account ID

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Look at the right sidebar for **Account ID**
3. Or click the three dots menu next to your account name → **Copy Account ID**

#### Step 3: Add Secrets to GitHub Repository

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add each secret:
   - Name: `CLOUDFLARE_API_TOKEN` → Value: your API token
   - Name: `CLOUDFLARE_ACCOUNT_ID` → Value: your account ID

---

## Part 2: Runtime Secrets (Cloudflare Worker)

These secrets are required for the Worker and Sandbox container to operate. Set via `npx wrangler secret put` or in the Cloudflare Dashboard.

### 2.1 AI Provider Secrets (One Required)

At least one AI provider must be configured. Priority order is shown below.

| Secret | Required | Purpose | How to Obtain | Priority |
|--------|----------|---------|---------------|----------|
| `OPENROUTER_API_KEY` | **Yes*** | API key for OpenRouter (Kimi K2.5 access) | [OpenRouter Dashboard](https://openrouter.ai/keys) | **Primary** |
| `CLOUDFLARE_AI_GATEWAY_API_KEY` | **Yes*** | API key passed through Cloudflare AI Gateway | Your AI provider's API key (e.g., Anthropic) | Alternative |
| `CF_AI_GATEWAY_ACCOUNT_ID` | **Yes*** | Cloudflare account ID for AI Gateway | [Cloudflare Dashboard](https://dash.cloudflare.com/) | Alternative |
| `CF_AI_GATEWAY_GATEWAY_ID` | **Yes*** | AI Gateway ID | [AI Gateway Dashboard](https://dash.cloudflare.com/?to=/:account/ai/ai-gateway) | Alternative |
| `ANTHROPIC_API_KEY` | **Yes*** | Direct Anthropic API access | [Anthropic Console](https://console.anthropic.com/) | Fallback |
| `OPENAI_API_KEY` | No | Direct OpenAI API access | [OpenAI Platform](https://platform.openai.com/) | Optional |

> **Note:** `*` = At least one AI provider configuration is required. OpenRouter is the new primary for Kimi K2.5.

#### Setup Instructions for AI Secrets

**Option A: OpenRouter (Recommended for Kimi K2.5)**

```bash
# 1. Sign up at https://openrouter.ai/
# 2. Go to https://openrouter.ai/keys
# 3. Create a new key
# 4. Set the secret:
npx wrangler secret put OPENROUTER_API_KEY
```

**Option B: Cloudflare AI Gateway**

```bash
# 1. Create AI Gateway in Cloudflare Dashboard
#    https://dash.cloudflare.com/?to=/:account/ai/ai-gateway/create-gateway
# 2. Get your AI provider's API key (e.g., Anthropic)
# 3. Set all three required secrets:
npx wrangler secret put CLOUDFLARE_AI_GATEWAY_API_KEY  # Your provider's API key
npx wrangler secret put CF_AI_GATEWAY_ACCOUNT_ID       # Your Cloudflare account ID
npx wrangler secret put CF_AI_GATEWAY_GATEWAY_ID       # Your gateway ID
```

**Option C: Direct Anthropic**

```bash
# 1. Get API key from https://console.anthropic.com/
# 2. Set the secret:
npx wrangler secret put ANTHROPIC_API_KEY
```

### 2.2 Authentication Secrets

| Secret | Required | Purpose | How to Obtain | Set Order |
|--------|----------|---------|---------------|-----------|
| `MOLTBOT_GATEWAY_TOKEN` | **Yes** | Gateway authentication token (pass via `?token=` query param) | Generate with `openssl rand -hex 32` | 1st |
| `CF_ACCESS_TEAM_DOMAIN` | **Yes*** | Cloudflare Access team domain for JWT validation | [Zero Trust Dashboard](https://one.dash.cloudflare.com/) → Settings → Custom Pages | 2nd |
| `CF_ACCESS_AUD` | **Yes*** | Cloudflare Access Application Audience tag | [Zero Trust Dashboard](https://one.dash.cloudflare.com/) → Access → Applications → Your App | 3rd |

> **Note:** `*` = Required for admin UI (`/_admin/`) and device pairing

#### Setup Instructions for Auth Secrets

**Step 1: Generate Gateway Token**

```bash
# Generate a secure random token
export MOLTBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)
echo "Your gateway token: $MOLTBOT_GATEWAY_TOKEN"

# Set the secret
echo "$MOLTBOT_GATEWAY_TOKEN" | npx wrangler secret put MOLTBOT_GATEWAY_TOKEN
```

**Step 2: Enable Cloudflare Access**

1. Go to [Workers & Pages Dashboard](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. Select your Worker
3. Settings → Domains & Routes → `workers.dev` row → Click `...` → **Enable Cloudflare Access**
4. Copy the **Application Audience (AUD)** tag shown in the dialog

**Step 3: Get Team Domain**

1. Go to [Zero Trust Dashboard](https://one.dash.cloudflare.com/)
2. **Settings** → **Custom Pages**
3. Copy your team domain (e.g., `myteam.cloudflareaccess.com`)

**Step 4: Set Access Secrets**

```bash
npx wrangler secret put CF_ACCESS_TEAM_DOMAIN
# Enter: myteam.cloudflareaccess.com

npx wrangler secret put CF_ACCESS_AUD
# Enter: your-aud-tag-from-step-2
```

### 2.3 R2 Storage Secrets (Optional but Recommended)

| Secret | Required | Purpose | How to Obtain | Set Order |
|--------|----------|---------|---------------|-----------|
| `R2_ACCESS_KEY_ID` | **Yes** | R2 API access key ID | [R2 Dashboard](https://dash.cloudflare.com/?to=/:account/r2) → Manage R2 API Tokens | 1st |
| `R2_SECRET_ACCESS_KEY` | **Yes** | R2 API secret access key | Generated when creating R2 API token | 2nd |
| `CF_ACCOUNT_ID` | **Yes** | Cloudflare account ID for R2 endpoint | [Cloudflare Dashboard](https://dash.cloudflare.com/) → Account ID | 3rd |

#### Setup Instructions for R2 Secrets

1. Go to [R2 Dashboard](https://dash.cloudflare.com/?to=/:account/r2)
2. Click **Manage R2 API Tokens**
3. Click **Create API Token**
4. Set permissions: **Object Read & Write**
5. Select bucket: `moltbot-data` (created automatically on first deploy)
6. Click **Create API Token**
7. **Copy both the Access Key ID and Secret Access Key** (shown only once)
8. Set the secrets:

```bash
npx wrangler secret put R2_ACCESS_KEY_ID
# Enter: your-access-key-id

npx wrangler secret put R2_SECRET_ACCESS_KEY
# Enter: your-secret-access-key

npx wrangler secret put CF_ACCOUNT_ID
# Enter: your-cloudflare-account-id
```

### 2.4 Channel Bot Secrets (Optional)

| Secret | Required | Purpose | How to Obtain |
|--------|----------|---------|---------------|
| `TELEGRAM_BOT_TOKEN` | No | Telegram bot authentication | [BotFather](https://t.me/botfather) → `/newbot` |
| `DISCORD_BOT_TOKEN` | No | Discord bot authentication | [Discord Developer Portal](https://discord.com/developers/applications) → Bot → Token |
| `SLACK_BOT_TOKEN` | No | Slack bot authentication | [Slack API](https://api.slack.com/apps) → OAuth & Permissions → Bot User OAuth Token |
| `SLACK_APP_TOKEN` | No | Slack app-level token (for Socket Mode) | [Slack API](https://api.slack.com/apps) → Basic Information → App-Level Tokens |

#### Setup Instructions for Channel Secrets

**Telegram:**

```bash
# 1. Message @BotFather on Telegram
# 2. Send /newbot and follow instructions
# 3. Copy the bot token provided
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

**Discord:**

```bash
# 1. Go to https://discord.com/developers/applications
# 2. Create New Application → Bot → Add Bot
# 3. Copy the Bot Token
npx wrangler secret put DISCORD_BOT_TOKEN
```

**Slack:**

```bash
# 1. Go to https://api.slack.com/apps
# 2. Create New App → From scratch
# 3. OAuth & Permissions → Add scopes (chat:write, im:write, etc.)
# 4. Install to Workspace → Copy Bot User OAuth Token
npx wrangler secret put SLACK_BOT_TOKEN

# 5. Basic Information → App-Level Tokens → Generate Token
# 6. Add scope: connections:write
npx wrangler secret put SLACK_APP_TOKEN
```

### 2.5 Optional Runtime Secrets

| Secret | Required | Purpose | Default |
|--------|----------|---------|---------|
| `CF_AI_GATEWAY_MODEL` | No | Override default AI model | `anthropic/claude-sonnet-4-5` |
| `DEV_MODE` | No | Skip CF Access auth + device pairing (local dev only) | `false` |
| `DEBUG_ROUTES` | No | Enable `/debug/*` endpoints | `false` |
| `SANDBOX_SLEEP_AFTER` | No | Container sleep timeout | `never` |
| `TELEGRAM_DM_POLICY` | No | Telegram DM policy | `pairing` |
| `DISCORD_DM_POLICY` | No | Discord DM policy | `pairing` |
| `R2_BUCKET_NAME` | No | Override R2 bucket name | `moltbot-data` |
| `ANTHROPIC_BASE_URL` | No | Custom Anthropic API base URL | - |
| `AI_GATEWAY_API_KEY` | No | Legacy AI Gateway (deprecated) | - |
| `AI_GATEWAY_BASE_URL` | No | Legacy AI Gateway URL (deprecated) | - |
| `CDP_SECRET` | No | Browser automation CDP secret | - |
| `WORKER_URL` | No | Public worker URL for CDP | - |

---

## Part 3: Secret Priority Matrix

### AI Provider Priority (Runtime)

The startup script selects AI provider in this priority order:

1. **OpenRouter** (new): `OPENROUTER_API_KEY` → Uses Kimi K2.5 via OpenRouter
2. **Cloudflare AI Gateway**: `CLOUDFLARE_AI_GATEWAY_API_KEY` + `CF_AI_GATEWAY_ACCOUNT_ID` + `CF_AI_GATEWAY_GATEWAY_ID`
3. **Direct Anthropic**: `ANTHROPIC_API_KEY`
4. **Direct OpenAI**: `OPENAI_API_KEY`
5. **Legacy AI Gateway**: `AI_GATEWAY_API_KEY` + `AI_GATEWAY_BASE_URL` (deprecated)

### Required vs Optional Summary

| Category | Required Secrets | Optional Secrets |
|----------|------------------|------------------|
| **CI/CD** | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` | - |
| **AI** | One of: `OPENROUTER_API_KEY`, `CLOUDFLARE_AI_GATEWAY_API_KEY`+`CF_AI_GATEWAY_ACCOUNT_ID`+`CF_AI_GATEWAY_GATEWAY_ID`, or `ANTHROPIC_API_KEY` | `OPENAI_API_KEY`, `CF_AI_GATEWAY_MODEL`, `ANTHROPIC_BASE_URL` |
| **Auth** | `MOLTBOT_GATEWAY_TOKEN`, `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD` | `DEV_MODE` |
| **R2** | `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CF_ACCOUNT_ID` | `R2_BUCKET_NAME` |
| **Channels** | - | `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, `SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN` |
| **Debug** | - | `DEBUG_ROUTES`, `SANDBOX_SLEEP_AFTER` |

---

## Part 4: Quick Setup Commands

### Minimal Setup (Required Only)

```bash
# CI/CD (set in GitHub Actions secrets)
# - CLOUDFLARE_API_TOKEN
# - CLOUDFLARE_ACCOUNT_ID

# Runtime AI (OpenRouter for Kimi K2.5)
npx wrangler secret put OPENROUTER_API_KEY

# Runtime Auth
export TOKEN=$(openssl rand -hex 32)
echo "$TOKEN" | npx wrangler secret put MOLTBOT_GATEWAY_TOKEN
npx wrangler secret put CF_ACCESS_TEAM_DOMAIN
npx wrangler secret put CF_ACCESS_AUD

# Deploy
npm run deploy
```

### Full Setup (With R2 + Channels)

```bash
# AI (OpenRouter)
npx wrangler secret put OPENROUTER_API_KEY

# Auth
export TOKEN=$(openssl rand -hex 32)
echo "$TOKEN" | npx wrangler secret put MOLTBOT_GATEWAY_TOKEN
npx wrangler secret put CF_ACCESS_TEAM_DOMAIN
npx wrangler secret put CF_ACCESS_AUD

# R2 Storage
npx wrangler secret put R2_ACCESS_KEY_ID
npx wrangler secret put R2_SECRET_ACCESS_KEY
npx wrangler secret put CF_ACCOUNT_ID

# Channels (optional)
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put DISCORD_BOT_TOKEN
npx wrangler secret put SLACK_BOT_TOKEN
npx wrangler secret put SLACK_APP_TOKEN

# Deploy
npm run deploy
```

---

## Part 5: Verification

### Check All Secrets Are Set

```bash
npx wrangler secret list
```

### Verify Individual Secret

```bash
# Note: You cannot retrieve secret values, only verify they exist
npx wrangler secret list | grep SECRET_NAME
```

### Debug Secret Issues

Enable debug routes to see which secrets are detected:

```bash
npx wrangler secret put DEBUG_ROUTES
# Enter: true
```

Then visit: `https://your-worker.workers.dev/debug/env`

---

## Appendix: Secret Name Reference

### Exact Variable Names (Case-Sensitive)

| Variable | Location | Used In |
|----------|----------|---------|
| `CLOUDFLARE_API_TOKEN` | GitHub Actions | `.github/workflows/deploy.yml` |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions | `.github/workflows/deploy.yml` |
| `OPENROUTER_API_KEY` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `CLOUDFLARE_AI_GATEWAY_API_KEY` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `CF_AI_GATEWAY_ACCOUNT_ID` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `CF_AI_GATEWAY_GATEWAY_ID` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `CF_AI_GATEWAY_MODEL` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `ANTHROPIC_API_KEY` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `ANTHROPIC_BASE_URL` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `OPENAI_API_KEY` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `MOLTBOT_GATEWAY_TOKEN` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` → maps to `OPENCLAW_GATEWAY_TOKEN` |
| `CF_ACCESS_TEAM_DOMAIN` | Wrangler Secret | `src/types.ts`, `src/auth/middleware.ts` |
| `CF_ACCESS_AUD` | Wrangler Secret | `src/types.ts`, `src/auth/middleware.ts` |
| `R2_ACCESS_KEY_ID` | Wrangler Secret | `src/types.ts`, `src/routes/api.ts`, `src/gateway/env.ts` |
| `R2_SECRET_ACCESS_KEY` | Wrangler Secret | `src/types.ts`, `src/routes/api.ts`, `src/gateway/env.ts` |
| `CF_ACCOUNT_ID` | Wrangler Secret | `src/types.ts`, `src/routes/api.ts`, `src/gateway/env.ts` |
| `R2_BUCKET_NAME` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `TELEGRAM_BOT_TOKEN` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `TELEGRAM_DM_POLICY` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `DISCORD_BOT_TOKEN` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `DISCORD_DM_POLICY` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `SLACK_BOT_TOKEN` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `SLACK_APP_TOKEN` | Wrangler Secret | `src/types.ts`, `src/gateway/env.ts` |
| `DEV_MODE` | Wrangler Secret | `src/types.ts`, `src/index.ts` |
| `DEBUG_ROUTES` | Wrangler Secret | `src/types.ts`, `src/index.ts` |
| `SANDBOX_SLEEP_AFTER` | Wrangler Secret | `src/types.ts` |
| `CDP_SECRET` | Wrangler Secret | `src/types.ts`, `src/routes/cdp.ts` |
| `WORKER_URL` | Wrangler Secret | `src/types.ts`, `src/routes/cdp.ts` |

---

## Related Documentation

- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)
- [R2 Storage](https://developers.cloudflare.com/r2/)
