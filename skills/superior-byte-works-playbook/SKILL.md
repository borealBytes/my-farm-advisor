# Skill: superior-byte-works-playbook

## Identity

```yaml
id: superior-byte-works-playbook
name: Superior Byte Works — Playbook
vendor: Superior Byte Works LLC
version: 0.1.0
status: alpha
tags: [playbook, runbook, sop, agriculture, farm-ops, superior-byte-works]
```

## Purpose

This skill teaches the AI how to produce structured, executable playbooks
for farm operations. A **playbook** in this context is a sequenced,
condition-aware document that tells an operator (human or agent) *exactly*
what to do, when, and why — with decision branches for contingencies.

It is the operational backbone skill for my-farm-advisor: where other
skills analyze and forecast, this skill **operationalizes** those outputs
into actionable procedures.

## Core Concepts

### Playbook Anatomy

Every playbook produced by this skill follows this structure:

```
Playbook
├── header          # id, title, type, version, authored, context
├── scope           # fields, crops, equipment, date range, personnel
├── preconditions   # what must be true before execution begins
├── phases[]        # ordered list of phases
│   ├── name
│   ├── trigger     # calendar date, sensor threshold, or manual
│   ├── steps[]     # ordered action steps
│   │   ├── id
│   │   ├── action
│   │   ├── responsible_party
│   │   ├── tools_required
│   │   ├── expected_duration
│   │   ├── success_criteria
│   │   └── contingency   # what to do if step fails or condition not met
│   └── exit_criteria # what must be true to leave this phase
├── rollback        # how to safely abort mid-execution
├── references      # linked data, external docs, prior playbooks
└── changelog       # revision history
```

### Playbook Types

**seasonal-runbook**
Covers an entire growing season. Phases map to agronomic stages:
Field Prep → Planting → Establishment → Canopy Management →
Harvest Prep → Harvest → Post-Harvest → Winter Closeout.

**incident-response**
Activated by a detected or reported event (pest pressure, hail,
frost, equipment failure). Phases: Assess → Contain → Remediate
→ Monitor → Close. Each step includes severity thresholds.

**field-sop**
A single-field, single-task standard operating procedure.
Typically 1–3 phases, highly specific. Example: "Soil core
sampling protocol for Field D-7 pre-plant nitrogen assessment."

**equipment-checklist**
Pre-operation and post-operation checklists for tractors,
planters, sprayers, combines, irrigation pivots. Each item
has a pass/fail criterion and a corrective action if failed.

**crop-rotation-plan**
Multi-year, multi-field rotation logic. Phases represent
crop years. Steps include selection logic, cover crop windows,
rest periods, and economic justification notes.

## Behavioral Instructions

When asked to generate a playbook:

1. **Identify playbook type** — ask if ambiguous.
2. **Gather context** — query available farm data (fields, crops,
   history, equipment, location, date). Use my-farm-advisor
   context providers if available.
3. **Draft phases** — start with standard template for the type,
   then adapt to the specific context provided.
4. **Populate steps** — be specific. Avoid vague directives.
   Every step should have a clear action verb and measurable outcome.
5. **Add contingencies** — for every critical step, include a
   "if this fails, do X" branch.
6. **Format output** — default to Markdown. Offer YAML export
   on request for machine-readable playbooks.
7. **Version it** — every generated playbook gets a version stamp
   and creation date.

## Output Format

Default rendering is structured Markdown with clear headers,
tables for checklists, and fenced code blocks for any
configuration or data payloads.

On request, output as YAML following the schema in
`core/playbook.schema.yaml`.

## Integration Points

- **my-farm-advisor** skill → pulls field/crop/weather context
- **superior-byte-works-google-timesfm-forecasting** → embeds
  forecast windows into seasonal runbook trigger conditions
- **superior-byte-works-wrighter** → polishes playbook prose
  for stakeholder-facing versions
- **session-logs** skill → appends executed playbook runs to
  session memory for continuity

## Limitations (v0.1.0)

- No live equipment telemetry integration yet
- Crop-rotation multi-year planning limited to 3-year horizons
- No PDF export (use wrighter skill for formatted output)

## Example Invocations

```
"Generate a spring corn planting runbook for Fields A-1 through A-4"
"Create an incident response playbook for sudden aphid pressure"
"Build a pre-season sprayer inspection checklist for the John Deere R4045"
"Draft a 3-year crop rotation plan for the north section"
```
