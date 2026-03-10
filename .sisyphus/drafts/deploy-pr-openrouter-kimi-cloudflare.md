# Draft: Deploy PR + OpenRouter Kimi + Public HTML Reports

## Requirements (confirmed)
- Create a PR that summarizes what is done so far and what remains for deployment.
- Include exact GitHub Actions secrets and step-by-step setup instructions.
- Deploy tonight on Cloudflare with R2 as the file bucket.
- Use OpenRouter as the backend API with Kimi K2.5 only for now.
- Target custom domain: `my-farm-advisor.superiorbyteworks.com`.
- Add Telegram channel setup instructions so the agent can message the user.
- Add publicly shareable report links for self-contained single HTML files.
- Public link should be open (no auth yet), but must expose only the intended file path.
- Source files are generated under `data/moltbot/...` and persisted via R2.

## Research Findings
- Existing CI workflow: `.github/workflows/test.yml` (tests + e2e), no production deploy workflow yet.
- R2 binding already exists in `wrangler.jsonc` as `MOLTBOT_BUCKET` to bucket `moltbot-data`.
- Public vs protected routing is clearly separated in `src/index.ts`.
- Public route extension point is `src/routes/public.ts`.
- Protected API/admin routes are behind Cloudflare Access middleware.
- Report artifacts already exist in repository data paths under grower/farm derived reports.
- OpenRouter Kimi model reference found: `moonshotai/kimi-k2.5` (to be used via OpenClaw/OpenRouter configuration).

## Technical Decisions (current)
- Prefer path-based public report endpoint over query-only style for stronger validation and caching.
- Keep report exposure tightly scoped to HTML-only objects under a strict R2 prefix.
- Keep all other R2/object paths private.
- Test strategy: **Tests-after** (not strict TDD).
- Report delivery mode: **inline view**.
- Deploy workflow trigger for tonight: **manual-only (`workflow_dispatch`)**.

## Scope Boundaries
- INCLUDE:
  - PR plan + PR body draft content
  - GitHub Actions deployment/secrets setup instructions
  - Cloudflare custom domain setup steps
  - Telegram bot onboarding steps
  - Public report-link route planning with guardrails
- EXCLUDE:
  - Implementing code changes directly
  - Enabling auth for public report links in this phase
  - Multi-provider AI routing (future: other OpenRouter models/NVIDIA NIM)

## Open Questions
- Should the public report path omit `{file}` and always map to a canonical filename (for example `report.html`), or keep `{file}.html` in the URL?
