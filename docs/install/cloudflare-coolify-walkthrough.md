---
summary: "Validated operator walkthrough for the Cloudflare Zero Trust + Coolify compose deployment"
read_when:
  - You want the real-world click-by-click deployment order that was actually exercised
  - You are standing up My Farm Advisor through Coolify behind Cloudflare Zero Trust
title: "Cloudflare + Coolify Walkthrough"
---

# Cloudflare + Coolify Walkthrough

This is the real-world operator walkthrough that validated the current Zero Trust deployment story for this repo. Use `docs/install/cloudflare-coolify.md` as the canonical contract and this file as the practical sequence that was actually followed.

## What this validated

- Coolify is the deployment control plane.
- `docker-compose.coolify.yml` is the supported compose entrypoint.
- Cloudflare Tunnel plus Cloudflare Access is the intended public ingress path.
- The VPS should end in a private-origin posture, not a raw public-IP posture.
- GitHub branch choice matters because Coolify deploys what the selected branch contains.

## Validated architecture

- GitHub stores the repo, compose files, docs, and the update source.
- Coolify provides sources, projects, resources, builds, logs, env vars, and redeploys.
- Cloudflare provides the public hostname, tunnel, and Access login gate.
- The gateway stays private behind the same-compose `cloudflared` sidecar.

## Before you begin

- Start from a clean VPS or another known-good Docker host.
- Have Cloudflare access for the target zone and Zero Trust area.
- Have GitHub access to the repo and deployment branch.
- Prepare your environment values before opening Coolify screens.
- Treat direct public IP access as temporary at most; the long-term path is the protected Cloudflare hostname.

## Actual operator sequence

1. Start with a clean machine and install Coolify.
2. Secure Coolify itself behind Cloudflare before you go deeper into app deployment.
3. In Cloudflare Zero Trust, create the tunnel you want to use and copy the token value.
4. Decide the public hostname or subdomain you want users to open.
5. In Coolify, add the GitHub source for this repo.
6. Create the project and resource that point at the correct repo and deployment branch.
7. Use Docker Compose mode and set the compose file path to `docker-compose.coolify.yml`.
8. Paste the environment values in Coolify, typically through the developer view so the full set is easier to manage.
9. Load the compose file and start the deployment.
10. Watch logs live until the gateway and `cloudflared` settle.
11. Open the protected hostname, complete the Cloudflare Access login, and confirm the dashboard root loads.
12. Remove any temporary direct Coolify public domain or raw public-IP path so Cloudflare remains the only public entry.

## Cloudflare details that mattered in practice

- The tunnel token is the value after `--token`; that is what belongs in `CLOUDFLARE_TUNNEL_TOKEN`.
- The public hostname is a subdomain route published through Cloudflare, not a raw IP bookmark.
- The service type is `HTTP` and the service target stays `http://openclaw-gateway:18789` inside the compose network.
- The login path used in practice was Cloudflare Access with `One-Time PIN` by email.
- A secondary pinned hostname can reuse the same tunnel target and the same Access policy shape, but any browser-visible hostname still needs an exact allowed origin in `gateway.controlUi.allowedOrigins`.

## Coolify details that mattered in practice

- The resource must point at the correct branch because Coolify deploys what that branch contains.
- The exact compose filename matters; the validated file is `docker-compose.coolify.yml`.
- Environment-variable edits are not live until you save them and redeploy.
- Logs are the first troubleshooting surface; turn on live log streaming during the first deploy.
- A temporary `bad gateway` during warmup does not necessarily mean the deploy failed; check whether the origin and sidecar are still coming up.

## Final Zero Trust posture

This is the state you want after the walkthrough is complete:

- users open `https://<OPENCLAW_PUBLIC_HOSTNAME>/`
- Cloudflare Access is the only public login layer
- the tunnel is the only public ingress path
- `docker-compose.coolify.yml` still binds the gateway to `127.0.0.1:18789:18789`
- direct Coolify public exposure and raw-IP `http://` access are turned off
- Git remains the durable source of truth for updates, not ad hoc server changes

## What to verify after cutover

- Coolify shows a healthy deployment instead of a stuck build.
- `cloudflared` logs show a connected tunnel when the token is set.
- `https://<OPENCLAW_PUBLIC_HOSTNAME>` reaches Cloudflare and then the dashboard root after Access login.
- Chat, skills, agents, and usage pages all load once inside the app.
- Any environment-variable change is followed by an intentional redeploy.

## Common pitfalls from the walkthrough

- starting before the full env var set is ready
- using the wrong compose filename
- forgetting that branch selection controls what gets deployed
- changing env vars without redeploying
- trusting stale logs instead of live log output
- leaving a direct public path enabled after Cloudflare is healthy

## Relationship to the canonical runbook

- Use `docs/install/cloudflare-coolify.md` for the supported contract and exact guardrails.
- Use this walkthrough when you want the validated real-world operator order.
- If they ever diverge, update the canonical runbook first and then refresh this walkthrough to match it.
