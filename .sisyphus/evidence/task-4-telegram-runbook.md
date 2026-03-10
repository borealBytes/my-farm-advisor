# Telegram Bot Onboarding Runbook

Complete guide for creating a Telegram bot, securing the token, and integrating it with MY Farm Advisor.

---

## Prerequisites

- A Telegram account (free)
- Access to the Telegram mobile app or desktop client
- Your MY Farm Advisor deployment ready (or planned)

---

## Step 1: Create Bot with BotFather

BotFather is Telegram's official bot for creating and managing bots.

### 1.1 Start the Conversation

1. Open Telegram and search for **@BotFather**
2. Tap **Start** or send `/start`

### 1.2 Create a New Bot

Send the command:

```
/newbot
```

BotFather will prompt you for two things:

1. **Bot name** - Display name (can contain spaces, e.g., "My Farm Advisor")
2. **Bot username** - Unique identifier ending in "bot" (e.g., `myfarmadvisor_bot`)

### 1.3 Naming Guidelines

| Aspect | Rules | Examples |
|--------|-------|----------|
| Bot name | 1-64 characters, any characters allowed | `My Farm Advisor`, `FarmBot Alpha` |
| Username | 5-32 characters, must end in "bot", case-insensitive | `myfarmadvisor_bot`, `farm_helper_bot` |

**Good usernames:**
- `myfarmadvisor_bot`
- `superior_farm_bot`
- `agri_assistant_bot`

**Bad usernames:**
- `myfarmadvisor` (missing "bot" suffix)
- `my_farm_advisor_bot` (too long if over 32 chars)
- `FarmAdvisorBot` (will be lowercased to `farmadvisorbot`)

### 1.4 Receive Your Token

After successful creation, BotFather replies with:

```
Done! Congratulations on your new bot. You will find it at
t.me/your_bot_username. You can now add a description, about
section and profile picture for your bot, see /help for a list
of commands. By the way, when you've finished creating your
cool bot, ping our Bot Support if you want a better username
for it. Just make sure the bot is fully operational before you
do this.

Use this token to access the HTTP API:
123456789:ABCdefGHIjklMNOpqrSTUvwxyz123456789
Keep your token secure and store it safely, it can be used by
anyone to control your bot.
```

**The token looks like:** `123456789:ABCdefGHIjklMNOpqrSTUvwxyz123456789`

**CRITICAL:** Copy this token immediately. It will not be shown again.

---

## Step 2: Secure the Token

### 2.1 Token Safety Rules

**NEVER:**
- Commit the token to git (any file, even "temporary")
- Paste it in public chat channels
- Include it in screenshots or screen recordings
- Store it in unencrypted files
- Share it via email or messaging apps

**ALWAYS:**
- Treat it like a password
- Use wrangler secret storage (see below)
- Rotate the token if accidentally exposed (use `/revoke` with BotFather)

### 2.2 Store Token in Cloudflare Secrets

Run this command from your project directory:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

When prompted, paste your token (the long string from BotFather) and press Enter.

**Expected output:**
```
✨ Success! Uploaded secret TELEGRAM_BOT_TOKEN
```

**Verify the secret is set:**

```bash
npx wrangler secret list
```

You should see `TELEGRAM_BOT_TOKEN` in the list (the value is hidden).

---

## Step 3: Configure DM Policy (Optional)

Telegram bots can operate in two modes for direct messages:

| Policy | Behavior | Use Case |
|--------|----------|----------|
| `pairing` (default) | New DMs require admin approval via `/_admin/` | Production, secure |
| `open` | Anyone can DM the bot immediately | Testing, public bots |

### 3.1 Set the Policy

To explicitly set pairing mode (recommended for production):

```bash
npx wrangler secret put TELEGRAM_DM_POLICY
# Enter: pairing
```

For open mode (testing only):

```bash
npx wrangler secret put TELEGRAM_DM_POLICY
# Enter: open
```

**If not set, defaults to `pairing`.**

---

## Step 4: Deploy

Deploy your worker to activate the Telegram bot:

```bash
npm run deploy
```

**Note:** The first deployment after adding a bot token may take 1-2 minutes for the container to start.

---

## Step 5: Verify the Integration

### 5.1 Test the Bot Connection

1. Open Telegram and find your bot (search for the username you created)
2. Tap **Start** or send any message
3. The bot should respond or acknowledge the message

### 5.2 Check Pairing Status (pairing mode)

If using `pairing` policy (default):

1. Visit your admin UI at: `https://your-worker.workers.dev/_admin/`
2. Authenticate via Cloudflare Access
3. Look for a pending device with your Telegram user info
4. Click **Approve** to pair the device

**Expected behavior:**
- Before approval: Bot may not respond or shows "pending approval"
- After approval: Bot responds normally to messages

### 5.3 Verify in Debug Logs (optional)

If `DEBUG_ROUTES` is enabled, check logs:

```bash
npx wrangler tail
```

Look for Telegram webhook or message handling logs.

---

## Troubleshooting

### Bot does not respond to messages

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| No response at all | Token not set or invalid | Re-run `npx wrangler secret put TELEGRAM_BOT_TOKEN` |
| "Pending approval" message | Device not paired | Approve in `/_admin/` |
| Intermittent responses | Container sleeping | Wait for cold start (1-2 min) or set `SANDBOX_SLEEP_AFTER=never` |
| Bot was working, now stopped | Token revoked or changed | Generate new token with BotFather (`/revoke`) and update secret |

### Token Issues

**To revoke a compromised token:**

1. Message BotFather: `/revoke`
2. Select your bot
3. BotFather generates a new token
4. Update the secret: `npx wrangler secret put TELEGRAM_BOT_TOKEN`
5. Redeploy: `npm run deploy`

**To delete the bot entirely:**

1. Message BotFather: `/deletebot`
2. Select your bot
3. Confirm deletion

### Check Secret is Set Correctly

```bash
# List all secrets (names only, values hidden)
npx wrangler secret list

# Verify deployment has the secret
npx wrangler deploy --dry-run
```

### Common Mistakes

1. **Using test token in production** - Each environment needs its own bot and token
2. **Forgetting to deploy after setting secret** - Secrets are read at deploy time
3. **DM policy mismatch** - If you expect open DMs but set `pairing`, users will see "pending approval"
4. **Bot username vs bot name confusion** - The token is tied to the username (the `@handle`), not the display name

---

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `TELEGRAM_BOT_TOKEN` | Yes | Bot token from BotFather | `123456789:ABCdef...` |
| `TELEGRAM_DM_POLICY` | No | DM access policy: `pairing` or `open` | `pairing` |

---

## Quick Reference: BotFather Commands

| Command | Purpose |
|---------|---------|
| `/newbot` | Create a new bot |
| `/token` | Generate new token for existing bot |
| `/revoke` | Revoke current token and generate new one |
| `/setname` | Change bot display name |
| `/setdescription` | Set description shown in chat |
| `/setabouttext` | Set about text in profile |
| `/setuserpic` | Set bot profile picture |
| `/deletebot` | Delete bot permanently |
| `/help` | Show all commands |

---

## Security Checklist

Before considering setup complete:

- [ ] Token stored via `npx wrangler secret put TELEGRAM_BOT_TOKEN`
- [ ] Token NOT committed to git (verify with `git log --all --full-history -- '*TELEGRAM*'`)
- [ ] DM policy explicitly set (recommended: `pairing`)
- [ ] Worker deployed after setting secret
- [ ] Bot responds to `/start` in Telegram
- [ ] If using `pairing`: Device approved in `/_admin/`
- [ ] Bot responds to messages after approval

---

## Related Documentation

- [Telegram Bot API Documentation](https://core.telegram.org/bots/api)
- [BotFather FAQ](https://core.telegram.org/bots/faq)
- MY Farm Advisor README: "Optional: Chat Channels" section
- OpenClaw Documentation: Multi-channel configuration

---

*Generated for Task 4: Telegram onboarding runbook draft*
*Plan: deploy-pr-openrouter-kimi-cloudflare*
