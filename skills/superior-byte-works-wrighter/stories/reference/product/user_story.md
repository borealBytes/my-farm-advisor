---
name: User Story
description: Agile user story with acceptance criteria, UI/UX notes, and definition of done
version: 1.0.0
author: Omni Unified Writing
standard: Agile / Scrum
---

# User Story: [Short Title]

> [!NOTE]
> A user story captures a unit of user value, not a technical task. Write from the user's perspective. The story is a placeholder for a conversation — acceptance criteria are the output of that conversation, not a substitute for it.

> **ID:** US-[NNN] · **Epic:** [Epic Name] · **Sprint:** [Sprint #]  
> **Author:** [Name] · **Assignee:** [Name]  
> **Status:** Backlog | Ready | In Progress | Done  
> **Story Points:** [1 / 2 / 3 / 5 / 8 / 13]

**Example header:**

> **ID:** US-142 · **Epic:** Checkout Redesign · **Sprint:** Sprint 24  
> **Author:** Priya Nair · **Assignee:** Tom Okafor  
> **Status:** Ready  
> **Story Points:** 5

---

## 📖 Story

**As a** [type of user / persona],  
**I want to** [perform some action or achieve some goal],  
**So that** [I receive some benefit or value].

**Example:**

**As a** returning customer,  
**I want to** save my payment method after checkout,  
**So that** I don't have to re-enter my card details on future purchases.

> [!TIP]
> The "so that" clause is the most important part — it explains the _why_. If you can't articulate the benefit, the story may not be worth building. Weak: "so that it works." Strong: "so that I can complete checkout in under 30 seconds."

---

## 🎯 Context & Motivation

[2–4 sentences. Why does this story matter now? What triggers the need? What is the user's current situation and the friction they face?]

**Example:** Currently, returning customers must re-enter their full card details on every purchase, leading to a 23% cart abandonment rate at the payment step (Analytics, Q1 2025). Competitors (Shopify, Amazon) offer one-click checkout. This story is the first step toward reducing checkout friction — saving the payment method — which unblocks the one-click checkout epic in Q3.

---

## ✅ Acceptance Criteria

> [!IMPORTANT]
> Acceptance criteria are the contract between product and engineering. They must be testable, unambiguous, and agreed upon before development starts. Use Given/When/Then format for precision.

> Format: **Given** [precondition] **When** [action] **Then** [outcome]

- [ ] **AC-01:** Given [state], when [event], then [expected result].
- [ ] **AC-02:** Given [state], when [event], then [expected result].
- [ ] **AC-03:** Given [state], when [event], then [expected result].
- [ ] **AC-04 (Edge):** Given [edge condition], when [event], then [safe fallback].
- [ ] **AC-05 (Error):** Given [invalid input], when [event], then [error message shown].

**Example criteria:**

- [ ] **AC-01:** Given I am logged in and have completed a purchase, when I check "Save this card for future purchases," then my card is saved and appears in "My Payment Methods" on my next visit.
- [ ] **AC-02:** Given I have a saved card, when I reach the payment step on a new order, then my saved card is pre-selected and I only need to enter my CVV.
- [ ] **AC-03:** Given I have multiple saved cards, when I view the payment step, then I can select any saved card from a dropdown.
- [ ] **AC-04 (Edge):** Given I have a saved card that has expired, when I reach the payment step, then the expired card is shown with an "Expired" badge and I am prompted to add a new card.
- [ ] **AC-05 (Error):** Given the card tokenization service is unavailable, when I check "Save this card," then the purchase completes successfully but the card is not saved, and I see a non-blocking toast: "Card could not be saved — you can add it later in Account Settings."
- [ ] **AC-06 (Security):** Given I am logged in, when I view saved cards, then I see only the last 4 digits and card type — never the full card number.

---

## 🔗 Dependencies

| Dependency                 | Type                  | Status                 |
| -------------------------- | --------------------- | ---------------------- |
| [US-NNN or API or service] | Upstream / Downstream | Blocked / Ready / Done |

**Example:**

| Dependency                         | Type       | Status         |
| ---------------------------------- | ---------- | -------------- |
| US-138 — Stripe tokenization setup | Upstream   | ✅ Done        |
| US-145 — "My Payment Methods" page | Downstream | Pending        |
| Stripe Vault API access (DevOps)   | External   | ✅ Ready       |
| Design: saved card UI components   | Parallel   | 🔄 In Progress |

> [!WARNING]
> Downstream stories that depend on this one must be identified before development starts. A schema or API contract change mid-sprint can cascade and block multiple teams. Coordinate early.

---

## 🎨 UI / UX Notes

- **Mockup:** [Figma link or N/A]
- **Interaction:** [Key interaction pattern, e.g., inline edit, modal, toast]
- **Empty state:** [What the user sees with no data]
- **Loading state:** [Skeleton / spinner / optimistic UI]
- **Error state:** [How errors surface to the user]
- **Mobile:** [Any mobile-specific behavior]

**Example:**

- **Mockup:** [Figma — Checkout v2 / Saved Cards flow](https://figma.com/file/...)
- **Interaction:** Checkbox on payment step: "Save this card for future purchases." On subsequent visits, saved card is pre-selected with a radio button group.
- **Empty state:** First-time users see no saved cards section — the checkbox appears only after entering card details.
- **Loading state:** Skeleton card placeholder while saved cards load from API (< 200ms target; show skeleton only if > 100ms).
- **Error state:** Non-blocking toast for save failure (see AC-05). Blocking inline error for CVV validation failure.
- **Mobile:** Saved card selector uses a native bottom sheet on iOS/Android web; dropdown on desktop.

---

## 🔧 Technical Notes

> These are hints for engineering — not prescriptive. The team owns the implementation.

- [Relevant API endpoint or data model]
- [Performance constraint, e.g., must respond < 300ms]
- [Flag / experiment key if behind feature flag]

**Example:**

- **API:** `POST /api/v2/payment-methods` to save; `GET /api/v2/payment-methods` to list.
- **Storage:** Card data must never touch our servers — use Stripe's `PaymentMethod` object. Store only `stripe_payment_method_id` and last-4 + brand in our DB.
- **Performance:** Saved cards must load within 200ms p95. Pre-fetch on checkout page load.
- **Feature flag:** `checkout.saved_cards` — roll out to 10% of users in Sprint 24, 100% in Sprint 25.

---

## 📊 Definition of Done

- [ ] All acceptance criteria pass (manual QA sign-off)
- [ ] Unit tests written and green
- [ ] Integration tests cover the primary flow
- [ ] Code reviewed and merged
- [ ] Deployed to staging
- [ ] QA sign-off
- [ ] Analytics event firing correctly
- [ ] Accessibility check passed (keyboard nav, screen reader)
- [ ] Product owner demo accepted

> [!TIP]
> "Done" means done for users, not done for engineers. If it's not deployed and verified in staging, it's not done.

---

## 📎 Related

- **Epic:** [Link]
- **Parent PRD:** [Link]
- **Design:** [Figma link]
- **Ticket:** [Jira / Linear link]

---

## See Also

- [Product Requirements Document (PRD)](./prd.md) — For product context and requirements hierarchy
- [Feature Specification](./feature_spec.md) — For detailed engineering specs of story implementation
- [Sprint Planning](./../project/sprint_planning.md) — For scheduling stories into development iterations
- [Retrospective](./../project/retrospective.md) — For reflecting on story completion and process improvement
- [Code Review](./../software/code_review.md) — For reviewing story implementations

---

_Last updated: [Date] by [Author]_
