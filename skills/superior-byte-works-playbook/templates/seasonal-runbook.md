# Template: Seasonal Runbook

Use this template as the base for `type: seasonal-runbook` playbooks.
Adapt phases to match the specific crop and regional calendar.

---

## Phase 1: Field Preparation

**Trigger:** Soil temp ≥ 40°F at 4" depth, frost-free probability > 70%

### Steps

| # | Action | Responsible | Tools | Duration | Success Criteria | Contingency |
|---|--------|-------------|-------|----------|-----------------|-------------|
| 1.1 | Pull soil samples from all target fields (1 sample / 2.5 acres) | Operator | Soil probe, sample bags, GPS | 1 day / 50 ac | All samples labeled, GPS coordinates recorded | If frozen: delay until soil workable |
| 1.2 | Submit samples to lab; specify N-P-K + micronutrient panel | Operator | Sample submission form | 30 min | Lab confirmation received | Use prior year results as interim fallback |
| 1.3 | Deep-till or chisel plow as indicated by compaction data | Operator | Chisel plow / subsoiler | 1 hr / 10 ac | Tillage depth ≥ 12", no surface compaction layer | If equipment down: contract custom tillage |
| 1.4 | Apply lime if soil pH < 6.0 (per lab rec) | Operator | Lime spreader | 1 hr / 20 ac | Application rate matches lab recommendation ± 5% | Re-test in 60 days if pH borderline |

**Exit Criteria:** All fields tilled, sampled, lime applied where needed.

---

## Phase 2: Planting

**Trigger:** Soil temp ≥ 50°F (corn) or per crop GDD model; field fit confirmed

### Steps

| # | Action | Responsible | Tools | Duration | Success Criteria | Contingency |
|---|--------|-------------|-------|----------|-----------------|-------------|
| 2.1 | Pre-plant equipment check (planter inspection checklist) | Operator | See equipment-checklist playbook | 2–4 hrs | All checklist items PASS | Do not plant until critical items resolved |
| 2.2 | Load seed; verify variety, lot, and treatment match plan | Operator | Seed manifest | 30 min | Seed identity confirmed against plan | Quarantine mismatched seed |
| 2.3 | Set planting rate and depth per field prescription | Operator | Precision planting monitor | 15 min | Population within 2% of target; depth ± 0.25" | Adjust opener pressure; re-calibrate |
| 2.4 | Plant field; record start/end time, population check rows | Operator | Planter, GPS monitor | Varies | Strip populations within ±3% of target | Pull planter for inspection if population drifts |
| 2.5 | Post-plant field walk: dig 20 seeds across field, check depth/spacing | Operator | Shovel, tape | 1 hr | ≥ 18/20 seeds at target depth and spacing | Re-plant affected strips if > 10% deviation |

**Exit Criteria:** All target fields planted, population verified, records filed.

---

## Phase 3: Establishment & Early Season

**Trigger:** 7 days post-plant

### Steps

| # | Action | Responsible | Tools | Duration | Success Criteria | Contingency |
|---|--------|-------------|-------|----------|-----------------|-------------|
| 3.1 | Stand count: count plants in 3 × 1/1000-acre segments per field | Operator | Tape, tally | 2 hrs | Stand ≥ 90% of target population | Assess replant economics if stand < 80% |
| 3.2 | Scout for pest/disease pressure (rootworm, wireworm, damping-off) | Operator | Scouting forms | 1 hr/field | No threshold exceedances | Trigger incident-response playbook if threshold exceeded |
| 3.3 | Apply pre-emergent herbicide if not applied at planting | Operator | Sprayer | 1 hr / 40 ac | Full coverage, no skips; sprayer calibrated | Delay if rain forecast within 2 hrs |

**Exit Criteria:** Stand established ≥ 90%, no active pest/disease incidents.

---

## Phase 4: Canopy Management

**Trigger:** V4–V6 crop stage

### Steps

| # | Action | Responsible | Tools | Duration | Success Criteria | Contingency |
|---|--------|-------------|-------|----------|-----------------|-------------|
| 4.1 | Post-emergent herbicide application per weed pressure scouting | Operator | Sprayer, GPS | 1 hr / 40 ac | Weed control ≥ 90% within 7 days | Re-apply or spot-treat escapes |
| 4.2 | Side-dress nitrogen per in-season PSNT or Presidedress Soil Nitrate Test | Operator | Applicator, soil test kit | 1 day | N applied ± 5% of recommendation | Adjust rate if heavy rainfall event since pre-plant |
| 4.3 | Mid-season field walk: disease, nutrient deficiency, lodging risk | Operator | Scouting forms | 1 hr/field | No threshold exceedances | Trigger incident-response if needed |

**Exit Criteria:** All fertility and weed management applied; no active incidents.

---

## Phase 5: Harvest Preparation

**Trigger:** 21 days before target harvest date or moisture ≤ 25%

### Steps

| # | Action | Responsible | Tools | Duration | Success Criteria | Contingency |
|---|--------|-------------|-------|----------|-----------------|-------------|
| 5.1 | Combine and grain cart inspection (see equipment-checklist playbook) | Operator | Inspection checklist | 4–8 hrs | All items PASS | Schedule repairs; do not harvest until resolved |
| 5.2 | Verify grain bin capacity and drying system readiness | Operator | Bin inventory | 1 hr | Sufficient capacity for projected yield | Arrange additional storage or direct delivery |
| 5.3 | Sample grain moisture at 5 locations per field; target < 25% | Operator | Moisture meter | 1 hr | Uniform moisture reading across field | Delay harvest if > 28%; re-sample in 5 days |

**Exit Criteria:** Equipment ready, storage confirmed, moisture at target.

---

## Phase 6: Harvest

**Trigger:** Grain moisture ≤ target, field conditions trafficable

### Steps

| # | Action | Responsible | Tools | Duration | Success Criteria | Contingency |
|---|--------|-------------|-------|----------|-----------------|-------------|
| 6.1 | Harvest field; log: start time, end time, load tickets, field yield by GPS zone | Operator | Combine, yield monitor | Varies | Yield monitor active; all loads ticketed | Manual yield estimate if monitor fails |
| 6.2 | Check and adjust combine settings every 2 hours (loss monitor) | Operator | Loss monitor, combine manual | 15 min | Harvest loss ≤ 1% | Adjust concave clearance, fan speed, rotor speed |
| 6.3 | Sample harvested grain: moisture, test weight | Operator | Moisture meter, scale | 30 min / load | Moisture ≤ 15.5% for storage; test weight ≥ 56 lb/bu (corn) | Dry grain immediately if moisture > 15.5% |

**Exit Criteria:** All fields harvested, grain in storage or delivered, yield data recorded.

---

## Phase 7: Post-Harvest & Winter Closeout

**Trigger:** All fields harvested

### Steps

| # | Action | Responsible | Tools | Duration | Success Criteria | Contingency |
|---|--------|-------------|-------|----------|-----------------|-------------|
| 7.1 | Apply fall herbicide or cover crop seed as planned | Operator | Sprayer / seeder | 1 day | Full coverage; seeder calibration verified | Delay if ground conditions poor |
| 7.2 | Fall soil sampling (every 3 years, or if yield anomaly noted) | Operator | Soil probe | 1 day | All target fields sampled | Defer to spring if frozen |
| 7.3 | Equipment winterization: drain water, change fluids, grease all points | Operator | Equipment manual, grease gun | 1 day / machine | All items per equipment winterization checklist | Log any deferred maintenance for spring |
| 7.4 | Season debrief: document yield anomalies, input costs, lessons learned | Operator | Yield maps, records | 2 hrs | Summary document filed in farm records | — |

**Exit Criteria:** Equipment stored, fields closed, records complete.

---

## Rollback

If this playbook must be aborted mid-season:
1. Document current phase and last completed step.
2. Assess crop viability; consult with agronomist if uncertain.
3. File partial-season incident report.
4. Carry forward incomplete items as next-season preconditions.
