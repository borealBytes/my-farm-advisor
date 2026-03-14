# Example Playbook: Spring Corn — Seasonal Runbook

```yaml
id: sbw-pb-seasonal-runbook-20260314-spring-corn-a1-a4
title: "Spring Corn Planting — Fields A-1 through A-4"
type: seasonal-runbook
version: 0.1.0
authored: "2026-03-14"
context:
  farm_id: borealbytes-farm-001
  fields: [A-1, A-2, A-3, A-4]
  crops: [corn]
  season: "Spring 2026"
  location: "Baraga County, Michigan"
  total_acres: 160
```

---

## Scope

- **Fields:** A-1 (42 ac), A-2 (38 ac), A-3 (45 ac), A-4 (35 ac)
- **Crop:** Corn (hybrid TBD pending seed selection finalization)
- **Target planting window:** May 5–15, 2026
- **Target harvest:** October 1–15, 2026
- **Personnel:** Clayton Young (primary operator)

## Preconditions

- [ ] Soil temp ≥ 50°F at 4" depth (check daily after April 20)
- [ ] Frost probability < 20% for 10-day window post-planting
- [ ] Fields fit for equipment (no standing water, trafficable)
- [ ] Seed secured and on-farm
- [ ] Planter inspection complete (see equipment-checklist playbook)
- [ ] Crop insurance paperwork filed

---

## Phase 1: Field Preparation (Target: April 15–30)

**Trigger:** Soil temp ≥ 40°F at 4", frost-free probability > 70%

| Step | Action | Who | Est. Time |
|------|--------|-----|-----------|
| 1.1 | Pull soil samples: A-1 (17 samples), A-2 (16), A-3 (18), A-4 (14) | Clayton | 2 days |
| 1.2 | Submit to A&L Great Lakes Labs; request full panel + micronutrients | Clayton | 30 min |
| 1.3 | Chisel plow A-1, A-3 (compaction noted 2025); disk A-2, A-4 | Clayton | 3 days |
| 1.4 | Apply lime to A-2 (pH 5.8 per 2024 test) at 2 ton/ac | Clayton | 4 hrs |

**Exit Criteria:** All 4 fields tilled; lime applied to A-2; samples submitted.

---

## Phase 2: Planting (Target: May 5–15)

**Trigger:** Soil temp ≥ 50°F, 5-day forecast clear, fields trafficable

| Step | Action | Who | Est. Time |
|------|--------|-----|-----------|
| 2.1 | Final planter inspection & calibration | Clayton | 4 hrs |
| 2.2 | Load seed; verify variety matches field prescription | Clayton | 1 hr |
| 2.3 | Plant A-1 @ 32,000 seeds/ac; A-2 @ 30,000; A-3 @ 32,000; A-4 @ 31,000 | Clayton | 4 days |
| 2.4 | Post-plant stand check: dig 20 seeds per field | Clayton | 2 hrs |

**Exit Criteria:** All 160 ac planted, stand checks PASS.

---

## Phase 3: Establishment (May 20 – June 10)

| Step | Action | Notes |
|------|--------|-------|
| 3.1 | Stand counts at 7 DPE | Target: ≥ 90% of seeded pop |
| 3.2 | Scout for rootworm, wireworm | Threshold: 1 larva / plant |
| 3.3 | Pre-emergent herbicide (if not at planting) | Apply before 3-leaf weeds |

---

## Phase 4–7

Follow standard seasonal-runbook template phases 4–7.
See `templates/seasonal-runbook.md`.

---

## Rollback

If prevented from planting by June 1:
1. Assess prevent-plant insurance option.
2. Consider late-season soybean as alternative.
3. File updated crop insurance notice within 72 hours of decision.
