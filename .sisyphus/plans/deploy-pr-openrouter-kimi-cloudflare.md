# Deploy Tonight: PR + OpenRouter Kimi + Cloudflare Domain + Public HTML Reports

## TL;DR

> **Quick Summary**: Prepare and ship a deployment-focused PR that adds production deployment workflow, OpenRouter-only runtime configuration (Kimi K2.5), custom-domain rollout steps, Telegram onboarding instructions, and a tightly-scoped public report URL that serves only canonical farm HTML reports from R2.
>
> **Deliverables**:
> - Deployment PR draft (ready to paste into GitHub PR)
> - Exact GitHub Actions and runtime secrets matrix with step-by-step setup
> - Manual-only deploy workflow for tonight (`workflow_dispatch`)
> - Public report endpoint design + implementation tasks + hard security guardrails
> - Domain mapping checklist for `my-farm-advisor.superiorbyteworks.com`
>
> **Estimated Effort**: Large
> **Parallel Execution**: YES - 4 waves + final verification wave
> **Critical Path**: T1 → T6 → T8 → T10 → F1-F4

---

## Context

### Original Request
Create a PR now that captures what is already done and what remains, include exact GitHub Actions secrets and setup steps, deploy tonight to Cloudflare + R2, lock backend to OpenRouter with Kimi K2.5 only, configure domain `my-farm-advisor.superiorbyteworks.com`, provide Telegram setup instructions, and expose downloadable/shareable self-contained single HTML reports via an open link while exposing nothing else.

### Interview Summary
**Key Discussions**:
- Test strategy selected: **Tests-after**.
- Public report URL style selected: **path-based** (not query-only).
- Report response mode selected: **inline** rendering.
- Deploy trigger selected for tonight: **manual-only** (`workflow_dispatch`).
- Public report mapping selected: **canonical filename per farm** (no user-supplied filename in URL).

**Research Findings**:
- Existing CI workflow (`.github/workflows/test.yml`) does not include production deploy workflow.
- R2 binding already exists in `wrangler.jsonc` as `MOLTBOT_BUCKET`.
- Public/protected route split already exists; safest extension point is `src/routes/public.ts`.
- Report outputs already follow grower/farm-derived structure under `data/moltbot/.../derived/reports/`.
- OpenRouter model reference to use: `moonshotai/kimi-k2.5` via OpenClaw model id `openrouter/moonshotai/kimi-k2.5`.

### Metis Review
**Identified Gaps (addressed in this plan)**:
- Explicitly lock public endpoint security scope (path traversal, html-only, fixed prefix, no listing).
- Add deployment rollback and post-deploy smoke checks.
- Explicitly prevent scope creep (no auth hardening for public report link in this phase, no PDF, no analytics).
- Make acceptance criteria command-verifiable (no human-only checks).

---

## Work Objectives

### Core Objective
Ship a single PR that allows safe, controlled production deployment tonight with OpenRouter Kimi-only runtime, domain readiness steps, and a minimal public HTML report exposure path constrained to canonical per-farm output.

### Concrete Deliverables
- `.github/workflows/deploy.yml` (manual deployment)
- Runtime + CI secrets documentation updates in `README.md`
- OpenRouter/Kimi-only runtime env + docs updates (where required)
- Public report route implementation plan in `src/routes/public.ts` (+ tests)
- PR body draft file under `.sisyphus/drafts/` for final paste

### Definition of Done
- [ ] Manual deploy workflow exists and can be dispatched from GitHub Actions.
- [ ] Secrets checklist explicitly lists required names, purpose, and source.
- [ ] Runtime config documents OpenRouter + Kimi K2.5 as the only active backend.
- [ ] Public endpoint serves only canonical HTML report for valid grower/farm and rejects all invalid access patterns.
- [ ] Domain setup steps for `my-farm-advisor.superiorbyteworks.com` are documented and verifiable.

### Must Have
- Exact secret names and setup order for both GitHub Actions and Cloudflare runtime.
- Public report endpoint open (no auth) but strongly constrained to one canonical report path per farm.
- Telegram onboarding instructions for bot creation + token setup + verification.
- PR content includes “what’s done”, “what remains tonight”, and “post-merge deploy runbook”.

### Must NOT Have (Guardrails)
- No broad public file browser or directory listing.
- No exposure of non-HTML files or arbitrary R2 keys.
- No addition of non-OpenRouter model providers in this phase.
- No authentication redesign for public report link in this phase.
- No PDF/report generation redesign (serve existing output only).

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Vitest + existing workflows)
- **Automated tests**: Tests-after
- **Framework**: Vitest (`npm test`)

### QA Policy
Every task below includes explicit agent-executed QA scenarios and evidence output under `.sisyphus/evidence/`.

- **Frontend/UI**: Playwright when route/browser behavior must be verified.
- **API/Backend**: Bash + curl assertions for status/body/headers.
- **Workflow/Config**: YAML + command validation and gh/wrangler dry checks where feasible.

---

## Execution Strategy

### Parallel Execution Waves

Wave 1 (Start Immediately — discovery lock + scaffolding):
- T1: Baseline deployment/state audit + “done so far” inventory
- T2: Secrets matrix (CI + runtime) and source-of-truth table
- T3: OpenRouter/Kimi-only runtime contract updates
- T4: Telegram onboarding runbook draft
- T5: Domain/DNS + Cloudflare custom-domain rollout checklist

Wave 2 (After Wave 1 — implementation pieces in parallel):
- T6: Create manual deploy workflow (`workflow_dispatch`)
- T7: README updates for secrets + deploy tonight sequence
- T8: Public report route implementation with strict path confinement
- T9: Add/extend tests for report route security and behavior

Wave 3 (After Wave 2 — PR packaging + operational checks):
- T10: Compose PR body (wrighter-style quality) with done/remaining/deploy plan
- T11: Post-merge deployment runbook (rollback + smoke tests)
- T12: End-to-end staging verification on workers.dev/custom-domain target

Wave 4 (After Wave 3 — tighten + finalize):
- T13: Scope-fidelity pass (remove creep)
- T14: Security-hardening pass for public report route boundaries
- T15: Final plan-to-implementation traceability check

Wave FINAL (Independent review, all parallel):
- F1: Plan compliance audit (oracle)
- F2: Code quality review
- F3: Real manual QA scenario execution (agent-run)
- F4: Scope fidelity check (deep)

Critical Path: T1 → T6 → T8 → T10 → F1-F4

### Dependency Matrix
- T1: — → T10, T11
- T2: — → T6, T7, T10
- T3: — → T7, T10
- T4: — → T7, T10
- T5: — → T7, T11, T12
- T6: T2 → T12, T15
- T7: T2,T3,T4,T5 → T10, T11, T15
- T8: T1 → T9, T12, T14
- T9: T8 → T12, T15
- T10: T1,T2,T3,T4,T7 → T15
- T11: T1,T5,T7 → T15
- T12: T5,T6,T8,T9 → T15
- T13: T10,T11,T12 → T15
- T14: T8,T9 → T15
- T15: T6,T7,T9,T10,T11,T12,T13,T14 → FINAL

### Agent Dispatch Summary
- Wave 1: T1 `unspecified-high`, T2 `quick`, T3 `unspecified-high`, T4 `writing`, T5 `quick`
- Wave 2: T6 `quick`, T7 `writing`, T8 `unspecified-high`, T9 `deep`
- Wave 3: T10 `writing` (+ `wrighter` skill), T11 `writing`, T12 `unspecified-high`
- Wave 4: T13 `deep`, T14 `unspecified-high`, T15 `deep`
- Final: F1 `oracle`, F2 `unspecified-high`, F3 `unspecified-high`, F4 `deep`

---

## TODOs

- [x] 1. Baseline inventory: what is already done vs missing for production deploy

  **What to do**:
  - Audit current workflows, wrangler config, route exposure, and secrets references.
  - Produce a concise “done so far / missing tonight” inventory used by PR narrative.

  **Must NOT do**:
  - Do not change behavior yet.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high` (cross-cutting audit)
  - **Skills**: `git-master` (history/diff framing)

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T10, T11
  - **Blocked By**: None

  **References**:
  - `.github/workflows/test.yml` — current CI baseline.
  - `wrangler.jsonc` — runtime bindings and routes baseline.
  - `src/index.ts` + `src/routes/public.ts` — current public/protected split.

  **Acceptance Criteria**:
  - [ ] Inventory doc section drafted with exact file references.

  **QA Scenarios**:
  ```
  Scenario: Audit baseline successfully
    Tool: Bash
    Steps:
      1. Run git status --short --branch
      2. Read workflow + wrangler + route files
      3. Produce inventory markdown summary
    Expected Result: Clear done/missing list with file paths
    Evidence: .sisyphus/evidence/task-1-baseline-audit.md

  Scenario: Missing file detection
    Tool: Bash
    Steps:
      1. Validate each referenced file path exists
      2. Flag any nonexistent reference
    Expected Result: Zero missing references or explicit correction list
    Evidence: .sisyphus/evidence/task-1-reference-check.txt
  ```

- [x] 2. Build exact secrets matrix for GitHub Actions + Cloudflare runtime

  **What to do**:
  - Create definitive secrets table grouped as CI deploy vs runtime secrets.
  - Include exact secret names, purpose, where to obtain each value, and set order.

  **Must NOT do**:
  - Do not include secret values.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `wrighter`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T6, T7, T10
  - **Blocked By**: None

  **References**:
  - `README.md` (all secrets section)
  - `.github/workflows/test.yml` (existing secrets usage)
  - `src/types.ts` (declared env surface)

  **Acceptance Criteria**:
  - [ ] Matrix includes at minimum: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `OPENROUTER_API_KEY`, `MOLTBOT_GATEWAY_TOKEN`, `CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CF_ACCOUNT_ID`, `TELEGRAM_BOT_TOKEN`.

  **QA Scenarios**:
  ```
  Scenario: Secret names complete
    Tool: Bash
    Steps:
      1. Compare matrix names with grep hits in README/workflow/types
      2. Confirm no required runtime secret is omitted
    Expected Result: Full coverage confirmed
    Evidence: .sisyphus/evidence/task-2-secrets-coverage.txt

  Scenario: Sensitive data leak prevention
    Tool: Bash
    Steps:
      1. Scan output docs for key-like patterns (sk-, token bodies)
      2. Verify only variable names are present
    Expected Result: No literal credential values
    Evidence: .sisyphus/evidence/task-2-no-secrets-leak.txt
  ```

- [x] 3. Lock OpenRouter + Kimi K2.5-only runtime configuration path

  **What to do**:
  - Document and implement config path that activates only `openrouter/moonshotai/kimi-k2.5`.
  - Mark other providers as future roadmap, not active now.

  **Must NOT do**:
  - Do not add multi-provider fallback in this phase.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `wrighter`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T7, T10
  - **Blocked By**: None

  **References**:
  - `start-openclaw.sh` (provider env injection behavior)
  - `src/gateway/env.ts` (container env composition)
  - `README.md` AI provider sections

  **Acceptance Criteria**:
  - [ ] Docs/config show OpenRouter key requirement and Kimi model id explicitly.

  **QA Scenarios**:
  ```
  Scenario: Model id correctly wired
    Tool: Bash
    Steps:
      1. Search config/docs for openrouter/moonshotai/kimi-k2.5
      2. Verify no conflicting default provider remains as active instruction
    Expected Result: Kimi path is primary and explicit
    Evidence: .sisyphus/evidence/task-3-model-config.txt

  Scenario: Unsupported provider scope creep blocked
    Tool: Bash
    Steps:
      1. Check changes for newly introduced provider fallback logic
      2. Validate none added in this phase
    Expected Result: No new multi-provider logic
    Evidence: .sisyphus/evidence/task-3-scope-guard.txt
  ```

- [ ] 4. Create Telegram onboarding steps for agent account setup

  **What to do**:
  - Add step-by-step BotFather flow, token retrieval, and wrangler secret setup.
  - Include verification steps for DM pairing/open policy behavior.

  **Must NOT do**:
  - Do not include real bot token in docs.

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `wrighter`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T7, T10
  - **Blocked By**: None

  **References**:
  - `README.md` Optional: Chat Channels > Telegram
  - `.github/workflows/test.yml` telegram matrix env pattern

  **Acceptance Criteria**:
  - [ ] Onboarding section includes: create bot, copy token, set `TELEGRAM_BOT_TOKEN`, deploy, DM bot, verify pairing.

  **QA Scenarios**:
  ```
  Scenario: Telegram setup steps executable
    Tool: Bash
    Steps:
      1. Follow documented commands in dry-run order
      2. Confirm each command has expected input/output guidance
    Expected Result: No missing prerequisite or ambiguous step
    Evidence: .sisyphus/evidence/task-4-telegram-runbook.md

  Scenario: Token leakage check
    Tool: Bash
    Steps:
      1. Search docs for hardcoded token-like values
      2. Ensure placeholders only
    Expected Result: No credential values committed
    Evidence: .sisyphus/evidence/task-4-no-token-leak.txt
  ```

- [ ] 5. Define custom-domain rollout checklist for my-farm-advisor.superiorbyteworks.com

  **What to do**:
  - Document exact Cloudflare dashboard steps for worker custom domain binding.
  - Include DNS/SSL propagation checks and rollback path.

  **Must NOT do**:
  - Do not automate DNS mutations in this phase.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `wrighter`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1
  - **Blocks**: T7, T11, T12
  - **Blocked By**: None

  **References**:
  - `wrangler.jsonc` routes/custom-domain compatibility
  - Cloudflare Workers custom domain docs

  **Acceptance Criteria**:
  - [ ] Checklist includes attach domain, verify certificate, curl smoke test, rollback route removal.

  **QA Scenarios**:
  ```
  Scenario: Domain checklist completeness
    Tool: Bash
    Steps:
      1. Validate every step has expected result and owner action
      2. Confirm rollback section exists
    Expected Result: End-to-end domain runbook with rollback
    Evidence: .sisyphus/evidence/task-5-domain-checklist.md

  Scenario: Missing DNS precondition handling
    Tool: Bash
    Steps:
      1. Verify runbook contains branch for DNS not yet configured
      2. Confirm fallback workers.dev verification path
    Expected Result: Operator can continue safely without guesswork
    Evidence: .sisyphus/evidence/task-5-dns-fallback.md
  ```

- [ ] 6. Add manual production deployment workflow (`workflow_dispatch`)

  **What to do**:
  - Create `.github/workflows/deploy.yml` with manual trigger only.
  - Include build, deploy, and smoke-check stages.
  - Use GitHub secrets for Cloudflare auth.

  **Must NOT do**:
  - Do not enable auto deploy on push in this phase.

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12, T15
  - **Blocked By**: T2

  **References**:
  - `.github/workflows/test.yml` (repo style conventions)
  - Cloudflare `wrangler-action` docs
  - `package.json` deploy script

  **Acceptance Criteria**:
  - [ ] Workflow visible in GitHub Actions and dispatchable manually.

  **QA Scenarios**:
  ```
  Scenario: Workflow schema valid
    Tool: Bash
    Steps:
      1. Lint yaml syntax
      2. Confirm `on.workflow_dispatch` exists and no push trigger exists
    Expected Result: Valid YAML with manual-only trigger
    Evidence: .sisyphus/evidence/task-6-workflow-validate.txt

  Scenario: Missing secret failure is explicit
    Tool: Bash
    Steps:
      1. Review workflow steps for required secrets precheck
      2. Verify clear error message path
    Expected Result: Early, actionable failure on missing secrets
    Evidence: .sisyphus/evidence/task-6-secret-guard.txt
  ```

- [ ] 7. Update README with exact “deploy tonight” runbook and secret setup order

  **What to do**:
  - Add a dedicated section: prerequisites, exact secret names, setup sequence, deploy sequence, and smoke tests.
  - Align with manual workflow and OpenRouter/Kimi-only decision.

  **Must NOT do**:
  - Do not duplicate conflicting legacy instructions without clearly marking deprecated/future.

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `wrighter`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T10, T11, T15
  - **Blocked By**: T2, T3, T4, T5

  **References**:
  - `README.md` existing setup sections
  - Results from T2-T5

  **Acceptance Criteria**:
  - [ ] Operator can execute from zero to deployed using only this section.

  **QA Scenarios**:
  ```
  Scenario: Runbook linearity
    Tool: Bash
    Steps:
      1. Validate every command has precondition and expected result
      2. Confirm order prevents dependency dead-ends
    Expected Result: No circular or ambiguous step ordering
    Evidence: .sisyphus/evidence/task-7-runbook-linearity.md

  Scenario: Drift check against workflow
    Tool: Bash
    Steps:
      1. Compare README secret list with deploy.yml referenced secrets
      2. Flag mismatch
    Expected Result: 1:1 secret naming consistency
    Evidence: .sisyphus/evidence/task-7-readme-workflow-sync.txt
  ```

- [ ] 8. Implement constrained public report endpoint (canonical per farm)

  **What to do**:
  - Add public route in `src/routes/public.ts` using canonical mapping:
    `/single-page-html/grower/:growerId/farm/:farmId`.
  - Resolve to fixed report file key under strict prefix (no user filename input), defaulting to canonical filename `report.html` (single source constant).
  - Enforce html-only response + security headers + no listing.

  **Must NOT do**:
  - Do not expose arbitrary file keys, wildcard filenames, or directory indexes.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T9, T12, T14
  - **Blocked By**: T1

  **References**:
  - `src/index.ts` route mounting order
  - `src/routes/public.ts` existing public route patterns
  - `src/types.ts` R2 binding env type
  - report path conventions under `data/moltbot/growers/.../derived/reports/`

  **Acceptance Criteria**:
  - [ ] Valid grower/farm returns canonical HTML from R2 with `Content-Type: text/html; charset=utf-8`.
  - [ ] Invalid grower/farm/path traversal/non-canonical routes return non-200 and no sensitive path leaks.

  **QA Scenarios**:
  ```
  Scenario: Happy path report retrieval
    Tool: Bash (curl)
    Steps:
      1. GET /single-page-html/grower/iowa-demo-grower/farm/iowa-demo-farm
      2. Assert HTTP 200
      3. Assert Content-Type contains text/html
      4. Assert body includes <!doctype html or <html
    Expected Result: Canonical farm HTML served inline
    Evidence: .sisyphus/evidence/task-8-happy-report-response.txt

  Scenario: Traversal and invalid path blocked
    Tool: Bash (curl)
    Steps:
      1. GET /single-page-html/grower/../../etc/farm/passwd
      2. GET /single-page-html/grower/iowa-demo-grower/farm/iowa-demo-farm/extra
      3. Assert non-200 and sanitized error response
    Expected Result: Requests blocked without internal path disclosure
    Evidence: .sisyphus/evidence/task-8-invalid-path-blocked.txt
  ```

- [ ] 9. Add tests for public report route behavior and security boundaries

  **What to do**:
  - Add/extend Vitest cases for valid route, invalid IDs, traversal attempts, missing object, and header assertions.

  **Must NOT do**:
  - Do not rely on manual-only verification for route security.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2
  - **Blocks**: T12, T15
  - **Blocked By**: T8

  **References**:
  - Existing test patterns in `src/gateway/*.test.ts` and auth tests
  - New route logic in `src/routes/public.ts`

  **Acceptance Criteria**:
  - [ ] `npm test` passes with new route tests included.

  **QA Scenarios**:
  ```
  Scenario: Positive route test passes
    Tool: Bash
    Steps:
      1. Run targeted test file for report route
      2. Assert success count > 0 and failures = 0
    Expected Result: Happy-path test passing
    Evidence: .sisyphus/evidence/task-9-positive-tests.txt

  Scenario: Negative security tests pass
    Tool: Bash
    Steps:
      1. Run traversal/nonexistent/non-html test cases
      2. Assert expected status codes and error body constraints
    Expected Result: All defensive cases passing
    Evidence: .sisyphus/evidence/task-9-negative-tests.txt
  ```

- [ ] 10. Draft high-quality PR description (“what’s done”, “what remains”, “tonight deploy plan”)

  **What to do**:
  - Produce PR body with executive summary, completed work, remaining tasks, required secrets, and deploy steps.
  - Include copy-paste checklist for GitHub Actions Secrets.

  **Must NOT do**:
  - Do not use vague placeholders for required secret names.

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `wrighter`, `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: T15
  - **Blocked By**: T1, T2, T3, T4, T7

  **References**:
  - Outputs from T1-T7
  - Recent commits (`git log`) for “what’s done so far” section

  **Acceptance Criteria**:
  - [ ] PR body includes exact sections: Summary, Done, Remaining Tonight, Secrets Checklist, Deploy Steps, Rollback.

  **QA Scenarios**:
  ```
  Scenario: PR body completeness
    Tool: Bash
    Steps:
      1. Validate required headings exist
      2. Verify each secret has exact variable name + source + usage
    Expected Result: No missing deployment-critical section
    Evidence: .sisyphus/evidence/task-10-pr-body-checklist.md

  Scenario: Ambiguity check
    Tool: Bash
    Steps:
      1. Scan for non-actionable wording ("set this up", "configure as needed")
      2. Replace with explicit step-by-step instructions
    Expected Result: Fully operator-executable PR instructions
    Evidence: .sisyphus/evidence/task-10-ambiguity-scan.txt
  ```

- [ ] 11. Create post-merge deployment runbook (including rollback)

  **What to do**:
  - Define exact post-merge sequence: set/verify secrets, dispatch workflow, check logs, validate domain, rollback.

  **Must NOT do**:
  - Do not omit rollback criteria and stop conditions.

  **Recommended Agent Profile**:
  - **Category**: `writing`
  - **Skills**: `wrighter`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: T15
  - **Blocked By**: T1, T5, T7

  **References**:
  - deploy workflow from T6
  - domain checklist from T5

  **Acceptance Criteria**:
  - [ ] Runbook includes rollback trigger table and recovery commands.

  **QA Scenarios**:
  ```
  Scenario: Runbook dry-run simulation
    Tool: Bash
    Steps:
      1. Execute sequence as checklist simulation
      2. Confirm each step has pass/fail branch
    Expected Result: Deterministic deploy/rollback flow
    Evidence: .sisyphus/evidence/task-11-runbook-simulation.md

  Scenario: Rollback viability
    Tool: Bash
    Steps:
      1. Validate rollback references existing commands/routes/workflow state
      2. Confirm no undefined rollback action
    Expected Result: Rollback can be executed without improvisation
    Evidence: .sisyphus/evidence/task-11-rollback-check.txt
  ```

- [ ] 12. Execute staging-style smoke verification for deploy + public route

  **What to do**:
  - Validate deployment pipeline and key endpoints on target environment.
  - Verify domain and report endpoint behaviors with curl checks.

  **Must NOT do**:
  - Do not mark complete without evidence files for both happy and failure paths.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `playwright`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3
  - **Blocks**: T13, T15
  - **Blocked By**: T5, T6, T8, T9

  **References**:
  - T6 workflow outputs
  - T8 route specification
  - T9 test suite

  **Acceptance Criteria**:
  - [ ] Smoke checks pass for domain root, admin/API guarded routes, and public report endpoint.

  **QA Scenarios**:
  ```
  Scenario: Happy-path deployment smoke
    Tool: Bash (curl)
    Steps:
      1. GET domain root and health/status endpoint
      2. GET valid public report URL
      3. Assert expected status and headers
    Expected Result: Deployment reachable and report endpoint operational
    Evidence: .sisyphus/evidence/task-12-smoke-happy.txt

  Scenario: Guarded/prohibited access check
    Tool: Bash (curl)
    Steps:
      1. Attempt unauthorized protected route access
      2. Attempt invalid report route variants
      3. Assert rejection codes
    Expected Result: Protected routes remain protected; invalid public requests rejected
    Evidence: .sisyphus/evidence/task-12-smoke-negative.txt
  ```

- [ ] 13. Scope-fidelity pass (remove out-of-scope changes)

  **What to do**:
  - Compare actual diffs against Must Have / Must NOT Have constraints.
  - Remove any accidental additions (analytics, extra public routes, provider expansion).

  **Must NOT do**:
  - Do not leave unplanned changes in final PR.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: T15
  - **Blocked By**: T10, T11, T12

  **References**:
  - This plan’s Must Have/Must NOT Have sections
  - `git diff` staged + unstaged

  **Acceptance Criteria**:
  - [ ] No scope creep remains.

  **QA Scenarios**:
  ```
  Scenario: Must-NOT-Have compliance
    Tool: Bash
    Steps:
      1. Search diff for out-of-scope patterns
      2. Cross-check with guardrail list
    Expected Result: Zero violations
    Evidence: .sisyphus/evidence/task-13-scope-compliance.txt

  Scenario: Unaccounted file check
    Tool: Bash
    Steps:
      1. List changed files
      2. Verify each file maps to a planned task
    Expected Result: No orphaned/unplanned file changes
    Evidence: .sisyphus/evidence/task-13-file-accounting.txt
  ```

- [ ] 14. Security boundary hardening review for public report endpoint

  **What to do**:
  - Re-check input validation, key construction, headers, error response safety.
  - Ensure no accidental wildcard behavior or alternate path bypass.

  **Must NOT do**:
  - Do not relax guardrails for convenience.

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: `git-master`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4
  - **Blocks**: T15
  - **Blocked By**: T8, T9

  **References**:
  - `src/routes/public.ts` new route logic
  - tests from T9

  **Acceptance Criteria**:
  - [ ] Validation and response-hardening checklist fully satisfied.

  **QA Scenarios**:
  ```
  Scenario: Header and content safety
    Tool: Bash (curl)
    Steps:
      1. Request valid report route
      2. Assert headers: Content-Type text/html, X-Content-Type-Options nosniff
    Expected Result: Browser-safe serving with explicit headers
    Evidence: .sisyphus/evidence/task-14-header-safety.txt

  Scenario: Alternate-path bypass attempt
    Tool: Bash (curl)
    Steps:
      1. Try encoded traversal (%2e%2e), duplicate slashes, trailing extras
      2. Assert non-200 responses
    Expected Result: No bypass of canonical route constraints
    Evidence: .sisyphus/evidence/task-14-bypass-blocked.txt
  ```

- [ ] 15. Final traceability check (plan requirements ↔ PR content ↔ code/workflows/tests)

  **What to do**:
  - Build matrix mapping each requirement to specific file/section/evidence.
  - Ensure PR description, docs, workflow, route, and tests are all aligned.

  **Must NOT do**:
  - Do not close with unresolved requirement mapping.

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: `git-master`, `wrighter`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (final task)
  - **Blocks**: FINAL wave
  - **Blocked By**: T6, T7, T9, T10, T11, T12, T13, T14

  **References**:
  - Full plan + all task evidence files
  - Changed files list and PR draft

  **Acceptance Criteria**:
  - [ ] 100% requirement-to-artifact mapping completed.

  **QA Scenarios**:
  ```
  Scenario: Requirement mapping complete
    Tool: Bash
    Steps:
      1. Enumerate all user requirements
      2. Link each to exact file path + evidence output
    Expected Result: No unmapped requirement
    Evidence: .sisyphus/evidence/task-15-traceability-matrix.md

  Scenario: Contradiction detection
    Tool: Bash
    Steps:
      1. Compare README instructions vs workflow behavior vs PR text
      2. Flag and resolve discrepancies
    Expected Result: Zero contradictory instructions
    Evidence: .sisyphus/evidence/task-15-consistency-check.txt
  ```

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Verify all Must Have/Must NOT Have items against changed files, commands, and evidence.

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run lint/type/tests and detect slop or unsafe patterns in changed areas.

- [ ] F3. **Real Manual QA** — `unspecified-high`
  Execute all QA scenarios from tasks and confirm evidence files exist.

- [ ] F4. **Scope Fidelity Check** — `deep`
  Confirm 1:1 match between planned scope and actual changes.

---

## Commit Strategy

- Commit 1: `ci(deploy): add manual production deploy workflow`
- Commit 2: `docs(deploy): add secrets and rollout runbook`
- Commit 3: `feat(reports): add constrained public html report endpoint`
- Commit 4: `test(reports): add route security and behavior coverage`
- Commit 5: `docs(pr): add deployment PR body draft`

---

## Success Criteria

### Verification Commands
```bash
npm run lint
npm run typecheck
npm test
```

### Final Checklist
- [ ] All required secrets documented with exact names and source steps
- [ ] Manual deploy workflow dispatchable
- [ ] OpenRouter Kimi-only runtime path documented and validated
- [ ] Public report route serves canonical html only and blocks invalid paths
- [ ] PR content includes done/remaining/deploy tonight sections
