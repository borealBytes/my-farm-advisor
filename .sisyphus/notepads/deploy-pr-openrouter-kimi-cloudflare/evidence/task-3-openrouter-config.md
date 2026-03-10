# Task 3: OpenRouter + Kimi K2.5-Only Runtime Configuration

## Overview

This document defines the **OpenRouter-only** AI provider configuration path for MY Farm Advisor. This is a locked configuration that activates **only** OpenRouter with Kimi K2.5, with all other providers marked as future roadmap items.

---

## Configuration Summary

| Setting | Value |
|---------|-------|
| **Provider** | OpenRouter |
| **Model ID** | `openrouter/moonshotai/kimi-k2.5` |
| **Required Env Var** | `OPENROUTER_API_KEY` |
| **Status** | **ACTIVE** |
| **Other Providers** | **FUTURE ROADMAP** |

---

## Required Environment Variable

### OPENROUTER_API_KEY

The OpenRouter API key must be set as a Cloudflare Worker secret:

```bash
npx wrangler secret put OPENROUTER_API_KEY
# Enter your OpenRouter API key when prompted
```

**Where to get your key:**
1. Sign up at [openrouter.ai](https://openrouter.ai)
2. Go to Settings → API Keys
3. Create a new key

---

## How the Container Receives the Key

### Step 1: Worker Environment (env.ts)

The `src/gateway/env.ts` file builds environment variables to pass to the OpenClaw container:

```typescript
// src/gateway/env.ts - buildEnvVars()
export function buildEnvVars(env: MoltbotEnv): Record<string, string> {
  const envVars: Record<string, string> = {};

  // OpenRouter configuration (NEW - OpenRouter-only path)
  if (env.OPENROUTER_API_KEY) {
    envVars.OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;
  }

  // ... other env vars

  return envVars;
}
```

**Key Point:** The worker reads `OPENROUTER_API_KEY` from its environment bindings and passes it to the container as `OPENROUTER_API_KEY`.

### Step 2: Container Startup (start-openclaw.sh)

The `start-openclaw.sh` script configures OpenClaw during container startup. For OpenRouter-only mode:

```bash
# In start-openclaw.sh - onboard section
if [ -n "$OPENROUTER_API_KEY" ]; then
  AUTH_ARGS="--auth-choice openrouter-api-key --openrouter-api-key $OPENROUTER_API_KEY"
fi

openclaw onboard --non-interactive --accept-risk \
  --mode local \
  $AUTH_ARGS \
  --gateway-port 18789 \
  --gateway-bind lan \
  --skip-channels \
  --skip-skills \
  --skip-health
```

**Note:** The actual implementation may vary based on OpenClaw's CLI support for OpenRouter.

### Step 3: Config Patching (start-openclaw.sh)

The Node.js config patcher in `start-openclaw.sh` sets up the model configuration:

```javascript
// In the config patcher section
if (process.env.OPENROUTER_API_KEY) {
  config.models = config.models || {};
  config.models.providers = config.models.providers || {};

  // Configure OpenRouter provider
  config.models.providers['openrouter'] = {
    baseUrl: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    api: 'openai-completions',  // OpenRouter uses OpenAI-compatible API
    models: [{
      id: 'moonshotai/kimi-k2.5',
      name: 'Kimi K2.5',
      contextWindow: 256000,
      maxTokens: 8192
    }],
  };

  // Set as default model
  config.agents = config.agents || {};
  config.agents.defaults = config.agents.defaults || {};
  config.agents.defaults.model = { primary: 'openrouter/moonshotai/kimi-k2.5' };
}
```

---

## OpenClaw/OpenRouter Configuration Details

### Provider Configuration

OpenRouter acts as a unified API gateway for multiple AI providers. OpenClaw connects to OpenRouter using an OpenAI-compatible API format.

| Config Key | Value | Description |
|------------|-------|-------------|
| `baseUrl` | `https://openrouter.ai/api/v1` | OpenRouter API endpoint |
| `api` | `openai-completions` | API format (OpenAI-compatible) |
| `apiKey` | From `OPENROUTER_API_KEY` | Your OpenRouter API key |

### Model Configuration

| Property | Value | Description |
|----------|-------|-------------|
| `id` | `moonshotai/kimi-k2.5` | Model identifier on OpenRouter |
| `name` | `Kimi K2.5` | Display name |
| `contextWindow` | `256000` | Context window size (256K tokens) |
| `maxTokens` | `8192` | Maximum output tokens |

### Default Model Setting

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "openrouter/moonshotai/kimi-k2.5"
      }
    }
  }
}
```

**Important:** OpenClaw requires the `model` field to be an object with a `primary` key, not a string.

---

## Why Kimi K2.5 is the Only Active Model

### Current Status: OpenRouter-Only

This deployment is **locked** to OpenRouter with Kimi K2.5 as the sole AI provider. This decision is based on:

1. **Cost Efficiency** - OpenRouter provides competitive pricing with unified billing
2. **Model Access** - Kimi K2.5 offers strong performance for agricultural advisory tasks
3. **Simplified Configuration** - Single provider reduces complexity
4. **Future Flexibility** - OpenRouter allows switching models without changing provider configuration

### Future Roadmap (Not Active)

The following providers are **intentionally disabled** in this configuration and marked for future consideration:

| Provider | Status | Reason |
|----------|--------|--------|
| **Anthropic (Direct)** | 🔮 Future Roadmap | Use via OpenRouter instead |
| **OpenAI (Direct)** | 🔮 Future Roadmap | Use via OpenRouter instead |
| **Cloudflare AI Gateway** | 🔮 Future Roadmap | Not needed with OpenRouter |
| **Groq** | 🔮 Future Roadmap | Available via OpenRouter |
| **Workers AI** | 🔮 Future Roadmap | Available via OpenRouter |

**Note:** These providers can be added later by modifying `src/gateway/env.ts` and `start-openclaw.sh`, but this requires explicit architectural decision.

---

## Integration with Existing Code

### File: src/gateway/env.ts

**Current State:** Does not yet include OpenRouter support.

**Required Addition:**
```typescript
// Add to buildEnvVars() function
if (env.OPENROUTER_API_KEY) {
  envVars.OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;
}
```

### File: start-openclaw.sh

**Current State:** Has provider priority: Cloudflare AI Gateway > Anthropic > OpenAI > Legacy

**Required Changes:**
1. Add OpenRouter to the onboard auth selection logic
2. Add OpenRouter config patching in the Node.js patcher section

### File: src/types.ts

**Required Addition:**
```typescript
export interface MoltbotEnv {
  // ... existing env vars
  OPENROUTER_API_KEY?: string;
}
```

---

## Deployment Steps

1. **Set the OpenRouter API key:**
   ```bash
   npx wrangler secret put OPENROUTER_API_KEY
   ```

2. **Verify no other AI provider keys are set:**
   ```bash
   npx wrangler secret list | grep -E "(ANTHROPIC|OPENAI|CLOUDFLARE_AI_GATEWAY)"
   # Should return nothing (or delete them if present)
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Verify configuration:**
   ```bash
   # Check container logs
   npx wrangler tail
   # Look for: "OpenRouter model configured: openrouter/moonshotai/kimi-k2.5"
   ```

---

## Verification Checklist

- [ ] `OPENROUTER_API_KEY` is set in Cloudflare Worker secrets
- [ ] No other AI provider keys are active (ANTHROPIC_API_KEY, OPENAI_API_KEY, etc.)
- [ ] `src/gateway/env.ts` passes `OPENROUTER_API_KEY` to container
- [ ] `start-openclaw.sh` configures OpenRouter provider
- [ ] Model ID is exactly: `openrouter/moonshotai/kimi-k2.5`
- [ ] Container starts successfully with OpenRouter configuration
- [ ] Test query works through the Control UI

---

## Troubleshooting

### Issue: Container fails to start

**Check:** Ensure `OPENROUTER_API_KEY` is set correctly:
```bash
npx wrangler secret list | grep OPENROUTER
```

### Issue: Model not found errors

**Check:** Verify the model ID format. Must be exactly:
```
openrouter/moonshotai/kimi-k2.5
```

### Issue: Authentication errors

**Check:** Verify your OpenRouter API key is valid:
```bash
curl -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  https://openrouter.ai/api/v1/models
```

### Issue: Other providers still active

**Check:** Ensure no other provider env vars are set. The `start-openclaw.sh` script may prioritize other providers if their keys exist.

---

## References

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [OpenClaw Configuration Schema](https://docs.openclaw.ai/)
- [Kimi K2.5 Model Card](https://openrouter.ai/moonshotai/kimi-k2.5)
- Cloudflare Worker Secrets: `npx wrangler secret --help`
