---
name: Code Review Checklist
description: Structured code review covering correctness, security, performance, and maintainability
version: 1.0.0
author: Omni Unified Writing
---

# Code Review: [PR Title or Feature Name]

> [!NOTE]
> This checklist is a guide, not a bureaucratic requirement. Use judgment — a 5-line bug fix doesn't need the same rigor as a new authentication system. Focus your attention on the sections most relevant to the change.

| Field        | Value                                            |
| ------------ | ------------------------------------------------ |
| **PR**       | `#[NUMBER]`                                      |
| **Author**   | [Name]                                           |
| **Reviewer** | [Name]                                           |
| **Date**     | [YYYY-MM-DD]                                     |
| **Verdict**  | ✅ Approved / 🔄 Changes requested / ❌ Rejected |

---

## 📋 Context

**What does this change do?**

[1–3 sentences summarizing the PR from the reviewer's perspective. What problem does it solve? What is the scope?]

**Example:** _This PR adds rate limiting to the `/auth/token` endpoint using a Redis sliding window counter. It addresses INC-2024-089 where a credential stuffing attack caused 40,000 failed login attempts in 10 minutes. Scope: auth service only; no changes to other services._

**Risk level:** 🟢 Low / 🟡 Medium / 🔴 High — [Brief justification]

**Example risk assessment:** _🔴 High — Changes to authentication affect all users. A bug could lock out all users or allow unauthorized access._

> [!TIP]
> Before diving into the checklist, read the PR description and linked issue/ticket. Understanding the _intent_ of the change helps you evaluate whether the implementation achieves it. If the PR description is missing or unclear, ask the author to add one before reviewing.

---

## ✅ Correctness

- [ ] Logic is correct for the happy path
- [ ] Edge cases are handled (empty inputs, nulls, boundary values)
- [ ] Error paths are handled and don't swallow exceptions
- [ ] Concurrency issues considered (race conditions, deadlocks)
- [ ] No off-by-one errors in loops or index operations
- [ ] State mutations are intentional and safe
- [ ] Return values and error codes are appropriate
- [ ] Business logic matches the requirements in the linked ticket

**Notes:** [Specific correctness concerns or confirmations]

**Example note:** _Line 47: The sliding window counter uses `INCR` + `EXPIRE` which has a race condition — if the process crashes between the two commands, the key never expires. Use `SET key 1 EX 60 NX` + `INCR` pattern instead, or use a Lua script for atomicity._

---

## 🔒 Security

> [!IMPORTANT]
> Security issues in code review are often the last line of defense before production. Take extra time on this section for any code that handles authentication, authorization, user input, or sensitive data.

- [ ] No secrets, credentials, or PII in the diff
- [ ] User inputs are validated and sanitized before use
- [ ] SQL queries use parameterized statements (no string interpolation)
- [ ] Authentication and authorization checks are present where needed
- [ ] No new attack surface introduced (XSS, CSRF, injection)
- [ ] Sensitive data is not logged
- [ ] Dependencies added are from trusted sources and not known-vulnerable
- [ ] Rate limiting or abuse prevention considered for new endpoints

**Notes:** [Specific security observations]

**Example note:** _Line 23: The error message returns `"Invalid credentials for user: {email}"` — this confirms whether an email exists in the system. Change to generic `"Invalid credentials"` to prevent user enumeration._

---

## ⚡ Performance

- [ ] No N+1 query patterns introduced
- [ ] Database queries have appropriate indexes
- [ ] No unbounded list operations (pagination or limits applied)
- [ ] Expensive operations are not in hot paths
- [ ] Caching used appropriately (not over- or under-cached)
- [ ] Memory allocations are reasonable for expected load
- [ ] Async operations used where appropriate (don't block the event loop)

**Notes:** [Performance concerns or benchmarks if relevant]

**Example note:** _The rate limit check calls Redis on every request. At 10k RPS, this adds 10k Redis calls/second. Consider batching or using a local in-memory counter with periodic Redis sync for non-critical rate limits._

---

## 🧪 Tests

- [ ] Tests exist for the new behavior
- [ ] Tests cover at least one error/failure path
- [ ] Tests are readable and describe behavior, not implementation
- [ ] No tests deleted without justification
- [ ] Test data is realistic and covers edge cases
- [ ] Mocks are used only where necessary (not to avoid real integration)
- [ ] Tests would catch the bug this PR fixes (regression test present)

**Test coverage:** [Adequate / Needs improvement — specific gaps]

**Example:** _Coverage is adequate for the happy path. Missing: (1) test for when Redis is unavailable — should fail open or closed? (2) test for the exact boundary (100th request should succeed, 101st should fail)._

---

## 📖 Maintainability

- [ ] Code is readable without needing comments to explain "what"
- [ ] Complex logic has comments explaining "why"
- [ ] Naming is clear and consistent with codebase conventions
- [ ] Functions/methods have a single responsibility
- [ ] No dead code or commented-out blocks
- [ ] No magic numbers — constants are named
- [ ] Abstractions are at the right level (not over-engineered, not under-abstracted)
- [ ] Public API changes are documented

**Notes:** [Readability or design observations]

**Example note:** _`RateLimiter.check()` does three things: checks the limit, increments the counter, and logs the attempt. Consider splitting into `check()` and `record()` for testability and single responsibility._

---

## 🔄 Operational Readiness

- [ ] Logging is sufficient to debug production issues
- [ ] Errors include enough context (request ID, relevant IDs)
- [ ] New failure modes have alerts or monitoring
- [ ] Feature flags used for risky rollouts
- [ ] Database migrations are reversible
- [ ] Deployment order dependencies documented
- [ ] Runbook updated if new operational procedures are needed

**Example note:** _Add a metric `auth.rate_limit.triggered` with labels for `endpoint` and `ip_hash`. Without this, we can't distinguish between legitimate traffic spikes and attacks in our dashboards._

---

## 💬 Review Comments

> [!WARNING]
> Distinguish clearly between blocking issues (must fix before merge) and suggestions (nice to have). Ambiguous feedback wastes everyone's time. Use the categories below.

### Must fix (blocking)

- **[`src/auth/rate_limiter.go:47`]** — Race condition in Redis INCR + EXPIRE. Use atomic Lua script. [See Redis docs](https://redis.io/docs/manual/patterns/distributed-locks/)
- **[`src/auth/handler.go:23`]** — Error message leaks email existence. Change to generic message.

### Should fix (non-blocking)

- **[`src/auth/rate_limiter.go:12`]** — Magic number `100` should be a named constant `MaxRequestsPerMinute`
- **[`src/auth/rate_limiter_test.go`]** — Add boundary test for exactly 100 requests

### Nits (optional)

- **[`src/auth/rate_limiter.go:8`]** — `rl` is an unclear variable name; prefer `limiter`
- **[`src/auth/handler.go:31`]** — Trailing whitespace on line 31

---

## 🎯 Summary

**Verdict:** 🔄 Changes requested

[2–3 sentences. Overall assessment. What's good about this PR. What must change before merge.]

**Example:** _The approach is correct and the Redis sliding window is the right pattern for this use case. The implementation is clean and well-structured. Two blocking issues must be fixed before merge: the race condition in the Redis counter (security risk) and the user enumeration vulnerability in the error message. Once those are addressed, this is ready to ship._

---

_Reviewed: [Date] by [Reviewer]_
