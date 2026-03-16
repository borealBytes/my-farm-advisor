---
summary: "Cloudflare Tunnel + Access runbook for the Coolify compose deployment"
read_when:
  - You are deploying this repo on Coolify behind Cloudflare Zero Trust
  - You need the supported tunnel token flow for `docker-compose.coolify.yml`
title: "Cloudflare + Coolify"
---

# Cloudflare + Coolify

This is the authoritative runbook for the supported Cloudflare Zero Trust deployment on Coolify.

Use this page when you want the Coolify stack to stay private on the VPS while Cloudflare publishes the hostname stored in `OPENCLAW_PUBLIC_HOSTNAME`.

## What this setup does

- `docker-compose.coolify.yml` runs `openclaw-gateway` and a same-compose `cloudflared` sidecar.
- `CLOUDFLARE_TUNNEL_TOKEN` is the only supported switch that turns on the tunnel path in Coolify.
- If `CLOUDFLARE_TUNNEL_TOKEN` is blank, the `cloudflared` container exits immediately and the gateway stays private on `127.0.0.1:18789`.
- Local Docker does not require Cloudflare. This runbook is only for the Coolify deployment story.
- Browser control stays private on loopback and is not part of the tunnel setup.
- The supported public app entry is `https://<OPENCLAW_PUBLIC_HOSTNAME>`.
- Cloudflare should redirect that root URL to `/__openclaw__/canvas/`.

## Trust boundary

Treat the deployment as two layers:

1. Cloudflare Access protects the hostname stored in `OPENCLAW_PUBLIC_HOSTNAME`.
2. Loopback-only origin publishing protects the raw VPS service because `openclaw-gateway` is published on `127.0.0.1:18789:18789`.

That means public traffic should enter through Cloudflare, while the origin stays private unless you already have shell access on the VPS. Do not treat the tunnel as a replacement for private origin binding. Both layers matter.

## Before you start

- Cloudflare Zero Trust is available for your account.
- The DNS zone for `superiorbyteworks.com` is already in Cloudflare.
- Coolify can deploy this repository with `docker-compose.coolify.yml`.
- You have a strong `OPENCLAW_GATEWAY_TOKEN` ready.
- You are not looking for a public-origin mode. `OPENCLAW_PUBLIC_HTTP` is intentionally not part of the supported contract and should not be documented or used here.
- You know the hostname you want to publish, for example `my-farm-advisor.superiorbyteworks.com`.

## One-time Cloudflare prep

### 1. Create the tunnel token

In the Cloudflare dashboard:

1. Go to Zero Trust.
2. Open Networks, then Tunnels.
3. Create a tunnel for this deployment.
4. Choose the token-based connector flow.
5. Copy the tunnel token and keep it for Coolify as `CLOUDFLARE_TUNNEL_TOKEN`.

This repo expects the token only. It does not expect a credentials JSON file or Cloudflare API automation.

### 2. Choose your public hostname

Set `OPENCLAW_PUBLIC_HOSTNAME` to the hostname people should type in the browser.

Example:

```dotenv
OPENCLAW_PUBLIC_HOSTNAME=my-farm-advisor.superiorbyteworks.com
```

This variable is part of the Coolify compose contract so the hostname is defined in one place instead of being hard-coded through the docs.

### 3. Create the public hostname

Inside the same tunnel configuration, add a public hostname with these values:

- Hostname: value of `OPENCLAW_PUBLIC_HOSTNAME`
- Service type: `HTTP`
- Service URL: `http://openclaw-gateway:18789`

Why this target: the same-compose `cloudflared` sidecar routes to `CLOUDFLARED_ORIGIN_URL=http://openclaw-gateway:18789` inside the Docker network. You do not set `CLOUDFLARED_ORIGIN_URL` yourself. `docker-compose.coolify.yml` sets it automatically. The VPS does not need a public port for this path. In token mode, Cloudflare owns the hostname mapping in the dashboard, so the local sidecar config stays focused on the origin target.

### 4. Create the Access application

In Zero Trust, create a self-hosted application for the same hostname stored in `OPENCLAW_PUBLIC_HOSTNAME`.

Use these settings:

- Application type: self-hosted
- Domain: value of `OPENCLAW_PUBLIC_HOSTNAME`
- Path: protect the whole site so `/` and `/__openclaw__/canvas/` are both covered
- Login method: `One-Time PIN`

Make sure the Access policy actually allows the users who should reach the app. This repo does not create the Access policy for you.

### 5. Add the root redirect

Cloudflared does not give us a clean root-to-origin-path rewrite in this setup, so use a Cloudflare redirect rule for the public browser entry.

In the Cloudflare dashboard:

1. Open your domain.
2. Go to `Rules`.
3. Open `Redirect Rules`.
4. Click `Create rule`.
5. Create a rule with these values.

Match:

- `https://<OPENCLAW_PUBLIC_HOSTNAME>/`

Action:

- Redirect to `https://<OPENCLAW_PUBLIC_HOSTNAME>/__openclaw__/canvas/`
- Use a `302` redirect while testing
- Change it to `301` later if you want it permanent

Why this exists: people should only need to type the top-level hostname, while OpenClaw still serves the Canvas UI from the internal `/__openclaw__/canvas/` path.

## Coolify deployment flow

### 1. Use the single compose file

In Coolify, deploy this repository with `docker-compose.coolify.yml`.

Do not create a second Coolify app for `cloudflared`. The supported contract is one compose app with the tunnel sidecar already included.

### 2. Set the environment variables

Use `.env.coolify` as the reference for Coolify environment values.

Minimum values for the Cloudflare path:

```dotenv
OPENCLAW_GATEWAY_TOKEN=<long-random-token>
CLOUDFLARE_TUNNEL_TOKEN=<your-cloudflare-tunnel-token>
OPENCLAW_PUBLIC_HOSTNAME=<your-public-hostname>
TZ=America/Chicago
DATA_MODE=volume
OPENROUTER_API_KEY=<your-key>
NVIDIA_API_KEY=<optional-if-used>
ANTHROPIC_API_KEY=<optional-if-used>
```

Important behavior from the current compose contract:

- `CLOUDFLARE_TUNNEL_TOKEN` present: `cloudflared` starts and publishes the Cloudflare hostname configured in the dashboard for `OPENCLAW_PUBLIC_HOSTNAME`.
- `CLOUDFLARE_TUNNEL_TOKEN` blank: the stack still deploys, but `cloudflared` exits immediately and the app stays private on `127.0.0.1:18789`.
- `OPENCLAW_PUBLIC_HOSTNAME` is required when `CLOUDFLARE_TUNNEL_TOKEN` is set.
- `OPENCLAW_BROWSER_CONTROL_HOST` and `OPENCLAW_BROWSER_CONTROL_BIND` stay on `127.0.0.1`, so browser control remains private.

### 3. Add persistent storage

Attach the Coolify persistent volume that backs `/data` for the `openclaw-data` volume used by `docker-compose.coolify.yml`.

That keeps gateway state, workspace data, and bootstrapped config across restarts.

### 4. Deploy

Start the Coolify deployment and allow several minutes for the first boot. The compose healthcheck grants a long startup window while the gateway initializes.

### 5. Open the app through Cloudflare

After the deployment is healthy, Access is configured, and the redirect is in place, open:

`https://<OPENCLAW_PUBLIC_HOSTNAME>`

That root URL is the supported public entry. Cloudflare should redirect it to the internal Canvas path for you.

## Verification

Run these checks on the VPS after Coolify deploys.

### Mode 1, token absent, cloud-safe private origin

Use this mode when `CLOUDFLARE_TUNNEL_TOKEN` is intentionally blank and the stack should stay private on the VPS.

#### Origin health on loopback

```bash
curl -i http://127.0.0.1:18789/healthz
```

Expected result:

- Status `200 OK`
- A short healthy response body

This proves the raw origin is up on loopback.

#### Canvas pre-auth response on loopback

```bash
curl -i http://127.0.0.1:18789/__openclaw__/canvas/
```

Expected result before Cloudflare auth:

- Status `401 Unauthorized`

That `401 Unauthorized` response is healthy here. It does not mean the route is broken. It means the Canvas endpoint is present, the gateway reached it, and the request still lacks the auth needed to enter the app. If this route were missing or miswired, you would expect a different failure such as `404` or `502`, not a clean auth challenge.

#### Sidecar should stay idle when the token is blank

If you inspect the Coolify-managed `cloudflared` container in this mode, it should exit cleanly because `CLOUDFLARE_TUNNEL_TOKEN` is unset. That is the expected cloud-safe behavior, not a restart-loop failure.

### Mode 2, token present, tunnel-enabled hostname

Use this mode when `CLOUDFLARE_TUNNEL_TOKEN` is set and Cloudflare should publish the hostname through the same-compose sidecar.

#### Confirm the private origin still works first

```bash
curl -i http://127.0.0.1:18789/healthz
curl -i http://127.0.0.1:18789/__openclaw__/canvas/
```

Expected result:

- `/healthz` returns `200 OK`
- `/__openclaw__/canvas/` returns `401 Unauthorized`

Run these before blaming Cloudflare. The tunnel can only proxy a healthy origin.

#### Check the published hostname from the command line

```bash
curl -I https://<OPENCLAW_PUBLIC_HOSTNAME>
```

Expected result:

- The request answers from Cloudflare rather than timing out at the VPS
- The response is part of the Access flow, often a redirect or challenge before login
- After you complete the browser login, Cloudflare Access prompts for `One-Time PIN` and then redirects you to the Canvas UI

The exact status can vary with Access state, but the hostname should not behave like a dead origin.

#### Check that the tunnel points at the right sidecar origin

Inspect the `cloudflared` container logs from the Coolify-managed compose stack.

Healthy signals include:

- The connector authenticates instead of reporting token errors
- The ingress target is `openclaw-gateway:18789`
- Logs show a connected tunnel rather than repeated connector restarts

If logs never show a healthy connection, fix that before testing the browser path again.

## Current contract, stated plainly

- The supported Coolify file is `docker-compose.coolify.yml`.
- The tunnel sidecar is already in that compose file.
- `CLOUDFLARE_TUNNEL_TOKEN` enables tunnel mode.
- A blank `CLOUDFLARE_TUNNEL_TOKEN` keeps the origin private on `127.0.0.1:18789`.
- Local Docker does not require Cloudflare.
- Browser control stays private and is outside the tunnel setup.
- `OPENCLAW_PUBLIC_HTTP` is not a supported switch in the active contract.

## Troubleshooting

### Missing `CLOUDFLARE_TUNNEL_TOKEN`

Symptoms:

- `OPENCLAW_PUBLIC_HOSTNAME` does not come up through Cloudflare.
- The `cloudflared` container exits right away.

Likely cause:

- `CLOUDFLARE_TUNNEL_TOKEN` is blank, pasted incorrectly, or is not a real tunnel token.

What to check:

- Confirm `CLOUDFLARE_TUNNEL_TOKEN` is set in Coolify.
- Confirm the value is the tunnel token, not a tunnel ID or unrelated API token.
- Re-run `curl -i http://127.0.0.1:18789/healthz` to confirm the private origin is still healthy while the sidecar stays idle.

Expected behavior when blank: the sidecar exits cleanly and the origin remains private. That is normal, not a crash loop.

### Hostname mismatch

Symptoms:

- Cloudflare serves a hostname other than `OPENCLAW_PUBLIC_HOSTNAME`.
- Access policy works for one hostname but your browser opens another.

Likely cause:

- The tunnel public hostname, the Access app hostname, and the URL you are testing do not all match exactly.

What to check:

- The tunnel public hostname exactly matches `OPENCLAW_PUBLIC_HOSTNAME`.
- The Access application domain matches the same hostname.
- The browser entry starts at the root hostname and the redirect sends `/` to `/__openclaw__/canvas/`.
- The tunnel service URL still targets `http://openclaw-gateway:18789`, not a host-loopback address or a different container name.

### Access not configured

Symptoms:

- The hostname is reachable without an Access login.
- You see Cloudflare routing errors or a direct app challenge instead of the Access flow.

Likely cause:

- The tunnel exists, but the Cloudflare Access application or policy was never created, is scoped to the wrong hostname, or does not allow your user.

What to check:

- A self-hosted Access app exists for `OPENCLAW_PUBLIC_HOSTNAME`.
- The login method includes `One-Time PIN`.
- The policy actually allows your test user.
- `curl -I https://<OPENCLAW_PUBLIC_HOSTNAME>` returns a Cloudflare-side response instead of hanging on origin reachability.

Remember: this repo supports the compose side and tunnel token flow. It does not auto-create the Access app or policy.

### Tunnel or log path issues

Symptoms:

- The hostname fails intermittently.
- `cloudflared` logs show auth or connector errors.
- You cannot tell whether the sidecar is even targeting the right origin.
- Coolify shows the service, but the log view is empty or you are looking at the wrong container.

Likely cause:

- The token is invalid, the tunnel no longer owns the hostname, the sidecar is pointing somewhere other than `openclaw-gateway:18789`, or you are inspecting the wrong Coolify service logs.

What to check:

- Re-copy the `CLOUDFLARE_TUNNEL_TOKEN` from the Cloudflare tunnel screen.
- Confirm the tunnel still exists and the hostname is attached to that tunnel.
- Confirm the sidecar origin remains `http://openclaw-gateway:18789`.
- Re-run the VPS loopback checks for `/healthz` and `/__openclaw__/canvas/` before blaming Cloudflare.
- In Coolify, open the `cloudflared` service logs from the same compose deployment, not the `openclaw-gateway` logs.
- If you have Docker shell access, inspect the same sidecar directly and look for connection messages plus the `openclaw-gateway:18789` origin target.

## Quick checklist

- Tunnel token created and saved as `CLOUDFLARE_TUNNEL_TOKEN`
- Public hostname set to `OPENCLAW_PUBLIC_HOSTNAME`
- `OPENCLAW_PUBLIC_HOSTNAME` is set in Coolify env vars
- Access self-hosted app created with `One-Time PIN`
- Cloudflare redirect sends `/` to `/__openclaw__/canvas/`
- Coolify env values set from `.env.coolify`
- Single compose app deployed from `docker-compose.coolify.yml`
- VPS origin returns `200 OK` for `/healthz`
- VPS origin returns `401 Unauthorized` for `/__openclaw__/canvas/`
- Browser entry uses `https://<OPENCLAW_PUBLIC_HOSTNAME>`
